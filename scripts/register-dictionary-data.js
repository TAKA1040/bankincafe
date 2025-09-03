// サンプル辞書データをSupabaseに登録するスクリプト
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://auwmmosfteomieyexkeh.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1d21tb3NmdGVvbWlleWV4a2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzcxNTYsImV4cCI6MjA3MTAxMzE1Nn0.9SsGplOy1PQak1y7WLfzadvTOfm4NuuX8254lEctvj0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function registerDictionaryData() {
  console.log('辞書データをSupabaseに登録中...');
  
  try {
    // サンプルデータファイルを読み込み
    const targets = JSON.parse(fs.readFileSync(path.join(__dirname, 'sample-targets.json')));
    const actions = JSON.parse(fs.readFileSync(path.join(__dirname, 'sample-actions.json')));
    const positions = JSON.parse(fs.readFileSync(path.join(__dirname, 'sample-positions.json')));
    const targetActionMap = JSON.parse(fs.readFileSync(path.join(__dirname, 'sample-target-actions.json')));
    const actionPositionMap = JSON.parse(fs.readFileSync(path.join(__dirname, 'sample-action-positions.json')));
    const priceMap = JSON.parse(fs.readFileSync(path.join(__dirname, 'sample-prices.json')));
    
    console.log('サンプルデータファイルを読み込みました');
    
    // 現在の辞書テーブル構造を確認
    console.log('\n既存辞書テーブルを確認中...');
    const tables = ['dictionary_targets', 'dictionary_actions', 'dictionary_positions', 'work_dictionary_master'];
    
    for (const table of tables) {
      console.log(`\n--- ${table} テーブル ---`);
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(3);
        
        if (error) {
          console.log(`${table}: エラー - ${error.message}`);
          if (error.code === '42P01') {
            console.log(`${table}テーブルが存在しません。作成が必要です。`);
          }
        } else {
          console.log(`${table}: 現在 ${data?.length || 0} 件のデータがあります`);
          if (data && data.length > 0) {
            console.log('サンプルレコード:', JSON.stringify(data[0], null, 2));
          }
        }
      } catch (err) {
        console.log(`${table}: 例外エラー - ${err.message}`);
      }
    }
    
    // targets登録
    console.log('\n対象データを登録中...');
    const targetRecords = targets.map((target, index) => ({
      id: index + 1,
      name: target,
      category: 'general',
      is_active: true,
      sort_order: index + 1
    }));
    
    // actions登録  
    console.log('動作データを登録中...');
    const actionRecords = actions.map((action, index) => ({
      id: index + 1,
      name: action,
      category: 'general',
      is_active: true,
      sort_order: index + 1
    }));
    
    // positions登録
    console.log('位置データを登録中...');
    const positionRecords = positions.map((position, index) => ({
      id: index + 1,
      name: position,
      category: 'general', 
      is_active: true,
      sort_order: index + 1
    }));
    
    console.log('\n=== 登録予定データ統計 ===');
    console.log(`対象レコード: ${targetRecords.length} 件`);
    console.log(`動作レコード: ${actionRecords.length} 件`);
    console.log(`位置レコード: ${positionRecords.length} 件`);
    console.log(`対象→動作マッピング: ${Object.keys(targetActionMap).length} 件`);
    console.log(`動作→位置マッピング: ${Object.keys(actionPositionMap).length} 件`);
    console.log(`価格マッピング: ${Object.keys(priceMap).length} 件`);
    
    // work_dictionary_masterに関係データを登録
    console.log('\n辞書マスターに関係データを登録中...');
    
    // TARGET_ACTIONSマッピングを作成
    const TARGET_ACTIONS = {};
    Object.entries(targetActionMap).forEach(([target, actionList]) => {
      TARGET_ACTIONS[target] = actionList;
    });
    
    // ACTION_POSITIONSマッピングを作成
    const ACTION_POSITIONS = {};
    Object.entries(actionPositionMap).forEach(([action, positionList]) => {
      ACTION_POSITIONS[action] = positionList;
    });
    
    // PRICE_MAPを作成
    const PRICE_MAP = {};
    Object.entries(priceMap).forEach(([key, price]) => {
      PRICE_MAP[key] = price;
    });
    
    // 辞書マスターレコードを準備
    const masterRecord = {
      id: 1,
      name: 'sample_work_dictionary',
      description: 'サンプル作業辞書データ（自動車整備業務）',
      targets: targets,
      actions: actions,  
      positions: positions,
      target_actions: TARGET_ACTIONS,
      action_positions: ACTION_POSITIONS,
      price_map: PRICE_MAP,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('\n辞書マスターレコードを準備しました');
    console.log('TARGET_ACTIONS keys:', Object.keys(TARGET_ACTIONS));
    console.log('ACTION_POSITIONS keys:', Object.keys(ACTION_POSITIONS));
    console.log('PRICE_MAP keys:', Object.keys(PRICE_MAP));
    
    // 実際の登録は現在スキップ（テーブル構造を確認してから）
    console.log('\n⚠️ 実際の登録はテーブル構造確認後に実装予定');
    console.log('必要なテーブル構造:');
    console.log('- work_dictionary_master テーブル');
    console.log('- targets, actions, positions, target_actions, action_positions, price_map カラム');
    
    return masterRecord;
    
  } catch (error) {
    console.error('辞書データ登録エラー:', error);
    throw error;
  }
}

if (require.main === module) {
  registerDictionaryData();
}

module.exports = { registerDictionaryData };