'use client'

import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import DevLogin from './components/DevLogin'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/login')
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Banking Cafe</h1>
          <p className="mt-2 text-sm text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (session) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <h1 className="text-3xl font-bold text-gray-900">Banking Cafe</h1>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  こんにちは、{session.user?.name}さん
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  ログアウト
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Banking Cafe へようこそ
              </h2>
              <p className="text-gray-600 mb-8">
                ログイン完了しました。Banking機能をご利用いただけます。
              </p>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-sm text-gray-500">
                  現在時刻: {new Date().toLocaleString('ja-JP')}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // 未ログイン時はログインページにリダイレクト中
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-900">Banking Cafe</h1>
        <p className="mt-2 text-sm text-gray-600">ログインページへリダイレクト中...</p>
      </div>
    </div>
  )
}