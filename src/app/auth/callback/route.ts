/**
 * パス: src/app/auth/callback/route.ts
 * 目的: Supabase OAuth認証後のコールバック処理（シンプル実装）
 */
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  console.log('[CALLBACK] Processing OAuth callback')
  console.log('[CALLBACK] Code present:', !!code)
  console.log('[CALLBACK] Origin:', origin)

  if (code) {
    const supabase = await createClient()
    
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('[CALLBACK] Session exchange error:', error)
        return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${error.message}`)
      }
      
      if (data.session) {
        console.log('[CALLBACK] Authentication successful for user:', data.user?.email)
        return NextResponse.redirect(`${origin}/`)
      }
    } catch (err) {
      console.error('[CALLBACK] Unexpected error during session exchange:', err)
      return NextResponse.redirect(`${origin}/auth/auth-code-error?error=unexpected_error`)
    }
  }

  console.error('[CALLBACK] No authorization code found')
  return NextResponse.redirect(`${origin}/auth/auth-code-error?error=no_code`)
}