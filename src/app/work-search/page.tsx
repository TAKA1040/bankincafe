'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Search, Download, BarChart3, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/supabase'
import { CustomerCategoryDB, CustomerCategory } from '@/lib/customer-categories'

// 型定義
type InvoiceRow = Database['public']['Tables']['invoices']['Row']
type InvoiceLineItemRow = Database['public']['Tables']['invoice_line_items']['Row']

// 画面表示用の新しいデータ構造
interface SplitDetail {
  invoice_id: string
  line_no: number
  raw_label_part: string
  action: string | null
  target: string | null
  position: string | null
}

interface WorkSearchItem {
  // line_items から
  line_item_id: number;
  work_name: string;
  unit_price: number;
  quantity: number;
  
  // invoices から
  invoice_id: string;
  customer_name: string | null;
  subject: string | null;
  registration_number: string | null;
  issue_date: string | null;
  
  // 分割データから
  target: string | null;
  action: string | null;
  position: string | null;
  
  // 派生データ
  is_set: boolean;
  invoice_month: string | null;
  split_details?: SplitDetail[]; // 分割詳細情報
}

// 検索フィルターの型
interface SearchFilters {
  keyword: string
  customerCategory: string
  dateFrom: string
  dateTo: string
  target: string
}

// 統計情報の型
interface WorkStatistics {
  totalWorks: number
  totalAmount: number
  averagePrice: number
}

// 請求書詳細表示用の型
interface InvoiceDetail {
  invoice_id: string
  customer_name: string | null
  subject: string | null
  registration_number: string | null
  issue_date: string | null
  invoice_month: string | null
  work_items: {
    line_item_id: number
    line_no: number
    work_name: string
    unit_price: number
    quantity: number
    amount: number
    task_type: string
    split_details: SplitDetail[]
  }[]
  total_amount: number
  work_count: number
}

// 金額をフォーマットするヘルパー関数
const formatCurrency = (amount: number | null) => {
  if (amount === null || isNaN(amount)) {
    return '¥-'
  }
  return `¥${amount.toLocaleString()}`
}

export default function WorkSearchPage() {
  const router = useRouter()
  const [allItems, setAllItems] = useState<WorkSearchItem[]>([])
  const [filteredItems, setFilteredItems] = useState<WorkSearchItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [filters, setFilters] = useState<SearchFilters>({ keyword: '', customerCategory: '', dateFrom: '', dateTo: '', target: '' })
  const [sortBy, setSortBy] = useState<'issue_date' | 'unit_price' | 'customer_name' | 'work_name' | 'subject' | 'registration_number' | 'invoice_month'>('unit_price')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const [selectedItem, setSelectedItem] = useState<WorkSearchItem | null>(null)
  const [selectedInvoiceDetail, setSelectedInvoiceDetail] = useState<InvoiceDetail | null>(null)
  const [customerCategories, setCustomerCategories] = useState<CustomerCategory[]>([])

  // 顧客カテゴリー読み込み
  useEffect(() => {
    const categoryDB = new CustomerCategoryDB()
    setCustomerCategories(categoryDB.getCategories())
  }, [])

  // データ取得ロジック
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        // 1. 分割データと請求書データを取得
        
        // 2. 元の請求書項目と分割データを取得
        const [lineItemsRes, splitItemsRes, invoicesRes] = await Promise.all([
          supabase.from('invoice_line_items').select(`
            id,
            invoice_id,
            line_no,
            raw_label,
            unit_price,
            quantity,
            amount,
            task_type
          `), // 元の請求書項目（金額情報含む）
          supabase.from('invoice_line_items_split').select(`
            id,
            invoice_id,
            line_no,
            raw_label_part,
            action,
            target
          `), // 分割データ（詳細情報用）
          supabase.from('invoices').select(`
            invoice_id,
            customer_name,
            subject,
            subject_name,
            registration_number,
            issue_date
          `)
        ])

        
        if (lineItemsRes.error) {
          console.error('Line items error:', lineItemsRes.error)
          throw new Error(`請求書項目の取得に失敗しました: ${lineItemsRes.error.message}`)
        }
        if (splitItemsRes.error) {
          console.error('Split items error:', splitItemsRes.error)
          throw new Error(`分割作業項目の取得に失敗しました: ${splitItemsRes.error.message}`)
        }
        if (invoicesRes.error) {
          console.error('Invoices error:', invoicesRes.error)
          throw new Error(`請求情報の取得に失敗しました: ${invoicesRes.error.message}`)
        }

        const lineItems = lineItemsRes.data || []
        const splitItems = splitItemsRes.data || []
        const invoices = invoicesRes.data || []

        // 2. 請求書情報とマップを作成
        const invoiceMap = new Map(invoices.map(inv => [inv.invoice_id, inv]))
        
        // 3. 分割データをグループ化（invoice_id + line_no）
        const splitMap = new Map()
        splitItems.forEach(split => {
          const key = `${split.invoice_id}-${split.line_no}`
          if (!splitMap.has(key)) {
            splitMap.set(key, [])
          }
          splitMap.get(key).push(split)
        })

        // 4. 元の請求書項目をベースに画面表示用データを作成
        const workSearchItems: WorkSearchItem[] = lineItems.map(item => {
          const invoice = invoiceMap.get(item.invoice_id)
          const key = `${item.invoice_id}-${item.line_no}`
          const splitDetails = splitMap.get(key) || []
          
          // 請求月を生成（issue_dateから年月を取得）
          let invoice_month = null
          if (invoice?.issue_date) {
            const date = new Date(invoice.issue_date)
            const shortYear = date.getFullYear().toString().slice(-2)
            invoice_month = `${shortYear}年${(date.getMonth() + 1).toString().padStart(2, '0')}月`
          }

          // 分割データから詳細情報を取得（最初の分割項目から）
          const firstSplit = splitDetails[0] || {}
          
          return {
            line_item_id: item.id,
            work_name: item.raw_label || '名称不明',
            unit_price: item.unit_price || 0,
            quantity: item.quantity || 0,
            invoice_id: item.invoice_id,
            customer_name: invoice?.customer_name || null,
            subject: invoice?.subject || invoice?.subject_name || null,
            registration_number: invoice?.registration_number || null,
            issue_date: invoice?.issue_date || null,
            target: firstSplit.target || null,
            action: firstSplit.action || null,
            position: firstSplit.position || null,
            is_set: item.task_type === 'set' || false,
            invoice_month: invoice_month,
            split_details: splitDetails, // 分割詳細情報を保持
          }
        })

        setAllItems(workSearchItems)
        setFilteredItems(workSearchItems)

      } catch (e) {
        console.error(e)
        setError(e instanceof Error ? e.message : '不明なエラーが発生しました')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // 検索フィルター処理
  useEffect(() => {
    const lowerCaseKeyword = filters.keyword.toLowerCase()
    const result = allItems.filter(item => {
      // キーワード検索
      const matchesKeyword = (
        (item.work_name?.toLowerCase() || '').includes(lowerCaseKeyword) ||
        (item.customer_name?.toLowerCase() || '').includes(lowerCaseKeyword) ||
        (item.subject?.toLowerCase() || '').includes(lowerCaseKeyword) ||
        (item.registration_number?.toLowerCase() || '').includes(lowerCaseKeyword) ||
        (item.invoice_month?.toLowerCase() || '').includes(lowerCaseKeyword)
      )
      
      // 顧客カテゴリーフィルター
      const matchesCategory = filters.customerCategory === '' || 
        (() => {
          const category = customerCategories.find(cat => cat.id === filters.customerCategory)
          return category && item.customer_name === category.companyName
        })()
      
      // 日付範囲フィルター
      const matchesDateRange = (() => {
        if (!filters.dateFrom && !filters.dateTo) return true
        if (!item.issue_date) return false
        
        const itemDate = new Date(item.issue_date)
        const fromDate = filters.dateFrom ? new Date(filters.dateFrom) : new Date('1900-01-01')
        const toDate = filters.dateTo ? new Date(filters.dateTo) : new Date('2100-12-31')
        
        // 時刻部分をリセットして日付のみで比較
        itemDate.setHours(0, 0, 0, 0)
        fromDate.setHours(0, 0, 0, 0)
        toDate.setHours(23, 59, 59, 999)
        
        return itemDate >= fromDate && itemDate <= toDate
      })()
      
      // 対象フィルター
      const matchesTarget = filters.target === '' || 
        (item.target && item.target === filters.target)
      
      return matchesKeyword && matchesCategory && matchesDateRange && matchesTarget
    })
    setFilteredItems(result)
  }, [filters, allItems, customerCategories])

  // ソート処理
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      let comparison = 0
      const valA = a[sortBy]
      const valB = b[sortBy]

      if (valA === null || valB === null) {
        comparison = valA === valB ? 0 : valA === null ? 1 : -1;
      } else if (typeof valA === 'string' && typeof valB === 'string') {
        comparison = valA.localeCompare(valB)
      } else if (typeof valA === 'number' && typeof valB === 'number') {
        comparison = valA - valB
      }
      
      return sortOrder === 'asc' ? comparison : -comparison
    })
  }, [filteredItems, sortBy, sortOrder])

  // 対象の一覧を取得
  const uniqueTargets = useMemo(() => {
    const targets = allItems
      .map(item => item.target)
      .filter((target, index, arr) => target && arr.indexOf(target) === index)
      .sort()
    return targets
  }, [allItems])

  // 統計情報
  const statistics = useMemo(() => {
    if (filteredItems.length === 0) {
      return { totalWorks: 0, totalAmount: 0, averagePrice: 0 }
    }
    const totalWorks = filteredItems.length
    const totalAmount = filteredItems.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0)
    return {
      totalWorks: totalWorks,
      totalAmount: totalAmount,
      averagePrice: Math.round(totalAmount / totalWorks),
    }
  }, [filteredItems])

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }
  
  // 作業項目から請求書詳細を取得する関数
  const fetchInvoiceDetail = async (workItem: WorkSearchItem) => {
    try {
      // 同じ請求書IDのすべての作業項目を取得
      const { data: invoiceWorkItems, error } = await supabase
        .from('invoice_line_items')
        .select(`
          id,
          line_no,
          raw_label,
          unit_price,
          quantity,
          amount,
          task_type
        `)
        .eq('invoice_id', workItem.invoice_id)
        .order('line_no')
      
      if (error) throw error
      
      
      // 分割データも取得
      const { data: splitData, error: splitError } = await supabase
        .from('invoice_line_items_split')
        .select('*')
        .eq('invoice_id', workItem.invoice_id)
      
      if (splitError) throw splitError
      
      // 位置情報も取得（splitDataのidを使用）
      const splitIds = splitData?.map(split => split.id) || []
      let positionData: any[] = []
      if (splitIds.length > 0) {
        const { data: positions } = await supabase
          .from('work_item_positions')
          .select('*')
          .in('split_item_id', splitIds)
        positionData = positions || []
      }
      
      
      // 位置情報をsplit_item_idでマップ化
      const positionMap = new Map()
      positionData.forEach(pos => {
        if (!positionMap.has(pos.split_item_id)) {
          positionMap.set(pos.split_item_id, [])
        }
        positionMap.get(pos.split_item_id).push(pos.position)
      })
      
      // 分割データをグループ化（位置情報付き）
      const splitMap = new Map()
      splitData?.forEach(split => {
        const key = `${split.invoice_id}-${split.line_no}`
        if (!splitMap.has(key)) {
          splitMap.set(key, [])
        }
        // 位置情報を追加
        const splitWithPositions = {
          ...split,
          positions: positionMap.get(split.id) || []
        }
        splitMap.get(key).push(splitWithPositions)
      })
      
      // 請求書詳細データを構築
      const work_items = invoiceWorkItems?.map(item => {
        const key = `${workItem.invoice_id}-${item.line_no}`
        const split_details = splitMap.get(key) || []
        
        // 全ての分割データの金額を合計（cancelledも含めて）
        const totalSplitAmount = split_details.reduce((sum, split) => sum + (split.amount || 0), 0)
        const totalSplitQuantity = split_details.reduce((sum, split) => sum + (split.quantity || 0), 0)
        
        // 分割データがある場合はそれを使用、ない場合は元データを使用
        const amount = totalSplitAmount > 0 ? totalSplitAmount : (item.amount || (item.unit_price * item.quantity) || 0)
        const quantity = totalSplitQuantity > 0 ? totalSplitQuantity : (item.quantity || 0)
        
        // 単価は合計金額から逆算、または最初の有効な分割データから
        const firstValidSplit = split_details.find(split => (split.amount || 0) > 0) || split_details[0]
        const unit_price = firstValidSplit?.unit_price || (quantity > 0 ? Math.round(amount / quantity) : 0) || item.unit_price || 0
        
        
        return {
          line_item_id: item.id,
          line_no: item.line_no,
          work_name: item.raw_label || firstValidSplit?.raw_label_part || '名称不明',
          unit_price: unit_price,
          quantity: quantity,
          amount: amount,
          task_type: item.task_type || 'individual',
          split_details: split_details
        }
      }) || []
      
      const total_amount = work_items.reduce((sum, item) => sum + item.amount, 0)
      
      const invoiceDetail: InvoiceDetail = {
        invoice_id: workItem.invoice_id,
        customer_name: workItem.customer_name,
        subject: workItem.subject,
        registration_number: workItem.registration_number,
        issue_date: workItem.issue_date,
        invoice_month: workItem.invoice_month,
        work_items: work_items,
        total_amount: total_amount,
        work_count: work_items.length
      }
      
      
      setSelectedInvoiceDetail(invoiceDetail)
    } catch (error) {
      console.error('請求書詳細の取得エラー:', error)
    }
  }

  const handleExportCSV = () => {
    const headers = ['作業名', '単価', '数量', '顧客名', '件名', '請求月', '登録番号', '発行日', 'セット', '請求書ID']
    const rows = sortedItems.map(item => [
      `"${item.work_name.replace(/"/g, '""')}"`, 
      item.unit_price,
      item.quantity,
      `"${(item.customer_name || '').replace(/"/g, '""')}"`, 
      `"${(item.subject || '').replace(/"/g, '""')}"`, 
      `"${(item.invoice_month || '').replace(/"/g, '""')}"`, 
      `"${(item.registration_number || '').replace(/"/g, '""')}"`, 
      item.issue_date || '',
      item.is_set ? 'はい' : 'いいえ',
      item.invoice_id
    ].join(','))
    
    const csvContent = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `作業価格検索結果_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">読み込み中...</div>
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">エラー: {error}</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <header className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Search className="text-blue-600" size={32} />
              <h1 className="text-2xl font-bold text-gray-800">作業価格履歴検索</h1>
            </div>
            <div className="flex gap-2">
              <button onClick={handleExportCSV} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"><Download size={20} />CSV出力</button>
              <button onClick={() => router.push('/')} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"><ArrowLeft size={20} />戻る</button>
            </div>
          </div>
        </header>

        {/* 検索と統計 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex gap-8">
            <div className="flex-grow space-y-4">
              {/* キーワード検索 */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="作業名、顧客名、件名、登録番号、請求月で検索..."
                  value={filters.keyword}
                  onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* フィルター行 */}
              <div className="flex flex-wrap gap-4 items-center">
                {/* 顧客カテゴリーフィルター */}
                <div className="flex gap-2 items-center min-w-0">
                  <label className="text-sm font-medium text-gray-700 whitespace-nowrap">顧客名:</label>
                  <select
                    value={filters.customerCategory}
                    onChange={(e) => setFilters({ ...filters, customerCategory: e.target.value })}
                    className="w-32 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="">すべての顧客</option>
                    {customerCategories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                  {filters.customerCategory && (
                    <button
                      onClick={() => setFilters({ ...filters, customerCategory: '' })}
                      className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      クリア
                    </button>
                  )}
                </div>

                {/* 日付範囲フィルター */}
                <div className="flex gap-2 items-center min-w-0">
                  <label className="text-sm font-medium text-gray-700 whitespace-nowrap">期間:</label>
                  <div className="flex gap-1 items-center">
                    <input
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                      className="w-36 px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <span className="text-sm text-gray-500 px-1">〜</span>
                    <input
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                      className="w-36 px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  {(filters.dateFrom || filters.dateTo) && (
                    <button
                      onClick={() => setFilters({ ...filters, dateFrom: '', dateTo: '' })}
                      className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      クリア
                    </button>
                  )}
                </div>

                {/* 対象フィルター */}
                <div className="flex gap-2 items-center min-w-0">
                  <label className="text-sm font-medium text-gray-700 whitespace-nowrap">対象:</label>
                  <select
                    value={filters.target}
                    onChange={(e) => setFilters({ ...filters, target: e.target.value })}
                    className="w-32 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="">すべての対象</option>
                    {uniqueTargets.map((target) => (
                      <option key={target} value={target}>{target}</option>
                    ))}
                  </select>
                  {filters.target && (
                    <button
                      onClick={() => setFilters({ ...filters, target: '' })}
                      className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      クリア
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm text-gray-600">総作業数</div>
                <div className="text-xl font-bold text-blue-600">{statistics.totalWorks}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">平均単価</div>
                <div className="text-xl font-bold text-green-600">{formatCurrency(statistics.averagePrice)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">合計金額</div>
                <div className="text-xl font-bold text-orange-600">{formatCurrency(statistics.totalAmount)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 作業価格比較テーブル */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer" onClick={() => handleSort('subject')}>件名</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer whitespace-nowrap" onClick={() => handleSort('invoice_month')}>請求月</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer" onClick={() => handleSort('registration_number')}>登録番号</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer" onClick={() => handleSort('work_name')}>作業名</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer" onClick={() => handleSort('customer_name')}>対象</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">T/S</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 cursor-pointer" onClick={() => handleSort('unit_price')}>単価</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">詳細</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedItems.map((item) => (
                  <tr key={`${item.invoice_id}-${item.line_item_id}`} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-gray-700 max-w-xs">
                      <div className="truncate" title={item.subject}>{item.subject || '-'}</div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">{item.invoice_month || '-'}</td>
                    <td className="px-4 py-4 text-sm text-gray-600 font-mono">{item.registration_number || '-'}</td>
                    <td className="px-4 py-4 text-sm text-gray-900 max-w-xs">
                      <div className="truncate" title={item.work_name}>{item.work_name}</div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-800">{item.customer_name || '-'}</td>
                    <td className="px-4 py-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.is_set 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {item.is_set ? 'S' : 'T'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right text-sm font-semibold text-green-600">{formatCurrency(item.unit_price)}</td>
                    <td className="px-4 py-4 text-center">
                      <button onClick={() => fetchInvoiceDetail(item)} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">詳細</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {sortedItems.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                {filters.keyword ? '該当する作業履歴がありません' : 'データがありません'}
              </div>
            )}
          </div>
        </div>

        {/* 詳細モーダル - 請求書全体表示 */}
        {selectedInvoiceDetail && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
              <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">📋 請求書詳細</h2>
                <button onClick={() => setSelectedInvoiceDetail(null)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* 請求書情報セクション */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                    📄 請求書情報
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div><span className="font-medium text-gray-600">請求書ID:</span> <span className="text-blue-700 font-mono">{selectedInvoiceDetail.invoice_id}</span></div>
                    <div><span className="font-medium text-gray-600">請求月:</span> <span className="text-gray-800">{selectedInvoiceDetail.invoice_month || '-'}</span></div>
                    <div><span className="font-medium text-gray-600">発行日:</span> <span className="text-gray-800">{selectedInvoiceDetail.issue_date ? new Date(selectedInvoiceDetail.issue_date).toLocaleDateString('ja-JP') : '-'}</span></div>
                    <div><span className="font-medium text-gray-600">件名:</span> <span className="text-gray-800">{selectedInvoiceDetail.subject || '-'}</span></div>
                    <div><span className="font-medium text-gray-600">顧客名:</span> <span className="text-gray-800">{selectedInvoiceDetail.customer_name || '-'}</span></div>
                    <div><span className="font-medium text-gray-600">登録番号:</span> <span className="text-gray-800 font-mono">{selectedInvoiceDetail.registration_number || '-'}</span></div>
                  </div>
                </div>

                {/* 作業項目一覧セクション */}
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center">
                    🛠️ 作業項目一覧 ({selectedInvoiceDetail.work_count}件)
                  </h3>
                  <div className="space-y-3">
                    {selectedInvoiceDetail.work_items.map((workItem, index) => (
                      <div key={workItem.line_item_id} className="bg-white rounded p-4 border">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                              #{workItem.line_no}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              workItem.task_type === 'set' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {workItem.task_type === 'set' ? 'セット作業' : '個別作業'}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-green-600">{formatCurrency(workItem.amount || 0)}</div>
                            <div className="text-xs text-gray-500">
                              {formatCurrency(workItem.unit_price || 0)} × {workItem.quantity || 0}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center mb-2">
                          <div className="text-gray-900 font-medium">{workItem.work_name}</div>
                          <div className="text-lg font-semibold text-orange-600">
                            小計: {formatCurrency(workItem.amount || 0)}
                          </div>
                        </div>
                        
                        {/* 分割詳細がある場合は表示 */}
                        {workItem.split_details && workItem.split_details.length > 0 && (
                          <div className="mt-3 space-y-1">
                            <div className="text-xs font-medium text-gray-600 mb-1">詳細内訳:</div>
                            {workItem.split_details.map((detail, detailIndex) => (
                              <div key={detailIndex} className="bg-gray-50 rounded p-2 text-xs">
                                <div className="text-gray-800">{detail.raw_label_part}</div>
                                <div className="grid grid-cols-3 gap-2 mt-1 text-gray-600">
                                  <div>対象: {detail.target || '-'}</div>
                                  <div>動作: {detail.action || '-'}</div>
                                  <div>位置: {detail.position || '-'}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 金額サマリーセクション */}
                <div className="bg-red-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center">
                    💰 請求金額サマリー
                  </h3>
                  <div className="space-y-3">
                    {/* 各作業項目の小計 */}
                    <div className="space-y-1">
                      {selectedInvoiceDetail.work_items.map((workItem, index) => (
                        <div key={workItem.line_item_id} className="flex justify-between items-center text-sm">
                          <div className="text-gray-700">
                            #{workItem.line_no}: {workItem.work_name.substring(0, 30)}
                            {workItem.work_name.length > 30 ? '...' : ''}
                          </div>
                          <div className="font-medium text-gray-900">{formatCurrency(workItem.amount || 0)}</div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t-2 border-red-300 pt-4">
                      {selectedInvoiceDetail.total_amount > 0 ? (
                        <div className="flex justify-between items-center bg-red-100 rounded-lg p-4">
                          <div className="text-xl font-bold text-red-900">請求書合計</div>
                          <div className="text-3xl font-bold text-red-700">{formatCurrency(selectedInvoiceDetail.total_amount)}</div>
                        </div>
                      ) : (
                        <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="text-lg font-bold text-yellow-800">請求書合計</div>
                            <div className="text-2xl font-bold text-yellow-700">金額データ不備</div>
                          </div>
                          <div className="text-sm text-yellow-700 mt-2">
                            ※ この請求書の金額情報がデータベースに正しく登録されていない可能性があります。作業内容は上記の通りです。
                          </div>
                        </div>
                      )}
                      <div className="text-center text-sm text-gray-600 mt-2">
                        作業項目数: {selectedInvoiceDetail.work_count}件
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 border-t flex justify-end">
                <button 
                  onClick={() => setSelectedInvoiceDetail(null)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}