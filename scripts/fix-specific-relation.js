const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://auwmmosfteomieyexkeh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1d21tb3NmdGVvbWlleWV4a2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzcxNTYsImV4cCI6MjA3MTAxMzE1Nn0.9SsGplOy1PQak1y7WLfzadvTOfm4NuuX8254lEctvj0'
)

async function fixSpecificRelation() {
  try {
    const subjectName = '有限会社青浜建設'
    const regNumber = '北九州104か･･･1'
    const regId = '9a79caf2-8c0e-4a64-b1b8-6f0c8535f8fc'
    
    console.log(`=== ${subjectName} ←→ ${regNumber} の関連付けを修正 ===\n`)
    
    // 1. 件名マスタで「有限会社青浜建設」を検索
    console.log('件名マスタで検索中...')
    const { data: subjects } = await supabase
      .from('subject_master')
      .select('id, subject_name')
      .eq('subject_name', subjectName)
    
    if (subjects && subjects.length > 0) {
      console.log(`件名マスタに存在: ID = ${subjects[0].id}`)
      
      // 2. 関連付けデータを作成
      const subjectId = subjects[0].id
      console.log('関連付けデータを作成中...')
      
      const { data: newRelation, error: relationError } = await supabase
        .from('subject_registration_numbers')
        .insert({
          subject_id: subjectId,
          registration_number_id: regId,
          is_primary: false,
          usage_count: 0,
          last_used_at: null
        })
        .select()
      
      if (relationError) {
        if (relationError.code === '23505') {
          console.log('関連付けは既に存在しています')
        } else {
          console.error('関連付けエラー:', relationError)
        }
      } else {
        console.log('関連付け作成成功:', newRelation)
      }
      
    } else {
      console.log('件名マスタに存在しません。作成します...')
      
      // 3. 件名マスタに追加
      const { data: newSubject, error: subjectError } = await supabase
        .from('subject_master')
        .insert({
          subject_name: subjectName,
          subject_name_kana: null
        })
        .select()
        .single()
      
      if (subjectError) {
        console.error('件名作成エラー:', subjectError)
        return
      }
      
      console.log('件名作成成功:', newSubject)
      
      // 4. 関連付けデータを作成
      console.log('関連付けデータを作成中...')
      const { data: newRelation, error: relationError } = await supabase
        .from('subject_registration_numbers')
        .insert({
          subject_id: newSubject.id,
          registration_number_id: regId,
          is_primary: false,
          usage_count: 0,
          last_used_at: null
        })
        .select()
      
      if (relationError) {
        console.error('関連付けエラー:', relationError)
      } else {
        console.log('関連付け作成成功:', newRelation)
      }
    }
    
    // 5. 最終確認
    console.log('\n=== 最終確認 ===')
    const { data: finalCheck } = await supabase
      .from('subject_registration_numbers')
      .select(`
        id,
        subject_master (
          subject_name
        ),
        registration_number_master (
          registration_number
        )
      `)
      .eq('registration_number_id', regId)
    
    console.log(`登録番号 ${regNumber} の関連件名:`)
    if (finalCheck && finalCheck.length > 0) {
      finalCheck.forEach(rel => {
        console.log(`  ✅ ${rel.subject_master.subject_name}`)
      })
    } else {
      console.log('  ❌ 関連件名なし')
    }
    
  } catch (error) {
    console.error('エラー:', error)
  }
}

fixSpecificRelation()