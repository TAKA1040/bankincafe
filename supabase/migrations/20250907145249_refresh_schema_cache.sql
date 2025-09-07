-- Migration to refresh schema cache and ensure user_management table exists
-- Check if user_management table exists and recreate if necessary

-- Check if user_management table exists
DO $$
BEGIN
    -- Create table if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_management'
    ) THEN
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

        -- Create indexes
        CREATE INDEX idx_user_management_email ON user_management(google_email);
        CREATE INDEX idx_user_management_status ON user_management(status);

        -- Enable RLS
        ALTER TABLE user_management ENABLE ROW LEVEL SECURITY;

        -- Allow all operations policy (development mode)
        CREATE POLICY "Allow all operations on user_management" ON user_management
            FOR ALL USING (true);

        -- Grant permissions
        GRANT ALL ON user_management TO postgres, anon, authenticated, service_role;

        RAISE NOTICE 'user_management table created successfully';
    ELSE
        RAISE NOTICE 'user_management table already exists';
    END IF;
END $$;

-- Check admin_settings table
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'admin_settings'
    ) THEN
        CREATE TABLE admin_settings (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            setting_key TEXT NOT NULL UNIQUE,
            setting_value TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE INDEX idx_admin_settings_key ON admin_settings(setting_key);

        ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

        CREATE POLICY "Allow all operations on admin_settings" ON admin_settings
            FOR ALL USING (true);

        GRANT ALL ON admin_settings TO postgres, anon, authenticated, service_role;

        -- Insert initial settings
        INSERT INTO admin_settings (setting_key, setting_value) VALUES 
            ('google_oauth_enabled', 'true'),
            ('require_admin_approval', 'true'),
            ('default_user_role', 'user')
        ON CONFLICT (setting_key) DO NOTHING;

        RAISE NOTICE 'admin_settings table created successfully';
    ELSE
        RAISE NOTICE 'admin_settings table already exists';
    END IF;
END $$;

-- updated_at auto-update function and triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'update_user_management_updated_at'
    ) THEN
        CREATE TRIGGER update_user_management_updated_at 
            BEFORE UPDATE ON user_management 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'update_admin_settings_updated_at'
    ) THEN
        CREATE TRIGGER update_admin_settings_updated_at 
            BEFORE UPDATE ON admin_settings 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Insert admin user if not exists
INSERT INTO user_management (
    google_email,
    display_name,
    status,
    requested_at,
    approved_at
) VALUES (
    'dash201206@gmail.com',
    'Administrator',
    'approved',
    NOW(),
    NOW()
) ON CONFLICT (google_email) DO UPDATE SET
    status = 'approved',
    approved_at = NOW(),
    updated_at = NOW();

-- Force PostgREST schema cache reload
NOTIFY pgrst, 'reload schema';