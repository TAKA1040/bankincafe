// CSVファイルから不足している請求書データ（顧客名、請求書番号、請求日）を抽出
const fs = require('fs');
const path = require('path');

class InvoiceDataExtractor {
  constructor() {
    this.csvFilePath = '../請求書システム画像/hondata/dada2.csv';
    this.extractedData = [];
  }

  // CSVファイルを読み込んで不足データを抽出
  async extractMissingData() {
    console.log('=== 不足請求書データ抽出開始 ===');
    
    if (!fs.existsSync(this.csvFilePath)) {
      throw new Error(`CSVファイルが見つかりません: ${this.csvFilePath}`);
    }
    
    const csvContent = fs.readFileSync(this.csvFilePath, 'utf8');
    const lines = csvContent.split('\n');
    
    // ヘッダー行を除く
    const dataLines = lines.slice(1).filter(line => line.trim());
    
    console.log(`データ行数: ${dataLines.length}`);
    
    const invoiceDataMap = new Map(); // 請求書番号をキーとするマップ
    
    for (let i = 0; i < dataLines.length; i++) {
      try {
        const line = dataLines[i];
        const columns = line.split(',');
        
        if (columns.length < 11) continue;
        
        // CSVの列構造（0-based）
        // 0: 請求書番号, 1: 請求月, 2: 請求日, 3: 請求先, 4: 件名, 5: 登録番号
        // 6: 発注番号, 7: オーダー番号, 8: 小計, 9: 消費税, 10: 請求金額
        const invoiceNumber = columns[0]?.replace(/"/g, '')?.trim();
        const billingMonth = columns[1]?.replace(/"/g, '')?.trim();
        const billingDate = columns[2]?.replace(/"/g, '')?.trim();
        const customerName = columns[3]?.replace(/"/g, '')?.trim();
        const subjectName = columns[4]?.replace(/"/g, '')?.trim();
        const registrationNumber = columns[5]?.replace(/"/g, '')?.trim();
        const purchaseOrderNumber = columns[6]?.replace(/"/g, '')?.trim();
        const orderNumber = columns[7]?.replace(/"/g, '')?.trim();
        
        if (!invoiceNumber) continue;
        
        // 請求書番号ベースで重複を避ける
        if (!invoiceDataMap.has(invoiceNumber)) {
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
          
          invoiceDataMap.set(invoiceNumber, {
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
        }
      } catch (error) {
        console.error(`行 ${i + 2} の解析エラー:`, error.message);
      }
    }
    
    this.extractedData = Array.from(invoiceDataMap.values());
    
    console.log(`抽出された請求書データ: ${this.extractedData.length} 件`);
    return this.extractedData;
  }

  // SQLアップデート文を生成
  generateUpdateSQL() {
    console.log('=== SQL生成開始 ===');
    
    let sql = `-- 不足している請求書データを更新するSQL
-- 作成日: ${new Date().toISOString()}

-- =====================================
-- 1. 不足フィールドを追加（存在しない場合のみ）
-- =====================================
ALTER TABLE invoices 
ADD COLUMN IF NOT EXISTS invoice_number TEXT,
ADD COLUMN IF NOT EXISTS billing_date DATE,
ADD COLUMN IF NOT EXISTS customer_name TEXT;

-- =====================================
-- 2. CSVデータから不足データを更新
-- =====================================

`;

    // バッチアップデート用のSQLを生成
    const batchSize = 50;
    for (let i = 0; i < this.extractedData.length; i += batchSize) {
      const batch = this.extractedData.slice(i, i + batchSize);
      
      sql += `-- バッチ ${Math.floor(i / batchSize) + 1}: ${batch.length} 件\n`;
      sql += `UPDATE invoices SET \n`;
      sql += `  invoice_number = supplement.invoice_number,\n`;
      sql += `  billing_date = supplement.billing_date::DATE,\n`;
      sql += `  customer_name = supplement.customer_name\n`;
      sql += `FROM (VALUES\n`;
      
      const valueLines = batch.map(item => {
        const invoiceId = item.invoice_id.replace(/'/g, "''");
        const invoiceNumber = item.invoice_number.replace(/'/g, "''");
        const billingDate = item.billing_date || 'NULL';
        const customerName = item.customer_name ? `'${item.customer_name.replace(/'/g, "''")}'` : 'NULL';
        
        return `  ('${invoiceId}', '${invoiceNumber}', ${billingDate === 'NULL' ? 'NULL' : `'${billingDate}'`}, ${customerName})`;
      });
      
      sql += valueLines.join(',\n');
      sql += `\n) AS supplement(invoice_id, invoice_number, billing_date, customer_name)\n`;
      sql += `WHERE invoices.invoice_id = supplement.invoice_id;\n\n`;
    }

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
  COUNT(customer_name) as has_customer_name
FROM invoices;

-- 完了メッセージ
SELECT '✅ 不足している請求書データの更新完了' as result;
`;

    return sql;
  }

  // データとSQLファイルを保存
  saveFiles() {
    console.log('=== ファイル保存開始 ===');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputDir = './missing-data-output';
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // JSONデータ保存
    const dataFile = path.join(outputDir, `missing_invoice_data_${timestamp}.json`);
    fs.writeFileSync(dataFile, JSON.stringify(this.extractedData, null, 2));
    console.log(`データ保存: ${dataFile}`);
    
    // SQLファイル保存
    const sql = this.generateUpdateSQL();
    const sqlFile = path.join(outputDir, `update_missing_invoice_data_${timestamp}.sql`);
    fs.writeFileSync(sqlFile, sql);
    console.log(`SQL保存: ${sqlFile}`);
    
    // 統計情報保存
    const stats = {
      timestamp: new Date().toISOString(),
      source_file: this.csvFilePath,
      total_extracted: this.extractedData.length,
      has_customer_name: this.extractedData.filter(d => d.customer_name).length,
      has_billing_date: this.extractedData.filter(d => d.billing_date).length,
      files: {
        data: dataFile,
        sql: sqlFile
      }
    };
    
    const statsFile = path.join(outputDir, `extraction_stats_${timestamp}.json`);
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
      await this.extractMissingData();
      const result = this.saveFiles();
      
      console.log('\n=== 抽出完了サマリー ===');
      console.log(`抽出した請求書: ${this.extractedData.length} 件`);
      console.log(`顧客名あり: ${result.stats.has_customer_name} 件`);
      console.log(`請求日あり: ${result.stats.has_billing_date} 件`);
      console.log(`SQLファイル: ${result.sqlFile}`);
      
      return result;
      
    } catch (error) {
      console.error('データ抽出エラー:', error);
      throw error;
    }
  }
}

// スクリプト直接実行時
if (require.main === module) {
  const extractor = new InvoiceDataExtractor();
  extractor.execute().catch(console.error);
}

module.exports = { InvoiceDataExtractor };