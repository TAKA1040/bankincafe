'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Search, FileText, Download, X, RefreshCw } from 'lucide-react'
import { useInvoiceList, type InvoiceWithItems, type SearchFilters } from '@/hooks/useInvoiceList'

interface SortConfig {
  key: keyof InvoiceWithItems
  direction: 'asc' | 'desc'
}

// CSV Export utility
const exportToCSV = (invoices: InvoiceWithItems[]): void => {
  const headers = [
    '請求書番号', '請求日', '顧客名', '件名', '登録番号', 
    '作業名', '数量', '単価(平均)', '金額(合計)',
    'ドキュメント状態', '支払い状態', '作成日'
  ]
  
  const getStatusLabel = (status: InvoiceWithItems['status']): string => {
    const statusMap = {
      draft: '下書き',
      finalized: '確定',
      cancelled: '取消'
    }
    return statusMap[status] || status
  }

  const getPaymentStatusLabel = (paymentStatus: InvoiceWithItems['payment_status']): string => {
    const paymentStatusMap = {
      unpaid: '未払い',
      paid: '支払済み',
      partial: '一部入金'
    }
    return paymentStatusMap[paymentStatus] || paymentStatus
  }
  
  const rows = invoices.map(invoice => {
    const avgUnitPrice = invoice.line_items.length > 0 
      ? Math.round(invoice.line_items.reduce((sum, item) => sum + (item.unit_price || 0), 0) / invoice.line_items.length)
      : 0

    return [
      invoice.invoice_id,
      invoice.issue_date ? new Date(invoice.issue_date).toLocaleDateString('ja-JP') : '',
      `"${(invoice.customer_name || '').replace(/"/g, '""')}"`,
      `"${(invoice.subject_name || '').replace(/"/g, '""')}"`,
      invoice.registration_number || '',
      `"${invoice.work_names.replace(/"/g, '""')}"`,
      invoice.total_quantity.toString(),
      avgUnitPrice.toString(),
      invoice.total_amount.toString(),
      getStatusLabel(invoice.status),
      getPaymentStatusLabel(invoice.payment_status),
      invoice.created_at ? new Date(invoice.created_at).toLocaleDateString('ja-JP') : ''
    ]
  })

  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `請求書一覧_${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  
  setTimeout(() => URL.revokeObjectURL(url), 100)
}

export default function InvoiceListPage() {
  const router = useRouter()
  const { invoices: allInvoices, loading, error, searchInvoices, updateInvoiceStatus, updatePaymentStatus, refetch } = useInvoiceList()
  const [filteredInvoices, setFilteredInvoices] = useState<InvoiceWithItems[]>([])
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceWithItems | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'issue_date', direction: 'desc' })
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

  // 検索・フィルター処理
  useEffect(() => {
    const performSearch = async () => {
      setIsSearching(true)
      await new Promise(resolve => setTimeout(resolve, 200))
      const filtered = searchInvoices(filters)
      setFilteredInvoices(sortInvoices(filtered))
      setCurrentPage(1)
      setIsSearching(false)
    }
    performSearch()
  }, [filters, allInvoices, searchInvoices])

  // ソート適用
  useEffect(() => {
    setFilteredInvoices(prev => sortInvoices(prev))
  }, [sortConfig])

  // ペジネーションのデータ範囲計算
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentInvoices = filteredInvoices.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBack = () => router.push('/')

  const handleStatusChange = async (invoiceId: string, status: InvoiceWithItems['status']) => {
    const success = await updateInvoiceStatus(invoiceId, status)
    if (success) {
      alert(`請求書 ${invoiceId} のステータスを ${status === 'draft' ? '下書き' : status === 'finalized' ? '確定' : '取消'} に変更しました`)
    } else {
      alert('ステータス変更に失敗しました')
    }
  }

  const handlePaymentStatusChange = async (invoiceId: string, paymentStatus: InvoiceWithItems['payment_status']) => {
    const success = await updatePaymentStatus(invoiceId, paymentStatus)
    if (success) {
      alert(`請求書 ${invoiceId} の支払いステータスを ${paymentStatus === 'unpaid' ? '未払い' : paymentStatus === 'paid' ? '支払済み' : '一部入金'} に変更しました`)
    } else {
      alert('支払いステータス変更に失敗しました')
    }
  }

  const handleCreateRedInvoice = (originalId: string) => {
    // TODO: Implement red invoice creation
    console.log('Red invoice creation not implemented yet:', { originalId })
    alert('赤伝作成機能は未実装です')
  }

  const sortInvoices = (invoiceList: InvoiceWithItems[]): InvoiceWithItems[] => {
    return [...invoiceList].sort((a, b) => {
      const aValue = a[sortConfig.key] as any
      const bValue = b[sortConfig.key] as any
      
      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }

  const handleSort = (key: keyof InvoiceWithItems) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    setSortConfig({ key, direction })
  }

  const handleDelete = (id: string) => {
    // TODO: Implement invoice deletion
    console.log('Invoice deletion not implemented yet:', { id })
    alert('削除機能は未実装です')
  }

  const handleExportCSV = () => {
    exportToCSV(filteredInvoices)
  }

  const getStatusBadge = (status: InvoiceWithItems['status']) => {
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

  const getPaymentStatusBadge = (paymentStatus: InvoiceWithItems['payment_status']) => {
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
    return filteredInvoices.reduce((sum, invoice) => sum + invoice.total_amount, 0)
  }, [filteredInvoices])

  const statusCounts = useMemo(() => {
    return filteredInvoices.reduce((counts, invoice) => {
      counts[invoice.status] = (counts[invoice.status] || 0) + 1
      return counts
    }, {} as Record<string, number>)
  }, [filteredInvoices])

  const paymentCounts = useMemo(() => {
    return filteredInvoices.reduce((counts, invoice) => {
      counts[invoice.payment_status] = (counts[invoice.payment_status] || 0) + 1
      return counts
    }, {} as Record<string, number>)
  }, [filteredInvoices])

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-sm max-w-md">
          <h1 className="text-xl font-bold text-red-600 mb-2">エラーが発生しました</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={refetch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            再試行
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <header className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <FileText className="text-blue-600" size={28} />
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">請求書一覧</h1>
              {loading && <RefreshCw className="animate-spin text-blue-600" size={20} />}
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
            <p className="text-2xl font-bold text-gray-800">{filteredInvoices.length}件</p>
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
            <div className="text-sm text-gray-600">検索結果: {filteredInvoices.length}件</div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {/* 上段: 件数と金額 */}
            <div className="text-center">
              <div className="text-xs text-gray-600 mb-1">総件数</div>
              <div className="text-xl font-bold text-gray-800">{filteredInvoices.length}件</div>
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
              <span className="text-sm text-gray-600 font-medium">🔍 検索結果: {filteredInvoices.length}件</span>
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
                  <div className="text-sm font-bold text-gray-700">請求月</div>
                </th>
                <th className="px-4 py-3 text-left border-r">
                  <div className="text-sm font-bold text-gray-700">顧客名</div>
                  <div className="text-sm font-bold text-gray-700">件名</div>
                  <div className="text-sm font-bold text-gray-700">登録番号</div>
                </th>
                <th className="px-4 py-3 text-left border-r">
                  <div className="text-sm font-bold text-gray-700">登録番号</div>
                  <div className="text-sm font-bold text-gray-700">発注番号</div>
                  <div className="text-sm font-bold text-gray-700">オーダー番号</div>
                </th>
                <th className="px-4 py-3 text-left border-r">
                  <div className="text-sm font-bold text-gray-700">作業明細</div>
                  <div className="text-sm font-bold text-gray-700">（個別・セット）</div>
                  <div className="text-sm font-bold text-gray-700">その他詳細</div>
                </th>
                <th className="px-4 py-3 text-left border-r">
                  <div className="text-sm font-bold text-gray-700">数量</div>
                </th>
                <th className="px-4 py-3 text-center">
                  <div className="text-sm font-bold text-gray-700">請求合計</div>
                  <div className="text-sm font-bold text-gray-700">詳細ボタン</div>
                  <div className="text-sm font-bold text-gray-700">ステータス表示</div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading || isSearching ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    {loading ? 'データを読み込み中...' : '検索中...'}
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
                  // 分割項目を含む作業項目の情報を整理
                  let allWorkDetails: string[] = []
                  let allQuantityInfo: string[] = []
                  
                  invoice.line_items.forEach(item => {
                    if (item.split_items && item.split_items.length > 0) {
                      // 分割項目がある場合
                      item.split_items.forEach(split => {
                        allWorkDetails.push(split.raw_label_part)
                        allQuantityInfo.push(`${split.raw_label_part}: ${split.quantity}`)
                      })
                    } else {
                      // 分割項目がない場合は元の項目を使用
                      const detail = item.raw_label || 
                        (item.task_type === 'individual' ? '個別作業' :
                         item.task_type === 'set' ? 'セット作業' : '複合作業')
                      allWorkDetails.push(detail)
                      allQuantityInfo.push(`${detail}: ${item.quantity || 0}`)
                    }
                  })
                  
                  // 表示用に制限（枠の幅に合わせて多めに表示）
                  const workDetails = allWorkDetails.slice(0, 6)
                  const hasMoreItems = allWorkDetails.length > 6
                  const quantityInfo = allQuantityInfo.join(' | ')
                  
                  return (
                    <tr key={invoice.invoice_id} className="hover:bg-gray-50">
                      {/* 請求書No / 請求日 / 請求月 */}
                      <td className="px-4 py-4 border-r">
                        <div className="text-sm font-bold text-blue-600">
                          {invoice.invoice_id}
                        </div>
                        <div className="text-sm text-gray-700">
                          {invoice.issue_date ? new Date(invoice.issue_date).toLocaleDateString('ja-JP') : '-'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {invoice.invoice_id ? invoice.invoice_id.substring(0, 4) : '-'}
                        </div>
                      </td>
                      
                      {/* 顧客名 / 件名 / 登録番号 */}
                      <td className="px-4 py-4 border-r">
                        <div className="text-sm font-bold text-gray-900">
                          {invoice.customer_name || '-'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {invoice.subject_name || '-'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {invoice.registration_number || '-'}
                        </div>
                      </td>
                      
                      {/* 登録番号 / 発注番号 / オーダー番号 */}
                      <td className="px-4 py-4 border-r">
                        <div className="text-sm text-gray-900">
                          {invoice.registration_number || '-'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {invoice.purchase_order_number || '-'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {invoice.order_number || '-'}
                        </div>
                      </td>
                      
                      {/* 作業明細（6件まで表示） */}
                      <td className="px-4 py-4 border-r">
                        {workDetails.map((detail, index) => (
                          <div key={index} className="text-sm text-gray-900 max-w-60 truncate" title={detail}>
                            {detail}
                          </div>
                        ))}
                        {hasMoreItems && (
                          <div className="text-xs text-blue-600 mt-1">
                            その他 {allWorkDetails.length - 6} 件あり
                          </div>
                        )}
                      </td>
                      
                      {/* 数量（各作業明細行にあわせて表示） */}
                      <td className="px-4 py-4 border-r">
                        {workDetails.map((detail, index) => {
                          // 対応する分割項目の数量を取得
                          let quantity = 0
                          let currentIndex = 0
                          
                          for (const item of invoice.line_items) {
                            if (item.split_items && item.split_items.length > 0) {
                              for (const split of item.split_items) {
                                if (currentIndex === index) {
                                  quantity = split.quantity
                                  break
                                }
                                currentIndex++
                              }
                            } else {
                              if (currentIndex === index) {
                                quantity = item.quantity || 0
                                break
                              }
                              currentIndex++
                            }
                            if (currentIndex > index) break
                          }
                          
                          return (
                            <div key={index} className="text-sm font-bold text-gray-900">
                              {quantity}
                            </div>
                          )
                        })}
                        {hasMoreItems && (
                          <div className="text-xs text-blue-600 mt-1">
                            ...
                          </div>
                        )}
                      </td>
                      
                      {/* 請求合計・詳細ボタン・ステータス表示 */}
                      <td className="px-4 py-4 text-center">
                        <div className="space-y-2">
                          {/* 請求合計 */}
                          <div className="text-lg font-bold text-blue-600">
                            ¥{invoice.total_amount.toLocaleString()}
                          </div>
                          
                          {/* 詳細ボタン */}
                          <button
                            onClick={() => {
                              setSelectedInvoice(invoice)
                              setShowDetailModal(true)
                            }}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            詳細
                          </button>
                          
                          {/* ステータス表示 */}
                          <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                            invoice.status === 'draft' 
                              ? 'bg-yellow-100 text-yellow-800'
                              : invoice.status === 'finalized'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {invoice.status === 'draft' ? '下書き' : invoice.status === 'finalized' ? '確定' : '取消'}
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
          {loading || isSearching ? (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
              {loading ? 'データを読み込み中...' : '検索中...'}
            </div>
          ) : currentInvoices.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
              請求書がありません
            </div>
          ) : (
            currentInvoices.map((invoice) => (
              <div key={invoice.invoice_id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                {/* ヘッダー行 */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-blue-600">{invoice.invoice_id}</span>
                    {invoice.customer_name?.includes('UDトラック') && (
                      <span className="text-yellow-500">💰</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    {getStatusBadge(invoice.status)}
                    {getPaymentStatusBadge(invoice.payment_status)}
                  </div>
                </div>

                {/* 基本情報（新レイアウト） */}
                <div className="space-y-3 mb-3">
                  {/* 顧客名・件名・登録番号 */}
                  <div className="border-l-4 border-blue-400 pl-3">
                    <div className="text-sm font-bold text-gray-900">{invoice.customer_name || '-'}</div>
                    <div className="text-sm text-gray-600">{invoice.subject_name || '-'}</div>
                    <div className="text-xs text-gray-500">{invoice.registration_number || '-'}</div>
                  </div>
                  
                  {/* 請求日・金額 */}
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-gray-600">請求日</div>
                      <div className="text-sm">{invoice.issue_date ? new Date(invoice.issue_date).toLocaleDateString('ja-JP') : '-'}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">合計金額</div>
                      <div className="text-lg font-bold text-blue-600">¥{invoice.total_amount.toLocaleString()}</div>
                    </div>
                  </div>
                  
                  {/* 作業明細（最大3件、分割項目を含む） */}
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-xs text-gray-600 mb-1">作業明細（分割済み）</div>
                    {(() => {
                      const allItems: Array<{label: string, quantity: number}> = []
                      invoice.line_items.forEach(item => {
                        if (item.split_items && item.split_items.length > 0) {
                          item.split_items.forEach(split => {
                            allItems.push({
                              label: split.raw_label_part,
                              quantity: split.quantity
                            })
                          })
                        } else {
                          allItems.push({
                            label: item.raw_label || item.task_type || '-',
                            quantity: item.quantity || 0
                          })
                        }
                      })
                      
                      return (
                        <>
                          {allItems.slice(0, 6).map((item, index) => (
                            <div key={index} className="text-xs text-gray-800 truncate">
                              {item.label} (数量: {item.quantity})
                            </div>
                          ))}
                          {allItems.length > 6 && (
                            <div className="text-xs text-blue-600 mt-1">
                              その他 {allItems.length - 6} 件あり
                            </div>
                          )}
                        </>
                      )
                    })()}
                  </div>
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
                        onClick={() => router.push(`/invoice-create?edit=${invoice.invoice_id}`)}
                        className="px-3 py-1 text-sm text-green-600 border border-green-300 rounded hover:bg-green-50"
                      >
                        編集
                      </button>
                    )}
                    {invoice.status === 'finalized' && (
                      <button
                        onClick={() => handleCreateRedInvoice(invoice.invoice_id)}
                        className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50"
                      >
                        赤伝
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <select
                      value={invoice.status}
                      onChange={(e) => handleStatusChange(invoice.invoice_id, e.target.value as InvoiceWithItems['status'])}
                      className="text-xs px-2 py-1 border border-gray-300 rounded"
                      disabled={invoice.status === 'finalized'}
                    >
                      <option value="draft">下書き</option>
                      <option value="finalized">確定</option>
                      <option value="cancelled">取消</option>
                    </select>
                    <select
                      value={invoice.payment_status}
                      onChange={(e) => handlePaymentStatusChange(invoice.invoice_id, e.target.value as InvoiceWithItems['payment_status'])}
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
                {filteredInvoices.length}件中 {startIndex + 1}-{Math.min(endIndex, filteredInvoices.length)}件を表示
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
                    請求書詳細 {selectedInvoice.invoice_id}
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
                      <div><span className="font-medium">請求日:</span> {selectedInvoice.issue_date ? new Date(selectedInvoice.issue_date).toLocaleDateString('ja-JP') : '-'}</div>
                      <div><span className="font-medium">顧客名:</span> {selectedInvoice.customer_name || '-'}</div>
                      <div><span className="font-medium">件名:</span> {selectedInvoice.subject_name || '-'}</div>
                      <div><span className="font-medium">登録番号:</span> {selectedInvoice.registration_number || '-'}</div>
                      <div><span className="font-medium">ステータス:</span> {getStatusBadge(selectedInvoice.status)}</div>
                      <div><span className="font-medium">作成日:</span> {selectedInvoice.created_at ? new Date(selectedInvoice.created_at).toLocaleDateString('ja-JP') : '-'}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">管理情報</h3>
                    <div className="space-y-4">
                      <div><span className="font-medium">総数量:</span> {selectedInvoice.total_quantity}</div>
                      <div className="text-lg font-bold"><span className="font-medium">合計:</span> ¥{selectedInvoice.total_amount.toLocaleString()}</div>
                      
                      {/* ステータス変更 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ステータス変更</label>
                        <select
                          value={selectedInvoice.status}
                          onChange={(e) => handleStatusChange(selectedInvoice.invoice_id, e.target.value as InvoiceWithItems['status'])}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="draft">下書き</option>
                          <option value="finalized">確定</option>
                          <option value="cancelled">取消</option>
                        </select>
                      </div>
                      
                      {/* 支払い状況変更 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">支払い状況</label>
                        <select
                          value={selectedInvoice.payment_status}
                          onChange={(e) => handlePaymentStatusChange(selectedInvoice.invoice_id, e.target.value as InvoiceWithItems['payment_status'])}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="unpaid">未払い</option>
                          <option value="paid">支払済み</option>
                          <option value="partial">一部入金</option>
                        </select>
                      </div>
                      
                      {/* 編集ボタン（下書きの場合のみ） */}
                      {selectedInvoice.status === 'draft' && (
                        <button
                          onClick={() => {
                            setShowDetailModal(false)
                            router.push(`/invoice-create?edit=${selectedInvoice.invoice_id}`)
                          }}
                          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          編集
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">作業項目（分割済み）</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left border-b">項目</th>
                          <th className="px-4 py-2 text-left border-b">分割内容</th>
                          <th className="px-4 py-2 text-left border-b">対象・作業・位置</th>
                          <th className="px-4 py-2 text-right border-b">単価</th>
                          <th className="px-4 py-2 text-right border-b">数量</th>
                          <th className="px-4 py-2 text-right border-b">金額</th>
                          <th className="px-4 py-2 text-center border-b">状態</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedInvoice.line_items.map((item) => {
                          if (item.split_items && item.split_items.length > 0) {
                            // 分割項目がある場合
                            return item.split_items.map((split, splitIndex) => (
                              <tr key={`${item.id}-${split.id}`} className={splitIndex === 0 ? 'border-t-2 border-blue-200' : ''}>
                                <td className="px-4 py-2 border-b">
                                  {splitIndex === 0 && (
                                    <div className="font-medium text-gray-700">
                                      {item.raw_label || item.task_type}
                                      <div className="text-xs text-blue-600">({item.split_items?.length}分割)</div>
                                    </div>
                                  )}
                                </td>
                                <td className="px-4 py-2 border-b font-medium">{split.raw_label_part}</td>
                                <td className="px-4 py-2 border-b">
                                  {[split.target, split.action, split.position].filter(Boolean).join(' → ') || '-'}
                                </td>
                                <td className="px-4 py-2 text-right border-b">¥{split.unit_price.toLocaleString()}</td>
                                <td className="px-4 py-2 text-right border-b">{split.quantity}</td>
                                <td className="px-4 py-2 text-right border-b">¥{split.amount.toLocaleString()}</td>
                                <td className="px-4 py-2 text-center border-b">
                                  {split.is_cancelled ? (
                                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">取消</span>
                                  ) : (
                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">有効</span>
                                  )}
                                </td>
                              </tr>
                            ))
                          } else {
                            // 分割項目がない場合は元の項目を表示
                            return (
                              <tr key={item.id}>
                                <td className="px-4 py-2 border-b">{item.raw_label || item.task_type}</td>
                                <td className="px-4 py-2 border-b text-gray-500">-</td>
                                <td className="px-4 py-2 border-b">
                                  {[item.target, item.action, item.position].filter(Boolean).join(' → ') || '-'}
                                </td>
                                <td className="px-4 py-2 text-right border-b">¥{(item.unit_price || 0).toLocaleString()}</td>
                                <td className="px-4 py-2 text-right border-b">{item.quantity || 0}</td>
                                <td className="px-4 py-2 text-right border-b">¥{(item.amount || 0).toLocaleString()}</td>
                                <td className="px-4 py-2 text-center border-b">
                                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">未分割</span>
                                </td>
                              </tr>
                            )
                          }
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {selectedInvoice.work_names && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">作業概要</h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded">{selectedInvoice.work_names}</p>
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
