'use client'

import { useState } from 'react'
import { signIn, useSession } from 'next-auth/react'

export default function DevLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const { update } = useSession()

  const handleDevLogin = async () => {
    setIsLoading(true)
    console.log('Starting development login...')

    try {
      // NextAuthの正規のsignIn関数を使用
      const result = await signIn('credentials', {
        username: 'dev-user',
        callbackUrl: '/',
        redirect: false // ページリダイレクトを無効にして結果を取得
      })

      console.log('Login result:', result)

      if (result?.ok) {
        console.log('Login successful, updating session...')
        // セッションを強制更新
        await update()
        // 少し待ってからリダイレクト
        setTimeout(() => {
          window.location.href = '/'
        }, 500)
      } else {
        console.error('Login failed:', result?.error)
        alert('ログインに失敗しました: ' + (result?.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('ログインエラー: ' + error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleDevLogin}
      disabled={isLoading}
      className="w-full flex justify-center py-4 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50"
    >
      {isLoading ? 'ログイン中...' : '開発用ログイン'}
    </button>
  )
}