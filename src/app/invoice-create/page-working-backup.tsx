'use client'

import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Plus, Trash2, Save, Search, Calculator, Home } from 'lucide-react'
import { useWorkDictionary } from '@/hooks/useWorkDictionary'
import { supabase } from '@/lib/supabase'
import { generateDocumentNumber, parseDocumentNumber } from '@/lib/utils'

// ひらがな・カタカナ変換のヘルパー関数
const hiraganaToKatakana = (str: string) => {
  return str.replace(/[\u3041-\u3096]/g, (char) => 
    String.fromCharCode(char.charCodeAt(0) + 0x60)
  )
}

const katakanaToHiragana = (str: string) => {
  return str.replace(/[\u30A1-\u30F6]/g, (char) => 
    String.fromCharCode(char.charCodeAt(0) - 0x60)
  )
}

// 全角半角正規化関数
const normalizeText = (str: string) => {
  return str
    // 全角英数字を半角に変換
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (char) => 
      String.fromCharCode(char.charCodeAt(0) - 0xFEE0)
    )
    // 全角スペースを半角スペースに変換
    .replace(/　/g, ' ')
    .toLowerCase()
}

// 曖昧検索用の関数
const fuzzyMatch = (text: string, query: string) => {
  // 両方とも正規化
  const normalizedText = normalizeText(text)
  const normalizedQuery = normalizeText(query)
  
  // 元の文字列での検索
  if (normalizedText.includes(normalizedQuery)) return true
  
  // ひらがな→カタカナ変換での検索
  const katakanaQuery = hiraganaToKatakana(normalizedQuery)
  if (normalizedText.includes(katakanaQuery)) return true
  
  // カタカナ→ひらがな変換での検索
  const hiraganaQuery = katakanaToHiragana(normalizedQuery)
  if (normalizedText.includes(hiraganaQuery)) return true
  
  // テキスト側も変換して検索
  const katakanaText = hiraganaToKatakana(normalizedText)
  if (katakanaText.includes(normalizedQuery)) return true
  
  const hiraganaText = katakanaToHiragana(normalizedText)
  if (hiraganaText.includes(normalizedQuery)) return true
  
  return false
}

// UI Components (from prototype2)
function Tabs({ defaultValue, children }: { defaultValue: string; children: React.ReactNode }) {
  const [tab, setTab] = useState(defaultValue)
  
  const handleTabClick = React.useCallback((value: string) => {
    setTab(value)
  }, [])
  
  return (
    <div>
      <div className="flex gap-2 border-b border-gray-200 mb-4">
        {React.Children.map(children as any, (child: any) =>
          child?.type?.displayName === "TabTrigger" ? (
            React.cloneElement(child, { active: tab, onClick: () => handleTabClick(child.props.value) })
          ) : child?.type?.displayName === "TabContent" ? null : child
        )}
      </div>
      {React.Children.map(children as any, (child: any) =>
        child?.type?.displayName === "TabContent" ? React.cloneElement(child, { active: tab }) : null
      )}
    </div>
  )
}

function TabTrigger({ value, children, active, onClick }: any) {
  const isActive = active === value
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium ${
        isActive ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {children}
    </button>
  )
}
TabTrigger.displayName = "TabTrigger"

function TabContent({ value, active, children }: any) {
  if (active !== value) return null
  return <div className="space-y-4">{children}</div>
}
TabContent.displayName = "TabContent"

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`border border-gray-200 rounded-lg ${className}`}>{children}</div>
}

function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="border-b border-gray-200 px-4 py-3">{children}</div>
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-semibold text-gray-800">{children}</h3>
}

function CardContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-4 ${className}`}>{children}</div>
}

function SimpleLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-gray-700 mb-2">{children}</label>
}

// 位置組み合わせユーティリティ
function combinePositions(positions: string[]): string {
  if (positions.length === 0) return "";
  if (positions.length === 1) return positions[0];
  
  // 特定の組み合わせパターンを優先処理
  const posSet = new Set(positions);
  
  // 左右の組み合わせ
  if (posSet.has("左") && posSet.has("右")) {
    const remaining = positions.filter(p => p !== "左" && p !== "右");
    if (remaining.length === 0) return "左右";
    return remaining.join("") + "左右";
  }
  
  // 前後の組み合わせ  
  if (posSet.has("前") && posSet.has("後")) {
    const remaining = positions.filter(p => p !== "前" && p !== "後");
    if (remaining.length === 0) return "前後";
    return remaining.join("") + "前後";
  }
  
  // 上下の組み合わせ
  if (posSet.has("上") && posSet.has("下")) {
    const remaining = positions.filter(p => p !== "上" && p !== "下");
    if (remaining.length === 0) return "上下";
    return remaining.join("") + "上下";
  }
  
  // 内外の組み合わせ
  if (posSet.has("内") && posSet.has("外")) {
    const remaining = positions.filter(p => p !== "内" && p !== "外");
    if (remaining.length === 0) return "内外";
    return remaining.join("") + "内外";
  }
  
  // その他の組み合わせは順番に結合
  return positions.join("");
}

// 型定義
interface WorkItem {
  id: number
  type: 'individual' | 'set'
  work_name: string
  position?: string
  unit_price: number
  quantity: number
  amount: number
  memo: string
  set_details?: string[]
  detail_positions?: string[]
}

interface CustomerCategory {
  id: string
  name: string
  companyName: string
  isDefault?: boolean
}

interface InvoiceData {
  invoice_year: number
  invoice_month: number
  billing_date: string
  customer_category: string
  customer_name: string
  subject: string
  registration_number: string
  order_number: string
  internal_order_number: string
  work_items: WorkItem[]
  subtotal: number
  tax_amount: number
  total_amount: number
  memo: string
}

interface WorkHistoryItem {
  id: number
  work_name: string
  unit_price: number
  customer_name: string
  date: string
}

// WorkHistoryDBクラス
class WorkHistoryDB {
  private data: WorkHistoryItem[]

  constructor() {
    this.data = this.loadData()
  }

  private loadData(): WorkHistoryItem[] {
    try {
      if (typeof window === 'undefined') return this.getDefaultData()
      const stored = localStorage.getItem('bankin_work_history')
      return stored ? JSON.parse(stored) : this.getDefaultData()
    } catch {
      return this.getDefaultData()
    }
  }

  private getDefaultData(): WorkHistoryItem[] {
    return [
      { id: 1, work_name: 'Webサイト制作', unit_price: 100000, customer_name: 'テクノロジー株式会社', date: '2024-01-15' },
      { id: 2, work_name: 'システム保守', unit_price: 50000, customer_name: 'サンプル商事株式会社B', date: '2024-02-10' },
      { id: 3, work_name: 'データベース設計', unit_price: 80000, customer_name: '株式会社UDトラックス', date: '2024-03-05' },
      { id: 4, work_name: 'SEO対策', unit_price: 30000, customer_name: 'テクノロジー株式会社', date: '2024-01-20' },
      { id: 5, work_name: 'サーバー構築', unit_price: 120000, customer_name: 'サンプル商事株式会社B', date: '2024-02-25' },
      { id: 6, work_name: 'ロゴデザイン', unit_price: 50000, customer_name: 'デザイン会社', date: '2024-03-01' },
      { id: 7, work_name: 'システム開発', unit_price: 200000, customer_name: '開発会社', date: '2024-03-10' },
      { id: 8, work_name: 'コンサルティング', unit_price: 80000, customer_name: 'コンサル会社', date: '2024-03-15' }
    ]
  }

  search(keyword: string): WorkHistoryItem[] {
    if (!keyword.trim()) return []
    
    const normalizedKeyword = keyword.toLowerCase()
    return this.data.filter(item =>
      item.work_name.toLowerCase().includes(normalizedKeyword) ||
      item.customer_name.toLowerCase().includes(normalizedKeyword)
    )
  }

  getWorkSuggestions(keyword: string): string[] {
    if (!keyword.trim()) return []
    
    const suggestions = this.search(keyword)
      .map(item => item.work_name)
      .filter((value, index, self) => self.indexOf(value) === index)
      .slice(0, 5)
    
    return suggestions
  }

  getCustomerSuggestions(keyword: string): string[] {
    if (!keyword.trim()) return []
    
    const normalizedKeyword = keyword.toLowerCase()
    const suggestions = this.data
      .filter(item => item.customer_name.toLowerCase().includes(normalizedKeyword))
      .map(item => item.customer_name)
      .filter((value, index, self) => self.indexOf(value) === index)
      .slice(0, 5)
    
    return suggestions
  }

  getPriceByWork(workName: string): number | null {
    const item = this.data.find(item => item.work_name === workName)
    return item ? item.unit_price : null
  }
}

// 件名マスターDBクラス（同じものを使用）
class SubjectMasterDB {
  private readonly STORAGE_KEY = 'bankin_subject_master'

  getSubjects() {
    try {
      if (typeof window === 'undefined') return []
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  searchSubjects(keyword: string) {
    if (!keyword.trim()) return this.getSubjects()
    const normalizedKeyword = keyword.toLowerCase()
    return this.getSubjects()
      .filter((subject: any) => 
        subject.subjectName.toLowerCase().includes(normalizedKeyword) ||
        (subject.category && subject.category.toLowerCase().includes(normalizedKeyword))
      )
      .sort((a: any, b: any) => b.usageCount - a.usageCount)
      .slice(0, 8)
  }

  autoRegisterSubject(subjectName: string) {
    const subjects = this.getSubjects()
    const existing = subjects.find((subj: any) => 
      subj.subjectName.toLowerCase() === subjectName.toLowerCase()
    )
    
    if (existing) {
      const updated = subjects.map((subj: any) => 
        subj.id === existing.id 
          ? { ...subj, usageCount: subj.usageCount + 1, lastUsedAt: new Date().toISOString().split('T')[0] }
          : subj
      )
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated))
    } else {
      const newSubject = {
        id: Date.now().toString(),
        subjectName: subjectName,
        category: 'その他',
        usageCount: 1,
        lastUsedAt: new Date().toISOString().split('T')[0]
      }
      subjects.push(newSubject)
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(subjects))
    }
  }
}

// 登録番号マスターDBクラス（同じものを使用）
class RegistrationMasterDB {
  private readonly STORAGE_KEY = 'bankin_registration_master'

  getRegistrations() {
    try {
      if (typeof window === 'undefined') return []
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  searchRegistrations(keyword: string) {
    if (!keyword.trim()) return this.getRegistrations()
    const normalizedKeyword = keyword.toLowerCase()
    return this.getRegistrations()
      .filter((registration: any) => 
        registration.registrationNumber.toLowerCase().includes(normalizedKeyword) ||
        (registration.description && registration.description.toLowerCase().includes(normalizedKeyword)) ||
        (registration.category && registration.category.toLowerCase().includes(normalizedKeyword))
      )
      .sort((a: any, b: any) => b.usageCount - a.usageCount)
      .slice(0, 8)
  }

  autoRegisterRegistration(registrationNumber: string) {
    const registrations = this.getRegistrations()
    const existing = registrations.find((reg: any) => 
      reg.registrationNumber.toLowerCase() === registrationNumber.toLowerCase()
    )
    
    if (existing) {
      const updated = registrations.map((reg: any) => 
        reg.id === existing.id 
          ? { ...reg, usageCount: reg.usageCount + 1, lastUsedAt: new Date().toISOString().split('T')[0] }
          : reg
      )
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated))
    } else {
      const newRegistration = {
        id: Date.now().toString(),
        registrationNumber: registrationNumber,
        description: '自動登録',
        category: 'その他',
        usageCount: 1,
        lastUsedAt: new Date().toISOString().split('T')[0]
      }
      registrations.push(newRegistration)
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(registrations))
    }
  }
}

// 顧客カテゴリーDBクラス
class CustomerCategoryDB {
  private readonly STORAGE_KEY = 'bankin_customer_categories'

  getCategories(): CustomerCategory[] {
    try {
      if (typeof window === 'undefined') return this.getDefaultCategories()
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : this.getDefaultCategories()
    } catch {
      return this.getDefaultCategories()
    }
  }

  private getDefaultCategories(): CustomerCategory[] {
    return [
      {
        id: 'ud',
        name: 'UD',
        companyName: '株式会社UDトラックス',
        isDefault: true
      },
      {
        id: 'other',
        name: 'その他',
        companyName: '',
        isDefault: true
      }
    ]
  }

  getCategoryById(id: string): CustomerCategory | undefined {
    return this.getCategories().find(cat => cat.id === id)
  }
}

const InvoiceCreateContent: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editInvoiceId = searchParams?.get('edit')
  const isEditMode = !!editInvoiceId
  
  const [db, setDb] = useState<WorkHistoryDB | null>(null)
  const [categoryDb, setCategoryDb] = useState<CustomerCategoryDB | null>(null)
  const [subjectDb, setSubjectDb] = useState<SubjectMasterDB | null>(null)
  const [registrationDb, setRegistrationDb] = useState<RegistrationMasterDB | null>(null)

  // Supabaseから最大連番を取得する関数
  const getMaxSequence = async (year: string, month: string, type: 'invoice' | 'estimate'): Promise<number> => {
    try {
      const prefix = type === 'estimate' ? `${year}${month}M` : `${year}${month}`
      
      // PostgreSQLの正規表現を使用してより正確にマッチ
      const pattern = type === 'estimate' 
        ? `^${year}${month}M[0-9]{3}-[0-9]+$` 
        : `^${year}${month}[0-9]{4}-[0-9]+$`
      
      const { data: invoices, error } = await supabase
        .from('invoices')
        .select('invoice_id')
        .like('invoice_id', `${prefix}%`)
        .order('invoice_id', { ascending: false })

      if (error) throw error

      if (!invoices || invoices.length === 0) {
        return 0 // 該当する番号がない場合は0を返す（次番号が1になる）
      }

      // クライアントサイドで正確にフィルタリング
      const filteredInvoices = invoices.filter(inv => {
        const parsed = parseDocumentNumber(inv.invoice_id)
        return parsed && 
               parsed.year === year && 
               parsed.month === month && 
               parsed.isEstimate === (type === 'estimate')
      })

      if (filteredInvoices.length === 0) {
        return 0
      }

      const lastNumber = filteredInvoices[0].invoice_id
      const parsed = parseDocumentNumber(lastNumber)
      return parsed?.sequence ?? 0
    } catch (error) {
      console.error('Error getting max sequence:', error)
      return 0
    }
  }
  
  // 作業辞書データの取得
  const {
    targetsArray: TARGETS,
    actionsArray: ACTIONS, 
    positionsArray: POSITIONS,
    targetActionsMap: TARGET_ACTIONS,
    actionPositionsMap: ACTION_POSITIONS,
    priceBookMap,
    loading: dictLoading,
    error: dictError,
  } = useWorkDictionary()
  
  // 基本情報の状態
  const [documentType, setDocumentType] = useState<'invoice' | 'estimate'>('invoice') // 請求書・見積書選択
  const [invoiceNumber, setInvoiceNumber] = useState('') // 請求書No
  const [invoiceYear, setInvoiceYear] = useState(new Date().getFullYear())
  const [invoiceMonth, setInvoiceMonth] = useState(new Date().getMonth() + 1)
  const [billingDate, setBillingDate] = useState(new Date().toISOString().split('T')[0])
  const [customerCategories, setCustomerCategories] = useState<CustomerCategory[]>([])
  const [customerCategory, setCustomerCategory] = useState('ud')
  const [customerName, setCustomerName] = useState('')
  const [subject, setSubject] = useState('')
  const [registrationNumber, setRegistrationNumber] = useState('')
  const [orderNumber, setOrderNumber] = useState('')
  const [internalOrderNumber, setInternalOrderNumber] = useState('')
  const [memo, setMemo] = useState('')
  
  // 作業項目の状態（明細として保存）
  const [workItems, setWorkItems] = useState<WorkItem[]>([])
  
  // prototype2準拠の個別作業入力状態
  const [target, setTarget] = useState('')
  const [actions, setActions] = useState<string[]>([]) // 最大3つまで選択可能
  const [position, setPosition] = useState<string | undefined>()
  const [workMemo, setWorkMemo] = useState('')
  const [unitPrice, setUnitPrice] = useState('')
  const [qty, setQty] = useState(1)
  
  // セット作業用状態
  const [setName, setSetName] = useState('')
  const [setPrice, setSetPrice] = useState('')
  const [setQuantity, setSetQuantity] = useState(1)
  const [setDetails, setSetDetails] = useState<Array<{action?: string, target?: string, position?: string, memo?: string, label: string, quantity?: number, unitPrice?: number}>>([])
  
  // セット明細入力用状態
  const [detailTarget, setDetailTarget] = useState('')
  const [detailAction, setDetailAction] = useState('') // 入力フィールド用の単一動作
  const [detailActions, setDetailActions] = useState<string[]>([]) // 最大3つまで選択可能
  const [detailPosition, setDetailPosition] = useState('')
  const [detailOther, setDetailOther] = useState('')
  const [detailQuantity, setDetailQuantity] = useState(1)
  const [isDetailTargetConfirmed, setIsDetailTargetConfirmed] = useState(false)
  
  // prototype2準拠のユーティリティ関数（複数動作対応）
  // 表示順: 位置、対象、動作、その他（その他の前は半角スペース）
  const composedLabel = (t?: string, a?: string[], p?: string, m?: string) => {
    const posText = p ? p : ''
    const targetText = t ?? ''
    const actionText = a && a.length > 0 ? a.join('・') : ''
    const memoText = m && m.trim() ? ` ${m.trim()}` : ''
    return `${posText}${targetText}${actionText}${memoText}`.trim()
  }
  
  const addStructured = () => {
    if (!target || actions.length === 0) return
    const label = composedLabel(target, actions, position, workMemo)
    const amount = Math.round((Number(unitPrice) || 0) * (qty || 0))
    
    const newId = Date.now()
    const newItem: WorkItem = {
      id: newId,
      type: 'individual',
      work_name: label,
      position: position,
      unit_price: Number(unitPrice) || 0,
      quantity: qty || 0,
      amount: amount,
      memo: workMemo
    }
    
    setWorkItems(prev => [newItem, ...prev])
    
    // リセット
    setTarget('')
    setActions([])
    setPosition(undefined)
    setWorkMemo('')
    setUnitPrice('')
    setQty(1)
    setIsTargetConfirmed(false)
    setShowTargetSuggestions(false)
  }
  
  const addSet = () => {
    if (!setName.trim()) return
    
    const newId = Date.now()
    const newItem: WorkItem = {
      id: newId,
      type: 'set',
      work_name: setName.trim(),
      unit_price: Number(setPrice) || 0,
      quantity: setQuantity || 0,
      amount: Math.round((Number(setPrice) || 0) * (setQuantity || 0)),
      memo: '',
      set_details: setDetails.map(d => d.label),
      detail_positions: setDetails.map(d => d.position || '')
    }
    
    setWorkItems(prev => [newItem, ...prev])
    
    // リセット
    setSetDetails([])
    setSetName('')
    setSetPrice('')
    setSetQuantity(1)
  }
  
  // 価格推定（最初の動作の価格を使用）
  const suggested = useMemo(() => {
    if (!actions[0] || !target || !priceBookMap) return null
    return priceBookMap[`${target}_${actions[0]}`] || null
  }, [actions, target, priceBookMap])
  
  React.useEffect(() => {
    if (suggested != null && (unitPrice === '' || unitPrice === '0' || Number(unitPrice) === 0 || Number.isNaN(Number(unitPrice)))) {
      setUnitPrice(suggested.toString())
    }
  }, [suggested, unitPrice])
  
  // 動作選択ハンドラー（最大3つまで選択可能）
  const handleActionSelect = (a: string) => {
    setActions(prev => {
      const isSelected = prev.includes(a)
      let newActions: string[]
      
      if (isSelected) {
        // 既に選択されている場合は削除
        newActions = prev.filter(action => action !== a)
      } else {
        // 新規選択の場合、最大3つまで追加
        if (prev.length < 3) {
          newActions = [...prev, a]
        } else {
          // 3つ目を置き換える
          newActions = [...prev.slice(0, 2), a]
        }
      }
      
      // 最初の動作の価格を単価に設定
      if (newActions.length > 0) {
        const price = priceBookMap?.[`${target}_${newActions[0]}`]
        if (price) setUnitPrice(price.toString())
      }
      
      return newActions
    })
  }
  
  // 位置選択ハンドラー
  const handlePositionSelect = (p: string) => {
    setSelectedPositions(prev => {
      const newSelected = prev.includes(p) 
        ? prev.filter(pos => pos !== p)
        : [...prev, p]
      
      const combined = combinePositions(newSelected)
      setPosition(combined)
      return newSelected
    })
  }
  
  // セット明細の動作選択ハンドラー（最大3つまで選択可能）
  const handleDetailActionSelect = (a: string) => {
    setDetailActions(prev => {
      const isSelected = prev.includes(a)
      let newActions: string[]
      
      if (isSelected) {
        // 既に選択されている場合は削除
        newActions = prev.filter(action => action !== a)
      } else {
        // 新規選択の場合、最大3つまで追加
        if (prev.length < 3) {
          newActions = [...prev, a]
        } else {
          // 3つ目を置き換える
          newActions = [...prev.slice(0, 2), a]
        }
      }
      
      return newActions
    })
  }
  
  // サジェスト関連状態（prototype2準拠）
  const [selectedPositions, setSelectedPositions] = useState<string[]>([])
  const [targetSuggestions, setTargetSuggestions] = useState<string[]>([])
  const [showTargetSuggestions, setShowTargetSuggestions] = useState(false)
  const [isTargetConfirmed, setIsTargetConfirmed] = useState(false)
  const [targetPage, setTargetPage] = useState(0)
  const [selectedTargetIndex, setSelectedTargetIndex] = useState(-1)
  
  // セット明細用サジェスト状態（個別作業と分離）
  const [detailTargetSuggestions, setDetailTargetSuggestions] = useState<string[]>([])
  const [showDetailTargetSuggestions, setShowDetailTargetSuggestions] = useState(false)
  const [selectedDetailTargetIndex, setSelectedDetailTargetIndex] = useState(-1)
  const [detailActionSuggestions, setDetailActionSuggestions] = useState<string[]>([])
  const [showDetailActionSuggestions, setShowDetailActionSuggestions] = useState(false)
  const [selectedDetailActionIndex, setSelectedDetailActionIndex] = useState(-1)
  const [detailPositionSuggestions, setDetailPositionSuggestions] = useState<string[]>([])
  const [showDetailPositionSuggestions, setShowDetailPositionSuggestions] = useState(false)
  const [selectedDetailPositionIndex, setSelectedDetailPositionIndex] = useState(-1)
  const TARGETS_PER_PAGE = 200
  const totalTargetPages = useMemo(() => Math.max(1, Math.ceil((TARGETS?.length || 0) / TARGETS_PER_PAGE)), [TARGETS])
  
  // 詳細位置選択関連の状態（明細表示用）
  const [selectedDetailPositions, setSelectedDetailPositions] = useState<{ [key: number]: { [detailIndex: number]: string[] } }>({})
  
  // サジェスト関連の状態
  const [customerSuggestions, setCustomerSuggestions] = useState<string[]>([])
  const [workSuggestions, setWorkSuggestions] = useState<{ [key: number]: string[] }>({})
  const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false)
  const [showWorkSuggestions, setShowWorkSuggestions] = useState<{ [key: number]: boolean }>({})
  
  // 件名・登録番号サジェスト関連の状態
  const [subjectSuggestions, setSubjectSuggestions] = useState<any[]>([])
  const [showSubjectSuggestions, setShowSubjectSuggestions] = useState(false)
  const [registrationSuggestions, setRegistrationSuggestions] = useState<any[]>([])
  const [showRegistrationSuggestions, setShowRegistrationSuggestions] = useState(false)
  const [selectedSubjectIndex, setSelectedSubjectIndex] = useState(-1)
  const [selectedRegistrationIndex, setSelectedRegistrationIndex] = useState(-1)
  const [allSubjects, setAllSubjects] = useState<any[]>([])
  const [allRegistrations, setAllRegistrations] = useState<any[]>([])

  // スクロール連動用のrefs
  const subjectSuggestionsRef = useRef<HTMLDivElement>(null)
  const registrationSuggestionsRef = useRef<HTMLDivElement>(null)

  // 件名サジェストのスクロール連動
  useEffect(() => {
    if (selectedSubjectIndex >= 0 && subjectSuggestionsRef.current) {
      const container = subjectSuggestionsRef.current
      const selectedElement = container.children[selectedSubjectIndex] as HTMLElement
      if (selectedElement) {
        const containerTop = container.scrollTop
        const containerBottom = containerTop + container.clientHeight
        const elementTop = selectedElement.offsetTop
        const elementBottom = elementTop + selectedElement.offsetHeight
        
        if (elementTop < containerTop) {
          container.scrollTop = elementTop
        } else if (elementBottom > containerBottom) {
          container.scrollTop = elementBottom - container.clientHeight
        }
      }
    }
  }, [selectedSubjectIndex])

  // 登録番号サジェストのスクロール連動
  useEffect(() => {
    if (selectedRegistrationIndex >= 0 && registrationSuggestionsRef.current) {
      const container = registrationSuggestionsRef.current
      const selectedElement = container.children[selectedRegistrationIndex] as HTMLElement
      if (selectedElement) {
        const containerTop = container.scrollTop
        const containerBottom = containerTop + container.clientHeight
        const elementTop = selectedElement.offsetTop
        const elementBottom = elementTop + selectedElement.offsetHeight
        
        if (elementTop < containerTop) {
          container.scrollTop = elementTop
        } else if (elementBottom > containerBottom) {
          container.scrollTop = elementBottom - container.clientHeight
        }
      }
    }
  }, [selectedRegistrationIndex])

  // あいまい検索用の正規化関数
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase() // 大文字小文字統一
      .replace(/[ァ-ヶ]/g, (match) => String.fromCharCode(match.charCodeAt(0) - 0x60)) // カタカナ→ひらがな
      .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (match) => String.fromCharCode(match.charCodeAt(0) - 0xFEE0)) // 全角→半角
  }

  // Supabaseから件名マスタデータを取得
  const fetchSubjectMasterData = async () => {
    try {
      const { data, error } = await supabase
        .from('subject_master')
        .select('id, subject_name, subject_name_kana')
        .order('subject_name')
      
      if (error) {
        console.error('件名マスタ取得エラー:', error)
        return
      }
      
      // // console.log('件名マスタデータ取得成功:', data?.length, '件')
      setAllSubjects(data || [])
    } catch (error) {
      console.error('件名マスタ取得エラー:', error)
    }
  }

  // 件名検索機能（曖昧検索対応）
  const searchSubjects = (query: string) => {
    if (!query.trim()) {
      return []
    }

    const normalizedQuery = fuzzyMatch.bind(null, '', query)
    
    return allSubjects
      .filter(subject => fuzzyMatch(subject.subject_name, query))
      .slice(0, 30) // 30件に制限
  }


  // 件名選択時の登録番号絞り込み機能
  const handleSubjectSelection = async (selectedSubjectName: string) => {
    try {
      console.log('=== 件名選択時の登録番号絞り込み開始 ===')
      console.log('選択された件名:', selectedSubjectName)
      
      // まず件名マスタから件名IDを取得
      const { data: subjectData, error: subjectError } = await supabase
        .from('subject_master')
        .select('id')
        .eq('subject_name', selectedSubjectName)
        .single()
      
      if (subjectError || !subjectData) {
        // // console.log('件名マスタで該当件名が見つからない:', selectedSubjectName)
        return
      }
      
      console.log('件名ID取得成功:', subjectData.id)
      
      // 件名IDに基づいて関連する登録番号を検索
      const { data: relations, error: relationsError } = await supabase
        .from('subject_registration_numbers')
        .select(`
          registration_number_master(registration_number),
          usage_count,
          is_primary
        `)
        .eq('subject_id', subjectData.id)
        .order('usage_count', { ascending: false })
        .limit(30)
      
      console.log('関連登録番号クエリ結果:', relations)
      
      if (relationsError) {
        console.error('関連登録番号取得エラー:', relationsError)
        return
      }
      
      if (relations && relations.length > 0) {
        const relatedRegistrations = relations.map((rel, index) => ({
          id: `subject-related-${index}`,
          registrationNumber: rel.registration_number_master?.registration_number,
          usage_count: rel.usage_count,
          is_primary: rel.is_primary
        }))
        
        console.log('登録番号データ変換結果:', relatedRegistrations)
        
        // プライマリの登録番号があれば最初に表示、なければ使用頻度順
        const sortedRegistrations = relatedRegistrations.sort((a, b) => {
          if (a.is_primary && !b.is_primary) return -1
          if (!a.is_primary && b.is_primary) return 1
          return b.usage_count - a.usage_count
        })
        
        console.log('ソート後の登録番号リスト:', sortedRegistrations)
        
        // デフォルトでは登録番号を自動設定しない（誤入力防止のため）
        // ユーザーがクリックして選択する方式に変更
        // // console.log('プライマリ登録番号:', sortedRegistrations[0]?.registrationNumber)
        // setRegistrationNumber(sortedRegistrations[0].registrationNumber) // 自動設定を無効化
        setRegistrationSuggestions(sortedRegistrations)
      } else {
        // // console.log('該当する登録番号が見つからなかった')
        setRegistrationSuggestions([])
      }
    } catch (error) {
      console.error('関連登録番号取得エラー:', error)
    }
  }
  
  // クライアントサイドでDBを初期化
  useEffect(() => {
    setDb(new WorkHistoryDB())
    const catDb = new CustomerCategoryDB()
    setCategoryDb(catDb)
    const categories = catDb.getCategories()
    setCustomerCategories(categories)
    
    // 件名・登録番号マスターDB初期化
    const subjectDatabase = new SubjectMasterDB()
    const registrationDatabase = new RegistrationMasterDB()
    
    // デバッグ: 件名マスターDBの状態を確認
    // // console.log('=== 件名マスターDB状態確認 ===')
    // // console.log('件名マスター件数:', subjectDatabase.getSubjects().length)
    // // console.log('件名マスターデータ:', subjectDatabase.getSubjects().slice(0, 10)) // 最初の10件を表示
    // // console.log('LocalStorage件名キー:', 'bankin_subject_master')
    if (typeof window !== 'undefined') {
      const rawData = localStorage.getItem('bankin_subject_master')
      // // console.log('LocalStorage生データ:', rawData ? rawData.substring(0, 200) + '...' : 'null')
    }
    
    // // console.log('=== 登録番号マスターDB状態確認 ===')
    // // console.log('登録番号マスター件数:', registrationDatabase.searchRegistrations('').length)
    // // console.log('登録番号マスターデータ:', registrationDatabase.searchRegistrations('').slice(0, 5))
    
    setSubjectDb(subjectDatabase)
    setRegistrationDb(registrationDatabase)
    
    // Supabaseから件名マスタデータを取得
    fetchSubjectMasterData()
    
    // 初期選択したカテゴリーの会社名を設定
    const initialCategory = catDb.getCategoryById('ud')
    if (initialCategory && initialCategory.companyName) {
      setCustomerName(initialCategory.companyName)
    }

    // 初期番号生成
    const initializeDocumentNumber = async () => {
      try {
        const newNumber = await generateDocumentNumber('invoice', getMaxSequence)
        setInvoiceNumber(newNumber)
      } catch (error) {
        console.error('Error generating initial document number:', error)
      }
    }
    initializeDocumentNumber()
  }, [])

  // documentType変更時に新しい番号を生成（新規作成モードのみ）
  useEffect(() => {
    const generateNewNumber = async () => {
      try {
        const newNumber = await generateDocumentNumber(documentType, getMaxSequence)
        setInvoiceNumber(newNumber)
      } catch (error) {
        console.error('Error generating document number:', error)
      }
    }
    // 新規作成モードかつ編集中のデータ読み込み完了後のみ実行
    if (!isEditMode && !editInvoiceId) {
      generateNewNumber()
    }
  }, [documentType, isEditMode, editInvoiceId])

  // 編集モード時の初期データ読み込み
  useEffect(() => {
    if (isEditMode && editInvoiceId) {
      const loadInvoiceForEdit = async () => {
        try {
          // // console.log('Loading invoice for edit:', editInvoiceId)
          
          // 請求書基本データを取得
          const { data: invoiceData, error: invoiceError } = await supabase
            .from('invoices')
            .select('*')
            .eq('invoice_id', editInvoiceId)
            .single()

          if (invoiceError) throw invoiceError
          if (!invoiceData) throw new Error('請求書が見つかりません')

          // 下書きのみ編集可能
          if (invoiceData.status !== 'draft') {
            alert('下書きの請求書のみ編集できます')
            router.push('/invoice-list')
            return
          }

          // 基本情報をセット
          setInvoiceNumber(invoiceData.invoice_id)
          
          // 請求書IDから文書タイプを判定（Mがあれば見積書、なければ請求書）
          const docType = invoiceData.invoice_id.includes('M') ? 'estimate' : 'invoice'
          setDocumentType(docType)
          const billingDate = invoiceData.billing_date || invoiceData.issue_date
          if (billingDate) {
            setBillingDate(billingDate.split('T')[0])
            const date = new Date(billingDate)
            setInvoiceYear(date.getFullYear())
            setInvoiceMonth(date.getMonth() + 1)
          }
          
          setCustomerCategory(invoiceData.customer_category === 'UD' ? 'ud' : 'other')
          setCustomerName(invoiceData.customer_name || '')
          setSubject(invoiceData.subject_name || '')
          setRegistrationNumber(invoiceData.registration_number || '')
          setOrderNumber(invoiceData.order_number || '')
          setInternalOrderNumber(invoiceData.purchase_order_number || '')
          setMemo(invoiceData.remarks || '')

          // 明細データを取得
          const { data: lineItems, error: lineError } = await supabase
            .from('invoice_line_items')
            .select('*')
            .eq('invoice_id', editInvoiceId)
            .order('line_no', { ascending: true })

          if (lineError) throw lineError

          // 明細データを作業項目に変換
          if (lineItems && lineItems.length > 0) {
            const items: WorkItem[] = lineItems.map((item, index) => {
              const isSetWork = item.task_type === 'S' || item.task_type === 'set'
              return {
                id: index + 1,
                type: isSetWork ? 'set' : 'individual',
                work_name: isSetWork ? item.target || item.raw_label || '' : `${item.target || ''}${item.action || ''}${item.position ? ` (${item.position})` : ''}`,
                position: item.position || '',
                unit_price: Number(item.unit_price || 0),
                quantity: Number(item.quantity || 1),
                amount: Number(item.amount || 0),
                memo: item.raw_label || '',
                set_details: isSetWork && item.raw_label ? item.raw_label.split(/[,、，]/).map(s => s.trim()).filter(s => s.length > 0) : [],
                detail_positions: []
              }
            })
            setWorkItems(items)
          }

          // // console.log('Invoice loaded successfully for editing')
        } catch (error) {
          console.error('Error loading invoice for edit:', error)
          alert('請求書の読み込みに失敗しました: ' + (error as Error).message)
        }
      }

      loadInvoiceForEdit()
    }
  }, [isEditMode, editInvoiceId, router])

  // 年月調整関数
  const adjustMonth = (delta: number) => {
    const currentDate = new Date(invoiceYear, invoiceMonth - 1)
    currentDate.setMonth(currentDate.getMonth() + delta)
    setInvoiceYear(currentDate.getFullYear())
    setInvoiceMonth(currentDate.getMonth() + 1)
  }

  // 日付調整関数
  const adjustBillingDate = (delta: number) => {
    const currentDate = new Date(billingDate)
    currentDate.setDate(currentDate.getDate() + delta)
    setBillingDate(currentDate.toISOString().split('T')[0])
  }

  // 今日の日付にセット
  const setBillingDateToday = () => {
    setBillingDate(new Date().toISOString().split('T')[0])
  }
  
  // 計算結果
  const subtotal = useMemo(() => {
    return workItems.reduce((sum, item) => sum + item.amount, 0)
  }, [workItems])
  
  const taxAmount = useMemo(() => {
    return Math.floor(subtotal * 0.1)
  }, [subtotal])
  
  const totalAmount = useMemo(() => {
    return subtotal + taxAmount
  }, [subtotal, taxAmount])

  // 顧客カテゴリー変更処理
  const handleCustomerCategoryChange = (categoryId: string) => {
    setCustomerCategory(categoryId)
    
    if (!categoryDb) return
    
    const category = categoryDb.getCategoryById(categoryId)
    if (category) {
      if (category.companyName) {
        // カテゴリーに会社名が設定されている場合、顧客名のみ自動入力
        setCustomerName(category.companyName)
        // 件名はクリア（手動入力）
        setSubject('')
      } else {
        // 「その他」の場合、手動入力
        setCustomerName('')
        setSubject('')
      }
    }
  }

  // 顧客名変更処理（「その他」の場合のみ件名への自動コピー機能付き）
  const handleCustomerNameChange = (value: string, autoUpdateSubject: boolean = true) => {
    setCustomerName(value)
    
    // 「その他」カテゴリーの場合のみ、顧客名を件名に自動コピー
    if (autoUpdateSubject && value.trim() && customerCategory === 'other') {
      setSubject(value)
    }
    
    if (db && value.trim()) {
      const suggestions = db.getCustomerSuggestions(value)
      setCustomerSuggestions(suggestions)
      setShowCustomerSuggestions(suggestions.length > 0)
    } else {
      setShowCustomerSuggestions(false)
    }
  }

  // 作業名サジェスト
  const handleWorkNameChange = (id: number, value: string) => {
    setWorkItems(prev => prev.map(item => 
      item.id === id ? { ...item, work_name: value } : item
    ))
    
    if (db && value.trim()) {
      const suggestions = db.getWorkSuggestions(value)
      setWorkSuggestions(prev => ({ ...prev, [id]: suggestions }))
      setShowWorkSuggestions(prev => ({ ...prev, [id]: suggestions.length > 0 }))
    } else {
      setShowWorkSuggestions(prev => ({ ...prev, [id]: false }))
    }
  }

  // 作業名選択時の価格自動設定
  const handleWorkNameSelect = (id: number, workName: string) => {
    if (!db) return
    
    const price = db.getPriceByWork(workName)
    setWorkItems(prev => prev.map(item => 
      item.id === id ? { 
        ...item, 
        work_name: workName,
        unit_price: price || item.unit_price,
        amount: (price || item.unit_price) * item.quantity
      } : item
    ))
    setShowWorkSuggestions(prev => ({ ...prev, [id]: false }))
  }

  // 単価変更
  const handleUnitPriceChange = (id: number, price: number) => {
    setWorkItems(prev => prev.map(item => 
      item.id === id ? { 
        ...item, 
        unit_price: price,
        amount: price * item.quantity
      } : item
    ))
  }

  // 数量変更
  const handleQuantityChange = (id: number, quantity: number) => {
    const validQuantity = Math.max(1, quantity)
    setWorkItems(prev => prev.map(item => 
      item.id === id ? { 
        ...item, 
        quantity: validQuantity,
        amount: item.unit_price * validQuantity
      } : item
    ))
  }

  // 作業項目追加
  const addWorkItem = (type: 'individual' | 'set' = 'individual') => {
    const newId = Math.max(...workItems.map(item => item.id)) + 1
    setWorkItems(prev => [...prev, {
      id: newId,
      type: type,
      work_name: '',
      position: '',
      unit_price: 0,
      quantity: 1,
      amount: 0,
      memo: '',
      set_details: type === 'set' ? [''] : [],
      detail_positions: []
    }])
    // 新しい作業項目の位置選択状態を初期化
    setSelectedPositions([])
    setSelectedDetailPositions(prev => ({ ...prev, [newId]: {} }))
  }

  // 作業項目削除
  const removeWorkItem = (id: number) => {
    if (workItems.length > 1) {
      setWorkItems(prev => prev.filter(item => item.id !== id))
      // サジェスト状態もクリア
      setShowWorkSuggestions(prev => {
        const newState = { ...prev }
        delete newState[id]
        return newState
      })
      setWorkSuggestions(prev => {
        const newState = { ...prev }
        delete newState[id]
        return newState
      })
    }
  }

  // メモ変更
  const handleMemoChange = (id: number, memo: string) => {
    setWorkItems(prev => prev.map(item => 
      item.id === id ? { ...item, memo } : item
    ))
  }

  // 作業種別変更
  const handleTypeChange = (id: number, type: 'individual' | 'set') => {
    setWorkItems(prev => prev.map(item => 
      item.id === id ? { 
        ...item, 
        type: type,
        set_details: type === 'set' ? (item.set_details || ['']) : []
      } : item
    ))
  }

  // セット詳細追加（新規セット作成時）
  const addSetDetail = () => {
    if (!detailTarget.trim() || detailActions.length === 0) return
    
    const label = composedLabel(detailTarget, detailActions, detailPosition, detailOther)
    
    // 単価を取得（最初の動作の価格を使用）
    const priceKey = `${detailTarget}_${detailActions[0]}`
    const unitPrice = priceBookMap?.[priceKey] || 0
    
    const newDetail = {
      target: detailTarget,
      action: detailActions.join('・'), // 複数動作を結合
      position: detailPosition,
      memo: detailOther,
      label: label,
      quantity: detailQuantity,
      unitPrice: unitPrice
    }
    
    setSetDetails(prev => [...prev, newDetail])
    
    // セット価格を明細価格の合計で自動更新
    const newTotalPrice = [...setDetails, newDetail].reduce((sum, detail) => sum + (detail.unitPrice || 0), 0)
    if (newTotalPrice > 0) {
      setSetPrice(newTotalPrice.toString())
    }
    
    // リセット
    setDetailTarget('')
    setDetailActions([])
    setDetailPosition('')
    setDetailOther('')
    setDetailQuantity(1)
    setIsDetailTargetConfirmed(false)
  }

  // セット詳細追加（既存セット編集時）
  const addSetDetailToItem = (itemId: number) => {
    setWorkItems(prev => prev.map(item => 
      item.id === itemId && item.type === 'set' ? {
        ...item,
        set_details: [...(item.set_details || []), '']
      } : item
    ))
  }

  // セット詳細削除
  const removeSetDetail = (itemId: number, detailIndex: number) => {
    setWorkItems(prev => prev.map(item => 
      item.id === itemId && item.type === 'set' ? {
        ...item,
        set_details: (item.set_details || []).filter((_, index) => index !== detailIndex)
      } : item
    ))
  }

  // セット詳細変更
  const handleSetDetailChange = (itemId: number, detailIndex: number, value: string) => {
    setWorkItems(prev => prev.map(item => 
      item.id === itemId && item.type === 'set' ? {
        ...item,
        set_details: (item.set_details || []).map((detail, index) => 
          index === detailIndex ? value : detail
        )
      } : item
    ))
  }
  
  // セット詳細位置選択ハンドラー
  const handleDetailPositionSelect = (itemId: number, detailIndex: number, position: string) => {
    setSelectedDetailPositions(prev => {
      const itemDetails = prev[itemId] || {};
      const detailPositions = itemDetails[detailIndex] || [];
      const newSelected = detailPositions.includes(position)
        ? detailPositions.filter(p => p !== position)
        : [...detailPositions, position];
      
      const combined = combinePositions(newSelected);
      
      setWorkItems(prevItems => prevItems.map(item => {
        if (item.id === itemId && item.type === 'set') {
          const updatedDetailPositions = [...(item.detail_positions || [])];
          updatedDetailPositions[detailIndex] = combined;
          return { ...item, detail_positions: updatedDetailPositions };
        }
        return item;
      }));
      
      return { 
        ...prev, 
        [itemId]: { ...itemDetails, [detailIndex]: newSelected }
      };
    });
  } // ← handleDetailPositionSelect関数終了

  // handleSave関数定義（InvoiceCreateContent関数内部）
  const handleSave = async (isDraft: boolean = true) => {
    // 見積書の場合のメッセージ調整
    const docTypeName = documentType === 'estimate' ? '見積書' : '請求書'
    
    // 基本情報バリデーション
    if (!billingDate) {
      alert('請求日を入力してください')
      return
    }
    
    if (!customerName.trim()) {
      alert('顧客名を入力してください')
      return
    }
    
    if (!subject.trim()) {
      alert('件名を入力してください')
      return
    }

    // 作業項目バリデーション
    if (workItems.length === 0) {
      alert('作業項目を追加してください')
      return
    }
    
    if (workItems.some(item => !item.work_name.trim())) {
      alert('すべての作業名を入力してください')
      return
    }

    if (workItems.some(item => item.unit_price <= 0)) {
      alert('すべての単価を正しく入力してください（0より大きい値）')
      return
    }

    if (workItems.some(item => item.quantity < 1)) {
      alert('すべての数量を正しく入力してください（1以上の値）')
      return
    }

    // セット作業の詳細チェック
    for (const item of workItems) {
      if (item.type === 'set') {
        if (!item.set_details || item.set_details.length === 0 || item.set_details.some(detail => !detail.trim())) {
          alert('セット作業の詳細をすべて入力してください')
          return
        }
      }
    }

    const invoiceData: InvoiceData = {
      invoice_year: invoiceYear,
      invoice_month: invoiceMonth,
      billing_date: billingDate,
      customer_category: customerCategory,
      customer_name: customerName,
      subject: subject,
      registration_number: registrationNumber,
      order_number: orderNumber,
      internal_order_number: internalOrderNumber,
      work_items: workItems,
      subtotal: subtotal,
      tax_amount: taxAmount,
      total_amount: totalAmount,
      memo: memo
    }

    try {
      // Supabaseに保存
      const invoiceRecord = {
        invoice_id: invoiceNumber,
        invoice_number: invoiceNumber,
        issue_date: new Date().toISOString().split('T')[0],
        billing_date: billingDate,
        billing_month: `${invoiceYear}-${String(invoiceMonth).padStart(2, '0')}`,
        customer_category: customerCategory === 'ud' ? 'UD' : 'その他',
        customer_name: customerName,
        subject_name: subject,
        subject: subject,
        registration_number: registrationNumber || null,
        order_number: orderNumber || null,
        purchase_order_number: internalOrderNumber || null,
        subtotal: subtotal,
        tax: taxAmount,
        total_amount: totalAmount,
        status: isDraft ? 'draft' : 'finalized',
        payment_status: 'unpaid',
        remarks: memo || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      if (isEditMode) {
        // 編集モード: 既存レコードを更新
        const { data: invoiceData, error: invoiceError } = await supabase
          .from('invoices')
          .update({
            ...invoiceRecord,
            updated_at: new Date().toISOString()
          })
          .eq('invoice_id', invoiceNumber)
          .select()

        if (invoiceError) {
          throw invoiceError
        }

        // 既存の明細を削除してから新しい明細を追加
        const { error: deleteError } = await supabase
          .from('invoice_line_items')
          .delete()
          .eq('invoice_id', invoiceNumber)

        if (deleteError) {
          throw deleteError
        }
      } else {
        // 新規作成モード
        const { data: invoiceData, error: invoiceError } = await supabase
          .from('invoices')
          .insert(invoiceRecord)
          .select()

        if (invoiceError) {
          throw invoiceError
        }
      }

      // 明細データを保存
      if (workItems.length > 0) {
        const lineItems = workItems.map((item, index) => ({
          invoice_id: invoiceNumber,
          line_no: index + 1,
          task_type: item.type === 'set' ? 'S' : 'T',
          target: item.work_name, // 作業名を target として保存
          action: null,
          position: null,
          raw_label: item.type === 'set' ? item.set_details?.join(', ') || item.work_name : item.work_name,
          unit_price: item.unit_price,
          quantity: item.quantity,
          amount: item.unit_price * item.quantity,
          performed_at: billingDate
        }))

        const { error: lineItemsError } = await supabase
          .from('invoice_line_items')
          .insert(lineItems)

        if (lineItemsError) {
          throw lineItemsError
        }
      }

      alert(isDraft ? `${docTypeName}を下書き保存しました` : `${docTypeName}を確定保存しました`)
      router.push('/invoice-list')
    } catch (error) {
      alert('保存に失敗しました: ' + (error instanceof Error ? error.message : 'Unknown error'))
      console.error('Save error:', error)
    }
  } // handleSave関数終了 - InvoiceCreateContent関数は継続中

  // === JSXレンダリング部分（InvoiceCreateContent関数内） ===
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1>請求書作成（修復中）</h1>
      <p>現在構文エラーを修復しています...</p>
    </div>
  )
  
  // 以下は一時的にコメントアウト
  // 完全なJSXコードは後で復元予定
}

export default function InvoiceCreatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-center"><p className="text-lg text-gray-600">請求書作成画面を読み込み中...</p></div></div>}>
      <InvoiceCreateContent />
    </Suspense>
  )
}
