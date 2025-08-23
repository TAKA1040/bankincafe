/**
 * パス: src/app/dashboard.tsx
 * 目的: 鈑金Cafeメインダッシュボード（TOPメニュー）
 */
'use client'
import React from 'react'
import { FileText, Eye, BarChart3, Search, Settings, User, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import SecurityWrapper from '@/components/security-wrapper'

interface DashboardProps {
  user: {
    email: string
    user_metadata?: {
      full_name?: string
    }
  }
}

export default function Dashboard({ user }: DashboardProps) {
  const router = useRouter()
  const supabase = createClient()

  // メニューアイテムの定義
  const menuItems = [
    { 
      id: 'invoice-create', 
      title: '請求書新規作成', 
      desc: '新しい請求書を作成する', 
      color: 'bg-cyan-400 hover:bg-cyan-500',
      icon: FileText,
      route: '/invoice-create'
    },
    { 
      id: 'invoice-list', 
      title: '請求書一覧', 
      desc: '請求書の確認・編集', 
      color: 'bg-cyan-400 hover:bg-cyan-500',
      icon: Eye,
      route: '/invoice-list'
    },
    { 
      id: 'sales-management', 
      title: '売上管理', 
      desc: '売上データの確認', 
      color: 'bg-cyan-400 hover:bg-cyan-500',
      icon: BarChart3,
      route: '/sales-management'
    },
    { 
      id: 'work-history', 
      title: '作業内容履歴', 
      desc: '過去の作業価格などの確認', 
      color: 'bg-cyan-400 hover:bg-cyan-500',
      icon: Search,
      route: '/work-history'
    },
    { 
      id: 'settings', 
      title: '設定', 
      desc: '各種設定画面', 
      color: 'bg-cyan-400 hover:bg-cyan-500',
      icon: Settings,
      route: '/settings'
    }
  ]

  // メニュークリック処理
  const handleMenuClick = (item: typeof menuItems[0]) => {
    console.log(`🎯 [DASHBOARD] Menu selected: ${item.title}`)
    // 将来的にはrouter.push(item.route)でページ遷移
    alert(`「${item.title}」が選択されました\n\n※まだ実装中です`)
  }

  // ログアウト処理
  const handleSignOut = async () => {
    try {
      console.log('🚪 [DASHBOARD] Signing out user')
      await supabase.auth.signOut()
      router.push('/login')
    } catch (error) {
      console.error('[DASHBOARD] Sign out error:', error)
      alert('ログアウトに失敗しました')
    }
  }

  // 管理者判定
  const isAdmin = user.email === 'dash201206@gmail.com'

  return (
    <SecurityWrapper requirePin={false}> {/* 将来PIN認証を有効化 */}
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        padding: '2rem'
      }}>
        {/* ヘッダー */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          backgroundColor: '#ffffff',
          padding: '1rem 2rem',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: 0
            }}>
              請求書システム
            </h1>
            <p style={{
              color: '#6b7280',
              margin: '0.25rem 0 0 0',
              fontSize: '0.9rem'
            }}>
              鈑金Cafe 業務管理システム
            </p>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            {/* ユーザー情報 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#f3f4f6',
              padding: '0.5rem 1rem',
              borderRadius: '8px'
            }}>
              <User size={20} color="#6b7280" />
              <div style={{ textAlign: 'right' }}>
                <p style={{
                  margin: 0,
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: isAdmin ? '#059669' : '#6b7280'
                }}>
                  {isAdmin ? '管理者' : '一般ユーザー'}
                </p>
                <p style={{
                  margin: 0,
                  fontSize: '0.75rem',
                  color: '#9ca3af'
                }}>
                  {user.user_metadata?.full_name || user.email}
                </p>
              </div>
            </div>

            {/* ログアウトボタン */}
            <button
              onClick={handleSignOut}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#ef4444',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '500'
              }}
            >
              <LogOut size={16} />
              ログアウト
            </button>
          </div>
        </div>

        {/* メインメニュー */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {menuItems.map((item) => {
              const IconComponent = item.icon
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item)}
                  style={{
                    backgroundColor: '#ffffff',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '2rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    textAlign: 'left',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  {/* アイコン背景 */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '64px',
                    height: '64px',
                    borderRadius: '12px',
                    backgroundColor: '#06b6d4',
                    marginBottom: '1rem'
                  }}>
                    <IconComponent size={32} color="#ffffff" />
                  </div>

                  {/* タイトル */}
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    margin: '0 0 0.5rem 0'
                  }}>
                    {item.title}
                  </h3>

                  {/* 説明 */}
                  <p style={{
                    fontSize: '0.9rem',
                    color: '#6b7280',
                    margin: 0,
                    lineHeight: '1.5'
                  }}>
                    {item.desc}
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        {/* フッター */}
        <div style={{
          textAlign: 'center',
          marginTop: '3rem',
          padding: '2rem',
          borderTop: '1px solid #e5e7eb',
          color: '#9ca3af',
          fontSize: '0.85rem'
        }}>
          <p style={{ margin: 0 }}>
            鈑金Cafe 請求書システム - セキュア業務管理
          </p>
          <p style={{ margin: '0.25rem 0 0 0' }}>
            © 2025 鈑金Cafe. All rights reserved.
          </p>
        </div>
      </div>
    </SecurityWrapper>
  )
}