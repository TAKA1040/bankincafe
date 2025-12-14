'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Printer, ArrowLeft } from 'lucide-react'

interface InvoiceData {
  invoice_id: string
  issue_date: string
  customer_name: string
  subject_name: string
  total_amount: number
  tax_amount: number
  subtotal: number
  registration_number: string
  purchase_order_number: string
  order_number: string
  notes: string
  line_items: any[]
}

interface CompanyInfo {
  company_name: string
  postal_code: string
  address: string
  phone: string
  fax: string
  bank_info: string
  invoice_number: string
}

function BatchPrintContent() {
  const searchParams = useSearchParams()
  const idsParam = searchParams?.get('ids') || null
  const docType = searchParams?.get('type') || 'copy'

  const [invoices, setInvoices] = useState<InvoiceData[]>([])
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 書類タイプのラベル
  const getDocTypeLabel = () => {
    switch (docType) {
      case 'invoice': return '請求書'
      case 'delivery': return '納品書'
      case 'copy': return '請求書（控）'
      case 'estimate': return '見積書'
      default: return '請求書（控）'
    }
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

        // 会社情報を取得
        const { data: companyData } = await (supabase as any)
          .from('company_settings')
          .select('*')
          .limit(1)
          .single()

        if (companyData) {
          setCompanyInfo({
            company_name: companyData.company_name || '',
            postal_code: companyData.postal_code || '',
            address: companyData.address || '',
            phone: companyData.phone || '',
            fax: companyData.fax || '',
            bank_info: companyData.bank_info || '',
            invoice_number: companyData.invoice_number || ''
          })
        }

        // 各請求書のデータを取得
        const invoicePromises = ids.map(async (id) => {
          const { data: invoice, error: invoiceError } = await supabase
            .from('invoices')
            .select('*')
            .eq('invoice_id', id.trim())
            .single()

          if (invoiceError || !invoice) return null

          const { data: lineItems } = await supabase
            .from('invoice_line_items')
            .select('*')
            .eq('invoice_id', id.trim())
            .order('line_number', { ascending: true })

          const inv = invoice as any
          return {
            invoice_id: inv.invoice_id,
            issue_date: inv.issue_date || inv.billing_date,
            customer_name: inv.customer_name,
            subject_name: inv.subject_name || inv.subject,
            total_amount: inv.total_amount || inv.total || 0,
            tax_amount: inv.tax_amount || inv.tax || 0,
            subtotal: inv.subtotal || (inv.total_amount || inv.total || 0) - (inv.tax_amount || inv.tax || 0),
            registration_number: inv.registration_number,
            purchase_order_number: inv.purchase_order_number,
            order_number: inv.order_number,
            notes: inv.notes || '',
            line_items: lineItems || []
          }
        })

        const results = await Promise.all(invoicePromises)
        setInvoices(results.filter((inv): inv is InvoiceData => inv !== null))
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

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
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
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg"
          >
            戻る
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
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              戻る
            </button>
            <span className="text-gray-700">
              {getDocTypeLabel()} 一括印刷 （{invoices.length}件）
            </span>
          </div>
          <button
            onClick={handlePrint}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Printer size={18} />
            印刷
          </button>
        </div>
      </div>

      {/* 請求書一覧 */}
      <div className="container mx-auto py-8 print:py-0">
        {invoices.map((invoice, index) => (
          <div
            key={invoice.invoice_id}
            className="bg-white shadow-lg mb-8 print:mb-0 print:shadow-none mx-auto"
            style={{
              width: '210mm',
              minHeight: '297mm',
              padding: '15mm',
              pageBreakAfter: index < invoices.length - 1 ? 'always' : 'auto'
            }}
          >
            {/* ヘッダー */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">{getDocTypeLabel()}</h1>
            </div>

            {/* 請求書情報 */}
            <div className="flex justify-between mb-6">
              <div className="flex-1">
                <div className="border-b-2 border-black pb-2 mb-4">
                  <p className="text-lg font-bold">{invoice.customer_name} 様</p>
                </div>
                <p className="text-sm">下記の通りご請求申し上げます。</p>
              </div>
              <div className="text-right text-sm">
                <p>請求書番号: {invoice.invoice_id}</p>
                <p>発行日: {formatDate(invoice.issue_date)}</p>
                {invoice.purchase_order_number && (
                  <p>発注番号: {invoice.purchase_order_number}</p>
                )}
                {invoice.order_number && (
                  <p>オーダー番号: {invoice.order_number}</p>
                )}
              </div>
            </div>

            {/* 件名・金額 */}
            <div className="mb-6">
              <div className="bg-gray-100 p-3 mb-4">
                <p className="text-sm text-gray-600">件名</p>
                <p className="font-bold">{invoice.subject_name}</p>
              </div>
              <div className="bg-blue-50 p-4 text-center">
                <p className="text-sm text-gray-600">ご請求金額（税込）</p>
                <p className="text-3xl font-bold text-blue-600">
                  ¥{invoice.total_amount.toLocaleString()}
                </p>
              </div>
            </div>

            {/* 明細 */}
            <div className="mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border px-2 py-1 text-left">No.</th>
                    <th className="border px-2 py-1 text-left">品名・作業内容</th>
                    <th className="border px-2 py-1 text-right">数量</th>
                    <th className="border px-2 py-1 text-right">単価</th>
                    <th className="border px-2 py-1 text-right">金額</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.line_items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="border px-2 py-1">{idx + 1}</td>
                      <td className="border px-2 py-1">{item.description || item.item_name}</td>
                      <td className="border px-2 py-1 text-right">{item.quantity}</td>
                      <td className="border px-2 py-1 text-right">¥{(item.unit_price || 0).toLocaleString()}</td>
                      <td className="border px-2 py-1 text-right">¥{(item.amount || item.line_total || 0).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 合計 */}
            <div className="flex justify-end mb-6">
              <div className="w-64">
                <div className="flex justify-between border-b py-1">
                  <span>小計</span>
                  <span>¥{invoice.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b py-1">
                  <span>消費税</span>
                  <span>¥{invoice.tax_amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 font-bold text-lg">
                  <span>合計</span>
                  <span>¥{invoice.total_amount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* 発行元情報 */}
            {companyInfo && (
              <div className="border-t pt-4 text-sm">
                <p className="font-bold">{companyInfo.company_name}</p>
                <p>〒{companyInfo.postal_code}</p>
                <p>{companyInfo.address}</p>
                <p>TEL: {companyInfo.phone} / FAX: {companyInfo.fax}</p>
                {companyInfo.invoice_number && (
                  <p>登録番号: {companyInfo.invoice_number}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 印刷用スタイル */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
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

export default function BatchPrintPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">読み込み中...</div>}>
      <BatchPrintContent />
    </Suspense>
  )
}
