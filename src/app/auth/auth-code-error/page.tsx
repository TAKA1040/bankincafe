/**
 * パス: src/app/auth/auth-code-error/page.tsx
 * 目的: 認証エラー表示ページ（詳細なデバッグ情報付き）
 */
'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const description = searchParams.get('description')
  const details = searchParams.get('details')

  const getErrorMessage = (errorType: string | null) => {
    switch (errorType) {
      case 'redirect_uri_mismatch':
        return 'コールバックURLの設定に問題があります。Google Cloud ConsoleとSupabaseの設定を確認してください。'
      case 'access_denied':
        return 'Googleログインが拒否されました。もう一度お試しください。'
      case 'session_exchange_failed':
        return 'セッションの交換に失敗しました。Supabaseの設定を確認してください。'
      case 'no_code':
        return '認証コードが見つかりませんでした。'
      case 'auth_channel_error':
        return '認証チャンネルでエラーが発生しました。ポップアップブロッカーを無効にしてもう一度お試しください。'
      case 'login_failed':
        return 'ログイン処理中にエラーが発生しました。'
      case 'unexpected_login_error':
        return '予期しないログインエラーが発生しました。'
      default:
        return '認証処理中にエラーが発生しました。'
    }
  }

  return (
    <div style={{display:'flex',minHeight:'100vh',alignItems:'center',justifyContent:'center'}}>
      <div style={{textAlign:'center', padding:'2rem', maxWidth:'600px'}}>
        <h1 style={{color:'#ef4444', marginBottom:'1rem', fontSize:'2rem'}}>
          認証に失敗しました
        </h1>
        
        <div style={{background:'#fef2f2', padding:'1rem', borderRadius:'8px', marginBottom:'2rem', textAlign:'left'}}>
          <p style={{color:'#991b1b', fontWeight:'bold', marginBottom:'0.5rem'}}>
            エラー詳細:
          </p>
          <p style={{color:'#7f1d1d', marginBottom:'0.5rem'}}>
            <strong>種別:</strong> {error || '不明'}
          </p>
          <p style={{color:'#7f1d1d', marginBottom:'1rem'}}>
            <strong>説明:</strong> {description || getErrorMessage(error)}
          </p>
          {details && (
            <div style={{background:'#f3f4f6', padding:'0.75rem', borderRadius:'6px', marginBottom:'1rem'}}>
              <p style={{color:'#374151', fontSize:'0.85rem'}}>
                <strong>詳細情報:</strong>
              </p>
              <pre style={{color:'#4b5563', fontSize:'0.8rem', whiteSpace:'pre-wrap', margin:'0.5rem 0 0 0'}}>
                {details}
              </pre>
            </div>
          )}
          
          {error === 'redirect_uri_mismatch' && (
            <div style={{background:'#fffbeb', padding:'1rem', borderRadius:'6px', border:'1px solid #fbbf24'}}>
              <p style={{color:'#92400e', fontSize:'0.9rem'}}>
                <strong>対処方法:</strong><br/>
                1. 現在のURL: {typeof window !== 'undefined' ? window.location.origin : 'localhost:3000'}/auth/callback<br/>
                2. Google Cloud Console → 認証情報 → OAuth 2.0 クライアントID → 承認済みのリダイレクト URI に上記URLを追加<br/>
                3. Supabaseダッシュボード → Authentication → URL Configuration → Redirect URLsに上記URLを追加
              </p>
            </div>
          )}
          
          {error === 'auth_channel_error' && (
            <div style={{background:'#fef3c7', padding:'1rem', borderRadius:'6px', border:'1px solid #f59e0b'}}>
              <p style={{color:'#92400e', fontSize:'0.9rem'}}>
                <strong>メッセージチャンネルエラー対処方法:</strong><br/>
                1. ブラウザのポップアップブロッカーを無効にする<br/>
                2. シークレットモード/プライベートモードを試す<br/>
                3. 他のブラウザを試す<br/>
                4. アドブロッカーなどの拡張機能を一時的に無効にする<br/>
                5. ブラウザのキャッシュとCookieをクリアする
              </p>
            </div>
          )}
        </div>
        
        <a 
          href="/login"
          style={{
            display:'inline-block',
            padding:'12px 24px',
            background:'#4285f4',
            color:'#fff',
            textDecoration:'none',
            borderRadius:'8px',
            fontSize:'16px',
            marginRight:'1rem'
          }}
        >
          ログインページに戻る
        </a>
        
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding:'12px 24px',
            background:'#6b7280',
            color:'#fff',
            border:'none',
            borderRadius:'8px',
            fontSize:'16px',
            cursor:'pointer'
          }}
        >
          再読み込み
        </button>
      </div>
    </div>
  )
}

export default function AuthCodeErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  )
}