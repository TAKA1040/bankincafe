'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Car } from 'lucide-react'

export default function AuthCallback() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {

        const supabase = createClient()
        
        // URLからセッション情報を取得
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('❌ 認証コールバックエラー:', error)
          setStatus('error')
          setMessage('認証に失敗しました。再度ログインしてください。')
          setTimeout(() => router.push('/login'), 3000)
          return
        }

        if (data.session?.user) {

          setStatus('success')
          setMessage('ログインが完了しました。メインページにリダイレクトします...')
          
          // セッション情報をキャッシュに保存（ログイン永続化用）
          try {
            const sessionData = {
              expires_at: data.session.expires_at,
              user_email: data.session.user.email,
              cached_at: Date.now() / 1000
            }
            sessionStorage.setItem('supabase_session', JSON.stringify(sessionData))

          } catch (cacheError) {
            console.warn('⚠️ セッションキャッシュ保存エラー:', cacheError)
          }
          
          // メインページにリダイレクト
          setTimeout(() => router.push('/'), 1000)
        } else {

          setStatus('error')
          setMessage('認証情報が見つかりません。再度ログインしてください。')
          setTimeout(() => router.push('/login'), 3000)
        }
      } catch (error) {
        console.error('❌ 認証コールバック処理エラー:', error)
        setStatus('error')
        setMessage('認証処理中にエラーが発生しました。')
        setTimeout(() => router.push('/login'), 3000)
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className={`p-4 rounded-full animate-bounce ${
            status === 'success' ? 'bg-green-600' : 
            status === 'error' ? 'bg-red-600' : 
            'bg-primary-600'
          }`}>
            <Car className="h-8 w-8 text-white" />
          </div>
        </div>
        
        <div className="mb-4">
          {status === 'loading' && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          )}
          
          <h1 className={`text-2xl font-bold mb-2 ${
            status === 'success' ? 'text-green-700' : 
            status === 'error' ? 'text-red-700' : 
            'text-secondary-700'
          }`}>
            {status === 'loading' && '認証処理中...'}
            {status === 'success' && 'ログイン成功！'}
            {status === 'error' && 'エラーが発生しました'}
          </h1>
          
          <p className="text-secondary-600">
            {message || 'しばらくお待ちください'}
          </p>
        </div>

        {status === 'error' && (
          <div className="mt-6">
            <button
              onClick={() => router.push('/login')}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              ログインページに戻る
            </button>
          </div>
        )}
      </div>
    </div>
  )
}