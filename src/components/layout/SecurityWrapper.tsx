'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Car } from 'lucide-react'

interface SecurityWrapperProps {
  children: React.ReactNode
  redirectTo?: string
}

export default function SecurityWrapper({ children, redirectTo = '/login' }: SecurityWrapperProps) {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.log('🔒 未認証ユーザーをログインページにリダイレクト')
        router.push(redirectTo)
        return
      }
      
      if (user && !isAdmin) {
        // 管理者権限なしのユーザーは承認待ちページへ
        console.log('❌ 許可されていないアカウントです:', user.email, 'サインアウトして承認待ちページへリダイレクト')
        // 強制リダイレクト
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/pending'
        } else {
          router.push('/auth/pending')
        }
        return
      }
      
      if (user && isAdmin) {
        console.log('✅ 認証済み・許可済みユーザー:', user.email)
      }
    }
  }, [user, loading, isAdmin, router, redirectTo])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary-600 rounded-full animate-bounce">
              <Car className="h-8 w-8 text-white" />
            </div>
          </div>
          <p className="text-secondary-600">認証中...</p>
        </div>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return null
  }

  return <>{children}</>
}