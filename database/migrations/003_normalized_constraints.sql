-- 正規化列＋一意制約追加（ChatGPT改訂版対応）
-- PostgreSQL仕様対応：ON CONFLICT(lower(name)) → name_norm生成列対応
-- 作成日: 2025-08-29

-- =====================================
-- 正規化生成列の追加
-- =====================================

-- targets正規化列
ALTER TABLE targets ADD COLUMN IF NOT EXISTS name_norm text GENERATED ALWAYS AS (lower(name)) STORED;

-- actions正規化列  
ALTER TABLE actions ADD COLUMN IF NOT EXISTS name_norm text GENERATED ALWAYS AS (lower(name)) STORED;

-- positions正規化列
ALTER TABLE positions ADD COLUMN IF NOT EXISTS name_norm text GENERATED ALWAYS AS (lower(name)) STORED;

-- =====================================
-- 正規化一意制約の追加
-- =====================================

DO $$
BEGIN
  -- targets正規化一意制約
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='uq_targets_name_norm') THEN
    ALTER TABLE targets ADD CONSTRAINT uq_targets_name_norm UNIQUE (name_norm);
  END IF;
  
  -- actions正規化一意制約
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='uq_actions_name_norm') THEN
    ALTER TABLE actions ADD CONSTRAINT uq_actions_name_norm UNIQUE (name_norm);
  END IF;
  
  -- positions正規化一意制約
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='uq_positions_name_norm') THEN
    ALTER TABLE positions ADD CONSTRAINT uq_positions_name_norm UNIQUE (name_norm);
  END IF;
END$$;

-- =====================================
-- 既存インデックスとの整合性確認
-- =====================================

-- 既存のlower(name)インデックスがあれば削除（重複回避）
DROP INDEX IF EXISTS uniq_targets_name_norm;
DROP INDEX IF EXISTS uniq_actions_name_norm;  
DROP INDEX IF EXISTS uniq_positions_name_norm;

-- =====================================
-- 確認クエリ
-- =====================================

-- 制約確認
SELECT 
  conname as constraint_name,
  conrelid::regclass as table_name
FROM pg_constraint 
WHERE conname LIKE '%name_norm%'
ORDER BY table_name, conname;

-- 生成列確認
SELECT 
  schemaname,
  tablename,
  attname as column_name,
  atttypid::regtype as data_type
FROM pg_attribute a
JOIN pg_class c ON a.attrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE attname = 'name_norm'
  AND n.nspname = 'public'
ORDER BY tablename;

SELECT '正規化列＋一意制約追加完了' as result;