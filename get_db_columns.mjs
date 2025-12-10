import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'

const envContent = fs.readFileSync('.env.local', 'utf-8')
const env = {}
envContent.split('\n').forEach(line => {
  const [key, ...vals] = line.split('=')
  if (key && vals.length) env[key.trim()] = vals.join('=').trim()
})

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

async function main() {
  // invoice_line_itemsから1行取得してカラム名を確認
  const { data, error } = await supabase
    .from('invoice_line_items')
    .select('*')
    .limit(1)

  if (error) {
    console.error('Error:', error)
    return
  }

  console.log('=== invoice_line_items DBカラム ===')
  if (data && data.length > 0) {
    const columns = Object.keys(data[0])
    columns.forEach(col => console.log(`  ${col}`))
  }

  // invoicesから1行取得
  const { data: invData, error: invError } = await supabase
    .from('invoices')
    .select('*')
    .limit(1)

  console.log('\n=== invoices DBカラム ===')
  if (invData && invData.length > 0) {
    const columns = Object.keys(invData[0])
    columns.forEach(col => console.log(`  ${col}`))
  }
}

main().catch(console.error)
