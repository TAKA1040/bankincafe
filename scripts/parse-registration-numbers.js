const fs = require('fs');
const path = require('path');
const csv = require('csv-parse/sync');

// CSVファイルを読み込む
const csvPath = path.join(__dirname, '..', '請求書システム画像', 'hondata', 'masuta.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// BOMを除去してCSVを解析
const cleanContent = csvContent.replace(/^\uFEFF/, '');
const records = csv.parse(cleanContent, {
  columns: true,
  skip_empty_lines: true
});

console.log(`総データ数: ${records.length}`);

// 登録番号をパースして構造化する
const parsedData = [];
const registrationNumbers = new Set();

records.forEach((record, index) => {
  const subject = record['件名'];
  const registrationNumber = record['登録番号'];
  
  if (!registrationNumber || registrationNumber.trim() === '') {
    console.log(`行 ${index + 2}: 登録番号が空です - ${subject}`);
    return;
  }

  // 登録番号をパースする
  const parsed = parseRegistrationNumber(registrationNumber.trim());
  
  if (parsed) {
    // 重複チェック
    const fullNumber = parsed.fullNumber;
    if (registrationNumbers.has(fullNumber)) {
      console.log(`重複発見: ${fullNumber} (${subject})`);
    } else {
      registrationNumbers.add(fullNumber);
      parsedData.push({
        subject,
        ...parsed
      });
    }
  } else {
    console.log(`行 ${index + 2}: パース失敗 - ${registrationNumber} (${subject})`);
  }
});

console.log(`\n解析結果:`);
console.log(`- 有効なレコード数: ${parsedData.length}`);
console.log(`- ユニークな登録番号: ${registrationNumbers.size}`);

// 地域別の統計
const regionStats = {};
parsedData.forEach(item => {
  const region = item.region || '不明';
  regionStats[region] = (regionStats[region] || 0) + 1;
});

console.log(`\n地域別統計:`);
Object.entries(regionStats)
  .sort(([,a], [,b]) => b - a)
  .forEach(([region, count]) => {
    console.log(`  ${region}: ${count}件`);
  });

// カテゴリコード別の統計
const categoryStats = {};
parsedData.forEach(item => {
  const category = item.categoryCode || '不明';
  categoryStats[category] = (categoryStats[category] || 0) + 1;
});

console.log(`\nカテゴリコード別統計 (上位10位):`);
Object.entries(categoryStats)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 10)
  .forEach(([category, count]) => {
    console.log(`  ${category}: ${count}件`);
  });

// SQLインサート文を生成
const sqlInserts = parsedData.map(item => {
  const values = [
    `'${item.fullNumber.replace(/'/g, "''")}'`, // registration_number
    `'${item.region?.replace(/'/g, "''") || ''}'`, // region
    `'${item.categoryCode || ''}'`, // category_code
    `'${item.suffix || ''}'`, // suffix
    `'${item.sequenceNumber || ''}'`, // sequence_number
    '0', // usage_count
    'NULL', // last_used_at
    'true', // is_active
    'NOW()', // created_at
    'NOW()' // updated_at
  ];
  
  return `INSERT INTO public.registration_number_master (registration_number, region, category_code, suffix, sequence_number, usage_count, last_used_at, is_active, created_at, updated_at) VALUES (${values.join(', ')});`;
});

// SQLファイルに出力
const sqlPath = path.join(__dirname, 'insert-registration-numbers.sql');
const sqlContent = [
  '-- 登録番号マスタデータ投入',
  '-- Generated from masuta.csv',
  `-- Total records: ${parsedData.length}`,
  '',
  '-- 既存データをクリア（必要に応じて）',
  '-- DELETE FROM public.registration_number_master;',
  '',
  ...sqlInserts,
  ''
].join('\n');

fs.writeFileSync(sqlPath, sqlContent, 'utf-8');
console.log(`\nSQLファイルを生成しました: ${sqlPath}`);

// JSONファイルにも出力（デバッグ用）
const jsonPath = path.join(__dirname, 'parsed-registration-numbers.json');
fs.writeFileSync(jsonPath, JSON.stringify(parsedData, null, 2), 'utf-8');
console.log(`JSONファイルを生成しました: ${jsonPath}`);

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
    // 例: "北九州101を50000", "筑豊130あ･794", "北九州100き･194" など
    
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
          region: cleanRegion(region),
          categoryCode: categoryCode,
          suffix: cleanSuffix(suffix),
          sequenceNumber: sequenceNumber || '',
        };
      }
    }

    // もしパターンにマッチしない場合、より簡単な分析を試す
    // 最初の数字の位置を見つける
    const firstDigitMatch = registrationNumber.match(/^([^0-9]+)(\d+)(.*)$/);
    if (firstDigitMatch) {
      const [, region, categoryStart, remaining] = firstDigitMatch;
      
      // 残りの部分から数字を分離
      const remainingMatch = remaining.match(/^([^0-9]*)(\d*)$/);
      if (remainingMatch) {
        const [, suffix, sequenceNumber] = remainingMatch;
        
        return {
          fullNumber: registrationNumber,
          region: cleanRegion(region),
          categoryCode: categoryStart,
          suffix: cleanSuffix(suffix),
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

/**
 * 地域名をクリーンアップ
 */
function cleanRegion(region) {
  return region.trim();
}

/**
 * 接尾辞をクリーンアップ
 */
function cleanSuffix(suffix) {
  return suffix.replace(/[･・]/g, '').trim();
}