/**
 * マスター生成スクリプト v2（対象/作業/位置）
 * masutapronpt.md の仕様に従い、invoicenew.csv の raw_label_part から新規マスターを生成
 */

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// 設定
const INPUT_CSV = 'C:/Windsurf/bankincafe/マスタ作成用/invoicenew.csv';
const OUTPUT_DIR = 'c:/Windsurf/bankin/マスタ候補';

// フィルタ条件
const CONFIDENCE_THRESHOLD = 0.80;

// 出力ファイルパス
const OUTPUT_FILES = {
  action: path.join(OUTPUT_DIR, 'master_action2.csv'),
  target: path.join(OUTPUT_DIR, 'master_target2.csv'),
  position: path.join(OUTPUT_DIR, 'master_position2.csv')
};

// 作業キーワード（長い語優先で検索）
const ACTION_KEYWORDS = [
  '脱着', '取付', '取り付け', '取付け', '取替', '取り替え', '取外', '取り外し', '取外し',
  '溶接', '鈑金', '塗装', '調整', '修正', '加工', '切断', '張替', '張り替え', '張替え',
  '点検', '貼付', '貼り付け', '面取り', '面取', '錆止め', '錆び止め', 'サビ止め',
  '打替', '打ち替え', '打替え', '仕上げ', '研磨仕上げ', '曲がり直し', '異音止め'
].sort((a, b) => b.length - a.length);

// 対象キーワード（長い語優先で検索）
const TARGET_KEYWORDS = [
  'DPF差圧センサー', 'DPFセンサー', 'テールライト', 'テールランプ', 'バックライト', 'バックランプ',
  'フォグライト', 'フォグランプ', 'マーカーライト', 'マーカーランプ', 'コーナーライト', 'コーナーランプ',
  'ドア', 'ドアー', 'パイプ', 'ステー', 'ガード', 'ミラー', 'ハンドル', 'カバー', 
  'ボルト', 'ナット', 'バンパ', 'バンパー', 'ライト', 'ランプ', 'センサー',
  'ブラケット', '蝶番', 'ストライカー', 'バッテリー', '踊場', '縞鋼板'
].sort((a, b) => b.length - a.length);

// 位置キーワード（長い語優先で検索）
const POSITION_KEYWORDS = [
  'フロント', 'リア', '運転席', '助手席', '前側', '後側', 'センター', '中央',
  '前右', '前左', '後右', '後左', '左', '右', '前', '後', '内', '外', '上', '下',
  'FR', 'FL', 'RR', 'RL', 'LH', 'RH', 'F', 'R'
].sort((a, b) => b.length - a.length);

// 汎用語・総称語リスト
const GENERIC_ACTIONS = new Set(['加工', '修正', '補修', '清掃', '点検']);
const GENERIC_TARGETS = new Set(['カバー', 'ブラケット', 'ステー', 'ボルト', 'ナット']);

// 位置の正規化マッピング
const POSITION_NORMALIZATION = {
  'FR': '前右', 'FL': '前左', 'RR': '後右', 'RL': '後左',
  'LH': '左', 'RH': '右', 'F': 'フロント', 'R': 'リア'
};

// ライト/ランプ統合
const LIGHT_NORMALIZATION = {
  'テールランプ': 'テールライト',
  'バックランプ': 'バックライト', 
  'フォグランプ': 'フォグライト',
  'マーカーランプ': 'マーカーライト',
  'コーナーランプ': 'コーナーライト'
};

// 名寄せルール適用
function normalizeActionName(name) {
  const rules = {
    '取り付け': '取付', '取付け': '取付',
    '取り外し': '取り外し', '取外': '取り外し', '取外し': '取り外し',
    '張り替え': '張替', '張替え': '張替',
    '打ち替え': '打替', '打替え': '打替',
    '面取': '面取り',
    '錆び止め': '錆止め', 'サビ止め': '錆止め',
    '研磨仕上げ': '仕上げ'
  };
  return rules[name] || name;
}

function normalizeTargetName(name) {
  // 長音整理
  let normalized = name.replace(/ドアー/g, 'ドア').replace(/バンパ$/, 'バンパー');
  
  // ライト/ランプ統合
  normalized = LIGHT_NORMALIZATION[normalized] || normalized;
  
  // DPFセンサー統合
  if (normalized.includes('DPF') && normalized.includes('センサー')) {
    normalized = 'DPFセンサー';
  }
  
  return normalized;
}

function normalizePositionName(name) {
  return POSITION_NORMALIZATION[name] || name;
}

// 全角→半角変換
function toHalfWidth(str) {
  return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
}

// 前処理（正規化）
function preprocess(text) {
  if (!text) return '';
  
  let processed = text.trim();
  processed = toHalfWidth(processed); // 全角→半角
  processed = processed.replace(/[，、\/]/g, '・'); // 区切り正規化
  processed = processed.toUpperCase(); // ASCII大文字化
  
  return processed;
}

// キーワード抽出
function extractKeywords(text, keywords) {
  const found = new Set();
  const processed = preprocess(text);
  
  for (const keyword of keywords) {
    if (processed.includes(keyword) && !found.has(keyword)) {
      // 包含関係チェック（長いキーワードが見つかったら短いものは除外）
      let shouldAdd = true;
      for (const existing of found) {
        if (existing.includes(keyword) || keyword.includes(existing)) {
          if (keyword.length > existing.length) {
            found.delete(existing);
          } else {
            shouldAdd = false;
          }
        }
      }
      if (shouldAdd) {
        found.add(keyword);
      }
    }
  }
  
  return Array.from(found);
}

// データ読み込みとフィルタリング
async function loadAndFilterData() {
  return new Promise((resolve, reject) => {
    const results = [];
    
    fs.createReadStream(INPUT_CSV)
      .pipe(csv())
      .on('data', (row) => {
        // フィルタ条件適用
        const isLatest = row.is_latest === 'true';
        const isCancelled = row.is_cancelled === 'true';
        const isNotSetParent = row.record_type !== 'set_parent';
        const hasGoodConfidence = parseFloat(row.confidence_score) >= CONFIDENCE_THRESHOLD;
        
        if (isLatest && !isCancelled && isNotSetParent && hasGoodConfidence) {
          results.push(row);
        }
      })
      .on('end', () => {
        console.log(`フィルタ後データ件数: ${results.length}`);
        resolve(results);
      })
      .on('error', reject);
  });
}

// カウント集計
function aggregateKeywords(data, keywords, normalizeFunc) {
  const counts = new Map();
  const examples = new Map();
  
  for (const row of data) {
    const extractedKeywords = extractKeywords(row.raw_label_part, keywords);
    
    for (const keyword of extractedKeywords) {
      const normalized = normalizeFunc(keyword);
      
      if (!counts.has(normalized)) {
        counts.set(normalized, 0);
        examples.set(normalized, row.raw_label_part);
      }
      counts.set(normalized, counts.get(normalized) + 1);
    }
  }
  
  return { counts, examples };
}

// is_active判定 - 作業マスター
function determineActionActive(nameNorm, count) {
  if (count >= 5) return true;
  if (count >= 2 && count <= 4) {
    return !GENERIC_ACTIONS.has(nameNorm);
  }
  return false; // count = 1
}

// is_active判定 - 対象マスター
function determineTargetActive(nameNorm, count) {
  if (count >= 3) return true;
  if (count === 2) {
    return !GENERIC_TARGETS.has(nameNorm);
  }
  if (count === 1) {
    // 例外的にtrueとする特別なケース
    const specialCases = ['テールライト', 'バックライト', 'フォグライト', 'マーカーライト', 'コーナーライト', 'DPFセンサー'];
    return specialCases.includes(nameNorm);
  }
  return false;
}

// is_active判定 - 位置マスター
function determinePositionActive(nameNorm, count) {
  if (count >= 5) return true;
  if (count >= 1 && count <= 4) {
    // 単独略号は除外
    const singleAbbrevs = ['F', 'R'];
    if (count === 1 && singleAbbrevs.includes(nameNorm)) {
      return false;
    }
    return true; // 網羅性重視
  }
  return false;
}

// CSV出力
async function writeMasterCsv(filepath, data) {
  const csvWriter = createCsvWriter({
    path: filepath,
    header: [
      { id: 'name', title: 'name' },
      { id: 'name_norm', title: 'name_norm' },
      { id: 'is_active', title: 'is_active' },
      { id: 'count', title: 'count' },
      { id: 'example', title: 'example' }
    ]
  });
  
  await csvWriter.writeRecords(data);
  console.log(`${filepath} を生成しました (${data.length}件)`);
}

// 位置の論理順ソート用
function getPositionOrder(nameNorm) {
  const order = {
    '前': 1, 'フロント': 1, '前右': 2, 'FR': 2, '前左': 3, 'FL': 3,
    '後': 4, 'リア': 4, '後右': 5, 'RR': 5, '後左': 6, 'RL': 6,
    '左': 7, 'LH': 7, '右': 8, 'RH': 8,
    '内': 9, '外': 10, '上': 11, '下': 12,
    '運転席': 13, '助手席': 14, 'センター': 15, '中央': 15
  };
  return order[nameNorm] || 999;
}

// メイン処理
async function main() {
  try {
    console.log('マスター生成開始...');
    console.log(`入力ファイル: ${INPUT_CSV}`);
    console.log(`出力ディレクトリ: ${OUTPUT_DIR}`);
    
    // 出力ディレクトリ作成
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    // データ読み込み
    const data = await loadAndFilterData();
    
    console.log('\n=== 作業マスター生成 ===');
    const actionResult = aggregateKeywords(data, ACTION_KEYWORDS, normalizeActionName);
    const actionMaster = Array.from(actionResult.counts.entries()).map(([nameNorm, count]) => ({
      name: nameNorm, // 今回は name = name_norm とする
      name_norm: nameNorm,
      is_active: determineActionActive(nameNorm, count),
      count,
      example: actionResult.examples.get(nameNorm)
    })).sort((a, b) => {
      if (a.is_active !== b.is_active) return b.is_active - a.is_active;
      if (a.count !== b.count) return b.count - a.count;
      return a.name_norm.localeCompare(b.name_norm);
    });
    
    await writeMasterCsv(OUTPUT_FILES.action, actionMaster);
    
    console.log('\n=== 対象マスター生成 ===');
    const targetResult = aggregateKeywords(data, TARGET_KEYWORDS, normalizeTargetName);
    const targetMaster = Array.from(targetResult.counts.entries()).map(([nameNorm, count]) => ({
      name: nameNorm,
      name_norm: nameNorm,
      is_active: determineTargetActive(nameNorm, count),
      count,
      example: targetResult.examples.get(nameNorm)
    })).sort((a, b) => {
      if (a.is_active !== b.is_active) return b.is_active - a.is_active;
      if (a.count !== b.count) return b.count - a.count;
      return a.name_norm.localeCompare(b.name_norm);
    });
    
    await writeMasterCsv(OUTPUT_FILES.target, targetMaster);
    
    console.log('\n=== 位置マスター生成 ===');
    const positionResult = aggregateKeywords(data, POSITION_KEYWORDS, normalizePositionName);
    const positionMaster = Array.from(positionResult.counts.entries()).map(([nameNorm, count]) => ({
      name: nameNorm,
      name_norm: nameNorm,
      is_active: determinePositionActive(nameNorm, count),
      count,
      example: positionResult.examples.get(nameNorm)
    })).sort((a, b) => {
      if (a.is_active !== b.is_active) return b.is_active - a.is_active;
      const orderA = getPositionOrder(a.name_norm);
      const orderB = getPositionOrder(b.name_norm);
      if (orderA !== orderB) return orderA - orderB;
      return b.count - a.count;
    });
    
    await writeMasterCsv(OUTPUT_FILES.position, positionMaster);
    
    // サマリ出力
    console.log('\n=== 生成サマリ ===');
    console.log(`作業マスター: ${actionMaster.length}件 (active: ${actionMaster.filter(x => x.is_active).length}件)`);
    console.log(`対象マスター: ${targetMaster.length}件 (active: ${targetMaster.filter(x => x.is_active).length}件)`);
    console.log(`位置マスター: ${positionMaster.length}件 (active: ${positionMaster.filter(x => x.is_active).length}件)`);
    
    console.log('\nマスター生成完了！');
    
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