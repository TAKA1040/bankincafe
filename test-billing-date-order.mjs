#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://auwmmosfteomieyexkeh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1d21tb3NmdGVvbWlleWV4a2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzcxNTYsImV4cCI6MjA3MTAxMzE1Nn0.9SsGplOy1PQak1y7WLfzadvTOfm4NuuX8254lEctvj0'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log('=== 🎯 billing_date順での並び替え効果テスト ===')

// 修正後のクエリ（useInvoiceListと同じ）
const { data: testData, error: testError } = await supabase
  .from('invoices')
  .select(`
    invoice_id,
    billing_date,
    customer_name,
    invoice_line_items (
      id,
      raw_label
    )
  `)
  .order('billing_date', { ascending: false })
  // .range(0, 999)  // 1000件制限を削除

console.log('📋 修正後のクエリ結果:')
console.log('  - エラー:', testError?.message || 'なし')
console.log('  - 取得件数:', testData?.length || 0)

if (testData && testData.length > 0) {
  console.log('\n🔍 上位10件の明細状況:')
  testData.slice(0, 10).forEach((invoice, i) => {
    const itemCount = invoice.invoice_line_items?.length || 0
    const hasItems = itemCount > 0 ? '✅' : '❌'
    console.log(`  ${i + 1}. ${hasItems} ${invoice.invoice_id} (${invoice.billing_date}) - 明細${itemCount}件`)
    if (itemCount > 0 && invoice.invoice_line_items[0]) {
      console.log(`      └ "${invoice.invoice_line_items[0].raw_label}"`)
    }
  })
  
  // 統計情報
  const withItems = testData.filter(inv => (inv.invoice_line_items?.length || 0) > 0)
  const withoutItems = testData.filter(inv => (inv.invoice_line_items?.length || 0) === 0)
  
  console.log('\n📊 修正後の統計:')
  console.log(`  - 明細ありの請求書: ${withItems.length}件`)
  console.log(`  - 明細なしの請求書: ${withoutItems.length}件`) 
  console.log(`  - 明細ありの割合: ${((withItems.length / testData.length) * 100).toFixed(1)}%`)
  
  if (withItems.length > 0) {
    console.log('  - 🎉 修正成功！明細がある請求書が表示されるようになりました！')
  } else {
    console.log('  - ⚠️  まだ明細がある請求書が表示されません')
  }
}

console.log('\n=== テスト完了 ===')