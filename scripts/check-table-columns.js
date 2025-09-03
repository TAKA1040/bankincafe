// テーブルのカラム構造を確認するスクリプト
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://auwmmosfteomieyexkeh.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1d21tb3NmdGVvbWlleWV4a2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzcxNTYsImV4cCI6MjA3MTAxMzE1Nn0.9SsGplOy1PQak1y7WLfzadvTOfm4NuuX8254lEctvj0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTableColumns() {
  console.log('=== テーブルカラム構造確認 ===\n');
  
  const tables = ['work_history', 'work_sets', 'work_set_details'];
  
  for (const tableName of tables) {
    console.log(`--- ${tableName} テーブル ---`);
    
    try {
      // 1件データを取得してカラム構造を確認
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ ${tableName}: ${error.message}`);
      } else {
        if (data && data.length > 0) {
          console.log(`✅ ${tableName} カラム:`);
          const columns = Object.keys(data[0]);
          columns.forEach(col => console.log(`   - ${col}`));
        } else {
          // 空のテーブルの場合、insertを試行してカラムを特定
          console.log(`📝 ${tableName} は空です。テスト挿入でカラム確認...`);
          
          // work_historyの場合
          if (tableName === 'work_history') {
            try {
              const { error: insertError } = await supabase
                .from('work_history')
                .insert({
                  target_id: 999999, // 存在しないID
                  action_id: 999999,
                  position_id: null,
                  memo: 'test',
                  unit_price: 0,
                  quantity: 1,
                  raw_label: 'test',
                  task_type: 'test'
                });
              
              if (insertError) {
                console.log(`   カラム情報: ${insertError.message}`);
              }
            } catch (err) {
              console.log(`   テスト挿入結果: ${err.message}`);
            }
          }
          
          // work_setsの場合
          if (tableName === 'work_sets') {
            try {
              const { error: insertError } = await supabase
                .from('work_sets')
                .insert({
                  set_name: 'test',
                  unit_price: 0,
                  quantity: 1
                });
              
              if (insertError) {
                console.log(`   カラム情報: ${insertError.message}`);
              }
            } catch (err) {
              console.log(`   テスト挿入結果: ${err.message}`);
            }
          }
          
          // work_set_detailsの場合
          if (tableName === 'work_set_details') {
            try {
              const { error: insertError } = await supabase
                .from('work_set_details')
                .insert({
                  work_set_id: 999999,
                  target_id: 999999,
                  action_id: 999999,
                  position_id: null,
                  memo: 'test',
                  sort_order: 1
                });
              
              if (insertError) {
                console.log(`   カラム情報: ${insertError.message}`);
              }
            } catch (err) {
              console.log(`   テスト挿入結果: ${err.message}`);
            }
          }
        }
      }
    } catch (err) {
      console.log(`💥 ${tableName}: 例外 - ${err.message}`);
    }
    
    console.log('');
  }
}

if (require.main === module) {
  checkTableColumns();
}

module.exports = { checkTableColumns };