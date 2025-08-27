/**
 * パス: src/components/dashboard-client.tsx
 * 目的: 鈑金Cafeダッシュボードのクライアントサイドコンポーネント
 */
'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import SecurityWrapper from './security-wrapper'

interface DashboardClientProps {
  user: {
    email: string
    user_metadata?: {
      full_name?: string
    }
  }
}

interface MenuItem {
  id: string
  title: string
  description: string
  icon: string
  color: string
  bgColor: string
  borderColor: string
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const router = useRouter()

  // 管理者判定
  const isAdmin = user.email === 'dash201206@gmail.com'
  const displayName = user.user_metadata?.full_name || user.email

  // Tailwind CSSクラスを使用（XSS脆弱性を回避）
  const getMenuItemStyle = (color: string) => ({
    backgroundColor: color,
    borderColor: color,
    color: color,
  })

  const menuItems: MenuItem[] = [
    {
      id: 'invoice-create',
      title: '請求書新規作成',
      description: '新しい請求書を作成する',
      icon: '📝',
      color: '#2563eb',
      bgColor: '#eff6ff',
      borderColor: '#2563eb'
    },
    {
      id: 'invoice-list',
      title: '請求書一覧',
      description: '請求書の確認・編集',
      icon: '📋',
      color: '#059669',
      bgColor: '#ecfdf5',
      borderColor: '#059669'
    },
    {
      id: 'customer-list',
      title: '顧客管理',
      description: '顧客情報の登録・管理',
      icon: '👥',
      color: '#7c3aed',
      bgColor: '#faf5ff',
      borderColor: '#7c3aed'
    },
    {
      id: 'sales-management',
      title: '売上管理',
      description: '売上データの確認・分析',
      icon: '📊',
      color: '#dc2626',
      bgColor: '#fef2f2',
      borderColor: '#dc2626'
    },
    {
      id: 'work-history',
      title: '作業履歴',
      description: '過去の作業記録を確認',
      icon: '🔧',
      color: '#ea580c',
      bgColor: '#fff7ed',
      borderColor: '#ea580c'
    },
    {
      id: 'work-search',
      title: '作業履歴検索',
      description: '作業内容と価格履歴を検索',
      icon: '🔍',
      color: '#8b5cf6',
      bgColor: '#f3e8ff',
      borderColor: '#8b5cf6'
    }
  ]

  const handleMenuClick = (menuId: string) => {
    // メニュークリック処理
    
    // 各メニューページへのナビゲーション
    switch (menuId) {
      case 'invoice-create':
        router.push('/invoice-create')
        break
      case 'invoice-list':
        router.push('/invoice-list')
        break
      case 'customer-list':
        router.push('/customer-list')
        break
      case 'sales-management':
        router.push('/sales-management')
        break
      case 'work-history':
        router.push('/work-history')
        break
      case 'work-search':
        router.push('/work-search')
        break
      default:
        // 未知のメニュー
    }
  }

  const handleLogout = async () => {
    // ログアウト処理
    
    // Supabaseログアウト処理
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    
    const { error } = await supabase.auth.signOut()
    if (error) {
      // ログアウトエラー
      alert(`ログアウトエラー: ${error.message}`)
    } else {
      // ログアウト成功
      router.push('/login')
    }
  }

  return (
    <SecurityWrapper requirePin={false}>
      <>
        {/* Tailwind CSSを使用 */}
        
        <div className="dashboard-container">
          {/* ヘッダー */}
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">
                🔧 鈑金Cafe
              </h1>
              <p className="dashboard-subtitle">
                請求書管理システム
              </p>
              <div 
                className="user-badge"
                style={{
                  backgroundColor: isAdmin ? '#fef3c7' : '#e5e7eb'
                }}
              >
                <span style={{
                  color: isAdmin ? '#92400e' : '#374151',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}>
                  {isAdmin ? '👑 管理者' : '👤 ユーザー'}: {displayName}
                </span>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="logout-button"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#dc2626'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ef4444'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              ログアウト
            </button>
          </div>

          {/* メニューグリッド */}
          <div className="menu-grid">
            {menuItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className="menu-item"
                style={{
                  border: `2px solid ${item.borderColor}`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)'
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)'
                  e.currentTarget.style.borderColor = item.borderColor
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)'
                  e.currentTarget.style.borderColor = item.borderColor
                }}
              >
                {/* アイコン背景 */}
                <div 
                  className="menu-icon-bg"
                  style={{
                    backgroundColor: item.bgColor
                  }} 
                />
                
                {/* アイコン */}
                <div className="menu-icon">
                  {item.icon}
                </div>
                
                {/* コンテンツ */}
                <div className="menu-content" style={{ position: 'relative', zIndex: 1 }}>
                  <h3 
                    className="menu-title"
                    style={{ color: item.color }}
                  >
                    {item.title}
                  </h3>
                  
                  <p className="menu-description">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* フッター情報 */}
          <div className="footer-info">
            <p style={{ margin: 0 }}>
              🔐 セキュリティ状態: OAuth認証済み {isAdmin && '| PIN認証準備完了'}
            </p>
          </div>
        </div>
      </>
    </SecurityWrapper>
  )
}