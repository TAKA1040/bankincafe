/**
 * 位置マスターの最適化スクリプト
 * 組み合わせ可能な複合位置を基本要素に分解し、効率的なマスターを生成
 */

const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// 入力・出力ファイル
const INPUT_FILE = 'C:/Windsurf/bankincafe/マスタ作成用/マスタ候補/master_position4.csv';
const OUTPUT_FILE = 'C:/Windsurf/bankincafe/マスタ作成用/マスタ候補/master_position4_optimized.csv';

// 基本位置要素の定義
const BASIC_POSITION_ELEMENTS = {
  // 前後軸
  '前': { type: 'front-back', priority: 1 },
  'フロント': { type: 'front-back', priority: 1 },
  '後': { type: 'front-back', priority: 2 },
  'リア': { type: 'front-back', priority: 2 },
  
  // 左右軸
  '左': { type: 'left-right', priority: 1 },
  '右': { type: 'left-right', priority: 2 },
  
  // 上下軸
  '上': { type: 'up-down', priority: 1 },
  '下': { type: 'up-down', priority: 2 },
  
  // 内外軸
  '内': { type: 'inside-outside', priority: 1 },
  '外': { type: 'inside-outside', priority: 2 },
  
  // 中央系
  'センター': { type: 'center', priority: 1 },
  '中央': { type: 'center', priority: 1 },
  
  // 席系
  '運転席': { type: 'seat', priority: 1 },
  '助手席': { type: 'seat', priority: 2 },
  
  // 部位系
  'サイド': { type: 'side', priority: 1 },
  'コーナー': { type: 'corner', priority: 1 },
  '角': { type: 'corner', priority: 1 },
  '穴': { type: 'hole', priority: 1 },
  '表': { type: 'surface', priority: 1 },
  '裏': { type: 'surface', priority: 2 },
  '荷台': { type: 'area', priority: 1 },
  '横': { type: 'direction', priority: 1 },
  '中間': { type: 'position', priority: 1 },
  '取付部': { type: 'part', priority: 1 }
};

// 複合位置の定義（基本要素の組み合わせで表現可能）
const COMPOUND_POSITIONS = {
  '前右': ['前', '右'],
  '前左': ['前', '左'],
  '後右': ['後', '右'],
  '後左': ['後', '左'],
  '右前': ['右', '前'],
  '左前': ['左', '前'],
  '右後': ['右', '後'],
  '左後': ['左', '後'],
  '右上': ['右', '上'],
  '左上': ['左', '上'],
  '右下': ['右', '下'],
  '左下': ['左', '下'],
  '前上': ['前', '上'],
  '前下': ['前', '下'],
  '後上': ['後', '上'],
  '後下': ['後', '下']
};

// 数量表現（別途管理が適切）
const QUANTITY_EXPRESSIONS = new Set([
  '1箇所', '2箇所', '3箇所', '4箇所', '5箇所', '6箇所',
  '1番', '2番', '3番', '4番', '5番', '6番'
]);

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

// 位置データを分析・分類
function analyzePositions(positions) {
  const basicElements = [];
  const compoundPositions = [];
  const quantityExpressions = [];
  const specialPositions = [];
  
  for (const pos of positions) {
    const name = pos.name_norm;
    const count = parseInt(pos.count) || 0;
    const isActive = pos.is_active === 'true';
    
    if (QUANTITY_EXPRESSIONS.has(name)) {
      quantityExpressions.push({
        ...pos,
        category: 'quantity',
        combinable: false
      });
    } else if (COMPOUND_POSITIONS[name]) {
      compoundPositions.push({
        ...pos,
        category: 'compound',
        combinable: true,
        components: COMPOUND_POSITIONS[name]
      });
    } else if (BASIC_POSITION_ELEMENTS[name]) {
      basicElements.push({
        ...pos,
        category: 'basic',
        combinable: true,
        type: BASIC_POSITION_ELEMENTS[name].type,
        priority: BASIC_POSITION_ELEMENTS[name].priority
      });
    } else {
      specialPositions.push({
        ...pos,
        category: 'special',
        combinable: false
      });
    }
  }
  
  return { basicElements, compoundPositions, quantityExpressions, specialPositions };
}

// 複合位置のカウントを基本要素に統合
function redistributeCompoundCounts(basicElements, compoundPositions) {
  const basicMap = new Map();
  
  // 基本要素をマップに登録
  for (const basic of basicElements) {
    basicMap.set(basic.name_norm, {
      ...basic,
      count: parseInt(basic.count) || 0,
      compound_contributions: []
    });
  }
  
  // 複合位置のカウントを基本要素に分配
  for (const compound of compoundPositions) {
    const compoundCount = parseInt(compound.count) || 0;
    const components = compound.components;
    
    for (const component of components) {
      if (basicMap.has(component)) {
        const basicItem = basicMap.get(component);
        basicItem.count += Math.floor(compoundCount / components.length); // 均等分配
        basicItem.compound_contributions.push({
          from: compound.name_norm,
          added: Math.floor(compoundCount / components.length)
        });
      }
    }
  }
  
  return Array.from(basicMap.values());
}

// is_active再判定（統合後カウントに基づく）
function reEvaluateActive(positions) {
  return positions.map(pos => {
    const count = pos.count;
    const type = pos.type;
    
    // 基本方向は低カウントでもactive
    if (['front-back', 'left-right', 'up-down', 'inside-outside'].includes(type)) {
      pos.is_active = count >= 1;
    }
    // 中央・席系は中カウントでactive
    else if (['center', 'seat'].includes(type)) {
      pos.is_active = count >= 2;
    }
    // 部位系は高カウントでactive
    else {
      pos.is_active = count >= 5;
    }
    
    return pos;
  });
}

// 最適化レポート生成
function generateOptimizationReport(original, optimized, analysis) {
  console.log('\n=== 位置マスター最適化レポート ===');
  
  console.log(`\n📊 分類結果:`);
  console.log(`  基本要素: ${analysis.basicElements.length}件`);
  console.log(`  複合位置: ${analysis.compoundPositions.length}件`);
  console.log(`  数量表現: ${analysis.quantityExpressions.length}件`);
  console.log(`  特殊位置: ${analysis.specialPositions.length}件`);
  
  console.log(`\n📈 最適化効果:`);
  console.log(`  元データ: ${original.length}件`);
  console.log(`  最適化後: ${optimized.length}件`);
  console.log(`  削減率: ${((original.length - optimized.length) / original.length * 100).toFixed(1)}%`);
  
  console.log(`\n🔄 複合位置の統合例:`);
  analysis.compoundPositions.slice(0, 5).forEach(compound => {
    console.log(`  ${compound.name_norm} (${compound.count}件) → ${compound.components.join(' + ')}`);
  });
  
  console.log(`\n✨ 保持される基本要素 (上位10件):`);
  optimized.filter(x => x.category === 'basic')
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .forEach(basic => {
      const contributions = basic.compound_contributions || [];
      const addedCount = contributions.reduce((sum, c) => sum + c.added, 0);
      console.log(`  ${basic.name_norm}: ${basic.count}件 (元:${basic.count - addedCount}, 統合:+${addedCount})`);
    });
}

// メイン処理
async function main() {
  try {
    console.log('位置マスター最適化開始...');
    
    // 元データ読み込み
    const originalPositions = await loadCsv(INPUT_FILE);
    console.log(`元データ件数: ${originalPositions.length}件`);
    
    // 分析・分類
    const analysis = analyzePositions(originalPositions);
    
    // 複合位置のカウントを基本要素に統合
    const redistributedBasics = redistributeCompoundCounts(analysis.basicElements, analysis.compoundPositions);
    
    // is_active再判定
    const reEvaluatedBasics = reEvaluateActive(redistributedBasics);
    
    // 最適化後のマスター作成
    const optimizedPositions = [
      ...reEvaluatedBasics,
      ...analysis.quantityExpressions,
      ...analysis.specialPositions
    ].sort((a, b) => {
      // activeを優先
      if (a.is_active !== b.is_active) return (b.is_active ? 1 : 0) - (a.is_active ? 1 : 0);
      
      // カテゴリー順（basic → special → quantity）
      const categoryOrder = { basic: 1, special: 2, quantity: 3 };
      const orderA = categoryOrder[a.category] || 999;
      const orderB = categoryOrder[b.category] || 999;
      if (orderA !== orderB) return orderA - orderB;
      
      // カウント降順
      return b.count - a.count;
    });
    
    // 出力用データ準備（余分なフィールドを除去）
    const outputData = optimizedPositions.map(pos => ({
      name: pos.name_norm,
      name_norm: pos.name_norm,
      is_active: pos.is_active,
      count: pos.count,
      example: pos.example
    }));
    
    // CSV出力
    const csvWriter = createCsvWriter({
      path: OUTPUT_FILE,
      header: [
        { id: 'name', title: 'name' },
        { id: 'name_norm', title: 'name_norm' },
        { id: 'is_active', title: 'is_active' },
        { id: 'count', title: 'count' },
        { id: 'example', title: 'example' }
      ]
    });
    
    await csvWriter.writeRecords(outputData);
    
    // レポート生成
    generateOptimizationReport(originalPositions, optimizedPositions, analysis);
    
    console.log(`\n📁 出力ファイル: ${OUTPUT_FILE}`);
    console.log('位置マスター最適化完了！');
    
  } catch (error) {
    console.error('エラー:', error);
    process.exit(1);
  }
}

// 実行
if (require.main === module) {
  main();
}

module.exports = { main };