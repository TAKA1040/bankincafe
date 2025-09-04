'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft, Hash, Car, Clock, Edit } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type Subject = {
  id: string
  subject_name: string
  subject_name_kana: string | null
  created_at: string
  updated_at: string
}

type RegistrationRelation = {
  id: string
  registration_number: {
    id: string
    registration_number: string
    usage_count: number
    last_used_at: string | null
  }
  is_primary: boolean
  usage_count: number
  last_used_at: string | null
}

export default function SubjectDetailPage() {
  const params = useParams()
  const subjectId = params?.id as string
  
  const [subject, setSubject] = useState<Subject | null>(null)
  const [registrations, setRegistrations] = useState<RegistrationRelation[]>([])
  const [loading, setLoading] = useState(true)

  // 件名詳細と関連登録番号を取得
  useEffect(() => {
    const fetchSubjectDetail = async () => {
      if (!subjectId) return
      
      try {
        setLoading(true)
        
        // 件名情報を取得
        const { data: subjectData, error: subjectError } = await supabase
          .from('subject_master')
          .select('*')
          .eq('id', subjectId)
          .single()
        
        if (subjectError) {
          console.error('件名取得エラー:', subjectError)
          throw subjectError
        }
        
        setSubject(subjectData)
        
        // 関連登録番号を取得
        const { data: relationsData, error: relationsError } = await supabase
          .from('subject_registration_numbers')
          .select(`
            id,
            is_primary,
            usage_count,
            last_used_at,
            registration_number_master (
              id,
              registration_number,
              usage_count,
              last_used_at
            )
          `)
          .eq('subject_id', subjectId)
          .order('usage_count', { ascending: false })
        
        if (relationsError) {
          console.error('関連登録番号取得エラー:', relationsError)
          throw relationsError
        }
        
        // データ整形
        const formattedRelations = relationsData?.map(relation => ({
          id: relation.id,
          registration_number: {
            id: relation.registration_number_master.id,
            registration_number: relation.registration_number_master.registration_number,
            usage_count: relation.registration_number_master.usage_count,
            last_used_at: relation.registration_number_master.last_used_at
          },
          is_primary: relation.is_primary,
          usage_count: relation.usage_count,
          last_used_at: relation.last_used_at
        })) || []
        
        setRegistrations(formattedRelations)
        
      } catch (error) {
        console.error('件名詳細取得エラー:', error)
        alert(`データの取得に失敗しました: ${error.message}`)
      } finally {
        setLoading(false)
      }
    }
    
    fetchSubjectDetail()
  }, [subjectId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-gray-500">読み込み中...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!subject) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-gray-500">件名が見つかりません</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => window.location.href = '/subject-master'}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              件名マスタに戻る
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {subject.subject_name}
              </h1>
              {subject.subject_name_kana && (
                <p className="text-lg text-gray-600 mb-4">
                  読み: {subject.subject_name_kana}
                </p>
              )}
            </div>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Edit className="h-4 w-4" />
              編集
            </button>
          </div>
        </div>

        {/* 統計情報 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Hash className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">関連登録番号数</p>
                <p className="text-2xl font-bold text-gray-900">{registrations.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">総使用回数</p>
                <p className="text-2xl font-bold text-gray-900">
                  {registrations.reduce((sum, r) => sum + r.usage_count, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">最終更新</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Date(subject.updated_at).toLocaleDateString('ja-JP')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 関連登録番号一覧 */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">関連登録番号</h2>
            <p className="text-sm text-gray-600">この件名で使用されている登録番号一覧</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    登録番号
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    メイン
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    使用回数
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    最終使用日
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    全体使用回数
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {registrations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      関連する登録番号はありません
                    </td>
                  </tr>
                ) : (
                  registrations.map((relation) => (
                    <tr key={relation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {relation.registration_number.registration_number}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {relation.is_primary ? (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            メイン
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          relation.usage_count > 10 
                            ? 'bg-red-100 text-red-800'
                            : relation.usage_count > 5 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {relation.usage_count}回
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {relation.last_used_at 
                          ? new Date(relation.last_used_at).toLocaleDateString('ja-JP')
                          : '未使用'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {relation.registration_number.usage_count}回
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}