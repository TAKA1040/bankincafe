'use client'

import { useState } from 'react'
import { LogIn, Car, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

export default function LoginPageSimple() {
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

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
        setIsLoggingIn(false)
      } else {
        console.log('🔄 Google認証画面にリダイレクト中...')
      }
    } catch (error) {
      console.error('❌ 予期しないログインエラー:', error)
      setLoginError('ログイン処理中にエラーが発生しました')
      setIsLoggingIn(false)
    }
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
            className="w-full gap-2 py-3 text-lg mb-4"
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

          {/* デバッグ情報 */}
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs">
            <p className="font-medium text-yellow-800">テスト情報:</p>
            <p className="text-yellow-700">
              許可アカウント: {process.env.NEXT_PUBLIC_ALLOWED_EMAILS || '環境変数未設定'}
            </p>
            <p className="text-yellow-700 mt-1">
              ログイン後は自動的にアクセス権限がチェックされます
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}