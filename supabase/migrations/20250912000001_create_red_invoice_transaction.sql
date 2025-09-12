-- 赤伝作成用トランザクション関数
-- 複数テーブル操作の整合性を確保（invoices, invoice_line_items, invoice_line_items_split）

CREATE OR REPLACE FUNCTION create_red_invoice_transaction(
  p_invoice_id TEXT,
  p_issue_date DATE,
  p_customer_name TEXT DEFAULT NULL,
  p_subject_name TEXT DEFAULT NULL,
  p_registration_number TEXT DEFAULT NULL,
  p_billing_month TEXT DEFAULT NULL,
  p_purchase_order_number TEXT DEFAULT NULL,
  p_order_number TEXT DEFAULT NULL,
  p_remarks TEXT DEFAULT NULL,
  p_subtotal NUMERIC DEFAULT 0,
  p_tax NUMERIC DEFAULT 0,
  p_total_amount NUMERIC DEFAULT 0,
  p_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  p_line_items JSONB DEFAULT '[]'::jsonb,
  p_split_items JSONB DEFAULT '[]'::jsonb
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  line_item JSONB;
  split_item JSONB;
BEGIN
  -- トランザクション開始（自動）
  
  -- 1. メイン請求書作成
  INSERT INTO invoices (
    invoice_id, issue_date, customer_name, subject_name, registration_number,
    billing_month, purchase_order_number, order_number, remarks,
    subtotal, tax, total_amount, status, payment_status, updated_at
  ) VALUES (
    p_invoice_id, p_issue_date, p_customer_name, p_subject_name, p_registration_number,
    p_billing_month, p_purchase_order_number, p_order_number, p_remarks,
    p_subtotal, p_tax, p_total_amount, 'draft', 'unpaid', p_updated_at
  );
  
  -- 2. ライン項目作成
  FOR line_item IN SELECT * FROM jsonb_array_elements(p_line_items)
  LOOP
    INSERT INTO invoice_line_items (
      invoice_id, line_no, task_type, action, target, position, raw_label,
      unit_price, quantity, performed_at, amount
    ) VALUES (
      p_invoice_id,
      (line_item->>'line_no')::INTEGER,
      line_item->>'task_type',
      line_item->>'action',
      line_item->>'target',
      line_item->>'position',
      line_item->>'raw_label',
      CASE WHEN line_item->>'unit_price' IS NOT NULL THEN (line_item->>'unit_price')::NUMERIC ELSE NULL END,
      CASE WHEN line_item->>'quantity' IS NOT NULL THEN (line_item->>'quantity')::NUMERIC ELSE NULL END,
      CASE WHEN line_item->>'performed_at' IS NOT NULL THEN (line_item->>'performed_at')::TIMESTAMP ELSE NULL END,
      CASE WHEN line_item->>'amount' IS NOT NULL THEN (line_item->>'amount')::NUMERIC ELSE NULL END
    );
  END LOOP;
  
  -- 3. 分割項目作成
  FOR split_item IN SELECT * FROM jsonb_array_elements(p_split_items)
  LOOP
    INSERT INTO invoice_line_items_split (
      invoice_id, line_no, sub_no, raw_label_part, action, target, position,
      unit_price, quantity, amount, is_cancelled
    ) VALUES (
      p_invoice_id,
      (split_item->>'line_no')::INTEGER,
      (split_item->>'sub_no')::INTEGER,
      split_item->>'raw_label_part',
      split_item->>'action',
      split_item->>'target',
      split_item->>'position',
      CASE WHEN split_item->>'unit_price' IS NOT NULL THEN (split_item->>'unit_price')::NUMERIC ELSE NULL END,
      CASE WHEN split_item->>'quantity' IS NOT NULL THEN (split_item->>'quantity')::NUMERIC ELSE NULL END,
      CASE WHEN split_item->>'amount' IS NOT NULL THEN (split_item->>'amount')::NUMERIC ELSE NULL END,
      COALESCE((split_item->>'is_cancelled')::BOOLEAN, false)
    );
  END LOOP;
  
  -- 成功時は自動COMMIT
  -- 失敗時は自動ROLLBACK
EXCEPTION
  WHEN OTHERS THEN
    -- エラー発生時は詳細メッセージと共に例外を再発生
    RAISE EXCEPTION 'Red invoice transaction failed: %', SQLERRM;
END;
$$;