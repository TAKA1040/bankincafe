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
  
  console.log('🔄 AuthProviderSimple レンダリング:', { pathname })

  // 認証不要なページかチェック
  const isPublicPath = pathname && PUBLIC_PATHS.some(path => pathname.startsWith(path))

  // 認証が必要なページ - 直接的な解決策
  useEffect(() => {
    // 認証不要なページの場合は何もしない
    if (isPublicPath) {
      console.log('✅ パブリックページ表示:', pathname)
      return
    }
    
    console.log('🚀 [AuthProviderSimple] 緊急回避モード - ログインページにリダイレクト')
    router.push('/login')
  }, [router, pathname, isPublicPath])

  // 認証不要なページの場合はそのまま表示
  if (isPublicPath) {
    return <>{children}</>
  }

  // 認証が必要なページは空のローディングを表示（すぐにログインページにリダイレクトされる）
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-primary-600 rounded-full animate-bounce">
            <Car className="h-8 w-8 text-white" />
          </div>
        </div>
        <p className="text-secondary-600 font-medium">ログインページへリダイレクト中...</p>
        <p className="text-xs text-secondary-500 mt-2">しばらくお待ちください</p>
      </div>
    </div>
  )
}