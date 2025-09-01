import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
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
          invoice.id.toString().includes(keyword) ||
          `#${invoice.id}`.toLowerCase().includes(keyword) ||
          invoice.customer_name.toLowerCase().includes(keyword) ||
          invoice.customer_category.toLowerCase().includes(keyword) ||
          invoice.subject.toLowerCase().includes(keyword) ||
          invoice.memo.toLowerCase().includes(keyword) ||
          invoice.registration_number.toLowerCase().includes(keyword) ||
          invoice.order_number.toLowerCase().includes(keyword) ||
          invoice.internal_order_number.toLowerCase().includes(keyword) ||
          `${invoice.invoice_year}年${invoice.invoice_month}月`.includes(keyword) ||
          `${invoice.invoice_year}/${invoice.invoice_month}`.includes(keyword) ||
          invoice.billing_date.includes(keyword) ||
          new Date(invoice.billing_date).toLocaleDateString('ja-JP').includes(keyword) ||
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
}

export default function InvoiceListPage() {
  const router = useRouter()
  const [db] = useState(() => new InvoiceDB())
  const [invoices, setInvoices] = useState<Invoice[]>([])
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
      setCurrentPage(1)
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

  const sortInvoices = (invoiceList: Invoice[]): Invoice[] => {
    return [...invoiceList].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }

  const handleBack = () => router.push('/')

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
            
            <div className="flex gap-2">
              <button
                onClick={() => router.push('/invoice-create')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <FileText size={20} />
                新規作成
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
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
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

        {/* 検索・フィルターセクション */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
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
        </div>

        {/* 請求書一覧テーブル - 6列レイアウト */}
        <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              {/* 1段目 */}
              <tr>
                <th className="px-4 py-3 text-center border-r align-middle">
                  <div className="text-xs font-bold text-gray-700">請求書No</div>
                </th>
                <th className="px-4 py-3 text-center border-r align-middle">
                  <div className="text-xs font-bold text-gray-700">顧客名</div>
                </th>
                <th className="px-4 py-3 text-center border-r align-middle">
                  <div className="text-xs font-bold text-gray-700"></div>
                </th>
                <th className="px-4 py-2 text-center border-r">
                  <div className="text-xs font-bold text-gray-700">作業明細</div>
                </th>
                <th className="px-3 py-2 text-center border-r">
                  <div className="text-xs font-bold text-gray-700">数量</div>
                </th>
                <th className="px-4 py-2 text-center">
                  <div className="text-xs font-bold text-gray-700">請求合計</div>
                </th>
              </tr>
              {/* 2段目 */}
              <tr>
                <th className="px-4 py-3 text-center border-r align-middle">
                  <div className="text-xs font-bold text-gray-700">請求日</div>
                </th>
                <th className="px-4 py-3 text-center border-r align-middle">
                  <div className="text-xs font-bold text-gray-700">件名</div>
                </th>
                <th className="px-4 py-3 text-center border-r align-middle">
                  <div className="text-xs font-bold text-gray-700">発注番号</div>
                </th>
                <th className="px-3 py-2 text-center border-r">
                  <div className="text-xs font-bold text-gray-700">（個別・セット）</div>
                </th>
                <th className="px-3 py-2 text-center border-r">
                  <div className="text-xs font-bold text-gray-700"></div>
                </th>
                <th className="px-3 py-2 text-center">
                  <div className="text-xs font-bold text-gray-700">詳細ボタン</div>
                </th>
              </tr>
              {/* 3段目 */}
              <tr className="border-b">
                <th className="px-4 py-3 text-center border-r align-middle">
                  <div className="text-xs font-bold text-gray-700">請求月</div>
                </th>
                <th className="px-4 py-3 text-center border-r align-middle">
                  <div className="text-xs font-bold text-gray-700">登録番号</div>
                </th>
                <th className="px-4 py-3 text-center border-r align-middle">
                  <div className="text-xs font-bold text-gray-700">オーダー番号</div>
                </th>
                <th className="px-3 py-2 text-center border-r">
                  <div className="text-xs font-medium text-gray-700">その他詳細</div>
                </th>
                <th className="px-3 py-2 text-center border-r">
                  <div className="text-xs font-medium text-gray-700"></div>
                </th>
                <th className="px-3 py-2 text-center">
                  <div className="text-xs font-medium text-gray-700">ステータス表示</div>
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
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    請求書がありません
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => {
                  const totalQuantity = invoice.work_items.reduce((sum, item) => sum + item.quantity, 0)
                  const workNames = invoice.work_items.map(item => item.work_name).join(' / ')
                  const workTypes = invoice.work_items.map(item => item.type === 'set' ? 'セット' : '個別').join(' / ')
                  
                  const getStatusBadge = (status: string) => {
                    const statusConfig = {
                      draft: { label: '下書き', className: 'bg-gray-100 text-gray-800' },
                      finalized: { label: '確定', className: 'bg-blue-100 text-blue-800' },
                      cancelled: { label: '取消', className: 'bg-red-100 text-red-800' }
                    }
                    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
                    return (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
                        {config.label}
                      </span>
                    )
                  }
                  
                  return (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      {/* 第1列: 請求書No / 請求日 / 請求月 */}
                      <td className="px-4 py-4 border-r text-center">
                        <div className="text-xs font-bold text-blue-600">#{invoice.id}</div>
                        <div className="text-xs text-gray-900 mt-1">{new Date(invoice.billing_date).toLocaleDateString('ja-JP')}</div>
                        <div className="text-xs text-gray-900 mt-1">{invoice.invoice_year}年{invoice.invoice_month}月</div>
                      </td>
                      
                      {/* 第2列: 顧客名 / 件名 / 登録番号 */}
                      <td className="px-4 py-4 border-r">
                        <div className="text-xs font-bold text-gray-900">{invoice.customer_name}</div>
                        <div className="text-xs text-gray-500 mt-1">{invoice.customer_category}</div>
                        <div className="text-xs text-gray-900 mt-1 leading-tight">{invoice.subject}</div>
                        <div className="text-xs text-gray-600 mt-1">{invoice.registration_number || '-'}</div>
                      </td>
                      
                      {/* 第3列: 登録番号 / 発注番号 / オーダー番号 */}
                      <td className="px-4 py-4 border-r text-center">
                        <div className="text-xs text-gray-600">{invoice.registration_number || '-'}</div>
                        <div className="text-xs text-gray-600 mt-1">{invoice.order_number || '-'}</div>
                        <div className="text-xs text-gray-600 mt-1">{invoice.internal_order_number || '-'}</div>
                      </td>
                      
                      {/* 第4列: 作業明細 種別 / その他詳細 */}
                      <td className="px-3 py-4 border-r text-center">
                        <div className="text-xs text-gray-700">{workTypes}</div>
                        <div className="text-xs text-gray-700 mt-1 truncate" title={workNames}>{workNames || '-'}</div>
                      </td>
                      
                      {/* 第5列: 数量 / - */}
                      <td className="px-3 py-4 border-r text-center">
                        <div className="text-xs font-bold text-gray-700">{totalQuantity}</div>
                        <div className="text-xs text-gray-700 mt-1">-</div>
                      </td>
                      
                      {/* 第6列: 詳細ボタン / ステータス */}
                      <td className="px-3 py-4 text-center">
                        <button 
                          className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                          onClick={() => router.push(`/invoice/${invoice.id}`)}
                        >
                          詳細
                        </button>
                        <div className="mt-2">
                          {getStatusBadge(invoice.status)}
                        </div>
                        <div className="text-xs font-bold text-gray-700 mt-1">¥{invoice.total_amount.toLocaleString()}</div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}