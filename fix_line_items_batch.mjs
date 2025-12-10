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
  const batchSize = 1000
  const start = (batchNum - 1) * batchSize
  const end = batchNum * batchSize

  console.log(`=== バッチ ${batchNum}: ${start}〜${end} ===`)

  const csvContent = fs.readFileSync('マスタ作成用/25123695-1までの最新データ/invoice_line_items.csv', 'utf-8')
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
      other: csvRow.other || null,
      set_name: csvRow.set_name || null
    }

    const { error } = await supabase
      .from('invoice_line_items')
      .update(updateData)
      .eq('invoice_id', csvRow.invoice_id)
      .eq('line_no', parseInt(csvRow.line_no))
      .eq('sub_no', parseInt(csvRow.sub_no))

    if (error) {
      errors++
      if (errors <= 3) console.error(`Error: ${csvRow.invoice_id}`, error.message)
    } else {
      success++
    }

    if ((success + errors) % 200 === 0) {
      console.log(`  ${success + errors}/${batchData.length}`)
    }
  }

  console.log(`完了: 成功=${success}, エラー=${errors}`)
}

main().catch(console.error)
