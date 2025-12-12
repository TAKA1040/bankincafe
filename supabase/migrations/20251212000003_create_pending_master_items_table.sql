-- 登録待ちマスタ項目テーブルの作成
-- 動作・位置の新規入力を一時保存し、読み仮名を入力後にマスタ登録

CREATE TABLE IF NOT EXISTS public.pending_master_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    item_type TEXT NOT NULL CHECK (item_type IN ('action', 'position')),
    name TEXT NOT NULL,
    reading TEXT,
    invoice_id TEXT,
    is_registered BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 重複防止用のユニーク制約（同じタイプと名前の組み合わせは1つのみ）
CREATE UNIQUE INDEX IF NOT EXISTS idx_pending_master_items_unique
    ON public.pending_master_items(item_type, name)
    WHERE is_registered = false;

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_pending_master_items_type ON public.pending_master_items(item_type);
CREATE INDEX IF NOT EXISTS idx_pending_master_items_is_registered ON public.pending_master_items(is_registered);
CREATE INDEX IF NOT EXISTS idx_pending_master_items_created_at ON public.pending_master_items(created_at DESC);

-- コメント
COMMENT ON TABLE public.pending_master_items IS '登録待ちマスタ項目（動作・位置）';
COMMENT ON COLUMN public.pending_master_items.item_type IS '項目タイプ（action: 動作, position: 位置）';
COMMENT ON COLUMN public.pending_master_items.name IS '項目名';
COMMENT ON COLUMN public.pending_master_items.reading IS '読み仮名（マスタ登録時に入力）';
COMMENT ON COLUMN public.pending_master_items.invoice_id IS '登録元の請求書ID';
COMMENT ON COLUMN public.pending_master_items.is_registered IS 'マスタ登録済みフラグ';

SELECT '✅ Pending master items table created' as result;
