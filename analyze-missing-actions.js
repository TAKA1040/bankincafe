/**
 * invoicenew.csvから漏れている作業キーワードを発見し、action4を生成するスクリプト
 */

const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// 入力ファイル
const INPUT_CSV = 'C:/Windsurf/bankincafe/マスタ作成用/invoicenew.csv';
const OUTPUT_FILE = 'C:/Windsurf/bankincafe/マスタ作成用/マスタ候補/master_action4.csv';

// フィルタ条件
const CONFIDENCE_THRESHOLD = 0.80;

// 既知の作業キーワード（action2まで）
const KNOWN_ACTIONS = new Set([
  '取替', '脱着', '加工', '溶接', '取付', '修正', '切断', '曲がり直し', '鈑金', '塗装',
  '取り外し', '点検', '張替', '調整', '打替', '貼付', '錆止め', '仕上げ', '固定', '面取り',
  '貼り付け', '取り替え', '異音止め'
]);

// 包括的な作業キーワード候補（動詞・動作表現）
const COMPREHENSIVE_ACTION_PATTERNS = [
  // 基本動詞
  '取替', '取り替え', '交換', '換装', '付替', '付け替え', '組替', '組み替え',
  '脱着', '取付', '取り付け', '装着', '設置', '取外', '取り外し', '撤去', '除去',
  
  // 加工系
  '加工', '製作', '制作', '組立', '組み立て', '切断', 'カット', '切除', '削除', '研磨',
  '面取り', '面取', '穴開け', '穴あけ', 'ドリル', 'タップ', 'ネジ切り', '曲げ', '成形',
  
  // 修理系
  '修正', '修理', '補修', '直し', '治し', '補強', '改修', '整備', '復旧', '再生',
  '曲がり直し', 'ゆがみ直し', 'へこみ直し', '歪み直し',
  
  // 溶接・接合系
  '溶接', 'アーク溶接', 'ガス溶接', '点溶接', 'スポット溶接', 'TIG溶接', 'MIG溶接',
  '接合', '結合', '固定', '締付', '締め付け', '緩め', '増締',
  
  // 塗装・表面処理系
  '塗装', '下塗り', '中塗り', '上塗り', '錆止め', '錆び止め', 'サビ止め', 'プライマー',
  '仕上げ', '研磨仕上げ', '磨き', 'ペーパー仕上げ', 'バフ仕上げ',
  
  // 鈑金系
  '鈑金', '板金', '叩き出し', 'パテ付け', 'パテ', 'パテ処理', 'パテ盛り',
  'へこみ修正', '凹み修正', 'しわ伸ばし',
  
  // 調整・点検系
  '調整', '微調整', 'セット', 'セッティング', '校正', 'キャリブレーション',
  '点検', '検査', '確認', 'チェック', '診断', '測定', '計測',
  
  // 張り替え・貼り付け系
  '張替', '張り替え', '貼替', '貼り替え', '貼付', '貼り付け', '接着',
  '両面テープ', 'テープ貼り', 'シール貼り', 'ラベル貼り',
  
  // 打ち替え・ファスナー系
  '打替', '打ち替え', 'リベット打ち', 'リベット', 'ボルト締め', 'ナット締め',
  'ネジ締め', 'ビス止め', 'ピン打ち',
  
  // 清掃・洗浄系
  '清掃', '洗浄', 'クリーニング', '掃除', '拭き取り', '除塵', '脱脂',
  
  // 異音・振動対策
  '異音止め', '異音対策', '振動止め', '防振', 'ダンパー', 'ブッシュ',
  
  // 特殊作業
  '応急', '応急処理', '応急修理', 'テンパリー', '仮止め', '仮付け', '養生',
  '保護', 'マスキング', '防錆', '防腐',
  
  // 分解・組立系
  '分解', 'バラシ', 'ばらし', '解体', '組立', '組み立て', 'アッセンブリ',
  
  // 位置・角度調整
  '位置調整', '角度調整', '高さ調整', 'レベル調整', 'アライメント',
  
  // 電気・配線系
  '配線', '結線', '接続', '切断', '絶縁', 'テスター', '導通',
  
  // 油脂・液体系
  '給油', '注油', 'オイル交換', '潤滑', 'グリスアップ', '充填', '補充',
  
  // 圧入・抜き系
  '圧入', 'プレス', '抜き', '引き抜き', '押し込み'
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

// 包括的キーワード抽出
function extractAllActionKeywords(text, keywords) {
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

// 名寄せルール適用（拡張版）
function normalizeActionName(name) {
  const rules = {
    // 基本形統一
    '取り付け': '取付', '取付け': '取付', '装着': '取付', '設置': '取付',
    '取り外し': '取外', '取外し': '取外', '撤去': '取外', '除去': '取外',
    '取り替え': '取替', '交換': '取替', '換装': '取替', '付替': '取替', '付け替え': '取替',
    
    // 張替・貼付統一
    '張り替え': '張替', '張替え': '張替', '貼替': '張替', '貼り替え': '張替',
    '貼り付け': '貼付', '接着': '貼付',
    
    // 打替統一
    '打ち替え': '打替', '打替え': '打替',
    
    // 面取り統一
    '面取': '面取り',
    
    // 錆止め統一
    '錆び止め': '錆止め', 'サビ止め': '錆止め',
    
    // 仕上げ統一
    '研磨仕上げ': '仕上げ', 'ペーパー仕上げ': '仕上げ', 'バフ仕上げ': '仕上げ',
    
    // 調整統一
    '微調整': '調整', 'セット': '調整', 'セッティング': '調整',
    
    // 点検統一
    '検査': '点検', '確認': '点検', 'チェック': '点検',
    
    // 修正統一
    '修理': '修正', '補修': '修正', '直し': '修正', '治し': '修正',
    
    // 清掃統一
    '洗浄': '清掃', 'クリーニング': '清掃', '掃除': '清掃',
    
    // 切断統一
    'カット': '切断', '切除': '切断',
    
    // 加工統一（製作・制作は別途判断）
    '成形': '加工', '曲げ': '加工',
    
    // 組立統一
    '組み立て': '組立', 'アッセンブリ': '組立',
    
    // 固定統一
    '締付': '固定', '締め付け': '固定'
  };
  
  return rules[name] || name;
}

// is_active判定（拡張版）
function determineActionActive(nameNorm, count) {
  // 高頻度は確実にactive
  if (count >= 10) return true;
  
  // 中頻度は汎用語以外はactive
  if (count >= 3) {
    const genericActions = new Set(['加工', '修正', '補修', '清掃', '点検', '確認', '検査']);
    return !genericActions.has(nameNorm);
  }
  
  // 低頻度でも重要な作業は例外的にactive
  if (count >= 1) {
    const importantActions = new Set([
      '曲がり直し', '異音止め', '錆止め', '面取り', '応急', '仮止め', '防錆',
      '圧入', '抜き', '給油', '注油', 'アライメント', '配線', '絶縁'
    ]);
    return importantActions.has(nameNorm);
  }
  
  return false;
}

// メイン処理
async function main() {
  try {
    console.log('包括的Action4マスター生成開始...');
    
    // データ読み込み
    const data = await loadAndFilterData();
    
    console.log('包括的作業キーワード抽出中...');
    
    // カウント集計
    const counts = new Map();
    const examples = new Map();
    
    // 長い順にソートして優先度を付ける
    const sortedKeywords = COMPREHENSIVE_ACTION_PATTERNS.sort((a, b) => b.length - a.length);
    
    for (const row of data) {
      const extractedKeywords = extractAllActionKeywords(row.raw_label_part, sortedKeywords);
      
      for (const keyword of extractedKeywords) {
        const normalized = normalizeActionName(keyword);
        
        if (!counts.has(normalized)) {
          counts.set(normalized, 0);
          examples.set(normalized, row.raw_label_part);
        }
        counts.set(normalized, counts.get(normalized) + 1);
      }
    }
    
    // マスターデータ作成
    const actionMaster = Array.from(counts.entries()).map(([nameNorm, count]) => ({
      name: nameNorm,
      name_norm: nameNorm,
      is_active: determineActionActive(nameNorm, count),
      count,
      example: examples.get(nameNorm)
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
    
    await csvWriter.writeRecords(actionMaster);
    
    // サマリー出力
    console.log(`\n=== Action4 生成完了 ===`);
    console.log(`出力ファイル: ${OUTPUT_FILE}`);
    console.log(`総項目数: ${actionMaster.length}件`);
    console.log(`アクティブ項目: ${actionMaster.filter(x => x.is_active).length}件`);
    
    // 新規発見項目（既知以外）
    const newDiscoveries = actionMaster.filter(x => !KNOWN_ACTIONS.has(x.name_norm));
    console.log(`新規発見: ${newDiscoveries.length}件`);
    
    if (newDiscoveries.length > 0) {
      console.log('\n🆕 新規発見項目 (上位20件):');
      newDiscoveries
        .slice(0, 20)
        .forEach(item => {
          console.log(`  ${item.name_norm} (${item.count}件, active:${item.is_active}) - ${item.example}`);
        });
    }
    
    console.log('\nAction4マスター生成完了！');
    
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