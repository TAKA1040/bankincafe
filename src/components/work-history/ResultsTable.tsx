/**
 * 作業履歴検索結果テーブルコンポーネント
 */
'use client'
import React from 'react'
import { Calendar, Search } from 'lucide-react'
import { SearchResult, WorkStatistics } from './types'

interface ResultsTableProps {
  results: SearchResult[]
  statistics: WorkStatistics | null
  currentPage: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  searchKeyword: string
}

export default function ResultsTable({
  results,
  statistics,
  currentPage,
  itemsPerPage,
  onPageChange,
  searchKeyword
}: ResultsTableProps) {
  const totalPages = Math.ceil(results.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, results.length)
  const pageResults = results.slice(startIndex, endIndex)

  const normalizeText = (text: string) => text.toLowerCase().replace(/\s+/g, '')

  if (results.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-2xl shadow-xl border border-blue-100 p-16 text-center backdrop-blur-sm">
        <div className="p-4 bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl shadow-lg inline-block mb-8">
          <Search className="h-16 w-16 text-white" />
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent mb-4">該当する作業履歴がありません</h3>
        <p className="text-lg text-gray-600 font-medium">検索条件を変更して再度お試しください</p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-2xl shadow-xl border border-blue-100 backdrop-blur-sm">
      {/* ヘッダー */}
      <div className="p-8 border-b-2 border-gradient-to-r from-blue-100 to-purple-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              検索結果 ({results.length}件)
            </h3>
          </div>
          
          {/* 右寄せエリア */}
          <div className="text-right space-y-2">
            {statistics && (
              <div className="text-sm font-semibold text-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-lg shadow-sm">
                平均 ¥{statistics.avgPrice.toLocaleString()}　
                価格帯 ¥{statistics.minPrice.toLocaleString()}〜¥{statistics.maxPrice.toLocaleString()}
              </div>
            )}
            <div className="text-sm font-medium text-gray-600 bg-white/60 px-3 py-1 rounded-lg shadow-sm">
              {results.length} 件中 {startIndex + 1} - {endIndex} を表示
            </div>
            {totalPages > 1 && (
              <div className="flex justify-end">
                <nav className="flex items-center gap-1 bg-white/60 px-3 py-2 rounded-lg shadow-sm">
                  <button
                    onClick={() => onPageChange(1)}
                    disabled={currentPage <= 1}
                    className="px-3 py-1 text-sm text-gray-600 disabled:opacity-40 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    ‹‹
                  </button>
                  <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="px-3 py-1 text-sm text-gray-600 disabled:opacity-40 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    ‹
                  </button>
                  
                  {/* ページ番号 */}
                  {(() => {
                    const pages: (number | string)[] = []
                    if (totalPages <= 7) {
                      for (let i = 1; i <= totalPages; i++) pages.push(i)
                    } else {
                      pages.push(1)
                      if (currentPage > 4) pages.push('…')
                      const start = Math.max(2, currentPage - 1)
                      const end = Math.min(totalPages - 1, currentPage + 1)
                      for (let i = start; i <= end; i++) pages.push(i)
                      if (currentPage < totalPages - 3) pages.push('…')
                      pages.push(totalPages)
                    }
                    return pages.map((p, idx) => {
                      if (typeof p !== 'number') {
                        return <span key={`ellipsis-${idx}`} className="px-2 py-1 text-sm text-gray-400">…</span>
                      }
                      const isActive = p === currentPage
                      return (
                        <button
                          key={p}
                          onClick={() => onPageChange(p)}
                          className={`px-3 py-1 text-sm rounded-lg transition-all duration-200 ${
                            isActive
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                              : 'text-gray-600 hover:bg-blue-100'
                          }`}
                        >
                          {p}
                        </button>
                      )
                    })
                  })()}
                  
                  <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="px-3 py-1 text-sm text-gray-600 disabled:opacity-40 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    ›
                  </button>
                  <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage >= totalPages}
                    className="px-3 py-1 text-sm text-gray-600 disabled:opacity-40 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    ››
                  </button>
                  <span className="ml-3 text-sm font-medium text-gray-600">
                    {currentPage} / {totalPages} ページ
                  </span>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* テーブル */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-blue-500 to-purple-600">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-white">
                請求書No<br />請求日
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-white">
                顧客名<br />件名
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-white">
                登録番号<br />作業名
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-white">
                数量<br />種別
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-white">
                単価<br />合計
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-white">
                請求書表示
              </th>
            </tr>
          </thead>
          <tbody className="bg-white/80 backdrop-blur-sm divide-y divide-blue-100">
            {pageResults.map((result, index) => (
              <tr key={`${result.invoice_no}-${index}`} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-200">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">{result.invoice_no}</div>
                  <div className="text-sm text-gray-600">{result.date}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-gray-900">{result.customer_name}</div>
                  <div className="text-sm text-gray-600">{result.subject}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600">{result.registration}</div>
                  <div className="text-sm text-gray-900 font-medium">
                    <span className={
                      searchKeyword && normalizeText(result.work_name).includes(normalizeText(searchKeyword))
                        ? 'bg-gradient-to-r from-yellow-200 to-yellow-300 px-2 py-1 rounded-lg shadow-sm'
                        : ''
                    }>
                      {result.work_name}
                    </span>
                    {result.is_set === 1 && (
                      <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 shadow-sm">
                        セット
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 font-bold">{result.quantity}</div>
                  <div className="text-sm text-gray-600">{result.is_set ? 'セット' : '個別'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">¥{result.unit_price.toLocaleString()}</div>
                  <div className="text-sm font-bold text-green-600">¥{result.total.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                    請求書表示
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
