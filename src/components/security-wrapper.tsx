/**
 * パス: src/components/security-wrapper.tsx
 * 目的: セキュリティラッパー（将来のPIN認証対応）
 */
'use client'
import React, { useEffect } from 'react'

interface SecurityWrapperProps {
  children: React.ReactNode
  requirePin?: boolean       // 将来のPIN認証フラグ
  onPinRequired?: () => void // PIN入力が必要な時のコールバック
}

export default function SecurityWrapper({ 
  children, 
  requirePin = false,
  onPinRequired 
}: SecurityWrapperProps) {
  // TODO: 将来のPIN認証実装
  // const [pinAuthenticated, setPinAuthenticated] = useState(false)
  // const [showPinDialog, setShowPinDialog] = useState(false)

  // 現在はPIN認証をスキップ（後から有効化）
  // 開発時のStrict Modeや再レンダリングでも多重出力されないように、一度だけログを出す
  useEffect(() => {
    if (!requirePin) return
    if (typeof window === 'undefined') return
    try {
      const key = 'bankin_pin_log_once'
      if (!sessionStorage.getItem(key)) {
        // // console.log('🔐 [SECURITY] PIN authentication will be required in future')
        sessionStorage.setItem(key, '1')
      }
    } catch {
      // no-op
    }
  }, [requirePin])

  // 現在は常に子コンポーネントを表示
  return <>{children}</>
}

// 将来のPIN認証用のユーティリティ関数（準備のみ）
export const SecurityUtils = {
  // セッションストレージでPIN状態管理
  isPinAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false
    const pinData = sessionStorage.getItem('bankin_pin_auth')
    if (!pinData) return false
    
    try {
      const { timestamp, authenticated } = JSON.parse(pinData)
      const now = Date.now()
      const expiry = timestamp + (30 * 60 * 1000) // 30分
      
      return authenticated && now < expiry
    } catch {
      return false
    }
  },

  // PIN認証状態を保存
  setPinAuthenticated: (authenticated: boolean): void => {
    if (typeof window === 'undefined') return
    
    if (authenticated) {
      const pinData = {
        authenticated: true,
        timestamp: Date.now()
      }
      sessionStorage.setItem('bankin_pin_auth', JSON.stringify(pinData))
    } else {
      sessionStorage.removeItem('bankin_pin_auth')
    }
  },

  // PIN認証状態をクリア
  clearPinAuth: (): void => {
    if (typeof window === 'undefined') return
    sessionStorage.removeItem('bankin_pin_auth')
  }
}