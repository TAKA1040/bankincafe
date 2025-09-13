/**
 * 経理上使用可能な高品質target4マスター生成スクリプト
 * target2をベースとし、さらなる品質向上と網羅性を実現
 */

const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// 入力・出力ファイル
const INPUT_CSV = 'C:/Windsurf/bankincafe/マスタ作成用/invoicenew.csv';
const REFERENCE_CSV = 'C:/Windsurf/bankincafe/マスタ作成用/マスタ候補/master_target2.csv';
const OUTPUT_FILE = 'C:/Windsurf/bankincafe/マスタ作成用/マスタ候補/master_target4.csv';

// フィルタ条件（より厳格に）
const CONFIDENCE_THRESHOLD = 0.85; // target2より厳格
const MIN_COUNT_FOR_ACTIVE = 3; // 経理用途のため最小件数を設定

// 経理用途に適した対象物キーワード（部品・部材中心）
const ACCOUNTING_TARGET_KEYWORDS = [
  // 基本構造部品
  'ボルト', 'ナット', 'ワッシャー', 'スクリュー', 'ビス', 'ピン', 'リベット',
  'ステー', 'ブラケット', 'マウント', 'サポート', '支持金具',
  
  // 外装・保護部品
  'ガード', 'バンパー', 'カバー', 'フェンダー', 'パネル', 'プレート',
  'ドア', 'ハッチ', '扉', '蓋', 'フタ',
  
  // 照明系（基本部品のみ）
  'ライト', 'ランプ', 'テールライト', 'ヘッドライト', 'フォグライト', 
  'バックライト', 'マーカーライト', 'コーナーライト', 'ウインカー',
  'レンズ', 'リフレクター', '反射板',
  
  // 電装系基本部品
  'ハーネス', '配線', 'コネクター', 'ソケット', 'スイッチ', 'リレー',
  'ヒューズ', 'センサー', 'バッテリー',
  
  // 機械系基本部品
  'ベアリング', 'ブッシュ', 'ゴム', 'パッキン', 'シール', 'ガスケット',
  'スプリング', 'バネ', 'ダンパー', 'ショックアブソーバー',
  
  // 駆動系基本部品
  'ベルト', 'チェーン', 'ギア', 'プーリー', 'ローラー',
  '軸', 'シャフト', 'アーム', 'ロッド', 'バー',
  
  // 配管・ホース類
  'パイプ', 'ホース', 'チューブ', 'ダクト', '配管',
  'ジョイント', 'エルボー', 'ティー', 'バルブ', 'コック',
  
  // 板金・構造材
  '鋼板', '板', 'プレート', '縞鋼板', 'フレーム', '枠', '骨', '梁',
  'アングル', 'チャンネル', 'パイプ', 'ポール',
  
  // 内装・機能部品
  'シート', 'クッション', 'マット', 'カーペット',
  'ハンドル', 'レバー', 'ノブ', 'グリップ',
  'ミラー', 'ガラス', 'レンズ', 'プリズム',
  
  // 機能部材
  'フィルター', 'エレメント', 'マフラー', 'サイレンサー',
  'ラジエーター', 'クーラー', 'ファン', 'ブロワー',
  
  // 接続・固定部品
  'クランプ', 'クリップ', 'フック', 'ラッチ', 'ロック',
  '蝶番', 'ヒンジ', 'ピボット', 'ストライカー',
  
  // 車両特有部品
  'タイヤ', 'ホイール', 'リム', 'バルブ',
  'ペダル', 'ステップ', 'フロアマット',
  
  // 荷物・積載関連
  'コンテナ', 'ボックス', '箱', 'ケース',
  'ロープ', 'ベルト', 'フック', 'アイ',
  
  // 塗装・表面処理関連部材
  'プライマー', 'パテ', '塗料', 'コーティング',
  
  // 工具・治具（修理で使用される）
  'ジャッキ', 'スタンド', 'ホルダー', 'ゲージ'
];

// 除外キーワード（作業動詞が混入した項目を排除）
const EXCLUDED_KEYWORDS = new Set([
  // 作業動詞系
  '取替', '脱着', '溶接', '切断', '修正', '調整', '点検', '組替', '付替',
  '製作', '制作', '加工', '塗装', '貼付', '張替', '打替',
  
  // 作業状態系
  '折れ込み', '応急', '破損', '亀裂', '腐食', '曲がり', '異音',
  
  // 数量・単位系
  '本', '個', '枚', '箇所', 'ヶ所', '番', '側',
  
  // 方向・位置（単独では対象物ではない）
  '前', '後', '左', '右', '上', '下', '内', '外',
  
  // その他除外語
  '他', '等', 'その他', '一式', '付属品'
]);

// 品質チェック：対象物として適切かの判定
function isValidTarget(keyword) {
  // 除外キーワードチェック
  if (EXCLUDED_KEYWORDS.has(keyword)) return false;
  
  // 作業動詞の混入チェック
  const actionVerbs = ['取替', '脱着', '溶接', '切断', '修正', '調整', '製作', '付替'];
  for (const verb of actionVerbs) {
    if (keyword.includes(verb)) return false;
  }
  
  // 長すぎる複合語は除外（作業説明が混入している可能性）
  if (keyword.length > 10) return false;
  
  // 数字が含まれる場合は慎重に判定
  if (/\d/.test(keyword) && !['3t', '5t', '10t'].includes(keyword)) {
    return false;
  }
  
  return true;
}

// データ読み込みとフィルタリング（厳格版）
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

// target2の既存データ読み込み
async function loadExistingTarget2() {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(REFERENCE_CSV)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
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

// キーワード抽出（品質重視）
function extractTargetKeywords(text, keywords) {
  const found = new Set();
  const processed = preprocess(text);
  
  // 長い順にソートして優先度を付ける
  const sortedKeywords = keywords.sort((a, b) => b.length - a.length);
  
  for (const keyword of sortedKeywords) {
    if (processed.includes(keyword) && isValidTarget(keyword) && !found.has(keyword)) {
      // 包含関係チェック
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

// 高品質名寄せルール（経理向け）
function normalizeTargetName(name) {
  const rules = {
    // ライト/ランプ統合（経理的に同一部品）
    'テールランプ': 'テールライト',
    'バックランプ': 'バックライト',
    'フォグランプ': 'フォグライト',
    'マーカーランプ': 'マーカーライト',
    'コーナーランプ': 'コーナーライト',
    'ウインカーランプ': 'ウインカー',
    
    // 長音整理
    'ドアー': 'ドア', 'バンパ': 'バンパー', 'ミラ': 'ミラー',
    
    // 材質統合
    'ステンレス': 'ステン', 'アルミニウム': 'アルミ',
    
    // 規格統合
    'ボルト': 'ボルト', 'ネジ': 'ボルト', 'スクリュー': 'ボルト',
    
    // 形状統合
    '板': 'プレート', '管': 'パイプ',
    
    // センサー類統合
    'DPF差圧センサー': 'DPFセンサー',
    '圧力センサー': '圧力センサー'
  };
  
  return rules[name] || name;
}

// 経理向けis_active判定（保守的）
function determineTargetActive(nameNorm, count) {
  // 高頻度は確実にactive
  if (count >= 10) return true;
  
  // 基本部品は中頻度でもactive
  const basicParts = new Set([
    'ボルト', 'ナット', 'ステー', 'ブラケット', 'ガード', 'カバー',
    'ドア', 'バンパー', 'ライト', 'ランプ', 'パイプ', 'ホース',
    'ミラー', 'ガラス', 'ハンドル', 'スイッチ', '蝶番'
  ]);
  
  if (basicParts.has(nameNorm) && count >= MIN_COUNT_FOR_ACTIVE) {
    return true;
  }
  
  // その他は高頻度のみ
  return count >= 5;
}

// メイン処理
async function main() {
  try {
    console.log('経理向け高品質Target4マスター生成開始...');
    
    // データ読み込み
    const data = await loadAndFilterData();
    const existingTarget2 = await loadExistingTarget2();
    
    console.log(`Target2参照データ: ${existingTarget2.length}件`);
    console.log('高品質対象物キーワード抽出中...');
    
    // カウント集計
    const counts = new Map();
    const examples = new Map();
    
    for (const row of data) {
      const extractedKeywords = extractTargetKeywords(row.raw_label_part, ACCOUNTING_TARGET_KEYWORDS);
      
      for (const keyword of extractedKeywords) {
        const normalized = normalizeTargetName(keyword);
        
        if (!counts.has(normalized)) {
          counts.set(normalized, 0);
          examples.set(normalized, row.raw_label_part);
        }
        counts.set(normalized, counts.get(normalized) + 1);
      }
    }
    
    // Target2の既知項目も統合（品質保証）
    for (const existing of existingTarget2) {
      const name = existing.name_norm;
      const count = parseInt(existing.count) || 0;
      
      if (!counts.has(name)) {
        counts.set(name, count);
        examples.set(name, existing.example);
      } else {
        // 既存データと新規データの統合
        counts.set(name, Math.max(counts.get(name), count));
      }
    }
    
    // マスターデータ作成
    const targetMaster = Array.from(counts.entries()).map(([nameNorm, count]) => ({
      name: nameNorm,
      name_norm: nameNorm,
      is_active: determineTargetActive(nameNorm, count),
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
    
    await csvWriter.writeRecords(targetMaster);
    
    // 品質レポート
    console.log(`\n=== 経理向けTarget4生成完了 ===`);
    console.log(`出力ファイル: ${OUTPUT_FILE}`);
    console.log(`総項目数: ${targetMaster.length}件`);
    console.log(`アクティブ項目: ${targetMaster.filter(x => x.is_active).length}件`);
    
    // 品質指標
    const highFrequencyItems = targetMaster.filter(x => x.count >= 10);
    const lowNoiseRatio = targetMaster.filter(x => x.name_norm.length <= 8).length / targetMaster.length;
    
    console.log(`\n📊 品質指標:`);
    console.log(`  高頻度項目(10件以上): ${highFrequencyItems.length}件`);
    console.log(`  低ノイズ比率: ${(lowNoiseRatio * 100).toFixed(1)}%`);
    console.log(`  Target2との重複: ${targetMaster.filter(t => existingTarget2.some(e => e.name_norm === t.name_norm)).length}件`);
    
    console.log('\n✅ 主要対象物（上位15件）:');
    targetMaster
      .filter(x => x.is_active)
      .slice(0, 15)
      .forEach(item => {
        console.log(`  ${item.name_norm} (${item.count}件) - ${item.example}`);
      });
    
    console.log('\n経理向けTarget4マスター生成完了！');
    
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