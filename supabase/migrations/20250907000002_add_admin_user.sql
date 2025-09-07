-- 管理者ユーザーの登録
-- dash201206@gmail.com を承認済み管理者として登録

INSERT INTO user_management (
  google_email,
  display_name,
  status,
  requested_at,
  approved_at,
  last_login_at
) VALUES (
  'dash201206@gmail.com',
  '管理者',
  'approved',
  NOW(),
  NOW(),
  NULL
)
ON CONFLICT (google_email) DO UPDATE SET
  status = 'approved',
  approved_at = NOW(),
  updated_at = NOW();