-- CSVから3段階連動データ投入SQL
-- target_action_positions.csv を使用した真の3段階絞り込み実装
-- 作成日: 2025-08-29

-- =====================================
-- 前提確認
-- =====================================

-- target_action_positions テーブルが存在することを確認
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'target_action_positions'
  ) THEN
    RAISE EXCEPTION 'target_action_positions テーブルが存在しません。先に004_target_action_positions.sqlを実行してください。';
  END IF;
END$$;

-- =====================================
-- ステージングテーブル準備
-- =====================================

CREATE TABLE IF NOT EXISTS staging_target_action_positions (
  target_name text,
  action_name text,
  position_name text,
  is_recommended boolean,
  usage_count integer
);

-- 既存データクリア
TRUNCATE staging_target_action_positions;

-- =====================================
-- CSVデータ投入
-- =====================================

-- CSVファイルからステージングテーブルに読み込み
-- \copy staging_target_action_positions FROM 'database/seed/production_data/target_action_positions.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');

-- 直接データ投入（CSVファイルのデータを埋め込み）
INSERT INTO staging_target_action_positions (target_name, action_name, position_name, is_recommended, usage_count) VALUES
('タイヤ', '交換', '右前', true, 12),
('タイヤ', '交換', '左前', true, 10),
('タイヤ', '交換', '右後', false, 5),
('タイヤ', '交換', '左後', false, 4),
('タイヤ', '脱着', '右前', false, 3),
('タイヤ', '脱着', '左前', false, 2),
('タイヤ', '調整', '（指定なし）', false, 1),
('ホイール', '脱着', '右', true, 6),
('ホイール', '脱着', '左', true, 6),
('ホイール', '清掃', '（指定なし）', false, 2),
('ライト', '交換', '右', true, 8),
('ライト', '交換', '左', true, 7),
('バンパー', '修理', '（指定なし）', true, 9),
('コーナーパネル', '脱着', '右', false, 3),
('コーナーパネル', '脱着', '左', false, 2),
('フラッシャー', '取付', '右', false, 4),
('フラッシャー', '取付', '左', false, 3),
('ライニング', '張替', '（指定なし）', true, 5),
('スプリングシート', '溶接', '（指定なし）', true, 4);

-- =====================================
-- 本テーブルへのUPSERT
-- =====================================

BEGIN;

-- target_action_positions テーブルをクリア（再構築）
TRUNCATE target_action_positions;

-- ステージングデータを本テーブルに投入
INSERT INTO target_action_positions (target_id, action_id, position_id, is_recommended, usage_count)
SELECT 
  t.id as target_id,
  a.id as action_id,
  p.id as position_id,  -- 「（指定なし）」の場合はNULLになる
  s.is_recommended,
  s.usage_count
FROM staging_target_action_positions s
JOIN targets t ON t.name = s.target_name
JOIN actions a ON a.name = s.action_name
LEFT JOIN positions p ON p.name = s.position_name AND s.position_name <> '（指定なし）'
WHERE s.target_name IS NOT NULL 
  AND s.action_name IS NOT NULL;

COMMIT;

-- =====================================
-- 3段階絞り込み動作テスト
-- =====================================

SELECT '=== 3段階絞り込み動作テスト ===' as test_title;

-- テスト1: タイヤ選択時の動作絞り込み
SELECT '■ Step 1: タイヤ選択時の利用可能動作' as test_step;
SELECT DISTINCT
  a.name as action_name,
  COUNT(*) as position_options
FROM target_action_positions tap
JOIN targets t ON tap.target_id = t.id
JOIN actions a ON tap.action_id = a.id
WHERE t.name = 'タイヤ'
GROUP BY a.name
ORDER BY a.name;

-- テスト2: タイヤ→交換選択時の位置絞り込み
SELECT '■ Step 2: タイヤ→交換選択時の利用可能位置' as test_step;
SELECT 
  COALESCE(p.name, '（指定なし）') as position_name,
  tap.is_recommended,
  tap.usage_count
FROM target_action_positions tap
JOIN targets t ON tap.target_id = t.id
JOIN actions a ON tap.action_id = a.id
LEFT JOIN positions p ON tap.position_id = p.id
WHERE t.name = 'タイヤ' AND a.name = '交換'
ORDER BY tap.usage_count DESC;

-- テスト3: バンパー→修理の場合（比較）
SELECT '■ 比較: バンパー→修理選択時の利用可能位置' as test_step;
SELECT 
  COALESCE(p.name, '（指定なし）') as position_name,
  tap.is_recommended,
  tap.usage_count
FROM target_action_positions tap
JOIN targets t ON tap.target_id = t.id
JOIN actions a ON tap.action_id = a.id
LEFT JOIN positions p ON tap.position_id = p.id
WHERE t.name = 'バンパー' AND a.name = '修理'
ORDER BY tap.usage_count DESC;

-- =====================================
-- UIで使用する絞り込みクエリ例
-- =====================================

SELECT '=== UIで使用する絞り込みクエリ例 ===' as query_examples;

-- Step 1クエリ: 対象選択時の動作取得
SELECT '/* Step 1: 対象選択時の動作取得 */' as step1_comment;
SELECT 
  'SELECT DISTINCT a.id, a.name FROM target_action_positions tap 
   JOIN actions a ON tap.action_id = a.id 
   WHERE tap.target_id = :target_id 
   ORDER BY a.name;' as step1_query;

-- Step 2クエリ: 対象×動作選択時の位置取得
SELECT '/* Step 2: 対象×動作選択時の位置取得 */' as step2_comment;
SELECT 
  'SELECT tap.position_id, COALESCE(p.name, ''（指定なし）'') as position_name, 
          tap.is_recommended, tap.usage_count
   FROM target_action_positions tap
   LEFT JOIN positions p ON tap.position_id = p.id
   WHERE tap.target_id = :target_id AND tap.action_id = :action_id
   ORDER BY tap.is_recommended DESC, tap.usage_count DESC;' as step2_query;

-- =====================================
-- 投入結果確認
-- =====================================

DO $$
DECLARE
    total_count INTEGER;
    recommended_count INTEGER;
    target_count INTEGER;
    action_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_count FROM target_action_positions;
    SELECT COUNT(*) INTO recommended_count FROM target_action_positions WHERE is_recommended = true;
    SELECT COUNT(DISTINCT target_id) INTO target_count FROM target_action_positions;
    SELECT COUNT(DISTINCT action_id) INTO action_count FROM target_action_positions;
    
    RAISE NOTICE '=== 3段階連動データ投入結果 ===';
    RAISE NOTICE '総組み合わせ数: % 件', total_count;
    RAISE NOTICE '推奨組み合わせ: % 件', recommended_count;
    RAISE NOTICE '対象種類: % 種', target_count;
    RAISE NOTICE '動作種類: % 種', action_count;
    RAISE NOTICE '================================';
END$$;

-- 成功確認
SELECT '✅ 3段階絞り込みデータ投入完了！' as result;
SELECT 'タイヤ→交換→右前,左前 / バンパー→修理→（指定なし）のような真の段階的絞り込みが可能になりました。' as description;

-- ステージングクリーンアップ
TRUNCATE staging_target_action_positions;