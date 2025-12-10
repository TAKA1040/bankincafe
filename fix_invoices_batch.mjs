import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'

const envContent = fs.readFileSync('.env.local', 'utf-8')
const env = {}
envContent.split('\n').forEach(line => {
  const [key, ...vals] = line.split('=')
  if (key && vals.length) env[key.trim()] = vals.join('=').trim()
})

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

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
  const batchNum = parseInt(process.argv[2]) || 1
  const batchSize = 500
  const start = (batchNum - 1) * batchSize
  const end = batchNum * batchSize

  console.log(`=== invoices バッチ ${batchNum}: ${start}〜${end} ===`)

  const csvContent = fs.readFileSync('マスタ作成用/25123695-1までの最新データ/invoices.csv', 'utf-8')
  const csvData = parseCSV(csvContent)

  const batchData = csvData.slice(start, end)
  console.log(`処理件数: ${batchData.length}`)

  if (batchData.length === 0) {
    console.log('処理するデータがありません')
    return
  }

  let success = 0
  let errors = 0

  for (const csvRow of batchData) {
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
      errors++
      if (errors <= 3) console.error(`Error: ${csvRow.invoice_id}`, error.message)
    } else {
      success++
    }

    if ((success + errors) % 100 === 0) {
      console.log(`  ${success + errors}/${batchData.length}`)
    }
  }

  console.log(`完了: 成功=${success}, エラー=${errors}`)
}

main().catch(console.error)
