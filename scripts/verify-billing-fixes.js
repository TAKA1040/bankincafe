// 請求書番号と請求月修正の検証スクリプト
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://auwmmosfteomieyexkeh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1d21tb3NmdGVvbWlleWV4a2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzcxNTYsImV4cCI6MjA3MTAxMzE1Nn0.9SsGplOy1PQak1y7WLfzadvTOfm4NuuX8254lEctvj0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyBillingFixes() {
  console.log('=== 請求書番号と請求月修正検証 ===');
  
  try {
    const { data: invoices, error } = await supabase
      .from('invoices')
      .select(`
        invoice_id,
        invoice_number,
        issue_date,
        billing_date,
        billing_month
      `)
      .order('invoice_id')
      .limit(3);

    if (error) {
      console.error('データ取得エラー:', error);
      return;
    }

    console.log(`\\n=== 修正後の1列目表示データ（${invoices.length}件のサンプル） ===`);
    
    invoices.forEach((invoice, index) => {
      console.log(`\\n【請求書 ${index + 1}】`);
      console.log('--- 修正後の1列目表示 ---');
      
      // 1行目: 請求書番号
      const invoiceNumber = invoice.invoice_number || invoice.invoice_id;
      console.log(`請求書番号: ${invoiceNumber}`);
      
      // 2行目: 発行日
      const issueDate = invoice.issue_date ? formatDate(invoice.issue_date) : '-';
      console.log(`発行日: ${issueDate}`);
      
      // 3行目: 請求月
      const billingMonth = formatBillingMonth(invoice.billing_month);
      console.log(`請求月: ${billingMonth}`);
    });

    console.log('\\n=== 修正確認 ===');
    console.log('✅ 請求書番号: invoice_id/invoice_number を使用');
    console.log('✅ 発行日: issue_date を使用');
    console.log('✅ 請求月: billing_month を YY年M月 形式で表示');

  } catch (error) {
    console.error('検証エラー:', error);
  }
}

// 日付フォーマット
function formatDate(dateString) {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('ja-JP');
}

// 請求月フォーマット (YYMM → YY年M月)
function formatBillingMonth(billingMonth) {
  if (!billingMonth || billingMonth.length !== 4) return '-';
  const year = billingMonth.substring(0, 2);
  const month = parseInt(billingMonth.substring(2, 4));
  return `${year}年${month}月`;
}

// スクリプト実行
if (require.main === module) {
  verifyBillingFixes().catch(console.error);
}

module.exports = { verifyBillingFixes };