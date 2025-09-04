const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://auwmmosfteomieyexkeh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1d21tb3NmdGVvbWlleWV4a2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzcxNTYsImV4cCI6MjA3MTAxMzE1Nn0.9SsGplOy1PQak1y7WLfzadvTOfm4NuuX8254lEctvj0'
)

async function checkSpecificId() {
  try {
    const targetId = '9a79caf2-8c0e-4a64-b1b8-6f0c8535f8fc'
    
    console.log(`=== ID ${targetId} の詳細確認 ===\n`)
    
    // 1. この登録番号の基本情報を取得
    const { data: regData, error: regError } = await supabase
      .from('registration_number_master')
      .select('*')
      .eq('id', targetId)
      .single()
    
    if (regError) {
      console.error('登録番号取得エラー:', regError)
      return
    }
    
    console.log('登録番号:', regData.registration_number)
    console.log('作成日:', regData.created_at)
    console.log('使用回数:', regData.usage_count)
    
    // 2. 連携テーブルでこのIDを検索
    const { data: relations, error: relError } = await supabase
      .from('subject_registration_numbers')
      .select('*')
      .eq('registration_number_id', targetId)
    
    if (relError) {
      console.error('関連データ取得エラー:', relError)
      return
    }
    
    console.log('\n関連データ数:', relations.length)
    if (relations.length === 0) {
      console.log('このIDは関連付けされていません')
      
      // 3. 関連データがある登録番号を見つける
      console.log('\n=== 関連データがある登録番号を探す ===')
      const { data: hasRelations, error: hasError } = await supabase
        .from('subject_registration_numbers')
        .select(`
          registration_number_id,
          registration_number_master (
            registration_number
          )
        `)
        .limit(5)
      
      if (!hasError && hasRelations.length > 0) {
        console.log('関連データがある登録番号:')
        hasRelations.forEach((rel, index) => {
          console.log(`${index + 1}. ID: ${rel.registration_number_id}`)
          console.log(`   番号: ${rel.registration_number_master.registration_number}`)
        })
      }
    } else {
      relations.forEach((rel, index) => {
        console.log(`${index + 1}. Subject ID: ${rel.subject_id}`)
        console.log(`   メイン: ${rel.is_primary}`)
        console.log(`   使用回数: ${rel.usage_count}`)
      })
    }
    
  } catch (error) {
    console.error('エラー:', error)
  }
}

checkSpecificId()