/**
 * パス: src/app/work-search/page.tsx
 * 目的: 作業内容確認・履歴検索画面
 */
'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SecurityWrapper from '@/components/security-wrapper'
import { Search, ArrowLeft, FileText, Calendar, DollarSign, User, TrendingUp, Filter, Download, Eye } from 'lucide-react'

// サンプルデータ管理クラス
class WorkSearchDB {
  invoices: any[]
  invoiceItems: any[]
  
  constructor() {
    // 実際のCSVデータに基づくデータ構造に修正
    this.invoices = this.loadData('work_search_invoices', [
      {
        id: 1,
        invoice_no: '25063417-1',
        billing_date: '2025-06-02',
        customer_name: 'UDトラックス株式会社',
        client_name: '中野運送　中野正博',
        total: 8800
      },
      {
        id: 2,
        invoice_no: '25063418-1',
        billing_date: '2025-06-02',
        customer_name: 'UDトラックス株式会社',
        client_name: 'いすゞ自動車九州株式会社長崎サービスセンター',
        total: 25300
      },
      {
        id: 3,
        invoice_no: '25063418-2',
        billing_date: '2025-06-02',
        customer_name: 'UDトラックス株式会社',
        client_name: 'いすゞ自動車九州株式会社長崎サービスセンター',
        total: 5500
      },
      {
        id: 4,
        invoice_no: '25063419-1',
        billing_date: '2025-06-04',
        customer_name: 'UDトラックス株式会社',
        client_name: 'いすゞ自動車九州株式会社長崎サービスセンター',
        total: 19800
      },
      {
        id: 5,
        invoice_no: '25063420-1',
        billing_date: '2025-06-04',
        customer_name: 'UDトラックス株式会社',
        client_name: '株式会社ロジコム・アイ',
        total: 11000
      },
      {
        id: 6,
        invoice_no: '25063421-1',
        billing_date: '2025-06-05',
        customer_name: 'UDトラックス株式会社',
        client_name: '東邦興産株式会社',
        total: 11000
      },
      {
        id: 7,
        invoice_no: '25063422-1',
        billing_date: '2025-06-05',
        customer_name: 'UDトラックス株式会社',
        client_name: '鶴丸海運株式会社',
        total: 8800
      },
      {
        id: 8,
        invoice_no: '25063423-1',
        billing_date: '2025-06-05',
        customer_name: 'UDトラックス株式会社',
        client_name: '鶴丸海運株式会社',
        total: 5500
      }
    ])

    // 実際のCSVデータに完全に基づく明細データ
    this.invoiceItems = this.loadData('work_search_items', [
      // 25063417-1 の明細
      {
        id: 1,
        invoice_id: 1,
        name: '燃料キャップ嚙み込み分解取外し',
        quantity: 1,
        unit_price: 8000,
        total: 8000,
        is_set: false
      },
      // 25063418-1 の明細
      {
        id: 2,
        invoice_id: 2,
        name: '床亀裂溶接',
        quantity: 1,
        unit_price: 5000,
        total: 5000,
        is_set: false
      },
      {
        id: 3,
        invoice_id: 2,
        name: 'マフラーカバー脱着ステイ折損ステン溶接 等一式',
        quantity: 1,
        unit_price: 0,
        total: 18000,
        is_set: true,
        set_items: ['マフラーカバー脱着ステイ折損ステン溶接', 'リベット打ち替え加工']
      },
      // 25063418-2 の明細
      {
        id: 4,
        invoice_id: 3,
        name: '床亀裂溶接',
        quantity: 1,
        unit_price: 5000,
        total: 5000,
        is_set: false
      },
      // 25063419-1 の明細
      {
        id: 5,
        invoice_id: 4,
        name: 'マフラーカバー脱着ステイ折損ステン溶接 等一式',
        quantity: 1,
        unit_price: 0,
        total: 18000,
        is_set: true,
        set_items: ['マフラーカバー脱着ステイ折損ステン溶接', 'リベット打ち替え加工']
      },
      // 25063420-1 の明細
      {
        id: 6,
        invoice_id: 5,
        name: 'ドライバーシート分解作動不良点検',
        quantity: 1,
        unit_price: 10000,
        total: 10000,
        is_set: false
      },
      // 25063421-1 の明細
      {
        id: 7,
        invoice_id: 6,
        name: '煽りスケット取替加工',
        quantity: 1,
        unit_price: 10000,
        total: 10000,
        is_set: false
      },
      // 25063422-1 の明細
      {
        id: 8,
        invoice_id: 7,
        name: 'ウィング蝶番点検 等一式',
        quantity: 1,
        unit_price: 0,
        total: 8000,
        is_set: true,
        set_items: ['ウィング蝶番点検', 'グリスアップ']
      },
      // 25063423-1 の明細
      {
        id: 9,
        invoice_id: 8,
        name: '右煽りキャッチ取替',
        quantity: 1,
        unit_price: 5000,
        total: 5000,
        is_set: false
      }
    ])
  }

  loadData(key: string, defaultData: any): any {
    try {
      const stored = JSON.parse(sessionStorage.getItem(key) || 'null')
      return stored || defaultData
    } catch (error) {
      console.warn(`Failed to load ${key}:`, error)
      return defaultData
    }
  }

  saveData(key: string, data: any): void {
    try {
      sessionStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.warn(`Failed to save ${key}:`, error)
    }
  }

  // 最新版の請求書のみを取得する関数
  getLatestInvoices() {
    const invoiceGroups = {}
    
    // 請求書番号のベース部分でグループ化
    this.invoices.forEach(invoice => {
      const baseNumber = invoice.invoice_no.split('-')[0]
      if (!invoiceGroups[baseNumber]) {
        invoiceGroups[baseNumber] = []
      }
      invoiceGroups[baseNumber].push(invoice)
    })
    
    // 各グループで最新版（末尾番号が最大）を取得
    const latestInvoices = []
    Object.keys(invoiceGroups).forEach(baseNumber => {
      const group = invoiceGroups[baseNumber]
      const latest = group.reduce((latest, current) => {
        const latestSuffix = parseInt(latest.invoice_no.split('-')[1])
        const currentSuffix = parseInt(current.invoice_no.split('-')[1])
        return currentSuffix > latestSuffix ? current : latest
      })
      latestInvoices.push(latest)
    })
    
    return latestInvoices
  }

  // 最新版の請求書IDを取得
  getLatestInvoiceIds() {
    return this.getLatestInvoices().map(invoice => invoice.id)
  }

  // 作業検索（最新版の請求書のみ対象）
  searchWork(keyword: string, dateFrom = '', dateTo = '', customerName = ''): any[] {
    if (!keyword && !customerName) return []

    const results = []
    const latestInvoiceIds = this.getLatestInvoiceIds()
    
    this.invoices.forEach(invoice => {
      // 最新版の請求書のみを対象とする
      if (!latestInvoiceIds.includes(invoice.id)) return
      
      // 日付フィルター
      if (dateFrom && invoice.billing_date < dateFrom) return
      if (dateTo && invoice.billing_date > dateTo) return
      
      // 顧客名フィルター（より柔軟な検索）
      if (customerName && !this.matchesSearch(invoice.customer_name, customerName)) return

      const items = this.invoiceItems.filter(item => item.invoice_id === invoice.id)
      
      items.forEach(item => {
        let matchFound = false
        let isInSet = false
        
        // 通常の作業名検索
        if (!keyword || this.matchesSearch(item.name, keyword)) {
          matchFound = true
        }
        
        // セット作業内の検索
        if (!matchFound && item.is_set && item.set_items) {
          isInSet = item.set_items.some(setItem => 
            !keyword || this.matchesSearch(setItem, keyword)
          )
          matchFound = isInSet
        }
        
        if (matchFound) {
          results.push({
            invoice_no: invoice.invoice_no,
            customer_name: invoice.customer_name,
            billing_date: invoice.billing_date,
            client_name: invoice.client_name,
            work_name: item.name,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total: item.total,
            is_set: item.is_set || false,
            is_in_set: isInSet,
            set_items: item.set_items || []
          })
        }
      })
    })

    // 日付順でソート（新しい順）
    results.sort((a, b) => new Date(b.billing_date) - new Date(a.billing_date))
    
    return results
  }

  // より柔軟な検索マッチング
  matchesSearch(text: string, searchTerm: string): boolean {
    const normalizedText = text.toLowerCase().replace(/\s/g, '')
    const normalizedSearch = searchTerm.toLowerCase().replace(/\s/g, '')
    return normalizedText.includes(normalizedSearch)
  }

  // よく検索される作業一覧（最新版のみ対象）
  getPopularWorks() {
    const workCounts = {}
    const latestInvoiceIds = this.getLatestInvoiceIds()
    
    this.invoiceItems.forEach(item => {
      // 最新版の請求書の作業のみを対象とする
      if (latestInvoiceIds.includes(item.invoice_id)) {
        workCounts[item.name] = (workCounts[item.name] || 0) + 1
      }
    })

    return Object.entries(workCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8)
      .map(([name, count]) => ({ name, count }))
  }

  // 作業の価格履歴（最新版のみ対象）
  getWorkPriceHistory(workName: string): any[] {
    const results = []
    const latestInvoiceIds = this.getLatestInvoiceIds()
    
    this.invoices.forEach(invoice => {
      // 最新版の請求書のみを対象とする
      if (!latestInvoiceIds.includes(invoice.id)) return
      
      const items = this.invoiceItems.filter(item => 
        item.invoice_id === invoice.id && 
        this.matchesSearch(item.name, workName)
      )
      
      items.forEach(item => {
        results.push({
          invoice_no: invoice.invoice_no,
          customer_name: invoice.customer_name,
          billing_date: invoice.billing_date,
          client_name: invoice.client_name,
          work_name: item.name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total: item.total
        })
      })
    })

    return results.sort((a, b) => new Date(b.billing_date) - new Date(a.billing_date))
  }
}

export default function WorkSearchPage() {
  const router = useRouter()
  const [db] = useState(() => new WorkSearchDB())
  const [searchKeyword, setSearchKeyword] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [periodFilter, setPeriodFilter] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [popularWorks, setPopularWorks] = useState<any[]>([])
  const [selectedWork, setSelectedWork] = useState('')
  const [priceHistory, setPriceHistory] = useState<any[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [showInvoiceDetail, setShowInvoiceDetail] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  // CSS-in-JS用のスタイルシート
  const styles = `
    .search-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
      font-family: system-ui, sans-serif;
    }

    .search-card {
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      margin-bottom: 1.5rem;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.2);
    }

    .search-card-header {
      background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
      color: white;
      padding: 2rem;
      position: relative;
    }

    .search-card-header::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 100px;
      height: 100px;
      background: rgba(255,255,255,0.1);
      border-radius: 50%;
      transform: translate(30px, -30px);
    }

    .search-title {
      font-size: 2.2rem;
      font-weight: bold;
      margin: 0 0 0.5rem 0;
      text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .search-subtitle {
      opacity: 0.9;
      margin: 0;
      font-size: 1.1rem;
    }

    .search-form {
      padding: 2rem;
    }

    .form-section {
      margin-bottom: 2rem;
    }

    .form-section-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .search-input {
      width: 100%;
      padding: 0.875rem 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      font-size: 1rem;
      transition: all 0.2s ease;
      background: #fafafa;
    }

    .search-input:focus {
      outline: none;
      border-color: #3b82f6;
      background: white;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .search-buttons {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .btn-primary {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      padding: 0.875rem 2rem;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
    }

    .btn-secondary {
      background: #6b7280;
      color: white;
      padding: 0.875rem 2rem;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-secondary:hover {
      background: #4b5563;
      transform: translateY(-1px);
    }

    .popular-works {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .popular-work-item {
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      border: 2px solid #e2e8f0;
      border-radius: 16px;
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .popular-work-item::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 100%;
      height: 100%;
      background: linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.1), transparent);
      transform: rotate(45deg);
      transition: all 0.3s ease;
    }

    .popular-work-item:hover {
      transform: translateY(-4px);
      border-color: #3b82f6;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }

    .popular-work-item:hover::before {
      right: 100%;
    }

    .popular-work-item.selected {
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      border-color: #3b82f6;
      transform: translateY(-2px);
    }

    .work-name {
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 0.5rem;
      font-size: 0.95rem;
    }

    .work-count {
      color: #6b7280;
      font-size: 0.8rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    .stat-card {
      padding: 2rem;
      border-radius: 16px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
    }

    .stat-card.blue {
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    }

    .stat-card.blue::before {
      background: linear-gradient(90deg, #3b82f6, #2563eb);
    }

    .stat-card.green {
      background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
    }

    .stat-card.green::before {
      background: linear-gradient(90deg, #10b981, #059669);
    }

    .stat-card.orange {
      background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%);
    }

    .stat-card.orange::before {
      background: linear-gradient(90deg, #f97316, #ea580c);
    }

    .stat-card.red {
      background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
    }

    .stat-card.red::before {
      background: linear-gradient(90deg, #ef4444, #dc2626);
    }

    .stat-value {
      font-size: 2.5rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      font-size: 0.9rem;
      opacity: 0.8;
      font-weight: 500;
    }

    .results-table {
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid #e5e7eb;
    }

    .table-header {
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      padding: 1.5rem 2rem;
      border-bottom: 2px solid #e5e7eb;
    }

    .results-table table {
      width: 100%;
      border-collapse: collapse;
    }

    .results-table th {
      background: #f8fafc;
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: #374151;
      border-bottom: 2px solid #e5e7eb;
      font-size: 0.9rem;
    }

    .results-table td {
      padding: 1rem;
      border-bottom: 1px solid #f3f4f6;
      vertical-align: middle;
    }

    .results-table tbody tr:hover {
      background: #f8fafc;
    }

    .detail-btn {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .detail-btn:hover {
      transform: scale(1.05);
    }

    .filter-toggle {
      background: none;
      border: 2px solid #3b82f6;
      color: #3b82f6;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .filter-toggle:hover {
      background: #3b82f6;
      color: white;
    }

    .period-options {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-top: 1rem;
    }

    .period-option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      background: white;
    }

    .period-option:hover {
      border-color: #3b82f6;
      background: #eff6ff;
    }

    .period-option input[type="radio"] {
      margin: 0;
    }

    .back-btn {
      background: #6b7280;
      color: white;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .back-btn:hover {
      background: #4b5563;
      transform: translateX(-2px);
    }

    .export-btn {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }

    .export-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 20px;
      border: 2px dashed #e5e7eb;
    }

    .empty-icon {
      color: #9ca3af;
      margin-bottom: 2rem;
    }

    .guide-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin: 2rem 0;
    }

    .guide-card {
      padding: 2rem;
      border-radius: 16px;
      border: 2px solid;
    }

    .guide-card.blue {
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      border-color: #3b82f6;
    }

    .guide-card.green {
      background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
      border-color: #10b981;
    }

    /* アニメーション */
    @keyframes loading {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(700%);
      }
    }

    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }

    /* モバイル対応 */
    @media (max-width: 768px) {
      .search-container {
        padding: 1rem;
      }

      .search-card-header {
        padding: 1.5rem;
      }

      .search-title {
        font-size: 1.8rem;
      }

      .search-form {
        padding: 1.5rem;
      }

      .search-buttons {
        flex-direction: column;
      }

      .popular-works {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 0.75rem;
      }

      .stats-grid {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
      }

      .stat-value {
        font-size: 1.8rem;
      }

      .guide-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .guide-card {
        padding: 1.5rem;
      }

      .results-table {
        font-size: 0.85rem;
      }

      .results-table th,
      .results-table td {
        padding: 0.75rem 0.5rem;
      }
    }
  `

  useEffect(() => {
    setPopularWorks(db.getPopularWorks())
  }, [db])

  const handlePeriodFilterChange = (months: string) => {
    const today = new Date()
    const fromDate = new Date(today.getFullYear(), today.getMonth() - parseInt(months), today.getDate())
    const toDate = new Date()
    
    // 日付フィールドに値を設定
    setDateFrom(fromDate.toISOString().split('T')[0])
    setDateTo(toDate.toISOString().split('T')[0])
    
    // ラジオボタンの状態も更新
    setPeriodFilter(months)
  }

  const handleSearch = async () => {
    setIsSearching(true)
    
    // ユーザー体験のために少し待機
    await new Promise(resolve => setTimeout(resolve, 300))
    
    let fromDate = dateFrom
    let toDate = dateTo
    
    // 期間フィルターが設定されている場合（念のため、通常は既に日付フィールドに入力済み）
    if (periodFilter && (!fromDate || !toDate)) {
      const today = new Date()
      const monthsBack = parseInt(periodFilter)
      const calculatedFromDate = new Date(today.getFullYear(), today.getMonth() - monthsBack, today.getDate())
      fromDate = calculatedFromDate.toISOString().split('T')[0]
      toDate = today.toISOString().split('T')[0]
    }
    
    const results = sortResults(db.searchWork(searchKeyword, fromDate, toDate, customerName))
    setSearchResults(results)
    setIsSearching(false)
  }

  const sortResults = (results: any[]) => {
    return [...results].sort((a, b) => {
      let aVal, bVal
      
      switch (sortBy) {
        case 'date':
          aVal = new Date(a.billing_date)
          bVal = new Date(b.billing_date)
          break
        case 'price':
          aVal = a.unit_price
          bVal = b.unit_price
          break
        case 'customer':
          aVal = a.customer_name
          bVal = b.customer_name
          break
        case 'work':
          aVal = a.work_name
          bVal = b.work_name
          break
        default:
          return 0
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })
  }

  const handleSortChange = (newSortBy: string) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(newSortBy)
      setSortOrder('desc')
    }
    
    if (searchResults.length > 0) {
      setSearchResults(sortResults(searchResults))
    }
  }

  const handlePopularWorkClick = (workName: string) => {
    setSearchKeyword(workName)
    setSelectedWork(workName)
    const results = db.searchWork(workName, dateFrom, dateTo, customerName)
    setSearchResults(sortResults(results))
    
    // 価格履歴も取得
    const history = db.getWorkPriceHistory(workName)
    setPriceHistory(history)
  }

  const clearSearch = () => {
    setSearchKeyword('')
    setDateFrom('')
    setDateTo('')
    setCustomerName('')
    setPeriodFilter('')
    setSearchResults([])
    setSelectedWork('')
    setPriceHistory([])
  }

  const showInvoiceDetails = (invoiceNo) => {
    // 請求書詳細情報を取得
    const invoice = db.invoices.find(inv => inv.invoice_no === invoiceNo)
    if (!invoice) return
    
    const items = db.invoiceItems.filter(item => item.invoice_id === invoice.id)
    
    setSelectedInvoice({
      ...invoice,
      items: items
    })
    setShowInvoiceDetail(true)
  }

  const closeInvoiceDetail = () => {
    setShowInvoiceDetail(false)
    setSelectedInvoice(null)
  }

  const exportResults = () => {
    if (searchResults.length === 0) return
    
    const csv = [
      ['請求書No', '顧客名', '日付', '件名', '作業名', '数量', '単価', '合計'],
      ...searchResults.map(r => [
        r.invoice_no,
        r.customer_name,
        r.billing_date,
        r.client_name,
        r.work_name,
        r.quantity,
        r.unit_price,
        r.total
      ])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `作業履歴検索結果_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  // 統計情報の計算
  const getStatistics = () => {
    if (searchResults.length === 0) return null

    // セット作業を除外した統計
    const nonSetResults = searchResults.filter(r => !r.is_set)
    const setResults = searchResults.filter(r => r.is_set)
    
    if (nonSetResults.length === 0) {
      return { 
        avgPrice: 0, 
        maxPrice: 0, 
        minPrice: 0, 
        count: searchResults.length,
        setCount: setResults.length 
      }
    }

    const prices = nonSetResults.map(r => r.unit_price)
    const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
    const maxPrice = Math.max(...prices)
    const minPrice = Math.min(...prices)

    return { 
      avgPrice, 
      maxPrice, 
      minPrice, 
      count: searchResults.length,
      setCount: setResults.length 
    }
  }

  const stats = getStatistics()

  const getSortIcon = (column) => {
    if (sortBy !== column) return null
    return sortOrder === 'asc' ? '↑' : '↓'
  }

  return (
    <SecurityWrapper requirePin={false}>
      <>        
        {/* インラインCSS */}
        <style dangerouslySetInnerHTML={{ __html: styles }} />
        
        <div className="search-container">
          <div className="max-w-7xl mx-auto">
            {/* ヘッダー */}
            <div className="search-card">
              <div className="search-card-header">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="search-title flex items-center">
                      <FileText className="h-8 w-8 mr-3" />
                      作業内容確認・履歴検索
                    </h1>
                    <p className="search-subtitle">
                      過去の作業内容と価格履歴を検索・確認できます。「この作業、過去いくらで出してたっけ？」がすぐに分かります。
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    {searchResults.length > 0 && (
                      <button onClick={exportResults} className="export-btn">
                        <Download className="h-4 w-4" />
                        CSV出力
                      </button>
                    )}
                    <button onClick={() => router.back()} className="back-btn">
                      <ArrowLeft className="h-4 w-4" />
                      戻る
                    </button>
                  </div>
                </div>
              </div>

              {/* 検索フィルター */}
              <div className="search-form">
                <div className="flex items-center justify-between mb-6">
                  <div className="form-section-title">
                    <Search className="h-5 w-5 text-blue-600" />
                    検索条件
                  </div>
                  <button onClick={() => setShowFilters(!showFilters)} className="filter-toggle">
                    <Filter className="h-4 w-4" />
                    {showFilters ? '詳細設定を閉じる' : '詳細設定'}
                  </button>
                </div>
                
                {/* 基本検索 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="form-section">
                    <label className="form-section-title">作業名</label>
                    <input
                      type="text"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      placeholder="作業名で検索..."
                      className="search-input"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  
                  <div className="form-section">
                    <label className="form-section-title">顧客名・件名</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="顧客名、件名で絞り込み..."
                      className="search-input"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                </div>

                {/* 詳細フィルター */}
                {showFilters && (
                  <div className="form-section" style={{ borderTop: '2px solid #f3f4f6', paddingTop: '2rem' }}>
                    <div className="form-section-title">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      期間指定
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => {
                          setDateFrom(e.target.value)
                          if (periodFilter) setPeriodFilter('')
                        }}
                        className="search-input"
                        placeholder="開始日"
                      />
                      <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => {
                          setDateTo(e.target.value)
                          if (periodFilter) setPeriodFilter('')
                        }}
                        className="search-input"
                        placeholder="終了日"
                      />
                    </div>

                    <div className="period-options">
                      {[
                        { value: '3', label: '3ヶ月以内' },
                        { value: '6', label: '半年以内' },
                        { value: '12', label: '１年以内' },
                        { value: '24', label: '２年以内' },
                        { value: '36', label: '３年以内' }
                      ].map(period => (
                        <label key={period.value} className="period-option">
                          <input
                            type="radio"
                            name="periodFilter"
                            value={period.value}
                            checked={periodFilter === period.value}
                            onChange={(e) => handlePeriodFilterChange(e.target.value)}
                          />
                          {period.label}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="search-buttons">
                  <button onClick={handleSearch} className="btn-primary" disabled={isSearching}>
                    <Search className="h-4 w-4" />
                    {isSearching ? '検索中...' : '検索'}
                  </button>
                  <button onClick={clearSearch} className="btn-secondary">
                    クリア
                  </button>
                </div>
              </div>
            </div>

            {/* よく検索される作業 */}
            <div className="search-card">
              <div className="search-form">
                <div className="form-section-title mb-4">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  よく使われる作業
                </div>
                <div className="popular-works">
                  {popularWorks.map((work, index) => (
                    <button
                      key={index}
                      onClick={() => handlePopularWorkClick(work.name)}
                      className={`popular-work-item ${
                        selectedWork === work.name ? 'selected' : ''
                      }`}
                    >
                      <div className="work-name">{work.name}</div>
                      <div className="work-count">{work.count}回使用</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 統計情報 */}
            {stats && (
              <div className="search-card">
                <div className="search-form">
                  <div className="form-section-title mb-6">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    検索結果統計
                  </div>
                  <div className="stats-grid">
                    <div className="stat-card blue">
                      <div className="stat-value" style={{ color: '#3b82f6' }}>
                        {stats.count}{stats.setCount > 0 && (
                          <span className="text-sm ml-1">（セット{stats.setCount}件）</span>
                        )}
                      </div>
                      <div className="stat-label" style={{ color: '#6b7280' }}>件数</div>
                    </div>
                    <div className="stat-card green">
                      <div className="stat-value" style={{ color: '#10b981' }}>
                        {stats.avgPrice > 0 ? `¥${stats.avgPrice.toLocaleString()}` : '---'}
                      </div>
                      <div className="stat-label" style={{ color: '#6b7280' }}>平均単価</div>
                    </div>
                    <div className="stat-card orange">
                      <div className="stat-value" style={{ color: '#f97316' }}>
                        {stats.maxPrice > 0 ? `¥${stats.maxPrice.toLocaleString()}` : '---'}
                      </div>
                      <div className="stat-label" style={{ color: '#6b7280' }}>最高単価</div>
                    </div>
                    <div className="stat-card red">
                      <div className="stat-value" style={{ color: '#ef4444' }}>
                        {stats.minPrice > 0 ? `¥${stats.minPrice.toLocaleString()}` : '---'}
                      </div>
                      <div className="stat-label" style={{ color: '#6b7280' }}>最低単価</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 検索結果 */}
            {searchResults.length > 0 && (
              <div className="search-card">
                <div className="table-header">
                  <div className="flex justify-between items-center">
                    <div className="form-section-title">
                      <FileText className="h-5 w-5 text-blue-600" />
                      検索結果 ({searchResults.length}件)
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-gray-600 font-medium">並び順:</span>
                      <select
                        value={`${sortBy}-${sortOrder}`}
                        onChange={(e) => {
                          const [newSortBy, newSortOrder] = e.target.value.split('-')
                          setSortBy(newSortBy)
                          setSortOrder(newSortOrder)
                          setSearchResults(sortResults(searchResults))
                        }}
                        className="search-input" style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem' }}
                      >
                        <option value="date-desc">日付（新しい順）</option>
                        <option value="date-asc">日付（古い順）</option>
                        <option value="price-desc">単価（高い順）</option>
                        <option value="price-asc">単価（安い順）</option>
                        <option value="customer-asc">顧客名（あいうえお順）</option>
                        <option value="work-asc">作業名（あいうえお順）</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="results-table">
                  <div className="overflow-x-auto">
                    <table>
                      <thead>
                        <tr>
                          <th onClick={() => handleSortChange('invoice')} style={{ cursor: 'pointer' }}>
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-1" />
                              請求書No {getSortIcon('invoice')}
                            </div>
                          </th>
                          <th onClick={() => handleSortChange('customer')} style={{ cursor: 'pointer' }}>
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              件名 {getSortIcon('customer')}
                            </div>
                          </th>
                          <th onClick={() => handleSortChange('date')} style={{ cursor: 'pointer' }}>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              日付 {getSortIcon('date')}
                            </div>
                          </th>
                          <th onClick={() => handleSortChange('work')} style={{ cursor: 'pointer' }}>
                            作業名 {getSortIcon('work')}
                          </th>
                          <th style={{ textAlign: 'center' }}>セット</th>
                          <th style={{ textAlign: 'center' }}>数量</th>
                          <th onClick={() => handleSortChange('price')} style={{ cursor: 'pointer', textAlign: 'right' }}>
                            <div className="flex items-center justify-end">
                              <DollarSign className="h-4 w-4 mr-1" />
                              単価 {getSortIcon('price')}
                            </div>
                          </th>
                          <th style={{ textAlign: 'center' }}>操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {searchResults.map((result, index) => (
                          <tr key={index}>
                            <td style={{ fontWeight: '600', color: '#3b82f6' }}>{result.invoice_no}</td>
                            <td>{result.client_name}</td>
                            <td>{result.billing_date}</td>
                            <td style={{ fontWeight: '500' }}>{result.work_name}</td>
                            <td style={{ textAlign: 'center' }}>
                              {result.is_set || result.is_in_set ? (
                                <span style={{ color: '#10b981', fontSize: '1.1rem' }}>✅</span>
                              ) : (
                                <span style={{ color: '#d1d5db' }}>—</span>
                              )}
                            </td>
                            <td style={{ textAlign: 'center' }}>{result.quantity}</td>
                            <td style={{ textAlign: 'right' }}>
                              {result.is_set ? (
                                <span style={{ color: '#6b7280' }}>セット価格</span>
                              ) : (
                                `¥${result.unit_price.toLocaleString()}`
                              )}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <button
                                onClick={() => showInvoiceDetails(result.invoice_no)}
                                className="detail-btn"
                              >
                                <Eye className="h-3 w-3" />
                                詳細
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

          {/* 価格履歴詳細 */}
          {selectedWork && priceHistory.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                「{selectedWork}」の価格履歴
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left">日付</th>
                      <th className="px-3 py-2 text-left">顧客名</th>
                      <th className="px-3 py-2 text-left">件名</th>
                      <th className="px-3 py-2 text-center">数量</th>
                      <th className="px-3 py-2 text-right">単価</th>
                      <th className="px-3 py-2 text-right">合計</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {priceHistory.slice(0, 10).map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-3 py-2">{item.billing_date}</td>
                        <td className="px-3 py-2">{item.customer_name}</td>
                        <td className="px-3 py-2">{item.client_name}</td>
                        <td className="px-3 py-2 text-center">{item.quantity}</td>
                        <td className="px-3 py-2 text-right">¥{item.unit_price.toLocaleString()}</td>
                        <td className="px-3 py-2 text-right">¥{item.total.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {priceHistory.length > 10 && (
                <div className="mt-4 text-center">
                  <button className="text-blue-600 hover:text-blue-800 text-sm">
                    すべての履歴を表示 ({priceHistory.length}件)
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 請求書詳細ポップアップ */}
          {showInvoiceDetail && selectedInvoice && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">請求書詳細</h2>
                    <button
                      onClick={closeInvoiceDetail}
                      className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                      ×
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  {/* 請求書基本情報 */}
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">請求書情報</h3>
                      <div className="space-y-2">
                        <div className="flex">
                          <span className="w-24 text-sm text-gray-600">請求書No:</span>
                          <span className="font-medium">{selectedInvoice.invoice_no}</span>
                        </div>
                        <div className="flex">
                          <span className="w-24 text-sm text-gray-600">請求日:</span>
                          <span>{selectedInvoice.billing_date}</span>
                        </div>
                        <div className="flex">
                          <span className="w-24 text-sm text-gray-600">件名:</span>
                          <span>{selectedInvoice.client_name}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3">顧客情報</h3>
                      <div className="space-y-2">
                        <div className="flex">
                          <span className="w-24 text-sm text-gray-600">顧客名:</span>
                          <span className="font-medium">{selectedInvoice.customer_name}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 作業明細 */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">作業明細</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border border-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="border border-gray-200 px-4 py-2 text-left">作業名</th>
                            <th className="border border-gray-200 px-4 py-2 text-center">数量</th>
                            <th className="border border-gray-200 px-4 py-2 text-right">単価</th>
                            <th className="border border-gray-200 px-4 py-2 text-right">金額</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedInvoice.items.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="border border-gray-200 px-4 py-2">
                                {item.name}
                                {item.is_set && item.set_items && (
                                  <div className="mt-1 text-sm text-gray-600">
                                    セット内容: {item.set_items.join(', ')}
                                  </div>
                                )}
                              </td>
                              <td className="border border-gray-200 px-4 py-2 text-center">{item.quantity}</td>
                              <td className="border border-gray-200 px-4 py-2 text-right">
                                {item.is_set ? (
                                  <span className="text-gray-500">セット価格</span>
                                ) : (
                                  `¥${item.unit_price.toLocaleString()}`
                                )}
                              </td>
                              <td className="border border-gray-200 px-4 py-2 text-right">¥{item.total.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-50">
                          <tr>
                            <td colSpan="3" className="border border-gray-200 px-4 py-2 text-right font-bold">合計金額</td>
                            <td className="border border-gray-200 px-4 py-2 text-right font-bold text-lg">
                              ¥{selectedInvoice.total.toLocaleString()}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 border-t bg-gray-50 flex justify-end">
                  <button
                    onClick={closeInvoiceDetail}
                    className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                  >
                    閉じる
                  </button>
                </div>
              </div>
            </div>
          )}

            {/* 検索中の表示 */}
            {isSearching && (
              <div className="search-card">
                <div className="search-form" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                  <div className="empty-icon" style={{ marginBottom: '2rem' }}>
                    <Search className="h-16 w-16 mx-auto animate-pulse" style={{ color: '#3b82f6' }} />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-600 mb-4">検索中...</h3>
                  <p className="text-lg text-gray-600">
                    過去の作業履歴から関連する情報を検索しています
                  </p>
                  <div style={{
                    width: '200px',
                    height: '4px',
                    background: '#e5e7eb',
                    borderRadius: '2px',
                    margin: '2rem auto',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      background: 'linear-gradient(90deg, #3b82f6, #2563eb)',
                      borderRadius: '2px',
                      animation: 'loading 1.5s ease-in-out infinite',
                      width: '30%'
                    }}></div>
                  </div>
                </div>
              </div>
            )}

            {/* 検索結果がない場合 */}
            {searchResults.length === 0 && (searchKeyword || customerName) && !isSearching && (
              <div className="search-card">
                <div className="search-form" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                  <div className="empty-icon">
                    <Search className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">検索結果が見つかりません</h3>
                  <p className="text-lg text-gray-600 mb-8">
                    検索条件を変更してお試しください。または、上記の「よく使われる作業」から選択してください。
                  </p>
                  <div style={{
                    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                    border: '2px solid #f59e0b',
                    padding: '2rem',
                    borderRadius: '16px',
                    textAlign: 'left',
                    maxWidth: '500px',
                    margin: '0 auto'
                  }}>
                    <h4 className="font-bold text-yellow-800 mb-3 text-lg">🔍 検索のコツ</h4>
                    <ul className="text-yellow-700 space-y-2">
                      <li>• 部分的なキーワードで検索してみてください</li>
                      <li>• 期間を広げて検索してみてください</li>
                      <li>• 異なる表記（ひらがな・カタカナ）で試してみてください</li>
                      <li>• スペースを含まない単語で検索してみてください</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* 初期状態のガイド */}
            {searchResults.length === 0 && !searchKeyword && !customerName && (
              <div className="empty-state">
                <div className="empty-icon">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">作業内容を検索してください</h3>
                <p className="text-lg text-gray-600 mb-8">
                  作業名や顧客名で検索すると、過去の請求履歴から関連する作業と価格情報が表示されます。
                </p>
                
                <div className="guide-grid">
                  <div className="guide-card blue">
                    <h4 className="font-bold text-blue-800 mb-4 flex items-center text-lg">
                      <Eye className="h-5 w-5 mr-2" />
                      基本的な使い方
                    </h4>
                    <ul className="text-blue-700 space-y-3 text-left">
                      <li>• 「バンパー」「塗装」など部分的なキーワードでも検索可能</li>
                      <li>• 期間を指定すると該当期間内の履歴に絞り込めます</li>
                      <li>• よく使われる作業から選択すると素早く検索できます</li>
                      <li>• 検索結果は並び順を変更できます</li>
                    </ul>
                  </div>
                  
                  <div className="guide-card green">
                    <h4 className="font-bold text-green-800 mb-4 flex items-center text-lg">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      活用できる機能
                    </h4>
                    <ul className="text-green-700 space-y-3 text-left">
                      <li>• 統計情報で価格の傾向を把握できます</li>
                      <li>• 特定作業の価格履歴を詳しく確認できます</li>
                      <li>• 検索結果をCSVファイルで出力できます</li>
                      <li>• 詳細フィルターで細かく絞り込めます</li>
                    </ul>
                  </div>
                </div>

                <div style={{ 
                  marginTop: '2rem', 
                  padding: '2rem', 
                  background: 'linear-gradient(135deg, #fafafa 0%, #f3f4f6 100%)', 
                  borderRadius: '16px', 
                  maxWidth: '600px', 
                  margin: '2rem auto 0' 
                }}>
                  <h4 className="font-bold text-gray-800 mb-4 text-lg">💡 こんな時に便利です</h4>
                  <div className="text-gray-700 space-y-2">
                    <p>「前回のバンパー修理、いくらで見積もったっけ？」</p>
                    <p>「この顧客には普段どんな作業をしているかな？」</p>
                    <p>「最近の塗装作業の相場はどのくらい？」</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    </SecurityWrapper>
  )
}