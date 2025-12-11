-- 顧客カテゴリのCHECK制約を緩和
-- その他顧客を顧客カテゴリに昇格できるようにする

-- 既存のCHECK制約を削除
ALTER TABLE public.invoices DROP CONSTRAINT IF EXISTS invoices_customer_category_check;

-- 新しい制約: 空文字やNULLを防ぐだけの緩い制約
ALTER TABLE public.invoices ADD CONSTRAINT invoices_customer_category_check
  CHECK (customer_category IS NOT NULL AND customer_category != '');

-- コメント更新
COMMENT ON COLUMN public.invoices.customer_category IS '顧客カテゴリ（動的に追加可能）';

SELECT '✅ Customer category constraint relaxed' as result;
