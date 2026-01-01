import { useState, useEffect } from 'react'
import { dbClient } from '@/lib/db-client'

type Target = {
  id: number
  name: string
  name_norm: string
  is_active: boolean
  sort_order: number
}

type Action = {
  id: number
  name: string
  name_norm: string
  is_active: boolean
  sort_order: number
}

type Position = {
  id: number | null
  name: string
  name_norm: string | null
  is_active: boolean
  sort_order: number
}

type AvailableAction = {
  target_id: number
  target_name: string
  action_id: number
  action_name: string
  sort_order: number
}

type AvailablePosition = {
  target_id: number
  target_name: string
  action_id: number
  action_name: string
  position_id: number | null
  position_name: string
  position_sort_order: number
  usage_count: number
  is_recommended: boolean
}

export function useProgressiveFilter() {
  const [targets, setTargets] = useState<Target[]>([])
  const [availableActions, setAvailableActions] = useState<AvailableAction[]>([])
  const [availablePositions, setAvailablePositions] = useState<AvailablePosition[]>([])

  const [selectedTarget, setSelectedTarget] = useState<Target | null>(null)
  const [selectedAction, setSelectedAction] = useState<Action | null>(null)
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 初期対象一覧を取得
  useEffect(() => {
    async function fetchTargets() {
      setLoading(true)
      try {
        const result = await dbClient.executeSQL<any>(`
          SELECT * FROM targets WHERE is_active = TRUE ORDER BY sort_order
        `)

        if (!result.success) throw new Error(result.error)
        setTargets((result.data?.rows || []).map((item: any) => ({
          ...item,
          name_norm: item.name_norm || '',
          is_active: item.is_active ?? true,
          sort_order: item.sort_order ?? 0
        })))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch targets')
      } finally {
        setLoading(false)
      }
    }

    fetchTargets()
  }, [])

  // 対象選択時：利用可能な動作を取得
  useEffect(() => {
    if (!selectedTarget) {
      setAvailableActions([])
      setSelectedAction(null)
      setSelectedPosition(null)
      return
    }

    async function fetchAvailableActions() {
      setLoading(true)
      try {
        const result = await dbClient.executeSQL<any>(`
          SELECT * FROM available_actions_by_target
          WHERE target_name = '${(selectedTarget?.name || '').replace(/'/g, "''")}'
          ORDER BY sort_order
        `)

        if (!result.success) throw new Error(result.error)
        setAvailableActions((result.data?.rows || []).map((item: any) => ({
          ...item,
          target_id: item.target_id ?? 0,
          target_name: item.target_name || '',
          action_id: item.action_id ?? 0,
          action_name: item.action_name || '',
          sort_order: item.sort_order ?? 0
        })))
        setSelectedAction(null)
        setSelectedPosition(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch available actions')
      } finally {
        setLoading(false)
      }
    }

    fetchAvailableActions()
  }, [selectedTarget])

  // 動作選択時：利用可能な位置を取得
  useEffect(() => {
    if (!selectedTarget || !selectedAction) {
      setAvailablePositions([])
      setSelectedPosition(null)
      return
    }

    async function fetchAvailablePositions() {
      setLoading(true)
      try {
        const result = await dbClient.executeSQL<any>(`
          SELECT * FROM available_positions_by_target_action
          WHERE target_name = '${(selectedTarget?.name || '').replace(/'/g, "''")}'
            AND action_name = '${(selectedAction?.name || '').replace(/'/g, "''")}'
          ORDER BY position_sort_order
        `)

        if (!result.success) throw new Error(result.error)
        setAvailablePositions((result.data?.rows || []).map((item: any) => ({
          ...item,
          target_id: item.target_id ?? 0,
          target_name: item.target_name || '',
          action_id: item.action_id ?? 0,
          action_name: item.action_name || '',
          position_id: item.position_id ?? null,
          position_name: item.position_name || '',
          position_sort_order: item.position_sort_order ?? 0,
          usage_count: item.usage_count ?? 0,
          is_recommended: item.is_recommended ?? false
        })))
        setSelectedPosition(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch available positions')
      } finally {
        setLoading(false)
      }
    }

    fetchAvailablePositions()
  }, [selectedTarget, selectedAction])

  const handleTargetSelect = (target: Target) => {
    setSelectedTarget(target)
  }

  const handleActionSelect = (actionData: AvailableAction) => {
    const action: Action = {
      id: actionData.action_id,
      name: actionData.action_name,
      name_norm: actionData.action_name.toLowerCase(),
      is_active: true,
      sort_order: actionData.sort_order
    }
    setSelectedAction(action)
  }

  const handlePositionSelect = (positionData: AvailablePosition) => {
    const position: Position = {
      id: positionData.position_id,
      name: positionData.position_name,
      name_norm: positionData.position_id ? positionData.position_name.toLowerCase() : null,
      is_active: true,
      sort_order: positionData.position_sort_order
    }
    setSelectedPosition(position)
  }

  const reset = () => {
    setSelectedTarget(null)
    setSelectedAction(null)
    setSelectedPosition(null)
    setAvailableActions([])
    setAvailablePositions([])
    setError(null)
  }

  return {
    // データ
    targets,
    availableActions,
    availablePositions,

    // 選択状態
    selectedTarget,
    selectedAction,
    selectedPosition,

    // 状態管理
    loading,
    error,

    // アクション
    handleTargetSelect,
    handleActionSelect,
    handlePositionSelect,
    reset
  }
}
