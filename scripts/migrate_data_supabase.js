const { createClient } = require('@supabase/supabase-js');

// Supabase設定
const supabaseUrl = 'https://auwmmosfteomieyexkeh.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1d21tb3NmdGVvbWlleWV4a2VoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTQzNzE1NiwiZXhwIjoyMDcxMDEzMTU2fQ.XKwCDb2pndGMMpp2aaUNVWkpXnOZYV3-IXMwd75s6Wc';

// Service roleクライアントを作成（admin権限）
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrateLegacyRawData() {
    console.log('=== 旧原文データ移行開始 ===');
    
    try {
        // 1. fuzzy task_typeの明細項目を取得
        const { data: lineItems, error: selectError } = await supabase
            .from('invoice_line_items')
            .select('id, raw_label, task_type')
            .eq('task_type', 'fuzzy')
            .not('raw_label', 'is', null)
            .neq('raw_label', '');
            
        if (selectError) {
            console.error('明細項目取得エラー:', selectError);
            return;
        }
        
        console.log(`取得した明細項目数: ${lineItems.length}`);
        
        if (lineItems.length === 0) {
            console.log('移行対象のデータがありません');
            return;
        }
        
        // サンプルデータを表示
        console.log('サンプルデータ:');
        lineItems.slice(0, 3).forEach(item => {
            console.log(`  ID:${item.id} - ${item.raw_label.substring(0, 50)}...`);
        });
        
        // 2. 既存のlegacy_line_item_rawsをクリア
        const { error: deleteError } = await supabase
            .from('legacy_line_item_raws')
            .delete()
            .neq('id', 0); // 全削除のためのダミー条件
            
        if (deleteError) {
            console.error('既存データ削除エラー:', deleteError);
            return;
        }
        
        console.log('既存の旧原文データをクリア');
        
        // 3. legacy_line_item_rawsに挿入
        const insertData = lineItems.map(item => ({
            line_item_id: item.id,
            raw_text: item.raw_label.trim()
        }));
        
        const { data: insertResult, error: insertError } = await supabase
            .from('legacy_line_item_raws')
            .insert(insertData);
            
        if (insertError) {
            console.error('挿入エラー:', insertError);
            return;
        }
        
        console.log(`旧原文データ移行完了: ${insertData.length} 件挿入`);
        
        // 4. 検証
        const { count, error: countError } = await supabase
            .from('legacy_line_item_raws')
            .select('*', { count: 'exact', head: true });
            
        if (countError) {
            console.error('検証エラー:', countError);
            return;
        }
        
        console.log(`移行後件数: ${count}`);
        
        // 結合テスト
        const { data: joinTest, error: joinError } = await supabase
            .from('invoice_line_items')
            .select(`
                id,
                raw_label,
                legacy_line_item_raws!inner(raw_text)
            `)
            .limit(3);
            
        if (joinError) {
            console.error('結合テストエラー:', joinError);
        } else {
            console.log('結合テスト結果:');
            joinTest.forEach(item => {
                const match = item.raw_label.trim() === item.legacy_line_item_raws.raw_text.trim();
                console.log(`  ${match ? '✅' : '❌'} ID:${item.id} - ${item.raw_label.substring(0, 30)}...`);
            });
        }
        
        console.log('✅ 旧原文データ移行完了');
        
    } catch (error) {
        console.error('予期しないエラー:', error);
    }
}

async function migratePositionData() {
    console.log('=== 位置データ移行開始 ===');
    
    try {
        // CSVファイルは存在しないので、既存のinvoice_line_items_splitテーブルから
        // positionカラムがまだあるかを確認して移行する
        
        // 1. invoice_line_items_splitのpositionデータを取得
        const { data: splitItems, error: selectError } = await supabase
            .from('invoice_line_items_split')
            .select('id, position')
            .not('position', 'is', null)
            .neq('position', '');
            
        if (selectError) {
            console.error('分割項目取得エラー:', selectError);
            return;
        }
        
        console.log(`取得した分割項目数: ${splitItems.length}`);
        
        if (splitItems.length === 0) {
            console.log('移行対象の位置データがありません');
            return;
        }
        
        // 2. 既存のwork_item_positionsをクリア
        const { error: deleteError } = await supabase
            .from('work_item_positions')
            .delete()
            .neq('id', 0); // 全削除のためのダミー条件
            
        if (deleteError) {
            console.error('既存位置データ削除エラー:', deleteError);
            return;
        }
        
        console.log('既存の位置データをクリア');
        
        // 3. 位置データを分割してwork_item_positionsに挿入
        const positionInserts = [];
        
        splitItems.forEach(item => {
            if (!item.position || item.position.trim() === '') return;
            
            // パイプ区切りで分割
            const positions = item.position.split('|').map(p => p.trim()).filter(p => p && p !== 'なし');
            
            positions.forEach(position => {
                positionInserts.push({
                    split_item_id: item.id,
                    position: position
                });
            });
        });
        
        if (positionInserts.length === 0) {
            console.log('有効な位置データがありません');
            return;
        }
        
        console.log(`挿入予定位置データ数: ${positionInserts.length}`);
        
        // サンプル表示
        console.log('サンプル位置データ:');
        positionInserts.slice(0, 5).forEach(item => {
            console.log(`  split_item_id:${item.split_item_id} - ${item.position}`);
        });
        
        const { data: insertResult, error: insertError } = await supabase
            .from('work_item_positions')
            .insert(positionInserts);
            
        if (insertError) {
            console.error('位置データ挿入エラー:', insertError);
            return;
        }
        
        console.log(`位置データ移行完了: ${positionInserts.length} 件挿入`);
        
        // 4. 検証
        const { count, error: countError } = await supabase
            .from('work_item_positions')
            .select('*', { count: 'exact', head: true });
            
        if (countError) {
            console.error('検証エラー:', countError);
            return;
        }
        
        console.log(`移行後位置データ件数: ${count}`);
        console.log('✅ 位置データ移行完了');
        
    } catch (error) {
        console.error('予期しないエラー:', error);
    }
}

async function main() {
    console.log('データ移行スクリプト開始');
    
    // 1. 旧原文データ移行
    await migrateLegacyRawData();
    
    console.log('');
    
    // 2. 位置データ移行  
    await migratePositionData();
    
    console.log('\n=== 全データ移行完了 ===');
}

main().catch(console.error);