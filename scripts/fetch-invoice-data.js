// 過去の請求書データから作業項目を取得するスクリプト
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://auwmmosfteomieyexkeh.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1d21tb3NmdGVvbWlleWV4a2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzcxNTYsImV4cCI6MjA3MTAxMzE1Nn0.9SsGplOy1PQak1y7WLfzadvTOfm4NuuX8254lEctvj0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchInvoiceWorkItems() {
  console.log('=== 過去の請求書データから作業項目取得 ===\n');
  
  try {
    // invoice_line_items から作業項目データを取得
    console.log('invoice_line_items テーブルから作業項目を取得中...');
    const { data: invoiceItems, error: itemsError } = await supabase
      .from('invoice_line_items')
      .select(`
        id,
        raw_label,
        quantity,
        unit_price,
        amount,
        invoice_id,
        task_type,
        action,
        target,
        position,
        performed_at,
        created_at,
        invoices(
          invoice_id,
          invoice_number,
          subject_name,
          issue_date
        )
      `)
      .not('raw_label', 'is', null)
      .neq('raw_label', '')
      .order('created_at', { ascending: false });
    
    if (itemsError) throw itemsError;
    
    console.log(`取得件数: ${invoiceItems.length} 件`);
    
    // データ形式を統一
    const workItems = invoiceItems.map(item => ({
      id: item.id,
      description: item.raw_label,
      text: item.raw_label, // parser用
      work_description: item.raw_label, // parser用
      quantity: item.quantity || 1,
      unit_price: item.unit_price || 0,
      price: item.unit_price || 0, // parser用
      amount: item.amount || 0,
      invoice_id: item.invoice_id,
      invoice_number: item.invoices?.invoice_number || '',
      subject_name: item.invoices?.subject_name || '',
      issue_date: item.invoices?.issue_date || '',
      task_type: item.task_type || 'fuzzy',
      existing_action: item.action || '',
      existing_target: item.target || '',
      existing_position: item.position || '',
      performed_at: item.performed_at || '',
      created_at: item.created_at || '',
      source_table: 'invoice_line_items'
    }));
    
    // データの概要を表示
    console.log('\n=== データ概要 ===');
    console.log(`総作業項目数: ${workItems.length} 件`);
    
    // 重複する説明文をチェック
    const descriptionCount = {};
    workItems.forEach(item => {
      const desc = item.description.trim();
      descriptionCount[desc] = (descriptionCount[desc] || 0) + 1;
    });
    
    // 既に解析済みのデータをカウント
    const alreadyParsed = workItems.filter(item => 
      item.existing_target && item.existing_action
    ).length;
    
    console.log(`既に解析済み: ${alreadyParsed} 件 (${((alreadyParsed/workItems.length)*100).toFixed(1)}%)`);
    console.log(`未解析: ${workItems.length - alreadyParsed} 件 (${(((workItems.length - alreadyParsed)/workItems.length)*100).toFixed(1)}%)`);
    
    const duplicateDescriptions = Object.entries(descriptionCount)
      .filter(([desc, count]) => count > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    console.log('\n=== よく使われる作業項目 (上位10件) ===');
    duplicateDescriptions.forEach(([desc, count], index) => {
      console.log(`${index + 1}. "${desc}" - ${count} 回`);
    });
    
    // バッチサイズごとに分割
    const BATCH_SIZE = 100;
    const batches = [];
    for (let i = 0; i < workItems.length; i += BATCH_SIZE) {
      batches.push(workItems.slice(i, i + BATCH_SIZE));
    }
    
    console.log(`\n${BATCH_SIZE}件ずつ ${batches.length} バッチに分割`);
    
    // 出力ディレクトリ作成
    const outputDir = './raw-data';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // 全データを保存
    const allDataFile = path.join(outputDir, `invoice_work_items_${timestamp}.json`);
    fs.writeFileSync(allDataFile, JSON.stringify(workItems, null, 2));
    console.log(`\n全データ保存: ${allDataFile}`);
    
    // バッチファイルを保存
    const batchFiles = [];
    batches.forEach((batch, index) => {
      const batchFile = path.join(outputDir, `batch_${String(index + 1).padStart(3, '0')}_${timestamp}.json`);
      fs.writeFileSync(batchFile, JSON.stringify(batch, null, 2));
      batchFiles.push(batchFile);
    });
    
    console.log(`バッチファイル保存完了: ${batchFiles.length} 個`);
    
    // 統計情報を保存
    const stats = {
      timestamp: new Date().toISOString(),
      total_items: workItems.length,
      total_batches: batches.length,
      batch_size: BATCH_SIZE,
      unique_descriptions: Object.keys(descriptionCount).length,
      duplicate_descriptions: duplicateDescriptions,
      earliest_date: workItems[workItems.length - 1]?.created_at || '',
      latest_date: workItems[0]?.created_at || '',
      files: {
        all_data: allDataFile,
        batches: batchFiles
      }
    };
    
    const statsFile = path.join(outputDir, `fetch_stats_${timestamp}.json`);
    fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2));
    console.log(`統計情報保存: ${statsFile}`);
    
    console.log('\n=== データ取得完了 ===');
    return {
      workItems,
      batches: batchFiles,
      stats
    };
    
  } catch (error) {
    console.error('データ取得エラー:', error);
    throw error;
  }
}

// スクリプト直接実行時
if (require.main === module) {
  fetchInvoiceWorkItems().catch(console.error);
}

module.exports = { fetchInvoiceWorkItems };