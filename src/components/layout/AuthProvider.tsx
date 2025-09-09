'use client'

import { usePathname } from 'next/navigation'
import SecurityWrapper from './SecurityWrapper'

// 認証不要なページのパス
const PUBLIC_PATHS = ['/login', '/auth/pending']

interface AuthProviderProps {
  children: React.ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  // 一時的に認証を完全無効化（デバッグ用）
  return <>{children}</>
}