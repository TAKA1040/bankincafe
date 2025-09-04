const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://auwmmosfteomieyexkeh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJiss3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1d21tb3NmdGVvbWlleWV4a2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzcxNTYsImV4cCI6MjA3MTAxMzE1Nn0.9SsGplOy1PQak1y7WLfzadvTOfm4NuuX8254lEctvj0'
)

async function analyzeDataCoverage() {
  try {
    console.log('=== データカバレッジ分析 ===\n')
    
    // 1. 基本統計
    const { count: subjectCount } = await supabase
      .from('subject_master')
      .select('*', { count: 'exact', head: true })
    
    const { count: regCount } = await supabase
      .from('registration_number_master')  
      .select('*', { count: 'exact', head: true })
      
    const { count: relationCount } = await supabase
      .from('subject_registration_numbers')
      .select('*', { count: 'exact', head: true })
    
    console.log(`件名マスタ: ${subjectCount}件`)
    console.log(`登録番号マスタ: ${regCount}件`)  
    console.log(`関連付けデータ: ${relationCount}件\n`)
    
    // 2. カバレッジ率を計算
    const { data: uniqueSubjects } = await supabase
      .from('subject_registration_numbers')
      .select('subject_id')
    
    const uniqueSubjectIds = [...new Set(uniqueSubjects.map(r => r.subject_id))]
    
    const { data: uniqueRegistrations } = await supabase
      .from('subject_registration_numbers')
      .select('registration_number_id')
    
    const uniqueRegIds = [...new Set(uniqueRegistrations.map(r => r.registration_number_id))]
    
    console.log('=== カバレッジ率 ===')
    console.log(`関連付けされた件名: ${uniqueSubjectIds.length}/${subjectCount} (${(uniqueSubjectIds.length/subjectCount*100).toFixed(1)}%)`)
    console.log(`関連付けされた登録番号: ${uniqueRegIds.length}/${regCount} (${(uniqueRegIds.length/regCount*100).toFixed(1)}%)\n`)
    
    // 3. 元データの確認
    console.log('=== 元データ確認 ===')
    const fs = require('fs')
    const path = require('path')
    
    // CSVファイルの確認
    const masutaPath = 'C:\\Windsurf\\bankincafe\\請求書システム画像\\hondata\\masuta.csv'
    const kenmeiPath = 'C:\\Windsurf\\bankincafe\\請求書システム画像\\hondata\\kenmei_yomigana.csv'
    
    if (fs.existsSync(masutaPath)) {
      const masutaContent = fs.readFileSync(masutaPath, 'utf-8')
      const masutaLines = masutaContent.trim().split('\n')
      console.log(`masuta.csv行数: ${masutaLines.length}行`)
      console.log('masuta.csvサンプル:')
      masutaLines.slice(0, 3).forEach((line, i) => {
        console.log(`${i+1}. ${line}`)
      })
    }
    
    if (fs.existsSync(kenmeiPath)) {
      const kenmeiContent = fs.readFileSync(kenmeiPath, 'utf-8') 
      const kenmeiLines = kenmeiContent.trim().split('\n')
      console.log(`\nkenmei_yomigana.csv行数: ${kenmeiLines.length}行`)
      console.log('kenmei_yomigana.csvサンプル:')
      kenmeiLines.slice(0, 3).forEach((line, i) => {
        console.log(`${i+1}. ${line}`)
      })
    }
    
    // 4. 関連付けのない登録番号の例
    console.log('\n=== 関連付けのない登録番号の例 ===')
    const { data: unrelatedRegs } = await supabase
      .from('registration_number_master')
      .select('id, registration_number')
      .not('id', 'in', `(${uniqueRegIds.map(id => `'${id}'`).join(',')})`)
      .limit(5)
    
    unrelatedRegs.forEach((reg, i) => {
      console.log(`${i+1}. ${reg.registration_number} (ID: ${reg.id})`)
    })
    
  } catch (error) {
    console.error('エラー:', error)
  }
}

analyzeDataCoverage()