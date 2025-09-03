// データベースの現在の構造を詳しく調査するスクリプト
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://auwmmosfteomieyexkeh.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1d21tb3NmdGVvbWlleWV4a2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzcxNTYsImV4cCI6MjA3MTAxMzE1Nn0.9SsGplOy1PQak1y7WLfzadvTOfm4NuuX8254lEctvj0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabaseStructure() {
  console.log('=== データベース構造調査開始 ===\n');
  
  try {
    // 1. すべてのテーブル一覧を試行してみる
    const commonTables = [
      // 辞書系テーブル候補
      'targets', 'actions', 'positions',
      'target_actions', 'action_positions', 
      'price_suggestions', 'reading_mappings',
      'work_dictionary', 'work_dictionary_master',
      'dictionary_targets', 'dictionary_actions', 'dictionary_positions',
      
      // 作業系テーブル候補
      'work_history', 'work_entries', 'work_sets', 'work_set_details',
      
      // 請求書系テーブル
      'invoices', 'invoice_items',
      
      // その他
      'customers', 'subjects'
    ];

    const existingTables = [];
    const tableStructures = {};

    for (const tableName of commonTables) {
      console.log(`--- ${tableName} テーブルの調査 ---`);
      
      try {
        // まずデータの取得を試行
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(3);

        if (error) {
          if (error.code === '42P01') {
            console.log(`❌ ${tableName}: テーブルが存在しません`);
          } else {
            console.log(`⚠️ ${tableName}: エラー - ${error.message}`);
          }
        } else {
          console.log(`✅ ${tableName}: テーブルが存在します (${data?.length || 0} 件のサンプル)`);
          existingTables.push(tableName);
          
          if (data && data.length > 0) {
            console.log('   サンプルデータ:', JSON.stringify(data[0], null, 4));
            
            // カラム構造を記録
            const columns = Object.keys(data[0]);
            tableStructures[tableName] = {
              columns,
              sampleData: data[0],
              recordCount: data.length
            };
          } else {
            // 空のテーブルの場合、insert試行でカラム構造を推測
            console.log(`   ${tableName}は空です`);
            tableStructures[tableName] = {
              columns: [],
              sampleData: null,
              recordCount: 0
            };
          }
        }
      } catch (err) {
        console.log(`💥 ${tableName}: 例外エラー - ${err.message}`);
      }
      
      console.log(''); // 空行
    }

    // 2. 存在するテーブルのまとめ
    console.log('\n=== 存在するテーブル一覧 ===');
    existingTables.forEach(table => {
      const structure = tableStructures[table];
      console.log(`📋 ${table}:`);
      console.log(`   - カラム数: ${structure.columns.length}`);
      console.log(`   - データ件数: ${structure.recordCount}`);
      if (structure.columns.length > 0) {
        console.log(`   - カラム: ${structure.columns.join(', ')}`);
      }
      console.log('');
    });

    // 3. 辞書系テーブルの詳細分析
    console.log('\n=== 辞書系テーブル詳細分析 ===');
    const dictionaryTables = existingTables.filter(table => 
      table.includes('target') || 
      table.includes('action') || 
      table.includes('position') || 
      table.includes('dictionary') ||
      table.includes('reading') ||
      table.includes('price')
    );
    
    if (dictionaryTables.length === 0) {
      console.log('❌ 辞書系テーブルが一つも存在しません');
      console.log('🔧 辞書システムを新規作成する必要があります');
    } else {
      console.log('✅ 辞書系テーブル:', dictionaryTables.join(', '));
      
      // 各辞書テーブルの詳細
      for (const table of dictionaryTables) {
        const structure = tableStructures[table];
        console.log(`\n📊 ${table} 詳細:`);
        if (structure.sampleData) {
          console.log(JSON.stringify(structure.sampleData, null, 2));
        } else {
          console.log('   データがありません');
        }
      }
    }

    // 4. 推奨されるテーブル構造の提案
    console.log('\n=== 推奨テーブル構造 ===');
    console.log(`
🎯 効率的な辞書システムの推奨構造:

1. targets テーブル (対象マスター)
   - id: number (主キー)
   - name: string (対象名)
   - reading: string (読み仮名) 
   - category: string (カテゴリ)
   - sort_order: number
   - is_active: boolean

2. actions テーブル (動作マスター)  
   - id: number (主キー)
   - name: string (動作名)
   - sort_order: number
   - is_active: boolean

3. positions テーブル (位置マスター)
   - id: number (主キー) 
   - name: string (位置名)
   - sort_order: number
   - is_active: boolean

4. target_actions テーブル (対象-動作関連)
   - id: number (主キー)
   - target_id: number (外部キー)
   - action_id: number (外部キー)

5. action_positions テーブル (動作-位置関連)
   - id: number (主キー)
   - action_id: number (外部キー) 
   - position_id: number (外部キー)

6. price_suggestions テーブル (価格提案)
   - id: number (主キー)
   - target_id: number (外部キー)
   - action_id: number (外部キー) 
   - suggested_price: number
   - usage_count: number
   - last_used_at: timestamp
    `);

    return {
      existingTables,
      tableStructures,
      dictionaryTables,
      needsSetup: dictionaryTables.length === 0
    };

  } catch (error) {
    console.error('データベース構造調査エラー:', error);
    throw error;
  }
}

if (require.main === module) {
  checkDatabaseStructure();
}

module.exports = { checkDatabaseStructure };