'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, Mail, ArrowLeft, Shield, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function PendingApprovalPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      try {
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user || null)
      } catch (error) {
        console.error('ユーザー情報取得エラー:', error)
      } finally {
        setLoading(false)
      }
    }
    
    getUser()
  }, [])

  const handleSignOut = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/login')
    } catch (error) {
      console.error('サインアウトエラー:', error)
      router.push('/login')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* アイコン */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          {/* タイトル */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            管理者承認待ち
          </h1>

          {/* メッセージ */}
          <p className="text-gray-600 mb-2 leading-relaxed">
            ご利用いただきありがとうございます。<br />
            あなたのアカウントは現在、管理者の承認待ち状態です。
          </p>
          
          {/* ユーザー情報 */}
          {user?.email && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-blue-800">
                <strong>ログイン中のアカウント:</strong><br />
                {user.email}
              </p>
              <p className="text-xs text-blue-600 mt-2">
                申請日時: {new Date().toLocaleString('ja-JP')}
              </p>
            </div>
          )}
          
          {loading && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-gray-600">
                ユーザー情報を読み込み中...
              </p>
            </div>
          )}

          {/* 詳細情報 */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-700 mb-2">
              <Shield className="w-4 h-4" />
              <span className="font-medium">セキュリティについて</span>
            </div>
            <p className="text-sm text-gray-600">
              このシステムでは、セキュリティ強化のため管理者による承認制を採用しています。
              承認が完了すると、メール通知またはこのページでお知らせいたします。
            </p>
          </div>

          {/* 手順案内 */}
          <div className="text-left mb-6">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              承認完了までの流れ
            </h3>
            <ol className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">1</span>
                <span>管理者にログイン申請が送信されます</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">2</span>
                <span>管理者が承認手続きを行います</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">3</span>
                <span>承認完了後、システムにアクセス可能になります</span>
              </li>
            </ol>
          </div>

          {/* 連絡先情報 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>お急ぎの場合は</strong><br />
              システム管理者に直接ご連絡ください。<br />
              承認手続きを迅速に進めさせていただきます。
            </p>
          </div>

          {/* 操作ボタン */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              承認状況を確認
            </button>
            
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              サインアウトして別のアカウントでログイン
            </button>
            
            <button
              onClick={() => router.push('/login')}
              className="w-full px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              ログイン画面に戻る
            </button>
          </div>

          {/* フッター */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              このページは自動的に更新されます。<br />
              しばらくお待ちいただいた後、再度アクセスしてください。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}