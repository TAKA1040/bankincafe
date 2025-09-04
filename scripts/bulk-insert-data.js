const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function bulkInsertData() {
  try {
    console.log('一括データ投入開始...');
    
    // デバッグ用JSONファイルを読み込み
    const debugDataPath = path.join(__dirname, 'subject-master-debug.json');
    if (!fs.existsSync(debugDataPath)) {
      console.error('デバッグファイルが見つかりません:', debugDataPath);
      return;
    }
    
    const debugData = JSON.parse(fs.readFileSync(debugDataPath, 'utf-8'));
    console.log('読み込み完了:');
    console.log(`  件名データ: ${debugData.subjects.length}件`);
    console.log(`  登録番号データ: ${debugData.registrationNumbers.length}件`);
    console.log(`  関連データ: ${debugData.relations.length}件`);
    
    // 既存データを削除
    console.log('\n既存データ削除中...');
    await supabase.from('subject_registration_numbers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('registration_number_master').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('subject_master').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log('既存データ削除完了');
    
    // 件名マスタデータ投入（camelCase → snake_case変換）
    console.log('\n件名マスタデータ投入中...');
    const subjectBatchSize = 50;
    for (let i = 0; i < debugData.subjects.length; i += subjectBatchSize) {
      const batch = debugData.subjects.slice(i, i + subjectBatchSize).map(subject => ({
        subject_name: subject.subjectName,
        subject_name_kana: subject.subjectNameKana
      }));
      const { data, error } = await supabase
        .from('subject_master')
        .insert(batch)
        .select('id, subject_name');
      
      if (error) {
        console.error(`件名マスタ投入エラー (batch ${Math.floor(i/subjectBatchSize) + 1}):`, error);
        continue;
      }
      
      console.log(`件名マスタ投入進捗: ${Math.min(i + subjectBatchSize, debugData.subjects.length)}/${debugData.subjects.length} 件`);
    }
    
    // 登録番号マスタデータ投入（camelCase → snake_case変換）
    console.log('\n登録番号マスタデータ投入中...');
    const regBatchSize = 100;
    for (let i = 0; i < debugData.registrationNumbers.length; i += regBatchSize) {
      const batch = debugData.registrationNumbers.slice(i, i + regBatchSize).map(reg => ({
        registration_number: reg.registrationNumber,
        region: reg.region,
        category_code: reg.categoryCode,
        suffix: reg.suffix,
        sequence_number: reg.sequenceNumber,
        usage_count: reg.usageCount || 0,
        last_used_at: reg.lastUsedAt,
        is_active: reg.isActive !== undefined ? reg.isActive : true
      }));
      const { data, error } = await supabase
        .from('registration_number_master')
        .insert(batch)
        .select('id, registration_number');
      
      if (error) {
        console.error(`登録番号マスタ投入エラー (batch ${Math.floor(i/regBatchSize) + 1}):`, error);
        continue;
      }
      
      console.log(`登録番号マスタ投入進捗: ${Math.min(i + regBatchSize, debugData.registrationNumbers.length)}/${debugData.registrationNumbers.length} 件`);
    }
    
    // 件名IDと登録番号IDを再取得して関連データを作成
    console.log('\n関連データ作成中...');
    const { data: subjects } = await supabase
      .from('subject_master')
      .select('id, subject_name');
      
    const { data: regNumbers } = await supabase
      .from('registration_number_master')
      .select('id, registration_number');
    
    // 名前→IDのマップを作成
    const subjectMap = new Map(subjects.map(s => [s.subject_name, s.id]));
    const regNumberMap = new Map(regNumbers.map(r => [r.registration_number, r.id]));
    
    // 関連データのIDを設定（camelCase → snake_case変換）
    const relationsWithIds = debugData.relations.map(rel => ({
      subject_id: subjectMap.get(rel.subjectName),
      registration_number_id: regNumberMap.get(rel.registrationNumber),
      is_primary: rel.isPrimary || false,
      usage_count: rel.usageCount || 0,
      last_used_at: rel.lastUsedAt || null
    })).filter(rel => rel.subject_id && rel.registration_number_id);
    
    console.log(`有効な関連データ: ${relationsWithIds.length}件`);
    
    // 関連データ投入
    const relBatchSize = 100;
    for (let i = 0; i < relationsWithIds.length; i += relBatchSize) {
      const batch = relationsWithIds.slice(i, i + relBatchSize);
      const { data, error } = await supabase
        .from('subject_registration_numbers')
        .insert(batch);
      
      if (error) {
        console.error(`関連データ投入エラー (batch ${Math.floor(i/relBatchSize) + 1}):`, error);
        continue;
      }
      
      console.log(`関連データ投入進捗: ${Math.min(i + relBatchSize, relationsWithIds.length)}/${relationsWithIds.length} 件`);
    }
    
    // 最終確認
    console.log('\n=== 最終データ件数確認 ===');
    const { count: subjectCount } = await supabase
      .from('subject_master')
      .select('*', { count: 'exact', head: true });
    
    const { count: regCount } = await supabase
      .from('registration_number_master')
      .select('*', { count: 'exact', head: true });
      
    const { count: relCount } = await supabase
      .from('subject_registration_numbers')
      .select('*', { count: 'exact', head: true });
    
    console.log(`件名マスタ: ${subjectCount}件`);
    console.log(`登録番号マスタ: ${regCount}件`);
    console.log(`関連データ: ${relCount}件`);
    console.log('\n一括データ投入完了！');
    
  } catch (error) {
    console.error('一括投入中にエラー:', error);
  }
}

bulkInsertData();