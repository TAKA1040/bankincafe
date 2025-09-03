// 分解済みデータから関連設定を自動生成するクラス
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://auwmmosfteomieyexkeh.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1d21tb3NmdGVvbWlleWV4a2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzcxNTYsImV4cCI6MjA3MTAxMzE1Nn0.9SsGplOy1PQak1y7WLfzadvTOfm4NuuX8254lEctvj0';
const supabase = createClient(supabaseUrl, supabaseKey);

class RelationshipGenerator {
  constructor() {
    this.targetIdMap = new Map();
    this.actionIdMap = new Map();
    this.positionIdMap = new Map();
    this.existingTargetActions = new Set();
    this.existingActionPositions = new Set();
    this.stats = {
      newTargetActions: 0,
      newActionPositions: 0,
      skippedTargetActions: 0,
      skippedActionPositions: 0,
      totalCombinations: 0
    };
  }

  // 既存データとIDマップを読み込み
  async loadExistingData() {
    console.log('既存データとIDマップを読み込み中...');
    
    try {
      const [
        targetsRes,
        actionsRes, 
        positionsRes,
        targetActionsRes,
        actionPositionsRes
      ] = await Promise.all([
        supabase.from('targets').select('id, name').eq('is_active', true),
        supabase.from('actions').select('id, name').eq('is_active', true),
        supabase.from('positions').select('id, name').eq('is_active', true),
        supabase.from('target_actions').select('target_id, action_id'),
        supabase.from('action_positions').select('action_id, position_id')
      ]);

      if (targetsRes.error) throw targetsRes.error;
      if (actionsRes.error) throw actionsRes.error;
      if (positionsRes.error) throw positionsRes.error;
      if (targetActionsRes.error) throw targetActionsRes.error;
      if (actionPositionsRes.error) throw actionPositionsRes.error;

      // IDマップ作成
      targetsRes.data.forEach(item => {
        this.targetIdMap.set(item.name, item.id);
      });
      
      actionsRes.data.forEach(item => {
        this.actionIdMap.set(item.name, item.id);
      });
      
      positionsRes.data.forEach(item => {
        this.positionIdMap.set(item.name, item.id);
      });

      // 既存関連設定をSet化
      targetActionsRes.data.forEach(item => {
        this.existingTargetActions.add(`${item.target_id}_${item.action_id}`);
      });
      
      actionPositionsRes.data.forEach(item => {
        this.existingActionPositions.add(`${item.action_id}_${item.position_id}`);
      });

      console.log(`既存データ読み込み完了:`);
      console.log(`- 対象: ${this.targetIdMap.size} 件`);
      console.log(`- 動作: ${this.actionIdMap.size} 件`);
      console.log(`- 位置: ${this.positionIdMap.size} 件`);
      console.log(`- 既存target_actions: ${this.existingTargetActions.size} 件`);
      console.log(`- 既存action_positions: ${this.existingActionPositions.size} 件`);

    } catch (error) {
      console.error('既存データ読み込みエラー:', error);
      throw error;
    }
  }

  // work_historyから実際の組み合わせを抽出して関連設定を生成
  async generateFromWorkHistory() {
    console.log('\n=== work_historyから関連設定を生成 ===');
    
    try {
      // work_historyから全データを取得
      const { data: workHistory, error } = await supabase
        .from('work_history')
        .select(`
          target_id,
          action_id,
          position_id,
          targets(name),
          actions(name),
          positions(name)
        `);

      if (error) throw error;
      
      console.log(`work_history データ: ${workHistory?.length || 0} 件`);

      const newTargetActions = [];
      const newActionPositions = [];
      const targetActionCombinations = new Set();
      const actionPositionCombinations = new Set();

      // work_historyデータから組み合わせを抽出
      workHistory?.forEach(item => {
        const targetId = item.target_id;
        const actionId = item.action_id;
        const positionId = item.position_id;

        // target_action組み合わせ
        if (targetId && actionId) {
          const key = `${targetId}_${actionId}`;
          if (!this.existingTargetActions.has(key) && !targetActionCombinations.has(key)) {
            newTargetActions.push({ target_id: targetId, action_id: actionId });
            targetActionCombinations.add(key);
            console.log(`新しい組み合わせ: ${item.targets?.name} → ${item.actions?.name}`);
          }
        }

        // action_position組み合わせ
        if (actionId && positionId) {
          const key = `${actionId}_${positionId}`;
          if (!this.existingActionPositions.has(key) && !actionPositionCombinations.has(key)) {
            newActionPositions.push({ action_id: actionId, position_id: positionId });
            actionPositionCombinations.add(key);
            console.log(`新しい組み合わせ: ${item.actions?.name} → ${item.positions?.name}`);
          }
        }
      });

      console.log(`\n抽出された新しい組み合わせ:`);
      console.log(`- target_actions: ${newTargetActions.length} 件`);
      console.log(`- action_positions: ${newActionPositions.length} 件`);

      return { newTargetActions, newActionPositions };

    } catch (error) {
      console.error('work_history分析エラー:', error);
      throw error;
    }
  }

  // work_set_detailsからも関連設定を生成
  async generateFromWorkSetDetails() {
    console.log('\n=== work_set_detailsから関連設定を生成 ===');
    
    try {
      const { data: setDetails, error } = await supabase
        .from('work_set_details')
        .select(`
          target_id,
          action_id, 
          position_id,
          targets(name),
          actions(name),
          positions(name)
        `);

      if (error) throw error;
      
      console.log(`work_set_details データ: ${setDetails?.length || 0} 件`);

      const newTargetActions = [];
      const newActionPositions = [];
      const targetActionCombinations = new Set();
      const actionPositionCombinations = new Set();

      setDetails?.forEach(item => {
        const targetId = item.target_id;
        const actionId = item.action_id;
        const positionId = item.position_id;

        // target_action組み合わせ
        if (targetId && actionId) {
          const key = `${targetId}_${actionId}`;
          if (!this.existingTargetActions.has(key) && !targetActionCombinations.has(key)) {
            newTargetActions.push({ target_id: targetId, action_id: actionId });
            targetActionCombinations.add(key);
            console.log(`新しい組み合わせ: ${item.targets?.name} → ${item.actions?.name}`);
          }
        }

        // action_position組み合わせ
        if (actionId && positionId) {
          const key = `${actionId}_${positionId}`;
          if (!this.existingActionPositions.has(key) && !actionPositionCombinations.has(key)) {
            newActionPositions.push({ action_id: actionId, position_id: positionId });
            actionPositionCombinations.add(key);
            console.log(`新しい組み合わせ: ${item.actions?.name} → ${item.positions?.name}`);
          }
        }
      });

      console.log(`\n抽出された新しい組み合わせ:`);
      console.log(`- target_actions: ${newTargetActions.length} 件`);
      console.log(`- action_positions: ${newActionPositions.length} 件`);

      return { newTargetActions, newActionPositions };

    } catch (error) {
      console.error('work_set_details分析エラー:', error);
      throw error;
    }
  }

  // 関連設定をデータベースに登録
  async insertRelationships(targetActions, actionPositions) {
    console.log('\n=== 関連設定をデータベースに登録 ===');
    
    let insertedTargetActions = 0;
    let insertedActionPositions = 0;
    
    try {
      // target_actionsを登録
      if (targetActions.length > 0) {
        console.log(`target_actions を ${targetActions.length} 件登録中...`);
        
        // バッチで挿入（重複を避けるため個別に挿入）
        for (const item of targetActions) {
          try {
            const { error } = await supabase
              .from('target_actions')
              .insert(item);
            
            if (error) {
              if (error.code === '23505') {
                // 重複エラーは無視
                console.log(`  スキップ: 重複 target_id=${item.target_id}, action_id=${item.action_id}`);
                this.stats.skippedTargetActions++;
              } else {
                throw error;
              }
            } else {
              insertedTargetActions++;
            }
          } catch (err) {
            console.error(`target_actions挿入エラー:`, err);
          }
        }
        
        this.stats.newTargetActions = insertedTargetActions;
        console.log(`✅ target_actions: ${insertedTargetActions} 件登録完了`);
      }

      // action_positionsを登録
      if (actionPositions.length > 0) {
        console.log(`action_positions を ${actionPositions.length} 件登録中...`);
        
        for (const item of actionPositions) {
          try {
            const { error } = await supabase
              .from('action_positions')
              .insert(item);
            
            if (error) {
              if (error.code === '23505') {
                // 重複エラーは無視
                console.log(`  スキップ: 重複 action_id=${item.action_id}, position_id=${item.position_id}`);
                this.stats.skippedActionPositions++;
              } else {
                throw error;
              }
            } else {
              insertedActionPositions++;
            }
          } catch (err) {
            console.error(`action_positions挿入エラー:`, err);
          }
        }
        
        this.stats.newActionPositions = insertedActionPositions;
        console.log(`✅ action_positions: ${insertedActionPositions} 件登録完了`);
      }

    } catch (error) {
      console.error('関連設定登録エラー:', error);
      throw error;
    }

    return {
      insertedTargetActions,
      insertedActionPositions
    };
  }

  // 完全な関連設定生成プロセス
  async generateCompleteRelationships() {
    console.log('=== 完全な関連設定生成開始 ===\n');
    
    // 既存データ読み込み
    await this.loadExistingData();
    
    // 各データソースから新しい組み合わせを取得
    const historyRelations = await this.generateFromWorkHistory();
    const setRelations = await this.generateFromWorkSetDetails();
    
    // 組み合わせをマージ（重複除去）
    const allTargetActions = new Map();
    const allActionPositions = new Map();
    
    // work_historyからの組み合わせを追加
    historyRelations.newTargetActions.forEach(item => {
      const key = `${item.target_id}_${item.action_id}`;
      allTargetActions.set(key, item);
    });
    
    historyRelations.newActionPositions.forEach(item => {
      const key = `${item.action_id}_${item.position_id}`;
      allActionPositions.set(key, item);
    });
    
    // work_set_detailsからの組み合わせを追加
    setRelations.newTargetActions.forEach(item => {
      const key = `${item.target_id}_${item.action_id}`;
      allTargetActions.set(key, item);
    });
    
    setRelations.newActionPositions.forEach(item => {
      const key = `${item.action_id}_${item.position_id}`;
      allActionPositions.set(key, item);
    });
    
    console.log(`\n=== マージ後の統計 ===`);
    console.log(`マージ後 target_actions: ${allTargetActions.size} 件`);
    console.log(`マージ後 action_positions: ${allActionPositions.size} 件`);
    
    // データベースに登録
    const results = await this.insertRelationships(
      Array.from(allTargetActions.values()),
      Array.from(allActionPositions.values())
    );

    // 最終統計を計算
    const currentCoverage = await this.calculateCoverage();
    
    console.log(`\n=== 関連設定生成完了 ===`);
    console.log(`新規追加 target_actions: ${results.insertedTargetActions} 件`);
    console.log(`新規追加 action_positions: ${results.insertedActionPositions} 件`);
    console.log(`現在のカバー率: ${currentCoverage.coverageRate}%`);
    console.log(`総組み合わせ数: ${currentCoverage.totalPossible} 通り`);
    console.log(`実際の関連数: ${currentCoverage.actualRelations} 通り`);
    
    return {
      results,
      coverage: currentCoverage,
      stats: this.stats
    };
  }

  // 現在のカバー率を計算
  async calculateCoverage() {
    try {
      const [targetActionsRes, totalCountRes] = await Promise.all([
        supabase.from('target_actions').select('*', { count: 'exact' }),
        supabase.rpc('get_total_possible_combinations')
      ]);

      if (targetActionsRes.error) throw targetActionsRes.error;
      
      const actualRelations = targetActionsRes.count || 0;
      const totalPossible = this.targetIdMap.size * this.actionIdMap.size;
      const coverageRate = totalPossible > 0 ? (actualRelations / totalPossible * 100).toFixed(1) : 0;
      
      return {
        actualRelations,
        totalPossible,
        coverageRate
      };
    } catch (error) {
      console.error('カバー率計算エラー:', error);
      return { actualRelations: 0, totalPossible: 0, coverageRate: 0 };
    }
  }

  // 結果をファイルに保存
  saveResults(results, outputDir = './outputs') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const resultFile = path.join(outputDir, `relationship_generation_${timestamp}.json`);
    
    const resultData = {
      timestamp: new Date().toISOString(),
      results,
      stats: this.stats,
      summary: {
        newTargetActionsAdded: results.results.insertedTargetActions,
        newActionPositionsAdded: results.results.insertedActionPositions,
        finalCoverageRate: results.coverage.coverageRate,
        totalPossibleCombinations: results.coverage.totalPossible,
        actualRelations: results.coverage.actualRelations
      }
    };
    
    fs.writeFileSync(resultFile, JSON.stringify(resultData, null, 2));
    console.log(`関連設定生成結果保存: ${resultFile}`);
    return resultFile;
  }
}

// 使用例とテスト
async function testRelationshipGeneration() {
  console.log('=== Relationship Generator テスト ===');
  
  const generator = new RelationshipGenerator();
  
  // 完全な関連設定生成
  const results = await generator.generateCompleteRelationships();
  
  // 結果保存
  generator.saveResults(results);
  
  console.log('\n=== 関連設定生成テスト完了 ===');
  console.log(`最終統計: ${JSON.stringify(results.stats, null, 2)}`);
  
  return results;
}

// スクリプト直接実行時
if (require.main === module) {
  testRelationshipGeneration().catch(console.error);
}

module.exports = { RelationshipGenerator };