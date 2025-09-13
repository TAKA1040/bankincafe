/**
 * 対象物マスターを種類別にカテゴライズ・並び替え
 * 自動車部品として論理的な順序で整理
 */

const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// 入力・出力ファイル
const INPUT_CSV = 'C:/Windsurf/bankincafe/マスタ作成用/マスタ候補/master_target4_validated.csv';
const OUTPUT_FILE = 'C:/Windsurf/bankincafe/マスタ作成用/マスタ候補/master_target4_categorized.csv';

// 自動車部品カテゴリ定義（表示順序も考慮）
const PART_CATEGORIES = {
  // 1. エンジン関連
  engine: {
    priority: 1,
    name: 'エンジン系',
    patterns: [
      'エンジン', 'オイル', 'プラグ', 'フィルター', 'エアクリーナー', 'インテーク',
      'エキゾースト', 'マフラー', 'ターボ', 'インジェクター', 'キャブレター',
      'ピストン', 'シリンダー', 'ヘッド', 'バルブ', 'カム', 'クランク', 'コンロッド',
      'タイミング', 'ベルト', 'チェーン', 'ウォーターポンプ', 'サーモスタット',
      'ラジエーター', 'クーラント', 'オルタネーター', 'スターター', 'イグニッション'
    ]
  },
  
  // 2. 動力伝達系
  drivetrain: {
    priority: 2,
    name: '動力伝達系',
    patterns: [
      'クラッチ', 'トランスミッション', 'ギア', 'シフト', 'デファレンシャル', 'デフ',
      'プロペラシャフト', 'ドライブシャフト', 'ジョイント', 'ユニバーサル', 'CV',
      'フライホイール', 'クラッチディスク', 'プレッシャープレート', 'レリーズ'
    ]
  },
  
  // 3. 足回り・サスペンション
  suspension: {
    priority: 3,
    name: '足回り・サスペンション',
    patterns: [
      'サスペンション', 'ショック', 'アブソーバー', 'ストラット', 'スプリング',
      'スタビライザー', 'アーム', 'ロッド', 'ブッシュ', 'ボールジョイント',
      'タイロッド', 'ラックエンド', 'ナックル', 'ハブ', 'ベアリング',
      'タイヤ', 'ホイール', 'リム'
    ]
  },
  
  // 4. ブレーキ系
  brake: {
    priority: 4,
    name: 'ブレーキ系',
    patterns: [
      'ブレーキ', 'パッド', 'ローター', 'ディスク', 'ドラム', 'シュー',
      'キャリパー', 'マスターシリンダー', 'ブースター', 'ホース', 'パイプ',
      'フルード', 'ABS', 'パーキング', 'サイド'
    ]
  },
  
  // 5. ステアリング系
  steering: {
    priority: 5,
    name: 'ステアリング系',
    patterns: [
      'ステアリング', 'ハンドル', 'コラム', 'ラック', 'ピニオン', 'ギアボックス',
      'パワステ', 'ポンプ', 'ベルト', 'プーリー'
    ]
  },
  
  // 6. 外装・ボディ
  exterior: {
    priority: 6,
    name: '外装・ボディ',
    patterns: [
      'ボンネット', 'フード', 'フェンダー', 'バンパー', 'ドア', 'ハッチ',
      'トランク', 'ルーフ', 'ピラー', 'サイドパネル', 'クォーター',
      'グリル', 'モール', 'エンブレム', 'ガーニッシュ'
    ]
  },
  
  // 7. 灯火・電装
  electrical: {
    priority: 7,
    name: '灯火・電装系',
    patterns: [
      'ライト', 'ランプ', 'バルブ', 'LED', 'ヘッドライト', 'テールライト',
      'ウィンカー', 'ハザード', 'フォグ', 'レンズ', 'リフレクター', '反射板',
      'バッテリー', 'ハーネス', 'コネクター', 'ヒューズ', 'リレー',
      'センサー', 'スイッチ', 'メーター', 'ECU', 'コンピューター'
    ]
  },
  
  // 8. 内装・装備
  interior: {
    priority: 8,
    name: '内装・装備',
    patterns: [
      'シート', 'ベンチ', 'バックレスト', 'ヘッドレスト', 'クッション',
      'ミラー', 'バックミラー', 'サイドミラー', 'ドアミラー',
      'ダッシュボード', 'インパネ', 'コンソール', 'グローブボックス',
      'カーペット', 'フロアマット', 'トリム', 'パネル'
    ]
  },
  
  // 9. 空調・快適装備
  hvac: {
    priority: 9,
    name: '空調・快適装備',
    patterns: [
      'エアコン', 'クーラー', 'ヒーター', 'コンデンサー', 'エバポレーター',
      'コンプレッサー', 'レシーバー', 'エキスパンション', 'ブロワー',
      'ダクト', 'ベント', 'ルーバー'
    ]
  },
  
  // 10. ワイパー・洗浄
  wiper: {
    priority: 10,
    name: 'ワイパー・洗浄',
    patterns: [
      'ワイパー', 'ブレード', 'アーム', 'モーター', 'ウォッシャー',
      'タンク', 'ポンプ', 'ノズル', 'ホース'
    ]
  },
  
  // 11. シール・ゴム類
  sealing: {
    priority: 11,
    name: 'シール・ゴム類',
    patterns: [
      'ゴム', 'シール', 'ガスケット', 'パッキン', 'ストリップ', 'ウェザー',
      'オイルシール', 'Oリング'
    ]
  },
  
  // 12. ファスナー・取付部品
  fastener: {
    priority: 12,
    name: 'ファスナー・取付部品',
    patterns: [
      'ボルト', 'ナット', 'ワッシャー', 'ピン', 'クリップ', 'リベット',
      'スクリュー', 'ビス', 'スタッド', 'ブラケット', 'ステー', 'マウント',
      'サポート', 'ホルダー'
    ]
  },
  
  // 13. カバー・プロテクター
  protection: {
    priority: 13,
    name: 'カバー・プロテクター',
    patterns: [
      'カバー', 'プロテクター', 'ガード', 'シールド', 'スプラッシュ',
      'アンダーカバー', 'エンジンカバー', 'フェンダーライナー'
    ]
  },
  
  // 14. 配管・ホース
  piping: {
    priority: 14,
    name: '配管・ホース類',
    patterns: [
      'ホース', 'パイプ', 'チューブ', 'ダクト', 'フィッティング',
      'エルボ', 'ジョイント', 'カプラー', 'バンド', 'クランプ'
    ]
  },
  
  // 15. その他
  other: {
    priority: 99,
    name: 'その他',
    patterns: []
  }
};

// データ読み込み
async function loadValidatedData() {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(INPUT_CSV)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        console.log(`検証済みデータ読み込み: ${results.length}件`);
        resolve(results);
      })
      .on('error', reject);
  });
}

// 部品をカテゴリに分類
function categorizePartName(partName) {
  const name = partName.toLowerCase();
  
  for (const [categoryId, category] of Object.entries(PART_CATEGORIES)) {
    if (categoryId === 'other') continue;
    
    for (const pattern of category.patterns) {
      if (partName.includes(pattern)) {
        return {
          category: categoryId,
          categoryName: category.name,
          priority: category.priority
        };
      }
    }
  }
  
  return {
    category: 'other',
    categoryName: PART_CATEGORIES.other.name,
    priority: PART_CATEGORIES.other.priority
  };
}

// カテゴライズメイン処理
async function main() {
  try {
    console.log('対象物マスターのカテゴライズ開始...');
    
    // 検証済みデータ読み込み
    const validatedData = await loadValidatedData();
    
    // カテゴライズ実行
    const categorizedData = validatedData.map(item => {
      const category = categorizePartName(item.name_norm);
      return {
        ...item,
        category: category.category,
        category_name: category.categoryName,
        category_priority: category.priority
      };
    });
    
    // カテゴリ別・カウント順でソート
    categorizedData.sort((a, b) => {
      // 1. カテゴリ優先度順
      if (a.category_priority !== b.category_priority) {
        return a.category_priority - b.category_priority;
      }
      // 2. アクティブ項目を先に
      if (a.is_active !== b.is_active) {
        return (a.is_active === 'true' ? 0 : 1) - (b.is_active === 'true' ? 0 : 1);
      }
      // 3. カウント順
      const countA = parseInt(a.count) || 0;
      const countB = parseInt(b.count) || 0;
      if (countA !== countB) {
        return countB - countA;
      }
      // 4. 名前順
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
        { id: 'example', title: 'example' },
        { id: 'category', title: 'category' },
        { id: 'category_name', title: 'category_name' }
      ]
    });
    
    await csvWriter.writeRecords(categorizedData);
    
    // カテゴライズレポート
    console.log(`\n=== カテゴライズ済み対象物マスター完成 ===`);
    console.log(`出力ファイル: ${OUTPUT_FILE}`);
    console.log(`総項目数: ${categorizedData.length}件`);
    console.log(`アクティブ項目: ${categorizedData.filter(x => x.is_active === 'true').length}件`);
    
    // カテゴリ統計
    const categoryStats = {};
    categorizedData.forEach(item => {
      const categoryName = item.category_name;
      if (!categoryStats[categoryName]) {
        categoryStats[categoryName] = { total: 0, active: 0 };
      }
      categoryStats[categoryName].total++;
      if (item.is_active === 'true') {
        categoryStats[categoryName].active++;
      }
    });
    
    console.log('\n📊 カテゴリ別統計:');
    Object.entries(categoryStats)
      .sort(([,a], [,b]) => b.active - a.active)
      .forEach(([categoryName, stats]) => {
        console.log(`  ${categoryName}: ${stats.active}/${stats.total}件 (アクティブ/全体)`);
      });
    
    // カテゴリ別サンプル表示
    console.log('\n🎯 カテゴリ別主要項目:');
    
    for (const [categoryId, category] of Object.entries(PART_CATEGORIES)) {
      if (categoryId === 'other') continue;
      
      const categoryItems = categorizedData.filter(item => 
        item.category === categoryId && item.is_active === 'true'
      );
      
      if (categoryItems.length > 0) {
        console.log(`\n【${category.name}】`);
        categoryItems.slice(0, 5).forEach(item => {
          console.log(`  ${item.name_norm} (${item.count}件)`);
        });
        if (categoryItems.length > 5) {
          console.log(`  ... 他${categoryItems.length - 5}件`);
        }
      }
    }
    
    // その他カテゴリも表示
    const otherItems = categorizedData.filter(item => 
      item.category === 'other' && item.is_active === 'true'
    );
    if (otherItems.length > 0) {
      console.log(`\n【その他】`);
      otherItems.slice(0, 10).forEach(item => {
        console.log(`  ${item.name_norm} (${item.count}件)`);
      });
    }
    
    console.log('\n✅ 種類別に整理された対象物マスターが完成しました！');
    
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