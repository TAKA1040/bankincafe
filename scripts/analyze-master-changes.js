const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://auwmmosfteomieyexkeh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1d21tb3NmdGVvbWlleWV4a2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzcxNTYsImV4cCI6MjA3MTAxMzE1Nn0.9SsGplOy1PQak1y7WLfzadvTOfm4NuuX8254lEctvj0'
)

async function analyzeMasterChanges() {
  try {
    console.log('=== マスタデータの変更・修正パターン分析 ===\n')
    
    // 1. 既存の請求書データから修正版番号パターンを分析
    console.log('1. 既存請求書データから修正版番号パターンを分析...')
    const { data: invoices } = await supabase
      .from('invoices')
      .select('invoice_number, subject_name, registration_number, created_at')
      .order('created_at', { ascending: true })
      .limit(500)
    
    if (!invoices) {
      console.log('請求書データがありません')
      return
    }
    
    console.log(`請求書データ件数: ${invoices.length}件`)
    
    // 修正版番号パターンを解析
    const revisionPatterns = new Map()
    const subjectChanges = new Map()
    const registrationChanges = new Map()
    
    invoices.forEach(invoice => {
      const match = invoice.invoice_number.match(/^(\d{8})-(\d)$/)
      if (match) {
        const baseNumber = match[1]
        const revision = parseInt(match[2])
        
        if (!revisionPatterns.has(baseNumber)) {
          revisionPatterns.set(baseNumber, [])
        }
        
        revisionPatterns.get(baseNumber).push({
          revision,
          subject_name: invoice.subject_name,
          registration_number: invoice.registration_number,
          created_at: invoice.created_at
        })
      }
    })
    
    console.log(`ユニーク請求書基番: ${revisionPatterns.size}件`)
    
    // 修正版がある請求書を特定
    const hasRevisions = []
    revisionPatterns.forEach((revisions, baseNumber) => {
      if (revisions.length > 1) {
        hasRevisions.push({
          baseNumber,
          revisions: revisions.sort((a, b) => a.revision - b.revision)
        })
      }
    })
    
    console.log(`修正版がある請求書: ${hasRevisions.length}件\n`)
    
    // 2. 具体的な変更パターンを分析
    console.log('2. 具体的な変更パターンを分析...')
    
    hasRevisions.slice(0, 10).forEach((item, index) => {
      console.log(`--- 修正例 ${index + 1}: ${item.baseNumber} ---`)
      item.revisions.forEach(rev => {
        console.log(`  -${rev.revision}: ${rev.subject_name} / ${rev.registration_number}`)
      })
      
      // 変更点を特定
      for (let i = 1; i < item.revisions.length; i++) {
        const prev = item.revisions[i - 1]
        const curr = item.revisions[i]
        
        if (prev.subject_name !== curr.subject_name) {
          console.log(`    → 件名変更: "${prev.subject_name}" → "${curr.subject_name}"`)
        }
        
        if (prev.registration_number !== curr.registration_number) {
          console.log(`    → 登録番号変更: "${prev.registration_number}" → "${curr.registration_number}"`)
        }
      }
      console.log()
    })
    
    // 3. 件名マスタで重複・類似データを検出
    console.log('3. 件名マスタの重複・類似データを検出...')
    
    const { data: subjects } = await supabase
      .from('subject_master')
      .select('id, subject_name, subject_name_kana')
      .order('subject_name')
    
    console.log(`件名マスタ総数: ${subjects?.length || 0}件`)
    
    // 類似件名を検出（部分一致、空白差異など）
    const similarSubjects = []
    for (let i = 0; i < subjects.length; i++) {
      for (let j = i + 1; j < subjects.length; j++) {
        const name1 = subjects[i].subject_name.trim().replace(/\s+/g, '')
        const name2 = subjects[j].subject_name.trim().replace(/\s+/g, '')
        
        // 90%以上の類似度
        if (calculateSimilarity(name1, name2) > 0.9 && name1 !== name2) {
          similarSubjects.push({
            subject1: subjects[i],
            subject2: subjects[j],
            similarity: calculateSimilarity(name1, name2)
          })
        }
      }
    }
    
    console.log(`類似件名ペア: ${similarSubjects.length}件`)
    similarSubjects.slice(0, 5).forEach((pair, index) => {
      console.log(`${index + 1}. "${pair.subject1.subject_name}" ≈ "${pair.subject2.subject_name}" (${(pair.similarity*100).toFixed(1)}%)`)
    })
    
    // 4. 登録番号マスタで重複・類似データを検出
    console.log('\n4. 登録番号マスタの重複・類似データを検出...')
    
    const { data: registrations } = await supabase
      .from('registration_number_master')
      .select('id, registration_number')
      .order('registration_number')
    
    console.log(`登録番号マスタ総数: ${registrations?.length || 0}件`)
    
    // 類似登録番号を検出
    const similarRegistrations = []
    for (let i = 0; i < registrations.length; i++) {
      for (let j = i + 1; j < registrations.length; j++) {
        const reg1 = registrations[i].registration_number.replace(/[・･\s]/g, '')
        const reg2 = registrations[j].registration_number.replace(/[・･\s]/g, '')
        
        if (calculateSimilarity(reg1, reg2) > 0.9 && reg1 !== reg2) {
          similarRegistrations.push({
            reg1: registrations[i],
            reg2: registrations[j],
            similarity: calculateSimilarity(reg1, reg2)
          })
        }
      }
    }
    
    console.log(`類似登録番号ペア: ${similarRegistrations.length}件`)
    similarRegistrations.slice(0, 5).forEach((pair, index) => {
      console.log(`${index + 1}. "${pair.reg1.registration_number}" ≈ "${pair.reg2.registration_number}" (${(pair.similarity*100).toFixed(1)}%)`)
    })
    
    // 5. 実際の請求書データでマスタの不一致を確認
    console.log('\n5. 請求書データとマスタの不一致を確認...')
    
    const subjectNames = new Set(subjects.map(s => s.subject_name))
    const regNumbers = new Set(registrations.map(r => r.registration_number))
    
    const unmatchedSubjects = []
    const unmatchedRegistrations = []
    
    invoices.forEach(invoice => {
      if (!subjectNames.has(invoice.subject_name)) {
        unmatchedSubjects.push(invoice.subject_name)
      }
      if (!regNumbers.has(invoice.registration_number)) {
        unmatchedRegistrations.push(invoice.registration_number)
      }
    })
    
    console.log(`マスタに存在しない件名: ${Array.from(new Set(unmatchedSubjects)).length}件`)
    console.log(`マスタに存在しない登録番号: ${Array.from(new Set(unmatchedRegistrations)).length}件`)
    
    if (unmatchedSubjects.length > 0) {
      console.log('マスタに存在しない件名の例:')
      const uniqueSubjects = Array.from(new Set(unmatchedSubjects))
      uniqueSubjects.slice(0, 3).forEach(name => {
        console.log(`  - "${name}"`)
      })
    }
    
    if (unmatchedRegistrations.length > 0) {
      console.log('マスタに存在しない登録番号の例:')
      const uniqueRegistrations = Array.from(new Set(unmatchedRegistrations))
      uniqueRegistrations.slice(0, 3).forEach(reg => {
        console.log(`  - "${reg}"`)
      })
    }
    
  } catch (error) {
    console.error('エラー:', error)
  }
}

// 文字列類似度を計算（Jaccard係数）
function calculateSimilarity(str1, str2) {
  const set1 = new Set(str1)
  const set2 = new Set(str2)
  const intersection = new Set([...set1].filter(x => set2.has(x)))
  const union = new Set([...set1, ...set2])
  return intersection.size / union.size
}

analyzeMasterChanges()