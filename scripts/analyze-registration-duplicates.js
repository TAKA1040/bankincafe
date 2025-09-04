const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://auwmmosfteomieyexkeh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1d21tb3NmdGVvbWlleWV4a2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzcxNTYsImV4cCI6MjA3MTAxMzE1Nn0.9SsGplOy1PQak1y7WLfzadvTOfm4NuuX8254lEctvj0'
)

async function analyzeRegistrationDuplicates() {
  try {
    console.log('=== 登録番号マスタの重複・類似パターン詳細分析 ===\n')
    
    // 1. 全登録番号を取得
    const { data: registrations } = await supabase
      .from('registration_number_master')
      .select('id, registration_number, region, category_code, suffix, sequence_number')
      .order('registration_number')
    
    console.log(`登録番号マスタ総数: ${registrations?.length || 0}件\n`)
    
    // 2. 重複パターン分析
    const duplicateGroups = new Map()
    const exactDuplicates = []
    const categoryCodeChanges = []
    const suffixChanges = []
    const sequenceChanges = []
    
    // 地域+カテゴリ+サフィックスでグループ化
    const baseGroups = new Map()
    registrations.forEach(reg => {
      const baseKey = `${reg.region}${reg.category_code}${reg.suffix}`
      if (!baseGroups.has(baseKey)) {
        baseGroups.set(baseKey, [])
      }
      baseGroups.get(baseKey).push(reg)
    })
    
    console.log('重複パターン分析:')
    
    baseGroups.forEach((group, baseKey) => {
      if (group.length > 1) {
        console.log(`\n--- ${baseKey} グループ (${group.length}件) ---`)
        
        // 完全重複チェック
        const regNumbers = group.map(r => r.registration_number)
        const uniqueNumbers = [...new Set(regNumbers)]
        
        if (uniqueNumbers.length < regNumbers.length) {
          console.log('  ⚠️  完全重複あり:')
          uniqueNumbers.forEach(num => {
            const count = regNumbers.filter(r => r === num).length
            if (count > 1) {
              console.log(`    "${num}" x${count}件`)
              exactDuplicates.push({
                registration_number: num,
                count: count,
                ids: group.filter(r => r.registration_number === num).map(r => r.id)
              })
            }
          })
        }
        
        // カテゴリコード変更パターン
        const categories = [...new Set(group.map(r => r.category_code))]
        if (categories.length > 1) {
          console.log(`  📝 カテゴリコード変更: ${categories.join(' → ')}`)
          categoryCodeChanges.push({
            baseKey,
            categories,
            registrations: group
          })
        }
        
        // サフィックス変更パターン
        const suffixes = [...new Set(group.map(r => r.suffix))]
        if (suffixes.length > 1) {
          console.log(`  📝 サフィックス変更: ${suffixes.join(' → ')}`)
          suffixChanges.push({
            baseKey,
            suffixes,
            registrations: group
          })
        }
        
        // 具体例を5件まで表示
        group.slice(0, 5).forEach(reg => {
          console.log(`    ${reg.registration_number} (ID: ${reg.id.slice(0, 8)}...)`)
        })
        
        if (group.length > 5) {
          console.log(`    ...他${group.length - 5}件`)
        }
      }
    })
    
    // 3. 統計サマリー
    console.log('\n=== 統計サマリー ===')
    console.log(`完全重複: ${exactDuplicates.length}グループ`)
    console.log(`カテゴリコード変更: ${categoryCodeChanges.length}グループ`)
    console.log(`サフィックス変更: ${suffixChanges.length}グループ`)
    
    // 4. 実際の請求書データで使用されている重複登録番号
    console.log('\n4. 請求書で使用されている重複登録番号を確認...')
    
    const { data: invoices } = await supabase
      .from('invoices')
      .select('registration_number')
    
    if (invoices) {
      const usedRegistrations = new Set(invoices.map(i => i.registration_number))
      
      console.log(`請求書で使用されている登録番号: ${usedRegistrations.size}件`)
      
      // 使用されている重複登録番号
      const usedDuplicates = exactDuplicates.filter(dup => 
        usedRegistrations.has(dup.registration_number)
      )
      
      console.log(`使用されている完全重複: ${usedDuplicates.length}件`)
      
      if (usedDuplicates.length > 0) {
        console.log('使用されている重複登録番号の例:')
        usedDuplicates.slice(0, 3).forEach(dup => {
          console.log(`  "${dup.registration_number}" (${dup.count}件重複)`)
        })
      }
    }
    
    // 5. 修正提案
    console.log('\n=== 修正提案 ===')
    
    if (exactDuplicates.length > 0) {
      console.log('1. 完全重複の統合:')
      console.log('   - 最も古いレコードを残し、他は削除')
      console.log('   - 関連付けデータ(subject_registration_numbers)の統合')
    }
    
    if (categoryCodeChanges.length > 0) {
      console.log('2. カテゴリコード変更の履歴化:')
      console.log('   - 変更履歴テーブルの作成')
      console.log('   - 最新版のみをマスタに保持')
    }
    
    if (suffixChanges.length > 0) {
      console.log('3. サフィックス変更の履歴化:')
      console.log('   - 変更履歴テーブルの作成')
      console.log('   - 最新版のみをマスタに保持')
    }
    
  } catch (error) {
    console.error('エラー:', error)
  }
}

analyzeRegistrationDuplicates()