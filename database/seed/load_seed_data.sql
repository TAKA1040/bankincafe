-- UI動作確認用シードデータ投入SQL
-- CSVファイルからデータを読み込んでテスト用データを投入
-- 作成日: 2025-08-29

-- =====================================
-- 注意事項
-- =====================================
-- このスクリプトは UI動作確認専用です
-- 本番データとは分離して管理してください
-- Supabase移行時にはこのデータ構造をそのまま流用可能

-- =====================================
-- 1. 既存のテストデータクリア
-- =====================================

-- セット作業詳細を先に削除（外部キー制約のため）
DELETE FROM work_set_details WHERE work_set_id IN (
  SELECT id FROM work_sets WHERE set_name LIKE '%セット' OR set_name LIKE '%一式'
);

-- セット作業ヘッダー削除
DELETE FROM work_sets WHERE set_name LIKE '%セット' OR set_name LIKE '%一式';

-- 作業履歴の既存テストデータを削除
DELETE FROM work_history WHERE raw_label LIKE '%テスト%' OR task_type = 'fuzzy';

-- =====================================
-- 2. 作業履歴サンプルデータ投入
-- =====================================

-- structured（構造化）データ投入
INSERT INTO work_history (target_id, action_id, position_id, memo, unit_price, quantity, raw_label, task_type)
SELECT 
  t.id as target_id,
  a.id as action_id,
  p.id as position_id, -- NULLの場合はそのまま
  samples.memo,
  samples.unit_price,
  samples.quantity,
  samples.raw_label,
  samples.task_type::TEXT
FROM (VALUES
  -- structured データ（18件）
  ('タイヤ', '交換', '右', '夏タイヤから冬タイヤに交換', 5500, 1, 'タイヤ交換 右', 'structured'),
  ('タイヤ', '交換', '左', '夏タイヤから冬タイヤに交換', 5500, 1, 'タイヤ交換 左', 'structured'),
  ('タイヤ', '交換', '右前', 'フロントタイヤ交換', 5800, 1, '前タイヤ右側交換', 'structured'),
  ('タイヤ', '交換', '左前', 'フロントタイヤ交換', 5800, 1, '前タイヤ左側交換', 'structured'),
  ('タイヤ', '点検', NULL, '空気圧チェック', 800, 4, 'タイヤ点検一式', 'structured'),
  ('ホイール', '脱着', '右', 'ホイール取り外し作業', 3000, 1, 'ホイール脱着 右', 'structured'),
  ('ホイール', '脱着', '左', 'ホイール取り外し作業', 3000, 1, 'ホイール脱着 左', 'structured'),
  ('ホイール', '清掃', '左右', 'アルミホイール洗浄', 2500, 1, 'ホイール清掃', 'structured'),
  ('ライト', '交換', '右', 'ヘッドライト交換', 8500, 1, 'ライト交換 右側', 'structured'),
  ('ライト', '交換', '左', 'ヘッドライト交換', 8500, 1, 'ライト交換 左側', 'structured'),
  ('ライト', '調整', '前後', 'ヘッドライト光軸調整', 1200, 1, 'ライト調整', 'structured'),
  ('コーナーパネル', '修理', '右前', '右フロントパネル板金', 15000, 1, 'コーナーパネル修理', 'structured'),
  ('コーナーパネル', '塗装', '右前', '右フロントパネル塗装', 12000, 1, 'パネル塗装 右前', 'structured'),
  ('フラッシャー', '交換', '右', '右ウインカー交換', 3500, 1, 'フラッシャー交換', 'structured'),
  ('バンパー', '修理', NULL, 'バンパー傷修理', 8000, 1, 'バンパー修理', 'structured'),
  ('バンパー', '塗装', NULL, 'バンパー全塗装', 18000, 1, 'バンパー塗装', 'structured'),
  ('ライニング', '張替', '右', '内装張り替え', 9000, 1, 'ライニング張替', 'structured'),
  ('スプリングシート', '溶接', '左後', 'スプリングシート溶接補修', 15000, 1, 'シート溶接', 'structured')
) AS samples(target_name, action_name, position_name, memo, unit_price, quantity, raw_label, task_type)
JOIN targets t ON t.name = samples.target_name
JOIN actions a ON a.name = samples.action_name
LEFT JOIN positions p ON p.name = samples.position_name; -- LEFT JOIN でNULL対応

-- fuzzy（曖昧）データ投入
INSERT INTO work_history (target_id, action_id, position_id, memo, unit_price, quantity, raw_label, task_type)
SELECT 
  t.id as target_id,
  a.id as action_id,
  p.id as position_id,
  samples.memo,
  samples.unit_price,
  samples.quantity,
  samples.raw_label,
  samples.task_type::TEXT
FROM (VALUES
  -- fuzzy データ（22件） - 意図的な誤記・表記ゆれを含む
  ('タイヤ', '交換', '右', 'タイや交換', 5500, 1, 'タイや交換 みぎ', 'fuzzy'),
  ('ホイール', '脱着', '左', 'ほいーる だっちゃく', 3000, 1, 'ホイール　だっちゃく　ひだり', 'fuzzy'),
  ('ライト', '交換', NULL, 'らいと こうかん', 8500, 1, 'ライト　コウカン', 'fuzzy'),
  ('コーナーパネル', '修理', '右', 'こーなーぱねる しゅうり', 15000, 1, 'コーナー板金', 'fuzzy'),
  ('バンパー', '塗装', NULL, 'バンパ塗装', 18000, 1, 'ばんぱー　とそう', 'fuzzy'),
  ('タイヤ', '点検', NULL, 'タイヤ点検', 800, 1, 'タイア　点検', 'fuzzy'),
  ('ホイール', '清掃', '左右', 'ホイール清掃', 2500, 1, 'ホイル　せいそう', 'fuzzy'),
  ('ライト', '調整', '前', 'ライト調整', 1200, 1, 'らいと　ちょうせい', 'fuzzy'),
  ('フラッシャー', '交換', '左', 'フラッシャー交換', 3500, 1, 'ふらっしゃー　こうかん', 'fuzzy'),
  ('ライニング', '張替', '左', 'ライニング張替', 9000, 1, 'らいにんぐ　はりかえ', 'fuzzy'),
  ('スプリングシート', '溶接', '右', 'スプリングシート溶接', 15000, 1, 'すぷりんぐしーと　ようせつ', 'fuzzy'),
  ('タイヤ', '交換', '右後', 'タイヤ交換 後ろ右', 5200, 1, 'うしろみぎ　タイヤこうかん', 'fuzzy'),
  ('ホイール', '脱着', '左前', 'ホイール脱着 前左', 2800, 1, 'まえひだり　ホイール　だっちゃく', 'fuzzy'),
  ('コーナーパネル', '脱着', '左後', 'コーナーパネル脱着', 7500, 1, 'うしろひだり　パネル　だっちゃく', 'fuzzy'),
  ('バンパー', '脱着', NULL, 'バンパー脱着', 4500, 1, 'バンパー　だっちゃく', 'fuzzy'),
  ('タイヤ', '交換', NULL, 'タイヤ交換', 5000, 1, 'タイヤ　こうかん', 'fuzzy'),
  ('ライト', '取付', '右', 'ライト取付', 4200, 1, 'みぎ　ライト　とりつけ', 'fuzzy')
) AS samples(target_name, action_name, position_name, memo, unit_price, quantity, raw_label, task_type)
JOIN targets t ON t.name = samples.target_name
JOIN actions a ON a.name = samples.action_name
LEFT JOIN positions p ON p.name = samples.position_name;

-- =====================================
-- 3. セット作業サンプルデータ投入
-- =====================================

-- セット作業ヘッダー投入
INSERT INTO work_sets (set_name, unit_price, quantity)
VALUES
  ('車検整備一式', 45000, 1),
  ('タイヤ交換セット', 22000, 1),
  ('ヘッドライト調整セット', 8500, 1),
  ('板金塗装セット', 35000, 1),
  ('内装張替セット', 18000, 1),
  ('定期点検セット', 12000, 1);

-- セット作業詳細投入
INSERT INTO work_set_details (work_set_id, target_id, action_id, position_id, memo, sort_order)
SELECT 
  ws.id as work_set_id,
  t.id as target_id,
  a.id as action_id,
  p.id as position_id,
  samples.memo,
  samples.sort_order
FROM (VALUES
  -- 車検整備一式
  ('車検整備一式', 'タイヤ', '点検', NULL, 'タイヤ空気圧チェック', 1),
  ('車検整備一式', 'ライト', '点検', '前後', '前照灯・尾灯点検', 2),
  ('車検整備一式', 'バンパー', '点検', NULL, '外観点検', 3),
  ('車検整備一式', 'フラッシャー', '点検', '左右', 'ウインカー動作確認', 4),
  -- タイヤ交換セット
  ('タイヤ交換セット', 'タイヤ', '脱着', '右前', '右前タイヤ脱着', 1),
  ('タイヤ交換セット', 'タイヤ', '脱着', '左前', '左前タイヤ脱着', 2),
  ('タイヤ交換セット', 'タイヤ', '脱着', '右後', '右後タイヤ脱着', 3),
  ('タイヤ交換セット', 'タイヤ', '脱着', '左後', '左後タイヤ脱着', 4),
  ('タイヤ交換セット', 'タイヤ', '交換', '右前', '右前タイヤ交換', 5),
  ('タイヤ交換セット', 'タイヤ', '交換', '左前', '左前タイヤ交換', 6),
  ('タイヤ交換セット', 'タイヤ', '交換', '右後', '右後タイヤ交換', 7),
  ('タイヤ交換セット', 'タイヤ', '交換', '左後', '左後タイヤ交換', 8),
  -- ヘッドライト調整セット
  ('ヘッドライト調整セット', 'ライト', '調整', '右', '右ヘッドライト光軸調整', 1),
  ('ヘッドライト調整セット', 'ライト', '調整', '左', '左ヘッドライト光軸調整', 2),
  ('ヘッドライト調整セット', 'ライト', '点検', '前後', '照明点検', 3),
  -- 板金塗装セット
  ('板金塗装セット', 'コーナーパネル', '脱着', '右前', '右前パネル脱着', 1),
  ('板金塗装セット', 'コーナーパネル', '修理', '右前', '右前パネル板金修理', 2),
  ('板金塗装セット', 'コーナーパネル', '塗装', '右前', '右前パネル塗装', 3),
  ('板金塗装セット', 'バンパー', '修理', NULL, 'バンパー修理', 4),
  ('板金塗装セット', 'バンパー', '塗装', NULL, 'バンパー塗装', 5),
  -- 内装張替セット
  ('内装張替セット', 'ライニング', '張替', '右', '右側内装張替', 1),
  ('内装張替セット', 'ライニング', '張替', '左', '左側内装張替', 2),
  ('内装張替セット', 'ライニング', '清掃', '左右', '内装清掃', 3),
  -- 定期点検セット
  ('定期点検セット', 'タイヤ', '点検', '左右', 'タイヤ点検', 1),
  ('定期点検セット', 'ライト', '点検', '前後', '照明系点検', 2),
  ('定期点検セット', 'フラッシャー', '点検', '左右', 'ウインカー点検', 3),
  ('定期点検セット', 'バンパー', '点検', NULL, '外観点検', 4)
) AS samples(set_name, target_name, action_name, position_name, memo, sort_order)
JOIN work_sets ws ON ws.set_name = samples.set_name
JOIN targets t ON t.name = samples.target_name
JOIN actions a ON a.name = samples.action_name
LEFT JOIN positions p ON p.name = samples.position_name;

-- =====================================
-- 4. 投入結果確認
-- =====================================

-- 投入データ件数確認
DO $$
DECLARE
    history_count INTEGER;
    structured_count INTEGER;
    fuzzy_count INTEGER;
    set_count INTEGER;
    set_detail_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO history_count FROM work_history;
    SELECT COUNT(*) INTO structured_count FROM work_history WHERE task_type = 'structured';
    SELECT COUNT(*) INTO fuzzy_count FROM work_history WHERE task_type = 'fuzzy';
    SELECT COUNT(*) INTO set_count FROM work_sets;
    SELECT COUNT(*) INTO set_detail_count FROM work_set_details;
    
    RAISE NOTICE '=== シードデータ投入結果 ===';
    RAISE NOTICE '作業履歴合計: % 件', history_count;
    RAISE NOTICE '  - structured: % 件', structured_count;
    RAISE NOTICE '  - fuzzy: % 件', fuzzy_count;
    RAISE NOTICE 'セット作業: % 件', set_count;
    RAISE NOTICE 'セット詳細: % 件', set_detail_count;
    RAISE NOTICE '============================';
END$$;

-- position_id NULL対応テスト
SELECT 'position_id NULL対応確認:' as test;
SELECT 
  target_name,
  action_name,
  position_name, -- NULLの場合「（指定なし）」と表示されるはず
  task_type
FROM work_history_view
WHERE position_name = '（指定なし）'
LIMIT 5;

-- fuzzy検索テスト用データ確認
SELECT 'fuzzy検索テスト用データ確認:' as test;
SELECT 
  raw_label,
  target_name,
  action_name,
  position_name
FROM work_history_view
WHERE task_type = 'fuzzy'
LIMIT 10;

-- セット作業確認
SELECT 'セット作業確認:' as test;
SELECT 
  ws.set_name,
  COUNT(wsd.id) as detail_count,
  ws.unit_price
FROM work_sets ws
LEFT JOIN work_set_details wsd ON ws.id = wsd.work_set_id
GROUP BY ws.id, ws.set_name, ws.unit_price
ORDER BY ws.set_name;

SELECT 'UI動作確認用シードデータ投入完了!' as result;