'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Plus, ArrowLeft, Car, Home } from 'lucide-react'
import { dbClient, escapeValue } from '@/lib/db-client'

// Supabase互換のためのエイリアス
const supabase = dbClient

type RegistrationNumber = {
  id: string
  registration_number: string
  usage_count: number
  last_used_at: string | null
  created_at: string
  updated_at: string
}

export default function RegistrationSettingsPage() {
  const router = useRouter()
  const [registrations, setRegistrations] = useState<RegistrationNumber[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(30)
  const [totalCount, setTotalCount] = useState(0)

  const fetchRegistrations = useCallback(async () => {
    try {
      setLoading(true)
      
      let query = supabase
        .from('registration_number_master')
        .select('*', { count: 'exact' })
      
      if (searchTerm) {
        query = query.ilike('registration_number', `%${searchTerm}%`)
      }
      
      // まず件数を取得してからページネーションを適用
      let countQuery = supabase
        .from('registration_number_master')
        .select('*', { count: 'exact', head: true })
      
      if (searchTerm) {
        countQuery = countQuery.ilike('registration_number', `%${searchTerm}%`)
      }
      
      const { count: totalRecords } = await countQuery
      
      if (!totalRecords || totalRecords === 0) {
        setRegistrations([])
        setTotalCount(0)
        setLoading(false)
        return
      }
      
      // 現在のページが範囲外の場合は最初のページに戻す
      const maxPages = Math.ceil(totalRecords / itemsPerPage)
      const safePage = Math.min(currentPage, maxPages)
      
      if (safePage !== currentPage) {
        setCurrentPage(safePage)
        return // useEffectが再実行されるのでここで終了
      }
      
      const from = (safePage - 1) * itemsPerPage
      const to = Math.min(from + itemsPerPage - 1, totalRecords - 1)
      
      // 安全な範囲でデータを取得
      if (from >= totalRecords) {
        setRegistrations([])
        setTotalCount(totalRecords || 0)
        setLoading(false)
        return
      }
      
      const { data, error } = await query
        .range(from, to)
        .order('usage_count', { ascending: false })
      
      if (error) {
        console.error('登録番号取得エラー:', error)
        throw error
      }

      setRegistrations((data || []) as unknown as RegistrationNumber[])
      setTotalCount(totalRecords)
      
    } catch (error) {
      console.error('登録番号マスタ取得エラー:', error)
      // エラーメッセージを詳細表示
      if (error && typeof error === 'object' && 'code' in error && error.code === '416') {

        setCurrentPage(1) // 最初のページに戻す
      } else {
        alert(`登録番号マスタの取得に失敗しました: ${error instanceof Error ? error.message : 'データの取得に失敗しました'}`)
      }
    } finally {
      setLoading(false)
    }
  }, [currentPage, itemsPerPage, searchTerm])

  useEffect(() => {
    fetchRegistrations()
  }, [fetchRegistrations])

  const handleSearch = () => {
    setCurrentPage(1)
    fetchRegistrations()
  }

  const totalPages = Math.ceil(totalCount / itemsPerPage)
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalCount)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <header className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">登録番号マスタ管理</h1>
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
          <p className="text-gray-600 mt-2">車両の登録番号と使用頻度を管理します</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">総登録番号数</p>
                <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Search className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">表示中</p>
                <p className="text-2xl font-bold text-gray-900">{registrations.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Plus className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">よく使用される</p>
                <p className="text-2xl font-bold text-gray-900">
                  {registrations.filter(r => r.usage_count > 5).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="登録番号で検索..."
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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium"
              >
                <Search size={20} />
                検索
              </button>
              
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 font-medium">
                <Plus size={20} />
                新規追加
              </button>
            </div>
          </div>
        </div>

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

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    登録番号
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    使用回数
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    最終使用日
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    登録日
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
                ) : registrations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      データが見つかりません
                    </td>
                  </tr>
                ) : (
                  registrations.map((registration) => (
                    <tr key={registration.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {registration.registration_number}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          registration.usage_count > 10 
                            ? 'bg-red-100 text-red-800'
                            : registration.usage_count > 5 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {registration.usage_count}回
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {registration.last_used_at 
                          ? new Date(registration.last_used_at).toLocaleDateString('ja-JP')
                          : '未使用'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(registration.created_at).toLocaleDateString('ja-JP')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-1">
                          <button className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium">
                            編集
                          </button>
                          <button 
                            onClick={() => typeof window !== 'undefined' && (window.location.href = `/registration-settings/${registration.id}`)}
                            className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium"
                          >
                            関連件名
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              前へ
            </button>
            
            <div className="flex items-center gap-2">
              {(() => {
                const pages = []
                const maxPagesToShow = 5
                let startPage = Math.max(1, currentPage - 2)
                const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)
                
                // 末尾に合わせて開始ページを調整
                if (endPage - startPage + 1 < maxPagesToShow) {
                  startPage = Math.max(1, endPage - maxPagesToShow + 1)
                }
                
                for (let page = startPage; page <= endPage; page++) {
                  pages.push(
                    <button
                      key={`regpage-${page}`}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-600 text-white hover:bg-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  )
                }
                return pages
              })()}
            </div>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              次へ
            </button>
          </div>
        )}
      </div>
    </div>
  )
}