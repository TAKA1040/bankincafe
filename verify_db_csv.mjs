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
  console.log('=== DB vs CSV 検証開始 ===\n')

  // CSVを読み込み
  console.log('CSVファイルを読み込み中...')
  const csvContent = fs.readFileSync('マスタ作成用/25123695-1までの最新データ/invoices.csv', 'utf-8')
  const csvData = parseCSV(csvContent)
  console.log(`CSV件数: ${csvData.length}`)

  // DBから全件取得（ページネーション対応）
  console.log('\nDBからデータを取得中...')
  let allDbData = []
  let from = 0
  const pageSize = 1000

  while (true) {
    const { data, error } = await supabase
      .from('invoices')
      .select('invoice_id, subtotal, tax, total')
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

  // DBデータをマップ化
  const dbMap = new Map()
  allDbData.forEach(row => {
    dbMap.set(row.invoice_id, row)
  })

  // 比較
  let matchCount = 0
  let mismatchCount = 0
  let missingInDb = 0
  const mismatches = []
  const missing = []

  for (const csvRow of csvData) {
    const dbRow = dbMap.get(csvRow.invoice_id)

    if (!dbRow) {
      missingInDb++
      missing.push(csvRow.invoice_id)
      continue
    }

    const csvSubtotal = parseInt(csvRow.subtotal) || 0
    const csvTax = parseInt(csvRow.tax_amount) || 0
    const csvTotal = parseInt(csvRow.total_amount) || 0

    if (dbRow.subtotal !== csvSubtotal ||
        dbRow.tax !== csvTax ||
        dbRow.total !== csvTotal) {
      mismatchCount++
      if (mismatches.length < 10) {
        mismatches.push({
          invoice_id: csvRow.invoice_id,
          csv: { subtotal: csvSubtotal, tax: csvTax, total: csvTotal },
          db: { subtotal: dbRow.subtotal, tax: dbRow.tax, total: dbRow.total }
        })
      }
    } else {
      matchCount++
    }
  }

  // 結果表示
  console.log('\n=== 検証結果 ===')
  console.log(`CSV件数: ${csvData.length}`)
  console.log(`DB件数: ${allDbData.length}`)
  console.log(`一致: ${matchCount}`)
  console.log(`不一致: ${mismatchCount}`)
  console.log(`DBに存在しない: ${missingInDb}`)

  if (mismatches.length > 0) {
    console.log('\n--- 不一致サンプル（最大10件） ---')
    mismatches.forEach(m => {
      console.log(`${m.invoice_id}:`)
      console.log(`  CSV: subtotal=${m.csv.subtotal}, tax=${m.csv.tax}, total=${m.csv.total}`)
      console.log(`  DB:  subtotal=${m.db.subtotal}, tax=${m.db.tax}, total=${m.db.total}`)
    })
  }

  if (missing.length > 0) {
    console.log('\n--- DBに存在しないサンプル（最大10件） ---')
    missing.slice(0, 10).forEach(id => console.log(`  ${id}`))
  }

  // 特定のレコードを確認（22021407-1）
  console.log('\n--- 22021407-1 の確認 ---')
  const testId = '22021407-1'
  const csvTest = csvData.find(r => r.invoice_id === testId)
  const dbTest = dbMap.get(testId)

  if (csvTest) {
    console.log(`CSV: subtotal=${csvTest.subtotal}, tax=${csvTest.tax_amount}, total=${csvTest.total_amount}`)
  } else {
    console.log('CSV: 存在しない')
  }

  if (dbTest) {
    console.log(`DB:  subtotal=${dbTest.subtotal}, tax=${dbTest.tax}, total=${dbTest.total}`)
  } else {
    console.log('DB: 存在しない')
  }

  // 逆方向確認：DBにあってCSVにないデータ
  const csvIdSet = new Set(csvData.map(r => r.invoice_id))
  const dbOnlyRecords = allDbData.filter(r => !csvIdSet.has(r.invoice_id))

  console.log('\n--- DBにのみ存在するレコード ---')
  console.log(`件数: ${dbOnlyRecords.length}`)
  if (dbOnlyRecords.length > 0 && dbOnlyRecords.length <= 10) {
    dbOnlyRecords.forEach(r => console.log(`  ${r.invoice_id}`))
  } else if (dbOnlyRecords.length > 10) {
    dbOnlyRecords.slice(0, 10).forEach(r => console.log(`  ${r.invoice_id}`))
    console.log(`  ... 他 ${dbOnlyRecords.length - 10} 件`)
  }

  // 判定
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
