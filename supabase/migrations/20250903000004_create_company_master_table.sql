-- 件名マスタテーブルの作成
CREATE TABLE public.subject_master (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subject_name TEXT NOT NULL UNIQUE, -- 件名
    subject_name_kana TEXT, -- 読み仮名
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 件名-登録番号関連テーブルの作成
CREATE TABLE public.subject_registration_numbers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subject_id UUID NOT NULL REFERENCES public.subject_master(id) ON DELETE CASCADE,
    registration_number_id UUID NOT NULL REFERENCES public.registration_number_master(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT false NOT NULL, -- メイン登録番号かどうか
    usage_count INTEGER DEFAULT 0 NOT NULL,
    last_used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(subject_id, registration_number_id)
);

-- インデックス作成
CREATE INDEX idx_subject_master_subject_name ON public.subject_master(subject_name);
CREATE INDEX idx_subject_master_subject_name_kana ON public.subject_master(subject_name_kana);
CREATE INDEX idx_subject_registration_numbers_subject_id ON public.subject_registration_numbers(subject_id);
CREATE INDEX idx_subject_registration_numbers_registration_number_id ON public.subject_registration_numbers(registration_number_id);
CREATE INDEX idx_subject_registration_numbers_is_primary ON public.subject_registration_numbers(is_primary);

-- RLS有効化
ALTER TABLE public.subject_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subject_registration_numbers ENABLE ROW LEVEL SECURITY;

-- 件名マスタのポリシー
CREATE POLICY "Allow read access to all users" ON public.subject_master
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert" ON public.subject_master
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update" ON public.subject_master
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete" ON public.subject_master
    FOR DELETE USING (auth.role() = 'authenticated');

-- 件名-登録番号関連のポリシー
CREATE POLICY "Allow read access to all users" ON public.subject_registration_numbers
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert" ON public.subject_registration_numbers
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update" ON public.subject_registration_numbers
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete" ON public.subject_registration_numbers
    FOR DELETE USING (auth.role() = 'authenticated');