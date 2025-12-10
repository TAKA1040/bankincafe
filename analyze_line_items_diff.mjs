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
  console.log('=== 114件の不一致を詳細分析 ===\n')

  // CSVを読み込み
  const csvContent = fs.readFileSync('マスタ作成用/25123695-1までの最新データ/invoice_line_items.csv', 'utf-8')
  const csvData = parseCSV(csvContent)

  // DBから全件取得
  let allDbData = []
  let from = 0
  const pageSize = 1000

  while (true) {
    const { data, error } = await supabase
      .from('invoice_line_items')
      .select('id, invoice_id, line_no, sub_no, amount, unit_price, quantity')
      .range(from, from + pageSize - 1)

    if (error) break
    if (!data || data.length === 0) break
    allDbData = allDbData.concat(data)
    from += pageSize
    if (data.length < pageSize) break
  }

  // DBデータをマップ化
  const dbMapByKey = new Map()
  allDbData.forEach(row => {
    const key = `${row.invoice_id}|${row.line_no}|${row.sub_no}`
    dbMapByKey.set(key, row)
  })

  // 不一致の詳細を分析
  const diffTypes = {
    quantityOnly: [],       // quantityのみ違う
    amountOnly: [],         // amountのみ違う
    unitPriceOnly: [],      // unit_priceのみ違う
    multiple: [],           // 複数フィールドが違う
    amountAffected: []      // 金額に影響がある不一致
  }

  for (const csvRow of csvData) {
    const key = `${csvRow.invoice_id}|${csvRow.line_no}|${csvRow.sub_no}`
    const dbRow = dbMapByKey.get(key)

    if (!dbRow) continue

    const csvAmount = parseInt(csvRow.amount) || 0
    const csvUnitPrice = parseInt(csvRow.unit_price) || 0
    const csvQuantity = parseInt(csvRow.quantity) || 0

    const amountDiff = dbRow.amount !== csvAmount
    const unitPriceDiff = dbRow.unit_price !== csvUnitPrice
    const quantityDiff = dbRow.quantity !== csvQuantity

    if (!amountDiff && !unitPriceDiff && !quantityDiff) continue

    const diffInfo = {
      key,
      csv: { amount: csvAmount, unit_price: csvUnitPrice, quantity: csvQuantity },
      db: { amount: dbRow.amount, unit_price: dbRow.unit_price, quantity: dbRow.quantity }
    }

    // 金額に影響があるか
    if (amountDiff) {
      diffTypes.amountAffected.push(diffInfo)
    }

    // 差異のタイプ分類
    const diffCount = [amountDiff, unitPriceDiff, quantityDiff].filter(Boolean).length
    if (diffCount === 1) {
      if (quantityDiff) diffTypes.quantityOnly.push(diffInfo)
      else if (amountDiff) diffTypes.amountOnly.push(diffInfo)
      else if (unitPriceDiff) diffTypes.unitPriceOnly.push(diffInfo)
    } else {
      diffTypes.multiple.push(diffInfo)
    }
  }

  console.log('=== 不一致の分類 ===')
  console.log(`quantityのみ違う: ${diffTypes.quantityOnly.length}件`)
  console.log(`amountのみ違う: ${diffTypes.amountOnly.length}件`)
  console.log(`unit_priceのみ違う: ${diffTypes.unitPriceOnly.length}件`)
  console.log(`複数フィールドが違う: ${diffTypes.multiple.length}件`)
  console.log(``)
  console.log(`【重要】金額(amount)に影響がある不一致: ${diffTypes.amountAffected.length}件`)

  if (diffTypes.amountAffected.length > 0) {
    console.log('\n--- 金額に影響がある不一致の詳細 ---')
    diffTypes.amountAffected.slice(0, 20).forEach(d => {
      console.log(`${d.key}:`)
      console.log(`  CSV amount=${d.csv.amount}, DB amount=${d.db.amount}`)
    })
  }

  if (diffTypes.quantityOnly.length > 0) {
    console.log('\n--- quantityのみ違うサンプル ---')
    diffTypes.quantityOnly.slice(0, 5).forEach(d => {
      console.log(`${d.key}: CSV quantity=${d.csv.quantity}, DB quantity=${d.db.quantity}`)
    })
  }

  // 結論
  console.log('\n=== 結論 ===')
  if (diffTypes.amountAffected.length === 0) {
    console.log('✅ 金額(amount)に影響する不一致はありません')
    console.log('   quantityの差異（0→1）は表示上の問題のみで、経理データには影響しません')
  } else {
    console.log('❌ 金額に影響する不一致があります。修正が必要です。')
  }
}

main().catch(console.error)
