'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LogIn, Shield, Car } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const router = useRouter()
  const { user, loading, isAdmin } = useAuth()

  useEffect(() => {
    if (!loading && user && isAdmin) {
      router.push('/')
    } else if (!loading && user && !isAdmin) {
      router.push('/auth/pending')
    }
  }, [user, loading, isAdmin, router])

  const handleGoogleLogin = async () => {
    try {

      const supabase = createClient()
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      })

      if (error) {
        console.error('ログインエラー:', error.message)
      }
    } catch (error) {
      console.error('予期しないエラー:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary-600 rounded-full animate-bounce">
              <Car className="h-8 w-8 text-white" />
            </div>
          </div>
          <p className="text-secondary-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (user && isAdmin) {
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
              承認されたGoogleアカウントのみがアクセス可能です。
              未承認のアカウントの場合は承認待ち画面に移動します。
            </p>
          </div>

          {/* ログインボタン */}
          <Button 
            onClick={handleGoogleLogin}
            className="w-full gap-2 py-3 text-lg"
          >
            <LogIn className="w-5 h-5" />
            Googleアカウントでログイン
          </Button>

          {/* フッター */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              ログインすることで利用規約に同意したものとみなします
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}