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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* ヘッダー */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Search className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    作業内容履歴
                  </h1>
                </div>
                <p className="text-gray-600 text-lg">過去の作業価格や実績を検索・確認できます</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleBack}
                  className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  ← ホームに戻る
                </button>
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="bg-indigo-500 text-white px-6 py-3 rounded-xl hover:bg-indigo-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center border border-blue-400/30"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {showAdvancedFilters ? '簡易表示' : '詳細フィルター'}
                </button>
                {searchResults.length > 0 && (
                  <button
                    onClick={exportToCSV}
                    className="bg-emerald-500 text-white px-6 py-3 rounded-xl hover:bg-emerald-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    CSV出力
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 検索フィルター */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="space-y-6">
              {/* 基本検索 */}
              <div className="flex gap-6">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">🔍 作業名で検索</label>
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="作業名を入力（複数キーワード対応）"
                    className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-400/30 focus:border-blue-400 transition-all duration-300 text-white font-medium shadow-xl placeholder-blue-200"
                    onKeyDown={(e) => { if (e.key === 'Escape') setSearchKeyword(''); if (e.key === 'Enter') handleSearch() }}
                  />
                </div>
                <div className="flex items-end gap-3">
                  <button
                    onClick={() => { setSearchKeyword(''); setDebouncedKeyword(''); setCurrentPage(1) }}
                    disabled={!searchKeyword}
                    className={`px-6 py-4 rounded-2xl border-2 font-bold transition-all duration-300 shadow-xl ${searchKeyword ? 'bg-white/10 text-white border-white/30 hover:bg-white/20 hover:shadow-2xl transform hover:-translate-y-0.5' : 'bg-white/5 text-white/30 border-white/10 cursor-not-allowed'}`}
                    title="検索キーワードをクリア"
                  >
                    クリア
                  </button>
                  <button
                    onClick={() => { setCurrentPage(1); handleSearch() }}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 flex items-center border border-blue-400/30"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    検索
                  </button>
                </div>
              </div>

              {/* 詳細フィルター */}
              {showAdvancedFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t-2 border-white/20">
                  <div>
                    <label className="block text-lg font-bold text-white mb-4 flex items-center">
                      <span className="text-2xl mr-3">👥</span>
                      顧客で絞り込み
                    </label>
                    <select
                      value={customerFilter}
                      onChange={(e) => setCustomerFilter(e.target.value)}
                      className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-400/30 focus:border-blue-400 transition-all duration-300 text-white font-medium shadow-xl"
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
                    <label className="block text-lg font-bold text-white mb-4 flex items-center">
                      <span className="text-2xl mr-3">📅</span>
                      期間開始
                    </label>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-400/30 focus:border-blue-400 transition-all duration-300 text-white font-medium shadow-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-bold text-white mb-4 flex items-center">
                      <span className="text-2xl mr-3">📅</span>
                      期間終了
                    </label>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-400/30 focus:border-blue-400 transition-all duration-300 text-white font-medium shadow-xl"
                    />
                  </div>
                  <div className="md:col-span-3 flex items-center gap-6 pt-6">
                    <span className="text-lg font-bold text-white flex items-center">
                      <span className="text-2xl mr-3">⚡</span>
                      クイック設定:
                    </span>
                    <button onClick={setCurrentMonth} className="px-6 py-3 bg-blue-500/20 border-2 border-blue-400/30 text-blue-200 rounded-2xl hover:bg-blue-500/30 hover:border-blue-400/50 transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5">当月</button>
                    <button onClick={setPrevMonth} className="px-6 py-3 bg-orange-500/20 border-2 border-orange-400/30 text-orange-200 rounded-2xl hover:bg-orange-500/30 hover:border-orange-400/50 transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5">前月</button>
                    <button onClick={clearDateRange} className="px-6 py-3 bg-gray-500/20 border-2 border-gray-400/30 text-gray-200 rounded-2xl hover:bg-gray-500/30 hover:border-gray-400/50 transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5">クリア</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 作業名候補 */}
          {!searchKeyword && workSuggestions.length > 0 && (
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-10">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="text-3xl mr-3">⭐</span>
                よく使用される作業
              </h2>
              <div className="flex flex-wrap gap-4">
                {workSuggestions.map(workName => (
                  <button
                    key={workName}
                    onClick={() => { setCurrentPage(1); selectWorkSuggestion(workName) }}
                    className="bg-gradient-to-r from-white/20 to-indigo-400/20 backdrop-blur-sm text-blue-100 px-6 py-3 rounded-full hover:from-blue-400/30 hover:to-indigo-400/30 transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border border-blue-400/30"
                  >
                    {workName}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 統計情報 */}
          {workStats && (
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-10">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="text-3xl mr-3">📊</span>
                「{searchKeyword}」の統計情報
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm p-8 rounded-3xl border border-blue-400/30 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="text-lg font-bold text-blue-200 mb-2">実施回数</div>
                  <div className="text-4xl font-black text-white">{workStats.count}</div>
                  <div className="text-sm text-blue-300 mt-2">回</div>
                </div>
                <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 backdrop-blur-sm p-8 rounded-3xl border border-emerald-400/30 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="text-lg font-bold text-emerald-200 mb-2">平均単価</div>
                  <div className="text-3xl font-black text-white">¥{workStats.avgPrice.toLocaleString()}</div>
                </div>
                <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm p-8 rounded-3xl border border-orange-400/30 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="text-lg font-bold text-orange-200 mb-2">価格帯</div>
                  <div className="text-lg font-bold text-white">
                    ¥{workStats.minPrice.toLocaleString()} 〜 ¥{workStats.maxPrice.toLocaleString()}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm p-8 rounded-3xl border border-purple-400/30 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="text-lg font-bold text-purple-200 mb-2">総売上</div>
                  <div className="text-3xl font-black text-white">¥{workStats.totalAmount.toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}

          {/* 検索結果 */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="px-10 py-8 border-b-2 border-white/20 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 backdrop-blur-sm">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black text-white flex items-center">
                  <span className="text-3xl mr-4">📋</span>
                  検索結果 ({searchResults.length} 件)
                </h2>
                {searchResults.length > 0 && (
                  <div className="text-xl font-bold text-emerald-200 bg-emerald-500/20 border-2 border-emerald-400/30 text-emerald-200 rounded-2xl hover:bg-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 border border-emerald-400/30">
                    総額: ¥{searchResults.reduce((sum, result) => sum + result.total, 0).toLocaleString()}
                  </div>
                )}
              </div>
            </div>
            {searchResults.length > 0 && (
              <div className="px-10 py-6 flex items-center justify-between text-lg text-blue-200 bg-blue-500/10 backdrop-blur-sm border-b border-white/10">
                <div>
                  <span className="font-bold">{searchResults.length} 件中 {searchResults.length === 0 ? 0 : startIndex + 1} - {endIndex} を表示</span>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={goPrev} disabled={currentPage <= 1} className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 shadow-xl ${currentPage <= 1 ? 'bg-white/5 text-white/30 cursor-not-allowed border border-white/10' : 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-2xl transform hover:-translate-y-0.5 border border-blue-400/30'}`}>前へ</button>
                  <span className="font-black text-white px-4 text-xl">{currentPage} / {pageCount}</span>
                  <button onClick={goNext} disabled={currentPage >= pageCount} className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 shadow-xl ${currentPage >= pageCount ? 'bg-white/5 text-white/30 cursor-not-allowed border border-white/10' : 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-2xl transform hover:-translate-y-0.5 border border-blue-400/30'}`}>次へ</button>
                </div>
              </div>
            )}
            {searchResults.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>該当する作業履歴がありません</p>
                <p className="text-sm mt-2">検索条件を変更して再度お試しください</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        請求書番号・日付
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        顧客名・件名
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        作業名・登録番号
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        数量・単価
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
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
                          <div className="text-sm text-gray-900">
                            <span className={searchKeyword && result.work_name.toLowerCase().includes(searchKeyword.toLowerCase()) ? 'bg-yellow-200' : ''}>
                              {result.work_name}
                            </span>
                            {result.is_set && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                セット
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{result.registration}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">数量: {result.quantity}</div>
                          <div className="text-sm font-medium text-green-600">¥{result.unit_price.toLocaleString()}</div>
                          <div className="text-sm font-bold text-gray-900">合計: ¥{result.total.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="space-y-2">
                            <button className="w-full bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700">
                              請求書表示
                            </button>
                            <button 
                              className="w-full bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
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

          {/* フッター */}
          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>🔧 鈑金Cafe 作業履歴システム</p>
            <p>過去の作業実績から適切な価格設定をサポートします</p>
          </div>
        </div>
      </div>
    </SecurityWrapper>
  )
}