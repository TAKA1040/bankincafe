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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            ログイン
          </h1>

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

        </div>
      </div>
    </div>
  )
}