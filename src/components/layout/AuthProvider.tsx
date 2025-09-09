'use client'

import { usePathname } from 'next/navigation'
import SecurityWrapper from './SecurityWrapper'

// 認証不要なページのパス
const PUBLIC_PATHS = ['/login', '/auth/pending']

interface AuthProviderProps {
  children: React.ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  // 認証システムを完全に無効化（一時的な措置）
  // 全ユーザーがアクセス可能な状態に戻す
  return <>{children}</>
}