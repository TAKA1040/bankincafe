'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, GripVertical, ChevronUp, ChevronDown, Hash } from 'lucide-react'

interface RegistrationMaster {
  id: string
  registrationNumber: string
  description?: string
  category?: string
  usageCount: number
  lastUsedAt?: string
  isDefault?: boolean
}

// 登録番号マスターDBクラス
class RegistrationMasterDB {
  private readonly STORAGE_KEY = 'bankin_registration_master'

  getRegistrations(): RegistrationMaster[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : this.getDefaultRegistrations()
    } catch {
      return this.getDefaultRegistrations()
    }
  }

  private getDefaultRegistrations(): RegistrationMaster[] {
    return [
      {
        id: 'reg_1',
        registrationNumber: 'REG-2024-001',
        description: 'システム開発案件用',
        category: 'システム',
        usageCount: 10,
        lastUsedAt: '2024-03-15',
        isDefault: true
      },
      {
        id: 'reg_2',
        registrationNumber: 'WEB-2024-001',
        description: 'Webサイト制作用',
        category: 'Web',
        usageCount: 8,
        lastUsedAt: '2024-03-10',
        isDefault: true
      },
      {
        id: 'reg_3',
        registrationNumber: 'MAINT-2024-001',
        description: '保守業務用',
        category: 'メンテナンス',
        usageCount: 5,
        lastUsedAt: '2024-03-05',
        isDefault: true
      }
    ]
  }

  saveRegistrations(registrations: RegistrationMaster[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(registrations))
    } catch (error) {
      console.error('Failed to save registration master:', error)
    }
  }

  addRegistration(registration: Omit<RegistrationMaster, 'id'>): RegistrationMaster {
    const registrations = this.getRegistrations()
    const newRegistration: RegistrationMaster = {
      ...registration,
      id: Date.now().toString(),
      usageCount: registration.usageCount || 1,
      lastUsedAt: new Date().toISOString().split('T')[0]
    }
    registrations.push(newRegistration)
    this.saveRegistrations(registrations)
    return newRegistration
  }

  updateRegistration(id: string, updates: Partial<RegistrationMaster>): void {
    const registrations = this.getRegistrations()
    const index = registrations.findIndex(reg => reg.id === id)
    if (index !== -1) {
      registrations[index] = { ...registrations[index], ...updates }
      this.saveRegistrations(registrations)
    }
  }

  deleteRegistration(id: string): void {
    const registrations = this.getRegistrations()
    const filtered = registrations.filter(reg => reg.id !== id && !reg.isDefault)
    this.saveRegistrations(filtered)
  }

  reorderRegistrations(registrations: RegistrationMaster[]): void {
    this.saveRegistrations(registrations)
  }

  // 新規登録番号の自動登録
  autoRegisterRegistration(registrationNumber: string): void {
    const registrations = this.getRegistrations()
    const existing = registrations.find(reg => 
      reg.registrationNumber.toLowerCase() === registrationNumber.toLowerCase()
    )
    
    if (existing) {
      // 既存の場合は使用回数を増やす
      this.updateRegistration(existing.id, {
        usageCount: existing.usageCount + 1,
        lastUsedAt: new Date().toISOString().split('T')[0]
      })
    } else {
      // 新規の場合は自動登録
      this.addRegistration({
        registrationNumber: registrationNumber,
        description: '自動登録',
        category: 'その他',
        usageCount: 1
      })
    }
  }

  // 曖昧検索
  searchRegistrations(keyword: string): RegistrationMaster[] {
    if (!keyword.trim()) return this.getRegistrations()
    
    const normalizedKeyword = keyword.toLowerCase()
    return this.getRegistrations()
      .filter(registration => 
        registration.registrationNumber.toLowerCase().includes(normalizedKeyword) ||
        (registration.description && registration.description.toLowerCase().includes(normalizedKeyword)) ||
        (registration.category && registration.category.toLowerCase().includes(normalizedKeyword))
      )
      .sort((a, b) => b.usageCount - a.usageCount)
  }
}

export default function RegistrationSettingsPage() {
  const router = useRouter()
  const [db] = useState(() => new RegistrationMasterDB())
  const [registrations, setRegistrations] = useState<RegistrationMaster[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newRegistration, setNewRegistration] = useState({ 
    registrationNumber: '', 
    description: '', 
    category: '' 
  })
  const [showAddForm, setShowAddForm] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  useEffect(() => {
    setRegistrations(db.getRegistrations())
  }, [db])

  const handleSaveEdit = (id: string, registrationNumber: string, description?: string, category?: string) => {
    if (registrationNumber.trim()) {
      db.updateRegistration(id, { 
        registrationNumber: registrationNumber.trim(),
        description: description?.trim() || undefined,
        category: category?.trim() || undefined 
      })
      setRegistrations(db.getRegistrations())
      setEditingId(null)
    }
  }

  const handleAddRegistration = () => {
    if (newRegistration.registrationNumber.trim()) {
      db.addRegistration({
        registrationNumber: newRegistration.registrationNumber.trim(),
        description: newRegistration.description.trim() || undefined,
        category: newRegistration.category.trim() || undefined,
        usageCount: 1
      })
      setRegistrations(db.getRegistrations())
      setNewRegistration({ registrationNumber: '', description: '', category: '' })
      setShowAddForm(false)
    }
  }

  const handleDeleteRegistration = (id: string) => {
    if (confirm('この登録番号マスターを削除してもよろしいですか？')) {
      db.deleteRegistration(id)
      setRegistrations(db.getRegistrations())
    }
  }

  const moveRegistration = (index: number, direction: 'up' | 'down') => {
    const newRegistrations = [...registrations]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    if (targetIndex >= 0 && targetIndex < newRegistrations.length) {
      [newRegistrations[index], newRegistrations[targetIndex]] = [newRegistrations[targetIndex], newRegistrations[index]]
      setRegistrations(newRegistrations)
      db.reorderRegistrations(newRegistrations)
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
    
    const newRegistrations = [...registrations]
    const draggedItem = newRegistrations[draggedIndex]
    newRegistrations.splice(draggedIndex, 1)
    newRegistrations.splice(dropIndex, 0, draggedItem)
    
    setRegistrations(newRegistrations)
    db.reorderRegistrations(newRegistrations)
    setDraggedIndex(null)
  }

  const handleBack = () => router.push('/')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <header className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Hash className="text-blue-600" size={32} />
              <h1 className="text-2xl font-bold text-gray-800">登録番号マスター設定</h1>
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
                onClick={handleBack}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
              >
                <ArrowLeft size={20} />
                戻る
              </button>
            </div>
          </div>
        </header>

        {/* 説明 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 text-sm">
            <strong>登録番号マスター設定について:</strong><br />
            ここで設定した登録番号は請求書作成時に選択できるようになります。<br />
            新規登録番号を入力した場合は自動的にマスターに登録されます。<br />
            <strong>順序変更:</strong> ドラッグ&ドロップまたは矢印ボタンで表示順序を変更できます。
          </p>
        </div>

        {/* 新規追加フォーム */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-green-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">新しい登録番号マスターを追加</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">登録番号</label>
                <input
                  type="text"
                  value={newRegistration.registrationNumber}
                  onChange={(e) => setNewRegistration({...newRegistration, registrationNumber: e.target.value})}
                  placeholder="例: REG-2024-001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">説明（任意）</label>
                <input
                  type="text"
                  value={newRegistration.description}
                  onChange={(e) => setNewRegistration({...newRegistration, description: e.target.value})}
                  placeholder="例: システム開発案件用"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリー（任意）</label>
                <input
                  type="text"
                  value={newRegistration.category}
                  onChange={(e) => setNewRegistration({...newRegistration, category: e.target.value})}
                  placeholder="例: システム、Web、メンテナンス"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddRegistration}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Save size={16} />
                追加
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false)
                  setNewRegistration({ registrationNumber: '', description: '', category: '' })
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2"
              >
                <X size={16} />
                キャンセル
              </button>
            </div>
          </div>
        )}

        {/* 登録番号一覧 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-800">登録済み登録番号マスター</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">順序</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">登録番号</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">説明</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">カテゴリー</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">使用回数</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">最終使用日</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">種別</th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {registrations.map((registration, index) => (
                  <tr 
                    key={registration.id} 
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
                            onClick={() => moveRegistration(index, 'up')}
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
                            onClick={() => moveRegistration(index, 'down')}
                            disabled={index === registrations.length - 1}
                            className={`p-1 rounded ${
                              index === registrations.length - 1 
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
                      {editingId === registration.id ? (
                        <input
                          type="text"
                          defaultValue={registration.registrationNumber}
                          onBlur={(e) => {
                            const descInput = document.querySelector(`input[data-desc-for="${registration.id}"]`) as HTMLInputElement
                            const categoryInput = document.querySelector(`input[data-category-for="${registration.id}"]`) as HTMLInputElement
                            handleSaveEdit(registration.id, e.target.value, descInput?.value, categoryInput?.value)
                          }}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="text-sm font-medium text-gray-900 font-mono">{registration.registrationNumber}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === registration.id ? (
                        <input
                          type="text"
                          defaultValue={registration.description || ''}
                          data-desc-for={registration.id}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="text-sm text-gray-700">{registration.description || '（説明なし）'}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === registration.id ? (
                        <input
                          type="text"
                          defaultValue={registration.category || ''}
                          data-category-for={registration.id}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="text-sm text-gray-700">{registration.category || '（未分類）'}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">{registration.usageCount}回</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">{registration.lastUsedAt || '（未使用）'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        registration.isDefault 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {registration.isDefault ? 'システム標準' : 'カスタム'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        {editingId === registration.id ? (
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            title="保存"
                          >
                            <Save size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={() => setEditingId(registration.id)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="編集"
                          >
                            <Edit2 size={16} />
                          </button>
                        )}
                        
                        {!registration.isDefault && (
                          <button
                            onClick={() => handleDeleteRegistration(registration.id)}
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

        {registrations.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center text-gray-500">
            登録番号マスターがありません。新規追加ボタンから追加してください。
          </div>
        )}
      </div>
    </div>
  )
}