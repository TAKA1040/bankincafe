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
  subject: string
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

// ひらがな→カタカナ変換
const hiraganaToKatakana = (str: string): string => {
  return str.replace(/[\u3041-\u3096]/g, (match) => {
    return String.fromCharCode(match.charCodeAt(0) + 0x60)
  })
}

// カタカナ→ひらがな変換
const katakanaToHiragana = (str: string): string => {
  return str.replace(/[\u30A1-\u30F6]/g, (match) => {
    return String.fromCharCode(match.charCodeAt(0) - 0x60)
  })
}

// 曖昧検索用：文字列を正規化（カタカナに統一、小文字化、全角→半角）
const normalizeForSearch = (str: string): string => {
  if (!str) return ''
  return hiraganaToKatakana(str)
    .toLowerCase()
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0)) // 全角英数→半角
}

export default function WorkSearchPage() {
  const router = useRouter()
  const [allItems, setAllItems] = useState<WorkSearchItem[]>([])
  const [filteredItems, setFilteredItems] = useState<WorkSearchItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [filters, setFilters] = useState<SearchFilters>({ keyword: '', customerCategory: '', subject: '', dateFrom: '', dateTo: '', target: '' })
  const [sortBy, setSortBy] = useState<'issue_date' | 'unit_price' | 'customer_name' | 'work_name' | 'subject' | 'registration_number' | 'invoice_month' | 'target'>('issue_date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

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

        const { data: splitInvoiceIds } = await supabase
          .from('invoice_line_items_split')
          .select('invoice_id')
          .limit(1000)
        
        const uniqueInvoiceIds = [...new Set(splitInvoiceIds?.map(s => s.invoice_id) || [])]


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
          target,
          set_name
        `)
        
        if (lineItemsRes.error) {
          console.error('Line items error:', lineItemsRes.error)
          throw new Error(`請求書項目の取得に失敗しました: ${lineItemsRes.error.message}`)
        }
        
        const lineItems = lineItemsRes.data || []
        
        // 4. 実際に使用されているinvoice_idのベースIDを取得
        const uniqueBaseIds = [...new Set(lineItems.map(item => item.invoice_id.split('-')[0]))]

        
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


        
        // 作業タイプの分析
        const taskTypes = lineItems.reduce((acc, item) => {
          const type = item.task_type || 'unknown'
          acc[type] = (acc[type] || 0) + 1
          return acc
        }, {} as Record<string, number>)

        
        // line_itemsのサンプル確認
        if (lineItems.length > 0) {

          lineItems.slice(0, 3).forEach((item, i) => {




          })
        }
        
        // 最初のinvoiceサンプルを確認
        if (invoices.length > 0) {

          invoices.slice(0, 3).forEach((inv, i) => {






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

        // 同じinvoice_id + line_noをグループ化（S作業の重複表示を防ぐ）
        const lineItemGroups = new Map<string, typeof filteredLineItems>()
        for (const item of filteredLineItems) {
          const groupKey = `${item.invoice_id}-${item.line_no}`
          if (!lineItemGroups.has(groupKey)) {
            lineItemGroups.set(groupKey, [])
          }
          lineItemGroups.get(groupKey)!.push(item)
        }

        // グループごとに処理
        for (const [groupKey, groupItems] of lineItemGroups) {
          // グループ内の最初のアイテムを代表として使用
          const firstItem = groupItems[0]
          const invoice = invoiceMap.get(firstItem.invoice_id) || invoiceMap.get(firstItem.invoice_id.split('-')[0])
          const splitDetails = splitMap.get(groupKey) || []

          // 請求月を取得
          let invoice_month = null
          if (invoice?.billing_month) {
            const billingMonth = invoice.billing_month.toString()
            if (billingMonth.length === 4) {
              const year = billingMonth.substring(0, 2)
              const month = billingMonth.substring(2, 4)
              invoice_month = `${year}年${month}月`
            } else if (billingMonth.includes('-') && billingMonth.length === 7) {
              const [year, month] = billingMonth.split('-')
              const shortYear = year.slice(-2)
              invoice_month = `${shortYear}年${month}月`
            } else {
              invoice_month = billingMonth
            }
          } else if (invoice?.issue_date) {
            const date = new Date(invoice.issue_date)
            const shortYear = date.getFullYear().toString().slice(-2)
            invoice_month = `${shortYear}年${(date.getMonth() + 1).toString().padStart(2, '0')}月`
          }

          const isSetWork = firstItem.task_type === 'S'

          if (isSetWork) {
            // S作業の場合：グループを1行としてまとめて表示
            // set_nameがあればそれを使用、なければraw_labelの最初の部分
            const workName = firstItem.set_name ||
              firstItem.raw_label?.split(/[,、，・･]/)[0]?.trim() ||
              'セット作業'

            const workItem = {
              line_item_id: firstItem.id,
              work_name: workName,
              unit_price: firstItem.unit_price, // S作業でもセット単価を表示
              quantity: firstItem.quantity || 0,
              invoice_id: firstItem.invoice_id,
              customer_name: invoice?.customer_name || null,
              subject: invoice?.subject || invoice?.subject_name || null,
              registration_number: invoice?.registration_number || null,
              issue_date: invoice?.issue_date || null,
              target: firstItem.target,
              action: null,
              is_set: true,
              invoice_month: invoice_month,
              split_details: splitDetails,
            }

            workSearchItems.push(workItem)
          } else {
            // T作業の場合：そのまま1行で表示
            const work_name = firstItem.raw_label || '名称不明'

            const workItem = {
              line_item_id: firstItem.id,
              work_name: work_name,
              unit_price: firstItem.unit_price || 0,
              quantity: firstItem.quantity || 0,
              invoice_id: firstItem.invoice_id,
              customer_name: invoice?.customer_name || null,
              subject: invoice?.subject || invoice?.subject_name || null,
              registration_number: invoice?.registration_number || null,
              issue_date: invoice?.issue_date || null,
              target: firstItem.target,
              action: null,
              is_set: false,
              invoice_month: invoice_month,
              split_details: splitDetails,
            }

            workSearchItems.push(workItem)
          }
        }


        
        // データベースのtargetデータをそのまま使用（対象抽出処理は不要）
        const withTarget = workSearchItems.filter(item => item.target)




        
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

  // 検索フィルター処理（ひらがな/カタカナ曖昧検索対応）
  useEffect(() => {
    const normalizedKeyword = normalizeForSearch(filters.keyword)
    const result = allItems.filter(item => {
      // キーワード検索（ひらがな/カタカナ/大小文字/全角半角を区別しない）
      const matchesKeyword = !normalizedKeyword || (
        normalizeForSearch(item.work_name || '').includes(normalizedKeyword) ||
        normalizeForSearch(item.customer_name || '').includes(normalizedKeyword) ||
        normalizeForSearch(item.subject || '').includes(normalizedKeyword) ||
        normalizeForSearch(item.registration_number || '').includes(normalizedKeyword) ||
        normalizeForSearch(item.invoice_month || '').includes(normalizedKeyword) ||
        normalizeForSearch(item.target || '').includes(normalizedKeyword) ||
        normalizeForSearch(item.action || '').includes(normalizedKeyword)
      )
      
      // 顧客カテゴリーフィルター
      const matchesCategory = filters.customerCategory === '' ||
        (() => {
          const category = customerCategories.find(cat => cat.id === filters.customerCategory)
          return category && item.customer_name === category.companyName
        })()

      // 件名フィルター
      const matchesSubject = filters.subject === '' ||
        (item.subject && item.subject === filters.subject)

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
      
      return matchesKeyword && matchesCategory && matchesSubject && matchesDateRange && matchesTarget
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

  // 件名の一覧を取得
  const uniqueSubjects = useMemo(() => {
    const subjects = allItems
      .map(item => item.subject)
      .filter((subject, index, arr) => subject && arr.indexOf(subject) === index)
      .sort() as string[]
    return subjects
  }, [allItems])

  // 件名フィルター用：入力値で絞り込んだ件名リスト
  const [subjectInput, setSubjectInput] = useState('')
  const filteredSubjects = useMemo(() => {
    if (!subjectInput) return uniqueSubjects
    const normalizedInput = normalizeForSearch(subjectInput)
    return uniqueSubjects.filter(subject =>
      normalizeForSearch(subject).includes(normalizedInput)
    )
  }, [uniqueSubjects, subjectInput])

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
      // 同じ請求書IDのすべての作業項目を取得（sub_noも含む）
      const { data: invoiceWorkItems, error } = await supabase
        .from('invoice_line_items')
        .select(`
          id,
          line_no,
          sub_no,
          raw_label,
          raw_label_part,
          unit_price,
          quantity,
          amount,
          task_type,
          target,
          set_name,
          action1
        `)
        .eq('invoice_id', workItem.invoice_id)
        .order('line_no')
        .order('sub_no')

      if (error) throw error

      // 分割データも取得
      const { data: splitData, error: splitError } = await supabase
        .from('invoice_line_items_split')
        .select('*')
        .eq('invoice_id', workItem.invoice_id)

      if (splitError) throw splitError

      // 分割データをグループ化
      const splitMap = new Map()
      splitData?.forEach(split => {
        const key = `${split.invoice_id}-${split.line_no}`
        if (!splitMap.has(key)) {
          splitMap.set(key, [])
        }
        splitMap.get(key).push(split)
      })

      // 同じline_noをグループ化（S作業の重複表示を防ぐ）
      const lineNoGroups = new Map<number, typeof invoiceWorkItems>()
      for (const item of invoiceWorkItems || []) {
        const lineNo = item.line_no
        if (!lineNoGroups.has(lineNo)) {
          lineNoGroups.set(lineNo, [])
        }
        lineNoGroups.get(lineNo)!.push(item)
      }

      // 請求書詳細データを構築
      const work_items: InvoiceDetail['work_items'] = []

      for (const [lineNo, groupItems] of lineNoGroups) {
        const key = `${workItem.invoice_id}-${lineNo}`
        const split_details = splitMap.get(key) || []

        // グループ内の最初のアイテム（sub_no=1または最小）を親として使用
        const sortedGroup = [...groupItems].sort((a, b) => (a.sub_no || 0) - (b.sub_no || 0))
        const parentItem = sortedGroup[0]
        const isSetWork = parentItem.task_type === 'S'

        // 金額情報は親アイテムから1回だけ取得（重複カウントを防ぐ）
        const amount = parentItem.amount || ((parentItem.unit_price || 0) * (parentItem.quantity || 0)) || 0
        const quantity = parentItem.quantity || 0
        const unit_price = parentItem.unit_price || 0

        if (isSetWork && sortedGroup.length > 1) {
          // S作業で複数のsub_noがある場合：グループ化して表示
          // 親項目として最初のアイテムを使用
          const parentWorkName = parentItem.set_name || parentItem.raw_label?.split(/[,、，・･]/)[0] || 'セット作業'

          work_items.push({
            line_item_id: parentItem.id,
            line_no: lineNo,
            work_name: parentWorkName,
            unit_price: unit_price,
            quantity: quantity,
            amount: amount,
            task_type: 'S',
            target: parentItem.target,
            split_details: split_details,
            is_breakdown: false
          })

          // 明細項目として残りのアイテムを追加
          for (let i = 0; i < sortedGroup.length; i++) {
            const subItem = sortedGroup[i]
            // raw_label_partがあればそれを使用、なければ作業名から生成
            const subWorkName = subItem.raw_label_part ||
              (subItem.target ? `${subItem.target}${subItem.action1 || ''}` : `明細${i + 1}`)

            work_items.push({
              line_item_id: subItem.id + 0.01 * (i + 1),
              line_no: lineNo,
              work_name: subWorkName,
              unit_price: 0,
              quantity: 0,
              amount: 0,
              task_type: 'S',
              target: subItem.target,
              split_details: [],
              is_breakdown: true,
              breakdown_parent: parentItem.id
            })
          }
        } else if (isSetWork) {
          // S作業だがsub_noが1つだけの場合
          const breakdownItems = parentItem.raw_label
            ? parentItem.raw_label.split(/[,、，・･]/).map(s => s.trim()).filter(s => s.length > 0)
            : ['セット作業明細不明']

          for (let index = 0; index < breakdownItems.length; index++) {
            const breakdownItem = breakdownItems[index]

            work_items.push({
              line_item_id: parentItem.id + (index * 0.1),
              line_no: lineNo,
              work_name: breakdownItem,
              unit_price: index === 0 ? unit_price : 0,
              quantity: index === 0 ? quantity : 0,
              amount: index === 0 ? amount : 0,
              task_type: 'S',
              target: parentItem.target,
              split_details: index === 0 ? split_details : [],
              is_breakdown: index > 0,
              breakdown_parent: index > 0 ? parentItem.id : undefined
            })
          }
        } else {
          // T作業の場合：そのまま1行で表示
          const work_name = parentItem.raw_label || '名称不明'

          work_items.push({
            line_item_id: parentItem.id,
            line_no: lineNo,
            work_name: work_name,
            unit_price: unit_price,
            quantity: quantity,
            amount: amount,
            task_type: 'T',
            target: parentItem.target,
            split_details: split_details
          })
        }
      }

      // 親項目のみの金額を合計（重複カウントを防ぐ）
      const total_amount = work_items
        .filter(item => !item.is_breakdown)
        .reduce((sum, item) => sum + item.amount, 0)
      
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
              <h1 className="text-2xl font-bold text-gray-800">顧客別作業履歴</h1>
            </div>
            <div className="flex gap-2">
              <button onClick={handleExportCSV} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 font-medium"><Download size={20} />CSV出力</button>
              <button onClick={() => router.back()} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2 font-medium"><ArrowLeft size={20} />戻る</button>
              <button onClick={() => router.push('/')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium"><Home size={20} />メニューへ</button>
            </div>
          </div>
        </header>

        {/* 検索と統計 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex gap-8">
            <div className="flex-grow space-y-4">
              {/* キーワード検索 + 顧客名フィルター（同じ行） */}
              <div className="flex gap-4 items-center">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="作業名、件名（顧客名含む）、登録番号、請求月、対象で検索..."
                    value={filters.keyword}
                    onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
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
              </div>

              {/* フィルター行 */}
              <div className="flex flex-wrap gap-4 items-center">
                {/* 件名フィルター（曖昧検索付きプルダウン） */}
                <div className="flex gap-2 items-center min-w-0">
                  <label className="text-sm font-medium text-gray-700 whitespace-nowrap">件名:</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="件名を検索..."
                      value={subjectInput}
                      onChange={(e) => setSubjectInput(e.target.value)}
                      className="w-40 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {subjectInput && filteredSubjects.length > 0 && (
                      <div className="absolute z-10 w-64 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredSubjects.slice(0, 20).map((subject) => (
                          <button
                            key={subject}
                            onClick={() => {
                              setFilters({ ...filters, subject: subject })
                              setSubjectInput('')
                            }}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-blue-50 truncate"
                          >
                            {subject}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {filters.subject && (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded truncate max-w-32" title={filters.subject}>
                      {filters.subject.length > 10 ? filters.subject.substring(0, 10) + '...' : filters.subject}
                    </span>
                  )}
                  {filters.subject && (
                    <button
                      onClick={() => setFilters({ ...filters, subject: '' })}
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
                      onClick={() => router.push(`/invoice-view/${selectedInvoiceDetail.invoice_id}`)}
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