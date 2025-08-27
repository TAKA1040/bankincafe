/**
 * パス: src/app/work-history/page.tsx
 * 目的: 作業履歴ページ - 過去の作業価格や実績を検索・確認
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
  Search, 
  Filter, 
  Download,
  ArrowLeft,
  Calendar,
  Building,
  Wrench,
  RefreshCw,
  FileText,
  TrendingUp,
  Eye
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface WorkHistoryItem {
  id: string
  invoiceNumber: string
  billingDate: string
  customerName: string
  subject: string
  registrationNumber: string
  workName: string
  workType: 'individual' | 'set'
  quantity: number
  unitPrice: number
  total: number
  setDetails?: string
  category: 'UD' | 'その他'
  createdAt: string
}

const sampleWorkHistory: WorkHistoryItem[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    billingDate: '2024-01-15',
    customerName: '株式会社UDトラックス',
    subject: 'トラック修理作業',
    registrationNumber: '品川500あ1234',
    workName: 'バンパー修理',
    workType: 'individual',
    quantity: 1,
    unitPrice: 80000,
    total: 80000,
    category: 'UD',
    createdAt: '2024-01-10T09:00:00Z'
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-001',
    billingDate: '2024-01-15',
    customerName: '株式会社UDトラックス',
    subject: 'トラック修理作業',
    registrationNumber: '品川500あ1234',
    workName: 'サイドパネル塗装',
    workType: 'individual',
    quantity: 2,
    unitPrice: 35000,
    total: 70000,
    category: 'UD',
    createdAt: '2024-01-10T09:00:00Z'
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-002',
    billingDate: '2024-01-20',
    customerName: '田中自動車',
    subject: 'バンパー修理',
    registrationNumber: '足立301な5678',
    workName: 'フルメンテナンスセット',
    workType: 'set',
    quantity: 1,
    unitPrice: 80000,
    total: 80000,
    setDetails: 'バンパー修理、ライト調整、点検',
    category: 'その他',
    createdAt: '2024-01-18T10:15:00Z'
  },
  {
    id: '4',
    invoiceNumber: 'INV-2024-003',
    billingDate: '2024-01-25',
    customerName: '株式会社UDトラックス',
    subject: 'サイドパネル塗装',
    registrationNumber: '品川500あ9999',
    workName: 'サイドパネル塗装',
    workType: 'individual',
    quantity: 4,
    unitPrice: 30000,
    total: 120000,
    category: 'UD',
    createdAt: '2024-01-22T11:20:00Z'
  },
  {
    id: '5',
    invoiceNumber: 'INV-2024-004',
    billingDate: '2024-01-30',
    customerName: '佐藤運送',
    subject: 'ライト交換・調整',
    registrationNumber: '練馬100さ3333',
    workName: 'ライト調整',
    workType: 'individual',
    quantity: 2,
    unitPrice: 15000,
    total: 30000,
    category: 'その他',
    createdAt: '2024-01-28T15:30:00Z'
  },
  {
    id: '6',
    invoiceNumber: 'INV-2024-004',
    billingDate: '2024-01-30',
    customerName: '佐藤運送',
    subject: 'ライト交換・調整',
    registrationNumber: '練馬100さ3333',
    workName: 'ライト交換',
    workType: 'individual',
    quantity: 2,
    unitPrice: 8000,
    total: 16000,
    category: 'その他',
    createdAt: '2024-01-28T15:30:00Z'
  }
]

export default function WorkHistoryPage() {
  const router = useRouter()
  const [workHistory, setWorkHistory] = useState<WorkHistoryItem[]>([])
  const [filteredHistory, setFilteredHistory] = useState<WorkHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [customerFilter, setCustomerFilter] = useState<string>('all')
  const [workTypeFilter, setWorkTypeFilter] = useState<string>('all')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [selectedItem, setSelectedItem] = useState<WorkHistoryItem | null>(null)

  const filterHistory = useCallback(() => {
    let filtered = [...workHistory]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.workName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Customer filter
    if (customerFilter !== 'all') {
      filtered = filtered.filter(item => item.category === customerFilter)
    }

    // Work type filter
    if (workTypeFilter !== 'all') {
      filtered = filtered.filter(item => item.workType === workTypeFilter)
    }

    // Date range filter
    if (dateRange.start) {
      filtered = filtered.filter(item => item.billingDate >= dateRange.start)
    }
    if (dateRange.end) {
      filtered = filtered.filter(item => item.billingDate <= dateRange.end)
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.billingDate).getTime() - new Date(a.billingDate).getTime())

    setFilteredHistory(filtered)
  }, [workHistory, searchQuery, customerFilter, workTypeFilter, dateRange])

  useEffect(() => {
    loadWorkHistory()
  }, [])

  useEffect(() => {
    filterHistory()
  }, [filterHistory])

  const loadWorkHistory = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setWorkHistory(sampleWorkHistory)
    } catch (error) {
      console.error('Failed to load work history:', error)
    } finally {
      setLoading(false)
    }
  }

  const clearFilters = () => {
    setSearchQuery('')
    setCustomerFilter('all')
    setWorkTypeFilter('all')
    setDateRange({ start: '', end: '' })
  }

  const exportToCSV = () => {
    if (filteredHistory.length === 0) {
      alert('エクスポートするデータがありません')
      return
    }

    const headers = ['請求書番号', '請求日', '顧客名', '件名', '登録番号', '作業名', '種類', '数量', '単価', '合計', 'セット詳細']
    const csvContent = [
      headers.join(','),
      ...filteredHistory.map(item => [
        `"${item.invoiceNumber}"`,
        `"${item.billingDate}"`,
        `"${item.customerName}"`,
        `"${item.subject}"`,
        `"${item.registrationNumber}"`,
        `"${item.workName}"`,
        `"${item.workType === 'individual' ? '個別' : 'セット'}"`,
        item.quantity,
        item.unitPrice,
        item.total,
        `"${item.setDetails || ''}"`
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `作業履歴_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const getStatistics = () => {
    const totalItems = filteredHistory.length
    const totalAmount = filteredHistory.reduce((sum, item) => sum + item.total, 0)
    const avgPrice = totalItems > 0 ? totalAmount / totalItems : 0
    const uniqueWorkTypes = [...new Set(filteredHistory.map(item => item.workName))].length

    return { totalItems, totalAmount, avgPrice, uniqueWorkTypes }
  }

  const stats = getStatistics()

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
              <h1 className="text-2xl font-bold text-secondary-900">作業履歴</h1>
              <p className="text-secondary-600">過去の作業内容・価格検索</p>
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
                variant="success"
                onClick={exportToCSV}
                icon={<Download className="h-4 w-4" />}
                disabled={filteredHistory.length === 0}
              >
                CSVエクスポート
              </Button>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">{stats.totalItems}</div>
                  <div className="text-sm text-secondary-600">作業件数</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-success-600">{formatCurrency(stats.totalAmount)}</div>
                  <div className="text-sm text-secondary-600">合計金額</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning-600">{formatCurrency(stats.avgPrice)}</div>
                  <div className="text-sm text-secondary-600">平均単価</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.uniqueWorkTypes}</div>
                  <div className="text-sm text-secondary-600">作業種類</div>
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
                  placeholder="作業名、顧客名、登録番号で検索"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="h-4 w-4" />}
                />
                
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

                <div>
                  <label className="label">作業種類</label>
                  <select
                    className="input"
                    value={workTypeFilter}
                    onChange={(e) => setWorkTypeFilter(e.target.value)}
                  >
                    <option value="all">すべて</option>
                    <option value="individual">個別作業</option>
                    <option value="set">セット作業</option>
                  </select>
                </div>

                <Button
                  variant="outline"
                  onClick={clearFilters}
                  icon={<Filter className="h-4 w-4" />}
                >
                  クリア
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

          {/* Work History List */}
          {filteredHistory.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <Wrench className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                  <p className="text-secondary-600">
                    {searchQuery || customerFilter !== 'all' || workTypeFilter !== 'all' || dateRange.start || dateRange.end
                      ? '検索条件に一致する作業履歴が見つかりません'
                      : '作業履歴がありません'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredHistory.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-semibold text-secondary-900">
                              {item.workName}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.workType === 'individual' 
                                ? 'bg-primary-100 text-primary-700' 
                                : 'bg-warning-100 text-warning-700'
                            }`}>
                              {item.workType === 'individual' ? '個別' : 'セット'}
                            </span>
                          </div>
                          <div className="text-lg font-bold text-success-600">
                            {formatCurrency(item.total)}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center text-sm text-secondary-600">
                            <Building className="h-4 w-4 mr-2" />
                            <span className="font-medium">{item.customerName}</span>
                            <span className="ml-2 px-2 py-1 bg-secondary-100 text-secondary-700 rounded text-xs">
                              {item.category}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-secondary-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            請求日: {item.billingDate}
                          </div>
                        </div>

                        <div className="text-sm text-secondary-700">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <span className="font-medium">件名: </span>
                              {item.subject}
                            </div>
                            <div>
                              <span className="font-medium">登録番号: </span>
                              {item.registrationNumber}
                            </div>
                          </div>
                          <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <span className="font-medium">数量: </span>
                              {item.quantity}
                            </div>
                            <div>
                              <span className="font-medium">単価: </span>
                              {formatCurrency(item.unitPrice)}
                            </div>
                            <div>
                              <span className="font-medium">請求書: </span>
                              {item.invoiceNumber}
                            </div>
                          </div>
                          {item.setDetails && (
                            <div className="mt-2">
                              <span className="font-medium">セット内容: </span>
                              <span className="text-xs bg-secondary-50 p-1 rounded">{item.setDetails}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mt-4 lg:mt-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedItem(item)}
                          icon={<Eye className="h-4 w-4" />}
                        >
                          詳細
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Detail Modal */}
          {selectedItem && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-auto">
                <h3 className="text-xl font-bold text-secondary-900 mb-4">
                  作業詳細 - {selectedItem.workName}
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-secondary-700">作業名</div>
                      <div className="text-secondary-900">{selectedItem.workName}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-secondary-700">作業種類</div>
                      <div className="text-secondary-900">
                        {selectedItem.workType === 'individual' ? '個別作業' : 'セット作業'}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-secondary-700">顧客名</div>
                      <div className="text-secondary-900">{selectedItem.customerName}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-secondary-700">請求日</div>
                      <div className="text-secondary-900">{selectedItem.billingDate}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-secondary-700">数量</div>
                      <div className="text-secondary-900">{selectedItem.quantity}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-secondary-700">単価</div>
                      <div className="text-secondary-900">{formatCurrency(selectedItem.unitPrice)}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-secondary-700">合計</div>
                      <div className="text-secondary-900 font-bold">{formatCurrency(selectedItem.total)}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-secondary-700">請求書番号</div>
                      <div className="text-secondary-900">{selectedItem.invoiceNumber}</div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="text-sm font-medium text-secondary-700">件名</div>
                      <div className="text-secondary-900">{selectedItem.subject}</div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="text-sm font-medium text-secondary-700">登録番号</div>
                      <div className="text-secondary-900">{selectedItem.registrationNumber}</div>
                    </div>
                    {selectedItem.setDetails && (
                      <div className="md:col-span-2">
                        <div className="text-sm font-medium text-secondary-700">セット内容</div>
                        <div className="text-secondary-900 bg-secondary-50 p-3 rounded">{selectedItem.setDetails}</div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button
                    variant="secondary"
                    onClick={() => setSelectedItem(null)}
                  >
                    閉じる
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </SecurityWrapper>
  )
}
