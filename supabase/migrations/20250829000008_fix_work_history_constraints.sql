-- work_historyテーブルの制約を緩和してfuzzyデータに対応
-- target_id, action_idをNULL許可に変更
-- 作成日: 2025-08-29

-- =====================================
-- work_historyテーブルの制約変更
-- =====================================

-- target_idのNOT NULL制約を削除
ALTER TABLE work_history ALTER COLUMN target_id DROP NOT NULL;

-- action_idのNOT NULL制約を削除
ALTER TABLE work_history ALTER COLUMN action_id DROP NOT NULL;

-- =====================================
-- fuzzyデータ用の検索ビュー作成
-- =====================================

-- fuzzyデータも含む作業履歴ビュー
CREATE OR REPLACE VIEW work_history_complete_view AS
SELECT 
  wh.id,
  wh.target_id,
  wh.action_id,
  wh.position_id,
  COALESCE(t.name, '[未分類]') as target_name,
  COALESCE(a.name, '[未分類]') as action_name,
  COALESCE(p.name, null) as position_name,
  wh.memo,
  wh.unit_price,
  wh.quantity,
  wh.total_amount,
  wh.raw_label,
  wh.task_type,
  wh.invoice_id,
  wh.created_at,
  wh.updated_at
FROM work_history wh
LEFT JOIN targets t ON wh.target_id = t.id
LEFT JOIN actions a ON wh.action_id = a.id
LEFT JOIN positions p ON wh.position_id = p.id
ORDER BY wh.created_at DESC;

-- =====================================
-- 完全なwork_historyデータの投入
-- =====================================

-- ステージングテーブル再作成
DROP TABLE IF EXISTS staging_work_history_complete;
CREATE TABLE staging_work_history_complete(
  target_name text, action_name text, position_name text, memo text,
  unit_price numeric, quantity int, raw_label text, task_type text
);

-- 完全なwork_historyデータ投入（42件）
INSERT INTO staging_work_history_complete(target_name, action_name, position_name, memo, unit_price, quantity, raw_label, task_type) VALUES
-- structured データ（1-18）
('タイヤ', '交換', '右前', '前輪右タイヤ交換', 5500, 1, null, 'structured'),
('タイヤ', '交換', '左前', '前輪左タイヤ交換', 5500, 1, null, 'structured'),
('タイヤ', '交換', '右後', '後輪右タイヤ交換', 5500, 2, null, 'structured'),
('ホイール', '脱着', '右前', '清掃含む', 3000, 1, null, 'structured'),
('ホイール', '脱着', '左前', '清掃含む', 3000, 1, null, 'structured'),
('フラッシャー', '取付', '右', '配線点検含む', 4500, 1, null, 'structured'),
('コーナーパネル', '脱着', '右', '調整含む', 8000, 1, null, 'structured'),
('バンパー', '修理', '（指定なし）', '歪み修正', 12000, 1, null, 'structured'),
('ライニング', '張替', '（指定なし）', 'ブレーキ調整込み', 9000, 1, null, 'structured'),
('スプリングシート', '溶接', '（指定なし）', '補強', 15000, 1, null, 'structured'),
('ライト', '取付', '左', '光軸調整別', 5000, 1, null, 'structured'),
('ライト', '取付', '右', '光軸調整別', 5000, 1, null, 'structured'),
('バンパー', '修理', '前', '割れ補修', 14000, 1, null, 'structured'),
('バンパー', '修理', '後', '凹み補修', 13000, 1, null, 'structured'),
('タイヤ', '調整', '左右', '増し締め', 1000, 4, null, 'structured'),
('ライト', '清掃', '左右', 'レンズクリーニング', 1500, 1, null, 'structured'),
('コーナーパネル', '塗装', '右', '部分塗装', 22000, 1, null, 'structured'),
('コーナーパネル', '塗装', '左', '部分塗装', 22000, 1, null, 'structured'),

-- fuzzy データ（19-42）- 表記揺れや曖昧データ
(null, null, null, '表記ゆれ（ひらがな混在）', 12000, 1, 'フロント ばんぱー', 'fuzzy'),
(null, null, null, '半角ｶﾅ混在', 8000, 1, 'Fﾊﾞﾝﾊﾟｰ ﾄﾘﾂｹ', 'fuzzy'),
(null, null, null, '半角＋全角混在', 8000, 1, '右ｺｰﾅｰﾊﾟﾈﾙ 脱着', 'fuzzy'),
(null, null, null, '語順ブレ', 8000, 1, 'ｺｰﾅｰﾊﾟﾈﾙ 右 脱着', 'fuzzy'),
(null, null, null, '同義語：取替→交換', 5500, 1, 'タイヤ 取替 右前', 'fuzzy'),
(null, null, null, '誤記：たいゃ', 5500, 1, 'たいゃ こうかん', 'fuzzy'),
(null, null, null, '別表記：ホイール→ホイル', 3000, 1, 'ホイル だっちゃく 左前', 'fuzzy'),
(null, null, null, 'ASSY混在', 18000, 1, 'ASSY 交換 ライト 右', 'fuzzy'),
(null, null, null, '別名：フラッシャー', 4500, 1, 'ウィンカー 取付 右', 'fuzzy'),
(null, null, null, '', 4500, 1, 'フラッシャー 取付 左', 'fuzzy'),
(null, null, null, '同義：修理→修繕', 12000, 1, 'バンパー 修繕 前', 'fuzzy'),
(null, null, null, '語順ブレ', 22000, 1, '塗装 コーナーパネル 左', 'fuzzy'),
(null, null, null, '語順ブレ', 1500, 1, '清掃 ライト 左', 'fuzzy'),
(null, null, null, '同義：取外し→脱着', 3000, 1, '取外し ホイール 右前', 'fuzzy'),
(null, null, null, '半角ｶﾅ混在', 5000, 1, '取付 ﾗｲﾄ 右', 'fuzzy'),
(null, null, null, '略語：右F→右前', 5500, 1, '右F タイヤ 交換', 'fuzzy'),
(null, null, null, '略語：左R→左後', 5500, 1, '左R タイヤ 交換', 'fuzzy'),
(null, null, null, '位置：左右', 5000, 2, '左右 ライト 取付', 'fuzzy'),
(null, null, null, '半角混在', 13000, 1, 'バンパー ﾍｺﾐ 修理 後', 'fuzzy'),
(null, null, null, '動作違い（清掃→辞書へ検討）', 1500, 1, 'ホイール 清掃 左前', 'fuzzy'),
(null, null, null, '同義：張り替え→張替', 9000, 1, 'ブレーキライニング 張り替え', 'fuzzy'),
(null, null, null, '', 15000, 1, 'スプリングシート 溶接 補強', 'fuzzy');

-- structuredデータからマスター更新
INSERT INTO targets(name)
SELECT DISTINCT target_name FROM staging_work_history_complete 
WHERE target_name IS NOT NULL AND TRIM(target_name) != ''
ON CONFLICT (name_norm) DO NOTHING;

INSERT INTO actions(name)
SELECT DISTINCT action_name FROM staging_work_history_complete 
WHERE action_name IS NOT NULL AND TRIM(action_name) != ''
ON CONFLICT (name_norm) DO NOTHING;

INSERT INTO positions(name)
SELECT DISTINCT position_name FROM staging_work_history_complete 
WHERE position_name IS NOT NULL AND TRIM(position_name) != '' AND position_name != '（指定なし）'
ON CONFLICT (name_norm) DO NOTHING;

-- work_historyテーブルに投入（NULL許可で）
INSERT INTO work_history(target_id, action_id, position_id, memo, unit_price, quantity, raw_label, task_type)
SELECT
  t.id AS target_id,
  a.id AS action_id,
  p.id AS position_id,
  NULLIF(TRIM(s.memo), ''),
  COALESCE(s.unit_price, 0),
  COALESCE(s.quantity, 1),
  NULLIF(TRIM(s.raw_label), ''),
  s.task_type
FROM staging_work_history_complete s
LEFT JOIN targets t ON t.name = s.target_name
LEFT JOIN actions a ON a.name = s.action_name
LEFT JOIN positions p ON p.name = s.position_name AND s.position_name != '（指定なし）'
WHERE s.task_type IS NOT NULL;

-- =====================================
-- 結果確認
-- =====================================

DO $$
DECLARE
    structured_count INTEGER;
    fuzzy_count INTEGER;
    total_count INTEGER;
    targets_count INTEGER;
    actions_count INTEGER;
    positions_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO structured_count FROM work_history WHERE task_type = 'structured';
    SELECT COUNT(*) INTO fuzzy_count FROM work_history WHERE task_type = 'fuzzy';
    SELECT COUNT(*) INTO total_count FROM work_history;
    SELECT COUNT(*) INTO targets_count FROM targets;
    SELECT COUNT(*) INTO actions_count FROM actions;
    SELECT COUNT(*) INTO positions_count FROM positions;
    
    RAISE NOTICE '=== 完全な作業履歴データ投入完了 ===';
    RAISE NOTICE '構造化データ: % 件', structured_count;
    RAISE NOTICE 'ファジーデータ: % 件', fuzzy_count;
    RAISE NOTICE '総作業履歴: % 件', total_count;
    RAISE NOTICE '対象マスター: % 件', targets_count;
    RAISE NOTICE '動作マスター: % 件', actions_count;
    RAISE NOTICE '位置マスター: % 件', positions_count;
    RAISE NOTICE '========================================';
END$$;

-- ステージングテーブル削除
DROP TABLE IF EXISTS staging_work_history_complete;

SELECT '✅ 制約修正＋完全な作業履歴データ（42件）投入完了' as result;