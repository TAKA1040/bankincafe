// 現在のデータベースの状況を詳細確認するスクリプト
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://auwmmosfteomieyexkeh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1d21tb3NmdGVvbWlleWV4a2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzcxNTYsImV4cCI6MjA3MTAxMzE1Nn0.9SsGplOy1PQak1y7WLfzadvTOfm4NuuX8254lEctvj0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCurrentData() {
  console.log('=== 現在のデータベース詳細確認 ===');
  
  try {
    // 請求書データを取得（全フィールド）
    const { data: invoices, error } = await supabase
      .from('invoices')
      .select('*')
      .order('invoice_id')
      .limit(5);

    if (error) {
      console.error('データ取得エラー:', error);
      return;
    }

    console.log(`\\n=== 請求書データ（${invoices.length}件のサンプル） ===`);
    
    invoices.forEach((invoice, index) => {
      console.log(`\\n【請求書 ${index + 1}】`);
      console.log(`invoice_id: ${invoice.invoice_id}`);
      console.log(`invoice_number: ${invoice.invoice_number || 'NULL'}`);
      console.log(`issue_date: ${invoice.issue_date || 'NULL'}`);
      console.log(`billing_date: ${invoice.billing_date || 'NULL'}`);
      console.log(`billing_month: ${invoice.billing_month || 'NULL'}`);
      console.log(`customer_name: ${invoice.customer_name || 'NULL'}`);
      console.log(`subject_name: ${invoice.subject_name || 'NULL'}`);
      console.log(`registration_number: ${invoice.registration_number || 'NULL'}`);
      console.log(`purchase_order_number: ${invoice.purchase_order_number || 'NULL'}`);
      console.log(`order_number: ${invoice.order_number || 'NULL'}`);
      console.log(`subtotal: ${invoice.subtotal || 0}`);
      console.log(`tax: ${invoice.tax || 0}`);
      console.log(`total: ${invoice.total || 0}`);
      console.log(`total_amount: ${invoice.total_amount || 0}`);
      console.log(`status: ${invoice.status || 'NULL'}`);
      console.log(`payment_status: ${invoice.payment_status || 'NULL'}`);
    });

  } catch (error) {
    console.error('確認エラー:', error);
  }
}

// スクリプト実行
if (require.main === module) {
  checkCurrentData().catch(console.error);
}

module.exports = { checkCurrentData };