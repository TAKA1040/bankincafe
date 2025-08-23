/**
 * パス: src/lib/supabase/client.ts
 * 目的: Supabaseブラウザクライアント（クライアントコンポーネント用）
 */
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}