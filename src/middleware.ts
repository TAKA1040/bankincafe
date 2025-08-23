/**
 * パス: src/middleware.ts
 * 目的: Supabaseセッション同期ミドルウェア
 */
import { createClient } from '@/lib/supabase/middleware'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)
  // セッションを同期（Cookie → Supabase）
  await supabase.auth.getSession()
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}