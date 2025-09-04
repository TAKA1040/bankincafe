-- 既存テーブルを削除して、RLSなしで再作成
-- 既存のinvoiceテーブルと同じ方式

-- 既存テーブル削除
DROP TABLE IF EXISTS public.subject_registration_numbers CASCADE;
DROP TABLE IF EXISTS public.subject_master CASCADE;
DROP TABLE IF EXISTS public.registration_number_master CASCADE;

-- 件名マスタテーブルの作成（RLSなし）
CREATE TABLE public.subject_master (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subject_name TEXT NOT NULL UNIQUE,
    subject_name_kana TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 登録番号マスタテーブルの作成（RLSなし）
CREATE TABLE public.registration_number_master (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    registration_number TEXT NOT NULL UNIQUE,
    region TEXT,
    category_code TEXT,
    suffix TEXT,
    sequence_number TEXT,
    usage_count INTEGER DEFAULT 0 NOT NULL,
    last_used_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 件名-登録番号関連テーブルの作成（RLSなし）
CREATE TABLE public.subject_registration_numbers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subject_id UUID NOT NULL REFERENCES public.subject_master(id) ON DELETE CASCADE,
    registration_number_id UUID NOT NULL REFERENCES public.registration_number_master(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT false NOT NULL,
    usage_count INTEGER DEFAULT 0 NOT NULL,
    last_used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(subject_id, registration_number_id)
);

-- インデックス作成
CREATE INDEX idx_subject_master_subject_name ON public.subject_master(subject_name);
CREATE INDEX idx_subject_master_subject_name_kana ON public.subject_master(subject_name_kana);
CREATE INDEX idx_registration_number_master_registration_number ON public.registration_number_master(registration_number);
CREATE INDEX idx_registration_number_master_region ON public.registration_number_master(region);
CREATE INDEX idx_registration_number_master_category_code ON public.registration_number_master(category_code);
CREATE INDEX idx_registration_number_master_is_active ON public.registration_number_master(is_active);
CREATE INDEX idx_subject_registration_numbers_subject_id ON public.subject_registration_numbers(subject_id);
CREATE INDEX idx_subject_registration_numbers_registration_number_id ON public.subject_registration_numbers(registration_number_id);
CREATE INDEX idx_subject_registration_numbers_is_primary ON public.subject_registration_numbers(is_primary);

-- RLSは有効化しない（既存のinvoiceテーブルと同じ方式）