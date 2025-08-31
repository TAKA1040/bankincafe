'use client'

// 作業項目の型定義
export interface WorkItem {
  id: string
  target: string
  action: string
  position: string
  memo: string
  composed_label: string
  unit_price?: number
  quantity?: number
  created_at: string
  last_used: string
  usage_count: number
}

export interface WorkItemSuggestion {
  value: string
  label: string
  usage_count: number
  last_used: string
  unit_price?: number
}

// 作業項目データベース管理クラス
export class WorkItemDB {
  private readonly STORAGE_KEY = 'bankin_work_items'
  private readonly USAGE_KEY = 'bankin_work_item_usage'

  // 作業項目の保存
  saveWorkItem(target: string, action: string, position: string, memo: string = '', unitPrice?: number, quantity: number = 1): WorkItem {
    const composedLabel = this.composeLabel(target, action, position, memo)
    const workItem: WorkItem = {
      id: Date.now().toString(),
      target: target.trim(),
      action: action.trim(),
      position: position.trim(),
      memo: memo.trim(),
      composed_label: composedLabel,
      unit_price: unitPrice,
      quantity,
      created_at: new Date().toISOString(),
      last_used: new Date().toISOString(),
      usage_count: 1
    }

    const items = this.getWorkItems()
    
    // 同じ組み合わせがあるかチェック（単価も考慮）
    const existingIndex = items.findIndex(item => 
      item.target === workItem.target &&
      item.action === workItem.action &&
      item.position === workItem.position &&
      item.memo === workItem.memo &&
      item.unit_price === workItem.unit_price
    )

    if (existingIndex >= 0) {
      // 既存の場合は使用回数を増やす
      items[existingIndex].usage_count += 1
      items[existingIndex].last_used = new Date().toISOString()
      this.saveToStorage(items)
      return items[existingIndex]
    } else {
      // 新規の場合は追加
      items.push(workItem)
      this.saveToStorage(items)
      return workItem
    }
  }

  // 作業項目の取得
  getWorkItems(): WorkItem[] {
    try {
      if (typeof window === 'undefined') return []
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  // 作業項目のLabelを組み立て
  private composeLabel(target: string, action: string, position: string, memo: string = ''): string {
    let label = ''
    
    if (position) label += `${position} `
    if (target) label += target
    if (action && action !== '（指定なし）') label += ` ${action}`
    if (memo) label += ` (${memo})`
    
    return label.trim()
  }

  // LocalStorageに保存
  private saveToStorage(items: WorkItem[]): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items))
      }
    } catch (error) {
      console.error('Failed to save work items:', error)
    }
  }

  // 対象の候補を取得
  getTargetSuggestions(keyword: string = ''): WorkItemSuggestion[] {
    const items = this.getWorkItems()
    const targets = new Map<string, { usage_count: number, last_used: string, unit_price?: number }>()

    // 使用回数と最終使用日を集計
    items.forEach(item => {
      if (item.target) {
        const existing = targets.get(item.target)
        if (existing) {
          existing.usage_count += item.usage_count
          if (item.last_used > existing.last_used) {
            existing.last_used = item.last_used
            existing.unit_price = item.unit_price
          }
        } else {
          targets.set(item.target, {
            usage_count: item.usage_count,
            last_used: item.last_used,
            unit_price: item.unit_price
          })
        }
      }
    })

    // フィルタリングとソート
    let suggestions = Array.from(targets.entries()).map(([target, data]) => ({
      value: target,
      label: target,
      usage_count: data.usage_count,
      last_used: data.last_used,
      unit_price: data.unit_price
    }))

    if (keyword.trim()) {
      const normalizedKeyword = keyword.toLowerCase()
      suggestions = suggestions.filter(s => 
        s.value.toLowerCase().includes(normalizedKeyword)
      )
    }

    return suggestions.sort((a, b) => {
      // 完全一致を優先
      if (keyword.trim()) {
        const aExact = a.value.toLowerCase() === keyword.toLowerCase() ? 1 : 0
        const bExact = b.value.toLowerCase() === keyword.toLowerCase() ? 1 : 0
        if (aExact !== bExact) return bExact - aExact
      }
      
      // 使用回数でソート
      return b.usage_count - a.usage_count
    }).slice(0, 8)
  }

  // 動作の候補を取得（対象に応じてフィルタリング）
  getActionSuggestions(keyword: string = '', selectedTarget?: string): WorkItemSuggestion[] {
    const items = this.getWorkItems()
    let filteredItems = items

    // 対象でフィルタリング
    if (selectedTarget) {
      filteredItems = items.filter(item => item.target === selectedTarget)
    }

    const actions = new Map<string, { usage_count: number, last_used: string, unit_price?: number }>()

    filteredItems.forEach(item => {
      if (item.action) {
        const existing = actions.get(item.action)
        if (existing) {
          existing.usage_count += item.usage_count
          if (item.last_used > existing.last_used) {
            existing.last_used = item.last_used
            existing.unit_price = item.unit_price
          }
        } else {
          actions.set(item.action, {
            usage_count: item.usage_count,
            last_used: item.last_used,
            unit_price: item.unit_price
          })
        }
      }
    })

    let suggestions = Array.from(actions.entries()).map(([action, data]) => ({
      value: action,
      label: action,
      usage_count: data.usage_count,
      last_used: data.last_used,
      unit_price: data.unit_price
    }))

    if (keyword.trim()) {
      const normalizedKeyword = keyword.toLowerCase()
      suggestions = suggestions.filter(s => 
        s.value.toLowerCase().includes(normalizedKeyword)
      )
    }

    return suggestions.sort((a, b) => {
      if (keyword.trim()) {
        const aExact = a.value.toLowerCase() === keyword.toLowerCase() ? 1 : 0
        const bExact = b.value.toLowerCase() === keyword.toLowerCase() ? 1 : 0
        if (aExact !== bExact) return bExact - aExact
      }
      return b.usage_count - a.usage_count
    }).slice(0, 8)
  }

  // 位置の候補を取得（対象と動作に応じてフィルタリング）
  getPositionSuggestions(keyword: string = '', selectedTarget?: string, selectedAction?: string): WorkItemSuggestion[] {
    const items = this.getWorkItems()
    let filteredItems = items

    if (selectedTarget) {
      filteredItems = filteredItems.filter(item => item.target === selectedTarget)
    }
    
    if (selectedAction) {
      filteredItems = filteredItems.filter(item => item.action === selectedAction)
    }

    const positions = new Map<string, { usage_count: number, last_used: string, unit_price?: number }>()

    filteredItems.forEach(item => {
      if (item.position) {
        const existing = positions.get(item.position)
        if (existing) {
          existing.usage_count += item.usage_count
          if (item.last_used > existing.last_used) {
            existing.last_used = item.last_used
            existing.unit_price = item.unit_price
          }
        } else {
          positions.set(item.position, {
            usage_count: item.usage_count,
            last_used: item.last_used,
            unit_price: item.unit_price
          })
        }
      }
    })

    let suggestions = Array.from(positions.entries()).map(([position, data]) => ({
      value: position,
      label: position,
      usage_count: data.usage_count,
      last_used: data.last_used,
      unit_price: data.unit_price
    }))

    if (keyword.trim()) {
      const normalizedKeyword = keyword.toLowerCase()
      suggestions = suggestions.filter(s => 
        s.value.toLowerCase().includes(normalizedKeyword)
      )
    }

    return suggestions.sort((a, b) => {
      if (keyword.trim()) {
        const aExact = a.value.toLowerCase() === keyword.toLowerCase() ? 1 : 0
        const bExact = b.value.toLowerCase() === keyword.toLowerCase() ? 1 : 0
        if (aExact !== bExact) return bExact - aExact
      }
      return b.usage_count - a.usage_count
    }).slice(0, 8)
  }

  // 完成形作業項目の候補を取得
  getComposedSuggestions(target?: string, action?: string, position?: string): WorkItemSuggestion[] {
    const items = this.getWorkItems()
    let filteredItems = items

    if (target) {
      filteredItems = filteredItems.filter(item => item.target === target)
    }
    if (action) {
      filteredItems = filteredItems.filter(item => item.action === action)
    }
    if (position) {
      filteredItems = filteredItems.filter(item => item.position === position)
    }

    return filteredItems
      .sort((a, b) => b.usage_count - a.usage_count)
      .slice(0, 5)
      .map(item => ({
        value: item.composed_label,
        label: item.composed_label,
        usage_count: item.usage_count,
        last_used: item.last_used,
        unit_price: item.unit_price
      }))
  }

  // 統計情報を取得
  getStatistics() {
    const items = this.getWorkItems()
    if (items.length === 0) return null

    const totalUsage = items.reduce((sum, item) => sum + item.usage_count, 0)
    const pricesWithValue = items.filter(item => item.unit_price && item.unit_price > 0)
    const avgPrice = pricesWithValue.length > 0 
      ? pricesWithValue.reduce((sum, item) => sum + (item.unit_price || 0), 0) / pricesWithValue.length
      : 0

    return {
      totalItems: items.length,
      totalUsage,
      itemsWithPrice: pricesWithValue.length,
      avgPrice: Math.round(avgPrice),
      mostUsedTarget: this.getMostUsed('target'),
      mostUsedAction: this.getMostUsed('action'),
      mostUsedPosition: this.getMostUsed('position')
    }
  }

  private getMostUsed(field: keyof WorkItem): string | null {
    const items = this.getWorkItems()
    const counts = new Map<string, number>()

    items.forEach(item => {
      const value = item[field] as string
      if (value) {
        counts.set(value, (counts.get(value) || 0) + item.usage_count)
      }
    })

    if (counts.size === 0) return null

    return Array.from(counts.entries())
      .sort(([,a], [,b]) => b - a)[0][0]
  }
}