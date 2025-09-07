const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

// Supabase設定
const supabaseUrl = 'https://auwmmosfteomieyexkeh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1d21tb3NmdGVvbWlleWV4a2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzcxNTYsImV4cCI6MjA3MTAxMzE1Nn0.9SsGplOy1PQak1y7WLfzadvTOfm4NuuX8254lEctvj0'
const supabase = createClient(supabaseUrl, supabaseKey)

// SQLファイルから件名データを抽出
function extractSubjectsFromSQL() {
  const sqlContent = fs.readFileSync('scripts/insert-subject-master-data.sql', 'utf8')
  const insertRegex = /INSERT INTO public\.subject_master \(subject_name, subject_name_kana, created_at, updated_at\) VALUES \('([^']+)', '([^']+)', NOW\(\), NOW\(\)\);/g
  
  const subjects = []
  let match
  
  while ((match = insertRegex.exec(sqlContent)) !== null) {
    subjects.push({
      subject_name: match[1],
      subject_name_kana: match[2]
    })
  }
  
  return subjects
}

const subjectMasterData = extractSubjectsFromSQL()

async function insertSubjects() {
  console.log(`${subjectMasterData.length}件の件名データをSupabaseに登録開始...`)
  
  try {
    // 既存データをクリア
    const { error: deleteError } = await supabase
      .from('subject_master')
      .delete()
      .neq('id', 'dummy') // 全削除
    
    if (deleteError) {
      console.log('既存データクリアエラー:', deleteError)
    }
    
    // バッチで件名データを挿入（20件ずつ）
    const batchSize = 20
    for (let i = 0; i < subjectMasterData.length; i += batchSize) {
      const batch = subjectMasterData.slice(i, i + batchSize).map(subject => ({
        subject_name: subject.subject_name,
        subject_name_kana: subject.subject_name_kana,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }))
      
      console.log(`バッチ ${Math.floor(i/batchSize) + 1}: ${batch.length}件挿入中...`)
      
      const { data, error } = await supabase
        .from('subject_master')
        .insert(batch)
      
      if (error) {
        console.error(`バッチ ${Math.floor(i/batchSize) + 1} エラー:`, error)
        continue
      }
      
      console.log(`バッチ ${Math.floor(i/batchSize) + 1} 完了`)
      
      // 少し待機
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    console.log('件名データの登録が完了しました')
    
    // 確認のためレコード数をチェック
    const { count } = await supabase
      .from('subject_master')
      .select('*', { count: 'exact', head: true })
    
    console.log(`登録確認: ${count}件のレコードが存在します`)
    
  } catch (error) {
    console.error('登録エラー:', error)
  }
}

insertSubjects()