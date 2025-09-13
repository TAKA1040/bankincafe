/**
 * マスター比較分析スクリプト
 * 既存マスター vs 新規生成マスター(v2) の詳細比較
 */

const fs = require('fs');
const csv = require('csv-parser');

const COMPARISON_PAIRS = [
  {
    type: 'action',
    existing: 'C:/Windsurf/bankincafe/マスタ作成用/マスタ候補/master_action.csv',
    new: 'C:/Windsurf/bankincafe/マスタ作成用/マスタ候補/master_action2.csv'
  },
  {
    type: 'target',
    existing: 'C:/Windsurf/bankincafe/マスタ作成用/マスタ候補/master_target.csv', 
    new: 'C:/Windsurf/bankincafe/マスタ作成用/マスタ候補/master_target2.csv'
  },
  {
    type: 'position',
    existing: 'C:/Windsurf/bankincafe/マスタ作成用/マスタ候補/master_position.csv',
    new: 'C:/Windsurf/bankincafe/マスタ作成用/マスタ候補/master_position2.csv'
  }
];

// CSVファイル読み込み
async function loadCsv(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

// データセット比較分析
function analyzeDatasets(existing, newData, type) {
  const analysis = {
    type: type,
    counts: {
      existing: existing.length,
      new: newData.length,
      difference: newData.length - existing.length
    },
    activeCounts: {
      existing: existing.filter(item => item.is_active === 'true').length,
      new: newData.filter(item => item.is_active === 'true').length
    },
    commonItems: [],
    onlyInExisting: [],
    onlyInNew: [],
    countDifferences: []
  };

  // 名前ベースの比較マップ作成
  const existingMap = new Map();
  const newMap = new Map();
  
  existing.forEach(item => existingMap.set(item.name_norm, item));
  newData.forEach(item => newMap.set(item.name_norm, item));
  
  // 共通項目の分析
  for (const [name, existingItem] of existingMap) {
    if (newMap.has(name)) {
      const newItem = newMap.get(name);
      const item = {
        name,
        existing_count: parseInt(existingItem.count) || 0,
        new_count: parseInt(newItem.count) || 0,
        existing_active: existingItem.is_active === 'true',
        new_active: newItem.is_active === 'true',
        count_diff: (parseInt(newItem.count) || 0) - (parseInt(existingItem.count) || 0)
      };
      analysis.commonItems.push(item);
      
      if (Math.abs(item.count_diff) > 5) {
        analysis.countDifferences.push(item);
      }
    } else {
      analysis.onlyInExisting.push({
        name,
        count: parseInt(existingItem.count) || 0,
        is_active: existingItem.is_active === 'true'
      });
    }
  }
  
  // 新規のみの項目
  for (const [name, newItem] of newMap) {
    if (!existingMap.has(name)) {
      analysis.onlyInNew.push({
        name,
        count: parseInt(newItem.count) || 0,
        is_active: newItem.is_active === 'true'
      });
    }
  }
  
  return analysis;
}

// レポート生成
function generateReport(analysis) {
  console.log(`\n================================`);
  console.log(`${analysis.type.toUpperCase()} マスター比較分析`);
  console.log(`================================`);
  
  console.log(`\n📊 基本統計:`);
  console.log(`  既存: ${analysis.counts.existing}件 (active: ${analysis.activeCounts.existing}件)`);
  console.log(`  新規: ${analysis.counts.new}件 (active: ${analysis.activeCounts.new}件)`);
  console.log(`  差分: ${analysis.counts.difference > 0 ? '+' : ''}${analysis.counts.difference}件`);
  
  console.log(`\n🔍 項目分布:`);
  console.log(`  共通項目: ${analysis.commonItems.length}件`);
  console.log(`  既存のみ: ${analysis.onlyInExisting.length}件`);
  console.log(`  新規のみ: ${analysis.onlyInNew.length}件`);
  
  if (analysis.onlyInExisting.length > 0) {
    console.log(`\n❌ 既存にのみ存在する項目 (上位10件):`);
    analysis.onlyInExisting
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .forEach(item => {
        console.log(`    ${item.name} (${item.count}件, active:${item.is_active})`);
      });
  }
  
  if (analysis.onlyInNew.length > 0) {
    console.log(`\n✨ 新規にのみ存在する項目 (上位10件):`);
    analysis.onlyInNew
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .forEach(item => {
        console.log(`    ${item.name} (${item.count}件, active:${item.is_active})`);
      });
  }
  
  if (analysis.countDifferences.length > 0) {
    console.log(`\n📈 大幅なカウント差異 (±5件以上):`);
    analysis.countDifferences
      .sort((a, b) => Math.abs(b.count_diff) - Math.abs(a.count_diff))
      .slice(0, 10)
      .forEach(item => {
        const sign = item.count_diff > 0 ? '+' : '';
        console.log(`    ${item.name}: ${item.existing_count} → ${item.new_count} (${sign}${item.count_diff})`);
      });
  }
  
  return analysis;
}

// メイン処理
async function main() {
  console.log('マスター比較分析開始...\n');
  
  const results = [];
  
  for (const pair of COMPARISON_PAIRS) {
    try {
      console.log(`${pair.type} マスター読み込み中...`);
      const existing = await loadCsv(pair.existing);
      const newData = await loadCsv(pair.new);
      
      const analysis = analyzeDatasets(existing, newData, pair.type);
      const report = generateReport(analysis);
      results.push(report);
      
    } catch (error) {
      console.error(`${pair.type} マスター分析でエラー:`, error.message);
    }
  }
  
  // 総合サマリー
  console.log(`\n\n🎯 総合サマリー`);
  console.log(`================================`);
  results.forEach(result => {
    const changeRate = ((result.counts.new - result.counts.existing) / result.counts.existing * 100).toFixed(1);
    console.log(`${result.type.toUpperCase()}: ${result.counts.existing} → ${result.counts.new} (${changeRate > 0 ? '+' : ''}${changeRate}%)`);
  });
  
  console.log(`\n分析完了！`);
}

// 実行
if (require.main === module) {
  main();
}

module.exports = { main };