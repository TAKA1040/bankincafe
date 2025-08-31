'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export interface SalesInvoice {
  invoice_id: string
  issue_date: string | null
  customer_name: string | null
  subject_name: string | null
  total_amount: number
  status: 'draft' | 'finalized' | 'cancelled'
  payment_status: 'unpaid' | 'paid' | 'partial'
  payment_date: string | null
  created_at: string | null
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

      // First, try selecting including payment_date (newer column)
      let { data, error } = await supabase
        .from('invoices')
        .select(`
          invoice_id,
          issue_date,
          customer_name,
          subject_name,
          total_amount,
          status,
          payment_status,
          payment_date,
          created_at
        `)
        .not('total_amount', 'is', null)
        .order('issue_date', { ascending: false })

      // If invalid column error (e.g., payment_date not yet migrated), retry without it
      const isInvalidColumn = error && (
        (error as any).code === '42703' ||
        String((error as any).message || '').toLowerCase().includes('column') &&
        String((error as any).message || '').includes('payment_date')
      )

      if (isInvalidColumn) {
        const fallback = await supabase
          .from('invoices')
          .select(`
            invoice_id,
            issue_date,
            customer_name,
            subject_name,
            total_amount,
            status,
            payment_status,
            created_at
          `)
          .not('total_amount', 'is', null)
          .order('issue_date', { ascending: false })
        data = fallback.data as any[]
        error = fallback.error as any
      }

      if (error) throw error

      const rows: any[] = (data as any[]) || []

      const salesInvoices: SalesInvoice[] = rows.map((invoice: any) => ({
        invoice_id: invoice.invoice_id,
        issue_date: invoice.issue_date,
        customer_name: invoice.customer_name,
        subject_name: invoice.subject_name,
        total_amount: invoice.total_amount || 0,
        status: (invoice.status as 'draft' | 'finalized' | 'cancelled') || 'draft',
        payment_status: (invoice.payment_status as 'unpaid' | 'paid' | 'partial') || 'unpaid',
        payment_date: invoice.payment_date || null,
        created_at: invoice.created_at
      }))

      setInvoices(salesInvoices)
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
        topCustomer: '',
        topMonth: ''
      }
    }

    const totalSales = filteredData.reduce((sum, invoice) => sum + invoice.total_amount, 0)
    const paidAmount = filteredData
      .filter(invoice => invoice.payment_status === 'paid')
      .reduce((sum, invoice) => sum + invoice.total_amount, 0)
    const unpaidAmount = totalSales - paidAmount
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
      '請求書ID', '請求日', '顧客名', '件名', '金額', 'ステータス', '支払い状況', '作成日'
    ]
    
    const getStatusLabel = (status: string): string => {
      const statusMap = {
        draft: '下書き',
        finalized: '確定',
        cancelled: '取消'
      }
      return statusMap[status as keyof typeof statusMap] || status
    }

    const getPaymentStatusLabel = (status: string): string => {
      const statusMap = {
        unpaid: '未払い',
        paid: '支払済み',
        partial: '一部入金'
      }
      return statusMap[status as keyof typeof statusMap] || status
    }
    
    const rows = filteredData.map(invoice => [
      invoice.invoice_id,
      invoice.issue_date ? new Date(invoice.issue_date).toLocaleDateString('ja-JP') : '',
      `"${(invoice.customer_name || '').replace(/"/g, '""')}"`,
      `"${(invoice.subject_name || '').replace(/"/g, '""')}"`,
      invoice.total_amount.toString(),
      getStatusLabel(invoice.status),
      getPaymentStatusLabel(invoice.payment_status),
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
    refetch: fetchInvoices
  }
}