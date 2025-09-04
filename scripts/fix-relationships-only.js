const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

const supabase = createClient(
  'https://auwmmosfteomieyexkeh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1d21tb3NmdGVvbWlleWV4a2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzcxNTYsImV4cCI6MjA3MTAxMzE1Nn0.9SsGplOy1PQak1y7WLfzadvTOfm4NuuX8254lEctvj0'
)

async function fixRelationshipsOnly() {
  try {
    console.log('=== 関連付けデータ修正開始 ===\n')
    
    // 1. 元のCSVデータを読み込み
    const masutaPath = 'C:\\Windsurf\\bankincafe\\請求書システム画像\\hondata\\masuta.csv'
    const masutaContent = fs.readFileSync(masutaPath, 'utf-8')
    const masutaLines = masutaContent.trim().split('\n').slice(1) // ヘッダーを除く
    
    console.log(`masuta.csv: ${masutaLines.length}件の関係データ`)
    
    // 2. 既存のマスタデータを全取得
    console.log('既存マスタデータ取得中...')
    const { data: allSubjects } = await supabase
      .from('subject_master')
      .select('id, subject_name')
    
    const { data: allRegistrations } = await supabase
      .from('registration_number_master')
      .select('id, registration_number')
    
    console.log(`件名マスタ: ${allSubjects?.length || 0}件`)
    console.log(`登録番号マスタ: ${allRegistrations?.length || 0}件`)
    
    // 3. マップを作成
    const subjectNameToId = new Map()
    const regNumberToId = new Map()
    
    allSubjects?.forEach(s => {
      subjectNameToId.set(s.subject_name, s.id)
    })
    
    allRegistrations?.forEach(r => {
      regNumberToId.set(r.registration_number, r.id)
    })
    
    // 4. masuta.csvから関連付けデータを作成
    const relations = []
    const notFoundSubjects = new Set()
    const notFoundRegistrations = new Set()
    
    masutaLines.forEach(line => {
      const [subjectName, registrationNumber] = line.split(',')
      if (subjectName && registrationNumber) {
        const cleanSubject = subjectName.trim()
        const cleanReg = registrationNumber.trim()
        
        const subjectId = subjectNameToId.get(cleanSubject)
        const regId = regNumberToId.get(cleanReg)
        
        if (subjectId && regId) {
          relations.push({
            subject_id: subjectId,
            registration_number_id: regId,
            is_primary: false,
            usage_count: 0,
            last_used_at: null
          })
        } else {
          if (!subjectId) notFoundSubjects.add(cleanSubject)
          if (!regId) notFoundRegistrations.add(cleanReg)
        }
      }
    })
    
    console.log(`\n作成可能な関連付け: ${relations.length}件`)
    console.log(`見つからない件名: ${notFoundSubjects.size}件`)
    console.log(`見つからない登録番号: ${notFoundRegistrations.size}件`)
    
    if (notFoundSubjects.size > 0) {
      console.log('\n見つからない件名の例:')
      Array.from(notFoundSubjects).slice(0, 5).forEach(name => {
        console.log(`  - ${name}`)
      })
    }
    
    if (notFoundRegistrations.size > 0) {
      console.log('\n見つからない登録番号の例:')
      Array.from(notFoundRegistrations).slice(0, 5).forEach(reg => {
        console.log(`  - ${reg}`)
      })
    }
    
    // 5. 既存の関連データを削除
    console.log('\n既存関連データを削除中...')
    const { error: deleteError } = await supabase
      .from('subject_registration_numbers')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')
    
    if (deleteError) throw deleteError
    console.log('削除完了')
    
    // 6. 新しい関連データを投入
    console.log('新しい関連データを投入中...')
    const batchSize = 100
    let insertedCount = 0
    
    for (let i = 0; i < relations.length; i += batchSize) {
      const batch = relations.slice(i, i + batchSize)
      const { data, error } = await supabase
        .from('subject_registration_numbers')
        .insert(batch)
      
      if (error) {
        console.error(`関連データ投入エラー (batch ${Math.floor(i/batchSize) + 1}):`, error)
        // エラーがあっても続行
      } else {
        insertedCount += batch.length
      }
      
      // 進捗表示
      if ((i + batchSize) % 500 === 0 || i + batchSize >= relations.length) {
        console.log(`進捗: ${Math.min(i + batchSize, relations.length)}/${relations.length}`)
      }
    }
    
    console.log(`\n=== 完了 ===`)
    console.log(`関連データ投入完了: ${insertedCount}件`)
    console.log(`元データ: ${masutaLines.length}件 → 投入成功: ${insertedCount}件`)
    console.log(`成功率: ${(insertedCount/masutaLines.length*100).toFixed(1)}%`)
    
    // 7. 最終確認
    const { count: finalCount } = await supabase
      .from('subject_registration_numbers')
      .select('*', { count: 'exact', head: true })
    
    console.log(`データベース確認: ${finalCount}件の関連データ`)
    
  } catch (error) {
    console.error('エラー:', error)
  }
}

fixRelationshipsOnly()