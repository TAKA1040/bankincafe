const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('環境変数が設定されていません')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl)
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? '設定済み' : '未設定')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function insertSampleData() {
  try {
    console.log('Supabase接続テスト開始...')
    console.log('URL:', supabaseUrl)
    
    // テーブルアクセステスト
    console.log('テーブルアクセステスト...')
    
    try {
      const { data: testData, error: testError } = await supabase
        .from('subject_master')
        .select('*')
        .limit(1)
      
      console.log('subject_master テーブル接続成功')
      
    } catch (testErr) {
      console.error('テーブル接続エラー:', testErr)
      return
    }
    
    // 1. 件名マスタデータ投入
    console.log('件名マスタデータ投入開始...')
    const subjects = [
      { subject_name: 'KD物流株式会社', subject_name_kana: 'けーでぃーぶつりゅう' },
      { subject_name: 'Lib株式会社', subject_name_kana: 'りぶ' },
      { subject_name: 'くろがね工業株式会社', subject_name_kana: 'くろがねこうぎょう' },
      { subject_name: '株式会社バンテック九州', subject_name_kana: null },
      { subject_name: '株式会社バンテック', subject_name_kana: null },
      { subject_name: '株式会社サクラ物流', subject_name_kana: null },
      { subject_name: '鶴丸海運株式会社', subject_name_kana: null },
      { subject_name: '平和物流株式会社', subject_name_kana: null },
      { subject_name: '田村運輸株式会社', subject_name_kana: null },
      { subject_name: '三原物流株式会社', subject_name_kana: 'みはらぶつりゅう' }
    ]

    const { data: subjectData, error: subjectError } = await supabase
      .from('subject_master')
      .insert(subjects)
      .select()

    if (subjectError) {
      console.error('件名マスタ投入エラー:', subjectError)
    } else {
      console.log('件名マスタ投入成功:', subjectData.length, '件')
    }

    // 2. 登録番号マスタデータ投入
    console.log('登録番号マスタデータ投入開始...')
    const registrations = [
      { registration_number: '北九州101を50000', region: '北九州', category_code: '101', suffix: 'を', sequence_number: '50000', usage_count: 0, is_active: true },
      { registration_number: '北九州101か80000', region: '北九州', category_code: '101', suffix: 'か', sequence_number: '80000', usage_count: 0, is_active: true },
      { registration_number: '北九州111う･･･1', region: '北九州', category_code: '111', suffix: 'う', sequence_number: '1', usage_count: 0, is_active: true },
      { registration_number: '北九州130う･025', region: '北九州', category_code: '130', suffix: 'う', sequence_number: '025', usage_count: 0, is_active: true },
      { registration_number: '北九州100え･380', region: '北九州', category_code: '100', suffix: 'え', sequence_number: '380', usage_count: 0, is_active: true },
      { registration_number: '筑豊130あ･794', region: '筑豊', category_code: '130', suffix: 'あ', sequence_number: '794', usage_count: 0, is_active: true },
      { registration_number: '北九州100き･194', region: '北九州', category_code: '100', suffix: 'き', sequence_number: '194', usage_count: 0, is_active: true },
      { registration_number: '北九州130い･511', region: '北九州', category_code: '130', suffix: 'い', sequence_number: '511', usage_count: 0, is_active: true },
      { registration_number: '北九州100き･422', region: '北九州', category_code: '100', suffix: 'き', sequence_number: '422', usage_count: 0, is_active: true },
      { registration_number: '北九州100き･352', region: '北九州', category_code: '100', suffix: 'き', sequence_number: '352', usage_count: 0, is_active: true }
    ]

    const { data: registrationData, error: registrationError } = await supabase
      .from('registration_number_master')
      .insert(registrations)
      .select()

    if (registrationError) {
      console.error('登録番号マスタ投入エラー:', registrationError)
    } else {
      console.log('登録番号マスタ投入成功:', registrationData.length, '件')
    }

    // 3. 件名-登録番号関連データ投入
    if (subjectData && registrationData) {
      console.log('件名-登録番号関連データ投入開始...')
      
      const relations = [
        // KD物流株式会社
        { 
          subject_id: subjectData.find(s => s.subject_name === 'KD物流株式会社')?.id,
          registration_number_id: registrationData.find(r => r.registration_number === '北九州101か80000')?.id,
          is_primary: true, usage_count: 0
        },
        { 
          subject_id: subjectData.find(s => s.subject_name === 'KD物流株式会社')?.id,
          registration_number_id: registrationData.find(r => r.registration_number === '北九州130う･025')?.id,
          is_primary: false, usage_count: 0
        },
        // 株式会社バンテック
        { 
          subject_id: subjectData.find(s => s.subject_name === '株式会社バンテック')?.id,
          registration_number_id: registrationData.find(r => r.registration_number === '北九州100え･380')?.id,
          is_primary: true, usage_count: 0
        },
        // 株式会社サクラ物流
        { 
          subject_id: subjectData.find(s => s.subject_name === '株式会社サクラ物流')?.id,
          registration_number_id: registrationData.find(r => r.registration_number === '筑豊130あ･794')?.id,
          is_primary: true, usage_count: 0
        },
        // 田村運輸株式会社
        { 
          subject_id: subjectData.find(s => s.subject_name === '田村運輸株式会社')?.id,
          registration_number_id: registrationData.find(r => r.registration_number === '北九州100き･422')?.id,
          is_primary: true, usage_count: 0
        },
        { 
          subject_id: subjectData.find(s => s.subject_name === '田村運輸株式会社')?.id,
          registration_number_id: registrationData.find(r => r.registration_number === '北九州100き･194')?.id,
          is_primary: false, usage_count: 0
        },
        // 三原物流株式会社
        { 
          subject_id: subjectData.find(s => s.subject_name === '三原物流株式会社')?.id,
          registration_number_id: registrationData.find(r => r.registration_number === '北九州100き･352')?.id,
          is_primary: true, usage_count: 0
        }
      ].filter(r => r.subject_id && r.registration_number_id) // 有効なIDのみ

      const { data: relationData, error: relationError } = await supabase
        .from('subject_registration_numbers')
        .insert(relations)
        .select()

      if (relationError) {
        console.error('関連データ投入エラー:', relationError)
      } else {
        console.log('関連データ投入成功:', relationData.length, '件')
      }
    }

    // 4. 結果確認
    console.log('\n=== データ投入結果確認 ===')
    
    const { data: finalSubjects, error: finalSubjectsError } = await supabase
      .from('subject_master')
      .select('*')
    
    const { data: finalRegistrations, error: finalRegistrationsError } = await supabase
      .from('registration_number_master')
      .select('*')
      
    const { data: finalRelations, error: finalRelationsError } = await supabase
      .from('subject_registration_numbers')
      .select('*')

    console.log('件名マスタ件数:', finalSubjects?.length || 0)
    console.log('登録番号マスタ件数:', finalRegistrations?.length || 0)
    console.log('関連データ件数:', finalRelations?.length || 0)
    
    if (finalSubjectsError) console.error('件名マスタ確認エラー:', finalSubjectsError)
    if (finalRegistrationsError) console.error('登録番号マスタ確認エラー:', finalRegistrationsError)
    if (finalRelationsError) console.error('関連データ確認エラー:', finalRelationsError)

    console.log('\nデータ投入完了！')
    
  } catch (error) {
    console.error('予期しないエラー:', error)
  }
}

insertSampleData()