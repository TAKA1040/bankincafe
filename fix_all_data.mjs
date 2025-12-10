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
  console.log('=== 全データ修正 ===\n')

  // ========== invoices テーブル修正 ==========
  console.log('【1】invoices テーブル修正')

  const invoicesCsvContent = fs.readFileSync('マスタ作成用/25123695-1までの最新データ/invoices.csv', 'utf-8')
  const invoicesCsv = parseCSV(invoicesCsvContent)
  console.log(`CSV件数: ${invoicesCsv.length}`)

  let invoiceSuccess = 0
  let invoiceError = 0

  for (const csvRow of invoicesCsv) {
    const updateData = {
      billing_month: csvRow.invoice_month || null,
      billing_date: csvRow.invoice_date || null,
      customer_name: csvRow.customer_name || null,
      subject_name: csvRow.subject || null,
      registration_number: csvRow.registration_number || null,
      purchase_order_number: csvRow['発注番号'] || null,
      order_number: csvRow.order_number || null,
      subtotal: parseInt(csvRow.subtotal) || 0,
      tax: parseInt(csvRow.tax_amount) || 0,
      total: parseInt(csvRow.total_amount) || 0
    }

    const { error } = await supabase
      .from('invoices')
      .update(updateData)
      .eq('invoice_id', csvRow.invoice_id)

    if (error) {
      invoiceError++
      if (invoiceError <= 3) {
        console.error(`Error ${csvRow.invoice_id}:`, error.message)
      }
    } else {
      invoiceSuccess++
    }

    if ((invoiceSuccess + invoiceError) % 500 === 0) {
      console.log(`  進捗: ${invoiceSuccess + invoiceError}/${invoicesCsv.length}`)
    }
  }

  console.log(`invoices完了: 成功=${invoiceSuccess}, エラー=${invoiceError}`)

  // ========== invoice_line_items テーブル修正 ==========
  console.log('\n【2】invoice_line_items テーブル修正')

  const lineItemsCsvContent = fs.readFileSync('マスタ作成用/25123695-1までの最新データ/invoice_line_items.csv', 'utf-8')
  const lineItemsCsv = parseCSV(lineItemsCsvContent)
  console.log(`CSV件数: ${lineItemsCsv.length}`)

  let lineItemSuccess = 0
  let lineItemError = 0

  for (const csvRow of lineItemsCsv) {
    const updateData = {
      raw_label_part: csvRow.raw_label_part || null,
      action1: csvRow.action1 || null,
      action2: csvRow.action2 || null,
      action3: csvRow.action3 || null,
      target: csvRow.target || null,
      position1: csvRow.position1 || null,
      position2: csvRow.position2 || null,
      position3: csvRow.position3 || null,
      position4: csvRow.position4 || null,
      position5: csvRow.position5 || null,
      raw_label: csvRow.raw_label || null,
      unit_price: parseFloat(csvRow.unit_price) || 0,
      quantity: parseFloat(csvRow.quantity) || 0,
      amount: parseFloat(csvRow.amount) || 0,
      "other": csvRow.other || null,
      set_name: csvRow.set_name || null
    }

    const { error } = await supabase
      .from('invoice_line_items')
      .update(updateData)
      .eq('invoice_id', csvRow.invoice_id)
      .eq('line_no', parseInt(csvRow.line_no))
      .eq('sub_no', parseInt(csvRow.sub_no))

    if (error) {
      lineItemError++
      if (lineItemError <= 3) {
        console.error(`Error ${csvRow.invoice_id} line=${csvRow.line_no} sub=${csvRow.sub_no}:`, error.message)
      }
    } else {
      lineItemSuccess++
    }

    if ((lineItemSuccess + lineItemError) % 1000 === 0) {
      console.log(`  進捗: ${lineItemSuccess + lineItemError}/${lineItemsCsv.length}`)
    }
  }

  console.log(`invoice_line_items完了: 成功=${lineItemSuccess}, エラー=${lineItemError}`)

  console.log('\n=== 修正完了 ===')
}

main().catch(console.error)
