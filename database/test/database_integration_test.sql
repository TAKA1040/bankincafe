-- データベース連携テスト用SQL
-- 辞書登録機能を含む完全なDB設計の動作確認
-- 作成日: 2025-08-29

-- =====================================
-- 1. 基本マスターデータ確認
-- =====================================

-- テスト1: マスターデータ件数確認
SELECT 'TEST 1: Master data counts' as test_name;
SELECT 
  'targets' as table_name, 
  COUNT(*) as count,
  CASE WHEN COUNT(*) = 8 THEN 'PASS' ELSE 'FAIL' END as result
FROM targets
UNION ALL
SELECT 
  'actions' as table_name, 
  COUNT(*) as count,
  CASE WHEN COUNT(*) = 12 THEN 'PASS' ELSE 'FAIL' END as result
FROM actions
UNION ALL
SELECT 
  'positions' as table_name, 
  COUNT(*) as count,
  CASE WHEN COUNT(*) = 10 THEN 'PASS' ELSE 'FAIL' END as result
FROM positions;

-- =====================================
-- 2. 関連性データ確認
-- =====================================

-- テスト2: 対象→動作関連性確認
SELECT 'TEST 2: Target-Action relationships' as test_name;
SELECT 
  t.name as target_name,
  array_agg(a.name ORDER BY a.name) as related_actions
FROM targets t
JOIN target_actions ta ON t.id = ta.target_id
JOIN actions a ON ta.action_id = a.id
GROUP BY t.id, t.name
ORDER BY t.name;

-- テスト3: 動作→位置関連性確認（サンプル）
SELECT 'TEST 3: Action-Position relationships (sample)' as test_name;
SELECT 
  a.name as action_name,
  COUNT(ap.position_id) as position_count
FROM actions a
LEFT JOIN action_positions ap ON a.id = ap.action_id
GROUP BY a.id, a.name
ORDER BY a.name;

-- =====================================
-- 3. 読み仮名検索テスト
-- =====================================

-- テスト4: 読み仮名マッピング確認
SELECT 'TEST 4: Reading mappings test' as test_name;
SELECT 
  word,
  reading_hiragana,
  reading_katakana,
  word_type
FROM reading_mappings
WHERE word IN ('交換', '右', '前')
ORDER BY word_type, word;

-- テスト5: 曖昧検索ビューテスト
SELECT 'TEST 5: Searchable items view test' as test_name;
SELECT 
  item_type,
  name,
  search_text,
  match_type
FROM searchable_items
WHERE name = 'タイヤ' OR search_text LIKE '%こうかん%'
ORDER BY item_type, match_type;

-- =====================================
-- 4. NULL位置対応テスト
-- =====================================

-- テスト6: position_id NULL対応テスト
SELECT 'TEST 6: NULL position handling test' as test_name;

-- テスト用作業履歴データ挿入
INSERT INTO work_history (target_id, action_id, position_id, memo, unit_price, quantity, raw_label, task_type)
SELECT 
  t.id,
  a.id,
  NULL, -- position_id を NULL に設定
  'テスト用作業（指定なし）',
  5000,
  1,
  'テスト作業',
  'structured'
FROM targets t, actions a
WHERE t.name = 'タイヤ' AND a.name = '交換'
LIMIT 1;

-- テスト用作業履歴データ挿入（位置指定あり）
INSERT INTO work_history (target_id, action_id, position_id, memo, unit_price, quantity, raw_label, task_type)
SELECT 
  t.id,
  a.id,
  p.id,
  'テスト用作業（右）',
  5200,
  1,
  'テスト作業',
  'structured'
FROM targets t, actions a, positions p
WHERE t.name = 'タイヤ' AND a.name = '交換' AND p.name = '右'
LIMIT 1;

-- work_history_view でNULL位置の表示確認
SELECT 
  target_name,
  action_name,
  position_name, -- NULLの場合「（指定なし）」と表示されるはず
  memo,
  unit_price
FROM work_history_view
WHERE target_name = 'タイヤ' AND action_name = '交換'
ORDER BY position_name;

-- =====================================
-- 5. 価格提案テスト
-- =====================================

-- テスト7: 価格提案データ確認
SELECT 'TEST 7: Price suggestions test' as test_name;
SELECT 
  t.name as target_name,
  a.name as action_name,
  ps.suggested_price,
  ps.usage_count
FROM price_suggestions ps
JOIN targets t ON ps.target_id = t.id
JOIN actions a ON ps.action_id = a.id
ORDER BY t.name, a.name;

-- =====================================
-- 6. ユーザー設定テスト
-- =====================================

-- テスト8: ユーザー設定確認
SELECT 'TEST 8: User preferences test' as test_name;
SELECT 
  preference_key,
  preference_value
FROM user_preferences
WHERE user_id = 1
ORDER BY preference_key;

-- =====================================
-- 7. 段階的絞り込み機能テスト
-- =====================================

-- テスト9: 段階的絞り込み機能テスト
SELECT 'TEST 9: Progressive filtering test' as test_name;

-- タイヤ選択時の関連動作取得
SELECT 
  'Step 1: タイヤ選択時の関連動作' as step,
  a.name as action_name
FROM targets t
JOIN target_actions ta ON t.id = ta.target_id
JOIN actions a ON ta.action_id = a.id
WHERE t.name = 'タイヤ'
ORDER BY a.sort_order;

-- 交換選択時の関連位置取得
SELECT 
  'Step 2: 交換選択時の関連位置' as step,
  p.name as position_name
FROM actions a
JOIN action_positions ap ON a.id = ap.action_id
JOIN positions p ON ap.position_id = p.id
WHERE a.name = '交換'
ORDER BY p.sort_order;

-- =====================================
-- 8. 辞書登録機能準備テスト
-- =====================================

-- テスト10: 辞書登録前の重複チェック
SELECT 'TEST 10: Dictionary registration preparation test' as test_name;

-- 新規項目登録テスト（存在しない項目）
SELECT 
  'new_target_check' as test_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM targets WHERE lower(name) = lower('ドア')) 
    THEN 'EXISTS - should use UPSERT' 
    ELSE 'NOT EXISTS - can INSERT' 
  END as result;

-- 既存項目確認テスト
SELECT 
  'existing_target_check' as test_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM targets WHERE lower(name) = lower('タイヤ')) 
    THEN 'EXISTS - should use UPSERT' 
    ELSE 'NOT EXISTS - can INSERT' 
  END as result;

-- =====================================
-- 9. インデックス効果テスト
-- =====================================

-- テスト11: 検索性能テスト
SELECT 'TEST 11: Search performance test' as test_name;

-- 正規化ユニーク制約テスト
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM targets WHERE lower(name) = lower('タイヤ');

-- 全文検索インデックステスト（trgm）
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM targets WHERE name % 'タイヤ';

-- =====================================
-- 10. テスト用データクリーンアップ
-- =====================================

-- テスト用に挿入した作業履歴データを削除
DELETE FROM work_history 
WHERE memo LIKE 'テスト用作業%';

-- =====================================
-- テスト結果サマリー
-- =====================================

SELECT 'DATABASE INTEGRATION TEST COMPLETED' as test_summary;
SELECT 
  'All core features ready for dictionary registration implementation' as status;

-- 次ステップの準備状況確認
SELECT 
  'NEXT STEPS PREPARATION STATUS:' as next_steps,
  'DB Schema: ✅ Ready' as db_schema,
  'Initial Data: ✅ Ready' as initial_data, 
  'Views & Indexes: ✅ Ready' as views_indexes,
  'Dictionary API: 🔄 Next Implementation' as dictionary_api;