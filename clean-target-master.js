/**
 * 対象物マスター純化スクリプト
 * 位置情報を除去し、純粋な部品・部材名のみのtargetマスターを生成
 */

const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// 入力・出力ファイル
const INPUT_CSV = 'C:/Windsurf/bankincafe/マスタ作成用/マスタ候補/master_target4_detailed.csv';
const OUTPUT_FILE = 'C:/Windsurf/bankincafe/マスタ作成用/マスタ候補/master_target4_clean.csv';

// 位置情報キーワード（これらを除去）
const POSITION_KEYWORDS = new Set([
  // 基本方向
  '右', '左', '前', '後', 'フロント', 'リア', '上', '下', '内', '外',
  // 詳細方向
  '前右', '前左', '後右', '後左', '右前', '左前', '右後', '左後',
  '右上', '右下', '左上', '左下', '前上', '前下', '後上', '後下',
  // 中央・席系
  'センター', '中央', '運転席', '助手席',
  // 側面・角系
  'サイド', 'コーナー', '角',
  // 序数・番号
  '1番', '2番', '3番', '4番', '5番', '6番',
  '第1', '第2', '第3', '第4', '第5', '第6',
  // 相対位置
  '奥', '手前', '横', '隣', '近く', '脇',
  // 特殊位置
  'アッパー', 'ロア', 'トップ', 'ボトム', 'インナー', 'アウター'
]);

// 作業動詞（これらも除去）
const ACTION_KEYWORDS = new Set([
  '取替', '脱着', '溶接', '切断', '修正', '調整', '点検', '組替', '付替', '製作', 
  '加工', '塗装', '貼付', '張替', '打替', '交換', '付替え', '組替', '引出し',
  '曲がり直し', '折れ込み', '修理', '鈑金'
]);

// データ読み込み
async function loadDetailedData() {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(INPUT_CSV)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        console.log(`詳細データ読み込み: ${results.length}件`);
        resolve(results);
      })
      .on('error', reject);
  });
}

// 部品名から位置情報・作業動詞を除去
function extractPurePartName(partName) {
  let pureName = partName;
  
  // 位置情報の除去
  for (const position of POSITION_KEYWORDS) {
    // 前置位置の除去（例: 右ドア → ドア）
    if (pureName.startsWith(position)) {
      pureName = pureName.substring(position.length);
    }
    // 後置位置の除去（例: ドア右 → ドア）
    if (pureName.endsWith(position)) {
      pureName = pureName.substring(0, pureName.length - position.length);
    }
    // 中間位置の除去（例: ドア右側 → ドア側）
    pureName = pureName.replace(position, '');
  }
  
  // 作業動詞の除去
  for (const action of ACTION_KEYWORDS) {
    pureName = pureName.replace(action, '');
  }
  
  // 連続した区切り文字の整理
  pureName = pureName.replace(/[・\s]+/g, '').trim();
  
  return pureName;
}

// 純粋部品名として有効かチェック
function isValidPurePart(partName) {
  // 空文字は無効
  if (!partName || partName.length === 0) return false;
  
  // 1文字は無効（位置情報の残骸の可能性）
  if (partName.length === 1) return false;
  
  // 数字のみは無効
  if (/^\d+$/.test(partName)) return false;
  
  // 明らかに位置情報のみの場合は無効
  if (POSITION_KEYWORDS.has(partName)) return false;
  
  // 明らかに作業動詞のみの場合は無効
  if (ACTION_KEYWORDS.has(partName)) return false;
  
  return true;
}

// 部品カテゴリ判定
function determinePartCategory(partName) {
  const categoryPatterns = {
    'fastener': ['ボルト', 'ナット', 'ワッシャー', 'ピン', 'リベット', 'スクリュー', 'ビス'],
    'support': ['ステー', 'ブラケット', 'マウント', 'サポート', '支持'],
    'protection': ['ガード', 'バンパー', 'カバー', 'フェンダー', 'プロテクター'],
    'panel': ['パネル', 'プレート', '板', '鋼板', '縞鋼板'],
    'lighting': ['ライト', 'ランプ', 'レンズ', '反射板', 'リフレクター'],
    'sealing': ['ゴム', 'パッキン', 'シール', 'ガスケット', 'ストリップ'],
    'piping': ['パイプ', 'ホース', 'チューブ', 'ダクト', 'ジョイント'],
    'mechanical': ['ベアリング', 'ブッシュ', 'スプリング', 'ダンパー', 'ローラー'],
    'electrical': ['ハーネス', 'センサー', 'スイッチ', 'リレー', 'コネクター'],
    'door': ['ドア', '扉', 'ハッチ', '蓋', 'フタ'],
    'interior': ['シート', 'ミラー', 'ハンドル', 'レバー', 'クッション'],
    'other': []
  };
  
  for (const [category, patterns] of Object.entries(categoryPatterns)) {
    if (patterns.some(pattern => partName.includes(pattern))) {
      return category;
    }
  }
  
  return 'other';
}

// 純化処理メイン
async function main() {
  try {
    console.log('対象物マスター純化開始...');
    
    // 詳細データ読み込み
    const detailedData = await loadDetailedData();
    
    // 位置情報除去・部品名統合
    const purePartMap = new Map();
    
    for (const item of detailedData) {
      const originalName = item.name_norm;
      const pureName = extractPurePartName(originalName);
      const count = parseInt(item.count) || 0;
      const example = item.example;
      
      if (isValidPurePart(pureName)) {
        if (!purePartMap.has(pureName)) {
          purePartMap.set(pureName, {
            name: pureName,
            name_norm: pureName,
            total_count: 0,
            source_count: 0,
            examples: [],
            category: determinePartCategory(pureName)
          });
        }
        
        const pureItem = purePartMap.get(pureName);
        pureItem.total_count += count;
        pureItem.source_count++;
        
        if (pureItem.examples.length < 3) {
          pureItem.examples.push(example);
        }
      }
    }
    
    // 純化マスター生成
    const cleanMaster = Array.from(purePartMap.values()).map(item => ({
      name: item.name,
      name_norm: item.name_norm,
      is_active: item.total_count >= 5, // 統合後カウントで判定
      count: item.total_count,
      example: item.examples[0] || ''
    })).sort((a, b) => {
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
    
    await csvWriter.writeRecords(cleanMaster);
    
    // 純化レポート
    console.log(`\n=== 純化対象物マスター完成 ===`);
    console.log(`出力ファイル: ${OUTPUT_FILE}`);
    console.log(`元データ: ${detailedData.length}件`);
    console.log(`純化後: ${cleanMaster.length}件`);
    console.log(`アクティブ項目: ${cleanMaster.filter(x => x.is_active).length}件`);
    
    // カテゴリ統計
    const categoryStats = {};
    Array.from(purePartMap.values()).forEach(item => {
      if (!categoryStats[item.category]) {
        categoryStats[item.category] = 0;
      }
      categoryStats[item.category]++;
    });
    
    console.log('\n📊 部品カテゴリ統計:');
    Object.entries(categoryStats)
      .sort(([, a], [, b]) => b - a)
      .forEach(([category, count]) => {
        console.log(`  ${category}: ${count}件`);
      });
    
    // 純化の実例
    console.log('\n🎯 純化された対象物（上位20件）:');
    cleanMaster
      .filter(x => x.is_active)
      .slice(0, 20)
      .forEach(item => {
        console.log(`  ${item.name_norm} (${item.count}件) - ${item.example}`);
      });
    
    console.log('\n✅ 位置情報を除去した純粋な対象物マスターが完成しました！');
    
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