// LocalStorageをリセットしてデータを再生成するスクリプト
// ブラウザのコンソールで実行

console.log('LocalStorageをクリアしています...')

// 関連するキーをすべてクリア
const keys = ['bankin_subject_master', 'bankin_subject_registration_pairs']
keys.forEach(key => {
  localStorage.removeItem(key)
  console.log(`${key} をクリアしました`)
})

console.log('LocalStorageクリア完了')
console.log('ページをリフレッシュしてデータを再生成してください')

// 現在のLocalStorageの状況を表示
console.log('\n=== 現在のLocalStorage ===')
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i)
  if (key && key.includes('bankin')) {
    console.log(`${key}: ${localStorage.getItem(key)?.length || 0} 文字`)
  }
}