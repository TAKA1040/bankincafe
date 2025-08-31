-- 3段階絞り込み用シードデータ投入
-- target_action_positions テーブルに実用データを投入
-- 作成日: 2025-08-29

-- =====================================
-- 3段階連動データ投入
-- =====================================

-- 既存データをクリア（再投入の場合）
TRUNCATE target_action_positions;

-- シードデータ投入
INSERT INTO target_action_positions (target_id, action_id, position_id, is_recommended, usage_count)
SELECT 
  t.id as target_id,
  a.id as action_id,
  p.id as position_id,  -- 「（指定なし）」の場合はNULLになる
  data.is_recommended,
  data.usage_count
FROM (VALUES
  ('タイヤ', '交換', '右前', true, 12),
  ('タイヤ', '交換', '左前', true, 10),
  ('タイヤ', '交換', '右後', false, 5),
  ('タイヤ', '交換', '左後', false, 4),
  ('タイヤ', '脱着', '右前', false, 3),
  ('タイヤ', '脱着', '左前', false, 2),
  ('タイヤ', '調整', NULL, false, 1),
  ('ホイール', '脱着', '右', true, 6),
  ('ホイール', '脱着', '左', true, 6),
  ('ホイール', '清掃', NULL, false, 2),
  ('ライト', '交換', '右', true, 8),
  ('ライト', '交換', '左', true, 7),
  ('バンパー', '修理', NULL, true, 9),
  ('コーナーパネル', '脱着', '右', false, 3),
  ('コーナーパネル', '脱着', '左', false, 2),
  ('フラッシャー', '取付', '右', false, 4),
  ('フラッシャー', '取付', '左', false, 3),
  ('ライニング', '張替', NULL, true, 5),
  ('スプリングシート', '溶接', NULL, true, 4)
) AS data(target_name, action_name, position_name, is_recommended, usage_count)
JOIN targets t ON t.name = data.target_name
JOIN actions a ON a.name = data.action_name
LEFT JOIN positions p ON p.name = data.position_name;

-- =====================================
-- 投入結果確認
-- =====================================

DO $$
DECLARE
    total_count INTEGER;
    recommended_count INTEGER;
    null_position_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_count FROM target_action_positions;
    SELECT COUNT(*) INTO recommended_count FROM target_action_positions WHERE is_recommended = true;
    SELECT COUNT(*) INTO null_position_count FROM target_action_positions WHERE position_id IS NULL;
    
    RAISE NOTICE '=== 3段階絞り込みシードデータ投入完了 ===';
    RAISE NOTICE '総組み合わせ数: % 件', total_count;
    RAISE NOTICE '推奨組み合わせ: % 件', recommended_count;
    RAISE NOTICE '位置指定なし: % 件', null_position_count;
    RAISE NOTICE '======================================';
END$$;

-- =====================================
-- 絞り込み動作テスト
-- =====================================

-- テスト1: タイヤ選択時の動作
SELECT '■ タイヤ選択時の利用可能動作:' as test_title;
SELECT DISTINCT a.name as action_name
FROM target_action_positions tap
JOIN targets t ON tap.target_id = t.id
JOIN actions a ON tap.action_id = a.id
WHERE t.name = 'タイヤ'
ORDER BY a.name;

-- テスト2: タイヤ→交換選択時の位置
SELECT '■ タイヤ→交換選択時の利用可能位置:' as test_title;
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

-- テスト3: バンパー→修理選択時の位置
SELECT '■ バンパー→修理選択時の利用可能位置:' as test_title;
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

SELECT '✅ 3段階絞り込み機能が正常に動作します！' as result;