-- 初期データ投入スクリプト
-- プロトタイプで使用中のマスターデータを正規化してDB投入
-- 作成日: 2025-08-29

-- =====================================
-- 1. マスターデータ投入
-- =====================================

-- 対象マスター投入
INSERT INTO targets (name, sort_order) VALUES
('タイヤ', 1),
('ホイール', 2),
('ライト', 3),
('コーナーパネル', 4),
('フラッシャー', 5),
('バンパー', 6),
('ライニング', 7),
('スプリングシート', 8)
ON CONFLICT (lower(name)) DO NOTHING;

-- 動作マスター投入（「（指定なし）」は除外）
INSERT INTO actions (name, sort_order) VALUES
('交換', 1),
('脱着', 2),
('取付', 3),
('修理', 4),
('調整', 5),
('点検', 6),
('清掃', 7),
('溶接', 8),
('張替', 9),
('入替', 10),
('塗装', 11),
('ASSY', 12)
ON CONFLICT (lower(name)) DO NOTHING;

-- 位置マスター投入
INSERT INTO positions (name, sort_order) VALUES
('右', 1),
('左', 2),
('前', 3),
('後', 4),
('右前', 5),
('左前', 6),
('右後', 7),
('左後', 8),
('左右', 9),
('前後', 10)
ON CONFLICT (lower(name)) DO NOTHING;

-- =====================================
-- 2. 読み仮名マッピング投入
-- =====================================

-- プロトタイプのREADING_MAPから読み仮名を投入
INSERT INTO reading_mappings (word, reading_hiragana, reading_katakana, word_type, normalized) VALUES
-- 動作の読み仮名
('交換', 'こうかん', 'コウカン', 'action', '交換'),
('修理', 'しゅうり', 'シュウリ', 'action', '修理'),
('脱着', 'だっちゃく', 'ダッチャク', 'action', '脱着'),
('点検', 'てんけん', 'テンケン', 'action', '点検'),
('取付', 'とりつけ', 'トリツケ', 'action', '取付'),
('清掃', 'せいそう', 'セイソウ', 'action', '清掃'),
('調整', 'ちょうせい', 'チョウセイ', 'action', '調整'),
('塗装', 'とそう', 'トソウ', 'action', '塗装'),
('張替', 'はりかえ', 'ハリカエ', 'action', '張替'),
('溶接', 'ようせつ', 'ヨウセツ', 'action', '溶接'),
('入替', 'いれかえ', 'イレカエ', 'action', '入替'),
-- 位置の読み仮名
('右', 'みぎ', 'ミギ', 'position', '右'),
('左', 'ひだり', 'ヒダリ', 'position', '左'),
('前', 'まえ', 'マエ', 'position', '前'),
('後', 'うしろ', 'ウシロ', 'position', '後'),
('右前', 'みぎまえ', 'ミギマエ', 'position', '右前'),
('左前', 'ひだりまえ', 'ヒダリマエ', 'position', '左前'),
('右後', 'みぎうしろ', 'ミギウシロ', 'position', '右後'),
('左後', 'ひだりうしろ', 'ヒダリウシロ', 'position', '左後'),
('左右', 'さゆう', 'サユウ', 'position', '左右'),
('前後', 'ぜんご', 'ゼンゴ', 'position', '前後')
ON CONFLICT (word, word_type) DO NOTHING;

-- =====================================
-- 3. 関連性データ投入
-- =====================================

-- 対象→動作の関連性（プロトタイプのTARGET_ACTIONSマッピングから）
INSERT INTO target_actions (target_id, action_id)
SELECT t.id, a.id FROM targets t, actions a
WHERE (t.name, a.name) IN (
  -- タイヤ
  ('タイヤ', '交換'),
  ('タイヤ', '脱着'),
  ('タイヤ', '点検'),
  -- ホイール
  ('ホイール', '脱着'),
  ('ホイール', '取付'),
  ('ホイール', '清掃'),
  -- ライト
  ('ライト', '交換'),
  ('ライト', '取付'),
  ('ライト', '調整'),
  -- コーナーパネル
  ('コーナーパネル', '脱着'),
  ('コーナーパネル', '修理'),
  ('コーナーパネル', '塗装'),
  -- フラッシャー
  ('フラッシャー', '取付'),
  ('フラッシャー', '交換'),
  -- バンパー
  ('バンパー', '修理'),
  ('バンパー', '塗装'),
  ('バンパー', '脱着'),
  -- ライニング
  ('ライニング', '張替'),
  ('ライニング', '修理'),
  -- スプリングシート
  ('スプリングシート', '溶接'),
  ('スプリングシート', '修理')
)
ON CONFLICT (target_id, action_id) DO NOTHING;

-- 動作→位置の関連性（プロトタイプのACTION_POSITIONSマッピングから）
INSERT INTO action_positions (action_id, position_id)
SELECT a.id, p.id FROM actions a, positions p
WHERE (a.name, p.name) IN (
  -- 交換
  ('交換', '右'), ('交換', '左'), ('交換', '前'), ('交換', '後'),
  ('交換', '右前'), ('交換', '左前'), ('交換', '右後'), ('交換', '左後'),
  -- 修理
  ('修理', '右'), ('修理', '左'), ('修理', '前'), ('修理', '後'),
  ('修理', '右前'), ('修理', '左前'), ('修理', '右後'), ('修理', '左後'),
  -- 脱着
  ('脱着', '右'), ('脱着', '左'), ('脱着', '前'), ('脱着', '後'),
  ('脱着', '右前'), ('脱着', '左前'), ('脱着', '右後'), ('脱着', '左後'),
  -- 点検
  ('点検', '右'), ('点検', '左'), ('点検', '前'), ('点検', '後'),
  ('点検', '左右'), ('点検', '前後'),
  -- 取付
  ('取付', '右'), ('取付', '左'), ('取付', '前'), ('取付', '後'),
  ('取付', '右前'), ('取付', '左前'), ('取付', '右後'), ('取付', '左後'),
  -- 調整
  ('調整', '右'), ('調整', '左'), ('調整', '前'), ('調整', '後'),
  -- 清掃
  ('清掃', '右'), ('清掃', '左'), ('清掃', '前'), ('清掃', '後'),
  ('清掃', '左右'), ('清掃', '前後'),
  -- 塗装
  ('塗装', '右'), ('塗装', '左'), ('塗装', '前'), ('塗装', '後'),
  ('塗装', '右前'), ('塗装', '左前'), ('塗装', '右後'), ('塗装', '左後'),
  -- 張替
  ('張替', '右'), ('張替', '左'), ('張替', '前'), ('張替', '後'),
  -- 溶接
  ('溶接', '右'), ('溶接', '左'), ('溶接', '前'), ('溶接', '後'),
  ('溶接', '右前'), ('溶接', '左前'), ('溶接', '右後'), ('溶接', '左後'),
  -- 入替
  ('入替', '右'), ('入替', '左'), ('入替', '前'), ('入替', '後'),
  -- ASSY
  ('ASSY', '右'), ('ASSY', '左'), ('ASSY', '前'), ('ASSY', '後')
)
ON CONFLICT (action_id, position_id) DO NOTHING;

-- =====================================
-- 4. 価格提案データ投入
-- =====================================

-- プロトタイプのPRICEBOOKから価格提案データ投入
INSERT INTO price_suggestions (target_id, action_id, suggested_price, usage_count, last_used_at)
SELECT t.id, a.id, 
  CASE 
    WHEN t.name = 'タイヤ' AND a.name = '交換' THEN 5500
    WHEN t.name = 'ホイール' AND a.name = '脱着' THEN 3000
    WHEN t.name = 'コーナーパネル' AND a.name = '脱着' THEN 8000
    WHEN t.name = 'フラッシャー' AND a.name = '取付' THEN 4500
    WHEN t.name = 'バンパー' AND a.name = '修理' THEN 12000
    WHEN t.name = 'ライニング' AND a.name = '張替' THEN 9000
    WHEN t.name = 'スプリングシート' AND a.name = '溶接' THEN 15000
    ELSE 0
  END as price,
  5, -- 使用回数のダミー値
  now() - INTERVAL '7 days' -- 1週間前に使用されたことにする
FROM targets t, actions a
WHERE (t.name, a.name) IN (
  ('タイヤ', '交換'),
  ('ホイール', '脱着'),
  ('コーナーパネル', '脱着'),
  ('フラッシャー', '取付'),
  ('バンパー', '修理'),
  ('ライニング', '張替'),
  ('スプリングシート', '溶接')
)
ON CONFLICT (target_id, action_id) DO NOTHING;

-- =====================================
-- 5. デフォルトユーザー設定投入
-- =====================================

-- デフォルトユーザー設定
INSERT INTO user_preferences (user_id, preference_key, preference_value) VALUES
(1, 'input_assist_mode', 'modal'),           -- モーダル表示
(1, 'default_tab', 'individual'),            -- 個別作業タブをデフォルト
(1, 'auto_suggest', 'true'),                 -- 自動サジェスト有効
(1, 'show_reading_hints', 'true'),           -- 読み仮名ヒント表示
(1, 'price_suggestion_enabled', 'false')     -- 価格提案無効（work-search完成まで）
ON CONFLICT (user_id, preference_key) DO NOTHING;

-- =====================================
-- 6. 初期化完了確認
-- =====================================

-- データ投入状況確認
DO $$
DECLARE
    target_count INTEGER;
    action_count INTEGER;
    position_count INTEGER;
    target_action_count INTEGER;
    action_position_count INTEGER;
    reading_count INTEGER;
    price_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO target_count FROM targets;
    SELECT COUNT(*) INTO action_count FROM actions;
    SELECT COUNT(*) INTO position_count FROM positions;
    SELECT COUNT(*) INTO target_action_count FROM target_actions;
    SELECT COUNT(*) INTO action_position_count FROM action_positions;
    SELECT COUNT(*) INTO reading_count FROM reading_mappings;
    SELECT COUNT(*) INTO price_count FROM price_suggestions;
    
    RAISE NOTICE '=== 初期データ投入完了 ===';
    RAISE NOTICE 'targets: % 件', target_count;
    RAISE NOTICE 'actions: % 件', action_count;
    RAISE NOTICE 'positions: % 件', position_count;
    RAISE NOTICE 'target_actions: % 件', target_action_count;
    RAISE NOTICE 'action_positions: % 件', action_position_count;
    RAISE NOTICE 'reading_mappings: % 件', reading_count;
    RAISE NOTICE 'price_suggestions: % 件', price_count;
    RAISE NOTICE '=========================';
END$$;

-- 初期データ投入完了
SELECT 'Initial data seeding completed successfully!' as result;