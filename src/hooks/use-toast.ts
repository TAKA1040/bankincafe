"use client"

import { useState } from 'react'

export interface Toast {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
}

// シンプルなToast実装（将来的にはより高機能なライブラリに置き換え可能）
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = ({ title, description, variant = 'default' }: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2, 9)
    const newToast: Toast = { id, title, description, variant }
    
    setToasts((prev) => [...prev, newToast])
    
    // シンプルなアラート表示（将来的にはより洗練されたUIに置き換え）
    const message = title && description ? `${title}: ${description}` : title || description || ''
    if (variant === 'destructive') {
      alert(`⚠️ ${message}`)
    } else {
      alert(`✅ ${message}`)
    }
    
    // 3秒後に自動削除
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
    
    return newToast
  }

  const dismiss = (toastId: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== toastId))
  }

  return {
    toast,
    dismiss,
    toasts
  }
}