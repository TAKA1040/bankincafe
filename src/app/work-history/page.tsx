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
  quantity: number
  total_amount: number
}

interface SearchFilters {
  keyword: string
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
}

// WorkHistoryDBクラス
class WorkHistoryDB {
  public data: WorkHistoryItem[]

  constructor() {
    this.data = this.loadData()
  }

  private loadData(): WorkHistoryItem[] {
    try {
      const stored = localStorage.getItem('bankin_work_history')
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
        quantity: 1,
        total_amount: 100000
      },
      {
        id: 2,
        work_name: 'システム保守',
        unit_price: 50000,
        customer_name: 'サンプル商事株式会社B',
        date: '2024-02-10',
        invoice_id: 2,
        memo: '月次保守',
        quantity: 1,
        total_amount: 50000
      },
      {
        id: 3,
        work_name: 'データベース設計',
        unit_price: 80000,
        customer_name: '株式会社UDトラックス',
        date: '2024-03-05',
        invoice_id: 3,
        memo: 'ER図作成含む',
        quantity: 1,
        total_amount: 80000
      },
      {
        id: 4,
        work_name: 'SEO対策',
        unit_price: 30000,
        customer_name: 'テクノロジー株式会社',
        date: '2024-01-20',
        memo: 'キーワード分析',
        quantity: 1,
        total_amount: 30000
      },
      {
        id: 5,
        work_name: 'サーバー構築',
        unit_price: 120000,
        customer_name: 'サンプル商事株式会社B',
        date: '2024-02-25',
        memo: 'AWS環境',
        quantity: 1,
        total_amount: 120000
      },
      {
        id: 6,
        work_name: 'モバイルアプリ開発',
        unit_price: 150000,
        customer_name: 'モバイル株式会社',
        date: '2024-03-10',
        memo: 'iOS/Android対応',
        quantity: 1,
        total_amount: 150000
      },
      {
        id: 7,
        work_name: 'セキュリティ監査',
        unit_price: 90000,
        customer_name: 'セキュリティ企業',
        date: '2024-03-15',
        memo: '脆弱性診断',
        quantity: 1,
        total_amount: 90000
      },
      {
        id: 8,
        work_name: 'API開発',
        unit_price: 70000,
        customer_name: 'テクノロジー株式会社',
        date: '2024-03-20',
        memo: 'REST API',
        quantity: 1,
        total_amount: 70000
      }
    ]
  }

  search(filters: SearchFilters): WorkHistoryItem[] {
    return this.data.filter(item => {
      // AND検索（空白区切りトークンでANDマッチ）
      if (filters.keyword.trim()) {
        const tokens = filters.keyword.toLowerCase().split(/\s+/).filter(Boolean)
        const searchText = [
          item.id.toString(),
          `#${item.id}`,
          item.work_name,
          item.customer_name,
          item.memo,
          item.date,
          item.invoice_id ? `請求書#${item.invoice_id}` : '',
          item.invoice_id ? item.invoice_id.toString() : ''
        ].join(' ').toLowerCase()
        
        // すべてのトークンがマッチする必要がある（AND検索）
        const allTokensMatch = tokens.every(token => searchText.includes(token))
        if (!allTokensMatch) return false
      }

      // 価格範囲フィルター（健全性チェック付き）
      if (filters.minPrice) {
        const minPrice = parseInt(filters.minPrice)
        if (isNaN(minPrice) || item.unit_price < minPrice) return false
      }
      if (filters.maxPrice) {
        const maxPrice = parseInt(filters.maxPrice)
        if (isNaN(maxPrice) || item.unit_price > maxPrice) return false
      }
      
      // min > max の場合の自動補正
      if (filters.minPrice && filters.maxPrice) {
        const minPrice = parseInt(filters.minPrice)
        const maxPrice = parseInt(filters.maxPrice)
        if (!isNaN(minPrice) && !isNaN(maxPrice) && minPrice > maxPrice) {
          // 自動補正: minとmaxを入れ替えてチェック
          if (item.unit_price < maxPrice || item.unit_price > minPrice) return false
        }
      }

      // 日付範囲フィルター（健全性チェック付き）
      if (filters.startDate) {
        try {
          const startDate = new Date(filters.startDate)
          const itemDate = new Date(item.date)
          if (isNaN(startDate.getTime()) || itemDate < startDate) return false
        } catch {
          return false
        }
      }
      if (filters.endDate) {
        try {
          const endDate = new Date(filters.endDate)
          const itemDate = new Date(item.date)
          if (isNaN(endDate.getTime()) || itemDate > endDate) return false
        } catch {
          return false
        }
      }
      
      // start > end の場合の自動補正
      if (filters.startDate && filters.endDate) {
        try {
          const startDate = new Date(filters.startDate)
          const endDate = new Date(filters.endDate)
          const itemDate = new Date(item.date)
          if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime()) && startDate > endDate) {
            // 自動補正: startとendを入れ替えてチェック
            if (itemDate < endDate || itemDate > startDate) return false
          }
        } catch {
          return false
        }
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
        topCustomer: ''
      }
    }

    const totalAmount = items.reduce((sum, item) => sum + item.total_amount, 0)
    const averagePrice = Math.round(totalAmount / items.length)

    // 顧客別集計（金額合計最大で決定）
    const customerAmounts = items.reduce((amounts, item) => {
      amounts[item.customer_name] = (amounts[item.customer_name] || 0) + item.total_amount
      return amounts
    }, {} as Record<string, number>)
    const topCustomer = Object.entries(customerAmounts).sort(([,a], [,b]) => b - a)[0]?.[0] || ''

    return {
      totalWorks: items.length,
      totalAmount,
      averagePrice,
      topCustomer
    }
  }


  exportToCSV(items: WorkHistoryItem[], filters: SearchFilters): void {
    if (items.length === 0) {
      alert('エクスポートするデータがありません')
      return
    }

    const headers = [
      'ID', '作業名', '単価', '顧客名', '日付', '請求書ID', 'メモ', '数量', '合計金額'
    ]
    
    const rows = items.map(item => [
      this.sanitizeCSVValue(item.id.toString()),
      this.sanitizeCSVValue(item.work_name),
      this.sanitizeCSVValue(item.unit_price.toString()),
      this.sanitizeCSVValue(item.customer_name),
      this.sanitizeCSVValue(item.date),
      this.sanitizeCSVValue(item.invoice_id?.toString() || ''),
      this.sanitizeCSVValue(item.memo),
      this.sanitizeCSVValue(item.quantity.toString()),
      this.sanitizeCSVValue(item.total_amount.toString())
    ])

    // BOM付きCSVコンテント
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    
    // ファイル名に期間やキーワードを含める
    let filename = '作業履歴'
    if (filters.keyword) filename += `_${filters.keyword.replace(/[\s\/\\:*?"<>|]/g, '_')}`
    if (filters.startDate) filename += `_${filters.startDate}`
    if (filters.endDate) filename += `_${filters.endDate}`
    filename += `_${new Date().toISOString().split('T')[0]}.csv`
    
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    
    // メモリリーク防止
    setTimeout(() => {
      URL.revokeObjectURL(url)
    }, 100)
  }

  private sanitizeCSVValue(value: string): string {
    // CSVインジェクション対策
    if (/^[=+\-@]/.test(value)) {
      value = "'" + value  // 先頭にシングルクォートを追加
    }
    
    // カンマ、改行、ダブルクォートが含まれる場合はクォートで囲む
    if (value.includes(',') || value.includes('\n') || value.includes('"')) {
      // ダブルクォートのエスケープ
      value = value.replace(/"/g, '""')
      value = `"${value}"`
    }
    
    return value
  }
}

export default function WorkHistoryPage() {
  const router = useRouter()
  const [db] = useState(() => new WorkHistoryDB())
  const [workItems, setWorkItems] = useState<WorkHistoryItem[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'customer' | 'work'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  
  const [filters, setFilters] = useState<SearchFilters>({
    keyword: '',
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

  const handleBack = () => router.push('/')

  const handleExportCSV = () => {
    db.exportToCSV(sortedItems, filters)
  }

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  const clearFilters = () => {
    setFilters({
      keyword: '',
      minPrice: '',
      maxPrice: '',
      startDate: '',
      endDate: ''
    })
  }

  const hasActiveFilters = filters.keyword || filters.minPrice || filters.maxPrice || filters.startDate || filters.endDate

  // 作業名からの即時絞り込み
  const handleWorkNameClick = (workName: string) => {
    setFilters(prev => ({ ...prev, keyword: workName }))
  }

  // 請求書表示への遷移
  const handleViewInvoice = (invoiceId: number) => {
    router.push(`/invoice-list?view=${invoiceId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <header className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Clock className="text-blue-600" size={32} />
              <h1 className="text-2xl font-bold text-gray-800">作業履歴管理</h1>
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

        {/* 統計情報 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-medium text-gray-600 flex items-center gap-1">
              <BarChart3 size={16} />
              総件数
            </h3>
            <p className="text-2xl font-bold text-gray-800">{statistics.totalWorks}件</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-medium text-gray-600">総金額</h3>
            <p className="text-2xl font-bold text-blue-600">¥{statistics.totalAmount.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-medium text-gray-600">平均単価</h3>
            <p className="text-2xl font-bold text-green-600">¥{statistics.averagePrice.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-medium text-gray-600">主要顧客</h3>
            <p className="text-sm font-bold text-purple-600 truncate">{statistics.topCustomer}</p>
          </div>
        </div>

        {/* 検索・フィルターセクション */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {/* AND検索キーワード */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2" id="search-label">
              🔍 AND検索（空白区切りで複数キーワード）
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="作業名 顧客名 メモ 請求書番号 等で検索..."
                value={filters.keyword}
                onChange={(e) => setFilters({...filters, keyword: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                aria-labelledby="search-label"
                aria-describedby="search-help"
              />
            </div>
            <p id="search-help" className="text-xs text-gray-500 mt-1">
              例: &ldquo;Web テクノロジー&rdquo; → &ldquo;Web&rdquo;と&ldquo;テクノロジー&rdquo;両方を含む結果を表示
            </p>
          </div>
          
          {/* フィルター */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-600 mb-1">最低価格</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="1000"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-600 mb-1">最高価格</label>
                <input
                  type="number"
                  placeholder="無制限"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="1000"
                />
              </div>
            </div>
          
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-600 mb-1">開始日</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-600 mb-1">終了日</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          
          {hasActiveFilters && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-gray-600">検索結果: {workItems.length}件</span>
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <X size={16} />
                フィルターをクリア
              </button>
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

        {/* 作業履歴一覧テーブル */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  作業情報
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  顧客名
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  単価・合計
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  日付・請求書
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  メモ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isSearching ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    検索中...
                  </td>
                </tr>
              ) : sortedItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    {hasActiveFilters ? '検索条件に一致する作業がありません' : '作業履歴がありません'}
                  </td>
                </tr>
              ) : (
                sortedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleWorkNameClick(item.work_name)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline text-left"
                        title="この作業名で絞り込み"
                      >
                        {item.work_name}
                      </button>
                      <div className="text-xs text-gray-500">
                        ID: {item.id}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {item.customer_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-sm font-medium text-gray-900">
                        ¥{item.unit_price.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        数量: {item.quantity} / 合計: ¥{item.total_amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {new Date(item.date).toLocaleDateString('ja-JP')}
                      </div>
                      {item.invoice_id ? (
                        <button
                          onClick={() => handleViewInvoice(item.invoice_id!)}
                          className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                          title="請求書を表示"
                        >
                          請求書 #{item.invoice_id}
                        </button>
                      ) : (
                        <div className="text-xs text-gray-400">
                          未請求
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">
                        {item.memo}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
