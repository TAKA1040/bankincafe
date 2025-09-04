-- Create task_master table for subject management
CREATE TABLE public.task_master (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    canonical_name TEXT NOT NULL,
    category TEXT,
    usage_count INTEGER DEFAULT 0 NOT NULL,
    last_used_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true NOT NULL,
    sort_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes
CREATE INDEX idx_task_master_is_active ON public.task_master(is_active);
CREATE INDEX idx_task_master_sort_order ON public.task_master(sort_order);
CREATE INDEX idx_task_master_canonical_name ON public.task_master(canonical_name);

-- Enable RLS
ALTER TABLE public.task_master ENABLE ROW LEVEL SECURITY;

-- Create policy for all operations
CREATE POLICY "Enable all operations for task_master" ON public.task_master
  FOR ALL USING (true);

-- Add comments
COMMENT ON TABLE public.task_master IS '件名マスタテーブル';
COMMENT ON COLUMN public.task_master.id IS 'ID';
COMMENT ON COLUMN public.task_master.canonical_name IS '正規化された件名';
COMMENT ON COLUMN public.task_master.category IS 'カテゴリー';
COMMENT ON COLUMN public.task_master.usage_count IS '使用回数';
COMMENT ON COLUMN public.task_master.last_used_at IS '最終使用日時';
COMMENT ON COLUMN public.task_master.is_active IS 'アクティブフラグ';
COMMENT ON COLUMN public.task_master.sort_order IS '並び順';
COMMENT ON COLUMN public.task_master.created_at IS '作成日時';
COMMENT ON COLUMN public.task_master.updated_at IS '更新日時';

-- Create trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_task_master_updated_at BEFORE UPDATE ON public.task_master
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some initial data
INSERT INTO public.task_master (canonical_name, category, sort_order, usage_count) VALUES
('株式会社UDトラックス', 'トラック関連', 1, 1),
('株式会社バンテック九州', 'バス関連', 2, 1),
('メンテナンス作業', 'メンテナンス', 3, 0),
('修理作業', '修理', 4, 0),
('点検作業', '点検', 5, 0);