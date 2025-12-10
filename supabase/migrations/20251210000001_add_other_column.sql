-- invoice_line_itemsにotherカラムを追加
-- CSVのotherフィールドに対応

ALTER TABLE public.invoice_line_items
ADD COLUMN IF NOT EXISTS other TEXT;

COMMENT ON COLUMN public.invoice_line_items.other IS 'その他情報（CSVのotherフィールド）';
