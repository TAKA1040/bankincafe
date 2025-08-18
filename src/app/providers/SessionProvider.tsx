'use client'

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export function SessionProvider({ children }: Props) {
  return (
    <NextAuthSessionProvider 
      refetchInterval={5 * 60} // 5分ごとにセッション更新
      refetchOnWindowFocus={true}
    >
      {children}
    </NextAuthSessionProvider>
  )
}