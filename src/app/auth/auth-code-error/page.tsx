/**
 * パス: src/app/auth/auth-code-error/page.tsx
 * 目的: シンプルな認証エラーページ
 */
'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error') || 'unknown_error'

  return (
    <div style={{display:'flex',minHeight:'100vh',alignItems:'center',justifyContent:'center'}}>
      <div style={{textAlign:'center', padding:'2rem', maxWidth:'500px'}}>
        <h1 style={{marginBottom:'2rem', fontSize:'2rem', fontWeight:'bold', color:'#dc2626'}}>
          🚨 認証エラー
        </h1>
        
        <div style={{
          background:'#fef2f2', 
          border:'1px solid #fecaca', 
          borderRadius:'12px', 
          padding:'1.5rem', 
          marginBottom:'2rem'
        }}>
          <p style={{marginBottom:'1rem', color:'#374151'}}>
            <strong>エラー:</strong> {error}
          </p>
          <p style={{margin:'0', color:'#6b7280'}}>
            認証処理中にエラーが発生しました。再度お試しください。
          </p>
        </div>

        <div style={{display:'flex', gap:'1rem', justifyContent:'center'}}>
          <a 
            href="/login"
            style={{
              display:'inline-block',
              padding:'12px 24px',
              background:'#4285f4',
              color:'#fff',
              textDecoration:'none',
              borderRadius:'8px',
              fontWeight:'500'
            }}
          >
            ログインに戻る
          </a>
        </div>
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