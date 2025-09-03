// CSV大量バッチを段階的に処理するスクリプト
const { WorkItemParser } = require('./work-item-parser.js');
const { DatabaseImporter } = require('./database-importer.js');
const fs = require('fs');
const path = require('path');

class CSVBatchProcessor {
  constructor() {
    this.parser = new WorkItemParser();
    this.importer = new DatabaseImporter();
    this.totalStats = {
      processed: 0,
      success: 0,
      failed: 0,
      imported: 0,
      errors: 0
    };
  }

  async initialize() {
    console.log('=== システム初期化 ===');
    await this.parser.loadDictionaries();
    this.parser.initializeBasicRules();
    await this.importer.loadExistingDictionaries();
    console.log('初期化完了\\n');
  }

  // 単一バッチを処理
  async processSingleBatch(batchFile, batchNumber) {
    console.log(`\\n=== バッチ ${batchNumber} 処理開始 ===`);
    console.log(`ファイル: ${batchFile}`);
    
    // バッチデータ読み込み
    const workItems = JSON.parse(fs.readFileSync(batchFile, 'utf8'));
    console.log(`作業項目数: ${workItems.length} 件`);
    
    // 解析処理
    const parseResults = await this.parser.processBatch(workItems);
    console.log(`解析結果: 成功 ${parseResults.success} 件、失敗 ${parseResults.failed} 件`);
    
    // 統計更新
    this.totalStats.processed += workItems.length;
    this.totalStats.success += parseResults.success;
    this.totalStats.failed += parseResults.failed;
    
    // 成功した場合のみインポート
    if (parseResults.success > 0) {
      const outputFiles = this.parser.saveResults();
      const importResults = await this.importer.importBatch(outputFiles.processedFile);
      
      console.log(`インポート結果: 成功 ${importResults.success} 件、エラー ${importResults.errors} 件`);
      
      this.totalStats.imported += importResults.success;
      this.totalStats.errors += importResults.errors;
      
      // 新規辞書項目
      console.log(`新規追加: 対象 ${importResults.stats.newTargets}、動作 ${importResults.stats.newActions}、位置 ${importResults.stats.newPositions}`);
      
      return {
        batchNumber,
        parseResults,
        importResults,
        outputFiles
      };
    } else {
      console.log('解析成功データがないため、インポートをスキップ');
      return {
        batchNumber,
        parseResults,
        importResults: null
      };
    }
  }

  // 複数バッチを段階的処理
  async processMultipleBatches(startBatch = 1, endBatch = 5) {
    console.log(`\\n=== バッチ処理範囲: ${startBatch}～${endBatch} ===`);
    
    const csvDataDir = './csv-data';
    const batchFiles = fs.readdirSync(csvDataDir)
      .filter(file => file.startsWith('csv_batch_'))
      .sort();
    
    console.log(`利用可能バッチファイル: ${batchFiles.length} 個`);
    
    const results = [];
    
    for (let i = startBatch - 1; i < Math.min(endBatch, batchFiles.length); i++) {
      const batchFile = path.join(csvDataDir, batchFiles[i]);
      const batchNumber = i + 1;
      
      try {
        const result = await this.processSingleBatch(batchFile, batchNumber);
        results.push(result);
        
        // 進捗表示
        console.log(`\\n--- バッチ ${batchNumber} 完了 ---`);
        console.log(`累計: 処理 ${this.totalStats.processed}、成功 ${this.totalStats.success}、インポート ${this.totalStats.imported}`);
        
        // 少し待機（システムへの負荷軽減）
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`バッチ ${batchNumber} でエラー:`, error.message);
        this.totalStats.errors++;
      }
    }
    
    return results;
  }

  // 最終統計表示
  showFinalStats() {
    console.log('\\n=== 最終処理統計 ===');
    console.log(`総処理項目: ${this.totalStats.processed} 件`);
    console.log(`解析成功: ${this.totalStats.success} 件 (${(this.totalStats.success / this.totalStats.processed * 100).toFixed(1)}%)`);
    console.log(`解析失敗: ${this.totalStats.failed} 件 (${(this.totalStats.failed / this.totalStats.processed * 100).toFixed(1)}%)`);
    console.log(`インポート成功: ${this.totalStats.imported} 件`);
    console.log(`エラー: ${this.totalStats.errors} 件`);
    console.log(`\\n全体成功率: ${(this.totalStats.imported / this.totalStats.processed * 100).toFixed(1)}%`);
  }

  // メイン実行
  async execute(startBatch = 1, endBatch = 5) {
    try {
      await this.initialize();
      const results = await this.processMultipleBatches(startBatch, endBatch);
      this.showFinalStats();
      
      return {
        results,
        stats: this.totalStats
      };
      
    } catch (error) {
      console.error('バッチ処理エラー:', error);
      throw error;
    }
  }
}

// スクリプト直接実行時
if (require.main === module) {
  const args = process.argv.slice(2);
  const startBatch = args[0] ? parseInt(args[0]) : 1;
  const endBatch = args[1] ? parseInt(args[1]) : 3; // 最初は3バッチ（300件）だけ
  
  console.log(`バッチ処理実行: ${startBatch}～${endBatch}`);
  
  const processor = new CSVBatchProcessor();
  processor.execute(startBatch, endBatch).catch(console.error);
}

module.exports = { CSVBatchProcessor };