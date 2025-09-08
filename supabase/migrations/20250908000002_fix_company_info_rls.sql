-- 一時的にcompany_infoテーブルのRLSを無効化
ALTER TABLE company_info DISABLE ROW LEVEL SECURITY;

-- 既存のポリシーを削除
DROP POLICY IF EXISTS "Users can view own company info" ON company_info;
DROP POLICY IF EXISTS "Users can insert own company info" ON company_info;
DROP POLICY IF EXISTS "Users can update own company info" ON company_info;
DROP POLICY IF EXISTS "Users can delete own company info" ON company_info;

-- 全てのユーザーがアクセス可能な一時ポリシー（開発用）
-- RLSを再度有効化
ALTER TABLE company_info ENABLE ROW LEVEL SECURITY;

-- 全ユーザーに対する一時的なポリシー
CREATE POLICY "Allow all operations for development" ON company_info
  FOR ALL USING (true)
  WITH CHECK (true);

-- または、匿名ユーザーも許可するポリシー
CREATE POLICY "Allow anonymous access" ON company_info
  FOR ALL USING (
    auth.uid() IS NULL OR 
    auth.uid() = user_id OR 
    user_id = '00000000-0000-0000-0000-000000000000'::uuid
  )
  WITH CHECK (
    auth.uid() IS NULL OR 
    auth.uid() = user_id OR 
    user_id = '00000000-0000-0000-0000-000000000000'::uuid
  );