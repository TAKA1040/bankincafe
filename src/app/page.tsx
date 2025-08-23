/**
 * パス: src/app/page.tsx
 * 目的: ログイン完了画面（ルートページ）- ユーザー情報を表示
 */
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const supabase = await createClient()
  
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  // 未ログインの場合はログインページへリダイレクト
  if (error || !user) {
    redirect('/login')
  }

  // 管理者判定
  const isAdmin = user.email === 'dash201206@gmail.com'

  const handleSignOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div style={{display:'flex',minHeight:'100vh',alignItems:'center',justifyContent:'center'}}>
      <div style={{textAlign:'center', padding:'2rem', maxWidth:'500px'}}>
        <h1 style={{marginBottom:'2rem', fontSize:'2.5rem', fontWeight:'bold', color:'#2563eb'}}>
          🎉 ログイン完了！
        </h1>
        
        <div style={{
          background:'#f8fafc', 
          padding:'1.5rem', 
          borderRadius:'12px', 
          marginBottom:'2rem',
          border:'1px solid #e2e8f0'
        }}>
          <h2 style={{marginBottom:'1rem', fontSize:'1.2rem', fontWeight:'600'}}>
            ユーザー情報
          </h2>
          <p style={{marginBottom:'0.5rem'}}>
            <strong>メール:</strong> {user.email}
          </p>
          <p style={{marginBottom:'0.5rem'}}>
            <strong>名前:</strong> {user.user_metadata.full_name || '未設定'}
          </p>
          <p style={{marginBottom:'0.5rem'}}>
            <strong>ロール:</strong> 
            <span style={{
              color: isAdmin ? '#059669' : '#6b7280',
              fontWeight: 'bold',
              marginLeft: '4px'
            }}>
              {isAdmin ? '管理者' : '一般ユーザー'}
            </span>
          </p>
          <p style={{color:'#6b7280', fontSize:'0.9rem'}}>
            <strong>ログイン日時:</strong> {new Date().toLocaleString('ja-JP')}
          </p>
        </div>

        <form action={handleSignOut}>
          <button 
            type="submit"
            style={{
              padding:'12px 24px',
              background:'#ef4444',
              color:'#fff',
              borderRadius:'8px',
              border:'none',
              fontSize:'16px',
              cursor:'pointer',
              boxShadow:'0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            ログアウト
          </button>
        </form>

        <div style={{marginTop:'2rem', padding:'1rem', background:'#fef3c7', borderRadius:'8px'}}>
          <p style={{fontSize:'0.9rem', color:'#92400e'}}>
            <strong>次の開発予定:</strong><br />
            ・プロフィール管理機能<br />
            ・承認フロー（PENDING → APPROVED）<br />
            ・管理者機能
          </p>
        </div>
      </div>
    </div>
  )
}