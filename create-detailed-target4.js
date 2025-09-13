/**
 * 詳細度保持型target4マスター生成スクリプト
 * 経理・調達実務に必要な材質・用途・仕様の詳細情報を適切に保持
 */

const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// 入力・出力ファイル
const INPUT_CSV = 'C:/Windsurf/bankincafe/マスタ作成用/invoicenew.csv';
const INVESTIGATION_CSV = 'C:/Windsurf/bankincafe/マスタ作成用/detailed_parts_investigation.csv';
const OUTPUT_FILE = 'C:/Windsurf/bankincafe/マスタ作成用/マスタ候補/master_target4_detailed.csv';

// フィルタ条件（適度な品質管理）
const CONFIDENCE_THRESHOLD = 0.80;
const MIN_COUNT_FOR_INCLUSION = 2; // 詳細度重視のため最小件数を下げる

// 除外する明らかな非部品語（最小限）
const STRICT_EXCLUDED_KEYWORDS = new Set([
  // 明らかな動詞のみ除外
  '取替え', '脱着', '溶接', '切断', '修正', '調整', '点検', '組替', '付替', '製作', '加工', '塗装',
  // 明らかな数量詞のみ除外  
  '本', '個', '枚', '箇所', 'ヶ所', '番', '側', '一式'
]);

// 詳細調査データ読み込み
async function loadInvestigationData() {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(INVESTIGATION_CSV)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        console.log(`詳細調査データ: ${results.length}件`);
        resolve(results);
      })
      .on('error', reject);
  });
}

// メインデータ読み込み
async function loadMainData() {
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
        console.log(`メインデータ: ${results.length}件`);
        resolve(results);
      })
      .on('error', reject);
  });
}

// 詳細部品名として有効かチェック（寛容なアプローチ）
function isValidDetailedPart(partName) {
  // 明らかな動詞のみ除外（厳格すぎないように）
  if (STRICT_EXCLUDED_KEYWORDS.has(partName)) {
    return false;
  }
  
  // 単独の動詞が含まれる場合のみ除外（部品名+動詞の組み合わせは許可）
  const prohibitedVerbs = ['取替', '脱着', '溶接', '切断', '修正', '調整', '製作', '加工'];
  const isStandaloneVerb = prohibitedVerbs.some(verb => partName === verb);
  if (isStandaloneVerb) {
    return false;
  }
  
  // 過度に長い記述は除外（作業説明の可能性）
  if (partName.length > 20) {
    return false;
  }
  
  // 数字のみのパターンは除外
  if (/^\d+$/.test(partName)) {
    return false;
  }
  
  // その他は基本的に許可（詳細度重視）
  return true;
}

// 最小限の名寄せ（過度な統合を避ける）
function minimalNormalization(name) {
  const minimalRules = {
    // 明らかに同一の異表記のみ統合
    'ドアー': 'ドア',
    'バンパ': 'バンパー',
    'ミラ': 'ミラー',
    
    // ランプ/ライトは用途が明確な場合のみ統合（慎重に）
    'テールランプ': 'テールライト',
    'バックランプ': 'バックライト',
    
    // その他は統合しない（詳細度重視）
  };
  
  return minimalRules[name] || name;
}

// 詳細度重視のis_active判定
function determineDetailedActive(partName, count, basicPart) {
  // 高頻度は確実にactive
  if (count >= 5) return true;
  
  // 基本部品は低頻度でもactive
  const basicParts = new Set([
    'ボルト', 'ナット', 'ステー', 'ブラケット', 'ガード', 'カバー', 'ドア', 'バンパー',
    'ライト', 'ランプ', 'パイプ', 'ホース', 'ミラー', 'ガラス', 'ハンドル', 'ゴム'
  ]);
  
  if (basicParts.has(basicPart) && count >= MIN_COUNT_FOR_INCLUSION) {
    return true;
  }
  
  // 重要な詳細仕様は低頻度でもactive
  const importantSpecifications = [
    // 材質仕様
    'ステン', 'アルミ', 'スチール', 'プラ', '樹脂',
    // 状態仕様  
    '折れ込み', '腐食', '嚙み込み', '折損',
    // 用途仕様
    'ワイパー', 'ウェザー', 'ドアー', 'フロント', 'リア', 'サイド',
    // 位置仕様
    'アッパー', 'ロア', 'センター', 'コーナー', 'インナー', 'アウター'
  ];
  
  const hasImportantSpec = importantSpecifications.some(spec => partName.includes(spec));
  if (hasImportantSpec && count >= MIN_COUNT_FOR_INCLUSION) {
    return true;
  }
  
  // その他は3件以上でactive
  return count >= 3;
}

// 詳細部品マスター生成
async function generateDetailedMaster() {
  const investigationData = await loadInvestigationData();
  const mainData = await loadMainData();
  
  // 調査データをベースに詳細マスター作成
  const detailedParts = new Map();
  
  for (const item of investigationData) {
    const partName = item.name;
    const count = parseInt(item.count) || 0;
    const basicPart = item.basic_part;
    const example = item.example;
    
    if (isValidDetailedPart(partName) && count >= MIN_COUNT_FOR_INCLUSION) {
      const normalizedName = minimalNormalization(partName);
      
      if (!detailedParts.has(normalizedName)) {
        detailedParts.set(normalizedName, {
          name: normalizedName,
          name_norm: normalizedName,
          basic_part: basicPart,
          count: count,
          is_active: determineDetailedActive(normalizedName, count, basicPart),
          example: example,
          category: determineCategory(normalizedName, basicPart)
        });
      } else {
        // 既存項目のカウント更新
        const existing = detailedParts.get(normalizedName);
        existing.count = Math.max(existing.count, count);
        existing.is_active = determineDetailedActive(normalizedName, existing.count, basicPart);
      }
    }
  }
  
  return Array.from(detailedParts.values());
}

// カテゴリ分類（経理・調達用）
function determineCategory(partName, basicPart) {
  const categories = {
    // 構造・固定部品
    'structural': ['ボルト', 'ナット', 'ワッシャー', 'ピン', 'リベット', 'ステー', 'ブラケット', 'フレーム', '枠'],
    // 外装・保護部品  
    'exterior': ['ガード', 'バンパー', 'カバー', 'フェンダー', 'パネル', 'プレート', 'ドア'],
    // 照明・電装部品
    'electrical': ['ライト', 'ランプ', 'ハーネス', 'センサー', 'スイッチ', 'リレー', 'バッテリー'],
    // シール・緩衝部品
    'sealing': ['ゴム', 'パッキン', 'シール', 'ガスケット', 'ブッシュ'],
    // 配管・流体部品
    'piping': ['パイプ', 'ホース', 'チューブ', 'ジョイント', 'バルブ'],
    // 内装・操作部品
    'interior': ['シート', 'ハンドル', 'ミラー', 'ガラス', 'レバー'],
    // その他
    'other': []
  };
  
  for (const [category, parts] of Object.entries(categories)) {
    if (parts.includes(basicPart)) {
      return category;
    }
  }
  
  return 'other';
}

// メイン処理
async function main() {
  try {
    console.log('詳細度保持型Target4生成開始...');
    
    // 詳細マスター生成
    const detailedMaster = await generateDetailedMaster();
    
    // ソート（カテゴリ別 → アクティブ → カウント順）
    detailedMaster.sort((a, b) => {
      if (a.category !== b.category) return a.category.localeCompare(b.category);
      if (a.is_active !== b.is_active) return b.is_active - a.is_active;
      if (a.count !== b.count) return b.count - a.count;
      return a.name_norm.localeCompare(b.name_norm);
    });
    
    // CSV出力用データ準備
    const outputData = detailedMaster.map(item => ({
      name: item.name,
      name_norm: item.name_norm,
      is_active: item.is_active,
      count: item.count,
      example: item.example
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
    
    // 詳細レポート
    console.log(`\n=== 詳細度保持型Target4完成 ===`);
    console.log(`出力ファイル: ${OUTPUT_FILE}`);
    console.log(`総項目数: ${detailedMaster.length}件`);
    console.log(`アクティブ項目: ${detailedMaster.filter(x => x.is_active).length}件`);
    
    // カテゴリ別統計
    const categoryStats = {};
    detailedMaster.forEach(item => {
      if (!categoryStats[item.category]) {
        categoryStats[item.category] = { total: 0, active: 0 };
      }
      categoryStats[item.category].total++;
      if (item.is_active) categoryStats[item.category].active++;
    });
    
    console.log('\n📊 カテゴリ別統計:');
    Object.entries(categoryStats).forEach(([category, stats]) => {
      console.log(`  ${category}: ${stats.total}件 (active: ${stats.active}件)`);
    });
    
    // 詳細度の実例
    console.log('\n🔍 詳細度保持の実例 (上位20件):');
    detailedMaster
      .filter(x => x.is_active)
      .slice(0, 20)
      .forEach(item => {
        console.log(`  ${item.name_norm} (${item.count}件) - ${item.example}`);
      });
    
    console.log('\n✅ 経理・調達実務に適した詳細度を保持したマスターが完成しました！');
    
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