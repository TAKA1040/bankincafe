-- Complete dictionary migration from real data
-- Generated: 2025-09-02 00:00:14
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

-- Insert all targets with keywords
INSERT INTO targets (name, sort_order, is_active) VALUES
('カバー', 1, true),
('ガラス', 2, true),
('ガード', 3, true),
('キャッチ', 4, true),
('グリル', 5, true),
('ゴム', 6, true),
('シート', 7, true),
('ステー', 8, true),
('タンク', 9, true),
('ドア', 10, true),
('ハンドル', 11, true),
('バンパー', 12, true),
('パイプ', 13, true),
('フェンダー', 14, true),
('ミラー', 15, true),
('メンバー', 16, true),
('ランプ', 17, true),
('レール', 18, true),
('反射板', 19, true),
('鋼板', 20, true);

INSERT INTO actions (name, sort_order, is_active) VALUES
('交換', 1, true),
('修理', 2, true),
('切断', 3, true),
('加工', 4, true),
('塗装', 5, true),
('張替', 6, true),
('打替', 7, true),
('溶接', 8, true),
('脱着', 9, true),
('製作', 10, true);

INSERT INTO positions (name, sort_order, is_active) VALUES
('上', 1, true),
('下', 2, true),
('中央', 3, true),
('内', 4, true),
('前', 5, true),
('右', 6, true),
('外', 7, true),
('左', 8, true),
('後', 9, true);

-- Insert reading mappings for all keywords
INSERT INTO reading_mappings (word, reading_hiragana, reading_katakana, word_type) VALUES
('インナーバンパー', '', '', 'target'),
('扉', '', '', 'target'),
('観音扉', '', '', 'target'),
('煽りドア', '', '', 'target'),
('アウターハンドル', '', '', 'target'),
('燃料タンク', '', '', 'target'),
('オイルタンク', '', '', 'target'),
('ヘッドライト', '', '', 'target'),
('フォグランプ', '', '', 'target'),
('マーカーランプ', '', '', 'target'),
('コーナーランプ', '', '', 'target'),
('フラッシャー', '', '', 'target'),
('ブラケット', '', '', 'target'),
('ステイ', '', '', 'target'),
('サイドガード', '', '', 'target'),
('ホース', '', '', 'target'),
('ヒーターパイプ', '', '', 'target'),
('ロアカバー', '', '', 'target'),
('エンドカバー', '', '', 'target'),
('アウターカバー', '', '', 'target'),
('マフラーカバー', '', '', 'target'),
('ウイングシート', '', '', 'target'),
('縞鋼板', '', '', 'target'),
('安全ガラス', '', '', 'target'),
('アーチゴム', '', '', 'target'),
('ウィングキャッチ', '', '', 'target'),
('フロントグリル', '', '', 'target'),
('アンダーミラー', '', '', 'target'),
('ガイドレール', '', '', 'target'),
('ラッシングレール', '', '', 'target'),
('クロスメンバー', '', '', 'target'),
('取替', '', '', 'action'),
('取り替え', '', '', 'action'),
('取り外し', '', '', 'action'),
('取付', '', '', 'action'),
('取り付け', '', '', 'action'),
('接合', '', '', 'action'),
('切替', '', '', 'action'),
('切り替え', '', '', 'action'),
('制作', '', '', 'action'),
('修正', '', '', 'action'),
('補修', '', '', 'action'),
('研磨', '', '', 'action'),
('仕上げ', '', '', 'action'),
('調整', '', '', 'action'),
('直し', '', '', 'action'),
('曲がり直し', '', '', 'action'),
('張り替え', '', '', 'action'),
('打ち換え', '', '', 'action'),
('リベット打ち換え', '', '', 'action'),
('リヤ', '', '', 'position'),
('上側', '', '', 'position'),
('下側', '', '', 'position'),
('内側', '', '', 'position'),
('インナー', '', '', 'position'),
('外側', '', '', 'position'),
('アウター', '', '', 'position'),
('センター', '', '', 'position');

-- Check results
SELECT 'targets' as table_name, COUNT(*) as record_count FROM targets
UNION ALL
SELECT 'actions' as table_name, COUNT(*) as record_count FROM actions  
UNION ALL
SELECT 'positions' as table_name, COUNT(*) as record_count FROM positions
UNION ALL
SELECT 'reading_mappings' as table_name, COUNT(*) as record_count FROM reading_mappings;

-- Display sample data
SELECT 'TARGETS SAMPLE' as info, name, sort_order FROM targets ORDER BY sort_order LIMIT 5;
SELECT 'ACTIONS SAMPLE' as info, name, sort_order FROM actions ORDER BY sort_order LIMIT 5;  
SELECT 'POSITIONS SAMPLE' as info, name, sort_order FROM positions ORDER BY sort_order LIMIT 5;
SELECT 'KEYWORDS SAMPLE' as info, word, word_type FROM reading_mappings LIMIT 10;
