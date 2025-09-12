'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft, FileText, Clock, Car, Edit } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type RegistrationNumber = {
  id: string
  registration_number: string
  usage_count: number
  last_used_at: string | null
  created_at: string
  updated_at: string
}

type SubjectRelation = {
  id: string
  subject: {
    id: string
    subject_name: string
    subject_name_kana: string | null
  }
  is_primary: boolean
  usage_count: number
  last_used_at: string | null
}

export default function RegistrationDetailPage() {
  const params = useParams()
  const registrationId = params?.id as string
  
  const [registration, setRegistration] = useState<RegistrationNumber | null>(null)
  const [subjects, setSubjects] = useState<SubjectRelation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRegistrationDetail = async () => {
      if (!registrationId) return
      
      try {
        setLoading(true)
        
        const { data: registrationData, error: registrationError } = await supabase
          .from('registration_number_master')
          .select('*')
          .eq('id', registrationId)
          .single()
        
        if (registrationError) {
          console.error('登録番号取得エラー:', registrationError)
          throw registrationError
        }
        
        setRegistration(registrationData)
        
        const { data: relationsData, error: relationsError } = await supabase
          .from('subject_registration_numbers')
          .select(`
            id,
            is_primary,
            usage_count,
            last_used_at,
            subject_master (
              id,
              subject_name,
              subject_name_kana
            )
          `)
          .eq('registration_number_id', registrationId)
          .order('usage_count', { ascending: false })
        
        if (relationsError) {
          console.error('関連件名取得エラー:', relationsError)
          throw relationsError
        }
        
        const formattedRelations = relationsData?.map(relation => ({
          id: relation.id,
          subject: {
            id: relation.subject_master.id,
            subject_name: relation.subject_master.subject_name,
            subject_name_kana: relation.subject_master.subject_name_kana
          },
          is_primary: relation.is_primary,
          usage_count: relation.usage_count,
          last_used_at: relation.last_used_at
        })) || []
        
        setSubjects(formattedRelations)
        
      } catch (error) {
        console.error('登録番号詳細取得エラー:', error)
        alert(`データの取得に失敗しました: ${error instanceof Error ? error.message : 'データの取得に失敗しました'}`)
      } finally {
        setLoading(false)
      }
    }
    
    fetchRegistrationDetail()
  }, [registrationId])

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

  if (!registration) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-gray-500">登録番号が見つかりません</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => typeof window !== 'undefined' && (window.location.href = '/registration-settings')}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              登録番号マスタに戻る
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {registration.registration_number}
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                登録番号の詳細情報
              </p>
            </div>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Edit className="h-4 w-4" />
              編集
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">関連件名数</p>
                <p className="text-2xl font-bold text-gray-900">{subjects.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">総使用回数</p>
                <p className="text-2xl font-bold text-gray-900">
                  {registration.usage_count}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">最終使用日</p>
                <p className="text-2xl font-bold text-gray-900">
                  {registration.last_used_at 
                    ? new Date(registration.last_used_at).toLocaleDateString('ja-JP')
                    : '未使用'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">関連件名</h2>
            <p className="text-sm text-gray-600">この登録番号で使用されている件名一覧</p>
          </div>
          
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
                    メイン
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    使用回数
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    最終使用日
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subjects.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      関連する件名はありません
                    </td>
                  </tr>
                ) : (
                  subjects.map((relation) => (
                    <tr key={relation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {relation.subject.subject_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {relation.subject.subject_name_kana || '未設定'}
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