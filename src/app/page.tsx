'use client'

import { useRouter } from 'next/navigation'
import { FileText, Users, Search, Clock, BarChart3, Plus, Calculator, TrendingUp, Settings, Hash } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()

  const menuItems = [
    {
      title: '請求書作成',
      description: '新規請求書を作成・編集',
      icon: Plus,
      path: '/invoice-create',
      color: 'bg-blue-600 hover:bg-blue-700 shadow-lg',
      textColor: 'text-white',
      category: 'primary'
    },
    {
      title: '請求書一覧',
      description: '作成済み請求書の確認・管理',
      icon: FileText,
      path: '/invoice-list',
      color: 'bg-emerald-600 hover:bg-emerald-700 shadow-lg',
      textColor: 'text-white',
      category: 'primary'
    },
    {
      title: '顧客管理',
      description: '顧客情報の登録・編集・検索',
      icon: Users,
      path: '/customer-list',
      color: 'bg-violet-600 hover:bg-violet-700 shadow-lg',
      textColor: 'text-white',
      category: 'management'
    },
    {
      title: '顧客カテゴリ設定',
      description: '顧客カテゴリの管理・追加・編集',
      icon: Settings,
      path: '/customer-settings',
      color: 'bg-gray-600 hover:bg-gray-700 shadow-lg',
      textColor: 'text-white',
      category: 'settings'
    },
    {
      title: '件名マスタ設定',
      description: '件名のマスター管理・自動登録',
      icon: FileText,
      path: '/subject-settings',
      color: 'bg-teal-600 hover:bg-teal-700 shadow-lg',
      textColor: 'text-white',
      category: 'settings'
    },
    {
      title: '登録番号マスタ設定',
      description: '登録番号のマスター管理・自動登録',
      icon: Hash,
      path: '/registration-settings',
      color: 'bg-orange-600 hover:bg-orange-700 shadow-lg',
      textColor: 'text-white',
      category: 'settings'
    },
    {
      title: '作業履歴',
      description: '過去の作業実績を検索・管理',
      icon: Clock,
      path: '/work-history',
      color: 'bg-amber-600 hover:bg-amber-700 shadow-lg',
      textColor: 'text-white',
      category: 'analysis'
    },
    {
      title: '作業検索',
      description: '作業内容と価格を確認・分析',
      icon: Search,
      path: '/work-search',
      color: 'bg-rose-600 hover:bg-rose-700 shadow-lg',
      textColor: 'text-white',
      category: 'analysis'
    },
    {
      title: '売上管理',
      description: '月別売上の分析・レポート作成',
      icon: BarChart3,
      path: '/sales-management',
      color: 'bg-indigo-600 hover:bg-indigo-700 shadow-lg',
      textColor: 'text-white',
      category: 'analysis'
    }
  ]

  const primaryItems = menuItems.filter(item => item.category === 'primary')
  const managementItems = menuItems.filter(item => item.category === 'management')
  const analysisItems = menuItems.filter(item => item.category === 'analysis')
  const settingsItems = menuItems.filter(item => item.category === 'settings')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Bankincafe
          </h1>
          <p className="text-gray-600 text-lg mb-2">請求書管理システム</p>
          <p className="text-gray-500 text-sm">全9つの機能で請求書業務を効率化</p>
        </header>

        {/* メインメニュー */}
        <section className="mb-12 space-y-8">
          {/* 基本機能 */}
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
              🚀 基本機能
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {primaryItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.path}
                    onClick={() => router.push(item.path)}
                    className={`flex items-center gap-2 p-4 rounded-lg text-sm font-bold transition-all duration-200 hover:scale-105 ${item.color}`}
                  >
                    <Icon size={20} />
                    <span className="truncate">{item.title}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 管理・分析機能 */}
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
              📊 管理・分析機能
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[...managementItems, ...analysisItems].map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.path}
                    onClick={() => router.push(item.path)}
                    className={`flex items-center gap-2 p-3 rounded-lg text-sm font-bold transition-all duration-200 hover:scale-105 ${item.color}`}
                  >
                    <Icon size={18} />
                    <span className="truncate">{item.title}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* マスター設定 */}
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
              ⚙️ マスター設定
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {settingsItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.path}
                    onClick={() => router.push(item.path)}
                    className={`flex items-center gap-2 p-3 rounded-lg text-sm font-bold transition-all duration-200 hover:scale-105 ${item.color}`}
                  >
                    <Icon size={18} />
                    <span className="truncate">{item.title}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* システム情報 */}
        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl p-6 mb-8 max-w-4xl mx-auto">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              💡 システム機能
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
              <div className="flex items-center justify-center gap-2">
                <Calculator size={16} className="text-blue-600" />
                <span>自動計算・税込処理</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Search size={16} className="text-green-600" />
                <span>高度な検索・フィルター</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <TrendingUp size={16} className="text-purple-600" />
                <span>売上分析・レポート</span>
              </div>
            </div>
          </div>
        </div>

        {/* フッター */}
        <footer className="text-center text-gray-600 text-sm">
          <p>© 2024 Bankincafe - 請求書管理システム - All rights reserved</p>
        </footer>
      </div>
    </div>
  )
}