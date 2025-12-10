import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'

// 環境変数読み込み
const envContent = fs.readFileSync('.env.local', 'utf-8')
const env = {}
envContent.split('\n').forEach(line => {
  const [key, ...vals] = line.split('=')
  if (key && vals.length) env[key.trim()] = vals.join('=').trim()
})

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

// CSVを読み込んでパース
function parseCSV(content) {
  const lines = content.split('\n')
  const headers = lines[0].split(',')
  const data = []

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue

    const values = []
    let current = ''
    let inQuotes = false

    for (const char of lines[i]) {
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        values.push(current)
        current = ''
      } else {
        current += char
      }
    }
    values.push(current)

    const row = {}
    headers.forEach((h, idx) => {
      row[h.trim()] = values[idx]?.trim() || ''
    })
    data.push(row)
  }

  return data
}

async function main() {
  console.log('=== quantity/amount差異の詳細確認 ===\n')

  // CSVを読み込み
  const csvContent = fs.readFileSync('マスタ作成用/25123695-1までの最新データ/invoice_line_items.csv', 'utf-8')
  const csvData = parseCSV(csvContent)

  // 不一致のあったinvoice_idをリストアップ
  const problemInvoices = [
    '21111329-1', '21111335-1', '21111732-2', '21111733-2', '21111734-2'
  ]

  for (const invoiceId of problemInvoices) {
    console.log(`\n=== ${invoiceId} ===`)

    // CSVから該当請求書の全明細を取得
    const csvRows = csvData.filter(r => r.invoice_id === invoiceId)
    console.log('CSV:')
    csvRows.forEach(r => {
      console.log(`  line=${r.line_no}, sub=${r.sub_no}, amount=${r.amount}, quantity=${r.quantity}, unit_price=${r.unit_price}, raw_label="${(r.raw_label || '').substring(0,40)}..."`)
    })

    // DBから取得
    const { data: dbRows } = await supabase
      .from('invoice_line_items')
      .select('line_no, sub_no, amount, quantity, unit_price, raw_label')
      .eq('invoice_id', invoiceId)
      .order('line_no')
      .order('sub_no')

    console.log('DB:')
    dbRows?.forEach(r => {
      console.log(`  line=${r.line_no}, sub=${r.sub_no}, amount=${r.amount}, quantity=${r.quantity}, unit_price=${r.unit_price}, raw_label="${(r.raw_label || '').substring(0,40)}..."`)
    })

    // invoicesテーブルの金額も確認
    const { data: invoice } = await supabase
      .from('invoices')
      .select('subtotal, tax, total')
      .eq('invoice_id', invoiceId)
      .single()

    console.log('invoices:')
    console.log(`  subtotal=${invoice?.subtotal}, tax=${invoice?.tax}, total=${invoice?.total}`)
  }

  // CSVでamount=0のレコード数を確認
  const zeroAmountInCsv = csvData.filter(r => parseFloat(r.amount) === 0).length
  console.log(`\n\nCSVでamount=0のレコード数: ${zeroAmountInCsv}`)

  // その中でquantity=0のレコード
  const zeroAmountZeroQty = csvData.filter(r => parseFloat(r.amount) === 0 && parseFloat(r.quantity) === 0).length
  console.log(`その中でquantity=0: ${zeroAmountZeroQty}`)
}

main().catch(console.error)
