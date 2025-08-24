/**
 * パス: src/app/page.tsx
 * 目的: ホームページ - 認証後ダッシュボードを表示
 */
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from '@/components/dashboard-client'

export default async function HomePage() {
  const supabase = await createClient()
  
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  // 開発中は認証をスキップ（本番では有効化）
  if (process.env.NODE_ENV === 'development') {
    // 開発環境では仮ユーザーを使用
    const mockUser = {
      email: 'dash201206@gmail.com',
      user_metadata: { full_name: '管理者' }
    }
    return <DashboardClient user={mockUser as any} />
  }

  // 未ログインの場合はログインページへリダイレクト
  if (error || !user) {
    redirect('/login')
  }

  // ダッシュボードを表示
  return <DashboardClient user={user as any} />
}