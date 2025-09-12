import { supabase } from '@/lib/supabase'

// 対象マスタの型定義
interface Target {
  id: number
  name: string
  reading?: string | null
}

// 対象マスタのキャッシュ
let targetCache: Target[] | null = null

/**
 * 対象マスタを取得（キャッシュ機能付き）
 */
async function getTargets(): Promise<Target[]> {
  // // console.log('🔍 getTargets() called - checking cache...')
  if (targetCache) {
    // // console.log('✅ Using cached targets:', targetCache.length, 'items')
    return targetCache
  }

  // // console.log('🔄 Fetching targets from Supabase...')
  const { data: targets, error } = await supabase
    .from('targets')
    .select('id, name, reading')
    .eq('is_active', true)
    .order('name')

  // // console.log('📊 Supabase response:', { 
    dataCount: targets?.length || 0, 
    error: error?.message || null,
    firstFewTargets: targets?.slice(0, 3)
  })

  if (error) {
    console.error('❌ 対象マスタ取得エラー:', error)
    return []
  }

  if (!targets || targets.length === 0) {
    console.warn('⚠️ No targets found in database!')
    return []
  }

  // null -> undefined 変換で型安全性を向上
  targetCache = (targets || []).map(target => ({
    ...target,
    reading: target.reading ?? undefined
  }))
  
  // // console.log('✅ Targets cached successfully:', targetCache.length, 'items')
  // // console.log('🎯 First few targets:', targetCache.slice(0, 5).map(t => t.name))
  return targetCache
}

/**
 * 作業名から正しい対象を抽出する
 * 例: "DPFセンサー交換 アウター前外 その他１" -> "DPFセンサー"
 */
export async function extractTargetFromWorkName(workName: string): Promise<string | null> {
  // // console.log('🎯 extractTargetFromWorkName called with:', workName)
  if (!workName) {
    // // console.log('⚠️ Empty workName provided')
    return null
  }

  try {
    const targets = await getTargets()
    // // console.log('📋 Available targets for matching:', targets.length)
    
    if (targets.length === 0) {
      console.warn('❌ No targets available for matching!')
      return null
    }

    // 対象マスタと作業名をマッチング（長い順にソートして最適マッチを優先）
    const sortedTargets = targets.sort((a, b) => b.name.length - a.name.length)
    // // console.log('🔄 Starting target matching for:', workName)
    
    // 完全マッチを優先
    for (const target of sortedTargets) {
      if (workName.includes(target.name)) {
        // // console.log('✅ EXACT MATCH found:', target.name, 'in', workName)
        return target.name
      }
    }

    // 部分マッチ（より柔軟なマッチング）
    for (const target of sortedTargets) {
      const targetWords = target.name.split(/[\s・]/);
      const matchCount = targetWords.filter(word => 
        word.length > 0 && workName.includes(word)
      ).length;
      
      // 対象の構成要素の50%以上がマッチした場合
      const threshold = Math.ceil(targetWords.length * 0.5);
      if (matchCount >= threshold) {
        // // console.log('✅ PARTIAL MATCH found:', target.name, `(${matchCount}/${targetWords.length} words matched)`)
        return target.name
      }
    }

    // // console.log('❌ No target match found for:', workName)
    return null
  } catch (error) {
    console.error('💥 対象抽出エラー:', error)
    return null
  }
}

/**
 * 複数の作業名から対象を一括抽出
 */
export async function extractTargetsFromWorkNames(workNames: string[]): Promise<(string | null)[]> {
  return Promise.all(workNames.map(name => extractTargetFromWorkName(name)))
}

/**
 * 対象マスタキャッシュをクリア（テスト用）
 */
export function clearTargetCache(): void {
  targetCache = null
}