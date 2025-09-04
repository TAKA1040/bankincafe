const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://auwmmosfteomieyexkeh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1d21tb3NmdGVvbWlleWV4a2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzcxNTYsImV4cCI6MjA3MTAxMzE1Nn0.9SsGplOy1PQak1y7WLfzadvTOfm4NuuX8254lEctvj0'
)

async function checkRelationships() {
  try {
    console.log('=== 連携データ確認 ===\n')
    
    // 1. 件名マスタの件数確認
    const { count: subjectCount, error: subjectError } = await supabase
      .from('subject_master')
      .select('*', { count: 'exact', head: true })
    
    if (subjectError) throw subjectError
    console.log(`件名マスタ総数: ${subjectCount}件`)
    
    // 2. 登録番号マスタの件数確認
    const { count: regCount, error: regError } = await supabase
      .from('registration_number_master')
      .select('*', { count: 'exact', head: true })
    
    if (regError) throw regError
    console.log(`登録番号マスタ総数: ${regCount}件`)
    
    // 3. 連携テーブルの件数確認
    const { count: relationCount, error: relationError } = await supabase
      .from('subject_registration_numbers')
      .select('*', { count: 'exact', head: true })
    
    if (relationError) throw relationError
    console.log(`連携データ総数: ${relationCount}件\n`)
    
    // 4. サンプル連携データを確認
    console.log('=== サンプル連携データ ===')
    const { data: sampleRelations, error: sampleError } = await supabase
      .from('subject_registration_numbers')
      .select(`
        id,
        is_primary,
        usage_count,
        subject_master (
          subject_name,
          subject_name_kana
        ),
        registration_number_master (
          registration_number
        )
      `)
      .limit(5)
    
    if (sampleError) throw sampleError
    
    sampleRelations.forEach((relation, index) => {
      console.log(`${index + 1}. 件名: ${relation.subject_master.subject_name}`)
      console.log(`   登録番号: ${relation.registration_number_master.registration_number}`)
      console.log(`   メイン: ${relation.is_primary ? 'Yes' : 'No'}`)
      console.log(`   使用回数: ${relation.usage_count}回\n`)
    })
    
    // 5. 特定の登録番号の連携確認
    console.log('=== 特定登録番号の連携確認 ===')
    const { data: firstReg, error: firstRegError } = await supabase
      .from('registration_number_master')
      .select('id, registration_number')
      .limit(1)
      .single()
    
    if (firstRegError) throw firstRegError
    
    const { data: regRelations, error: regRelError } = await supabase
      .from('subject_registration_numbers')
      .select(`
        subject_master (
          subject_name,
          subject_name_kana
        ),
        is_primary,
        usage_count
      `)
      .eq('registration_number_id', firstReg.id)
    
    if (regRelError) throw regRelError
    
    console.log(`登録番号 ${firstReg.registration_number} の関連件名:`)
    if (regRelations.length === 0) {
      console.log('関連する件名がありません')
    } else {
      regRelations.forEach((rel, index) => {
        console.log(`${index + 1}. ${rel.subject_master.subject_name} (${rel.usage_count}回)`)
      })
    }
    
  } catch (error) {
    console.error('エラー:', error)
  }
}

checkRelationships()