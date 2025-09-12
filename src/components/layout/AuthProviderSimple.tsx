'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Car } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// 認証不要なページのパス
const PUBLIC_PATHS = ['/login', '/auth/pending', '/auth/callback', '/test-auth', '/test-db']

interface AuthProviderProps {
  children: React.ReactNode
}

export default function AuthProviderSimple({ children }: AuthProviderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  console.log('🔄 AuthProviderSimple レンダリング:', { pathname })

  // 認証不要なページかチェック
  const isPublicPath = pathname && PUBLIC_PATHS.some(path => pathname.startsWith(path))

  // 認証チェック - 根本的な解決策
  useEffect(() => {
    // 認証不要なページの場合は何もしない
    if (isPublicPath) {
      console.log('✅ パブリックページ表示:', pathname)
      setIsLoading(false)
      return
    }
    
    const performAuthCheck = async () => {
      try {
        console.log('🔍 [AuthProviderSimple] 新しい認証システム開始:', { 
          pathname, 
          timestamp: new Date().toISOString()
        })
        
        setIsLoading(true)
        
        const supabase = createClient()
        console.log('📡 [AuthProviderSimple] 標準Supabaseクライアント作成完了')
        
        // セッション永続化チェック（開発時ログインキープ対応）
        const cachedSession = sessionStorage.getItem('supabase_session')
        if (cachedSession) {
          try {
            const parsedSession = JSON.parse(cachedSession)
            if (parsedSession.expires_at > Date.now() / 1000) {
              console.log('🔄 [AuthProviderSimple] キャッシュされたセッションを使用')
              
              // キャッシュされたユーザーの管理者権限を再確認（環境変数のみ）
              const userEmail = parsedSession.user_email
              const rawAllowedEmails = process.env.NEXT_PUBLIC_ALLOWED_EMAILS
              const allowedEmailsList = rawAllowedEmails?.split(',').map(e => e.trim()) || []
              const isAdminUser = allowedEmailsList.includes(userEmail)
              
              if (isAdminUser) {
                console.log('✅ [AuthProviderSimple] キャッシュセッション管理者確認完了')
                setIsAuthenticated(true)
                setIsAdmin(true)
                setIsLoading(false)
                return
              } else {
                console.log('❌ [AuthProviderSimple] キャッシュユーザーは管理者ではありません')
                sessionStorage.removeItem('supabase_session')
                setIsAuthenticated(false)
                router.push('/auth/pending')
                return
              }
            }
          } catch (e) {
            console.warn('⚠️ キャッシュセッション解析エラー:', e)
            sessionStorage.removeItem('supabase_session')
          }
        }

        // タイムアウト付きでセッション取得（時間を延長）
        const sessionPromise = supabase.auth.getSession()
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session timeout')), 15000)
        )
        
        const { data: { session }, error } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as any
        
        console.log('📡 [AuthProviderSimple] セッション取得完了:', {
          hasSession: !!session,
          hasUser: !!session?.user,
          userEmail: session?.user?.email,
          error: error?.message
        })
        
        if (error) {
          console.error('❌ セッション取得エラー:', error)
          setIsAuthenticated(false)
          router.push('/login')
          return
        }
        
        if (!session?.user?.email) {
          console.log('🔒 認証なし - ログインページへ')
          setIsAuthenticated(false)
          router.push('/login')
          return
        }
        
        // 管理者チェック（環境変数のみ）
        const userEmail = session.user.email
        const rawAllowedEmails = process.env.NEXT_PUBLIC_ALLOWED_EMAILS
        const allowedEmailsList = rawAllowedEmails?.split(',').map(e => e.trim()) || []
        const isAdmin = allowedEmailsList.includes(userEmail)
        
        console.log('🔐 管理者権限チェック:', {
          userEmail,
          isAdmin
        })
        
        if (!isAdmin) {
          console.log('❌ 許可されていないアカウント - 承認待ちページへ')
          console.log('📋 新規ユーザー登録開始:', {
            email: userEmail,
            full_name: session.user.user_metadata?.full_name,
            user_metadata: session.user.user_metadata
          })
          
          // 未承認ユーザーをuser_managementテーブルに登録
          try {
            const newUserData = {
              google_email: userEmail,
              display_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '未設定',
              status: 'pending' as const,
              requested_at: new Date().toISOString(),
              last_login_at: new Date().toISOString()
            }
            
            console.log('📝 データベース挿入データ:', newUserData)
            
            const { data: insertData, error: insertError } = await supabase
              .from('user_management')
              .insert(newUserData)
              .select()
            
            if (insertError) {
              if (insertError.code === '23505') {
                console.log('👤 既存ユーザー - ログイン履歴を更新')
                const { data: updateData, error: updateError } = await supabase
                  .from('user_management')
                  .update({
                    last_login_at: new Date().toISOString(),
                    display_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '未設定'
                  })
                  .eq('google_email', userEmail)
                  .select()
                
                if (updateError) {
                  console.error('❌ 既存ユーザー更新エラー:', updateError)
                } else {
                  console.log('✅ 既存ユーザー更新完了:', updateData)
                }
              } else {
                console.error('❌ 新規ユーザー挿入エラー:', insertError)
              }
            } else {
              console.log('✅ 新規ユーザー登録完了:', insertData)
            }
            
            console.log('📝 承認待ちユーザーをデータベースに登録/更新完了')
          } catch (dbError) {
            console.error('❌ ユーザー登録処理で例外発生:', dbError)
          }
          
          setIsAuthenticated(false)
          router.push('/auth/pending')
          return
        }
        
        console.log('✅ 認証・認可完了 - メインコンテンツ表示')
        
        // セッションをキャッシュ（ログインキープ用）
        try {
          const sessionData = {
            expires_at: session.expires_at,
            is_admin: isAdmin,
            user_email: userEmail,
            cached_at: Date.now() / 1000
          }
          sessionStorage.setItem('supabase_session', JSON.stringify(sessionData))
          console.log('💾 [AuthProviderSimple] セッションをキャッシュに保存')
        } catch (e) {
          console.warn('⚠️ セッションキャッシュ保存エラー:', e)
        }
        
        // 承認済みユーザーのログイン履歴も記録
        try {
          const { error: insertError } = await supabase
            .from('user_management')
            .insert({
              google_email: userEmail,
              display_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '管理者',
              status: 'approved',
              requested_at: new Date().toISOString(),
              approved_at: new Date().toISOString(),
              last_login_at: new Date().toISOString()
            })
          
          // 既存ユーザーの場合はlast_login_atを更新
          if (insertError && insertError.code === '23505') {
            await supabase
              .from('user_management')
              .update({
                last_login_at: new Date().toISOString(),
                display_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '管理者',
                status: 'approved' // 承認済みユーザーとして確実に設定
              })
              .eq('google_email', userEmail)
          }
          
          console.log('📝 管理者ログイン履歴を記録')
        } catch (dbError) {
          console.warn('⚠️ ログイン履歴記録でエラー:', dbError)
        }
        
        setIsAuthenticated(true)
        setIsAdmin(isAdmin)
        
      } catch (error) {
        console.error('❌ 認証チェックエラー:', error)
        setIsAuthenticated(false)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }
    
    performAuthCheck()
  }, [router, pathname, isPublicPath])

  // 認証不要なページの場合はそのまま表示
  if (isPublicPath) {
    return <>{children}</>
  }

  // 認証成功時はメインコンテンツ表示
  if (isAuthenticated === true && !isLoading) {
    console.log('🎉 メインコンテンツ表示')
    return <>{children}</>
  }

  // 認証チェック中はローディング表示
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-primary-600 rounded-full animate-bounce">
            <Car className="h-8 w-8 text-white" />
          </div>
        </div>
        <p className="text-secondary-600 font-medium">
          {isLoading ? '認証確認中...' : 'リダイレクト中...'}
        </p>
        <p className="text-xs text-secondary-500 mt-2">しばらくお待ちください</p>
      </div>
    </div>
  )
}