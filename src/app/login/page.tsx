'use client'

import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push('/')
    }
  }, [session, router])

  if (session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p>リダイレクト中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 px-4">
        <div>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Banking Cafe
          </h1>
        </div>
        <div className="mt-8 space-y-4">
          <div>
            <button
              onClick={() => signIn('google', { callbackUrl: '/' })}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-md font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Googleでログイン
            </button>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <div>
              <div className="my-4 flex items-center justify-center">
                <div className="border-t border-gray-300 w-full"></div>
                <p className="px-2 text-center text-sm text-gray-500 bg-gray-50">OR</p>
                <div className="border-t border-gray-300 w-full"></div>
              </div>
              <button
                onClick={() => signIn('credentials', { 
                  username: 'dev-user',
                  callbackUrl: '/' 
                })}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-md font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                開発用アカウントでログイン
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
