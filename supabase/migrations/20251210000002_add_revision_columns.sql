-- 請求書修正・赤伝処理用カラム追加

-- 月〆日時（NULLなら未〆、値があれば〆済み）
ALTER TABLE public.invoices
ADD COLUMN IF NOT EXISTS closed_at TIMESTAMPTZ DEFAULT NULL;

-- invoice_typeのデフォルト値を設定（NULLの場合）
UPDATE public.invoices
SET invoice_type = 'normal'
WHERE invoice_type IS NULL;

COMMENT ON COLUMN public.invoices.closed_at IS '月〆日時（NULLなら未〆）';
COMMENT ON COLUMN public.invoices.invoice_type IS '伝票種別: normal=通常, red=赤伝, black=黒伝';
COMMENT ON COLUMN public.invoices.original_invoice_id IS '修正元の請求書ID（赤伝・黒伝の場合）';
