const fs = require('fs');

// SQLファイルを読み込み
const sqlContent = fs.readFileSync('scripts/insert-subject-master-data.sql', 'utf8');

// INSERT文から件名データを抽出
const insertRegex = /INSERT INTO public\.subject_master \(subject_name, subject_name_kana, created_at, updated_at\) VALUES \('([^']+)', '([^']+)', NOW\(\), NOW\(\)\);/g;

const subjects = [];
let match;
let id = 1;

while ((match = insertRegex.exec(sqlContent)) !== null) {
  subjects.push({
    id: id.toString(),
    subject_name: match[1],
    subject_name_kana: match[2],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  id++;
}

console.log(`抽出された件名数: ${subjects.length}`);

// ディレクトリを確認・作成
const path = require('path');
const dataDir = path.join('src', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// JavaScriptファイルとして出力
const jsContent = `// 件名マスタデータ（復元済み）
// 元データ: scripts/insert-subject-master-data.sql
export const subjectMasterData = ${JSON.stringify(subjects, null, 2)};
`;

fs.writeFileSync('src/data/subject-master-data.js', jsContent);
console.log('件名データを src/data/subject-master-data.js に出力しました');