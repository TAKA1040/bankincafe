'use client'

import { useCallback } from 'react'
import { useSession, signOut as nextAuthSignOut } from 'next-auth/react'

interface AuthUser {
  id: string
  email: string | null | undefined
  name: string | null | undefined
  image: string | null | undefined
}

export function useAuthNew() {
  const { data: session, status } = useSession()

  // 許可されたメールアドレスの取得（改行文字除去）
  const getAllowedEmails = useCallback((): string[] => {
    const allowedEmails = process.env.NEXT_PUBLIC_ALLOWED_EMAILS?.replace(/[\r\n]/g, '')
    if (!allowedEmails) {
      console.warn('NEXT_PUBLIC_ALLOWED_EMAILS環境変数が設定されていません')
      return []
    }
    return allowedEmails.split(',').map(email => email.trim()).filter(email => email)
  }, [])

  // 管理者権限チェック
  const checkAdminPermission = useCallback((email: string): boolean => {
    const allowedEmails = getAllowedEmails()
    // 許可リストが空の場合は全員許可
    if (allowedEmails.length === 0) return true
    return allowedEmails.includes(email)
  }, [getAllowedEmails])

  // サインアウト処理
  const signOut = useCallback(async (): Promise<void> => {
    try {
      // ブラウザストレージクリア
      if (typeof window !== 'undefined') {
        sessionStorage.clear()
        localStorage.clear()
      }

      // NextAuthサインアウト
      await nextAuthSignOut({ callbackUrl: '/login' })
    } catch (error) {
      console.error('サインアウトエラー:', error)
    }
  }, [])

  // ユーザー情報を構築
  const user: AuthUser | null = session?.user ? {
    id: session.user.id || '',
    email: session.user.email,
    name: session.user.name,
    image: session.user.image
  } : null

  // 管理者権限チェック
  const isAdmin = user?.email ? checkAdminPermission(user.email) : false

  return {
    user,
    loading: status === 'loading',
    isAdmin,
    error: null,
    signOut
  }
}
