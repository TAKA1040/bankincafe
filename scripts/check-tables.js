// テーブル構造を確認するスクリプト
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://auwmmosfteomieyexkeh.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1d21tb3NmdGVvbWlleWV4a2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzcxNTYsImV4cCI6MjA3MTAxMzE1Nn0.9SsGplOy1PQak1y7WLfzadvTOfm4NuuX8254lEctvj0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  console.log('=== テーブル構造確認 ===\n');
  
  // 関連テーブルを順番に確認
  const tables = [
    'invoice_line_items',
    'invoices', 
    'customers',
    'work_history'
  ];
  
  for (const tableName of tables) {
    console.log(`--- ${tableName} テーブル ---`);
    
    try {
      // サンプルデータを取得
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact' })
        .limit(3);
      
      if (error) {
        console.log(`❌ ${tableName}: ${error.message}`);
      } else {
        console.log(`✅ ${tableName}: ${count} 件のデータ`);
        
        if (data && data.length > 0) {
          console.log('カラム:', Object.keys(data[0]).join(', '));
          
          // サンプルデータを表示
          console.log('サンプルデータ:');
          data.slice(0, 2).forEach((row, index) => {
            console.log(`  ${index + 1}. ${JSON.stringify(row, null, 2).substring(0, 200)}...`);
          });
        } else {
          console.log('データなし');
        }
      }
      
    } catch (err) {
      console.log(`💥 ${tableName}: 例外 - ${err.message}`);
    }
    
    console.log('');
  }
}

if (require.main === module) {
  checkTables();
}

module.exports = { checkTables };