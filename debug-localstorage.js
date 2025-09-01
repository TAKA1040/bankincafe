// ブラウザのコンソールで実行するデバッグスクリプト

// 件名マスターデータの確認
console.log('=== 件名マスターデータ ===');
const subjectMaster = localStorage.getItem('bankin_subject_master');
if (subjectMaster) {
  const subjects = JSON.parse(subjectMaster);
  console.log(`件数: ${subjects.length}件`);
  console.log('最初の5件:', subjects.slice(0, 5));
  
  // 登録番号があるものの数をチェック
  const withRegNumber = subjects.filter(s => s.registration_number && s.registration_number.trim());
  console.log(`登録番号ありの件数: ${withRegNumber.length}件`);
  console.log('登録番号ありの最初の3件:', withRegNumber.slice(0, 3));
} else {
  console.log('件名マスターデータが見つかりません');
}

// ペアデータの確認
console.log('\n=== ペアデータ ===');
const pairData = localStorage.getItem('bankin_subject_registration_pairs');
if (pairData) {
  const pairs = JSON.parse(pairData);
  console.log(`ペア件数: ${pairs.length}件`);
  console.log('ペアデータ:', pairs.slice(0, 3));
} else {
  console.log('ペアデータが見つかりません');
}

// LocalStorageの全キー表示
console.log('\n=== LocalStorage全キー ===');
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  console.log(`${key}: ${localStorage.getItem(key)?.length || 0} 文字`);
}