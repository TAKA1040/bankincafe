-- Add reading column to targets table
-- Generated readings for 63 targets

-- Add reading column to targets table
ALTER TABLE targets ADD COLUMN IF NOT EXISTS reading TEXT;

-- Update targets with generated readings
UPDATE targets SET reading = 'どあ' WHERE name = 'ドア';
UPDATE targets SET reading = 'さいどがーど' WHERE name = 'サイドガード';
UPDATE targets SET reading = 'すてー' WHERE name = 'ステー';
UPDATE targets SET reading = 'ぶらけっと' WHERE name = 'ブラケット';
UPDATE targets SET reading = 'ぱいぷ' WHERE name = 'パイプ';
UPDATE targets SET reading = 'ねんりょうたんく' WHERE name = '燃料タンク';
UPDATE targets SET reading = 'てーるらいと' WHERE name = 'テールライト';
UPDATE targets SET reading = 'ほーす' WHERE name = 'ホース';
UPDATE targets SET reading = 'はんどる' WHERE name = 'ハンドル';
UPDATE targets SET reading = 'こーなーぱねる' WHERE name = 'コーナーパネル';
UPDATE targets SET reading = 'ふらっしゃーらいと' WHERE name = 'フラッシャーライト';
UPDATE targets SET reading = 'ぶれーき' WHERE name = 'ブレーキ';
UPDATE targets SET reading = 'ばっくらいと' WHERE name = 'バックライト';
UPDATE targets SET reading = 'ふぉぐらいと' WHERE name = 'フォグライト';
UPDATE targets SET reading = 'いんなーばんぱー' WHERE name = 'インナーバンパー';
UPDATE targets SET reading = 'ふぁーすとすてっぷ' WHERE name = 'ファーストステップ';
UPDATE targets SET reading = 'ふろんとばんぱー' WHERE name = 'フロントバンパー';
UPDATE targets SET reading = 'あっぱーふぇんだー' WHERE name = 'アッパーフェンダー';
UPDATE targets SET reading = 'ばんぱーふぃにっしゃー' WHERE name = 'バンパーフィニッシャー';
UPDATE targets SET reading = 'あんだーみらー' WHERE name = 'アンダーミラー';
UPDATE targets SET reading = 'まふらーかばー' WHERE name = 'マフラーカバー';
UPDATE targets SET reading = 'まーかーらいと' WHERE name = 'マーカーライト';
UPDATE targets SET reading = 'ばってりー' WHERE name = 'バッテリー';
UPDATE targets SET reading = 'たいやはうすかばー' WHERE name = 'タイヤハウスカバー';
UPDATE targets SET reading = 'まっどがーど' WHERE name = 'マッドガード';
UPDATE targets SET reading = 'へっどらいと' WHERE name = 'ヘッドライト';
UPDATE targets SET reading = 'さいどみらー' WHERE name = 'サイドミラー';
UPDATE targets SET reading = 'ばっくみらー' WHERE name = 'バックミラー';
UPDATE targets SET reading = 'ろあふぇんだー' WHERE name = 'ロアフェンダー';
UPDATE targets SET reading = 'どあぱねる' WHERE name = 'ドアパネル';
UPDATE targets SET reading = 'せかんどすてっぷ' WHERE name = 'セカンドステップ';
UPDATE targets SET reading = 'あんだーかばー' WHERE name = 'アンダーカバー';
UPDATE targets SET reading = 'えあたんく' WHERE name = 'エアタンク';
UPDATE targets SET reading = 'えんじんかばー' WHERE name = 'エンジンカバー';
UPDATE targets SET reading = 'たいやとう' WHERE name = 'タイヤ灯';
UPDATE targets SET reading = 'こーなーらいと' WHERE name = 'コーナーライト';
UPDATE targets SET reading = 'ほいーるかばー' WHERE name = 'ホイールカバー';
UPDATE targets SET reading = 'えんどかばー' WHERE name = 'エンドカバー';
UPDATE targets SET reading = 'さいどぱねる' WHERE name = 'サイドパネル';
UPDATE targets SET reading = 'えんじん' WHERE name = 'エンジン';
UPDATE targets SET reading = 'ぺだる' WHERE name = 'ペダル';
UPDATE targets SET reading = 'ろあかばー' WHERE name = 'ロアカバー';
UPDATE targets SET reading = 'いんなーぱねる' WHERE name = 'インナーパネル';
UPDATE targets SET reading = 'りあふぇんだー' WHERE name = 'リアフェンダー';
UPDATE targets SET reading = 'のっくすせんさー' WHERE name = 'NOXセンサー';
UPDATE targets SET reading = 'あっぱーすてっぷ' WHERE name = 'アッパーステップ';
UPDATE targets SET reading = 'しーとべると' WHERE name = 'シートベルト';
UPDATE targets SET reading = 'だっしゅぼーど' WHERE name = 'ダッシュボード';
UPDATE targets SET reading = 'でぃーぴーえふせんさー' WHERE name = 'DPFセンサー';
UPDATE targets SET reading = 'さいどせんさー' WHERE name = 'サイドセンサー';
UPDATE targets SET reading = 'こんぷれっさー' WHERE name = 'コンプレッサー';
UPDATE targets SET reading = 'くらっち' WHERE name = 'クラッチ';
UPDATE targets SET reading = 'わいぱー' WHERE name = 'ワイパー';
UPDATE targets SET reading = 'あどぶるーたんく' WHERE name = 'アドブルータンク';
UPDATE targets SET reading = 'ろあすてっぷ' WHERE name = 'ロアステップ';
UPDATE targets SET reading = 'ほーん' WHERE name = 'ホーン';
UPDATE targets SET reading = 'うぉっしゃーたんく' WHERE name = 'ウォッシャータンク';
UPDATE targets SET reading = 'ふろんとふぇんだー' WHERE name = 'フロントフェンダー';
UPDATE targets SET reading = 'ふぃるたー' WHERE name = 'フィルター';
UPDATE targets SET reading = 'おいるたんく' WHERE name = 'オイルタンク';
UPDATE targets SET reading = 'れべりんぐせんさー' WHERE name = 'レベリングセンサー';
UPDATE targets SET reading = 'ばってりーかばー' WHERE name = 'バッテリーカバー';
UPDATE targets SET reading = 'さーどすてっぷ' WHERE name = 'サードステップ';

-- Create index for reading search
CREATE INDEX IF NOT EXISTS idx_targets_reading ON targets(reading);

-- Verify readings
SELECT name, reading FROM targets ORDER BY sort_order LIMIT 20;
