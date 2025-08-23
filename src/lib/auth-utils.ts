/**
 * パス: src/lib/auth-utils.ts
 * 目的: 認証関連のユーティリティ関数（エラーハンドリング強化）
 */
import { createClient } from './supabase/client'

export interface AuthError {
  code: string
  message: string
  details?: string
}

/**
 * 認証エラーを標準化する
 */
export function normalizeAuthError(error: any): AuthError {
  if (!error) {
    return { code: 'unknown_error', message: '不明なエラーが発生しました' }
  }

  // Supabase Auth エラー
  if (error.name === 'AuthError' || error.__isAuthError) {
    return {
      code: error.status?.toString() || 'auth_error',
      message: error.message || '認証エラーが発生しました',
      details: JSON.stringify(error, null, 2)
    }
  }

  // ネットワークエラー
  if (error.name === 'NetworkError' || error.message?.includes('fetch')) {
    return {
      code: 'network_error',
      message: 'ネットワーク接続エラーが発生しました',
      details: error.message
    }
  }

  // 一般的なエラー
  return {
    code: 'generic_error',
    message: error.message || 'エラーが発生しました',
    details: error.stack || String(error)
  }
}

/**
 * 認証状態のモニタリング
 */
export function setupAuthMonitoring() {
  const supabase = createClient()
  
  // 認証状態の変更を監視
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      console.log('[AUTH_MONITOR] State change:', event, session?.user?.email || 'No user')
      
      // セッション期限切れの処理
      if (event === 'TOKEN_REFRESHED') {
        console.log('[AUTH_MONITOR] Token refreshed successfully')
      }
      
      if (event === 'SIGNED_OUT') {
        console.log('[AUTH_MONITOR] User signed out, clearing local state')
        // 必要に応じて追加のクリーンアップ
      }
    }
  )
  
  return () => {
    subscription.unsubscribe()
  }
}

/**
 * 安全な認証チェック
 */
export async function safeGetUser() {
  try {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.warn('[AUTH_UTILS] Failed to get user:', error)
      return null
    }
    
    return user
  } catch (err) {
    console.error('[AUTH_UTILS] Exception getting user:', err)
    return null
  }
}