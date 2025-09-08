'use client'

import { usePathname } from 'next/navigation'
import SecurityWrapper from './SecurityWrapper'

// 認証不要なページのパス
const PUBLIC_PATHS = ['/login', '/auth/pending']

interface AuthProviderProps {
  children: React.ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const pathname = usePathname()
  
  // 認証不要なページの場合は認証チェックをスキップ
  if (pathname && PUBLIC_PATHS.includes(pathname)) {
    return <>{children}</>
  }
  
  // その他のページは認証が必要
  return (
    <SecurityWrapper redirectTo="/login">
      {children}
    </SecurityWrapper>
  )
}