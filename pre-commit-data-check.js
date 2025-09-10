#!/usr/bin/env node
// Git pre-commit hook: データ保護チェック
// .git/hooks/pre-commit にこのファイルを配置

const { DataProtectionSystem } = require('./data-protection.js');
const fs = require('fs');

async function preCommitDataCheck() {
  console.log('🛡️ Pre-commit データ保護チェック実行中...');
  
  try {
    const protection = new DataProtectionSystem();
    const dataStatus = await protection.monitorDataCounts();
    
    let hasError = false;
    let errorMessage = '';
    
    for (const [table, status] of Object.entries(dataStatus)) {
      if (status.status === 'DANGER') {
        hasError = true;
        errorMessage += `🚨 ${table}: ${status.current}件 (最低${status.minimum}件必要)\n`;
      } else {
        console.log(`✅ ${table}: ${status.current}件 (安全)`);
      }
    }
    
    if (hasError) {
      console.error('\n🚨 COMMIT BLOCKED: データ不足が検出されました');
      console.error(errorMessage);
      console.error('データを復旧してからコミットしてください。');
      console.error('復旧コマンド: node emergency_restore.js');
      process.exit(1);
    }
    
    console.log('✅ データ保護チェック完了 - コミット許可');
    
  } catch (error) {
    console.error('❌ データ保護チェックでエラー:', error.message);
    console.error('安全のためコミットをブロックします。');
    process.exit(1);
  }
}

// 直接実行時
if (require.main === module) {
  preCommitDataCheck();
}

module.exports = { preCommitDataCheck };