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

interface CorrectionPair {
  original: InvoiceData | null
  revised: InvoiceData | null
}

function AdjustmentPrintContent() {
  const searchParams = useSearchParams()
  const pairsParam = searchParams?.get('pairs') || null
  const monthParam = searchParams?.get('month') || ''
  const outputFormat = searchParams?.get('format') || 'print'

  const [corrections, setCorrections] = useState<CorrectionPair[]>([])
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null)
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
      if (!pairsParam) {
        setError('伝票ペアが指定されていません')
        setLoading(false)
        return
      }

      try {
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

        // ペアをパース（例: "25120001-1,25120001-2|25120002-1,25120002-2"）
        const pairs = pairsParam.split('|').map(p => {
          const [originalId, revisedId] = p.split(',')
          return { originalId: originalId?.trim(), revisedId: revisedId?.trim() }
        })

        const correctionList: CorrectionPair[] = []

        for (const pair of pairs) {
          // 元の請求書を取得
          const { data: originalData } = await supabase
            .from('invoices')
            .select('*')
            .eq('invoice_id', pair.originalId)
            .single()

          const { data: originalItems } = await supabase
            .from('invoice_line_items')
            .select('*')
            .eq('invoice_id', pair.originalId)
            .order('line_no', { ascending: true })

          // 修正後の請求書を取得
          const { data: revisedData } = await supabase
            .from('invoices')
            .select('*')
            .eq('invoice_id', pair.revisedId)
            .single()

          const { data: revisedItems } = await supabase
            .from('invoice_line_items')
            .select('*')
            .eq('invoice_id', pair.revisedId)
            .order('line_no', { ascending: true })

          correctionList.push({
            original: originalData ? {
              invoice_id: (originalData as any).invoice_id,
              issue_date: (originalData as any).issue_date || (originalData as any).billing_date,
              customer_name: (originalData as any).customer_name || '',
              subject_name: (originalData as any).subject_name || (originalData as any).subject || '',
              total_amount: (originalData as any).total_amount || (originalData as any).total || 0,
              tax_amount: (originalData as any).tax_amount || (originalData as any).tax || 0,
              subtotal: (originalData as any).subtotal || 0,
              registration_number: (originalData as any).registration_number || '',
              line_items: originalItems || []
            } : null,
            revised: revisedData ? {
              invoice_id: (revisedData as any).invoice_id,
              issue_date: (revisedData as any).issue_date || (revisedData as any).billing_date,
              customer_name: (revisedData as any).customer_name || '',
              subject_name: (revisedData as any).subject_name || (revisedData as any).subject || '',
              total_amount: (revisedData as any).total_amount || (revisedData as any).total || 0,
              tax_amount: (revisedData as any).tax_amount || (revisedData as any).tax || 0,
              subtotal: (revisedData as any).subtotal || 0,
              registration_number: (revisedData as any).registration_number || '',
              line_items: revisedItems || []
            } : null
          })
        }

        setCorrections(correctionList)
        setLoading(false)
      } catch (err) {
        console.error('データ取得エラー:', err)
        setError('データの取得に失敗しました')
        setLoading(false)
      }
    }

    fetchData()
  }, [pairsParam])

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
              赤黒伝票 {isPdfMode ? 'PDF出力' : '印刷'} （{corrections.length}件 × 2枚）
            </span>
            {monthParam && (
              <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded">
                {formatMonth(monthParam)}分
              </span>
            )}
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

      {/* 伝票一覧 */}
      <div className="container mx-auto py-8 print:py-0">
        {corrections.map((correction, index) => (
          <div key={index}>
            {/* 赤伝票（元の金額をマイナス） */}
            {correction.original && (
              <div
                className="bg-white shadow-lg mb-8 print:mb-0 print:shadow-none mx-auto"
                style={{
                  width: '210mm',
                  minHeight: '297mm',
                  padding: '15mm',
                  pageBreakAfter: 'always'
                }}
              >
                {/* 赤伝ヘッダー */}
                <div className="text-center mb-6">
                  <div className="inline-block px-4 py-2 bg-red-100 border-2 border-red-500 rounded-lg mb-2">
                    <h1 className="text-2xl font-bold text-red-600">赤 伝 票</h1>
                  </div>
                  <p className="text-sm text-red-600">（取消伝票）</p>
                </div>

                {/* 請求書情報 */}
                <div className="flex justify-between mb-6">
                  <div className="flex-1">
                    <div className="border-b-2 border-black pb-2 mb-4">
                      <p className="text-lg font-bold">{correction.original.customer_name} 様</p>
                    </div>
                    <p className="text-sm">下記の金額を取り消しいたします。</p>
                  </div>
                  <div className="text-right text-sm">
                    <p>伝票番号: {correction.original.invoice_id}-R</p>
                    <p>発行日: {formatDate(new Date().toISOString())}</p>
                    <p className="text-red-600">元請求書: {correction.original.invoice_id}</p>
                  </div>
                </div>

                {/* 件名・金額 */}
                <div className="mb-6">
                  <div className="bg-gray-100 p-3 mb-4">
                    <p className="text-sm text-gray-600">件名</p>
                    <p className="font-bold">{correction.original.subject_name}</p>
                  </div>
                  <div className="bg-red-50 p-4 text-center border-2 border-red-300">
                    <p className="text-sm text-red-600">取消金額（税込）</p>
                    <p className="text-3xl font-bold text-red-600">
                      △ ¥{correction.original.total_amount.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* 明細 */}
                <div className="mb-6">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-red-100">
                        <th className="border px-2 py-1 text-left">No.</th>
                        <th className="border px-2 py-1 text-left">品名・作業内容</th>
                        <th className="border px-2 py-1 text-right">数量</th>
                        <th className="border px-2 py-1 text-right">単価</th>
                        <th className="border px-2 py-1 text-right">金額</th>
                      </tr>
                    </thead>
                    <tbody>
                      {correction.original.line_items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="border px-2 py-1">{idx + 1}</td>
                          <td className="border px-2 py-1">{item.description || item.raw_label || item.item_name}</td>
                          <td className="border px-2 py-1 text-right">{item.quantity}</td>
                          <td className="border px-2 py-1 text-right text-red-600">△ ¥{Math.abs(item.unit_price || 0).toLocaleString()}</td>
                          <td className="border px-2 py-1 text-right text-red-600">△ ¥{Math.abs(item.amount || item.line_total || 0).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 合計 */}
                <div className="flex justify-end mb-6">
                  <div className="w-64">
                    <div className="flex justify-between border-b py-1 text-red-600">
                      <span>小計</span>
                      <span>△ ¥{correction.original.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-b py-1 text-red-600">
                      <span>消費税</span>
                      <span>△ ¥{correction.original.tax_amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 font-bold text-lg text-red-600">
                      <span>取消合計</span>
                      <span>△ ¥{correction.original.total_amount.toLocaleString()}</span>
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
            )}

            {/* 黒伝票（修正後の金額） */}
            {correction.revised && (
              <div
                className="bg-white shadow-lg mb-8 print:mb-0 print:shadow-none mx-auto"
                style={{
                  width: '210mm',
                  minHeight: '297mm',
                  padding: '15mm',
                  pageBreakAfter: index < corrections.length - 1 ? 'always' : 'auto'
                }}
              >
                {/* 黒伝ヘッダー */}
                <div className="text-center mb-6">
                  <div className="inline-block px-4 py-2 bg-blue-100 border-2 border-blue-500 rounded-lg mb-2">
                    <h1 className="text-2xl font-bold text-blue-600">黒 伝 票</h1>
                  </div>
                  <p className="text-sm text-blue-600">（訂正伝票）</p>
                </div>

                {/* 請求書情報 */}
                <div className="flex justify-between mb-6">
                  <div className="flex-1">
                    <div className="border-b-2 border-black pb-2 mb-4">
                      <p className="text-lg font-bold">{correction.revised.customer_name} 様</p>
                    </div>
                    <p className="text-sm">下記の通りご請求申し上げます。</p>
                  </div>
                  <div className="text-right text-sm">
                    <p>伝票番号: {correction.revised.invoice_id}</p>
                    <p>発行日: {formatDate(new Date().toISOString())}</p>
                    {correction.original && (
                      <p className="text-blue-600">元請求書: {correction.original.invoice_id}</p>
                    )}
                  </div>
                </div>

                {/* 件名・金額 */}
                <div className="mb-6">
                  <div className="bg-gray-100 p-3 mb-4">
                    <p className="text-sm text-gray-600">件名</p>
                    <p className="font-bold">{correction.revised.subject_name}</p>
                  </div>
                  <div className="bg-blue-50 p-4 text-center border-2 border-blue-300">
                    <p className="text-sm text-blue-600">ご請求金額（税込）</p>
                    <p className="text-3xl font-bold text-blue-600">
                      ¥{correction.revised.total_amount.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* 明細 */}
                <div className="mb-6">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-blue-100">
                        <th className="border px-2 py-1 text-left">No.</th>
                        <th className="border px-2 py-1 text-left">品名・作業内容</th>
                        <th className="border px-2 py-1 text-right">数量</th>
                        <th className="border px-2 py-1 text-right">単価</th>
                        <th className="border px-2 py-1 text-right">金額</th>
                      </tr>
                    </thead>
                    <tbody>
                      {correction.revised.line_items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="border px-2 py-1">{idx + 1}</td>
                          <td className="border px-2 py-1">{item.description || item.raw_label || item.item_name}</td>
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
                      <span>¥{correction.revised.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-b py-1">
                      <span>消費税</span>
                      <span>¥{correction.revised.tax_amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 font-bold text-lg text-blue-600">
                      <span>合計</span>
                      <span>¥{correction.revised.total_amount.toLocaleString()}</span>
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

export default function AdjustmentPrintPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">読み込み中...</div>}>
      <AdjustmentPrintContent />
    </Suspense>
  )
}
