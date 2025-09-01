-- 段階的絞り込みロジック検証用SQL
-- 対象→動作→位置の3段階絞り込みが正しく機能するかテスト
-- 作成日: 2025-08-29

-- =====================================
-- テストシナリオ1: タイヤ関連の絞り込み
-- =====================================

SELECT '=== テスト1: タイヤを選択した時の動作絞り込み ===' as test_title;

-- Step 1: タイヤ選択時に出るべき動作
SELECT 
  'タイヤ選択時の関連動作' as step,
  a.name as available_actions
FROM targets t
JOIN target_actions ta ON t.id = ta.target_id
JOIN actions a ON ta.action_id = a.id
WHERE t.name = 'タイヤ'
ORDER BY a.sort_order;

SELECT '=== テスト2: タイヤ→交換選択時の位置絞り込み ===' as test_title;

-- Step 2: タイヤ→交換選択時に出るべき位置（現在のロジック）
SELECT 
  'タイヤ→交換選択時の関連位置（現在）' as step,
  p.name as available_positions
FROM actions a
JOIN action_positions ap ON a.id = ap.action_id
JOIN positions p ON ap.position_id = p.id
WHERE a.name = '交換'
ORDER BY p.sort_order;

-- =====================================
-- 問題点の確認: 対象考慮なし
-- =====================================

SELECT '=== 問題確認: バンパー→交換でも同じ位置が出る ===' as test_title;

-- バンパー→交換でも同じ位置リストが出てしまう（問題）
SELECT 
  'バンパー→交換選択時の関連位置' as step,
  p.name as available_positions
FROM actions a
JOIN action_positions ap ON a.id = ap.action_id
JOIN positions p ON ap.position_id = p.id
WHERE a.name = '交換'
ORDER BY p.sort_order;

-- =====================================
-- 理想的な絞り込み: 3段階連動
-- =====================================

SELECT '=== 理想的な絞り込み: 対象×動作×位置の組み合わせ ===' as test_title;

-- 理想: タイヤ×交換に適した位置のみ
-- （実際のデータから現実的な組み合わせを確認）
WITH realistic_combinations AS (
  SELECT DISTINCT
    wh.target_id,
    wh.action_id,
    wh.position_id,
    t.name as target_name,
    a.name as action_name,
    p.name as position_name,
    COUNT(*) as usage_count
  FROM work_history wh
  JOIN targets t ON wh.target_id = t.id
  JOIN actions a ON wh.action_id = a.id
  LEFT JOIN positions p ON wh.position_id = p.id
  GROUP BY wh.target_id, wh.action_id, wh.position_id, t.name, a.name, p.name
)
SELECT 
  target_name,
  action_name,
  COALESCE(position_name, '（指定なし）') as position_name,
  usage_count
FROM realistic_combinations
WHERE target_name = 'タイヤ' AND action_name = '交換'
ORDER BY usage_count DESC;

-- =====================================
-- 改善案: target_action_positions テーブル
-- =====================================

SELECT '=== 改善案: 3段階テーブル設計 ===' as test_title;

-- 現在の2段階テーブル構造の限界を確認
SELECT 
  '現在の構造' as structure_type,
  'target_actions: 対象→動作' as table1,
  'action_positions: 動作→位置' as table2,
  '問題: 対象が考慮されない位置絞り込み' as issue;

-- 改善案: 3段階連動テーブルのサンプル
CREATE TEMP TABLE target_action_positions_sample AS
SELECT DISTINCT
  t.id as target_id,
  a.id as action_id,
  p.id as position_id,
  t.name as target_name,
  a.name as action_name,
  p.name as position_name
FROM work_history wh
JOIN targets t ON wh.target_id = t.id
JOIN actions a ON wh.action_id = a.id
JOIN positions p ON wh.position_id = p.id
WHERE wh.position_id IS NOT NULL;

SELECT '=== 改善後の絞り込み結果 ===' as test_title;

-- 改善後: タイヤ×交換に実際に使われる位置のみ
SELECT 
  'タイヤ×交換の実際の位置組み合わせ' as description,
  position_name
FROM target_action_positions_sample
WHERE target_name = 'タイヤ' AND action_name = '交換'
ORDER BY position_name;

-- バンパー×交換の場合（比較用）
SELECT 
  'バンパー×交換の実際の位置組み合わせ' as description,
  COALESCE(position_name, '（指定なし）') as position_name
FROM target_action_positions_sample
WHERE target_name = 'バンパー' AND action_name = '修理'  -- バンパーは通常修理
ORDER BY position_name;

-- =====================================
-- 実装提案: 動的絞り込みクエリ
-- =====================================

SELECT '=== 実装提案: 段階的絞り込みクエリ ===' as test_title;

-- Step 1: 対象選択時の動作絞り込みクエリ
SELECT 
  '// Step 1クエリ例' as query_type,
  'SELECT DISTINCT a.* FROM actions a 
   JOIN target_actions ta ON a.id = ta.action_id 
   JOIN targets t ON ta.target_id = t.id 
   WHERE t.name = :selected_target' as query_example;

-- Step 2: 対象×動作選択時の位置絞り込みクエリ（改善版）
SELECT 
  '// Step 2クエリ例（改善版）' as query_type,
  'SELECT DISTINCT p.* FROM positions p
   JOIN target_action_positions_sample tap ON p.id = tap.position_id
   WHERE tap.target_name = :selected_target 
     AND tap.action_name = :selected_action' as query_example;

-- =====================================
-- 現実的な組み合わせ分析
-- =====================================

SELECT '=== 現実的な組み合わせ分析 ===' as test_title;

-- 各対象×動作の組み合わせで実際に使われる位置の種類数
SELECT 
  target_name,
  action_name,
  COUNT(DISTINCT position_name) as position_variety,
  string_agg(DISTINCT COALESCE(position_name, '（指定なし）'), ', ' ORDER BY position_name) as available_positions
FROM target_action_positions_sample
GROUP BY target_name, action_name
HAVING COUNT(DISTINCT position_name) > 0
ORDER BY target_name, action_name;

-- =====================================
-- 結論とアクションプラン
-- =====================================

SELECT '=== 結論: 段階的絞り込みの改善必要性 ===' as conclusion;

SELECT 
  '現状の問題' as issue_type,
  'action_positions テーブルでは対象を考慮しない汎用的な位置絞り込みしかできない' as description
UNION ALL
SELECT 
  '改善案1',
  'target_action_positions テーブル追加（3段階連動）'
UNION ALL
SELECT 
  '改善案2', 
  'work_history から実績ベースの動的絞り込み'
UNION ALL
SELECT 
  '推奨解決策',
  '実績データから target_action_positions を自動生成 + 手動メンテナンス機能'
ORDER BY issue_type;

DROP TABLE IF EXISTS target_action_positions_sample;

SELECT '段階的絞り込みロジック検証完了' as test_result;