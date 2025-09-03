// 現在のDBにある請求書IDに対応するCSVデータのみを抽出
const fs = require('fs');
const path = require('path');

class CurrentDBInvoiceDataExtractor {
  constructor() {
    this.csvFilePath = 'C:\\Windsurf\\bankincafe\\請求書システム画像\\hondata\\dada2.csv';
    this.currentInvoiceIds = [
      '25043369-1', '25043370-1', '25043370-2', '25043371-1', '25043372-1',
      '25043373-1', '25043374-1', '25043375-1', '25043376-1', '25043377-1',
      '25043378-1', '25043379-1', '25043380-1', '25043385-1', '25043385-2',
      '25053381-1', '25053382-1', '25053383-1', '25053384-1', '25053386-1',
      '25053387-1', '25053388-1', '25053389-1', '25053390-1', '25053391-1',
      '25053392-1', '25053393-1', '25053394-1', '25053395-1', '25053396-1',
      '25053397-1', '25053398-1', '25053399-1', '25053400-1', '25053401-1',
      '25053401-2', '25053402-1', '25053403-1', '25053404-1', '25053405-1',
      '25053406-1', '25053407-1', '25053408-1', '25053409-1', '25053410-1',
      '25053411-1', '25053412-1', '25053413-1', '25053414-1', '25053415-1'
    ];
    this.extractedData = [];
  }

  // CSVファイルから現在のDBにある請求書のデータのみを抽出
  async extractCurrentDBData() {
    console.log('=== 現在のDB請求書データ抽出開始 ===');
    console.log(`対象請求書: ${this.currentInvoiceIds.length} 件`);
    
    if (!fs.existsSync(this.csvFilePath)) {
      throw new Error(`CSVファイルが見つかりません: ${this.csvFilePath}`);
    }
    
    const csvContent = fs.readFileSync(this.csvFilePath, 'utf8');
    console.log(`CSV file size: ${csvContent.length} characters`);
    console.log(`First 200 chars: ${csvContent.substring(0, 200)}`);
    const lines = csvContent.split('\n');
    
    // ヘッダー行を除く
    const dataLines = lines.slice(1).filter(line => line.trim());
    
    console.log(`CSV総データ行数: ${dataLines.length}`);
    
    const foundData = [];
    const currentIdSet = new Set(this.currentInvoiceIds);
    
    for (let i = 0; i < dataLines.length; i++) {
      try {
        const line = dataLines[i];
        const columns = line.split(',');
        
        if (columns.length < 11) continue;
        
        const invoiceNumber = columns[0]?.replace(/"/g, '')?.trim();
        
        if (!invoiceNumber || !currentIdSet.has(invoiceNumber)) continue;
        
        // 該当する請求書のデータを抽出
        const billingMonth = columns[1]?.replace(/"/g, '')?.trim();
        const billingDate = columns[2]?.replace(/"/g, '')?.trim();
        const customerName = columns[3]?.replace(/"/g, '')?.trim();
        const subjectName = columns[4]?.replace(/"/g, '')?.trim();
        const registrationNumber = columns[5]?.replace(/"/g, '')?.trim();
        const purchaseOrderNumber = columns[6]?.replace(/"/g, '')?.trim();
        const orderNumber = columns[7]?.replace(/"/g, '')?.trim();
        
        // 請求日の変換（YYYY/MM/DD → YYYY-MM-DD）
        let formattedBillingDate = null;
        if (billingDate && billingDate.includes('/')) {
          try {
            const parts = billingDate.split('/');
            if (parts.length === 3) {
              const year = parts[0];
              const month = parts[1].padStart(2, '0');
              const day = parts[2].padStart(2, '0');
              formattedBillingDate = `${year}-${month}-${day}`;
            }
          } catch (e) {
            console.warn(`請求日の変換に失敗: ${billingDate}`);
          }
        }
        
        foundData.push({
          invoice_id: invoiceNumber,
          invoice_number: invoiceNumber,
          billing_date: formattedBillingDate,
          customer_name: customerName || null,
          subject_name: subjectName || null,
          registration_number: registrationNumber || null,
          purchase_order_number: purchaseOrderNumber || null,
          order_number: orderNumber || null,
          billing_month: billingMonth || null
        });
        
        console.log(`✓ 見つかった: ${invoiceNumber} -> ${customerName}`);
        
      } catch (error) {
        console.error(`行 ${i + 2} の解析エラー:`, error.message);
      }
    }
    
    this.extractedData = foundData;
    
    console.log(`\\n=== 抽出結果 ===`);
    console.log(`対象請求書: ${this.currentInvoiceIds.length} 件`);
    console.log(`見つかったデータ: ${this.extractedData.length} 件`);
    console.log(`見つからなかった請求書: ${this.currentInvoiceIds.length - this.extractedData.length} 件`);
    
    // 見つからなかった請求書を表示
    const foundIds = new Set(this.extractedData.map(d => d.invoice_id));
    const missingIds = this.currentInvoiceIds.filter(id => !foundIds.has(id));
    if (missingIds.length > 0) {
      console.log(`\\n見つからなかった請求書:`, missingIds);
    }
    
    return this.extractedData;
  }

  // 現在のDBデータ用のSQLアップデート文を生成
  generateUpdateSQL() {
    console.log('\\n=== SQL生成開始 ===');
    
    if (this.extractedData.length === 0) {
      return '-- データが見つからないため、SQLは生成されませんでした。';
    }
    
    let sql = `-- 現在のDBにある請求書の不足データを更新するSQL
-- 作成日: ${new Date().toISOString()}
-- 対象件数: ${this.extractedData.length} 件

-- =====================================
-- 1. 不足フィールドを追加（存在しない場合のみ）
-- =====================================
ALTER TABLE invoices 
ADD COLUMN IF NOT EXISTS invoice_number TEXT,
ADD COLUMN IF NOT EXISTS billing_date DATE,
ADD COLUMN IF NOT EXISTS customer_name TEXT;

-- =====================================
-- 2. 現在のDBにある請求書データを更新
-- =====================================

UPDATE invoices SET 
  invoice_number = supplement.invoice_number,
  billing_date = supplement.billing_date::DATE,
  customer_name = supplement.customer_name
FROM (VALUES
`;

    const valueLines = this.extractedData.map(item => {
      const invoiceId = item.invoice_id.replace(/'/g, "''");
      const invoiceNumber = item.invoice_number.replace(/'/g, "''");
      const billingDate = item.billing_date || 'NULL';
      const customerName = item.customer_name ? `'${item.customer_name.replace(/'/g, "''")}'` : 'NULL';
      
      return `  ('${invoiceId}', '${invoiceNumber}', ${billingDate === 'NULL' ? 'NULL' : `'${billingDate}'`}, ${customerName})`;
    });
    
    sql += valueLines.join(',\\n');
    sql += `\\n) AS supplement(invoice_id, invoice_number, billing_date, customer_name)\\n`;
    sql += `WHERE invoices.invoice_id = supplement.invoice_id;\\n\\n`;

    // インデックス追加
    sql += `-- =====================================
-- 3. インデックス追加
-- =====================================
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_billing_date ON invoices(billing_date);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_name ON invoices(customer_name);

-- =====================================
-- 4. データ検証
-- =====================================
SELECT 
  COUNT(*) as total_invoices,
  COUNT(invoice_number) as has_invoice_number,
  COUNT(billing_date) as has_billing_date,
  COUNT(customer_name) as has_customer_name,
  COUNT(CASE WHEN invoice_number IS NOT NULL AND billing_date IS NOT NULL AND customer_name IS NOT NULL THEN 1 END) as complete_data
FROM invoices;

-- 更新された請求書の確認
SELECT 
  invoice_id,
  invoice_number,
  billing_date,
  customer_name,
  issue_date
FROM invoices 
WHERE invoice_number IS NOT NULL
ORDER BY invoice_id;

-- 完了メッセージ
SELECT '✅ 現在のDBにある請求書の不足データ更新完了: ${this.extractedData.length} 件' as result;
`;

    return sql;
  }

  // データとSQLファイルを保存
  saveFiles() {
    console.log('=== ファイル保存開始 ===');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputDir = './current-db-data-output';
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // JSONデータ保存
    const dataFile = path.join(outputDir, `current_db_invoice_data_${timestamp}.json`);
    fs.writeFileSync(dataFile, JSON.stringify(this.extractedData, null, 2));
    console.log(`データ保存: ${dataFile}`);
    
    // SQLファイル保存
    const sql = this.generateUpdateSQL();
    const sqlFile = path.join(outputDir, `update_current_db_invoices_${timestamp}.sql`);
    fs.writeFileSync(sqlFile, sql);
    console.log(`SQL保存: ${sqlFile}`);
    
    // 統計情報保存
    const foundIds = new Set(this.extractedData.map(d => d.invoice_id));
    const missingIds = this.currentInvoiceIds.filter(id => !foundIds.has(id));
    
    const stats = {
      timestamp: new Date().toISOString(),
      source_file: this.csvFilePath,
      target_invoice_count: this.currentInvoiceIds.length,
      found_data_count: this.extractedData.length,
      missing_data_count: missingIds.length,
      missing_invoice_ids: missingIds,
      has_customer_name: this.extractedData.filter(d => d.customer_name).length,
      has_billing_date: this.extractedData.filter(d => d.billing_date).length,
      files: {
        data: dataFile,
        sql: sqlFile
      }
    };
    
    const statsFile = path.join(outputDir, `current_db_extraction_stats_${timestamp}.json`);
    fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2));
    console.log(`統計情報保存: ${statsFile}`);
    
    return {
      dataFile,
      sqlFile,
      statsFile,
      stats
    };
  }

  // メイン実行
  async execute() {
    try {
      await this.extractCurrentDBData();
      const result = this.saveFiles();
      
      console.log('\\n=== 抽出完了サマリー ===');
      console.log(`対象請求書: ${this.currentInvoiceIds.length} 件`);
      console.log(`見つかったデータ: ${this.extractedData.length} 件`);
      console.log(`顧客名あり: ${result.stats.has_customer_name} 件`);
      console.log(`請求日あり: ${result.stats.has_billing_date} 件`);
      console.log(`SQLファイル: ${result.sqlFile}`);
      
      if (result.stats.missing_data_count > 0) {
        console.log(`\\n⚠️  CSVに見つからなかった請求書: ${result.stats.missing_data_count} 件`);
        console.log('これらの請求書は手動でデータを設定する必要があります。');
      }
      
      return result;
      
    } catch (error) {
      console.error('データ抽出エラー:', error);
      throw error;
    }
  }
}

// スクリプト直接実行時
if (require.main === module) {
  const extractor = new CurrentDBInvoiceDataExtractor();
  extractor.execute().catch(console.error);
}

module.exports = { CurrentDBInvoiceDataExtractor };