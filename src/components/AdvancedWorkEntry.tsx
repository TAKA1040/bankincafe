'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useWorkDictionary } from '@/hooks/useWorkDictionary'

// Utils from prototype2
const genId = () =>
  typeof crypto !== 'undefined' && (crypto as any).randomUUID
    ? (crypto as any).randomUUID()
    : Math.random().toString(36).slice(2)

function formatJPY(n: number | string) {
  const num = typeof n === 'string' ? Number(n || 0) : n
  return new Intl.NumberFormat('ja-JP').format(num)
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\u30A1-\u30F6]/g, (m) => String.fromCharCode(m.charCodeAt(0) - 0x60))
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (m) => String.fromCharCode(m.charCodeAt(0) - 0xFEE0))
    .replace(/\s+/g, '')
}

function advancedFuzzySearch(
  keyword: string,
  list: string[],
  readingMap: { [k: string]: string[] } = {}
): string[] {
  if (!keyword.trim()) return []
  const norm = normalizeText(keyword)
  return list
    .filter((item) => {
      const ni = normalizeText(item)
      let match = ni.includes(norm)
      if (!match && readingMap[item]) match = readingMap[item].some((r) => normalizeText(r).includes(norm))
      if (!match) match = (readingMap[item] || []).some((r) => norm.includes(normalizeText(r)))
      return match
    })
    .sort((a, b) => {
      const ai = normalizeText(a).indexOf(norm)
      const bi = normalizeText(b).indexOf(norm)
      if (ai !== bi) return ai - bi
      return a.length - b.length
    })
    .slice(0, 8)
}

function suggestPrice(action?: string, target?: string, priceBookMap?: { [k: string]: number }): number | null {
  if (!action || !target || !priceBookMap) return null
  const key = `${target}:${action}`
  return priceBookMap[key] || null
}

// 型定義（請求書作成画面との互換性を保つ）
export interface WorkItem {
  id: string
  type: 'individual' | 'set'
  work_name: string
  unit_price: number
  quantity: number
  amount: number
  memo: string
  set_details?: string[]
  // Prototype2の詳細情報
  target?: string
  action?: string
  position?: string
  details?: Array<{
    action?: string
    target?: string
    position?: string
    memo?: string
    label: string
    quantity?: number
  }>
}

interface AdvancedWorkEntryProps {
  workItems: WorkItem[]
  onWorkItemsChange: (items: WorkItem[]) => void
}

export default function AdvancedWorkEntry({ workItems, onWorkItemsChange }: AdvancedWorkEntryProps) {
  const {
    targetsArray: TARGETS,
    actionsArray: ACTIONS,
    positionsArray: POSITIONS,
    readingMap: READING_MAP,
    targetActionsMap: TARGET_ACTIONS,
    actionPositionsMap: ACTION_POSITIONS,
    priceBookMap,
    loading: dictLoading,
    error: dictError,
  } = useWorkDictionary()

  // 現在編集中のアイテムのインデックス
  const [editingIndex, setEditingIndex] = useState<number>(-1)

  // Structured input state (for editing item)
  const [target, setTarget] = useState('')
  const [action, setAction] = useState<string | undefined>()
  const [position, setPosition] = useState<string | undefined>()
  const [memo, setMemo] = useState('')
  const [unitPrice, setUnitPrice] = useState(0)
  const [qty, setQty] = useState(1)
  const [isTargetConfirmed, setIsTargetConfirmed] = useState(false)

  // Suggestions state
  const [targetSuggestions, setTargetSuggestions] = useState<string[]>([])
  const [showTargetSuggestions, setShowTargetSuggestions] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)

  const [actionSuggestions, setActionSuggestions] = useState<string[]>([])
  const [showActionSuggestions, setShowActionSuggestions] = useState(false)

  const [positionSuggestions, setPositionSuggestions] = useState<string[]>([])
  const [showPositionSuggestions, setShowPositionSuggestions] = useState(false)

  // Price suggestion
  const suggested = useMemo(() => suggestPrice(action, target, priceBookMap), [action, target, priceBookMap])
  useEffect(() => {
    if (suggested != null && (unitPrice === 0 || Number.isNaN(unitPrice))) setUnitPrice(suggested)
  }, [suggested])

  // Target search logic
  const handleTargetSearch = (value: string) => {
    setTarget(value)
    setIsTargetConfirmed(false)
    if (value.trim()) {
      const results = advancedFuzzySearch(value, TARGETS || [], READING_MAP || {})
      setTargetSuggestions(results)
      setShowTargetSuggestions(results.length > 0)
    } else {
      setTargetSuggestions([])
      setShowTargetSuggestions(false)
    }
  }

  // Action search logic
  const handleActionSearch = (value: string) => {
    setAction(value)
    if (value.trim() && isTargetConfirmed) {
      const targetId = TARGETS?.indexOf(target)
      const validActions = TARGET_ACTIONS?.[targetId || -1] || ACTIONS || []
      const results = advancedFuzzySearch(value, validActions, READING_MAP || {})
      setActionSuggestions(results)
      setShowActionSuggestions(results.length > 0)
    } else if (value.trim()) {
      const results = advancedFuzzySearch(value, ACTIONS || [], READING_MAP || {})
      setActionSuggestions(results)
      setShowActionSuggestions(results.length > 0)
    } else {
      setActionSuggestions([])
      setShowActionSuggestions(false)
    }
  }

  // Position search logic
  const handlePositionSearch = (value: string) => {
    setPosition(value)
    if (value.trim() && action) {
      const actionId = ACTIONS?.indexOf(action)
      const validPositions = ACTION_POSITIONS?.[actionId || -1] || POSITIONS || []
      const results = advancedFuzzySearch(value, validPositions, READING_MAP || {})
      setPositionSuggestions(results)
      setShowPositionSuggestions(results.length > 0)
    } else if (value.trim()) {
      const results = advancedFuzzySearch(value, POSITIONS || [], READING_MAP || {})
      setPositionSuggestions(results)
      setShowPositionSuggestions(results.length > 0)
    } else {
      setPositionSuggestions([])
      setShowPositionSuggestions(false)
    }
  }

  // Add new work item
  const addWorkItem = (type: 'individual' | 'set') => {
    const newItem: WorkItem = {
      id: genId(),
      type,
      work_name: '',
      unit_price: 0,
      quantity: 1,
      amount: 0,
      memo: '',
      set_details: type === 'set' ? [''] : undefined,
    }
    onWorkItemsChange([...workItems, newItem])
  }

  // Remove work item
  const removeWorkItem = (id: string) => {
    onWorkItemsChange(workItems.filter(item => item.id !== id))
  }

  // Start editing work item with advanced entry
  const startAdvancedEdit = (index: number) => {
    setEditingIndex(index)
    const item = workItems[index]
    setTarget(item.target || '')
    setAction(item.action)
    setPosition(item.position)
    setMemo(item.memo)
    setUnitPrice(item.unit_price)
    setQty(item.quantity)
    setIsTargetConfirmed(!!item.target)
  }

  // Save advanced edit
  const saveAdvancedEdit = () => {
    if (editingIndex === -1) return
    
    const workName = [target, action, position].filter(Boolean).join(' ')
    const amount = unitPrice * qty
    
    const updatedItems = [...workItems]
    updatedItems[editingIndex] = {
      ...updatedItems[editingIndex],
      work_name: workName,
      target,
      action,
      position,
      memo,
      unit_price: unitPrice,
      quantity: qty,
      amount,
    }
    
    onWorkItemsChange(updatedItems)
    setEditingIndex(-1)
    
    // Reset form
    setTarget('')
    setAction(undefined)
    setPosition(undefined)
    setMemo('')
    setUnitPrice(0)
    setQty(1)
    setIsTargetConfirmed(false)
  }

  // Cancel advanced edit
  const cancelAdvancedEdit = () => {
    setEditingIndex(-1)
    setTarget('')
    setAction(undefined)
    setPosition(undefined)
    setMemo('')
    setUnitPrice(0)
    setQty(1)
    setIsTargetConfirmed(false)
  }

  // Handle basic work name change
  const handleWorkNameChange = (id: string, value: string) => {
    const updatedItems = workItems.map(item =>
      item.id === id ? { ...item, work_name: value } : item
    )
    onWorkItemsChange(updatedItems)
  }

  // Handle basic unit price change
  const handleUnitPriceChange = (id: string, value: number) => {
    const updatedItems = workItems.map(item =>
      item.id === id ? { ...item, unit_price: value, amount: value * item.quantity } : item
    )
    onWorkItemsChange(updatedItems)
  }

  // Handle basic quantity change
  const handleQuantityChange = (id: string, value: number) => {
    const updatedItems = workItems.map(item =>
      item.id === id ? { ...item, quantity: value, amount: item.unit_price * value } : item
    )
    onWorkItemsChange(updatedItems)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">🛠️ 作業項目（高度入力対応）</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => addWorkItem('individual')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 font-medium transition-colors"
          >
            <Plus size={16} />
            個別作業
          </button>
          <button
            type="button"
            onClick={() => addWorkItem('set')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium transition-colors"
          >
            <Plus size={16} />
            セット作業
          </button>
        </div>
      </div>

      {dictLoading && (
        <div className="text-center text-gray-500 py-4">
          作業辞書を読み込み中...
        </div>
      )}

      {dictError && (
        <div className="text-center text-red-600 py-4">
          作業辞書の読み込みエラー: {dictError}
        </div>
      )}

      <div className="space-y-6">
        {workItems.map((item, index) => (
          <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <span className={`text-sm font-semibold text-white px-2 py-1 rounded ${
                  item.type === 'set' ? 'bg-blue-600' : 'bg-green-600'
                }`}>
                  {item.type === 'set' ? 'セット' : '個別'} {index + 1}
                </span>
                {!dictLoading && (
                  <button
                    type="button"
                    onClick={() => startAdvancedEdit(index)}
                    className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
                    disabled={editingIndex !== -1}
                  >
                    高度入力
                  </button>
                )}
              </div>
              {workItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeWorkItem(item.id)}
                  className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 rounded transition-colors"
                  title="この項目を削除"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>

            {editingIndex === index ? (
              // Advanced editing mode
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>高度入力モード</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Target input */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      対象 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={target}
                      onChange={(e) => handleTargetSearch(e.target.value)}
                      onFocus={() => setShowTargetSuggestions(targetSuggestions.length > 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="対象を入力..."
                    />
                    {showTargetSuggestions && targetSuggestions.length > 0 && (
                      <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {targetSuggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setTarget(suggestion)
                              setIsTargetConfirmed(true)
                              setShowTargetSuggestions(false)
                            }}
                            className="w-full px-3 py-2 text-left hover:bg-blue-50 first:rounded-t-lg last:rounded-b-lg text-sm"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action input */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      作業 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={action || ''}
                      onChange={(e) => handleActionSearch(e.target.value)}
                      onFocus={() => setShowActionSuggestions(actionSuggestions.length > 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="作業を入力..."
                      disabled={!isTargetConfirmed}
                    />
                    {showActionSuggestions && actionSuggestions.length > 0 && (
                      <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {actionSuggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setAction(suggestion)
                              setShowActionSuggestions(false)
                            }}
                            className="w-full px-3 py-2 text-left hover:bg-blue-50 first:rounded-t-lg last:rounded-b-lg text-sm"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Position input */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      位置（任意）
                    </label>
                    <input
                      type="text"
                      value={position || ''}
                      onChange={(e) => handlePositionSearch(e.target.value)}
                      onFocus={() => setShowPositionSuggestions(positionSuggestions.length > 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="位置を入力..."
                      disabled={!action}
                    />
                    {showPositionSuggestions && positionSuggestions.length > 0 && (
                      <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {positionSuggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setPosition(suggestion)
                              setShowPositionSuggestions(false)
                            }}
                            className="w-full px-3 py-2 text-left hover:bg-blue-50 first:rounded-t-lg last:rounded-b-lg text-sm"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        単価 (円)
                      </label>
                      <input
                        type="number"
                        value={unitPrice}
                        onChange={(e) => setUnitPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                        step="1000"
                      />
                      {suggested && (
                        <div className="text-xs text-blue-600 mt-1">
                          推奨価格: ¥{formatJPY(suggested)}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        数量
                      </label>
                      <input
                        type="number"
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        金額
                      </label>
                      <div className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 font-bold text-blue-600">
                        ¥{formatJPY(unitPrice * qty)}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      メモ（任意）
                    </label>
                    <input
                      type="text"
                      value={memo}
                      onChange={(e) => setMemo(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="メモを入力..."
                    />
                  </div>

                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={cancelAdvancedEdit}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      キャンセル
                    </button>
                    <button
                      type="button"
                      onClick={saveAdvancedEdit}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      disabled={!target || !action}
                    >
                      保存
                    </button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              // Normal editing mode
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    作業名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={item.work_name}
                    onChange={(e) => handleWorkNameChange(item.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="作業名を入力"
                    required
                  />
                  {item.target && item.action && (
                    <div className="text-xs text-gray-500 mt-1">
                      構造化: {item.target} → {item.action} {item.position ? `→ ${item.position}` : ''}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    単価 (円)
                  </label>
                  <input
                    type="number"
                    value={item.unit_price}
                    onChange={(e) => handleUnitPriceChange(item.id, Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="1000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    数量
                  </label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                  />
                </div>
              </div>
            )}

            {/* Amount display */}
            {editingIndex !== index && (
              <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">小計</span>
                  <span className="text-lg font-bold text-blue-600">¥{formatJPY(item.amount)}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}