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
      
      const allowedEmails = process.env.NEXT_PUBLIC_ALLOWED_EMAILS?.split(',').map(email => email.trim()) || []
      // 本番環境でのみ認証チェックログを出力
      if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
        console.log('認証チェック:', {
          userEmail: user.email?.substring(0, 3) + '***', // メールアドレスを一部隠す
          isAllowed: user.email ? allowedEmails.includes(user.email) : false
        })
      }
      
      if (user.email && !allowedEmails.includes(user.email)) {
        console.log('許可されていないアカウントです。サインアウトします。')
        await supabase.auth.signOut()
        setUser(null)
      } else {
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

  const isAdmin = user?.email ? 
    (process.env.NEXT_PUBLIC_ALLOWED_EMAILS?.split(',').map(email => email.trim()).includes(user.email) || false)
    : false


  return {
    user,
    loading,
    signOut,
    isAdmin
  }
}