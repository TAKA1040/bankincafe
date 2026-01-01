'use client'

import { SessionProvider, useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, ReactNode } from 'react'

// 認証不要のパス
const PUBLIC_PATHS = ['/login', '/auth/error', '/auth/callback']

// 認証ガード（ログインチェック）
function AuthGuard({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // 認証状態の読み込み中は何もしない
    if (status === 'loading') return

    // パブリックパスの場合は認証不要
    const isPublicPath = pathname && PUBLIC_PATHS.some(path => pathname.startsWith(path))
    if (isPublicPath) return

    // 未認証の場合はログインページへリダイレクト
    if (!session) {
      router.push('/login')
    }
  }, [session, status, router, pathname])

  // 認証状態の読み込み中
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">認証状態を確認中...</p>
        </div>
      </div>
    )
  }

  // パブリックパスの場合は認証なしで表示
  const isPublicPath = pathname && PUBLIC_PATHS.some(path => pathname.startsWith(path))
  if (isPublicPath) {
    return <>{children}</>
  }

  // 未認証の場合は何も表示しない（リダイレクト中）
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">ログインページへ移動中...</p>
        </div>
      </div>
    )
  }

  // 認証済みの場合は子コンポーネントを表示
  return <>{children}</>
}

// メインのAuthProvider
export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthGuard>{children}</AuthGuard>
    </SessionProvider>
  )
}

// セッション情報を取得するカスタムフック
export function useAuth() {
  const { data: session, status } = useSession()

  return {
    user: session?.user ?? null,
    isLoading: status === 'loading',
    isAuthenticated: !!session,
    session,
  }
}
