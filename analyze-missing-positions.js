/**
 * invoicenew.csvから漏れている位置キーワードを発見し、position4を生成するスクリプト
 */

const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// 入力ファイル
const INPUT_CSV = 'C:/Windsurf/bankincafe/マスタ作成用/invoicenew.csv';
const OUTPUT_FILE = 'C:/Windsurf/bankincafe/マスタ作成用/マスタ候補/master_position4.csv';

// フィルタ条件
const CONFIDENCE_THRESHOLD = 0.80;

// 既知の位置キーワード（position2まで）
const KNOWN_POSITIONS = new Set([
  '前', 'フロント', '前右', '前左', '後', 'リア', '後左', '左', '右', '内', '外', 
  '上', '下', '運転席', '助手席', 'センター', '中央', '前側'
]);

// 包括的な位置キーワード候補
const COMPREHENSIVE_POSITION_PATTERNS = [
  // 基本方向（日本語）
  '前', '後', '左', '右', '上', '下', 'フロント', 'リア',
  
  // 詳細位置（日本語＋方向）
  '前右', '前左', '後右', '後左', '左前', '右前', '左後', '右後',
  '前上', '前下', '後上', '後下', '左上', '左下', '右上', '右下',
  '上前', '上後', '上左', '上右', '下前', '下後', '下左', '下右',
  
  // 英語略号（基本）
  'FR', 'FL', 'RR', 'RL', 'LH', 'RH', 'F', 'R', 'L',
  
  // 内外位置
  '内', '外', '内側', '外側', '奥', '手前',
  
  // 中央・センター系
  'センター', '中央', '真ん中', '中心', 'ミドル',
  
  // 席・キャビン系
  '運転席', '助手席', '運転席側', '助手席側', '客席', '荷台',
  
  // 角・コーナー系
  '角', 'コーナー', '隅', '端', '先端', '奥端',
  
  // 側面系
  '前側', '後側', '左側', '右側', '側面', 'サイド',
  
  // 高さ・レベル系
  '上側', '下側', '最上', '最下', '高位', '低位', 'トップ', 'ボトム',
  
  // 近傍・周辺系
  '近く', '周辺', '隣', '隣接', '付近', '脇', '横',
  
  // 部位特有の位置
  '表', '裏', '表面', '裏面', '背面', '正面', '側面',
  
  // 詳細部位
  '先頭', '最後尾', '中間', '途中', '間', '継ぎ目', 'つなぎ目',
  
  // 車両特有位置
  'フロントガラス側', 'リアガラス側', 'エンジン側', 'キャブ側',
  'アーム側', 'シャーシ側', 'ボディ側', 'フレーム側',
  
  // 開口部・穴系
  '穴', '開口部', '差込口', '取付穴', '逃げ穴',
  
  // 接続・結合部
  '接続部', '結合部', '連結部', '取付部', '固定部',
  
  // 境界・境目
  '境界', '境目', '分岐', '分かれ目', '切れ目',
  
  // 車両方向系（より詳細）
  '車幅方向', '車長方向', '車高方向',
  
  // 具体的な車両部位の位置関係
  '荷台側', 'キャブ側', 'バンパー側', 'ミラー側', 'ライト側',
  'ドア側', 'ウィング側', 'タイヤ側', 'ホイール側',
  
  // 作業特有の位置表現
  '取付位置', '設置位置', '固定位置', '接続位置', '作業位置',
  
  // 数量・番号位置
  '1番', '2番', '3番', '4番', '5番', '6番',
  '第1', '第2', '第3', '第4', '第5', '第6',
  '1箇所', '2箇所', '3箇所', '4箇所', '5箇所', '6箇所',
  
  // 相対位置
  '対向', '対角', '対面', '反対', '逆側', '裏返し'
];

// データ読み込みとフィルタリング
async function loadAndFilterData() {
  return new Promise((resolve, reject) => {
    const results = [];
    
    fs.createReadStream(INPUT_CSV)
      .pipe(csv())
      .on('data', (row) => {
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
  processed = toHalfWidth(processed);
  processed = processed.replace(/[，、\/]/g, '・');
  processed = processed.toUpperCase();
  
  return processed;
}

// 包括的キーワード抽出（位置特化）
function extractAllPositionKeywords(text, keywords) {
  const found = new Set();
  const processed = preprocess(text);
  
  // 長い順にソートして包含関係を適切に処理
  const sortedKeywords = keywords.sort((a, b) => b.length - a.length);
  
  for (const keyword of sortedKeywords) {
    const upperKeyword = keyword.toUpperCase();
    if (processed.includes(upperKeyword) && !found.has(keyword)) {
      // 包含関係チェック（長いキーワードが見つかったら短いものは除外）
      let shouldAdd = true;
      for (const existing of found) {
        const upperExisting = existing.toUpperCase();
        if (upperExisting.includes(upperKeyword) || upperKeyword.includes(upperExisting)) {
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

// 位置の正規化（統合・標準化）
function normalizePositionName(name) {
  const rules = {
    // 略号の正規化
    'FR': '前右', 'FL': '前左', 'RR': '後右', 'RL': '後左',
    'LH': '左', 'RH': '右', 'F': 'フロント', 'R': 'リア', 'L': '左',
    
    // 側面系の統一
    '内側': '内', '外側': '外', '前側': '前', '後側': '後', '左側': '左', '右側': '右',
    '上側': '上', '下側': '下',
    
    // センター系の統一
    '真ん中': 'センター', '中心': 'センター', 'ミドル': 'センター',
    
    // 席系の統一
    '運転席側': '運転席', '助手席側': '助手席',
    
    // 表面系の統一
    '表面': '表', '裏面': '裏', '背面': '裏', '正面': '表',
    
    // 位置系の統一
    '奥端': '奥', '先端': '先頭', '手前': '前',
    
    // 部位系の統一
    '隣接': '隣', '付近': '近く', '周辺': '近く'
  };
  
  return rules[name] || name;
}

// is_active判定（位置特化）
function determinePositionActive(nameNorm, count) {
  // 高頻度は確実にactive
  if (count >= 5) return true;
  
  // 基本方向は低頻度でもactive（網羅性重視）
  const basicDirections = new Set([
    '前', '後', '左', '右', '上', '下', 'フロント', 'リア', 'センター', '中央',
    '前右', '前左', '後右', '後左', '内', '外', '運転席', '助手席'
  ]);
  
  if (basicDirections.has(nameNorm) && count >= 1) {
    return true;
  }
  
  // 重要な詳細位置も低頻度でactive
  const importantPositions = new Set([
    '前側', '後側', '上側', '下側', '角', 'コーナー', '表', '裏',
    '先頭', '最後尾', '中間', '取付位置', '固定位置'
  ]);
  
  if (importantPositions.has(nameNorm) && count >= 2) {
    return true;
  }
  
  // その他は3件以上でactive
  return count >= 3;
}

// 位置の論理順ソート用（拡張版）
function getPositionOrder(nameNorm) {
  const order = {
    // 基本方向（前後）
    '前': 1, 'フロント': 1, '前側': 2,
    '後': 3, 'リア': 3, '後側': 4,
    
    // 詳細方向（前後×左右）
    '前右': 5, '前左': 6, '後右': 7, '後左': 8,
    
    // 基本方向（左右）
    '左': 10, '右': 11,
    '左前': 12, '右前': 13, '左後': 14, '右後': 15,
    
    // 内外
    '内': 20, '外': 21,
    
    // 上下
    '上': 25, '下': 26, '上側': 27, '下側': 28,
    
    // 席
    '運転席': 30, '助手席': 31,
    
    // センター
    'センター': 35, '中央': 36,
    
    // 角・端
    '角': 40, 'コーナー': 41, '先頭': 42, '最後尾': 43,
    
    // 表裏
    '表': 45, '裏': 46,
    
    // 特殊位置
    '奥': 50, '手前': 51, '近く': 52, '隣': 53,
    
    // 作業位置
    '取付位置': 60, '固定位置': 61, '設置位置': 62
  };
  
  return order[nameNorm] || 999;
}

// メイン処理
async function main() {
  try {
    console.log('包括的Position4マスター生成開始...');
    
    // データ読み込み
    const data = await loadAndFilterData();
    
    console.log('包括的位置キーワード抽出中...');
    
    // カウント集計
    const counts = new Map();
    const examples = new Map();
    
    for (const row of data) {
      const extractedKeywords = extractAllPositionKeywords(row.raw_label_part, COMPREHENSIVE_POSITION_PATTERNS);
      
      for (const keyword of extractedKeywords) {
        const normalized = normalizePositionName(keyword);
        
        if (!counts.has(normalized)) {
          counts.set(normalized, 0);
          examples.set(normalized, row.raw_label_part);
        }
        counts.set(normalized, counts.get(normalized) + 1);
      }
    }
    
    // マスターデータ作成
    const positionMaster = Array.from(counts.entries()).map(([nameNorm, count]) => ({
      name: nameNorm,
      name_norm: nameNorm,
      is_active: determinePositionActive(nameNorm, count),
      count,
      example: examples.get(nameNorm)
    })).sort((a, b) => {
      if (a.is_active !== b.is_active) return b.is_active - a.is_active;
      const orderA = getPositionOrder(a.name_norm);
      const orderB = getPositionOrder(b.name_norm);
      if (orderA !== orderB) return orderA - orderB;
      return b.count - a.count;
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
    
    await csvWriter.writeRecords(positionMaster);
    
    // サマリー出力
    console.log(`\n=== Position4 生成完了 ===`);
    console.log(`出力ファイル: ${OUTPUT_FILE}`);
    console.log(`総項目数: ${positionMaster.length}件`);
    console.log(`アクティブ項目: ${positionMaster.filter(x => x.is_active).length}件`);
    
    // 新規発見項目（既知以外）
    const newDiscoveries = positionMaster.filter(x => !KNOWN_POSITIONS.has(x.name_norm));
    console.log(`新規発見: ${newDiscoveries.length}件`);
    
    if (newDiscoveries.length > 0) {
      console.log('\n🆕 新規発見項目 (上位20件):');
      newDiscoveries
        .slice(0, 20)
        .forEach(item => {
          console.log(`  ${item.name_norm} (${item.count}件, active:${item.is_active}) - ${item.example}`);
        });
    }
    
    console.log('\nPosition4マスター生成完了！');
    
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