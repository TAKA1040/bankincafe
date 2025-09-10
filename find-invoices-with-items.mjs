#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://auwmmosfteomieyexkeh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1d21tb3NmdGVvbWlleWV4a2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzcxNTYsImV4cCI6MjA3MTAxMzE1Nn0.9SsGplOy1PQak1y7WLfzadvTOfm4NuuX8254lEctvj0'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log('=== 🔍 明細が存在する請求書を検索 ===')

// 明細テーブルから請求書IDを逆引き
const { data: lineItems, error: lineError } = await supabase
  .from('invoice_line_items')
  .select('invoice_id, raw_label')
  .limit(10)

console.log('📋 明細テーブルの状況:')
console.log('  - エラー:', lineError?.message || 'なし')
console.log('  - 明細件数:', lineItems?.length || 0)

if (lineItems && lineItems.length > 0) {
  console.log('\n📄 明細が存在する請求書ID:')
  const invoiceIds = [...new Set(lineItems.map(item => item.invoice_id))]
  invoiceIds.forEach((id, i) => {
    console.log(`  ${i + 1}. ${id}`)
  })

  // 明細がある請求書でJOINテスト
  console.log('\n🔗 明細がある請求書でJOINテスト:')
  const testId = invoiceIds[0]
  console.log(`テスト対象: ${testId}`)
  
  const { data: testInvoice, error: testError } = await supabase
    .from('invoices')
    .select(`
      invoice_id,
      customer_name,
      invoice_line_items (
        id,
        raw_label,
        task_type
      )
    `)
    .eq('invoice_id', testId)
    .single()

  console.log('  - エラー:', testError?.message || 'なし')
  console.log('  - 取得できた明細:', testInvoice?.invoice_line_items?.length || 0)
  
  if (testInvoice?.invoice_line_items?.length > 0) {
    console.log('  - 明細例:')
    testInvoice.invoice_line_items.forEach((item, i) => {
      console.log(`    ${i + 1}. ${item.raw_label}`)
    })
  }
}

console.log('\n=== 検索完了 ===')