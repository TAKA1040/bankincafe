'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Search, Calendar, Filter, X, ChevronDown, ChevronUp } from 'lucide-react'
import { supabase } from '@/lib/supabase'

// ひらがな⇔カタカナ変換
function hiraganaToKatakana(str: string): string {
  return str.replace(/[\u3041-\u3096]/g, (match) =>
    String.fromCharCode(match.charCodeAt(0) + 0x60)
  )
}

function katakanaToHiragana(str: string): string {
  return str.replace(/[\u30a1-\u30f6]/g, (match) =>
    String.fromCharCode(match.charCodeAt(0) - 0x60)
  )
}

// 検索結果の型
interface SearchResult {
  id: number
  raw_label_part: string | null
  unit_price: number
  quantity: number
  subject: string | null
  customer_name: string | null
  issue_date: string | null
  invoice_id: string
  task_type: string | null
  line_no: number
}

// 請求書詳細の型
interface InvoiceDetail {
  invoice_id: string
  customer_name: string | null
  subject: string | null
  issue_date: string | null
  line_items: Array<{
    line_no: number
    sub_no: number
    raw_label: string | null
    raw_label_part: string | null
    unit_price: number | null
    quantity: number | null
    amount: number | null
    task_type: string | null
    set_name: string | null
    is_set_detail: boolean
  }>
}

export default function WorkHistoryPage() {
  const router = useRouter()

  // 検索条件
  const [workKeyword, setWorkKeyword] = useState('')
  const [subjectKeyword, setSubjectKeyword] = useState('')
  const [customerKeyword, setCustomerKeyword] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [taskTypeFilter, setTaskTypeFilter] = useState<'all' | 'S' | 'T'>('all')

  // 検索結果
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  // 並び替え
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'subject'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // 詳細表示
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  // 検索実行
  const handleSearch = async () => {
    // 何も入力されていない場合は検索しない
    if (!workKeyword.trim() && !subjectKeyword.trim() && !customerKeyword.trim() && !startDate && !endDate) {
      alert('検索条件を入力してください')
      return
    }

    setIsLoading(true)
    setHasSearched(true)
    setSelectedInvoice(null)

    try {
      let targetInvoiceIds: string[] | null = null

      // 件名・顧客名フィルターがある場合、先にinvoicesを検索
      if (subjectKeyword.trim() || customerKeyword.trim() || startDate || endDate) {
        let invoiceQuery = supabase.from('invoices').select('invoice_id')

        // 件名検索（あいまい検索）
        if (subjectKeyword.trim()) {
          const subjectHiragana = katakanaToHiragana(subjectKeyword.trim())
          const subjectKatakana = hiraganaToKatakana(subjectKeyword.trim())
          const subjectConditions = [`subject.ilike.%${subjectKeyword.trim()}%`]
          if (subjectHiragana !== subjectKeyword.trim()) {
            subjectConditions.push(`subject.ilike.%${subjectHiragana}%`)
          }
          if (subjectKatakana !== subjectKeyword.trim() && subjectKatakana !== subjectHiragana) {
            subjectConditions.push(`subject.ilike.%${subjectKatakana}%`)
          }
          invoiceQuery = invoiceQuery.or(subjectConditions.join(','))
        }

        // 顧客名検索（あいまい検索）
        if (customerKeyword.trim()) {
          const customerHiragana = katakanaToHiragana(customerKeyword.trim())
          const customerKatakana = hiraganaToKatakana(customerKeyword.trim())
          const customerConditions = [`customer_name.ilike.%${customerKeyword.trim()}%`]
          if (customerHiragana !== customerKeyword.trim()) {
            customerConditions.push(`customer_name.ilike.%${customerHiragana}%`)
          }
          if (customerKatakana !== customerKeyword.trim() && customerKatakana !== customerHiragana) {
            customerConditions.push(`customer_name.ilike.%${customerKatakana}%`)
          }
          invoiceQuery = invoiceQuery.or(customerConditions.join(','))
        }

        // 期間フィルター
        if (startDate) {
          invoiceQuery = invoiceQuery.gte('issue_date', startDate)
        }
        if (endDate) {
          invoiceQuery = invoiceQuery.lte('issue_date', endDate)
        }

        const { data: matchedInvoices, error: invoiceError } = await invoiceQuery.limit(1000)
        if (invoiceError) throw invoiceError

        targetInvoiceIds = matchedInvoices?.map(inv => inv.invoice_id) || []

        // マッチするものがなければ結果なし
        if (targetInvoiceIds.length === 0) {
          setSearchResults([])
          return
        }
      }

      // invoice_line_itemsを検索
      let query = supabase
        .from('invoice_line_items')
        .select(`
          id,
          raw_label,
          raw_label_part,
          unit_price,
          quantity,
          target,
          set_name,
          invoice_id,
          line_no,
          task_type
        `)

      // 作業名フィルター（raw_label_partのみ検索）
      if (workKeyword.trim()) {
        const keywordHiragana = katakanaToHiragana(workKeyword.trim())
        const keywordKatakana = hiraganaToKatakana(workKeyword.trim())
        const orConditions = [`raw_label_part.ilike.%${workKeyword.trim()}%`]
        if (keywordHiragana !== workKeyword.trim()) {
          orConditions.push(`raw_label_part.ilike.%${keywordHiragana}%`)
        }
        if (keywordKatakana !== workKeyword.trim() && keywordKatakana !== keywordHiragana) {
          orConditions.push(`raw_label_part.ilike.%${keywordKatakana}%`)
        }
        query = query.or(orConditions.join(','))
      }

      // 種別フィルター
      if (taskTypeFilter !== 'all') {
        query = query.eq('task_type', taskTypeFilter)
      }

      // 価格範囲フィルター
      if (minPrice) {
        query = query.gte('unit_price', parseInt(minPrice))
      }
      if (maxPrice) {
        query = query.lte('unit_price', parseInt(maxPrice))
      }

      // 請求書IDフィルター
      if (targetInvoiceIds) {
        query = query.in('invoice_id', targetInvoiceIds)
      }

      const { data, error } = await query
        .order('invoice_id', { ascending: false })
        .limit(500)

      if (error) throw error

      // 重複排除（同じinvoice_id + line_noは1つだけ）
      const uniqueMap = new Map<string, typeof data[0]>()
      for (const item of data || []) {
        const key = `${item.invoice_id}-${item.line_no}`
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, item)
        }
      }

      // 請求書情報を取得
      const invoiceIds = [...new Set(Array.from(uniqueMap.values()).map(item => item.invoice_id))]

      const { data: invoicesData } = await supabase
        .from('invoices')
        .select('invoice_id, customer_name, subject, issue_date')
        .in('invoice_id', invoiceIds)

      const invoiceMap = new Map(invoicesData?.map(inv => [inv.invoice_id, inv]) || [])

      const results = Array.from(uniqueMap.values()).map(item => {
        const invoice = invoiceMap.get(item.invoice_id)
        return {
          id: item.id,
          raw_label_part: item.raw_label_part || null,
          unit_price: item.unit_price || 0,
          quantity: item.quantity || 0,
          subject: invoice?.subject || null,
          customer_name: invoice?.customer_name || null,
          issue_date: invoice?.issue_date || null,
          invoice_id: item.invoice_id || '',
          task_type: item.task_type || null,
          line_no: item.line_no
        }
      })

      setSearchResults(results)
    } catch (error) {
      console.error('Search error:', error)
      alert('検索中にエラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  // 請求書詳細を取得
  const fetchInvoiceDetail = async (invoiceId: string) => {
    setDetailLoading(true)
    try {
      const [invoiceRes, lineItemsRes] = await Promise.all([
        supabase
          .from('invoices')
          .select('invoice_id, customer_name, subject, issue_date')
          .eq('invoice_id', invoiceId)
          .single(),
        supabase
          .from('invoice_line_items')
          .select('line_no, sub_no, raw_label, raw_label_part, unit_price, quantity, amount, task_type, set_name')
          .eq('invoice_id', invoiceId)
          .order('line_no', { ascending: true })
          .order('sub_no', { ascending: true })
      ])

      if (invoiceRes.error) throw invoiceRes.error

      // セット明細を識別（sub_no > 0 はセット明細）
      const lineItems = (lineItemsRes.data || []).map(item => ({
        ...item,
        is_set_detail: item.sub_no > 0
      }))

      setSelectedInvoice({
        invoice_id: invoiceRes.data.invoice_id,
        customer_name: invoiceRes.data.customer_name,
        subject: invoiceRes.data.subject,
        issue_date: invoiceRes.data.issue_date,
        line_items: lineItems
      })
    } catch (error) {
      console.error('Detail fetch error:', error)
      alert('詳細の取得に失敗しました')
    } finally {
      setDetailLoading(false)
    }
  }

  // 並び替え処理
  const sortedResults = useMemo(() => {
    const sorted = [...searchResults].sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.issue_date || '').getTime() - new Date(b.issue_date || '').getTime()
          break
        case 'price':
          comparison = a.unit_price - b.unit_price
          break
        case 'subject':
          comparison = (a.subject || '').localeCompare(b.subject || '')
          break
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })
    return sorted
  }, [searchResults, sortBy, sortOrder])

  // 並び替えボタン
  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  // 検索条件クリア
  const clearFilters = () => {
    setWorkKeyword('')
    setSubjectKeyword('')
    setCustomerKeyword('')
    setStartDate('')
    setEndDate('')
    setMinPrice('')
    setMaxPrice('')
    setTaskTypeFilter('all')
    setSearchResults([])
    setHasSearched(false)
    setSelectedInvoice(null)
  }

  const hasActiveFilters = workKeyword || subjectKeyword || customerKeyword || startDate || endDate || minPrice || maxPrice || taskTypeFilter !== 'all'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* ヘッダー */}
        <header className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Search className="text-blue-600" size={28} />
              <h1 className="text-xl font-bold text-gray-800">過去価格検索</h1>
            </div>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              戻る
            </button>
          </div>
        </header>

        {/* 検索条件 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* 作業名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">作業名</label>
              <input
                type="text"
                value={workKeyword}
                onChange={(e) => setWorkKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="例: フェンダー、バンパー"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {/* 件名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">件名</label>
              <input
                type="text"
                value={subjectKeyword}
                onChange={(e) => setSubjectKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="例: 平和物流"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {/* 顧客名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">顧客名</label>
              <input
                type="text"
                value={customerKeyword}
                onChange={(e) => setCustomerKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="例: UDトラックス"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* 期間（開始） */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">期間（開始）</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {/* 期間（終了） */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">期間（終了）</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {/* 価格（最小） */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">単価（最小）</label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="¥0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {/* 価格（最大） */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">単価（最大）</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="上限なし"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* 種別フィルター */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">種別:</span>
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="taskType"
                  checked={taskTypeFilter === 'all'}
                  onChange={() => setTaskTypeFilter('all')}
                  className="text-blue-600"
                />
                <span className="text-sm">すべて</span>
              </label>
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="taskType"
                  checked={taskTypeFilter === 'S'}
                  onChange={() => setTaskTypeFilter('S')}
                  className="text-blue-600"
                />
                <span className="text-sm">セット</span>
              </label>
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="taskType"
                  checked={taskTypeFilter === 'T'}
                  onChange={() => setTaskTypeFilter('T')}
                  className="text-blue-600"
                />
                <span className="text-sm">個別</span>
              </label>
            </div>

            {/* ボタン */}
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
                >
                  <X size={16} />
                  クリア
                </button>
              )}
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2"
              >
                <Search size={18} />
                {isLoading ? '検索中...' : '検索'}
              </button>
            </div>
          </div>
        </div>

        {/* 検索結果 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* 並び替え・件数 */}
          {searchResults.length > 0 && !selectedInvoice && (
            <div className="px-4 py-3 bg-gray-50 border-b flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">並び替え:</span>
                {[
                  { key: 'date', label: '日付' },
                  { key: 'price', label: '単価' },
                  { key: 'subject', label: '件名' }
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => handleSort(key as typeof sortBy)}
                    className={`px-3 py-1 rounded text-sm flex items-center gap-1 ${
                      sortBy === key
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {label}
                    {sortBy === key && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                  </button>
                ))}
              </div>
              <span className="text-sm text-gray-600">{searchResults.length}件の結果</span>
            </div>
          )}

          {/* 検索結果一覧 */}
          {!selectedInvoice && (
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                  検索中...
                </div>
              ) : !hasSearched ? (
                <div className="text-center py-12 text-gray-500">
                  <Search size={48} className="mx-auto mb-3 text-gray-300" />
                  検索条件を入力して検索してください
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  検索結果がありません
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">請求日</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">種別</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">顧客名</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">件名</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作業名</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">数量</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">単価</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">金額</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedResults.map((result, index) => (
                      <tr
                        key={`${result.invoice_id}-${index}`}
                        className="hover:bg-blue-50 cursor-pointer transition-colors"
                        onClick={() => fetchInvoiceDetail(result.invoice_id)}
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {result.issue_date ? new Date(result.issue_date).toLocaleDateString('ja-JP') : '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            result.task_type === 'S' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {result.task_type === 'S' ? 'セット' : '個別'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 max-w-[150px] truncate" title={result.customer_name || ''}>
                          {result.customer_name || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 max-w-[150px] truncate" title={result.subject || ''}>
                          {result.subject || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 max-w-[250px] truncate" title={result.raw_label_part || ''}>
                          {result.raw_label_part || '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                          {result.quantity}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                          ¥{result.unit_price.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                          ¥{(result.unit_price * result.quantity).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* 請求書詳細 */}
          {selectedInvoice && (
            <div className="p-6">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="mb-4 px-3 py-1.5 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg flex items-center gap-1"
              >
                ← 検索結果に戻る
              </button>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-bold text-gray-800 mb-3">請求書情報</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">請求書番号:</span>
                    <span className="ml-2 font-medium">{selectedInvoice.invoice_id}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">請求日:</span>
                    <span className="ml-2 font-medium">
                      {selectedInvoice.issue_date ? new Date(selectedInvoice.issue_date).toLocaleDateString('ja-JP') : '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">顧客名:</span>
                    <span className="ml-2 font-medium">{selectedInvoice.customer_name || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">件名:</span>
                    <span className="ml-2 font-medium">{selectedInvoice.subject || '-'}</span>
                  </div>
                </div>
              </div>

              <h4 className="font-medium text-gray-800 mb-2">明細一覧</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">種別</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作業名</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">数量</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">単価</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">金額</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedInvoice.line_items.map((item, index) => (
                      <tr
                        key={`${item.line_no}-${item.sub_no}`}
                        className={`${item.is_set_detail ? 'bg-gray-50' : ''}`}
                      >
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                          {item.is_set_detail ? '' : item.line_no}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm">
                          {item.is_set_detail ? (
                            <span className="text-xs text-gray-400 ml-2">└</span>
                          ) : (
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              item.task_type === 'S' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                            }`}>
                              {item.task_type === 'S' ? 'セット' : '個別'}
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-900">
                          {item.is_set_detail ? (
                            <span className="pl-4 text-gray-600">{item.raw_label_part || item.raw_label}</span>
                          ) : item.set_name ? (
                            <span className="font-medium">{item.set_name}</span>
                          ) : (
                            <span>{item.raw_label_part || item.raw_label}</span>
                          )}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                          {item.is_set_detail ? '' : item.quantity}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                          {item.is_set_detail ? '' : `¥${(item.unit_price || 0).toLocaleString()}`}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                          {item.is_set_detail ? '' : `¥${(item.amount || 0).toLocaleString()}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={5} className="px-3 py-2 text-sm font-medium text-gray-900 text-right">
                        合計
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                        ¥{selectedInvoice.line_items
                          .filter(item => !item.is_set_detail)
                          .reduce((sum, item) => sum + (item.amount || 0), 0)
                          .toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
