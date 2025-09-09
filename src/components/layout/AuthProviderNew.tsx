'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthNew } from '@/hooks/useAuthNew'
import { Car } from 'lucide-react'

// 認証不要なページのパス
const PUBLIC_PATHS = ['/login', '/auth/pending']

interface AuthProviderProps {
  children: React.ReactNode
}

export default function AuthProviderNew({ children }: AuthProviderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading, isAdmin, error } = useAuthNew()

  // 認証不要なページかチェック
  const isPublicPath = pathname && PUBLIC_PATHS.some(path => pathname.startsWith(path))

  // 認証不要なページの場合はそのまま表示
  if (isPublicPath) {
    return <>{children}</>
  }

  // エラーがある場合
  if (error) {
    console.error('認証エラー:', error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-lg">
          <div className="mb-4 text-red-600">
            <Car className="h-16 w-16 mx-auto mb-4" />
          </div>
          <h2 className="text-xl font-bold text-red-800 mb-2">認証エラー</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            ログインページに戻る
          </button>
        </div>
      </div>
    )
  }

  // ローディング中
  if (loading) {
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

  // 未認証の場合はログインページへ
  if (!user) {
    useEffect(() => {
      console.log('🔒 未認証ユーザー - ログインページへリダイレクト')
      router.push('/login')
    }, [router])
    return null
  }

  // 認証済みだが管理者権限がない場合は承認待ちページへ
  if (user && !isAdmin) {
    useEffect(() => {
      console.log('❌ 管理者権限なし - 承認待ちページへリダイレクト')
      router.push('/auth/pending')
    }, [router])
    return null
  }

  // 認証・認可OK
  console.log('✅ 認証・認可完了 - アプリケーション表示')
  return <>{children}</>
}