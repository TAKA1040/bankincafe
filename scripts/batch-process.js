// 大量データのバッチ処理スクリプト
const { WorkItemParser } = require('./work-item-parser.js');
const { DatabaseImporter } = require('./database-importer.js');
const fs = require('fs');
const path = require('path');

async function processBatch() {
  console.log('=== 大量データバッチ処理開始 ===\n');
  
  // 最新のデータファイルを取得
  const rawDataDir = './raw-data';
  if (!fs.existsSync(rawDataDir)) {
    throw new Error('raw-data ディレクトリが存在しません。先にfetch-invoice-data.jsを実行してください。');
  }
  
  const files = fs.readdirSync(rawDataDir)
    .filter(file => file.startsWith('batch_001_'))
    .sort()
    .reverse();
  
  if (files.length === 0) {
    throw new Error('バッチファイルが見つかりません。');
  }
  
  const latestBatchFile = path.join(rawDataDir, files[0]);
  console.log(`処理対象ファイル: ${latestBatchFile}`);
  
  // パーサー初期化
  const parser = new WorkItemParser();
  
  // 辞書データ読み込み
  await parser.loadDictionaries();
  
  // 基本ルール初期化
  parser.initializeBasicRules();
  
  // バッチファイルを読み込み
  const workItems = JSON.parse(fs.readFileSync(latestBatchFile, 'utf8'));
  console.log(`\n処理対象: ${workItems.length} 件の作業項目`);
  
  // 解析処理実行
  const parseResults = await parser.processBatch(workItems);
  
  console.log(`\n=== 解析結果 ===`);
  console.log(`成功: ${parseResults.success} 件 (${parseResults.successRate}%)`);
  console.log(`失敗: ${parseResults.failed} 件`);
  
  // 結果保存
  const outputFiles = parser.saveResults();
  
  console.log(`\n=== 解析結果ファイル ===`);
  console.log(`処理成功: ${outputFiles.processedFile}`);
  console.log(`未処理: ${outputFiles.unprocessedFile}`);
  console.log(`統計: ${outputFiles.statsFile}`);
  
  // データベースインポート処理
  if (parseResults.success > 0) {
    console.log(`\n=== データベースインポート開始 ===`);
    
    const importer = new DatabaseImporter();
    const importResults = await importer.importBatch(outputFiles.processedFile);
    
    console.log(`\n=== インポート結果 ===`);
    console.log(`成功: ${importResults.success} 件`);
    console.log(`エラー: ${importResults.errors} 件`);
    console.log(`成功率: ${importResults.successRate}%`);
    
    console.log(`\n--- 追加された辞書項目 ---`);
    console.log(`新しい対象: ${importResults.stats.newTargets} 件`);
    console.log(`新しい動作: ${importResults.stats.newActions} 件`);
    console.log(`新しい位置: ${importResults.stats.newPositions} 件`);
    
    // インポートログ保存
    importer.saveImportLog();
    
    return {
      parseResults,
      importResults,
      outputFiles
    };
  } else {
    console.log('\n解析に成功したデータがないため、インポートをスキップします。');
    return {
      parseResults,
      outputFiles
    };
  }
}

// スクリプト直接実行時
if (require.main === module) {
  processBatch()
    .then(results => {
      console.log('\n=== 全処理完了 ===');
      console.log(`解析成功率: ${results.parseResults.successRate}%`);
      if (results.importResults) {
        console.log(`インポート成功率: ${results.importResults.successRate}%`);
      }
    })
    .catch(console.error);
}

module.exports = { processBatch };