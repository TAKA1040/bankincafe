const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://auwmmosfteomieyexkeh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1d21tb3NmdGVvbWlleWV4a2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzcxNTYsImV4cCI6MjA3MTAxMzE1Nn0.9SsGplOy1PQak1y7WLfzadvTOfm4NuuX8254lEctvj0'
)

async function debugSpecificRegistration() {
  try {
    console.log('=== 特定登録番号の詳細デバッグ ===\n')
    
    // 1. 連携データがある登録番号を見つける
    console.log('1. 連携データがある登録番号を検索...')
    const { data: relationsWithReg, error: relError } = await supabase
      .from('subject_registration_numbers')
      .select(`
        registration_number_id,
        registration_number_master (
          id,
          registration_number
        ),
        subject_master (
          subject_name
        )
      `)
      .limit(3)
    
    if (relError) throw relError
    
    relationsWithReg.forEach((rel, index) => {
      console.log(`${index + 1}. 登録番号ID: ${rel.registration_number_id}`)
      console.log(`   登録番号: ${rel.registration_number_master.registration_number}`)
      console.log(`   関連件名: ${rel.subject_master.subject_name}\n`)
    })
    
    // 2. 最初の登録番号で詳細確認
    const firstReg = relationsWithReg[0]
    const regId = firstReg.registration_number_id
    const regNumber = firstReg.registration_number_master.registration_number
    
    console.log(`=== 登録番号 ${regNumber} (ID: ${regId}) の詳細確認 ===`)
    
    // 3. この登録番号の全ての関連データを取得
    const { data: fullRelations, error: fullError } = await supabase
      .from('subject_registration_numbers')
      .select(`
        id,
        subject_id,
        registration_number_id,
        is_primary,
        usage_count,
        subject_master (
          id,
          subject_name,
          subject_name_kana
        )
      `)
      .eq('registration_number_id', regId)
    
    if (fullError) throw fullError
    
    console.log(`関連件名数: ${fullRelations.length}件`)
    fullRelations.forEach((rel, index) => {
      console.log(`${index + 1}. 件名ID: ${rel.subject_id}`)
      console.log(`   件名: ${rel.subject_master.subject_name}`)
      console.log(`   読み: ${rel.subject_master.subject_name_kana || '未設定'}`)
      console.log(`   メイン: ${rel.is_primary ? 'Yes' : 'No'}`)
      console.log(`   使用回数: ${rel.usage_count}回\n`)
    })
    
    // 4. フロントエンドで使用されるクエリをテスト
    console.log('=== フロントエンドクエリテスト ===')
    const { data: frontendData, error: frontendError } = await supabase
      .from('subject_registration_numbers')
      .select(`
        id,
        is_primary,
        usage_count,
        last_used_at,
        subject_master (
          id,
          subject_name,
          subject_name_kana
        )
      `)
      .eq('registration_number_id', regId)
      .order('usage_count', { ascending: false })
    
    if (frontendError) throw frontendError
    
    console.log(`フロントエンドクエリ結果: ${frontendData.length}件`)
    frontendData.forEach((item, index) => {
      console.log(`${index + 1}. ${item.subject_master.subject_name} (${item.usage_count}回)`)
    })
    
  } catch (error) {
    console.error('エラー:', error)
  }
}

debugSpecificRegistration()