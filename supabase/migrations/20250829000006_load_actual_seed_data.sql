-- 実際の仮データ（CSV）をデータベースに投入
-- karidata フォルダの CSV ファイルからデータ投入
-- 作成日: 2025-08-29

-- =====================================
-- ステージングテーブル作成
-- =====================================

CREATE TABLE IF NOT EXISTS staging_work_history(
  target_name text, action_name text, position_name text, memo text,
  unit_price numeric, quantity int, raw_label text, task_type text
);

CREATE TABLE IF NOT EXISTS staging_work_sets(
  set_name text, unit_price numeric, quantity int
);

CREATE TABLE IF NOT EXISTS staging_work_set_details(
  set_name text, target_name text, action_name text, position_name text, memo text, sort_order int
);

-- =====================================
-- CSVデータの手動投入（Windows環境対応）
-- =====================================

-- work_history データ
INSERT INTO staging_work_history(target_name, action_name, position_name, memo, unit_price, quantity, raw_label, task_type) VALUES
('タイヤ', '交換', '右前', '前輪右タイヤ交換', 5500, 1, null, 'structured'),
('タイヤ', '交換', '左前', '前輪左タイヤ交換', 5500, 1, null, 'structured'),
('タイヤ', '交換', '右後', '後輪右タイヤ交換', 5500, 2, null, 'structured'),
('ホイール', '脱着', '右前', '清掃含む', 3000, 1, null, 'structured'),
('ホイール', '脱着', '左前', '清掃含む', 3000, 1, null, 'structured'),
('フラッシャー', '取付', '右', '配線点検含む', 4500, 1, null, 'structured'),
('コーナーパネル', '脱着', '右', '調整含む', 8000, 1, null, 'structured'),
('バンパー', '修理', '（指定なし）', '歪み修正', 12000, 1, null, 'structured'),
('ライニング', '張替', '（指定なし）', 'ブレーキ調整込み', 9000, 1, null, 'structured'),
('スプリングシート', '溶接', '（指定なし）', '補強溶接', 7500, 1, null, 'structured'),
('ライト', '交換', '右', 'ヘッドライト', 6000, 1, null, 'structured'),
('ライト', '交換', '左', 'ヘッドライト', 6000, 1, null, 'structured'),
('タイヤ', '調整', '左右', 'エア圧調整', 1000, 1, null, 'structured'),
('ホイール', '清掃', '（指定なし）', 'ホイール洗浄', 2000, 1, null, 'structured'),
('フラッシャー', '取付', '左', '配線点検含む', 4500, 1, null, 'structured'),
('コーナーパネル', '脱着', '左', '調整含む', 8000, 1, null, 'structured'),
('ライト', '調整', '左右', '光軸調整', 2500, 1, null, 'structured'),
('タイヤ', '脱着', '右前', '点検目的', 2000, 1, null, 'structured'),
('タイヤ', '脱着', '左前', '点検目的', 2000, 1, null, 'structured'),
('バンパー', '塗装', '（指定なし）', '全塗装', 25000, 1, null, 'structured');

-- work_sets データ  
INSERT INTO staging_work_sets(set_name, unit_price, quantity) VALUES
('車検整備一式', 38000, 1),
('タイヤ交換セット', 20000, 1),
('板金塗装セット', 88000, 1),
('電装点検セット', 12000, 1),
('足回り整備セット', 36000, 1),
('灯火類リフレッシュ', 15000, 1);

-- work_set_details データ
INSERT INTO staging_work_set_details(set_name, target_name, action_name, position_name, memo, sort_order) VALUES
('車検整備一式', 'タイヤ', '調整', '左右', '増し締め', 1),
('車検整備一式', 'ライト', '点検', '左右', '灯火確認', 2),
('車検整備一式', 'ホイール', '脱着', '左右', 'ブレーキ目視', 3),
('車検整備一式', 'ライニング', '点検', '（指定なし）', '残量確認', 4),
('タイヤ交換セット', 'タイヤ', '交換', '右前', '', 1),
('タイヤ交換セット', 'タイヤ', '交換', '左前', '', 2),
('タイヤ交換セット', 'タイヤ', '交換', '右後', '', 3),
('タイヤ交換セット', 'タイヤ', '交換', '左後', '', 4),
('タイヤ交換セット', 'ホイール', '脱着', '右前', '清掃含む', 5),
('タイヤ交換セット', 'ホイール', '脱着', '左前', '清掃含む', 6),
('タイヤ交換セット', 'ホイール', '脱着', '右後', '清掃含む', 7),
('タイヤ交換セット', 'ホイール', '脱着', '左後', '清掃含む', 8),
('板金塗装セット', 'バンパー', '修理', '前', '歪み/割れ補修', 1),
('板金塗装セット', 'コーナーパネル', '修理', '右', '小凹み', 2),
('板金塗装セット', 'コーナーパネル', '修理', '左', '小凹み', 3),
('板金塗装セット', 'バンパー', '塗装', '前', 'プライマー〜仕上げ', 4),
('板金塗装セット', 'コーナーパネル', '塗装', '右', 'プライマー〜仕上げ', 5),
('板金塗装セット', 'コーナーパネル', '塗装', '左', 'プライマー〜仕上げ', 6),
('電装点検セット', 'ライト', '点検', '右', '点灯確認', 1),
('電装点検セット', 'ライト', '点検', '左', '点灯確認', 2),
('電装点検セット', 'フラッシャー', '点検', '右', '点滅確認', 3),
('電装点検セット', 'フラッシャー', '点検', '左', '点滅確認', 4),
('足回り整備セット', 'タイヤ', '点検', '右前', '溝・空気圧', 1),
('足回り整備セット', 'タイヤ', '点検', '左前', '溝・空気圧', 2),
('足回り整備セット', 'タイヤ', '点検', '右後', '溝・空気圧', 3),
('足回り整備セット', 'タイヤ', '点検', '左後', '溝・空気圧', 4),
('足回り整備セット', 'ホイール', '点検', '左右', 'キズ・変形', 5),
('足回り整備セット', 'ライニング', '点検', '（指定なし）', '残量・磨耗', 6),
('灯火類リフレッシュ', 'ライト', '清掃', '右', 'レンズクリーニング', 1),
('灯火類リフレッシュ', 'ライト', '清掃', '左', 'レンズクリーニング', 2),
('灯火類リフレッシュ', 'ライト', '調整', '左右', '光軸調整', 3),
('灯火類リフレッシュ', 'フラッシャー', '清掃', '右', 'レンズクリーニング', 4),
('灯火類リフレッシュ', 'フラッシャー', '清掃', '左', 'レンズクリーニング', 5);

-- =====================================
-- マスターデータ投入（重複回避）
-- =====================================

BEGIN;

-- 1) targets マスターにUPSERT
INSERT INTO targets(name)
SELECT DISTINCT target_name FROM (
  SELECT target_name FROM staging_work_history WHERE COALESCE(target_name,'')<>''
  UNION
  SELECT target_name FROM staging_work_set_details WHERE COALESCE(target_name,'')<>''
) x
WHERE target_name IS NOT NULL
ON CONFLICT (name_norm) DO NOTHING;

-- 2) actions マスターにUPSERT  
INSERT INTO actions(name)
SELECT DISTINCT action_name FROM (
  SELECT action_name FROM staging_work_history WHERE COALESCE(action_name,'')<>''
  UNION
  SELECT action_name FROM staging_work_set_details WHERE COALESCE(action_name,'')<>''
) x
WHERE action_name IS NOT NULL
ON CONFLICT (name_norm) DO NOTHING;

-- 3) positions マスターにUPSERT（「（指定なし）」は除外）
INSERT INTO positions(name)
SELECT DISTINCT position_name FROM (
  SELECT position_name FROM staging_work_history 
  WHERE COALESCE(position_name,'')<>'' AND position_name <> '（指定なし）'
  UNION
  SELECT position_name FROM staging_work_set_details 
  WHERE COALESCE(position_name,'')<>'' AND position_name <> '（指定なし）'
) x
WHERE position_name IS NOT NULL
ON CONFLICT (name_norm) DO NOTHING;

-- =====================================
-- work_sets親テーブル投入
-- =====================================

INSERT INTO work_sets(set_name, unit_price, quantity)
SELECT s.set_name, s.unit_price, s.quantity
FROM staging_work_sets s
WHERE s.set_name IS NOT NULL;

-- =====================================
-- work_history テーブル投入
-- =====================================

INSERT INTO work_history(target_id, action_id, position_id, memo, unit_price, quantity, raw_label, task_type)
SELECT
  t.id AS target_id,
  a.id AS action_id,
  p.id AS position_id,
  NULLIF(s.memo, ''),
  COALESCE(s.unit_price,0),
  COALESCE(s.quantity,1),
  NULLIF(s.raw_label,''),
  s.task_type
FROM staging_work_history s
LEFT JOIN targets t  ON t.name = s.target_name
LEFT JOIN actions a  ON a.name = s.action_name
LEFT JOIN positions p ON p.name = s.position_name AND s.position_name <> '（指定なし）'
WHERE s.target_name IS NOT NULL AND s.action_name IS NOT NULL;

-- =====================================
-- work_set_details テーブル投入
-- =====================================

INSERT INTO work_set_details(work_set_id, target_id, action_id, position_id, memo, sort_order)
SELECT
  ws.id,
  t.id,
  a.id,
  p.id,
  NULLIF(s.memo, ''),
  s.sort_order
FROM staging_work_set_details s
JOIN work_sets ws ON ws.set_name = s.set_name
LEFT JOIN targets t  ON t.name = s.target_name
LEFT JOIN actions a  ON a.name = s.action_name
LEFT JOIN positions p ON p.name = s.position_name AND s.position_name <> '（指定なし）'
WHERE s.set_name IS NOT NULL AND s.target_name IS NOT NULL AND s.action_name IS NOT NULL;

COMMIT;

-- =====================================
-- 結果確認
-- =====================================

DO $$
DECLARE
    target_count INTEGER;
    action_count INTEGER;
    position_count INTEGER;
    work_history_count INTEGER;
    work_sets_count INTEGER;
    work_set_details_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO target_count FROM targets;
    SELECT COUNT(*) INTO action_count FROM actions;
    SELECT COUNT(*) INTO position_count FROM positions;
    SELECT COUNT(*) INTO work_history_count FROM work_history;
    SELECT COUNT(*) INTO work_sets_count FROM work_sets;
    SELECT COUNT(*) INTO work_set_details_count FROM work_set_details;
    
    RAISE NOTICE '=== 実際のCSVデータ投入完了 ===';
    RAISE NOTICE '対象マスター: % 件', target_count;
    RAISE NOTICE '動作マスター: % 件', action_count;
    RAISE NOTICE '位置マスター: % 件', position_count;
    RAISE NOTICE '作業履歴: % 件', work_history_count;
    RAISE NOTICE 'セット親: % 件', work_sets_count;
    RAISE NOTICE 'セット詳細: % 件', work_set_details_count;
    RAISE NOTICE '=================================';
END$$;

-- =====================================
-- ステージングテーブル削除（任意）
-- =====================================

DROP TABLE IF EXISTS staging_work_history;
DROP TABLE IF EXISTS staging_work_sets;
DROP TABLE IF EXISTS staging_work_set_details;

SELECT '✅ 実際の仮データ（CSV）投入完了' as result;