-- 未使用の設定「default_user_role」を削除
DELETE FROM admin_settings WHERE setting_key = 'default_user_role';
