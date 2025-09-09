'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function TestAuthPage() {
  const [authInfo, setAuthInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const handleClearSession = async () => {
    try {
      console.log('🧹 [TestAuth] セッションクリア開始')
      const supabase = createClient()
      
      // Supabaseサインアウト
      await supabase.auth.signOut()
      
      // ローカルストレージクリア
      if (typeof window !== 'undefined') {
        const keysToRemove = Object.keys(localStorage).filter(key => 
          key.includes('supabase') || key.includes('sb-')
        )
        keysToRemove.forEach(key => {
          console.log(`🗑️ [TestAuth] Removing localStorage key: ${key}`)
          localStorage.removeItem(key)
        })
        
        // セッションストレージもクリア
        sessionStorage.clear()
      }
      
      console.log('✅ [TestAuth] セッションクリア完了')
      
      // ページリロード
      window.location.reload()
    } catch (error) {
      console.error('❌ [TestAuth] セッションクリアエラー:', error)
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔍 [TestAuth] 認証テスト開始', new Date().toLocaleString())
        const supabase = createClient()
        
        // まずlocalStorageの内容を確認
        const localStorageKeys = typeof window !== 'undefined' ? Object.keys(localStorage).filter(key => key.includes('supabase') || key.includes('sb-')) : []
        console.log('💾 [TestAuth] LocalStorage Keys:', localStorageKeys)
        
        // 現在のセッション取得
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        console.log('📋 [TestAuth] getSession結果:', { 
          hasSession: !!session, 
          sessionError,
          sessionUserId: session?.user?.id,
          sessionUserEmail: session?.user?.email 
        })
        
        // ユーザー取得
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        console.log('👤 [TestAuth] getUser結果:', { 
          hasUser: !!user, 
          userError,
          userId: user?.id,
          userEmail: user?.email,
          lastSignInAt: user?.last_sign_in_at,
          createdAt: user?.created_at
        })
        
        // セッションとユーザーの整合性チェック
        const sessionUserMatch = session?.user?.id === user?.id
        const emailMatch = session?.user?.email === user?.email
        console.log('🔍 [TestAuth] 整合性チェック:', { sessionUserMatch, emailMatch })
        
        // 環境変数
        const rawAllowedEmails = process.env.NEXT_PUBLIC_ALLOWED_EMAILS
        const allowedEmails = rawAllowedEmails?.replace(/[\r\n]/g, '')
        const allowedEmailsList = allowedEmails?.split(',').map(email => email.trim()).filter(email => email) || []
        
        setAuthInfo({
          storage: {
            localStorageKeys: localStorageKeys,
            localStorageCount: localStorageKeys.length
          },
          session: {
            exists: !!session,
            error: sessionError,
            accessToken: session?.access_token ? `***${session.access_token.substring(0, 10)}...***` : null,
            user: session?.user ? {
              id: session.user.id,
              email: session.user.email,
              provider: session.user.app_metadata?.provider,
              lastSignInAt: session.user.last_sign_in_at,
              createdAt: session.user.created_at
            } : null
          },
          user: {
            exists: !!user,
            error: userError,
            email: user?.email,
            id: user?.id,
            provider: user?.app_metadata?.provider,
            lastSignInAt: user?.last_sign_in_at,
            createdAt: user?.created_at
          },
          consistency: {
            sessionUserMatch,
            emailMatch,
            bothExist: !!session && !!user,
            neitherExist: !session && !user
          },
          environment: {
            rawAllowedEmails,
            cleanedAllowedEmails: allowedEmails,
            allowedEmailsList,
            nodeEnv: process.env.NODE_ENV
          },
          permissions: {
            isDash206: user?.email === 'dash201206@gmail.com',
            isInAllowedList: user?.email && allowedEmailsList.includes(user.email),
            finalIsAdmin: user?.email === 'dash201206@gmail.com' || (user?.email && allowedEmailsList.includes(user.email))
          }
        })
        
      } catch (error) {
        console.error('❌ [TestAuth] エラー:', error)
        setAuthInfo({ error: error instanceof Error ? error.message : 'Unknown error' })
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">認証テスト</h1>
        <p>ロード中...</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">認証テスト結果</h1>
      <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
        {JSON.stringify(authInfo, null, 2)}
      </pre>
      
      <div className="mt-4 space-x-2 flex flex-wrap gap-2">
        <Link href="/login" className="bg-blue-500 text-white px-4 py-2 rounded">
          ログインページへ
        </Link>
        <Link href="/" className="bg-green-500 text-white px-4 py-2 rounded">
          ホームページへ
        </Link>
        <Link href="/auth/pending" className="bg-yellow-500 text-white px-4 py-2 rounded">
          承認待ちページへ
        </Link>
        <button 
          onClick={handleClearSession}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          🧹 セッションクリア
        </button>
        <button 
          onClick={() => window.location.reload()}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          🔄 再読み込み
        </button>
      </div>
    </div>
  )
}