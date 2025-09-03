// 請求書明細のtask_type確認スクリプト
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://auwmmosfteomieyexkeh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1d21tb3NmdGVvbWlleWV4a2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzcxNTYsImV4cCI6MjA3MTAxMzE1Nn0.9SsGplOy1PQak1y7WLfzadvTOfm4NuuX8254lEctvj0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyTaskTypes() {
  console.log('=== 請求書明細のtask_type確認 ===');
  
  try {
    // ライン項目のtask_type確認
    const { data: lineItems, error } = await supabase
      .from('invoice_line_items')
      .select('invoice_id, line_no, task_type, raw_label')
      .order('invoice_id, line_no')
      .limit(10);

    if (error) {
      console.error('データ取得エラー:', error);
      return;
    }

    console.log(`\\n=== 明細項目データ（${lineItems.length}件のサンプル） ===`);
    
    lineItems.forEach((item, index) => {
      const prefix = item.task_type === 'set' ? 'S:' : 'T:';
      const displayName = `${prefix}${item.raw_label || '作業内容なし'}`;
      
      console.log(`\\n【項目 ${index + 1}】`);
      console.log(`invoice_id: ${item.invoice_id}`);
      console.log(`line_no: ${item.line_no}`);
      console.log(`task_type: ${item.task_type}`);
      console.log(`raw_label: ${item.raw_label || 'NULL'}`);
      console.log(`表示名: ${displayName}`);
    });

    // task_typeの分布確認
    const taskTypeCounts = lineItems.reduce((acc, item) => {
      acc[item.task_type] = (acc[item.task_type] || 0) + 1;
      return acc;
    }, {});

    console.log('\\n=== task_type分布 ===');
    Object.entries(taskTypeCounts).forEach(([type, count]) => {
      const prefix = type === 'set' ? 'S:' : 'T:';
      console.log(`${type} (${prefix}): ${count}件`);
    });

    // 分割項目の確認
    const { data: splitItems, error: splitError } = await supabase
      .from('invoice_line_items_split')
      .select('invoice_id, line_no, sub_no, raw_label_part')
      .limit(5);

    if (splitError) {
      console.error('分割項目取得エラー:', splitError);
      return;
    }

    if (splitItems && splitItems.length > 0) {
      console.log(`\\n=== 分割項目データ（${splitItems.length}件のサンプル） ===`);
      splitItems.forEach((item, index) => {
        console.log(`\\n【分割項目 ${index + 1}】`);
        console.log(`invoice_id: ${item.invoice_id}, line_no: ${item.line_no}, sub_no: ${item.sub_no}`);
        console.log(`raw_label_part: ${item.raw_label_part}`);
      });
    } else {
      console.log('\\n分割項目は見つかりませんでした');
    }

  } catch (error) {
    console.error('検証エラー:', error);
  }
}

// スクリプト実行
if (require.main === module) {
  verifyTaskTypes().catch(console.error);
}

module.exports = { verifyTaskTypes };