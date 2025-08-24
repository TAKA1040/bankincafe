/**
 * パス: src/app/invoice-list/page.tsx
 * 目的: 請求書一覧画面
 */
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SecurityWrapper from '@/components/security-wrapper'

// 型定義
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

interface Customer {
  id: number
  company_name: string
  person_in_charge: string
  position: string
  phone: string
  email: string
}

interface InvoiceItem {
  id: number
  invoice_id: number
  item_type: 'individual' | 'set'
  name: string
  quantity: number
  unit_price: number
  total: number
  set_details: string
}

// データベース管理クラス
class InvoiceDB {
  customers: Customer[]
  invoices: Invoice[]
  invoiceItems: InvoiceItem[]
  currentUser: { id: string; name: string; email: string }

  constructor() {
    // サンプルデータ
    this.customers = [
      {
        id: 1,
        company_name: '株式会社UDトラックス',
        person_in_charge: '山田太郎',
        position: '部長',
        phone: '03-1234-5678',
        email: 'yamada@udtrucks.com'
      },
      {
        id: 2,
        company_name: 'DEF商事',
        person_in_charge: '佐藤花子',
        position: '課長',
        phone: '06-9876-5432',
        email: 'sato@def-trading.com'
      },
      {
        id: 3,
        company_name: 'サーバーメンテナンス',
        person_in_charge: '田中次郎',
        position: '主任',
        phone: '045-555-1234',
        email: 'tanaka@server-maint.com'
      }
    ]

    this.invoices = [
      {
        id: 1,
        invoice_no: '25050001-1',
        billing_month: 2505,
        billing_date: '2025-05-15',
        customer_id: 1,
        client_name: 'UD',
        registration_no: 'T1234567890123',
        order_no: 'ORD-001',
        internal_order_no: 'INT-001',
        subtotal: 100000,
        tax: 10000,
        total: 110000,
        status: 'finalized',
        created_by: 'user1',
        created_at: '2025-05-15T10:00:00Z',
        updated_at: '2025-05-15T10:00:00Z',
        memo: 'バンパー修理作業',
        category: 'UD',
        original_invoice_id: null
      },
      {
        id: 2,
        invoice_no: '25050002-1',
        billing_month: 2505,
        billing_date: '2025-05-20',
        customer_id: 2,
        client_name: 'DEF商事',
        registration_no: 'T9876543210987',
        order_no: 'ORD-002',
        internal_order_no: 'INT-002',
        subtotal: 50000,
        tax: 5000,
        total: 55000,
        status: 'draft',
        created_by: 'user1',
        created_at: '2025-05-20T14:00:00Z',
        updated_at: '2025-05-20T14:00:00Z',
        memo: 'フルメンテナンスセット',
        category: 'その他',
        original_invoice_id: null
      },
      {
        id: 3,
        invoice_no: '25040015-1',
        billing_month: 2504,
        billing_date: '2025-04-10',
        customer_id: 3,
        client_name: 'サーバーメンテナンス',
        registration_no: 'T1111222233334',
        order_no: 'ORD-015',
        internal_order_no: 'INT-015',
        subtotal: 80000,
        tax: 8000,
        total: 88000,
        status: 'finalized',
        created_by: 'user1',
        created_at: '2025-04-10T09:00:00Z',
        updated_at: '2025-04-10T09:00:00Z',
        memo: 'サイドパネル塗装',
        category: 'その他',
        original_invoice_id: null
      }
    ]

    this.invoiceItems = [
      {
        id: 1,
        invoice_id: 1,
        item_type: 'individual',
        name: 'バンパー修理',
        quantity: 1,
        unit_price: 100000,
        total: 100000,
        set_details: ''
      },
      {
        id: 2,
        invoice_id: 2,
        item_type: 'set',
        name: 'フルメンテナンスセット',
        quantity: 1,
        unit_price: 50000,
        total: 50000,
        set_details: 'サイドパネル塗装、バンパー点検、ライト調整'
      },
      {
        id: 3,
        invoice_id: 3,
        item_type: 'individual',
        name: 'サイドパネル塗装',
        quantity: 1,
        unit_price: 80000,
        total: 80000,
        set_details: ''
      }
    ]

    this.currentUser = { id: 'user1', name: '管理者', email: 'admin@bankin-cafe.com' }
  }

  // 赤伝処理
  createRedSlip(originalInvoiceId: number): Invoice | null {
    const originalInvoice = this.invoices.find(inv => inv.id === originalInvoiceId)
    if (!originalInvoice || originalInvoice.status !== 'finalized') return null

    // 赤伝番号生成
    const basePart = originalInvoice.invoice_no.split('-')[0]
    const redSlips = this.invoices.filter(inv => 
      inv.invoice_no.startsWith(basePart + '-R')
    )
    const redSlipCount = redSlips.length + 1
    const redSlipNumber = `${basePart}-R${redSlipCount}`
    
    const redSlip: Invoice = {
      id: Date.now(),
      invoice_no: redSlipNumber,
      billing_month: originalInvoice.billing_month,
      billing_date: new Date().toISOString().split('T')[0],
      customer_id: originalInvoice.customer_id,
      client_name: originalInvoice.client_name,
      registration_no: originalInvoice.registration_no,
      order_no: originalInvoice.order_no,
      internal_order_no: originalInvoice.internal_order_no,
      subtotal: -originalInvoice.subtotal,
      tax: -originalInvoice.tax,
      total: -originalInvoice.total,
      status: 'finalized',
      created_by: this.currentUser.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      memo: `${originalInvoice.invoice_no} の取り消し`,
      category: originalInvoice.category,
      original_invoice_id: originalInvoiceId
    }

    this.invoices.push(redSlip)

    // 元の請求書のアイテムを取得して、マイナス値で赤伝アイテムを作成
    const originalItems = this.invoiceItems.filter(item => item.invoice_id === originalInvoiceId)
    originalItems.forEach(item => {
      this.invoiceItems.push({
        id: Date.now() + Math.random(),
        invoice_id: redSlip.id,
        item_type: item.item_type,
        name: item.name,
        quantity: -item.quantity,
        unit_price: item.unit_price,
        total: -item.total,
        set_details: item.set_details
      })
    })

    // 元の請求書のステータスを取消済みに変更
    originalInvoice.status = 'canceled'
    originalInvoice.updated_at = new Date().toISOString()

    return redSlip
  }

  // 請求書削除（下書きのみ）
  deleteInvoice(invoiceId: number): void {
    this.invoices = this.invoices.filter(inv => inv.id !== invoiceId)
    this.invoiceItems = this.invoiceItems.filter(item => item.invoice_id !== invoiceId)
  }

  // 開発用: テストデータを追加
  addTestData(count: number = 50): void {
    const now = new Date()
    const yearYY = now.getFullYear() - 2000
    const month = now.getMonth() + 1
    const baseMonthNum = yearYY * 100 + month // 例: 2505
    const baseId = this.invoices.reduce((max, inv) => Math.max(max, inv.id), 0)

    for (let i = 0; i < count; i++) {
      const id = baseId + i + 1
      const cust = this.customers[Math.floor(Math.random() * this.customers.length)]
      const isUD = cust.company_name.includes('UD')
      const category = isUD ? 'UD' : 'その他'
      const billingMonth = baseMonthNum - (i % 6) // 直近6ヶ月に散らす
      const date = new Date(now.getTime() - i * 86400000)
      const billingDate = date.toISOString().split('T')[0]
      const seq = (10000 + ((this.invoices.length + i + 1) % 10000)).toString().slice(-4)
      const invoiceNo = `${billingMonth}${seq}-1`
      const subtotal = Math.floor(30000 + Math.random() * 120000)
      const tax = Math.floor(subtotal * 0.1)
      const total = subtotal + tax
      const status: Invoice['status'] = Math.random() < 0.6 ? 'finalized' : (Math.random() < 0.5 ? 'draft' : 'canceled')

      this.invoices.push({
        id,
        invoice_no: invoiceNo,
        billing_month: billingMonth,
        billing_date: billingDate,
        customer_id: cust.id,
        client_name: isUD ? 'UD' : cust.company_name,
        registration_no: 'T0000000000000',
        order_no: `ORD-T-${id}`,
        internal_order_no: `INT-T-${id}`,
        subtotal,
        tax,
        total,
        status,
        created_by: this.currentUser.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        memo: `[TEST] 追加データ ${id}`,
        category,
        original_invoice_id: null
      })

      this.invoiceItems.push({
        id: id * 100,
        invoice_id: id,
        item_type: 'individual',
        name: 'テスト作業',
        quantity: 1,
        unit_price: subtotal,
        total: subtotal,
        set_details: ''
      })
    }
  }

  // 開発用: 追加したテストデータを削除
  clearTestData(): void {
    const testIds = new Set(this.invoices.filter(inv => inv.memo?.startsWith('[TEST]')).map(inv => inv.id))
    this.invoices = this.invoices.filter(inv => !testIds.has(inv.id))
    this.invoiceItems = this.invoiceItems.filter(item => !testIds.has(item.invoice_id))
  }
}

export default function InvoiceListPage() {
  const router = useRouter()
  const [db, setDb] = useState(() => new InvoiceDB())
  const [searchKeyword, setSearchKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'finalized' | 'canceled'>('all')
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>(db.invoices)

  // データ更新用
  const updateData = () => {
    setInvoices([...db.invoices])
  }

  // 戻るボタン
  const handleBack = () => {
    router.push('/')
  }

  // 新規作成
  const handleCreateNew = () => {
    router.push('/invoice-create')
  }

  // 編集
  const handleEdit = (invoiceId: number) => {
    router.push(`/invoice-create?edit=${invoiceId}`)
  }

  // 詳細表示
  const handleViewDetail = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
  }

  // 赤伝処理
  const handleRedSlip = (invoice: Invoice) => {
    if (confirm('この請求書を赤伝で取り消しますか？\n取り消し後は元に戻せません。')) {
      const redSlip = db.createRedSlip(invoice.id)
      if (redSlip) {
        alert(`赤伝 ${redSlip.invoice_no} を作成しました`)
        updateData()
      } else {
        alert('赤伝の作成に失敗しました')
      }
    }
  }

  // 検索デバウンス・正規化・ページネーション設定
  const [debouncedSearch, setDebouncedSearch] = useState('')
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(searchKeyword), 200)
    return () => clearTimeout(id)
  }, [searchKeyword])

  const normalize = (s: string) => (s ?? '').toString().toLowerCase().normalize('NFKC')

  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 20

  // 検索キーワードやステータス変更時はページ先頭へ
  useEffect(() => { setCurrentPage(1) }, [debouncedSearch, statusFilter])

  // 月範囲フィルタ（当月/前月ボタン、from-to 入力）
  const [monthFrom, setMonthFrom] = useState<string>('')
  const [monthTo, setMonthTo] = useState<string>('')
  const ymOf = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  const handleThisMonth = () => {
    const ym = ymOf(new Date())
    setMonthFrom(ym)
    setMonthTo(ym)
  }
  const handlePrevMonth = () => {
    const d = new Date()
    d.setMonth(d.getMonth() - 1)
    const ym = ymOf(d)
    setMonthFrom(ym)
    setMonthTo(ym)
  }
  const handleClearMonth = () => {
    setMonthFrom('')
    setMonthTo('')
  }
  useEffect(() => { setCurrentPage(1) }, [monthFrom, monthTo])

  // dev用: HMR後に古いインスタンスを使い続けると新メソッドが無いことがあるためのフォールバック
  const getDb = () => {
    const hasMethods = typeof (db as any).addTestData === 'function' && typeof (db as any).clearTestData === 'function'
    if (hasMethods) return db
    const next = new InvoiceDB()
    // 既存データを引き継ぐ
    next.customers = db.customers
    next.invoices = db.invoices
    next.invoiceItems = db.invoiceItems
    setDb(next)
    return next
  }

  // テストデータ 追加/削除
  const handleAddTestData = (n: number = 50) => {
    const d = getDb()
    d.addTestData(n)
    setSelectedInvoice(null)
    updateData()
    setCurrentPage(1)
  }

  const handleClearTestData = () => {
    const d = getDb()
    d.clearTestData()
    setSelectedInvoice(null)
    updateData()
    setCurrentPage(1)
  }

  // フィルタリング（月範囲 + 複数フィールド + 正規化 + ANDマルチキーワード）
  const terms = normalize(debouncedSearch).split(/\s+/).filter(Boolean)
  const toYYMM = (ym: string | null) => {
    if (!ym) return null
    const [y, m] = ym.split('-').map(Number)
    return (y - 2000) * 100 + m
  }
  let minMonth = toYYMM(monthFrom)
  let maxMonth = toYYMM(monthTo)
  if (minMonth !== null && maxMonth !== null && minMonth > maxMonth) {
    const t = minMonth; minMonth = maxMonth; maxMonth = t
  }
  const filteredInvoices = invoices.filter(invoice => {
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter
    if (!matchesStatus) return false
    if (minMonth !== null && invoice.billing_month < minMonth) return false
    if (maxMonth !== null && invoice.billing_month > maxMonth) return false
    if (terms.length === 0) return true

    const companyName = db.customers.find(c => c.id === invoice.customer_id)?.company_name ?? ''
    const fields = [
      invoice.invoice_no,
      invoice.client_name,
      companyName,
      invoice.order_no,
      invoice.internal_order_no,
      invoice.memo
    ].map(normalize)

    return terms.every(t => fields.some(f => f.includes(t)))
  })

  // ページネーション
  const pageCount = Math.max(1, Math.ceil(filteredInvoices.length / pageSize))
  const current = Math.min(currentPage, pageCount)
  const startIndex = (current - 1) * pageSize
  const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + pageSize)
  const goPrev = () => setCurrentPage(p => Math.max(1, p - 1))
  const goNext = () => setCurrentPage(p => Math.min(pageCount, p + 1))

  // ステータス表示
  const getStatusBadge = (status: string) => {
    const styles = {
      draft: 'bg-yellow-100 text-yellow-800',
      finalized: 'bg-green-100 text-green-800', 
      canceled: 'bg-red-100 text-red-800'
    }
    const texts = {
      draft: '下書き',
      finalized: '確定済',
      canceled: '取消済'
    }
    return {
      style: styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800',
      text: texts[status as keyof typeof texts] || '不明'
    }
  }

  return (
    <SecurityWrapper requirePin={true}>
      <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '1rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* ヘッダー */}
          <div style={{ 
            background: 'white', 
            borderRadius: '8px', 
            padding: '1.5rem',
            marginBottom: '1rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>
                請求書一覧
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
            <button 
              onClick={handleCreateNew}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600'
              }}
            >
              + 新規請求書作成
            </button>
          </div>

          {/* 検索・フィルター */}
          <div style={{ 
            background: 'white', 
            borderRadius: '8px', 
            padding: '1rem',
            marginBottom: '1rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Escape') setSearchKeyword('') }}
                placeholder="請求書を検索..."
                style={{
                  flex: '1',
                  minWidth: '200px',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.9rem'
                }}
              />
              <button
                onClick={() => setSearchKeyword('')}
                disabled={!searchKeyword}
                title="検索キーワードをクリア"
                style={{
                  padding: '0.5rem 0.75rem',
                  background: searchKeyword ? '#9ca3af' : '#e5e7eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: searchKeyword ? 'pointer' : 'not-allowed',
                  fontSize: '0.8rem'
                }}
              >
                クリア
              </button>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[
                  { key: 'all', label: 'すべて' },
                  { key: 'draft', label: '下書き' },
                  { key: 'finalized', label: '確定済' },
                  { key: 'canceled', label: '取消済' }
                ].map(filter => (
                  <button
                    key={filter.key}
                    onClick={() => setStatusFilter(filter.key as any)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: statusFilter === filter.key ? '#3b82f6' : '#e5e7eb',
                      color: statusFilter === filter.key ? 'white' : '#374151',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
              {/* 月範囲フィルタ */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ color: '#374151', fontSize: '0.85rem' }}>期間</span>
                <input
                  type="month"
                  value={monthFrom}
                  onChange={(e) => setMonthFrom(e.target.value)}
                  style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.85rem' }}
                />
                <span style={{ color: '#6b7280' }}>〜</span>
                <input
                  type="month"
                  value={monthTo}
                  onChange={(e) => setMonthTo(e.target.value)}
                  style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.85rem' }}
                />
                <button onClick={handleThisMonth} style={{ padding: '0.5rem 0.75rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>当月</button>
                <button onClick={handlePrevMonth} style={{ padding: '0.5rem 0.75rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>前月</button>
                <button onClick={handleClearMonth} style={{ padding: '0.5rem 0.75rem', background: '#9ca3af', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>クリア</button>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto' }}>
                <button
                  onClick={() => handleAddTestData(50)}
                  title="テストデータを50件追加"
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#8b5cf6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}
                >
                  +50 テスト追加
                </button>
                <button
                  onClick={handleClearTestData}
                  title="追加したテストデータを削除"
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}
                >
                  テスト削除
                </button>
              </div>
            </div>
          </div>

          {/* 請求書一覧テーブル */}
          <div style={{ 
            background: 'white', 
            borderRadius: '8px', 
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            {paginatedInvoices.length === 0 ? (
              <div style={{ 
                padding: '3rem', 
                textAlign: 'center', 
                color: '#6b7280' 
              }}>
                該当する請求書がありません
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  <tr>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>日付</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>件名</th>
                    <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: '#374151' }}>金額</th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>状態</th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedInvoices.map((invoice, index) => (
                    <tr key={invoice.id} style={{
                      borderBottom: index < paginatedInvoices.length - 1 ? '1px solid #f3f4f6' : 'none',
                      background: invoice.status === 'draft' ? '#fffbeb' : 'white'
                    }}>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: '500' }}>{invoice.billing_date}</div>
                        <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                          {invoice.invoice_no}
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: '500' }}>
                          {db.customers.find(c => c.id === invoice.customer_id)?.company_name || invoice.client_name}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                          作成: {new Date(invoice.created_at).toLocaleDateString('ja-JP')}
                        </div>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '600' }}>
                        ¥{invoice.total.toLocaleString()}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        {(() => {
                          const badge = getStatusBadge(invoice.status)
                          return (
                            <span style={{
                              padding: '0.25rem 0.75rem',
                              borderRadius: '12px',
                              fontSize: '0.8rem',
                              fontWeight: '500'
                            }} className={badge.style}>
                              {badge.text}
                            </span>
                          )
                        })()}
                        {invoice.original_invoice_id && (
                          <div style={{ marginTop: '0.25rem' }}>
                            <span style={{
                              padding: '0.25rem 0.5rem',
                              borderRadius: '12px',
                              fontSize: '0.7rem',
                              background: '#fee2e2',
                              color: '#dc2626'
                            }}>
                              赤伝
                            </span>
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                          <button 
                            onClick={() => handleViewDetail(invoice)}
                            style={{
                              padding: '0.375rem 0.75rem',
                              background: '#3b82f6',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.8rem'
                            }}
                          >
                            詳細
                          </button>
                          {invoice.status === 'draft' && (
                            <button 
                              onClick={() => handleEdit(invoice.id)}
                              style={{
                                padding: '0.375rem 0.75rem',
                                background: '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.8rem'
                              }}
                            >
                              編集
                            </button>
                          )}
                          {invoice.status === 'finalized' && (
                            <button 
                              onClick={() => handleRedSlip(invoice)}
                              style={{
                                padding: '0.375rem 0.75rem',
                                background: '#dc2626',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.8rem'
                              }}
                            >
                              削除
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* ページネーション */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0' }}>
            <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
              {filteredInvoices.length} 件中 {filteredInvoices.length === 0 ? 0 : startIndex + 1} - {Math.min(startIndex + pageSize, filteredInvoices.length)} を表示
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={goPrev}
                disabled={current <= 1}
                style={{
                  padding: '0.5rem 0.75rem',
                  background: current <= 1 ? '#e5e7eb' : '#3b82f6',
                  color: current <= 1 ? '#9ca3af' : 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: current <= 1 ? 'not-allowed' : 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                前へ
              </button>
              <span style={{ fontSize: '0.9rem', color: '#374151' }}>
                {current} / {pageCount}
              </span>
              <button
                onClick={goNext}
                disabled={current >= pageCount}
                style={{
                  padding: '0.5rem 0.75rem',
                  background: current >= pageCount ? '#e5e7eb' : '#3b82f6',
                  color: current >= pageCount ? '#9ca3af' : 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: current >= pageCount ? 'not-allowed' : 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                次へ
              </button>
            </div>
          </div>

          {/* 統計情報 */}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginTop: '1.5rem'
          }}>
            {[
              { label: '全体', count: invoices.length, color: '#374151' },
              { label: '下書き', count: invoices.filter(inv => inv.status === 'draft').length, color: '#d97706' },
              { label: '確定済み', count: invoices.filter(inv => inv.status === 'finalized').length, color: '#059669' },
              { label: '取消済み', count: invoices.filter(inv => inv.status === 'canceled').length, color: '#dc2626' }
            ].map(stat => (
              <div key={stat.label} style={{ 
                background: 'white',
                borderRadius: '8px',
                padding: '1.5rem',
                textAlign: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: stat.color }}>
                  {stat.count}
                </div>
              </div>
            ))}
          </div>

          {/* 詳細モーダル（後で実装） */}
          {selectedInvoice && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '1rem'
            }}>
              <div style={{
                background: 'white',
                borderRadius: '8px',
                padding: '2rem',
                maxWidth: '800px',
                width: '100%',
                maxHeight: '80vh',
                overflow: 'auto'
              }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>
                  請求書詳細 - {selectedInvoice.invoice_no}
                </h3>
                <div style={{ marginBottom: '2rem' }}>
                  <p><strong>顧客:</strong> {selectedInvoice.client_name}</p>
                  <p><strong>請求日:</strong> {selectedInvoice.billing_date}</p>
                  <p><strong>金額:</strong> ¥{selectedInvoice.total.toLocaleString()}</p>
                  <p><strong>ステータス:</strong> {getStatusBadge(selectedInvoice.status).text}</p>
                  {selectedInvoice.memo && (
                    <p><strong>メモ:</strong> {selectedInvoice.memo}</p>
                  )}
                </div>
                <button 
                  onClick={() => setSelectedInvoice(null)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  閉じる
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </SecurityWrapper>
  )
}