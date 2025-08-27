'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import SecurityWrapper from '@/components/layout/SecurityWrapper'
import Navbar from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
  BarChart3,
  ArrowLeft,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  FileText,
  Download,
  Filter,
  RefreshCw,
  Eye
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface SalesData {
  id: string
  month: string
  totalRevenue: number
  invoiceCount: number
  customerCount: number
  averageOrderValue: number
  udRevenue: number
  otherRevenue: number
  topCustomers: Array<{
    name: string
    revenue: number
    invoiceCount: number
  }>
}

const sampleSalesData: SalesData[] = [
  {
    id: '1',
    month: '2024-01',
    totalRevenue: 850000,
    invoiceCount: 15,
    customerCount: 8,
    averageOrderValue: 56667,
    udRevenue: 650000,
    otherRevenue: 200000,
    topCustomers: [
      { name: 'UDトラックス株式会社', revenue: 650000, invoiceCount: 10 },
      { name: '田中自動車', revenue: 120000, invoiceCount: 3 },
      { name: '佐藤運送株式会社', revenue: 80000, invoiceCount: 2 }
    ]
  },
  {
    id: '2',
    month: '2024-02',
    totalRevenue: 920000,
    invoiceCount: 18,
    customerCount: 10,
    averageOrderValue: 51111,
    udRevenue: 700000,
    otherRevenue: 220000,
    topCustomers: [
      { name: 'UDトラックス株式会社', revenue: 700000, invoiceCount: 12 },
      { name: '田中自動車', revenue: 150000, invoiceCount: 4 },
      { name: '佐藤運送株式会社', revenue: 70000, invoiceCount: 2 }
    ]
  },
  {
    id: '3',
    month: '2024-03',
    totalRevenue: 1100000,
    invoiceCount: 22,
    customerCount: 12,
    averageOrderValue: 50000,
    udRevenue: 850000,
    otherRevenue: 250000,
    topCustomers: [
      { name: 'UDトラックス株式会社', revenue: 850000, invoiceCount: 16 },
      { name: '田中自動車', revenue: 130000, invoiceCount: 3 },
      { name: '鈴木商事', revenue: 120000, invoiceCount: 3 }
    ]
  },
  {
    id: '4',
    month: '2024-04',
    totalRevenue: 980000,
    invoiceCount: 20,
    customerCount: 9,
    averageOrderValue: 49000,
    udRevenue: 750000,
    otherRevenue: 230000,
    topCustomers: [
      { name: 'UDトラックス株式会社', revenue: 750000, invoiceCount: 14 },
      { name: '田中自動車', revenue: 140000, invoiceCount: 4 },
      { name: '佐藤運送株式会社', revenue: 90000, invoiceCount: 2 }
    ]
  },
  {
    id: '5',
    month: '2024-05',
    totalRevenue: 1250000,
    invoiceCount: 25,
    customerCount: 14,
    averageOrderValue: 50000,
    udRevenue: 950000,
    otherRevenue: 300000,
    topCustomers: [
      { name: 'UDトラックス株式会社', revenue: 950000, invoiceCount: 18 },
      { name: '田中自動車', revenue: 180000, invoiceCount: 5 },
      { name: '鈴木商事', revenue: 120000, invoiceCount: 2 }
    ]
  },
  {
    id: '6',
    month: '2024-06',
    totalRevenue: 1150000,
    invoiceCount: 23,
    customerCount: 11,
    averageOrderValue: 50000,
    udRevenue: 880000,
    otherRevenue: 270000,
    topCustomers: [
      { name: 'UDトラックス株式会社', revenue: 880000, invoiceCount: 16 },
      { name: '田中自動車', revenue: 160000, invoiceCount: 4 },
      { name: '佐藤運送株式会社', revenue: 110000, invoiceCount: 3 }
    ]
  }
]

export default function SalesManagementPage() {
  const router = useRouter()
  const [salesData, setSalesData] = useState<SalesData[]>([])
  const [filteredData, setFilteredData] = useState<SalesData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('all')
  const [selectedMonth, setSelectedMonth] = useState<SalesData | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const filterData = useCallback(() => {
    let filtered = [...salesData]

    if (selectedPeriod !== 'all') {
      const monthsToShow = parseInt(selectedPeriod)
      filtered = filtered.slice(-monthsToShow)
    }

    setFilteredData(filtered)
  }, [salesData, selectedPeriod])

  useEffect(() => {
    loadSalesData()
  }, [])

  useEffect(() => {
    filterData()
  }, [filterData])

  const loadSalesData = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSalesData(sampleSalesData)
    } catch (error) {
      console.error('Failed to load sales data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTotalStats = () => {
    if (filteredData.length === 0) return null

    const totalRevenue = filteredData.reduce((sum, data) => sum + data.totalRevenue, 0)
    const totalInvoices = filteredData.reduce((sum, data) => sum + data.invoiceCount, 0)
    const averageMonthlyRevenue = totalRevenue / filteredData.length
    const lastMonth = filteredData[filteredData.length - 1]
    const previousMonth = filteredData[filteredData.length - 2]
    
    const monthlyGrowth = previousMonth 
      ? ((lastMonth.totalRevenue - previousMonth.totalRevenue) / previousMonth.totalRevenue) * 100
      : 0

    return {
      totalRevenue,
      totalInvoices,
      averageMonthlyRevenue,
      monthlyGrowth,
      lastMonthRevenue: lastMonth?.totalRevenue || 0
    }
  }

  const getCustomerAnalysis = () => {
    const customerTotals: Record<string, { revenue: number, invoiceCount: number }> = {}
    
    filteredData.forEach(monthData => {
      monthData.topCustomers.forEach(customer => {
        if (!customerTotals[customer.name]) {
          customerTotals[customer.name] = { revenue: 0, invoiceCount: 0 }
        }
        customerTotals[customer.name].revenue += customer.revenue
        customerTotals[customer.name].invoiceCount += customer.invoiceCount
      })
    })

    return Object.entries(customerTotals)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
  }

  const handleExport = () => {
    const csv = [
      ['月', '売上合計', '請求書数', '顧客数', '平均注文額', 'UD売上', 'その他売上'],
      ...filteredData.map(data => [
        data.month,
        data.totalRevenue.toString(),
        data.invoiceCount.toString(),
        data.customerCount.toString(),
        data.averageOrderValue.toString(),
        data.udRevenue.toString(),
        data.otherRevenue.toString()
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `売上データ_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const totalStats = getTotalStats()
  const topCustomers = getCustomerAnalysis()

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
              <h1 className="text-2xl font-bold text-secondary-900">売上管理</h1>
              <p className="text-secondary-600">売上データの集計・分析</p>
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
                onClick={handleExport}
                icon={<Download className="h-4 w-4" />}
              >
                CSV出力
              </Button>
            </div>
          </div>

          {/* Summary Statistics */}
          {totalStats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">
                      {formatCurrency(totalStats.totalRevenue)}
                    </div>
                    <div className="text-sm text-secondary-600">総売上</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success-600">
                      {formatCurrency(Math.round(totalStats.averageMonthlyRevenue))}
                    </div>
                    <div className="text-sm text-secondary-600">月平均売上</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-warning-600">
                      {totalStats.totalInvoices}
                    </div>
                    <div className="text-sm text-secondary-600">総請求書数</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <span className={`text-2xl font-bold ${totalStats.monthlyGrowth >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                        {totalStats.monthlyGrowth >= 0 ? '+' : ''}{totalStats.monthlyGrowth.toFixed(1)}%
                      </span>
                      {totalStats.monthlyGrowth >= 0 ? (
                        <TrendingUp className="h-5 w-5 text-success-600" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-danger-600" />
                      )}
                    </div>
                    <div className="text-sm text-secondary-600">前月比成長率</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Period Filter */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  期間選択
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'all', label: '全期間' },
                  { value: '3', label: '直近3ヶ月' },
                  { value: '6', label: '直近6ヶ月' },
                  { value: '12', label: '直近12ヶ月' }
                ].map(period => (
                  <Button
                    key={period.value}
                    variant={selectedPeriod === period.value ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedPeriod(period.value)}
                  >
                    {period.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Sales Chart */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                月別売上推移
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredData.map((data, index) => {
                  const maxRevenue = Math.max(...filteredData.map(d => d.totalRevenue))
                  const widthPercentage = (data.totalRevenue / maxRevenue) * 100
                  
                  return (
                    <div key={data.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-secondary-900">
                          {data.month}
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-lg font-bold text-primary-600">
                            {formatCurrency(data.totalRevenue)}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedMonth(data)}
                            icon={<Eye className="h-4 w-4" />}
                          >
                            詳細
                          </Button>
                        </div>
                      </div>
                      <div className="w-full bg-secondary-200 rounded-full h-3">
                        <div
                          className="bg-primary-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${widthPercentage}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm text-secondary-600">
                        <span>請求書: {data.invoiceCount}件</span>
                        <span>顧客数: {data.customerCount}</span>
                        <span>平均: {formatCurrency(data.averageOrderValue)}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Customer Analysis */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                上位顧客分析
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCustomers.map((customer, index) => {
                  const maxRevenue = Math.max(...topCustomers.map(c => c.revenue))
                  const widthPercentage = (customer.revenue / maxRevenue) * 100
                  
                  return (
                    <div key={customer.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <span className="font-medium text-secondary-900">
                            {customer.name}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary-600">
                            {formatCurrency(customer.revenue)}
                          </div>
                          <div className="text-sm text-secondary-600">
                            {customer.invoiceCount}件
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-secondary-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${widthPercentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* UD vs Other Revenue */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  UD vs その他売上
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredData.map((data) => {
                    const udPercentage = (data.udRevenue / data.totalRevenue) * 100
                    const otherPercentage = (data.otherRevenue / data.totalRevenue) * 100
                    
                    return (
                      <div key={data.id} className="space-y-2">
                        <div className="text-sm font-medium text-secondary-900">
                          {data.month}
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1">
                            <div className="flex h-4 bg-secondary-200 rounded-full overflow-hidden">
                              <div
                                className="bg-primary-600"
                                style={{ width: `${udPercentage}%` }}
                              />
                              <div
                                className="bg-warning-500"
                                style={{ width: `${otherPercentage}%` }}
                              />
                            </div>
                          </div>
                          <div className="text-sm text-secondary-600 min-w-0">
                            {formatCurrency(data.totalRevenue)}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-secondary-600">
                          <span className="flex items-center">
                            <div className="w-3 h-3 bg-primary-600 rounded-full mr-1" />
                            UD: {formatCurrency(data.udRevenue)} ({udPercentage.toFixed(1)}%)
                          </span>
                          <span className="flex items-center">
                            <div className="w-3 h-3 bg-warning-500 rounded-full mr-1" />
                            その他: {formatCurrency(data.otherRevenue)} ({otherPercentage.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  請求書発行状況
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredData.map((data) => {
                    const avgPerCustomer = data.invoiceCount / data.customerCount
                    
                    return (
                      <div key={data.id} className="flex items-center justify-between py-2 border-b border-secondary-200 last:border-b-0">
                        <div>
                          <div className="font-medium text-secondary-900">{data.month}</div>
                          <div className="text-sm text-secondary-600">
                            顧客数: {data.customerCount}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary-600">
                            {data.invoiceCount}件
                          </div>
                          <div className="text-sm text-secondary-600">
                            顧客当たり: {avgPerCustomer.toFixed(1)}件
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Month Detail Modal */}
          {selectedMonth && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-auto">
                <h3 className="text-xl font-bold text-secondary-900 mb-4">
                  {selectedMonth.month} 売上詳細
                </h3>
                
                <div className="space-y-6">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-secondary-50 p-4 rounded-lg">
                      <div className="text-sm font-medium text-secondary-700">総売上</div>
                      <div className="text-2xl font-bold text-primary-600">
                        {formatCurrency(selectedMonth.totalRevenue)}
                      </div>
                    </div>
                    <div className="bg-secondary-50 p-4 rounded-lg">
                      <div className="text-sm font-medium text-secondary-700">請求書数</div>
                      <div className="text-2xl font-bold text-success-600">
                        {selectedMonth.invoiceCount}件
                      </div>
                    </div>
                    <div className="bg-secondary-50 p-4 rounded-lg">
                      <div className="text-sm font-medium text-secondary-700">顧客数</div>
                      <div className="text-2xl font-bold text-warning-600">
                        {selectedMonth.customerCount}
                      </div>
                    </div>
                    <div className="bg-secondary-50 p-4 rounded-lg">
                      <div className="text-sm font-medium text-secondary-700">平均注文額</div>
                      <div className="text-2xl font-bold text-secondary-600">
                        {formatCurrency(selectedMonth.averageOrderValue)}
                      </div>
                    </div>
                  </div>

                  {/* Top Customers */}
                  <div>
                    <h4 className="text-lg font-semibold text-secondary-900 mb-3">上位顧客</h4>
                    <div className="space-y-3">
                      {selectedMonth.topCustomers.map((customer, index) => (
                        <div key={customer.name} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                            <span className="font-medium">{customer.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-primary-600">
                              {formatCurrency(customer.revenue)}
                            </div>
                            <div className="text-sm text-secondary-600">
                              {customer.invoiceCount}件
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Revenue Breakdown */}
                  <div>
                    <h4 className="text-lg font-semibold text-secondary-900 mb-3">売上内訳</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                        <span className="font-medium">UD売上</span>
                        <span className="font-bold text-primary-600">
                          {formatCurrency(selectedMonth.udRevenue)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-warning-50 rounded-lg">
                        <span className="font-medium">その他売上</span>
                        <span className="font-bold text-warning-600">
                          {formatCurrency(selectedMonth.otherRevenue)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    variant="secondary"
                    onClick={() => setSelectedMonth(null)}
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