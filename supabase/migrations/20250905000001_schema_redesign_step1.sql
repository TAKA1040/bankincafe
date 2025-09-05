-- Schema Redesign Migration - Step 1: New Tables Creation
-- Date: 2025-09-05
-- Based on finalized DATABASE_SCHEMA.md specification

BEGIN;

-- =====================================
-- 1. 新テーブルの作成
-- =====================================

-- work_item_positions テーブル - 作業項目位置情報
CREATE TABLE IF NOT EXISTS public.work_item_positions (
    id SERIAL PRIMARY KEY,
    split_item_id INTEGER NOT NULL,
    position TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- invoice_payments テーブル - 請求書入金履歴  
CREATE TABLE IF NOT EXISTS public.invoice_payments (
    id SERIAL PRIMARY KEY,
    invoice_id TEXT NOT NULL,
    payment_date DATE NOT NULL,
    payment_amount NUMERIC(12,0) NOT NULL,
    payment_method TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- legacy_line_item_raws テーブル - 旧システム原文データ
CREATE TABLE IF NOT EXISTS public.legacy_line_item_raws (
    id SERIAL PRIMARY KEY,
    line_item_id BIGINT NOT NULL UNIQUE,
    raw_text TEXT NOT NULL
);

-- =====================================
-- 2. invoicesテーブルへのカラム追加
-- =====================================

-- 赤伝対応フィールド追加
ALTER TABLE public.invoices 
ADD COLUMN IF NOT EXISTS invoice_type TEXT DEFAULT 'standard' CHECK (invoice_type IN ('standard', 'credit_note')),
ADD COLUMN IF NOT EXISTS original_invoice_id TEXT;

-- =====================================  
-- 3. インデックスの作成
-- =====================================

-- work_item_positions用インデックス
CREATE INDEX IF NOT EXISTS idx_positions_split_item ON public.work_item_positions(split_item_id);

-- invoice_payments用インデックス
CREATE INDEX IF NOT EXISTS idx_payments_invoice ON public.invoice_payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_date ON public.invoice_payments(payment_date);

-- legacy_line_item_raws用インデックス
CREATE INDEX IF NOT EXISTS idx_legacy_line_item ON public.legacy_line_item_raws(line_item_id);

-- invoicesテーブルへの新しいインデックス
CREATE INDEX IF NOT EXISTS idx_invoices_type ON public.invoices(invoice_type);
CREATE INDEX IF NOT EXISTS idx_invoices_original ON public.invoices(original_invoice_id);

-- =====================================
-- 4. 外部キー制約の設定
-- =====================================

-- work_item_positions → invoice_line_items_split
ALTER TABLE public.work_item_positions 
ADD CONSTRAINT fk_positions_split_item 
FOREIGN KEY (split_item_id) REFERENCES public.invoice_line_items_split(id) 
ON DELETE CASCADE;

-- invoice_payments → invoices
ALTER TABLE public.invoice_payments 
ADD CONSTRAINT fk_payments_invoice 
FOREIGN KEY (invoice_id) REFERENCES public.invoices(invoice_id) 
ON DELETE CASCADE;

-- legacy_line_item_raws → invoice_line_items
ALTER TABLE public.legacy_line_item_raws 
ADD CONSTRAINT fk_legacy_line_item 
FOREIGN KEY (line_item_id) REFERENCES public.invoice_line_items(id) 
ON DELETE CASCADE;

-- invoices自己参照（赤伝用）
ALTER TABLE public.invoices 
ADD CONSTRAINT fk_invoices_original 
FOREIGN KEY (original_invoice_id) REFERENCES public.invoices(invoice_id);

-- =====================================
-- 5. Row Level Security (RLS) の設定
-- =====================================

-- 新テーブルにRLSを有効化
ALTER TABLE public.work_item_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legacy_line_item_raws ENABLE ROW LEVEL SECURITY;

-- テスト用の全操作許可ポリシー
CREATE POLICY "Enable all operations on work_item_positions" ON public.work_item_positions
FOR ALL USING (true);

CREATE POLICY "Enable all operations on invoice_payments" ON public.invoice_payments  
FOR ALL USING (true);

CREATE POLICY "Enable all operations on legacy_line_item_raws" ON public.legacy_line_item_raws
FOR ALL USING (true);

-- =====================================
-- 6. コメントの追加
-- =====================================

COMMENT ON TABLE public.work_item_positions IS '作業項目位置情報 - 複数位置の正確な管理';
COMMENT ON TABLE public.invoice_payments IS '請求書入金履歴 - 分割入金の完全な追跡管理';
COMMENT ON TABLE public.legacy_line_item_raws IS '旧システム原文データ - 原文データの専用隔離';

COMMENT ON COLUMN public.invoices.invoice_type IS '請求書種別 (standard/credit_note)';
COMMENT ON COLUMN public.invoices.original_invoice_id IS '元請求書ID（赤伝用）';

COMMIT;

-- 検証クエリ
SELECT 'Step 1 Migration Completed - New tables and constraints created' as result;