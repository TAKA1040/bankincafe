'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

// 入金記録
export interface PaymentRecord {
  id: number
  payment_date: string
  payment_amount: number
  payment_method: string | null
  notes: string | null
  created_at: string
}

// 売上請求書データ（新スキーマ対応）
export interface SalesInvoice {
  invoice_id: string
  issue_date: string | null
  billing_month: string | null
  customer_name: string | null
  subject_name: string | null
  subject: string | null
  total_amount: number
  status: 'draft' | 'finalized' | 'sent' | 'paid'
  payment_status: 'unpaid' | 'paid' | 'partial'
  created_at: string | null
  // 実際のDBカラム
  registration_number: string | null
  purchase_order_number: string | null
  order_number: string | null
  // 新スキーマ対応フィールド
  invoice_type: 'standard' | 'credit_note'
  original_invoice_id: string | null
  // 計算フィールド
  total_paid: number
  remaining_amount: number
  last_payment_date: string | null
  payment_history: PaymentRecord[]
}

export interface MonthlySales {
  month: string
  year: number
  monthNum: number
  amount: number
  count: number
}

export interface CustomerSales {
  customer_name: string
  total_amount: number
  invoice_count: number
  percentage: number
}

export interface SalesStatistics {
  totalSales: number
  totalInvoices: number
  averageAmount: number
  paidAmount: number
  unpaidAmount: number
  partialAmount: number
  topCustomer: string
  topMonth: string
}

export function useSalesData() {
  const [invoices, setInvoices] = useState<SalesInvoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // ページネーションで全件取得
      let allData: any[] = []
      let currentPage = 0
      const pageSize = 1000
      let hasMore = true

      while (hasMore) {
        const fromIndex = currentPage * pageSize
        const toIndex = fromIndex + pageSize - 1

        const { data: pageData, error: pageError } = await supabase
          .from('invoices')
          .select(`
            invoice_id,
            issue_date,
            billing_date,
            billing_month,
            customer_name,
            subject_name,
            subject,
            total,
            total_amount,
            status,
            payment_status,
            registration_number,
            purchase_order_number,
            order_number,
            invoice_type,
            original_invoice_id,
            created_at,
            invoice_payments(
              id,
              payment_date,
              payment_amount,
              payment_method,
              notes,
              created_at
            )
          `)
          .neq('status', 'deleted')
          .order('issue_date', { ascending: false })
          .range(fromIndex, toIndex)

        if (pageError) {
          // フォールバック処理（invoice_paymentsテーブルがない場合）
          if ((pageError as any).code === '42P01') {
            const { data: fallbackData, error: fallbackError } = await supabase
              .from('invoices')
              .select(`
                invoice_id,
                issue_date,
                billing_date,
                billing_month,
                customer_name,
                subject_name,
                subject,
                total,
                total_amount,
                status,
                payment_status,
                registration_number,
                purchase_order_number,
                order_number,
                created_at
              `)
              .neq('status', 'deleted')
              .order('issue_date', { ascending: false })
              .range(fromIndex, toIndex)

            if (fallbackError) throw fallbackError
            if (fallbackData && fallbackData.length > 0) {
              allData = [...allData, ...fallbackData]
              hasMore = fallbackData.length === pageSize
              currentPage++
            } else {
              hasMore = false
            }
          } else {
            throw pageError
          }
        } else if (pageData && pageData.length > 0) {
          allData = [...allData, ...pageData]
          hasMore = pageData.length === pageSize
          currentPage++
        } else {
          hasMore = false
        }
      }

      const rows: any[] = allData

      const salesInvoices: SalesInvoice[] = rows.map((invoice: any) => {
        // 入金履歴の処理
        const payments: PaymentRecord[] = (invoice.invoice_payments || []).map((p: any) => ({
          id: p.id,
          payment_date: p.payment_date,
          payment_amount: p.payment_amount || 0,
          payment_method: p.payment_method,
          notes: p.notes,
          created_at: p.created_at
        }))

        // 入金合計の計算
        const totalPaid = payments.reduce((sum, p) => sum + p.payment_amount, 0)
        
        // 最終入金日の取得
        const lastPaymentDate = payments.length > 0 
          ? payments.sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime())[0].payment_date
          : null

        const totalAmount = invoice.total_amount || invoice.total || 0

        return {
          invoice_id: invoice.invoice_id,
          issue_date: invoice.issue_date || invoice.billing_date,
          billing_month: invoice.billing_month,
          customer_name: invoice.customer_name,
          subject_name: invoice.subject_name,
          subject: invoice.subject,
          total_amount: totalAmount,
          status: (invoice.status as 'draft' | 'finalized' | 'sent' | 'paid') || 'draft',
          payment_status: (invoice.payment_status as 'unpaid' | 'paid' | 'partial') || 'unpaid',
          created_at: invoice.created_at,
          // 実際のDBカラム
          registration_number: invoice.registration_number,
          purchase_order_number: invoice.purchase_order_number,
          order_number: invoice.order_number,
          // 新スキーマフィールド
          invoice_type: (invoice.invoice_type as 'standard' | 'credit_note') || 'standard',
          original_invoice_id: invoice.original_invoice_id,
          // 計算フィールド
          total_paid: totalPaid,
          remaining_amount: totalAmount - totalPaid,
          last_payment_date: lastPaymentDate,
          payment_history: payments.sort((a, b) =>
            new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime()
          )
        }
      })

      // 枝番フィルタリング: 同じ基本番号の請求書は最大枝番のみを表示
      // 請求書番号形式: YYMM連番-枝番 (例: 25053398-1, 25053398-2)
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
      salesInvoices.forEach(invoice => {
        const baseNum = getBaseNumber(invoice.invoice_id)
        const branchNum = getBranchNumber(invoice.invoice_id)
        const currentMax = maxBranchMap.get(baseNum) || 0
        if (branchNum > currentMax) {
          maxBranchMap.set(baseNum, branchNum)
        }
      })

      // 最大枝番のみをフィルタリング
      const filteredInvoices = salesInvoices.filter(invoice => {
        const baseNum = getBaseNumber(invoice.invoice_id)
        const branchNum = getBranchNumber(invoice.invoice_id)
        return branchNum === maxBranchMap.get(baseNum)
      })

      setInvoices(filteredInvoices)
    } catch (err) {
      console.error('Failed to fetch sales data:', err)
      setError(err instanceof Error ? err.message : '売上データの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }, [])

  const getMonthlySales = useCallback((year?: number): MonthlySales[] => {
    let filteredData = invoices
    
    if (year) {
      filteredData = invoices.filter(invoice => {
        if (!invoice.issue_date) return false
        const invoiceYear = new Date(invoice.issue_date).getFullYear()
        return invoiceYear === year
      })
    }
    
    const monthlyMap = new Map<string, MonthlySales>()
    
    filteredData.forEach(invoice => {
      if (!invoice.issue_date) return
      
      const date = new Date(invoice.issue_date)
      const invoiceYear = date.getFullYear()
      const invoiceMonth = date.getMonth() + 1
      const key = `${invoiceYear}-${invoiceMonth}`
      
      const existing = monthlyMap.get(key)
      
      if (existing) {
        existing.amount += invoice.total_amount
        existing.count += 1
      } else {
        monthlyMap.set(key, {
          month: `${invoiceYear}年${invoiceMonth}月`,
          year: invoiceYear,
          monthNum: invoiceMonth,
          amount: invoice.total_amount,
          count: 1
        })
      }
    })
    
    return Array.from(monthlyMap.values()).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year
      return a.monthNum - b.monthNum
    })
  }, [invoices])

  const getCustomerSales = useCallback((year?: number): CustomerSales[] => {
    let filteredData = invoices
    
    if (year) {
      filteredData = invoices.filter(invoice => {
        if (!invoice.issue_date) return false
        const invoiceYear = new Date(invoice.issue_date).getFullYear()
        return invoiceYear === year
      })
    }
    
    const totalAmount = filteredData.reduce((sum, invoice) => sum + invoice.total_amount, 0)
    const customerMap = new Map<string, CustomerSales>()
    
    filteredData.forEach(invoice => {
      const customerName = invoice.customer_name || '不明'
      const existing = customerMap.get(customerName)
      
      if (existing) {
        existing.total_amount += invoice.total_amount
        existing.invoice_count += 1
      } else {
        customerMap.set(customerName, {
          customer_name: customerName,
          total_amount: invoice.total_amount,
          invoice_count: 1,
          percentage: 0
        })
      }
    })
    
    const customers = Array.from(customerMap.values())
    customers.forEach(customer => {
      customer.percentage = totalAmount > 0 ? (customer.total_amount / totalAmount) * 100 : 0
    })
    
    return customers.sort((a, b) => b.total_amount - a.total_amount)
  }, [invoices])

  const getStatistics = useCallback((year?: number): SalesStatistics => {
    let filteredData = invoices
    
    if (year) {
      filteredData = invoices.filter(invoice => {
        if (!invoice.issue_date) return false
        const invoiceYear = new Date(invoice.issue_date).getFullYear()
        return invoiceYear === year
      })
    }
    
    if (filteredData.length === 0) {
      return {
        totalSales: 0,
        totalInvoices: 0,
        averageAmount: 0,
        paidAmount: 0,
        unpaidAmount: 0,
        partialAmount: 0,
        topCustomer: '',
        topMonth: ''
      }
    }

    const totalSales = filteredData.reduce((sum, invoice) => sum + invoice.total_amount, 0)
    
    // 支払い状況別の金額集計（新スキーマベース）
    const paidAmount = filteredData
      .filter(invoice => invoice.payment_status === 'paid')
      .reduce((sum, invoice) => sum + invoice.total_paid, 0)
    
    const partialAmount = filteredData
      .filter(invoice => invoice.payment_status === 'partial')
      .reduce((sum, invoice) => sum + invoice.total_paid, 0)
    
    const unpaidAmount = totalSales - paidAmount - partialAmount
    const averageAmount = Math.round(totalSales / filteredData.length)

    // 顧客別売上
    const customerSales = getCustomerSales(year)
    const topCustomer = customerSales[0]?.customer_name || ''

    // 月別売上
    const monthlySales = getMonthlySales(year)
    const topMonth = monthlySales.sort((a, b) => b.amount - a.amount)[0]?.month || ''

    return {
      totalSales,
      totalInvoices: filteredData.length,
      averageAmount,
      paidAmount,
      unpaidAmount,
      partialAmount,
      topCustomer,
      topMonth
    }
  }, [invoices, getCustomerSales, getMonthlySales])

  const getAvailableYears = useCallback((): number[] => {
    const years = new Set<number>()
    
    invoices.forEach(invoice => {
      if (invoice.issue_date) {
        const year = new Date(invoice.issue_date).getFullYear()
        years.add(year)
      }
    })
    
    return Array.from(years).sort((a, b) => b - a)
  }, [invoices])

  const exportToCSV = useCallback((year?: number): void => {
    let filteredData = invoices
    
    if (year) {
      filteredData = invoices.filter(invoice => {
        if (!invoice.issue_date) return false
        const invoiceYear = new Date(invoice.issue_date).getFullYear()
        return invoiceYear === year
      })
    }
    
    const headers = [
      '請求書ID', '請求日', '顧客名', '件名', '金額', 'ステータス', 
      '支払い状況', '入金合計', '残額', '最終入金日', '作成日'
    ]
    
    const getStatusLabel = (status: string): string => {
      const statusMap = {
        draft: '下書き',
        finalized: '確定',
        sent: '送信済み',
        paid: '入金済み'
      }
      return statusMap[status as keyof typeof statusMap] || status
    }

    const getPaymentStatusLabel = (status: string): string => {
      const statusMap = {
        unpaid: '未入金',
        paid: '入金済み',
        partial: '一部入金'
      }
      return statusMap[status as keyof typeof statusMap] || status
    }
    
    const rows = filteredData.map(invoice => [
      invoice.invoice_id,
      invoice.issue_date ? new Date(invoice.issue_date).toLocaleDateString('ja-JP') : '',
      `"${(invoice.customer_name || '').replace(/"/g, '""')}"`,
      `"${(invoice.subject_name || invoice.subject || '').replace(/"/g, '""')}"`,
      invoice.total_amount.toString(),
      getStatusLabel(invoice.status),
      getPaymentStatusLabel(invoice.payment_status),
      invoice.total_paid.toString(),
      invoice.remaining_amount.toString(),
      invoice.last_payment_date ? new Date(invoice.last_payment_date).toLocaleDateString('ja-JP') : '',
      invoice.created_at ? new Date(invoice.created_at).toLocaleDateString('ja-JP') : ''
    ])

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `売上データ_${year || '全年度'}_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    
    setTimeout(() => URL.revokeObjectURL(url), 100)
  }, [invoices])

  const getPaymentStatusSummary = useCallback((year?: number) => {
    let filteredData = invoices
    if (year) {
      filteredData = invoices.filter(invoice => {
        if (!invoice.issue_date) return false
        const invoiceYear = new Date(invoice.issue_date).getFullYear()
        return invoiceYear === year
      })
    }

    const summary = {
      unpaid: { count: 0, total: 0, remaining: 0 },
      paid: { count: 0, total: 0, remaining: 0 },
      partial: { count: 0, total: 0, remaining: 0 }
    }

    for (const invoice of filteredData) {
      const status = invoice.payment_status
      if (summary[status]) {
        summary[status].count++
        summary[status].total += invoice.total_amount
        summary[status].remaining += invoice.remaining_amount
      }
    }
    
    return summary
  }, [invoices])

  // 新スキーマ対応: invoice_payments テーブルへの入金記録 - 楽観的UI更新
  const recordPayment = useCallback(async (invoiceId: string, paymentData: {
    payment_date: string
    payment_amount: number
    payment_method?: string
    notes?: string
  }): Promise<boolean> => {
    // 楽観的UI更新: 先にローカル状態を更新
    const originalInvoices = [...invoices]
    setInvoices(prev => prev.map(inv => {
      if (inv.invoice_id !== invoiceId) return inv
      const newTotalPaid = inv.total_paid + paymentData.payment_amount
      const newRemaining = inv.total_amount - newTotalPaid
      let newStatus: 'unpaid' | 'paid' | 'partial' = 'unpaid'
      if (newRemaining <= 0) {
        newStatus = 'paid'
      } else if (newTotalPaid > 0) {
        newStatus = 'partial'
      }
      return {
        ...inv,
        payment_status: newStatus,
        total_paid: newTotalPaid,
        remaining_amount: Math.max(0, newRemaining),
        last_payment_date: paymentData.payment_date
      }
    }))

    try {
      setError(null)

      // invoice_payments テーブルに入金記録を挿入
      const { error: paymentError } = await supabase
        .from('invoice_payments')
        .insert({
          invoice_id: invoiceId,
          payment_date: paymentData.payment_date,
          payment_amount: paymentData.payment_amount,
          payment_method: paymentData.payment_method || null,
          notes: paymentData.notes || null
        })

      if (paymentError) {
        // フォールバック: 古いテーブル構造での更新
        const { error: fallbackError } = await supabase
          .from('invoices')
          .update({
            payment_status: 'paid',
          })
          .eq('invoice_id', invoiceId)

        if (fallbackError) {
          setInvoices(originalInvoices)
          throw fallbackError
        }
      } else {
        // 請求書の支払い状況を更新
        // 入金合計を計算して支払い状況を決定
        const { data: payments } = await supabase
          .from('invoice_payments')
          .select('payment_amount')
          .eq('invoice_id', invoiceId)

        const { data: invoice } = await supabase
          .from('invoices')
          .select('total')
          .eq('invoice_id', invoiceId)
          .single()

        if (payments && invoice) {
          const totalPaid = payments.reduce((sum, p) => sum + (p.payment_amount || 0), 0)
          const total = invoice.total || 0

          let newStatus: 'unpaid' | 'paid' | 'partial' = 'unpaid'
          if (totalPaid >= total) {
            newStatus = 'paid'
          } else if (totalPaid > 0) {
            newStatus = 'partial'
          }

          await supabase
            .from('invoices')
            .update({ payment_status: newStatus })
            .eq('invoice_id', invoiceId)
        }
      }

      return true
    } catch (err) {
      console.error('Failed to record payment:', err)
      setError(err instanceof Error ? err.message : '入金記録の登録に失敗しました')
      setInvoices(originalInvoices)
      return false
    }
  }, [invoices])

  // 複数請求書の一括支払い更新（新スキーマ対応）- 楽観的UI更新
  const updateInvoicesPaymentStatus = useCallback(async (invoiceIds: string[], paymentDate: string): Promise<boolean> => {
    // 楽観的UI更新: 先にローカル状態を更新
    const originalInvoices = [...invoices]
    setInvoices(prev => prev.map(inv =>
      invoiceIds.includes(inv.invoice_id)
        ? { ...inv, payment_status: 'paid' as const, total_paid: inv.total_amount, remaining_amount: 0, last_payment_date: paymentDate }
        : inv
    ))

    try {
      setError(null)

      // 各請求書の残額を取得して入金記録を作成
      const { data: invoicesData } = await supabase
        .from('invoices')
        .select('invoice_id, total')
        .in('invoice_id', invoiceIds)

      if (!invoicesData) {
        setInvoices(originalInvoices)
        throw new Error('請求書データの取得に失敗しました')
      }

      // 各請求書に対して入金記録を作成
      for (const invoice of invoicesData) {
        // 既存の入金額を取得
        const { data: existingPayments } = await supabase
          .from('invoice_payments')
          .select('payment_amount')
          .eq('invoice_id', invoice.invoice_id)

        const existingTotal = existingPayments?.reduce((sum, p) => sum + (p.payment_amount || 0), 0) || 0
        const remainingAmount = (invoice.total || 0) - existingTotal

        if (remainingAmount > 0) {
          await supabase
            .from('invoice_payments')
            .insert({
              invoice_id: invoice.invoice_id,
              payment_date: paymentDate,
              payment_amount: remainingAmount,
              payment_method: '一括更新',
              notes: '売上管理画面からの一括支払い更新'
            })

          // 支払い状況を「支払済み」に更新
          await supabase
            .from('invoices')
            .update({ payment_status: 'paid' })
            .eq('invoice_id', invoice.invoice_id)
        }
      }

      return true
    } catch (err) {
      console.error('Failed to update payment status:', err)
      setError(err instanceof Error ? err.message : '入金状況の更新に失敗しました')
      setInvoices(originalInvoices)
      return false
    }
  }, [invoices])

  // 入金取り消し（入金履歴を全削除して未入金に戻す）- 楽観的UI更新
  const cancelPayment = useCallback(async (invoiceId: string, deleteHistory: boolean = true): Promise<boolean> => {
    // 楽観的UI更新: 先にローカル状態を更新
    const originalInvoices = [...invoices]
    setInvoices(prev => prev.map(inv =>
      inv.invoice_id === invoiceId
        ? { ...inv, payment_status: 'unpaid' as const, total_paid: 0, remaining_amount: inv.total_amount, payment_history: [] }
        : inv
    ))

    try {
      setError(null)

      if (deleteHistory) {
        // invoice_payments テーブルから入金記録を削除
        const { error: deleteError } = await supabase
          .from('invoice_payments')
          .delete()
          .eq('invoice_id', invoiceId)

        if (deleteError) {
          console.warn('入金履歴の削除に失敗:', deleteError)
          // テーブルがない場合は無視して続行
        }
      }

      // 請求書の支払い状況を「未入金」に更新
      const { error: updateError } = await supabase
        .from('invoices')
        .update({ payment_status: 'unpaid' })
        .eq('invoice_id', invoiceId)

      if (updateError) {
        // エラー時はロールバック
        setInvoices(originalInvoices)
        throw updateError
      }

      return true
    } catch (err) {
      console.error('Failed to cancel payment:', err)
      setError(err instanceof Error ? err.message : '入金取り消しに失敗しました')
      // ロールバック
      setInvoices(originalInvoices)
      return false
    }
  }, [invoices])

  // 特定の入金記録を削除（一部入金の取り消し用）
  const deletePaymentRecord = useCallback(async (paymentId: number, invoiceId: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)

      // 入金記録を削除
      const { error: deleteError } = await supabase
        .from('invoice_payments')
        .delete()
        .eq('id', paymentId)

      if (deleteError) throw deleteError

      // 残りの入金記録を確認して支払い状況を更新
      const { data: remainingPayments } = await supabase
        .from('invoice_payments')
        .select('payment_amount')
        .eq('invoice_id', invoiceId)

      const { data: invoice } = await supabase
        .from('invoices')
        .select('total')
        .eq('invoice_id', invoiceId)
        .single()

      if (invoice) {
        const totalPaid = remainingPayments?.reduce((sum, p) => sum + (p.payment_amount || 0), 0) || 0
        const total = invoice.total || 0

        let newStatus: 'unpaid' | 'paid' | 'partial' = 'unpaid'
        if (totalPaid >= total) {
          newStatus = 'paid'
        } else if (totalPaid > 0) {
          newStatus = 'partial'
        }

        await supabase
          .from('invoices')
          .update({ payment_status: newStatus })
          .eq('invoice_id', invoiceId)
      }

      await fetchInvoices()
      return true
    } catch (err) {
      console.error('Failed to delete payment record:', err)
      setError(err instanceof Error ? err.message : '入金記録の削除に失敗しました')
      setLoading(false)
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
    getMonthlySales,
    getCustomerSales,
    getStatistics,
    getAvailableYears,
    exportToCSV,
    refetch: fetchInvoices,
    getPaymentStatusSummary,
    recordPayment,
    updateInvoicesPaymentStatus,
    cancelPayment,
    deletePaymentRecord
  }
}