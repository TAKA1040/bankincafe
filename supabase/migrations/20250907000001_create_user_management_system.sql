-- ユーザー管理システムのテーブル作成

-- ユーザー管理テーブル
CREATE TABLE user_management (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  google_email TEXT NOT NULL UNIQUE,
  display_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES auth.users(id),
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 管理者設定テーブル
CREATE TABLE admin_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス作成
CREATE INDEX idx_user_management_email ON user_management(google_email);
CREATE INDEX idx_user_management_status ON user_management(status);

-- updated_at自動更新のトリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_management_updated_at 
BEFORE UPDATE ON user_management 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_settings_updated_at 
BEFORE UPDATE ON admin_settings 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 初期管理者設定データ
INSERT INTO admin_settings (setting_key, setting_value) VALUES 
('google_oauth_enabled', 'true'),
('require_admin_approval', 'true'),
('default_user_role', 'user');

-- RLSポリシーは後で設定（認証システム実装後）