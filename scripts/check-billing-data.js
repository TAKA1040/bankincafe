// 請求書番号と請求月の正しいデータを確認するスクリプト
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://auwmmosfteomieyexkeh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1d21tb3NmdGVvbWlleWV4a2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzcxNTYsImV4cCI6MjA3MTAxMzE1Nn0.9SsGplOy1PQak1y7WLfzadvTOfm4NuuX8254lEctvj0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBillingData() {
  console.log('=== 請求書番号と請求月データ確認 ===');
  
  try {
    const { data: invoices, error } = await supabase
      .from('invoices')
      .select(`
        invoice_id,
        invoice_number,
        issue_date,
        billing_date,
        billing_month,
        customer_name,
        subject_name
      `)
      .order('invoice_id')
      .limit(5);

    if (error) {
      console.error('データ取得エラー:', error);
      return;
    }

    console.log('\\n=== 現在のデータ状況 ===');
    invoices.forEach((invoice, index) => {
      console.log(`\\n【請求書 ${index + 1}】`);
      console.log(`invoice_id: ${invoice.invoice_id}`);
      console.log(`invoice_number: ${invoice.invoice_number || 'NULL'}`);
      console.log(`issue_date: ${invoice.issue_date || 'NULL'}`);
      console.log(`billing_date: ${invoice.billing_date || 'NULL'}`);
      console.log(`billing_month: ${invoice.billing_month || 'NULL'}`);
      
      console.log('\\n--- 想定される1列目表示 ---');
      console.log(`請求書番号: ${invoice.invoice_id} (invoice_idを使うべき？)`);
      console.log(`発行日: ${invoice.issue_date || 'NULL'}`);
      console.log(`請求月: ${invoice.billing_month ? formatBillingMonth(invoice.billing_month) : 'NULL'} (YYMMをYY年M月に変換)`);
    });

    console.log('\\n=== 修正すべき項目 ===');
    console.log('1. 請求書番号: invoice_id を使う（例: 25043369-1）');
    console.log('2. 発行日: issue_date をそのまま使う');
    console.log('3. 請求月: billing_month を YYMM → YY年M月 形式に変換');

  } catch (error) {
    console.error('確認エラー:', error);
  }
}

// YYMM を YY年M月 に変換する関数
function formatBillingMonth(billingMonth) {
  if (!billingMonth || billingMonth.length !== 4) return billingMonth;
  
  const year = billingMonth.substring(0, 2);
  const month = parseInt(billingMonth.substring(2, 4));
  
  return `${year}年${month}月`;
}

// スクリプト実行
if (require.main === module) {
  checkBillingData().catch(console.error);
}

module.exports = { checkBillingData };