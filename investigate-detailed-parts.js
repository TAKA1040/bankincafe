/**
 * 実データ調査：詳細な部品名の実態把握スクリプト
 * 経理・調達実務に必要な詳細度を保持したマスターを作成するための事前調査
 */

const fs = require('fs');
const csv = require('csv-parser');

// 入力ファイル
const INPUT_CSV = 'C:/Windsurf/bankincafe/マスタ作成用/invoicenew.csv';

// フィルタ条件
const CONFIDENCE_THRESHOLD = 0.80;

// 調査対象の基本部品とその詳細バリエーション
const INVESTIGATION_TARGETS = {
  'ゴム': [],
  'ボルト': [],
  'ステー': [],
  'ブラケット': [],
  'カバー': [],
  'プレート': [],
  'パイプ': [],
  'ライト': [],
  'ランプ': [],
  'ガード': [],
  'パネル': [],
  'ミラー': [],
  'シート': [],
  'フェンダー': [],
  'バンパー': []
};

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
        console.log(`調査対象データ件数: ${results.length}`);
        resolve(results);
      })
      .on('error', reject);
  });
}

// 詳細部品名の収集
function collectDetailedPartNames(data) {
  const detailedParts = new Map();
  
  for (const row of data) {
    const text = row.raw_label_part || '';
    
    // 各基本部品について、詳細なバリエーションを収集
    for (const [basicPart, variants] of Object.entries(INVESTIGATION_TARGETS)) {
      if (text.includes(basicPart)) {
        // 前後の文脈を含めた詳細部品名を抽出
        const matches = extractDetailedPartName(text, basicPart);
        
        for (const match of matches) {
          if (!detailedParts.has(match)) {
            detailedParts.set(match, {
              count: 0,
              basicPart: basicPart,
              examples: []
            });
          }
          
          const item = detailedParts.get(match);
          item.count++;
          if (item.examples.length < 3) {
            item.examples.push(text);
          }
        }
      }
    }
  }
  
  return detailedParts;
}

// 詳細部品名抽出（前後文脈を考慮）
function extractDetailedPartName(text, basicPart) {
  const results = [];
  
  // 基本部品の前後の修飾語を含めて抽出
  const patterns = [
    // 前置修飾語 + 基本部品
    new RegExp(`([\\w\\u3040-\\u309F\\u30A0-\\u30FF\\u4E00-\\u9FAF]{1,10})${basicPart}`, 'g'),
    // 基本部品 + 後置修飾語  
    new RegExp(`${basicPart}([\\w\\u3040-\\u309F\\u30A0-\\u30FF\\u4E00-\\u9FAF]{1,8})`, 'g'),
    // 基本部品単体
    new RegExp(`${basicPart}`, 'g')
  ];
  
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const fullMatch = match[0];
      
      // フィルタリング（明らかに部品名でないものを除外）
      if (isValidDetailedPart(fullMatch, basicPart)) {
        results.push(fullMatch);
      }
    }
  }
  
  return [...new Set(results)]; // 重複除去
}

// 詳細部品名として有効かチェック
function isValidDetailedPart(partName, basicPart) {
  // 作業動詞が含まれている場合は除外
  const actionVerbs = ['取替', '脱着', '溶接', '切断', '修正', '調整', '製作', '加工'];
  for (const verb of actionVerbs) {
    if (partName.includes(verb)) return false;
  }
  
  // 数量が含まれている場合は除外
  if (/\d+/.test(partName) && !/\d+t$/.test(partName)) return false;
  
  // 長すぎる場合は除外
  if (partName.length > 15) return false;
  
  // 基本部品単体の場合は保持
  if (partName === basicPart) return true;
  
  // 修飾語付きの場合は詳細チェック
  const modifier = partName.replace(basicPart, '');
  
  // 有効な修飾語パターン
  const validModifiers = [
    // 材質
    'ステン', 'アルミ', 'スチール', '鋼', '鉄', 'プラ', '樹脂', 'FRP',
    // 用途・位置
    'ドア', 'フロント', 'リア', 'サイド', 'センター', 'アウター', 'インナー',
    'アッパー', 'ロア', 'トップ', 'ボトム', 'レフト', 'ライト',
    // 形状・タイプ
    'フラット', 'ラウンド', '六角', '四角', 'L型', 'T型', 'U型',
    // サイズ・規格
    'ミニ', 'スモール', 'ラージ', 'ワイド', 'ナロー',
    // 機能
    'ワイパー', 'ウェザー', 'シール', 'ガスケット', 'クッション'
  ];
  
  // 修飾語が有効なものかチェック
  for (const validMod of validModifiers) {
    if (modifier.includes(validMod) || validMod.includes(modifier)) {
      return true;
    }
  }
  
  // カタカナ・漢字の修飾語も一定の条件で有効
  if (/[\u30A0-\u30FF\u4E00-\u9FAF]/.test(modifier) && modifier.length <= 6) {
    return true;
  }
  
  return false;
}

// 分析レポート生成
function generateInvestigationReport(detailedParts) {
  console.log('\n=== 詳細部品名実態調査レポート ===');
  
  // 基本部品ごとの分析
  for (const [basicPart, _] of Object.entries(INVESTIGATION_TARGETS)) {
    const relatedParts = Array.from(detailedParts.entries())
      .filter(([name, data]) => data.basicPart === basicPart)
      .sort(([, a], [, b]) => b.count - a.count);
    
    if (relatedParts.length > 0) {
      console.log(`\n📋 ${basicPart}関連部品 (${relatedParts.length}種類):`);
      
      relatedParts.slice(0, 15).forEach(([name, data]) => {
        console.log(`  ${name} (${data.count}件) - ${data.examples[0]}`);
      });
      
      if (relatedParts.length > 15) {
        console.log(`  ... 他${relatedParts.length - 15}種類`);
      }
    }
  }
  
  // 統計サマリー
  const totalParts = detailedParts.size;
  const highFreqParts = Array.from(detailedParts.values()).filter(d => d.count >= 5).length;
  
  console.log(`\n📊 調査統計:`);
  console.log(`  発見された詳細部品種類: ${totalParts}種類`);
  console.log(`  高頻度部品(5件以上): ${highFreqParts}種類`);
  console.log(`  詳細度向上の余地: 大きい`);
}

// CSV出力用データ準備
function prepareOutputData(detailedParts) {
  return Array.from(detailedParts.entries()).map(([name, data]) => ({
    name: name,
    name_norm: name,
    basic_part: data.basicPart,
    count: data.count,
    example: data.examples[0] || ''
  })).sort((a, b) => {
    if (a.basic_part !== b.basic_part) {
      return a.basic_part.localeCompare(b.basic_part);
    }
    return b.count - a.count;
  });
}

// メイン処理
async function main() {
  try {
    console.log('詳細部品名実態調査開始...');
    
    // データ読み込み
    const data = await loadAndFilterData();
    
    // 詳細部品名収集
    console.log('詳細部品名抽出中...');
    const detailedParts = collectDetailedPartNames(data);
    
    // 分析レポート
    generateInvestigationReport(detailedParts);
    
    // 結果をCSVで出力（後続処理用）
    const outputData = prepareOutputData(detailedParts);
    
    // 簡易CSV出力
    const csvContent = ['name,name_norm,basic_part,count,example']
      .concat(outputData.map(row => 
        `${row.name},${row.name_norm},${row.basic_part},${row.count},"${row.example}"`
      ))
      .join('\n');
    
    fs.writeFileSync('C:/Windsurf/bankincafe/マスタ作成用/detailed_parts_investigation.csv', csvContent, 'utf8');
    
    console.log('\n📁 詳細調査結果: detailed_parts_investigation.csv に出力');
    console.log('詳細部品名実態調査完了！');
    
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