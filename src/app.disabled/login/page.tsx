'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import { Car, Chrome } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) throw error

    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-100">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary-600 rounded-full">
              <Car className="h-12 w-12 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-secondary-900">
            鈑金Cafe
          </h2>
          <p className="mt-2 text-secondary-600">
            請求書管理システムにログイン
          </p>
        </div>

        <div className="card">
          <div className="space-y-6">
            {error && (
              <div className="bg-danger-50 border border-danger-200 text-danger-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button
              onClick={handleGoogleLogin}
              loading={loading}
              className="w-full"
              size="lg"
              icon={<Chrome className="h-5 w-5" />}
            >
              Googleでログイン
            </Button>

            <div className="text-center">
              <p className="text-xs text-secondary-500">
                管理者アカウント（dash201206@gmail.com）でのみ<br />
                アクセスが許可されます
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-secondary-600">
            セキュアな認証システムにより<br />
            データの安全性を確保しています
          </p>
        </div>
      </div>
    </div>
  )
}