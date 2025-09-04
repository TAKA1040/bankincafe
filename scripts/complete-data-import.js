const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

const supabase = createClient(
  'https://auwmmosfteomieyexkeh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1d21tb3NmdGVvbWlleWV4a2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzcxNTYsImV4cCI6MjA3MTAxMzE1Nn0.9SsGplOy1PQak1y7WLfzadvTOfm4NuuX8254lEctvj0'
)

async function completeDataImport() {
  try {
    console.log('=== 完全データインポート開始 ===\n')
    
    // 1. 元のCSVデータを読み込み
    const masutaPath = 'C:\\Windsurf\\bankincafe\\請求書システム画像\\hondata\\masuta.csv'
    const kenmeiPath = 'C:\\Windsurf\\bankincafe\\請求書システム画像\\hondata\\kenmei_yomigana.csv'
    
    const masutaContent = fs.readFileSync(masutaPath, 'utf-8')
    const kenmeiContent = fs.readFileSync(kenmeiPath, 'utf-8')
    
    // 2. masuta.csvをパース（件名-登録番号の関係）
    const masutaLines = masutaContent.trim().split('\n').slice(1) // ヘッダーを除く
    console.log(`masuta.csv: ${masutaLines.length}件の関係データ`)
    
    // 3. kenmei_yomigana.csvをパース（件名-読み仮名）
    const kenmeiLines = kenmeiContent.trim().split('\n').slice(1) // ヘッダーを除く
    const kenmeiMap = new Map()
    
    kenmeiLines.forEach(line => {
      const [subjectName, kana] = line.split(',')
      if (subjectName && kana) {
        kenmeiMap.set(subjectName.trim(), kana.trim())
      }
    })
    console.log(`kenmei_yomigana.csv: ${kenmeiMap.size}件の読み仮名データ`)
    
    // 4. データを整理
    const subjectSet = new Set()
    const registrationSet = new Set()
    const relations = []
    
    masutaLines.forEach(line => {
      const [subjectName, registrationNumber] = line.split(',')
      if (subjectName && registrationNumber) {
        const cleanSubject = subjectName.trim()
        const cleanReg = registrationNumber.trim()
        
        subjectSet.add(cleanSubject)
        registrationSet.add(cleanReg)
        relations.push({
          subjectName: cleanSubject,
          registrationNumber: cleanReg
        })
      }
    })
    
    console.log(`ユニーク件名: ${subjectSet.size}件`)
    console.log(`ユニーク登録番号: ${registrationSet.size}件`)
    console.log(`関係データ: ${relations.length}件\n`)
    
    // 5. 既存の件名マスタと登録番号マスタを取得
    console.log('既存マスタデータ取得中...')
    const { data: existingSubjects } = await supabase
      .from('subject_master')
      .select('id, subject_name')
    
    const { data: existingRegistrations } = await supabase
      .from('registration_number_master')
      .select('id, registration_number')
    
    console.log(`既存件名マスタ: ${existingSubjects?.length || 0}件`)
    console.log(`既存登録番号マスタ: ${existingRegistrations?.length || 0}件`)
    
    // 6. マップを作成（名前→ID）
    const subjectNameToId = new Map()
    const regNumberToId = new Map()
    
    existingSubjects?.forEach(s => {
      subjectNameToId.set(s.subject_name, s.id)
    })
    
    existingRegistrations?.forEach(r => {
      regNumberToId.set(r.registration_number, r.id)
    })
    
    // 7. 不足している件名と登録番号を特定
    const missingSubjects = []
    const missingRegistrations = []
    
    subjectSet.forEach(name => {
      if (!subjectNameToId.has(name)) {
        missingSubjects.push({
          subject_name: name,
          subject_name_kana: kenmeiMap.get(name) || null
        })
      }
    })
    
    registrationSet.forEach(number => {
      if (!regNumberToId.has(number)) {
        // 登録番号をパース
        const parsed = parseRegistrationNumber(number)
        missingRegistrations.push({
          registration_number: number,
          region: parsed.region,
          category_code: parsed.categoryCode,
          suffix: parsed.suffix,
          sequence_number: parsed.sequenceNumber,
          usage_count: 0,
          last_used_at: null
        })
      }
    })
    
    console.log(`不足件名: ${missingSubjects.length}件`)
    console.log(`不足登録番号: ${missingRegistrations.length}件`)
    
    // 8. 不足データを追加
    if (missingSubjects.length > 0) {
      console.log('不足件名を追加中...')
      const { data: newSubjects, error: subjectError } = await supabase
        .from('subject_master')
        .insert(missingSubjects)
        .select('id, subject_name')
      
      if (subjectError) throw subjectError
      
      newSubjects.forEach(s => {
        subjectNameToId.set(s.subject_name, s.id)
      })
      console.log(`${newSubjects.length}件の件名を追加`)
    }
    
    if (missingRegistrations.length > 0) {
      console.log('不足登録番号を追加中...')
      const batchSize = 100
      for (let i = 0; i < missingRegistrations.length; i += batchSize) {
        const batch = missingRegistrations.slice(i, i + batchSize)
        const { data: newRegs, error: regError } = await supabase
          .from('registration_number_master')
          .insert(batch)
          .select('id, registration_number')
        
        if (regError) throw regError
        
        newRegs.forEach(r => {
          regNumberToId.set(r.registration_number, r.id)
        })
      }
      console.log(`${missingRegistrations.length}件の登録番号を追加`)
    }
    
    // 9. 既存の関連データを削除して再作成
    console.log('既存関連データを削除中...')
    await supabase.from('subject_registration_numbers').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    
    // 10. 全関連データを作成
    console.log('関連データを作成中...')
    const relationData = relations.map(rel => ({
      subject_id: subjectNameToId.get(rel.subjectName),
      registration_number_id: regNumberToId.get(rel.registrationNumber),
      is_primary: false,
      usage_count: 0,
      last_used_at: null
    })).filter(rel => rel.subject_id && rel.registration_number_id)
    
    console.log(`作成する関連データ: ${relationData.length}件`)
    
    const batchSize = 100
    let insertedCount = 0
    for (let i = 0; i < relationData.length; i += batchSize) {
      const batch = relationData.slice(i, i + batchSize)
      const { data, error } = await supabase
        .from('subject_registration_numbers')
        .insert(batch)
      
      if (error) {
        console.error(`関連データ投入エラー (batch ${Math.floor(i/batchSize) + 1}):`, error)
        continue
      }
      
      insertedCount += batch.length
      console.log(`進捗: ${insertedCount}/${relationData.length}`)
    }
    
    console.log(`\n=== 完了 ===`)
    console.log(`関連データ投入完了: ${insertedCount}件`)
    
  } catch (error) {
    console.error('エラー:', error)
  }
}

function parseRegistrationNumber(regNumber) {
  // "北九州101を50000" → {region: "北九州", categoryCode: "101", suffix: "を", sequenceNumber: "50000"}
  const match = regNumber.match(/^(.+?)(\d+)([ひらがな・カタカナ\w]+)(.*)$/)
  if (match) {
    return {
      region: match[1],
      categoryCode: match[2],  
      suffix: match[3].replace(/[･・]/g, ''),
      sequenceNumber: match[4] || '1'
    }
  }
  return {
    region: regNumber.substring(0, 3) || '不明',
    categoryCode: '000',
    suffix: 'あ',
    sequenceNumber: '1'
  }
}

completeDataImport()