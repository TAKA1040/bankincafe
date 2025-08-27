import { useState, useCallback, useMemo } from 'react'
import { sanitizeInput, sanitizeNumber } from '../utils/validation'

interface WorkItem {
  id: string
  type: 'individual' | 'set'
  name: string
  quantity: number
  unitPrice: number
  amount: number
  setDetails?: string[]
}

export function useWorkItems() {
  const [workItems, setWorkItems] = useState<WorkItem[]>([])

  const addWorkItem = useCallback((type: 'individual' | 'set') => {
    const newItem: WorkItem = {
      id: Date.now().toString(),
      type,
      name: '',
      quantity: 1,
      unitPrice: 0,
      amount: 0,
      setDetails: type === 'set' ? [''] : undefined
    }
    setWorkItems(prev => [...prev, newItem])
  }, [])

  const updateWorkItem = useCallback(<K extends keyof WorkItem>(
    id: string, 
    field: K, 
    value: WorkItem[K]
  ) => {
    setWorkItems(prev => prev.map(item => {
      if (item.id === id) {
        let sanitizedValue = value

        // 入力値をサニタイズ
        if (field === 'name' && typeof value === 'string') {
          sanitizedValue = sanitizeInput(value) as WorkItem[K]
        } else if (field === 'quantity' && typeof value === 'number') {
          sanitizedValue = sanitizeNumber(value, 1, 999) as WorkItem[K]
        } else if (field === 'unitPrice' && typeof value === 'number') {
          sanitizedValue = sanitizeNumber(value, 0, 99999999) as WorkItem[K]
        } else if (field === 'setDetails' && Array.isArray(value)) {
          sanitizedValue = value.map(detail => 
            typeof detail === 'string' ? sanitizeInput(detail) : detail
          ) as WorkItem[K]
        }

        const updatedItem = { ...item, [field]: sanitizedValue }
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.amount = updatedItem.quantity * updatedItem.unitPrice
        }
        return updatedItem
      }
      return item
    }))
  }, [])

  const removeWorkItem = useCallback((id: string) => {
    setWorkItems(prev => prev.filter(item => item.id !== id))
  }, [])

  // Calculations - メモ化で重複計算を防ぐ
  const calculations = useMemo(() => {
    const subtotal = workItems.reduce((sum, item) => sum + item.amount, 0)
    const tax = Math.floor(subtotal * 0.1)
    const total = subtotal + tax
    return { subtotal, tax, total }
  }, [workItems])

  return {
    workItems,
    addWorkItem,
    updateWorkItem,
    removeWorkItem,
    ...calculations
  }
}