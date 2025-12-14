'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Car } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// 認証不要なページのパス
const PUBLIC_PATHS = ['/login', '/auth/pending', '/auth/callback', '/auth/password', '/test-auth', '/test-db']

// 追加パスワードの有効期限（1時間 = 3600000ミリ秒）
const PASSWORD_TIMEOUT_MS = 60 * 60 * 1000

interface AuthProviderProps {
  children: React.ReactNode
}

export default function AuthProviderSimple({ children }: AuthProviderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  


  // 認証不要なページかチェック
  const isPublicPath = pathname && PUBLIC_PATHS.some(path => pathname.startsWith(path))

  // 認証チェック - 根本的な解決策
  useEffect(() => {
    // 認証不要なページの場合は何もしない
    if (isPublicPath) {

      setIsLoading(false)
      return
    }
    
    const performAuthCheck = async () => {
      try {

        
        setIsLoading(true)
        
        const supabase = createClient()

        
        // セッション永続化チェック（開発時ログインキープ対応）
        const cachedSession = sessionStorage.getItem('supabase_session')
        if (cachedSession) {
          try {
            const parsedSession = JSON.parse(cachedSession)
            if (parsedSession.expires_at > Date.now() / 1000) {

              
              // キャッシュされたユーザーの管理者権限を再確認（API経由）
              const userEmail = parsedSession.user_email
              try {
                const response = await fetch('/api/auth/check-admin', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email: userEmail })
                })
                const { isAdmin: isAdminUser } = await response.json();

                if (isAdminUser) {
                  // 追加パスワードチェック（キャッシュセッション用）
                  const supabaseForPassword = createClient()
                  const { data: userDataCached } = await supabaseForPassword
                    .from('user_management')
                    .select('additional_password')
                    .eq('google_email', userEmail)
                    .single()

                  if (userDataCached?.additional_password) {
                    const passwordVerified = sessionStorage.getItem('additional_password_verified')
                    let needsPasswordAuth = true

                    if (passwordVerified) {
                      try {
                        const verifiedData = JSON.parse(passwordVerified)
                        if (verifiedData.user_email === userEmail) {
                          const elapsed = Date.now() - verifiedData.verified_at
                          if (elapsed < PASSWORD_TIMEOUT_MS) {
                            needsPasswordAuth = false
                            // 操作時刻を更新
                            verifiedData.verified_at = Date.now()
                            sessionStorage.setItem('additional_password_verified', JSON.stringify(verifiedData))
                          }
                        }
                      } catch (e) {
                        sessionStorage.removeItem('additional_password_verified')
                      }
                    }

                    if (needsPasswordAuth) {
                      setIsLoading(false)
                      router.push('/auth/password')
                      return
                    }
                  }

                  setIsAuthenticated(true)
                  setIsAdmin(true)
                  setIsLoading(false)
                  return
                } else {

                  sessionStorage.removeItem('supabase_session')
                  setIsAuthenticated(false)
                  router.push('/auth/pending')
                  return
                }
              } catch (error) {
                console.error('管理者権限チェックでエラー:', error)
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
        

        
        if (error) {
          console.error('❌ セッション取得エラー:', error)
          setIsAuthenticated(false)
          router.push('/login')
          return
        }
        
        if (!session?.user?.email) {

          setIsAuthenticated(false)
          router.push('/login')
          return
        }
        
        // 管理者チェック（API経由）
        const userEmail = session.user.email
        let isAdmin = false;
        try {
          const response = await fetch('/api/auth/check-admin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userEmail })
          })
          const result = await response.json();
          isAdmin = result.isAdmin;
        } catch (error) {
          console.error('管理者権限チェックでエラー:', error);
          isAdmin = false;
        }
        

        
        if (!isAdmin) {


          
          // 未承認ユーザーをuser_managementテーブルに記録（既存ユーザーのステータスは変更しない）
          try {
            // 既存ユーザーかどうか確認
            const { data: existingUser } = await supabase
              .from('user_management')
              .select('id, status')
              .eq('google_email', userEmail)
              .single()
            
            if (existingUser) {
              // 既存ユーザーの場合は最終ログイン時刻のみ更新（ステータスは変更しない）
              await supabase
                .from('user_management')
                .update({
                  last_login_at: new Date().toISOString(),
                  display_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '未設定'
                })
                .eq('google_email', userEmail)
            } else {
              // 新規ユーザーの場合のみ pending で登録
              const { error: insertError } = await supabase
                .from('user_management')
                .insert({
                  google_email: userEmail,
                  display_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '未設定',
                  status: 'pending',
                  requested_at: new Date().toISOString(),
                  last_login_at: new Date().toISOString()
                })
              
              if (insertError) {
                console.error('❌ 新規ユーザー登録エラー:', insertError)
              }
            }

          } catch (dbError) {
            console.error('❌ ユーザー登録処理で例外発生:', dbError)
          }
          
          setIsAuthenticated(false)
          router.push('/auth/pending')
          return
        }
        

        
        // セッションをキャッシュ（ログインキープ用）
        try {
          const sessionData = {
            expires_at: session.expires_at,
            is_admin: isAdmin,
            user_email: userEmail,
            cached_at: Date.now() / 1000
          }
          sessionStorage.setItem('supabase_session', JSON.stringify(sessionData))

        } catch (e) {
          console.warn('⚠️ セッションキャッシュ保存エラー:', e)
        }
        
        // 承認済みユーザーのログイン履歴も記録 & 追加パスワードチェック
        let additionalPassword: string | null = null
        try {
          const { data: existingUser, error: fetchError } = await supabase
            .from('user_management')
            .select('additional_password')
            .eq('google_email', userEmail)
            .single()

          if (!fetchError && existingUser) {
            additionalPassword = existingUser.additional_password
            // 既存ユーザーの場合はlast_login_atを更新
            await supabase
              .from('user_management')
              .update({
                last_login_at: new Date().toISOString(),
                display_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '管理者',
                status: 'approved'
              })
              .eq('google_email', userEmail)
          } else {
            // 新規ユーザーの場合は挿入
            await supabase
              .from('user_management')
              .insert({
                google_email: userEmail,
                display_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '管理者',
                status: 'approved',
                requested_at: new Date().toISOString(),
                approved_at: new Date().toISOString(),
                last_login_at: new Date().toISOString()
              })
          }

        } catch (dbError) {
          console.warn('⚠️ ログイン履歴記録でエラー:', dbError)
        }

        // 追加パスワードが設定されている場合、パスワード認証が必要
        if (additionalPassword) {
          const passwordVerified = sessionStorage.getItem('additional_password_verified')
          let needsPasswordAuth = true

          if (passwordVerified) {
            try {
              const verifiedData = JSON.parse(passwordVerified)
              // 同じユーザーで、1時間以内の認証であれば有効
              if (verifiedData.user_email === userEmail) {
                const elapsed = Date.now() - verifiedData.verified_at
                if (elapsed < PASSWORD_TIMEOUT_MS) {
                  needsPasswordAuth = false
                  // 操作時刻を更新（アクティビティ追跡）
                  verifiedData.verified_at = Date.now()
                  sessionStorage.setItem('additional_password_verified', JSON.stringify(verifiedData))
                }
              }
            } catch (e) {
              console.warn('⚠️ パスワード認証データ解析エラー:', e)
              sessionStorage.removeItem('additional_password_verified')
            }
          }

          if (needsPasswordAuth) {
            router.push('/auth/password')
            return
          }
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