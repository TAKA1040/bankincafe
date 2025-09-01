-- 現在のマスターデータで曖昧検索テスト

-- カタカナ→ひらがな検索
SELECT name, similarity(name, 'ぶれーき') as score 
FROM targets 
WHERE name % 'ぶれーき' 
ORDER BY score DESC;

-- ひらがな→カタカナ検索  
SELECT name, similarity(name, 'ブレーキ') as score
FROM targets
WHERE name % 'ブレーキ'
ORDER BY score DESC;

-- 部分マッチテスト
SELECT name, similarity(name, 'どあ') as score
FROM targets  
WHERE name % 'どあ'
ORDER BY score DESC;

-- 結果確認用
SELECT 'Current trigram search capability test' as info;