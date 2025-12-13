'use client'

import { useState, useMemo, useEffect, Fragment } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, BarChart3, Download, TrendingUp, Calendar, JapaneseYen, RefreshCw, Banknote, Home, HelpCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useSalesData } from '@/hooks/useSalesData'
import { supabase } from '@/lib/supabase'

const PaymentManagementTab = ({ invoices, summary, onUpdate, onPartialPayment, loading, categories, selectedCategory, onCategoryChange, router }: {
  invoices: any[],
  summary: any,
  onUpdate: (selectedIds: string[], paymentDate: string) => void,
  onPartialPayment: (invoiceId: string, paymentDate: string, amount: number) => void,
  loading: boolean,
  categories: any[],
  selectedCategory: string,
  onCategoryChange: (category: string) => void,
  router: any
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [partialAmounts, setPartialAmounts] = useState<Record<string, string>>({});
  const [partialDates, setPartialDates] = useState<Record<string, string>>({});
  const [showPartialInput, setShowPartialInput] = useState<string | null>(null);

  const normalizeName = (name: string | null): string => {
    if (!name) return '';
    return name
      .trim()
      .replace(/株式会社/g, '')
      .replace(/（株）/g, '')
      .replace(/\(株\)/g, '')
      .replace(/\s/g, '');
  };

  const handleUpdate = () => {
    if (selectedIds.length === 0 || !paymentDate) {
      alert('請求書を選択し、入金日を入力してください。');
      return;
    }
    onUpdate(selectedIds, paymentDate);
    setSelectedIds([]);
  };

  const handlePartialPayment = (invoiceId: string, remainingAmount: number) => {
    const amountStr = partialAmounts[invoiceId];
    const dateStr = partialDates[invoiceId] || new Date().toISOString().split('T')[0];
    if (!amountStr) {
      alert('入金額を入力してください。');
      return;
    }
    if (!dateStr) {
      alert('入金日を入力してください。');
      return;
    }
    const amount = parseInt(amountStr, 10);
    if (isNaN(amount) || amount <= 0) {
      alert('有効な入金額を入力してください。');
      return;
    }
    if (amount > remainingAmount) {
      alert(`入金額は残額（¥${remainingAmount.toLocaleString()}）以下にしてください。`);
      return;
    }
    onPartialPayment(invoiceId, dateStr, amount);
    setPartialAmounts(prev => ({ ...prev, [invoiceId]: '' }));
    setPartialDates(prev => ({ ...prev, [invoiceId]: '' }));
    setShowPartialInput(null);
  };

  // 未入金と一部入金を表示（完全入金済みは除く）
  const unpaidInvoices = invoices
    .filter(inv => inv.payment_status === 'unpaid' || inv.payment_status === 'partial')
    .filter(inv => {
        if (selectedCategory === 'all') return true;
        const category = categories.find(c => c.id === selectedCategory);
        if (!category) return false;

        const normalizedInvoiceCustomerName = normalizeName(inv.customer_name);
        if (!normalizedInvoiceCustomerName) return false;

        if (category.id === 'other') {
            const registeredCompanyNames = categories
                .filter(c => c.id !== 'other' && c.companyName)
                .map(c => normalizeName(c.companyName))
                .filter(Boolean);
            return !registeredCompanyNames.some(regName => normalizedInvoiceCustomerName.includes(regName));
        }
        
        const normalizedCategoryCompanyName = normalizeName(category.companyName);
        if (!normalizedCategoryCompanyName) return false;

        return normalizedInvoiceCustomerName.includes(normalizedCategoryCompanyName);
    });

  return (
    <div className="lg:col-span-2 space-y-6">
      {/* ... (サマリー表示は変更なし) ... */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600">未入金（件数/請求額）</h3>
              <p className="text-2xl font-bold text-orange-600">{summary.unpaid.count}件 / ¥{summary.unpaid.total.toLocaleString()}</p>
            </div>
            <Banknote className="text-orange-600" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600">入金済み（件数/請求額）</h3>
              <p className="text-2xl font-bold text-green-600">{summary.paid.count}件 / ¥{summary.paid.total.toLocaleString()}</p>
            </div>
            <Banknote className="text-green-600" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label htmlFor="categoryFilter" className="text-sm font-medium text-gray-700 mr-2">カテゴリー:</label>
            <select id="categoryFilter" value={selectedCategory} onChange={e => onCategoryChange(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="all">全カテゴリー</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1">
            <label htmlFor="paymentDate" className="text-sm font-medium text-gray-700">入金日:</label>
            <input type="date" id="paymentDate" value={paymentDate} onChange={e => setPaymentDate(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            <span className="cursor-help" title="チェックした請求書を一括で入金済みにする際の入金日です"><HelpCircle size={16} className="text-gray-400" /></span>
          </div>
          <button onClick={handleUpdate} disabled={loading || selectedIds.length === 0} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2" title="チェックした請求書を全額入金済みとして処理します">
            {loading ? '更新中...' : 'チェック分を入金済みにする'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th rowSpan={2} className="p-2 align-middle w-10">
                <input type="checkbox" onChange={e => {
                  if (e.target.checked) {
                    setSelectedIds(unpaidInvoices.map(i => i.invoice_id));
                  } else {
                    setSelectedIds([]);
                  }
                }} className="h-4 w-4" />
              </th>
              <th className="px-4 py-2 text-left font-bold text-gray-700">請求書ID</th>
              <th className="px-4 py-2 text-left font-bold text-gray-700">請求日</th>
              <th className="px-4 py-2 text-left font-bold text-gray-700">件名</th>
              <th className="px-4 py-2 text-left font-bold text-gray-700">発注番号</th>
              <th className="px-4 py-2 text-right font-bold text-gray-700">請求金額</th>
              <th className="px-4 py-2 text-center font-bold text-gray-700">詳細</th>
            </tr>
            <tr>
              <th className="px-4 py-2 text-left font-bold text-gray-700">請求月</th>
              <th className="px-4 py-2 text-left font-bold text-gray-700">入金日</th>
              <th className="px-4 py-2 text-left font-bold text-gray-700">登録番号</th>
              <th className="px-4 py-2 text-left font-bold text-gray-700">オーダー番号</th>
              <th className="px-4 py-2 text-right font-bold text-gray-700">残額</th>
              <th className="px-4 py-2 text-center font-bold text-gray-700">ステータス/操作</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {unpaidInvoices.map(invoice => (
              <Fragment key={invoice.invoice_id}>
                <tr className="hover:bg-gray-50">
                  <td rowSpan={2} className="p-2 align-middle w-10 border-b">
                    <input type="checkbox" checked={selectedIds.includes(invoice.invoice_id)} onChange={e => {
                      if (e.target.checked) {
                        setSelectedIds([...selectedIds, invoice.invoice_id]);
                      } else {
                        setSelectedIds(selectedIds.filter(id => id !== invoice.invoice_id));
                      }
                    }} aria-label={`入金対象: ${invoice.invoice_id}`} className="h-4 w-4" />
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900 border-l">{invoice.invoice_id}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-gray-900 border-l">{invoice.issue_date}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-gray-900 border-l">{invoice.subject_name || invoice.subject}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-gray-900 border-l">{invoice.order_number || 'N/A'}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-right text-gray-900 border-l">¥{invoice.total_amount.toLocaleString()}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-center border-l">
                    <button
                      onClick={() => router.push(`/invoice-view/${invoice.invoice_id}`)}
                      className="text-blue-600 hover:underline text-xs"
                    >
                      表示
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 border-b">
                  <td className="px-4 py-2 whitespace-nowrap text-gray-700 border-l">{invoice.issue_date ? new Date(invoice.issue_date).getMonth() + 1 : 'N/A'}月</td>
                  <td className="px-4 py-2 whitespace-nowrap text-gray-700 border-l">{invoice.payment_date || '-'}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-gray-700 border-l">{invoice.registration_number || 'N/A'}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-gray-700 border-l">{invoice.order_id || 'N/A'}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-right font-medium border-l">
                    <span className={invoice.payment_status === 'partial' ? 'text-orange-600' : 'text-gray-700'}>
                      ¥{(invoice.remaining_amount ?? invoice.total_amount).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-center border-l">
                    <div className="flex flex-col items-center gap-1">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        invoice.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                        invoice.payment_status === 'partial' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {invoice.payment_status === 'paid' ? '入金済' :
                         invoice.payment_status === 'partial' ? '一部入金' : '未入金'}
                      </span>
                      {showPartialInput === invoice.invoice_id ? (
                        <div className="flex flex-col gap-2 mt-2 p-2 bg-orange-50 rounded border border-orange-200">
                          <div className="flex items-center gap-2">
                            <label className="text-xs text-gray-600 w-14">入金額:</label>
                            <input
                              type="number"
                              value={partialAmounts[invoice.invoice_id] || ''}
                              onChange={e => setPartialAmounts(prev => ({ ...prev, [invoice.invoice_id]: e.target.value }))}
                              placeholder="¥"
                              className="w-24 px-2 py-1 text-xs border rounded"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="text-xs text-gray-600 w-14">入金日:</label>
                            <input
                              type="date"
                              value={partialDates[invoice.invoice_id] || new Date().toISOString().split('T')[0]}
                              onChange={e => setPartialDates(prev => ({ ...prev, [invoice.invoice_id]: e.target.value }))}
                              className="w-28 px-2 py-1 text-xs border rounded"
                            />
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <button
                              onClick={() => handlePartialPayment(invoice.invoice_id, invoice.remaining_amount ?? invoice.total_amount)}
                              disabled={loading}
                              className="px-3 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600 disabled:bg-gray-400"
                            >
                              入金を記録
                            </button>
                            <button
                              onClick={() => setShowPartialInput(null)}
                              className="px-2 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                            >
                              キャンセル
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowPartialInput(invoice.invoice_id)}
                          className="px-2 py-0.5 text-xs bg-orange-100 text-orange-700 rounded hover:bg-orange-200"
                        >
                          一部入金
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
        {unpaidInvoices.length === 0 && <p className="p-4 text-center text-gray-500">このカテゴリーに該当する未入金の請求書はありません。</p>}
      </div>
    </div>
  );
};



import { CustomerCategory, CustomerCategoryDB } from '@/lib/customer-categories'



export default function SalesManagementPage() {
  const router = useRouter()
  const {
    invoices,
    loading,
    error,
    getMonthlySales,
    getCustomerSales,
    getStatistics,
    getAvailableYears,
    exportToCSV,
    refetch,
    getPaymentStatusSummary,
    updateInvoicesPaymentStatus,
    recordPayment
  } = useSalesData()
  
  const [selectedYear, setSelectedYear] = useState<number | undefined>(new Date().getFullYear())
  const [viewMode, setViewMode] = useState<'monthly' | 'customer' | 'payment'>('monthly')
  const [categories, setCategories] = useState<CustomerCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    const db = new CustomerCategoryDB()
    setCategories(db.getCategories())
  }, [])

  const availableYears = useMemo(() => getAvailableYears(), [getAvailableYears])
  const statistics = useMemo(() => getStatistics(selectedYear), [getStatistics, selectedYear])
  const monthlySales = useMemo(() => getMonthlySales(selectedYear), [getMonthlySales, selectedYear])
  const customerSales = useMemo(() => getCustomerSales(selectedYear), [getCustomerSales, selectedYear])
  const paymentSummary = useMemo(() => getPaymentStatusSummary(selectedYear), [getPaymentStatusSummary, selectedYear]);

  const handleBack = () => router.push('/')

  const handleExportCSV = () => {
    exportToCSV(selectedYear)
  }

  // 一部入金処理
  const handlePartialPayment = async (invoiceId: string, paymentDate: string, amount: number) => {
    await recordPayment(invoiceId, {
      payment_date: paymentDate,
      payment_amount: amount,
      payment_method: '一部入金',
      notes: '売上管理画面からの一部入金'
    })
  }

  // グラフ用のカラーパレット
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316']

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
              <BarChart3 className="text-blue-600" size={28} />
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">売上管理システム</h1>
            </div>

            {/* PC用ボタン */}
            <div className="hidden md:flex gap-2">
              <button
                aria-label="CSV出力"
                onClick={handleExportCSV}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 font-medium"
              >
                <Download size={20} />
                CSV出力
              </button>
              <button
                aria-label="戻る"
                onClick={() => router.back()}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2 font-medium"
              >
                <ArrowLeft size={20} />
                戻る
              </button>
              <button
                aria-label="メニューへ"
                onClick={handleBack}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium"
              >
                <Home size={20} />
                メニューへ
              </button>
            </div>

            {/* スマホ用ボタン */}
            <div className="md:hidden flex flex-wrap gap-2 w-full">
              <button
                aria-label="CSV出力"
                onClick={handleExportCSV}
                className="flex-1 min-w-[120px] px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-1 text-sm font-medium"
              >
                <Download size={18} />
                CSV
              </button>
              <button
                aria-label="戻る"
                onClick={() => router.back()}
                className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-1 text-sm font-medium"
              >
                <ArrowLeft size={18} />
                戻る
              </button>
              <button
                aria-label="メニューへ"
                onClick={handleBack}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1 text-sm font-medium"
              >
                <Home size={18} />
                メニューへ
              </button>
            </div>
          </div>
        </header>

        {/* 年度選択・表示モード切替 */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
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
                <button
                  onClick={() => setViewMode('payment')}
                  className={`px-3 py-1 rounded text-sm ${
                    viewMode === 'payment'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  入金管理
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 統計情報カード */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">総売上</h3>
                <p className="text-2xl font-bold text-blue-600">¥{statistics.totalSales.toLocaleString()}</p>
              </div>
              <JapaneseYen className="text-blue-600" size={24} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">請求書数</h3>
                <p className="text-2xl font-bold text-green-600">{statistics.totalInvoices}件</p>
              </div>
              <BarChart3 className="text-green-600" size={24} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">平均単価</h3>
                <p className="text-2xl font-bold text-purple-600">¥{statistics.averageAmount.toLocaleString()}</p>
              </div>
              <TrendingUp className="text-purple-600" size={24} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
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
            <div className="bg-white rounded-lg shadow-sm p-4">
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
            <div className="bg-white rounded-lg shadow-sm p-4">
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

          {/* 入金管理タブ */}
          {viewMode === 'payment' && (
            <PaymentManagementTab
              invoices={invoices}
              summary={paymentSummary}
              onUpdate={updateInvoicesPaymentStatus}
              onPartialPayment={handlePartialPayment}
              loading={loading}
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              router={router}
            />
          )}

          {/* 売上詳細情報 */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold mb-4">詳細情報</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                <span className="text-sm font-medium text-gray-700">入金済み金額</span>
                <span className="text-lg font-bold text-blue-600">¥{statistics.paidAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
                <span className="text-sm font-medium text-gray-700">未入金金額</span>
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

        {/* データテーブル - デスクトップ用 */}
        {viewMode !== 'payment' && (
        <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b">
            <h2 className="text-lg font-semibold">
              {viewMode === 'monthly' ? '月別売上一覧' : '顧客別売上一覧'}
            </h2>
          </div>
          
          {viewMode === 'monthly' ? (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                    年月
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-sm font-bold text-gray-700">
                    売上金額
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-sm font-bold text-gray-700">
                    請求書数
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-sm font-bold text-gray-700">
                    平均単価
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {monthlySales.map((item) => (
                  <tr key={item.month} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.month}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      ¥{item.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {item.count}件
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      ¥{Math.round(item.amount / item.count).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                    顧客名
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-sm font-bold text-gray-700">
                    売上金額
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-sm font-bold text-gray-700">
                    請求書数
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-sm font-bold text-gray-700">
                    構成比
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customerSales.map((customer) => (
                  <tr key={customer.customer_name} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {customer.customer_name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      ¥{customer.total_amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {customer.invoice_count}件
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {customer.percentage.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        )}

        {/* データカード - モバイル用 */}
        {viewMode !== 'payment' && (
        <div className="md:hidden space-y-3 mt-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-base font-semibold">
              {viewMode === 'monthly' ? '月別売上一覧' : '顧客別売上一覧'}
            </h2>
          </div>
          {viewMode === 'monthly' ? (
            monthlySales.map((item) => (
              <div key={item.month} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">年月</span>
                  <span className="text-base font-bold text-gray-900">{item.month}</span>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">売上金額</span>
                  <span className="text-lg font-bold text-blue-600">¥{item.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700">
                  <span>請求書数</span>
                  <span>{item.count}件</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700">
                  <span>平均単価</span>
                  <span>¥{Math.round(item.amount / item.count).toLocaleString()}</span>
                </div>
              </div>
            ))
          ) : (
            customerSales.map((customer) => (
              <div key={customer.customer_name} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-base font-bold text-gray-900 break-words max-w-[70%]">{customer.customer_name}</span>
                  <span className="text-lg font-bold text-blue-600">¥{customer.total_amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700">
                  <span>請求書数</span>
                  <span>{customer.invoice_count}件</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700">
                  <span>構成比</span>
                  <span>{customer.percentage.toFixed(1)}%</span>
                </div>
              </div>
            ))
          )}
        </div>
        )}
      </div>
    </div>
  )
}
