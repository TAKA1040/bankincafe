'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'

export default function HomePage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <p className="text-lg">読み込み中...</p>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Banking Cafeへようこそ</h1>
        
        {session ? (
          <div>
            <p className="text-xl mb-2">こんにちは、{session.user?.name ?? 'ゲスト'}さん</p>
            <p className="text-md mb-4">メールアドレス: {session.user?.email}</p>
            <button 
              onClick={() => signOut()} 
              className="px-6 py-2 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              ログアウト
            </button>
          </div>
        ) : (
          <div>
            <p className="text-xl mb-4">ログインしていません</p>
            <Link href="/login">
              <button className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                ログインページへ
              </button>
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
