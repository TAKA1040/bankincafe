const { createClient } = require('@supabase/supabase-js');

// Supabase設定
const supabaseUrl = 'https://auwmmosfteomieyexkeh.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1d21tb3NmdGVvbWlleWV4a2VoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTQzNzE1NiwiZXhwIjoyMDcxMDEzMTU2fQ.XKwCDb2pndGMMpp2aaUNVWkpXnOZYV3-IXMwd75s6Wc';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function resetAndShowTaskTypes() {
    console.log('=== データリセットとTask Type確認 ===');
    
    try {
        // 1. 全invoice_line_itemsをfuzzyにリセット
        const { error: resetError } = await supabase
            .from('invoice_line_items')
            .update({ task_type: 'fuzzy' })
            .neq('id', 0);
            
        if (resetError) {
            console.error('リセットエラー:', resetError);
            return;
        }
        
        console.log('✅ 全明細項目をfuzzyにリセット完了');
        
        // 2. 分割データを削除
        await supabase.from('work_item_positions').delete().neq('id', 0);
        await supabase.from('invoice_line_items_split').delete().neq('id', 0);
        
        console.log('✅ 分割データをクリア完了');
        
        // 3. セット作業のサンプル確認
        const { data: lineItems, error: lineError } = await supabase
            .from('invoice_line_items')
            .select('id, raw_label, task_type')
            .order('id')
            .limit(10);
            
        if (lineError) {
            console.error('データ取得エラー:', lineError);
            return;
        }
        
        console.log('\n📋 処理対象のサンプルデータ:');
        lineItems.forEach(item => {
            const parts = item.raw_label ? item.raw_label.split(/[・、\/]/).length : 1;
            const expectedType = parts > 1 ? 'set' : 'individual/fuzzy';
            console.log(`[${item.task_type}] ID:${item.id} - ${item.raw_label} (${parts}分割→${expectedType}予想)`);
        });
        
        console.log('\n準備完了！transform_work_items_enhanced.js を実行してください。');
        
    } catch (error) {
        console.error('エラー:', error);
    }
}

resetAndShowTaskTypes().catch(console.error);