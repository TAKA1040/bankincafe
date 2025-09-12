'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Search, Download, BarChart3, X, Home } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/supabase'
import { CustomerCategoryDB, CustomerCategory } from '@/lib/customer-categories'
// import { extractTargetFromWorkName } from '@/lib/target-extractor' // 不要：DBのtargetをそのまま使用

// 型定義
type InvoiceRow = Database['public']['Tables']['invoices']['Row']
type InvoiceLineItemRow = Database['public']['Tables']['invoice_line_items']['Row']

// 画面表示用の新しいデータ構造
interface SplitDetail {
  invoice_id: string
  line_no: number
  raw_label_part: string
  target: string | null
  set_name: string | null
}

interface WorkSearchItem {
  // line_items から
  line_item_id: number;
  work_name: string;
  unit_price: number | null; // セット作業の場合はnull
  quantity: number;
  
  // invoices から
  invoice_id: string;
  customer_name: string | null;
  subject: string | null;
  registration_number: string | null;
  issue_date: string | null;
  
  // 分割データから
  target: string | null;
  action: string | null; // アクション項目を追加
  
  // 派生データ
  is_set: boolean;
  invoice_month: string | null;
  split_details?: SplitDetail[]; // 分割詳細情報
}

// 検索フィルターの型
interface SearchFilters {
  keyword: string
  customerCategory: string
  dateFrom: string
  dateTo: string
  target: string
}

// 統計情報の型
interface WorkStatistics {
  totalWorks: number
  totalAmount: number
  averagePrice: number
}

// 請求書詳細表示用の型
interface InvoiceDetail {
  invoice_id: string
  customer_name: string | null
  subject: string | null
  registration_number: string | null
  issue_date: string | null
  invoice_month: string | null
  work_items: {
    line_item_id: number
    line_no: number
    work_name: string
    unit_price: number
    quantity: number
    amount: number
    task_type: string
    target: string | null
    split_details: SplitDetail[]
    is_breakdown?: boolean
    breakdown_parent?: number
  }[]
  total_amount: number
  work_count: number
}

// 金額をフォーマットするヘルパー関数
const formatCurrency = (amount: number | null) => {
  if (amount === null || isNaN(amount)) {
    return '-'
  }
  return `¥${amount.toLocaleString()}`
}

export default function WorkSearchPage() {
  const router = useRouter()
  const [allItems, setAllItems] = useState<WorkSearchItem[]>([])
  const [filteredItems, setFilteredItems] = useState<WorkSearchItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [filters, setFilters] = useState<SearchFilters>({ keyword: '', customerCategory: '', dateFrom: '', dateTo: '', target: '' })
  const [sortBy, setSortBy] = useState<'issue_date' | 'unit_price' | 'customer_name' | 'work_name' | 'subject' | 'registration_number' | 'invoice_month' | 'target'>('unit_price')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const [selectedItem, setSelectedItem] = useState<WorkSearchItem | null>(null)
  const [selectedInvoiceDetail, setSelectedInvoiceDetail] = useState<InvoiceDetail | null>(null)
  const [customerCategories, setCustomerCategories] = useState<CustomerCategory[]>([])

  // 顧客カテゴリー読み込み
  useEffect(() => {
    const categoryDB = new CustomerCategoryDB()
    setCustomerCategories(categoryDB.getCategories())
  }, [])

  // データ取得ロジック
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        // 1. 分割データと請求書データを取得
        
        // 2. 分割データがある請求書IDを先に取得
        // // console.log('📋 STEP 1: データを1000件で復元（抽出機能は動作確認済み）')
        const { data: splitInvoiceIds } = await supabase
          .from('invoice_line_items_split')
          .select('invoice_id')
          .limit(1000)
        
        const uniqueInvoiceIds = [...new Set(splitInvoiceIds?.map(s => s.invoice_id) || [])]
        // // console.log('🔍 分割データがある請求書数:', uniqueInvoiceIds.length)

        // 3. 元の請求書項目を取得
        const lineItemsRes = await supabase.from('invoice_line_items').select(`
          id,
          invoice_id,
          line_no,
          raw_label,
          unit_price,
          quantity,
          amount,
          task_type,
          target
        `)
        
        if (lineItemsRes.error) {
          console.error('Line items error:', lineItemsRes.error)
          throw new Error(`請求書項目の取得に失敗しました: ${lineItemsRes.error.message}`)
        }
        
        const lineItems = lineItemsRes.data || []
        
        // 4. 実際に使用されているinvoice_idのベースIDを取得
        const uniqueBaseIds = [...new Set(lineItems.map(item => item.invoice_id.split('-')[0]))]
        // // console.log('必要なbaseIds:', uniqueBaseIds.slice(0, 10), '(最初の10件)')
        
        // 5. 分割データと請求書データを並行取得
        const [splitItemsRes, invoicesRes] = await Promise.all([
          supabase.from('invoice_line_items_split').select(`
            id,
            invoice_id,
            line_no,
            raw_label_part,
            target,
            set_name
          `),
          // 必要なinvoiceIDのみを取得（ベースIDで部分一致検索）
          supabase.from('invoices')
            .select(`
              invoice_id,
              customer_name,
              subject,
              subject_name,
              registration_number,
              issue_date,
              billing_month
            `)
            .or(uniqueBaseIds
              .filter(baseId => /^[0-9]+$/.test(baseId)) // 数字のみ許可
              .map(baseId => `invoice_id.like.${baseId}-%`)
              .join(','))
        ])

        
        if (splitItemsRes.error) {
          console.error('Split items error:', splitItemsRes.error)
          throw new Error(`分割作業項目の取得に失敗しました: ${splitItemsRes.error.message}`)
        }
        if (invoicesRes.error) {
          console.error('Invoices error:', invoicesRes.error)
          throw new Error(`請求情報の取得に失敗しました: ${invoicesRes.error.message}`)
        }

        const splitItems = splitItemsRes.data || []
        const invoices = invoicesRes.data || []

        // // console.log('📊 取得したデータ数:', { lineItems: lineItems.length, splitItems: splitItems.length, invoices: invoices.length })
        
        // 作業タイプの分析
        const taskTypes = lineItems.reduce((acc, item) => {
          const type = item.task_type || 'unknown'
          acc[type] = (acc[type] || 0) + 1
          return acc
        }, {} as Record<string, number>)
        // // console.log('📈 作業タイプの分源:', taskTypes)
        
        // line_itemsのサンプル確認
        if (lineItems.length > 0) {
          // // console.log('lineItemsサンプル（最初の3件）:')
          lineItems.slice(0, 3).forEach((item, i) => {
            // // console.log(`lineItem ${i + 1}:`)
            // // console.log('- invoice_id:', item.invoice_id)
            // // console.log('- raw_label:', item.raw_label)
            // // console.log('- task_type:', item.task_type)
          })
        }
        
        // 最初のinvoiceサンプルを確認
        if (invoices.length > 0) {
          // // console.log('invoicesサンプル（最初の3件）:')
          invoices.slice(0, 3).forEach((inv, i) => {
            // // console.log(`invoice ${i + 1}:`)
            // // console.log('- invoice_id:', inv.invoice_id)
            // // console.log('- customer_name:', inv.customer_name)
            // // console.log('- subject:', inv.subject)
            // // console.log('- registration_number:', inv.registration_number)
            // // console.log('- billing_month:', inv.billing_month)
          })
        }

        // 2. 請求書情報とマップを作成
        // line_itemsのinvoice_idは "25043370-2" 形式、invoicesは "25043370-1" 形式
        // 基本ID部分（ハイフンまで）でマッピングを作成
        const invoiceMap = new Map()
        invoices.forEach(inv => {
          const baseId = inv.invoice_id.split('-')[0] // "25043370-1" -> "25043370"
          invoiceMap.set(inv.invoice_id, inv) // 完全一致用
          invoiceMap.set(baseId, inv) // 部分一致用
        })
        
        // 3. 分割データをグループ化（invoice_id + line_no）
        const splitMap = new Map()
        splitItems.forEach(split => {
          const key = `${split.invoice_id}-${split.line_no}`
          if (!splitMap.has(key)) {
            splitMap.set(key, [])
          }
          splitMap.get(key).push(split)
        })

        // 4. 元の請求書項目をベースに画面表示用データを作成（取り消し作業は除外）
        const workSearchItems: WorkSearchItem[] = []
        
        const filteredLineItems = lineItems.filter(item => {
          // 取り消し作業を除外
          const workName = (item.raw_label || '').trim()
          const cancelKeywords = ['取消', '取り消し', 'キャンセル', 'CANCEL']
          return !cancelKeywords.some(keyword => 
            workName.includes(keyword) || workName === keyword
          )
        })
        
        for (const item of filteredLineItems) {
          // 完全一致を先に試し、失敗したら基本ID（ハイフン前）で検索
          const invoice = invoiceMap.get(item.invoice_id) || invoiceMap.get(item.invoice_id.split('-')[0])
          const key = `${item.invoice_id}-${item.line_no}`
          const splitDetails = splitMap.get(key) || []
          
          // 最初の5件でマッピング確認
          if (workSearchItems.length < 5) {
            // // console.log(`マッピング確認 ${workSearchItems.length + 1}:`)
            // // console.log('- invoice_id:', item.invoice_id)
            // // console.log('- invoiceFound:', !!invoice)
            if (invoice) {
              // // console.log('- customer_name:', invoice.customer_name)
              // // console.log('- subject:', invoice.subject)
              // // console.log('- registration_number:', invoice.registration_number)
              // // console.log('- billing_month:', invoice.billing_month)
            } else {
              // // console.log('- ERROR: invoice not found!')
            }
            // // console.log('---')
          }
          
          // 請求月を取得（billing_monthがあればそれを使用、なければissue_dateから生成）
          let invoice_month = null
          if (invoice?.billing_month) {
            // billing_monthの形式が '2504' や '2025-09' の場合の対応
            const billingMonth = invoice.billing_month.toString()
            if (billingMonth.length === 4) {
              // '2504' -> '25年04月' 形式
              const year = billingMonth.substring(0, 2)
              const month = billingMonth.substring(2, 4)
              invoice_month = `${year}年${month}月`
            } else if (billingMonth.includes('-') && billingMonth.length === 7) {
              // '2025-09' -> '25年09月' 形式
              const [year, month] = billingMonth.split('-')
              const shortYear = year.slice(-2)
              invoice_month = `${shortYear}年${month}月`
            } else {
              invoice_month = billingMonth
            }
          } else if (invoice?.issue_date) {
            // フォールバック: issue_dateから生成
            const date = new Date(invoice.issue_date)
            const shortYear = date.getFullYear().toString().slice(-2)
            invoice_month = `${shortYear}年${(date.getMonth() + 1).toString().padStart(2, '0')}月`
          }

          // 分割データから詳細情報を取得（最初の分割項目から）
          const firstSplit = splitDetails[0] || {}
          
          const isSetWork = item.task_type === 'S'
          
          if (isSetWork) {
            // S作業の場合：raw_labelを分割して明細ごとに行を作成
            const breakdownItems = item.raw_label 
              ? item.raw_label.split(/[,、，・･]/).map(s => s.trim()).filter(s => s.length > 0)
              : ['セット作業明細不明']
            
            // // console.log('🔄 Processing S work breakdown items:', breakdownItems.length)
            for (let index = 0; index < breakdownItems.length; index++) {
              const breakdownItem = breakdownItems[index]
              // // console.log(`🎯 Processing S-work item ${index + 1}:`, breakdownItem)
              
              // データベースのtargetをそのまま使用（S作業の場合は分割しないので親のtargetを使用）
              const workItem = {
                line_item_id: item.id + (index * 0.1), // 一意性を保つために小数点追加
                work_name: breakdownItem,
                unit_price: null, // セット作業は単価なし
                quantity: item.quantity || 0,
                invoice_id: item.invoice_id,
                customer_name: invoice?.customer_name || null,
                subject: invoice?.subject || invoice?.subject_name || null,
                registration_number: invoice?.registration_number || null,
                issue_date: invoice?.issue_date || null,
                target: item.target, // データベースのtargetをそのまま使用
                action: null, // TODO: アクション抽出機能を実装
                is_set: item.task_type === 'S',
                invoice_month: invoice_month,
                split_details: splitDetails,
              }
              
              workSearchItems.push(workItem)
            }
          } else {
            // T作業の場合：そのまま1行で表示
            const work_name = item.raw_label || '名称不明'
            // // console.log('🎯 Processing T-work item:', work_name)
            
            const workItem = {
              line_item_id: item.id,
              work_name: work_name,
              unit_price: item.unit_price || 0,
              quantity: item.quantity || 0,
              invoice_id: item.invoice_id,
              customer_name: invoice?.customer_name || null,
              subject: invoice?.subject || invoice?.subject_name || null,
              registration_number: invoice?.registration_number || null,
              issue_date: invoice?.issue_date || null,
              target: item.target, // データベースのtargetをそのまま使用
              action: null, // TODO: アクション抽出機能を実装
              is_set: item.task_type === 'S',
              invoice_month: invoice_month,
              split_details: splitDetails,
            }
            
            workSearchItems.push(workItem)
          }
        }

        // // console.log('🏁 最終的な作業項目数:', workSearchItems.length)
        
        // データベースのtargetデータをそのまま使用（対象抽出処理は不要）
        const withTarget = workSearchItems.filter(item => item.target)
        // // console.log('📊 データベースからのtargetデータ統計:')
        // // console.log(`  総項目数: ${workSearchItems.length}件`)
        // // console.log(`  target有り: ${withTarget.length}件 (${workSearchItems.length > 0 ? Math.round((withTarget.length / workSearchItems.length) * 100) : 0}%)`)
        // // console.log(`  target無し: ${workSearchItems.length - withTarget.length}件`)
        
        setAllItems(workSearchItems)
        setFilteredItems(workSearchItems)

      } catch (e) {
        console.error(e)
        setError(e instanceof Error ? e.message : '不明なエラーが発生しました')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // 検索フィルター処理
  useEffect(() => {
    const lowerCaseKeyword = filters.keyword.toLowerCase()
    const result = allItems.filter(item => {
      // キーワード検索（顧客名、対象、アクションも含む）
      const matchesKeyword = (
        (item.work_name?.toLowerCase() || '').includes(lowerCaseKeyword) ||
        (item.customer_name?.toLowerCase() || '').includes(lowerCaseKeyword) ||
        (item.subject?.toLowerCase() || '').includes(lowerCaseKeyword) ||
        (item.registration_number?.toLowerCase() || '').includes(lowerCaseKeyword) ||
        (item.invoice_month?.toLowerCase() || '').includes(lowerCaseKeyword) ||
        (item.target?.toLowerCase() || '').includes(lowerCaseKeyword) ||
        (item.action?.toLowerCase() || '').includes(lowerCaseKeyword)
      )
      
      // 顧客カテゴリーフィルター
      const matchesCategory = filters.customerCategory === '' || 
        (() => {
          const category = customerCategories.find(cat => cat.id === filters.customerCategory)
          return category && item.customer_name === category.companyName
        })()
      
      // 日付範囲フィルター
      const matchesDateRange = (() => {
        if (!filters.dateFrom && !filters.dateTo) return true
        if (!item.issue_date) return false
        
        const itemDate = new Date(item.issue_date)
        const fromDate = filters.dateFrom ? new Date(filters.dateFrom) : new Date('1900-01-01')
        const toDate = filters.dateTo ? new Date(filters.dateTo) : new Date('2100-12-31')
        
        // 時刻部分をリセットして日付のみで比較
        itemDate.setHours(0, 0, 0, 0)
        fromDate.setHours(0, 0, 0, 0)
        toDate.setHours(23, 59, 59, 999)
        
        return itemDate >= fromDate && itemDate <= toDate
      })()
      
      // 対象フィルター
      const matchesTarget = filters.target === '' || 
        (item.target && item.target === filters.target)
      
      return matchesKeyword && matchesCategory && matchesDateRange && matchesTarget
    })
    setFilteredItems(result)
  }, [filters, allItems, customerCategories])

  // ソート処理
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      let comparison = 0
      const valA = a[sortBy]
      const valB = b[sortBy]

      if (valA === null || valB === null) {
        comparison = valA === valB ? 0 : valA === null ? 1 : -1;
      } else if (typeof valA === 'string' && typeof valB === 'string') {
        comparison = valA.localeCompare(valB)
      } else if (typeof valA === 'number' && typeof valB === 'number') {
        comparison = valA - valB
      }
      
      return sortOrder === 'asc' ? comparison : -comparison
    })
  }, [filteredItems, sortBy, sortOrder])

  // 対象の一覧を取得
  const uniqueTargets = useMemo(() => {
    const targets = allItems
      .map(item => item.target)
      .filter((target, index, arr) => target && arr.indexOf(target) === index)
      .sort()
    return targets
  }, [allItems])

  // 統計情報
  const statistics = useMemo(() => {
    if (filteredItems.length === 0) {
      return { totalWorks: 0, totalAmount: 0, averagePrice: 0 }
    }
    const totalWorks = filteredItems.length
    // S作業（unit_priceがnull）は金額計算から除外
    const itemsWithPrice = filteredItems.filter(item => item.unit_price !== null)
    const totalAmount = itemsWithPrice.reduce((sum, item) => sum + (item.unit_price! * item.quantity), 0)
    return {
      totalWorks: totalWorks,
      totalAmount: totalAmount,
      averagePrice: itemsWithPrice.length > 0 ? Math.round(totalAmount / itemsWithPrice.length) : 0,
    }
  }, [filteredItems])

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }
  
  // 作業項目から請求書詳細を取得する関数
  const fetchInvoiceDetail = async (workItem: WorkSearchItem) => {
    try {
      // 同じ請求書IDのすべての作業項目を取得
      const { data: invoiceWorkItems, error } = await supabase
        .from('invoice_line_items')
        .select(`
          id,
          line_no,
          raw_label,
          unit_price,
          quantity,
          amount,
          task_type
        `)
        .eq('invoice_id', workItem.invoice_id)
        .order('line_no')
      
      if (error) throw error
      
      
      // 分割データも取得
      const { data: splitData, error: splitError } = await supabase
        .from('invoice_line_items_split')
        .select('*')
        .eq('invoice_id', workItem.invoice_id)
      
      if (splitError) throw splitError
      
      // split itemsをマップ化
      
      // 分割データをグループ化
      const splitMap = new Map()
      splitData?.forEach(split => {
        const key = `${split.invoice_id}-${split.line_no}`
        if (!splitMap.has(key)) {
          splitMap.set(key, [])
        }
        splitMap.get(key).push(split)
      })
      
      // 請求書詳細データを構築
      const work_items = []
      for (const item of invoiceWorkItems || []) {
        const key = `${workItem.invoice_id}-${item.line_no}`
        const split_details = splitMap.get(key) || []
        
        // 全ての分割データの金額を合計（cancelledも含めて）
        const totalSplitAmount = split_details.reduce((sum: number, split: any) => sum + (split.amount || 0), 0)
        const totalSplitQuantity = split_details.reduce((sum: number, split: any) => sum + (split.quantity || 0), 0)
        
        // 分割データがある場合はそれを使用、ない場合は元データを使用
        const amount = totalSplitAmount > 0 ? totalSplitAmount : (item.amount || ((item.unit_price || 0) * (item.quantity || 0)) || 0)
        const quantity = totalSplitQuantity > 0 ? totalSplitQuantity : (item.quantity || 0)
        
        // 単価は合計金額から逆算、または最初の有効な分割データから
        const firstValidSplit = split_details.find((split: any) => (split.amount || 0) > 0) || split_details[0]
        const unit_price = firstValidSplit?.unit_price || (quantity > 0 ? Math.round(amount / quantity) : 0) || item.unit_price || 0
        
        
        // 分割データから最初のtargetを取得（複数ある場合）
        const target = split_details.length > 0 ? split_details[0].target : null
        
        // システムルールに従った作業名の決定と明細処理
        const isSetWork = item.task_type === 'S'
        
        if (isSetWork) {
          // S作業の場合：raw_labelを分割して明細ごとに作業項目を作成
          const breakdownItems = item.raw_label 
            ? item.raw_label.split(/[,、，・･]/).map(s => s.trim()).filter(s => s.length > 0)
            : ['セット作業明細不明']
          
          for (let index = 0; index < breakdownItems.length; index++) {
            const breakdownItem = breakdownItems[index]
            
            work_items.push({
              line_item_id: item.id + (index * 0.1), // 一意性を保つために小数点追加
              line_no: item.line_no,
              work_name: breakdownItem,
              unit_price: index === 0 ? unit_price : 0, // 最初の明細のみ単価を表示
              quantity: index === 0 ? quantity : 1, // 最初の明細のみ数量を表示
              amount: index === 0 ? amount : 0, // 最初の明細のみ金額を表示
              task_type: item.task_type || 'S',
              target: target, // 分割データからのtargetを使用
              split_details: index === 0 ? split_details : [], // 最初の明細のみ分割詳細を表示
              is_breakdown: index > 0, // 2番目以降は明細項目として識別
              breakdown_parent: index > 0 ? item.id : undefined // 親項目のID
            })
          }
        } else {
          // T作業の場合：そのまま1行で表示
          const work_name = item.raw_label || '名称不明'
          
          work_items.push({
            line_item_id: item.id,
            line_no: item.line_no,
            work_name: work_name,
            unit_price: unit_price,
            quantity: quantity,
            amount: amount,
            task_type: item.task_type || 'T',
            target: target, // 分割データからのtargetを使用
            split_details: split_details
          })
        }
      }
      
      const total_amount = work_items.reduce((sum, item) => sum + item.amount, 0)
      
      const invoiceDetail: InvoiceDetail = {
        invoice_id: workItem.invoice_id,
        customer_name: workItem.customer_name,
        subject: workItem.subject,
        registration_number: workItem.registration_number,
        issue_date: workItem.issue_date,
        invoice_month: workItem.invoice_month,
        work_items: work_items,
        total_amount: total_amount,
        work_count: work_items.length
      }
      
      
      setSelectedInvoiceDetail(invoiceDetail)
    } catch (error) {
      console.error('請求書詳細の取得エラー:', error)
    }
  }

  const handleExportCSV = () => {
    const headers = ['作業名', '単価', '数量', '対象', '動作', '顧客名', '件名', '請求月', '登録番号', '発行日', 'セット', '請求書ID']
    const rows = sortedItems.map(item => [
      `"${item.work_name.replace(/"/g, '""')}"`, 
      item.unit_price !== null ? item.unit_price : '',
      item.quantity,
      `"${(item.target || '').replace(/"/g, '""')}"`,
      `"${(item.action || '').replace(/"/g, '""')}"`,
      `"${(item.customer_name || '').replace(/"/g, '""')}"`, 
      `"${(item.subject || '').replace(/"/g, '""')}"`, 
      `"${(item.invoice_month || '').replace(/"/g, '""')}"`, 
      `"${(item.registration_number || '').replace(/"/g, '""')}"`, 
      item.issue_date || '',
      item.is_set ? 'はい' : 'いいえ',
      item.invoice_id
    ].join(','))
    
    const csvContent = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    if (typeof URL !== 'undefined' && typeof document !== 'undefined') {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `作業価格検索結果_${new Date().toISOString().split('T')[0]}.csv`
      link.click()
      URL.revokeObjectURL(url)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">読み込み中...</div>
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">エラー: {error}</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <header className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Search className="text-blue-600" size={32} />
              <h1 className="text-2xl font-bold text-gray-800">作業価格履歴検索</h1>
            </div>
            <div className="flex gap-2">
              <button onClick={handleExportCSV} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"><Download size={20} />CSV出力</button>
              <button onClick={() => router.push('/')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"><Home size={20} />メニューへ</button>
            </div>
          </div>
        </header>

        {/* 検索と統計 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex gap-8">
            <div className="flex-grow space-y-4">
              {/* キーワード検索 */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="作業名、件名（顧客名含む）、登録番号、請求月、対象で検索..."
                  value={filters.keyword}
                  onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* フィルター行 */}
              <div className="flex flex-wrap gap-4 items-center">
                {/* 顧客カテゴリーフィルター */}
                <div className="flex gap-2 items-center min-w-0">
                  <label className="text-sm font-medium text-gray-700 whitespace-nowrap">顧客名:</label>
                  <select
                    value={filters.customerCategory}
                    onChange={(e) => setFilters({ ...filters, customerCategory: e.target.value })}
                    className="w-32 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="">すべての顧客</option>
                    {customerCategories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                  {filters.customerCategory && (
                    <button
                      onClick={() => setFilters({ ...filters, customerCategory: '' })}
                      className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      クリア
                    </button>
                  )}
                </div>

                {/* 日付範囲フィルター */}
                <div className="flex gap-2 items-center min-w-0">
                  <label className="text-sm font-medium text-gray-700 whitespace-nowrap">期間:</label>
                  <div className="flex gap-1 items-center">
                    <input
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                      className="w-36 px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <span className="text-sm text-gray-500 px-1">〜</span>
                    <input
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                      className="w-36 px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  {(filters.dateFrom || filters.dateTo) && (
                    <button
                      onClick={() => setFilters({ ...filters, dateFrom: '', dateTo: '' })}
                      className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      クリア
                    </button>
                  )}
                </div>

                {/* 対象フィルター */}
                <div className="flex gap-2 items-center min-w-0">
                  <label className="text-sm font-medium text-gray-700 whitespace-nowrap">対象:</label>
                  <select
                    value={filters.target}
                    onChange={(e) => setFilters({ ...filters, target: e.target.value })}
                    className="w-32 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="">すべての対象</option>
                    {uniqueTargets.map((target) => (
                      <option key={target} value={target || ''}>{target || ''}</option>
                    ))}
                  </select>
                  {filters.target && (
                    <button
                      onClick={() => setFilters({ ...filters, target: '' })}
                      className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      クリア
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm text-gray-600">総作業数</div>
                <div className="text-xl font-bold text-blue-600">{statistics.totalWorks}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">平均単価</div>
                <div className="text-xl font-bold text-green-600">{formatCurrency(statistics.averagePrice)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">合計金額</div>
                <div className="text-xl font-bold text-orange-600">{formatCurrency(statistics.totalAmount)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 作業価格比較テーブル */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer" onClick={() => handleSort('subject')}>件名</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer whitespace-nowrap" onClick={() => handleSort('invoice_month')}>請求月</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer" onClick={() => handleSort('registration_number')}>登録番号</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer" onClick={() => handleSort('work_name')}>作業名</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer" onClick={() => handleSort('target')}>対象</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">T/S</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 cursor-pointer" onClick={() => handleSort('unit_price')}>単価<br/><span className="font-normal text-xs">(セット/個別)</span></th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">詳細</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedItems.map((item) => (
                  <tr key={`${item.invoice_id}-${item.line_item_id}`} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-gray-700 max-w-xs">
                      <div className="truncate" title={item.subject || undefined}>{item.subject || '-'}</div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">{item.invoice_month || '-'}</td>
                    <td className="px-4 py-4 text-sm text-gray-600 font-mono">{item.registration_number || '-'}</td>
                    <td className="px-4 py-4 text-sm text-gray-900 max-w-xs">
                      <div className="truncate" title={item.work_name}>{item.work_name}</div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-800">{item.target || '-'}</td>
                    <td className="px-4 py-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.is_set 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {item.is_set ? 'S' : 'T'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right text-sm font-semibold text-green-600">
                      {item.unit_price !== null ? formatCurrency(item.unit_price) : '-'}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button onClick={() => fetchInvoiceDetail(item)} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">詳細</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {sortedItems.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                {filters.keyword ? '該当する作業履歴がありません' : 'データがありません'}
              </div>
            )}
          </div>
        </div>

        {/* 詳細モーダル - 請求書情報表示 */}
        {selectedInvoiceDetail && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
              <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">請求書情報</h2>
                <button onClick={() => setSelectedInvoiceDetail(null)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* 請求書基本情報 */}
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4">請求書基本情報</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex justify-between items-center py-2 border-b border-blue-200">
                      <span className="font-medium text-gray-700">請求書ID</span>
                      <span className="text-blue-700 font-mono text-lg">{selectedInvoiceDetail.invoice_id}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-blue-200">
                      <span className="font-medium text-gray-700">件名</span>
                      <span className="text-gray-800 text-right max-w-xs">{selectedInvoiceDetail.subject || '-'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-blue-200">
                      <span className="font-medium text-gray-700">顧客名</span>
                      <span className="text-gray-800 font-medium">{selectedInvoiceDetail.customer_name || '-'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-blue-200">
                      <span className="font-medium text-gray-700">登録番号</span>
                      <span className="text-gray-800 font-mono">{selectedInvoiceDetail.registration_number || '-'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-blue-200">
                      <span className="font-medium text-gray-700">請求月</span>
                      <span className="text-gray-800 font-medium">{selectedInvoiceDetail.invoice_month || '-'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-blue-200">
                      <span className="font-medium text-gray-700">発行日</span>
                      <span className="text-gray-800">{selectedInvoiceDetail.issue_date ? new Date(selectedInvoiceDetail.issue_date).toLocaleDateString('ja-JP') : '-'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="font-medium text-gray-700">作業項目数</span>
                      <span className="text-blue-600 font-bold text-lg">{selectedInvoiceDetail.work_count}件</span>
                    </div>
                  </div>
                </div>

                {/* 作業項目詳細 */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">作業内容詳細</h3>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">No</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">作業内容</th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">単価</th>
                          <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">数量</th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">金額</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedInvoiceDetail.work_items
                          .filter(item => !item.is_breakdown) // 親項目のみ
                          .map((workItem) => {
                            const breakdownItems = selectedInvoiceDetail.work_items.filter(
                              item => item.is_breakdown && item.breakdown_parent === workItem.line_item_id
                            )
                            return (
                              <React.Fragment key={workItem.line_item_id}>
                                {/* メイン作業項目 */}
                                <tr className="hover:bg-gray-50">
                                  <td className="px-4 py-3 text-sm font-medium text-gray-600">
                                    #{workItem.line_no}
                                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                      workItem.task_type === 'S' 
                                        ? 'bg-purple-100 text-purple-800' 
                                        : 'bg-blue-100 text-blue-800'
                                    }`}>
                                      {workItem.task_type === 'S' ? 'S' : 'T'}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="text-gray-900 font-medium">{workItem.work_name}</div>
                                    {workItem.target && (
                                      <div className="text-sm text-blue-600 mt-1">対象: {workItem.target}</div>
                                    )}
                                    {breakdownItems.length > 0 && (
                                      <div className="mt-2">
                                        <div className="text-sm text-gray-600 font-medium mb-1">内訳</div>
                                        <ul className="text-sm text-gray-700 space-y-1">
                                          {breakdownItems.map((breakdown) => (
                                            <li key={breakdown.line_item_id} className="flex items-start">
                                              <span className="text-gray-400 mr-2">•</span>
                                              <span className="flex-1">{breakdown.work_name}</span>
                                              {breakdown.target && (
                                                <span className="text-blue-600 text-xs ml-2">({breakdown.target})</span>
                                              )}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-right text-sm font-medium">
                                    {formatCurrency(workItem.unit_price)}
                                  </td>
                                  <td className="px-4 py-3 text-center text-sm font-medium">
                                    {workItem.quantity}
                                  </td>
                                  <td className="px-4 py-3 text-right text-lg font-bold text-green-600">
                                    {formatCurrency(workItem.amount)}
                                  </td>
                                </tr>
                              </React.Fragment>
                            )
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 請求金額情報 */}
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-800 mb-4">請求金額情報</h3>
                  {selectedInvoiceDetail.total_amount > 0 ? (
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">請求書合計金額</div>
                      <div className="text-4xl font-bold text-green-700 mb-4">{formatCurrency(selectedInvoiceDetail.total_amount)}</div>
                      <div className="text-sm text-gray-600">
                        平均単価: {formatCurrency(Math.round(selectedInvoiceDetail.total_amount / selectedInvoiceDetail.work_count))} / 作業項目
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 text-center">
                      <div className="text-yellow-800 font-medium mb-2">金額データ不備</div>
                      <div className="text-sm text-yellow-700">
                        この請求書の金額情報が正しく登録されていません
                      </div>
                    </div>
                  )}
                </div>

                {/* アクションボタン */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-center space-y-3">
                    <div className="text-sm text-gray-600 mb-3">この請求書の詳細を確認する場合</div>
                    <button 
                      onClick={() => window.open(`/invoice-view/${selectedInvoiceDetail.invoice_id}`, '_blank')}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      請求書詳細ページを開く
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 border-t flex justify-end">
                <button 
                  onClick={() => setSelectedInvoiceDetail(null)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}