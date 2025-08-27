'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AuthUser } from '@/types/auth'

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user as AuthUser)
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
      (event, session) => {
        setUser(session?.user as AuthUser ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const isAdmin = user?.email && (
    process.env.NODE_ENV === 'development' || 
    process.env.NEXT_PUBLIC_ALLOWED_EMAILS?.split(',').map(email => email.trim()).includes(user.email)
  ) || false

  return {
    user,
    loading,
    signOut,
    isAdmin
  }
}