-- Migration: add payment-related fields to invoices
-- Description: Adds payment_date and auxiliary fields for order/registration/partial payment
-- Safe to run multiple times with IF NOT EXISTS guards

BEGIN;

ALTER TABLE IF EXISTS public.invoices
  ADD COLUMN IF NOT EXISTS payment_date date,
  ADD COLUMN IF NOT EXISTS order_number text,
  ADD COLUMN IF NOT EXISTS registration_number text,
  ADD COLUMN IF NOT EXISTS order_id text,
  ADD COLUMN IF NOT EXISTS partial_payment_amount numeric;

-- Helpful indexes
CREATE INDEX IF NOT EXISTS invoices_payment_status_idx ON public.invoices (payment_status);
CREATE INDEX IF NOT EXISTS invoices_payment_date_idx ON public.invoices (payment_date);

COMMIT;
