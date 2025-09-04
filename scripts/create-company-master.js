const fs = require('fs');
const path = require('path');
const csv = require('csv-parse/sync');

// CSVファイルを読み込む
const kenmeiPath = path.join(__dirname, '..', '請求書システム画像', 'hondata', 'kenmei_yomigana.csv');
const masutaPath = path.join(__dirname, '..', '請求書システム画像', 'hondata', 'masuta.csv');

const kenmeiContent = fs.readFileSync(kenmeiPath, 'utf-8');
const masutaContent = fs.readFileSync(masutaPath, 'utf-8');

// BOMを除去してCSVを解析
const cleanKenmeiContent = kenmeiContent.replace(/^\uFEFF/, '');
const cleanMasutaContent = masutaContent.replace(/^\uFEFF/, '');

const kenmeiRecords = csv.parse(cleanKenmeiContent, {
  columns: true,
  skip_empty_lines: true
});

const masutaRecords = csv.parse(cleanMasutaContent, {
  columns: true,
  skip_empty_lines: true
});

console.log(`会社名データ: ${kenmeiRecords.length}件`);
console.log(`登録番号データ: ${masutaRecords.length}件`);

// 件名マスタを作成
const subjectMaster = new Map();
kenmeiRecords.forEach(record => {
  const subjectName = record['会社名']; // CSVの列名は「会社名」だが、実際は件名
  const kana = record['読み仮名'];
  
  if (subjectName && subjectName.trim() !== '') {
    subjectMaster.set(subjectName, {
      subjectName: subjectName.trim(),
      subjectNameKana: kana ? kana.trim() : null
    });
  }
});

// masuta.csvから件名を抽出して、kenmei_yomigana.csvにない件名も追加
const missingSubjects = [];
masutaRecords.forEach(record => {
  const subject = record['件名'];
  
  if (subject && subject.trim() !== '' && !subjectMaster.has(subject)) {
    subjectMaster.set(subject, {
      subjectName: subject.trim(),
      subjectNameKana: null // 読み仮名なし
    });
    missingSubjects.push(subject);
  }
});

if (missingSubjects.length > 0) {
  console.log(`\nkenmei_yomigana.csvにない件名 (${missingSubjects.length}件):`);
  missingSubjects.forEach(subject => {
    console.log(`  - ${subject}`);
  });
}

console.log(`\n総件名数: ${subjectMaster.size}件`);

// 登録番号をパース（既存のパース関数を再利用）
const parsedRegistrationNumbers = [];
const registrationNumberMap = new Map();

masutaRecords.forEach((record, index) => {
  const subject = record['件名'];
  const registrationNumber = record['登録番号'];
  
  if (!registrationNumber || registrationNumber.trim() === '') {
    return;
  }

  const parsed = parseRegistrationNumber(registrationNumber.trim());
  
  if (parsed) {
    const fullNumber = parsed.fullNumber;
    
    // 登録番号マスタにユニークな登録番号を追加
    if (!registrationNumberMap.has(fullNumber)) {
      registrationNumberMap.set(fullNumber, {
        registrationNumber: fullNumber,
        region: parsed.region,
        categoryCode: parsed.categoryCode,
        suffix: parsed.suffix,
        sequenceNumber: parsed.sequenceNumber
      });
    }
    
    // 件名-登録番号関連を作成
    parsedRegistrationNumbers.push({
      subjectName: subject,
      registrationNumber: fullNumber,
      region: parsed.region,
      categoryCode: parsed.categoryCode,
      suffix: parsed.suffix,
      sequenceNumber: parsed.sequenceNumber
    });
  }
});

console.log(`有効な登録番号: ${registrationNumberMap.size}件`);
console.log(`件名-登録番号関連: ${parsedRegistrationNumbers.length}件`);

// 件名別統計
const subjectStats = {};
parsedRegistrationNumbers.forEach(item => {
  const subject = item.subjectName;
  subjectStats[subject] = (subjectStats[subject] || 0) + 1;
});

console.log(`\n登録番号を複数持つ件名 (上位10位):`);
Object.entries(subjectStats)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 10)
  .forEach(([subject, count]) => {
    console.log(`  ${subject}: ${count}件`);
  });

// SQLインサート文を生成
const subjectSql = [];
const registrationNumberSql = [];
const subjectRegistrationSql = [];

// 件名マスタのSQL
Array.from(subjectMaster.values()).forEach(subject => {
  const subjectNameEscaped = subject.subjectName.replace(/'/g, "''");
  const kanaEscaped = subject.subjectNameKana ? `'${subject.subjectNameKana.replace(/'/g, "''")}'` : 'NULL';
  
  subjectSql.push(`INSERT INTO public.subject_master (subject_name, subject_name_kana, created_at, updated_at) VALUES ('${subjectNameEscaped}', ${kanaEscaped}, NOW(), NOW());`);
});

// 登録番号マスタのSQL
Array.from(registrationNumberMap.values()).forEach(regNum => {
  const values = [
    `'${regNum.registrationNumber.replace(/'/g, "''")}'`,
    `'${regNum.region?.replace(/'/g, "''") || ''}'`,
    `'${regNum.categoryCode || ''}'`,
    `'${regNum.suffix || ''}'`,
    `'${regNum.sequenceNumber || ''}'`,
    '0', // usage_count
    'NULL', // last_used_at
    'true', // is_active
    'NOW()', // created_at
    'NOW()' // updated_at
  ];
  
  registrationNumberSql.push(`INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES (${values.join(', ')});`);
});

// 件名-登録番号関連のSQL（件名IDと登録番号IDを後で関連付けるためのテンポラリSQLを生成）
const subjectRegRelationsSql = [];
parsedRegistrationNumbers.forEach(item => {
  const subjectNameEscaped = item.subjectName.replace(/'/g, "''");
  const regNumberEscaped = item.registrationNumber.replace(/'/g, "''");
  
  subjectRegRelationsSql.push(`
INSERT INTO public.subject_registration_numbers (subject_id, registration_number_id, is_primary, usage_count, last_used_at, created_at, updated_at) 
SELECT 
  s.id, 
  r.id, 
  false, -- is_primary（後で設定）
  0, 
  NULL, 
  NOW(), 
  NOW()
FROM public.subject_master s, public.registration_number_master r 
WHERE s.subject_name = '${subjectNameEscaped}' AND r.registration_number = '${regNumberEscaped}'
ON CONFLICT (subject_id, registration_number_id) DO NOTHING;`);
});

// SQLファイルを生成
const sqlContent = [
  '-- 件名マスタ・登録番号マスタ・関連データ投入',
  '-- Generated from kenmei_yomigana.csv and masuta.csv',
  `-- Subject records: ${subjectMaster.size}`,
  `-- Registration number records: ${registrationNumberMap.size}`,
  `-- Relations: ${parsedRegistrationNumbers.length}`,
  '',
  '-- 既存データをクリア（必要に応じて）',
  '-- DELETE FROM public.subject_registration_numbers;',
  '-- DELETE FROM public.registration_number_master;',
  '-- DELETE FROM public.subject_master;',
  '',
  '-- 件名マスタデータ投入',
  ...subjectSql,
  '',
  '-- 登録番号マスタデータ投入',
  ...registrationNumberSql,
  '',
  '-- 件名-登録番号関連データ投入',
  ...subjectRegRelationsSql,
  '',
  '-- プライマリ登録番号を設定（各件名の最初の登録番号をプライマリに設定）',
  'UPDATE public.subject_registration_numbers',
  'SET is_primary = true',
  'WHERE id IN (',
  '  SELECT DISTINCT ON (subject_id) id',
  '  FROM public.subject_registration_numbers',
  '  ORDER BY subject_id, created_at',
  ');',
  ''
].join('\n');

const sqlPath = path.join(__dirname, 'insert-subject-master-data.sql');
fs.writeFileSync(sqlPath, sqlContent, 'utf-8');
console.log(`\nSQLファイルを生成しました: ${sqlPath}`);

// デバッグ用JSONファイルも出力
const debugData = {
  subjects: Array.from(subjectMaster.values()),
  registrationNumbers: Array.from(registrationNumberMap.values()),
  relations: parsedRegistrationNumbers
};

const jsonPath = path.join(__dirname, 'subject-master-debug.json');
fs.writeFileSync(jsonPath, JSON.stringify(debugData, null, 2), 'utf-8');
console.log(`デバッグ用JSONファイルを生成しました: ${jsonPath}`);

/**
 * 登録番号をパースして構造化データを返す
 */
function parseRegistrationNumber(registrationNumber) {
  try {
    // 特殊ケースの処理
    if (registrationNumber.includes('構内車') || registrationNumber.includes('機内車')) {
      return {
        fullNumber: registrationNumber,
        region: '構内',
        categoryCode: '',
        suffix: '',
        sequenceNumber: registrationNumber.replace(/[^0-9]/g, ''),
      };
    }

    if (registrationNumber.includes('不明') || registrationNumber.includes('無') || registrationNumber.includes('新車')) {
      return {
        fullNumber: registrationNumber,
        region: '不明',
        categoryCode: '',
        suffix: '',
        sequenceNumber: '',
      };
    }

    // 通常のパターンを解析
    // より具体的なパターンマッチング
    const patterns = [
      // パターン1: 地域名（漢字・ひらがな） + 数字 + ひらがな + 区切り文字（任意） + 数字
      /^([ぁ-んァ-ヶー一-龯]+)(\d{2,3})([ぁ-んァ-ヶーをキ]+)([･・‣]*)(\d+)$/,
      // パターン2: 地域名 + 数字 + 文字 + 数字（区切り文字なし）
      /^([ぁ-んァ-ヶー一-龯]+)(\d{2,3})([ぁ-んァ-ヶーをキ]+)(\d+)$/,
    ];

    for (const pattern of patterns) {
      const match = registrationNumber.match(pattern);
      if (match) {
        const [, region, categoryCode, suffix, separator, sequenceNumber] = match;
        
        return {
          fullNumber: registrationNumber,
          region: region.trim(),
          categoryCode: categoryCode,
          suffix: suffix.replace(/[･・‣]/g, '').trim(),
          sequenceNumber: sequenceNumber || '',
        };
      }
    }

    // もしパターンにマッチしない場合、より簡単な分析を試す
    const firstDigitMatch = registrationNumber.match(/^([^0-9]+)(\d+)(.*)$/);
    if (firstDigitMatch) {
      const [, region, categoryStart, remaining] = firstDigitMatch;
      
      // 残りの部分から数字を分離
      const remainingMatch = remaining.match(/^([^0-9]*)(\d*)$/);
      if (remainingMatch) {
        const [, suffix, sequenceNumber] = remainingMatch;
        
        return {
          fullNumber: registrationNumber,
          region: region.trim(),
          categoryCode: categoryStart,
          suffix: suffix.replace(/[･・‣]/g, '').trim(),
          sequenceNumber: sequenceNumber,
        };
      }
    }

    return null;
    
  } catch (error) {
    console.error(`パースエラー: ${registrationNumber}`, error);
    return null;
  }
}