// データマッピング修正の検証スクリプト
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://auwmmosfteomieyexkeh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1d21tb3NmdGVvbWlleWV4a2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzcxNTYsImV4cCI6MjA3MTAxMzE1Nn0.9SsGplOy1PQak1y7WLfzadvTOfm4NuuX8254lEctvj0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyFixes() {
  console.log('=== データマッピング修正検証 ===');
  
  try {
    // 修正されたフィールドを取得
    const { data: invoices, error } = await supabase
      .from('invoices')
      .select(`
        invoice_id,
        invoice_number,
        billing_month,
        customer_name,
        subject_name,
        registration_number,
        purchase_order_number,
        order_number,
        subtotal,
        tax,
        total,
        total_amount
      `)
      .order('invoice_id')
      .limit(3);

    if (error) {
      console.error('データ取得エラー:', error);
      return;
    }

    console.log(`\\n=== 修正後の表示データ（${invoices.length}件のサンプル） ===`);
    
    invoices.forEach((invoice, index) => {
      console.log(`\\n【請求書 ${index + 1}】`);
      console.log('--- 1列目表示データ ---');
      console.log(`請求書番号: ${invoice.billing_month || invoice.invoice_number || invoice.invoice_id} (billing_month優先)`);
      
      console.log('--- 2列目表示データ ---');
      console.log(`請求先: ${invoice.customer_name || 'NULL'}`);
      console.log(`件名: ${invoice.subject_name || 'NULL'}`);
      console.log(`登録番号: ${invoice.registration_number || 'NULL'}`);
      
      console.log('--- 3列目表示データ ---');
      console.log(`発注番号: ${invoice.purchase_order_number || 'NULL'}`);
      console.log(`オーダー番号: ${invoice.order_number || 'NULL'}`);
      
      console.log('--- 6列目表示データ ---');
      console.log(`請求金額: ${invoice.total_amount || invoice.total || 0} (total_amount優先)`);
      console.log(`  - subtotal: ${invoice.subtotal || 0}`);
      console.log(`  - tax: ${invoice.tax || 0}`);
      console.log(`  - total: ${invoice.total || 0}`);
      console.log(`  - total_amount: ${invoice.total_amount || 0}`);
    });

    // 修正点の検証
    console.log('\\n=== 修正点検証 ===');
    
    // 1. 請求書番号が4桁かチェック
    const correctInvoiceNumbers = invoices.filter(inv => 
      inv.billing_month && inv.billing_month.length === 4
    ).length;
    console.log(`✅ 請求書番号（4桁）: ${correctInvoiceNumbers}/${invoices.length} 件`);
    
    // 2. 発注番号とオーダー番号が異なるかチェック
    const differentOrderNumbers = invoices.filter(inv => 
      inv.purchase_order_number !== inv.order_number
    ).length;
    console.log(`✅ 発注番号≠オーダー番号: ${differentOrderNumbers}/${invoices.length} 件`);
    
    // 3. 請求金額が0でないかチェック
    const nonZeroAmounts = invoices.filter(inv => 
      (inv.total_amount || inv.total || 0) > 0
    ).length;
    console.log(`✅ 請求金額>0: ${nonZeroAmounts}/${invoices.length} 件`);

    console.log('\\n=== 修正結果サマリー ===');
    if (correctInvoiceNumbers === invoices.length && 
        differentOrderNumbers === invoices.length && 
        nonZeroAmounts === invoices.length) {
      console.log('🎉 すべての修正が正常に適用されました！');
    } else {
      console.log('⚠️  一部の修正に問題があります。詳細を確認してください。');
    }

  } catch (error) {
    console.error('検証エラー:', error);
  }
}

// スクリプト実行
if (require.main === module) {
  verifyFixes().catch(console.error);
}

module.exports = { verifyFixes };