'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, BarChart3, Download, TrendingUp, Calendar, DollarSign } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

// 型定義
interface Invoice {
  id: number
  invoice_year: number
  invoice_month: number
  customer_name: string
  subject: string
  total_amount: number
  status: 'draft' | 'sent' | 'paid' | 'cancelled'
  created_at: string
}

interface MonthlySales {
  month: string
  year: number
  monthNum: number
  amount: number
  count: number
}

interface CustomerSales {
  customer_name: string
  total_amount: number
  invoice_count: number
  percentage: number
}

interface SalesStatistics {
  totalSales: number
  totalInvoices: number
  averageAmount: number
  paidAmount: number
  unpaidAmount: number
  topCustomer: string
  topMonth: string
}

// SalesDBクラス
class SalesDB {
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
        customer_name: 'テクノロジー株式会社',
        subject: 'Webサイト制作',
        total_amount: 110000,
        status: 'paid',
        created_at: '2024-01-15T10:00:00.000Z'
      },
      {
        id: 2,
        invoice_year: 2024,
        invoice_month: 2,
        customer_name: 'サンプル商事株式会社B',
        subject: 'システム保守',
        total_amount: 55000,
        status: 'paid',
        created_at: '2024-02-10T14:30:00.000Z'
      },
      {
        id: 3,
        invoice_year: 2024,
        invoice_month: 3,
        customer_name: '株式会社UDトラックス',
        subject: 'データベース設計',
        total_amount: 88000,
        status: 'sent',
        created_at: '2024-03-05T09:15:00.000Z'
      },
      {
        id: 4,
        invoice_year: 2024,
        invoice_month: 1,
        customer_name: 'テクノロジー株式会社',
        subject: 'SEO対策',
        total_amount: 33000,
        status: 'paid',
        created_at: '2024-01-20T16:00:00.000Z'
      },
      {
        id: 5,
        invoice_year: 2024,
        invoice_month: 2,
        customer_name: 'サンプル商事株式会社B',
        subject: 'サーバー構築',
        total_amount: 132000,
        status: 'paid',
        created_at: '2024-02-25T11:30:00.000Z'
      },
      {
        id: 6,
        invoice_year: 2024,
        invoice_month: 4,
        customer_name: 'モバイル株式会社',
        subject: 'モバイルアプリ開発',
        total_amount: 165000,
        status: 'draft',
        created_at: '2024-04-10T13:45:00.000Z'
      }
    ]
  }

  getMonthlySales(year?: number): MonthlySales[] {
    const filteredData = year ? this.data.filter(invoice => invoice.invoice_year === year) : this.data
    
    const monthlyMap = new Map<string, MonthlySales>()
    
    filteredData.forEach(invoice => {
      const key = `${invoice.invoice_year}-${invoice.invoice_month}`
      const existing = monthlyMap.get(key)
      
      if (existing) {
        existing.amount += invoice.total_amount
        existing.count += 1
      } else {
        monthlyMap.set(key, {
          month: `${invoice.invoice_year}年${invoice.invoice_month}月`,
          year: invoice.invoice_year,
          monthNum: invoice.invoice_month,
          amount: invoice.total_amount,
          count: 1
        })
      }
    })
    
    return Array.from(monthlyMap.values()).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year
      return a.monthNum - b.monthNum
    })
  }

  getCustomerSales(year?: number): CustomerSales[] {
    const filteredData = year ? this.data.filter(invoice => invoice.invoice_year === year) : this.data
    const totalAmount = filteredData.reduce((sum, invoice) => sum + invoice.total_amount, 0)
    
    const customerMap = new Map<string, CustomerSales>()
    
    filteredData.forEach(invoice => {
      const existing = customerMap.get(invoice.customer_name)
      
      if (existing) {
        existing.total_amount += invoice.total_amount
        existing.invoice_count += 1
      } else {
        customerMap.set(invoice.customer_name, {
          customer_name: invoice.customer_name,
          total_amount: invoice.total_amount,
          invoice_count: 1,
          percentage: 0
        })
      }
    })
    
    const customers = Array.from(customerMap.values())
    customers.forEach(customer => {
      customer.percentage = totalAmount > 0 ? (customer.total_amount / totalAmount) * 100 : 0
    })
    
    return customers.sort((a, b) => b.total_amount - a.total_amount)
  }

  getStatistics(year?: number): SalesStatistics {
    const filteredData = year ? this.data.filter(invoice => invoice.invoice_year === year) : this.data
    
    if (filteredData.length === 0) {
      return {
        totalSales: 0,
        totalInvoices: 0,
        averageAmount: 0,
        paidAmount: 0,
        unpaidAmount: 0,
        topCustomer: '',
        topMonth: ''
      }
    }

    const totalSales = filteredData.reduce((sum, invoice) => sum + invoice.total_amount, 0)
    const paidAmount = filteredData
      .filter(invoice => invoice.status === 'paid')
      .reduce((sum, invoice) => sum + invoice.total_amount, 0)
    const unpaidAmount = totalSales - paidAmount
    const averageAmount = Math.round(totalSales / filteredData.length)

    // 顧客別売上
    const customerSales = this.getCustomerSales(year)
    const topCustomer = customerSales[0]?.customer_name || ''

    // 月別売上
    const monthlySales = this.getMonthlySales(year)
    const topMonth = monthlySales.sort((a, b) => b.amount - a.amount)[0]?.month || ''

    return {
      totalSales,
      totalInvoices: filteredData.length,
      averageAmount,
      paidAmount,
      unpaidAmount,
      topCustomer,
      topMonth
    }
  }

  getAvailableYears(): number[] {
    const years = [...new Set(this.data.map(invoice => invoice.invoice_year))]
    return years.sort((a, b) => b - a)
  }

  exportToCSV(year?: number): void {
    const filteredData = year ? this.data.filter(invoice => invoice.invoice_year === year) : this.data
    
    const headers = [
      '請求書ID', '請求年', '請求月', '顧客名', '件名', '金額', 'ステータス', '作成日'
    ]
    
    const rows = filteredData.map(invoice => [
      invoice.id.toString(),
      invoice.invoice_year.toString(),
      invoice.invoice_month.toString(),
      `"${invoice.customer_name.replace(/"/g, '""')}"`,
      `"${invoice.subject.replace(/"/g, '""')}"`,
      invoice.total_amount.toString(),
      this.getStatusLabel(invoice.status),
      new Date(invoice.created_at).toLocaleDateString('ja-JP')
    ])

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `売上データ_${year || '全年度'}_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    
    setTimeout(() => URL.revokeObjectURL(url), 100)
  }

  private getStatusLabel(status: Invoice['status']): string {
    const statusMap = {
      draft: '下書き',
      sent: '送信済み',
      paid: '支払済み',
      cancelled: 'キャンセル'
    }
    return statusMap[status] || status
  }
}

export default function SalesManagementPage() {
  const router = useRouter()
  const [db] = useState(() => new SalesDB())
  const [selectedYear, setSelectedYear] = useState<number | undefined>(new Date().getFullYear())
  const [viewMode, setViewMode] = useState<'monthly' | 'customer'>('monthly')

  const availableYears = useMemo(() => db.getAvailableYears(), [db])
  const statistics = useMemo(() => db.getStatistics(selectedYear), [db, selectedYear])
  const monthlySales = useMemo(() => db.getMonthlySales(selectedYear), [db, selectedYear])
  const customerSales = useMemo(() => db.getCustomerSales(selectedYear), [db, selectedYear])

  const handleBack = () => router.push('/')

  const handleExportCSV = () => {
    db.exportToCSV(selectedYear)
  }

  // グラフ用のカラーパレット
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316']

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <header className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <BarChart3 className="text-blue-600" size={32} />
              <h1 className="text-2xl font-bold text-gray-800">売上管理システム</h1>
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

        {/* 年度選択・表示モード切替 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar size={20} className="text-gray-600" />
                <label className="text-sm font-medium text-gray-700">対象年度:</label>
                <select
                  value={selectedYear || 'all'}
                  onChange={(e) => setSelectedYear(e.target.value === 'all' ? undefined : Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">全年度</option>
                  {availableYears.map(year => (
                    <option key={year} value={year}>{year}年</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">表示:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('monthly')}
                  className={`px-3 py-1 rounded text-sm ${
                    viewMode === 'monthly'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  月別分析
                </button>
                <button
                  onClick={() => setViewMode('customer')}
                  className={`px-3 py-1 rounded text-sm ${
                    viewMode === 'customer'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  顧客別分析
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 統計情報カード */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">総売上</h3>
                <p className="text-2xl font-bold text-blue-600">¥{statistics.totalSales.toLocaleString()}</p>
              </div>
              <DollarSign className="text-blue-600" size={24} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">請求書数</h3>
                <p className="text-2xl font-bold text-green-600">{statistics.totalInvoices}件</p>
              </div>
              <BarChart3 className="text-green-600" size={24} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">平均単価</h3>
                <p className="text-2xl font-bold text-purple-600">¥{statistics.averageAmount.toLocaleString()}</p>
              </div>
              <TrendingUp className="text-purple-600" size={24} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">回収率</h3>
                <p className="text-2xl font-bold text-orange-600">
                  {statistics.totalSales > 0 ? Math.round((statistics.paidAmount / statistics.totalSales) * 100) : 0}%
                </p>
              </div>
              <Calendar className="text-orange-600" size={24} />
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* 月別売上グラフ */}
          {viewMode === 'monthly' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">月別売上推移</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlySales}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `¥${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`¥${value.toLocaleString()}`, '売上']}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Bar dataKey="amount" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* 顧客別売上グラフ */}
          {viewMode === 'customer' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">顧客別売上構成</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={customerSales.slice(0, 8)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ customer_name, percentage }) => 
                        percentage > 5 ? `${customer_name.slice(0, 10)}...` : ''
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="total_amount"
                    >
                      {customerSales.slice(0, 8).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`¥${value.toLocaleString()}`, '売上']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* 売上詳細情報 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">詳細情報</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                <span className="text-sm font-medium text-gray-700">支払済み金額</span>
                <span className="text-lg font-bold text-blue-600">¥{statistics.paidAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
                <span className="text-sm font-medium text-gray-700">未払い金額</span>
                <span className="text-lg font-bold text-orange-600">¥{statistics.unpaidAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                <span className="text-sm font-medium text-gray-700">主要顧客</span>
                <span className="text-sm font-bold text-green-600">{statistics.topCustomer}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                <span className="text-sm font-medium text-gray-700">最高売上月</span>
                <span className="text-sm font-bold text-purple-600">{statistics.topMonth}</span>
              </div>
            </div>
          </div>
        </div>

        {/* データテーブル */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">
              {viewMode === 'monthly' ? '月別売上一覧' : '顧客別売上一覧'}
            </h2>
          </div>
          
          {viewMode === 'monthly' ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    年月
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    売上金額
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    請求書数
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    平均単価
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {monthlySales.map((item) => (
                  <tr key={item.month} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      ¥{item.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {item.count}件
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      ¥{Math.round(item.amount / item.count).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    顧客名
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    売上金額
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    請求書数
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    構成比
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customerSales.map((customer) => (
                  <tr key={customer.customer_name} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {customer.customer_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      ¥{customer.total_amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {customer.invoice_count}件
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {customer.percentage.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
