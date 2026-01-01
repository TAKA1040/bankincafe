'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { dbClient, escapeValue } from '@/lib/db-client'

// Supabase互換のためのエイリアス
const supabase = dbClient
import JSZip from 'jszip'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { Loader2, Download, CheckCircle, XCircle } from 'lucide-react'

interface InvoiceData {
  invoice_id: string
  issue_date: string
  customer_name: string
  customer_category: string
  subject_name: string
  registration_number: string
  total_amount: number
  tax_amount: number
  subtotal: number
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

interface ExportStatus {
  id: string
  status: 'pending' | 'processing' | 'done' | 'error'
  filename: string
}

// 書類タイプの日本語名
const DOC_TYPE_NAMES: Record<string, string> = {
  invoice: '請求書',
  delivery: '納品書',
  copy: '請求書控',
  estimate: '見積書'
}

function ZipExportContent() {
  const searchParams = useSearchParams()
  const idsParam = searchParams?.get('ids') || null
  const docType = searchParams?.get('type') || 'copy'
  const monthParam = searchParams?.get('month') || ''

  const [invoices, setInvoices] = useState<InvoiceData[]>([])
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [exportStatuses, setExportStatuses] = useState<ExportStatus[]>([])
  const [error, setError] = useState<string | null>(null)
  const [currentInvoice, setCurrentInvoice] = useState<InvoiceData | null>(null)

  const renderRef = useRef<HTMLDivElement>(null)

  const docTypeName = DOC_TYPE_NAMES[docType] || '請求書控'

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

        const ids = idsParam.split(',')

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
            .order('line_no', { ascending: true })

          const inv = invoice as any
          return {
            invoice_id: inv.invoice_id,
            issue_date: inv.issue_date || inv.billing_date,
            customer_name: inv.customer_name || '',
            customer_category: inv.customer_category || '',
            subject_name: inv.subject_name || inv.subject || '',
            registration_number: inv.registration_number || '',
            total_amount: inv.total_amount || inv.total || 0,
            tax_amount: inv.tax_amount || inv.tax || 0,
            subtotal: inv.subtotal || 0,
            line_items: lineItems || []
          }
        })

        const results = await Promise.all(invoicePromises)
        const validInvoices = results.filter((inv): inv is InvoiceData => inv !== null)

        setInvoices(validInvoices)

        // 初期ステータスを設定
        const statuses = validInvoices.map(inv => ({
          id: inv.invoice_id,
          status: 'pending' as const,
          filename: generateFilename(inv, docType)
        }))
        setExportStatuses(statuses)

        setLoading(false)
      } catch (err) {
        console.error('データ取得エラー:', err)
        setError('データの取得に失敗しました')
        setLoading(false)
      }
    }

    fetchData()
  }, [idsParam, docType])

  // ファイル名を生成
  const generateFilename = (invoice: InvoiceData, type: string): string => {
    const category = invoice.customer_category === 'UD' ? 'UD' : ''
    const docName = DOC_TYPE_NAMES[type] || '請求書控'
    const customerName = invoice.customer_name || '不明'
    const regNum = invoice.registration_number
      ? `（${invoice.registration_number}）`
      : ''

    return `${category}${invoice.invoice_id}${docName}_${customerName}${regNum}.pdf`
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
  }

  // PDFを生成
  const generatePDF = async (invoice: InvoiceData): Promise<Blob> => {
    setCurrentInvoice(invoice)

    // レンダリングを待つ
    await new Promise(resolve => setTimeout(resolve, 500))

    if (!renderRef.current) {
      throw new Error('レンダリング要素が見つかりません')
    }

    // html2canvasでキャプチャ
    const canvas = await html2canvas(renderRef.current, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    })

    // jsPDFでPDF生成（A4サイズ）
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    const imgWidth = 210 // A4幅
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    pdf.addImage(
      canvas.toDataURL('image/png'),
      'PNG',
      0,
      0,
      imgWidth,
      Math.min(imgHeight, 297) // A4高さに制限
    )

    return pdf.output('blob')
  }

  // ZIP出力を実行
  const handleExport = async () => {
    setExporting(true)
    const zip = new JSZip()

    for (let i = 0; i < invoices.length; i++) {
      const invoice = invoices[i]

      // ステータスを更新
      setExportStatuses(prev =>
        prev.map(s =>
          s.id === invoice.invoice_id ? { ...s, status: 'processing' } : s
        )
      )

      try {
        const pdfBlob = await generatePDF(invoice)
        const filename = generateFilename(invoice, docType)
        zip.file(filename, pdfBlob)

        // 成功
        setExportStatuses(prev =>
          prev.map(s =>
            s.id === invoice.invoice_id ? { ...s, status: 'done' } : s
          )
        )
      } catch (err) {
        console.error(`PDF生成エラー (${invoice.invoice_id}):`, err)
        setExportStatuses(prev =>
          prev.map(s =>
            s.id === invoice.invoice_id ? { ...s, status: 'error' } : s
          )
        )
      }
    }

    // ZIPを生成してダウンロード
    try {
      const zipBlob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(zipBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${docTypeName}_${monthParam || new Date().toISOString().split('T')[0]}.zip`
      link.click()
      setTimeout(() => URL.revokeObjectURL(url), 100)
    } catch (err) {
      console.error('ZIP生成エラー:', err)
      alert('ZIPファイルの生成に失敗しました')
    }

    setExporting(false)
    setCurrentInvoice(null)
  }

  const handleClose = () => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      window.close()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4" size={48} />
          <p>データを読み込み中...</p>
        </div>
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

  const doneCount = exportStatuses.filter(s => s.status === 'done').length
  const errorCount = exportStatuses.filter(s => s.status === 'error').length

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ツールバー */}
      <div className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-gray-800">
                {docTypeName} ZIP出力
              </h1>
              {monthParam && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded">
                  {formatMonth(monthParam)}
                </span>
              )}
              <span className="text-gray-600">
                {invoices.length}件
              </span>
            </div>
            <div className="flex items-center gap-4">
              {exporting ? (
                <div className="flex items-center gap-2 text-blue-600">
                  <Loader2 className="animate-spin" size={20} />
                  <span>出力中... ({doneCount}/{invoices.length})</span>
                </div>
              ) : doneCount > 0 ? (
                <span className="text-green-600 flex items-center gap-1">
                  <CheckCircle size={20} />
                  完了 ({doneCount}件)
                  {errorCount > 0 && (
                    <span className="text-red-600 ml-2">エラー: {errorCount}件</span>
                  )}
                </span>
              ) : null}
              <button
                onClick={handleExport}
                disabled={exporting || invoices.length === 0}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center gap-2"
              >
                <Download size={20} />
                ZIPダウンロード
              </button>
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ファイル一覧 */}
      <div className="container mx-auto py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-bold mb-4">出力ファイル一覧</h2>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">状態</th>
                <th className="px-4 py-2 text-left">ファイル名</th>
                <th className="px-4 py-2 text-left">顧客名</th>
                <th className="px-4 py-2 text-right">金額</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {exportStatuses.map((status, idx) => {
                const invoice = invoices.find(inv => inv.invoice_id === status.id)
                return (
                  <tr key={status.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">
                      {status.status === 'pending' && (
                        <span className="text-gray-400">待機中</span>
                      )}
                      {status.status === 'processing' && (
                        <span className="text-blue-600 flex items-center gap-1">
                          <Loader2 className="animate-spin" size={16} />
                          処理中
                        </span>
                      )}
                      {status.status === 'done' && (
                        <span className="text-green-600 flex items-center gap-1">
                          <CheckCircle size={16} />
                          完了
                        </span>
                      )}
                      {status.status === 'error' && (
                        <span className="text-red-600 flex items-center gap-1">
                          <XCircle size={16} />
                          エラー
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 font-mono text-xs">{status.filename}</td>
                    <td className="px-4 py-2">{invoice?.customer_name}</td>
                    <td className="px-4 py-2 text-right">¥{invoice?.total_amount.toLocaleString()}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 非表示のレンダリング領域 */}
      <div className="fixed left-[-9999px] top-0">
        <div
          ref={renderRef}
          style={{
            width: '210mm',
            minHeight: '297mm',
            padding: '15mm',
            backgroundColor: 'white',
            fontFamily: 'sans-serif'
          }}
        >
          {currentInvoice && (
            <>
              {/* ヘッダー */}
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>{docTypeName}</h1>
              </div>

              {/* 請求書情報 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ borderBottom: '2px solid black', paddingBottom: '8px', marginBottom: '16px' }}>
                    <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
                      {currentInvoice.customer_name} 様
                    </p>
                  </div>
                  <p style={{ fontSize: '14px' }}>下記の通りご請求申し上げます。</p>
                </div>
                <div style={{ textAlign: 'right', fontSize: '14px' }}>
                  <p>請求書番号: {currentInvoice.invoice_id}</p>
                  <p>発行日: {formatDate(currentInvoice.issue_date)}</p>
                  {currentInvoice.registration_number && (
                    <p>登録番号: {currentInvoice.registration_number}</p>
                  )}
                </div>
              </div>

              {/* 件名・金額 */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ background: '#f3f4f6', padding: '12px', marginBottom: '16px' }}>
                  <p style={{ fontSize: '12px', color: '#6b7280' }}>件名</p>
                  <p style={{ fontWeight: 'bold' }}>{currentInvoice.subject_name}</p>
                </div>
                <div style={{ background: '#eff6ff', padding: '16px', textAlign: 'center' }}>
                  <p style={{ fontSize: '12px', color: '#6b7280' }}>ご請求金額（税込）</p>
                  <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#2563eb' }}>
                    ¥{currentInvoice.total_amount.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* 明細 */}
              <div style={{ marginBottom: '24px' }}>
                <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#e5e7eb' }}>
                      <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'left' }}>No.</th>
                      <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'left' }}>品名・作業内容</th>
                      <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>数量</th>
                      <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>単価</th>
                      <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>金額</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentInvoice.line_items.map((item, idx) => (
                      <tr key={idx}>
                        <td style={{ border: '1px solid #d1d5db', padding: '8px' }}>{idx + 1}</td>
                        <td style={{ border: '1px solid #d1d5db', padding: '8px' }}>
                          {item.description || item.raw_label || item.item_name}
                        </td>
                        <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
                          {item.quantity}
                        </td>
                        <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
                          ¥{(item.unit_price || 0).toLocaleString()}
                        </td>
                        <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
                          ¥{(item.amount || item.line_total || 0).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 合計 */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
                <div style={{ width: '256px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #d1d5db', padding: '8px 0' }}>
                    <span>小計</span>
                    <span>¥{currentInvoice.subtotal.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #d1d5db', padding: '8px 0' }}>
                    <span>消費税</span>
                    <span>¥{currentInvoice.tax_amount.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontWeight: 'bold', fontSize: '18px' }}>
                    <span>合計</span>
                    <span>¥{currentInvoice.total_amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* 発行元情報 */}
              {companyInfo && (
                <div style={{ borderTop: '1px solid #d1d5db', paddingTop: '16px', fontSize: '14px' }}>
                  <p style={{ fontWeight: 'bold' }}>{companyInfo.company_name}</p>
                  <p>〒{companyInfo.postal_code}</p>
                  <p>{companyInfo.address}</p>
                  <p>TEL: {companyInfo.phone} / FAX: {companyInfo.fax}</p>
                  {companyInfo.invoice_number && (
                    <p>登録番号: {companyInfo.invoice_number}</p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ZipExportPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">読み込み中...</div>}>
      <ZipExportContent />
    </Suspense>
  )
}
