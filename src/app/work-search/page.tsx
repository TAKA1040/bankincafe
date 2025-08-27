'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Search, Clock, Download, Filter, X, BarChart3 } from 'lucide-react'

// 型定義
interface WorkHistoryItem {
  id: number
  work_name: string
  unit_price: number
  customer_name: string
  date: string
  invoice_id?: number
  memo: string
  category: string
}

interface SearchFilters {
  keyword: string
  customer: string
  category: string
  minPrice: string
  maxPrice: string
  startDate: string
  endDate: string
}

interface WorkStatistics {
  totalWorks: number
  totalAmount: number
  averagePrice: number
  topCustomer: string
  topWork: string
}

// WorkSearchDBクラス
class WorkSearchDB {
  private data: WorkHistoryItem[]

  constructor() {
    this.data = this.loadData()
  }

  // 文字正規化関数（ひらがな・カタカナ・大文字小文字・全角半角を統一）
  private normalizeText(text: string): string {
    return text
      .toLowerCase() // 小文字変換
      .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0)) // 全角英数字を半角に
      .replace(/[ァ-ヴ]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0x60)) // カタカナをひらがなに
      .replace(/[　\s]/g, '') // 全角・半角スペースを削除
  }

  // 曖昧検索マッチング関数
  private fuzzyMatch(text: string, keyword: string): boolean {
    const normalizedText = this.normalizeText(text)
    const normalizedKeyword = this.normalizeText(keyword)
    return normalizedText.includes(normalizedKeyword)
  }

  private loadData(): WorkHistoryItem[] {
    try {
      const stored = localStorage.getItem('bankin_work_search')
      return stored ? JSON.parse(stored) : this.getDefaultData()
    } catch {
      return this.getDefaultData()
    }
  }

  private getDefaultData(): WorkHistoryItem[] {
    return [
      {
        id: 1,
        work_name: 'Webサイト制作',
        unit_price: 100000,
        customer_name: 'テクノロジー株式会社',
        date: '2024-01-15',
        invoice_id: 1,
        memo: 'レスポンシブ対応',
        category: 'Web制作'
      },
      {
        id: 2,
        work_name: 'システム保守',
        unit_price: 50000,
        customer_name: 'サンプル商事株式会社B',
        date: '2024-02-10',
        invoice_id: 2,
        memo: '月次保守',
        category: 'システム'
      },
      {
        id: 3,
        work_name: 'データベース設計',
        unit_price: 80000,
        customer_name: '株式会社UDトラックス',
        date: '2024-03-05',
        invoice_id: 3,
        memo: 'ER図作成含む',
        category: 'データベース'
      },
      {
        id: 4,
        work_name: 'SEO対策',
        unit_price: 30000,
        customer_name: 'テクノロジー株式会社',
        date: '2024-01-20',
        memo: 'キーワード分析',
        category: 'マーケティング'
      },
      {
        id: 5,
        work_name: 'サーバー構築',
        unit_price: 120000,
        customer_name: 'サンプル商事株式会社B',
        date: '2024-02-25',
        memo: 'AWS環境',
        category: 'インフラ'
      },
      {
        id: 6,
        work_name: 'モバイルアプリ開発',
        unit_price: 150000,
        customer_name: 'モバイル株式会社',
        date: '2024-03-10',
        memo: 'iOS/Android対応',
        category: 'アプリ開発'
      },
      {
        id: 7,
        work_name: 'セキュリティ監査',
        unit_price: 90000,
        customer_name: 'セキュリティ企業',
        date: '2024-03-15',
        memo: '脆弱性診断',
        category: 'セキュリティ'
      },
      {
        id: 8,
        work_name: 'API開発',
        unit_price: 70000,
        customer_name: 'テクノロジー株式会社',
        date: '2024-03-20',
        memo: 'REST API',
        category: 'システム'
      }
    ]
  }

  search(filters: SearchFilters): WorkHistoryItem[] {
    return this.data.filter(item => {
      // 作業名での検索（曖昧検索）
      if (filters.keyword.trim()) {
        const matchesKeyword = this.fuzzyMatch(item.work_name, filters.keyword)
        if (!matchesKeyword) return false
      }

      // 顧客フィルター
      if (filters.customer.trim()) {
        if (item.customer_name !== filters.customer) return false
      }

      // 種別フィルター（個別・セット価格）
      if (filters.category && filters.category !== 'all') {
        const isSet = item.category === 'Web制作' || item.category === 'システム' || item.category === 'データベース'
        if (filters.category === 'individual' && isSet) return false
        if (filters.category === 'set' && !isSet) return false
      }

      return true
    })
  }

  getStatistics(items: WorkHistoryItem[]): WorkStatistics {
    if (items.length === 0) {
      return {
        totalWorks: 0,
        totalAmount: 0,
        averagePrice: 0,
        topCustomer: '',
        topWork: ''
      }
    }

    const totalAmount = items.reduce((sum, item) => sum + item.unit_price, 0)
    const averagePrice = Math.round(totalAmount / items.length)

    // 顧客別集計
    const customerCounts = items.reduce((counts, item) => {
      counts[item.customer_name] = (counts[item.customer_name] || 0) + 1
      return counts
    }, {} as Record<string, number>)
    const topCustomer = Object.entries(customerCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || ''

    // 作業別集計
    const workCounts = items.reduce((counts, item) => {
      counts[item.work_name] = (counts[item.work_name] || 0) + 1
      return counts
    }, {} as Record<string, number>)
    const topWork = Object.entries(workCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || ''

    return {
      totalWorks: items.length,
      totalAmount,
      averagePrice,
      topCustomer,
      topWork
    }
  }

  getCategories(): string[] {
    const categories = [...new Set(this.data.map(item => item.category))]
    return categories.sort()
  }

  exportToCSV(items: WorkHistoryItem[]): void {
    const headers = [
      'ID', '作業名', '単価', '顧客名', '日付', '請求書ID', 'メモ', 'カテゴリ'
    ]
    
    const rows = items.map(item => [
      item.id.toString(),
      `"${item.work_name.replace(/"/g, '""')}"`,
      item.unit_price.toString(),
      `"${item.customer_name.replace(/"/g, '""')}"`,
      item.date,
      item.invoice_id?.toString() || '',
      `"${item.memo.replace(/"/g, '""')}"`,
      `"${item.category.replace(/"/g, '""')}"`
    ])

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `作業履歴_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    
    setTimeout(() => URL.revokeObjectURL(url), 100)
  }
}

export default function WorkSearchPage() {
  const router = useRouter()
  const [db] = useState(() => new WorkSearchDB())
  const [workItems, setWorkItems] = useState<WorkHistoryItem[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'customer' | 'work'>('price')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [selectedItem, setSelectedItem] = useState<WorkHistoryItem | null>(null)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  
  const [filters, setFilters] = useState<SearchFilters>({
    keyword: '',
    customer: '',
    category: 'all',
    minPrice: '',
    maxPrice: '',
    startDate: '',
    endDate: ''
  })

  // 検索処理
  useEffect(() => {
    const searchItems = async () => {
      setIsSearching(true)
      await new Promise(resolve => setTimeout(resolve, 200))
      const filtered = db.search(filters)
      setWorkItems(filtered)
      setIsSearching(false)
    }
    searchItems()
  }, [filters, db])

  // 初期データロード
  useEffect(() => {
    setWorkItems(db.data)
  }, [db])

  // ソート処理
  const sortedItems = useMemo(() => {
    const sorted = [...workItems].sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
          break
        case 'price':
          comparison = a.unit_price - b.unit_price
          break
        case 'customer':
          comparison = a.customer_name.localeCompare(b.customer_name)
          break
        case 'work':
          comparison = a.work_name.localeCompare(b.work_name)
          break
      }
      
      return sortOrder === 'asc' ? comparison : -comparison
    })
    
    return sorted
  }, [workItems, sortBy, sortOrder])

  const statistics = useMemo(() => {
    return db.getStatistics(workItems)
  }, [workItems, db])

  const categories = useMemo(() => {
    return db.getCategories()
  }, [db])

  const handleBack = () => router.push('/')

  const handleExportCSV = () => {
    db.exportToCSV(sortedItems)
  }

  const handleSort = (field: typeof sortBy) => {
    setSortBy(field)
    if (field === 'price') {
      setSortOrder('asc') // 価格は安い順がデフォルト
    } else if (field === 'date') {
      setSortOrder('desc') // 日付は新しい順がデフォルト
    } else {
      setSortOrder('asc') // 顧客名は昇順がデフォルト
    }
  }

  const clearFilters = () => {
    setFilters({
      keyword: '',
      customer: '',
      category: 'all',
      minPrice: '',
      maxPrice: '',
      startDate: '',
      endDate: ''
    })
  }

  const hasActiveFilters = filters.keyword || filters.customer || filters.startDate || filters.endDate;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <header className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Search className="text-blue-600" size={32} />
              <h1 className="text-2xl font-bold text-gray-800">作業価格履歴検索</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Download size={20} />
                CSV出力
              </button>
              <button
                onClick={handleBack}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
              >
                <ArrowLeft size={20} />
                戻る
              </button>
            </div>
          </div>
        </header>


        {/* 作業名検索セクション */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="max-w-2xl mx-auto">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
              <input
                type="text"
                placeholder="作業名を入力して検索（例：バンパー交換、オイル交換など）"
                value={filters.keyword}
                onChange={(e) => setFilters({...filters, keyword: e.target.value})}
                className="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <p className="text-sm text-gray-600 text-center">
              過去の作業履歴から価格情報を検索します。セット作業の場合は内訳詳細も確認できます。
            </p>
          </div>
          
          {workItems.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <BarChart3 size={16} className="text-blue-600" />
                  <span className="text-gray-700">該当件数:</span>
                  <span className="font-bold text-blue-600">{workItems.length}件</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-700">価格範囲:</span>
                  <span className="font-bold text-green-600">
                    ¥{Math.min(...workItems.map(item => item.unit_price)).toLocaleString()} 
                    ~ ¥{Math.max(...workItems.map(item => item.unit_price)).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-700">平均価格:</span>
                  <span className="font-bold text-orange-600">¥{statistics.averagePrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ソート・表示オプション */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-gray-700">並び替え:</span>
            <div className="flex gap-2">
              {[
                { key: 'date', label: '日付' },
                { key: 'price', label: '価格' },
                { key: 'customer', label: '顧客名' },
                { key: 'work', label: '作業名' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => handleSort(key as typeof sortBy)}
                  className={`px-3 py-1 rounded text-sm ${
                    sortBy === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label} {sortBy === key && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 作業価格比較テーブル */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {workItems.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              {filters.keyword ? '該当する作業履歴がありません' : '作業名を入力して検索してください'}
            </div>
          ) : (
            <>
              {/* 価格比較フィルター */}
              <div className="p-4 border-b bg-gray-50">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">並び替え:</label>
                    <select
                      value={sortBy}
                      onChange={(e) => handleSort(e.target.value as typeof sortBy)}
                      className="px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="price">価格順（安い順）</option>
                      <option value="date">日付順（新しい順）</option>
                      <option value="customer">顧客名順</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">表示:</label>
                    <select
                      value={filters.customer}
                      onChange={(e) => setFilters({...filters, customer: e.target.value})}
                      className="px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">全顧客</option>
                      {[...new Set(workItems.map(item => item.customer_name))].map(customer => (
                        <option key={customer} value={customer}>{customer}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">種別:</label>
                    <select
                      value={filters.category}
                      onChange={(e) => setFilters({...filters, category: e.target.value})}
                      className="px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">全て</option>
                      <option value="individual">個別価格のみ</option>
                      <option value="set">セット価格のみ</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 価格比較テーブル */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">価格</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">顧客</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">実施日</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">種別</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">備考</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">詳細</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedItems.map((item, index) => {
                      const isSet = item.category === 'Web制作' || item.category === 'システム' || item.category === 'データベース'
                      const priceLevel = item.unit_price <= Math.min(...workItems.map(i => i.unit_price)) * 1.1 ? 'lowest' :
                                        item.unit_price >= Math.max(...workItems.map(i => i.unit_price)) * 0.9 ? 'highest' : 'normal'
                      
                      return (
                        <tr key={item.id} className={`hover:bg-gray-50 ${
                          priceLevel === 'lowest' ? 'bg-green-50' : 
                          priceLevel === 'highest' ? 'bg-red-50' : ''
                        }`}>
                          <td className="px-4 py-4">
                            <div className={`text-lg font-bold ${
                              priceLevel === 'lowest' ? 'text-green-600' : 
                              priceLevel === 'highest' ? 'text-red-600' : 'text-blue-600'
                            }`}>
                              ¥{item.unit_price.toLocaleString()}
                            </div>
                            {priceLevel === 'lowest' && (
                              <div className="text-xs text-green-600 font-medium">最安値</div>
                            )}
                            {priceLevel === 'highest' && (
                              <div className="text-xs text-red-600 font-medium">最高値</div>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm font-medium text-gray-900">{item.customer_name}</div>
                            <div className="text-xs text-gray-500">請求書 #{item.invoice_id || item.id}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-900">
                              {new Date(item.date).toLocaleDateString('ja-JP')}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              isSet 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {isSet ? 'セット' : '個別'}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-700 max-w-32 truncate" title={item.memo}>
                              {item.memo || '-'}
                            </div>
                            {isSet && (
                              <div className="text-xs text-orange-600 mt-1">内訳確認可能</div>
                            )}
                          </td>
                          <td className="px-4 py-4 text-center">
                            <button
                              onClick={() => {
                                setSelectedItem(item)
                                setShowInvoiceModal(true)
                              }}
                              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              詳細
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* 価格分析サマリー */}
              <div className="p-4 border-t bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-green-600 font-bold text-lg">
                      ¥{Math.min(...workItems.map(item => item.unit_price)).toLocaleString()}
                    </div>
                    <div className="text-gray-600">最安値</div>
                  </div>
                  <div className="text-center">
                    <div className="text-red-600 font-bold text-lg">
                      ¥{Math.max(...workItems.map(item => item.unit_price)).toLocaleString()}
                    </div>
                    <div className="text-gray-600">最高値</div>
                  </div>
                  <div className="text-center">
                    <div className="text-blue-600 font-bold text-lg">
                      ¥{statistics.averagePrice.toLocaleString()}
                    </div>
                    <div className="text-gray-600">平均価格</div>
                  </div>
                  <div className="text-center">
                    <div className="text-orange-600 font-bold text-lg">
                      ¥{(Math.max(...workItems.map(item => item.unit_price)) - Math.min(...workItems.map(item => item.unit_price))).toLocaleString()}
                    </div>
                    <div className="text-gray-600">価格差</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* 請求書詳細モーダル */}
        {showInvoiceModal && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">
                    請求書詳細 #{selectedItem.invoice_id || selectedItem.id}
                  </h2>
                  <button
                    onClick={() => setShowInvoiceModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* 請求書情報 */}
                <div className="space-y-6">
                  {/* 基本情報 */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">基本情報</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-600">請求書番号:</span>
                        <div className="text-blue-600 font-bold">#{selectedItem.invoice_id || selectedItem.id}</div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">請求日:</span>
                        <div className="font-medium">{new Date(selectedItem.date).toLocaleDateString('ja-JP')}</div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">顧客名:</span>
                        <div className="font-medium">{selectedItem.customer_name}</div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">件名:</span>
                        <div className="font-medium">{selectedItem.work_name}業務</div>
                      </div>
                    </div>
                  </div>

                  {/* 登録番号 */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">登録情報</h3>
                    <div>
                      <span className="text-sm font-medium text-gray-600">登録番号:</span>
                      <div className="font-medium">
                        {selectedItem.customer_name.includes('UDトラックス') ? 'T9876543210987' : 
                         selectedItem.customer_name.includes('テクノロジー') ? 'T1234567890123' : '-'}
                      </div>
                    </div>
                  </div>

                  {/* 作業項目詳細 */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">作業項目</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border border-gray-200 rounded-lg">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">作業名</th>
                            <th className="px-4 py-2 text-center text-sm font-medium text-gray-600">数量</th>
                            <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">単価</th>
                            <th className="px-4 py-2 text-center text-sm font-medium text-gray-600">種別</th>
                            <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">金額</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-t border-gray-200">
                            <td className="px-4 py-2 text-sm">{selectedItem.work_name}</td>
                            <td className="px-4 py-2 text-center text-sm">1</td>
                            <td className="px-4 py-2 text-right text-sm">¥{selectedItem.unit_price.toLocaleString()}</td>
                            <td className="px-4 py-2 text-center text-sm">
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                {selectedItem.category === 'Web制作' || selectedItem.category === 'システム' ? 'セット' : '個別'}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-right text-sm font-medium">¥{selectedItem.unit_price.toLocaleString()}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 金額計算 */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">金額詳細</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">小計:</span>
                        <span className="font-medium">¥{selectedItem.unit_price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">消費税 (10%):</span>
                        <span className="font-medium">¥{Math.floor(selectedItem.unit_price * 0.1).toLocaleString()}</span>
                      </div>
                      <hr className="border-gray-300" />
                      <div className="flex justify-between text-lg font-bold">
                        <span className="text-gray-800">合計:</span>
                        <span className="text-blue-600">¥{(selectedItem.unit_price + Math.floor(selectedItem.unit_price * 0.1)).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* メモ */}
                  {selectedItem.memo && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-3 text-gray-800">メモ</h3>
                      <p className="text-gray-700 bg-white p-3 rounded border">{selectedItem.memo}</p>
                    </div>
                  )}
                </div>

                {/* フッター */}
                <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowInvoiceModal(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    閉じる
                  </button>
                  <button
                    onClick={() => {
                      setShowInvoiceModal(false)
                      router.push('/invoice-create')
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    新規請求書作成
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
