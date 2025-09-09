'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AuthUser } from '@/types/auth'

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const checkAndSetUser = async (user: AuthUser | null) => {
      if (!user) {
        setUser(null)
        return
      }
      
      const allowedEmailsEnv = process.env.NEXT_PUBLIC_ALLOWED_EMAILS
      const allowedEmails = allowedEmailsEnv?.split(',').map(email => email.trim()).filter(email => email) || []
      
      // 認証チェックログを出力（デバッグ用）
      console.log('認証チェック:', {
        userEmail: user.email,
        envVariable: allowedEmailsEnv,
        allowedEmails,
        isAllowed: user.email ? allowedEmails.includes(user.email) : false,
        hostname: typeof window !== 'undefined' ? window.location.hostname : 'server'
      })
      
      // 環境変数が設定されていない場合は警告
      if (!allowedEmailsEnv) {
        console.warn('⚠️ NEXT_PUBLIC_ALLOWED_EMAILS環境変数が設定されていません。全てのユーザーを許可します。')
        setUser(user) // 環境変数未設定の場合は全ユーザー許可
        return
      }
      
      // dash201206@gmail.com は常に許可
      if (user.email === 'dash201206@gmail.com') {
        console.log('✅ 管理者アカウントでログイン成功')
        setUser(user)
        return
      }
      
      if (user.email && !allowedEmails.includes(user.email)) {
        console.log('❌ 許可されていないアカウントです。サインアウトします。')
        await supabase.auth.signOut()
        setUser(null)
      } else {
        console.log('✅ 許可されたアカウントでログイン成功')
        setUser(user)
      }
    }

    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        await checkAndSetUser(user as AuthUser)
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Auth error:', error)
        }
      } finally {
        setLoading(false)
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user as AuthUser ?? null
        await checkAndSetUser(user)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  // 許可されたメールアドレスリストを取得
  const getAllowedEmails = () => {
    const allowedEmails = process.env.NEXT_PUBLIC_ALLOWED_EMAILS
    if (!allowedEmails) {
      console.warn('NEXT_PUBLIC_ALLOWED_EMAILS環境変数が設定されていません')
      return []
    }
    return allowedEmails.split(',').map(email => email.trim()).filter(email => email)
  }

  const allowedEmails = getAllowedEmails()
  const isAdmin = user?.email === 'dash201206@gmail.com' || (user?.email ? allowedEmails.includes(user.email) : false)


  return {
    user,
    loading,
    signOut,
    isAdmin
  }
}