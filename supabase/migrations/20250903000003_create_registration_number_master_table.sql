-- 登録番号マスタテーブルの作成
CREATE TABLE public.registration_number_master (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    registration_number TEXT NOT NULL UNIQUE,
    region TEXT, -- 地域（北九州、筑豊、大分など）
    category_code TEXT, -- カテゴリーコード（101、130など）
    suffix TEXT, -- 接尾辞（あ、か、き、うなど）
    sequence_number TEXT, -- 連番部分
    usage_count INTEGER DEFAULT 0 NOT NULL,
    last_used_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- インデックス作成
CREATE INDEX idx_registration_number_master_registration_number ON public.registration_number_master(registration_number);
CREATE INDEX idx_registration_number_master_region ON public.registration_number_master(region);
CREATE INDEX idx_registration_number_master_category_code ON public.registration_number_master(category_code);
CREATE INDEX idx_registration_number_master_is_active ON public.registration_number_master(is_active);

-- RLS有効化
ALTER TABLE public.registration_number_master ENABLE ROW LEVEL SECURITY;

-- 全ユーザーに対する読み取り権限
CREATE POLICY "Allow read access to all users" ON public.registration_number_master
    FOR SELECT USING (true);

-- 認証されたユーザーに対する書き込み権限
CREATE POLICY "Allow authenticated users to insert" ON public.registration_number_master
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update" ON public.registration_number_master
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete" ON public.registration_number_master
    FOR DELETE USING (auth.role() = 'authenticated');