-- 請求書印刷設定テーブル

-- グローバル設定テーブル
CREATE TABLE IF NOT EXISTS invoice_print_global_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- デフォルトレイアウト
  default_layout VARCHAR(50) NOT NULL DEFAULT 'minimal',
  -- ヘッダー表示項目（JSON配列）
  header_items JSONB NOT NULL DEFAULT '["invoice_number", "issue_date", "customer_name", "total_amount", "company_name", "company_address", "company_phone"]'::jsonb,
  -- フッター表示項目（JSON配列）
  footer_items JSONB NOT NULL DEFAULT '["subtotal", "tax", "total", "bank_info", "remarks"]'::jsonb,
  -- 作成日時
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- 更新日時
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 顧客別設定テーブル
CREATE TABLE IF NOT EXISTS invoice_print_customer_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- 顧客名（紐付けキー）
  customer_name VARCHAR(255) NOT NULL UNIQUE,
  -- レイアウト（NULLならグローバル設定を使用）
  layout VARCHAR(50),
  -- ヘッダー表示項目（NULLならグローバル設定を使用）
  header_items JSONB,
  -- フッター表示項目（NULLならグローバル設定を使用）
  footer_items JSONB,
  -- 作成日時
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- 更新日時
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- グローバル設定の初期データ挿入（存在しない場合のみ）
INSERT INTO invoice_print_global_settings (id)
SELECT gen_random_uuid()
WHERE NOT EXISTS (SELECT 1 FROM invoice_print_global_settings);

-- 更新日時自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- グローバル設定の更新トリガー
DROP TRIGGER IF EXISTS update_invoice_print_global_settings_updated_at ON invoice_print_global_settings;
CREATE TRIGGER update_invoice_print_global_settings_updated_at
  BEFORE UPDATE ON invoice_print_global_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 顧客別設定の更新トリガー
DROP TRIGGER IF EXISTS update_invoice_print_customer_settings_updated_at ON invoice_print_customer_settings;
CREATE TRIGGER update_invoice_print_customer_settings_updated_at
  BEFORE UPDATE ON invoice_print_customer_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLSポリシー（必要に応じて調整）
ALTER TABLE invoice_print_global_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_print_customer_settings ENABLE ROW LEVEL SECURITY;

-- 全ユーザーに読み書き許可（認証済みユーザー向け）
CREATE POLICY "Allow all for authenticated users on global settings"
  ON invoice_print_global_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all for authenticated users on customer settings"
  ON invoice_print_customer_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 匿名アクセス用ポリシー（開発用）
CREATE POLICY "Allow all for anon on global settings"
  ON invoice_print_global_settings
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all for anon on customer settings"
  ON invoice_print_customer_settings
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);
