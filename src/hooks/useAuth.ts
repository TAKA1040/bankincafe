'use client'

// ⚠️ このファイルは廃止されました - useAuthNewを使用してください
// このファイルが誤って使用されることを防ぐため、エラーを表示します

import { useState } from 'react'

export function useAuth() {
  console.error('❌ 廃止されたuseAuthが呼び出されました！useAuthNewを使用してください')
  
  // 開発環境では具体的なエラーを表示
  if (process.env.NODE_ENV === 'development') {
    throw new Error('廃止されたuseAuthが使用されています！useAuthNewに変更してください')
  }
  
  // 本番環境では空の状態を返す（安全装置）
  const [user] = useState<any>(null)
  const [loading] = useState(false)
  const [error] = useState('廃止されたuseAuthが使用されました')
  
  return { 
    user, 
    loading, 
    isAdmin: false, 
    error,
    signOut: async () => {
      console.error('❌ 廃止されたuseAuth.signOutが呼び出されました！')
    }
  }
}