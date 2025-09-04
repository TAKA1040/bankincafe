const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkRLSStatus() {
  try {
    console.log('=== RLS状態とテーブル確認 ===')
    
    // 1. テーブル存在確認
    console.log('\n1. テーブル存在確認:')
    
    const tables = ['subject_master', 'registration_number_master', 'subject_registration_numbers']
    const results = []
    
    for (const tableName of tables) {
      try {
        const { data, error } = await supabase.from(tableName).select('*').limit(1)
        if (error) {
          results.push({ table: tableName, exists: false, error: error.message })
        } else {
          results.push({ table: tableName, exists: true, count: data?.length || 0 })
        }
      } catch (err) {
        results.push({ table: tableName, exists: false, error: err.message })
      }
    }
    
    results.forEach(table => {
      console.log(`  ${table.table}: ${table.exists ? '存在' : '存在しない'} ${table.error ? `(エラー: ${table.error})` : ''}`)
    })
    
    // 2. 簡単なINSERTテスト
    console.log('\n2. INSERTテスト:')
    const testSubject = {
      subject_name: 'テスト会社_' + Date.now(),
      subject_name_kana: 'てすとがいしゃ'
    }
    
    const { data: insertData, error: insertError } = await supabase
      .from('subject_master')
      .insert([testSubject])
      .select()
    
    if (insertError) {
      console.log(`  INSERT失敗: ${insertError.code} - ${insertError.message}`)
      
      // RLSエラーの場合、詳細を確認
      if (insertError.code === '42501') {
        console.log('  → RLSポリシーによりブロックされています')
        
        // SELECTは可能か確認
        const { data: selectData, error: selectError } = await supabase
          .from('subject_master')
          .select('*')
          .limit(1)
        
        console.log(`  → SELECT権限: ${selectError ? '拒否' : '許可'}`)
      }
    } else {
      console.log(`  INSERT成功: ${insertData?.length || 0}件`)
      
      // 挿入したテストデータを削除
      if (insertData && insertData.length > 0) {
        await supabase
          .from('subject_master')
          .delete()
          .eq('id', insertData[0].id)
        console.log('  テストデータを削除しました')
      }
    }
    
    // 3. 現在のデータ件数確認
    console.log('\n3. 現在のデータ件数:')
    
    const tables_to_check = [
      'subject_master',
      'registration_number_master', 
      'subject_registration_numbers'
    ]
    
    for (const tableName of tables_to_check) {
      try {
        const { data, error, count } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true })
        
        if (error) {
          console.log(`  ${tableName}: エラー - ${error.message}`)
        } else {
          console.log(`  ${tableName}: ${count || 0}件`)
        }
      } catch (err) {
        console.log(`  ${tableName}: 例外 - ${err.message}`)
      }
    }
    
  } catch (error) {
    console.error('チェック中にエラー:', error)
  }
}

checkRLSStatus()