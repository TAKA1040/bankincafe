/**
 * パス: src/app/invoice-list/page.tsx
 * 目的: 請求書一覧画面
 */
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import SecurityWrapper from '@/components/layout/SecurityWrapper'
import Navbar from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Edit,
  Trash2,
  FileText,
  Calendar,
  Building,
  ArrowLeft,
  Eye,
  RefreshCw
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface Invoice {
  id: string
  invoiceNumber: string
  billingDate: string
  customerCategory: 'UD' | 'その他'
  customerName: string
  subject: string
  registrationNumber?: string
  orderNumber?: string
  subtotal: number
  tax: number
  total: number
  status: 'draft' | 'finalized' | 'sent' | 'paid'
  createdAt: string
  updatedAt: string
}

const sampleInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    billingDate: '2024-01-15',
    customerCategory: 'UD',
    customerName: '株式会社UDトラックス',
    subject: 'トラック修理作業',
    registrationNumber: '品川500あ1234',
    orderNumber: 'ORD-2024-001',
    subtotal: 150000,
    tax: 15000,
    total: 165000,
    status: 'paid',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z'
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    billingDate: '2024-01-20',
    customerCategory: 'その他',
    customerName: '田中自動車',
    subject: 'バンパー修理',
    registrationNumber: '足立301な5678',
    subtotal: 80000,
    tax: 8000,
    total: 88000,
    status: 'sent',
    createdAt: '2024-01-18T10:15:00Z',
    updatedAt: '2024-01-20T16:45:00Z'
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    billingDate: '2024-01-25',
    customerCategory: 'UD',
    customerName: '株式会社UDトラックス',
    subject: 'サイドパネル塗装',
    registrationNumber: '品川500あ9999',
    orderNumber: 'ORD-2024-002',
    subtotal: 120000,
    tax: 12000,
    total: 132000,
    status: 'finalized',
    createdAt: '2024-01-22T11:20:00Z',
    updatedAt: '2024-01-25T13:10:00Z'
  },
  {
    id: '4',
    invoiceNumber: 'INV-2024-004',
    billingDate: '2024-01-30',
    customerCategory: 'その他',
    customerName: '佐藤運送',
    subject: 'ライト交換・調整',
    registrationNumber: '練馬100さ3333',
    subtotal: 45000,
    tax: 4500,
    total: 49500,
    status: 'draft',
    createdAt: '2024-01-28T15:30:00Z',
    updatedAt: '2024-01-30T09:45:00Z'
  }
]

const statusLabels = {
  draft: '下書き',
  finalized: '確定',
  sent: '送信済み',
  paid: '支払済み'
}

const statusColors = {
  draft: 'bg-secondary-100 text-secondary-700',
  finalized: 'bg-warning-100 text-warning-700',
  sent: 'bg-primary-100 text-primary-700',
  paid: 'bg-success-100 text-success-700'
}

export default function InvoiceListPage() {
  const router = useRouter()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [customerFilter, setCustomerFilter] = useState<string>('all')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

  const filterInvoices = useCallback(() => {
    let filtered = [...invoices]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(invoice =>
        invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.registrationNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(invoice => invoice.status === statusFilter)
    }

    // Customer type filter
    if (customerFilter !== 'all') {
      filtered = filtered.filter(invoice => invoice.customerCategory === customerFilter)
    }

    // Date range filter
    if (dateRange.start) {
      filtered = filtered.filter(invoice => invoice.billingDate >= dateRange.start)
    }
    if (dateRange.end) {
      filtered = filtered.filter(invoice => invoice.billingDate <= dateRange.end)
    }

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    setFilteredInvoices(filtered)
  }, [invoices, searchQuery, statusFilter, customerFilter, dateRange])

  useEffect(() => {
    loadInvoices()
  }, [])

  useEffect(() => {
    filterInvoices()
  }, [filterInvoices])

  const loadInvoices = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setInvoices(sampleInvoices)
    } catch (error) {
      console.error('Failed to load invoices:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (invoiceId: string) => {
    if (!confirm('この請求書を削除してもよろしいですか？')) {
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      setInvoices(prev => prev.filter(invoice => invoice.id !== invoiceId))
      alert('請求書を削除しました')
    } catch (error) {
      alert('削除に失敗しました')
    }
  }

  const handleExportPDF = (invoiceId: string) => {
    // Simulate PDF generation
    const invoice = invoices.find(inv => inv.id === invoiceId)
    if (invoice) {
      alert(`${invoice.invoiceNumber} のPDFを出力します`)
    }
  }

  const clearFilters = () => {
    setSearchQuery('')
    setStatusFilter('all')
    setCustomerFilter('all')
    setDateRange({ start: '', end: '' })
  }

  const getTotalStats = () => {
    const total = filteredInvoices.reduce((sum, invoice) => sum + invoice.total, 0)
    const count = filteredInvoices.length
    const avgAmount = count > 0 ? total / count : 0

    return { total, count, avgAmount }
  }

  const stats = getTotalStats()

  if (loading) {
    return (
      <SecurityWrapper>
        <div className="min-h-screen bg-secondary-50">
          <Navbar />
          <div className="container py-8">
            <div className="flex justify-center items-center h-64">
              <RefreshCw className="h-8 w-8 animate-spin text-primary-600" />
              <span className="ml-2 text-lg text-secondary-600">読み込み中...</span>
            </div>
          </div>
        </div>
      </SecurityWrapper>
    )
  }

  return (
    <SecurityWrapper>
      <div className="min-h-screen bg-secondary-50">
        <Navbar />
        
        <div className="container py-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-secondary-900">請求書一覧</h1>
              <p className="text-secondary-600">請求書の管理・PDF出力</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => router.push('/')}
                icon={<ArrowLeft className="h-4 w-4" />}
              >
                戻る
              </Button>
              <Button
                variant="primary"
                onClick={() => router.push('/invoice-create')}
                icon={<Plus className="h-4 w-4" />}
              >
                新規作成
              </Button>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">{stats.count}</div>
                  <div className="text-sm text-secondary-600">請求書件数</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-success-600">{formatCurrency(stats.total)}</div>
                  <div className="text-sm text-secondary-600">合計金額</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning-600">{formatCurrency(stats.avgAmount)}</div>
                  <div className="text-sm text-secondary-600">平均金額</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                検索・フィルター
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <Input
                  placeholder="請求書番号、顧客名、件名で検索"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="h-4 w-4" />}
                />
                
                <div>
                  <label className="label">ステータス</label>
                  <select
                    className="input"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">すべて</option>
                    <option value="draft">下書き</option>
                    <option value="finalized">確定</option>
                    <option value="sent">送信済み</option>
                    <option value="paid">支払済み</option>
                  </select>
                </div>

                <div>
                  <label className="label">顧客タイプ</label>
                  <select
                    className="input"
                    value={customerFilter}
                    onChange={(e) => setCustomerFilter(e.target.value)}
                  >
                    <option value="all">すべて</option>
                    <option value="UD">UD</option>
                    <option value="その他">その他</option>
                  </select>
                </div>

                <Button
                  variant="outline"
                  onClick={clearFilters}
                  icon={<Filter className="h-4 w-4" />}
                >
                  フィルタークリア
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="date"
                  label="開始日"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                />
                <Input
                  type="date"
                  label="終了日"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Invoice List */}
          {filteredInvoices.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                  <p className="text-secondary-600">
                    {searchQuery || statusFilter !== 'all' || customerFilter !== 'all' || dateRange.start || dateRange.end
                      ? '検索条件に一致する請求書が見つかりません'
                      : '請求書がありません'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredInvoices.map((invoice) => (
                <Card key={invoice.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-semibold text-secondary-900">
                              {invoice.invoiceNumber}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[invoice.status]}`}>
                              {statusLabels[invoice.status]}
                            </span>
                          </div>
                          <div className="text-lg font-bold text-primary-600">
                            {formatCurrency(invoice.total)}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center text-sm text-secondary-600">
                            <Building className="h-4 w-4 mr-2" />
                            <span className="font-medium">{invoice.customerName}</span>
                            <span className="ml-2 px-2 py-1 bg-secondary-100 text-secondary-700 rounded text-xs">
                              {invoice.customerCategory}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-secondary-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            請求日: {invoice.billingDate}
                          </div>
                        </div>

                        <div className="text-sm text-secondary-700">
                          <div className="font-medium">{invoice.subject}</div>
                          {invoice.registrationNumber && (
                            <div className="text-secondary-500">登録番号: {invoice.registrationNumber}</div>
                          )}
                          {invoice.orderNumber && (
                            <div className="text-secondary-500">発注番号: {invoice.orderNumber}</div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mt-4 lg:mt-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/invoice/${invoice.id}`)}
                          icon={<Eye className="h-4 w-4" />}
                        >
                          詳細
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/invoice-create?edit=${invoice.id}`)}
                          icon={<Edit className="h-4 w-4" />}
                        >
                          編集
                        </Button>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleExportPDF(invoice.id)}
                          icon={<Download className="h-4 w-4" />}
                        >
                          PDF
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(invoice.id)}
                          icon={<Trash2 className="h-4 w-4" />}
                        >
                          削除
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </SecurityWrapper>
  )
}