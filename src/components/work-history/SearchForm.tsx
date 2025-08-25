/**
 * 作業履歴検索フォームコンポーネント
 */
'use client'
import React from 'react'
import { Search, Filter, Download, Calendar } from 'lucide-react'
import { SearchFilters } from './types'

interface SearchFormProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  onSearch: () => void
  onExportCSV: () => void
  showAdvancedFilters: boolean
  onToggleAdvancedFilters: () => void
  workSuggestions: string[]
  customerSuggestions: string[]
  hasResults: boolean
}

export default function SearchForm({
  filters,
  onFiltersChange,
  onSearch,
  onExportCSV,
  showAdvancedFilters,
  onToggleAdvancedFilters,
  workSuggestions,
  customerSuggestions,
  hasResults
}: SearchFormProps) {
  const handleClear = () => {
    onFiltersChange({
      customerFilter: '',
      searchKeyword: '',
      dateFrom: '',
      dateTo: ''
    })
  }

  const setCurrentMonth = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    
    onFiltersChange({
      ...filters,
      dateFrom: firstDay.toISOString().split('T')[0],
      dateTo: lastDay.toISOString().split('T')[0]
    })
  }

  const setPrevMonth = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() - 1
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    
    onFiltersChange({
      ...filters,
      dateFrom: firstDay.toISOString().split('T')[0],
      dateTo: lastDay.toISOString().split('T')[0]
    })
  }

  const clearDateRange = () => {
    onFiltersChange({
      ...filters,
      dateFrom: '',
      dateTo: ''
    })
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl shadow-lg border border-blue-100 p-8 mb-8 backdrop-blur-sm">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
            <Search className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">検索条件</h2>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleAdvancedFilters}
            className="px-6 py-3 text-sm font-semibold text-blue-700 bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Filter className="h-4 w-4 inline mr-2" />
            詳細フィルター
          </button>
          {hasResults && (
            <button
              onClick={onExportCSV}
              className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Download className="h-4 w-4 inline mr-2" />
              CSV出力
            </button>
          )}
        </div>
      </div>

      {/* 基本検索フィールド */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3">件名</label>
          <input
            type="text"
            value={filters.customerFilter}
            onChange={(e) => onFiltersChange({ ...filters, customerFilter: e.target.value })}
            placeholder="件名を入力"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white/80 backdrop-blur-sm transition-all duration-200 shadow-sm hover:shadow-md"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3">作業内容</label>
          <input
            type="text"
            value={filters.searchKeyword}
            onChange={(e) => onFiltersChange({ ...filters, searchKeyword: e.target.value })}
            placeholder="作業内容を入力"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white/80 backdrop-blur-sm transition-all duration-200 shadow-sm hover:shadow-md"
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          />
        </div>
        <div className="flex items-end gap-3">
          <button
            onClick={onSearch}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Search className="h-4 w-4 inline mr-2" />
            検索
          </button>
          <button
            onClick={handleClear}
            className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-semibold rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            クリア
          </button>
        </div>
      </div>

      {/* よく使用される作業 */}
      {workSuggestions.length > 0 && (
        <div className="border-t-2 border-gradient-to-r from-blue-100 to-purple-100 pt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-orange-400 to-pink-500 rounded-lg shadow-md">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-800">よく使用される作業</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {workSuggestions.map(workName => (
              <button
                key={workName}
                onClick={() => onFiltersChange({ ...filters, searchKeyword: workName })}
                className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-50 to-indigo-100 text-blue-700 rounded-full hover:from-blue-100 hover:to-indigo-200 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 border border-blue-200"
              >
                {workName}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 詳細フィルター */}
      {showAdvancedFilters && (
        <div className="border-t-2 border-gradient-to-r from-purple-100 to-pink-100 pt-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">期間開始</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => onFiltersChange({ ...filters, dateFrom: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-white/80 backdrop-blur-sm transition-all duration-200 shadow-sm hover:shadow-md"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">期間終了</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => onFiltersChange({ ...filters, dateTo: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-white/80 backdrop-blur-sm transition-all duration-200 shadow-sm hover:shadow-md"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-gray-800">クイック設定:</span>
            <button onClick={setCurrentMonth} className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 rounded-xl hover:from-blue-200 hover:to-blue-300 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">当月</button>
            <button onClick={setPrevMonth} className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 rounded-xl hover:from-orange-200 hover:to-orange-300 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">前月</button>
            <button onClick={clearDateRange} className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">クリア</button>
          </div>
        </div>
      )}
    </div>
  )
}
