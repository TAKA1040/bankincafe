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
  Eye,
  DollarSign
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface WorkSearchItem {
  id: string
  invoiceNumber: string
  billingDate: string
  customerName: string
  clientName: string
  workName: string
  quantity: number
  unitPrice: number
  total: number
  isSet: boolean
  setItems?: string[]
  createdAt: string
}

const sampleWorkSearchItems: WorkSearchItem[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    billingDate: '2024-01-15',
    customerName: 'UDトラックス株式会社',
    clientName: '中野運送　中野正博',
    workName: '燃料キャップ嚙み込み分解取外し',
    quantity: 1,
    unitPrice: 8000,
    total: 8000,
    isSet: false,
    createdAt: '2024-01-10T09:00:00Z'
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    billingDate: '2024-01-20',
    customerName: 'UDトラックス株式会社',
    clientName: 'いすゞ自動車九州株式会社長崎サービスセンター',
    workName: '床亀裂溶接',
    quantity: 1,
    unitPrice: 5000,
    total: 5000,
    isSet: false,
    createdAt: '2024-01-18T10:15:00Z'
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    billingDate: '2024-01-20',
    customerName: 'UDトラックス株式会社',
    clientName: 'いすゞ自動車九州株式会社長崎サービスセンター',
    workName: 'マフラーカバー脱着ステイ折損ステン溶接 等一式',
    quantity: 1,
    unitPrice: 0,
    total: 18000,
    isSet: true,
    setItems: ['マフラーカバー脱着ステイ折損ステン溶接', 'リベット打ち替え加工'],
    createdAt: '2024-01-18T10:15:00Z'
  },
  {
    id: '4',
    invoiceNumber: 'INV-2024-004',
    billingDate: '2024-01-25',
    customerName: 'UDトラックス株式会社',
    clientName: '株式会社ロジコム・アイ',
    workName: 'ドライバーシート分解作動不良点検',
    quantity: 1,
    unitPrice: 10000,
    total: 10000,
    isSet: false,
    createdAt: '2024-01-22T11:20:00Z'
  },
  {
    id: '5',
    invoiceNumber: 'INV-2024-005',
    billingDate: '2024-01-25',
    customerName: 'UDトラックス株式会社',
    clientName: '東邦興産株式会社',
    workName: '煽りスケット取替加工',
    quantity: 1,
    unitPrice: 10000,
    total: 10000,
    isSet: false,
    createdAt: '2024-01-22T11:20:00Z'
  },
  {
    id: '6',
    invoiceNumber: 'INV-2024-006',
    billingDate: '2024-01-30',
    customerName: 'UDトラックス株式会社',
    clientName: '鶴丸海運株式会社',
    workName: 'ウィング蝶番点検 等一式',
    quantity: 1,
    unitPrice: 0,
    total: 8000,
    isSet: true,
    setItems: ['ウィング蝶番点検', 'グリスアップ'],
    createdAt: '2024-01-28T15:30:00Z'
  },
  {
    id: '7',
    invoiceNumber: 'INV-2024-007',
    billingDate: '2024-01-30',
    customerName: 'UDトラックス株式会社',
    clientName: '鶴丸海運株式会社',
    workName: '右煽りキャッチ取替',
    quantity: 1,
    unitPrice: 5000,
    total: 5000,
    isSet: false,
    createdAt: '2024-01-28T15:30:00Z'
  },
  {
    id: '8',
    invoiceNumber: 'INV-2024-008',
    billingDate: '2024-02-05',
    customerName: '田中自動車',
    clientName: '田中運送',
    workName: 'バンパー修理',
    quantity: 1,
    unitPrice: 25000,
    total: 25000,
    isSet: false,
    createdAt: '2024-02-01T14:20:00Z'
  },
  {
    id: '9',
    invoiceNumber: 'INV-2024-009',
    billingDate: '2024-02-10',
    customerName: '田中自動車',
    clientName: 'サトウ運輸',
    workName: '塗装作業一式',
    quantity: 1,
    unitPrice: 0,
    total: 35000,
    isSet: true,
    setItems: ['下地処理', '塗装', '仕上げ'],
    createdAt: '2024-02-05T16:45:00Z'
  },
  {
    id: '10',
    invoiceNumber: 'INV-2024-010',
    billingDate: '2024-02-15',
    customerName: '佐藤運送株式会社',
    clientName: '佐藤物流',
    workName: 'ライト交換・調整',
    quantity: 2,
    unitPrice: 8000,
    total: 16000,
    isSet: false,
    createdAt: '2024-02-12T09:30:00Z'
  }
]

export default function WorkSearchPage() {
  const router = useRouter()
  const [items, setItems] = useState<WorkSearchItem[]>([])
  const [filteredItems, setFilteredItems] = useState<WorkSearchItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [customerFilter, setCustomerFilter] = useState('')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')
  const [selectedItem, setSelectedItem] = useState<WorkSearchItem | null>(null)

  const filterItems = useCallback(() => {
    let filtered = [...items]

    // Search filter
    if (searchKeyword) {
      filtered = filtered.filter(item =>
        item.workName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.clientName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.customerName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        (item.setItems && item.setItems.some(setItem => 
          setItem.toLowerCase().includes(searchKeyword.toLowerCase())
        ))
      )
    }

    // Customer filter
    if (customerFilter) {
      filtered = filtered.filter(item =>
        item.customerName.toLowerCase().includes(customerFilter.toLowerCase()) ||
        item.clientName.toLowerCase().includes(customerFilter.toLowerCase())
      )
    }

    // Date range filter
    if (dateRange.start) {
      filtered = filtered.filter(item => item.billingDate >= dateRange.start)
    }
    if (dateRange.end) {
      filtered = filtered.filter(item => item.billingDate <= dateRange.end)
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal: any, bVal: any

      switch (sortBy) {
        case 'date':
          aVal = new Date(a.billingDate)
          bVal = new Date(b.billingDate)
          break
        case 'price':
          aVal = a.unitPrice || a.total
          bVal = b.unitPrice || b.total
          break
        case 'customer':
          aVal = a.customerName
          bVal = b.customerName
          break
        case 'work':
          aVal = a.workName
          bVal = b.workName
          break
        default:
          return 0
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })

    setFilteredItems(filtered)
  }, [items, searchKeyword, customerFilter, dateRange, sortBy, sortOrder])

  useEffect(() => {
    loadWorkSearchItems()
  }, [])

  useEffect(() => {
    filterItems()
  }, [filterItems])

  const loadWorkSearchItems = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setItems(sampleWorkSearchItems)
    } catch (error) {
      console.error('Failed to load work search items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSortChange = (newSortBy: string) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(newSortBy)
      setSortOrder('desc')
    }
  }

  const clearFilters = () => {
    setSearchKeyword('')
    setCustomerFilter('')
    setDateRange({ start: '', end: '' })
  }

  const handleExport = () => {
    const csv = [
      ['請求書番号', '請求日', '顧客名', '件名', '作業名', '数量', '単価', '合計'],
      ...filteredItems.map(item => [
        item.invoiceNumber,
        item.billingDate,
        item.customerName,
        item.clientName,
        item.workName,
        item.quantity.toString(),
        item.unitPrice.toString(),
        item.total.toString()
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `作業検索結果_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const getStats = () => {
    if (filteredItems.length === 0) return null

    const individualItems = filteredItems.filter(item => !item.isSet && item.unitPrice > 0)
    const setItems = filteredItems.filter(item => item.isSet)
    
    const totalRevenue = filteredItems.reduce((sum, item) => sum + item.total, 0)
    const averagePrice = individualItems.length > 0 
      ? individualItems.reduce((sum, item) => sum + item.unitPrice, 0) / individualItems.length 
      : 0

    return {
      totalCount: filteredItems.length,
      individualCount: individualItems.length,
      setCount: setItems.length,
      totalRevenue,
      averagePrice
    }
  }

  const stats = getStats()

  const getPopularWorks = () => {
    const workCounts: Record<string, number> = {}
    
    items.forEach(item => {
      workCounts[item.workName] = (workCounts[item.workName] || 0) + 1
    })

    return Object.entries(workCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 6)
      .map(([name, count]) => ({ name, count }))
  }

  const popularWorks = getPopularWorks()

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
              <h1 className="text-2xl font-bold text-secondary-900">作業検索</h1>
              <p className="text-secondary-600">作業内容の詳細検索・分析</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => router.push('/')}
                icon={<ArrowLeft className="h-4 w-4" />}
              >
                戻る
              </Button>
              {filteredItems.length > 0 && (
                <Button
                  variant="success"
                  onClick={handleExport}
                  icon={<Download className="h-4 w-4" />}
                >
                  CSV出力
                </Button>
              )}
            </div>
          </div>

          {/* Statistics */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">{stats.totalCount}</div>
                    <div className="text-sm text-secondary-600">検索結果件数</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success-600">{formatCurrency(stats.totalRevenue)}</div>
                    <div className="text-sm text-secondary-600">合計金額</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-warning-600">{formatCurrency(Math.round(stats.averagePrice))}</div>
                    <div className="text-sm text-secondary-600">平均単価</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary-600">
                      {stats.individualCount}/{stats.setCount}
                    </div>
                    <div className="text-sm text-secondary-600">個別/セット</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Popular Works */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                よく使われる作業
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {popularWorks.map((work, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchKeyword(work.name)}
                    className="text-left justify-start h-auto py-3 px-4"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium truncate">{work.name}</span>
                      <span className="text-xs text-secondary-500">{work.count}回</span>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Search className="h-5 w-5 mr-2" />
                  検索・フィルター
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  icon={<Filter className="h-4 w-4" />}
                >
                  {showFilters ? 'フィルターを隠す' : 'フィルターを表示'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  placeholder="作業名で検索"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  icon={<Search className="h-4 w-4" />}
                />
                <Input
                  placeholder="顧客名・件名で検索"
                  value={customerFilter}
                  onChange={(e) => setCustomerFilter(e.target.value)}
                  icon={<Building className="h-4 w-4" />}
                />
              </div>

              {showFilters && (
                <div className="border-t pt-4">
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
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  icon={<Filter className="h-4 w-4" />}
                >
                  フィルタークリア
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results List */}
          {filteredItems.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <Wrench className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                  <p className="text-secondary-600">
                    {searchKeyword || customerFilter || dateRange.start || dateRange.end
                      ? '検索条件に一致する作業が見つかりません'
                      : '作業を検索してください'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Sort Controls */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-secondary-600">
                  {filteredItems.length}件の検索結果
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-secondary-600">並び順:</span>
                  <select
                    className="text-sm border border-secondary-300 rounded-lg px-3 py-1"
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [newSortBy, newSortOrder] = e.target.value.split('-')
                      setSortBy(newSortBy)
                      setSortOrder(newSortOrder)
                    }}
                  >
                    <option value="date-desc">日付（新しい順）</option>
                    <option value="date-asc">日付（古い順）</option>
                    <option value="price-desc">価格（高い順）</option>
                    <option value="price-asc">価格（安い順）</option>
                    <option value="customer-asc">顧客名（あいうえお順）</option>
                    <option value="work-asc">作業名（あいうえお順）</option>
                  </select>
                </div>
              </div>

              {/* Results */}
              {filteredItems.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-semibold text-secondary-900">
                              {item.workName}
                            </h3>
                            {item.isSet && (
                              <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                                セット
                              </span>
                            )}
                          </div>
                          <div className="text-lg font-bold text-primary-600">
                            {formatCurrency(item.total)}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center text-sm text-secondary-600">
                            <Building className="h-4 w-4 mr-2" />
                            {item.customerName}
                          </div>
                          <div className="flex items-center text-sm text-secondary-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            {item.billingDate}
                          </div>
                        </div>

                        <div className="text-sm text-secondary-700">
                          <div className="font-medium">件名: {item.clientName}</div>
                          <div className="text-secondary-500">請求書: {item.invoiceNumber}</div>
                          {item.isSet && item.setItems && (
                            <div className="text-secondary-500">
                              セット内容: {item.setItems.join(', ')}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-secondary-600">
                          <span>数量: {item.quantity}</span>
                          <span>
                            単価: {item.isSet ? 'セット価格' : formatCurrency(item.unitPrice)}
                          </span>
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
                      <div className="text-sm font-medium text-secondary-700">請求書番号</div>
                      <div className="text-secondary-900">{selectedItem.invoiceNumber}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-secondary-700">請求日</div>
                      <div className="text-secondary-900">{selectedItem.billingDate}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-secondary-700">顧客名</div>
                      <div className="text-secondary-900">{selectedItem.customerName}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-secondary-700">件名</div>
                      <div className="text-secondary-900">{selectedItem.clientName}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-secondary-700">作業名</div>
                      <div className="text-secondary-900">{selectedItem.workName}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-secondary-700">作業タイプ</div>
                      <div className="text-secondary-900">{selectedItem.isSet ? 'セット作業' : '個別作業'}</div>
                    </div>
                    {selectedItem.isSet && selectedItem.setItems && (
                      <div className="md:col-span-2">
                        <div className="text-sm font-medium text-secondary-700">セット内容</div>
                        <div className="text-secondary-900 bg-secondary-50 p-3 rounded">
                          {selectedItem.setItems.join(', ')}
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-secondary-700">数量</div>
                      <div className="text-secondary-900">{selectedItem.quantity}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-secondary-700">単価</div>
                      <div className="text-secondary-900">
                        {selectedItem.isSet ? 'セット価格' : formatCurrency(selectedItem.unitPrice)}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="text-sm font-medium text-secondary-700">合計金額</div>
                      <div className="text-lg font-bold text-primary-600">{formatCurrency(selectedItem.total)}</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 mt-6">
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