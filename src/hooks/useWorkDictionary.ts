'use client'

import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'

// Supabaseから取得するデータの型定義
export interface Target {
  id: number
  name: string
  sort_order: number
}

export interface Action {
  id: number
  name: string
  sort_order: number
}

export interface Position {
  id: number
  name: string
  sort_order: number
}

export interface ReadingMapping {
  word: string
  reading_hiragana: string
  reading_katakana: string
  word_type: 'target' | 'action' | 'position'
}

export interface TargetAction {
  target_id: number
  action_id: number
  target_name?: string
  action_name?: string
}

export interface ActionPosition {
  action_id: number
  position_id: number
  action_name?: string
  position_name?: string
}

export interface PriceSuggestion {
  target_id: number
  action_id: number
  suggested_price: number
  usage_count: number
  last_used_at: string
}

// prototypeページで使用するためのカスタムフック
export function useWorkDictionary() {
  const [targets, setTargets] = useState<Target[]>([])
  const [actions, setActions] = useState<Action[]>([])
  const [positions, setPositions] = useState<Position[]>([])
  const [readingMappings, setReadingMappings] = useState<ReadingMapping[]>([])
  const [targetActions, setTargetActions] = useState<TargetAction[]>([])
  const [actionPositions, setActionPositions] = useState<ActionPosition[]>([])
  const [priceSuggestions, setPriceSuggestions] = useState<PriceSuggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // データ取得
  useEffect(() => {
    async function fetchDictionary() {
      try {
        setLoading(true)
        
        // 並行してデータを取得
        const [
          targetsRes,
          actionsRes,
          positionsRes,
          readingsRes,
          targetActionsRes,
          actionPositionsRes,
          pricesRes
        ] = await Promise.all([
          supabase.from('targets').select('*').eq('is_active', true).order('sort_order'),
          supabase.from('actions').select('*').eq('is_active', true).order('sort_order'),
          supabase.from('positions').select('*').eq('is_active', true).order('sort_order'),
          supabase.from('reading_mappings').select('*'),
          supabase.from('target_actions').select(`
            target_id,
            action_id,
            targets(name),
            actions(name)
          `),
          supabase.from('action_positions').select(`
            action_id,
            position_id,
            actions(name),
            positions(name)
          `),
          supabase.from('price_suggestions').select('*')
        ])

        // エラーチェック
        if (targetsRes.error) throw targetsRes.error
        if (actionsRes.error) throw actionsRes.error
        if (positionsRes.error) throw positionsRes.error
        if (readingsRes.error) throw readingsRes.error
        if (targetActionsRes.error) throw targetActionsRes.error
        if (actionPositionsRes.error) throw actionPositionsRes.error
        if (pricesRes.error) throw pricesRes.error

        // データ設定
        setTargets(targetsRes.data)
        setActions(actionsRes.data)
        setPositions(positionsRes.data)
        setReadingMappings(readingsRes.data)
        setTargetActions(targetActionsRes.data.map(item => ({
          target_id: item.target_id,
          action_id: item.action_id,
          target_name: (item.targets as any)?.name,
          action_name: (item.actions as any)?.name
        })))
        setActionPositions(actionPositionsRes.data.map(item => ({
          action_id: item.action_id,
          position_id: item.position_id,
          action_name: (item.actions as any)?.name,
          position_name: (item.positions as any)?.name
        })))
        setPriceSuggestions(pricesRes.data)
        
        setError(null)
      } catch (err) {
        console.error('辞書データ取得エラー:', err)
        setError(err instanceof Error ? err.message : '辞書データの取得に失敗しました')
      } finally {
        setLoading(false)
      }
    }

    fetchDictionary()
  }, [])

  // prototypeページ用の配列形式に変換
  const targetsArray = useMemo(() => 
    targets.map(t => t.name).sort()
  , [targets])

  const actionsArray = useMemo(() => 
    ['（指定なし）', ...actions.map(a => a.name).sort()]
  , [actions])

  const positionsArray = useMemo(() => 
    positions.map(p => p.name).sort()
  , [positions])

  // 読み仮名マッピングをprototypeページ形式に変換
  const readingMap = useMemo(() => {
    const map: { [key: string]: string[] } = {}
    readingMappings.forEach(rm => {
      const readings = []
      if (rm.reading_hiragana) readings.push(rm.reading_hiragana)
      if (rm.reading_katakana) readings.push(rm.reading_katakana)
      if (readings.length > 0) {
        map[rm.word] = readings
      }
    })
    return map
  }, [readingMappings])

  // 対象→動作の関連マッピング
  const targetActionsMap = useMemo(() => {
    const map: { [target: string]: string[] } = {}
    targetActions.forEach(ta => {
      if (ta.target_name && ta.action_name) {
        if (!map[ta.target_name]) {
          map[ta.target_name] = ['（指定なし）'] // 常に「指定なし」を含む
        }
        if (!map[ta.target_name].includes(ta.action_name)) {
          map[ta.target_name].push(ta.action_name)
        }
      }
    })
    return map
  }, [targetActions])

  // 動作→位置の関連マッピング
  const actionPositionsMap = useMemo(() => {
    const map: { [action: string]: string[] } = {}
    actionPositions.forEach(ap => {
      if (ap.action_name && ap.position_name) {
        if (!map[ap.action_name]) {
          map[ap.action_name] = []
        }
        if (!map[ap.action_name].includes(ap.position_name)) {
          map[ap.action_name].push(ap.position_name)
        }
      }
    })
    return map
  }, [actionPositions])

  // 価格提案マッピング
  const priceBookMap = useMemo(() => {
    const map: { [key: string]: number } = {}
    priceSuggestions.forEach(ps => {
      const targetName = targets.find(t => t.id === ps.target_id)?.name
      const actionName = actions.find(a => a.id === ps.action_id)?.name
      if (targetName && actionName) {
        map[`${targetName}_${actionName}`] = ps.suggested_price
      }
    })
    return map
  }, [priceSuggestions, targets, actions])

  // 作業履歴保存関数
  async function saveWorkHistory(
    targetName: string,
    actionName: string,
    positionName: string | null,
    memo: string,
    unitPrice: number,
    quantity: number
  ) {
    try {
      const target = targets.find(t => t.name === targetName)
      const action = actions.find(a => a.name === actionName)
      const position = positionName ? positions.find(p => p.name === positionName) : null

      if (!target || !action) {
        throw new Error('対象または動作が見つかりません')
      }

      // ラベル生成
      let rawLabel = ''
      if (positionName && positionName !== '（指定なし）') rawLabel += `${positionName} `
      rawLabel += targetName
      if (actionName && actionName !== '（指定なし）') rawLabel += ` ${actionName}`
      if (memo) rawLabel += ` (${memo})`

      const { error } = await supabase
        .from('work_history')
        .insert({
          target_id: target.id,
          action_id: action.id,
          position_id: position?.id || null,
          memo,
          unit_price: unitPrice,
          quantity,
          raw_label: rawLabel.trim(),
          task_type: 'structured'
        })

      if (error) throw error
      
      return true
    } catch (err) {
      console.error('作業履歴保存エラー:', err)
      return false
    }
  }

  // セット作業保存関数
  async function saveWorkSet(
    setName: string,
    unitPrice: number,
    quantity: number,
    details: Array<{
      targetName: string
      actionName: string
      positionName?: string
      memo?: string
    }>
  ) {
    try {
      // セットヘッダー作成
      const { data: workSet, error: setError } = await supabase
        .from('work_sets')
        .insert({
          set_name: setName,
          unit_price: unitPrice,
          quantity
        })
        .select()
        .single()

      if (setError || !workSet) throw setError || new Error('セット作成に失敗')

      // セット詳細作成
      for (let i = 0; i < details.length; i++) {
        const detail = details[i]
        const target = targets.find(t => t.name === detail.targetName)
        const action = actions.find(a => a.name === detail.actionName)
        const position = detail.positionName ? positions.find(p => p.name === detail.positionName) : null

        if (target && action) {
          const { error: detailError } = await supabase
            .from('work_set_details')
            .insert({
              work_set_id: workSet.id,
              target_id: target.id,
              action_id: action.id,
              position_id: position?.id || null,
              memo: detail.memo || '',
              sort_order: i + 1
            })

          if (detailError) throw detailError
        }
      }

      return true
    } catch (err) {
      console.error('セット作業保存エラー:', err)
      return false
    }
  }

  return {
    // 生データ
    targets,
    actions,
    positions,
    readingMappings,
    targetActions,
    actionPositions,
    priceSuggestions,
    
    // prototypeページ互換の配列
    targetsArray,
    actionsArray,
    positionsArray,
    
    // prototypeページ互換のマッピング
    readingMap,
    targetActionsMap,
    actionPositionsMap,
    priceBookMap,
    
    // 関数
    saveWorkHistory,
    saveWorkSet,
    
    // 状態
    loading,
    error
  }
}