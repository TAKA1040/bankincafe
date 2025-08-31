-- 請求書テーブルに不足しているフィールドを追加し、補足データを適用
-- 作成日: 2025-08-29

-- =====================================
-- 1. 不足しているフィールドを追加
-- =====================================

-- invoicesテーブルに新しいカラムを追加
ALTER TABLE invoices 
ADD COLUMN IF NOT EXISTS billing_month TEXT,
ADD COLUMN IF NOT EXISTS purchase_order_number TEXT,
ADD COLUMN IF NOT EXISTS order_number TEXT,
ADD COLUMN IF NOT EXISTS remarks TEXT,
ADD COLUMN IF NOT EXISTS subtotal NUMERIC(12,0) DEFAULT 0,
ADD COLUMN IF NOT EXISTS tax NUMERIC(12,0) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_amount NUMERIC(12,0) DEFAULT 0,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'finalized',
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'unpaid';

-- =====================================
-- 2. CSVデータから不足分を補完
-- =====================================

-- 補足データを一括更新
UPDATE invoices SET 
  billing_month = supplement.billing_month::TEXT,
  purchase_order_number = supplement.purchase_order_number,
  order_number = supplement.order_number,
  remarks = COALESCE(NULLIF(TRIM(invoices.remarks), ''), supplement.remarks),
  subtotal = supplement.subtotal,
  tax = supplement.tax,
  total_amount = supplement.total_amount
FROM (VALUES
  ('25043369-1', '2504', '1700414282', '2405969-01', null, 35200, 3200, 35200),
  ('25043370-1', '2504', '1700414262', '2501965-01', null, 5500, 500, 5500),
  ('25043370-2', '2504', '1700414262', '2501965-01', null, 11000, 1000, 11000),
  ('25043371-1', '2504', '1700414294', '2501852-01', null, 13200, 1200, 13200),
  ('25043372-1', '2504', '1700414289', '2502053-01', null, 35200, 3200, 35200),
  ('25043373-1', '2504', '1700414276', '2502010-01', null, 16500, 1500, 16500),
  ('25043374-1', '2504', '1700414288', '2502052-01', null, 46200, 4200, 46200),
  ('25043375-1', '2504', '1700414290', '2502032-01', null, 5500, 500, 5500),
  ('25043376-1', '2504', '1700414285', '2502043-01', null, 8800, 800, 8800),
  ('25043377-1', '2504', '1700414278', '2501991-01', null, 63800, 5800, 63800),
  ('25043378-1', '2504', '1700414301', '2501931-01', null, 72600, 6600, 72600),
  ('25043379-1', '2504', '1700414306', '2502113-01', null, 176000, 16000, 176000),
  ('25043380-1', '2504', '1700414264', '2501488-01', null, 94600, 8600, 94600),
  ('25043385-1', '2504', '1700414295', '2501841-01', null, 5280, 480, 5280),
  ('25043385-2', '2504', '1700414295', '2501841-01', null, 0, 0, 0),
  ('25053381-1', '2505', '1700414333', '2502101-01', null, 35200, 3200, 35200),
  ('25053382-1', '2505', '1700414330', '2502037-01', null, 23100, 2100, 23100),
  ('25053383-1', '2505', null, null, null, 17930, 1630, 17930),
  ('25053384-1', '2505', '1700414343', '2502234-01', null, 11000, 1000, 11000),
  ('25053386-1', '2505', '1700414295', '2501841-01', null, 5280, 480, 5280),
  ('25053387-1', '2505', '1700414374', '2502309-01', null, 7920, 720, 7920),
  ('25053388-1', '2505', '1700414354', '2502272-01', null, 26400, 2400, 26400),
  ('25053389-1', '2505', '1700414337', '2502203-01', null, 412500, 37500, 412500),
  ('25053390-1', '2505', '1700414386', '2502184-01', null, 17600, 1600, 17600),
  ('25053391-1', '2505', '1700414382', '2502129-01', null, 30800, 2800, 30800),
  ('25053392-1', '2505', '1700414376', '2501148-01', null, 46200, 4200, 46200),
  ('25053393-1', '2505', '1700414387', '2502195-01', null, 8800, 800, 8800),
  ('25053394-1', '2505', '1700414388', '2502242-01', null, 9350, 850, 9350),
  ('25053395-1', '2505', '1700414375', '2501965-01', null, 107800, 9800, 107800),
  ('25053396-1', '2505', '1700414392', '2501944-01', null, 22000, 2000, 22000),
  ('25053397-1', '2505', '1700414400', '2502425-01', null, 74800, 6800, 74800),
  ('25053398-1', '2505', '1700414397', '2502420-01', null, 19800, 1800, 19800),
  ('25053399-1', '2505', '1700414404', '2502429-01', null, 17600, 1600, 17600),
  ('25053400-1', '2505', '1700414401', '2502392-01', null, 17600, 1600, 17600),
  ('25053401-1', '2505', '1700414425', '2502409-01', null, 5500, 500, 5500),
  ('25053401-2', '2505', '1700414425', '2502409-01', null, 2200, 200, 2200),
  ('25053402-1', '2505', '1700414424', '2502496-01', null, 52800, 4800, 52800),
  ('25053403-1', '2505', '1700414423', '2502131-01', null, 7700, 700, 7700),
  ('25053404-1', '2505', '1700414415', '2502449-01', null, 13200, 1200, 13200),
  ('25053405-1', '2505', '1700414406', '2502438-01', null, 13200, 1200, 13200),
  ('25053406-1', '2505', '1700414405', '2502432-01', null, 19800, 1800, 19800),
  ('25053407-1', '2505', '1700414383', '2502366-01', null, 52800, 4800, 52800),
  ('25053408-1', '2505', '1700414387', '2502195-01', null, 8800, 800, 8800),
  ('25053409-1', '2505', '1700414409', '2501991-01', null, 168850, 15350, 168850),
  ('25053410-1', '2505', '1700414442', '2502516-01', null, 11000, 1000, 11000),
  ('25053411-1', '2505', '1700414440', '2502528-01', null, 28600, 2600, 28600),
  ('25053412-1', '2505', '1700414443', '2502534-01', null, 24200, 2200, 24200),
  ('25053413-1', '2505', '1700414474', '2502556-01', null, 5500, 500, 5500),
  ('25053414-1', '2505', '1700414472', '2502887-01', null, 16500, 1500, 16500),
  ('25053415-1', '2505', '1700414449', '2502540-01', null, 5500, 500, 5500)
) AS supplement(invoice_id, billing_month, purchase_order_number, order_number, remarks, subtotal, tax, total_amount)
WHERE invoices.invoice_id = supplement.invoice_id;

-- =====================================
-- 3. インデックス追加
-- =====================================

-- 新しいフィールド用のインデックス
CREATE INDEX IF NOT EXISTS idx_invoices_billing_month ON invoices(billing_month);
CREATE INDEX IF NOT EXISTS idx_invoices_purchase_order_number ON invoices(purchase_order_number);
CREATE INDEX IF NOT EXISTS idx_invoices_order_number ON invoices(order_number);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_payment_status ON invoices(payment_status);
CREATE INDEX IF NOT EXISTS idx_invoices_total_amount ON invoices(total_amount);

-- =====================================
-- 4. データ検証
-- =====================================

-- 補完結果の確認
DO $$
DECLARE
    total_invoices INTEGER;
    filled_amounts INTEGER;
    filled_orders INTEGER;
    total_amount_sum NUMERIC;
BEGIN
    SELECT COUNT(*) INTO total_invoices FROM invoices;
    SELECT COUNT(*) INTO filled_amounts FROM invoices WHERE total_amount > 0;
    SELECT COUNT(*) INTO filled_orders FROM invoices WHERE purchase_order_number IS NOT NULL;
    SELECT SUM(total_amount) INTO total_amount_sum FROM invoices;
    
    RAISE NOTICE '=== 請求書データ補完結果 ===';
    RAISE NOTICE '総請求書数: %', total_invoices;
    RAISE NOTICE '金額が設定された請求書数: %', filled_amounts;
    RAISE NOTICE '発注番号が設定された請求書数: %', filled_orders;
    RAISE NOTICE '総金額: %', total_amount_sum;
    RAISE NOTICE '===========================';
END$$;

-- =====================================
-- 5. コメント追加
-- =====================================

COMMENT ON COLUMN invoices.billing_month IS '請求月（YYMM形式）';
COMMENT ON COLUMN invoices.purchase_order_number IS '発注番号';
COMMENT ON COLUMN invoices.order_number IS 'オーダー番号';
COMMENT ON COLUMN invoices.subtotal IS '小計金額';
COMMENT ON COLUMN invoices.tax IS '税額';
COMMENT ON COLUMN invoices.total_amount IS '請求総額';
COMMENT ON COLUMN invoices.status IS '請求書状態 (draft/finalized/cancelled)';
COMMENT ON COLUMN invoices.payment_status IS '支払い状態 (unpaid/paid/partial)';

-- 完了メッセージ
SELECT '✅ 請求書の不足フィールド補完完了 - 金額情報と発注情報追加済み' as result;