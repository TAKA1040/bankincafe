'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogIn, Shield, Car, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useAuthNew } from '@/hooks/useAuthNew'

export default function LoginPageNew() {
  const router = useRouter()
  const { user, loading, isAdmin } = useAuthNew()
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  // 既にログイン済みの場合のリダイレクト処理
  useEffect(() => {
    if (!loading) {
      if (user && isAdmin) {
        console.log('✅ 既にログイン済み - ダッシュボードへ')
        router.push('/')
      } else if (user && !isAdmin) {
        console.log('⏳ ユーザー存在するが管理者権限なし - 承認待ちページへ')
        router.push('/auth/pending')
      }
    }
  }, [user, loading, isAdmin, router])

  const handleGoogleLogin = async () => {
    if (isLoggingIn) return

    try {
      setIsLoggingIn(true)
      setLoginError(null)
      
      console.log('🚀 Googleログイン開始')
      const supabase = createClient()
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })

      if (error) {
        console.error('❌ ログインエラー:', error)
        setLoginError(error.message)
      } else {
        console.log('🔄 Google認証画面にリダイレクト中...')
      }
    } catch (error) {
      console.error('❌ 予期しないログインエラー:', error)
      setLoginError('ログイン処理中にエラーが発生しました')
    } finally {
      // リダイレクトが発生しない場合のみリセット
      setTimeout(() => setIsLoggingIn(false), 3000)
    }
  }

  // ローディング中の表示
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary-600 rounded-full animate-bounce">
              <Car className="h-8 w-8 text-white" />
            </div>
          </div>
          <p className="text-secondary-600">認証状態確認中...</p>
        </div>
      </div>
    )
  }

  // 既にログイン済みの場合は表示しない
  if (user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* ロゴ・アイコン */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Car className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          {/* タイトル */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            鈑金Cafe
          </h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-6">
            請求書管理システム
          </h2>

          {/* 説明 */}
          <p className="text-gray-600 mb-8 leading-relaxed">
            システムにアクセスするには<br />
            Googleアカウントでのログインが必要です
          </p>

          {/* セキュリティ説明 */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-700 mb-2">
              <Shield className="w-4 h-4" />
              <span className="font-medium">セキュリティ保護</span>
            </div>
            <p className="text-sm text-gray-600">
              承認されたGoogleアカウントのみがアクセス可能です。<br />
              未承認のアカウントの場合は承認待ち画面に移動します。
            </p>
          </div>

          {/* エラー表示 */}
          {loginError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="w-4 h-4" />
                <span className="font-medium">ログインエラー</span>
              </div>
              <p className="text-sm text-red-600 mt-1">{loginError}</p>
            </div>
          )}

          {/* ログインボタン */}
          <Button 
            onClick={handleGoogleLogin}
            disabled={isLoggingIn}
            className="w-full gap-2 py-3 text-lg"
          >
            {isLoggingIn ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ログイン中...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Googleアカウントでログイン
              </>
            )}
          </Button>

          {/* フッター */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              ログインすることで利用規約に同意したものとみなします
            </p>
          </div>

          {/* デバッグ情報（開発環境のみ） */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs">
              <p className="font-medium text-yellow-800">開発環境情報:</p>
              <p className="text-yellow-700">
                許可アカウント: {process.env.NEXT_PUBLIC_ALLOWED_EMAILS || 'dash201206@gmail.com'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}