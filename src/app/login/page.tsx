/**
 * パス: src/app/login/page.tsx
 * 目的: Googleログインページ（Supabase Auth使用）
 */
'use client'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    try {
      const redirectURL = `${location.origin}/auth/callback`
      console.log('[LOGIN] Using redirect URL:', redirectURL)
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { 
          redirectTo: redirectURL,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        },
      })
      
      if (error) {
        console.error('[LOGIN] Auth error:', error)
        alert(`ログインエラー: ${error.message}`)
      }
    } catch (err) {
      console.error('[LOGIN] Unexpected error:', err)
      alert('予期しないエラーが発生しました')
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