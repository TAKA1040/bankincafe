/**
 * パス: src/app/auth/callback/route.ts
 * 目的: Google認証後のコールバック処理（認証コードをセッションに交換）
 */
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const error_param = searchParams.get('error')
    const error_description = searchParams.get('error_description')
    const authError = searchParams.get('authError')
    
    console.log('[CALLBACK] Request URL:', request.url)
    console.log('[CALLBACK] Code present:', !!code)
    console.log('[CALLBACK] Error param:', error_param)
    console.log('[CALLBACK] Error description:', error_description)
    console.log('[CALLBACK] Auth Error:', authError)

    // authErrorパラメータの処理
    if (authError) {
      try {
        const decodedAuthError = decodeURIComponent(authError)
        console.log('[CALLBACK] Decoded auth error:', decodedAuthError)
        return NextResponse.redirect(`${origin}/auth/auth-code-error?error=auth_channel_error&description=${encodeURIComponent('認証チャンネルエラーが発生しました')}&details=${encodeURIComponent(decodedAuthError)}`)
      } catch (decodeError) {
        console.error('[CALLBACK] Failed to decode authError:', decodeError)
      }
    }

    // Google認証でエラーが返された場合
    if (error_param) {
      console.error('[CALLBACK] OAuth error:', error_param, error_description)
      return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent(error_param)}&description=${encodeURIComponent(error_description || '')}`)
    }

    if (code) {
      console.log('[CALLBACK] Exchanging code for session...')
      const supabase = await createClient()
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (!error && data.session) {
        console.log('[CALLBACK] Session exchange successful, user:', data.user?.email)
        const next = searchParams.get('next') ?? '/'
        return NextResponse.redirect(`${origin}${next}`)
      } else {
        console.error('[CALLBACK] Session exchange failed:', error)
        return NextResponse.redirect(`${origin}/auth/auth-code-error?error=session_exchange_failed&description=${encodeURIComponent(error?.message || 'Unknown error')}`)
      }
    }
    
    console.error('[CALLBACK] No code parameter found')
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=no_code&description=Authorization code not found`)
  } catch (err) {
    console.error('[CALLBACK] Unexpected error:', err)
    return NextResponse.redirect(`${new URL(request.url).origin}/auth/auth-code-error?error=unexpected&description=${encodeURIComponent(String(err))}`)
  }
}