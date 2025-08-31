import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

type WorkHistoryItem = {
  id: number
  target_id: number
  action_id: number
  position_id: number | null
  target_name: string
  action_name: string
  position_name: string | null
  memo: string | null
  unit_price: number | null
  quantity: number | null
  total_amount: number | null
  raw_label: string | null
  task_type: string | null
  created_at: string
  updated_at: string | null
}

type SearchFilters = {
  keyword: string
  minPrice: string
  maxPrice: string
  startDate: string
  endDate: string
}

type WorkStatistics = {
  totalWorks: number
  totalAmount: number
  averagePrice: number
  topTarget: string
}

export function useWorkHistory() {
  const [workItems, setWorkItems] = useState<WorkHistoryItem[]>([])
  const [filteredItems, setFilteredItems] = useState<WorkHistoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 作業履歴を取得
  useEffect(() => {
    async function fetchWorkHistory() {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('work_history_complete_view')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) throw error
        
        const items: WorkHistoryItem[] = (data || []).map(item => ({
          id: item.id || 0,
          target_id: item.target_id || 0,
          action_id: item.action_id || 0,
          position_id: item.position_id,
          target_name: item.target_name || '',
          action_name: item.action_name || '',
          position_name: item.position_name,
          memo: item.memo,
          unit_price: item.unit_price,
          quantity: item.quantity,
          total_amount: item.total_amount,
          raw_label: item.raw_label,
          task_type: item.task_type,
          created_at: item.created_at || '',
          updated_at: item.updated_at
        }))
        
        setWorkItems(items)
        setFilteredItems(items)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch work history')
      } finally {
        setLoading(false)
      }
    }
    
    fetchWorkHistory()
  }, [])

  // フィルター処理
  const searchItems = useCallback((filters: SearchFilters) => {
    const filtered = workItems.filter(item => {
      // キーワード検索（AND検索）
      if (filters.keyword.trim()) {
        const tokens = filters.keyword.toLowerCase().split(/\s+/).filter(Boolean)
        const searchText = [
          item.id.toString(),
          `#${item.id}`,
          item.target_name,
          item.action_name,
          item.position_name || '',
          item.memo || '',
          item.raw_label || '',
          new Date(item.created_at).toLocaleDateString('ja-JP')
        ].join(' ').toLowerCase()
        
        const allTokensMatch = tokens.every(token => searchText.includes(token))
        if (!allTokensMatch) return false
      }

      // 価格範囲フィルター
      if (filters.minPrice && item.unit_price !== null) {
        const minPrice = parseInt(filters.minPrice)
        if (!isNaN(minPrice) && item.unit_price < minPrice) return false
      }
      if (filters.maxPrice && item.unit_price !== null) {
        const maxPrice = parseInt(filters.maxPrice)
        if (!isNaN(maxPrice) && item.unit_price > maxPrice) return false
      }

      // 価格範囲の自動補正
      if (filters.minPrice && filters.maxPrice && item.unit_price !== null) {
        const minPrice = parseInt(filters.minPrice)
        const maxPrice = parseInt(filters.maxPrice)
        if (!isNaN(minPrice) && !isNaN(maxPrice) && minPrice > maxPrice) {
          if (item.unit_price < maxPrice || item.unit_price > minPrice) return false
        }
      }

      // 日付範囲フィルター
      if (filters.startDate) {
        try {
          const startDate = new Date(filters.startDate)
          const itemDate = new Date(item.created_at)
          if (!isNaN(startDate.getTime()) && itemDate < startDate) return false
        } catch {
          return false
        }
      }
      if (filters.endDate) {
        try {
          const endDate = new Date(filters.endDate)
          const itemDate = new Date(item.created_at)
          if (!isNaN(endDate.getTime()) && itemDate > endDate) return false
        } catch {
          return false
        }
      }

      // 日付範囲の自動補正
      if (filters.startDate && filters.endDate) {
        try {
          const startDate = new Date(filters.startDate)
          const endDate = new Date(filters.endDate)
          const itemDate = new Date(item.created_at)
          if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime()) && startDate > endDate) {
            if (itemDate < endDate || itemDate > startDate) return false
          }
        } catch {
          return false
        }
      }

      return true
    })
    
    setFilteredItems(filtered)
  }, [workItems])

  // 統計情報を計算
  const getStatistics = useCallback((items: WorkHistoryItem[]): WorkStatistics => {
    if (items.length === 0) {
      return {
        totalWorks: 0,
        totalAmount: 0,
        averagePrice: 0,
        topTarget: ''
      }
    }

    const totalAmount = items.reduce((sum, item) => sum + (item.total_amount || item.unit_price || 0), 0)
    const averagePrice = Math.round(totalAmount / items.length)

    // 対象別集計（使用回数で決定）
    const targetCounts = items.reduce((counts, item) => {
      counts[item.target_name] = (counts[item.target_name] || 0) + 1
      return counts
    }, {} as Record<string, number>)
    const topTarget = Object.entries(targetCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || ''

    return {
      totalWorks: items.length,
      totalAmount,
      averagePrice,
      topTarget
    }
  }, [])

  // CSVエクスポート
  const exportToCSV = useCallback((items: WorkHistoryItem[], filters: SearchFilters): void => {
    if (items.length === 0) {
      alert('エクスポートするデータがありません')
      return
    }

    const headers = [
      'ID', '対象', '動作', '位置', 'メモ', '単価', '数量', '合計金額', '作成日'
    ]
    
    const rows = items.map(item => [
      sanitizeCSVValue(item.id.toString()),
      sanitizeCSVValue(item.target_name),
      sanitizeCSVValue(item.action_name),
      sanitizeCSVValue(item.position_name || '（指定なし）'),
      sanitizeCSVValue(item.memo || ''),
      sanitizeCSVValue(item.unit_price?.toString() || '0'),
      sanitizeCSVValue(item.quantity?.toString() || '1'),
      sanitizeCSVValue(item.total_amount?.toString() || item.unit_price?.toString() || '0'),
      sanitizeCSVValue(new Date(item.created_at).toLocaleDateString('ja-JP'))
    ])

    // BOM付きCSVコンテント
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    
    // ファイル名に期間やキーワードを含める
    let filename = '作業履歴'
    if (filters.keyword) filename += `_${filters.keyword.replace(/[\s\/\\:*?"<>|]/g, '_')}`
    if (filters.startDate) filename += `_${filters.startDate}`
    if (filters.endDate) filename += `_${filters.endDate}`
    filename += `_${new Date().toISOString().split('T')[0]}.csv`
    
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    
    // メモリリーク防止
    setTimeout(() => {
      URL.revokeObjectURL(url)
    }, 100)
  }, [])

  return {
    workItems: filteredItems,
    allItems: workItems,
    loading,
    error,
    searchItems,
    getStatistics,
    exportToCSV
  }
}

// CSVサニタイズ関数
function sanitizeCSVValue(value: string): string {
  // CSVインジェクション対策
  if (/^[=+\-@]/.test(value)) {
    value = "'" + value  // 先頭にシングルクォートを追加
  }
  
  // カンマ、改行、ダブルクォートが含まれる場合はクォートで囲む
  if (value.includes(',') || value.includes('\n') || value.includes('"')) {
    // ダブルクォートのエスケープ
    value = value.replace(/"/g, '""')
    value = `"${value}"`
  }
  
  return value
}