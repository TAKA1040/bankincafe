-- invoice_line_items にsub_noを追加し、UNIQUE制約を修正

-- 1. sub_no カラムを追加
ALTER TABLE invoice_line_items ADD COLUMN IF NOT EXISTS sub_no INTEGER DEFAULT 1;

-- 2. 既存のUNIQUE制約を削除
ALTER TABLE invoice_line_items DROP CONSTRAINT IF EXISTS invoice_line_items_invoice_id_line_no_key;

-- 3. 新しいUNIQUE制約を追加（invoice_id, line_no, sub_no）
ALTER TABLE invoice_line_items ADD CONSTRAINT invoice_line_items_invoice_id_line_no_sub_no_key UNIQUE (invoice_id, line_no, sub_no);
