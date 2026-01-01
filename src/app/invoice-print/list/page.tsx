'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { dbClient, escapeValue } from '@/lib/db-client'

// Supabase互換のためのエイリアス
const supabase = dbClient
import { Printer, ArrowLeft } from 'lucide-react'

interface InvoiceData {
  invoice_id: string
  issue_date: string
  customer_name: string
  subject_name: string
  total_amount: number
  payment_status: string
  total_paid: number
  remaining_amount: number
}

function ListPrintContent() {
  const searchParams = useSearchParams()
  const idsParam = searchParams?.get('ids') || null
  const monthParam = searchParams?.get('month') || ''
  const outputFormat = searchParams?.get('format') || 'print'

  const [invoices, setInvoices] = useState<InvoiceData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isPdfMode = outputFormat === 'pdf'

  // 月の表示形式
  const formatMonth = (month: string) => {
    if (!month) return ''
    const [year, m] = month.split('-')
    return `${year}年${parseInt(m)}月`
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!idsParam) {
        setError('請求書IDが指定されていません')
        setLoading(false)
        return
      }

      try {
        const ids = idsParam.split(',')

        // 各請求書のデータを取得
        const invoicePromises = ids.map(async (id) => {
          const { data: invoice, error: invoiceError } = await supabase
            .from('invoices')
            .select('*')
            .eq('invoice_id', id.trim())
            .single()

          if (invoiceError || !invoice) return null

          const inv = invoice as any
          return {
            invoice_id: inv.invoice_id,
            issue_date: inv.issue_date || inv.billing_date,
            customer_name: inv.customer_name || '',
            subject_name: inv.subject_name || inv.subject || '',
            total_amount: inv.total_amount || inv.total || 0,
            payment_status: inv.payment_status || 'unpaid',
            total_paid: inv.total_paid || 0,
            remaining_amount: inv.remaining_amount ?? (inv.total_amount || inv.total || 0)
          }
        })

        const results = await Promise.all(invoicePromises)
        const validInvoices = results.filter((inv): inv is InvoiceData => inv !== null)

        // 請求日でソート
        validInvoices.sort((a, b) => {
          if (!a.issue_date) return 1
          if (!b.issue_date) return -1
          return new Date(a.issue_date).getTime() - new Date(b.issue_date).getTime()
        })

        setInvoices(validInvoices)
        setLoading(false)
      } catch (err) {
        console.error('データ取得エラー:', err)
        setError('データの取得に失敗しました')
        setLoading(false)
      }
    }

    fetchData()
  }, [idsParam])

  const handlePrint = () => {
    window.print()
  }

  const handleClose = () => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      window.close()
    }
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
  }

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return '入金済'
      case 'partial': return '一部入金'
      default: return '未入金'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-50'
      case 'partial': return 'text-orange-600 bg-orange-50'
      default: return 'text-red-600 bg-red-50'
    }
  }

  // 集計
  const totals = {
    count: invoices.length,
    totalAmount: invoices.reduce((sum, inv) => sum + inv.total_amount, 0),
    paidAmount: invoices.reduce((sum, inv) => sum + inv.total_paid, 0),
    remainingAmount: invoices.reduce((sum, inv) => sum + inv.remaining_amount, 0),
    paidCount: invoices.filter(inv => inv.payment_status === 'paid').length,
    unpaidCount: invoices.filter(inv => inv.payment_status === 'unpaid').length,
    partialCount: invoices.filter(inv => inv.payment_status === 'partial').length
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>読み込み中...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={handleClose} className="px-4 py-2 bg-gray-600 text-white rounded-lg">
            閉じる
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 印刷時非表示のツールバー */}
      <div className="print:hidden bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              閉じる
            </button>
            <span className="text-gray-700">
              請求書一覧 {isPdfMode ? 'PDF出力' : '印刷'} （{invoices.length}件）
            </span>
            {isPdfMode && (
              <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">
                印刷ダイアログで「PDFとして保存」を選択
              </span>
            )}
          </div>
          <button
            onClick={handlePrint}
            className={`px-6 py-2 text-white rounded-lg flex items-center gap-2 ${
              isPdfMode
                ? 'bg-orange-600 hover:bg-orange-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <Printer size={18} />
            {isPdfMode ? 'PDF保存' : '印刷'}
          </button>
        </div>
      </div>

      {/* 印刷コンテンツ */}
      <div className="container mx-auto py-8 print:py-0">
        <div
          className="bg-white shadow-lg print:shadow-none mx-auto p-8"
          style={{ maxWidth: '210mm' }}
        >
          {/* ヘッダー */}
          <div className="text-center mb-6 print:mb-4">
            <h1 className="text-2xl font-bold mb-2">請求書一覧</h1>
            {monthParam && (
              <p className="text-lg text-gray-600">{formatMonth(monthParam)}</p>
            )}
            <p className="text-sm text-gray-500">
              出力日: {new Date().toLocaleDateString('ja-JP')}
            </p>
          </div>

          {/* サマリー */}
          <div className="grid grid-cols-4 gap-4 mb-6 print:mb-4">
            <div className="bg-blue-50 p-3 rounded text-center">
              <div className="text-xs text-gray-600">請求件数</div>
              <div className="text-xl font-bold text-blue-600">{totals.count}件</div>
            </div>
            <div className="bg-blue-50 p-3 rounded text-center">
              <div className="text-xs text-gray-600">請求金額合計</div>
              <div className="text-xl font-bold text-blue-600">¥{totals.totalAmount.toLocaleString()}</div>
            </div>
            <div className="bg-green-50 p-3 rounded text-center">
              <div className="text-xs text-gray-600">入金済み</div>
              <div className="text-xl font-bold text-green-600">¥{totals.paidAmount.toLocaleString()}</div>
              <div className="text-xs text-gray-500">{totals.paidCount}件</div>
            </div>
            <div className="bg-orange-50 p-3 rounded text-center">
              <div className="text-xs text-gray-600">未入金</div>
              <div className="text-xl font-bold text-orange-600">¥{totals.remainingAmount.toLocaleString()}</div>
              <div className="text-xs text-gray-500">{totals.unpaidCount + totals.partialCount}件</div>
            </div>
          </div>

          {/* テーブル */}
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-2 text-left">No.</th>
                <th className="border px-2 py-2 text-left">請求書ID</th>
                <th className="border px-2 py-2 text-left">請求日</th>
                <th className="border px-2 py-2 text-left">顧客名</th>
                <th className="border px-2 py-2 text-left">件名</th>
                <th className="border px-2 py-2 text-right">請求金額</th>
                <th className="border px-2 py-2 text-center">状態</th>
                <th className="border px-2 py-2 text-right">残額</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice, idx) => (
                <tr key={invoice.invoice_id} className="hover:bg-gray-50">
                  <td className="border px-2 py-1.5 text-gray-600">{idx + 1}</td>
                  <td className="border px-2 py-1.5 font-mono text-xs">{invoice.invoice_id}</td>
                  <td className="border px-2 py-1.5">{formatDate(invoice.issue_date)}</td>
                  <td className="border px-2 py-1.5 max-w-[150px] truncate">{invoice.customer_name}</td>
                  <td className="border px-2 py-1.5 max-w-[200px] truncate">{invoice.subject_name}</td>
                  <td className="border px-2 py-1.5 text-right font-medium">
                    ¥{invoice.total_amount.toLocaleString()}
                  </td>
                  <td className="border px-2 py-1.5 text-center">
                    <span className={`px-2 py-0.5 rounded text-xs ${getPaymentStatusColor(invoice.payment_status)}`}>
                      {getPaymentStatusLabel(invoice.payment_status)}
                    </span>
                  </td>
                  <td className="border px-2 py-1.5 text-right font-medium">
                    {invoice.remaining_amount > 0 ? (
                      <span className="text-orange-600">¥{invoice.remaining_amount.toLocaleString()}</span>
                    ) : (
                      <span className="text-green-600">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 font-bold">
                <td colSpan={5} className="border px-2 py-2 text-right">合計</td>
                <td className="border px-2 py-2 text-right">¥{totals.totalAmount.toLocaleString()}</td>
                <td className="border px-2 py-2"></td>
                <td className="border px-2 py-2 text-right text-orange-600">¥{totals.remainingAmount.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>

          {/* フッター */}
          <div className="mt-6 text-xs text-gray-500 text-center print:mt-4">
            <p>このレポートは {new Date().toLocaleString('ja-JP')} に生成されました</p>
          </div>
        </div>
      </div>

      {/* 印刷用スタイル */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 10mm;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  )
}

export default function ListPrintPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">読み込み中...</div>}>
      <ListPrintContent />
    </Suspense>
  )
}
