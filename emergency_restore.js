const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Supabase client setup
const supabaseUrl = 'https://auwmmosfteomieyexkeh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1d21tb3NmdGVvbWlleWV4a2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzcxNTYsImV4cCI6MjA3MTAxMzE1Nn0.9SsGplOy1PQak1y7WLfzadvTOfm4NuuX8254lEctvj0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function emergencyRestore() {
    console.log('🚨 緊急データ復旧開始');
    
    // CSV読み込み
    const csvPath = 'C:\\Windsurf\\bankincafe\\請求書システム画像\\hondata\\dada2.csv';
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',');
    const dataLines = lines.slice(1).filter(line => line.trim());
    
    console.log(`📊 CSV総行数: ${dataLines.length}`);
    
    // 現在のデータ確認
    const { data: currentData, error: countError } = await supabase
        .from('invoices')
        .select('invoice_id', { count: 'exact' });
    
    if (countError) {
        console.error('❌ 現在データ確認エラー:', countError);
        return;
    }
    
    console.log(`📋 現在のDB件数: ${currentData.length}`);
    
    // バッチ処理でインポート
    const batchSize = 100;
    let processed = 0;
    let errors = 0;
    
    for (let i = 0; i < dataLines.length; i += batchSize) {
        const batch = dataLines.slice(i, i + batchSize);
        const invoices = [];
        
        for (const line of batch) {
            const columns = line.split(',');
            if (columns.length < 11) continue;
            
            const invoiceId = columns[0]?.replace(/"/g, '')?.trim();
            if (!invoiceId) continue;
            
            // 日付変換
            let issueDate = null;
            const dateStr = columns[2]?.replace(/"/g, '')?.trim();
            if (dateStr && dateStr.includes('/')) {
                const parts = dateStr.split('/');
                if (parts.length === 3) {
                    issueDate = `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
                }
            }
            
            invoices.push({
                invoice_id: invoiceId,
                invoice_number: invoiceId,
                billing_month: columns[1]?.replace(/"/g, '')?.trim() || null,
                issue_date: issueDate,
                billing_date: issueDate,
                customer_name: columns[3]?.replace(/"/g, '')?.trim() || null,
                subject_name: columns[4]?.replace(/"/g, '')?.trim() || null,
                subject: columns[4]?.replace(/"/g, '')?.trim() || null,
                registration_number: columns[5]?.replace(/"/g, '')?.trim() || null,
                purchase_order_number: columns[6]?.replace(/"/g, '')?.trim() || null,
                order_number: columns[7]?.replace(/"/g, '')?.trim() || null,
                subtotal: parseFloat(columns[8]?.replace(/"/g, '') || '0') || 0,
                tax: parseFloat(columns[9]?.replace(/"/g, '') || '0') || 0,
                total_amount: parseFloat(columns[10]?.replace(/"/g, '') || '0') || 0,
                total: parseFloat(columns[10]?.replace(/"/g, '') || '0') || 0,
                status: 'finalized',
                payment_status: 'unpaid',
                customer_category: columns[3]?.includes('UDトラックス') ? 'UD' : 'その他'
            });
        }
        
        if (invoices.length > 0) {
            const { error } = await supabase
                .from('invoices')
                .upsert(invoices, { onConflict: 'invoice_id' });
            
            if (error) {
                console.error(`❌ バッチ ${Math.floor(i/batchSize) + 1} エラー:`, error.message);
                errors++;
            } else {
                processed += invoices.length;
                console.log(`✅ バッチ ${Math.floor(i/batchSize) + 1}: ${invoices.length}件処理 (累計: ${processed}件)`);
            }
        }
    }
    
    console.log('\n🎉 緊急復旧完了');
    console.log(`📊 処理件数: ${processed}`);
    console.log(`❌ エラー件数: ${errors}`);
    
    // 最終確認
    const { data: finalData } = await supabase
        .from('invoices')
        .select('invoice_id', { count: 'exact' });
    
    console.log(`📋 復旧後のDB件数: ${finalData.length}`);
}

emergencyRestore().catch(console.error);