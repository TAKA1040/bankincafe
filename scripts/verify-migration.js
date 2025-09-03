// マイグレーション適用後のデータ検証スクリプト
const { createClient } = require('@supabase/supabase-js');

// Supabaseクライアント設定（環境変数から取得）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://auwmmosfteomieyexkeh.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1d21tb3NmdGVvbWlleWV4a2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzcxNTYsImV4cCI6MjA3MTAxMzE1Nn0.9SsGplOy1PQak1y7WLfzadvTOfm4NuuX8254lEctvj0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyMigration() {
  console.log('=== マイグレーション検証開始 ===');
  
  try {
    // 請求書データを取得
    const { data: invoices, error } = await supabase
      .from('invoices')
      .select(`
        invoice_id,
        invoice_number,
        billing_date,
        customer_name,
        issue_date,
        subject_name
      `)
      .order('invoice_id')
      .limit(10);

    if (error) {
      console.error('データ取得エラー:', error);
      return;
    }

    console.log(`\\n取得された請求書: ${invoices.length} 件`);
    
    // データ統計
    const stats = {
      total: invoices.length,
      hasInvoiceNumber: invoices.filter(inv => inv.invoice_number).length,
      hasBillingDate: invoices.filter(inv => inv.billing_date).length,
      hasCustomerName: invoices.filter(inv => inv.customer_name).length,
      completeData: invoices.filter(inv => 
        inv.invoice_number && inv.billing_date && inv.customer_name
      ).length
    };

    console.log('\\n=== データ統計 ===');
    console.log(`総件数: ${stats.total}`);
    console.log(`請求書番号あり: ${stats.hasInvoiceNumber} 件`);
    console.log(`請求日あり: ${stats.hasBillingDate} 件`);
    console.log(`顧客名あり: ${stats.hasCustomerName} 件`);
    console.log(`完全データ: ${stats.completeData} 件`);

    // サンプルデータ表示
    console.log('\\n=== サンプルデータ（最初の5件） ===');
    invoices.slice(0, 5).forEach(invoice => {
      console.log(`ID: ${invoice.invoice_id}`);
      console.log(`  請求書番号: ${invoice.invoice_number || 'NULL'}`);
      console.log(`  請求日: ${invoice.billing_date || 'NULL'}`);
      console.log(`  顧客名: ${invoice.customer_name || 'NULL'}`);
      console.log(`  発行日: ${invoice.issue_date || 'NULL'}`);
      console.log(`  件名: ${invoice.subject_name || 'NULL'}`);
      console.log('---');
    });

    // 成功率の計算
    const successRate = (stats.completeData / stats.total * 100).toFixed(1);
    console.log(`\\n=== 結果 ===`);
    if (stats.completeData === stats.total) {
      console.log(`✅ マイグレーション成功: ${successRate}% (${stats.completeData}/${stats.total})`);
      console.log('すべての請求書に必要なデータが追加されました！');
    } else {
      console.log(`⚠️  部分的成功: ${successRate}% (${stats.completeData}/${stats.total})`);
      console.log('一部の請求書でデータが不足しています。');
    }

  } catch (error) {
    console.error('検証エラー:', error);
  }
}

// スクリプト実行
if (require.main === module) {
  verifyMigration().catch(console.error);
}

module.exports = { verifyMigration };