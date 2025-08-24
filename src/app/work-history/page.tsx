/**
 * パス: src/app/work-history/page.tsx
 * 目的: 作業履歴ページ - 過去の作業価格や実績を検索・確認
 */
'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SecurityWrapper from '@/components/security-wrapper'
import { Search, Download, Filter, Calendar } from 'lucide-react'

// 型定義
interface Invoice {
  invoice_no: string
  invoice_date: string
  customer_name: string
  subject: string
  registration: string
  total_amount_incl_tax: number
}

interface InvoiceItem {
  invoice_no: string
  is_set: number
  raw_text: string
  quantity: number
  unit_price: number
  amount: number
}

interface SearchResult {
  invoice_no: string
  customer_name: string
  subject: string
  registration: string
  date: string
  work_name: string
  quantity: number
  unit_price: number
  total: number
  is_set: number
}

interface WorkStatistics {
  count: number
  totalQuantity: number
  totalAmount: number
  avgPrice: number
  minPrice: number
  maxPrice: number
  lastUsed: number | null
}

// データ管理クラス
class WorkHistoryDB {
  invoices: Invoice[]
  invoiceItems: InvoiceItem[]
  initialized: boolean

  constructor() {
    this.invoices = []
    this.invoiceItems = []
    this.initialized = false
  }

  // サンプルデータで初期化
  initializeSampleData() {
    this.invoices = [
      {
        invoice_no: '25050001-1',
        invoice_date: '2025/5/15',
        customer_name: 'UDトラックス株式会社',
        subject: 'サンプル顧客A',
        registration: '筑豊130え1234',
        total_amount_incl_tax: 100000
      },
      {
        invoice_no: '25050002-1',
        invoice_date: '2025/5/20',
        customer_name: 'サブル商事',
        subject: 'サンプル顧客B',
        registration: '福岡100か5678',
        total_amount_incl_tax: 50000
      },
      {
        invoice_no: '25050003-1',
        invoice_date: '2025/4/25',
        customer_name: '田中運送株式会社',
        subject: '大型トラック修理',
        registration: '福岡300あ9999',
        total_amount_incl_tax: 150000
      },
      {
        invoice_no: '25050004-1',
        invoice_date: '2025/4/30',
        customer_name: '九州物流',
        subject: '定期メンテナンス',
        registration: '筑豊100さ5555',
        total_amount_incl_tax: 75000
      }
    ]

    this.invoiceItems = [
      {
        invoice_no: '25050001-1',
        is_set: 0,
        raw_text: 'バンパー修理',
        quantity: 1,
        unit_price: 100000,
        amount: 100000
      },
      {
        invoice_no: '25050002-1',
        is_set: 0,
        raw_text: 'サイドパネル塗装',
        quantity: 1,
        unit_price: 50000,
        amount: 50000
      },
      {
        invoice_no: '25050003-1',
        is_set: 1,
        raw_text: 'エンジン修理セット',
        quantity: 1,
        unit_price: 120000,
        amount: 120000
      },
      {
        invoice_no: '25050003-1',
        is_set: 0,
        raw_text: 'オイル交換',
        quantity: 1,
        unit_price: 15000,
        amount: 15000
      },
      {
        invoice_no: '25050003-1',
        is_set: 0,
        raw_text: 'フィルター交換',
        quantity: 1,
        unit_price: 15000,
        amount: 15000
      },
      {
        invoice_no: '25050004-1',
        is_set: 0,
        raw_text: '定期点検',
        quantity: 1,
        unit_price: 30000,
        amount: 30000
      },
      {
        invoice_no: '25050004-1',
        is_set: 0,
        raw_text: 'ブレーキパッド交換',
        quantity: 2,
        unit_price: 22500,
        amount: 45000
      }
    ]
    this.initialized = true
  }

  // 初期化
  async initialize() {
    if (this.initialized) return
    this.initializeSampleData()
  }

  // 作業検索（セット項目の処理を含む）
  searchWorkHistory(keyword: string, customerFilter: string, dateFrom: string, dateTo: string): SearchResult[] {
    const results: SearchResult[] = []
    
    this.invoices.forEach(invoice => {
      // 顧客フィルター
      if (customerFilter && !invoice.customer_name.includes(customerFilter)) {
        return
      }
      
      // 日付フィルター（YYYY/M/D形式に対応）
      const invoiceDate = this.parseDate(invoice.invoice_date)
      if (dateFrom && invoiceDate < new Date(dateFrom)) {
        return
      }
      if (dateTo && invoiceDate > new Date(dateTo)) {
        return
      }
      
      const items = this.invoiceItems.filter(item => item.invoice_no === invoice.invoice_no)
      
      items.forEach(item => {
        // セットの子項目（unit_price=0）は除外
        if (item.unit_price === 0) return
        
        // 作業名フィルター
        if (!keyword || item.raw_text.toLowerCase().includes(keyword.toLowerCase())) {
          results.push({
            invoice_no: invoice.invoice_no,
            customer_name: invoice.customer_name,
            subject: invoice.subject,
            registration: invoice.registration,
            date: invoice.invoice_date,
            work_name: item.raw_text,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total: item.amount,
            is_set: item.is_set
          })
        }
      })
    })

    // 日付順でソート（新しい順）
    results.sort((a, b) => this.parseDate(b.date).getTime() - this.parseDate(a.date).getTime())
    
    return results
  }

  // 日付パース（YYYY/M/D形式対応）
  parseDate(dateStr: string): Date {
    if (!dateStr) return new Date()
    const parts = dateStr.split('/')
    if (parts.length === 3) {
      return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]))
    }
    return new Date(dateStr)
  }

  // 作業名の候補を取得
  getWorkNameSuggestions(): string[] {
    const workNames = [...new Set(
      this.invoiceItems
        .filter(item => item.unit_price > 0 && item.raw_text) // 有料作業のみ
        .map(item => item.raw_text)
    )]
    return workNames.sort()
  }

  // 統計情報を取得
  getWorkStatistics(workName: string): WorkStatistics | null {
    const items = this.invoiceItems.filter(item => 
      item.raw_text === workName && item.unit_price > 0
    )
    if (items.length === 0) return null

    const prices = items.map(item => item.unit_price)
    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0)
    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0)

    // 最新使用日を取得
    const relatedInvoices = this.invoices.filter(inv => 
      items.some(item => item.invoice_no === inv.invoice_no)
    )
    const lastUsed = relatedInvoices.length > 0 
      ? new Date(Math.max(...relatedInvoices.map(inv => this.parseDate(inv.invoice_date).getTime())))
      : null

    return {
      count: items.length,
      totalQuantity: totalCount,
      totalAmount: totalAmount,
      avgPrice: Math.round(totalAmount / totalCount),
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      lastUsed: lastUsed?.getTime() || null
    }
  }

  // 顧客一覧を取得
  getCustomers(): string[] {
    const customers = [...new Set(this.invoices.map(inv => inv.customer_name))]
    return customers.sort()
  }
}

// メインコンポーネント
export default function WorkHistoryPage() {
  const router = useRouter()
  const [db] = useState(() => new WorkHistoryDB())
  const [searchKeyword, setSearchKeyword] = useState('')
  const [customerFilter, setCustomerFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [workSuggestions, setWorkSuggestions] = useState<string[]>([])
  const [customers, setCustomers] = useState<string[]>([])
  const [workStats, setWorkStats] = useState<WorkStatistics | null>(null)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [debouncedKeyword, setDebouncedKeyword] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 20

  // 初期データ読み込み
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true)
      await db.initialize()
      setWorkSuggestions(db.getWorkNameSuggestions())
      setCustomers(db.getCustomers())
      // 初期表示として全データを表示
      setSearchResults(db.searchWorkHistory('', '', '', ''))
      setIsLoading(false)
    }

    initializeData()
  }, [db])

  // 入力のデバウンス
  useEffect(() => {
    const t = setTimeout(() => setDebouncedKeyword(searchKeyword.trim()), 300)
    return () => clearTimeout(t)
  }, [searchKeyword])

  // フィルター変更時の自動検索（AND型の複数キーワード対応）＋ページリセット
  useEffect(() => {
    let results = db.searchWorkHistory('', customerFilter, dateFrom, dateTo)
    const tokens = debouncedKeyword.split(/\s+/).filter(Boolean).map(s => s.toLowerCase())
    if (tokens.length > 0) {
      results = results.filter(r => {
        const hay = `${r.invoice_no} ${r.customer_name} ${r.subject} ${r.registration} ${r.work_name} ${r.date}`.toLowerCase()
        return tokens.every(tok => hay.includes(tok))
      })
    }
    setSearchResults(results)
    setWorkStats(tokens.length === 1 ? db.getWorkStatistics(debouncedKeyword) : null)
    setCurrentPage(1)
  }, [db, debouncedKeyword, customerFilter, dateFrom, dateTo])

  // 検索実行
  const handleSearch = () => {
    setDebouncedKeyword(searchKeyword.trim())
    setCurrentPage(1)
  }

  // 作業名候補選択
  const selectWorkSuggestion = (workName: string) => {
    setSearchKeyword(workName)
    setDebouncedKeyword(workName)
    setCurrentPage(1)
  }

  // CSVエクスポート
  const exportToCSV = () => {
    const headers = ['請求書番号', '顧客名', '登録番号', '数量', '単価', '請求日', '件名', '作業名', '種別', '合計']
    const csvData = [
      headers.join(','),
      ...searchResults.map(result => [
        result.invoice_no,
        `"${result.customer_name}"`,
        `"${result.registration}"`,
        result.quantity,
        result.unit_price,
        result.date,
        `"${result.subject}"`,
        `"${result.work_name}"`,
        result.is_set ? 'セット' : '個別',
        result.total
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `作業履歴_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  // 月クイックフィルター
  const setCurrentMonth = () => {
    try {
      const d = new Date()
      const y = d.getFullYear()
      const m = d.getMonth() + 1
      const start = `${y}-${String(m).padStart(2, '0')}-01`
      const lastDay = new Date(y, m, 0).getDate()
      const end = `${y}-${String(m).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
      setDateFrom(start); setDateTo(end)
    } catch (error) {
      console.error('当月フィルター設定エラー:', error)
    }
  }
  const setPrevMonth = () => {
    try {
      const d = new Date()
      d.setMonth(d.getMonth() - 1)
      const y = d.getFullYear()
      const m = d.getMonth() + 1
      const start = `${y}-${String(m).padStart(2, '0')}-01`
      const lastDay = new Date(y, m, 0).getDate()
      const end = `${y}-${String(m).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
      setDateFrom(start); setDateTo(end)
    } catch (error) {
      console.error('前月フィルター設定エラー:', error)
    }
  }
  const clearDateRange = () => { setDateFrom(''); setDateTo('') }

  // ページネーション
  const pageCount = Math.max(1, Math.ceil(searchResults.length / pageSize))
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, searchResults.length)
  const pageResults = searchResults.slice(startIndex, endIndex)
  const goPrev = () => setCurrentPage(p => Math.max(1, p - 1))
  const goNext = () => setCurrentPage(p => Math.min(pageCount, p + 1))

  const handleBack = () => {
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">データを読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <SecurityWrapper requirePin={true}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* ヘッダー */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  作業内容履歴
                </h1>
                <p className="text-gray-600">過去の作業価格や実績を検索・確認できます</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  詳細フィルター
                </button>
                {searchResults.length > 0 && (
                  <button
                    onClick={exportToCSV}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    CSV出力
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 検索フィルター */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="space-y-4">
              {/* 基本検索 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">作業名で検索</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="作業名を入力（部分一致）"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyDown={(e) => { if (e.key === 'Escape') setSearchKeyword(''); if (e.key === 'Enter') handleSearch() }}
                  />
                  <button
                    onClick={handleSearch}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    検索
                  </button>
                </div>
              </div>

              {/* 詳細フィルター */}
              {showAdvancedFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">顧客で絞り込み</label>
                    <select
                      value={customerFilter}
                      onChange={(e) => setCustomerFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">すべての顧客</option>
                      {customers.map(customer => (
                        <option key={customer} value={customer}>
                          {customer}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">期間開始</label>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">期間終了</label>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="md:col-span-3 flex items-center gap-3 pt-2">
                    <span className="text-sm font-medium text-gray-700">クイック設定:</span>
                    <button onClick={setCurrentMonth} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm">当月</button>
                    <button onClick={setPrevMonth} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 transition-colors text-sm">前月</button>
                    <button onClick={clearDateRange} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm">クリア</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* よく使用される作業 */}
          {!searchKeyword && workSuggestions.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">よく使用される作業</h2>
              <div className="flex flex-wrap gap-2">
                {workSuggestions.slice(0, 6).map(workName => (
                  <button
                    key={workName}
                    onClick={() => { setCurrentPage(1); selectWorkSuggestion(workName) }}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition-colors"
                  >
                    {workName}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 統計情報 */}
          {workStats && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                「{searchKeyword}」の統計情報
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-blue-600 mb-1">実施回数</div>
                  <div className="text-2xl font-bold text-blue-900">{workStats.count}回</div>
                  <div className="text-sm text-blue-300 mt-2">回</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-green-600 mb-1">平均単価</div>
                  <div className="text-2xl font-bold text-green-900">¥{workStats.avgPrice.toLocaleString()}</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-orange-600 mb-1">価格帯</div>
                  <div className="text-sm font-bold text-orange-900">
                    ¥{workStats.minPrice.toLocaleString()} 〜 ¥{workStats.maxPrice.toLocaleString()}
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-purple-600 mb-1">総売上</div>
                  <div className="text-2xl font-bold text-purple-900">¥{workStats.totalAmount.toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}

          {/* 検索結果 */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b bg-gray-50">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  検索結果 ({searchResults.length}件)
                </h2>
                {searchResults.length > 0 && (
                  <div className="text-lg font-semibold text-green-600">
                    総額: ¥{searchResults.reduce((sum, result) => sum + result.total, 0).toLocaleString()}
                  </div>
                )}
              </div>
            </div>
            
            {searchResults.length > 0 && (
              <div className="px-6 py-3 flex items-center justify-between text-sm text-gray-600 bg-gray-50 border-b">
                <div>
                  {searchResults.length} 件中 {searchResults.length === 0 ? 0 : startIndex + 1} - {endIndex} を表示
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={goPrev} 
                    disabled={currentPage <= 1} 
                    className={`px-3 py-1 rounded text-sm ${currentPage <= 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                  >
                    前へ
                  </button>
                  <span className="px-2">{currentPage} / {pageCount}</span>
                  <button 
                    onClick={goNext} 
                    disabled={currentPage >= pageCount} 
                    className={`px-3 py-1 rounded text-sm ${currentPage >= pageCount ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                  >
                    次へ
                  </button>
                </div>
              </div>
            )}
            
            {searchResults.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg mb-2">該当する作業履歴がありません</p>
                <p className="text-sm">検索条件を変更して再度お試しください</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        請求書No<br />請求日
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        顧客名<br />件名
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        登録番号<br />作業名
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        数量<br />種別
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        単価<br />合計
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        請求書表示<br />作業価格検索
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pageResults.map((result, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{result.invoice_no}</div>
                          <div className="text-sm text-gray-500">{result.date}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{result.customer_name}</div>
                          <div className="text-sm text-gray-500">{result.subject}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500">{result.registration}</div>
                          <div className="text-sm text-gray-900">
                            <span className={searchKeyword && result.work_name.toLowerCase().includes(searchKeyword.toLowerCase()) ? 'bg-yellow-200' : ''}>
                              {result.work_name}
                            </span>
                            {result.is_set && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                個別
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{result.quantity}</div>
                          <div className="text-sm text-gray-500">{result.is_set ? 'セット' : '個別'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">¥{result.unit_price.toLocaleString()}</div>
                          <div className="text-sm font-bold text-gray-900">¥{result.total.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="space-y-1">
                            <button className="w-full bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors">
                              請求書表示
                            </button>
                            <button 
                              className="w-full bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors"
                              onClick={() => { setCurrentPage(1); selectWorkSuggestion(result.work_name) }}
                            >
                              作業価格検索
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </SecurityWrapper>
  )
}