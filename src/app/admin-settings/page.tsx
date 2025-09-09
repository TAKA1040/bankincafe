'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Users, Settings, Shield, CheckCircle, Clock, XCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface UserManagement {
  id: string
  google_email: string
  display_name: string | null
  status: 'pending' | 'approved' | 'rejected'
  requested_at: string | null
  approved_at: string | null
  last_login_at: string | null
}

interface AdminSettings {
  id: string
  setting_key: string
  setting_value: string
}

export default function AdminSettingsPage() {
  const router = useRouter()
  const [users, setUsers] = useState<UserManagement[]>([])
  const [settings, setSettings] = useState<AdminSettings[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // データ読み込み
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const supabase = createClient()

      // ユーザー管理データを取得
      const { data: usersData, error: usersError } = await supabase
        .from('user_management')
        .select('*')
        .order('requested_at', { ascending: false })

      if (usersError && usersError.code !== 'PGRST116') {
        // テーブルが存在しない場合は空配列を設定
        console.log('user_management テーブルが存在しない、または空です')
        setUsers([])
      } else {
        setUsers(usersData || [])
      }

      // 管理者設定データを取得
      const { data: settingsData, error: settingsError } = await supabase
        .from('admin_settings')
        .select('*')
        .order('setting_key')

      if (settingsError && settingsError.code !== 'PGRST116') {
        console.log('admin_settings テーブルが存在しない、または空です')
        setSettings([])
      } else {
        setSettings(settingsData || [])
      }
    } catch (err) {
      console.error('Error fetching data:', err)
      setError(err instanceof Error ? err.message : 'データの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  // 管理者ユーザー追加
  const addAdminUser = async (email: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('user_management')
        .insert({
          google_email: email,
          display_name: '管理者',
          status: 'approved',
          requested_at: new Date().toISOString(),
          approved_at: new Date().toISOString()
        })

      if (error) {
        // 既存ユーザーの場合は更新
        if (error.code === '23505') {
          const { error: updateError } = await supabase
            .from('user_management')
            .update({
              status: 'approved',
              approved_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('google_email', email)

          if (updateError) throw updateError
        } else {
          throw error
        }
      }

      // データを再取得
      await fetchData()
      alert(`${email} を管理者として登録しました`)
    } catch (err) {
      console.error('Error adding admin user:', err)
      alert('管理者ユーザーの追加に失敗しました: ' + (err as Error).message)
    }
  }

  // テスト用承認待ちユーザー追加
  const addTestPendingUser = async () => {
    const testEmails = [
      'test.user1@gmail.com',
      'test.user2@gmail.com', 
      'pending.user@yahoo.com',
      'sample.user@outlook.com'
    ]
    
    const randomEmail = testEmails[Math.floor(Math.random() * testEmails.length)]
    
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('user_management')
        .insert({
          google_email: randomEmail,
          display_name: `テストユーザー${Math.floor(Math.random() * 100)}`,
          status: 'pending',
          requested_at: new Date().toISOString(),
          last_login_at: new Date().toISOString()
        })

      if (error && error.code !== '23505') {
        throw error
      }

      // データを再取得
      await fetchData()
      alert(`${randomEmail} をテスト承認待ちユーザーとして追加しました`)
    } catch (err) {
      console.error('Error adding test user:', err)
      alert('テストユーザーの追加に失敗しました: ' + (err as Error).message)
    }
  }

  // ユーザーステータス更新
  const updateUserStatus = async (userId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const supabase = createClient()
      const updates: any = {
        status: newStatus,
        updated_at: new Date().toISOString()
      }

      if (newStatus === 'approved') {
        updates.approved_at = new Date().toISOString()
        // TODO: 実際の認証実装時にapproved_byを設定
      }

      const { error } = await supabase
        .from('user_management')
        .update(updates)
        .eq('id', userId)

      if (error) throw error

      // データを再取得
      await fetchData()
    } catch (err) {
      console.error('Error updating user status:', err)
      alert('ステータスの更新に失敗しました: ' + (err as Error).message)
    }
  }

  // 設定値更新
  const updateSetting = async (settingKey: string, newValue: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('admin_settings')
        .update({
          setting_value: newValue,
          updated_at: new Date().toISOString()
        })
        .eq('setting_key', settingKey)

      if (error) throw error

      // データを再取得
      await fetchData()
    } catch (err) {
      console.error('Error updating setting:', err)
      alert('設定の更新に失敗しました: ' + (err as Error).message)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'pending':
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return '承認済み'
      case 'rejected':
        return '拒否'
      case 'pending':
      default:
        return '承認待ち'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <p>設定データを読み込み中...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <header className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">管理者設定</h1>
                <p className="text-gray-600">ユーザー管理・システム設定</p>
              </div>
            </div>
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
        </header>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            エラー: {error}
          </div>
        )}

        {/* ユーザー管理セクション */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">ユーザー管理</h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => addAdminUser('dash201206@gmail.com')}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                管理者を追加
              </button>
              <button
                onClick={() => addTestPendingUser()}
                className="px-4 py-2 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 flex items-center gap-2"
              >
                <Clock className="w-4 h-4" />
                テストユーザー追加
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">メールアドレス</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">表示名</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">ステータス</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">申請日時</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">最終ログイン</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      登録ユーザーはありません
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{user.google_email}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {user.display_name || '未設定'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(user.status)}
                          <span className="text-sm text-gray-900">
                            {getStatusText(user.status)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {user.requested_at ? new Date(user.requested_at).toLocaleString('ja-JP') : '未設定'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {user.last_login_at 
                          ? new Date(user.last_login_at).toLocaleString('ja-JP')
                          : '未ログイン'
                        }
                      </td>
                      <td className="px-4 py-3">
                        {user.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateUserStatus(user.id, 'approved')}
                              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                            >
                              承認
                            </button>
                            <button
                              onClick={() => updateUserStatus(user.id, 'rejected')}
                              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                            >
                              拒否
                            </button>
                          </div>
                        )}
                        {user.status === 'approved' && (
                          <button
                            onClick={() => updateUserStatus(user.id, 'rejected')}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                          >
                            無効化
                          </button>
                        )}
                        {user.status === 'rejected' && (
                          <button
                            onClick={() => updateUserStatus(user.id, 'approved')}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                          >
                            再承認
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* システム設定セクション */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">システム設定</h2>
          </div>

          <div className="space-y-4">
            {settings.map((setting) => (
              <div key={setting.id} className="flex justify-between items-center py-3 border-b border-gray-200">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {setting.setting_key === 'google_oauth_enabled' && 'Google OAuth認証'}
                    {setting.setting_key === 'require_admin_approval' && '管理者承認必須'}
                    {setting.setting_key === 'default_user_role' && 'デフォルトユーザー権限'}
                    {!['google_oauth_enabled', 'require_admin_approval', 'default_user_role'].includes(setting.setting_key) && setting.setting_key}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {setting.setting_key === 'google_oauth_enabled' && 'Google アカウントでのログインを有効にする'}
                    {setting.setting_key === 'require_admin_approval' && '新規ユーザーに管理者承認を必須とする'}
                    {setting.setting_key === 'default_user_role' && '新規ユーザーのデフォルト権限レベル'}
                  </p>
                </div>
                <div>
                  {setting.setting_key === 'google_oauth_enabled' || setting.setting_key === 'require_admin_approval' ? (
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={setting.setting_value === 'true'}
                        onChange={(e) => updateSetting(setting.setting_key, e.target.checked ? 'true' : 'false')}
                        className="sr-only"
                      />
                      <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        setting.setting_value === 'true' ? 'bg-blue-600' : 'bg-gray-300'
                      }`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          setting.setting_value === 'true' ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </div>
                    </label>
                  ) : (
                    <input
                      type="text"
                      value={setting.setting_value}
                      onChange={(e) => updateSetting(setting.setting_key, e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 統計情報 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">承認待ちユーザー</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {users.filter(u => u.status === 'pending').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">承認済みユーザー</p>
                <p className="text-2xl font-bold text-green-600">
                  {users.filter(u => u.status === 'approved').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">総ユーザー数</p>
                <p className="text-2xl font-bold text-blue-600">{users.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}