// masuta.csvから件名の重複を除去して、読み仮名調べ用ファイルを作成するスクリプト

const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '..', '請求書システム画像', 'hondata', 'masuta.csv');
const outputDir = path.join(__dirname, 'subject-master-output');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

// 出力ディレクトリを作成
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function extractUniqueSubjects() {
  try {
    console.log('=== 件名マスター重複除去処理開始 ===');
    
    // CSVファイルを読み込み
    const csvContent = fs.readFileSync(inputFile, 'utf-8');
    const lines = csvContent.split('\n');
    
    console.log(`総行数: ${lines.length}行`);
    
    // ヘッダーをスキップして件名を抽出
    const subjects = new Set();
    const duplicateCount = {};
    let processedCount = 0;
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line === '') continue;
      
      const columns = line.split(',');
      if (columns.length >= 2) {
        const subject = columns[0].trim();
        if (subject && subject !== '件名') {
          // 使用回数をカウント
          duplicateCount[subject] = (duplicateCount[subject] || 0) + 1;
          subjects.add(subject);
          processedCount++;
        }
      }
    }
    
    // 結果を配列に変換して並び替え
    const uniqueSubjects = Array.from(subjects).sort();
    
    console.log(`処理済み件数: ${processedCount}件`);
    console.log(`重複除去後: ${uniqueSubjects.length}件`);
    
    // 1. 読み仮名調べ用CSVファイル作成
    const readingCsvContent = ['件名,読み仮名,カテゴリー,使用回数']
      .concat(uniqueSubjects.map(subject => `${subject},,会社・組織,${duplicateCount[subject]}`))
      .join('\n');
    
    const readingCsvFile = path.join(outputDir, `unique_subjects_for_reading_${timestamp}.csv`);
    fs.writeFileSync(readingCsvFile, readingCsvContent, 'utf-8');
    console.log(`読み仮名調べ用CSVファイル作成: ${readingCsvFile}`);
    
    // 2. 統計情報JSONファイル作成
    const statistics = {
      timestamp: new Date().toISOString(),
      total_processed: processedCount,
      unique_count: uniqueSubjects.length,
      duplicate_removed: processedCount - uniqueSubjects.length,
      top_10_most_used: Object.entries(duplicateCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([subject, count]) => ({ subject, count }))
    };
    
    const statsFile = path.join(outputDir, `extraction_stats_${timestamp}.json`);
    fs.writeFileSync(statsFile, JSON.stringify(statistics, null, 2), 'utf-8');
    console.log(`統計情報ファイル作成: ${statsFile}`);
    
    // 3. task_master用SQLファイル作成
    const sqlInserts = uniqueSubjects.map((subject, index) => {
      const safeSubject = subject.replace(/'/g, "''"); // SQLインジェクション対策
      const usageCount = duplicateCount[subject];
      return `  ('${safeSubject}', '会社・組織', ${usageCount}, ${index + 1})`;
    });
    
    const sqlContent = `-- task_master テーブル用データ (${uniqueSubjects.length}件)
-- 実行前に既存データとの重複をチェックしてください

INSERT INTO public.task_master (canonical_name, category, usage_count, sort_order, is_active) VALUES
${sqlInserts.join(',\n')};

-- 統計情報
-- 総処理件数: ${processedCount}
-- 重複除去後: ${uniqueSubjects.length}
-- 除去された重複: ${processedCount - uniqueSubjects.length}`;
    
    const sqlFile = path.join(outputDir, `task_master_insert_${timestamp}.sql`);
    fs.writeFileSync(sqlFile, sqlContent, 'utf-8');
    console.log(`SQLファイル作成: ${sqlFile}`);
    
    // 4. 使用回数トップ10表示
    console.log('\n=== 使用回数トップ10 ===');
    statistics.top_10_most_used.forEach((item, index) => {
      console.log(`${index + 1}. ${item.subject}: ${item.count}回`);
    });
    
    console.log('\n=== 処理完了 ===');
    console.log(`出力フォルダ: ${outputDir}`);
    
  } catch (error) {
    console.error('処理エラー:', error);
  }
}

// スクリプト実行
if (require.main === module) {
  extractUniqueSubjects();
}

module.exports = { extractUniqueSubjects };