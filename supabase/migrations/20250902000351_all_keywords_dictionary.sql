-- All keywords dictionary migration from real data
-- Generated: 2025-09-02 00:03:51
-- Total keywords: 96

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

-- Insert ALL target keywords as individual entries
INSERT INTO targets (name, sort_order, is_active) VALUES
('フェンダー', 1, true),
('バンパー', 2, true),
('インナーバンパー', 3, true),
('ドア', 4, true),
('扉', 5, true),
('観音扉', 6, true),
('煽りドア', 7, true),
('ハンドル', 8, true),
('アウターハンドル', 9, true),
('タンク', 10, true),
('燃料タンク', 11, true),
('オイルタンク', 12, true),
('ヘッドライト', 13, true),
('フォグランプ', 14, true),
('マーカーランプ', 15, true),
('コーナーランプ', 16, true),
('フラッシャー', 17, true),
('ステー', 18, true),
('ブラケット', 19, true),
('ステイ', 20, true),
('ガード', 21, true),
('サイドガード', 22, true),
('パイプ', 23, true),
('ホース', 24, true),
('ヒーターパイプ', 25, true),
('カバー', 26, true),
('ロアカバー', 27, true),
('エンドカバー', 28, true),
('アウターカバー', 29, true),
('マフラーカバー', 30, true),
('シート', 31, true),
('ウイングシート', 32, true),
('鋼板', 33, true),
('縞鋼板', 34, true),
('反射板', 35, true),
('ガラス', 36, true),
('安全ガラス', 37, true),
('ゴム', 38, true),
('アーチゴム', 39, true),
('キャッチ', 40, true),
('ウィングキャッチ', 41, true),
('グリル', 42, true),
('フロントグリル', 43, true),
('ミラー', 44, true),
('アンダーミラー', 45, true),
('レール', 46, true),
('ガイドレール', 47, true),
('ラッシングレール', 48, true),
('メンバー', 49, true),
('クロスメンバー', 50, true);

-- Insert ALL action keywords as individual entries
INSERT INTO actions (name, sort_order, is_active) VALUES
('交換', 1, true),
('取替', 2, true),
('取り替え', 3, true),
('脱着', 4, true),
('取り外し', 5, true),
('取付', 6, true),
('取り付け', 7, true),
('溶接', 8, true),
('接合', 9, true),
('切断', 10, true),
('切替', 11, true),
('切り替え', 12, true),
('製作', 13, true),
('制作', 14, true),
('修理', 15, true),
('修正', 16, true),
('補修', 17, true),
('塗装', 18, true),
('研磨', 19, true),
('仕上げ', 20, true),
('加工', 21, true),
('調整', 22, true),
('直し', 23, true),
('曲がり直し', 24, true),
('張替', 25, true),
('張り替え', 26, true),
('打ち換え', 27, true),
('打替', 28, true),
('リベット打ち換え', 29, true);

-- Insert ALL position keywords as individual entries
INSERT INTO positions (name, sort_order, is_active) VALUES
('左', 1, true),
('右', 2, true),
('前', 3, true),
('後', 4, true),
('リヤ', 5, true),
('上', 6, true),
('上側', 7, true),
('下', 8, true),
('下側', 9, true),
('内', 10, true),
('内側', 11, true),
('インナー', 12, true),
('外', 13, true),
('外側', 14, true),
('アウター', 15, true),
('中央', 16, true),
('センター', 17, true);

-- Check results
SELECT 'targets' as table_name, COUNT(*) as record_count FROM targets
UNION ALL
SELECT 'actions' as table_name, COUNT(*) as record_count FROM actions  
UNION ALL
SELECT 'positions' as table_name, COUNT(*) as record_count FROM positions;

-- Display sample data (first 10 entries from each)
SELECT 'TARGET KEYWORDS' as info, name, sort_order FROM targets ORDER BY sort_order LIMIT 10;
SELECT 'ACTION KEYWORDS' as info, name, sort_order FROM actions ORDER BY sort_order LIMIT 10;
SELECT 'POSITION KEYWORDS' as info, name, sort_order FROM positions ORDER BY sort_order LIMIT 10;

-- Expected counts: targets=50, actions=29, positions=17
