'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
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
  
  console.log('🔄 AuthProviderSimple レンダリング:', { pathname })

  // 認証不要なページかチェック
  const isPublicPath = pathname && PUBLIC_PATHS.some(path => pathname.startsWith(path))

  // 認証不要なページの場合はそのまま表示
  if (isPublicPath) {
    console.log('✅ パブリックページ表示:', pathname)
    return <>{children}</>
  }

  // 認証が必要なページ - 簡単な認証チェック
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔍 [AuthProviderSimple] 認証チェック開始', { 
          pathname, 
          timestamp: new Date().toLocaleTimeString()
        })
        
        const supabase = createClient()
        
        // セッション情報も同時に取得して整合性をチェック
        const [
          { data: { user }, error: userError },
          { data: { session }, error: sessionError }
        ] = await Promise.all([
          supabase.auth.getUser(),
          supabase.auth.getSession()
        ])
        
        console.log('🔍 [AuthProviderSimple] 認証状態取得結果:', { 
          userExists: !!user, 
          userEmail: user?.email,
          userId: user?.id,
          sessionExists: !!session,
          sessionUserEmail: session?.user?.email,
          sessionUserId: session?.user?.id,
          userError: userError?.message,
          sessionError: sessionError?.message,
          consistent: user?.id === session?.user?.id
        })
        
        // エラーチェック
        if (userError || sessionError) {
          console.error('❌ [AuthProviderSimple] 認証取得エラー:', { userError, sessionError })
          router.push('/login')
          return
        }

        // ユーザー存在チェック（sessionとuser両方で確認）
        if (!user || !session?.user) {
          console.log('🔒 [AuthProviderSimple] 未認証状態 - ログインページへ')
          router.push('/login')
          return
        }

        // 整合性チェック
        if (user.id !== session.user.id || user.email !== session.user.email) {
          console.warn('⚠️ [AuthProviderSimple] セッション整合性エラー - 再ログインが必要')
          await supabase.auth.signOut()
          router.push('/login')
          return
        }

        // 管理者チェック（より厳密に）
        const userEmail = user.email
        if (!userEmail) {
          console.error('❌ [AuthProviderSimple] ユーザーメールアドレスが取得できません')
          await supabase.auth.signOut()
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
      } catch (error) {
        console.error('❌ [AuthProviderSimple] 認証チェック処理エラー:', error)
        router.push('/login')
      }
    }

    console.log('🚀 [AuthProviderSimple] useEffect実行', { pathname })
    checkAuth()
  }, [router, pathname])

  // ローディング表示
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