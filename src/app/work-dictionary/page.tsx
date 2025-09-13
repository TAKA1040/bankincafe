'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Settings, Plus, Trash2, Edit2, Save, X, ArrowLeft, ArrowUp, ArrowDown, Home } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Target, Action, Position, ReadingMapping, TargetAction, ActionPosition, PriceSuggestion } from '@/hooks/useWorkDictionary'

type TabType = 'targets' | 'actions' | 'positions' | 'readings' | 'relations'

// 漢字判定ユーティリティ
const hasKanji = (text: string): boolean => {
  const kanjiRegex = /[\u4e00-\u9faf]/
  return kanjiRegex.test(text)
}

export default function WorkDictionaryPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('targets')
  
  // データ状態
  const [targets, setTargets] = useState<Target[]>([])
  const [actions, setActions] = useState<Action[]>([])
  const [positions, setPositions] = useState<Position[]>([])
  const [readingMappings, setReadingMappings] = useState<ReadingMapping[]>([])
  const [targetActions, setTargetActions] = useState<TargetAction[]>([])
  const [actionPositions, setActionPositions] = useState<ActionPosition[]>([])
  const [priceSuggestions, setPriceSuggestions] = useState<PriceSuggestion[]>([])
  
  // 編集状態
  type EditingItem = any // TODO: 適切な型定義に変更予定
  const [editingItem, setEditingItem] = useState<EditingItem>(null)
  
  // エラーハンドリング用の状態
  const [error, setError] = useState<string | null>(null)
  
  // エラー表示用のヘルパー
  const showError = useCallback((message: string) => {
    setError(message)
    setTimeout(() => setError(null), 5000)
  }, [])
  const [isAdding, setIsAdding] = useState(false)
  
  // フィルタリング状態
  const [selectedTargetFilter, setSelectedTargetFilter] = useState<number | null>(null)
  const [selectedActionFilter, setSelectedActionFilter] = useState<number | null>(null)
  
  // 一括登録状態
  const [bulkTargetId, setBulkTargetId] = useState<number | null>(null)
  const [bulkActionId, setBulkActionId] = useState<number | null>(null)
  const [selectedActions, setSelectedActions] = useState<Set<number>>(new Set())
  const [selectedPositions, setSelectedPositions] = useState<Set<number>>(new Set())
  
  // 展開状態管理（関連設定一覧用）
  const [expandedTargets, setExpandedTargets] = useState<Set<number>>(new Set())
  const [expandedActions, setExpandedActions] = useState<Set<number>>(new Set())
  
  // ローディング状態
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // 展開/折りたたみ制御
  const toggleTargetExpansion = (targetId: number) => {
    const newExpanded = new Set(expandedTargets)
    if (newExpanded.has(targetId)) {
      newExpanded.delete(targetId)
    } else {
      newExpanded.add(targetId)
    }
    setExpandedTargets(newExpanded)
  }

  const toggleActionExpansion = (actionId: number) => {
    const newExpanded = new Set(expandedActions)
    if (newExpanded.has(actionId)) {
      newExpanded.delete(actionId)
    } else {
      newExpanded.add(actionId)
    }
    setExpandedActions(newExpanded)
  }

  // 全展開/全折りたたみ制御
  const expandAllTargets = () => {
    const allTargetIds = new Set(targetActions.map(ta => ta.target_id))
    setExpandedTargets(allTargetIds)
  }

  const collapseAllTargets = () => {
    setExpandedTargets(new Set())
  }

  const expandAllActions = () => {
    const allActionIds = new Set(actionPositions.map(ap => ap.action_id))
    setExpandedActions(allActionIds)
  }

  const collapseAllActions = () => {
    setExpandedActions(new Set())
  }

  // データ読み込み
  const loadAllData = useCallback(async () => {
    try {
      setLoading(true)
      
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

      if (targetsRes.data) setTargets(targetsRes.data.map(item => ({
        ...item,
        reading: item.reading ?? undefined,
        sort_order: item.sort_order ?? 0
      })))
      if (actionsRes.data) setActions(actionsRes.data.map(item => ({
        ...item,
        sort_order: item.sort_order ?? 0
      })))
      if (positionsRes.data) setPositions(positionsRes.data.map(item => ({
        ...item,
        sort_order: item.sort_order ?? 0
      })))
      if (readingsRes.data) setReadingMappings(readingsRes.data.map(item => ({
        ...item,
        word_type: item.word_type as "target" | "action" | "position"
      })))
      if (targetActionsRes.data) setTargetActions(targetActionsRes.data.map(item => ({
        target_id: item.target_id,
        action_id: item.action_id,
        target_name: (item.targets as any)?.name,
        action_name: (item.actions as any)?.name
      })))
      if (actionPositionsRes.data) setActionPositions(actionPositionsRes.data.map(item => ({
        action_id: item.action_id,
        position_id: item.position_id,
        action_name: (item.actions as any)?.name,
        position_name: (item.positions as any)?.name
      })))
      if (pricesRes.data) setPriceSuggestions(pricesRes.data.map(item => ({
        ...item,
        frequency: item.usage_count ?? 0,
        last_used: item.last_used_at ?? ''
      })))
      
    } catch (error) {
      console.error('データ読み込みエラー:', error)
      showError('データの読み込みに失敗しました。ページをリロードしてください。')
    } finally {
      setLoading(false)
    }
  }, [showError])

  useEffect(() => {
    loadAllData()
  }, [loadAllData])

  // 対象の保存
  const saveTarget = useCallback(async (data: { name: string, reading?: string, sort_order: number }) => {
    try {
      setSaving(true)
      
      if (editingItem?.id) {
        // 更新
        const { error } = await supabase
          .from('targets')
          .update(data)
          .eq('id', editingItem.id)
        if (error) throw error
      } else {
        // 新規追加
        const { error } = await supabase
          .from('targets')
          .insert({ ...data, is_active: true })
        if (error) throw error
      }
      
      // 漢字が含まれている場合、読み仮名マッピングへの登録を確認
      if (hasKanji(data.name)) {
        const existing = readingMappings.find(rm => rm.word === data.name && rm.word_type === 'target')
        if (!existing) {
          const reading = prompt(`「${data.name}」の読み仮名を入力してください（ひらがな）：`)
          if (reading && reading.trim()) {
            await supabase
              .from('reading_mappings')
              .insert({
                word: data.name,
                reading_hiragana: reading.trim(),
                reading_katakana: '',
                word_type: 'target'
              })
          }
        }
      }
      
      await loadAllData()
      setEditingItem(null)
      setIsAdding(false)
      
    } catch (error) {
      console.error('保存エラー:', error)
      showError('保存に失敗しました。もう一度お試しください。')
    } finally {
      setSaving(false)
    }
  }, [editingItem, readingMappings, loadAllData, showError])

  // 動作の保存
  const saveAction = useCallback(async (data: { name: string, sort_order: number }) => {
    try {
      setSaving(true)
      
      if (editingItem?.id) {
        // 更新
        const { error } = await supabase
          .from('actions')
          .update(data)
          .eq('id', editingItem.id)
        if (error) throw error
      } else {
        // 新規追加
        const { error } = await supabase
          .from('actions')
          .insert({ ...data, is_active: true })
        if (error) throw error
      }
      
      // 漢字が含まれている場合、読み仮名マッピングへの登録を確認
      if (hasKanji(data.name)) {
        const existing = readingMappings.find(rm => rm.word === data.name && rm.word_type === 'action')
        if (!existing) {
          const reading = prompt(`「${data.name}」の読み仮名を入力してください（ひらがな）：`)
          if (reading && reading.trim()) {
            await supabase
              .from('reading_mappings')
              .insert({
                word: data.name,
                reading_hiragana: reading.trim(),
                reading_katakana: '',
                word_type: 'action'
              })
          }
        }
      }
      
      await loadAllData()
      setEditingItem(null)
      setIsAdding(false)
      
    } catch (error) {
      console.error('保存エラー:', error)
      showError('保存に失敗しました。もう一度お試しください。')
    } finally {
      setSaving(false)
    }
  }, [editingItem, readingMappings, loadAllData, showError])

  // 位置の保存
  const savePosition = useCallback(async (data: { name: string, sort_order: number }) => {
    try {
      setSaving(true)
      
      if (editingItem?.id) {
        // 更新
        const { error } = await supabase
          .from('positions')
          .update(data)
          .eq('id', editingItem.id)
        if (error) throw error
      } else {
        // 新規追加
        const { error } = await supabase
          .from('positions')
          .insert({ ...data, is_active: true })
        if (error) throw error
      }
      
      // 漢字が含まれている場合、読み仮名マッピングへの登録を確認
      if (hasKanji(data.name)) {
        const existing = readingMappings.find(rm => rm.word === data.name && rm.word_type === 'position')
        if (!existing) {
          const reading = prompt(`「${data.name}」の読み仮名を入力してください（ひらがな）：`)
          if (reading && reading.trim()) {
            await supabase
              .from('reading_mappings')
              .insert({
                word: data.name,
                reading_hiragana: reading.trim(),
                reading_katakana: '',
                word_type: 'position'
              })
          }
        }
      }
      
      await loadAllData()
      setEditingItem(null)
      setIsAdding(false)
      
    } catch (error) {
      console.error('保存エラー:', error)
      showError('保存に失敗しました。もう一度お試しください。')
    } finally {
      setSaving(false)
    }
  }, [editingItem, readingMappings, loadAllData, showError])

  // 読み仮名の保存
  const saveReading = useCallback(async (data: { word: string, reading_hiragana: string, reading_katakana: string, word_type: 'target' | 'action' | 'position' }) => {
    try {
      setSaving(true)
      
      if (editingItem?.word) {
        // 更新
        const { error } = await supabase
          .from('reading_mappings')
          .update(data)
          .eq('word', editingItem.word)
          .eq('word_type', editingItem.word_type)
        if (error) throw error
      } else {
        // 新規追加
        const { error } = await supabase
          .from('reading_mappings')
          .insert(data)
        if (error) throw error
      }
      
      await loadAllData()
      setEditingItem(null)
      setIsAdding(false)
      
    } catch (error) {
      console.error('保存エラー:', error)
      showError('保存に失敗しました。もう一度お試しください。')
    } finally {
      setSaving(false)
    }
  }, [editingItem, loadAllData, showError])

  // 対象↔動作関連の保存
  const saveTargetAction = async (targetId: number, actionId: number) => {
    try {
      setSaving(true)
      
      const { error } = await supabase
        .from('target_actions')
        .insert({ target_id: targetId, action_id: actionId })
        
      if (error) throw error
      
      await loadAllData()
      
    } catch (error) {
      console.error('関連保存エラー:', error)
      alert('関連の保存に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  // 動作↔位置関連の保存
  const saveActionPosition = async (actionId: number, positionId: number) => {
    try {
      setSaving(true)
      
      const { error } = await supabase
        .from('action_positions')
        .insert({ action_id: actionId, position_id: positionId })
        
      if (error) throw error
      
      await loadAllData()
      
    } catch (error) {
      console.error('関連保存エラー:', error)
      alert('関連の保存に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  // 関連の削除
  const deleteTargetAction = async (targetId: number, actionId: number) => {
    if (!confirm('本当に削除しますか？')) return
    
    try {
      setSaving(true)
      
      const { error } = await supabase
        .from('target_actions')
        .delete()
        .eq('target_id', targetId)
        .eq('action_id', actionId)
        
      if (error) throw error
      
      await loadAllData()
      
    } catch (error) {
      console.error('関連削除エラー:', error)
      alert('関連の削除に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  const deleteActionPosition = async (actionId: number, positionId: number) => {
    if (!confirm('本当に削除しますか？')) return
    
    try {
      setSaving(true)
      
      const { error } = await supabase
        .from('action_positions')
        .delete()
        .eq('action_id', actionId)
        .eq('position_id', positionId)
        
      if (error) throw error
      
      await loadAllData()
      
    } catch (error) {
      console.error('関連削除エラー:', error)
      alert('関連の削除に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  // 一括登録機能
  const saveBulkTargetActions = async () => {
    if (!bulkTargetId || selectedActions.size === 0) {
      alert('対象と動作を選択してください')
      return
    }
    
    try {
      setSaving(true)
      
      const insertData = Array.from(selectedActions).map(actionId => ({
        target_id: bulkTargetId,
        action_id: actionId
      }))
      
      const { error } = await supabase
        .from('target_actions')
        .insert(insertData)
        
      if (error) throw error
      
      await loadAllData()
      setSelectedActions(new Set())
      setBulkTargetId(null)
      alert(`${insertData.length}件の関連を登録しました`)
      
    } catch (error) {
      console.error('一括登録エラー:', error)
      alert('一括登録に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  const saveBulkActionPositions = async () => {
    if (!bulkActionId || selectedPositions.size === 0) {
      alert('動作と位置を選択してください')
      return
    }
    
    try {
      setSaving(true)
      
      const insertData = Array.from(selectedPositions).map(positionId => ({
        action_id: bulkActionId,
        position_id: positionId
      }))
      
      const { error } = await supabase
        .from('action_positions')
        .insert(insertData)
        
      if (error) throw error
      
      await loadAllData()
      setSelectedPositions(new Set())
      setBulkActionId(null)
      alert(`${insertData.length}件の関連を登録しました`)
      
    } catch (error) {
      console.error('一括登録エラー:', error)
      alert('一括登録に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  // 順序正規化関数（重複を解決して連番にする）
  const normalizeSortOrder = useCallback(async (table: 'targets' | 'actions' | 'positions') => {
    try {
      const { data: items, error } = await supabase
        .from(table)
        .select('id, sort_order')
        .eq('is_active', true)
        .order('sort_order, id') // sort_order同じ場合はidでソート
      
      if (error) throw error
      if (!items || items.length === 0) return
      
      // 連番になっていない、または重複がある場合のみ更新
      const needsUpdate = items.some((item, index) => item.sort_order !== index + 1)
      
      if (needsUpdate) {

        
        // 一時的な大きな値を使用して重複を回避
        const tempOffset = 10000
        
        // 段院1: 一時的な値に変更
        for (let i = 0; i < items.length; i++) {
          await supabase
            .from(table)
            .update({ sort_order: tempOffset + i })
            .eq('id', items[i].id)
        }
        
        // 段院2: 正しい連番に変更
        for (let i = 0; i < items.length; i++) {
          await supabase
            .from(table)
            .update({ sort_order: i + 1 })
            .eq('id', items[i].id)
        }
        

      }
      
    } catch (error) {
      console.error(`${table}の順序正規化エラー:`, error)
      throw error
    }
  }, [])
  
  // 改善された順序変更機能
  const changeSortOrder = useCallback(async (table: 'targets' | 'actions' | 'positions', id: number, direction: 'up' | 'down') => {
    try {
      setSaving(true)
      
      // まず順序を正規化
      await normalizeSortOrder(table)
      
      // 最新データを取得
      const { data: items, error } = await supabase
        .from(table)
        .select('id, sort_order')
        .eq('is_active', true)
        .order('sort_order')
      
      if (error) throw error
      if (!items) return
      
      const currentIndex = items.findIndex(item => item.id === id)
      if (currentIndex === -1) return
      
      const currentItem = items[currentIndex]
      let targetIndex = -1
      
      if (direction === 'up' && currentIndex > 0) {
        targetIndex = currentIndex - 1
      } else if (direction === 'down' && currentIndex < items.length - 1) {
        targetIndex = currentIndex + 1
      }
      
      if (targetIndex === -1) return // 移動不可
      
      const targetItem = items[targetIndex]
      
      // シンプルなスワップ（正規化済みなので連番が保証されている）
      const updates = [
        { id: currentItem.id, sort_order: targetItem.sort_order },
        { id: targetItem.id, sort_order: currentItem.sort_order }
      ]
      
      // 一括更新
      for (const update of updates) {
        const { error: updateError } = await supabase
          .from(table)
          .update({ sort_order: update.sort_order })
          .eq('id', update.id)
        
        if (updateError) throw updateError
      }
      
      await loadAllData()
      
    } catch (error) {
      console.error('順序変更エラー:', error)
      showError('順序の変更に失敗しました。もう一度お試しください。')
    } finally {
      setSaving(false)
    }
  }, [normalizeSortOrder, loadAllData, showError])

  // 全マスタ一括整列機能
  const normalizeAllSortOrders = useCallback(async () => {
    if (!confirm('全てのマスタの順序を整列しますか？\n（重複や欠番を修正し、連番に整理します）')) {
      return
    }
    
    try {
      setSaving(true)

      
      // 全マスタの順序を正規化
      await normalizeSortOrder('targets')
      await normalizeSortOrder('actions')  
      await normalizeSortOrder('positions')
      
      // データを再読み込み
      await loadAllData()
      
      // 成功メッセージ
      const successMessage = '✅ 順序整列完了！\n全てのマスタが連番に整理されました。'
      alert(successMessage)

      
    } catch (error) {
      console.error('❌ 整列エラー:', error)
      showError('順序の整列に失敗しました。もう一度お試しください。')
    } finally {
      setSaving(false)
    }
  }, [normalizeSortOrder, loadAllData, showError])

  // 削除処理（パフォーマンス最適化版）
  const deleteItem = async (table: 'targets' | 'actions' | 'positions', id: number) => {
    if (!confirm('本当に削除しますか？\n※この操作は元に戻せません')) return
    
    try {
      setSaving(true)
      


      const startTime = Date.now()
      
      // 接続テスト

      const connectionTest = Date.now()
      
      // is_activeをfalseに更新（論理削除）
      const { error, data } = await supabase
        .from(table)
        .update({ is_active: false })
        .eq('id', id)
        .select()
        
      const connectionTime = Date.now() - connectionTest

      
      if (error) {
        console.error('削除処理でエラー:', error)
        console.error('エラー詳細:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw error
      }
      
      const dbUpdateTime = Date.now() - startTime

      
      // ローカル状態から即座に削除（高速化）

      const uiUpdateStart = Date.now()
      
      if (table === 'targets') {
        setTargets(prev => {
          const filtered = prev.filter(item => item.id !== id)

          return filtered
        })
      } else if (table === 'actions') {
        setActions(prev => {
          const filtered = prev.filter(item => item.id !== id)

          return filtered
        })
      } else if (table === 'positions') {
        setPositions(prev => {
          const filtered = prev.filter(item => item.id !== id)

          return filtered
        })
      }
      
      const uiUpdateTime = Date.now() - uiUpdateStart
      const totalTime = Date.now() - startTime


      
      // 成功メッセージ
      const itemName = table === 'targets' ? '対象' : table === 'actions' ? '動作' : '位置'
      alert(`${itemName}を削除しました (${totalTime}ms)`)
      
    } catch (error) {
      console.error('削除エラー:', error)
      const errorMessage = error instanceof Error ? error.message : '削除に失敗しました'
      
      // デバッグ用の詳細情報
      if (error instanceof Error && 'code' in error) {
        console.error('エラーコード:', (error as any).code)
      }
      
      // ユーザーに分かりやすいエラーメッセージ
      let userMessage = 'データベース接続エラーが発生しました。'
      if (errorMessage.includes('fetch')) {
        userMessage += '\nSupabaseサービスが起動していない可能性があります。'
      }
      
      showError(`削除エラー: ${userMessage}`)
    } finally {
      setSaving(false)
    }
  }

  // フィルタリングされたデータ（パフォーマンス最適化）
  const filteredTargetActions = useMemo(() => 
    targetActions.filter(ta => !selectedTargetFilter || ta.target_id === selectedTargetFilter),
    [targetActions, selectedTargetFilter]
  )

  const filteredActionPositions = useMemo(() => 
    actionPositions.filter(ap => !selectedActionFilter || ap.action_id === selectedActionFilter),
    [actionPositions, selectedActionFilter]
  )

  // エラー表示コンポーネント
  const ErrorMessage = () => {
    if (!error) return null
    
    return (
      <div className="fixed top-4 right-4 z-50 max-w-md">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-grow text-sm">{error}</div>
          <button
            onClick={() => setError(null)}
            className="flex-shrink-0 text-red-500 hover:text-red-700"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    )
  }

  // 編集フォームコンポーネント
  const EditForm = ({ type, item, onSave, onCancel }: {
    type: 'target' | 'action' | 'position'
    item?: any
    onSave: (data: any) => void
    onCancel: () => void
  }) => {
    // 初期値を直接設定（useEffectを削除してパフォーマンス改善）
    const [name, setName] = useState(item?.name || '')
    const [reading, setReading] = useState(type === 'target' ? (item?.reading || '') : '')
    // 新規追加時のデフォルト順序を最大値+1に設定
    const getDefaultSortOrder = useCallback(() => {
      if (item?.sort_order) return item.sort_order
      
      const dataArray = type === 'target' ? targets : type === 'action' ? actions : positions
      if (dataArray.length === 0) return 1
      
      const maxSortOrder = Math.max(...dataArray.map(item => item.sort_order || 0))
      return maxSortOrder + 1
    }, [type, item?.sort_order])
    
    const [sortOrder, setSortOrder] = useState(getDefaultSortOrder())

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (!name.trim()) {
        alert('名前を入力してください')
        return
      }
      const saveData: any = { name: name.trim(), sort_order: sortOrder }
      if (type === 'target') {
        saveData.reading = reading.trim()
      }
      onSave(saveData)
    }

    return (
      <tr className="bg-yellow-50">
        <td colSpan={type === 'target' ? 6 : 5} className="px-4 py-2">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <div className="text-sm text-gray-600 min-w-8">ID</div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 px-2 py-1 border rounded"
              placeholder="名前を入力"
              autoFocus
            />
            {(type === 'target') ? (
              <input
                type="text"
                value={reading}
                onChange={(e) => setReading(e.target.value)}
                className="flex-1 px-2 py-1 border rounded"
                placeholder="読み仮名を入力（ひらがな）"
              />
            ) : null}
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
              className="w-20 px-2 py-1 border rounded"
              placeholder="順序"
            />
            <div className="min-w-16 text-center text-sm text-gray-500">-</div>
            <div className="flex gap-1">
              <button
                type="submit"
                disabled={saving}
                className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                <Save size={16} />
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                <X size={16} />
              </button>
            </div>
          </form>
        </td>
      </tr>
    )
  }

  // 読み仮名編集フォームコンポーネント
  const ReadingEditForm = ({ item, onSave, onCancel }: {
    item?: ReadingMapping
    onSave: (data: any) => void
    onCancel: () => void
  }) => {
    const [word, setWord] = useState(item?.word || '')
    const [hiragana, setHiragana] = useState(item?.reading_hiragana || '')
    const [katakana, setKatakana] = useState(item?.reading_katakana || '')
    const [wordType, setWordType] = useState<'target' | 'action' | 'position'>(item?.word_type || 'target')

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (!word.trim()) {
        alert('単語を入力してください')
        return
      }
      if (!hiragana.trim() && !katakana.trim()) {
        alert('ひらがなまたはカタカナの読み仮名を入力してください')
        return
      }
      onSave({ 
        word: word.trim(), 
        reading_hiragana: hiragana.trim(), 
        reading_katakana: katakana.trim(),
        word_type: wordType
      })
    }

    return (
      <tr className="bg-yellow-50">
        <td colSpan={5} className="px-4 py-3">
          <form onSubmit={handleSubmit} className="grid grid-cols-5 gap-2 items-center">
            <input
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              className="px-2 py-1 border rounded"
              placeholder="単語"
              autoFocus
            />
            <input
              type="text"
              value={hiragana}
              onChange={(e) => setHiragana(e.target.value)}
              className="px-2 py-1 border rounded"
              placeholder="ひらがな"
            />
            <input
              type="text"
              value={katakana}
              onChange={(e) => setKatakana(e.target.value)}
              className="px-2 py-1 border rounded"
              placeholder="カタカナ"
            />
            <select
              value={wordType}
              onChange={(e) => setWordType(e.target.value as 'target' | 'action' | 'position')}
              className="px-2 py-1 border rounded"
            >
              <option value="target">対象</option>
              <option value="action">動作</option>
              <option value="position">位置</option>
            </select>
            <div className="flex gap-1">
              <button
                type="submit"
                disabled={saving}
                className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                <Save size={16} />
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                <X size={16} />
              </button>
            </div>
          </form>
        </td>
      </tr>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">データを読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ErrorMessage />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* ヘッダー */}
        <header className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Settings size={24} className="text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-800">作業辞書マスタ管理</h1>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => router.back()}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2 font-medium"
              >
                <ArrowLeft size={20} />
                戻る
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium"
              >
                <Home size={20} />
                メニューへ
              </button>
            </div>
          </div>
        </header>

        {/* タブナビゲーション */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('targets')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'targets'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              対象マスタ ({targets.length})
            </button>
            <button
              onClick={() => setActiveTab('actions')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'actions'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              動作マスタ ({actions.length})
            </button>
            <button
              onClick={() => setActiveTab('positions')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'positions'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              位置マスタ ({positions.length})
            </button>
            <button
              onClick={() => setActiveTab('readings')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'readings'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              読み仮名 ({readingMappings.length})
            </button>
            <button
              onClick={() => setActiveTab('relations')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'relations'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              関連設定 ({targetActions.length + actionPositions.length})
            </button>
          </div>

          {/* タブコンテンツ */}
          <div className="p-6">
            {/* 対象マスタ */}
            {activeTab === 'targets' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">対象マスタ</h2>
                  <button
                    onClick={() => setIsAdding(true)}
                    disabled={isAdding || editingItem}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                  >
                    <Plus size={20} />
                    新規追加
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">名前</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">読み仮名</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">順序</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">順序変更</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isAdding && (
                        <EditForm
                          type="target"
                          onSave={saveTarget}
                          onCancel={() => setIsAdding(false)}
                        />
                      )}
                      {targets.map((target, index) => (
                        editingItem?.id === target.id ? (
                          <EditForm
                            key={target.id}
                            type="target"
                            item={target}
                            onSave={saveTarget}
                            onCancel={() => setEditingItem(null)}
                          />
                        ) : (
                          <tr key={target.id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2">{target.id}</td>
                            <td className="border border-gray-300 px-4 py-2">{target.name}</td>
                            <td className="border border-gray-300 px-4 py-2">
                              {target.reading || (hasKanji(target.name) ? '（読み仮名なし）' : '')}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">{target.sort_order}</td>
                            <td className="border border-gray-300 px-4 py-2">
                              <div className="flex gap-1">
                                <button
                                  onClick={() => changeSortOrder('targets', target.id, 'up')}
                                  disabled={saving || index === 0}
                                  className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-30"
                                  title="上に移動"
                                >
                                  <ArrowUp size={14} />
                                </button>
                                <button
                                  onClick={() => changeSortOrder('targets', target.id, 'down')}
                                  disabled={saving || index === targets.length - 1}
                                  className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-30"
                                  title="下に移動"
                                >
                                  <ArrowDown size={14} />
                                </button>
                              </div>
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setEditingItem(target)}
                                  disabled={isAdding || editingItem}
                                  className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={() => deleteItem('targets', target.id)}
                                  disabled={saving}
                                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 動作マスタ */}
            {activeTab === 'actions' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">動作マスタ</h2>
                  <button
                    onClick={() => setIsAdding(true)}
                    disabled={isAdding || editingItem}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                  >
                    <Plus size={20} />
                    新規追加
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">名前</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">順序</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">順序変更</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isAdding && (
                        <EditForm
                          type="action"
                          onSave={saveAction}
                          onCancel={() => setIsAdding(false)}
                        />
                      )}
                      {actions.map((action, index) => (
                        editingItem?.id === action.id ? (
                          <EditForm
                            key={action.id}
                            type="action"
                            item={action}
                            onSave={saveAction}
                            onCancel={() => setEditingItem(null)}
                          />
                        ) : (
                          <tr key={action.id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2">{action.id}</td>
                            <td className="border border-gray-300 px-4 py-2">{action.name}</td>
                            <td className="border border-gray-300 px-4 py-2">{action.sort_order}</td>
                            <td className="border border-gray-300 px-4 py-2">
                              <div className="flex gap-1">
                                <button
                                  onClick={() => changeSortOrder('actions', action.id, 'up')}
                                  disabled={saving || index === 0}
                                  className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-30"
                                  title="上に移動"
                                >
                                  <ArrowUp size={14} />
                                </button>
                                <button
                                  onClick={() => changeSortOrder('actions', action.id, 'down')}
                                  disabled={saving || index === actions.length - 1}
                                  className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-30"
                                  title="下に移動"
                                >
                                  <ArrowDown size={14} />
                                </button>
                              </div>
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setEditingItem(action)}
                                  disabled={isAdding || editingItem}
                                  className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={() => deleteItem('actions', action.id)}
                                  disabled={saving}
                                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 位置マスタ */}
            {activeTab === 'positions' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">位置マスタ</h2>
                  <button
                    onClick={() => setIsAdding(true)}
                    disabled={isAdding || editingItem}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                  >
                    <Plus size={20} />
                    新規追加
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">名前</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">順序</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">順序変更</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isAdding && (
                        <EditForm
                          type="position"
                          onSave={savePosition}
                          onCancel={() => setIsAdding(false)}
                        />
                      )}
                      {positions.map((position, index) => (
                        editingItem?.id === position.id ? (
                          <EditForm
                            key={position.id}
                            type="position"
                            item={position}
                            onSave={savePosition}
                            onCancel={() => setEditingItem(null)}
                          />
                        ) : (
                          <tr key={position.id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2">{position.id}</td>
                            <td className="border border-gray-300 px-4 py-2">{position.name}</td>
                            <td className="border border-gray-300 px-4 py-2">{position.sort_order}</td>
                            <td className="border border-gray-300 px-4 py-2">
                              <div className="flex gap-1">
                                <button
                                  onClick={() => changeSortOrder('positions', position.id, 'up')}
                                  disabled={saving || index === 0}
                                  className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-30"
                                  title="上に移動"
                                >
                                  <ArrowUp size={14} />
                                </button>
                                <button
                                  onClick={() => changeSortOrder('positions', position.id, 'down')}
                                  disabled={saving || index === positions.length - 1}
                                  className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-30"
                                  title="下に移動"
                                >
                                  <ArrowDown size={14} />
                                </button>
                              </div>
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setEditingItem(position)}
                                  disabled={isAdding || editingItem}
                                  className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={() => deleteItem('positions', position.id)}
                                  disabled={saving}
                                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 読み仮名マスタ */}
            {activeTab === 'readings' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">読み仮名マスタ</h2>
                  <button
                    onClick={() => setIsAdding(true)}
                    disabled={isAdding || editingItem}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                  >
                    <Plus size={20} />
                    新規追加
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 text-left">単語</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">ひらがな</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">カタカナ</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">種別</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isAdding && (
                        <ReadingEditForm
                          onSave={saveReading}
                          onCancel={() => setIsAdding(false)}
                        />
                      )}
                      {readingMappings.map((reading, index) => (
                        editingItem?.word === reading.word && editingItem?.word_type === reading.word_type ? (
                          <ReadingEditForm
                            key={`${reading.word}-${reading.word_type}`}
                            item={reading}
                            onSave={saveReading}
                            onCancel={() => setEditingItem(null)}
                          />
                        ) : (
                          <tr key={`${reading.word}-${reading.word_type}`} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2">{reading.word}</td>
                            <td className="border border-gray-300 px-4 py-2">{reading.reading_hiragana}</td>
                            <td className="border border-gray-300 px-4 py-2">{reading.reading_katakana}</td>
                            <td className="border border-gray-300 px-4 py-2">
                              <span className={`px-2 py-1 rounded text-xs ${
                                reading.word_type === 'target' ? 'bg-blue-100 text-blue-800' :
                                reading.word_type === 'action' ? 'bg-green-100 text-green-800' :
                                'bg-purple-100 text-purple-800'
                              }`}>
                                {reading.word_type === 'target' ? '対象' :
                                 reading.word_type === 'action' ? '動作' : '位置'}
                              </span>
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setEditingItem(reading)}
                                  disabled={isAdding || editingItem}
                                  className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={async () => {
                                    if (!confirm('本当に削除しますか？')) return
                                    try {
                                      setSaving(true)
                                      const { error } = await supabase
                                        .from('reading_mappings')
                                        .delete()
                                        .eq('word', reading.word)
                                        .eq('word_type', reading.word_type)
                                      if (error) throw error
                                      await loadAllData()
                                    } catch (error) {
                                      console.error('削除エラー:', error)
                                      showError('削除に失敗しました。もう一度お試しください。')
                                    } finally {
                                      setSaving(false)
                                    }
                                  }}
                                  disabled={saving}
                                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 関連設定 */}
            {activeTab === 'relations' && (
              <div>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* 対象→動作の関連 */}
                  <div>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">対象→動作の関連</h3>
                        <div className="flex gap-2">
                          <button
                            onClick={expandAllTargets}
                            className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                          >
                            全展開
                          </button>
                          <button
                            onClick={collapseAllTargets}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                          >
                            全折りたたみ
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-4">
                        対象に対してどの動作が可能かを設定
                      </div>
                      
                      {/* フィルタリング */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">対象で絞り込み：</label>
                        <select 
                          className="w-full px-3 py-2 border rounded-lg"
                          value={selectedTargetFilter || ''}
                          onChange={(e) => setSelectedTargetFilter(e.target.value ? parseInt(e.target.value) : null)}
                        >
                          <option value="">すべての対象を表示</option>
                          {targets.map(target => (
                            <option key={target.id} value={target.id}>
                              {target.name} ({targetActions.filter(ta => ta.target_id === target.id).length}件)
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    {/* 一括登録セクション */}
                    <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                      <h4 className="font-medium mb-3">一括関連登録</h4>
                      
                      {/* ステップ1: 対象選択 */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">1. 対象を選択：</label>
                        <select 
                          className="w-full px-3 py-2 border rounded-lg"
                          value={bulkTargetId || ''}
                          onChange={(e) => {
                            const targetId = e.target.value ? parseInt(e.target.value) : null
                            setBulkTargetId(targetId)
                            setSelectedActions(new Set())
                          }}
                        >
                          <option value="">対象を選択してください</option>
                          {targets.map(target => (
                            <option key={target.id} value={target.id}>{target.name}</option>
                          ))}
                        </select>
                      </div>
                      
                      {/* ステップ2: 動作選択（チェックボックス） */}
                      {bulkTargetId && (
                        <div className="mb-4">
                          <label className="block text-sm font-medium mb-2">2. 関連付けたい動作にチェック：</label>
                          <div className="max-h-48 overflow-y-auto border rounded-lg p-3 bg-white">
                            {actions.map(action => {
                              const isAlreadyLinked = targetActions.some(ta => ta.target_id === bulkTargetId && ta.action_id === action.id)
                              const isSelected = selectedActions.has(action.id)
                              
                              return (
                                <div key={action.id} className="flex items-center gap-2 py-1">
                                  <input
                                    type="checkbox"
                                    id={`action-${action.id}`}
                                    checked={isSelected}
                                    disabled={isAlreadyLinked}
                                    onChange={(e) => {
                                      const newSelected = new Set(selectedActions)
                                      if (e.target.checked) {
                                        newSelected.add(action.id)
                                      } else {
                                        newSelected.delete(action.id)
                                      }
                                      setSelectedActions(newSelected)
                                    }}
                                    className="w-4 h-4"
                                  />
                                  <label 
                                    htmlFor={`action-${action.id}`}
                                    className={`flex-1 cursor-pointer ${
                                      isAlreadyLinked ? 'text-gray-400 line-through' : 
                                      isSelected ? 'text-blue-600 font-medium' : ''
                                    }`}
                                  >
                                    {action.name}
                                    {isAlreadyLinked && <span className="text-xs ml-2">(既に登録済み)</span>}
                                  </label>
                                </div>
                              )
                            })}
                          </div>
                          
                          {/* 全選択・全解除ボタン */}
                          <div className="mt-2 flex gap-2">
                            <button
                              onClick={() => {
                                const availableActions = actions.filter(action => 
                                  !targetActions.some(ta => ta.target_id === bulkTargetId && ta.action_id === action.id)
                                ).map(action => action.id)
                                setSelectedActions(new Set(availableActions))
                              }}
                              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                            >
                              全選択
                            </button>
                            <button
                              onClick={() => setSelectedActions(new Set())}
                              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                            >
                              全解除
                            </button>
                            <div className="text-xs text-gray-600 flex items-center ml-auto">
                              {selectedActions.size}件選択中
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* ステップ3: 登録実行 */}
                      {bulkTargetId && selectedActions.size > 0 && (
                        <div>
                          <button
                            onClick={saveBulkTargetActions}
                            disabled={saving}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
                          >
                            {saving ? '登録中...' : `${selectedActions.size}件の関連を一括登録`}
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      {(() => {
                        // 対象ごとにグループ化
                        const groupedByTarget = filteredTargetActions.reduce((acc, ta) => {
                          if (!acc[ta.target_id]) {
                            acc[ta.target_id] = {
                              target_name: ta.target_name || '',
                              actions: []
                            }
                          }
                          acc[ta.target_id].actions.push(ta)
                          return acc
                        }, {} as Record<number, { target_name: string, actions: typeof filteredTargetActions }>)

                        const targetGroups = Object.entries(groupedByTarget)

                        if (targetGroups.length === 0) {
                          return (
                            <div className="border border-gray-300 px-4 py-8 text-center text-gray-500 rounded-lg">
                              {selectedTargetFilter ? '選択した対象に関連する動作がありません' : '関連が登録されていません'}
                            </div>
                          )
                        }

                        return targetGroups.map(([targetIdStr, group]) => {
                          const targetId = parseInt(targetIdStr)
                          const isExpanded = expandedTargets.has(targetId)
                          
                          return (
                            <div key={targetId} className="border border-gray-300 rounded-lg">
                              {/* ヘッダー行（展開/折りたたみボタン） */}
                              <div 
                                className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 rounded-t-lg"
                                onClick={() => toggleTargetExpansion(targetId)}
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-lg">
                                    {isExpanded ? '▼' : '▶'}
                                  </span>
                                  <span className="font-medium text-gray-900">
                                    {group.target_name}
                                  </span>
                                  <span className="px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">
                                    {group.actions.length}個の動作
                                  </span>
                                </div>
                              </div>
                              
                              {/* 展開された内容 */}
                              {isExpanded && (
                                <div className="border-t border-gray-200">
                                  <table className="w-full">
                                    <thead className="bg-gray-50">
                                      <tr>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">動作</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 w-20">操作</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {group.actions.map((ta, index) => (
                                        <tr key={index} className="hover:bg-gray-50 border-t border-gray-100">
                                          <td className="px-4 py-2 text-sm text-gray-900">
                                            {ta.action_name}
                                          </td>
                                          <td className="px-4 py-2">
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation()
                                                deleteTargetAction(ta.target_id, ta.action_id)
                                              }}
                                              disabled={saving}
                                              className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded disabled:opacity-50"
                                              title="削除"
                                            >
                                              <Trash2 size={16} />
                                            </button>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          )
                        })
                      })()}
                    </div>
                  </div>

                  {/* 動作→位置の関連 */}
                  <div>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">動作→位置の関連</h3>
                        <div className="flex gap-2">
                          <button
                            onClick={expandAllActions}
                            className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                          >
                            全展開
                          </button>
                          <button
                            onClick={collapseAllActions}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                          >
                            全折りたたみ
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-4">
                        動作に対してどの位置が可能かを設定
                      </div>
                      
                      {/* フィルタリング */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">動作で絞り込み：</label>
                        <select 
                          className="w-full px-3 py-2 border rounded-lg"
                          value={selectedActionFilter || ''}
                          onChange={(e) => setSelectedActionFilter(e.target.value ? parseInt(e.target.value) : null)}
                        >
                          <option value="">すべての動作を表示</option>
                          {actions.map(action => (
                            <option key={action.id} value={action.id}>
                              {action.name} ({actionPositions.filter(ap => ap.action_id === action.id).length}件)
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    {/* 一括登録セクション */}
                    <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                      <h4 className="font-medium mb-3">一括関連登録</h4>
                      
                      {/* ステップ1: 動作選択 */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">1. 動作を選択：</label>
                        <select 
                          className="w-full px-3 py-2 border rounded-lg"
                          value={bulkActionId || ''}
                          onChange={(e) => {
                            const actionId = e.target.value ? parseInt(e.target.value) : null
                            setBulkActionId(actionId)
                            setSelectedPositions(new Set())
                          }}
                        >
                          <option value="">動作を選択してください</option>
                          {actions.map(action => (
                            <option key={action.id} value={action.id}>{action.name}</option>
                          ))}
                        </select>
                      </div>
                      
                      {/* ステップ2: 位置選択（チェックボックス） */}
                      {bulkActionId && (
                        <div className="mb-4">
                          <label className="block text-sm font-medium mb-2">2. 関連付けたい位置にチェック：</label>
                          <div className="max-h-48 overflow-y-auto border rounded-lg p-3 bg-white">
                            {positions.map(position => {
                              const isAlreadyLinked = actionPositions.some(ap => ap.action_id === bulkActionId && ap.position_id === position.id)
                              const isSelected = selectedPositions.has(position.id)
                              
                              return (
                                <div key={position.id} className="flex items-center gap-2 py-1">
                                  <input
                                    type="checkbox"
                                    id={`position-${position.id}`}
                                    checked={isSelected}
                                    disabled={isAlreadyLinked}
                                    onChange={(e) => {
                                      const newSelected = new Set(selectedPositions)
                                      if (e.target.checked) {
                                        newSelected.add(position.id)
                                      } else {
                                        newSelected.delete(position.id)
                                      }
                                      setSelectedPositions(newSelected)
                                    }}
                                    className="w-4 h-4"
                                  />
                                  <label 
                                    htmlFor={`position-${position.id}`}
                                    className={`flex-1 cursor-pointer ${
                                      isAlreadyLinked ? 'text-gray-400 line-through' : 
                                      isSelected ? 'text-green-600 font-medium' : ''
                                    }`}
                                  >
                                    {position.name}
                                    {isAlreadyLinked && <span className="text-xs ml-2">(既に登録済み)</span>}
                                  </label>
                                </div>
                              )
                            })}
                          </div>
                          
                          {/* 全選択・全解除ボタン */}
                          <div className="mt-2 flex gap-2">
                            <button
                              onClick={() => {
                                const availablePositions = positions.filter(position => 
                                  !actionPositions.some(ap => ap.action_id === bulkActionId && ap.position_id === position.id)
                                ).map(position => position.id)
                                setSelectedPositions(new Set(availablePositions))
                              }}
                              className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                            >
                              全選択
                            </button>
                            <button
                              onClick={() => setSelectedPositions(new Set())}
                              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                            >
                              全解除
                            </button>
                            <div className="text-xs text-gray-600 flex items-center ml-auto">
                              {selectedPositions.size}件選択中
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* ステップ3: 登録実行 */}
                      {bulkActionId && selectedPositions.size > 0 && (
                        <div>
                          <button
                            onClick={saveBulkActionPositions}
                            disabled={saving}
                            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
                          >
                            {saving ? '登録中...' : `${selectedPositions.size}件の関連を一括登録`}
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      {(() => {
                        // 動作ごとにグループ化
                        const groupedByAction = filteredActionPositions.reduce((acc, ap) => {
                          if (!acc[ap.action_id]) {
                            acc[ap.action_id] = {
                              action_name: ap.action_name || '',
                              positions: []
                            }
                          }
                          acc[ap.action_id].positions.push(ap)
                          return acc
                        }, {} as Record<number, { action_name: string, positions: typeof filteredActionPositions }>)

                        const actionGroups = Object.entries(groupedByAction)

                        if (actionGroups.length === 0) {
                          return (
                            <div className="border border-gray-300 px-4 py-8 text-center text-gray-500 rounded-lg">
                              {selectedActionFilter ? '選択した動作に関連する位置がありません' : '関連が登録されていません'}
                            </div>
                          )
                        }

                        return actionGroups.map(([actionIdStr, group]) => {
                          const actionId = parseInt(actionIdStr)
                          const isExpanded = expandedActions.has(actionId)
                          
                          return (
                            <div key={actionId} className="border border-gray-300 rounded-lg">
                              {/* ヘッダー行（展開/折りたたみボタン） */}
                              <div 
                                className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 rounded-t-lg"
                                onClick={() => toggleActionExpansion(actionId)}
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-lg">
                                    {isExpanded ? '▼' : '▶'}
                                  </span>
                                  <span className="font-medium text-gray-900">
                                    {group.action_name}
                                  </span>
                                  <span className="px-2 py-1 text-sm bg-green-100 text-green-700 rounded-full">
                                    {group.positions.length}個の位置
                                  </span>
                                </div>
                              </div>
                              
                              {/* 展開された内容 */}
                              {isExpanded && (
                                <div className="border-t border-gray-200">
                                  <table className="w-full">
                                    <thead className="bg-gray-50">
                                      <tr>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">位置</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 w-20">操作</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {group.positions.map((ap, index) => (
                                        <tr key={index} className="hover:bg-gray-50 border-t border-gray-100">
                                          <td className="px-4 py-2 text-sm text-gray-900">
                                            {ap.position_name}
                                          </td>
                                          <td className="px-4 py-2">
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation()
                                                deleteActionPosition(ap.action_id, ap.position_id)
                                              }}
                                              disabled={saving}
                                              className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded disabled:opacity-50"
                                              title="削除"
                                            >
                                              <Trash2 size={16} />
                                            </button>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          )
                        })
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* 管理者向け整列ボタン（こっそり配置） */}
          <div className="mt-8 pt-4 border-t border-gray-200">
            <div className="flex justify-end">
              <button
                onClick={normalizeAllSortOrders}
                disabled={saving || loading}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50 transition-colors duration-200"
                title="全マスタの順序を整列（重複解決・連番化）"
              >
                {saving ? '整列中...' : '🔧 順序整列'}
              </button>
            </div>
            <div className="text-right mt-1">
              <span className="text-xs text-gray-400">
                管理者用：順序の重複や欠番を修正
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}