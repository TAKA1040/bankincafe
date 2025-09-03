// 分解結果をデータベースに登録するクラス
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://auwmmosfteomieyexkeh.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1d21tb3NmdGVvbWlleWV4a2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzcxNTYsImV4cCI6MjA3MTAxMzE1Nn0.9SsGplOy1PQak1y7WLfzadvTOfm4NuuX8254lEctvj0';
const supabase = createClient(supabaseUrl, supabaseKey);

class DatabaseImporter {
  constructor() {
    this.targetIdMap = new Map();
    this.actionIdMap = new Map();
    this.positionIdMap = new Map();
    this.importLog = [];
    this.stats = {
      individualWorks: 0,
      setWorks: 0,
      newTargets: 0,
      newActions: 0,
      newPositions: 0,
      errors: 0
    };
  }

  // 既存の辞書データを読み込み、IDマップを作成
  async loadExistingDictionaries() {
    console.log('既存の辞書データを読み込み中...');
    
    try {
      const [targetsRes, actionsRes, positionsRes] = await Promise.all([
        supabase.from('targets').select('id, name').eq('is_active', true),
        supabase.from('actions').select('id, name').eq('is_active', true),
        supabase.from('positions').select('id, name').eq('is_active', true)
      ]);

      if (targetsRes.error) throw targetsRes.error;
      if (actionsRes.error) throw actionsRes.error;
      if (positionsRes.error) throw positionsRes.error;

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

      console.log(`既存辞書データ読み込み完了:`);
      console.log(`- 対象: ${this.targetIdMap.size} 件`);
      console.log(`- 動作: ${this.actionIdMap.size} 件`);
      console.log(`- 位置: ${this.positionIdMap.size} 件`);

    } catch (error) {
      console.error('辞書データ読み込みエラー:', error);
      throw error;
    }
  }

  // 不足している辞書項目を自動追加
  async ensureDictionaryItem(type, name) {
    const mapName = `${type}IdMap`;
    const tableName = `${type}s`;
    const idMap = this[mapName];
    
    if (idMap.has(name)) {
      return idMap.get(name);
    }

    console.log(`新しい${type}を追加: "${name}"`);
    
    try {
      // 最大のsort_orderを取得
      const { data: maxData, error: maxError } = await supabase
        .from(tableName)
        .select('sort_order')
        .order('sort_order', { ascending: false })
        .limit(1);

      if (maxError) throw maxError;
      
      const nextSortOrder = (maxData?.[0]?.sort_order || 0) + 1;

      // 新しい項目を追加
      const insertData = {
        name: name,
        name_norm: name,
        sort_order: nextSortOrder,
        is_active: true
      };

      // targetsの場合は読み仮名も追加
      if (type === 'target') {
        insertData.reading = this.generateReading(name);
      }

      const { data, error } = await supabase
        .from(tableName)
        .insert(insertData)
        .select('id')
        .single();

      if (error) throw error;

      // IDマップに追加
      idMap.set(name, data.id);
      this.stats[`new${type.charAt(0).toUpperCase() + type.slice(1)}s`]++;
      
      this.importLog.push({
        type: 'dictionary_addition',
        category: type,
        name: name,
        id: data.id,
        timestamp: new Date().toISOString()
      });

      return data.id;
      
    } catch (error) {
      console.error(`${type}追加エラー:`, error);
      throw error;
    }
  }

  // 簡単な読み仮名生成（改善の余地あり）
  generateReading(name) {
    // カタカナの場合はひらがなに変換
    const hiragana = name.replace(/[\u30A1-\u30F6]/g, (char) => 
      String.fromCharCode(char.charCodeAt(0) - 0x60)
    );
    return hiragana;
  }

  // 個別作業を登録
  async importIndividualWork(workData) {
    console.log(`個別作業を登録: "${workData.original}"`);
    
    try {
      const item = workData.items[0]; // 個別作業は1項目のみ
      
      // 辞書IDを取得（なければ作成）
      const targetId = await this.ensureDictionaryItem('target', item.target);
      const actionId = await this.ensureDictionaryItem('action', item.action);
      
      // 位置IDsを取得（複数の場合あり）
      const positionIds = [];
      for (const position of item.positions) {
        const positionId = await this.ensureDictionaryItem('position', position);
        positionIds.push(positionId);
      }

      // work_historyに登録
      const workHistoryData = {
        target_id: targetId,
        action_id: actionId,
        position_id: positionIds.length > 0 ? positionIds[0] : null, // 最初の位置のみ
        memo: item.memo || '',
        unit_price: item.unitPrice || 0,
        quantity: 1,
        raw_label: workData.original,
        task_type: 'structured'
      };

      const { data, error } = await supabase
        .from('work_history')
        .insert(workHistoryData)
        .select('id')
        .single();

      if (error) throw error;

      this.stats.individualWorks++;
      this.importLog.push({
        type: 'individual_work',
        workId: data.id,
        original: workData.original,
        target: item.target,
        action: item.action,
        positions: item.positions,
        timestamp: new Date().toISOString()
      });

      console.log(`✅ 個別作業登録完了 (ID: ${data.id})`);
      return data.id;
      
    } catch (error) {
      console.error(`個別作業登録エラー:`, error);
      this.stats.errors++;
      this.importLog.push({
        type: 'error',
        category: 'individual_work',
        original: workData.original,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  }

  // セット作業を登録
  async importSetWork(workData) {
    console.log(`セット作業を登録: "${workData.original}"`);
    
    try {
      // work_setsにセットヘッダーを登録
      const setData = {
        set_name: workData.setName,
        unit_price: workData.setPrice || 0,
        quantity: 1
      };

      const { data: setResult, error: setError } = await supabase
        .from('work_sets')
        .insert(setData)
        .select('id')
        .single();

      if (setError) throw setError;
      
      const setId = setResult.id;

      // work_set_detailsに各作業項目を登録
      for (let i = 0; i < workData.items.length; i++) {
        const item = workData.items[i];
        
        // 辞書IDを取得（なければ作成）
        const targetId = await this.ensureDictionaryItem('target', item.target);
        const actionId = await this.ensureDictionaryItem('action', item.action);
        
        // 位置IDsを取得
        const positionIds = [];
        for (const position of item.positions) {
          const positionId = await this.ensureDictionaryItem('position', position);
          positionIds.push(positionId);
        }

        const detailData = {
          work_set_id: setId,
          target_id: targetId,
          action_id: actionId,
          position_id: positionIds.length > 0 ? positionIds[0] : null,
          memo: item.memo || '',
          sort_order: i + 1
        };

        const { error: detailError } = await supabase
          .from('work_set_details')
          .insert(detailData);

        if (detailError) throw detailError;
      }

      this.stats.setWorks++;
      this.importLog.push({
        type: 'set_work',
        setId: setId,
        original: workData.original,
        itemCount: workData.items.length,
        items: workData.items.map(item => ({
          target: item.target,
          action: item.action,
          positions: item.positions
        })),
        timestamp: new Date().toISOString()
      });

      console.log(`✅ セット作業登録完了 (ID: ${setId}, 詳細: ${workData.items.length}件)`);
      return setId;
      
    } catch (error) {
      console.error(`セット作業登録エラー:`, error);
      this.stats.errors++;
      this.importLog.push({
        type: 'error',
        category: 'set_work',
        original: workData.original,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  }

  // バッチインポート
  async importBatch(processedDataFile) {
    console.log(`\n=== バッチインポート開始 ===`);
    
    // JSONファイルを読み込み
    const processedData = JSON.parse(fs.readFileSync(processedDataFile, 'utf8'));
    console.log(`インポート対象: ${processedData.length} 件`);
    
    // 既存辞書データを読み込み
    await this.loadExistingDictionaries();
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < processedData.length; i++) {
      const workData = processedData[i];
      console.log(`\n[${i + 1}/${processedData.length}] インポート中...`);
      
      try {
        if (workData.isSet) {
          await this.importSetWork(workData);
        } else {
          await this.importIndividualWork(workData);
        }
        successCount++;
      } catch (error) {
        errorCount++;
        console.error(`❌ インポート失敗: ${workData.original}`);
      }
      
      // 進捗表示
      if ((i + 1) % 5 === 0) {
        console.log(`進捗: ${i + 1}/${processedData.length} (成功: ${successCount}, エラー: ${errorCount})`);
      }
    }

    console.log(`\n=== バッチインポート完了 ===`);
    console.log(`成功: ${successCount} 件`);
    console.log(`エラー: ${errorCount} 件`);
    console.log(`成功率: ${(successCount / processedData.length * 100).toFixed(1)}%`);
    console.log(`\n--- 追加された辞書項目 ---`);
    console.log(`新しい対象: ${this.stats.newTargets} 件`);
    console.log(`新しい動作: ${this.stats.newActions} 件`);
    console.log(`新しい位置: ${this.stats.newPositions} 件`);
    
    return {
      total: processedData.length,
      success: successCount,
      errors: errorCount,
      successRate: (successCount / processedData.length * 100).toFixed(1),
      stats: this.stats
    };
  }

  // インポートログを保存
  saveImportLog(outputDir = './outputs') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const logFile = path.join(outputDir, `import_log_${timestamp}.json`);
    
    const logData = {
      timestamp: new Date().toISOString(),
      stats: this.stats,
      log: this.importLog
    };
    
    fs.writeFileSync(logFile, JSON.stringify(logData, null, 2));
    console.log(`インポートログ保存: ${logFile}`);
    return logFile;
  }
}

// 使用例とテスト
async function testImport() {
  console.log('=== Database Importer テスト ===');
  
  const importer = new DatabaseImporter();
  
  // 最新の処理済みデータファイルを探す
  const outputDir = './outputs';
  const files = fs.readdirSync(outputDir)
    .filter(file => file.startsWith('processed_data_'))
    .sort()
    .reverse();
  
  if (files.length === 0) {
    console.error('処理済みデータファイルが見つかりません');
    return;
  }
  
  const latestFile = path.join(outputDir, files[0]);
  console.log(`使用ファイル: ${latestFile}`);
  
  // バッチインポート実行
  const results = await importer.importBatch(latestFile);
  
  // ログ保存
  importer.saveImportLog();
  
  console.log('\n=== インポートテスト完了 ===');
  console.log(`成功率: ${results.successRate}%`);
  console.log(`統計: ${JSON.stringify(results.stats, null, 2)}`);
  
  return results;
}

// スクリプト直接実行時
if (require.main === module) {
  testImport().catch(console.error);
}

module.exports = { DatabaseImporter };