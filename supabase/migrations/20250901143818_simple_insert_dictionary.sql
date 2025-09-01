-- Simple dictionary data insert from real data analysis
-- Generated: 2025-09-01

-- Clear existing data first (delete dependent data first)
DELETE FROM work_history;
DELETE FROM work_set_details;
DELETE FROM work_sets;
DELETE FROM price_suggestions;
DELETE FROM target_actions;
DELETE FROM action_positions;
DELETE FROM reading_mappings;
DELETE FROM targets;
DELETE FROM actions;
DELETE FROM positions;

-- Insert real targets from data analysis
INSERT INTO targets (name, sort_order, is_active) VALUES
('フェンダー', 1, true),
('バンパー', 2, true),
('ドア', 3, true),
('ハンドル', 4, true),
('タンク', 5, true),
('ランプ', 6, true),
('ステー', 7, true),
('ガード', 8, true),
('パイプ', 9, true),
('カバー', 10, true),
('シート', 11, true),
('鋼板', 12, true),
('反射板', 13, true),
('ガラス', 14, true),
('ゴム', 15, true),
('キャッチ', 16, true),
('グリル', 17, true),
('ミラー', 18, true),
('レール', 19, true),
('メンバー', 20, true);

-- Insert real actions from data analysis
INSERT INTO actions (name, sort_order, is_active) VALUES
('交換', 1, true),
('脱着', 2, true),
('溶接', 3, true),
('切断', 4, true),
('製作', 5, true),
('修理', 6, true),
('塗装', 7, true),
('加工', 8, true),
('張替', 9, true),
('打替', 10, true);

-- Insert real positions from data analysis
INSERT INTO positions (name, sort_order, is_active) VALUES
('左', 1, true),
('右', 2, true),
('前', 3, true),
('後', 4, true),
('上', 5, true),
('下', 6, true),
('内', 7, true),
('外', 8, true),
('中央', 9, true);

-- Check results
SELECT 'targets' as table_name, COUNT(*) as record_count FROM targets
UNION ALL
SELECT 'actions' as table_name, COUNT(*) as record_count FROM actions  
UNION ALL
SELECT 'positions' as table_name, COUNT(*) as record_count FROM positions;