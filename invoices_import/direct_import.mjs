import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { readFileSync } from 'fs'
import { parse } from 'csv-parse/sync'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function main() {
  console.log('🚀 直接データインポート開始...')
  
  // CSVファイル読み込み
  const csvContent = readFileSync('invoices_extract.csv', 'utf8')
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true
  })
  
  console.log(`📊 CSV レコード数: ${records.length}件`)
  console.log('📋 最初のレコード:', records[0])
  
  // 既存のinvoicesテーブルにデータが存在するか確認
  const { count, error: countError } = await supabase
    .from('invoices')
    .select('*', { count: 'exact', head: true })
  
  if (countError) {
    console.error('❌ テーブル確認エラー:', countError)
    return
  }
  
  console.log(`📊 既存invoicesテーブル: ${count}件`)
  
  // CSVデータを変換して既存のinvoicesテーブル形式に合わせる
  const transformedData = records.map(record => ({
    invoice_id: record['﻿invoice_id'] || record['invoice_id'],
    billing_month: record['invoice_month'],
    issue_date: record['invoice_date'],
    customer_name: record['customer_name'],
    subject: record['subject'],
    registration_number: record['registration_number'],
    purchase_order_number: record['order_number'],
    order_number: record['order_number'],
    subtotal: parseInt(record['subtotal']) || 0,
    tax: parseInt(record['tax_amount']) || 0,
    total: parseInt(record['total_amount']) || 0,
    remarks: '',
    status: record['status'] || 'finalized',
    payment_status: record['payment_status'] || 'unpaid'
  }))
  
  console.log('🔄 データ変換完了')
  console.log('📋 変換後の最初のレコード:', transformedData[0])
  
  // バッチでインポート（25件ずつ）
  const batchSize = 25
  let successCount = 0
  let errorCount = 0
  
  for (let i = 0; i < transformedData.length; i += batchSize) {
    const batch = transformedData.slice(i, i + batchSize)
    
    try {
      const { data, error } = await supabase
        .from('invoices')
        .upsert(batch, {
          onConflict: 'invoice_id',
          ignoreDuplicates: false
        })
      
      if (error) {
        console.error(`❌ バッチ${Math.floor(i/batchSize) + 1} エラー:`, error)
        errorCount += batch.length
      } else {
        console.log(`✅ バッチ${Math.floor(i/batchSize) + 1} 成功: ${batch.length}件`)
        successCount += batch.length
      }
    } catch (err) {
      console.error(`❌ バッチ${Math.floor(i/batchSize) + 1} 例外:`, err.message)
      errorCount += batch.length
    }
    
    // レート制限対策で少し待機
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  console.log(`🎉 インポート完了!`)
  console.log(`✅ 成功: ${successCount}件`)
  console.log(`❌ エラー: ${errorCount}件`)
  
  // 最終確認
  const { count: finalCount } = await supabase
    .from('invoices')
    .select('*', { count: 'exact', head: true })
  
  console.log(`📊 最終件数: ${finalCount}件`)
}

main().catch(console.error)