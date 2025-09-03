// 過去の請求書データから作業項目を分析・分解するクラス
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://auwmmosfteomieyexkeh.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1d21tb3NmdGVvbWlleWV4a2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzcxNTYsImV4cCI6MjA3MTAxMzE1Nn0.9SsGplOy1PQak1y7WLfzadvTOfm4NuuX8254lEctvj0';
const supabase = createClient(supabaseUrl, supabaseKey);

class WorkItemParser {
  constructor() {
    this.targets = [];
    this.actions = [];
    this.positions = [];
    this.parsingRules = [];
    this.processedData = [];
    this.unprocessedData = [];
    this.processingLog = [];
  }

  // 辞書データを読み込み
  async loadDictionaries() {
    console.log('辞書データを読み込み中...');
    
    try {
      const [targetsRes, actionsRes, positionsRes] = await Promise.all([
        supabase.from('targets').select('*').eq('is_active', true),
        supabase.from('actions').select('*').eq('is_active', true),
        supabase.from('positions').select('*').eq('is_active', true)
      ]);

      if (targetsRes.error) throw targetsRes.error;
      if (actionsRes.error) throw actionsRes.error;
      if (positionsRes.error) throw positionsRes.error;

      this.targets = targetsRes.data.map(t => t.name);
      this.actions = actionsRes.data.map(a => a.name);
      this.positions = positionsRes.data.map(p => p.name);

      console.log(`辞書データ読み込み完了:`);
      console.log(`- 対象: ${this.targets.length} 件`);
      console.log(`- 動作: ${this.actions.length} 件`);
      console.log(`- 位置: ${this.positions.length} 件`);

    } catch (error) {
      console.error('辞書データ読み込みエラー:', error);
      throw error;
    }
  }

  // 基本的な分解ルール
  initializeBasicRules() {
    this.parsingRules = [
      // 位置パターン（複数位置対応）
      {
        name: 'position_extraction',
        pattern: /^(左|右|前|後|上|下|内|外|フロント|リア|サイド|センター|中央|アッパー|ロア|運転席|助手席)*(左|右|前|後|上|下|内|外|フロント|リア|サイド|センター|中央|アッパー|ロア|運転席|助手席)*(.+)/,
        extract: (match) => {
          const positions = [];
          let remaining = match[0];
          
          // 位置を順番に抽出
          this.positions.forEach(pos => {
            if (remaining.startsWith(pos)) {
              positions.push(pos);
              remaining = remaining.slice(pos.length);
            }
          });
          
          return {
            positions: positions,
            remaining: remaining.trim()
          };
        }
      },
      
      // 対象パターン（辞書マッチング）
      {
        name: 'target_extraction',
        pattern: null, // 辞書ベース
        extract: (text) => {
          // 最長マッチで対象を特定
          let foundTarget = '';
          let remaining = text;
          
          // 長い順にソートして最長マッチを探す
          const sortedTargets = [...this.targets].sort((a, b) => b.length - a.length);
          
          for (const target of sortedTargets) {
            if (text.includes(target)) {
              foundTarget = target;
              remaining = text.replace(target, '').trim();
              break;
            }
          }
          
          return {
            target: foundTarget,
            remaining: remaining
          };
        }
      },
      
      // 動作パターン（辞書マッチング + 複合語）
      {
        name: 'action_extraction',
        pattern: null, // 辞書ベース
        extract: (text) => {
          const foundActions = [];
          let remaining = text;
          
          // 複合動作パターンを先にチェック
          const compoundPatterns = [
            { pattern: /鈑金修理/, actions: ['鈑金', '修理'] },
            { pattern: /塗装仕上げ/, actions: ['塗装', '仕上げ'] },
            { pattern: /脱着交換/, actions: ['脱着', '交換'] },
            { pattern: /分解清掃/, actions: ['分解', '清掃'] }
          ];
          
          // 複合動作チェック
          for (const compound of compoundPatterns) {
            if (compound.pattern.test(remaining)) {
              foundActions.push(...compound.actions);
              remaining = remaining.replace(compound.pattern, '').trim();
              return { actions: foundActions, remaining };
            }
          }
          
          // 個別動作チェック
          const sortedActions = [...this.actions].sort((a, b) => b.length - a.length);
          
          for (const action of sortedActions) {
            if (remaining.includes(action)) {
              foundActions.push(action);
              remaining = remaining.replace(action, '').trim();
            }
          }
          
          return {
            actions: foundActions,
            remaining: remaining
          };
        }
      }
    ];
    
    console.log(`基本分解ルールを初期化: ${this.parsingRules.length} 個`);
  }

  // メイン分解処理
  parseWorkItem(originalText, price = 0, invoiceId = null) {
    console.log(`\n--- 分解処理開始 ---`);
    console.log(`元データ: "${originalText}" (¥${price})`);
    
    let currentText = originalText.trim();
    const result = {
      original: originalText,
      price: price,
      invoiceId: invoiceId,
      items: [],
      isSet: false,
      status: 'processing',
      errors: []
    };

    let positionResult = { positions: [], remaining: currentText };
    let targetResult = { target: '', remaining: currentText };
    let actionResult = { actions: [], remaining: '' };

    try {
      // Step 1: 位置抽出
      const positionRule = this.parsingRules.find(r => r.name === 'position_extraction');
      positionResult = positionRule.extract([currentText]);
      
      console.log(`位置抽出: [${positionResult.positions.join(', ')}]`);
      console.log(`残りテキスト: "${positionResult.remaining}"`);
      
      currentText = positionResult.remaining;

      // Step 2: 対象抽出
      const targetRule = this.parsingRules.find(r => r.name === 'target_extraction');
      targetResult = targetRule.extract(currentText);
      
      console.log(`対象抽出: "${targetResult.target}"`);
      console.log(`残りテキスト: "${targetResult.remaining}"`);
      
      currentText = targetResult.remaining;

      // Step 3: 動作抽出
      const actionRule = this.parsingRules.find(r => r.name === 'action_extraction');
      actionResult = actionRule.extract(currentText);
      
      console.log(`動作抽出: [${actionResult.actions.join(', ')}]`);
      console.log(`残りテキスト: "${actionResult.remaining}"`);

      // Step 4: 結果評価と構造化
      if (targetResult.target && actionResult.actions.length > 0) {
        if (actionResult.actions.length === 1) {
          // 個別作業
          result.items.push({
            target: targetResult.target,
            action: actionResult.actions[0],
            positions: positionResult.positions,
            memo: actionResult.remaining || '',
            unitPrice: price
          });
          result.isSet = false;
          result.status = 'success';
          console.log(`✅ 個別作業として処理成功`);
        } else {
          // セット作業（複数動作）
          actionResult.actions.forEach(action => {
            result.items.push({
              target: targetResult.target,
              action: action,
              positions: positionResult.positions,
              memo: actionResult.remaining || '',
              unitPrice: null // セットは単価なし
            });
          });
          result.isSet = true;
          result.setName = originalText;
          result.setPrice = price;
          result.status = 'success';
          console.log(`✅ セット作業として処理成功`);
        }
      } else {
        // 分解失敗
        result.status = 'failed';
        result.errors.push({
          reason: 'insufficient_data',
          details: {
            hasTarget: !!targetResult.target,
            hasActions: actionResult.actions.length > 0,
            foundTarget: targetResult.target,
            foundActions: actionResult.actions,
            remainingText: actionResult.remaining
          }
        });
        console.log(`❌ 分解失敗: 対象または動作が不足`);
      }

    } catch (error) {
      result.status = 'error';
      result.errors.push({
        reason: 'parsing_error',
        message: error.message,
        stack: error.stack
      });
      console.log(`💥 分解エラー: ${error.message}`);
    }

    // ログ記録
    this.processingLog.push({
      timestamp: new Date().toISOString(),
      original: originalText,
      result: result,
      processingSteps: {
        positions: positionResult.positions || [],
        target: targetResult.target || '',
        actions: actionResult.actions || []
      }
    });

    console.log(`--- 分解処理完了 ---\n`);
    return result;
  }

  // バッチ処理
  async processBatch(workItems) {
    console.log(`\n=== バッチ処理開始: ${workItems.length} 件 ===`);
    
    let successCount = 0;
    let failedCount = 0;

    for (let i = 0; i < workItems.length; i++) {
      const item = workItems[i];
      console.log(`\n[${i + 1}/${workItems.length}] 処理中...`);
      
      const result = this.parseWorkItem(
        item.description || item.work_description || item.text,
        item.price || item.unit_price || 0,
        item.invoice_id || null
      );

      if (result.status === 'success') {
        this.processedData.push(result);
        successCount++;
      } else {
        this.unprocessedData.push(result);
        failedCount++;
      }

      // 進捗表示
      if ((i + 1) % 10 === 0) {
        console.log(`進捗: ${i + 1}/${workItems.length} (成功: ${successCount}, 失敗: ${failedCount})`);
      }
    }

    console.log(`\n=== バッチ処理完了 ===`);
    console.log(`成功: ${successCount} 件 (${(successCount / workItems.length * 100).toFixed(1)}%)`);
    console.log(`失敗: ${failedCount} 件 (${(failedCount / workItems.length * 100).toFixed(1)}%)`);
    
    return {
      total: workItems.length,
      success: successCount,
      failed: failedCount,
      successRate: (successCount / workItems.length * 100).toFixed(1)
    };
  }

  // 結果をファイルに保存
  saveResults(outputDir = './outputs') {
    // ディレクトリ作成
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    // 処理成功データ
    const processedFile = path.join(outputDir, `processed_data_${timestamp}.json`);
    fs.writeFileSync(processedFile, JSON.stringify(this.processedData, null, 2));
    
    // 未処理データ
    const unprocessedFile = path.join(outputDir, `unprocessed_data_${timestamp}.json`);
    fs.writeFileSync(unprocessedFile, JSON.stringify(this.unprocessedData, null, 2));
    
    // 処理ログ
    const logFile = path.join(outputDir, `processing_log_${timestamp}.json`);
    fs.writeFileSync(logFile, JSON.stringify(this.processingLog, null, 2));
    
    // 統計情報
    const stats = {
      timestamp: new Date().toISOString(),
      total: this.processedData.length + this.unprocessedData.length,
      processed: this.processedData.length,
      unprocessed: this.unprocessedData.length,
      successRate: ((this.processedData.length / (this.processedData.length + this.unprocessedData.length)) * 100).toFixed(1),
      individualWorks: this.processedData.filter(item => !item.isSet).length,
      setWorks: this.processedData.filter(item => item.isSet).length
    };
    
    const statsFile = path.join(outputDir, `processing_stats_${timestamp}.json`);
    fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2));

    console.log(`\n=== ファイル保存完了 ===`);
    console.log(`- 処理成功データ: ${processedFile}`);
    console.log(`- 未処理データ: ${unprocessedFile}`);
    console.log(`- 処理ログ: ${logFile}`);
    console.log(`- 統計情報: ${statsFile}`);
    
    return {
      processedFile,
      unprocessedFile,
      logFile,
      statsFile,
      stats
    };
  }
}

// 使用例とテスト
async function testParser() {
  console.log('=== Work Item Parser テスト ===');
  
  const parser = new WorkItemParser();
  
  // 辞書データ読み込み
  await parser.loadDictionaries();
  
  // 基本ルール初期化
  parser.initializeBasicRules();
  
  // テストデータ
  const testItems = [
    { description: '左前ドア鈑金修理', price: 15000 },
    { description: 'バンパー塗装', price: 8000 },
    { description: '右サイドミラー交換', price: 5000 },
    { description: 'エンジンオイル交換', price: 3000 },
    { description: '左前ドア鈑金修理（バンパー調整含む）', price: 25000 },
    { description: 'ヘッドライト清掃点検', price: 2000 }
  ];
  
  // バッチ処理テスト
  const results = await parser.processBatch(testItems);
  
  // 結果保存
  const files = parser.saveResults();
  
  console.log('\n=== テスト完了 ===');
  console.log(`処理率: ${results.successRate}%`);
  
  return files;
}

// スクリプト直接実行時
if (require.main === module) {
  testParser().catch(console.error);
}

module.exports = { WorkItemParser };