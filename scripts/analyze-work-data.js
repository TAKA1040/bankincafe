// 過去の作業データから関連設定を分析・生成するスクリプト
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://auwmmosfteomieyexkeh.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1d21tb3NmdGVvbWlleWV4a2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzcxNTYsImV4cCI6MjA3MTAxMzE1Nn0.9SsGplOy1PQak1y7WLfzadvTOfm4NuuX8254lEctvj0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeWorkData() {
  console.log('過去の作業データを分析中...');
  
  try {
    // まずテーブル一覧を確認
    console.log('利用可能なテーブルを確認中...');
    const tables = ['work_history', 'work_dictionary', 'work_entries', 'invoices'];
    
    for (const table of tables) {
      console.log(`\n=== ${table} テーブル ===`);
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(5);
        
        if (error) {
          console.log(`${table}: エラー -`, error.message);
        } else {
          console.log(`${table}: ${data?.length || 0} 件のデータ`);
          if (data && data.length > 0) {
            console.log('サンプルデータ:', JSON.stringify(data[0], null, 2));
          }
        }
      } catch (err) {
        console.log(`${table}: 例外エラー -`, err.message);
      }
    }
    
    // work_historyから全データを取得
    console.log('\nwork_historyテーブルからデータを取得中...');
    const { data: workHistory, error } = await supabase
      .from('work_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10000);
    
    if (error) {
      console.error('データ取得エラー:', error);
      return;
    }
    
    console.log(`取得したデータ件数: ${workHistory.length}`);
    
    // 対象・動作・位置の組み合わせを分析
    const targetActionMap = new Map();
    const actionPositionMap = new Map();
    const targetActionPriceMap = new Map();
    const allTargets = new Set();
    const allActions = new Set();
    const allPositions = new Set();
    
    workHistory.forEach((work, index) => {
      if (index % 1000 === 0) {
        console.log(`処理中: ${index}/${workHistory.length}`);
      }
      
      const target = work.target?.trim();
      const action = work.action?.trim();
      const position = work.position?.trim();
      const price = work.unit_price || 0;
      
      if (target) allTargets.add(target);
      if (action) allActions.add(action);
      if (position) allPositions.add(position);
      
      // 対象→動作のマッピング
      if (target && action) {
        if (!targetActionMap.has(target)) {
          targetActionMap.set(target, new Set());
        }
        targetActionMap.get(target).add(action);
      }
      
      // 動作→位置のマッピング
      if (action && position) {
        if (!actionPositionMap.has(action)) {
          actionPositionMap.set(action, new Set());
        }
        actionPositionMap.get(action).add(position);
      }
      
      // 対象_動作→価格のマッピング
      if (target && action && price > 0) {
        const key = `${target}_${action}`;
        if (!targetActionPriceMap.has(key)) {
          targetActionPriceMap.set(key, []);
        }
        targetActionPriceMap.get(key).push(price);
      }
    });
    
    console.log('\n=== 分析結果 ===');
    console.log(`対象数: ${allTargets.size}`);
    console.log(`動作数: ${allActions.size}`);
    console.log(`位置数: ${allPositions.size}`);
    console.log(`対象→動作の組み合わせ数: ${targetActionMap.size}`);
    console.log(`動作→位置の組み合わせ数: ${actionPositionMap.size}`);
    console.log(`価格データ数: ${targetActionPriceMap.size}`);
    
    return {
      allTargets: Array.from(allTargets).sort(),
      allActions: Array.from(allActions).sort(),
      allPositions: Array.from(allPositions).sort(),
      targetActionMap: Object.fromEntries(
        Array.from(targetActionMap.entries()).map(([key, value]) => [key, Array.from(value).sort()])
      ),
      actionPositionMap: Object.fromEntries(
        Array.from(actionPositionMap.entries()).map(([key, value]) => [key, Array.from(value).sort()])
      ),
      targetActionPriceMap: Object.fromEntries(
        Array.from(targetActionPriceMap.entries()).map(([key, prices]) => [
          key, 
          Math.round(prices.reduce((sum, p) => sum + p, 0) / prices.length) // 平均価格
        ])
      )
    };
    
  } catch (error) {
    console.error('分析エラー:', error);
  }
}

// 分析結果をJSONファイルに出力
async function main() {
  const analysisResult = await analyzeWorkData();
  
  if (analysisResult) {
    const fs = require('fs');
    const path = require('path');
    
    // 結果を分割して保存
    fs.writeFileSync(
      path.join(__dirname, 'work-analysis-targets.json'), 
      JSON.stringify(analysisResult.allTargets, null, 2)
    );
    
    fs.writeFileSync(
      path.join(__dirname, 'work-analysis-actions.json'), 
      JSON.stringify(analysisResult.allActions, null, 2)
    );
    
    fs.writeFileSync(
      path.join(__dirname, 'work-analysis-positions.json'), 
      JSON.stringify(analysisResult.allPositions, null, 2)
    );
    
    fs.writeFileSync(
      path.join(__dirname, 'work-analysis-target-actions.json'), 
      JSON.stringify(analysisResult.targetActionMap, null, 2)
    );
    
    fs.writeFileSync(
      path.join(__dirname, 'work-analysis-action-positions.json'), 
      JSON.stringify(analysisResult.actionPositionMap, null, 2)
    );
    
    fs.writeFileSync(
      path.join(__dirname, 'work-analysis-prices.json'), 
      JSON.stringify(analysisResult.targetActionPriceMap, null, 2)
    );
    
    console.log('\n分析結果を保存しました:');
    console.log('- work-analysis-targets.json');
    console.log('- work-analysis-actions.json');
    console.log('- work-analysis-positions.json');
    console.log('- work-analysis-target-actions.json');
    console.log('- work-analysis-action-positions.json');
    console.log('- work-analysis-prices.json');
  }
}

if (require.main === module) {
  main();
}

module.exports = { analyzeWorkData };