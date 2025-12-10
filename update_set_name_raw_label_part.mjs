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

    // CSVのパース（カンマを含む値に対応）
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
  console.log('CSVファイルを読み込み中...')
  const csvContent = fs.readFileSync('マスタ作成用/25123695-1までの最新データ/invoice_line_items.csv', 'utf-8')
  const csvData = parseCSV(csvContent)

  console.log(`CSV行数: ${csvData.length}`)

  // サンプルで22021407-1のデータを確認
  const sample = csvData.filter(r => r.invoice_id === '22021407-1')
  console.log('\n22021407-1のCSVデータ:')
  sample.forEach(r => {
    console.log(`  line_no=${r.line_no}, sub_no=${r.sub_no}, set_name="${r.set_name}", raw_label_part="${r.raw_label_part}"`)
  })

  // DBの既存データを更新
  console.log('\nDBを更新中...')

  let updated = 0
  let errors = 0

  // バッチで更新（invoice_id + line_no + sub_noで特定）
  for (const row of csvData) {
    if (!row.invoice_id || !row.line_no) continue

    const updateData = {}
    if (row.set_name) updateData.set_name = row.set_name
    if (row.raw_label_part) updateData.raw_label_part = row.raw_label_part

    if (Object.keys(updateData).length === 0) continue

    // invoice_id, line_no, sub_noで更新
    let query = supabase
      .from('invoice_line_items')
      .update(updateData)
      .eq('invoice_id', row.invoice_id)
      .eq('line_no', parseInt(row.line_no))

    if (row.sub_no) {
      query = query.eq('sub_no', parseInt(row.sub_no))
    }

    const { error } = await query

    if (error) {
      errors++
      if (errors <= 5) {
        console.error(`Error updating ${row.invoice_id} line ${row.line_no}:`, error.message)
      }
    } else {
      updated++
    }

    // 進捗表示
    if ((updated + errors) % 1000 === 0) {
      console.log(`  処理済み: ${updated + errors}件 (成功: ${updated}, エラー: ${errors})`)
    }
  }

  console.log(`\n完了: 更新成功=${updated}件, エラー=${errors}件`)

  // 更新後の確認
  console.log('\n更新後の22021407-1を確認:')
  const { data, error } = await supabase
    .from('invoice_line_items')
    .select('line_no, sub_no, set_name, raw_label_part')
    .eq('invoice_id', '22021407-1')
    .order('line_no')
    .order('sub_no')

  if (data) {
    data.forEach(r => {
      console.log(`  line_no=${r.line_no}, sub_no=${r.sub_no}, set_name="${r.set_name || ''}", raw_label_part="${r.raw_label_part || ''}"`)
    })
  }
}

main().catch(console.error)
