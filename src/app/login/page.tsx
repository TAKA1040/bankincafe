/**
 * パス: src/app/login/page.tsx
 * 目的: Googleログインページ（Supabase Auth使用、エラーハンドリング強化）
 */
'use client'
import { createClient } from '@/lib/supabase/client'
import { normalizeAuthError, setupAuthMonitoring } from '@/lib/auth-utils'
import { useEffect } from 'react'

export default function LoginPage() {
  const supabase = createClient()

  // 認証モニタリングの設定
  useEffect(() => {
    const cleanup = setupAuthMonitoring()
    return cleanup
  }, [])

  const handleGoogleLogin = async () => {
    try {
      const redirectURL = `${location.origin}/auth/callback`
      console.log('[LOGIN] Using redirect URL:', redirectURL)
      
      // メッセージチャンネルエラーを防ぐため、同一タブでリダイレクト
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { 
          redirectTo: redirectURL,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account' // 'consent' から変更してポップアップ問題を回避
          },
          skipBrowserRedirect: false, // ポップアップではなく同一タブでリダイレクト
        },
      })
      
      if (error) {
        console.error('[LOGIN] Auth error:', error)
        const normalizedError = normalizeAuthError(error)
        window.location.href = `/auth/auth-code-error?error=${normalizedError.code}&description=${encodeURIComponent(normalizedError.message)}&details=${encodeURIComponent(normalizedError.details || '')}`
      }
    } catch (err) {
      console.error('[LOGIN] Unexpected error:', err)
      const normalizedError = normalizeAuthError(err)
      window.location.href = `/auth/auth-code-error?error=${normalizedError.code}&description=${encodeURIComponent(normalizedError.message)}&details=${encodeURIComponent(normalizedError.details || '')}`
    }
  }

  return (
    <div style={{display:'flex',minHeight:'100vh',alignItems:'center',justifyContent:'center'}}>
      <div style={{textAlign:'center', padding:'2rem'}}>
        <h1 style={{marginBottom:'2rem', fontSize:'2rem', fontWeight:'bold'}}>
          銀行カフェへようこそ
        </h1>
        <p style={{marginBottom:'2rem', color:'#666'}}>
          管理者: dash201206@gmail.com
        </p>
        <button 
          onClick={handleGoogleLogin} 
          style={{
            padding:'12px 24px',
            background:'#4285f4',
            color:'#fff',
            borderRadius:'8px',
            border:'none',
            fontSize:'16px',
            cursor:'pointer',
            boxShadow:'0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          Googleでログイン
        </button>
      </div>
    </div>
  )
}