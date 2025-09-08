-- 会社情報テーブルの作成
CREATE TABLE IF NOT EXISTS company_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- 基本情報
  company_name TEXT,
  company_name_kana TEXT,
  representative_name TEXT,
  
  -- 住所情報
  postal_code TEXT,
  prefecture TEXT,
  city TEXT,
  address TEXT,
  building_name TEXT,
  
  -- 連絡先情報
  phone_number TEXT,
  fax_number TEXT,
  mobile_number TEXT,
  email TEXT,
  website TEXT,
  
  -- 事業情報
  fiscal_year_end_month TEXT DEFAULT '3',
  
  -- 税務・請求情報
  tax_registration_number TEXT,
  invoice_registration_number TEXT,
  bank_name TEXT,
  bank_branch TEXT,
  account_type TEXT DEFAULT '普通',
  account_number TEXT,
  account_holder TEXT,
  
  -- その他
  remarks TEXT,
  
  -- システム情報
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLSの有効化
ALTER TABLE company_info ENABLE ROW LEVEL SECURITY;

-- ポリシーの作成：ユーザーは自分の会社情報のみアクセス可能
CREATE POLICY "Users can view own company info" ON company_info
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own company info" ON company_info
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own company info" ON company_info
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own company info" ON company_info
  FOR DELETE USING (auth.uid() = user_id);

-- updated_atの自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_company_info_updated_at 
    BEFORE UPDATE ON company_info 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_company_info_user_id ON company_info(user_id);