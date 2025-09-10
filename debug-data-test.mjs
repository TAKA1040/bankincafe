#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://auwmmosfteomieyexkeh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1d21tb3NmdGVvbWlleWV4a2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzcxNTYsImV4cCI6MjA3MTAxMzE1Nn0.9SsGplOy1PQak1y7WLfzadvTOfm4NuuX8254lEctvj0'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log('=== 🔍 データベース診断テスト ===')

// 1. 請求書テーブルのデータ件数確認
const { data: invoices, error: invoiceError, count: invoiceCount } = await supabase
  .from('invoices')
  .select('*', { count: 'exact' })
  .limit(5)

console.log('📋 Invoices テーブル:')
console.log('  - 件数:', invoiceCount)
console.log('  - エラー:', invoiceError?.message || 'なし')
console.log('  - サンプルデータ(5件):')
invoices?.forEach((inv, i) => {
  console.log(`    ${i+1}. ID: ${inv.invoice_id}, Customer: ${inv.customer_name}`)
})

// 2. 請求書明細テーブルのデータ件数確認  
const { data: lineItems, error: lineError, count: lineCount } = await supabase
  .from('invoice_line_items')
  .select('*', { count: 'exact' })
  .limit(5)

console.log('\n📄 Invoice Line Items テーブル:')
console.log('  - 件数:', lineCount)
console.log('  - エラー:', lineError?.message || 'なし')
console.log('  - サンプルデータ(5件):')
lineItems?.forEach((item, i) => {
  console.log(`    ${i+1}. Invoice: ${item.invoice_id}, Label: ${item.raw_label}`)
})

// 3. JOIN クエリのテスト（useInvoiceListと同じクエリ）
console.log('\n🔗 JOIN クエリテスト (useInvoiceListと同じクエリ):')
const { data: joinedData, error: joinError } = await supabase
  .from('invoices')
  .select(`
    invoice_id,
    customer_name,
    invoice_line_items (
      id,
      line_no,
      task_type,
      raw_label
    )
  `)
  .limit(3)

console.log('  - エラー:', joinError?.message || 'なし')
console.log('  - 結果:')
joinedData?.forEach((invoice, i) => {
  console.log(`    ${i+1}. ${invoice.invoice_id} (${invoice.customer_name})`)
  console.log(`       明細件数: ${invoice.invoice_line_items?.length || 0}`)
  invoice.invoice_line_items?.forEach((item, j) => {
    console.log(`         ${j+1}. ${item.raw_label || 'ラベルなし'}`)
  })
})