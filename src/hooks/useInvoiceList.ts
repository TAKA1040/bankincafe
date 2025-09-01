'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/supabase'

type InvoiceRow = Database['public']['Tables']['invoices']['Row']
type InvoiceLineItemRow = Database['public']['Tables']['invoice_line_items']['Row']

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
  customer_category: 'UD' | 'その他'
  customer_name: string | null
  subject_name: string | null
  subject: string | null
  registration_number: string | null
  order_number: string | null
  subtotal: number
  tax: number
  total: number
  status: 'draft' | 'finalized' | 'sent' | 'paid'
  payment_status: 'unpaid' | 'paid' | 'partial'
  created_at: string | null
  updated_at: string | null
  line_items: {
    id: number
    line_no: number
    task_type: string
    target: string | null
    action: string | null
    position: string | null
    quantity: number | null
    unit_price: number | null
    amount: number | null
    raw_label: string | null
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

export function useInvoiceList() {
  const [invoices, setInvoices] = useState<InvoiceWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // 請求書とライン項目を取得
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .select(`
          invoice_id,
          invoice_number,
          issue_date,
          billing_date,
          customer_category,
          customer_name,
          subject_name,
          subject,
          registration_number,
          order_number,
          subtotal,
          tax,
          total,
          status,
          payment_status,
          created_at,
          updated_at
        `)
        .order('created_at', { ascending: false })

      if (invoiceError) {
        throw invoiceError
      }

      // 各請求書のライン項目を取得
      const invoicesWithItems: InvoiceWithItems[] = []

      for (const invoice of invoiceData || []) {
        const { data: lineItems, error: lineError } = await supabase
          .from('invoice_line_items')
          .select('*')
          .eq('invoice_id', invoice.invoice_id)
          .order('line_no', { ascending: true })

        if (lineError) {
          console.error(`Failed to fetch line items for ${invoice.invoice_id}:`, lineError)
          continue
        }

        // 各ライン項目の分割データを取得
        const lineItemsWithSplits = await Promise.all(
          (lineItems || []).map(async (item) => {
            const { data: splitItems, error: splitError } = await supabase
              .from('invoice_line_items_split')
              .select('*')
              .eq('invoice_id', item.invoice_id)
              .eq('line_no', item.line_no)
              .order('sub_no', { ascending: true })

            if (splitError) {
              console.error(`Failed to fetch split items for ${item.invoice_id}-${item.line_no}:`, splitError)
            }

            return {
              id: item.id,
              line_no: item.line_no,
              task_type: item.task_type,
              target: item.target,
              action: item.action,
              position: item.position,
              quantity: item.quantity,
              unit_price: item.unit_price,
              amount: item.amount,
              raw_label: item.raw_label,
              performed_at: item.performed_at,
              split_items: splitItems || []
            }
          })
        )

        // ライン項目からサマリーを計算（分割項目がある場合はそれを使用）
        let totalQuantity = 0
        let workNames: string[] = []

        lineItemsWithSplits.forEach(item => {
          if (item.split_items && item.split_items.length > 0) {
            // 分割項目がある場合
            totalQuantity += item.split_items.reduce((sum, split) => sum + split.quantity, 0)
            workNames.push(...item.split_items.map(split => split.raw_label_part))
          } else {
            // 分割項目がない場合は元の項目を使用
            totalQuantity += item.quantity || 0
            workNames.push(item.raw_label || [item.target, item.action, item.position].filter(Boolean).join(' '))
          }
        })

        const invoiceWithItems: InvoiceWithItems = {
          ...invoice,
          invoice_number: invoice.invoice_number || invoice.invoice_id,
          customer_category: (invoice.customer_category as 'UD' | 'その他') || 'その他',
          subject: invoice.subject || invoice.subject_name,
          line_items: lineItemsWithSplits,
          total_quantity: totalQuantity,
          work_names: workNames.join(' / '),
          status: (invoice.status as 'draft' | 'finalized' | 'sent' | 'paid') || 'draft',
          payment_status: (invoice.payment_status as 'unpaid' | 'paid' | 'partial') || 'unpaid',
          subtotal: invoice.subtotal || 0,
          tax: invoice.tax || 0,
          total: invoice.total || 0
        }

        invoicesWithItems.push(invoiceWithItems)
      }

      setInvoices(invoicesWithItems)
    } catch (err) {
      console.error('Failed to fetch invoices:', err)
      setError(err instanceof Error ? err.message : 'データの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }, [])

  const searchInvoices = useCallback((filters: SearchFilters): InvoiceWithItems[] => {
    return invoices.filter(invoice => {
      // キーワード検索
      if (filters.keyword.trim()) {
        const keyword = filters.keyword.toLowerCase()
        const matchesKeyword = 
          invoice.invoice_id.toLowerCase().includes(keyword) ||
          (invoice.invoice_number?.toLowerCase() || '').includes(keyword) ||
          (invoice.customer_name?.toLowerCase() || '').includes(keyword) ||
          (invoice.subject?.toLowerCase() || '').includes(keyword) ||
          (invoice.subject_name?.toLowerCase() || '').includes(keyword) ||
          (invoice.registration_number?.toLowerCase() || '').includes(keyword) ||
          invoice.work_names.toLowerCase().includes(keyword) ||
          (invoice.issue_date?.includes(keyword)) ||
          (invoice.billing_date?.includes(keyword)) ||
          invoice.line_items.some(item => 
            (item.raw_label?.toLowerCase() || '').includes(keyword) ||
            (item.target?.toLowerCase() || '').includes(keyword) ||
            (item.action?.toLowerCase() || '').includes(keyword) ||
            (item.position?.toLowerCase() || '').includes(keyword)
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
      const { error } = await supabase
        .from('invoices')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('invoice_id', invoiceId)

      if (error) throw error

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
      const { error } = await supabase
        .from('invoices')
        .update({ 
          payment_status: newPaymentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('invoice_id', invoiceId)

      if (error) throw error

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
      const { data: originalInvoice, error: invoiceErr } = await supabase
        .from('invoices')
        .select('*')
        .eq('invoice_id', originalId)
        .single()

      if (invoiceErr || !originalInvoice) {
        throw invoiceErr || new Error('元の請求書が見つかりません')
      }

      // 元のライン項目の取得
      const { data: lineItems, error: lineErr } = await supabase
        .from('invoice_line_items')
        .select('*')
        .eq('invoice_id', originalId)
        .order('line_no', { ascending: true })

      if (lineErr) throw lineErr

      // 元の分割項目（行ごと）をまとめて取得
      const splitMap: Record<string, SplitItem[]> = {}
      for (const li of lineItems || []) {
        const { data: splits, error: splitErr } = await supabase
          .from('invoice_line_items_split')
          .select('*')
          .eq('invoice_id', originalId)
          .eq('line_no', li.line_no)
          .order('sub_no', { ascending: true })
        if (splitErr) throw splitErr
        splitMap[String(li.line_no)] = (splits as unknown as SplitItem[]) || []
      }

      // 新しい請求書ID（元ID + タイムスタンプ）
      const now = new Date()
      const yyyy = now.getFullYear()
      const mm = String(now.getMonth() + 1).padStart(2, '0')
      const dd = String(now.getDate()).padStart(2, '0')
      const HH = String(now.getHours()).padStart(2, '0')
      const MM = String(now.getMinutes()).padStart(2, '0')
      const SS = String(now.getSeconds()).padStart(2, '0')
      const newInvoiceId = `${originalId}-R-${yyyy}${mm}${dd}${HH}${MM}${SS}`
      const issueDate = `${yyyy}-${mm}-${dd}`

      // 合計値（存在すればそれを反転、なければ項目から算出）
      const origSubtotal = (originalInvoice as any).subtotal ?? null
      const origTax = (originalInvoice as any).tax ?? null
      const origTotal = (originalInvoice as any).total_amount ?? null

      let subtotal = origSubtotal != null
        ? Number(origSubtotal)
        : (lineItems || []).reduce((s, li) => s + Number(li.amount || 0), 0)
      let tax = origTax != null ? Number(origTax) : 0
      let total_amount = origTotal != null ? Number(origTotal) : subtotal + tax

      subtotal = -subtotal
      tax = -tax
      total_amount = -total_amount

      // 新しい請求書の作成
      const { error: insertInvoiceError } = await supabase
        .from('invoices')
        .insert({
          invoice_id: newInvoiceId,
          issue_date: issueDate,
          customer_name: (originalInvoice as any).customer_name ?? null,
          subject_name: (originalInvoice as any).subject_name ?? null,
          registration_number: (originalInvoice as any).registration_number ?? null,
          billing_month: (originalInvoice as any).billing_month ?? null,
          purchase_order_number: (originalInvoice as any).purchase_order_number ?? null,
          order_number: (originalInvoice as any).order_number ?? null,
          remarks: `赤伝（元: ${originalId}）` + ((originalInvoice as any).remarks ? `\n${(originalInvoice as any).remarks}` : ''),
          subtotal,
          tax,
          total_amount,
          status: 'draft',
          payment_status: 'unpaid',
          updated_at: now.toISOString()
        } as any)

      if (insertInvoiceError) throw insertInvoiceError

      // ライン項目の作成（金額・単価のみ反転、数量はそのまま）
      if (lineItems && lineItems.length > 0) {
        const newLineItems = lineItems.map((li) => ({
          invoice_id: newInvoiceId,
          line_no: li.line_no,
          task_type: li.task_type,
          action: li.action,
          target: li.target,
          position: li.position,
          raw_label: li.raw_label,
          unit_price: li.unit_price != null ? -Number(li.unit_price) : null,
          quantity: li.quantity,
          performed_at: li.performed_at,
          amount: li.amount != null ? -Number(li.amount) : null
        }))

        const { error: insertLinesError } = await supabase
          .from('invoice_line_items')
          .insert(newLineItems as any)

        if (insertLinesError) throw insertLinesError

        // 分割項目の作成
        for (const li of lineItems) {
          const splits = splitMap[String(li.line_no)]
          if (splits && splits.length > 0) {
            const newSplits = splits.map((sp) => ({
              invoice_id: newInvoiceId,
              line_no: li.line_no,
              sub_no: sp.sub_no,
              raw_label_part: sp.raw_label_part,
              action: sp.action,
              target: sp.target,
              position: sp.position,
              unit_price: sp.unit_price != null ? -Number(sp.unit_price) : null,
              quantity: sp.quantity,
              amount: sp.amount != null ? -Number(sp.amount) : null,
              is_cancelled: sp.is_cancelled
            }))

            const { error: insertSplitsError } = await supabase
              .from('invoice_line_items_split')
              .insert(newSplits as any)

            if (insertSplitsError) throw insertSplitsError
          }
        }
      }

      await fetchInvoices()
      return { ok: true, newInvoiceId: newInvoiceId }
    } catch (e) {
      console.error('Create red invoice error:', e)
      setError(e instanceof Error ? e.message : '赤伝作成に失敗しました')
      return { ok: false, error: e instanceof Error ? e.message : 'unknown' }
    }
  }, [fetchInvoices])

  // 請求書削除
  const deleteInvoice = useCallback(async (invoiceId: string) => {
    try {
      setError(null)
      const { error: delErr } = await supabase
        .from('invoices')
        .delete()
        .eq('invoice_id', invoiceId)
      if (delErr) throw delErr
      await fetchInvoices()
      return true
    } catch (e) {
      console.error('Delete invoice error:', e)
      setError(e instanceof Error ? e.message : '削除に失敗しました')
      return false
    }
  }, [fetchInvoices])

  // 初期データロード
  useEffect(() => {
    fetchInvoices()
  }, [fetchInvoices])

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