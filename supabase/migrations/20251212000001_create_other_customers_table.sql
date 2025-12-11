-- その他顧客マスタテーブルの作成
-- 「その他」カテゴリで入力された顧客名を管理

CREATE TABLE IF NOT EXISTS public.other_customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name TEXT NOT NULL UNIQUE,
    customer_name_kana TEXT,
    usage_count INTEGER DEFAULT 1 NOT NULL,
    last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_other_customers_customer_name ON public.other_customers(customer_name);
CREATE INDEX IF NOT EXISTS idx_other_customers_customer_name_kana ON public.other_customers(customer_name_kana);
CREATE INDEX IF NOT EXISTS idx_other_customers_is_active ON public.other_customers(is_active);
CREATE INDEX IF NOT EXISTS idx_other_customers_usage_count ON public.other_customers(usage_count DESC);

-- コメント
COMMENT ON TABLE public.other_customers IS 'その他カテゴリの顧客マスタ';
COMMENT ON COLUMN public.other_customers.customer_name IS '顧客名';
COMMENT ON COLUMN public.other_customers.customer_name_kana IS '顧客名（かな）';
COMMENT ON COLUMN public.other_customers.usage_count IS '使用回数';
COMMENT ON COLUMN public.other_customers.last_used_at IS '最終使用日時';
COMMENT ON COLUMN public.other_customers.is_active IS '有効フラグ';
