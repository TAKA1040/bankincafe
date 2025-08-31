-- Create invoice_line_items_split table
CREATE TABLE public.invoice_line_items_split (
    id SERIAL PRIMARY KEY,
    invoice_id TEXT NOT NULL,
    line_no INTEGER NOT NULL,
    sub_no INTEGER NOT NULL,
    raw_label_part TEXT NOT NULL,
    action TEXT,
    target TEXT,
    position TEXT,
    unit_price DECIMAL(12,2) NOT NULL DEFAULT 0,
    quantity INTEGER NOT NULL DEFAULT 1,
    amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    is_cancelled BOOLEAN NOT NULL DEFAULT false,
    confidence_score DECIMAL(3,2),
    extraction_method TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (invoice_id, line_no) REFERENCES invoice_line_items(invoice_id, line_no),
    UNIQUE(invoice_id, line_no, sub_no)
);

-- Create index for faster lookups
CREATE INDEX idx_invoice_line_items_split_invoice_id ON invoice_line_items_split(invoice_id);
CREATE INDEX idx_invoice_line_items_split_line_no ON invoice_line_items_split(invoice_id, line_no);

-- Enable RLS
ALTER TABLE public.invoice_line_items_split ENABLE ROW LEVEL SECURITY;

-- Create policy for all operations (for testing)
CREATE POLICY "Enable all operations for invoice_line_items_split" ON public.invoice_line_items_split
  FOR ALL USING (true);

-- Add comments
COMMENT ON TABLE public.invoice_line_items_split IS '請求書明細の分割項目';
COMMENT ON COLUMN public.invoice_line_items_split.invoice_id IS '請求書ID';
COMMENT ON COLUMN public.invoice_line_items_split.line_no IS '明細行番号';
COMMENT ON COLUMN public.invoice_line_items_split.sub_no IS '分割連番';
COMMENT ON COLUMN public.invoice_line_items_split.raw_label_part IS '分割後の原文';
COMMENT ON COLUMN public.invoice_line_items_split.action IS '作業動作';
COMMENT ON COLUMN public.invoice_line_items_split.target IS '対象物';
COMMENT ON COLUMN public.invoice_line_items_split.position IS '部位・箇所';
COMMENT ON COLUMN public.invoice_line_items_split.unit_price IS '単価';
COMMENT ON COLUMN public.invoice_line_items_split.quantity IS '数量';
COMMENT ON COLUMN public.invoice_line_items_split.amount IS '金額';
COMMENT ON COLUMN public.invoice_line_items_split.is_cancelled IS '取消しフラグ';
COMMENT ON COLUMN public.invoice_line_items_split.confidence_score IS '抽出信頼度';
COMMENT ON COLUMN public.invoice_line_items_split.extraction_method IS '抽出方法';
COMMENT ON COLUMN public.invoice_line_items_split.notes IS '備考';