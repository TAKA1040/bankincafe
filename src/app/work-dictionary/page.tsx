'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Settings, Plus, Trash2, Edit2, Save, X, ArrowLeft, ArrowUp, ArrowDown } from 'lucide-react'
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
  const [editingItem, setEditingItem] = useState<any>(null)
  const [isAdding, setIsAdding] = useState(false)
  
  // フィルタリング状態
  const [selectedTargetFilter, setSelectedTargetFilter] = useState<number | null>(null)
  const [selectedActionFilter, setSelectedActionFilter] = useState<number | null>(null)
  
  // 一括登録状態
  const [bulkTargetId, setBulkTargetId] = useState<number | null>(null)
  const [bulkActionId, setBulkActionId] = useState<number | null>(null)
  const [selectedActions, setSelectedActions] = useState<Set<number>>(new Set())
  const [selectedPositions, setSelectedPositions] = useState<Set<number>>(new Set())
  
  // ローディング状態
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // データ読み込み
  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
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
        supabase.from('targets').select('*').order('sort_order'),
        supabase.from('actions').select('*').order('sort_order'),
        supabase.from('positions').select('*').order('sort_order'),
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

      if (targetsRes.data) setTargets(targetsRes.data)
      if (actionsRes.data) setActions(actionsRes.data)
      if (positionsRes.data) setPositions(positionsRes.data)
      if (readingsRes.data) setReadingMappings(readingsRes.data)
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
      if (pricesRes.data) setPriceSuggestions(pricesRes.data)
      
    } catch (error) {
      console.error('データ読み込みエラー:', error)
      alert('データの読み込みに失敗しました')
    } finally {
      setLoading(false)
    }
  }

  // 対象の保存
  const saveTarget = async (data: { name: string, sort_order: number }) => {
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
      alert('保存に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  // 動作の保存
  const saveAction = async (data: { name: string, sort_order: number }) => {
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
      alert('保存に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  // 位置の保存
  const savePosition = async (data: { name: string, sort_order: number }) => {
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
      alert('保存に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  // 読み仮名の保存
  const saveReading = async (data: { word: string, reading_hiragana: string, reading_katakana: string, word_type: 'target' | 'action' | 'position' }) => {
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
      alert('保存に失敗しました')
    } finally {
      setSaving(false)
    }
  }

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

  // 順序変更機能
  const changeSortOrder = async (table: 'targets' | 'actions' | 'positions', id: number, direction: 'up' | 'down') => {
    try {
      setSaving(true)
      
      const dataArray = table === 'targets' ? targets : table === 'actions' ? actions : positions
      const currentItem = dataArray.find(item => item.id === id)
      if (!currentItem) return
      
      const sortedItems = [...dataArray].sort((a, b) => a.sort_order - b.sort_order)
      const currentIndex = sortedItems.findIndex(item => item.id === id)
      
      if (direction === 'up' && currentIndex > 0) {
        // 上に移動：前の項目と順序を交換
        const prevItem = sortedItems[currentIndex - 1]
        const newCurrentOrder = prevItem.sort_order
        const newPrevOrder = currentItem.sort_order
        
        await supabase.from(table).update({ sort_order: newCurrentOrder }).eq('id', currentItem.id)
        await supabase.from(table).update({ sort_order: newPrevOrder }).eq('id', prevItem.id)
        
      } else if (direction === 'down' && currentIndex < sortedItems.length - 1) {
        // 下に移動：次の項目と順序を交換
        const nextItem = sortedItems[currentIndex + 1]
        const newCurrentOrder = nextItem.sort_order
        const newNextOrder = currentItem.sort_order
        
        await supabase.from(table).update({ sort_order: newCurrentOrder }).eq('id', currentItem.id)
        await supabase.from(table).update({ sort_order: newNextOrder }).eq('id', nextItem.id)
      }
      
      await loadAllData()
      
    } catch (error) {
      console.error('順序変更エラー:', error)
      alert('順序の変更に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  // 削除処理
  const deleteItem = async (table: string, id: number) => {
    if (!confirm('本当に削除しますか？')) return
    
    try {
      setSaving(true)
      
      // is_activeをfalseに更新（論理削除）
      const { error } = await supabase
        .from(table)
        .update({ is_active: false })
        .eq('id', id)
        
      if (error) throw error
      
      await loadAllData()
      
    } catch (error) {
      console.error('削除エラー:', error)
      alert('削除に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  // 編集フォームコンポーネント
  const EditForm = ({ type, item, onSave, onCancel }: {
    type: 'target' | 'action' | 'position'
    item?: any
    onSave: (data: any) => void
    onCancel: () => void
  }) => {
    const [name, setName] = useState(item?.name || '')
    const [sortOrder, setSortOrder] = useState(item?.sort_order || 0)

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (!name.trim()) {
        alert('名前を入力してください')
        return
      }
      onSave({ name: name.trim(), sort_order: sortOrder })
    }

    return (
      <tr className="bg-yellow-50">
        <td colSpan={5} className="px-4 py-2">
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* ヘッダー */}
        <header className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
              >
                <ArrowLeft size={20} />
                メニューに戻る
              </button>
              <div className="flex items-center gap-2">
                <Settings size={24} className="text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-800">作業辞書マスタ管理</h1>
              </div>
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
                                  onClick={() => {
                                    if (!confirm('本当に削除しますか？')) return
                                    supabase
                                      .from('reading_mappings')
                                      .delete()
                                      .eq('word', reading.word)
                                      .eq('word_type', reading.word_type)
                                      .then(() => loadAllData())
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
                      <h3 className="text-lg font-semibold mb-2">対象→動作の関連</h3>
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
                    
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left">対象</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">動作</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          {targetActions
                            .filter(ta => !selectedTargetFilter || ta.target_id === selectedTargetFilter)
                            .map((ta, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="border border-gray-300 px-4 py-2">
                                <span className={`px-2 py-1 rounded ${selectedTargetFilter === ta.target_id ? 'bg-blue-100 text-blue-800' : ''}`}>
                                  {ta.target_name}
                                </span>
                              </td>
                              <td className="border border-gray-300 px-4 py-2">{ta.action_name}</td>
                              <td className="border border-gray-300 px-4 py-2">
                                <button
                                  onClick={() => deleteTargetAction(ta.target_id, ta.action_id)}
                                  disabled={saving}
                                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                          {targetActions.filter(ta => !selectedTargetFilter || ta.target_id === selectedTargetFilter).length === 0 && (
                            <tr>
                              <td colSpan={3} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                                {selectedTargetFilter ? '選択した対象に関連する動作がありません' : '関連が登録されていません'}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 動作→位置の関連 */}
                  <div>
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">動作→位置の関連</h3>
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
                    
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left">動作</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">位置</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          {actionPositions
                            .filter(ap => !selectedActionFilter || ap.action_id === selectedActionFilter)
                            .map((ap, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="border border-gray-300 px-4 py-2">
                                <span className={`px-2 py-1 rounded ${selectedActionFilter === ap.action_id ? 'bg-green-100 text-green-800' : ''}`}>
                                  {ap.action_name}
                                </span>
                              </td>
                              <td className="border border-gray-300 px-4 py-2">{ap.position_name}</td>
                              <td className="border border-gray-300 px-4 py-2">
                                <button
                                  onClick={() => deleteActionPosition(ap.action_id, ap.position_id)}
                                  disabled={saving}
                                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                          {actionPositions.filter(ap => !selectedActionFilter || ap.action_id === selectedActionFilter).length === 0 && (
                            <tr>
                              <td colSpan={3} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                                {selectedActionFilter ? '選択した動作に関連する位置がありません' : '関連が登録されていません'}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}