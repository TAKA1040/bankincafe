'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, GripVertical, ChevronUp, ChevronDown, RotateCcw, Home } from 'lucide-react'

import { CustomerCategory, CustomerCategoryDB } from '@/lib/customer-categories'

export default function CustomerSettingsPage() {
  const router = useRouter()
  const [db] = useState(() => new CustomerCategoryDB())
  const [categories, setCategories] = useState<CustomerCategory[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newCategory, setNewCategory] = useState({ name: '', companyName: '' })
  const [showAddForm, setShowAddForm] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  useEffect(() => {
    console.log('=== CustomerSettings初期化 ===')
    console.log('localStorage確認:', localStorage.getItem('bankin_customer_categories'))
    const initialCategories = db.getCategories()
    console.log('初期カテゴリー一覧:', initialCategories)
    setCategories(initialCategories)
  }, [db])

  const handleSaveEdit = (id: string, name: string, companyName: string) => {
    console.log('=== 編集保存実行 ===', { id, name, companyName })
    
    if (name.trim() && companyName.trim()) {
      console.log('編集前のカテゴリー一覧:', db.getCategories())
      
      db.updateCategory(id, { name: name.trim(), companyName: companyName.trim() })
      
      const updatedCategories = db.getCategories()
      console.log('編集後のカテゴリー一覧:', updatedCategories)
      
      setCategories(updatedCategories)
      setEditingId(null)
    } else {
      console.log('編集保存失敗: 必須項目が空です')
    }
  }

  const handleAddCategory = () => {
    if (newCategory.name.trim() && newCategory.companyName.trim()) {
      db.addCategory({
        name: newCategory.name.trim(),
        companyName: newCategory.companyName.trim()
      })
      setCategories(db.getCategories())
      setNewCategory({ name: '', companyName: '' })
      setShowAddForm(false)
    }
  }

  const handleDeleteCategory = (id: string) => {
    if (confirm('この顧客カテゴリーを削除してもよろしいですか？')) {
      db.deleteCategory(id)
      setCategories(db.getCategories())
    }
  }

  const handleResetToDefaults = () => {
    if (confirm('顧客カテゴリーをデフォルト状態にリセットしますか？\n※カスタム追加したカテゴリーは削除されます')) {
      console.log('=== リセット実行 ===')
      console.log('リセット前localStorage:', localStorage.getItem('bankin_customer_categories'))
      
      db.resetToDefaults()
      
      console.log('リセット後localStorage:', localStorage.getItem('bankin_customer_categories'))
      
      const resetCategories = db.getCategories()
      console.log('リセット後カテゴリー:', resetCategories)
      
      setCategories(resetCategories)
      setEditingId(null)
      setShowAddForm(false)
    }
  }

  const moveCategory = (index: number, direction: 'up' | 'down') => {
    const newCategories = [...categories]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    if (targetIndex >= 0 && targetIndex < newCategories.length) {
      [newCategories[index], newCategories[targetIndex]] = [newCategories[targetIndex], newCategories[index]]
      setCategories(newCategories)
      db.reorderCategories(newCategories)
    }
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === dropIndex) return
    
    const newCategories = [...categories]
    const draggedItem = newCategories[draggedIndex]
    newCategories.splice(draggedIndex, 1)
    newCategories.splice(dropIndex, 0, draggedItem)
    
    setCategories(newCategories)
    db.reorderCategories(newCategories)
    setDraggedIndex(null)
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <header className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Edit2 className="text-blue-600" size={32} />
              <h1 className="text-2xl font-bold text-gray-800">顧客カテゴリー設定</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Plus size={20} />
                新規追加
              </button>
              <button
                onClick={handleResetToDefaults}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
              >
                <RotateCcw size={20} />
                リセット
              </button>
              <button
                onClick={() => router.back()}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
              >
                <ArrowLeft size={20} />
                戻る
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Home size={20} />
                メニューへ
              </button>
            </div>
          </div>
        </header>

        {/* 説明 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 text-sm">
            <strong>顧客カテゴリー設定について:</strong><br />
            ここで設定したカテゴリーは請求書作成時に選択できるようになります。<br />
            カテゴリーを選択すると、対応する会社名が自動で顧客名に入力されます。<br />
            <strong>順序変更:</strong> ドラッグ&ドロップまたは矢印ボタンで表示順序を変更できます。
          </p>
        </div>

        {/* 新規追加フォーム */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-green-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">新しい顧客カテゴリーを追加</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリー名</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  placeholder="例: ABC商事"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">会社名（正式名称）</label>
                <input
                  type="text"
                  value={newCategory.companyName}
                  onChange={(e) => setNewCategory({...newCategory, companyName: e.target.value})}
                  placeholder="例: 株式会社ABCコマース"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Save size={16} />
                追加
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false)
                  setNewCategory({ name: '', companyName: '' })
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2"
              >
                <X size={16} />
                キャンセル
              </button>
            </div>
          </div>
        )}

        {/* カテゴリー一覧 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-800">登録済みカテゴリー</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">順序</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">カテゴリー名</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">会社名</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">種別</th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category, index) => (
                  <tr 
                    key={category.id} 
                    className={`hover:bg-gray-50 transition-colors ${
                      draggedIndex === index ? 'opacity-50' : ''
                    }`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <GripVertical 
                          className="text-gray-400 cursor-grab active:cursor-grabbing" 
                          size={16} 
                        />
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => moveCategory(index, 'up')}
                            disabled={index === 0}
                            className={`p-1 rounded ${
                              index === 0 
                                ? 'text-gray-300 cursor-not-allowed' 
                                : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                            }`}
                            title="上に移動"
                          >
                            <ChevronUp size={12} />
                          </button>
                          <button
                            onClick={() => moveCategory(index, 'down')}
                            disabled={index === categories.length - 1}
                            className={`p-1 rounded ${
                              index === categories.length - 1 
                                ? 'text-gray-300 cursor-not-allowed' 
                                : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                            }`}
                            title="下に移動"
                          >
                            <ChevronDown size={12} />
                          </button>
                        </div>
                        <span className="text-sm text-gray-500 font-mono">#{index + 1}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {editingId === category.id ? (
                        <input
                          type="text"
                          defaultValue={category.name}
                          data-name-for={category.id}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === category.id ? (
                        <input
                          type="text"
                          defaultValue={category.companyName}
                          data-company-for={category.id}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="text-sm text-gray-700">{category.companyName || '（手動入力）'}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        category.isDefault 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {category.isDefault ? 'システム標準' : 'カスタム'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        {editingId === category.id ? (
                          <button
                            onClick={() => {
                              console.log('=== 保存ボタンクリック ===', category.id)
                              const nameInput = document.querySelector(`input[data-name-for="${category.id}"]`) as HTMLInputElement
                              const companyInput = document.querySelector(`input[data-company-for="${category.id}"]`) as HTMLInputElement
                              if (nameInput && companyInput) {
                                handleSaveEdit(category.id, nameInput.value, companyInput.value)
                              }
                            }}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            title="保存"
                          >
                            <Save size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              console.log('=== 編集ボタンクリック ===', category.id)
                              setEditingId(category.id)
                            }}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="編集"
                          >
                            <Edit2 size={16} />
                          </button>
                        )}
                        
                        {!category.isDefault && (
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="削除"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {categories.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center text-gray-500">
            顧客カテゴリーがありません。新規追加ボタンから追加してください。
          </div>
        )}
      </div>
    </div>
  )
}