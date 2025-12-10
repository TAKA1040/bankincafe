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

// 値の比較（型を揃えて比較）
function compareValues(csvVal, dbVal, isNumeric = false) {
  // null/undefined/空文字の正規化
  const csv = (csvVal === null || csvVal === undefined || csvVal === '') ? null : csvVal
  const db = (dbVal === null || dbVal === undefined || dbVal === '') ? null : dbVal

  if (csv === null && db === null) return true

  if (isNumeric) {
    const csvNum = parseFloat(csv) || 0
    const dbNum = parseFloat(db) || 0
    return csvNum === dbNum
  }

  return String(csv).trim() === String(db).trim()
}

async function main() {
  console.log('=== 完全検証開始 ===\n')
  console.log('全レコード・全カラムを1行ずつ比較します\n')

  // ==================== invoices ====================
  console.log('【1】invoices テーブル検証')
  console.log('─'.repeat(50))

  const invoicesCsv = parseCSV(fs.readFileSync('マスタ作成用/25123695-1までの最新データ/invoices.csv', 'utf-8'))
  console.log(`CSV件数: ${invoicesCsv.length}`)

  // DB全件取得
  let allInvoices = []
  let from = 0
  while (true) {
    const { data, error } = await supabase.from('invoices').select('*').range(from, from + 999)
    if (error) { console.error('DB取得エラー:', error); break }
    if (!data || data.length === 0) break
    allInvoices = allInvoices.concat(data)
    from += 1000
    if (data.length < 1000) break
  }
  console.log(`DB件数: ${allInvoices.length}`)

  const invoicesDbMap = new Map()
  allInvoices.forEach(r => invoicesDbMap.set(r.invoice_id, r))

  // CSVカラム -> DBカラム マッピング
  const invoiceMapping = [
    { csv: 'invoice_id', db: 'invoice_id', numeric: false },
    { csv: 'invoice_month', db: 'billing_month', numeric: false },
    { csv: 'invoice_date', db: 'billing_date', numeric: false },
    { csv: 'customer_name', db: 'customer_name', numeric: false },
    { csv: 'subject', db: 'subject_name', numeric: false },
    { csv: 'registration_number', db: 'registration_number', numeric: false },
    { csv: '発注番号', db: 'purchase_order_number', numeric: false },
    { csv: 'order_number', db: 'order_number', numeric: false },
    { csv: 'subtotal', db: 'subtotal', numeric: true },
    { csv: 'tax_amount', db: 'tax', numeric: true },
    { csv: 'total_amount', db: 'total', numeric: true }
  ]

  let invoiceMatch = 0
  let invoiceMismatch = 0
  let invoiceMissing = 0
  const invoiceErrors = []

  for (const csvRow of invoicesCsv) {
    const dbRow = invoicesDbMap.get(csvRow.invoice_id)

    if (!dbRow) {
      invoiceMissing++
      invoiceErrors.push({ id: csvRow.invoice_id, error: 'DBに存在しない' })
      continue
    }

    let allMatch = true
    const diffs = []

    for (const map of invoiceMapping) {
      const csvVal = csvRow[map.csv]
      const dbVal = dbRow[map.db]

      if (!compareValues(csvVal, dbVal, map.numeric)) {
        allMatch = false
        diffs.push({
          col: map.csv,
          csv: csvVal,
          db: dbVal
        })
      }
    }

    if (allMatch) {
      invoiceMatch++
    } else {
      invoiceMismatch++
      if (invoiceErrors.length < 10) {
        invoiceErrors.push({ id: csvRow.invoice_id, diffs })
      }
    }
  }

  // DBにあってCSVにないレコード確認
  const csvInvoiceIds = new Set(invoicesCsv.map(r => r.invoice_id))
  const dbOnlyInvoices = allInvoices.filter(r => !csvInvoiceIds.has(r.invoice_id))

  console.log(`\n検証結果:`)
  console.log(`  一致: ${invoiceMatch}`)
  console.log(`  不一致: ${invoiceMismatch}`)
  console.log(`  CSVにあってDBにない: ${invoiceMissing}`)
  console.log(`  DBにあってCSVにない: ${dbOnlyInvoices.length}`)

  if (invoiceErrors.length > 0) {
    console.log(`\n不一致サンプル:`)
    invoiceErrors.slice(0, 5).forEach(e => {
      console.log(`  ${e.id}:`)
      if (e.error) {
        console.log(`    ${e.error}`)
      } else {
        e.diffs.forEach(d => console.log(`    ${d.col}: CSV="${d.csv}" vs DB="${d.db}"`))
      }
    })
  }

  const invoicesOk = invoiceMatch === invoicesCsv.length && invoiceMissing === 0 && dbOnlyInvoices.length === 0

  // ==================== invoice_line_items ====================
  console.log('\n【2】invoice_line_items テーブル検証')
  console.log('─'.repeat(50))

  const lineItemsCsv = parseCSV(fs.readFileSync('マスタ作成用/25123695-1までの最新データ/invoice_line_items.csv', 'utf-8'))
  console.log(`CSV件数: ${lineItemsCsv.length}`)

  // DB全件取得
  let allLineItems = []
  from = 0
  while (true) {
    const { data, error } = await supabase.from('invoice_line_items').select('*').range(from, from + 999)
    if (error) { console.error('DB取得エラー:', error); break }
    if (!data || data.length === 0) break
    allLineItems = allLineItems.concat(data)
    from += 1000
    if (data.length < 1000) break
  }
  console.log(`DB件数: ${allLineItems.length}`)

  const lineItemsDbMap = new Map()
  allLineItems.forEach(r => {
    const key = `${r.invoice_id}|${r.line_no}|${r.sub_no}`
    lineItemsDbMap.set(key, r)
  })

  // CSVカラム -> DBカラム マッピング
  const lineItemMapping = [
    { csv: 'invoice_id', db: 'invoice_id', numeric: false },
    { csv: 'line_no', db: 'line_no', numeric: true },
    { csv: 'sub_no', db: 'sub_no', numeric: true },
    { csv: 'raw_label_part', db: 'raw_label_part', numeric: false },
    { csv: 'action1', db: 'action1', numeric: false },
    { csv: 'action2', db: 'action2', numeric: false },
    { csv: 'action3', db: 'action3', numeric: false },
    { csv: 'target', db: 'target', numeric: false },
    { csv: 'position1', db: 'position1', numeric: false },
    { csv: 'position2', db: 'position2', numeric: false },
    { csv: 'position3', db: 'position3', numeric: false },
    { csv: 'position4', db: 'position4', numeric: false },
    { csv: 'position5', db: 'position5', numeric: false },
    { csv: 'raw_label', db: 'raw_label', numeric: false },
    { csv: 'unit_price', db: 'unit_price', numeric: true },
    { csv: 'quantity', db: 'quantity', numeric: true },
    { csv: 'amount', db: 'amount', numeric: true },
    { csv: 'other', db: 'other', numeric: false },
    { csv: 'set_name', db: 'set_name', numeric: false }
  ]

  let lineItemMatch = 0
  let lineItemMismatch = 0
  let lineItemMissing = 0
  const lineItemErrors = []

  for (const csvRow of lineItemsCsv) {
    const key = `${csvRow.invoice_id}|${csvRow.line_no}|${csvRow.sub_no}`
    const dbRow = lineItemsDbMap.get(key)

    if (!dbRow) {
      lineItemMissing++
      if (lineItemErrors.length < 10) {
        lineItemErrors.push({ key, error: 'DBに存在しない' })
      }
      continue
    }

    let allMatch = true
    const diffs = []

    for (const map of lineItemMapping) {
      const csvVal = csvRow[map.csv]
      const dbVal = dbRow[map.db]

      if (!compareValues(csvVal, dbVal, map.numeric)) {
        allMatch = false
        diffs.push({
          col: map.csv,
          csv: csvVal,
          db: dbVal
        })
      }
    }

    if (allMatch) {
      lineItemMatch++
    } else {
      lineItemMismatch++
      if (lineItemErrors.length < 10) {
        lineItemErrors.push({ key, diffs })
      }
    }
  }

  // DBにあってCSVにないレコード確認
  const csvLineItemKeys = new Set(lineItemsCsv.map(r => `${r.invoice_id}|${r.line_no}|${r.sub_no}`))
  const dbOnlyLineItems = allLineItems.filter(r => !csvLineItemKeys.has(`${r.invoice_id}|${r.line_no}|${r.sub_no}`))

  console.log(`\n検証結果:`)
  console.log(`  一致: ${lineItemMatch}`)
  console.log(`  不一致: ${lineItemMismatch}`)
  console.log(`  CSVにあってDBにない: ${lineItemMissing}`)
  console.log(`  DBにあってCSVにない: ${dbOnlyLineItems.length}`)

  if (lineItemErrors.length > 0) {
    console.log(`\n不一致サンプル:`)
    lineItemErrors.slice(0, 5).forEach(e => {
      console.log(`  ${e.key}:`)
      if (e.error) {
        console.log(`    ${e.error}`)
      } else {
        e.diffs.forEach(d => console.log(`    ${d.col}: CSV="${String(d.csv).substring(0,30)}" vs DB="${String(d.db).substring(0,30)}"`))
      }
    })
  }

  const lineItemsOk = lineItemMatch === lineItemsCsv.length && lineItemMissing === 0 && dbOnlyLineItems.length === 0

  // ==================== 特定レコード確認 ====================
  console.log('\n【3】サンプルレコード詳細確認')
  console.log('─'.repeat(50))

  const testIds = ['22021407-1', '21101290-1', '25123695-1']
  for (const testId of testIds) {
    const csvInv = invoicesCsv.find(r => r.invoice_id === testId)
    const dbInv = invoicesDbMap.get(testId)

    console.log(`\n${testId}:`)
    if (csvInv && dbInv) {
      console.log(`  CSV: subtotal=${csvInv.subtotal}, tax=${csvInv.tax_amount}, total=${csvInv.total_amount}`)
      console.log(`  DB:  subtotal=${dbInv.subtotal}, tax=${dbInv.tax}, total=${dbInv.total}`)
      const match = compareValues(csvInv.subtotal, dbInv.subtotal, true) &&
                    compareValues(csvInv.tax_amount, dbInv.tax, true) &&
                    compareValues(csvInv.total_amount, dbInv.total, true)
      console.log(`  金額一致: ${match ? '✅' : '❌'}`)
    } else {
      console.log(`  CSV: ${csvInv ? '存在' : '存在しない'}`)
      console.log(`  DB:  ${dbInv ? '存在' : '存在しない'}`)
    }
  }

  // ==================== 最終判定 ====================
  console.log('\n' + '═'.repeat(50))
  console.log('最終判定')
  console.log('═'.repeat(50))

  console.log(`\ninvoices (${invoicesCsv.length}件):`)
  console.log(`  CSV全件がDBに存在: ${invoiceMissing === 0 ? '✅' : '❌'}`)
  console.log(`  DB全件がCSVに存在: ${dbOnlyInvoices.length === 0 ? '✅' : '❌'}`)
  console.log(`  全カラム一致: ${invoiceMismatch === 0 ? '✅' : '❌'}`)
  console.log(`  結果: ${invoicesOk ? '✅ 完全一致' : '❌ 不一致あり'}`)

  console.log(`\ninvoice_line_items (${lineItemsCsv.length}件):`)
  console.log(`  CSV全件がDBに存在: ${lineItemMissing === 0 ? '✅' : '❌'}`)
  console.log(`  DB全件がCSVに存在: ${dbOnlyLineItems.length === 0 ? '✅' : '❌'}`)
  console.log(`  全カラム一致: ${lineItemMismatch === 0 ? '✅' : '❌'}`)
  console.log(`  結果: ${lineItemsOk ? '✅ 完全一致' : '❌ 不一致あり'}`)

  console.log('\n' + '═'.repeat(50))
  if (invoicesOk && lineItemsOk) {
    console.log('✅ 全データ完全一致')
    console.log('CSVの全' + invoicesCsv.length + '件のinvoicesと')
    console.log('CSVの全' + lineItemsCsv.length + '件のinvoice_line_itemsが')
    console.log('DBと1行ずつ全カラム一致しています')
  } else {
    console.log('❌ 不一致があります')
  }
  console.log('═'.repeat(50))
}

main().catch(console.error)
