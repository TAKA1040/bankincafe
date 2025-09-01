'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, GripVertical, ChevronUp, ChevronDown, FileText, RefreshCw } from 'lucide-react'
import { useSubjectMaster, SubjectMaster } from '@/hooks/useSubjectMaster'

export default function SubjectSettingsPage() {
  const router = useRouter()
  const {
    subjects,
    loading,
    error,
    fetchSubjects,
    addSubject,
    updateSubject,
    deleteSubject,
    reorderSubjects,
  } = useSubjectMaster()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [newSubject, setNewSubject] = useState({ subjectName: '', category: '' })
  const [showAddForm, setShowAddForm] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  useEffect(() => {
    fetchSubjects()
  }, [fetchSubjects])

  const handleSaveEdit = async (id: string, subjectName: string, category?: string) => {
    if (!subjectName.trim()) return
    setIsSaving(true)
    await updateSubject(id, { canonical_name: subjectName.trim(), category: category?.trim() || undefined })
    setEditingId(null)
    setIsSaving(false)
  }

  const handleAddSubject = async () => {
    if (!newSubject.subjectName.trim()) return
    setIsSaving(true)
    await addSubject({
      canonical_name: newSubject.subjectName.trim(),
      category: newSubject.category.trim() || undefined,
      usage_count: 0,
      sort_order: subjects.length,
    })
    setNewSubject({ subjectName: '', category: '' })
    setShowAddForm(false)
    setIsSaving(false)
  }

  const handleDeleteSubject = async (id: string) => {
    if (confirm('この件名マスターを削除してもよろしいですか？（論理削除）')) {
      setIsSaving(true)
      await deleteSubject(id)
      setIsSaving(false)
    }
  }

  const moveSubject = async (index: number, direction: 'up' | 'down') => {
    const newSubjects = [...subjects]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    if (targetIndex >= 0 && targetIndex < newSubjects.length) {
      [newSubjects[index], newSubjects[targetIndex]] = [newSubjects[targetIndex], newSubjects[index]]
      setIsSaving(true)
      await reorderSubjects(newSubjects)
      setIsSaving(false)
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

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === dropIndex) return
    
    const newSubjects = [...subjects]
    const draggedItem = newSubjects[draggedIndex]
    newSubjects.splice(draggedIndex, 1)
    newSubjects.splice(dropIndex, 0, draggedItem)
    
    setIsSaving(true)
    await reorderSubjects(newSubjects)
    setIsSaving(false)
    setDraggedIndex(null)
  }

  const handleBack = () => router.push('/')

  if (loading && subjects.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg text-gray-600">読み込み中...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">エラー</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button onClick={fetchSubjects} className="px-4 py-2 bg-blue-600 text-white rounded-lg">再試行</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FileText className="text-blue-600" size={32} />
              <h1 className="text-2xl font-bold text-gray-800">件名マスター設定 (DB連携版)</h1>
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

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 text-sm">
            <strong>件名マスター設定について:</strong><br />
            ここで設定した件名は請求書作成時に選択できるようになります。<br />
            新規件名を入力した場合は自動的にマスターに登録されます。<br />
            <strong>順序変更:</strong> ドラッグ&ドロップまたは矢印ボタンで表示順序を変更できます。
          </p>
        </div>

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
                disabled={isSaving}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 disabled:opacity-50"
              >
                <Save size={16} />
                {isSaving ? '追加中...' : '追加'}
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
                            disabled={index === 0 || isSaving}
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
                            disabled={index === subjects.length - 1 || isSaving}
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
                        <span className="text-sm text-gray-500 font-mono">#{subject.sort_order}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {editingId === subject.id ? (
                        <input
                          type="text"
                          defaultValue={subject.canonical_name}
                          onBlur={(e) => {
                            const categoryInput = document.querySelector(`input[data-category-for="${subject.id}"]`) as HTMLInputElement
                            handleSaveEdit(subject.id, e.target.value, categoryInput?.value)
                          }}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="text-sm font-medium text-gray-900">{subject.canonical_name}</div>
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
                      <div className="text-sm text-gray-700">{subject.usage_count}回</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">{subject.last_used_at ? new Date(subject.last_used_at).toLocaleDateString() : '（未使用）'}</div>
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
                        
                        <button
                          onClick={() => handleDeleteSubject(subject.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="削除"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {subjects.length === 0 && !loading && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center text-gray-500">
            件名マスターがありません。新規追加ボタンから追加してください。
          </div>
        )}
      </div>
    </div>
  )
}
