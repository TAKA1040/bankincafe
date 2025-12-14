-- 追加パスワード機能用カラムを追加
-- 特定ユーザーにGoogleログイン後の追加認証を要求するため

ALTER TABLE user_management
ADD COLUMN IF NOT EXISTS additional_password TEXT DEFAULT NULL;

-- コメント追加
COMMENT ON COLUMN user_management.additional_password IS '追加パスワード（平文）。設定されている場合、Googleログイン後に追加認証が必要';
