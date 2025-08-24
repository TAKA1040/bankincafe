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

  // CSS-in-JS用のスタイルシート作成
  const styles = `
    .dashboard-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
      font-family: system-ui, sans-serif;
    }

    .dashboard-header {
      background-color: white;
      border-radius: 16px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .dashboard-title {
      font-size: 2.5rem;
      font-weight: bold;
      color: #1f2937;
      margin: 0 0 0.5rem 0;
    }

    .dashboard-subtitle {
      color: #6b7280;
      margin: 0;
      font-size: 1.1rem;
    }

    .user-badge {
      margin-top: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      display: inline-block;
    }

    .logout-button {
      padding: 0.75rem 1.5rem;
      background-color: #ef4444;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 4px 6px rgba(239, 68, 68, 0.3);
    }

    .menu-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .menu-item {
      background-color: white;
      border-radius: 16px;
      padding: 2rem;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      border: 2px solid transparent;
      position: relative;
      overflow: hidden;
      display: block;
    }

    .menu-icon-bg {
      position: absolute;
      top: -20px;
      right: -20px;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      opacity: 0.7;
    }

    .menu-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      text-align: left;
    }

    .menu-content {
      width: 100%;
    }

    .menu-title {
      font-size: 1.5rem;
      font-weight: bold;
      margin: 0 0 0.5rem 0;
    }

    .menu-description {
      color: #6b7280;
      margin: 0;
      font-size: 1rem;
      line-height: 1.5;
    }

    .footer-info {
      text-align: center;
      margin-top: 3rem;
      color: rgba(255,255,255,0.8);
      font-size: 0.9rem;
    }

    /* モバイル対応 */
    @media (max-width: 768px) {
      .dashboard-container {
        padding: 1rem;
      }

      .dashboard-header {
        border-radius: 12px;
        padding: 1rem;
        margin-bottom: 1rem;
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
      }

      .dashboard-title {
        font-size: 1.5rem;
      }

      .dashboard-subtitle {
        font-size: 0.9rem;
      }

      .user-badge {
        padding: 0.25rem 0.75rem;
        margin-top: 0.25rem;
        font-size: 0.75rem;
      }

      .logout-button {
        padding: 0.5rem 1rem;
        font-size: 0.85rem;
        align-self: flex-end;
      }

      .menu-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
        max-width: 100%;
      }

      .menu-item {
        border-radius: 8px;
        padding: 0.75rem 1rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 0.75rem;
      }

      .menu-icon-bg {
        display: none;
      }

      .menu-icon {
        font-size: 1.5rem;
        margin-bottom: 0;
        min-width: 1.5rem;
        text-align: center;
      }

      .menu-content {
        flex: 1;
        min-width: 0;
      }

      .menu-title {
        font-size: 1rem;
        margin-bottom: 0.125rem;
        font-weight: 600;
      }

      .menu-description {
        font-size: 0.8rem;
        line-height: 1.2;
        opacity: 0.8;
      }

      .footer-info {
        margin-top: 1.5rem;
        font-size: 0.75rem;
      }
    }
  `

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
    console.log(`🎯 [DASHBOARD] Menu clicked: ${menuId}`)
    
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
        console.warn(`Unknown menu: ${menuId}`)
    }
  }

  const handleLogout = async () => {
    console.log('🔐 [DASHBOARD] Logout requested')
    
    // Supabaseログアウト処理
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('❌ [LOGOUT] Error:', error.message)
      alert(`ログアウトエラー: ${error.message}`)
    } else {
      console.log('✅ [LOGOUT] Success')
      router.push('/login')
    }
  }

  return (
    <SecurityWrapper requirePin={false}>
      <>
        {/* インラインCSS */}
        <style dangerouslySetInnerHTML={{ __html: styles }} />
        
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