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
  // 全件取得（ページネーション）
  let allData = []
  let page = 0
  const pageSize = 1000

  while (true) {
    const { data, error } = await supabase
      .from('invoices')
      .select('invoice_id, billing_date, issue_date, total_amount, total, status')
      .range(page * pageSize, (page + 1) * pageSize - 1)

    if (error) {
      console.error('Error:', error)
      break
    }
    if (!data || data.length === 0) break
    allData = [...allData, ...data]
    page++
  }

  console.log('Total records:', allData.length)

  // billing_date/issue_date/total_amountの状況を確認
  let billingDateNull = 0
  let issueDateNull = 0
  let totalAmountZero = 0
  let totalZero = 0

  allData.forEach(inv => {
    if (!inv.billing_date) billingDateNull++
    if (!inv.issue_date) issueDateNull++
    if (!inv.total_amount || inv.total_amount === 0) totalAmountZero++
    if (!inv.total || inv.total === 0) totalZero++
  })

  console.log('\nData quality:')
  console.log(`  billing_date NULL: ${billingDateNull}`)
  console.log(`  issue_date NULL: ${issueDateNull}`)
  console.log(`  total_amount = 0 or NULL: ${totalAmountZero}`)
  console.log(`  total = 0 or NULL: ${totalZero}`)

  // 年度分布（issue_date使用）
  const yearCount = {}
  allData.forEach(inv => {
    const date = inv.issue_date
    if (date) {
      const year = new Date(date).getFullYear()
      yearCount[year] = (yearCount[year] || 0) + 1
    }
  })

  console.log('\nYear distribution (issue_date):')
  Object.keys(yearCount).sort().forEach(year => {
    console.log(`  ${year}: ${yearCount[year]} records`)
  })
}

main()
