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
  
  // 認証不要なページの場合はそのまま表示
  if (pathname && PUBLIC_PATHS.includes(pathname)) {
    return <>{children}</>
  }
  
  // 認証が必要なページはSecurityWrapperで保護
  return (
    <SecurityWrapper>
      {children}
    </SecurityWrapper>
  )
}