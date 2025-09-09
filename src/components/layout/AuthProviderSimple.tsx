'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Car } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// 認証不要なページのパス
const PUBLIC_PATHS = ['/login', '/auth/pending', '/test-auth']

interface AuthProviderProps {
  children: React.ReactNode
}

export default function AuthProviderSimple({ children }: AuthProviderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  
  console.log('🔄 AuthProviderSimple レンダリング:', { pathname })

  // 認証不要なページかチェック
  const isPublicPath = pathname && PUBLIC_PATHS.some(path => pathname.startsWith(path))

  // 認証が必要なページ - 簡単な認証チェック
  useEffect(() => {
    // 認証不要なページの場合は何もしない
    if (isPublicPath) {
      console.log('✅ パブリックページ表示:', pathname)
      return
    }
    const checkAuth = async () => {
      try {
        console.log('🔍 [AuthProviderSimple] 認証チェック開始', { 
          pathname, 
          timestamp: new Date().toLocaleTimeString()
        })
        
        const supabase = createClient()
        console.log('📡 [AuthProviderSimple] Supabaseクライアント作成完了')
        
        // まずセッションだけ取得してみる
        console.log('📡 [AuthProviderSimple] セッションチェック開始')
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('❌ [AuthProviderSimple] セッション取得エラー:', sessionError)
          setIsAuthenticated(false)
          router.push('/login')
          return
        }
        
        if (!session?.user) {
          console.log('🔒 [AuthProviderSimple] セッションなし - ログインページへ')
          setIsAuthenticated(false)
          router.push('/login')
          return
        }
        
        console.log('📡 [AuthProviderSimple] セッションチェック完了')
        
        // セッションからユーザー情報を取得
        const user = session.user
        const userEmail = user?.email
        
        console.log('🔍 [AuthProviderSimple] セッションユーザー情報:', { 
          userExists: !!user, 
          userEmail: userEmail,
          userId: user?.id,
          provider: user?.app_metadata?.provider,
          timestamp: new Date().toISOString()
        })
        
        if (!userEmail) {
          console.error('❌ [AuthProviderSimple] ユーザーメールアドレスが取得できません')
          await supabase.auth.signOut()
          setIsAuthenticated(false)
          router.push('/login')
          return
        }

        const rawAllowedEmails = process.env.NEXT_PUBLIC_ALLOWED_EMAILS
        const allowedEmails = rawAllowedEmails?.replace(/[\r\n]/g, '')
        const allowedEmailsList = allowedEmails?.split(',').map(email => email.trim()).filter(email => email) || []
        
        const isDash206 = userEmail === 'dash201206@gmail.com'
        const isInAllowedList = allowedEmailsList.includes(userEmail)
        const isAdmin = isDash206 || isInAllowedList
        
        console.log('🔐 [AuthProviderSimple] 管理者権限チェック:', {
          userEmail: userEmail,
          rawAllowedEmails: rawAllowedEmails,
          cleanedAllowedEmails: allowedEmails,
          allowedEmailsList: allowedEmailsList,
          isDash206: isDash206,
          isInAllowedList: isInAllowedList,
          finalIsAdmin: isAdmin,
          strictCheck: userEmail === 'dash201206@gmail.com'
        })

        if (!isAdmin) {
          console.log('❌ [AuthProviderSimple] 許可されていないアカウント:', userEmail, '- 承認待ちページへ')
          console.log('🔍 [AuthProviderSimple] FAILED AUTH DETAILS:', {
            userEmail: userEmail,
            rawAllowedEmails: rawAllowedEmails,
            cleanedAllowedEmails: allowedEmails,
            allowedEmailsList: allowedEmailsList,
            isDash206: isDash206,
            isInAllowedList: isInAllowedList,
            finalIsAdmin: isAdmin,
            timestamp: new Date().toISOString()
          })
          setIsAuthenticated(false)
          router.push('/auth/pending')
          return
        }

        console.log('✅ [AuthProviderSimple] 認証・認可完了:', userEmail, '- メインコンテンツ表示')
        
        // 追加のデバッグ出力
        console.log('🔍 [AuthProviderSimple] FINAL SUCCESS:', {
          userEmail: userEmail,
          isDash206: isDash206,
          isInAllowedList: isInAllowedList,
          finalIsAdmin: isAdmin,
          timestamp: new Date().toISOString()
        })
        
        // 認証成功時に状態を更新
        setIsAuthenticated(true)
      } catch (error) {
        console.error('❌ [AuthProviderSimple] 認証チェック処理エラー:', {
          error: error,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          errorStack: error instanceof Error ? error.stack : undefined,
          timestamp: new Date().toISOString(),
          pathname: pathname
        })
        setIsAuthenticated(false)
        router.push('/login')
      }
    }

    console.log('🚀 [AuthProviderSimple] useEffect実行', { pathname })
    checkAuth()
  }, [router, pathname, isPublicPath])

  // 認証不要なページの場合はそのまま表示
  if (isPublicPath) {
    return <>{children}</>
  }

  // 認証成功時はメインコンテンツを表示
  if (isAuthenticated === true) {
    console.log('🎉 [AuthProviderSimple] メインコンテンツ表示')
    return <>{children}</>
  }

  // 認証チェック中または失敗時はローディング表示
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-primary-600 rounded-full animate-bounce">
            <Car className="h-8 w-8 text-white" />
          </div>
        </div>
        <p className="text-secondary-600 font-medium">認証確認中...</p>
        <p className="text-xs text-secondary-500 mt-2">しばらくお待ちください</p>
      </div>
    </div>
  )
}