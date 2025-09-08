-- 外部キー制約違反エラーを修正するため、company_info テーブルの外部キー制約を削除
-- これにより匿名ユーザーでも会社情報を保存できるようになる

-- 既存の外部キー制約を削除
ALTER TABLE company_info DROP CONSTRAINT IF EXISTS company_info_user_id_fkey;

-- user_id を NULL許可に変更（既に許可されている場合はスキップされる）
ALTER TABLE company_info ALTER COLUMN user_id DROP NOT NULL;

-- インデックスがあれば再作成（パフォーマンス向上のため）
CREATE INDEX IF NOT EXISTS idx_company_info_user_id ON company_info(user_id);