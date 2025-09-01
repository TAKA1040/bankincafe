-- 3段階連動テーブル追加：対象×動作×位置の組み合わせ管理
-- 段階的絞り込みの精度向上のため
-- 作成日: 2025-08-29

-- =====================================
-- target_action_positions テーブル作成
-- =====================================

CREATE TABLE IF NOT EXISTS target_action_positions (
  id SERIAL PRIMARY KEY,
  target_id INTEGER NOT NULL REFERENCES targets(id) ON DELETE CASCADE,
  action_id INTEGER NOT NULL REFERENCES actions(id) ON DELETE CASCADE,
  position_id INTEGER REFERENCES positions(id) ON DELETE CASCADE, -- NULL許可
  usage_count INTEGER DEFAULT 1, -- 使用頻度（学習用）
  is_recommended BOOLEAN DEFAULT true, -- 推奨組み合わせかどうか
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(target_id, action_id, position_id)
);

-- インデックス作成
CREATE INDEX idx_target_action_positions_target ON target_action_positions(target_id);
CREATE INDEX idx_target_action_positions_action ON target_action_positions(action_id);
CREATE INDEX idx_target_action_positions_position ON target_action_positions(position_id);
CREATE INDEX idx_target_action_positions_recommended ON target_action_positions(is_recommended) WHERE is_recommended = true;

-- =====================================
-- 実績データから初期データ生成
-- =====================================

-- work_historyから実際の組み合わせを抽出して登録
INSERT INTO target_action_positions (target_id, action_id, position_id, usage_count, is_recommended)
SELECT 
  wh.target_id,
  wh.action_id,
  wh.position_id,
  COUNT(*) as usage_count,
  CASE WHEN COUNT(*) >= 2 THEN true ELSE false END as is_recommended
FROM work_history wh
WHERE wh.target_id IS NOT NULL 
  AND wh.action_id IS NOT NULL
GROUP BY wh.target_id, wh.action_id, wh.position_id
ON CONFLICT (target_id, action_id, position_id) DO UPDATE SET
  usage_count = target_action_positions.usage_count + EXCLUDED.usage_count,
  is_recommended = CASE 
    WHEN target_action_positions.usage_count + EXCLUDED.usage_count >= 2 
    THEN true 
    ELSE target_action_positions.is_recommended 
  END;

-- =====================================
-- 追加の現実的な組み合わせを手動登録
-- =====================================

-- タイヤ関連の現実的な組み合わせ
INSERT INTO target_action_positions (target_id, action_id, position_id, usage_count, is_recommended)
SELECT t.id, a.id, p.id, 3, true
FROM targets t, actions a, positions p
WHERE (t.name, a.name, p.name) IN (
  -- タイヤ交換は4輪個別
  ('タイヤ', '交換', '右前'),
  ('タイヤ', '交換', '左前'),
  ('タイヤ', '交換', '右後'),
  ('タイヤ', '交換', '左後'),
  -- タイヤ点検は左右まとめて
  ('タイヤ', '点検', '左右'),
  ('タイヤ', '点検', '前後'),
  -- タイヤ調整も左右まとめて
  ('タイヤ', '調整', '左右'),
  
  -- バンパーは前後のみ（左右はない）
  ('バンパー', '修理', NULL), -- 指定なし
  ('バンパー', '塗装', NULL), -- 指定なし
  ('フロントバンパー', '修理', NULL),
  ('リアバンパー', '修理', NULL),
  
  -- ライトは左右個別が基本
  ('ライト', '交換', '右'),
  ('ライト', '交換', '左'),
  ('ヘッドライト', '交換', '右'),
  ('ヘッドライト', '交換', '左'),
  ('ヘッドライト', '調整', '右'),
  ('ヘッドライト', '調整', '左'),
  ('ヘッドライト', '調整', '左右'),
  
  -- エンジン系は位置指定なし
  ('エンジンオイル', '交換', NULL),
  ('ATF', '交換', NULL),
  ('LLC', '交換', NULL),
  ('バッテリー', '交換', NULL),
  
  -- ブレーキ系は左右個別
  ('ブレーキパッド', '交換', '右前'),
  ('ブレーキパッド', '交換', '左前'),
  ('ブレーキパッド', '交換', '右後'),
  ('ブレーキパッド', '交換', '左後'),
  ('ブレーキディスク', '研磨', '左右')
)
ON CONFLICT (target_id, action_id, position_id) DO UPDATE SET
  usage_count = target_action_positions.usage_count + 1,
  is_recommended = true;

-- =====================================
-- 段階的絞り込み用ビュー作成
-- =====================================

-- 対象選択時の動作絞り込みビュー（既存のtarget_actionsベース）
CREATE OR REPLACE VIEW available_actions_by_target AS
SELECT DISTINCT
  t.id as target_id,
  t.name as target_name,
  a.id as action_id,
  a.name as action_name,
  a.sort_order
FROM targets t
JOIN target_actions ta ON t.id = ta.target_id
JOIN actions a ON ta.action_id = a.id
WHERE t.is_active = true AND a.is_active = true
ORDER BY t.name, a.sort_order;

-- 対象×動作選択時の位置絞り込みビュー（新しい3段階テーブルベース）
CREATE OR REPLACE VIEW available_positions_by_target_action AS
SELECT DISTINCT
  t.id as target_id,
  t.name as target_name,
  a.id as action_id,
  a.name as action_name,
  p.id as position_id,
  COALESCE(p.name, '（指定なし）') as position_name,
  COALESCE(p.sort_order, 999) as position_sort_order,
  tap.usage_count,
  tap.is_recommended
FROM targets t
JOIN target_action_positions tap ON t.id = tap.target_id
JOIN actions a ON tap.action_id = a.id
LEFT JOIN positions p ON tap.position_id = p.id
WHERE t.is_active = true 
  AND a.is_active = true 
  AND (p.is_active = true OR p.id IS NULL)
ORDER BY t.name, a.name, position_sort_order;

-- =====================================
-- 動的絞り込みクエリのサンプル
-- =====================================

-- Step 1: 対象選択時の動作取得
-- SELECT * FROM available_actions_by_target WHERE target_name = 'タイヤ';

-- Step 2: 対象×動作選択時の位置取得  
-- SELECT * FROM available_positions_by_target_action 
-- WHERE target_name = 'タイヤ' AND action_name = '交換';

-- =====================================
-- updated_at自動更新トリガー
-- =====================================

DROP TRIGGER IF EXISTS trg_target_action_positions_updated ON target_action_positions;
CREATE TRIGGER trg_target_action_positions_updated 
BEFORE UPDATE ON target_action_positions
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =====================================
-- 登録結果確認
-- =====================================

DO $$
DECLARE
    tap_count INTEGER;
    recommended_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO tap_count FROM target_action_positions;
    SELECT COUNT(*) INTO recommended_count FROM target_action_positions WHERE is_recommended = true;
    
    RAISE NOTICE '=== target_action_positions テーブル作成完了 ===';
    RAISE NOTICE '総組み合わせ数: % 件', tap_count;
    RAISE NOTICE '推奨組み合わせ: % 件', recommended_count;
    RAISE NOTICE '===============================================';
END$$;

-- コメント追加
COMMENT ON TABLE target_action_positions IS '対象×動作×位置の3段階連動組み合わせ管理';
COMMENT ON COLUMN target_action_positions.usage_count IS '使用頻度（学習・ランキング用）';
COMMENT ON COLUMN target_action_positions.is_recommended IS '推奨組み合わせフラグ';

SELECT '3段階連動テーブル作成完了！段階的絞り込み精度が向上しました。' as result;