#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://auwmmosfteomieyexkeh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1d21tb3NmdGVvbWlleWV4a2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzcxNTYsImV4cCI6MjA3MTAxMzE1Nn0.9SsGplOy1PQak1y7WLfzadvTOfm4NuuX8254lEctvj0'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log('=== 🎯 ページネーション方式での全件取得テスト ===')

// ページネーション方式で全件取得（フックと同じロジック）
let query = supabase
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

let joinedData = []
let currentPage = 0
const pageSize = 1000
let hasMore = true

while (hasMore) {
  const fromIndex = currentPage * pageSize
  const toIndex = fromIndex + pageSize - 1
  
  console.log(`📄 ページ${currentPage + 1}: ${fromIndex}～${toIndex}件を取得中`)
  
  const { data: pageData, error: pageError } = await query
    .range(fromIndex, toIndex)
  
  if (pageError) {
    console.error('❌ エラー:', pageError.message)
    break
  }
  
  if (pageData && pageData.length > 0) {
    joinedData = [...joinedData, ...pageData]
    console.log(`✅ ページ${currentPage + 1}取得完了: ${pageData.length}件（累計: ${joinedData.length}件）`)
    
    // 取得件数がページサイズ未満なら最後のページ
    hasMore = pageData.length === pageSize
    currentPage++
  } else {
    hasMore = false
  }
}

console.log(`\n🎯 全件取得完了: 合計${joinedData.length}件`)

// 統計情報
const withItems = joinedData.filter(inv => (inv.invoice_line_items?.length || 0) > 0)
const withoutItems = joinedData.filter(inv => (inv.invoice_line_items?.length || 0) === 0)

console.log('\n📊 結果統計:')
console.log(`  - 明細ありの請求書: ${withItems.length}件`)
console.log(`  - 明細なしの請求書: ${withoutItems.length}件`) 
console.log(`  - 明細ありの割合: ${((withItems.length / joinedData.length) * 100).toFixed(1)}%`)

if (joinedData.length > 1000) {
  console.log('  - 🎉 成功！1000件制限を突破しました！')
} else {
  console.log('  - ⚠️  まだ1000件制限に引っかかっています')
}

console.log('\n=== テスト完了 ===')