// 現在の辞書データの件数を詳細に確認するスクリプト
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://auwmmosfteomieyexkeh.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1d21tb3NmdGVvbWlleWV4a2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzcxNTYsImV4cCI6MjA3MTAxMzE1Nn0.9SsGplOy1PQak1y7WLfzadvTOfm4NuuX8254lEctvj0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCurrentDataCount() {
  console.log('=== 現在の辞書データ件数確認 ===\n');
  
  try {
    // 各テーブルの全件数を取得
    console.log('📊 各テーブルの詳細データ:\n');
    
    // targets テーブル
    const { data: targetsData, error: targetsError } = await supabase
      .from('targets')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
      
    if (targetsError) {
      console.log('❌ targets テーブルエラー:', targetsError.message);
    } else {
      console.log(`✅ targets: ${targetsData?.length || 0} 件`);
      targetsData?.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.name} (ID: ${item.id})`);
      });
    }
    
    console.log('');
    
    // actions テーブル
    const { data: actionsData, error: actionsError } = await supabase
      .from('actions')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
      
    if (actionsError) {
      console.log('❌ actions テーブルエラー:', actionsError.message);
    } else {
      console.log(`✅ actions: ${actionsData?.length || 0} 件`);
      actionsData?.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.name} (ID: ${item.id})`);
      });
    }
    
    console.log('');
    
    // positions テーブル
    const { data: positionsData, error: positionsError } = await supabase
      .from('positions')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
      
    if (positionsError) {
      console.log('❌ positions テーブルエラー:', positionsError.message);
    } else {
      console.log(`✅ positions: ${positionsData?.length || 0} 件`);
      positionsData?.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.name} (ID: ${item.id})`);
      });
    }
    
    console.log('');
    
    // target_actions 関連テーブル
    const { data: targetActionsData, error: targetActionsError } = await supabase
      .from('target_actions')
      .select(`
        id,
        target_id,
        action_id,
        targets(name),
        actions(name)
      `);
      
    if (targetActionsError) {
      console.log('❌ target_actions テーブルエラー:', targetActionsError.message);
    } else {
      console.log(`✅ target_actions: ${targetActionsData?.length || 0} 件`);
      targetActionsData?.forEach((item, index) => {
        const targetName = item.targets?.name || 'Unknown';
        const actionName = item.actions?.name || 'Unknown';
        console.log(`   ${index + 1}. ${targetName} → ${actionName}`);
      });
    }
    
    console.log('');
    
    // action_positions 関連テーブル
    const { data: actionPositionsData, error: actionPositionsError } = await supabase
      .from('action_positions')
      .select(`
        id,
        action_id,
        position_id,
        actions(name),
        positions(name)
      `);
      
    if (actionPositionsError) {
      console.log('❌ action_positions テーブルエラー:', actionPositionsError.message);
    } else {
      console.log(`✅ action_positions: ${actionPositionsData?.length || 0} 件`);
      actionPositionsData?.forEach((item, index) => {
        const actionName = item.actions?.name || 'Unknown';
        const positionName = item.positions?.name || 'Unknown';
        console.log(`   ${index + 1}. ${actionName} → ${positionName}`);
      });
    }
    
    console.log('\n=== データ量分析 ===');
    console.log(`対象項目: ${targetsData?.length || 0} 種類`);
    console.log(`動作項目: ${actionsData?.length || 0} 種類`);
    console.log(`位置項目: ${positionsData?.length || 0} 種類`);
    console.log(`対象→動作関連: ${targetActionsData?.length || 0} 組み合わせ`);
    console.log(`動作→位置関連: ${actionPositionsData?.length || 0} 組み合わせ`);
    
    const totalCombinations = (targetsData?.length || 0) * (actionsData?.length || 0);
    const actualTargetActions = targetActionsData?.length || 0;
    const coverage = totalCombinations > 0 ? (actualTargetActions / totalCombinations * 100).toFixed(1) : 0;
    
    console.log(`\n📈 辞書の充実度:`);
    console.log(`可能な対象→動作組み合わせ: ${totalCombinations} 通り`);
    console.log(`実際の関連設定: ${actualTargetActions} 通り`);
    console.log(`カバー率: ${coverage}%`);
    
    if (coverage < 50) {
      console.log('⚠️ 関連設定が不足しています。辞書データの充実が必要です。');
    } else {
      console.log('✅ 関連設定は適度に充実しています。');
    }

  } catch (error) {
    console.error('データ件数確認エラー:', error);
    throw error;
  }
}

if (require.main === module) {
  checkCurrentDataCount();
}

module.exports = { checkCurrentDataCount };