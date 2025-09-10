#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'

// 環境変数設定
const supabaseUrl = 'https://auwmmosfteomieyexkeh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1d21tb3NmdGVvbWlleWV4a2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzcxNTYsImV4cCI6MjA3MTAxMzE1Nn0.9SsGplOy1PQak1y7WLfzadvTOfm4NuuX8254lEctvj0'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log('=== 🚨 Critical Debugging: 請求書明細0件問題の根本解決 ===')

// 1. 認証なしでの直接アクセステスト
console.log('\n1. 📋 認証なしでの請求書テーブルアクセス:')
const { data: directInvoices, error: directError } = await supabase
  .from('invoices')
  .select('invoice_id, customer_name')
  .limit(3)

console.log('  - エラー:', directError?.message || 'なし')
console.log('  - 取得件数:', directInvoices?.length || 0)

// 2. JOINクエリテスト（useInvoiceListと同じクエリ）
console.log('\n2. 🔗 JOINクエリテスト（useInvoiceListと同じクエリ）:')
const { data: joinData, error: joinError } = await supabase
  .from('invoices')
  .select(`
    invoice_id,
    invoice_number,
    issue_date,
    billing_date,
    billing_month,
    customer_category,
    customer_name,
    subject_name,
    subject,
    registration_number,
    order_number,
    purchase_order_number,
    subtotal,
    tax,
    total,
    total_amount,
    status,
    payment_status,
    created_at,
    updated_at,
    invoice_line_items (
      id,
      line_no,
      task_type,
      target,
      action,
      position,
      quantity,
      unit_price,
      amount,
      raw_label,
      performed_at
    )
  `)
  .order('created_at', { ascending: false })
  .limit(5)

console.log('  - エラー:', joinError?.message || 'なし')
console.log('  - 請求書件数:', joinData?.length || 0)

if (joinData && joinData.length > 0) {
  console.log('\n3. 📄 各請求書の明細状況:')
  joinData.forEach((invoice, i) => {
    const lineItems = invoice.invoice_line_items || []
    console.log(`  請求書 ${i + 1}: ${invoice.invoice_id}`)
    console.log(`    - 顧客: ${invoice.customer_name}`)
    console.log(`    - 明細件数: ${lineItems.length}`)
    if (lineItems.length > 0) {
      console.log(`    - 明細例: "${lineItems[0].raw_label || '(ラベルなし)'}"`)
    }
  })
}

// 3. Row Level Security確認
console.log('\n4. 🔐 Row Level Security確認:')
const { data: rtsData, error: rtsError } = await supabase
  .from('invoices')
  .select('invoice_id')
  .limit(1)

console.log('  - RLS有効？:', rtsError?.message?.includes('policy') ? 'はい（エラーあり）' : 'いいえ または 許可されている')
console.log('  - アクセス可能？:', rtsData?.length > 0 ? 'はい' : 'いいえ')

// 4. 認証状態確認
console.log('\n5. 🔑 認証状態確認:')
const { data: sessionData } = await supabase.auth.getSession()
console.log('  - ログイン状態:', sessionData.session ? 'ログイン済み' : '未ログイン')
console.log('  - ユーザーEmail:', sessionData.session?.user?.email || 'なし')

console.log('\n=== 診断完了 ===')