'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, Plus, Edit2, FileText, ArrowLeft, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type Subject = {
  id: string
  subject_name: string
  subject_name_kana: string | null
  created_at: string
  updated_at: string
  registration_count?: number
}

export default function SubjectMasterPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(30)
  const [totalCount, setTotalCount] = useState(0)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
  const [editForm, setEditForm] = useState({ subject_name: '', subject_name_kana: '' })

  // 件名一覧を取得
  const fetchSubjects = useCallback(async () => {
    try {
      setLoading(true)
      
      console.log('Supabaseから件名マスタデータを読み込み中...')
      
      // 検索条件を構築
      let query = supabase
        .from('subject_master')
        .select('*', { count: 'exact' })
      
      if (searchTerm) {
        // 入力値をサニタイズして安全な検索を実行
        const sanitizedTerm = searchTerm.replace(/[%_]/g, '\\$&')
        query = query.or(`subject_name.ilike.%${sanitizedTerm}%,subject_name_kana.ilike.%${sanitizedTerm}%`)
      }
      
      // ページネーション
      const from = (currentPage - 1) * itemsPerPage
      const to = from + itemsPerPage - 1
      
      const { data, error, count } = await query
        .range(from, to)
        .order('subject_name')
      
      if (error) {
        console.error('データ取得エラー:', error)
        throw error
      }
      
      console.log('取得データ:', data)
      console.log('データ件数:', count)
      
      // 登録番号数を設定（仮の値）
      const subjectsWithCount = (data || []).map(subject => ({
        ...subject,
        registration_count: Math.floor(Math.random() * 20) + 1
      }))
      
      setSubjects(subjectsWithCount)
      setTotalCount(count || 0)
      
    } catch (error) {
      console.error('件名マスタ取得エラー:', error)
      alert(`件名マスタの取得に失敗しました: ${error instanceof Error ? error.message : 'データの取得に失敗しました'}`)
    } finally {
      setLoading(false)
    }
  }, [currentPage, itemsPerPage, searchTerm])

  useEffect(() => {
    fetchSubjects()
  }, [fetchSubjects])

  // 検索処理
  const handleSearch = () => {
    setCurrentPage(1)
    fetchSubjects()
  }

  // 編集開始
  const startEdit = (subject: Subject) => {
    setEditingSubject(subject)
    setEditForm({
      subject_name: subject.subject_name,
      subject_name_kana: subject.subject_name_kana || ''
    })
  }

  // 編集キャンセル
  const cancelEdit = () => {
    setEditingSubject(null)
    setEditForm({ subject_name: '', subject_name_kana: '' })
  }

  // 編集保存（Supabaseベース）
  const saveEdit = async () => {
    if (!editingSubject) return
    
    try {
      const { error } = await supabase
        .from('subject_master')
        .update({
          subject_name: editForm.subject_name.trim(),
          subject_name_kana: editForm.subject_name_kana.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', editingSubject.id)

      if (error) {
        console.error('更新エラー:', error)
        alert('更新に失敗しました')
        return
      }

      alert('更新しました')
      cancelEdit()
      fetchSubjects() // リストを再取得
    } catch (error) {
      console.error('更新エラー:', error)
      alert('更新に失敗しました')
    }
  }

  // 削除（Supabaseベース）
  const deleteSubject = async (subject: Subject) => {
    if (!confirm(`件名「${subject.subject_name}」を削除しますか？`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('subject_master')
        .delete()
        .eq('id', subject.id)

      if (error) {
        console.error('削除エラー:', error)
        alert('削除に失敗しました')
        return
      }

      alert('削除しました')
      fetchSubjects() // リストを再取得
    } catch (error) {
      console.error('削除エラー:', error)
      alert('削除に失敗しました')
    }
  }

  // ページング情報
  const totalPages = Math.ceil(totalCount / itemsPerPage)
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalCount)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              メニューへ戻る
            </button>
            <button
              onClick={() => window.location.href = '/invoice-create'}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <FileText className="h-5 w-5" />
              請求書作成に戻る
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">件名マスタ管理</h1>
          <p className="text-gray-600">請求書の件名とその読み仮名を管理します</p>
        </div>

        {/* 統計情報 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">総件名数</p>
                <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Edit2 className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">読み仮名付き</p>
                <p className="text-2xl font-bold text-gray-900">
                  {subjects.filter(s => s.subject_name_kana).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Search className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">表示中</p>
                <p className="text-2xl font-bold text-gray-900">{subjects.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 検索・フィルター */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="件名または読み仮名で検索..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                検索
              </button>
              
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center gap-2">
                <Plus className="h-4 w-4" />
                新規追加
              </button>
            </div>
          </div>
        </div>

        {/* ページサイズ選択 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">表示件数:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value={10}>10件</option>
              <option value={30}>30件</option>
              <option value={50}>50件</option>
              <option value={100}>100件</option>
            </select>
          </div>
          
          <div className="text-sm text-gray-600">
            {totalCount > 0 ? `${startItem}-${endItem} / ${totalCount}件` : '0件'}
          </div>
        </div>

        {/* テーブル */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    件名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    読み仮名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    登録番号数
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    最終更新
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      読み込み中...
                    </td>
                  </tr>
                ) : subjects.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      データが見つかりません
                    </td>
                  </tr>
                ) : (
                  subjects.map((subject) => (
                    <tr key={subject.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingSubject?.id === subject.id ? (
                          <input
                            type="text"
                            value={editForm.subject_name}
                            onChange={(e) => setEditForm(prev => ({ ...prev, subject_name: e.target.value }))}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <div className="text-sm font-medium text-gray-900">
                            {subject.subject_name}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingSubject?.id === subject.id ? (
                          <input
                            type="text"
                            value={editForm.subject_name_kana}
                            onChange={(e) => setEditForm(prev => ({ ...prev, subject_name_kana: e.target.value }))}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            placeholder="読み仮名"
                          />
                        ) : (
                          <div className="text-sm text-gray-600">
                            {subject.subject_name_kana || '未設定'}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {subject.registration_count || 0}件
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(subject.updated_at).toLocaleDateString('ja-JP')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {editingSubject?.id === subject.id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={saveEdit}
                              className="text-green-600 hover:text-green-900"
                            >
                              保存
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              キャンセル
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEdit(subject)}
                              className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                            >
                              <Edit2 className="h-4 w-4" />
                              編集
                            </button>
                            <button
                              onClick={() => deleteSubject(subject)}
                              className="text-red-600 hover:text-red-900 flex items-center gap-1"
                            >
                              <Trash2 className="h-4 w-4" />
                              削除
                            </button>
                            <button 
                              onClick={() => window.location.href = `/subject-master/${subject.id}`}
                              className="text-green-600 hover:text-green-900"
                            >
                              登録番号
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ページネーション */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              前へ
            </button>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = Math.max(1, Math.min(totalPages, currentPage - 2 + i))
                return (
                  <button
                    key={`page-${i}-${pageNumber}`}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg ${
                      currentPage === pageNumber
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                )
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              次へ
            </button>
          </div>
        )}
      </div>
    </div>
  )
}