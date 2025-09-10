'use client'

import { useState } from 'react'
import { LogIn, Shield, AlertCircle, Sparkles } from 'lucide-react'
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
          redirectTo: `${window.location.origin}/auth/callback`,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-indigo-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-purple-200/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      <div className="relative max-w-md w-full">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-10 text-center">
          {/* ロゴ・アイコン */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-yellow-800" />
              </div>
            </div>
          </div>

          {/* タイトル */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              ログイン
            </h1>
            <p className="text-gray-500 text-sm">
              安全なアクセスのため、認証が必要です
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
            className="w-full gap-3 py-4 text-lg mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] rounded-xl"
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
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
              <Shield className="w-3 h-3" />
              セキュアログインシステム
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}