/**
 * パス: src/app/work-history/page.tsx
 * 目的: 作業履歴ページ - 過去の作業価格や実績を検索・確認
 */
'use client'
import React, { useState, useEffect, useCallback } from 'react'
import SecurityWrapper from '@/components/security-wrapper'
import SearchForm from '@/components/work-history/SearchForm'
import ResultsTable from '@/components/work-history/ResultsTable'
import { WorkHistoryDB } from '@/components/work-history/WorkHistoryDB'
import { SearchFilters, SearchResult } from '@/components/work-history/types'

export default function WorkHistoryPage() {
  const [db] = useState(() => new WorkHistoryDB())
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    customerFilter: '',
    searchKeyword: '',
    dateFrom: '',
    dateTo: ''
  })

  const itemsPerPage = 10

  // 初期化
  useEffect(() => {
    const initializeData = async () => {
      // 初期検索を実行
      const results = db.search(filters)
      setSearchResults(results)
    }
    initializeData()
  }, [db, filters])

  // 検索実行
  const handleSearch = useCallback(() => {
    const results = db.search(filters)
    setSearchResults(results)
    setCurrentPage(1)
  }, [db, filters])

  // CSV出力
  const exportToCSV = useCallback(() => {
    if (searchResults.length === 0) return

    const headers = ['請求書No', '請求日', '顧客名', '件名', '登録番号', '作業名', '数量', '単価', '合計', 'セット']
    const csvContent = [
      headers.join(','),
      ...searchResults.map(result => [
        `"${result.invoice_no}"`,
        `"${result.date}"`,
        `"${result.customer_name}"`,
        `"${result.subject}"`,
        `"${result.registration}"`,
        `"${result.work_name}"`,
        result.quantity,
        result.unit_price,
        result.total,
        result.is_set ? 'セット' : '個別'
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `作業履歴_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [searchResults])

  const statistics = db.getStatistics(searchResults)

  return (
    <SecurityWrapper>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">作業履歴</h1>
            <p className="text-lg text-gray-700 font-medium">過去の作業価格や実績を検索・確認できます</p>
          </div>

          <SearchForm
            filters={filters}
            onFiltersChange={setFilters}
            onSearch={handleSearch}
            onExportCSV={exportToCSV}
            showAdvancedFilters={showAdvancedFilters}
            onToggleAdvancedFilters={() => setShowAdvancedFilters(!showAdvancedFilters)}
            workSuggestions={db.getWorkSuggestions()}
            customerSuggestions={db.getCustomerSuggestions()}
            hasResults={searchResults.length > 0}
          />

          <ResultsTable
            results={searchResults}
            statistics={statistics}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            searchKeyword={filters.searchKeyword}
          />
        </div>
      </div>
    </SecurityWrapper>
  )
}
