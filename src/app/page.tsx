/**
 * パス: src/app/page.tsx
 * 目的: ホームページ - 認証後ダッシュボードを表示
 */
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Dashboard from './dashboard'

export default async function HomePage() {
  const supabase = await createClient()
  
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  // 未ログインの場合はログインページへリダイレクト
  if (error || !user) {
    redirect('/login')
  }

  // ダッシュボードを表示
  return <Dashboard user={user} />
}