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
  const [isLoading, setIsLoading] = useState(true)
  
  console.log('🔄 AuthProviderSimple レンダリング:', { pathname })

  // 認証不要なページかチェック
  const isPublicPath = pathname && PUBLIC_PATHS.some(path => pathname.startsWith(path))

  // 認証チェック - 根本的な解決策
  useEffect(() => {
    // 認証不要なページの場合は何もしない
    if (isPublicPath) {
      console.log('✅ パブリックページ表示:', pathname)
      setIsLoading(false)
      return
    }
    
    const performAuthCheck = async () => {
      try {
        console.log('🔍 [AuthProviderSimple] 新しい認証システム開始:', { 
          pathname, 
          timestamp: new Date().toISOString()
        })
        
        setIsLoading(true)
        
        const supabase = createClient()
        console.log('📡 [AuthProviderSimple] 標準Supabaseクライアント作成完了')
        
        // タイムアウト付きでセッション取得
        const sessionPromise = supabase.auth.getSession()
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session timeout')), 5000)
        )
        
        const { data: { session }, error } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as any
        
        console.log('📡 [AuthProviderSimple] セッション取得完了:', {
          hasSession: !!session,
          hasUser: !!session?.user,
          userEmail: session?.user?.email,
          error: error?.message
        })
        
        if (error) {
          console.error('❌ セッション取得エラー:', error)
          setIsAuthenticated(false)
          router.push('/login')
          return
        }
        
        if (!session?.user?.email) {
          console.log('🔒 認証なし - ログインページへ')
          setIsAuthenticated(false)
          router.push('/login')
          return
        }
        
        // 管理者チェック
        const userEmail = session.user.email
        const isDash206 = userEmail === 'dash201206@gmail.com'
        const rawAllowedEmails = process.env.NEXT_PUBLIC_ALLOWED_EMAILS
        const allowedEmailsList = rawAllowedEmails?.split(',').map(e => e.trim()) || []
        const isInAllowedList = allowedEmailsList.includes(userEmail)
        const isAdmin = isDash206 || isInAllowedList
        
        console.log('🔐 管理者権限チェック:', {
          userEmail,
          isDash206,
          isInAllowedList,
          isAdmin
        })
        
        if (!isAdmin) {
          console.log('❌ 許可されていないアカウント - 承認待ちページへ')
          setIsAuthenticated(false)
          router.push('/auth/pending')
          return
        }
        
        console.log('✅ 認証・認可完了 - メインコンテンツ表示')
        setIsAuthenticated(true)
        
      } catch (error) {
        console.error('❌ 認証チェックエラー:', error)
        setIsAuthenticated(false)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }
    
    performAuthCheck()
  }, [router, pathname, isPublicPath])

  // 認証不要なページの場合はそのまま表示
  if (isPublicPath) {
    return <>{children}</>
  }

  // 認証成功時はメインコンテンツ表示
  if (isAuthenticated === true && !isLoading) {
    console.log('🎉 メインコンテンツ表示')
    return <>{children}</>
  }

  // 認証チェック中はローディング表示
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-primary-600 rounded-full animate-bounce">
            <Car className="h-8 w-8 text-white" />
          </div>
        </div>
        <p className="text-secondary-600 font-medium">
          {isLoading ? '認証確認中...' : 'リダイレクト中...'}
        </p>
        <p className="text-xs text-secondary-500 mt-2">しばらくお待ちください</p>
      </div>
    </div>
  )
}