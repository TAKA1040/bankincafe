/**
 * パス: src/app/login/page.tsx  
 * 目的: Googleログインページ（正しいSupabase OAuth実装）
 */
'use client'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    try {
      console.log('🔍 [LOGIN] Starting Google OAuth flow')
      
      // 正しいSupabase OAuth実装
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          }
        }
      })

      if (error) {
        console.error('[LOGIN] OAuth error:', error)
        alert(`認証エラー: ${error.message}`)
      } else {
        console.log('🔍 [LOGIN] OAuth URL generated:', data?.url)
      }
    } catch (err) {
      console.error('[LOGIN] Unexpected error:', err)
      alert(`予期しないエラー: ${String(err)}`)
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