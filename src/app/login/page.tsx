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
      
      // デバッグ情報をコンソールと画面に表示
      const debugInfo = {
        'Current URL': location.href,
        'Redirect URL': redirectURL,
        'Google Client ID': process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        'Supabase URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
        'Timestamp': new Date().toISOString()
      }
      
      console.group('🔍 [LOGIN DEBUG] OAuth Flow Details')
      Object.entries(debugInfo).forEach(([key, value]) => {
        console.log(`${key}:`, value)
      })
      console.groupEnd()
      
      // 一時的にアラートでも確認
      alert(`🔍 OAuth Debug Info:\n${JSON.stringify(debugInfo, null, 2)}`)
      
      // メッセージチャンネルエラーを完全に回避するための最適化された設定
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { 
          redirectTo: redirectURL,
          queryParams: {
            prompt: 'select_account',
            access_type: 'offline'
          },
          skipBrowserRedirect: false
        },
      })
      
      // エラー処理
      if (error) {
        console.error('[LOGIN] Auth error:', error)
        alert(`🚨 Auth Error:\n${JSON.stringify(error, null, 2)}`)
        const normalizedError = normalizeAuthError(error)
        window.location.href = `/auth/auth-code-error?error=${normalizedError.code}&description=${encodeURIComponent(normalizedError.message)}&details=${encodeURIComponent(normalizedError.details || '')}`
      } else {
        console.log('🔍 [LOGIN DEBUG] OAuth request initiated successfully')
      }
    } catch (err) {
      console.error('[LOGIN] Unexpected error:', err)
      alert(`🚨 Unexpected Error:\n${JSON.stringify(err, null, 2)}`)
      const normalizedError = normalizeAuthError(err)
      window.location.href = `/auth/auth-code-error?error=${normalizedError.code}&description=${encodeURIComponent(normalizedError.message)}&details=${encodeURIComponent(normalizedError.details || '')}`
    }
  }

  return (
    <div style={{display:'flex',minHeight:'100vh',alignItems:'center',justifyContent:'center'}}>
      <div style={{textAlign:'center', padding:'2rem'}}>
        <h1 style={{marginBottom:'2rem', fontSize:'2rem', fontWeight:'bold'}}>
          鈑金Cafeへようこそ
        </h1>
        <p style={{marginBottom:'2rem', color:'#666'}}>
          管理者: dash201206@gmail.com
        </p>
        
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '2rem',
          fontSize: '14px',
          textAlign: 'left'
        }}>
          <h3 style={{margin: '0 0 0.5rem 0', color: '#dc2626', fontSize: '16px'}}>
            🚨 設定確認が必要です
          </h3>
          <p style={{margin: '0 0 0.5rem 0', color: '#374151'}}>
            <strong>エラー:</strong> redirect_uri_mismatch
          </p>
          <p style={{margin: '0 0 0.5rem 0', color: '#374151'}}>
            <strong>必要なリダイレクトURI:</strong>
          </p>
          <input 
            type="text" 
            readOnly 
            value="https://bankincafe.apaf.me/auth/callback"
            onClick={(e) => {
              e.currentTarget.select()
              navigator.clipboard.writeText('https://bankincafe.apaf.me/auth/callback')
              alert('URLをコピーしました！')
            }}
            style={{
              background: '#f3f4f6',
              padding: '8px',
              borderRadius: '4px',
              fontSize: '12px',
              width: '100%',
              border: '1px solid #d1d5db',
              cursor: 'pointer',
              margin: '4px 0'
            }}
          />
          <p style={{margin: '0.25rem 0', color: '#6b7280', fontSize: '10px'}}>
            ↑ クリックでコピー
          </p>
          <p style={{margin: '0.5rem 0', color: '#374151', fontSize: '12px'}}>
            上記をGoogle Cloud Consoleの承認済みリダイレクトURIに追加してください
          </p>
        </div>
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