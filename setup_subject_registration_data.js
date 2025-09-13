const { createClient } = require('@supabase/supabase-js');

// Supabaseクライアント初期化
const supabaseUrl = 'https://auwmmosfteomieyexkeh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1d21tb3NmdGVvbWlleWV4a2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzcxNTYsImV4cCI6MjA3MTAxMzE1Nn0.9SsGplOy1PQak1y7WLfzadvTOfm4NuuX8254lEctvj0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function setupSubjectRegistrationData() {
  try {
    console.log('=== 件名・登録番号関連データの設定を開始 ===');

    // 件名データ
    const subjects = [
      { subject_name: 'フロントバンパー修理', subject_name_kana: 'フロントバンパーシュウリ' },
      { subject_name: 'リアバンパー修理', subject_name_kana: 'リアバンパーシュウリ' },
      { subject_name: 'ドア修理', subject_name_kana: 'ドアシュウリ' },
      { subject_name: 'フェンダー修理', subject_name_kana: 'フェンダーシュウリ' },
      { subject_name: 'ボンネット修理', subject_name_kana: 'ボンネットシュウリ' },
      { subject_name: '全体塗装', subject_name_kana: 'ゼンタイトソウ' },
      { subject_name: 'エンジン修理', subject_name_kana: 'エンジンシュウリ' },
      { subject_name: '事故修理', subject_name_kana: 'ジコシュウリ' },
    ];

    // 登録番号データ
    const registrations = [
      'つくば500あ1234',
      'つくば500あ5678',
      'つくば300あ9876',
      'つくば300い2345',
      'つくば100さ6789',
      'つくば100た1111',
      'つくば500う2222',
      'つくば300え3333',
      'つくば100お4444',
      'つくば500か5555',
    ];

    // 既存データをクリア（開発用）
    await supabase.from('subject_registration_numbers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('subject_master').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('registration_number_master').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log('既存データをクリアしました');

    // 件名データ挿入
    const { data: insertedSubjects, error: subjectError } = await supabase
      .from('subject_master')
      .insert(subjects)
      .select('id, subject_name');

    if (subjectError) {
      console.error('件名データ挿入エラー:', subjectError);
      return;
    }

    console.log(`件名データを${insertedSubjects.length}件挿入しました`);

    // 登録番号データ挿入
    const registrationData = registrations.map(reg => ({
      registration_number: reg,
      usage_count: Math.floor(Math.random() * 20) + 1
    }));

    const { data: insertedRegistrations, error: registrationError } = await supabase
      .from('registration_number_master')
      .insert(registrationData)
      .select('id, registration_number');

    if (registrationError) {
      console.error('登録番号データ挿入エラー:', registrationError);
      return;
    }

    console.log(`登録番号データを${insertedRegistrations.length}件挿入しました`);

    // 件名-登録番号関連データの作成
    const relationships = [];
    
    // 各件名に対してランダムに2-4個の登録番号を関連付け
    for (const subject of insertedSubjects) {
      const numRelations = Math.floor(Math.random() * 3) + 2; // 2-4個
      const shuffledRegistrations = [...insertedRegistrations].sort(() => Math.random() - 0.5);
      
      for (let i = 0; i < numRelations; i++) {
        relationships.push({
          subject_id: subject.id,
          registration_number_id: shuffledRegistrations[i].id,
          is_primary: i === 0, // 最初の関連を主要とする
          usage_count: Math.floor(Math.random() * 15) + 1,
          last_used_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
        });
      }
    }

    const { error: relationshipError } = await supabase
      .from('subject_registration_numbers')
      .insert(relationships);

    if (relationshipError) {
      console.error('関連データ挿入エラー:', relationshipError);
      return;
    }

    console.log(`件名-登録番号関連データを${relationships.length}件挿入しました`);

    // 結果確認
    const { data: finalCheck, error: checkError } = await supabase
      .from('subject_registration_numbers')
      .select(`
        subject_master(subject_name),
        registration_number_master(registration_number),
        is_primary,
        usage_count
      `);

    if (checkError) {
      console.error('データ確認エラー:', checkError);
      return;
    }

    console.log('\n=== 作成された関連データの確認 ===');
    const grouped = {};
    finalCheck.forEach(item => {
      const subjectName = item.subject_master.subject_name;
      if (!grouped[subjectName]) {
        grouped[subjectName] = [];
      }
      grouped[subjectName].push({
        registration: item.registration_number_master.registration_number,
        isPrimary: item.is_primary,
        usage: item.usage_count
      });
    });

    Object.keys(grouped).forEach(subject => {
      console.log(`\n${subject}:`);
      grouped[subject]
        .sort((a, b) => b.isPrimary - a.isPrimary || b.usage - a.usage)
        .forEach(reg => {
          console.log(`  - ${reg.registration} (${reg.isPrimary ? 'プライマリ' : '通常'}, 使用回数: ${reg.usage})`);
        });
    });

    console.log('\n=== データ設定完了 ===');
    
  } catch (error) {
    console.error('予期しないエラー:', error);
  }
}

// 実行
setupSubjectRegistrationData();