'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Car } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function PasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  // 現在のユーザーのメールアドレスを取得
  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user?.email) {
        // セッションがない場合はログインページへ
        router.push('/login')
        return
      }

      setUserEmail(user.email)
    }

    checkSession()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!password.trim()) {
      setError('パスワードを入力してください')
      return
    }

    if (!userEmail) {
      setError('セッションが無効です。再度ログインしてください')
      router.push('/login')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      // ユーザーの追加パスワードを取得
      const { data: userData, error: fetchError } = await supabase
        .from('user_management')
        .select('additional_password')
        .eq('google_email', userEmail)
        .single()

      if (fetchError) {
        throw new Error('ユーザー情報の取得に失敗しました')
      }

      // パスワード照合
      if (userData?.additional_password !== password) {
        setError('パスワードが正しくありません')
        setLoading(false)
        return
      }

      // パスワード認証成功 - セッションに記録
      const sessionData = {
        verified_at: Date.now(),
        user_email: userEmail
      }
      sessionStorage.setItem('additional_password_verified', JSON.stringify(sessionData))

      // メインページへリダイレクト
      router.push('/')

    } catch (err) {
      console.error('Password verification error:', err)
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md p-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* ロゴ */}
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-600 rounded-full">
              <Car className="h-8 w-8 text-white" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
            追加認証
          </h1>
          <p className="text-center text-gray-600 mb-6">
            パスワードを入力してください
          </p>

          {userEmail && (
            <p className="text-center text-sm text-gray-500 mb-4">
              {userEmail}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワード"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? '確認中...' : 'ログイン'}
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-6">
            ブラウザを閉じるか、1時間操作がない場合は<br />再度パスワード入力が必要です
          </p>
        </div>
      </div>
    </div>
  )
}
