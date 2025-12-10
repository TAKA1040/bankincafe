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
  const { data } = await supabase
    .from('invoice_line_items')
    .select('line_no, sub_no, amount, quantity, unit_price, set_name, raw_label_part')
    .eq('invoice_id', '22021407-1')
    .order('line_no')
    .order('sub_no')

  console.log('=== DB: 22021407-1 ===')
  data?.forEach(r => {
    console.log(`sub_no=${r.sub_no}: amount=${r.amount}, qty=${r.quantity}, unit=${r.unit_price}, set="${r.set_name}", part="${r.raw_label_part?.substring(0,25)}..."`)
  })

  // CSV期待値
  console.log('\n=== CSV期待値 ===')
  console.log('全6行: amount=18000, quantity=1, unit_price=18000')

  // 一致確認
  const allMatch = data?.every(r => r.amount === 18000 && r.quantity === 1 && r.unit_price === 18000)
  console.log(`\n一致確認: ${allMatch ? '✅ 完全一致' : '❌ 不一致あり'}`)
}

main().catch(console.error)
