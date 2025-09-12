-- 一時的にcompany_infoテーブルのRLSを無効化
ALTER TABLE company_info DISABLE ROW LEVEL SECURITY;

-- 既存のポリシーを削除
DROP POLICY IF EXISTS "Users can view own company info" ON company_info;
DROP POLICY IF EXISTS "Users can insert own company info" ON company_info;
DROP POLICY IF EXISTS "Users can update own company info" ON company_info;
DROP POLICY IF EXISTS "Users can delete own company info" ON company_info;

-- セキュアなRLSポリシーを設定
ALTER TABLE company_info ENABLE ROW LEVEL SECURITY;

-- 認証必須: ユーザーは自分の企業情報のみアクセス可能
CREATE POLICY "Authenticated users can view own company info" ON company_info
  FOR SELECT USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert own company info" ON company_info
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Authenticated users can update own company info" ON company_info
  FOR UPDATE USING (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Authenticated users can delete own company info" ON company_info
  FOR DELETE USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);