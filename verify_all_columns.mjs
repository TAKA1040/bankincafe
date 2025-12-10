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

// 値の正規化（比較用）
function normalize(val) {
  if (val === null || val === undefined || val === '') return ''
  if (typeof val === 'number') return val.toString()
  // 小数点を含む数値文字列を整数に
  const str = val.toString().trim()
  if (/^\d+\.0+$/.test(str)) return parseInt(str).toString()
  if (/^\d+\.\d+$/.test(str)) return parseFloat(str).toString()
  return str
}

async function main() {
  console.log('=== 全カラム完全検証 ===\n')

  // ========== invoices テーブル ==========
  console.log('【1】invoices テーブル検証')

  const invoicesCsvContent = fs.readFileSync('マスタ作成用/25123695-1までの最新データ/invoices.csv', 'utf-8')
  const invoicesCsv = parseCSV(invoicesCsvContent)
  console.log(`CSV件数: ${invoicesCsv.length}`)

  // DB全件取得
  let allInvoices = []
  let from = 0
  while (true) {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .range(from, from + 999)
    if (error || !data || data.length === 0) break
    allInvoices = allInvoices.concat(data)
    from += 1000
    if (data.length < 1000) break
  }
  console.log(`DB件数: ${allInvoices.length}`)

  // マップ化
  const invoicesDbMap = new Map()
  allInvoices.forEach(r => invoicesDbMap.set(r.invoice_id, r))

  // 比較するカラム（CSVヘッダーとDBカラムのマッピング）
  const invoiceColMap = {
    'invoice_id': 'invoice_id',
    'invoice_month': 'billing_month',
    'invoice_date': 'billing_date',
    'customer_name': 'customer_name',
    'subject': 'subject_name',
    'registration_number': 'registration_number',
    '発注番号': 'purchase_order_number',
    'order_number': 'order_number',
    'subtotal': 'subtotal',
    'tax_amount': 'tax',
    'total_amount': 'total'
  }

  let invoiceMatch = 0
  let invoiceMismatch = 0
  let invoiceMissing = 0
  const invoiceDiffs = []

  for (const csvRow of invoicesCsv) {
    const dbRow = invoicesDbMap.get(csvRow.invoice_id)
    if (!dbRow) {
      invoiceMissing++
      continue
    }

    let rowMatch = true
    const diffs = []

    for (const [csvCol, dbCol] of Object.entries(invoiceColMap)) {
      const csvVal = normalize(csvRow[csvCol])
      const dbVal = normalize(dbRow[dbCol])

      // 日付の比較は特殊処理
      if (csvCol === 'invoice_date' && csvVal && dbVal) {
        const csvDate = csvVal.replace(/\//g, '-')
        if (csvDate !== dbVal && csvVal !== dbVal) {
          rowMatch = false
          diffs.push({ col: csvCol, csv: csvVal, db: dbVal })
        }
        continue
      }

      if (csvVal !== dbVal) {
        rowMatch = false
        diffs.push({ col: csvCol, csv: csvVal, db: dbVal })
      }
    }

    if (rowMatch) {
      invoiceMatch++
    } else {
      invoiceMismatch++
      if (invoiceDiffs.length < 5) {
        invoiceDiffs.push({ id: csvRow.invoice_id, diffs })
      }
    }
  }

  console.log(`一致: ${invoiceMatch}`)
  console.log(`不一致: ${invoiceMismatch}`)
  console.log(`DBに存在しない: ${invoiceMissing}`)

  if (invoiceDiffs.length > 0) {
    console.log('\n不一致サンプル:')
    invoiceDiffs.forEach(d => {
      console.log(`  ${d.id}:`)
      d.diffs.forEach(diff => console.log(`    ${diff.col}: CSV="${diff.csv}" vs DB="${diff.db}"`))
    })
  }

  // ========== invoice_line_items テーブル ==========
  console.log('\n【2】invoice_line_items テーブル検証')

  const lineItemsCsvContent = fs.readFileSync('マスタ作成用/25123695-1までの最新データ/invoice_line_items.csv', 'utf-8')
  const lineItemsCsv = parseCSV(lineItemsCsvContent)
  console.log(`CSV件数: ${lineItemsCsv.length}`)

  // DB全件取得
  let allLineItems = []
  from = 0
  while (true) {
    const { data, error } = await supabase
      .from('invoice_line_items')
      .select('*')
      .range(from, from + 999)
    if (error || !data || data.length === 0) break
    allLineItems = allLineItems.concat(data)
    from += 1000
    if (data.length < 1000) break
  }
  console.log(`DB件数: ${allLineItems.length}`)

  // マップ化（invoice_id + line_no + sub_no）
  const lineItemsDbMap = new Map()
  allLineItems.forEach(r => {
    const key = `${r.invoice_id}|${r.line_no}|${r.sub_no}`
    lineItemsDbMap.set(key, r)
  })

  // 比較するカラム
  const lineItemColMap = {
    'invoice_id': 'invoice_id',
    'line_no': 'line_no',
    'sub_no': 'sub_no',
    'raw_label_part': 'raw_label_part',
    'action1': 'action1',
    'action2': 'action2',
    'action3': 'action3',
    'target': 'target',
    'position1': 'position1',
    'position2': 'position2',
    'position3': 'position3',
    'position4': 'position4',
    'position5': 'position5',
    'raw_label': 'raw_label',
    'unit_price': 'unit_price',
    'quantity': 'quantity',
    'amount': 'amount',
    'other': 'other',
    'set_name': 'set_name'
  }

  let lineItemMatch = 0
  let lineItemMismatch = 0
  let lineItemMissing = 0
  const lineItemDiffs = []
  const diffColumns = new Map() // どのカラムで差異が多いか

  for (const csvRow of lineItemsCsv) {
    const key = `${csvRow.invoice_id}|${csvRow.line_no}|${csvRow.sub_no}`
    const dbRow = lineItemsDbMap.get(key)

    if (!dbRow) {
      lineItemMissing++
      continue
    }

    let rowMatch = true
    const diffs = []

    for (const [csvCol, dbCol] of Object.entries(lineItemColMap)) {
      let csvVal = normalize(csvRow[csvCol])
      let dbVal = normalize(dbRow[dbCol])

      // 数値カラムの比較
      if (['line_no', 'sub_no', 'unit_price', 'quantity', 'amount'].includes(csvCol)) {
        csvVal = parseFloat(csvVal) || 0
        dbVal = parseFloat(dbVal) || 0
        if (csvVal !== dbVal) {
          rowMatch = false
          diffs.push({ col: csvCol, csv: csvVal, db: dbVal })
          diffColumns.set(csvCol, (diffColumns.get(csvCol) || 0) + 1)
        }
        continue
      }

      if (csvVal !== dbVal) {
        rowMatch = false
        diffs.push({ col: csvCol, csv: csvVal.substring(0, 30), db: (dbVal || '').substring(0, 30) })
        diffColumns.set(csvCol, (diffColumns.get(csvCol) || 0) + 1)
      }
    }

    if (rowMatch) {
      lineItemMatch++
    } else {
      lineItemMismatch++
      if (lineItemDiffs.length < 5) {
        lineItemDiffs.push({ key, diffs })
      }
    }
  }

  console.log(`一致: ${lineItemMatch}`)
  console.log(`不一致: ${lineItemMismatch}`)
  console.log(`DBに存在しない: ${lineItemMissing}`)

  if (diffColumns.size > 0) {
    console.log('\nカラム別差異件数:')
    Array.from(diffColumns.entries())
      .sort((a, b) => b[1] - a[1])
      .forEach(([col, count]) => console.log(`  ${col}: ${count}件`))
  }

  if (lineItemDiffs.length > 0) {
    console.log('\n不一致サンプル:')
    lineItemDiffs.forEach(d => {
      console.log(`  ${d.key}:`)
      d.diffs.forEach(diff => console.log(`    ${diff.col}: CSV="${diff.csv}" vs DB="${diff.db}"`))
    })
  }

  // 最終判定
  console.log('\n========== 最終判定 ==========')
  const invoicesOk = invoiceMatch === invoicesCsv.length && invoiceMissing === 0
  const lineItemsOk = lineItemMatch === lineItemsCsv.length && lineItemMissing === 0

  console.log(`invoices: ${invoicesOk ? '✅ 完全一致' : '❌ 不一致あり'}`)
  console.log(`invoice_line_items: ${lineItemsOk ? '✅ 完全一致' : '❌ 不一致あり'}`)

  if (invoicesOk && lineItemsOk) {
    console.log('\n✅ 全データ完全一致: CSVとDBは1行ずつ全カラムが一致しています')
  } else {
    console.log('\n❌ 差異があります')
  }
}

main().catch(console.error)
