-- Add fields needed for invoice list UI display
-- Based on the UI table headers and requirements

BEGIN;

-- Add missing fields to invoices table to match UI requirements
ALTER TABLE IF EXISTS public.invoices
  -- Invoice header fields  
  ADD COLUMN IF NOT EXISTS invoice_number text,
  ADD COLUMN IF NOT EXISTS billing_date date,
  ADD COLUMN IF NOT EXISTS customer_category text DEFAULT 'その他' CHECK (customer_category IN ('UD', 'その他')),
  ADD COLUMN IF NOT EXISTS customer_name text,
  ADD COLUMN IF NOT EXISTS subject text,
  
  -- Financial fields  
  ADD COLUMN IF NOT EXISTS subtotal numeric(12,0) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tax numeric(12,0) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total numeric(12,0) DEFAULT 0,
  
  -- Status and workflow
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft' CHECK (status IN ('draft', 'finalized', 'sent', 'paid')),
  ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'unpaid' CHECK (payment_status IN ('paid', 'unpaid', 'partial')),
  
  -- Additional fields from payment migration
  ADD COLUMN IF NOT EXISTS payment_date date,
  ADD COLUMN IF NOT EXISTS order_number text,
  ADD COLUMN IF NOT EXISTS order_id text,
  ADD COLUMN IF NOT EXISTS partial_payment_amount numeric(12,0);

-- Update existing data to have proper values
UPDATE public.invoices SET
  invoice_number = invoice_id,
  billing_date = COALESCE(billing_date, issue_date),
  customer_category = COALESCE(customer_category, 'その他'),
  customer_name = COALESCE(customer_name, 'Unknown Customer'),
  subject = COALESCE(subject, subject_name, 'No Subject'),
  status = COALESCE(status, 'draft'),
  payment_status = COALESCE(payment_status, 'unpaid')
WHERE TRUE;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS invoices_billing_date_idx ON public.invoices (billing_date);
CREATE INDEX IF NOT EXISTS invoices_customer_category_idx ON public.invoices (customer_category);
CREATE INDEX IF NOT EXISTS invoices_status_idx ON public.invoices (status);
CREATE INDEX IF NOT EXISTS invoices_payment_status_idx ON public.invoices (payment_status);
CREATE INDEX IF NOT EXISTS invoices_customer_name_idx ON public.invoices (customer_name);

-- Create a function to calculate invoice totals from line items
CREATE OR REPLACE FUNCTION calculate_invoice_totals()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate totals for the affected invoice
  UPDATE public.invoices 
  SET 
    subtotal = COALESCE((
      SELECT SUM(amount) 
      FROM public.invoice_line_items 
      WHERE invoice_id = COALESCE(NEW.invoice_id, OLD.invoice_id)
    ), 0),
    tax = ROUND(COALESCE((
      SELECT SUM(amount) * 0.1 
      FROM public.invoice_line_items 
      WHERE invoice_id = COALESCE(NEW.invoice_id, OLD.invoice_id)
    ), 0)),
    total = COALESCE((
      SELECT SUM(amount) * 1.1 
      FROM public.invoice_line_items 
      WHERE invoice_id = COALESCE(NEW.invoice_id, OLD.invoice_id)
    ), 0),
    updated_at = now()
  WHERE invoice_id = COALESCE(NEW.invoice_id, OLD.invoice_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers to auto-calculate totals
DROP TRIGGER IF EXISTS trigger_calculate_invoice_totals_insert ON public.invoice_line_items;
CREATE TRIGGER trigger_calculate_invoice_totals_insert
  AFTER INSERT ON public.invoice_line_items
  FOR EACH ROW EXECUTE FUNCTION calculate_invoice_totals();

DROP TRIGGER IF EXISTS trigger_calculate_invoice_totals_update ON public.invoice_line_items;
CREATE TRIGGER trigger_calculate_invoice_totals_update
  AFTER UPDATE ON public.invoice_line_items
  FOR EACH ROW EXECUTE FUNCTION calculate_invoice_totals();

DROP TRIGGER IF EXISTS trigger_calculate_invoice_totals_delete ON public.invoice_line_items;
CREATE TRIGGER trigger_calculate_invoice_totals_delete
  AFTER DELETE ON public.invoice_line_items
  FOR EACH ROW EXECUTE FUNCTION calculate_invoice_totals();

-- Initial calculation of totals for existing data
UPDATE public.invoices 
SET 
  subtotal = COALESCE((
    SELECT SUM(amount) 
    FROM public.invoice_line_items 
    WHERE invoice_line_items.invoice_id = invoices.invoice_id
  ), 0),
  tax = ROUND(COALESCE((
    SELECT SUM(amount) * 0.1 
    FROM public.invoice_line_items 
    WHERE invoice_line_items.invoice_id = invoices.invoice_id
  ), 0)),
  total = COALESCE((
    SELECT SUM(amount) * 1.1 
    FROM public.invoice_line_items 
    WHERE invoice_line_items.invoice_id = invoices.invoice_id
  ), 0);

COMMIT;

-- Add comments for documentation
COMMENT ON COLUMN public.invoices.invoice_number IS '請求書番号（invoice_idと同じ値）';
COMMENT ON COLUMN public.invoices.billing_date IS '請求日';
COMMENT ON COLUMN public.invoices.customer_category IS '顧客カテゴリ（UD/その他）';
COMMENT ON COLUMN public.invoices.customer_name IS '顧客名';
COMMENT ON COLUMN public.invoices.subject IS '件名';
COMMENT ON COLUMN public.invoices.subtotal IS '小計';
COMMENT ON COLUMN public.invoices.tax IS '税額';
COMMENT ON COLUMN public.invoices.total IS '合計';
COMMENT ON COLUMN public.invoices.status IS 'ステータス（draft/finalized/sent/paid）';
COMMENT ON COLUMN public.invoices.payment_status IS '支払状況（paid/unpaid/partial）';

SELECT '✅ Invoice UI fields migration completed' as result;