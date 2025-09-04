const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

const supabase = createClient(
  'https://auwmmosfteomieyexkeh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1d21tb3NmdGVvbWlleWV4a2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzcxNTYsImV4cCI6MjA3MTAxMzE1Nn0.9SsGplOy1PQak1y7WLfzadvTOfm4NuuX8254lEctvj0'
)

async function findMissingRelation() {
  try {
    const targetReg = '北九州104か･･･1'
    console.log(`=== ${targetReg} の関連を調査 ===\n`)
    
    // 1. masuta.csvでこの登録番号を検索
    const masutaPath = 'C:\\Windsurf\\bankincafe\\請求書システム画像\\hondata\\masuta.csv'
    const masutaContent = fs.readFileSync(masutaPath, 'utf-8')
    const masutaLines = masutaContent.trim().split('\n')
    
    console.log('masuta.csvで検索中...')
    const foundInMasuta = []
    masutaLines.forEach((line, index) => {
      if (line.includes('104か') || line.includes(targetReg)) {
        foundInMasuta.push({
          line: index + 1,
          content: line
        })
      }
    })
    
    console.log(`masuta.csvの該当行: ${foundInMasuta.length}件`)
    foundInMasuta.forEach(item => {
      console.log(`  行${item.line}: ${item.content}`)
    })
    
    // 2. より広範囲で検索（104か で始まる）
    console.log('\n104か で始まる登録番号を検索...')
    const broader = []
    masutaLines.forEach((line, index) => {
      if (line.includes('104か')) {
        broader.push({
          line: index + 1,
          content: line
        })
      }
    })
    
    console.log(`104か系の登録番号: ${broader.length}件`)
    broader.slice(0, 10).forEach(item => {
      console.log(`  行${item.line}: ${item.content}`)
    })
    
    // 3. データベースで104か系の登録番号を確認
    console.log('\nデータベースで104か系を検索...')
    const { data: dbRegs } = await supabase
      .from('registration_number_master')
      .select('id, registration_number')
      .ilike('registration_number', '%104か%')
    
    console.log(`DB内の104か系登録番号: ${dbRegs?.length || 0}件`)
    dbRegs?.forEach(reg => {
      console.log(`  ${reg.registration_number} (ID: ${reg.id})`)
    })
    
    // 4. 具体的にDBで対象の登録番号を検索
    console.log(`\n"${targetReg}"をDBで検索...`)
    const { data: exactMatch } = await supabase
      .from('registration_number_master')
      .select('id, registration_number')
      .eq('registration_number', targetReg)
    
    if (exactMatch && exactMatch.length > 0) {
      console.log('完全一致で見つかりました:')
      console.log(`  ID: ${exactMatch[0].id}`)
      console.log(`  登録番号: ${exactMatch[0].registration_number}`)
      
      // この登録番号の関連データを確認
      const { data: relations } = await supabase
        .from('subject_registration_numbers')
        .select('subject_id, subject_master(subject_name)')
        .eq('registration_number_id', exactMatch[0].id)
      
      console.log(`  関連件名: ${relations?.length || 0}件`)
      relations?.forEach(rel => {
        console.log(`    - ${rel.subject_master.subject_name}`)
      })
      
    } else {
      console.log('完全一致は見つかりません')
      
      // 類似の登録番号を検索
      console.log('\n類似の登録番号を検索...')
      const { data: similar } = await supabase
        .from('registration_number_master')
        .select('id, registration_number')
        .ilike('registration_number', '%104%か%1%')
      
      console.log(`類似登録番号: ${similar?.length || 0}件`)
      similar?.slice(0, 5).forEach(reg => {
        console.log(`  ${reg.registration_number}`)
      })
    }
    
    // 5. masuta.csvから該当する件名を特定
    if (foundInMasuta.length > 0) {
      console.log('\nmasuta.csvから関連件名を特定...')
      foundInMasuta.forEach(item => {
        const [subject, regNumber] = item.content.split(',')
        if (subject && regNumber) {
          console.log(`  件名: "${subject.trim()}"`)
          console.log(`  登録番号: "${regNumber.trim()}"`)
          
          // この件名がDBに存在するか確認
          
        }
      })
    }
    
  } catch (error) {
    console.error('エラー:', error)
  }
}

findMissingRelation()