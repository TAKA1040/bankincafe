-- =====================================================
-- 作業入力ツール - アプリケーション用ビュー定義
-- =====================================================

-- =====================================================
-- 安定ビュー（アプリケーションインターフェース）
-- =====================================================

-- 1. v_invoices_stable - 請求書一覧用安定ビュー
-- 用途: 請求書一覧ページでの基本情報表示 + 作業項目数の集計
-- 表示内容: 請求書基本情報、明細数、個別/セット作業の内訳
CREATE VIEW v_invoices_stable AS
SELECT 
    i.id,
    i.invoice_year,
    i.invoice_month,
    i.billing_date,
    i.customer_category,
    i.customer_name,
    i.subject,
    i.registration_number,
    i.order_number,
    i.internal_order_number,
    i.subtotal,
    i.tax_amount,
    i.total_amount,
    i.memo,
    i.status,
    i.created_at,
    i.updated_at,
    -- 集計情報
    COUNT(li.id) as item_count,
    COUNT(CASE WHEN li.item_type = 'set' THEN 1 END) as set_count,
    COUNT(CASE WHEN li.item_type = 'individual' THEN 1 END) as individual_count
FROM invoices i
LEFT JOIN line_items li ON i.id = li.invoice_id
WHERE i.owner_id = auth.uid()
GROUP BY i.id, i.invoice_year, i.invoice_month, i.billing_date, 
         i.customer_category, i.customer_name, i.subject, 
         i.registration_number, i.order_number, i.internal_order_number,
         i.subtotal, i.tax_amount, i.total_amount, i.memo, i.status,
         i.created_at, i.updated_at;

COMMENT ON VIEW v_invoices_stable IS 'アプリケーション用請求書安定ビュー（将来の列追加に対応）';

-- 使用例: SELECT * FROM v_invoices_stable WHERE billing_date >= '2024-01-01' ORDER BY created_at DESC;

-- 2. v_line_items_with_set_details - 明細＋セット詳細展開ビュー
-- 用途: 請求書詳細表示でセット作業をツリー構造で展開
-- 表示内容: 作業項目 + セット詳細を階層表示（「└ 詳細項目」形式）
CREATE VIEW v_line_items_with_set_details AS
SELECT 
    li.id as line_item_id,
    li.invoice_id,
    li.item_type,
    li.work_name,
    li.unit_price,
    li.quantity,
    li.amount,
    li.memo as line_memo,
    li.sort_order as line_sort_order,
    li.created_at as line_created_at,
    -- セット詳細情報
    sd.id as set_detail_id,
    sd.detail_name,
    sd.sort_order as detail_sort_order,
    -- 展開用の表示情報
    CASE 
        WHEN li.item_type = 'individual' THEN li.work_name
        WHEN li.item_type = 'set' AND sd.detail_name IS NOT NULL THEN 
            '　└ ' || sd.detail_name
        ELSE li.work_name
    END as display_name,
    CASE 
        WHEN li.item_type = 'individual' THEN li.amount
        WHEN li.item_type = 'set' AND sd.id IS NULL THEN li.amount
        ELSE NULL
    END as display_amount
FROM line_items li
LEFT JOIN set_details sd ON li.id = sd.line_item_id 
    AND li.item_type = 'set'
WHERE li.owner_id = auth.uid()
ORDER BY li.sort_order, sd.sort_order NULLS FIRST;

COMMENT ON VIEW v_line_items_with_set_details IS '明細とセット詳細の展開表示用ビュー';

-- 使用例: SELECT display_name, display_amount FROM v_line_items_with_set_details WHERE invoice_id = $1;

-- 3. v_task_suggestions - 作業名サジェスト用ビュー
-- 用途: 請求書作成画面での作業名オートコンプリート機能
-- 表示内容: 正規名 + 別名を統合して使用頻度順でサジェスト
CREATE VIEW v_task_suggestions AS
SELECT 
    tm.id as master_id,
    tm.canonical_name,
    tm.normalized_name,
    tm.category,
    tm.default_price,
    tm.usage_count as master_usage_count,
    tm.last_used_at as master_last_used_at,
    -- 別名情報
    ta.id as alias_id,
    ta.alias_name,
    ta.normalized_alias_name,
    ta.usage_count as alias_usage_count,
    ta.last_used_at as alias_last_used_at,
    -- 表示用統合情報
    COALESCE(ta.alias_name, tm.canonical_name) as display_name,
    COALESCE(ta.normalized_alias_name, tm.normalized_name) as search_name,
    (tm.usage_count + COALESCE(ta.usage_count, 0)) as total_usage_count,
    GREATEST(tm.last_used_at, COALESCE(ta.last_used_at, tm.last_used_at)) as latest_used_at
FROM task_master tm
LEFT JOIN task_aliases ta ON tm.id = ta.task_master_id
WHERE tm.owner_id = auth.uid() 
    AND tm.is_active = true
ORDER BY total_usage_count DESC, latest_used_at DESC NULLS LAST;

COMMENT ON VIEW v_task_suggestions IS '作業名サジェスト・オートコンプリート用統合ビュー';

-- 使用例: SELECT display_name, default_price FROM v_task_suggestions WHERE search_name LIKE '%web%' LIMIT 10;

-- 4. v_sales_summary_by_month - 月別売上集計ビュー
-- 用途: 売上管理ページでの月別統計ダッシュボード
-- 表示内容: 月別の売上金額、請求書数、ステータス別集計
CREATE VIEW v_sales_summary_by_month AS
SELECT 
    i.invoice_year,
    i.invoice_month,
    COUNT(i.id) as invoice_count,
    SUM(i.subtotal) as total_subtotal,
    SUM(i.tax_amount) as total_tax_amount,
    SUM(i.total_amount) as total_amount,
    AVG(i.total_amount) as avg_amount,
    MIN(i.total_amount) as min_amount,
    MAX(i.total_amount) as max_amount,
    -- 状態別集計
    COUNT(CASE WHEN i.status = 'draft' THEN 1 END) as draft_count,
    COUNT(CASE WHEN i.status = 'finalized' THEN 1 END) as finalized_count,
    COUNT(CASE WHEN i.status = 'sent' THEN 1 END) as sent_count,
    COUNT(CASE WHEN i.status = 'paid' THEN 1 END) as paid_count,
    -- 売上（確定以上）
    SUM(CASE WHEN i.status IN ('finalized', 'sent', 'paid') 
             THEN i.total_amount ELSE 0 END) as confirmed_sales,
    -- 回収済み
    SUM(CASE WHEN i.status = 'paid' 
             THEN i.total_amount ELSE 0 END) as collected_sales
FROM invoices i
WHERE i.owner_id = auth.uid()
GROUP BY i.invoice_year, i.invoice_month
ORDER BY i.invoice_year DESC, i.invoice_month DESC;

COMMENT ON VIEW v_sales_summary_by_month IS '月別売上・ステータス集計ビュー';

-- 使用例: SELECT * FROM v_sales_summary_by_month WHERE invoice_year = 2024 ORDER BY invoice_month;

-- 5. v_work_price_history - 作業価格履歴ビュー（旧work-searchページ用）
-- 用途: 作業検索ページでの価格履歴比較機能
-- 表示内容: 過去の同一作業の価格変動、顧客別価格、請求書情報
CREATE VIEW v_work_price_history AS
SELECT 
    li.id,
    li.work_name,
    li.normalized_work_name,
    li.unit_price,
    li.quantity,
    li.amount,
    li.item_type,
    li.memo as work_memo,
    -- 請求書情報
    i.id as invoice_id,
    i.billing_date,
    i.customer_name,
    i.subject,
    i.registration_number,
    i.status as invoice_status,
    -- 請求書番号（連番）
    ROW_NUMBER() OVER (
        PARTITION BY i.owner_id 
        ORDER BY i.created_at
    ) as invoice_number,
    -- セット詳細（配列で取得）
    CASE WHEN li.item_type = 'set' THEN
        ARRAY(
            SELECT sd.detail_name 
            FROM set_details sd 
            WHERE sd.line_item_id = li.id 
            ORDER BY sd.sort_order
        )
    ELSE NULL
    END as set_details_array,
    -- 価格統計用
    li.created_at as work_created_at
FROM line_items li
JOIN invoices i ON li.invoice_id = i.id
WHERE li.owner_id = auth.uid()
ORDER BY li.created_at DESC;

COMMENT ON VIEW v_work_price_history IS '作業価格履歴検索用ビュー（work-searchページ対応）';

-- 使用例: SELECT * FROM v_work_price_history WHERE normalized_work_name = normalize_simple('Webサイト制作') ORDER BY billing_date DESC;

-- 6. v_customer_categories - 動的顧客カテゴリービュー
-- 用途: 顧客管理ページでの顧客別売上統計表示
-- 表示内容: 顧客カテゴリー別の売上実績、取引頻度、ランキング
CREATE VIEW v_customer_categories AS
WITH customer_stats AS (
    SELECT 
        i.customer_category,
        i.customer_name,
        COUNT(*) as invoice_count,
        SUM(i.total_amount) as total_sales,
        MAX(i.billing_date) as last_invoice_date,
        MIN(i.billing_date) as first_invoice_date
    FROM invoices i
    WHERE i.owner_id = auth.uid()
    GROUP BY i.customer_category, i.customer_name
)
SELECT 
    cs.customer_category,
    cs.customer_name,
    cs.invoice_count,
    cs.total_sales,
    cs.last_invoice_date,
    cs.first_invoice_date,
    -- ランキング
    ROW_NUMBER() OVER (ORDER BY cs.total_sales DESC) as sales_rank,
    ROW_NUMBER() OVER (ORDER BY cs.invoice_count DESC) as frequency_rank
FROM customer_stats cs
ORDER BY cs.total_sales DESC;

COMMENT ON VIEW v_customer_categories IS '顧客カテゴリー統計ビュー';

-- 使用例: SELECT * FROM v_customer_categories ORDER BY sales_rank LIMIT 10;

-- =====================================================
-- 検索・分析用ビュー
-- =====================================================

-- 7. v_similar_tasks - 類似作業名検出ビュー
CREATE VIEW v_similar_tasks AS
WITH task_pairs AS (
    SELECT 
        tm1.id as task1_id,
        tm1.canonical_name as task1_name,
        tm1.usage_count as task1_usage,
        tm2.id as task2_id,
        tm2.canonical_name as task2_name,
        tm2.usage_count as task2_usage,
        similarity(tm1.normalized_name, tm2.normalized_name) as similarity_score
    FROM task_master tm1
    CROSS JOIN task_master tm2
    WHERE tm1.id < tm2.id 
        AND tm1.owner_id = auth.uid()
        AND tm2.owner_id = auth.uid()
        AND tm1.is_active = true
        AND tm2.is_active = true
        AND similarity(tm1.normalized_name, tm2.normalized_name) > 0.6
)
SELECT 
    task1_id,
    task1_name,
    task1_usage,
    task2_id,
    task2_name,
    task2_usage,
    similarity_score,
    -- 統合推奨度（使用頻度と類似度の重み付け）
    (similarity_score * 0.7 + 
     LEAST(task1_usage, task2_usage)::float / GREATEST(task1_usage, task2_usage)::float * 0.3
    ) as merge_recommendation_score
FROM task_pairs
WHERE similarity_score > 0.7
ORDER BY merge_recommendation_score DESC, similarity_score DESC;

COMMENT ON VIEW v_similar_tasks IS '類似作業名検出・統合候補提示ビュー';

-- 8. v_performance_metrics - パフォーマンス指標ビュー
CREATE VIEW v_performance_metrics AS
WITH monthly_data AS (
    SELECT 
        DATE_TRUNC('month', i.billing_date) as month,
        COUNT(*) as invoice_count,
        SUM(i.total_amount) as month_sales,
        AVG(i.total_amount) as avg_invoice_amount,
        COUNT(DISTINCT i.customer_name) as unique_customers,
        SUM(li.quantity) as total_work_items
    FROM invoices i
    JOIN line_items li ON i.id = li.invoice_id
    WHERE i.owner_id = auth.uid()
        AND i.status IN ('finalized', 'sent', 'paid')
    GROUP BY DATE_TRUNC('month', i.billing_date)
)
SELECT 
    md.month,
    md.invoice_count,
    md.month_sales,
    md.avg_invoice_amount,
    md.unique_customers,
    md.total_work_items,
    -- 前月比
    LAG(md.month_sales, 1) OVER (ORDER BY md.month) as prev_month_sales,
    CASE 
        WHEN LAG(md.month_sales, 1) OVER (ORDER BY md.month) > 0 THEN
            ROUND((md.month_sales - LAG(md.month_sales, 1) OVER (ORDER BY md.month)) * 100.0 / 
                  LAG(md.month_sales, 1) OVER (ORDER BY md.month), 2)
        ELSE NULL
    END as growth_rate_percent,
    -- 累計
    SUM(md.month_sales) OVER (ORDER BY md.month) as cumulative_sales
FROM monthly_data md
ORDER BY md.month DESC;

COMMENT ON VIEW v_performance_metrics IS '売上パフォーマンス・成長率分析ビュー';

-- =====================================================
-- 便利な検索用ビュー
-- =====================================================

-- 9. v_recent_work_activity - 最近の作業活動ビュー
CREATE VIEW v_recent_work_activity AS
SELECT 
    li.work_name,
    li.normalized_work_name,
    li.unit_price,
    li.item_type,
    i.customer_name,
    i.billing_date,
    i.status,
    li.created_at,
    -- ランキング
    ROW_NUMBER() OVER (
        PARTITION BY li.normalized_work_name 
        ORDER BY li.created_at DESC
    ) as recency_rank,
    -- 頻度情報
    COUNT(*) OVER (PARTITION BY li.normalized_work_name) as frequency_count,
    -- 価格情報
    MIN(li.unit_price) OVER (PARTITION BY li.normalized_work_name) as min_price,
    MAX(li.unit_price) OVER (PARTITION BY li.normalized_work_name) as max_price,
    AVG(li.unit_price) OVER (PARTITION BY li.normalized_work_name) as avg_price
FROM line_items li
JOIN invoices i ON li.invoice_id = i.id
WHERE li.owner_id = auth.uid()
    AND li.created_at >= CURRENT_DATE - INTERVAL '6 months'
ORDER BY li.created_at DESC;

COMMENT ON VIEW v_recent_work_activity IS '最近6ヶ月の作業活動・価格動向ビュー';

-- 10. v_invoice_summary_for_list - 請求書一覧表示用サマリー
CREATE VIEW v_invoice_summary_for_list AS
SELECT 
    i.id,
    -- 請求書番号（#形式）
    '#' || ROW_NUMBER() OVER (
        PARTITION BY i.owner_id 
        ORDER BY i.created_at
    ) as invoice_number,
    i.billing_date,
    i.customer_name,
    i.subject,
    i.total_amount,
    i.status,
    i.created_at,
    -- 明細サマリー
    COUNT(li.id) as total_items,
    COUNT(CASE WHEN li.item_type = 'individual' THEN 1 END) as individual_count,
    COUNT(CASE WHEN li.item_type = 'set' THEN 1 END) as set_count,
    -- 主要作業（最高金額）
    (
        SELECT li2.work_name 
        FROM line_items li2 
        WHERE li2.invoice_id = i.id 
        ORDER BY li2.amount DESC, li2.sort_order 
        LIMIT 1
    ) as main_work_name,
    -- タグ（作業カテゴリー）
    ARRAY(
        SELECT DISTINCT tm.category
        FROM line_items li3
        JOIN task_master tm ON li3.normalized_work_name = tm.normalized_name
        WHERE li3.invoice_id = i.id 
            AND tm.owner_id = i.owner_id
            AND tm.category IS NOT NULL
        ORDER BY tm.category
    ) as work_categories
FROM invoices i
LEFT JOIN line_items li ON i.id = li.invoice_id
WHERE i.owner_id = auth.uid()
GROUP BY i.id, i.billing_date, i.customer_name, i.subject, 
         i.total_amount, i.status, i.created_at
ORDER BY i.created_at DESC;

COMMENT ON VIEW v_invoice_summary_for_list IS '請求書一覧ページ用の表示最適化ビュー';

-- =====================================================
-- マテリアライズド・ビュー（パフォーマンス重視）
-- =====================================================

-- 11. mv_task_statistics - 作業統計（定期更新）
-- CREATE MATERIALIZED VIEW mv_task_statistics AS
-- WITH task_stats AS (
--     SELECT 
--         tm.id,
--         tm.canonical_name,
--         tm.normalized_name,
--         tm.category,
--         tm.usage_count as master_usage_count,
--         COUNT(li.id) as actual_usage_count,
--         AVG(li.unit_price) as avg_price,
--         MIN(li.unit_price) as min_price,
--         MAX(li.unit_price) as max_price,
--         SUM(li.amount) as total_revenue,
--         MAX(li.created_at) as last_actual_use,
--         COUNT(DISTINCT li.invoice_id) as unique_invoices,
--         COUNT(DISTINCT i.customer_name) as unique_customers
--     FROM task_master tm
--     LEFT JOIN line_items li ON tm.normalized_name = li.normalized_work_name
--     LEFT JOIN invoices i ON li.invoice_id = i.id
--     WHERE tm.owner_id = auth.uid() AND tm.is_active = true
--     GROUP BY tm.id, tm.canonical_name, tm.normalized_name, tm.category, tm.usage_count
-- )
-- SELECT 
--     ts.*,
--     -- パーセンタイル
--     PERCENT_RANK() OVER (ORDER BY ts.actual_usage_count) as usage_percentile,
--     PERCENT_RANK() OVER (ORDER BY ts.total_revenue) as revenue_percentile,
--     -- 更新日時
--     now() as refreshed_at
-- FROM task_stats ts
-- ORDER BY ts.actual_usage_count DESC;

-- COMMENT ON MATERIALIZED VIEW mv_task_statistics IS '作業統計マテリアライズド・ビュー（日次更新推奨）';

-- =====================================================
-- ビューのセキュリティ設定
-- =====================================================

-- 各ビューで適切なRLS継承を確認
-- （Supabaseでは自動的にベーステーブルのRLSが適用される）

-- =====================================================
-- インデックスヒント用の補助ビュー
-- =====================================================

-- 12. v_search_optimized - 検索最適化ビュー
CREATE VIEW v_search_optimized AS
SELECT 
    'task_master' as source_table,
    tm.id as record_id,
    tm.canonical_name as display_text,
    tm.normalized_name as search_text,
    tm.category as category,
    tm.default_price as suggested_price,
    tm.usage_count as relevance_score,
    tm.last_used_at as last_used,
    'master' as record_type
FROM task_master tm
WHERE tm.owner_id = auth.uid() AND tm.is_active = true

UNION ALL

SELECT 
    'task_aliases' as source_table,
    ta.id as record_id,
    ta.alias_name as display_text,
    ta.normalized_alias_name as search_text,
    tm.category as category,
    tm.default_price as suggested_price,
    ta.usage_count as relevance_score,
    ta.last_used_at as last_used,
    'alias' as record_type
FROM task_aliases ta
JOIN task_master tm ON ta.task_master_id = tm.id
WHERE ta.owner_id = auth.uid() AND tm.is_active = true

ORDER BY relevance_score DESC, last_used DESC NULLS LAST;

COMMENT ON VIEW v_search_optimized IS '統合検索・オートコンプリート最適化ビュー';

-- =====================================================
-- 定期メンテナンス用関数
-- =====================================================

-- ビューの依存関係更新用関数
CREATE OR REPLACE FUNCTION refresh_statistics_views()
RETURNS void AS $$
BEGIN
    -- マテリアライズド・ビューがある場合の更新処理
    -- REFRESH MATERIALIZED VIEW CONCURRENTLY mv_task_statistics;
    
    -- 統計情報の更新
    ANALYZE invoices;
    ANALYZE line_items;
    ANALYZE task_master;
    ANALYZE task_aliases;
    
    -- ログ出力
    RAISE NOTICE 'Statistics views refreshed at %', now();
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION refresh_statistics_views() IS 'ビュー・統計情報の定期更新関数';

-- =====================================================
-- 使用例・テスト用クエリ
-- =====================================================

/*
-- 使用例1: 請求書一覧の取得
SELECT * FROM v_invoices_stable 
WHERE billing_date >= '2024-01-01' 
ORDER BY billing_date DESC;

-- 使用例2: 作業名サジェスト
SELECT display_name, default_price 
FROM v_task_suggestions 
WHERE search_name LIKE normalize_simple('Web') || '%' 
LIMIT 10;

-- 使用例3: 月別売上サマリー
SELECT * FROM v_sales_summary_by_month 
WHERE invoice_year = 2024;

-- 使用例4: 作業価格履歴
SELECT work_name, customer_name, unit_price, billing_date
FROM v_work_price_history 
WHERE normalized_work_name = normalize_simple('Webサイト制作')
ORDER BY billing_date DESC;

-- 使用例5: 類似作業名の検出
SELECT task1_name, task2_name, similarity_score
FROM v_similar_tasks 
WHERE merge_recommendation_score > 0.8;
*/