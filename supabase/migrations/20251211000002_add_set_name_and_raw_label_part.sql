-- invoice_line_itemsテーブルにset_nameとraw_label_partカラムを追加
-- set_name: S作業（セット作業）のセット名
-- raw_label_part: 各明細行の元データ（旧システム明細内容）

ALTER TABLE invoice_line_items
ADD COLUMN IF NOT EXISTS set_name TEXT;

ALTER TABLE invoice_line_items
ADD COLUMN IF NOT EXISTS raw_label_part TEXT;

-- コメント追加
COMMENT ON COLUMN invoice_line_items.set_name IS 'S作業（セット作業）のセット名';
COMMENT ON COLUMN invoice_line_items.raw_label_part IS '各明細行の元データ（旧システム明細内容）';
