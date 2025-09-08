import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import AuthProvider from '@/components/layout/AuthProvider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bankincafe - 請求書管理システム',
  description: '請求書作成・管理・作業履歴管理システム',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}
