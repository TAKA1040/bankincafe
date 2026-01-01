'use client'

import { useState, useEffect, useCallback } from 'react'
import { dbClient, escapeValue } from '@/lib/db-client'

export interface SplitItem {
  id: number
  invoice_id: string
  line_no: number
  sub_no: number
  raw_label_part: string
  action: string | null
  target: string | null
  position: string | null
  unit_price: number
  quantity: number
  amount: number
  is_cancelled: boolean
}

export interface InvoiceWithItems {
  invoice_id: string
  invoice_number: string | null
  issue_date: string | null
  billing_date: string | null
  billing_month: string | null
  customer_category: 'UD' | 'その他'
  customer_name: string | null
  subject_name: string | null
  subject: string | null
  registration_number: string | null
  order_number: string | null
  purchase_order_number: string | null
  subtotal: number
  tax: number
  total: number
  status: 'draft' | 'finalized' | 'sent' | 'paid'
  payment_status: 'unpaid' | 'paid' | 'partial'
  created_at: string | null
  updated_at: string | null
  remarks: string | null
  closed_at?: string | null
  invoice_type?: 'standard' | 'red' | 'black'
  original_invoice_id?: string | null
  line_items: {
    id: number
    line_no: number
    sub_no?: number
    task_type: string
    target: string | null
    action: string | null
    position: string | null
    quantity: number | null
    unit_price: number | null
    amount: number | null
    raw_label: string | null
    raw_label_part?: string | null
    set_name?: string | null
    performed_at: string | null
    split_items?: SplitItem[]
  }[]
  total_quantity: number
  work_names: string
}

export interface SearchFilters {
  keyword: string
  status: string
  payment_status: string
  year: string
  month: string
  startDate: string
  endDate: string
}

// 文字正規化関数（ひらがな/カタカナ、大文字小文字、全角半角を統一）
const normalizeSearchText = (text: string): string => {
  if (!text) return ''

  return text
    // 全角英数字を半角に変換
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (char) => {
      return String.fromCharCode(char.charCodeAt(0) - 0xFEE0)
    })
    // 全角スペースを半角に変換
    .replace(/　/g, ' ')
    // カタカナをひらがなに変換
    .replace(/[\u30A1-\u30F6]/g, (char) => {
      return String.fromCharCode(char.charCodeAt(0) - 0x60)
    })
    // 小文字に統一
    .toLowerCase()
    // 連続する空白を単一にし、前後の空白を削除
    .replace(/\s+/g, ' ')
    .trim()
}

export function useInvoiceList(yearFilter?: string | string[]) {
  const [invoices, setInvoices] = useState<InvoiceWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)


  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // 請求書を取得
      let invoiceSQL = `
        SELECT
          invoice_id, invoice_number, issue_date, billing_date, billing_month,
          customer_category, customer_name, subject_name, subject,
          registration_number, order_number, purchase_order_number,
          subtotal, tax, total, total_amount, status, payment_status,
          created_at, updated_at, remarks, closed_at, invoice_type, original_invoice_id
        FROM invoices
        WHERE status != 'deleted'
      `

      // 年度フィルター条件を追加
      if (yearFilter && yearFilter !== 'all' && yearFilter !== 'multi') {
        if (typeof yearFilter === 'string') {
          const year = parseInt(yearFilter)
          invoiceSQL += ` AND billing_date >= '${year}-01-01' AND billing_date <= '${year}-12-31'`
        }
      } else if (Array.isArray(yearFilter) && yearFilter.length > 0) {
        const fiscalYears = yearFilter.map(y => parseInt(y)).filter(y => !isNaN(y))
        if (fiscalYears.length > 0) {
          const minFiscalYear = Math.min(...fiscalYears)
          const maxFiscalYear = Math.max(...fiscalYears)
          const startDate = `${minFiscalYear - 1}-04-01`
          const endDate = `${maxFiscalYear}-03-31`
          invoiceSQL += ` AND billing_date >= '${startDate}' AND billing_date <= '${endDate}'`
        }
      }

      invoiceSQL += ` ORDER BY billing_date DESC`

      const invoicesResult = await dbClient.executeSQL<any>(invoiceSQL)
      if (!invoicesResult.success) {
        throw new Error(invoicesResult.error || '請求書の取得に失敗しました')
      }

      const invoiceRows = invoicesResult.data?.rows || []

      // 請求書IDリストを取得
      const invoiceIds = invoiceRows.map((inv: any) => inv.invoice_id)

      // 明細行を一括取得
      let lineItems: any[] = []
      if (invoiceIds.length > 0) {
        const lineItemsSQL = `
          SELECT id, invoice_id, line_no, task_type, target, action1, position1,
                 quantity, unit_price, amount, raw_label, performed_at
          FROM invoice_line_items
          WHERE invoice_id IN (${invoiceIds.map((id: string) => escapeValue(id)).join(', ')})
          ORDER BY invoice_id, line_no
        `
        const lineItemsResult = await dbClient.executeSQL<any>(lineItemsSQL)
        if (lineItemsResult.success) {
          lineItems = lineItemsResult.data?.rows || []
        }
      }

      // 明細行を請求書IDでグループ化
      const lineItemsByInvoice = new Map<string, any[]>()
      lineItems.forEach((item: any) => {
        const existing = lineItemsByInvoice.get(item.invoice_id) || []
        existing.push(item)
        lineItemsByInvoice.set(item.invoice_id, existing)
      })

      // 請求書データを構築
      const allInvoices: InvoiceWithItems[] = invoiceRows.map((invoice: any) => {
        const items = lineItemsByInvoice.get(invoice.invoice_id) || []

        return {
          ...invoice,
          invoice_number: invoice.invoice_number || invoice.invoice_id,
          customer_category: (invoice.customer_category as 'UD' | 'その他') || 'その他',
          subject: invoice.subject || invoice.subject_name,
          line_items: items.map((item: any) => ({
            id: item.id,
            line_no: item.line_no,
            task_type: item.task_type,
            target: item.target,
            action: item.action1,
            position: item.position1,
            quantity: item.quantity,
            unit_price: item.unit_price,
            amount: item.amount,
            raw_label: item.raw_label,
            performed_at: item.performed_at
          })),
          total_quantity: items.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0),
          work_names: items.map((item: any) =>
            item.raw_label || [item.target, item.action1, item.position1].filter(Boolean).join(' ')
          ).join(', '),
          status: (invoice.status as 'draft' | 'finalized' | 'sent' | 'paid') || 'draft',
          payment_status: (invoice.payment_status as 'unpaid' | 'paid' | 'partial') || 'unpaid',
          subtotal: invoice.subtotal || 0,
          tax: invoice.tax || 0,
          total: invoice.total_amount || invoice.total || 0
        }
      })

      // 枝番フィルタリング: 同じ基本番号の請求書は最大枝番のみを表示
      const getBaseNumber = (invoiceId: string): string => {
        const match = invoiceId.match(/^(.+)-\d+$/)
        return match ? match[1] : invoiceId
      }
      const getBranchNumber = (invoiceId: string): number => {
        const match = invoiceId.match(/-(\d+)$/)
        return match ? parseInt(match[1], 10) : 1
      }

      // 基本番号ごとに最大枝番を特定
      const maxBranchMap = new Map<string, number>()
      allInvoices.forEach(invoice => {
        const baseNum = getBaseNumber(invoice.invoice_id)
        const branchNum = getBranchNumber(invoice.invoice_id)
        const currentMax = maxBranchMap.get(baseNum) || 0
        if (branchNum > currentMax) {
          maxBranchMap.set(baseNum, branchNum)
        }
      })

      // 最大枝番のみをフィルタリング
      const invoicesWithItems = allInvoices.filter(invoice => {
        const baseNum = getBaseNumber(invoice.invoice_id)
        const branchNum = getBranchNumber(invoice.invoice_id)
        return branchNum === maxBranchMap.get(baseNum)
      })

      setInvoices(invoicesWithItems)
    } catch (err) {
      console.error('Failed to fetch invoices:', err)
      setError(err instanceof Error ? err.message : 'データの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }, [yearFilter])

  const searchInvoices = useCallback((filters: SearchFilters): InvoiceWithItems[] => {
    return invoices.filter(invoice => {
      // キーワード検索（曖昧検索）
      if (filters.keyword.trim()) {
        const normalizedKeyword = normalizeSearchText(filters.keyword)
        const matchesKeyword =
          normalizeSearchText(invoice.invoice_id).includes(normalizedKeyword) ||
          normalizeSearchText(invoice.invoice_number || '').includes(normalizedKeyword) ||
          normalizeSearchText(invoice.customer_name || '').includes(normalizedKeyword) ||
          normalizeSearchText(invoice.subject || '').includes(normalizedKeyword) ||
          normalizeSearchText(invoice.subject_name || '').includes(normalizedKeyword) ||
          normalizeSearchText(invoice.registration_number || '').includes(normalizedKeyword) ||
          normalizeSearchText(invoice.work_names).includes(normalizedKeyword) ||
          normalizeSearchText(invoice.issue_date || '').includes(normalizedKeyword) ||
          normalizeSearchText(invoice.billing_date || '').includes(normalizedKeyword) ||
          invoice.line_items.some(item =>
            normalizeSearchText(item.raw_label || '').includes(normalizedKeyword) ||
            normalizeSearchText(item.target || '').includes(normalizedKeyword) ||
            normalizeSearchText(item.action || '').includes(normalizedKeyword) ||
            normalizeSearchText(item.position || '').includes(normalizedKeyword)
          )
        if (!matchesKeyword) return false
      }

      // ステータスフィルター
      if (filters.status && filters.status !== 'all') {
        if (invoice.status !== filters.status) return false
      }

      // 支払いステータスフィルター
      if (filters.payment_status && filters.payment_status !== 'all') {
        if (invoice.payment_status !== filters.payment_status) return false
      }

      // 年フィルター
      if (filters.year && filters.year !== 'all' && invoice.billing_date) {
        const invoiceYear = new Date(invoice.billing_date).getFullYear()
        if (invoiceYear !== parseInt(filters.year)) return false
      }

      // 月フィルター
      if (filters.month && filters.month !== 'all' && invoice.billing_date) {
        const invoiceMonth = new Date(invoice.billing_date).getMonth() + 1
        if (invoiceMonth !== parseInt(filters.month)) return false
      }

      return true
    })
  }, [invoices])

  // ステータス更新機能
  const updateInvoiceStatus = useCallback(async (invoiceId: string, newStatus: 'draft' | 'finalized' | 'sent' | 'paid') => {
    try {
      const updateSQL = `
        UPDATE invoices
        SET status = ${escapeValue(newStatus)}, updated_at = ${escapeValue(new Date().toISOString())}
        WHERE invoice_id = ${escapeValue(invoiceId)}
      `
      const result = await dbClient.executeSQL(updateSQL)
      if (!result.success) throw new Error(result.error)

      // データを再取得してUIを更新
      await fetchInvoices()
      return true
    } catch (error) {
      console.error('Status update error:', error)
      setError(error instanceof Error ? error.message : 'ステータス更新に失敗しました')
      return false
    }
  }, [fetchInvoices])

  // 支払いステータス更新機能
  const updatePaymentStatus = useCallback(async (invoiceId: string, newPaymentStatus: 'unpaid' | 'paid' | 'partial') => {
    try {
      const updateSQL = `
        UPDATE invoices
        SET payment_status = ${escapeValue(newPaymentStatus)}, updated_at = ${escapeValue(new Date().toISOString())}
        WHERE invoice_id = ${escapeValue(invoiceId)}
      `
      const result = await dbClient.executeSQL(updateSQL)
      if (!result.success) throw new Error(result.error)

      // データを再取得してUIを更新
      await fetchInvoices()
      return true
    } catch (error) {
      console.error('Payment status update error:', error)
      setError(error instanceof Error ? error.message : '支払いステータス更新に失敗しました')
      return false
    }
  }, [fetchInvoices])

  // 赤伝（取消伝票）作成
  const createRedInvoice = useCallback(async (originalId: string): Promise<{ ok: true; newInvoiceId: string } | { ok: false; error?: string }> => {
    try {
      setError(null)

      // 元請求書の取得
      const invoiceSQL = `SELECT * FROM invoices WHERE invoice_id = ${escapeValue(originalId)}`
      const invoiceResult = await dbClient.executeSQL<any>(invoiceSQL)
      if (!invoiceResult.success || !invoiceResult.data?.rows?.[0]) {
        throw new Error('元の請求書が見つかりません')
      }
      const originalInvoice = invoiceResult.data.rows[0]

      // 元のライン項目の取得
      const lineItemsSQL = `
        SELECT * FROM invoice_line_items
        WHERE invoice_id = ${escapeValue(originalId)}
        ORDER BY line_no
      `
      const lineItemsResult = await dbClient.executeSQL<any>(lineItemsSQL)
      const lineItems = lineItemsResult.data?.rows || []

      // 新しい請求書ID
      const now = new Date()
      const yyyy = now.getFullYear()
      const mm = String(now.getMonth() + 1).padStart(2, '0')
      const dd = String(now.getDate()).padStart(2, '0')
      const HH = String(now.getHours()).padStart(2, '0')
      const MM = String(now.getMinutes()).padStart(2, '0')
      const SS = String(now.getSeconds()).padStart(2, '0')
      const newInvoiceId = `${originalId}-R-${yyyy}${mm}${dd}${HH}${MM}${SS}`
      const issueDate = `${yyyy}-${mm}-${dd}`

      // 合計値を反転
      const origSubtotal = originalInvoice.subtotal ?? 0
      const origTax = originalInvoice.tax ?? 0
      const origTotal = originalInvoice.total_amount ?? origSubtotal + origTax

      const subtotal = -Number(origSubtotal)
      const tax = -Number(origTax)
      const total_amount = -Number(origTotal)

      // 赤伝請求書を作成
      const insertInvoiceSQL = `
        INSERT INTO invoices (
          invoice_id, issue_date, customer_name, subject_name, registration_number,
          billing_month, purchase_order_number, order_number, remarks,
          subtotal, tax, total_amount, status, invoice_type, original_invoice_id, updated_at
        ) VALUES (
          ${escapeValue(newInvoiceId)}, ${escapeValue(issueDate)},
          ${escapeValue(originalInvoice.customer_name)}, ${escapeValue(originalInvoice.subject_name)},
          ${escapeValue(originalInvoice.registration_number)}, ${escapeValue(originalInvoice.billing_month)},
          ${escapeValue(originalInvoice.purchase_order_number)}, ${escapeValue(originalInvoice.order_number)},
          ${escapeValue(`赤伝（元: ${originalId}）${originalInvoice.remarks ? '\n' + originalInvoice.remarks : ''}`)},
          ${subtotal}, ${tax}, ${total_amount}, 'draft', 'red', ${escapeValue(originalId)}, ${escapeValue(now.toISOString())}
        )
      `
      const insertResult = await dbClient.executeSQL(insertInvoiceSQL)
      if (!insertResult.success) throw new Error(insertResult.error)

      // 明細行を挿入（金額反転）
      for (const li of lineItems) {
        const insertLineSQL = `
          INSERT INTO invoice_line_items (
            invoice_id, line_no, task_type, action, target, position, raw_label,
            unit_price, quantity, performed_at, amount
          ) VALUES (
            ${escapeValue(newInvoiceId)}, ${li.line_no}, ${escapeValue(li.task_type)},
            ${escapeValue(li.action)}, ${escapeValue(li.target)}, ${escapeValue(li.position)},
            ${escapeValue(li.raw_label)}, ${li.unit_price != null ? -Number(li.unit_price) : 'NULL'},
            ${li.quantity}, ${escapeValue(li.performed_at)},
            ${li.amount != null ? -Number(li.amount) : 'NULL'}
          )
        `
        await dbClient.executeSQL(insertLineSQL)
      }

      await fetchInvoices()
      return { ok: true, newInvoiceId: newInvoiceId }
    } catch (e) {
      console.error('Create red invoice error:', e)
      setError(e instanceof Error ? e.message : '赤伝作成に失敗しました')
      return { ok: false, error: e instanceof Error ? e.message : 'unknown' }
    }
  }, [fetchInvoices])

  // 請求書削除（ソフト削除で経理データ保護）
  const deleteInvoice = useCallback(async (invoiceId: string) => {
    try {
      setError(null)

      // 物理削除禁止 - ソフト削除（論理削除）で経理データを保護
      const updateSQL = `
        UPDATE invoices
        SET status = 'deleted', deleted_at = ${escapeValue(new Date().toISOString())}
        WHERE invoice_id = ${escapeValue(invoiceId)}
      `
      const result = await dbClient.executeSQL(updateSQL)
      if (!result.success) throw new Error(result.error)

      await fetchInvoices()
      return true
    } catch (e) {
      console.error('Soft delete invoice error:', e)
      setError(e instanceof Error ? e.message : '削除に失敗しました')
      return false
    }
  }, [fetchInvoices])

  // 初期データロード（無限ループ防止: yearFilterのみ依存）
  useEffect(() => {
    fetchInvoices()
  }, [yearFilter])

  return {
    invoices,
    loading,
    error,
    searchInvoices,
    updateInvoiceStatus,
    updatePaymentStatus,
    refetch: fetchInvoices,
    createRedInvoice,
    deleteInvoice
  }
}
