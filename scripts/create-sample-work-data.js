// invoicesデータから作業辞書のサンプルデータを作成するスクリプト
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://auwmmosfteomieyexkeh.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1d21tb3NmdGVvbWlleWV4a2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzcxNTYsImV4cCI6MjA3MTAxMzE1Nn0.9SsGplOy1PQak1y7WLfzadvTOfm4NuuX8254lEctvj0';
const supabase = createClient(supabaseUrl, supabaseKey);

// 自動車業界に基づいたサンプル辞書データ
const sampleWorkDictionary = {
  // 対象（部品・箇所）
  targets: [
    'エンジン', 'ミッション', 'デフ', 'プロペラシャフト', 'ドライブシャフト',
    'ブレーキ', 'クラッチ', 'ステアリング', 'サスペンション', 'タイヤ',
    'バッテリー', 'オルタネーター', 'スターター', 'エアコン', 'ラジエーター',
    'ファンベルト', 'タイミングベルト', 'プラグ', 'フィルター', 'オイル',
    'キャビン', 'ドア', 'ウィンドウ', 'シート', 'ダッシュボード',
    'ライト', 'ウィンカー', 'ミラー', 'ワイパー', 'ホーン',
    'フレーム', 'ボディ', '荷台', 'バンパー', 'フェンダー'
  ],

  // 動作
  actions: [
    '点検', '清掃', '交換', '修理', '調整', '脱着', '取付', '取外',
    '補充', '注入', '排出', '測定', '診断', '校正', '研磨',
    '塗装', '溶接', '切断', '穴あけ', '組立', '分解', '締付',
    '緩み確認', '動作確認', 'テスト', '試運転', '検査'
  ],

  // 位置
  positions: [
    '左前', '右前', '左後', '右後', '前方', '後方', '左側', '右側',
    '上部', '下部', '内側', '外側', '中央', '前部', '後部',
    '運転席側', '助手席側', '車両前方', '車両後方', '車体下',
    'エンジンルーム', '運転席', '助手席', '荷台', 'トランク'
  ]
};

async function createSampleData() {
  console.log('サンプル作業辞書データを作成中...');
  
  try {
    // 対象→動作のマッピング
    const targetActionMap = {};
    
    // エンジン関連
    targetActionMap['エンジン'] = ['点検', '清掃', '修理', '調整', '診断', '測定', 'テスト'];
    targetActionMap['オイル'] = ['点検', '交換', '補充', '排出', '測定'];
    targetActionMap['プラグ'] = ['点検', '交換', '清掃', '調整'];
    targetActionMap['フィルター'] = ['点検', '交換', '清掃'];
    targetActionMap['ベルト'] = ['点検', '交換', '調整', '緩み確認'];
    
    // 足回り関連
    targetActionMap['ブレーキ'] = ['点検', '調整', '修理', '交換', '測定', '動作確認'];
    targetActionMap['タイヤ'] = ['点検', '交換', '脱着', '測定', '研磨'];
    targetActionMap['サスペンション'] = ['点検', '修理', '調整', '測定'];
    
    // 電装関連  
    targetActionMap['バッテリー'] = ['点検', '交換', '測定', '充電'];
    targetActionMap['ライト'] = ['点検', '交換', '調整', '清掃'];
    targetActionMap['オルタネーター'] = ['点検', '修理', '交換', '測定', 'テスト'];
    
    // ボディ関連
    targetActionMap['ドア'] = ['点検', '調整', '修理', '脱着', '動作確認'];
    targetActionMap['ウィンドウ'] = ['点検', '清掃', '交換', '修理'];
    targetActionMap['シート'] = ['点検', '清掃', '修理', '調整'];
    
    // 動作→位置のマッピング  
    const actionPositionMap = {};
    
    actionPositionMap['点検'] = ['左前', '右前', '左後', '右後', '上部', '下部', '内側', '外側'];
    actionPositionMap['交換'] = ['左前', '右前', '左後', '右後', '運転席側', '助手席側'];
    actionPositionMap['修理'] = ['左前', '右前', '左後', '右後', '上部', '下部', '内側', '外側'];
    actionPositionMap['調整'] = ['左前', '右前', '左後', '右後', '中央'];
    actionPositionMap['清掃'] = ['内側', '外側', '上部', '下部', '全体'];
    actionPositionMap['脱着'] = ['左前', '右前', '左後', '右後', '運転席側', '助手席側'];
    actionPositionMap['測定'] = ['左前', '右前', '左後', '右後', '中央'];
    
    // 価格データ（対象_動作の組み合わせ）
    const priceMap = {};
    
    // エンジン関連価格
    priceMap['エンジン_点検'] = 3000;
    priceMap['エンジン_修理'] = 15000; 
    priceMap['オイル_点検'] = 1000;
    priceMap['オイル_交換'] = 2500;
    priceMap['プラグ_点検'] = 800;
    priceMap['プラグ_交換'] = 1500;
    priceMap['フィルター_交換'] = 1200;
    
    // 足回り関連価格
    priceMap['ブレーキ_点検'] = 2000;
    priceMap['ブレーキ_修理'] = 8000;
    priceMap['タイヤ_点検'] = 500;
    priceMap['タイヤ_交換'] = 3000;
    priceMap['サスペンション_点検'] = 1500;
    priceMap['サスペンション_修理'] = 12000;
    
    // 電装関連価格
    priceMap['バッテリー_点検'] = 800;
    priceMap['バッテリー_交換'] = 4000;
    priceMap['ライト_点検'] = 500;
    priceMap['ライト_交換'] = 1500;
    priceMap['オルタネーター_修理'] = 18000;
    
    // ボディ関連価格
    priceMap['ドア_調整'] = 2500;
    priceMap['ウィンドウ_修理'] = 5000;
    priceMap['シート_清掃'] = 1500;
    
    console.log('\n=== サンプルデータ統計 ===');
    console.log(`対象数: ${sampleWorkDictionary.targets.length}`);
    console.log(`動作数: ${sampleWorkDictionary.actions.length}`);
    console.log(`位置数: ${sampleWorkDictionary.positions.length}`);
    console.log(`対象→動作の組み合わせ数: ${Object.keys(targetActionMap).length}`);
    console.log(`動作→位置の組み合わせ数: ${Object.keys(actionPositionMap).length}`);
    console.log(`価格データ数: ${Object.keys(priceMap).length}`);
    
    // JSONファイルに保存
    const outputDir = path.join(__dirname);
    
    fs.writeFileSync(
      path.join(outputDir, 'sample-targets.json'), 
      JSON.stringify(sampleWorkDictionary.targets, null, 2)
    );
    
    fs.writeFileSync(
      path.join(outputDir, 'sample-actions.json'), 
      JSON.stringify(sampleWorkDictionary.actions, null, 2)
    );
    
    fs.writeFileSync(
      path.join(outputDir, 'sample-positions.json'), 
      JSON.stringify(sampleWorkDictionary.positions, null, 2)
    );
    
    fs.writeFileSync(
      path.join(outputDir, 'sample-target-actions.json'), 
      JSON.stringify(targetActionMap, null, 2)
    );
    
    fs.writeFileSync(
      path.join(outputDir, 'sample-action-positions.json'), 
      JSON.stringify(actionPositionMap, null, 2)
    );
    
    fs.writeFileSync(
      path.join(outputDir, 'sample-prices.json'), 
      JSON.stringify(priceMap, null, 2)
    );
    
    console.log('\nサンプル辞書データを保存しました:');
    console.log('- sample-targets.json');
    console.log('- sample-actions.json');
    console.log('- sample-positions.json');
    console.log('- sample-target-actions.json');
    console.log('- sample-action-positions.json');
    console.log('- sample-prices.json');
    
    return {
      targets: sampleWorkDictionary.targets,
      actions: sampleWorkDictionary.actions,
      positions: sampleWorkDictionary.positions,
      targetActionMap,
      actionPositionMap,
      priceMap
    };
    
  } catch (error) {
    console.error('サンプルデータ作成エラー:', error);
  }
}

if (require.main === module) {
  createSampleData();
}

module.exports = { createSampleData };