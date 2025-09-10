#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://auwmmosfteomieyexkeh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1d21tb3NmdGVvbWlleWV4a2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzcxNTYsImV4cCI6MjA3MTAxMzE1Nn0.9SsGplOy1PQak1y7WLfzadvTOfm4NuuX8254lEctvj0'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log('=== 🕵️ 並び順・1000件制限の影響調査 ===')

// 1. 明細がある請求書の作成日時確認
console.log('\n1. 📅 明細がある請求書の作成日時:')
const invoicesWithItems = ['25043369-1', '25043370-1', '25043371-1', '25043372-1', '25043373-1']

for (const id of invoicesWithItems.slice(0, 3)) {
  const { data: invoice } = await supabase
    .from('invoices')
    .select('invoice_id, created_at, billing_date')
    .eq('invoice_id', id)
    .single()
  
  console.log(`  ${id}: 作成日=${invoice?.created_at || 'null'}, 請求日=${invoice?.billing_date || 'null'}`)
}

// 2. 最新1000件のrange確認
console.log('\n2. 🔍 最新1000件の範囲確認:')
const { data: top1000, error: topError } = await supabase
  .from('invoices')
  .select('invoice_id, created_at')
  .order('created_at', { ascending: false })
  // .range(0, 999) // 1000件制限を削除

console.log('  - エラー:', topError?.message || 'なし')
console.log('  - 取得件数:', top1000?.length || 0)
if (top1000 && top1000.length > 0) {
  console.log('  - 最新:', top1000[0].invoice_id, top1000[0].created_at)
  console.log('  - 最古:', top1000[top1000.length - 1].invoice_id, top1000[top1000.length - 1].created_at)
}

// 3. 明細がある請求書が1000件に含まれるかチェック
console.log('\n3. ✅ 明細がある請求書が1000件に含まれるか:')
const top1000Ids = new Set(top1000?.map(i => i.invoice_id) || [])
for (const id of invoicesWithItems.slice(0, 3)) {
  const isIncluded = top1000Ids.has(id)
  console.log(`  ${id}: ${isIncluded ? '✅ 含まれる' : '❌ 除外されている'}`)
}

// 4. 明細数による統計
console.log('\n4. 📊 明細数による統計（1000件制限内）:')
const { data: invoicesWithJoin } = await supabase
  .from('invoices')
  .select(`
    invoice_id,
    created_at,
    invoice_line_items(id)
  `)
  .order('created_at', { ascending: false })
  // .range(0, 999) // 1000件制限を削除

if (invoicesWithJoin) {
  const withItems = invoicesWithJoin.filter(inv => inv.invoice_line_items?.length > 0)
  const withoutItems = invoicesWithJoin.filter(inv => !inv.invoice_line_items || inv.invoice_line_items.length === 0)
  
  console.log(`  - 明細ありの請求書: ${withItems.length}件`)
  console.log(`  - 明細なしの請求書: ${withoutItems.length}件`)
  console.log(`  - 明細ありの割合: ${((withItems.length / invoicesWithJoin.length) * 100).toFixed(1)}%`)
}

console.log('\n=== 調査完了 ===')