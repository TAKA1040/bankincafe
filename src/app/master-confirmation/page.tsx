'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Database, CheckCircle, AlertCircle, Users, Briefcase, Target, Settings, FileText, Home } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface MasterStats {
  customers: number
  targets: number
  actions: number
  positions: number
  invoiceItems: number
  targetCoverage: number
}

interface MasterData {
  tableName: string
  displayName: string
  count: number
  icon: React.ReactNode
  description: string
}

export default function MasterConfirmationPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<MasterStats | null>(null)
  const [masterData, setMasterData] = useState<MasterData[]>([])
  const [activeTab, setActiveTab] = useState<string>('overview')
  const [invoicesData, setInvoicesData] = useState<any[]>([])
  const [lineItemsData, setLineItemsData] = useState<any[]>([])
  const [dataLoading, setDataLoading] = useState(false)

  useEffect(() => {
    fetchMasterData()
  }, [])

  const fetchMasterData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const supabase = createClient()

      // 各マスターテーブルのデータ件数を取得
      const [
        customersResult,
        targetsResult, 
        actionsResult,
        positionsResult,
        invoiceItemsResult
      ] = await Promise.all([
        supabase.from('customers').select('*', { count: 'exact', head: true }),
        supabase.from('targets').select('*', { count: 'exact', head: true }),
        supabase.from('actions').select('*', { count: 'exact', head: true }),
        supabase.from('positions').select('*', { count: 'exact', head: true }),
        supabase.from('invoice_line_items').select('target', { count: 'exact' })
      ])

      // 対象データの取得率を計算
      const itemsWithTarget = invoiceItemsResult.data?.filter((item: { target: string | null }) => 
        item.target && item.target.trim() !== ''
      ).length || 0
      
      const totalItems = invoiceItemsResult.count || 0
      const targetCoverage = totalItems > 0 ? Math.round((itemsWithTarget / totalItems) * 100) : 0

      const statsData: MasterStats = {
        customers: customersResult.count || 0,
        targets: targetsResult.count || 0,
        actions: actionsResult.count || 0,
        positions: positionsResult.count || 0,
        invoiceItems: totalItems,
        targetCoverage
      }

      setStats(statsData)

      // マスターデータ一覧を構成
      const masterList: MasterData[] = [
        {
          tableName: 'customers',
          displayName: '顧客マスタ',
          count: statsData.customers,
          icon: <Users className="w-8 h-8 text-blue-500" />,
          description: '顧客情報の管理'
        },
        {
          tableName: 'targets', 
          displayName: '対象マスタ',
          count: statsData.targets,
          icon: <Target className="w-8 h-8 text-green-500" />,
          description: '作業対象の分類管理'
        },
        {
          tableName: 'actions',
          displayName: '作業マスタ', 
          count: statsData.actions,
          icon: <Briefcase className="w-8 h-8 text-orange-500" />,
          description: '作業内容の分類管理'
        },
        {
          tableName: 'positions',
          displayName: '部位マスタ',
          count: statsData.positions, 
          icon: <Settings className="w-8 h-8 text-purple-500" />,
          description: '作業部位の分類管理'
        }
      ]

      setMasterData(masterList)

    } catch (err) {
      console.error('Error fetching master data:', err)
      setError(err instanceof Error ? err.message : 'マスターデータの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (count: number) => {
    if (count === 0) {
      return <AlertCircle className="w-6 h-6 text-red-500" />
    }
    return <CheckCircle className="w-6 h-6 text-green-500" />
  }

  const getStatusText = (count: number) => {
    if (count === 0) {
      return { text: 'データなし', color: 'text-red-600' }
    }
    if (count < 10) {
      return { text: '要確認', color: 'text-yellow-600' }
    }
    return { text: '正常', color: 'text-green-600' }
  }

  const fetchTableData = async (tableName: string) => {
    setDataLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        console.error(`Error fetching ${tableName}:`, error)
        return []
      }
      return data || []
    } catch (err) {
      console.error(`Error fetching ${tableName}:`, err)
      return []
    } finally {
      setDataLoading(false)
    }
  }

  const handleTabChange = async (tabName: string) => {
    setActiveTab(tabName)
    
    if (tabName === 'invoices' && invoicesData.length === 0) {
      const data = await fetchTableData('invoices')
      setInvoicesData(data)
    } else if (tabName === 'invoice_line_items' && lineItemsData.length === 0) {
      const data = await fetchTableData('invoice_line_items')
      setLineItemsData(data)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <p>マスターデータを確認中...</p>
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
            <div>
              <h1 className="text-2xl font-bold text-gray-800">マスター確認</h1>
              <p className="text-gray-600">マスターデータの登録状況と統計情報</p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium"
            >
              <Home size={20} />
              メニューへ
            </button>
          </div>
        </header>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            エラー: {error}
          </div>
        )}

        {/* 統計サマリー */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">請求書明細</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats?.invoiceItems.toLocaleString() || 0}件
                </p>
              </div>
              <Database className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">対象取得率</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats?.targetCoverage || 0}%
                </p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">マスタテーブル</p>
                <p className="text-2xl font-bold text-purple-600">
                  {masterData.length}種類
                </p>
              </div>
              <Settings className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">総登録数</p>
                <p className="text-2xl font-bold text-orange-600">
                  {masterData.reduce((sum, item) => sum + item.count, 0).toLocaleString()}件
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* タブ切り替え */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => handleTabChange('overview')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  概要
                </div>
              </button>
              <button
                onClick={() => handleTabChange('invoices')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'invoices'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  請求書データ
                </div>
              </button>
              <button
                onClick={() => handleTabChange('invoice_line_items')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'invoice_line_items'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  請求書明細
                </div>
              </button>
              <button
                onClick={() => handleTabChange('targets')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'targets'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  対象マスタ
                </div>
              </button>
              <button
                onClick={() => handleTabChange('actions')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'actions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  作業マスタ
                </div>
              </button>
              <button
                onClick={() => handleTabChange('positions')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'positions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  部位マスタ
                </div>
              </button>
            </nav>
          </div>

          {/* タブコンテンツ */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Database className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-800">マスターデータ概要</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">マスター種別</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">説明</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-600">登録件数</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-600">ステータス</th>
                      </tr>
                    </thead>
                    <tbody>
                      {masterData.map((master) => {
                        const status = getStatusText(master.count)
                        return (
                          <tr key={master.tableName} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                {master.icon}
                                <span className="font-medium text-gray-900">{master.displayName}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-gray-600">
                              {master.description}
                            </td>
                            <td className="py-4 px-4 text-right">
                              <span className="text-lg font-semibold text-gray-900">
                                {master.count.toLocaleString()}件
                              </span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                {getStatusIcon(master.count)}
                                <span className={`text-sm font-medium ${status.color}`}>
                                  {status.text}
                                </span>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'invoices' && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-800">請求書データ（最新50件）</h2>
                </div>
                {dataLoading ? (
                  <div className="text-center py-8 text-gray-500">データを読み込み中...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                          <th className="text-left py-3 px-2 font-medium text-gray-600">請求書ID</th>
                          <th className="text-left py-3 px-2 font-medium text-gray-600">顧客名</th>
                          <th className="text-left py-3 px-2 font-medium text-gray-600">件名</th>
                          <th className="text-left py-3 px-2 font-medium text-gray-600">登録番号</th>
                          <th className="text-right py-3 px-2 font-medium text-gray-600">金額</th>
                          <th className="text-left py-3 px-2 font-medium text-gray-600">発行日</th>
                          <th className="text-left py-3 px-2 font-medium text-gray-600">ステータス</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoicesData.map((invoice, index) => (
                          <tr key={invoice.invoice_id || index} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-2 font-mono text-xs">{invoice.invoice_id}</td>
                            <td className="py-3 px-2">{invoice.customer_name}</td>
                            <td className="py-3 px-2">{invoice.subject_name}</td>
                            <td className="py-3 px-2 font-mono text-xs">{invoice.registration_number}</td>
                            <td className="py-3 px-2 text-right font-semibold">¥{(invoice.total || invoice.total_amount || 0)?.toLocaleString()}</td>
                            <td className="py-3 px-2">{invoice.issue_date}</td>
                            <td className="py-3 px-2">
                              <span className={`px-2 py-1 rounded text-xs ${
                                invoice.status === 'finalized' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {invoice.status === 'finalized' ? '確定' : '下書き'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {invoicesData.length === 0 && (
                      <div className="text-center py-8 text-gray-500">データがありません</div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'invoice_line_items' && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Settings className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-800">請求書明細データ（最新50件）</h2>
                </div>
                {dataLoading ? (
                  <div className="text-center py-8 text-gray-500">データを読み込み中...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                          <th className="text-left py-3 px-2 font-medium text-gray-600">ID</th>
                          <th className="text-left py-3 px-2 font-medium text-gray-600">請求書ID</th>
                          <th className="text-left py-3 px-2 font-medium text-gray-600">行番号</th>
                          <th className="text-left py-3 px-2 font-medium text-gray-600">タイプ</th>
                          <th className="text-left py-3 px-2 font-medium text-gray-600">作業ラベル</th>
                          <th className="text-left py-3 px-2 font-medium text-gray-600">対象</th>
                          <th className="text-left py-3 px-2 font-medium text-gray-600">動作</th>
                          <th className="text-left py-3 px-2 font-medium text-gray-600">部位</th>
                          <th className="text-right py-3 px-2 font-medium text-gray-600">単価</th>
                          <th className="text-right py-3 px-2 font-medium text-gray-600">数量</th>
                          <th className="text-right py-3 px-2 font-medium text-gray-600">金額</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lineItemsData.map((item, index) => (
                          <tr key={item.id || index} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-2 font-mono text-xs">{item.id}</td>
                            <td className="py-3 px-2 font-mono text-xs">{item.invoice_id}</td>
                            <td className="py-3 px-2 text-center">{item.line_no}</td>
                            <td className="py-3 px-2 text-center">
                              <span className={`px-2 py-1 rounded text-xs font-mono ${
                                item.task_type === 'T' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {item.task_type}
                              </span>
                            </td>
                            <td className="py-3 px-2 max-w-xs truncate" title={item.raw_label}>
                              {item.raw_label}
                            </td>
                            <td className="py-3 px-2">{item.target || '-'}</td>
                            <td className="py-3 px-2">{item.action || '-'}</td>
                            <td className="py-3 px-2">{item.position || '-'}</td>
                            <td className="py-3 px-2 text-right">¥{item.unit_price?.toLocaleString()}</td>
                            <td className="py-3 px-2 text-right">{item.quantity}</td>
                            <td className="py-3 px-2 text-right font-semibold">¥{item.amount?.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {lineItemsData.length === 0 && (
                      <div className="text-center py-8 text-gray-500">データがありません</div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'targets' && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Target className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-800">対象マスタ詳細</h2>
                </div>
                <div className="text-center py-8 text-gray-500">
                  対象マスタの詳細情報をここに表示します
                </div>
              </div>
            )}

            {activeTab === 'actions' && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-800">作業マスタ詳細</h2>
                </div>
                <div className="text-center py-8 text-gray-500">
                  作業マスタの詳細情報をここに表示します
                </div>
              </div>
            )}

            {activeTab === 'positions' && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Settings className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-800">部位マスタ詳細</h2>
                </div>
                <div className="text-center py-8 text-gray-500">
                  部位マスタの詳細情報をここに表示します
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 対象取得詳細 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">対象データ取得状況</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">総明細件数</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {stats?.invoiceItems.toLocaleString() || 0}
              </p>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">対象取得済み</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {stats ? Math.round((stats.invoiceItems * stats.targetCoverage) / 100).toLocaleString() : 0}
              </p>
            </div>

            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-600">対象未取得</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">
                {stats ? Math.round(stats.invoiceItems * (100 - stats.targetCoverage) / 100).toLocaleString() : 0}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>取得率: {stats?.targetCoverage || 0}%</span>
              <span>未取得率: {100 - (stats?.targetCoverage || 0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-green-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${stats?.targetCoverage || 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}