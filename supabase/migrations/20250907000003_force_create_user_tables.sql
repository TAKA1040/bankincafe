-- Force create user management tables if not exists

-- Drop existing tables if they exist (for clean recreation)
DROP TABLE IF EXISTS user_management CASCADE;
DROP TABLE IF EXISTS admin_settings CASCADE;

-- Create user_management table
CREATE TABLE user_management (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    google_email TEXT NOT NULL UNIQUE,
    display_name TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    approved_by UUID,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create admin_settings table
CREATE TABLE admin_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key TEXT NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_user_management_email ON user_management(google_email);
CREATE INDEX idx_user_management_status ON user_management(status);
CREATE INDEX idx_admin_settings_key ON admin_settings(setting_key);

-- Create update trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_user_management_updated_at 
    BEFORE UPDATE ON user_management 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_settings_updated_at 
    BEFORE UPDATE ON admin_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial admin settings
INSERT INTO admin_settings (setting_key, setting_value) VALUES 
    ('google_oauth_enabled', 'true'),
    ('require_admin_approval', 'true'),
    ('default_user_role', 'user')
ON CONFLICT (setting_key) DO NOTHING;

-- Enable Row Level Security (RLS) but allow full access for now
ALTER TABLE user_management ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (can be restricted later with auth)
CREATE POLICY "Allow all operations on user_management" ON user_management
    FOR ALL USING (true);

CREATE POLICY "Allow all operations on admin_settings" ON admin_settings
    FOR ALL USING (true);

-- Grant permissions to public schema
GRANT ALL ON user_management TO postgres, anon, authenticated, service_role;
GRANT ALL ON admin_settings TO postgres, anon, authenticated, service_role;

-- Insert the admin user
INSERT INTO user_management (
    google_email,
    display_name,
    status,
    requested_at,
    approved_at
) VALUES (
    'dash201206@gmail.com',
    '管理者',
    'approved',
    NOW(),
    NOW()
) ON CONFLICT (google_email) DO UPDATE SET
    status = 'approved',
    approved_at = NOW(),
    updated_at = NOW();