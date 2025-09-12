'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AuthUser } from '@/types/auth'
import { User } from '@supabase/supabase-js'

interface AuthState {
  user: AuthUser | null
  loading: boolean
  isAdmin: boolean
  error: string | null
}

export function useAuthNew() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    isAdmin: false,
    error: null
  })

  const supabase = createClient()

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
    // 環境変数から許可されたメールアドレスチェック（セキュリティ向上）
    const allowedEmails = getAllowedEmails()
    return allowedEmails.includes(email)
  }, [getAllowedEmails])

  // サインアウト処理（完全なクリア）
  const signOut = useCallback(async (): Promise<void> => {
    try {
      // console.log('🔒 サインアウト処理開始')
      
      // Supabaseサインアウト
      await supabase.auth.signOut()
      
      // ブラウザストレージクリア
      if (typeof window !== 'undefined') {
        sessionStorage.clear()
        localStorage.clear()
        // Supabase関連のキーも明示的に削除
        const keysToRemove = Object.keys(localStorage).filter(key => 
          key.includes('supabase') || key.includes('sb-')
        )
        keysToRemove.forEach(key => localStorage.removeItem(key))
      }
      
      // 状態リセット（必ずloadingをfalseに）
      setAuthState({
        user: null,
        loading: false,
        isAdmin: false,
        error: null
      })
      
      // console.log('✅ サインアウト処理完了 - ローディング解除')
    } catch (error) {
      console.error('❌ サインアウトエラー:', error)
      setAuthState(prev => ({
        ...prev,
        error: 'サインアウトに失敗しました',
        loading: false
      }))
    }
  }, [supabase.auth])

  // 強制リダイレクト処理
  const forceRedirect = useCallback((path: string, delay = 100): void => {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        // console.log(`🔄 強制リダイレクト: ${path}`)
        window.location.href = path
      }, delay)
    }
  }, [])

  // 認証状態チェック処理
  const processAuthState = useCallback(async (user: User | null): Promise<void> => {
    // console.log('🔍 認証状態チェック開始:', { hasUser: !!user, userEmail: user?.email })

    try {
      // ユーザーが存在しない場合
      if (!user) {
        // console.log('🔒 未認証状態 - ローディング解除')
        setAuthState({
          user: null,
          loading: false,
          isAdmin: false,
          error: null
        })
        return
      }

      // ユーザーのメールアドレスチェック
      const userEmail = user.email
      if (!userEmail) {
        // console.log('❌ メールアドレスが取得できません - ローディング解除してサインアウト')
        setAuthState({
          user: null,
          loading: false,
          isAdmin: false,
          error: null
        })
        await signOut()
        forceRedirect('/login')
        return
      }

      // 管理者権限チェック
      const isAdmin = checkAdminPermission(userEmail)
      // console.log('🔐 権限チェック:', { email: userEmail, isAdmin, allowedEmails: getAllowedEmails() })

      if (!isAdmin) {
        // console.log('❌ 許可されていないアカウント - ローディング解除してサインアウト')
        setAuthState({
          user: null,
          loading: false,
          isAdmin: false,
          error: null
        })
        await signOut()
        forceRedirect('/auth/pending')
        return
      }

      // 認証成功
      // console.log('✅ 認証・認可成功 - ローディング解除:', userEmail)
      setAuthState({
        user: user as AuthUser,
        loading: false,
        isAdmin: true,
        error: null
      })
    } catch (error) {
      console.error('❌ 認証処理エラー:', error)
      setAuthState({
        user: null,
        loading: false,
        isAdmin: false,
        error: '認証処理中にエラーが発生しました'
      })
    }
  }, [signOut, forceRedirect, checkAdminPermission, getAllowedEmails])

  // 初期化とイベントリスナー設定
  useEffect(() => {
    let isMounted = true

    const initializeAuth = async () => {
      try {
        // console.log('🚀 認証システム初期化開始')
        
        // 現在のセッション取得
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error) {
          console.error('❌ 認証取得エラー:', error)
          if (isMounted) {
            setAuthState({
              user: null,
              loading: false,
              isAdmin: false,
              error: error.message
            })
          }
          return
        }

        // console.log('📋 取得したユーザー情報:', { hasUser: !!user, email: user?.email })

        if (isMounted) {
          await processAuthState(user)
        }
      } catch (error) {
        console.error('❌ 認証初期化エラー:', error)
        if (isMounted) {
          setAuthState({
            user: null,
            loading: false,
            isAdmin: false,
            error: '認証システムの初期化に失敗しました'
          })
        }
      }
    }

    // 認証状態変更リスナー
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: any, session: any) => {
        // console.log('🔄 認証状態変更:', { event, hasSession: !!session })
        
        if (isMounted) {
          if (event === 'SIGNED_OUT' || !session) {
            setAuthState({
              user: null,
              loading: false,
              isAdmin: false,
              error: null
            })
          } else if (session?.user) {
            await processAuthState(session.user)
          }
        }
      }
    )

    initializeAuth()

    // クリーンアップ
    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [supabase.auth]) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    user: authState.user,
    loading: authState.loading,
    isAdmin: authState.isAdmin,
    error: authState.error,
    signOut
  }
}