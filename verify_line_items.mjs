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
  console.log('=== invoice_line_items DB vs CSV 検証開始 ===\n')

  // CSVを読み込み
  console.log('CSVファイルを読み込み中...')
  const csvContent = fs.readFileSync('マスタ作成用/25123695-1までの最新データ/invoice_line_items.csv', 'utf-8')
  const csvData = parseCSV(csvContent)
  console.log(`CSV件数: ${csvData.length}`)

  // DBから全件取得（ページネーション対応）
  console.log('\nDBからデータを取得中...')
  let allDbData = []
  let from = 0
  const pageSize = 1000

  while (true) {
    const { data, error } = await supabase
      .from('invoice_line_items')
      .select('id, invoice_id, line_no, sub_no, amount, unit_price, quantity, raw_label, raw_label_part, set_name, target, action1, position1')
      .range(from, from + pageSize - 1)

    if (error) {
      console.error('DB取得エラー:', error.message)
      break
    }

    if (!data || data.length === 0) break

    allDbData = allDbData.concat(data)
    from += pageSize

    if (data.length < pageSize) break
  }

  console.log(`DB件数: ${allDbData.length}`)

  // DBデータをマップ化（id をキーに）
  const dbMapById = new Map()
  allDbData.forEach(row => {
    dbMapById.set(row.id, row)
  })

  // invoice_id + line_no + sub_no でもマップ化
  const dbMapByKey = new Map()
  allDbData.forEach(row => {
    const key = `${row.invoice_id}|${row.line_no}|${row.sub_no}`
    dbMapByKey.set(key, row)
  })

  // 比較
  let matchCount = 0
  let mismatchCount = 0
  let missingInDb = 0
  const mismatches = []
  const missing = []

  for (const csvRow of csvData) {
    // まずIDで検索、なければキーで検索
    let dbRow = dbMapById.get(csvRow.id)
    if (!dbRow) {
      const key = `${csvRow.invoice_id}|${csvRow.line_no}|${csvRow.sub_no}`
      dbRow = dbMapByKey.get(key)
    }

    if (!dbRow) {
      missingInDb++
      if (missing.length < 10) {
        missing.push(`${csvRow.invoice_id} line=${csvRow.line_no} sub=${csvRow.sub_no}`)
      }
      continue
    }

    // 金額関連フィールドを比較
    const csvAmount = parseInt(csvRow.amount) || 0
    const csvUnitPrice = parseInt(csvRow.unit_price) || 0
    const csvQuantity = parseInt(csvRow.quantity) || 0

    const amountMatch = dbRow.amount === csvAmount
    const unitPriceMatch = dbRow.unit_price === csvUnitPrice
    const quantityMatch = dbRow.quantity === csvQuantity

    if (!amountMatch || !unitPriceMatch || !quantityMatch) {
      mismatchCount++
      if (mismatches.length < 10) {
        mismatches.push({
          key: `${csvRow.invoice_id} line=${csvRow.line_no} sub=${csvRow.sub_no}`,
          csv: { amount: csvAmount, unit_price: csvUnitPrice, quantity: csvQuantity },
          db: { amount: dbRow.amount, unit_price: dbRow.unit_price, quantity: dbRow.quantity }
        })
      }
    } else {
      matchCount++
    }
  }

  // 逆方向確認：DBにあってCSVにないデータ
  const csvKeySet = new Set(csvData.map(r => `${r.invoice_id}|${r.line_no}|${r.sub_no}`))
  const dbOnlyRecords = allDbData.filter(r => !csvKeySet.has(`${r.invoice_id}|${r.line_no}|${r.sub_no}`))

  // 結果表示
  console.log('\n=== 検証結果 ===')
  console.log(`CSV件数: ${csvData.length}`)
  console.log(`DB件数: ${allDbData.length}`)
  console.log(`一致: ${matchCount}`)
  console.log(`不一致: ${mismatchCount}`)
  console.log(`CSVにあってDBにない: ${missingInDb}`)
  console.log(`DBにあってCSVにない: ${dbOnlyRecords.length}`)

  if (mismatches.length > 0) {
    console.log('\n--- 不一致サンプル（最大10件） ---')
    mismatches.forEach(m => {
      console.log(`${m.key}:`)
      console.log(`  CSV: amount=${m.csv.amount}, unit_price=${m.csv.unit_price}, quantity=${m.csv.quantity}`)
      console.log(`  DB:  amount=${m.db.amount}, unit_price=${m.db.unit_price}, quantity=${m.db.quantity}`)
    })
  }

  if (missing.length > 0) {
    console.log('\n--- CSVにあってDBにないサンプル ---')
    missing.forEach(id => console.log(`  ${id}`))
    if (missingInDb > 10) console.log(`  ... 他 ${missingInDb - 10} 件`)
  }

  if (dbOnlyRecords.length > 0) {
    console.log('\n--- DBにのみ存在するレコードサンプル ---')
    dbOnlyRecords.slice(0, 10).forEach(r => {
      console.log(`  ${r.invoice_id} line=${r.line_no} sub=${r.sub_no}`)
    })
    if (dbOnlyRecords.length > 10) console.log(`  ... 他 ${dbOnlyRecords.length - 10} 件`)
  }

  // 特定のレコードを確認（22021407-1）
  console.log('\n--- 22021407-1 の確認 ---')
  const testId = '22021407-1'
  const csvTestRows = csvData.filter(r => r.invoice_id === testId)
  const dbTestRows = allDbData.filter(r => r.invoice_id === testId)

  console.log(`CSV: ${csvTestRows.length}件`)
  csvTestRows.forEach(r => {
    console.log(`  line=${r.line_no}, sub=${r.sub_no}, amount=${r.amount}, set_name="${r.set_name}", raw_label_part="${r.raw_label_part?.substring(0,30)}..."`)
  })

  console.log(`DB: ${dbTestRows.length}件`)
  dbTestRows.forEach(r => {
    console.log(`  line=${r.line_no}, sub=${r.sub_no}, amount=${r.amount}, set_name="${r.set_name || ''}", raw_label_part="${(r.raw_label_part || '').substring(0,30)}..."`)
  })

  // 最終判定
  console.log('\n=== 最終判定 ===')
  const isFullMatch = matchCount === csvData.length &&
                      missingInDb === 0 &&
                      mismatchCount === 0 &&
                      dbOnlyRecords.length === 0

  if (isFullMatch) {
    console.log('✅ 完全一致: DBとCSVは完全に一致しています')
    console.log(`   - CSV全件(${csvData.length}件)がDBに存在`)
    console.log(`   - DB全件(${allDbData.length}件)がCSVに存在`)
    console.log(`   - 全レコードの金額が一致`)
  } else {
    console.log('❌ 不一致あり: DBとCSVに差異があります')
    if (mismatchCount > 0) console.log(`   - 金額不一致: ${mismatchCount}件`)
    if (missingInDb > 0) console.log(`   - CSVにあってDBにない: ${missingInDb}件`)
    if (dbOnlyRecords.length > 0) console.log(`   - DBにあってCSVにない: ${dbOnlyRecords.length}件`)
  }
}

main().catch(console.error)
