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
  issue_date: string | null
  customer_name: string | null
  subject_name: string | null
  registration_number: string | null
  billing_month: string | null
  purchase_order_number: string | null
  order_number: string | null
  remarks: string | null
  subtotal: number
  tax: number
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
  total_amount: number
  total_quantity: number
  work_names: string
  status: 'draft' | 'finalized' | 'cancelled'
  payment_status: 'unpaid' | 'paid' | 'partial'
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
          issue_date,
          customer_name,
          subject_name,
          registration_number,
          billing_month,
          purchase_order_number,
          order_number,
          remarks,
          subtotal,
          tax,
          total_amount,
          status,
          payment_status,
          created_at,
          updated_at
        `)
        .order('invoice_id', { ascending: false })

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
          line_items: lineItemsWithSplits,
          total_amount: invoice.total_amount || 0, // データベースの値を使用
          total_quantity: totalQuantity,
          work_names: workNames.join(' / '),
          status: (invoice.status as 'draft' | 'finalized' | 'cancelled') || 'finalized',
          payment_status: (invoice.payment_status as 'unpaid' | 'paid' | 'partial') || 'unpaid',
          subtotal: invoice.subtotal || 0,
          tax: invoice.tax || 0
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
          (invoice.customer_name?.toLowerCase() || '').includes(keyword) ||
          (invoice.subject_name?.toLowerCase() || '').includes(keyword) ||
          (invoice.registration_number?.toLowerCase() || '').includes(keyword) ||
          invoice.work_names.toLowerCase().includes(keyword) ||
          (invoice.issue_date?.includes(keyword)) ||
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
      if (filters.year && filters.year !== 'all' && invoice.issue_date) {
        const invoiceYear = new Date(invoice.issue_date).getFullYear()
        if (invoiceYear !== parseInt(filters.year)) return false
      }

      // 月フィルター
      if (filters.month && filters.month !== 'all' && invoice.issue_date) {
        const invoiceMonth = new Date(invoice.issue_date).getMonth() + 1
        if (invoiceMonth !== parseInt(filters.month)) return false
      }

      return true
    })
  }, [invoices])

  // ステータス更新機能
  const updateInvoiceStatus = useCallback(async (invoiceId: string, newStatus: 'draft' | 'finalized' | 'cancelled') => {
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
    refetch: fetchInvoices
  }
}