'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, GripVertical, ChevronUp, ChevronDown, FileText } from 'lucide-react'

interface SubjectMaster {
  id: string
  subjectName: string
  category?: string
  usageCount: number
  lastUsedAt?: string
  isDefault?: boolean
}

// 件名マスターDBクラス
class SubjectMasterDB {
  private readonly STORAGE_KEY = 'bankin_subject_master'

  getSubjects(): SubjectMaster[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : this.getDefaultSubjects()
    } catch {
      return this.getDefaultSubjects()
    }
  }

  private getDefaultSubjects(): SubjectMaster[] {
    return [
      {
        id: 'system_1',
        subjectName: 'システム開発業務',
        category: 'システム',
        usageCount: 15,
        lastUsedAt: '2024-03-15',
        isDefault: true
      },
      {
        id: 'web_1',
        subjectName: 'Webサイト制作業務',
        category: 'Web',
        usageCount: 12,
        lastUsedAt: '2024-03-10',
        isDefault: true
      },
      {
        id: 'maintenance_1',
        subjectName: 'システム保守業務',
        category: 'メンテナンス',
        usageCount: 8,
        lastUsedAt: '2024-03-05',
        isDefault: true
      }
    ]
  }

  saveSubjects(subjects: SubjectMaster[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(subjects))
    } catch (error) {
      console.error('Failed to save subject master:', error)
    }
  }

  addSubject(subject: Omit<SubjectMaster, 'id'>): SubjectMaster {
    const subjects = this.getSubjects()
    const newSubject: SubjectMaster = {
      ...subject,
      id: Date.now().toString(),
      usageCount: subject.usageCount || 1,
      lastUsedAt: new Date().toISOString().split('T')[0]
    }
    subjects.push(newSubject)
    this.saveSubjects(subjects)
    return newSubject
  }

  updateSubject(id: string, updates: Partial<SubjectMaster>): void {
    const subjects = this.getSubjects()
    const index = subjects.findIndex(subj => subj.id === id)
    if (index !== -1) {
      subjects[index] = { ...subjects[index], ...updates }
      this.saveSubjects(subjects)
    }
  }

  deleteSubject(id: string): void {
    const subjects = this.getSubjects()
    const filtered = subjects.filter(subj => subj.id !== id && !subj.isDefault)
    this.saveSubjects(filtered)
  }

  reorderSubjects(subjects: SubjectMaster[]): void {
    this.saveSubjects(subjects)
  }

  // 新規件名の自動登録
  autoRegisterSubject(subjectName: string): void {
    const subjects = this.getSubjects()
    const existing = subjects.find(subj => 
      subj.subjectName.toLowerCase() === subjectName.toLowerCase()
    )
    
    if (existing) {
      // 既存の場合は使用回数を増やす
      this.updateSubject(existing.id, {
        usageCount: existing.usageCount + 1,
        lastUsedAt: new Date().toISOString().split('T')[0]
      })
    } else {
      // 新規の場合は自動登録
      this.addSubject({
        subjectName: subjectName,
        category: 'その他',
        usageCount: 1
      })
    }
  }

  // 曖昧検索
  searchSubjects(keyword: string): SubjectMaster[] {
    if (!keyword.trim()) return this.getSubjects()
    
    const normalizedKeyword = keyword.toLowerCase()
    return this.getSubjects()
      .filter(subject => 
        subject.subjectName.toLowerCase().includes(normalizedKeyword) ||
        (subject.category && subject.category.toLowerCase().includes(normalizedKeyword))
      )
      .sort((a, b) => b.usageCount - a.usageCount)
  }
}

export default function SubjectSettingsPage() {
  const router = useRouter()
  const [db] = useState(() => new SubjectMasterDB())
  const [subjects, setSubjects] = useState<SubjectMaster[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newSubject, setNewSubject] = useState({ subjectName: '', category: '' })
  const [showAddForm, setShowAddForm] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  useEffect(() => {
    setSubjects(db.getSubjects())
  }, [db])

  const handleSaveEdit = (id: string, subjectName: string, category?: string) => {
    if (subjectName.trim()) {
      db.updateSubject(id, { 
        subjectName: subjectName.trim(), 
        category: category?.trim() || undefined 
      })
      setSubjects(db.getSubjects())
      setEditingId(null)
    }
  }

  const handleAddSubject = () => {
    if (newSubject.subjectName.trim()) {
      db.addSubject({
        subjectName: newSubject.subjectName.trim(),
        category: newSubject.category.trim() || undefined,
        usageCount: 1
      })
      setSubjects(db.getSubjects())
      setNewSubject({ subjectName: '', category: '' })
      setShowAddForm(false)
    }
  }

  const handleDeleteSubject = (id: string) => {
    if (confirm('この件名マスターを削除してもよろしいですか？')) {
      db.deleteSubject(id)
      setSubjects(db.getSubjects())
    }
  }

  const moveSubject = (index: number, direction: 'up' | 'down') => {
    const newSubjects = [...subjects]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    if (targetIndex >= 0 && targetIndex < newSubjects.length) {
      [newSubjects[index], newSubjects[targetIndex]] = [newSubjects[targetIndex], newSubjects[index]]
      setSubjects(newSubjects)
      db.reorderSubjects(newSubjects)
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
    
    const newSubjects = [...subjects]
    const draggedItem = newSubjects[draggedIndex]
    newSubjects.splice(draggedIndex, 1)
    newSubjects.splice(dropIndex, 0, draggedItem)
    
    setSubjects(newSubjects)
    db.reorderSubjects(newSubjects)
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
              <FileText className="text-blue-600" size={32} />
              <h1 className="text-2xl font-bold text-gray-800">件名マスター設定</h1>
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
            <strong>件名マスター設定について:</strong><br />
            ここで設定した件名は請求書作成時に選択できるようになります。<br />
            新規件名を入力した場合は自動的にマスターに登録されます。<br />
            <strong>順序変更:</strong> ドラッグ&ドロップまたは矢印ボタンで表示順序を変更できます。
          </p>
        </div>

        {/* 新規追加フォーム */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-green-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">新しい件名マスターを追加</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">件名</label>
                <input
                  type="text"
                  value={newSubject.subjectName}
                  onChange={(e) => setNewSubject({...newSubject, subjectName: e.target.value})}
                  placeholder="例: システム開発業務"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリー（任意）</label>
                <input
                  type="text"
                  value={newSubject.category}
                  onChange={(e) => setNewSubject({...newSubject, category: e.target.value})}
                  placeholder="例: システム、Web、メンテナンス"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddSubject}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Save size={16} />
                追加
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false)
                  setNewSubject({ subjectName: '', category: '' })
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2"
              >
                <X size={16} />
                キャンセル
              </button>
            </div>
          </div>
        )}

        {/* 件名一覧 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-800">登録済み件名マスター</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">順序</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">件名</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">カテゴリー</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">使用回数</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">最終使用日</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">種別</th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subjects.map((subject, index) => (
                  <tr 
                    key={subject.id} 
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
                            onClick={() => moveSubject(index, 'up')}
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
                            onClick={() => moveSubject(index, 'down')}
                            disabled={index === subjects.length - 1}
                            className={`p-1 rounded ${
                              index === subjects.length - 1 
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
                      {editingId === subject.id ? (
                        <input
                          type="text"
                          defaultValue={subject.subjectName}
                          onBlur={(e) => {
                            const categoryInput = document.querySelector(`input[data-category-for="${subject.id}"]`) as HTMLInputElement
                            handleSaveEdit(subject.id, e.target.value, categoryInput?.value)
                          }}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="text-sm font-medium text-gray-900">{subject.subjectName}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === subject.id ? (
                        <input
                          type="text"
                          defaultValue={subject.category || ''}
                          data-category-for={subject.id}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="text-sm text-gray-700">{subject.category || '（未分類）'}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">{subject.usageCount}回</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">{subject.lastUsedAt || '（未使用）'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        subject.isDefault 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {subject.isDefault ? 'システム標準' : 'カスタム'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        {editingId === subject.id ? (
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            title="保存"
                          >
                            <Save size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={() => setEditingId(subject.id)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="編集"
                          >
                            <Edit2 size={16} />
                          </button>
                        )}
                        
                        {!subject.isDefault && (
                          <button
                            onClick={() => handleDeleteSubject(subject.id)}
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

        {subjects.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center text-gray-500">
            件名マスターがありません。新規追加ボタンから追加してください。
          </div>
        )}
      </div>
    </div>
  )
}