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
  const { data, error } = await supabase
    .from('invoice_line_items')
    .select('*')
    .eq('invoice_id', '22021407-1')
  
  if (error) {
    console.error('Error:', error)
    return
  }
  
  console.log('Line items for 22021407-1:')
  data.forEach((item, i) => {
    console.log(`\n--- Line ${item.line_no} ---`)
    console.log('task_type:', item.task_type)
    console.log('target:', item.target)
    console.log('action1:', item.action1)
    console.log('position1:', item.position1)
    console.log('raw_label:', item.raw_label)
    console.log('raw_label_part:', item.raw_label_part)
  })
}

main()
