const { createClient } = require('@supabase/supabase-js');

// Supabase設定
const supabaseUrl = 'https://auwmmosfteomieyexkeh.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1d21tb3NmdGVvbWlleWV4a2VoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTQzNzE1NiwiZXhwIjoyMDcxMDEzMTU2fQ.XKwCDb2pndGMMpp2aaUNVWkpXnOZYV3-IXMwd75s6Wc';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTaskTypes() {
    console.log('=== Task Type 状況確認 ===');
    
    try {
        // 元のinvoice_line_itemsの状況
        const { data: lineItems, error: lineError } = await supabase
            .from('invoice_line_items')
            .select('task_type, raw_label, quantity')
            .order('id');
            
        if (lineError) {
            console.error('明細項目取得エラー:', lineError);
            return;
        }
        
        // task_type分布
        const taskTypeCounts = {};
        lineItems.forEach(item => {
            taskTypeCounts[item.task_type] = (taskTypeCounts[item.task_type] || 0) + 1;
        });
        
        console.log('📊 元データのtask_type分布:');
        Object.entries(taskTypeCounts).forEach(([type, count]) => {
            console.log(`  ${type}: ${count}件`);
        });
        
        // 新しいinvoice_line_items_splitの状況確認
        const { data: splitItems, error: splitError } = await supabase
            .from('invoice_line_items_split')
            .select('*')
            .order('id')
            .limit(10);
            
        if (splitError) {
            console.error('分割項目取得エラー:', splitError);
            return;
        }
        
        console.log('\n📋 生成されたsplit項目サンプル:');
        splitItems.forEach(item => {
            console.log(`  ${item.raw_label_part} | 数量:${item.quantity} | 単価:${item.unit_price} | 金額:${item.amount}`);
        });
        
        // セット作業判定のロジック確認
        console.log('\n🔍 セット作業判定が必要なケース:');
        const setCandidates = lineItems.filter(item => 
            item.quantity > 1 || 
            (item.raw_label && (
                item.raw_label.includes('一式') ||
                item.raw_label.includes('セット') ||
                item.raw_label.includes('SET') ||
                item.raw_label.includes('複数')
            ))
        );
        
        console.log(`セット作業候補: ${setCandidates.length}件`);
        setCandidates.forEach(item => {
            console.log(`  [${item.task_type}] 数量:${item.quantity} - ${item.raw_label}`);
        });
        
    } catch (error) {
        console.error('エラー:', error);
    }
}

checkTaskTypes().catch(console.error);