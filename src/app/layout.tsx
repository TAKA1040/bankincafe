import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '銀行カフェ',
  description: 'Supabase認証を使用したNext.jsアプリケーション',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body style={{margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif'}}>
        {children}
      </body>
    </html>
  )
}