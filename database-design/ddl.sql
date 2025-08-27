-- =====================================================
-- 作業入力ツール - DDL（PostgreSQL/Supabase用）
-- =====================================================

-- 拡張機能の有効化
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 正規化関数
-- =====================================================

CREATE OR REPLACE FUNCTION normalize_simple(input_text text)
RETURNS text AS $$
BEGIN
  RETURN TRIM(
    REGEXP_REPLACE(
      LOWER(NORMALIZE(COALESCE(input_text, ''), 'NFKC')),
      '[^a-zA-Z0-9ぁ-んァ-ヶ一-龯]',
      '',
      'g'
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =====================================================
-- updated_at自動更新トリガー関数
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- メインテーブル
-- =====================================================

-- 1. invoices（請求書ヘッダー）
CREATE TABLE invoices (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    invoice_year integer NOT NULL CHECK (invoice_year > 2020),
    invoice_month integer NOT NULL CHECK (invoice_month BETWEEN 1 AND 12),
    billing_date date NOT NULL,
    customer_category text NOT NULL,
    customer_name text NOT NULL,
    subject text NOT NULL,
    registration_number text,
    order_number text,
    internal_order_number text,
    subtotal integer NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
    tax_amount integer NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
    total_amount integer NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
    memo text,
    status text NOT NULL DEFAULT 'draft' 
        CHECK (status IN ('draft', 'finalized', 'sent', 'paid', 'cancelled')),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 2. line_items（明細行）
CREATE TABLE line_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id uuid NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    item_type text NOT NULL CHECK (item_type IN ('individual', 'set')),
    work_name text NOT NULL,
    normalized_work_name text NOT NULL,
    unit_price integer NOT NULL CHECK (unit_price >= 0),
    quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
    amount integer NOT NULL CHECK (amount >= 0),
    memo text,
    extra jsonb,
    sort_order integer NOT NULL DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 3. set_details（セット詳細）
CREATE TABLE set_details (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    line_item_id uuid NOT NULL REFERENCES line_items(id) ON DELETE CASCADE,
    owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    detail_name text NOT NULL,
    normalized_detail_name text NOT NULL,
    sort_order integer NOT NULL DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 4. task_master（作業マスタ）
CREATE TABLE task_master (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    canonical_name text NOT NULL,
    normalized_name text NOT NULL,
    category text,
    default_price integer CHECK (default_price >= 0),
    is_active boolean NOT NULL DEFAULT true,
    usage_count integer NOT NULL DEFAULT 0,
    last_used_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 5. task_aliases（作業別名）
CREATE TABLE task_aliases (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    task_master_id uuid NOT NULL REFERENCES task_master(id) ON DELETE CASCADE,
    owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    alias_name text NOT NULL,
    normalized_alias_name text NOT NULL,
    usage_count integer NOT NULL DEFAULT 0,
    last_used_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 6. line_item_attrs（EAV拡張属性）
CREATE TABLE line_item_attrs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    line_item_id uuid NOT NULL REFERENCES line_items(id) ON DELETE CASCADE,
    owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    attr_key text NOT NULL,
    attr_value text,
    attr_type text NOT NULL DEFAULT 'text' 
        CHECK (attr_type IN ('text', 'number', 'boolean', 'date', 'json')),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- =====================================================
-- インデックス
-- =====================================================

-- 基本検索用インデックス
CREATE INDEX idx_invoices_owner_billing_date ON invoices (owner_id, billing_date DESC);
CREATE INDEX idx_invoices_owner_status_total ON invoices (owner_id, status, total_amount);
CREATE INDEX idx_invoices_year_month ON invoices (owner_id, invoice_year, invoice_month);

CREATE INDEX idx_line_items_owner_invoice ON line_items (owner_id, invoice_id);
CREATE INDEX idx_line_items_owner_created_amount ON line_items (owner_id, created_at DESC, amount);
CREATE INDEX idx_line_items_invoice_sort ON line_items (invoice_id, sort_order);

CREATE INDEX idx_set_details_line_item ON set_details (line_item_id, sort_order);
CREATE INDEX idx_set_details_owner ON set_details (owner_id);

-- 作業名検索用インデックス（全文検索）
CREATE INDEX idx_line_items_normalized_work_name ON line_items USING gin (normalized_work_name gin_trgm_ops);
CREATE INDEX idx_task_master_normalized_name ON task_master USING gin (normalized_name gin_trgm_ops);
CREATE INDEX idx_task_aliases_normalized_name ON task_aliases USING gin (normalized_alias_name gin_trgm_ops);

-- マスタ・頻度用インデックス
CREATE INDEX idx_task_master_owner_usage ON task_master (owner_id, usage_count DESC, last_used_at DESC);
CREATE INDEX idx_task_master_owner_active ON task_master (owner_id, is_active, normalized_name);
CREATE INDEX idx_task_aliases_master_usage ON task_aliases (task_master_id, usage_count DESC, last_used_at DESC);
CREATE INDEX idx_task_aliases_owner ON task_aliases (owner_id, normalized_alias_name);

-- EAV用インデックス
CREATE INDEX idx_line_item_attrs_line_item ON line_item_attrs (line_item_id, attr_key);
CREATE INDEX idx_line_item_attrs_owner_key ON line_item_attrs (owner_id, attr_key);

-- ユニーク制約
CREATE UNIQUE INDEX idx_task_master_owner_normalized ON task_master (owner_id, normalized_name) WHERE is_active = true;
CREATE UNIQUE INDEX idx_line_item_attrs_unique ON line_item_attrs (line_item_id, attr_key);

-- =====================================================
-- updated_at自動更新トリガー
-- =====================================================

CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_line_items_updated_at
    BEFORE UPDATE ON line_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_set_details_updated_at
    BEFORE UPDATE ON set_details
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_task_master_updated_at
    BEFORE UPDATE ON task_master
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_task_aliases_updated_at
    BEFORE UPDATE ON task_aliases
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_line_item_attrs_updated_at
    BEFORE UPDATE ON line_item_attrs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 正規化名自動設定トリガー
-- =====================================================

-- line_items の normalized_work_name 自動設定
CREATE OR REPLACE FUNCTION set_normalized_work_name()
RETURNS TRIGGER AS $$
BEGIN
    NEW.normalized_work_name = normalize_simple(NEW.work_name);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_normalized_work_name
    BEFORE INSERT OR UPDATE ON line_items
    FOR EACH ROW
    WHEN (NEW.work_name IS DISTINCT FROM OLD.work_name OR OLD.work_name IS NULL)
    EXECUTE FUNCTION set_normalized_work_name();

-- set_details の normalized_detail_name 自動設定
CREATE OR REPLACE FUNCTION set_normalized_detail_name()
RETURNS TRIGGER AS $$
BEGIN
    NEW.normalized_detail_name = normalize_simple(NEW.detail_name);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_normalized_detail_name
    BEFORE INSERT OR UPDATE ON set_details
    FOR EACH ROW
    WHEN (NEW.detail_name IS DISTINCT FROM OLD.detail_name OR OLD.detail_name IS NULL)
    EXECUTE FUNCTION set_normalized_detail_name();

-- task_master の normalized_name 自動設定
CREATE OR REPLACE FUNCTION set_normalized_canonical_name()
RETURNS TRIGGER AS $$
BEGIN
    NEW.normalized_name = normalize_simple(NEW.canonical_name);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_normalized_canonical_name
    BEFORE INSERT OR UPDATE ON task_master
    FOR EACH ROW
    WHEN (NEW.canonical_name IS DISTINCT FROM OLD.canonical_name OR OLD.canonical_name IS NULL)
    EXECUTE FUNCTION set_normalized_canonical_name();

-- task_aliases の normalized_alias_name 自動設定
CREATE OR REPLACE FUNCTION set_normalized_alias_name()
RETURNS TRIGGER AS $$
BEGIN
    NEW.normalized_alias_name = normalize_simple(NEW.alias_name);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_normalized_alias_name
    BEFORE INSERT OR UPDATE ON task_aliases
    FOR EACH ROW
    WHEN (NEW.alias_name IS DISTINCT FROM OLD.alias_name OR OLD.alias_name IS NULL)
    EXECUTE FUNCTION set_normalized_alias_name();

-- =====================================================
-- RLS（Row Level Security）ポリシー
-- =====================================================

-- RLS有効化
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE set_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_aliases ENABLE ROW LEVEL SECURITY;
ALTER TABLE line_item_attrs ENABLE ROW LEVEL SECURITY;

-- invoices ポリシー
CREATE POLICY "Users can manage their own invoices" ON invoices
    FOR ALL USING (owner_id = auth.uid());

-- line_items ポリシー
CREATE POLICY "Users can manage their own line items" ON line_items
    FOR ALL USING (owner_id = auth.uid());

-- set_details ポリシー
CREATE POLICY "Users can manage their own set details" ON set_details
    FOR ALL USING (owner_id = auth.uid());

-- task_master ポリシー
CREATE POLICY "Users can manage their own task master" ON task_master
    FOR ALL USING (owner_id = auth.uid());

-- task_aliases ポリシー
CREATE POLICY "Users can manage their own task aliases" ON task_aliases
    FOR ALL USING (owner_id = auth.uid());

-- line_item_attrs ポリシー
CREATE POLICY "Users can manage their own line item attributes" ON line_item_attrs
    FOR ALL USING (owner_id = auth.uid());

-- =====================================================
-- 便利関数
-- =====================================================

-- 使用統計更新関数
CREATE OR REPLACE FUNCTION update_task_usage(
    p_owner_id uuid,
    p_work_name text
)
RETURNS void AS $$
DECLARE
    v_normalized_name text;
    v_master_id uuid;
BEGIN
    v_normalized_name := normalize_simple(p_work_name);
    
    -- マスタレコードを検索または作成
    INSERT INTO task_master (owner_id, canonical_name, normalized_name, usage_count, last_used_at)
    VALUES (p_owner_id, p_work_name, v_normalized_name, 1, now())
    ON CONFLICT (owner_id, normalized_name)
    DO UPDATE SET
        usage_count = task_master.usage_count + 1,
        last_used_at = now()
    RETURNING id INTO v_master_id;
    
    -- 別名レコードも更新
    INSERT INTO task_aliases (task_master_id, owner_id, alias_name, normalized_alias_name, usage_count, last_used_at)
    VALUES (v_master_id, p_owner_id, p_work_name, v_normalized_name, 1, now())
    ON CONFLICT (task_master_id, normalized_alias_name)
    DO UPDATE SET
        usage_count = task_aliases.usage_count + 1,
        last_used_at = now();
END;
$$ LANGUAGE plpgsql;

-- 請求書金額自動計算関数
CREATE OR REPLACE FUNCTION recalculate_invoice_totals(p_invoice_id uuid)
RETURNS void AS $$
DECLARE
    v_subtotal integer;
    v_tax_amount integer;
    v_total_amount integer;
BEGIN
    -- 明細合計を計算
    SELECT COALESCE(SUM(amount), 0)
    INTO v_subtotal
    FROM line_items
    WHERE invoice_id = p_invoice_id;
    
    -- 消費税計算（10%、切り捨て）
    v_tax_amount := FLOOR(v_subtotal * 0.1);
    v_total_amount := v_subtotal + v_tax_amount;
    
    -- 請求書を更新
    UPDATE invoices
    SET 
        subtotal = v_subtotal,
        tax_amount = v_tax_amount,
        total_amount = v_total_amount,
        updated_at = now()
    WHERE id = p_invoice_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 明細変更時の自動計算トリガー
-- =====================================================

CREATE OR REPLACE FUNCTION trigger_recalculate_invoice()
RETURNS TRIGGER AS $$
BEGIN
    -- INSERT/UPDATE の場合
    IF TG_OP IN ('INSERT', 'UPDATE') THEN
        PERFORM recalculate_invoice_totals(NEW.invoice_id);
        PERFORM update_task_usage(NEW.owner_id, NEW.work_name);
        RETURN NEW;
    END IF;
    
    -- DELETE の場合
    IF TG_OP = 'DELETE' THEN
        PERFORM recalculate_invoice_totals(OLD.invoice_id);
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_line_items_recalculate
    AFTER INSERT OR UPDATE OR DELETE ON line_items
    FOR EACH ROW
    EXECUTE FUNCTION trigger_recalculate_invoice();

-- =====================================================
-- 初期データ挿入（テスト用）
-- =====================================================

-- この部分は本番環境では削除してください
/*
INSERT INTO task_master (owner_id, canonical_name, category, default_price, usage_count, last_used_at)
VALUES 
    (auth.uid(), 'Webサイト制作', 'Web開発', 100000, 5, now()),
    (auth.uid(), 'システム保守', 'メンテナンス', 50000, 3, now()),
    (auth.uid(), 'データベース設計', 'システム設計', 80000, 2, now()),
    (auth.uid(), 'SEO対策', 'マーケティング', 30000, 4, now());
    
INSERT INTO task_aliases (task_master_id, owner_id, alias_name, usage_count, last_used_at)
SELECT 
    tm.id,
    tm.owner_id,
    tm.canonical_name,
    tm.usage_count,
    tm.last_used_at
FROM task_master tm
WHERE tm.owner_id = auth.uid();
*/

-- =====================================================
-- パフォーマンス統計収集
-- =====================================================

-- 統計情報の更新を有効化
ANALYZE invoices;
ANALYZE line_items;
ANALYZE set_details;
ANALYZE task_master;
ANALYZE task_aliases;
ANALYZE line_item_attrs;

-- =====================================================
-- コメント
-- =====================================================

COMMENT ON TABLE invoices IS '請求書ヘッダー情報';
COMMENT ON TABLE line_items IS '請求書明細行（個別作業・セット作業）';
COMMENT ON TABLE set_details IS 'セット作業の詳細内訳';
COMMENT ON TABLE task_master IS '作業名マスタ（正規名）';
COMMENT ON TABLE task_aliases IS '作業名別名・表記ゆれ対応';
COMMENT ON TABLE line_item_attrs IS 'EAV拡張属性（将来用）';

COMMENT ON FUNCTION normalize_simple(text) IS 'NFKC正規化＋記号除去による作業名正規化';
COMMENT ON FUNCTION update_task_usage(uuid, text) IS '作業使用統計の自動更新';
COMMENT ON FUNCTION recalculate_invoice_totals(uuid) IS '請求書金額の自動再計算';