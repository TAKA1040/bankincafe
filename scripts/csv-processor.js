// CSVファイルから大量の作業項目データを処理するスクリプト
const fs = require('fs');
const path = require('path');

class CSVProcessor {
  constructor() {
    this.csvFilePath = '../請求書システム画像/hondata/dada2.csv';
    this.processedData = [];
    this.stats = {
      totalRows: 0,
      processedItems: 0,
      skippedRows: 0
    };
  }

  // CSVファイルを読み込んでパース
  async loadCSVFile() {
    console.log('=== CSVファイル読み込み開始 ===');
    
    if (!fs.existsSync(this.csvFilePath)) {
      throw new Error(`CSVファイルが見つかりません: ${this.csvFilePath}`);
    }
    
    const csvContent = fs.readFileSync(this.csvFilePath, 'utf8');
    const lines = csvContent.split('\n');
    
    // ヘッダー行を除く
    const header = lines[0];
    const dataLines = lines.slice(1).filter(line => line.trim());
    
    console.log(`CSVファイル読み込み完了:`);
    console.log(`- 総行数: ${lines.length}`);
    console.log(`- データ行数: ${dataLines.length}`);
    
    this.stats.totalRows = dataLines.length;
    
    return { header, dataLines };
  }

  // CSV行をパースして作業項目を抽出
  parseCSVLine(line, rowIndex) {
    try {
      // CSVの項目を分割（簡単な分割、複雑な場合は専用ライブラリ使用）
      const columns = line.split(',');
      
      if (columns.length < 12) {
        this.stats.skippedRows++;
        return null;
      }
      
      const invoiceNumber = columns[0]?.replace(/"/g, '')?.trim();
      const customerName = columns[3]?.replace(/"/g, '')?.trim();
      const subjectName = columns[4]?.replace(/"/g, '')?.trim();
      const registrationNumber = columns[5]?.replace(/"/g, '')?.trim();
      
      // 作業項目を抽出（品名1～品名32）
      const workItems = [];
      
      for (let i = 11; i < columns.length; i += 4) { // 品名、数量、単価、金額の4項目セット
        const description = columns[i]?.replace(/"/g, '')?.trim();
        const quantity = columns[i + 1]?.replace(/"/g, '')?.trim();
        const unitPrice = columns[i + 2]?.replace(/"/g, '')?.trim();
        const amount = columns[i + 3]?.replace(/"/g, '')?.trim();
        
        if (description && description !== '') {
          workItems.push({
            id: `csv_${rowIndex}_${workItems.length + 1}`,
            description: description,
            text: description, // parser用
            work_description: description, // parser用
            quantity: quantity ? parseInt(quantity) : 1,
            unit_price: unitPrice ? parseInt(unitPrice) : 0,
            price: unitPrice ? parseInt(unitPrice) : 0, // parser用
            amount: amount ? parseInt(amount) : 0,
            invoice_id: invoiceNumber,
            invoice_number: invoiceNumber,
            customer_name: customerName,
            subject_name: subjectName,
            registration_number: registrationNumber,
            source_table: 'csv_file',
            csv_row_index: rowIndex
          });
          
          this.stats.processedItems++;
        }
      }
      
      return workItems;
      
    } catch (error) {
      console.error(`行 ${rowIndex} の解析エラー:`, error.message);
      this.stats.skippedRows++;
      return null;
    }
  }

  // CSVファイル全体を処理
  async processCSVFile() {
    console.log('=== CSV処理開始 ===');
    
    const { header, dataLines } = await this.loadCSVFile();
    console.log(`ヘッダー: ${header.substring(0, 100)}...`);
    
    let allWorkItems = [];
    
    for (let i = 0; i < dataLines.length; i++) {
      const line = dataLines[i];
      if (line.trim()) {
        const workItems = this.parseCSVLine(line, i + 2); // ヘッダー行分+1
        
        if (workItems && workItems.length > 0) {
          allWorkItems = allWorkItems.concat(workItems);
        }
        
        // 進捗表示（100行ごと）
        if ((i + 1) % 100 === 0) {
          console.log(`進捗: ${i + 1}/${dataLines.length} 行処理済み (作業項目: ${allWorkItems.length} 件)`);
        }
      }
    }
    
    this.processedData = allWorkItems;
    
    console.log('=== CSV処理完了 ===');
    console.log(`総データ行: ${this.stats.totalRows}`);
    console.log(`抽出された作業項目: ${this.stats.processedItems} 件`);
    console.log(`スキップした行: ${this.stats.skippedRows} 件`);
    
    return allWorkItems;
  }

  // バッチファイルを作成（100件ずつ分割）
  createBatchFiles(workItems) {
    console.log('=== バッチファイル作成 ===');
    
    const BATCH_SIZE = 100;
    const batches = [];
    
    for (let i = 0; i < workItems.length; i += BATCH_SIZE) {
      batches.push(workItems.slice(i, i + BATCH_SIZE));
    }
    
    // 出力ディレクトリ作成
    const outputDir = './csv-data';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // 全データを保存
    const allDataFile = path.join(outputDir, `csv_work_items_${timestamp}.json`);
    fs.writeFileSync(allDataFile, JSON.stringify(workItems, null, 2));
    console.log(`全データ保存: ${allDataFile}`);
    
    // バッチファイルを作成
    const batchFiles = [];
    batches.forEach((batch, index) => {
      const batchFile = path.join(outputDir, `csv_batch_${String(index + 1).padStart(3, '0')}_${timestamp}.json`);
      fs.writeFileSync(batchFile, JSON.stringify(batch, null, 2));
      batchFiles.push(batchFile);
    });
    
    console.log(`バッチファイル作成完了: ${batchFiles.length} 個 (各${BATCH_SIZE}件)`);
    
    // 統計情報を保存
    const stats = {
      timestamp: new Date().toISOString(),
      source_file: this.csvFilePath,
      total_csv_rows: this.stats.totalRows,
      total_work_items: workItems.length,
      total_batches: batches.length,
      batch_size: BATCH_SIZE,
      skipped_rows: this.stats.skippedRows,
      files: {
        all_data: allDataFile,
        batches: batchFiles
      }
    };
    
    const statsFile = path.join(outputDir, `csv_processing_stats_${timestamp}.json`);
    fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2));
    console.log(`統計情報保存: ${statsFile}`);
    
    return {
      batchFiles,
      stats,
      allDataFile,
      statsFile
    };
  }

  // メイン実行
  async execute() {
    try {
      const workItems = await this.processCSVFile();
      const result = this.createBatchFiles(workItems);
      
      console.log('\\n=== CSV処理完了サマリー ===');
      console.log(`処理したCSV行数: ${this.stats.totalRows}`);
      console.log(`抽出した作業項目: ${workItems.length} 件`);
      console.log(`作成したバッチ数: ${result.batchFiles.length} 個`);
      console.log(`成功率: ${((workItems.length / this.stats.totalRows) * 100).toFixed(1)}%`);
      
      return result;
      
    } catch (error) {
      console.error('CSV処理エラー:', error);
      throw error;
    }
  }
}

// スクリプト直接実行時
if (require.main === module) {
  const processor = new CSVProcessor();
  processor.execute().catch(console.error);
}

module.exports = { CSVProcessor };