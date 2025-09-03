// 関連性生成スクリプト実行
const fs = require('fs');
const path = require('path');

// relationship-generator.jsが存在するかチェック
const generatorPath = './relationship-generator.js';

if (!fs.existsSync(generatorPath)) {
  console.log('relationship-generator.js が見つかりません。作成します...');
  
  // relationship-generator.jsの内容を再作成
  const generatorCode = `// work_historyとwork_setsからtarget_actions、action_positionsの関連性を生成
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://auwmmosfteomieyexkeh.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1d21tb3NmdGVvbWlleWV4a2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzcxNTYsImV4cCI6MjA3MTAxMzE1Nn0.9SsGplOy1PQak1y7WLfzadvTOfm4NuuX8254lEctvj0';
const supabase = createClient(supabaseUrl, supabaseKey);

class RelationshipGenerator {
  constructor() {
    this.stats = {
      targetActions: {
        existing: 0,
        new: 0
      },
      actionPositions: {
        existing: 0,
        new: 0
      }
    };
  }

  // work_historyから対象→動作の関連性を生成
  async generateTargetActionsFromHistory() {
    console.log('work_historyから対象→動作の関連性を生成中...');
    
    // 既存の関連性を取得
    const { data: existingRelations, error: existingError } = await supabase
      .from('target_actions')
      .select('target_id, action_id');
    
    if (existingError) throw existingError;
    
    const existingSet = new Set(
      existingRelations.map(r => \`\${r.target_id}-\${r.action_id}\`)
    );
    this.stats.targetActions.existing = existingRelations.length;
    
    // work_historyから新しい関連性を抽出
    const { data: workHistory, error: historyError } = await supabase
      .from('work_history')
      .select('target_id, action_id')
      .not('target_id', 'is', null)
      .not('action_id', 'is', null);
    
    if (historyError) throw historyError;
    
    // 新しい関連性を特定
    const newRelations = [];
    const seenRelations = new Set();
    
    workHistory.forEach(record => {
      const key = \`\${record.target_id}-\${record.action_id}\`;
      if (!existingSet.has(key) && !seenRelations.has(key)) {
        newRelations.push({
          target_id: record.target_id,
          action_id: record.action_id
        });
        seenRelations.add(key);
      }
    });
    
    console.log(\`新しい対象→動作関連性: \${newRelations.length} 件\`);
    
    // バッチインサート
    if (newRelations.length > 0) {
      const { error: insertError } = await supabase
        .from('target_actions')
        .insert(newRelations);
      
      if (insertError) throw insertError;
      this.stats.targetActions.new = newRelations.length;
      
      console.log(\`✅ \${newRelations.length} 件の対象→動作関連性を追加しました\`);
    } else {
      console.log('新しい対象→動作関連性はありませんでした');
    }
  }

  // work_historyから動作→位置の関連性を生成
  async generateActionPositionsFromHistory() {
    console.log('work_historyから動作→位置の関連性を生成中...');
    
    // 既存の関連性を取得
    const { data: existingRelations, error: existingError } = await supabase
      .from('action_positions')
      .select('action_id, position_id');
    
    if (existingError) throw existingError;
    
    const existingSet = new Set(
      existingRelations.map(r => \`\${r.action_id}-\${r.position_id}\`)
    );
    this.stats.actionPositions.existing = existingRelations.length;
    
    // work_historyから新しい関連性を抽出
    const { data: workHistory, error: historyError } = await supabase
      .from('work_history')
      .select('action_id, position_id')
      .not('action_id', 'is', null)
      .not('position_id', 'is', null);
    
    if (historyError) throw historyError;
    
    // 新しい関連性を特定
    const newRelations = [];
    const seenRelations = new Set();
    
    workHistory.forEach(record => {
      const key = \`\${record.action_id}-\${record.position_id}\`;
      if (!existingSet.has(key) && !seenRelations.has(key)) {
        newRelations.push({
          action_id: record.action_id,
          position_id: record.position_id
        });
        seenRelations.add(key);
      }
    });
    
    console.log(\`新しい動作→位置関連性: \${newRelations.length} 件\`);
    
    // バッチインサート
    if (newRelations.length > 0) {
      const { error: insertError } = await supabase
        .from('action_positions')
        .insert(newRelations);
      
      if (insertError) throw insertError;
      this.stats.actionPositions.new = newRelations.length;
      
      console.log(\`✅ \${newRelations.length} 件の動作→位置関連性を追加しました\`);
    } else {
      console.log('新しい動作→位置関連性はありませんでした');
    }
  }

  // work_set_detailsから関連性を生成
  async generateFromWorkSetDetails() {
    console.log('work_set_detailsから関連性を生成中...');
    
    // 対象→動作の関連性
    await this.generateTargetActionsFromSetDetails();
    
    // 動作→位置の関連性
    await this.generateActionPositionsFromSetDetails();
  }

  async generateTargetActionsFromSetDetails() {
    // 既存の関連性を取得
    const { data: existingRelations, error: existingError } = await supabase
      .from('target_actions')
      .select('target_id, action_id');
    
    if (existingError) throw existingError;
    
    const existingSet = new Set(
      existingRelations.map(r => \`\${r.target_id}-\${r.action_id}\`)
    );
    
    // work_set_detailsから新しい関連性を抽出
    const { data: setDetails, error: detailsError } = await supabase
      .from('work_set_details')
      .select('target_id, action_id')
      .not('target_id', 'is', null)
      .not('action_id', 'is', null);
    
    if (detailsError) throw detailsError;
    
    // 新しい関連性を特定
    const newRelations = [];
    const seenRelations = new Set();
    
    setDetails.forEach(record => {
      const key = \`\${record.target_id}-\${record.action_id}\`;
      if (!existingSet.has(key) && !seenRelations.has(key)) {
        newRelations.push({
          target_id: record.target_id,
          action_id: record.action_id
        });
        seenRelations.add(key);
      }
    });
    
    // バッチインサート
    if (newRelations.length > 0) {
      const { error: insertError } = await supabase
        .from('target_actions')
        .insert(newRelations);
      
      if (insertError) throw insertError;
      this.stats.targetActions.new += newRelations.length;
      
      console.log(\`✅ セット詳細から \${newRelations.length} 件の対象→動作関連性を追加\`);
    }
  }

  async generateActionPositionsFromSetDetails() {
    // 既存の関連性を取得
    const { data: existingRelations, error: existingError } = await supabase
      .from('action_positions')
      .select('action_id, position_id');
    
    if (existingError) throw existingError;
    
    const existingSet = new Set(
      existingRelations.map(r => \`\${r.action_id}-\${r.position_id}\`)
    );
    
    // work_set_detailsから新しい関連性を抽出
    const { data: setDetails, error: detailsError } = await supabase
      .from('work_set_details')
      .select('action_id, position_id')
      .not('action_id', 'is', null)
      .not('position_id', 'is', null);
    
    if (detailsError) throw detailsError;
    
    // 新しい関連性を特定
    const newRelations = [];
    const seenRelations = new Set();
    
    setDetails.forEach(record => {
      const key = \`\${record.action_id}-\${record.position_id}\`;
      if (!existingSet.has(key) && !seenRelations.has(key)) {
        newRelations.push({
          action_id: record.action_id,
          position_id: record.position_id
        });
        seenRelations.add(key);
      }
    });
    
    // バッチインサート
    if (newRelations.length > 0) {
      const { error: insertError } = await supabase
        .from('action_positions')
        .insert(newRelations);
      
      if (insertError) throw insertError;
      this.stats.actionPositions.new += newRelations.length;
      
      console.log(\`✅ セット詳細から \${newRelations.length} 件の動作→位置関連性を追加\`);
    }
  }

  // メイン実行
  async generateAllRelationships() {
    console.log('=== 関連性生成開始 ===\\n');
    
    try {
      await this.generateTargetActionsFromHistory();
      await this.generateActionPositionsFromHistory();
      await this.generateFromWorkSetDetails();
      
      console.log('\\n=== 関連性生成完了 ===');
      console.log(\`対象→動作: 既存 \${this.stats.targetActions.existing} + 新規 \${this.stats.targetActions.new} = 計 \${this.stats.targetActions.existing + this.stats.targetActions.new} 件\`);
      console.log(\`動作→位置: 既存 \${this.stats.actionPositions.existing} + 新規 \${this.stats.actionPositions.new} = 計 \${this.stats.actionPositions.existing + this.stats.actionPositions.new} 件\`);
      
      return this.stats;
      
    } catch (error) {
      console.error('関連性生成エラー:', error);
      throw error;
    }
  }
}

// スクリプト直接実行時
if (require.main === module) {
  const generator = new RelationshipGenerator();
  generator.generateAllRelationships().catch(console.error);
}

module.exports = { RelationshipGenerator };`;
  
  fs.writeFileSync(generatorPath, generatorCode);
  console.log('✅ relationship-generator.js を作成しました');
}

// 関連性生成を実行
console.log('=== 関連性生成実行 ===');
const { RelationshipGenerator } = require(generatorPath);

async function runGeneration() {
  const generator = new RelationshipGenerator();
  const results = await generator.generateAllRelationships();
  
  console.log('\n=== 最終統計 ===');
  console.log('新規追加された関連性:');
  console.log(`- 対象→動作: ${results.targetActions.new} 件`);
  console.log(`- 動作→位置: ${results.actionPositions.new} 件`);
  
  return results;
}

if (require.main === module) {
  runGeneration().catch(console.error);
}

module.exports = { runGeneration };