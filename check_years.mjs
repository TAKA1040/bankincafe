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
  // billing_dateの年度分布を確認
  const { data, error } = await supabase
    .from('invoices')
    .select('invoice_id, billing_date, issue_date, total_amount, status')
    .neq('status', 'deleted')
    .limit(3000)

  if (error) {
    console.error('Error:', error)
    return
  }

  console.log('Total records:', data.length)
  
  // 年度ごとにカウント
  const yearCount = {}
  data.forEach(inv => {
    const date = inv.billing_date || inv.issue_date
    if (date) {
      const year = new Date(date).getFullYear()
      yearCount[year] = (yearCount[year] || 0) + 1
    }
  })
  
  console.log('\nYear distribution (billing_date/issue_date):')
  Object.keys(yearCount).sort().forEach(year => {
    console.log(`  ${year}: ${yearCount[year]} records`)
  })

  // サンプル表示
  console.log('\nSample records:')
  data.slice(0, 5).forEach(inv => {
    console.log(`  ${inv.invoice_id}: billing=${inv.billing_date}, issue=${inv.issue_date}, amount=${inv.total_amount}`)
  })
}

main()
