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
    // 開発モードでは認証をバイパス
    if (process.env.NODE_ENV === 'development') {
      return
    }
    
    if (!loading && !user) {
      router.push(redirectTo)
    } else if (!loading && user && !isAdmin) {
      // 管理者権限なしのユーザー
      router.push('/auth/auth-code-error')
    }
  }, [user, loading, isAdmin, router, redirectTo])

  // 開発モードでは認証をバイパス
  if (process.env.NODE_ENV === 'development') {
    return <>{children}</>
  }

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