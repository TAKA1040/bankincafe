// 経理データ保護システム
// 全てのデータベース操作前に実行される強制チェック

const { createClient } = require('@supabase/supabase-js');

class DataProtectionSystem {
  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    this.requiredMinimumCounts = {
      invoices: 1000,        // 請求書は最低1000件
      invoice_line_items: 500 // 明細は最低500件
    };
  }

  // データベース操作前の強制チェック
  async enforceDataProtection(operation, tableName, query = null) {
    console.log(`🛡️ データ保護チェック開始: ${operation} on ${tableName}`);
    
    // 危険な操作の検出
    const dangerousOperations = ['DELETE', 'TRUNCATE', 'DROP', 'RESET'];
    const isDangerous = dangerousOperations.some(op => 
      operation.toUpperCase().includes(op)
    );
    
    if (isDangerous && ['invoices', 'invoice_line_items'].includes(tableName)) {
      throw new Error(`🚨 BLOCKED: 経理データ(${tableName})への危険な操作(${operation})は禁止されています`);
    }
    
    // LIMIT制限のチェック
    if (query && query.includes('LIMIT') && query.includes('SELECT')) {
      const limitMatch = query.match(/LIMIT\s+(\d+)/i);
      if (limitMatch) {
        const limitValue = parseInt(limitMatch[1]);
        if (limitValue < this.requiredMinimumCounts[tableName]) {
          throw new Error(`🚨 BLOCKED: ${tableName}のLIMIT ${limitValue}は最小値${this.requiredMinimumCounts[tableName]}を下回っています`);
        }
      }
    }
    
    return true;
  }

  // データ件数の監視
  async monitorDataCounts() {
    const results = {};
    
    for (const [table, minCount] of Object.entries(this.requiredMinimumCounts)) {
      try {
        const { data, error } = await this.supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (error) throw error;
        
        const currentCount = data?.length || 0;
        results[table] = {
          current: currentCount,
          minimum: minCount,
          status: currentCount >= minCount ? 'SAFE' : 'DANGER'
        };
        
        if (currentCount < minCount) {
          console.error(`🚨 データ不足警告: ${table} = ${currentCount}件 (最低${minCount}件必要)`);
        }
      } catch (error) {
        console.error(`❌ ${table}の監視エラー:`, error);
        results[table] = { error: error.message };
      }
    }
    
    return results;
  }

  // 操作前後の件数比較
  async compareDataCounts(beforeCounts) {
    const afterCounts = await this.monitorDataCounts();
    const changes = {};
    
    for (const table in beforeCounts) {
      const before = beforeCounts[table]?.current || 0;
      const after = afterCounts[table]?.current || 0;
      changes[table] = {
        before,
        after,
        change: after - before,
        acceptable: after >= this.requiredMinimumCounts[table]
      };
      
      if (!changes[table].acceptable) {
        throw new Error(`🚨 データ消失検出: ${table}が${before}→${after}件に減少し、最小値を下回りました`);
      }
    }
    
    return changes;
  }

  // 緊急復旧の実行
  async emergencyRestore() {
    console.log('🚨 緊急復旧プロセス開始');
    // emergency_restore.jsを自動実行
    const { exec } = require('child_process');
    return new Promise((resolve, reject) => {
      exec('node emergency_restore.js', (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          console.log(stdout);
          resolve(stdout);
        }
      });
    });
  }
}

// グローバルインスタンス
const dataProtection = new DataProtectionSystem();

// フック関数群
async function beforeDatabaseOperation(operation, tableName, query) {
  const beforeCounts = await dataProtection.monitorDataCounts();
  await dataProtection.enforceDataProtection(operation, tableName, query);
  return beforeCounts;
}

async function afterDatabaseOperation(beforeCounts) {
  const changes = await dataProtection.compareDataCounts(beforeCounts);
  console.log('📊 データ変更結果:', changes);
  return changes;
}

module.exports = {
  DataProtectionSystem,
  dataProtection,
  beforeDatabaseOperation,
  afterDatabaseOperation
};