'use client'

import { useState, useEffect, useMemo } from 'react'
import { dbClient, escapeValue } from '@/lib/db-client'


// データの型定義
export interface Target {
  id: number
  name: string
  reading?: string
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
  id: number
  target_id: number
  action_id: number
  position_id?: number
  suggested_price: number
  frequency: number
  last_used: string
  target_name?: string
  action_name?: string
  position_name?: string
}


// prototypeページで使用するためのカスタムフック
export function useWorkDictionary() {
  const [targets, setTargets] = useState<Target[]>([])
  const [actions, setActions] = useState<Action[]>([])
  const [positions, setPositions] = useState<Position[]>([])
  const [readingMappings, setReadingMappings] = useState<ReadingMapping[]>([])
  const [targetActions, setTargetActions] = useState<TargetAction[]>([])
  const [actionPositions, setActionPositions] = useState<ActionPosition[]>([])
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
          actionPositionsRes
        ] = await Promise.all([
          dbClient.executeSQL<any>(`SELECT * FROM targets WHERE is_active = TRUE ORDER BY sort_order`),
          dbClient.executeSQL<any>(`SELECT * FROM actions WHERE is_active = TRUE ORDER BY sort_order`),
          dbClient.executeSQL<any>(`SELECT * FROM positions WHERE is_active = TRUE ORDER BY sort_order`),
          dbClient.executeSQL<any>(`SELECT * FROM reading_mappings`),
          dbClient.executeSQL<any>(`
            SELECT ta.target_id, ta.action_id, t.name as target_name, a.name as action_name
            FROM target_actions ta
            LEFT JOIN targets t ON ta.target_id = t.id
            LEFT JOIN actions a ON ta.action_id = a.id
          `),
          dbClient.executeSQL<any>(`
            SELECT ap.action_id, ap.position_id, a.name as action_name, p.name as position_name
            FROM action_positions ap
            LEFT JOIN actions a ON ap.action_id = a.id
            LEFT JOIN positions p ON ap.position_id = p.id
          `)
        ])

        // エラーチェック
        if (!targetsRes.success) throw new Error(targetsRes.error)
        if (!actionsRes.success) throw new Error(actionsRes.error)
        if (!positionsRes.success) throw new Error(positionsRes.error)
        if (!readingsRes.success) throw new Error(readingsRes.error)
        if (!targetActionsRes.success) throw new Error(targetActionsRes.error)
        if (!actionPositionsRes.success) throw new Error(actionPositionsRes.error)

        // データ設定
        setTargets((targetsRes.data?.rows || []).map((item: any) => ({
          ...item,
          reading: item.reading ?? undefined,
          sort_order: item.sort_order ?? 0
        })))
        setActions((actionsRes.data?.rows || []).map((item: any) => ({
          ...item,
          sort_order: item.sort_order ?? 0
        })))
        setPositions((positionsRes.data?.rows || []).map((item: any) => ({
          ...item,
          sort_order: item.sort_order ?? 0
        })))
        setReadingMappings((readingsRes.data?.rows || []).map((item: any) => ({
          ...item,
          word_type: item.word_type as "target" | "action" | "position"
        })))
        setTargetActions((targetActionsRes.data?.rows || []).map((item: any) => ({
          target_id: item.target_id,
          action_id: item.action_id,
          target_name: item.target_name,
          action_name: item.action_name
        })))
        setActionPositions((actionPositionsRes.data?.rows || []).map((item: any) => ({
          action_id: item.action_id,
          position_id: item.position_id,
          action_name: item.action_name,
          position_name: item.position_name
        })))

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

  // 価格提案マッピング（target_action → unitPrice）
  const priceBookMap = useMemo((): Record<string, number> => {
    return {}
  }, [])

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

      const sql = `
        INSERT INTO work_history (target_id, action_id, position_id, memo, unit_price, quantity, raw_label, task_type)
        VALUES (${target.id}, ${action.id}, ${position?.id || 'NULL'},
                ${escapeValue(memo)}, ${unitPrice}, ${quantity}, ${escapeValue(rawLabel.trim())}, 'structured')
      `
      const result = await dbClient.executeSQL(sql)
      if (!result.success) throw new Error(result.error)

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
      const insertSetSQL = `
        INSERT INTO work_sets (set_name, unit_price, quantity)
        VALUES (${escapeValue(setName)}, ${unitPrice}, ${quantity})
        RETURNING *
      `
      const setResult = await dbClient.executeSQL<any>(insertSetSQL)
      if (!setResult.success || !setResult.data?.rows?.[0]) {
        throw new Error(setResult.error || 'セット作成に失敗')
      }
      const workSet = setResult.data.rows[0]

      // セット詳細作成
      for (let i = 0; i < details.length; i++) {
        const detail = details[i]
        const target = targets.find(t => t.name === detail.targetName)
        const action = actions.find(a => a.name === detail.actionName)
        const position = detail.positionName ? positions.find(p => p.name === detail.positionName) : null

        if (target && action) {
          const insertDetailSQL = `
            INSERT INTO work_set_details (work_set_id, target_id, action_id, position_id, memo, sort_order)
            VALUES (${workSet.id}, ${target.id}, ${action.id}, ${position?.id || 'NULL'},
                    ${escapeValue(detail.memo || '')}, ${i + 1})
          `
          const detailResult = await dbClient.executeSQL(insertDetailSQL)
          if (!detailResult.success) throw new Error(detailResult.error)
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
