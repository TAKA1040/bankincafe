/**
 * パス: src/app/debug/page.tsx
 * 目的: OAuth設定デバッグ用ページ
 */
'use client'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function DebugPage() {
  const [config, setConfig] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const debugInfo = {
      'Current URL': window.location.href,
      'Origin': window.location.origin,
      'Protocol': window.location.protocol,
      'Host': window.location.host,
      'Expected Redirect URL': `${window.location.origin}/auth/callback`,
      'Google Client ID': process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      'Supabase URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
      'Supabase Anon Key': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...',
      'User Agent': navigator.userAgent,
      'Timestamp': new Date().toISOString()
    }
    setConfig(debugInfo)
  }, [])

  const testSupabaseConnection = async () => {
    try {
      const { data, error } = await supabase.auth.getSession()
      alert(`Supabase Connection Test:\n${JSON.stringify({ data: !!data, error }, null, 2)}`)
    } catch (err) {
      alert(`Supabase Connection Error:\n${JSON.stringify(err, null, 2)}`)
    }
  }

  const testOAuthConfig = async () => {
    try {
      // OAuth URLを生成してみる
      const redirectURL = `${window.location.origin}/auth/callback`
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { 
          redirectTo: redirectURL,
          skipBrowserRedirect: true // テスト用にブラウザリダイレクトを無効化
        },
      })
      
      alert(`OAuth URL Generation Test:\nURL: ${data?.url || 'No URL generated'}\nError: ${error?.message || 'No error'}`)
    } catch (err) {
      alert(`OAuth Test Error:\n${JSON.stringify(err, null, 2)}`)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem', color: '#dc2626' }}>🔍 OAuth設定デバッグページ</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem', color: '#059669' }}>現在の設定情報</h2>
        <pre style={{ 
          background: '#f3f4f6', 
          padding: '1rem', 
          borderRadius: '8px', 
          overflow: 'auto',
          fontSize: '12px',
          whiteSpace: 'pre-wrap'
        }}>
          {JSON.stringify(config, null, 2)}
        </pre>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem', color: '#7c3aed' }}>テスト機能</h2>
        <button 
          onClick={testSupabaseConnection}
          style={{
            padding: '8px 16px',
            margin: '4px',
            background: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Supabase接続テスト
        </button>
        
        <button 
          onClick={testOAuthConfig}
          style={{
            padding: '8px 16px',
            margin: '4px',
            background: '#10b981',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          OAuth設定テスト
        </button>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem', color: '#dc2626' }}>必要な設定確認項目</h2>
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '1rem' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#dc2626' }}>Google Cloud Console</h3>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '14px' }}>
            承認済みのリダイレクト URI: <code style={{ background: '#f3f4f6', padding: '2px 4px', borderRadius: '4px' }}>
              {config ? config['Expected Redirect URL'] : 'Loading...'}
            </code>
          </p>
          
          <h3 style={{ margin: '1rem 0 0.5rem 0', color: '#dc2626' }}>Supabase Dashboard</h3>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '14px' }}>
            Site URL: <code style={{ background: '#f3f4f6', padding: '2px 4px', borderRadius: '4px' }}>
              {config ? config['Origin'] : 'Loading...'}
            </code>
          </p>
          <p style={{ margin: '0', fontSize: '14px' }}>
            Redirect URLs: <code style={{ background: '#f3f4f6', padding: '2px 4px', borderRadius: '4px' }}>
              {config ? config['Expected Redirect URL'] : 'Loading...'}
            </code>
          </p>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <a 
          href="/login" 
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: '#4285f4',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '8px'
          }}
        >
          ← ログインページに戻る
        </a>
      </div>
    </div>
  )
}