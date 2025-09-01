-- べき等な取り込み手順（ChatGPT改訂版 + Claude Code完全版）
-- PostgreSQL安全対応 + reading_mappings + work_history + work_sets対応
-- 作成日: 2025-08-29

-- =====================================
-- 前提条件確認
-- =====================================

-- 正規化列と制約が存在することを確認
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'targets' AND column_name = 'name_norm'
  ) THEN
    RAISE EXCEPTION '事前に003_normalized_constraints.sqlを実行してください';
  END IF;
END$$;

-- =====================================
-- ステージング表作成（べき等）
-- =====================================

-- 基本マスター用
CREATE TABLE IF NOT EXISTS staging_targets(name text);
CREATE TABLE IF NOT EXISTS staging_actions(name text);
CREATE TABLE IF NOT EXISTS staging_positions(name text);

-- 関連テーブル用
CREATE TABLE IF NOT EXISTS staging_target_actions(target_name text, action_name text);
CREATE TABLE IF NOT EXISTS staging_action_positions(action_name text, position_name text);

-- 読み仮名用
CREATE TABLE IF NOT EXISTS staging_reading_mappings(
  word text,
  reading_hiragana text,
  reading_katakana text,
  word_type text,
  normalized text
);

-- 作業データ用
CREATE TABLE IF NOT EXISTS staging_work_history(
  target_name text,
  action_name text,
  position_name text,
  memo text,
  unit_price numeric,
  quantity int,
  raw_label text,
  task_type text
);

-- セット作業用
CREATE TABLE IF NOT EXISTS staging_work_sets(
  set_name text,
  unit_price numeric,
  quantity int
);

CREATE TABLE IF NOT EXISTS staging_work_set_details(
  set_name text,
  target_name text,
  action_name text,
  position_name text,
  memo text,
  sort_order int
);

-- =====================================
-- 取り込み準備（既存データクリア）
-- =====================================

-- ステージング表をクリア（べき等実行対応）
TRUNCATE staging_targets, staging_actions, staging_positions;
TRUNCATE staging_target_actions, staging_action_positions;
TRUNCATE staging_reading_mappings;
TRUNCATE staging_work_history, staging_work_sets, staging_work_set_details;

-- =====================================
-- CSV取り込み（ファイルパス要調整）
-- =====================================

-- 基本マスター
-- \copy staging_targets(name) FROM 'targets.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- \copy staging_actions(name) FROM 'actions.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- \copy staging_positions(name) FROM 'positions.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');

-- 関連性
-- \copy staging_target_actions FROM 'target_actions.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- \copy staging_action_positions FROM 'action_positions.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');

-- 読み仮名（オプション）
-- \copy staging_reading_mappings FROM 'reading_mappings.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');

-- 作業データ（テスト用）
-- \copy staging_work_history FROM 'work_history.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- \copy staging_work_sets FROM 'work_sets.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- \copy staging_work_set_details FROM 'work_set_details.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');

-- =====================================
-- 実際データ投入（既存karidata使用）
-- =====================================

-- 既存実データから基本マスターを抽出投入
INSERT INTO staging_targets(name)
SELECT DISTINCT target_name 
FROM (VALUES
  ('タイヤ'), ('ホイール'), ('ライト'), ('コーナーパネル'), 
  ('フラッシャー'), ('バンパー'), ('ライニング'), ('スプリングシート')
) AS base(target_name);

INSERT INTO staging_actions(name)
SELECT DISTINCT action_name
FROM (VALUES
  ('交換'), ('脱着'), ('取付'), ('修理'), ('調整'), ('点検'),
  ('清掃'), ('溶接'), ('張替'), ('入替'), ('塗装'), ('ASSY')
) AS base(action_name);

INSERT INTO staging_positions(name)
SELECT DISTINCT position_name
FROM (VALUES
  ('右'), ('左'), ('前'), ('後'), ('右前'), ('左前'), 
  ('右後'), ('左後'), ('左右'), ('前後')
) AS base(position_name);

-- 基本的な関連性を投入（プロトタイプより）
INSERT INTO staging_target_actions(target_name, action_name)
VALUES
  -- タイヤ
  ('タイヤ', '交換'), ('タイヤ', '脱着'), ('タイヤ', '点検'), ('タイヤ', '調整'),
  -- ホイール
  ('ホイール', '脱着'), ('ホイール', '取付'), ('ホイール', '清掃'),
  -- ライト
  ('ライト', '交換'), ('ライト', '取付'), ('ライト', '調整'), ('ライト', '点検'), ('ライト', '清掃'),
  -- コーナーパネル
  ('コーナーパネル', '脱着'), ('コーナーパネル', '修理'), ('コーナーパネル', '塗装'),
  -- フラッシャー
  ('フラッシャー', '取付'), ('フラッシャー', '交換'), ('フラッシャー', '点検'),
  -- バンパー
  ('バンパー', '修理'), ('バンパー', '塗装'), ('バンパー', '脱着'), ('バンパー', '点検'),
  -- ライニング
  ('ライニング', '張替'), ('ライニング', '修理'), ('ライニング', '点検'),
  -- スプリングシート
  ('スプリングシート', '溶接'), ('スプリングシート', '修理');

-- 動作と位置の関連性
INSERT INTO staging_action_positions(action_name, position_name)
VALUES
  -- 交換
  ('交換', '右'), ('交換', '左'), ('交換', '前'), ('交換', '後'),
  ('交換', '右前'), ('交換', '左前'), ('交換', '右後'), ('交換', '左後'),
  -- 修理
  ('修理', '右'), ('修理', '左'), ('修理', '前'), ('修理', '後'),
  ('修理', '右前'), ('修理', '左前'), ('修理', '右後'), ('修理', '左後'),
  -- 脱着
  ('脱着', '右'), ('脱着', '左'), ('前'), ('脱着', '後'),
  ('脱着', '右前'), ('脱着', '左前'), ('脱着', '右後'), ('脱着', '左後'),
  -- 点検
  ('点検', '右'), ('点検', '左'), ('点検', '前'), ('点検', '後'),
  ('点検', '左右'), ('点検', '前後'),
  -- 取付
  ('取付', '右'), ('取付', '左'), ('取付', '前'), ('取付', '後'),
  ('取付', '右前'), ('取付', '左前'), ('取付', '右後'), ('取付', '左後'),
  -- 調整
  ('調整', '右'), ('調整', '左'), ('調整', '前'), ('調整', '後'), ('調整', '左右'),
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
  ('ASSY', '右'), ('ASSY', '左'), ('ASSY', '前'), ('ASSY', '後');

-- =====================================
-- トランザクション開始（べき等UPSERT）
-- =====================================

BEGIN;

-- 1) マスタUPSERT（ChatGPT改訂版準拠）
INSERT INTO targets(name)
SELECT DISTINCT btrim(name)
FROM staging_targets
WHERE COALESCE(btrim(name),'') <> ''
ON CONFLICT (name_norm) DO NOTHING;

INSERT INTO actions(name)
SELECT DISTINCT btrim(name)
FROM staging_actions
WHERE COALESCE(btrim(name),'') <> ''
ON CONFLICT (name_norm) DO NOTHING;

-- 「（指定なし）」はpositionsに入れない（NULL運用）
INSERT INTO positions(name)
SELECT DISTINCT btrim(name)
FROM staging_positions
WHERE COALESCE(btrim(name),'') <> ''
  AND btrim(name) <> '（指定なし）'
ON CONFLICT (name_norm) DO NOTHING;

-- 2) 関連UPSERT（名前→ID解決は正規化して突き合わせ）
INSERT INTO target_actions(target_id, action_id)
SELECT t.id, a.id
FROM (
  SELECT DISTINCT btrim(target_name) AS target_name, btrim(action_name) AS action_name
  FROM staging_target_actions
  WHERE COALESCE(btrim(target_name),'')<>'' AND COALESCE(btrim(action_name),'')<>''
) s
JOIN targets t ON t.name_norm = lower(s.target_name)
JOIN actions a ON a.name_norm = lower(s.action_name)
ON CONFLICT (target_id, action_id) DO NOTHING;

INSERT INTO action_positions(action_id, position_id)
SELECT a.id, p.id
FROM (
  SELECT DISTINCT btrim(action_name) AS action_name,
         NULLIF(btrim(position_name),'') AS position_name
  FROM staging_action_positions
) s
JOIN actions a ON a.name_norm = lower(s.action_name)
LEFT JOIN positions p ON p.name_norm = lower(s.position_name)
WHERE s.position_name IS NOT NULL              -- 「（指定なし）」や空はNULL扱いで関連作らない
  AND s.position_name <> '（指定なし）'
ON CONFLICT (action_id, position_id) DO NOTHING;

-- 3) 読み仮名データ（オプション）
INSERT INTO reading_mappings(word, reading_hiragana, reading_katakana, word_type, normalized)
SELECT DISTINCT
  btrim(word),
  COALESCE(btrim(reading_hiragana), ''),
  COALESCE(btrim(reading_katakana), ''),
  btrim(word_type),
  COALESCE(btrim(normalized), btrim(word))
FROM staging_reading_mappings
WHERE COALESCE(btrim(word),'') <> ''
  AND btrim(word_type) IN ('target', 'action', 'position')
ON CONFLICT (word, word_type) DO UPDATE SET
  reading_hiragana = EXCLUDED.reading_hiragana,
  reading_katakana = EXCLUDED.reading_katakana,
  normalized = EXCLUDED.normalized;

-- 4) 作業履歴データ（テスト用）
-- 既存テストデータを削除
DELETE FROM work_history WHERE memo LIKE '%テスト%' OR raw_label LIKE '%テスト%';

INSERT INTO work_history(target_id, action_id, position_id, memo, unit_price, quantity, raw_label, task_type)
SELECT 
  t.id as target_id,
  a.id as action_id,
  p.id as position_id,
  COALESCE(btrim(s.memo), ''),
  COALESCE(s.unit_price, 0),
  COALESCE(s.quantity, 1),
  NULLIF(btrim(s.raw_label), ''),
  COALESCE(btrim(s.task_type), 'structured')
FROM staging_work_history s
LEFT JOIN targets t ON t.name_norm = lower(btrim(NULLIF(s.target_name, '')))
LEFT JOIN actions a ON a.name_norm = lower(btrim(NULLIF(s.action_name, '')))
LEFT JOIN positions p ON p.name_norm = lower(btrim(NULLIF(NULLIF(s.position_name, ''), '（指定なし）')))
WHERE COALESCE(btrim(s.target_name), '') <> ''
  OR COALESCE(btrim(s.action_name), '') <> '';

-- 5) セット作業データ（テスト用）
-- 既存テストデータを削除
DELETE FROM work_set_details WHERE work_set_id IN (
  SELECT id FROM work_sets WHERE set_name LIKE '%セット%' OR set_name LIKE '%一式%'
);
DELETE FROM work_sets WHERE set_name LIKE '%セット%' OR set_name LIKE '%一式%';

INSERT INTO work_sets(set_name, unit_price, quantity)
SELECT 
  btrim(set_name),
  COALESCE(unit_price, 0),
  COALESCE(quantity, 1)
FROM staging_work_sets
WHERE COALESCE(btrim(set_name), '') <> '';

INSERT INTO work_set_details(work_set_id, target_id, action_id, position_id, memo, sort_order)
SELECT 
  ws.id as work_set_id,
  t.id as target_id,
  a.id as action_id,
  p.id as position_id,
  COALESCE(btrim(s.memo), ''),
  COALESCE(s.sort_order, 0)
FROM staging_work_set_details s
JOIN work_sets ws ON ws.set_name = btrim(s.set_name)
LEFT JOIN targets t ON t.name_norm = lower(btrim(NULLIF(s.target_name, '')))
LEFT JOIN actions a ON a.name_norm = lower(btrim(NULLIF(s.action_name, '')))
LEFT JOIN positions p ON p.name_norm = lower(btrim(NULLIF(NULLIF(s.position_name, ''), '（指定なし）')))
WHERE COALESCE(btrim(s.set_name), '') <> '';

COMMIT;

-- =====================================
-- 投入結果確認
-- =====================================

DO $$
DECLARE
    target_count INTEGER;
    action_count INTEGER;
    position_count INTEGER;
    target_action_count INTEGER;
    action_position_count INTEGER;
    reading_count INTEGER;
    history_count INTEGER;
    set_count INTEGER;
    set_detail_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO target_count FROM targets;
    SELECT COUNT(*) INTO action_count FROM actions;
    SELECT COUNT(*) INTO position_count FROM positions;
    SELECT COUNT(*) INTO target_action_count FROM target_actions;
    SELECT COUNT(*) INTO action_position_count FROM action_positions;
    SELECT COUNT(*) INTO reading_count FROM reading_mappings;
    SELECT COUNT(*) INTO history_count FROM work_history;
    SELECT COUNT(*) INTO set_count FROM work_sets;
    SELECT COUNT(*) INTO set_detail_count FROM work_set_details;
    
    RAISE NOTICE '=== べき等シードデータ投入完了 ===';
    RAISE NOTICE 'targets: % 件', target_count;
    RAISE NOTICE 'actions: % 件', action_count;
    RAISE NOTICE 'positions: % 件', position_count;
    RAISE NOTICE 'target_actions: % 件', target_action_count;
    RAISE NOTICE 'action_positions: % 件', action_position_count;
    RAISE NOTICE 'reading_mappings: % 件', reading_count;
    RAISE NOTICE 'work_history: % 件', history_count;
    RAISE NOTICE 'work_sets: % 件', set_count;
    RAISE NOTICE 'work_set_details: % 件', set_detail_count;
    RAISE NOTICE '====================================';
END$$;

-- position_id NULL対応確認
SELECT 'position_id NULL対応確認:' as test;
SELECT 
  target_name,
  action_name,
  position_name, -- NULLの場合「（指定なし）」と表示されるはず
  COUNT(*) as count
FROM work_history_view
WHERE position_name = '（指定なし）'
GROUP BY target_name, action_name, position_name
LIMIT 5;

-- 関連性確認
SELECT 'target_actions関連性確認:' as test;
SELECT 
  t.name as target_name,
  COUNT(ta.action_id) as action_count
FROM targets t
LEFT JOIN target_actions ta ON t.id = ta.target_id
GROUP BY t.id, t.name
ORDER BY t.name;

-- （任意）ステージング掃除
TRUNCATE staging_targets, staging_actions, staging_positions;
TRUNCATE staging_target_actions, staging_action_positions;
TRUNCATE staging_reading_mappings;
TRUNCATE staging_work_history, staging_work_sets, staging_work_set_details;

SELECT 'べき等シードデータ投入完全版 - 実行完了!' as result;