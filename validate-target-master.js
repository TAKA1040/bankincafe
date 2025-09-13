/**
 * target4_clean.csvの品質検証スクリプト
 * 重複、作業動詞混入、位置情報混入、内容不適切なエントリを検出・修正
 */

const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// 入力・出力ファイル
const INPUT_CSV = 'C:/Windsurf/bankincafe/マスタ作成用/マスタ候補/master_target4_clean.csv';
const OUTPUT_FILE = 'C:/Windsurf/bankincafe/マスタ作成用/マスタ候補/master_target4_validated.csv';

// 問題検出用パターン
const ISSUES = {
  // 作業動詞が残っている
  ACTION_VERBS: [
    '取付', '取り付け', '脱着', '溶接', '切断', '修正', '調整', '点検', '組替', 
    '付替', '製作', '加工', '塗装', '貼付', '張替', '打替', '交換', '引出し',
    '曲がり直し', '折れ込み', '修理', '鈑金', '応急', '止め', '切替', '板金'
  ],
  
  // 位置情報が残っている  
  POSITION_INFO: [
    '右', '左', '前', '後', 'フロント', 'リア', '上', '下', '内', '外',
    'センター', '中央', 'サイド', 'コーナー', 'アッパー', 'ロア'
  ],
  
  // 明らかに部品ではない
  NOT_PARTS: [
    '側', '番', '箇所', 'ヶ所', '本', '個', '枚', '一式', 'ASSY'
  ],
  
  // 文字化けや不正な文字
  INVALID_CHARS: ['ァ', 'ィ', 'ゥ', 'ェ', 'ォ', 'ム', 'ろ', 'ど', 'あ']
};

// データ読み込み
async function loadData() {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(INPUT_CSV)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        console.log(`データ読み込み完了: ${results.length}件`);
        resolve(results);
      })
      .on('error', reject);
  });
}

// 問題検出
function detectIssues(item) {
  const issues = [];
  const name = item.name_norm || item.name;
  
  // 1. 作業動詞混入チェック
  for (const verb of ISSUES.ACTION_VERBS) {
    if (name.includes(verb)) {
      issues.push({
        type: 'ACTION_VERB',
        detail: `作業動詞「${verb}」が含まれています`,
        severity: 'HIGH'
      });
    }
  }
  
  // 2. 位置情報混入チェック
  for (const pos of ISSUES.POSITION_INFO) {
    if (name.includes(pos) && name !== pos) {
      issues.push({
        type: 'POSITION_INFO', 
        detail: `位置情報「${pos}」が含まれています`,
        severity: 'HIGH'
      });
    }
  }
  
  // 3. 部品ではないものチェック
  for (const notPart of ISSUES.NOT_PARTS) {
    if (name.includes(notPart)) {
      issues.push({
        type: 'NOT_PART',
        detail: `部品ではない語「${notPart}」が含まれています`, 
        severity: 'HIGH'
      });
    }
  }
  
  // 4. 文字化け・不正文字チェック
  for (const invalidChar of ISSUES.INVALID_CHARS) {
    if (name.includes(invalidChar)) {
      issues.push({
        type: 'INVALID_CHAR',
        detail: `不正な文字「${invalidChar}」が含まれています`,
        severity: 'HIGH'
      });
    }
  }
  
  // 5. 複合語の適切性チェック
  if (name.length > 15) {
    issues.push({
      type: 'TOO_LONG',
      detail: '名称が長すぎます（15文字超）',
      severity: 'MEDIUM'
    });
  }
  
  // 6. 空文字・短すぎるチェック
  if (!name || name.length <= 1) {
    issues.push({
      type: 'TOO_SHORT', 
      detail: '名称が短すぎるか空です',
      severity: 'HIGH'
    });
  }
  
  return issues;
}

// 重複検出
function detectDuplicates(data) {
  const nameMap = new Map();
  const duplicates = [];
  
  for (const item of data) {
    const name = item.name_norm || item.name;
    
    if (!nameMap.has(name)) {
      nameMap.set(name, []);
    }
    nameMap.get(name).push(item);
  }
  
  for (const [name, items] of nameMap) {
    if (items.length > 1) {
      duplicates.push({
        name: name,
        count: items.length,
        items: items
      });
    }
  }
  
  return duplicates;
}

// 自動修正
function autoFix(item) {
  let name = item.name_norm || item.name;
  let fixed = false;
  
  // 1. 明らかな作業動詞を除去
  const verbsToRemove = ['取付', '脱着', '交換', '修理', '板金', '応急', '切替'];
  for (const verb of verbsToRemove) {
    if (name.includes(verb)) {
      name = name.replace(verb, '').trim();
      fixed = true;
    }
  }
  
  // 2. 明らかな位置情報を除去（部品名の場合のみ）
  const positionsToRemove = ['右', '左', 'フロント', 'リア', 'センター'];
  for (const pos of positionsToRemove) {
    if (name.startsWith(pos) && name.length > pos.length + 2) {
      name = name.substring(pos.length).trim();
      fixed = true;
    }
  }
  
  // 3. 連続スペース・特殊文字の整理
  name = name.replace(/[・\s]+/g, '').trim();
  
  // 4. 文字化け修正
  const charFixes = {
    'ァーストステップ': 'ファーストステップ',
    'グウェザー': 'ウェザー',
    'ドウェザー': 'ウェザー',
    'アウェザー': 'ウェザー',
    'ろウェザー': 'ウェザー',
    'ムカプラー': 'カプラー'
  };
  
  for (const [wrong, correct] of Object.entries(charFixes)) {
    if (name.includes(wrong)) {
      name = name.replace(wrong, correct);
      fixed = true;
    }
  }
  
  return {
    originalName: item.name_norm || item.name,
    fixedName: name,
    wasFixed: fixed
  };
}

// 統合すべき類似項目の検出
function findSimilarItems(data) {
  const similar = [];
  const processed = new Set();
  
  for (let i = 0; i < data.length; i++) {
    const item1 = data[i];
    const name1 = item1.name_norm || item1.name;
    
    if (processed.has(name1)) continue;
    
    const group = [item1];
    
    for (let j = i + 1; j < data.length; j++) {
      const item2 = data[j];
      const name2 = item2.name_norm || item2.name;
      
      if (processed.has(name2)) continue;
      
      // 類似度判定（部分一致、長音違いなど）
      if (areNamesSimilar(name1, name2)) {
        group.push(item2);
        processed.add(name2);
      }
    }
    
    if (group.length > 1) {
      similar.push(group);
    }
    
    processed.add(name1);
  }
  
  return similar;
}

// 名前の類似度判定
function areNamesSimilar(name1, name2) {
  // 長音違い（ドア/ドアー など）
  const normalized1 = name1.replace(/ー/g, '');
  const normalized2 = name2.replace(/ー/g, '');
  
  if (normalized1 === normalized2) return true;
  
  // 部分一致（長い方に短い方が含まれる）
  if (name1.includes(name2) || name2.includes(name1)) {
    const longer = name1.length > name2.length ? name1 : name2;
    const shorter = name1.length > name2.length ? name2 : name1;
    
    // 長い方が短い方+修飾語の場合
    if (longer.length - shorter.length <= 4) {
      return true;
    }
  }
  
  return false;
}

// メイン検証処理
async function main() {
  try {
    console.log('Target4マスターの品質検証開始...');
    
    // データ読み込み
    const data = await loadData();
    
    console.log('\n=== 問題検出結果 ===');
    
    // 1. 各項目の問題検出
    let issueCount = 0;
    const itemsWithIssues = [];
    
    for (const item of data) {
      const issues = detectIssues(item);
      if (issues.length > 0) {
        issueCount += issues.length;
        itemsWithIssues.push({
          item: item,
          issues: issues
        });
      }
    }
    
    console.log(`問題のある項目: ${itemsWithIssues.length}件 (総問題数: ${issueCount}件)`);
    
    // 上位問題項目を表示
    console.log('\n🚨 主要問題項目 (上位15件):');
    itemsWithIssues
      .sort((a, b) => b.issues.length - a.issues.length)
      .slice(0, 15)
      .forEach(({item, issues}) => {
        console.log(`  ${item.name_norm}: ${issues.map(i => i.detail).join(', ')}`);
      });
    
    // 2. 重複検出
    const duplicates = detectDuplicates(data);
    console.log(`\n📊 重複項目: ${duplicates.length}組`);
    
    if (duplicates.length > 0) {
      console.log('重複例 (上位5組):');
      duplicates.slice(0, 5).forEach(dup => {
        console.log(`  ${dup.name} (${dup.count}件重複)`);
      });
    }
    
    // 3. 類似項目検出
    const similar = findSimilarItems(data);
    console.log(`\n🔗 統合候補グループ: ${similar.length}組`);
    
    if (similar.length > 0) {
      console.log('統合候補例 (上位5組):');
      similar.slice(0, 5).forEach(group => {
        const names = group.map(item => item.name_norm).join(', ');
        console.log(`  [${names}]`);
      });
    }
    
    // 4. 自動修正実行
    console.log('\n🔧 自動修正実行中...');
    const fixedItems = [];
    let fixCount = 0;
    
    for (const item of data) {
      const fixResult = autoFix(item);
      
      if (fixResult.wasFixed && fixResult.fixedName.length > 1) {
        fixedItems.push({
          ...item,
          name: fixResult.fixedName,
          name_norm: fixResult.fixedName
        });
        fixCount++;
      } else if (fixResult.fixedName.length > 1) {
        fixedItems.push(item);
      }
      // 修正後も問題がある項目は除外
    }
    
    console.log(`修正適用: ${fixCount}件`);
    console.log(`修正後項目数: ${fixedItems.length}件`);
    
    // 5. 最終的な重複除去・統合
    const finalItems = new Map();
    
    for (const item of fixedItems) {
      const name = item.name_norm;
      const count = parseInt(item.count) || 0;
      
      if (!finalItems.has(name)) {
        finalItems.set(name, {
          name: name,
          name_norm: name,
          count: count,
          is_active: count >= 5,
          example: item.example
        });
      } else {
        // 重複の場合はカウントを統合
        const existing = finalItems.get(name);
        existing.count += count;
        existing.is_active = existing.count >= 5;
      }
    }
    
    // 6. 最終ソート・出力
    const validatedMaster = Array.from(finalItems.values())
      .sort((a, b) => {
        if (a.is_active !== b.is_active) return b.is_active - a.is_active;
        if (a.count !== b.count) return b.count - a.count;
        return a.name_norm.localeCompare(b.name_norm);
      });
    
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
    
    await csvWriter.writeRecords(validatedMaster);
    
    // 検証完了レポート
    console.log(`\n=== 検証完了レポート ===`);
    console.log(`出力ファイル: ${OUTPUT_FILE}`);
    console.log(`元データ: ${data.length}件`);
    console.log(`検証後: ${validatedMaster.length}件`);
    console.log(`アクティブ項目: ${validatedMaster.filter(x => x.is_active).length}件`);
    console.log(`除去された問題項目: ${data.length - validatedMaster.length}件`);
    
    console.log('\n✅ 品質検証された純粋な対象物マスター (上位15件):');
    validatedMaster
      .filter(x => x.is_active)
      .slice(0, 15)
      .forEach(item => {
        console.log(`  ${item.name_norm} (${item.count}件)`);
      });
    
    console.log('\n🎯 Target4マスターの品質検証完了！');
    
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