'use client'

// ⚠️ このファイルは廃止されました - AuthProviderSimpleを使用してください
// このファイルが誤って使用されることを防ぐため、エラーを表示します

interface AuthProviderProps {
  children: React.ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  console.error('❌ 廃止されたAuthProviderが呼び出されました！AuthProviderSimpleを使用してください')
  
  // 開発環境では警告を表示
  if (process.env.NODE_ENV === 'development') {
    return (
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        background: 'red', 
        color: 'white', 
        padding: '10px', 
        zIndex: 9999,
        textAlign: 'center'
      }}>
        ⚠️ 廃止されたAuthProviderが使用されています！AuthProviderSimpleに変更してください
      </div>
    )
  }
  
  // 本番環境では子コンポーネントを表示（安全装置）
  return <>{children}</>
}