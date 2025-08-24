/**
 * パス: src/app/sales-management/page.tsx
 * 目的: 売上管理画面
 */
'use client'

import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import SecurityWrapper from '@/components/security-wrapper'

// 型定義
interface Customer {
  id: number
  company_name: string
  person_in_charge: string
  position: string
  phone: string
  email: string
}

interface Invoice {
  id: number
  invoice_no: string
  billing_month: number
  billing_date: string
  customer_id: number
  client_name: string
  registration_no: string
  order_no: string
  internal_order_no: string
  subtotal: number
  tax: number
  total: number
  status: 'draft' | 'finalized' | 'canceled'
  created_by: string
  created_at: string
  updated_at: string
  memo: string
  category: 'UD' | 'その他'
  original_invoice_id: number | null
}

interface Payment {
  id: number
  invoice_id: number
  paid: boolean
  payment_date: string | null
  memo: string
  created_at: string
}

interface MonthlyData {
  UD: number
  other: number
  total: number
}

// 売上管理専用のデータ管理クラス
class SalesDB {
  customers: Customer[]
  invoices: Invoice[]
  payments: Payment[]
  currentUser: { id: string; name: string; email: string }

  constructor() {
    this.customers = [
      {
        id: 1,
        company_name: '株式会社UDトラックス',
        person_in_charge: '営業部',
        position: '担当者',
        phone: '03-1234-5678',
        email: 'sales@ud-trucks.com'
      },
      {
        id: 2,
        company_name: 'DEF商事株式会社',
        person_in_charge: '長崎サービスセンター',
        position: 'サービス担当',
        phone: '095-8765-4321',
        email: 'service@def-trading.com'
      },
      {
        id: 3,
        company_name: '株式会社ロジコム・アイ',
        person_in_charge: '整備部',
        position: '部長',
        phone: '093-111-2222',
        email: 'maintenance@logicom.com'
      },
      {
        id: 4,
        company_name: '東邦興産株式会社',
        person_in_charge: '運送課',
        position: '課長',
        phone: '093-333-4444',
        email: 'transport@toho-kosan.com'
      },
      {
        id: 5,
        company_name: '鶴丸海運株式会社',
        person_in_charge: '車両管理部',
        position: 'マネージャー',
        phone: '093-555-6666',
        email: 'fleet@tsurumaru.com'
      }
    ]

    this.invoices = [
      // 2025年6月のデータ
      {
        id: 1,
        invoice_no: '25060001-1',
        billing_month: 202506,
        billing_date: '2025-06-02',
        customer_id: 1,
        client_name: 'バンパー修理作業',
        registration_no: 'T1234567890123',
        order_no: 'ORD-001',
        internal_order_no: '2506001-01',
        subtotal: 100000,
        tax: 10000,
        total: 110000,
        status: 'finalized',
        created_by: 'user1',
        created_at: '2025-06-02T10:00:00Z',
        updated_at: '2025-06-02T10:00:00Z',
        memo: 'バンパー修理作業',
        category: 'UD',
        original_invoice_id: null
      },
      {
        id: 2,
        invoice_no: '25060002-1',
        billing_month: 202506,
        billing_date: '2025-06-02',
        customer_id: 2,
        client_name: 'マフラーカバー修理',
        registration_no: 'T9876543210987',
        order_no: 'ORD-002',
        internal_order_no: '2506002-01',
        subtotal: 50000,
        tax: 5000,
        total: 55000,
        status: 'finalized',
        created_by: 'user1',
        created_at: '2025-06-02T14:00:00Z',
        updated_at: '2025-06-02T14:00:00Z',
        memo: 'マフラーカバー修理一式',
        category: 'UD',
        original_invoice_id: null
      },
      {
        id: 3,
        invoice_no: '25060003-1',
        billing_month: 202506,
        billing_date: '2025-06-04',
        customer_id: 3,
        client_name: 'ドライバーシート点検',
        registration_no: 'T1111222233334',
        order_no: 'ORD-003',
        internal_order_no: '2506003-01',
        subtotal: 30000,
        tax: 3000,
        total: 33000,
        status: 'finalized',
        created_by: 'user1',
        created_at: '2025-06-04T13:00:00Z',
        updated_at: '2025-06-04T13:00:00Z',
        memo: 'ドライバーシート分解作動不良点検',
        category: 'UD',
        original_invoice_id: null
      },
      // 2025年5月のデータ
      {
        id: 4,
        invoice_no: '25050001-1',
        billing_month: 202505,
        billing_date: '2025-05-15',
        customer_id: 1,
        client_name: 'トラック荷台修理',
        registration_no: 'T1234567890123',
        order_no: 'ORD-005',
        internal_order_no: '2505001-01',
        subtotal: 80000,
        tax: 8000,
        total: 88000,
        status: 'finalized',
        created_by: 'user1',
        created_at: '2025-05-15T10:00:00Z',
        updated_at: '2025-05-15T10:00:00Z',
        memo: 'トラック荷台修理',
        category: 'UD',
        original_invoice_id: null
      },
      {
        id: 5,
        invoice_no: '25050002-1',
        billing_month: 202505,
        billing_date: '2025-05-20',
        customer_id: 4,
        client_name: 'システム開発業務',
        registration_no: '',
        order_no: 'ORD-SYS-001',
        internal_order_no: '2505002-01',
        subtotal: 500000,
        tax: 50000,
        total: 550000,
        status: 'finalized',
        created_by: 'user1',
        created_at: '2025-05-20T14:00:00Z',
        updated_at: '2025-05-20T14:00:00Z',
        memo: 'システム開発・保守',
        category: 'その他',
        original_invoice_id: null
      },
      // 2025年4月のデータ
      {
        id: 6,
        invoice_no: '25040001-1',
        billing_month: 202504,
        billing_date: '2025-04-10',
        customer_id: 2,
        client_name: 'キャビン修理・溶接',
        registration_no: 'T9876543210987',
        order_no: 'ORD-004',
        internal_order_no: '2504001-01',
        subtotal: 60000,
        tax: 6000,
        total: 66000,
        status: 'finalized',
        created_by: 'user1',
        created_at: '2025-04-10T11:00:00Z',
        updated_at: '2025-04-10T11:00:00Z',
        memo: 'キャビン修理・溶接',
        category: 'UD',
        original_invoice_id: null
      },
      {
        id: 7,
        invoice_no: '25040002-1',
        billing_month: 202504,
        billing_date: '2025-04-25',
        customer_id: 5,
        client_name: 'コンサルティング業務',
        registration_no: '',
        order_no: 'ORD-CON-001',
        internal_order_no: '2504002-01',
        subtotal: 300000,
        tax: 30000,
        total: 330000,
        status: 'finalized',
        created_by: 'user1',
        created_at: '2025-04-25T15:00:00Z',
        updated_at: '2025-04-25T15:00:00Z',
        memo: 'コンサルティング業務',
        category: 'その他',
        original_invoice_id: null
      }
    ]

    this.payments = [
      { id: 1, invoice_id: 1, paid: true, payment_date: '2025-06-15', memo: '2025-06-15入金確認', created_at: '2025-06-15T09:00:00Z' },
      { id: 2, invoice_id: 2, paid: true, payment_date: '2025-06-10', memo: '2025-06-10入金確認', created_at: '2025-06-10T09:00:00Z' },
      { id: 3, invoice_id: 3, paid: false, payment_date: null, memo: '', created_at: '2025-06-04T13:00:00Z' },
      { id: 4, invoice_id: 4, paid: true, payment_date: '2025-06-01', memo: '2025-06-01入金確認', created_at: '2025-06-01T09:00:00Z' },
      { id: 5, invoice_id: 5, paid: true, payment_date: '2025-06-05', memo: '2025-06-05入金確認', created_at: '2025-06-05T09:00:00Z' },
      { id: 6, invoice_id: 6, paid: true, payment_date: '2025-05-05', memo: '2025-05-05入金確認', created_at: '2025-05-05T09:00:00Z' },
      { id: 7, invoice_id: 7, paid: false, payment_date: null, memo: '', created_at: '2025-04-25T15:00:00Z' }
    ]

    this.currentUser = { id: 'user1', name: '管理者', email: 'admin@bankin-cafe.com' }
  }

  // 決算期ベース（4月〜翌3月）でのデータ集計
  getSalesData(selectedYear: number) {
    const startDate = new Date(selectedYear - 1, 3, 1) // 4月1日
    const endDate = new Date(selectedYear, 2, 31, 23, 59, 59) // 翌年3月31日
    
    const periodInvoices = this.invoices.filter(invoice => {
      const invoiceDate = new Date(invoice.billing_date)
      return invoiceDate >= startDate && invoiceDate <= endDate && invoice.status === 'finalized'
    })

    const monthlyData: Record<string, MonthlyData> = {}
    // 4月から翌年3月まで初期化
    for (let month = 4; month <= 15; month++) {
      const actualMonth = month > 12 ? month - 12 : month
      const year = month > 12 ? selectedYear : selectedYear - 1
      const key = `${year}-${actualMonth.toString().padStart(2, '0')}`
      monthlyData[key] = { 
        UD: 0,      // UD売上
        other: 0,   // その他売上
        total: 0 
      }
    }

    periodInvoices.forEach(invoice => {
      const date = new Date(invoice.billing_date)
      const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
      
      if (monthlyData[key]) {
        // カテゴリで分類：UD = 鈑金関連業務、その他 = その他の業務
        if (invoice.category === 'UD') {
          monthlyData[key].UD += invoice.total || 0
        } else {
          monthlyData[key].other += invoice.total || 0
        }
        monthlyData[key].total = monthlyData[key].UD + monthlyData[key].other
      }
    })

    return { monthlyData, periodInvoices }
  }

  // 入金状況更新
  updatePaymentStatus(invoiceId: number, paid: boolean, memo: string) {
    const existingPaymentIndex = this.payments.findIndex(p => p.invoice_id === invoiceId)
    if (existingPaymentIndex >= 0) {
      this.payments[existingPaymentIndex] = {
        ...this.payments[existingPaymentIndex],
        paid,
        memo,
        payment_date: paid ? new Date().toISOString().split('T')[0] : null
      }
    } else {
      this.payments.push({
        id: Date.now(),
        invoice_id: invoiceId,
        paid,
        memo,
        payment_date: paid ? new Date().toISOString().split('T')[0] : null,
        created_at: new Date().toISOString()
      })
    }
  }
}

export default function SalesManagementPage() {
  const router = useRouter()
  const [db] = useState(() => new SalesDB())
  const [selectedYear, setSelectedYear] = useState(2025)
  const [categoryFilter, setCategoryFilter] = useState('全て')
  const [viewMode, setViewMode] = useState<'invoices' | 'monthly'>('invoices')
  const [paymentUpdates, setPaymentUpdates] = useState<Record<number, { paid: boolean; memo: string; timestamp: number }>>({})
  const [searchKeyword, setSearchKeyword] = useState('')
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('すべて')

  const { monthlyData, periodInvoices } = db.getSalesData(selectedYear)
  
  // カテゴリ別合計計算
  const totals = Object.values(monthlyData).reduce(
    (acc, data) => ({
      UD: acc.UD + data.UD,
      other: acc.other + data.other,
      total: acc.total + data.total
    }),
    { UD: 0, other: 0, total: 0 }
  )

  // 戻るボタン
  const handleBack = () => {
    router.push('/')
  }

  // 入金状況更新（リアルタイム更新対応）
  const updatePaymentStatus = useCallback((invoiceId: number, paid: boolean, memo: string) => {
    db.updatePaymentStatus(invoiceId, paid, memo)
    setPaymentUpdates(prev => ({
      ...prev,
      [invoiceId]: { paid, memo, timestamp: Date.now() }
    }))
  }, [db])

  // フィルタリングされた請求書
  const filteredInvoices = periodInvoices.filter(invoice => {
    const customer = db.customers.find(c => c.id === invoice.customer_id)
    const payment = db.payments.find(p => p.invoice_id === invoice.id)
    
    // カテゴリフィルタ
    if (categoryFilter === 'UDのみ') {
      if (invoice.category !== 'UD') return false
    }
    if (categoryFilter === 'その他のみ') {
      if (invoice.category !== 'その他') return false
    }
    
    // 入金ステータスフィルタ
    if (paymentStatusFilter === '入金済み' && !payment?.paid) return false
    if (paymentStatusFilter === '未入金' && payment?.paid) return false
    
    // キーワード検索
    if (searchKeyword) {
      const searchText = searchKeyword.toLowerCase()
      const searchTargets = [
        invoice.invoice_no,
        customer?.company_name || '',
        invoice.client_name,
        payment?.memo || ''
      ].join(' ').toLowerCase()
      
      if (!searchTargets.includes(searchText)) return false
    }
    
    return true
  })

  // 月別集計のフィルタリング（表示フィルタに応じて）
  const getFilteredMonthlyData = () => {
    return Object.entries(monthlyData).filter(([key, data]) => {
      switch (categoryFilter) {
        case 'UDのみ':
          return data.UD > 0
        case 'その他のみ':
          return data.other > 0
        default:
          return true // 全て表示
      }
    })
  }

  // CSVエクスポート機能
  const exportToCSV = () => {
    const headers = ['請求書番号', '請求日', '請求月', '顧客名', '件名', '登録番号', '発注番号', 'オーダー番号', '請求金額(円)', '入金', '入金メモ']
    const csvData = filteredInvoices.map(invoice => {
      const payment = db.payments.find(p => p.invoice_id === invoice.id)
      const customer = db.customers.find(c => c.id === invoice.customer_id)
      return [
        invoice.invoice_no,
        invoice.billing_date,
        `${Math.floor(invoice.billing_month / 100)}-${(invoice.billing_month % 100).toString().padStart(2, '0')}`,
        customer?.company_name || '',
        invoice.client_name,
        invoice.registration_no || '-',
        invoice.order_no || '-',
        invoice.internal_order_no || '-',
        invoice.total,
        payment?.paid ? '✓' : '',
        payment?.memo || ''
      ]
    })

    const csvContent = [headers, ...csvData].map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `売上管理_${selectedYear}_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  return (
    <SecurityWrapper requirePin={true}>
      <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '1rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          
          {/* ヘッダー */}
          <div style={{ 
            background: 'white', 
            borderBottom: '2px solid #3b82f6',
            padding: '1rem',
            marginBottom: '1rem',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>
                  売上管理
                </h1>
                <button 
                  onClick={handleBack}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  ← ホームに戻る
                </button>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => setViewMode('monthly')}
                  style={{
                    padding: '0.5rem 1rem',
                    background: viewMode === 'monthly' ? '#3b82f6' : 'white',
                    color: viewMode === 'monthly' ? 'white' : '#3b82f6',
                    border: '1px solid #3b82f6',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  月別集計
                </button>
                <button 
                  onClick={() => setViewMode('invoices')}
                  style={{
                    padding: '0.5rem 1rem',
                    background: viewMode === 'invoices' ? '#3b82f6' : 'white',
                    color: viewMode === 'invoices' ? 'white' : '#3b82f6',
                    border: '1px solid #3b82f6',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  請求書一覧
                </button>
              </div>
            </div>
          </div>

          {/* 年度選択 */}
          <div style={{ 
            background: 'white',
            padding: '1rem',
            marginBottom: '1rem',
            border: '1px solid #d1d5db',
            borderRadius: '6px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem' }}>対象年度（期末年）</label>
                <button 
                  onClick={() => setSelectedYear(selectedYear - 1)}
                  style={{ 
                    padding: '0.25rem 0.75rem', 
                    background: '#e5e7eb', 
                    border: 'none',
                    borderRadius: '4px', 
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  前年
                </button>
                <input 
                  type="number"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  style={{ 
                    padding: '0.25rem 0.75rem', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '4px', 
                    width: '80px', 
                    textAlign: 'center' 
                  }}
                />
                <button 
                  onClick={() => setSelectedYear(selectedYear + 1)}
                  style={{ 
                    padding: '0.25rem 0.75rem', 
                    background: '#e5e7eb', 
                    border: 'none',
                    borderRadius: '4px', 
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  翌年
                </button>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem' }}>対象月（会計年度内）</label>
                <select style={{ 
                  padding: '0.25rem 0.75rem', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '4px' 
                }}>
                  <option>通年 ({selectedYear - 1}年04月～{selectedYear}年03月)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 月別売上集計ビュー */}
          {viewMode === 'monthly' && (
            <div style={{ background: 'white', border: '1px solid #d1d5db', borderRadius: '6px' }}>
              <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.9rem' }}>表示フィルタ:</label>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      {['全て', 'UDのみ', 'その他のみ'].map(filter => (
                        <button
                          key={filter}
                          onClick={() => setCategoryFilter(filter)}
                          style={{
                            padding: '0.25rem 0.75rem',
                            background: categoryFilter === filter ? (
                              filter === 'UDのみ' ? '#3b82f6' : 
                              filter === 'その他のみ' ? '#6b7280' : '#9ca3af'
                            ) : '#f3f4f6',
                            color: categoryFilter === filter ? 'white' : '#374151',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            cursor: 'pointer'
                          }}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ padding: '1rem' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                  {selectedYear - 1}年04月～{selectedYear}年03月 売上集計
                </h2>
                
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', fontSize: '0.9rem', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f9fafb' }}>
                        <th style={{ border: '1px solid #e5e7eb', padding: '0.5rem', textAlign: 'left' }}>年月</th>
                        {(categoryFilter === '全て' || categoryFilter === 'UDのみ') && (
                          <th style={{ border: '1px solid #e5e7eb', padding: '0.5rem', textAlign: 'right' }}>UD売上 (円)</th>
                        )}
                        {(categoryFilter === '全て' || categoryFilter === 'その他のみ') && (
                          <th style={{ border: '1px solid #e5e7eb', padding: '0.5rem', textAlign: 'right' }}>その他売上 (円)</th>
                        )}
                        {categoryFilter === '全て' && (
                          <th style={{ border: '1px solid #e5e7eb', padding: '0.5rem', textAlign: 'right' }}>合計 (円)</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredMonthlyData().map(([key, data]) => {
                        const [year, month] = key.split('-')
                        return (
                          <tr key={key}>
                            <td style={{ border: '1px solid #e5e7eb', padding: '0.5rem' }}>{year}-{month}</td>
                            {(categoryFilter === '全て' || categoryFilter === 'UDのみ') && (
                              <td style={{ border: '1px solid #e5e7eb', padding: '0.5rem', textAlign: 'right', color: '#2563eb' }}>
                                {data.UD.toLocaleString()}
                              </td>
                            )}
                            {(categoryFilter === '全て' || categoryFilter === 'その他のみ') && (
                              <td style={{ border: '1px solid #e5e7eb', padding: '0.5rem', textAlign: 'right', color: '#6b7280' }}>
                                {data.other.toLocaleString()}
                              </td>
                            )}
                            {categoryFilter === '全て' && (
                              <td style={{ border: '1px solid #e5e7eb', padding: '0.5rem', textAlign: 'right', fontWeight: '500' }}>
                                {data.total.toLocaleString()}
                              </td>
                            )}
                          </tr>
                        )
                      })}
                      <tr style={{ background: '#eff6ff', fontWeight: 'bold' }}>
                        <td style={{ border: '1px solid #e5e7eb', padding: '0.5rem' }}>
                          {selectedYear - 1}年04月～{selectedYear}年03月 合計:
                        </td>
                        {(categoryFilter === '全て' || categoryFilter === 'UDのみ') && (
                          <td style={{ border: '1px solid #e5e7eb', padding: '0.5rem', textAlign: 'right', color: '#2563eb' }}>
                            {totals.UD.toLocaleString()}
                          </td>
                        )}
                        {(categoryFilter === '全て' || categoryFilter === 'その他のみ') && (
                          <td style={{ border: '1px solid #e5e7eb', padding: '0.5rem', textAlign: 'right', color: '#6b7280' }}>
                            {totals.other.toLocaleString()}
                          </td>
                        )}
                        {categoryFilter === '全て' && (
                          <td style={{ border: '1px solid #e5e7eb', padding: '0.5rem', textAlign: 'right', fontSize: '1.1rem' }}>
                            {totals.total.toLocaleString()}
                          </td>
                        )}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 請求書一覧ビュー */}
          {viewMode === 'invoices' && (
            <div style={{ background: 'white', border: '1px solid #d1d5db', borderRadius: '6px' }}>
              <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>
                  {selectedYear - 1}年度 請求書一覧
                </h2>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.9rem' }}>キーワード検索</label>
                    <input
                      type="text"
                      placeholder="請求書番号、顧客名、件名などで検索..."
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      style={{ 
                        padding: '0.25rem 0.75rem', 
                        border: '1px solid #d1d5db', 
                        borderRadius: '4px', 
                        width: '300px' 
                      }}
                    />
                    <button 
                      onClick={() => setSearchKeyword('')}
                      style={{ 
                        padding: '0.25rem 0.75rem', 
                        background: '#e5e7eb', 
                        border: 'none',
                        borderRadius: '4px', 
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      クリア
                    </button>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.9rem' }}>入金ステータス</label>
                    <select
                      value={paymentStatusFilter}
                      onChange={(e) => setPaymentStatusFilter(e.target.value)}
                      style={{ 
                        padding: '0.25rem 0.75rem', 
                        border: '1px solid #d1d5db', 
                        borderRadius: '4px' 
                      }}
                    >
                      <option>すべて</option>
                      <option>入金済み</option>
                      <option>未入金</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                    検索結果 {filteredInvoices.length}件
                  </span>
                  <button 
                    onClick={exportToCSV}
                    style={{ 
                      padding: '0.25rem 0.75rem', 
                      background: '#10b981', 
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px', 
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    Excel出力
                  </button>
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', fontSize: '0.8rem' }}>
                  <thead style={{ background: '#f9fafb' }}>
                    <tr>
                      <th style={{ border: '1px solid #e5e7eb', padding: '0.5rem', textAlign: 'left' }}>請求書番号</th>
                      <th style={{ border: '1px solid #e5e7eb', padding: '0.5rem', textAlign: 'left' }}>請求日</th>
                      <th style={{ border: '1px solid #e5e7eb', padding: '0.5rem', textAlign: 'left' }}>請求月</th>
                      <th style={{ border: '1px solid #e5e7eb', padding: '0.5rem', textAlign: 'left' }}>顧客名</th>
                      <th style={{ border: '1px solid #e5e7eb', padding: '0.5rem', textAlign: 'left' }}>件名</th>
                      <th style={{ border: '1px solid #e5e7eb', padding: '0.5rem', textAlign: 'left' }}>登録番号</th>
                      <th style={{ border: '1px solid #e5e7eb', padding: '0.5rem', textAlign: 'left' }}>発注番号</th>
                      <th style={{ border: '1px solid #e5e7eb', padding: '0.5rem', textAlign: 'left' }}>オーダー番号</th>
                      <th style={{ border: '1px solid #e5e7eb', padding: '0.5rem', textAlign: 'right' }}>請求金額(円)</th>
                      <th style={{ border: '1px solid #e5e7eb', padding: '0.5rem', textAlign: 'center' }}>入金</th>
                      <th style={{ border: '1px solid #e5e7eb', padding: '0.5rem', textAlign: 'left' }}>入金メモ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices
                      .sort((a, b) => new Date(b.billing_date).getTime() - new Date(a.billing_date).getTime())
                      .map(invoice => {
                        const payment = db.payments.find(p => p.invoice_id === invoice.id)
                        const customer = db.customers.find(c => c.id === invoice.customer_id)
                        const currentPayment = paymentUpdates[invoice.id] || {
                          paid: payment?.paid || false,
                          memo: payment?.memo || ''
                        }
                        
                        const getCategoryColor = (category: string) => {
                          switch (category) {
                            case 'UD': return 'color: #2563eb; background: #eff6ff'
                            default: return 'color: #6b7280; background: #f9fafb'
                          }
                        }
                        
                        return (
                          <tr key={invoice.id} style={{ background: currentPayment.paid ? '#f0f9ff' : 'white' }}>
                            <td style={{ border: '1px solid #e5e7eb', padding: '0.5rem' }}>
                              <span style={{ color: '#2563eb', fontWeight: '500' }}>{invoice.invoice_no}</span>
                            </td>
                            <td style={{ border: '1px solid #e5e7eb', padding: '0.5rem' }}>{invoice.billing_date}</td>
                            <td style={{ border: '1px solid #e5e7eb', padding: '0.5rem' }}>
                              {Math.floor(invoice.billing_month / 100)}-{(invoice.billing_month % 100).toString().padStart(2, '0')}
                            </td>
                            <td style={{ border: '1px solid #e5e7eb', padding: '0.5rem' }}>
                              <div>
                                <div style={{ fontWeight: '500' }}>{customer?.company_name || ''}</div>
                                <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>{customer?.person_in_charge}</div>
                              </div>
                            </td>
                            <td style={{ border: '1px solid #e5e7eb', padding: '0.5rem' }}>
                              <div>
                                <div>{invoice.client_name}</div>
                                <span 
                                  style={{
                                    display: 'inline-block',
                                    padding: '0.125rem 0.5rem',
                                    borderRadius: '12px',
                                    fontSize: '0.7rem',
                                    fontWeight: '500',
                                    marginTop: '0.25rem',
                                    ...Object.fromEntries(getCategoryColor(invoice.category).split(';').map(pair => pair.trim().split(': ')))
                                  }}
                                >
                                  {invoice.category}
                                </span>
                              </div>
                            </td>
                            <td style={{ border: '1px solid #e5e7eb', padding: '0.5rem', fontSize: '0.7rem' }}>
                              {invoice.registration_no || '-'}
                            </td>
                            <td style={{ border: '1px solid #e5e7eb', padding: '0.5rem', fontSize: '0.7rem' }}>
                              {invoice.order_no || '-'}
                            </td>
                            <td style={{ border: '1px solid #e5e7eb', padding: '0.5rem', fontSize: '0.7rem' }}>
                              {invoice.internal_order_no || '-'}
                            </td>
                            <td style={{ border: '1px solid #e5e7eb', padding: '0.5rem', textAlign: 'right', fontWeight: '500' }}>
                              {invoice.total.toLocaleString()}
                            </td>
                            <td style={{ border: '1px solid #e5e7eb', padding: '0.5rem', textAlign: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <input
                                  type="checkbox"
                                  checked={currentPayment.paid}
                                  onChange={(e) => updatePaymentStatus(invoice.id, e.target.checked, currentPayment.memo)}
                                  style={{ width: '16px', height: '16px' }}
                                />
                                {currentPayment.paid && (
                                  <span style={{ marginLeft: '0.25rem', color: '#2563eb' }}>✓</span>
                                )}
                              </div>
                            </td>
                            <td style={{ border: '1px solid #e5e7eb', padding: '0.5rem' }}>
                              <input
                                type="text"
                                value={currentPayment.memo}
                                onChange={(e) => updatePaymentStatus(invoice.id, currentPayment.paid, e.target.value)}
                                style={{ 
                                  width: '100%', 
                                  padding: '0.125rem 0.5rem', 
                                  fontSize: '0.7rem',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '3px'
                                }}
                              />
                              {payment?.payment_date && (
                                <div style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '0.25rem' }}>
                                  入金日: {payment.payment_date}
                                </div>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </SecurityWrapper>
  )
}