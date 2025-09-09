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
      
      const allowedEmailsEnv = process.env.NEXT_PUBLIC_ALLOWED_EMAILS?.replace(/[\r\n]/g, '')
      const allowedEmails = allowedEmailsEnv?.split(',').map(email => email.trim()).filter(email => email) || []
      
      // 認証チェックログを出力（デバッグ用）
      console.log('認証チェック:', {
        userEmail: user.email,
        envVariable: allowedEmailsEnv,
        allowedEmails,
        isAllowed: user.email ? allowedEmails.includes(user.email) : false,
        hostname: typeof window !== 'undefined' ? window.location.hostname : 'server'
      })
      
      // 環境変数が設定されていない場合は管理者のみ許可
      if (!allowedEmailsEnv) {
        console.error('🚨 NEXT_PUBLIC_ALLOWED_EMAILS環境変数が設定されていません。セキュリティのため管理者のみ許可します。')
        if (user.email !== 'dash201206@gmail.com') {
          console.log('❌ 環境変数未設定のため、管理者以外はアクセス禁止です。サインアウトします。')
          try {
            await supabase.auth.signOut()
            // セッションストレージとローカルストレージをクリア
            if (typeof window !== 'undefined') {
              sessionStorage.clear()
              localStorage.clear()
            }
          } catch (error) {
            console.error('サインアウトエラー:', error)
          }
          setUser(null)
          setLoading(false)
          // 強制リダイレクト
          if (typeof window !== 'undefined') {
            setTimeout(() => {
              window.location.href = '/auth/pending'
            }, 100)
          }
          return
        }
        console.log('✅ 管理者アカウントのため許可します（環境変数未設定警告あり）')
        setUser(user)
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
        try {
          await supabase.auth.signOut()
          // セッションストレージとローカルストレージをクリア
          if (typeof window !== 'undefined') {
            sessionStorage.clear()
            localStorage.clear()
          }
        } catch (error) {
          console.error('サインアウトエラー:', error)
        }
        setUser(null)
        // 認証状態変更を強制的にトリガー
        setLoading(false)
        // 強制リダイレクト
        if (typeof window !== 'undefined') {
          setTimeout(() => {
            window.location.href = '/auth/pending'
          }, 100)
        }
        return
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
    const allowedEmails = process.env.NEXT_PUBLIC_ALLOWED_EMAILS?.replace(/[\r\n]/g, '')
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