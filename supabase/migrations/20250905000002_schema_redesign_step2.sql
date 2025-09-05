-- Schema Redesign Migration - Step 2: Column Removals and Cleanup
-- Date: 2025-09-05
-- 重要: このマイグレーションを実行する前にデータ移行を完了してください

BEGIN;

-- =====================================
-- 1. データ移行確認のための事前チェック
-- =====================================

-- invoice_paymentsテーブルが存在し、データが移行されているかを確認
DO $$
BEGIN
    -- invoice_paymentsテーブルの存在確認
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables 
                   WHERE table_name = 'invoice_payments' AND table_schema = 'public') THEN
        RAISE EXCEPTION 'invoice_payments table does not exist. Run step 1 migration first.';
    END IF;
    
    -- work_item_positionsテーブルの存在確認
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables 
                   WHERE table_name = 'work_item_positions' AND table_schema = 'public') THEN
        RAISE EXCEPTION 'work_item_positions table does not exist. Run step 1 migration first.';
    END IF;
    
    RAISE NOTICE 'Pre-migration checks passed. Proceeding with column removals.';
END$$;

-- =====================================
-- 2. 既存データのバックアップ（削除前の安全措置）
-- =====================================

-- payment_dateとpartial_payment_amountの一時バックアップ
CREATE TEMP TABLE temp_payment_backup AS
SELECT 
    invoice_id,
    payment_date,
    partial_payment_amount
FROM public.invoices 
WHERE payment_date IS NOT NULL OR partial_payment_amount IS NOT NULL;

-- invoice_line_items_splitのpositionデータの一時バックアップ
CREATE TEMP TABLE temp_position_backup AS
SELECT 
    id as split_item_id,
    position
FROM public.invoice_line_items_split 
WHERE position IS NOT NULL AND position != '';

-- =====================================
-- 3. invoicesテーブルからの不要カラム削除
-- =====================================

-- payment_dateカラムを削除（invoice_paymentsテーブルに移管）
ALTER TABLE public.invoices DROP COLUMN IF EXISTS payment_date;

-- partial_payment_amountカラムを削除（invoice_paymentsテーブルに移管）
ALTER TABLE public.invoices DROP COLUMN IF EXISTS partial_payment_amount;

-- =====================================
-- 4. invoice_line_items_splitからのpositionカラム削除
-- =====================================

-- positionカラムを削除（work_item_positionsテーブルに移管）
ALTER TABLE public.invoice_line_items_split DROP COLUMN IF EXISTS position;

-- =====================================
-- 5. バックアップテーブルからの緊急データ移行
-- =====================================

-- もし入金データが未移行の場合の緊急移行処理
INSERT INTO public.invoice_payments (invoice_id, payment_date, payment_amount, notes)
SELECT 
    invoice_id,
    payment_date,
    COALESCE(partial_payment_amount, 0) as payment_amount,
    '緊急移行データ - 確認要' as notes
FROM temp_payment_backup
WHERE NOT EXISTS (
    SELECT 1 FROM public.invoice_payments p 
    WHERE p.invoice_id = temp_payment_backup.invoice_id
)
AND (payment_date IS NOT NULL OR partial_payment_amount > 0);

-- もし位置データが未移行の場合の緊急移行処理
INSERT INTO public.work_item_positions (split_item_id, position)
SELECT 
    split_item_id,
    TRIM(unnest(string_to_array(position, '|'))) as position
FROM temp_position_backup
WHERE NOT EXISTS (
    SELECT 1 FROM public.work_item_positions p 
    WHERE p.split_item_id = temp_position_backup.split_item_id
)
AND position IS NOT NULL AND position != '';

-- =====================================
-- 6. 削除されたカラムのインデックス確認とクリーンアップ
-- =====================================

-- 削除されたカラムに関連するインデックスがあれば削除
DROP INDEX IF EXISTS public.invoices_payment_date_idx;
DROP INDEX IF EXISTS public.idx_invoices_payment_date;

-- =====================================
-- 7. データ整合性の確認
-- =====================================

-- 移行結果の報告
DO $$
DECLARE
    backup_payment_count INTEGER;
    migrated_payment_count INTEGER;
    backup_position_count INTEGER;
    migrated_position_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO backup_payment_count FROM temp_payment_backup;
    SELECT COUNT(*) INTO migrated_payment_count FROM public.invoice_payments;
    SELECT COUNT(*) INTO backup_position_count FROM temp_position_backup;  
    SELECT COUNT(*) INTO migrated_position_count FROM public.work_item_positions;
    
    RAISE NOTICE '=== Migration Step 2 Results ===';
    RAISE NOTICE 'Payment data - Backup: %, Migrated: %', backup_payment_count, migrated_payment_count;
    RAISE NOTICE 'Position data - Backup: %, Migrated: %', backup_position_count, migrated_position_count;
    RAISE NOTICE '================================';
END$$;

-- =====================================
-- 8. 更新されたテーブルのコメント追加
-- =====================================

COMMENT ON COLUMN public.invoices.invoice_type IS '請求書種別 (standard/credit_note) - payment関連カラム削除済み';

COMMIT;

-- 検証クエリ  
SELECT 'Step 2 Migration Completed - Column removals and cleanup done' as result;