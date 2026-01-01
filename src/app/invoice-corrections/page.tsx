'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Download, FileText, Filter, Calendar, RefreshCw } from 'lucide-react'
import { dbClient, escapeValue } from '@/lib/db-client'

// Supabase互換のためのエイリアス
const supabase = dbClient

interface CorrectionInvoice {
  invoice_id: string
  invoice_type: 'red' | 'black'
  original_invoice_id: string | null
  customer_name: string | null
  subject_name: string | null
  billing_date: string | null
  subtotal: number
  tax: number
  total: number
  created_at: string | null
  remarks: string | null
}

export default function InvoiceCorrectionsPage() {
  const router = useRouter()
  const [corrections, setCorrections] = useState<CorrectionInvoice[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })
  const [filterType, setFilterType] = useState<'all' | 'red' | 'black'>('all')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // 修正伝票を取得
  useEffect(() => {
    const fetchCorrections = async () => {
      setLoading(true)
      try {
        let query = supabase
          .from('invoices')
          .select('invoice_id, invoice_type, original_invoice_id, customer_name, subject_name, billing_date, subtotal, tax, total, created_at, remarks')
          .in('invoice_type', ['red', 'black'])
          .order('created_at', { ascending: false })

        // 月でフィルタ
        if (selectedMonth) {
          const [year, month] = selectedMonth.split('-')
          const startDate = `${year}-${month}-01`
          const endDate = new Date(parseInt(year), parseInt(month), 0).toISOString().split('T')[0]
          query = query.gte('billing_date', startDate).lte('billing_date', endDate)
        }

        // タイプでフィルタ
        if (filterType !== 'all') {
          query = query.eq('invoice_type', filterType)
        }

        const { data, error } = await query

        if (error) throw error
        setCorrections((data as CorrectionInvoice[]) || [])
      } catch (err) {
        console.error('Failed to fetch corrections:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCorrections()
  }, [selectedMonth, filterType])

  // 金額フォーマット
  const formatAmount = (amount: number) => {
    const formatted = Math.abs(amount).toLocaleString('ja-JP')
    return amount < 0 ? `-¥${formatted}` : `¥${formatted}`
  }

  // 日付フォーマット
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('ja-JP')
  }

  // 全選択/全解除
  const toggleSelectAll = () => {
    if (selectedIds.size === corrections.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(corrections.map(c => c.invoice_id)))
    }
  }

  // 個別選択
  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  // CSVダウンロード
  const downloadCSV = () => {
    const selectedCorrections = corrections.filter(c => selectedIds.has(c.invoice_id))
    if (selectedCorrections.length === 0) {
      alert('ダウンロードする伝票を選択してください')
      return
    }

    const headers = ['伝票番号', '種別', '元伝票', '顧客名', '件名', '請求日', '小計', '税額', '合計', '備考']
    const rows = selectedCorrections.map(c => [
      c.invoice_id,
      c.invoice_type === 'red' ? '赤伝' : '黒伝',
      c.original_invoice_id || '',
      c.customer_name || '',
      c.subject_name || '',
      c.billing_date || '',
      c.subtotal.toString(),
      c.tax.toString(),
      c.total.toString(),
      c.remarks || ''
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `修正伝票_${selectedMonth}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // 合計計算
  const totals = corrections.reduce((acc, c) => {
    if (c.invoice_type === 'red') {
      acc.redCount++
      acc.redTotal += c.total
    } else {
      acc.blackCount++
      acc.blackTotal += c.total
    }
    return acc
  }, { redCount: 0, redTotal: 0, blackCount: 0, blackTotal: 0 })

  return (
    <div className="container mx-auto py-8 px-4">
      {/* ヘッダー */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/invoice-list')}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">修正伝票一覧</h1>
            <p className="text-gray-600">赤伝・黒伝の管理・ダウンロード</p>
          </div>
        </div>
        <button
          onClick={downloadCSV}
          disabled={selectedIds.size === 0}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            selectedIds.size > 0
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Download className="w-4 h-4" />
          選択した伝票をダウンロード ({selectedIds.size}件)
        </button>
      </div>

      {/* フィルター */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border rounded-lg px-3 py-2"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'red' | 'black')}
              className="border rounded-lg px-3 py-2"
            >
              <option value="all">すべて</option>
              <option value="red">赤伝のみ</option>
              <option value="black">黒伝のみ</option>
            </select>
          </div>
          <button
            onClick={() => {
              setSelectedMonth(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`)
              setFilterType('all')
            }}
            className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <RefreshCw className="w-4 h-4" />
            リセット
          </button>
        </div>
      </div>

      {/* 集計 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="text-sm text-gray-500">総件数</div>
          <div className="text-2xl font-bold">{corrections.length}件</div>
        </div>
        <div className="bg-red-50 rounded-lg shadow-sm border border-red-200 p-4">
          <div className="text-sm text-red-600">赤伝</div>
          <div className="text-2xl font-bold text-red-600">{totals.redCount}件</div>
          <div className="text-sm text-red-500">{formatAmount(totals.redTotal)}</div>
        </div>
        <div className="bg-gray-50 rounded-lg shadow-sm border p-4">
          <div className="text-sm text-gray-600">黒伝</div>
          <div className="text-2xl font-bold text-gray-900">{totals.blackCount}件</div>
          <div className="text-sm text-gray-500">{formatAmount(totals.blackTotal)}</div>
        </div>
        <div className="bg-blue-50 rounded-lg shadow-sm border border-blue-200 p-4">
          <div className="text-sm text-blue-600">差額合計</div>
          <div className="text-2xl font-bold text-blue-600">
            {formatAmount(totals.redTotal + totals.blackTotal)}
          </div>
        </div>
      </div>

      {/* テーブル */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : corrections.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">修正伝票がありません</h3>
            <p className="mt-1 text-gray-500">選択した期間に修正伝票は発行されていません</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === corrections.length && corrections.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">伝票番号</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">種別</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">元伝票</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">顧客名</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">請求日</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">金額</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {corrections.map((correction) => (
                <tr
                  key={correction.invoice_id}
                  className={`hover:bg-gray-50 ${
                    correction.invoice_type === 'red' ? 'bg-red-50' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(correction.invoice_id)}
                      onChange={() => toggleSelect(correction.invoice_id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {correction.invoice_id}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      correction.invoice_type === 'red'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {correction.invoice_type === 'red' ? '赤伝' : '黒伝'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {correction.original_invoice_id || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {correction.customer_name || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {formatDate(correction.billing_date)}
                  </td>
                  <td className={`px-4 py-3 text-sm text-right font-medium ${
                    correction.total < 0 ? 'text-red-600' : 'text-gray-900'
                  }`}>
                    {formatAmount(correction.total)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => router.push(`/invoice-view/${correction.invoice_id}`)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      詳細
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
