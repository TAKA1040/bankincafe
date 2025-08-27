'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Search, FileText, Eye, Download, Filter, Calendar, X } from 'lucide-react'

// 型定義
interface Invoice {
  id: number
  invoice_year: number
  invoice_month: number
  billing_date: string
  customer_category: 'UD' | 'その他'
  customer_name: string
  subject: string
  registration_number: string
  order_number: string
  internal_order_number: string
  subtotal: number
  tax_amount: number
  total_amount: number
  status: 'draft' | 'finalized' | 'cancelled'  // ドキュメント状態
  payment_status: 'unpaid' | 'paid' | 'partial'  // 支払い状態
  created_at: string
  memo: string
  work_items: Array<{
    id: number
    type: 'individual' | 'set'
    work_name: string
    unit_price: number
    quantity: number
    amount: number
    memo: string
    set_details?: string[]
  }>
}

interface SearchFilters {
  keyword: string
  status: string  // ドキュメント状態
  payment_status: string  // 支払い状態
  year: string
  month: string
  startDate: string
  endDate: string
}

interface SortConfig {
  key: keyof Invoice
  direction: 'asc' | 'desc'
}

// InvoiceDBクラス
class InvoiceDB {
  private data: Invoice[]

  constructor() {
    this.data = this.loadData()
  }

  private loadData(): Invoice[] {
    try {
      const stored = localStorage.getItem('bankin_invoices')
      return stored ? JSON.parse(stored) : this.getDefaultData()
    } catch {
      return this.getDefaultData()
    }
  }

  private getDefaultData(): Invoice[] {
    return [
      {
        id: 1,
        invoice_year: 2024,
        invoice_month: 1,
        billing_date: '2024-01-15',
        customer_category: 'その他' as const,
        customer_name: 'テクノロジー株式会社',
        subject: 'Webサイト制作',
        registration_number: 'T1234567890123',
        order_number: 'ORD-2024-001',
        internal_order_number: 'INT-001',
        subtotal: 100000,
        tax_amount: 10000,
        total_amount: 110000,
        status: 'finalized',
        payment_status: 'paid',
        created_at: '2024-01-15T10:00:00.000Z',
        memo: '初回案件',
        work_items: [
          { id: 1, type: 'individual', work_name: 'Webサイト制作', unit_price: 100000, quantity: 1, amount: 100000, memo: '' }
        ]
      },
      {
        id: 2,
        invoice_year: 2024,
        invoice_month: 2,
        billing_date: '2024-02-10',
        customer_category: 'その他' as const,
        customer_name: 'サンプル商事株式会社B',
        subject: 'システム保守',
        registration_number: '',
        order_number: 'ORD-2024-002',
        internal_order_number: '',
        subtotal: 50000,
        tax_amount: 5000,
        total_amount: 55000,
        status: 'finalized',
        payment_status: 'unpaid',
        created_at: '2024-02-10T14:30:00.000Z',
        memo: '',
        work_items: [
          { id: 1, type: 'individual', work_name: 'システム保守', unit_price: 50000, quantity: 1, amount: 50000, memo: '' }
        ]
      },
      {
        id: 3,
        invoice_year: 2024,
        invoice_month: 3,
        billing_date: '2024-03-05',
        customer_category: 'UD' as const,
        customer_name: '株式会社UDトラックス',
        subject: 'データベース設計',
        registration_number: 'T9876543210987',
        order_number: 'UD-2024-001',
        internal_order_number: 'UD-INT-001',
        subtotal: 80000,
        tax_amount: 8000,
        total_amount: 88000,
        status: 'draft',
        payment_status: 'unpaid',
        created_at: '2024-03-05T09:15:00.000Z',
        memo: '設計書含む',
        work_items: [
          { id: 1, type: 'set', work_name: 'データベース設計', unit_price: 80000, quantity: 1, amount: 80000, memo: '', set_details: ['ER図作成', 'テーブル設計', '正規化検証'] }
        ]
      }
    ]
  }

  save(): void {
    try {
      localStorage.setItem('bankin_invoices', JSON.stringify(this.data))
    } catch (error) {
      console.warn('Failed to save invoices:', error)
    }
  }

  search(filters: SearchFilters): Invoice[] {
    return this.data.filter(invoice => {
      // キーワード検索（大文字小文字を区別しないあいまい検索）
      if (filters.keyword.trim()) {
        const keyword = filters.keyword.toLowerCase()
        const matchesKeyword = 
          // 請求書番号での検索（# を含む場合と含まない場合の両方に対応）
          invoice.id.toString().includes(keyword) ||
          `#${invoice.id}`.toLowerCase().includes(keyword) ||
          // 顧客情報での検索
          invoice.customer_name.toLowerCase().includes(keyword) ||
          invoice.customer_category.toLowerCase().includes(keyword) ||
          // 請求情報での検索
          invoice.subject.toLowerCase().includes(keyword) ||
          invoice.memo.toLowerCase().includes(keyword) ||
          // 注文番号等での検索
          invoice.registration_number.toLowerCase().includes(keyword) ||
          invoice.order_number.toLowerCase().includes(keyword) ||
          invoice.internal_order_number.toLowerCase().includes(keyword) ||
          // 請求年月での検索
          `${invoice.invoice_year}年${invoice.invoice_month}月`.includes(keyword) ||
          `${invoice.invoice_year}/${invoice.invoice_month}`.includes(keyword) ||
          // 請求日での検索
          invoice.billing_date.includes(keyword) ||
          new Date(invoice.billing_date).toLocaleDateString('ja-JP').includes(keyword) ||
          // 作業項目での検索
          invoice.work_items.some(item => 
            item.work_name.toLowerCase().includes(keyword) ||
            item.memo.toLowerCase().includes(keyword) ||
            (item.set_details && item.set_details.some(detail => detail.toLowerCase().includes(keyword)))
          )
        if (!matchesKeyword) return false
      }

      // ドキュメント状態フィルター
      if (filters.status && filters.status !== 'all') {
        if (invoice.status !== filters.status) return false
      }

      // 支払い状態フィルター
      if (filters.payment_status && filters.payment_status !== 'all') {
        if (invoice.payment_status !== filters.payment_status) return false
      }

      // 年フィルター
      if (filters.year && filters.year !== 'all') {
        if (invoice.invoice_year !== parseInt(filters.year)) return false
      }

      // 月フィルター
      if (filters.month && filters.month !== 'all') {
        if (invoice.invoice_month !== parseInt(filters.month)) return false
      }

      return true
    })
  }

  updateStatus(id: number, status: Invoice['status']): void {
    const index = this.data.findIndex(invoice => invoice.id === id)
    if (index !== -1) {
      this.data[index].status = status
      this.save()
    }
  }

  updatePaymentStatus(id: number, paymentStatus: Invoice['payment_status']): void {
    const index = this.data.findIndex(invoice => invoice.id === id)
    if (index !== -1) {
      this.data[index].payment_status = paymentStatus
      this.save()
    }
  }

  createRedInvoice(originalId: number): Invoice {
    const original = this.data.find(inv => inv.id === originalId)
    if (!original || original.status !== 'finalized') {
      throw new Error('確定済みの請求書のみ赤伝を作成できます')
    }

    const newId = Math.max(...this.data.map(inv => inv.id)) + 1
    const redInvoice: Invoice = {
      ...original,
      id: newId,
      subject: `[赤伝] ${original.subject}`,
      subtotal: -original.subtotal,
      tax_amount: -original.tax_amount,
      total_amount: -original.total_amount,
      status: 'finalized',
      payment_status: 'unpaid',
      created_at: new Date().toISOString(),
      memo: `元請求書 #${original.id} の赤伝です。${original.memo}`,
      work_items: original.work_items.map(item => ({
        ...item,
        amount: -item.amount
      }))
    }

    this.data.push(redInvoice)
    this.save()
    return redInvoice
  }

  delete(id: number): void {
    this.data = this.data.filter(invoice => invoice.id !== id)
    this.save()
  }

  exportToCSV(invoices: Invoice[]): void {
    const headers = [
      '請求書番号', '請求年月', '請求日', '顧客カテゴリ', '顧客名', '件名', 
      '登録番号', '発注番号', 'オーダー番号', '金額(税込)',
      'ドキュメント状態', '支払い状態', '作成日', 'メモ'
    ]
    
    const rows = invoices.map(invoice => [
      `#${invoice.id}`,
      `${invoice.invoice_year}年${invoice.invoice_month}月`,
      invoice.billing_date,
      invoice.customer_category,
      `"${invoice.customer_name.replace(/"/g, '""')}"`,
      `"${invoice.subject.replace(/"/g, '""')}"`,
      invoice.registration_number,
      invoice.order_number,
      invoice.internal_order_number,
      invoice.total_amount.toString(),
      this.getStatusLabel(invoice.status),
      this.getPaymentStatusLabel(invoice.payment_status),
      new Date(invoice.created_at).toLocaleDateString('ja-JP'),
      `"${invoice.memo.replace(/"/g, '""')}"`
    ])

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `請求書一覧_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    
    setTimeout(() => URL.revokeObjectURL(url), 100)
  }

  private getStatusLabel(status: Invoice['status']): string {
    const statusMap = {
      draft: '下書き',
      finalized: '確定',
      cancelled: '取消'
    }
    return statusMap[status] || status
  }

  private getPaymentStatusLabel(paymentStatus: Invoice['payment_status']): string {
    const paymentStatusMap = {
      unpaid: '未払い',
      paid: '支払済み',
      partial: '一部入金'
    }
    return paymentStatusMap[paymentStatus] || paymentStatus
  }
}

export default function InvoiceListPage() {
  const router = useRouter()
  const [db] = useState(() => new InvoiceDB())
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'billing_date', direction: 'desc' })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  
  const [filters, setFilters] = useState<SearchFilters>({
    keyword: '',
    status: 'all',
    payment_status: 'all',
    year: 'all',
    month: 'all',
    startDate: '',
    endDate: ''
  })

  // 検索処理
  useEffect(() => {
    const searchInvoices = async () => {
      setIsSearching(true)
      await new Promise(resolve => setTimeout(resolve, 200))
      const filtered = db.search(filters)
      setInvoices(sortInvoices(filtered))
      setCurrentPage(1)  // 検索時は最初のページに戻る
      setIsSearching(false)
    }
    searchInvoices()
  }, [filters, db])

  // 初期データロード
  useEffect(() => {
    const filtered = db.search(filters)
    setInvoices(sortInvoices(filtered))
  }, [db])

  // ソート適用
  useEffect(() => {
    setInvoices(prev => sortInvoices(prev))
  }, [sortConfig])

  // ペジネーションのデータ範囲計算
  const totalPages = Math.ceil(invoices.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentInvoices = invoices.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBack = () => router.push('/')

  const handleStatusChange = (id: number, status: Invoice['status']) => {
    db.updateStatus(id, status)
    const filtered = db.search(filters)
    setInvoices(sortInvoices(filtered))
  }

  const handlePaymentStatusChange = (id: number, paymentStatus: Invoice['payment_status']) => {
    db.updatePaymentStatus(id, paymentStatus)
    const filtered = db.search(filters)
    setInvoices(sortInvoices(filtered))
  }

  const handleCreateRedInvoice = (originalId: number) => {
    try {
      const redInvoice = db.createRedInvoice(originalId)
      const filtered = db.search(filters)
      setInvoices(sortInvoices(filtered))
      alert(`赤伝請求書 #${redInvoice.id} を作成しました`)
    } catch (error) {
      alert(error instanceof Error ? error.message : '赤伝作成に失敗しました')
    }
  }

  const sortInvoices = (invoiceList: Invoice[]): Invoice[] => {
    return [...invoiceList].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }

  const handleSort = (key: keyof Invoice) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    setSortConfig({ key, direction })
    setInvoices(sortInvoices(invoices))
  }

  const handleDelete = (id: number) => {
    if (confirm('この請求書を削除してもよろしいですか？')) {
      db.delete(id)
      setInvoices([...db.data])
      alert('請求書を削除しました')
    }
  }

  const handleExportCSV = () => {
    db.exportToCSV(invoices)
  }

  const getStatusBadge = (status: Invoice['status']) => {
    const statusConfig = {
      draft: { label: '下書き', className: 'bg-gray-100 text-gray-800' },
      finalized: { label: '確定', className: 'bg-blue-100 text-blue-800' },
      cancelled: { label: '取消', className: 'bg-red-100 text-red-800' }
    }
    
    const config = statusConfig[status] || statusConfig.draft
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    )
  }

  const getPaymentStatusBadge = (paymentStatus: Invoice['payment_status']) => {
    const statusConfig = {
      unpaid: { label: '未払い', className: 'bg-orange-100 text-orange-800' },
      paid: { label: '支払済み', className: 'bg-green-100 text-green-800' },
      partial: { label: '一部入金', className: 'bg-yellow-100 text-yellow-800' }
    }
    
    const config = statusConfig[paymentStatus] || statusConfig.unpaid
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    )
  }

  const totalAmount = useMemo(() => {
    return invoices.reduce((sum, invoice) => sum + invoice.total_amount, 0)
  }, [invoices])

  const statusCounts = useMemo(() => {
    return invoices.reduce((counts, invoice) => {
      counts[invoice.status] = (counts[invoice.status] || 0) + 1
      return counts
    }, {} as Record<string, number>)
  }, [invoices])

  const paymentCounts = useMemo(() => {
    return invoices.reduce((counts, invoice) => {
      counts[invoice.payment_status] = (counts[invoice.payment_status] || 0) + 1
      return counts
    }, {} as Record<string, number>)
  }, [invoices])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <header className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <FileText className="text-blue-600" size={28} />
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">請求書一覧</h1>
            </div>
            
            {/* PC用ボタン */}
            <div className="hidden md:flex gap-2">
              <button
                onClick={() => router.push('/invoice-create')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <FileText size={20} />
                新規作成
              </button>
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
            
            {/* スマホ用ボタン */}
            <div className="md:hidden flex flex-wrap gap-2 w-full">
              <button
                onClick={() => router.push('/invoice-create')}
                className="flex-1 min-w-[100px] px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 text-sm font-medium"
              >
                <FileText size={18} />
                新規作成
              </button>
              <button
                onClick={handleExportCSV}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1 text-sm font-medium"
              >
                <Download size={18} />
                CSV
              </button>
              <button
                onClick={handleBack}
                className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-1 text-sm font-medium"
              >
                <ArrowLeft size={18} />
                戻る
              </button>
            </div>
          </div>
        </header>

        {/* 統計情報 - PC用 */}
        <div className="hidden md:grid grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-medium text-gray-600">総件数</h3>
            <p className="text-2xl font-bold text-gray-800">{invoices.length}件</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-medium text-gray-600">金額合計</h3>
            <p className="text-lg font-bold text-blue-600">¥{totalAmount.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-medium text-gray-600">下書き</h3>
            <p className="text-2xl font-bold text-gray-600">{statusCounts.draft || 0}件</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-medium text-gray-600">確定</h3>
            <p className="text-2xl font-bold text-blue-600">{statusCounts.finalized || 0}件</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-medium text-gray-600">支払済み</h3>
            <p className="text-2xl font-bold text-green-600">{paymentCounts.paid || 0}件</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-medium text-gray-600">未払い</h3>
            <p className="text-2xl font-bold text-orange-600">{paymentCounts.unpaid || 0}件</p>
          </div>
        </div>

        {/* 統計情報 - スマホ用（コンパクト） */}
        <div className="md:hidden bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800">📊 統計</h3>
            <div className="text-sm text-gray-600">検索結果: {invoices.length}件</div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {/* 上段: 件数と金額 */}
            <div className="text-center">
              <div className="text-xs text-gray-600 mb-1">総件数</div>
              <div className="text-xl font-bold text-gray-800">{invoices.length}件</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-600 mb-1">合計金額</div>
              <div className="text-lg font-bold text-blue-600">¥{Math.round(totalAmount / 10000)}万</div>
            </div>
          </div>
          
          <div className="border-t border-gray-100 mt-3 pt-3">
            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
                <span className="text-gray-600">下書き</span>
                <span className="font-medium">{statusCounts.draft || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                <span className="text-gray-600">確定</span>
                <span className="font-medium">{statusCounts.finalized || 0}</span>
              </div>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span className="text-gray-600">支払済</span>
                <span className="font-medium">{paymentCounts.paid || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                <span className="text-gray-600">未払い</span>
                <span className="font-medium">{paymentCounts.unpaid || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 検索・フィルターセクション */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
          {/* 第1段: 検索キーワード */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="番号、顧客名、件名で検索..."
                value={filters.keyword}
                onChange={(e) => setFilters({...filters, keyword: e.target.value})}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {/* 第2段: フィルター選択 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1 font-medium">状態フィルタ</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全状態</option>
                <option value="draft">下書き</option>
                <option value="finalized">確定</option>
                <option value="cancelled">取消</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1 font-medium">支払フィルタ</label>
              <select
                value={filters.payment_status}
                onChange={(e) => setFilters({...filters, payment_status: e.target.value})}
                className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全支払</option>
                <option value="unpaid">未払い</option>
                <option value="paid">支払済</option>
                <option value="partial">一部入金</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1 font-medium">年度</label>
              <select
                value={filters.year}
                onChange={(e) => setFilters({...filters, year: e.target.value})}
                className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全年度</option>
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                  <option key={year} value={year}>{year}年</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1 font-medium">月</label>
              <select
                value={filters.month}
                onChange={(e) => setFilters({...filters, month: e.target.value})}
                className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全月</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                  <option key={month} value={month}>{month}月</option>
                ))}
              </select>
            </div>
          </div>
          
          {(filters.keyword || filters.status !== 'all' || filters.payment_status !== 'all' || filters.year !== 'all' || filters.month !== 'all') && (
            <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <span className="text-sm text-gray-600 font-medium">🔍 検索結果: {invoices.length}件</span>
              <button
                onClick={() => setFilters({
                  keyword: '',
                  status: 'all',
                  payment_status: 'all',
                  year: 'all',
                  month: 'all',
                  startDate: '',
                  endDate: ''
                })}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
              >
                <X size={16} />
                フィルターをクリア
              </button>
            </div>
          )}
        </div>

        {/* 請求書一覧テーブル - PC用 */}
        <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left border-r">
                  <div className="text-sm font-bold text-gray-700">請求書No</div>
                  <div className="text-sm font-bold text-gray-700">請求日</div>
                </th>
                <th className="px-4 py-3 text-left border-r">
                  <div className="text-sm font-bold text-gray-700">顧客名</div>
                  <div className="text-sm font-bold text-gray-700">件名</div>
                </th>
                <th className="px-4 py-3 text-left border-r">
                  <div className="text-sm font-bold text-gray-700">登録番号</div>
                  <div className="text-sm font-bold text-gray-700">作業名</div>
                </th>
                <th className="px-4 py-3 text-left border-r">
                  <div className="text-sm font-bold text-gray-700">数量</div>
                  <div className="text-sm font-bold text-gray-700">種別</div>
                </th>
                <th className="px-4 py-3 text-right border-r">
                  <div className="text-sm font-bold text-gray-700">単価</div>
                  <div className="text-sm font-bold text-gray-700">合計</div>
                </th>
                <th className="px-4 py-3 text-center">
                  <div className="text-sm font-bold text-gray-700">請求書表示</div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isSearching ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    検索中...
                  </td>
                </tr>
              ) : currentInvoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    請求書がありません
                  </td>
                </tr>
              ) : (
                currentInvoices.map((invoice) => {
                  // 作業項目の情報を取得
                  const totalQuantity = invoice.work_items.reduce((sum, item) => sum + item.quantity, 0)
                  const workNames = invoice.work_items.map(item => item.work_name).join(' / ')
                  const workTypes = invoice.work_items.map(item => item.type === 'set' ? 'セット' : '個別').join(' / ')
                  const avgUnitPrice = invoice.work_items.length > 0 
                    ? Math.round(invoice.work_items.reduce((sum, item) => sum + item.unit_price, 0) / invoice.work_items.length)
                    : 0
                  
                  return (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      {/* 請求書No / 請求日 */}
                      <td className="px-4 py-4 border-r">
                        <div className="text-sm font-bold text-blue-600">
                          #{invoice.id}
                        </div>
                        <div className="text-sm text-gray-700">
                          {new Date(invoice.billing_date).toLocaleDateString('ja-JP')}
                        </div>
                      </td>
                      
                      {/* 顧客名 / 件名 */}
                      <td className="px-4 py-4 border-r">
                        <div className="text-sm font-bold text-gray-900">
                          {invoice.customer_name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {invoice.subject}
                        </div>
                      </td>
                      
                      {/* 登録番号 / 作業名 */}
                      <td className="px-4 py-4 border-r">
                        <div className="text-sm text-gray-900">
                          {invoice.registration_number || '-'}
                        </div>
                        <div className="text-sm text-gray-600 max-w-40 truncate" title={workNames}>
                          {workNames || '-'}
                        </div>
                      </td>
                      
                      {/* 数量 / 種別 */}
                      <td className="px-4 py-4 border-r">
                        <div className="text-sm font-bold text-gray-900">
                          {totalQuantity}
                        </div>
                        <div className="text-sm text-gray-600">
                          {workTypes || '-'}
                        </div>
                      </td>
                      
                      {/* 単価 / 合計 */}
                      <td className="px-4 py-4 text-right border-r">
                        <div className="text-sm text-gray-900">
                          ¥{avgUnitPrice.toLocaleString()}
                        </div>
                        <div className="text-sm font-bold text-blue-600">
                          ¥{invoice.total_amount.toLocaleString()}
                        </div>
                      </td>
                      
                      {/* 請求書表示 */}
                      <td className="px-4 py-4 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedInvoice(invoice)
                              setShowDetailModal(true)
                            }}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            詳細
                          </button>
                          
                          {invoice.status === 'draft' && (
                            <button
                              onClick={() => router.push(`/invoice-create?edit=${invoice.id}`)}
                              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                            >
                              編集
                            </button>
                          )}
                          
                          <div className="space-y-1 mt-2">
                            {getStatusBadge(invoice.status)}
                            {getPaymentStatusBadge(invoice.payment_status)}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 請求書一覧カード - スマホ用 */}
        <div className="md:hidden space-y-4">
          {isSearching ? (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
              検索中...
            </div>
          ) : currentInvoices.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
              請求書がありません
            </div>
          ) : (
            currentInvoices.map((invoice) => (
              <div key={invoice.id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                {/* ヘッダー行 */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-blue-600">#{invoice.id}</span>
                    {invoice.customer_category === 'UD' && (
                      <span className="text-yellow-500">💰</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    {getStatusBadge(invoice.status)}
                    {getPaymentStatusBadge(invoice.payment_status)}
                  </div>
                </div>

                {/* 基本情報 */}
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">顧客</span>
                    <span className="text-sm font-medium text-right max-w-[60%] break-words">{invoice.customer_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">件名</span>
                    <span className="text-sm text-right max-w-[60%] break-words">{invoice.subject}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">請求日</span>
                    <span className="text-sm">{new Date(invoice.billing_date).toLocaleDateString('ja-JP')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">金額</span>
                    <span className="text-lg font-bold text-blue-600">¥{invoice.total_amount.toLocaleString()}</span>
                  </div>
                  {invoice.order_number && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">発注</span>
                      <span className="text-xs text-gray-500">{invoice.order_number}</span>
                    </div>
                  )}
                </div>

                {/* 操作ボタン */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedInvoice(invoice)
                        setShowDetailModal(true)
                      }}
                      className="px-3 py-1 text-sm text-blue-600 border border-blue-300 rounded hover:bg-blue-50"
                    >
                      詳細
                    </button>
                    {invoice.status === 'draft' && (
                      <button
                        onClick={() => router.push(`/invoice-create?edit=${invoice.id}`)}
                        className="px-3 py-1 text-sm text-green-600 border border-green-300 rounded hover:bg-green-50"
                      >
                        編集
                      </button>
                    )}
                    {invoice.status === 'finalized' && (
                      <button
                        onClick={() => handleCreateRedInvoice(invoice.id)}
                        className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50"
                      >
                        赤伝
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <select
                      value={invoice.status}
                      onChange={(e) => handleStatusChange(invoice.id, e.target.value as Invoice['status'])}
                      className="text-xs px-2 py-1 border border-gray-300 rounded"
                      disabled={invoice.status === 'finalized'}
                    >
                      <option value="draft">下書き</option>
                      <option value="finalized">確定</option>
                      <option value="cancelled">取消</option>
                    </select>
                    <select
                      value={invoice.payment_status}
                      onChange={(e) => handlePaymentStatusChange(invoice.id, e.target.value as Invoice['payment_status'])}
                      className="text-xs px-2 py-1 border border-gray-300 rounded"
                    >
                      <option value="unpaid">未払い</option>
                      <option value="paid">支払済</option>
                      <option value="partial">一部入金</option>
                    </select>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ページネーション */}
        {totalPages > 1 && (
          <div className="bg-white rounded-lg shadow-sm mt-4 p-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {invoices.length}件中 {startIndex + 1}-{Math.min(endIndex, invoices.length)}件を表示
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  前へ
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 border rounded ${
                          pageNum === currentPage
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  次へ
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 詳細モーダル */}
        {showDetailModal && selectedInvoice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">
                    請求書詳細 #{selectedInvoice.id}
                  </h2>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">基本情報</h3>
                    <div className="space-y-2">
                      <div><span className="font-medium">請求年月:</span> {selectedInvoice.invoice_year}年{selectedInvoice.invoice_month}月</div>
                      <div><span className="font-medium">顧客名:</span> {selectedInvoice.customer_name}</div>
                      <div><span className="font-medium">件名:</span> {selectedInvoice.subject}</div>
                      <div><span className="font-medium">ステータス:</span> {getStatusBadge(selectedInvoice.status)}</div>
                      <div><span className="font-medium">作成日:</span> {new Date(selectedInvoice.created_at).toLocaleDateString('ja-JP')}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">金額情報</h3>
                    <div className="space-y-2">
                      <div><span className="font-medium">小計:</span> ¥{selectedInvoice.subtotal.toLocaleString()}</div>
                      <div><span className="font-medium">消費税:</span> ¥{selectedInvoice.tax_amount.toLocaleString()}</div>
                      <div className="text-lg font-bold"><span className="font-medium">合計:</span> ¥{selectedInvoice.total_amount.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">作業項目</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left border-b">作業名</th>
                          <th className="px-4 py-2 text-right border-b">単価</th>
                          <th className="px-4 py-2 text-right border-b">数量</th>
                          <th className="px-4 py-2 text-right border-b">金額</th>
                          <th className="px-4 py-2 text-left border-b">メモ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedInvoice.work_items.map((item) => (
                          <tr key={item.id}>
                            <td className="px-4 py-2 border-b">{item.work_name}</td>
                            <td className="px-4 py-2 text-right border-b">¥{item.unit_price.toLocaleString()}</td>
                            <td className="px-4 py-2 text-right border-b">{item.quantity}</td>
                            <td className="px-4 py-2 text-right border-b">¥{item.amount.toLocaleString()}</td>
                            <td className="px-4 py-2 border-b">{item.memo}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {selectedInvoice.memo && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">メモ</h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded">{selectedInvoice.memo}</p>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    閉じる
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
