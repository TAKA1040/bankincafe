'use client'

import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Plus, Trash2, Save, Search, Calculator, Home, AlertCircle, HelpCircle } from 'lucide-react'
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

function CardHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`border-b border-gray-200 px-4 py-3 ${className}`}>{children}</div>
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

// ヘルプツールチップコンポーネント
function HelpTooltip({ text }: { text: string }) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="relative inline-block ml-1">
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="text-gray-400 hover:text-blue-500 focus:outline-none"
      >
        <HelpCircle size={16} />
      </button>
      {isVisible && (
        <div className="absolute z-50 w-64 p-3 text-sm bg-gray-800 text-white rounded-lg shadow-lg -left-28 top-6">
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 border-8 border-transparent border-b-gray-800"></div>
          {text}
        </div>
      )}
    </div>
  )
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
  work_name: string  // 組み立てラベル（表示用）
  // DB保存用フィールド
  target?: string           // 対象
  actions?: string[]        // 動作（最大3つ）
  positions?: string[]      // 位置（最大5つ）
  other?: string            // その他
  // 金額関連
  unit_price: number
  quantity: number
  amount: number
  memo: string
  // セット作業用
  set_details?: string[]    // セット明細のラベル配列
  set_detail_items?: Array<{  // セット明細の詳細情報
    target?: string
    actions?: string[]
    positions?: string[]
    other?: string
    label: string
  }>
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

// その他顧客マスターDBクラス（件名・登録番号と同じ構造）
class OtherCustomerMasterDB {
  private readonly STORAGE_KEY = 'bankin_other_customer_master'

  getCustomers() {
    try {
      if (typeof window === 'undefined') return []
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  searchCustomers(keyword: string) {
    if (!keyword.trim()) return this.getCustomers()
    const normalizedKeyword = keyword.toLowerCase()
    return this.getCustomers()
      .filter((customer: any) =>
        customer.customerName.toLowerCase().includes(normalizedKeyword)
      )
      .sort((a: any, b: any) => b.usageCount - a.usageCount)
      .slice(0, 8)
  }

  autoRegisterCustomer(customerName: string) {
    const customers = this.getCustomers()
    const existing = customers.find((cust: any) =>
      cust.customerName.toLowerCase() === customerName.toLowerCase()
    )

    if (existing) {
      const updated = customers.map((cust: any) =>
        cust.id === existing.id
          ? { ...cust, usageCount: cust.usageCount + 1, lastUsedAt: new Date().toISOString().split('T')[0] }
          : cust
      )
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated))
    } else {
      const newCustomer = {
        id: Date.now().toString(),
        customerName: customerName,
        usageCount: 1,
        lastUsedAt: new Date().toISOString().split('T')[0]
      }
      customers.push(newCustomer)
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(customers))
    }
  }
}

// 対象マスターDBクラス（件名と同じ構造）
class TargetMasterDB {
  private readonly STORAGE_KEY = 'bankin_target_master'

  getTargets() {
    try {
      if (typeof window === 'undefined') return []
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  searchTargets(keyword: string) {
    if (!keyword.trim()) return this.getTargets()
    const normalizedKeyword = keyword.toLowerCase()
    return this.getTargets()
      .filter((target: any) =>
        target.targetName.toLowerCase().includes(normalizedKeyword)
      )
      .sort((a: any, b: any) => b.usageCount - a.usageCount)
      .slice(0, 10)
  }

  autoRegisterTarget(targetName: string) {
    const targets = this.getTargets()
    const existing = targets.find((t: any) =>
      t.targetName.toLowerCase() === targetName.toLowerCase()
    )

    if (existing) {
      const updated = targets.map((t: any) =>
        t.id === existing.id
          ? { ...t, usageCount: t.usageCount + 1, lastUsedAt: new Date().toISOString().split('T')[0] }
          : t
      )
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated))
    } else {
      const newTarget = {
        id: Date.now().toString(),
        targetName: targetName,
        usageCount: 1,
        lastUsedAt: new Date().toISOString().split('T')[0]
      }
      targets.push(newTarget)
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(targets))
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

function InvoiceCreateContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editInvoiceId = searchParams?.get('edit')
  const deleteInvoiceId = searchParams?.get('delete')
  const isRevisionMode = searchParams?.get('revision') === 'true'
  const isRedInvoiceMode = searchParams?.get('red') === 'true'
  const isEditMode = !!editInvoiceId
  const isDeleteMode = !!deleteInvoiceId

  // 元の請求書情報（修正・赤伝用）
  const [originalInvoice, setOriginalInvoice] = useState<any>(null)

  const [db, setDb] = useState<WorkHistoryDB | null>(null)
  const [categoryDb, setCategoryDb] = useState<CustomerCategoryDB | null>(null)
  const [subjectDb, setSubjectDb] = useState<SubjectMasterDB | null>(null)
  const [registrationDb, setRegistrationDb] = useState<RegistrationMasterDB | null>(null)
  const [otherCustomerDb, setOtherCustomerDb] = useState<OtherCustomerMasterDB | null>(null)
  const [targetMasterDb, setTargetMasterDb] = useState<TargetMasterDB | null>(null)

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
  const [dateWarningDialog, setDateWarningDialog] = useState<{
    show: boolean
    message: string
    onConfirm: () => void
  }>({ show: false, message: '', onConfirm: () => {} })
  const [billingDate, setBillingDate] = useState(new Date().toISOString().split('T')[0])
  const [customerCategories, setCustomerCategories] = useState<CustomerCategory[]>([])
  const [customerCategory, setCustomerCategory] = useState('ud')
  const [customerName, setCustomerName] = useState('')
  const [subject, setSubject] = useState('')
  const [registrationNumber, setRegistrationNumber] = useState('')
  const [orderNumber, setOrderNumber] = useState('')
  const [internalOrderNumber, setInternalOrderNumber] = useState('')
  const [memo, setMemo] = useState('')

  // 作業価格検索モーダルの状態
  const [showPriceSearchModal, setShowPriceSearchModal] = useState(false)
  const [priceSearchKeyword, setPriceSearchKeyword] = useState('')
  const [priceSearchSubject, setPriceSearchSubject] = useState('')
  const [priceSearchResults, setPriceSearchResults] = useState<Array<{
    id: number
    work_name: string
    raw_label_part: string | null  // セット明細用
    unit_price: number
    quantity: number
    subject: string | null
    customer_name: string | null
    issue_date: string | null
    invoice_id: string
    task_type: string | null
    line_no: number
    set_details?: string[]  // セット明細のraw_label_part配列
  }>>([])
  const [priceSearchLoading, setPriceSearchLoading] = useState(false)

  // 価格検索の詳細表示用state
  const [selectedPriceInvoice, setSelectedPriceInvoice] = useState<{
    invoice_id: string
    customer_name: string | null
    subject: string | null
    issue_date: string | null
    line_items: Array<{
      line_no: number
      sub_no: number
      raw_label: string
      raw_label_part: string | null  // セット明細用
      unit_price: number
      quantity: number
      amount: number
      task_type: string | null
      set_name: string | null
      is_set_detail: boolean  // セット明細行かどうか
    }>
  } | null>(null)
  const [priceDetailLoading, setPriceDetailLoading] = useState(false)

  // 作業項目の状態（明細として保存）
  const [workItems, setWorkItems] = useState<WorkItem[]>([])
  
  // prototype2準拠の個別作業入力状態
  const [target, setTarget] = useState('')
  const [action, setAction] = useState<string | undefined>()
  const [actions, setActions] = useState<string[]>([]) // 複数動作選択用（最大3つ）
  const [position, setPosition] = useState<string | undefined>()
  const [positions, setPositions] = useState<string[]>([]) // 複数位置選択用（最大5つ）
  const [workMemo, setWorkMemo] = useState('')
  const [unitPrice, setUnitPrice] = useState('')
  const [qty, setQty] = useState(1)
  
  // セット作業用状態
  const [setName, setSetName] = useState('')
  const [setPrice, setSetPrice] = useState('')
  const [setQuantity, setSetQuantity] = useState(1)
  const [setDetails, setSetDetails] = useState<Array<{action?: string, actions?: string[], target?: string, position?: string, positions?: string[], memo?: string, other?: string, label: string, quantity?: number, unitPrice?: number}>>([])
  
  // セット明細入力用状態
  const [detailTarget, setDetailTarget] = useState('')
  const [detailAction, setDetailAction] = useState('')
  const [detailActions, setDetailActions] = useState<string[]>([]) // 複数動作選択用（最大3つ）
  const [detailPosition, setDetailPosition] = useState('')
  const [detailPositions, setDetailPositions] = useState<string[]>([]) // 複数位置選択用（最大5つ）
  const [detailOther, setDetailOther] = useState('')
  const [detailQuantity, setDetailQuantity] = useState(1)
  
  // prototype2準拠のユーティリティ関数
  const composedLabel = (t?: string, a?: string[], p?: string[], m?: string) => {
    const position = p && p.length > 0 ? p.join('') : ''
    const target = t ?? ''
    const action = a && a.length > 0 ? a.join('・') : ''
    const memoText = m && m.trim() ? ` ${m.trim()}` : ''
    return `${position}${target}${action}${memoText}`.trim()
  }
  
  const addStructured = () => {
    if (!target) return
    const label = composedLabel(target, actions, positions, workMemo)
    const amount = Math.round((Number(unitPrice) || 0) * (qty || 0))

    const newId = Date.now()
    const newItem: WorkItem = {
      id: newId,
      type: 'individual',
      work_name: label,
      // DB保存用フィールド
      target: target,
      actions: actions.slice(0, 3),      // 最大3つ
      positions: positions.slice(0, 5),  // 最大5つ
      other: workMemo || undefined,
      // 金額
      unit_price: Number(unitPrice) || 0,
      quantity: qty || 0,
      amount: amount,
      memo: workMemo
    }

    setWorkItems(prev => [newItem, ...prev])

    // リセット
    setTarget('')
    setAction(undefined)
    setActions([])
    setPosition(undefined)
    setPositions([])
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
      // セット明細の詳細情報（DB保存用）
      set_detail_items: setDetails.map(d => ({
        target: d.target,
        actions: d.actions?.slice(0, 3) || (d.action ? [d.action] : []),
        positions: d.positions?.slice(0, 5) || (d.position ? [d.position] : []),
        other: d.other || d.memo,
        label: d.label
      })),
      detail_positions: setDetails.map(d => d.position || '')
    }

    setWorkItems(prev => [newItem, ...prev])

    // リセット
    setSetDetails([])
    setSetName('')
    setSetPrice('')
    setSetQuantity(1)
  }
  
  // 価格推定
  const suggested = useMemo(() => {
    if (!action || !target || !priceBookMap) return null
    return priceBookMap[`${target}_${action}`] || null
  }, [action, target, priceBookMap])
  
  React.useEffect(() => {
    if (suggested != null && (unitPrice === '' || unitPrice === '0' || Number(unitPrice) === 0 || Number.isNaN(Number(unitPrice)))) {
      setUnitPrice(suggested.toString())
    }
  }, [suggested, unitPrice])
  
  // 動作選択ハンドラー
  const handleActionSelect = (a: string) => {
    setAction(a)
    const price = priceBookMap?.[`${target}_${a}`]
    if (price) setUnitPrice(price.toString())
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
  
  // サジェスト関連状態（prototype2準拠）
  const [selectedPositions, setSelectedPositions] = useState<string[]>([])
  const [targetSuggestions, setTargetSuggestions] = useState<string[]>([])
  const [showTargetSuggestions, setShowTargetSuggestions] = useState(false)
  const [isTargetConfirmed, setIsTargetConfirmed] = useState(false)
  const [targetPage, setTargetPage] = useState(0)
  const [selectedTargetIndex, setSelectedTargetIndex] = useState(-1)
  
  // 動作あいまい検索用状態
  const [actionSuggestions, setActionSuggestions] = useState<string[]>([])
  const [showActionSuggestions, setShowActionSuggestions] = useState(false)
  const [selectedActionIndex, setSelectedActionIndex] = useState(-1)
  const [actionSearch, setActionSearch] = useState('')
  
  // 位置あいまい検索用状態
  const [positionSuggestions, setPositionSuggestions] = useState<string[]>([])
  const [showPositionSuggestions, setShowPositionSuggestions] = useState(false)
  const [selectedPositionIndex, setSelectedPositionIndex] = useState(-1)
  const [positionSearch, setPositionSearch] = useState('')
  
  // スクロール用ref
  const targetRefs = useRef<(HTMLButtonElement | null)[]>([])
  const actionRefs = useRef<(HTMLButtonElement | null)[]>([])
  const positionRefs = useRef<(HTMLButtonElement | null)[]>([])
  
  // セット作業用スクロールref
  const detailTargetRefs = useRef<(HTMLButtonElement | null)[]>([])
  const detailActionRefs = useRef<(HTMLButtonElement | null)[]>([])
  const detailPositionRefs = useRef<(HTMLButtonElement | null)[]>([])
  
  // スムーズなオートスクロール機能
  const scrollToElement = (element: HTMLElement | null) => {
    if (!element) return
    
    // ドロップダウンコンテナを探す
    let dropdown = element.parentElement
    while (dropdown && !dropdown.classList.contains('overflow-y-auto')) {
      dropdown = dropdown.parentElement
    }
    
    if (dropdown && dropdown.classList.contains('overflow-y-auto')) {
      const itemHeight = 44
      const containerHeight = dropdown.clientHeight
      const itemIndex = Array.from(dropdown.children).indexOf(element)
      const visibleItems = Math.floor(containerHeight / itemHeight)
      
      if (itemIndex >= 0) {
        // 現在の表示範囲を計算
        const currentScrollTop = dropdown.scrollTop
        const currentVisibleStart = Math.floor(currentScrollTop / itemHeight)
        const currentVisibleEnd = currentVisibleStart + visibleItems - 1
        
        let targetScrollTop = currentScrollTop
        
        // 選択項目が表示範囲外の場合のみスクロール（より保守的に）
        if (itemIndex < currentVisibleStart + 1) {
          // 上に隠れている場合：選択項目を上から2番目に表示（枠内に確実に収める）
          targetScrollTop = Math.max(0, Math.max(0, itemIndex - 1) * itemHeight)
        } else if (itemIndex > currentVisibleEnd - 1) {
          // 下に隠れている場合：選択項目を下から2番目に表示（枠内に確実に収める）
          targetScrollTop = Math.max(0, (itemIndex - visibleItems + 2) * itemHeight)
        }
        
        // 境界チェック：スクロール位置が適切な範囲内にあることを確認
        const maxScrollTop = Math.max(0, (Array.from(dropdown.children).length - visibleItems) * itemHeight)
        targetScrollTop = Math.min(targetScrollTop, maxScrollTop)
        
        // スムーズアニメーション付きスクロール
        if (Math.abs(targetScrollTop - currentScrollTop) > 5) { // 小さな差異は無視
          dropdown.style.scrollBehavior = 'smooth'
          dropdown.scrollTop = targetScrollTop
          
          // アニメーション完了後に scroll-behavior をリセット
          setTimeout(() => {
            dropdown.style.scrollBehavior = 'auto'
          }, 300)
        }
      }
    } else {
      // フォールバック：通常のスクロール
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      })
    }
  }
  
  // スクロール用のuseEffectは削除（キーボードイベント内で直接実行するため）
  
  // セット明細用サジェスト状態（個別作業と分離）
  const [detailTargetSuggestions, setDetailTargetSuggestions] = useState<string[]>([])
  const [showDetailTargetSuggestions, setShowDetailTargetSuggestions] = useState(false)
  const [selectedDetailTargetIndex, setSelectedDetailTargetIndex] = useState(-1)
  const [isDetailTargetConfirmed, setIsDetailTargetConfirmed] = useState(false)
  
  // セット作業の動作・位置用あいまい検索状態
  const [detailActionSuggestions, setDetailActionSuggestions] = useState<string[]>([])
  const [showDetailActionSuggestions, setShowDetailActionSuggestions] = useState(false)
  const [selectedDetailActionIndex, setSelectedDetailActionIndex] = useState(-1)
  const [detailActionSearch, setDetailActionSearch] = useState('')
  
  const [detailPositionSuggestions, setDetailPositionSuggestions] = useState<string[]>([])
  const [showDetailPositionSuggestions, setShowDetailPositionSuggestions] = useState(false)
  const [selectedDetailPositionIndex, setSelectedDetailPositionIndex] = useState(-1)
  const [detailPositionSearch, setDetailPositionSearch] = useState('')
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


      
      // まず件名マスタから件名IDを取得
      const { data: subjectData, error: subjectError } = await supabase
        .from('subject_master')
        .select('id')
        .eq('subject_name', selectedSubjectName)
        .single()
      
      if (subjectError || !subjectData) {

        return
      }
      

      
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
      

      
      if (relationsError) {
        console.error('関連登録番号取得エラー:', relationsError)
        return
      }
      
      if (relations && relations.length > 0) {
        const relatedRegistrations = relations.map(rel => ({
          registrationNumber: rel.registration_number_master?.registration_number,
          usage_count: rel.usage_count,
          is_primary: rel.is_primary
        }))
        

        
        // プライマリの登録番号があれば最初に表示、なければ使用頻度順
        const sortedRegistrations = relatedRegistrations.sort((a, b) => {
          if (a.is_primary && !b.is_primary) return -1
          if (!a.is_primary && b.is_primary) return 1
          return b.usage_count - a.usage_count
        })
        

        
        // デフォルトでは登録番号を自動設定しない（誤入力防止のため）
        // ユーザーがクリックして選択する方式に変更

        // setRegistrationNumber(sortedRegistrations[0].registrationNumber) // 自動設定を無効化
        setRegistrationSuggestions(sortedRegistrations)
      } else {

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




    if (typeof window !== 'undefined') {
      const rawData = localStorage.getItem('bankin_subject_master')

    }
    



    
    setSubjectDb(subjectDatabase)
    setRegistrationDb(registrationDatabase)
    setOtherCustomerDb(new OtherCustomerMasterDB())
    setTargetMasterDb(new TargetMasterDB())

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

          
          // 請求書基本データを取得
          const { data: invoiceData, error: invoiceError } = await supabase
            .from('invoices')
            .select('*')
            .eq('invoice_id', editInvoiceId)
            .single()

          if (invoiceError) throw invoiceError
          if (!invoiceData) throw new Error('請求書が見つかりません')

          // 月〆後かつ修正モードでない場合はリダイレクト
          // 月〆前であれば、ステータスに関係なく編集可能（枝番+1で新規作成）
          if (!isRevisionMode && (invoiceData as any).closed_at) {
            alert('この請求書は月〆処理済みです。修正を行う場合は、請求書詳細画面から「修正」ボタンを押してください。')
            router.push(`/invoice-view/${editInvoiceId}`)
            return
          }

          // 修正モード用に元の請求書情報を保存
          setOriginalInvoice(invoiceData)

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
              const action1 = item.action1 || ''
              const position1 = item.position1 || ''
              // raw_label_partがある場合は「旧システム明細内容」としてメモに表示
              let memoText = ''
              if (item.raw_label_part) {
                memoText = `旧システム明細内容\n${item.raw_label_part}`
              } else if (item.raw_label) {
                memoText = item.raw_label
              }
              return {
                id: index + 1,
                type: isSetWork ? 'set' : 'individual',
                work_name: isSetWork ? item.target || item.raw_label || '' : `${item.target || ''}${action1}${position1 ? ` (${position1})` : ''}`,
                position: position1,
                unit_price: Number(item.unit_price || 0),
                quantity: Number(item.quantity || 1),
                amount: Number(item.amount || 0),
                memo: memoText,
                set_details: isSetWork && item.raw_label ? item.raw_label.split(/[,、，]/).map(s => s.trim()).filter(s => s.length > 0) : [],
                detail_positions: []
              }
            })
            setWorkItems(items)
          }


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
    const newYear = currentDate.getFullYear()
    const newMonth = currentDate.getMonth() + 1
    handleYearMonthChange(newYear, newMonth)
  }

  // 年月変更時の警告チェック
  const handleYearMonthChange = (newYear: number, newMonth: number) => {
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() + 1

    // 選択した年月と現在月の差を計算
    const selectedDate = new Date(newYear, newMonth - 1)
    const currentDate = new Date(currentYear, currentMonth - 1)
    const monthDiff = (newYear - currentYear) * 12 + (newMonth - currentMonth)

    // 過去の月（前月以前）
    if (monthDiff < 0) {
      setDateWarningDialog({
        show: true,
        message: `${newYear}年${newMonth}月は過去の請求データです。\n\n修正データとして入力しますか？`,
        onConfirm: () => {
          setInvoiceYear(newYear)
          setInvoiceMonth(newMonth)
          setDateWarningDialog({ show: false, message: '', onConfirm: () => {} })
        }
      })
      return
    }

    // 未来の月（翌月以降）
    if (monthDiff > 0) {
      setDateWarningDialog({
        show: true,
        message: `${newYear}年${newMonth}月分の請求データとなりますが、よろしいですか？`,
        onConfirm: () => {
          setInvoiceYear(newYear)
          setInvoiceMonth(newMonth)
          setDateWarningDialog({ show: false, message: '', onConfirm: () => {} })
        }
      })
      return
    }

    // 当月なら警告なし
    setInvoiceYear(newYear)
    setInvoiceMonth(newMonth)
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
  
  // 計算結果（内税方式）
  const totalAmount = useMemo(() => {
    return workItems.reduce((sum, item) => sum + item.amount, 0)
  }, [workItems])
  
  const taxAmount = useMemo(() => {
    return Math.floor(totalAmount * 0.1 / 1.1)
  }, [totalAmount])
  
  const subtotal = useMemo(() => {
    return totalAmount - taxAmount
  }, [totalAmount, taxAmount])

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
    if (!detailTarget.trim()) return

    const label = composedLabel(detailTarget, detailActions, detailPositions, detailOther)

    // 単価を取得
    const priceKey = `${detailTarget}_${detailActions.length > 0 ? detailActions[0] : ''}`
    const unitPrice = priceBookMap?.[priceKey] || 0

    const newDetail = {
      target: detailTarget,
      action: detailActions.join('・'),
      actions: detailActions.slice(0, 3),      // DB保存用（最大3つ）
      position: detailPositions.join(''),
      positions: detailPositions.slice(0, 5),  // DB保存用（最大5つ）
      memo: detailOther,
      other: detailOther,                      // DB保存用
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
    setDetailPositions([])
    setDetailOther('')
    setDetailQuantity(1)
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
  }

  // 保存処理
  const handleSave = async (isDraft = true) => {
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
      // 枝番を計算する関数
      const getNextRevision = async (baseId: string): Promise<string> => {
        const parentNumber = baseId.split('-')[0]
        const { data: existingInvoices } = await supabase
          .from('invoices')
          .select('invoice_id')
          .like('invoice_id', `${parentNumber}-%`)
          .order('invoice_id', { ascending: false })

        if (existingInvoices && existingInvoices.length > 0) {
          const maxRevision = Math.max(
            ...existingInvoices.map(inv => parseInt(inv.invoice_id.split('-')[1] || '1'))
          )
          return `${parentNumber}-${maxRevision + 1}`
        }
        return `${parentNumber}-2`
      }

      // 修正モード（月〆後）の場合、赤伝と黒伝を生成
      if (isRevisionMode && originalInvoice) {
        // 1. 元の請求書を「revised」ステータスに更新
        await supabase
          .from('invoices')
          .update({ status: 'revised' })
          .eq('invoice_id', editInvoiceId!)

        // 2. 赤伝（マイナス伝票）を作成
        const redInvoiceId = await getNextRevision(editInvoiceId!)
        const redInvoiceRecord = {
          invoice_id: redInvoiceId,
          invoice_number: redInvoiceId,
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
          subtotal: -(originalInvoice.subtotal || 0),
          tax: -(originalInvoice.tax || 0),
          total_amount: -(originalInvoice.total || 0),
          total: -(originalInvoice.total || 0),
          status: 'finalized',
          payment_status: 'unpaid',
          invoice_type: 'red',
          original_invoice_id: editInvoiceId,
          remarks: `${editInvoiceId}の赤伝`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        const { error: redError } = await supabase
          .from('invoices')
          .insert(redInvoiceRecord)

        if (redError) throw redError

        // 3. 黒伝（正しい金額の請求書）を作成
        const blackInvoiceId = await getNextRevision(editInvoiceId!)
        const blackInvoiceRecord = {
          invoice_id: blackInvoiceId,
          invoice_number: blackInvoiceId,
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
          total: totalAmount,
          status: isDraft ? 'draft' : 'finalized',
          payment_status: 'unpaid',
          invoice_type: 'black',
          original_invoice_id: editInvoiceId,
          remarks: memo || `${editInvoiceId}の修正伝票`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        const { error: blackError } = await supabase
          .from('invoices')
          .insert(blackInvoiceRecord)

        if (blackError) throw blackError

        // 黒伝の明細を保存（後で処理）
        // invoiceNumberを黒伝のIDに変更
        const finalInvoiceId = blackInvoiceId

        alert(`修正伝票を作成しました\n赤伝: ${redInvoiceId}\n黒伝: ${blackInvoiceId}`)
        router.push(`/invoice-view/${blackInvoiceId}`)
        return

      } else if (isDeleteMode && isRedInvoiceMode) {
        // 削除モード（赤伝のみ発行）
        const targetId = deleteInvoiceId!
        const redInvoiceId = await getNextRevision(targetId)

        // 元の請求書データを取得
        const { data: targetInvoice } = await supabase
          .from('invoices')
          .select('*')
          .eq('invoice_id', targetId)
          .single()

        if (!targetInvoice) {
          throw new Error('元の請求書が見つかりません')
        }

        // 元の請求書を「cancelled」ステータスに更新
        await supabase
          .from('invoices')
          .update({ status: 'cancelled' })
          .eq('invoice_id', targetId)

        // 赤伝を作成
        const redInvoiceRecord = {
          invoice_id: redInvoiceId,
          invoice_number: redInvoiceId,
          issue_date: new Date().toISOString().split('T')[0],
          billing_date: targetInvoice.billing_date,
          billing_month: targetInvoice.billing_month,
          customer_category: targetInvoice.customer_category,
          customer_name: targetInvoice.customer_name,
          subject_name: targetInvoice.subject_name,
          subject: targetInvoice.subject,
          registration_number: targetInvoice.registration_number,
          order_number: targetInvoice.order_number,
          purchase_order_number: targetInvoice.purchase_order_number,
          subtotal: -(targetInvoice.subtotal || 0),
          tax: -(targetInvoice.tax || 0),
          total_amount: -(targetInvoice.total || targetInvoice.total_amount || 0),
          total: -(targetInvoice.total || targetInvoice.total_amount || 0),
          status: 'finalized',
          payment_status: 'unpaid',
          invoice_type: 'red',
          original_invoice_id: targetId,
          remarks: `${targetId}の取消（赤伝）`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        const { error: redError } = await supabase
          .from('invoices')
          .insert(redInvoiceRecord)

        if (redError) throw redError

        alert(`赤伝を発行しました: ${redInvoiceId}`)
        router.push(`/invoice-view/${redInvoiceId}`)
        return
      }

      // 通常の保存処理
      let finalInvoiceId = invoiceNumber

      // 月〆前の編集で枝番を+1する場合
      if (isEditMode && !isRevisionMode && editInvoiceId) {
        // 元の請求書のclosed_atを確認
        const { data: existingInvoice } = await supabase
          .from('invoices')
          .select('*')
          .eq('invoice_id', editInvoiceId)
          .single()

        // 月〆前なら枝番+1で新規作成、元は「revised」に
        const closedAt = (existingInvoice as any)?.closed_at
        if (!closedAt && existingInvoice) {
          const newInvoiceId = await getNextRevision(editInvoiceId)
          finalInvoiceId = newInvoiceId

          // 元の請求書を「revised」に
          await supabase
            .from('invoices')
            .update({ status: 'revised' })
            .eq('invoice_id', editInvoiceId)
        }
      }

      // Supabaseに保存
      const invoiceRecord = {
        invoice_id: finalInvoiceId,
        invoice_number: finalInvoiceId,
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
        total: totalAmount,
        status: isDraft ? 'draft' : 'finalized',
        payment_status: 'unpaid',
        invoice_type: 'standard',
        remarks: memo || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // 新規作成（枝番+1の場合も含む）
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .insert(invoiceRecord)
        .select()

      if (invoiceError) {
        throw invoiceError
      }

      // invoiceNumberを最終的なIDに更新（明細保存用）
      const savedInvoiceId = finalInvoiceId

      // 明細データを保存（prompt.txt仕様に準拠）
      if (workItems.length > 0) {
        const lineItems: any[] = []

        workItems.forEach((item, index) => {
          const lineNo = index + 1
          const amount = item.unit_price * item.quantity

          if (item.type === 'set' && item.set_details && item.set_details.length > 0) {
            // セット作業（task_type='S'）
            // 親行: sub_no=1, 金額を持つ
            const firstDetailItem = item.set_detail_items?.[0]
            lineItems.push({
              invoice_id: savedInvoiceId,
              line_no: lineNo,
              sub_no: 1,
              task_type: 'S',
              target: firstDetailItem?.target || null,
              action1: firstDetailItem?.actions?.[0] || null,
              action2: firstDetailItem?.actions?.[1] || null,
              action3: firstDetailItem?.actions?.[2] || null,
              position1: firstDetailItem?.positions?.[0] || null,
              position2: firstDetailItem?.positions?.[1] || null,
              position3: firstDetailItem?.positions?.[2] || null,
              position4: firstDetailItem?.positions?.[3] || null,
              position5: firstDetailItem?.positions?.[4] || null,
              other: firstDetailItem?.other || null,
              set_name: item.work_name,
              raw_label: item.set_details.join('、'),
              raw_label_part: item.set_details[0], // 親行は最初の内訳
              unit_price: item.unit_price,
              quantity: item.quantity,
              amount: amount,
              performed_at: billingDate
            })

            // 子行: sub_no=2..n, 金額は親行と同じ（どの行からでもセットの金額がわかるように）
            item.set_details!.slice(1).forEach((detail, detailIndex) => {
              const detailItem = item.set_detail_items?.[detailIndex + 1]
              lineItems.push({
                invoice_id: savedInvoiceId,
                line_no: lineNo,
                sub_no: detailIndex + 2,
                task_type: 'S',
                target: detailItem?.target || null,
                action1: detailItem?.actions?.[0] || null,
                action2: detailItem?.actions?.[1] || null,
                action3: detailItem?.actions?.[2] || null,
                position1: detailItem?.positions?.[0] || null,
                position2: detailItem?.positions?.[1] || null,
                position3: detailItem?.positions?.[2] || null,
                position4: detailItem?.positions?.[3] || null,
                position5: detailItem?.positions?.[4] || null,
                other: detailItem?.other || null,
                set_name: item.work_name,
                raw_label: item.set_details!.join('、'),
                raw_label_part: detail,
                unit_price: item.unit_price,
                quantity: item.quantity,
                amount: amount,
                performed_at: billingDate
              })
            })
          } else {
            // 個別作業（task_type='T'）
            // sub_no=1固定
            lineItems.push({
              invoice_id: savedInvoiceId,
              line_no: lineNo,
              sub_no: 1,
              task_type: 'T',
              target: item.target || null,
              action1: item.actions?.[0] || null,
              action2: item.actions?.[1] || null,
              action3: item.actions?.[2] || null,
              position1: item.positions?.[0] || null,
              position2: item.positions?.[1] || null,
              position3: item.positions?.[2] || null,
              position4: item.positions?.[3] || null,
              position5: item.positions?.[4] || null,
              other: item.other || null,
              raw_label: item.work_name,
              raw_label_part: item.work_name,
              unit_price: item.unit_price,
              quantity: item.quantity,
              amount: amount,
              performed_at: billingDate
            })
          }
        })

        const { error: lineItemsError } = await supabase
          .from('invoice_line_items')
          .insert(lineItems)

        if (lineItemsError) {
          throw lineItemsError
        }
      }

      // 確定保存の場合のみ、Supabaseマスタに自動登録
      if (!isDraft) {
        // 件名マスタに登録
        if (subject.trim()) {
          const { error: subjectError } = await supabase
            .from('subject_master')
            .upsert(
              { subject_name: subject.trim() },
              { onConflict: 'subject_name', ignoreDuplicates: true }
            )
          if (subjectError) {
            console.error('件名マスタ登録エラー:', subjectError)
          }
        }

        // 登録番号マスタに登録
        if (registrationNumber && registrationNumber.trim()) {
          const { error: regError } = await supabase
            .from('registration_number_master')
            .upsert(
              {
                registration_number: registrationNumber.trim(),
                usage_count: 1,
                last_used_at: new Date().toISOString()
              },
              { onConflict: 'registration_number', ignoreDuplicates: true }
            )
          if (regError) {
            console.error('登録番号マスタ登録エラー:', regError)
          }
        }

        // その他顧客マスタに登録（「その他」カテゴリーの場合のみ）
        if (customerCategory === 'other' && customerName.trim()) {
          const { error: customerError } = await (supabase as any)
            .from('other_customers')
            .upsert(
              {
                customer_name: customerName.trim(),
                usage_count: 1,
                last_used_at: new Date().toISOString()
              },
              { onConflict: 'customer_name', ignoreDuplicates: true }
            )
          if (customerError) {
            console.error('その他顧客マスタ登録エラー:', customerError)
          }
        }

        // 対象マスタに登録（作業項目から対象を収集してtargetsテーブルにupsert）
        const uniqueTargets = new Set<string>()
        workItems.forEach(item => {
          if (item.target && item.target.trim()) {
            uniqueTargets.add(item.target.trim())
          }
          // セット作業の場合、明細の対象も収集
          if (item.set_detail_items) {
            item.set_detail_items.forEach(detail => {
              if (detail.target && detail.target.trim()) {
                uniqueTargets.add(detail.target.trim())
              }
            })
          }
        })

        // 各対象をtargetsテーブルに登録
        for (const targetName of uniqueTargets) {
          const { error: targetError } = await supabase
            .from('targets')
            .upsert(
              {
                name: targetName,
                is_active: true,
                sort_order: 9999  // 新規追加は最後に
              },
              { onConflict: 'name', ignoreDuplicates: true }
            )
          if (targetError) {
            console.error('対象マスタ登録エラー:', targetError, targetName)
          }
        }

        // 動作・位置の登録待ち保存（マスタ未登録のもののみ）
        // 作業項目から動作と位置を収集
        const uniqueActions = new Set<string>()
        const uniquePositions = new Set<string>()
        workItems.forEach(item => {
          // 動作を収集
          if (item.actions) {
            item.actions.forEach(action => {
              if (action && action.trim()) uniqueActions.add(action.trim())
            })
          }
          // 位置を収集
          if (item.positions) {
            item.positions.forEach(position => {
              if (position && position.trim()) uniquePositions.add(position.trim())
            })
          }
          // セット作業の場合、明細の動作・位置も収集
          if (item.set_detail_items) {
            item.set_detail_items.forEach(detail => {
              if (detail.actions) {
                detail.actions.forEach(action => {
                  if (action && action.trim()) uniqueActions.add(action.trim())
                })
              }
              if (detail.positions) {
                detail.positions.forEach(position => {
                  if (position && position.trim()) uniquePositions.add(position.trim())
                })
              }
            })
          }
        })

        // 既存のマスタデータを取得
        const { data: existingActions } = await supabase
          .from('actions')
          .select('name')
          .eq('is_active', true)
        const { data: existingPositions } = await supabase
          .from('positions')
          .select('name')
          .eq('is_active', true)

        const existingActionNames = new Set((existingActions || []).map(a => a.name))
        const existingPositionNames = new Set((existingPositions || []).map(p => p.name))

        // 未登録の動作を登録待ちに保存
        for (const actionName of uniqueActions) {
          if (!existingActionNames.has(actionName)) {
            const { error: pendingError } = await (supabase as any)
              .from('pending_master_items')
              .upsert(
                {
                  item_type: 'action',
                  name: actionName,
                  invoice_id: finalInvoiceId,
                  is_registered: false
                },
                { onConflict: 'item_type,name', ignoreDuplicates: true }
              )
            if (pendingError) {
              console.error('動作登録待ち保存エラー:', pendingError, actionName)
            }
          }
        }

        // 未登録の位置を登録待ちに保存
        for (const positionName of uniquePositions) {
          if (!existingPositionNames.has(positionName)) {
            const { error: pendingError } = await (supabase as any)
              .from('pending_master_items')
              .upsert(
                {
                  item_type: 'position',
                  name: positionName,
                  invoice_id: finalInvoiceId,
                  is_registered: false
                },
                { onConflict: 'item_type,name', ignoreDuplicates: true }
              )
            if (pendingError) {
              console.error('位置登録待ち保存エラー:', pendingError, positionName)
            }
          }
        }
      }

      alert(isDraft ? `${docTypeName}を下書き保存しました` : `${docTypeName}を確定保存しました`)
      router.push('/invoice-list')
    } catch (error) {
      alert('保存に失敗しました: ' + (error instanceof Error ? error.message : 'Unknown error'))
      console.error('Save error:', error)
    }
  }

  // 作業価格検索関数
  const searchPrices = async () => {
    const workKeyword = priceSearchKeyword.trim()
    const subjectKeyword = priceSearchSubject.trim()

    // どちらも空の場合は検索しない
    if (!workKeyword && !subjectKeyword) {
      setPriceSearchResults([])
      return
    }

    setPriceSearchLoading(true)
    try {
      let targetInvoiceIds: string[] | null = null

      // 件名フィルターがある場合、先にinvoicesを検索
      if (subjectKeyword) {
        const subjectHiragana = katakanaToHiragana(subjectKeyword)
        const subjectKatakana = hiraganaToKatakana(subjectKeyword)

        const subjectConditions = [`subject.ilike.%${subjectKeyword}%`]
        if (subjectHiragana !== subjectKeyword) {
          subjectConditions.push(`subject.ilike.%${subjectHiragana}%`)
        }
        if (subjectKatakana !== subjectKeyword && subjectKatakana !== subjectHiragana) {
          subjectConditions.push(`subject.ilike.%${subjectKatakana}%`)
        }

        const { data: matchedInvoices, error: invoiceError } = await supabase
          .from('invoices')
          .select('invoice_id')
          .or(subjectConditions.join(','))
          .limit(500)

        if (invoiceError) throw invoiceError

        targetInvoiceIds = matchedInvoices?.map(inv => inv.invoice_id) || []

        // 件名でマッチするものがなければ結果なし
        if (targetInvoiceIds.length === 0) {
          setPriceSearchResults([])
          return
        }
      }

      // invoice_line_itemsを検索
      let query = supabase
        .from('invoice_line_items')
        .select(`
          id,
          raw_label,
          raw_label_part,
          unit_price,
          quantity,
          target,
          set_name,
          invoice_id,
          line_no,
          task_type
        `)

      // 作業名フィルター（表示に使うraw_label_partも検索対象に含む）
      if (workKeyword) {
        const keywordHiragana = katakanaToHiragana(workKeyword)
        const keywordKatakana = hiraganaToKatakana(workKeyword)

        const orConditions = [
          `raw_label.ilike.%${workKeyword}%`,
          `raw_label_part.ilike.%${workKeyword}%`,
          `target.ilike.%${workKeyword}%`,
          `set_name.ilike.%${workKeyword}%`
        ]
        if (keywordHiragana !== workKeyword) {
          orConditions.push(`raw_label.ilike.%${keywordHiragana}%`)
          orConditions.push(`raw_label_part.ilike.%${keywordHiragana}%`)
          orConditions.push(`target.ilike.%${keywordHiragana}%`)
          orConditions.push(`set_name.ilike.%${keywordHiragana}%`)
        }
        if (keywordKatakana !== workKeyword && keywordKatakana !== keywordHiragana) {
          orConditions.push(`raw_label.ilike.%${keywordKatakana}%`)
          orConditions.push(`raw_label_part.ilike.%${keywordKatakana}%`)
          orConditions.push(`target.ilike.%${keywordKatakana}%`)
          orConditions.push(`set_name.ilike.%${keywordKatakana}%`)
        }

        query = query.or(orConditions.join(','))
      }

      // 件名フィルターでマッチしたinvoice_idに絞り込み
      if (targetInvoiceIds) {
        query = query.in('invoice_id', targetInvoiceIds)
      }

      const { data, error } = await query
        .order('invoice_id', { ascending: false })
        .limit(200)

      if (error) throw error

      // 重複排除（同じinvoice_id + line_noは1つだけ）
      const uniqueMap = new Map<string, typeof data[0]>()
      for (const item of data || []) {
        const key = `${item.invoice_id}-${item.line_no}`
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, item)
        }
      }

      // invoice_idsを取得して請求書情報とセット明細を並行取得
      const invoiceIds = [...new Set(Array.from(uniqueMap.values()).map(item => item.invoice_id))]

      const [invoicesRes, splitItemsRes] = await Promise.all([
        supabase
          .from('invoices')
          .select('invoice_id, customer_name, subject, issue_date')
          .in('invoice_id', invoiceIds),
        supabase
          .from('invoice_line_items_split')
          .select('invoice_id, line_no, raw_label_part')
          .in('invoice_id', invoiceIds)
      ])

      const invoiceMap = new Map(invoicesRes.data?.map(inv => [inv.invoice_id, inv]) || [])

      // セット明細をinvoice_id + line_noでグループ化
      const splitDetailsMap = new Map<string, string[]>()
      for (const item of splitItemsRes.data || []) {
        const key = `${item.invoice_id}-${item.line_no}`
        if (!splitDetailsMap.has(key)) {
          splitDetailsMap.set(key, [])
        }
        if (item.raw_label_part) {
          splitDetailsMap.get(key)!.push(item.raw_label_part)
        }
      }

      const results = Array.from(uniqueMap.values()).map(item => {
        const invoice = invoiceMap.get(item.invoice_id)
        const key = `${item.invoice_id}-${item.line_no}`
        return {
          id: item.id,
          work_name: item.raw_label || item.set_name || '',
          raw_label_part: item.raw_label_part || null,
          unit_price: item.unit_price || 0,
          quantity: item.quantity || 0,
          subject: invoice?.subject || null,
          customer_name: invoice?.customer_name || null,
          issue_date: invoice?.issue_date || null,
          invoice_id: item.invoice_id || '',
          task_type: item.task_type || null,
          line_no: item.line_no,
          set_details: splitDetailsMap.get(key)
        }
      })

      setPriceSearchResults(results)
    } catch (error) {
      console.error('Price search error:', error)
      alert('検索中にエラーが発生しました')
    } finally {
      setPriceSearchLoading(false)
    }
  }

  // 請求書詳細を取得
  const fetchPriceInvoiceDetail = async (invoiceId: string) => {
    setPriceDetailLoading(true)
    try {
      // 請求書情報と明細を並行取得（sub_noも取得してセット明細の各行を表示）
      const [invoiceRes, lineItemsRes] = await Promise.all([
        supabase
          .from('invoices')
          .select('invoice_id, customer_name, subject, issue_date')
          .eq('invoice_id', invoiceId)
          .single(),
        supabase
          .from('invoice_line_items')
          .select('line_no, sub_no, raw_label, raw_label_part, unit_price, quantity, amount, task_type, set_name')
          .eq('invoice_id', invoiceId)
          .order('line_no', { ascending: true })
          .order('sub_no', { ascending: true })
      ])

      if (invoiceRes.error) throw invoiceRes.error
      if (lineItemsRes.error) throw lineItemsRes.error

      const invoiceData = invoiceRes.data
      const lineItemsData = lineItemsRes.data || []

      // 全てのアイテムを処理（sub_no > 1のものはセット明細として表示）
      const processedItems = lineItemsData.map(item => ({
        line_no: item.line_no,
        sub_no: item.sub_no || 1,
        raw_label: item.raw_label || '',
        raw_label_part: item.raw_label_part || null,
        unit_price: item.unit_price || 0,
        quantity: item.quantity || 0,
        amount: item.amount || 0,
        task_type: item.task_type,
        set_name: item.set_name,
        is_set_detail: (item.sub_no || 1) > 1  // sub_no > 1はセット明細
      }))

      setSelectedPriceInvoice({
        invoice_id: invoiceData.invoice_id,
        customer_name: invoiceData.customer_name,
        subject: invoiceData.subject,
        issue_date: invoiceData.issue_date,
        line_items: processedItems
      })
    } catch (error) {
      console.error('Fetch invoice detail error:', error)
      alert('請求書詳細の取得に失敗しました')
    } finally {
      setPriceDetailLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <header className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
          {/* PC版: 1行レイアウト */}
          <div className="hidden md:flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              {isEditMode ? '請求書編集' : '請求書作成'}
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => handleSave(true)}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center gap-2 font-medium"
              >
                <Save size={20} />
                下書き
              </button>
              <button
                onClick={() => handleSave(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium"
              >
                <Save size={20} />
                保存
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2 font-medium"
              >
                <Home size={20} />
                メニューへ
              </button>
            </div>
          </div>
          {/* スマホ版: 2行レイアウト */}
          <div className="md:hidden space-y-3">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold text-gray-800">
                {isEditMode ? '請求書編集' : '請求書作成'}
              </h1>
              <button
                onClick={() => router.push('/')}
                className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-1 font-medium text-sm"
              >
                <Home size={18} />
                メニューへ
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleSave(true)}
                className="flex-1 px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center justify-center gap-1 font-medium text-sm"
              >
                <Save size={18} />
                下書き
              </button>
              <button
                onClick={() => handleSave(false)}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-1 font-medium text-sm"
              >
                <Save size={18} />
                保存
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* メインフォーム */}
          <div className="lg:col-span-2 space-y-6">
            {/* 基本情報 */}
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              {/* PC版: 1行レイアウト */}
              <div className="hidden md:flex items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-semibold text-gray-800">📋 基本情報</h2>

                  {/* 請求書・見積書タブ */}
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => setDocumentType('invoice')}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        documentType === 'invoice'
                          ? 'bg-white text-blue-700 shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      📄 請求書
                    </button>
                    <button
                      type="button"
                      onClick={() => setDocumentType('estimate')}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        documentType === 'estimate'
                          ? 'bg-white text-blue-700 shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      📊 見積書
                    </button>
                  </div>
                </div>

                {/* 請求書No欄 */}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    {documentType === 'invoice' ? '請求書No' : '見積書No'}
                  </label>
                  <input
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="w-32 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={documentType === 'invoice' ? '例: INV-001' : '例: EST-001'}
                  />
                </div>
              </div>

              {/* スマホ版: 2行レイアウト */}
              <div className="md:hidden space-y-3 mb-4">
                {/* 1行目: 基本情報 + 請求書No */}
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-base font-semibold text-gray-800">📋 基本情報</h2>
                  <div className="flex items-center gap-1">
                    <label className="text-xs font-medium text-gray-700 whitespace-nowrap">
                      {documentType === 'invoice' ? '請求書No' : '見積書No'}
                    </label>
                    <input
                      type="text"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      className="w-24 px-2 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="No"
                    />
                  </div>
                </div>
                {/* 2行目: 請求書・見積書タブ */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setDocumentType('invoice')}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      documentType === 'invoice'
                        ? 'bg-white text-blue-700 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    📄 請求書
                  </button>
                  <button
                    type="button"
                    onClick={() => setDocumentType('estimate')}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      documentType === 'estimate'
                        ? 'bg-white text-blue-700 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    📊 見積書
                  </button>
                </div>
              </div>
              
              {/* 年月・日付セクション */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    請求データ年月 <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                    <button
                      type="button"
                      onClick={() => adjustMonth(-1)}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors whitespace-nowrap"
                    >
                      前月
                    </button>
                    <div className="flex gap-2 flex-1">
                      <select
                        value={invoiceYear}
                        onChange={(e) => handleYearMonthChange(Number(e.target.value), invoiceMonth)}
                        className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
                      >
                        {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                      <span className="py-2 text-gray-500 whitespace-nowrap">年</span>
                      <select
                        value={invoiceMonth}
                        onChange={(e) => handleYearMonthChange(invoiceYear, Number(e.target.value))}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                          <option key={month} value={month}>{month}</option>
                        ))}
                      </select>
                      <span className="py-2 text-gray-500 whitespace-nowrap">月</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => adjustMonth(1)}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors whitespace-nowrap"
                    >
                      次月
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    請求日（発行日） <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                    <button
                      type="button"
                      onClick={() => adjustBillingDate(-1)}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors whitespace-nowrap"
                    >
                      前日
                    </button>
                    <input
                      type="date"
                      value={billingDate}
                      onChange={(e) => setBillingDate(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-0"
                      required
                    />
                    <button
                      type="button"
                      onClick={setBillingDateToday}
                      className="px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded text-sm transition-colors whitespace-nowrap"
                    >
                      今日
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustBillingDate(1)}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors whitespace-nowrap"
                    >
                      翌日
                    </button>
                  </div>
                </div>
              </div>

              {/* 顧客情報セクション */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      顧客カテゴリ
                    </label>
                    <button
                      type="button"
                      onClick={() => router.push('/customer-settings')}
                      className="text-xs text-blue-600 hover:text-blue-800 underline"
                    >
                      カテゴリー設定
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {customerCategories.map((category) => (
                      <label key={category.id} className="flex items-center">
                        <input
                          type="radio"
                          value={category.id}
                          checked={customerCategory === category.id}
                          onChange={(e) => handleCustomerCategoryChange(e.target.value)}
                          className="mr-2"
                        />
                        {category.name}
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    顧客名 <span className="text-red-500">*</span>
                    <HelpTooltip text="「その他」カテゴリの場合、確定保存時に顧客マスタへ自動登録されます。次回から候補として表示されます。" />
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => handleCustomerNameChange(e.target.value)}
                    onBlur={() => {
                      // 「その他」カテゴリーの場合、顧客名をlocalStorageに自動登録
                      if (customerCategory === 'other' && customerName.trim() && otherCustomerDb) {
                        otherCustomerDb.autoRegisterCustomer(customerName.trim())
                      }
                      setTimeout(() => setShowCustomerSuggestions(false), 200)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={
                      customerCategory === 'other'
                        ? '顧客名を入力してください'
                        : customerCategories.find(cat => cat.id === customerCategory)?.companyName || '顧客名を入力してください'
                    }
                    required
                    disabled={Boolean(customerCategory !== 'other' && customerCategories.find(cat => cat.id === customerCategory)?.companyName)}
                  />
                  {showCustomerSuggestions && customerSuggestions.length > 0 && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                      {customerSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => {
                            setCustomerName(suggestion)
                            setShowCustomerSuggestions(false)
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-blue-50 first:rounded-t-lg last:rounded-b-lg"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 件名・番号セクション */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      件名 <span className="text-red-500">*</span>
                      <HelpTooltip text="入力した件名は確定保存時に件名マスタへ自動登録されます。次回から候補として表示されます。" />
                      <span className="text-xs text-gray-500 ml-2">（顧客名から自動入力されます。変更可能）</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => router.push('/subject-master')}
                      className="text-xs text-blue-600 hover:text-blue-800 underline"
                    >
                      件名設定
                    </button>
                  </div>
                  <input
                    type="text"
                    value={subject}
                    onFocus={() => {
                      // フォーカス時に件名候補を表示（空欄でも表示）


                      
                      if (subject.trim()) {
                        // 既に入力がある場合は、その内容で検索
                        const filteredSuggestions = searchSubjects(subject.trim())
                        setSubjectSuggestions(filteredSuggestions)
                        setShowSubjectSuggestions(filteredSuggestions.length > 0)
                      } else {
                        // 空欄の場合は、全ての件名から最近使用されたものを表示
                        const recentSubjects = allSubjects.slice(0, 20) // 最大20件

                        setSubjectSuggestions(recentSubjects)
                        setShowSubjectSuggestions(recentSubjects.length > 0)
                      }
                    }}
                    onChange={(e) => {
                      setSubject(e.target.value)
                      setSelectedSubjectIndex(-1)
                      
                      if (e.target.value.trim()) {
                        // Supabaseベースの曖昧検索
                        const filteredSuggestions = searchSubjects(e.target.value.trim())
                        





                        
                        setSubjectSuggestions(filteredSuggestions)
                        setShowSubjectSuggestions(filteredSuggestions.length > 0)
                      } else {
                        setShowSubjectSuggestions(false)
                      }
                    }}
                    onKeyDown={(e) => {
                      if (!showSubjectSuggestions) return
                      
                      switch (e.key) {
                        case 'ArrowDown':
                          e.preventDefault()
                          setSelectedSubjectIndex(prev => 
                            prev < subjectSuggestions.length - 1 ? prev + 1 : 0
                          )
                          break
                        case 'ArrowUp':
                          e.preventDefault()
                          setSelectedSubjectIndex(prev => 
                            prev > 0 ? prev - 1 : subjectSuggestions.length - 1
                          )
                          break
                        case 'Enter':
                          e.preventDefault()
                          if (selectedSubjectIndex >= 0 && selectedSubjectIndex < subjectSuggestions.length) {
                            const selectedSubject = subjectSuggestions[selectedSubjectIndex]
                            setSubject(selectedSubject.subject_name)
                            setShowSubjectSuggestions(false)
                            setSelectedSubjectIndex(-1)
                            // 件名選択後、登録番号の絞り込み実行
                            handleSubjectSelection(selectedSubject.subject_name)
                          }
                          break
                        case 'Escape':
                          setShowSubjectSuggestions(false)
                          setSelectedSubjectIndex(-1)
                          break
                      }
                    }}
                    onBlur={() => {
                      // 自動登録処理
                      if (subject.trim() && subjectDb) {
                        subjectDb.autoRegisterSubject(subject.trim())
                      }
                      // ドロップダウンを閉じる（少し遅延させてクリックイベントが処理されるように）
                      setTimeout(() => setShowSubjectSuggestions(false), 200)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="件名を入力"
                    required
                  />
                  {showSubjectSuggestions && subjectSuggestions.length > 0 && (
                    <div ref={subjectSuggestionsRef} className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                      {subjectSuggestions.map((suggestion, index) => (
                        <button
                          key={suggestion.id}
                          type="button"
                          onClick={() => {
                            setSubject(suggestion.subject_name)
                            setShowSubjectSuggestions(false)
                            setSelectedSubjectIndex(-1)
                            // 件名選択後、登録番号の絞り込み実行
                            handleSubjectSelection(suggestion.subject_name)
                          }}
                          className={`w-full px-3 py-2 text-left first:rounded-t-lg last:rounded-b-lg text-sm border-b border-gray-100 last:border-b-0 ${
                            index === selectedSubjectIndex 
                              ? 'bg-blue-100 text-blue-900' 
                              : 'hover:bg-blue-50'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{suggestion.subject_name}</span>
                            {suggestion.subject_name_kana && (
                              <span className="text-xs text-gray-500">{suggestion.subject_name_kana}</span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      登録番号（任意）
                      <HelpTooltip text="入力した登録番号は確定保存時に登録番号マスタへ自動登録されます。次回から候補として表示されます。" />
                    </label>
                    <button
                      type="button"
                      onClick={() => router.push('/registration-settings')}
                      className="text-xs text-blue-600 hover:text-blue-800 underline"
                    >
                      登録番号設定
                    </button>
                  </div>
                  <input
                    type="text"
                    value={registrationNumber}
                    onFocus={() => {
                      // フォーカス時に件名関連の登録番号を表示（空欄でも表示）


                      
                      const subjectRelatedOnly = registrationSuggestions.filter(reg => reg.usage_count > 0)

                      
                      if (subjectRelatedOnly.length > 0) {
                        // 件名関連の登録番号があれば表示
                        setShowRegistrationSuggestions(true)
                      } else if (!subject.trim()) {
                        // 件名が空欄の場合のみ、全ての登録番号から候補を表示
                        if (registrationDb) {
                          const allSuggestions = registrationDb.searchRegistrations('').map((reg: any) => ({
                            id: reg.id,
                            registrationNumber: reg.registrationNumber,
                            description: reg.description,
                            usage_count: 0,
                            is_primary: false
                          })).slice(0, 10)

                          setRegistrationSuggestions(allSuggestions)
                          setShowRegistrationSuggestions(allSuggestions.length > 0)
                        }
                      } else {
                        // 件名が入力されているが関連登録番号がない場合は候補を表示しない

                        setShowRegistrationSuggestions(false)
                      }
                    }}
                    onChange={(e) => {
                      setRegistrationNumber(e.target.value)
                      setSelectedRegistrationIndex(-1)
                      if (e.target.value.trim()) {
                        // 1. 件名に紐づく登録番号を優先表示（既にhandleSubjectSelectionで設定済み）
                        const keyword = e.target.value.trim()
                        const subjectRelated = registrationSuggestions.filter(reg => 
                          reg.registrationNumber && 
                          fuzzyMatch(reg.registrationNumber, keyword)
                        )
                        
                        // 2. 件名が入力されている場合は、件名関連の登録番号のみ表示
                        // LocalStorageからの追加は、件名が空欄の場合のみ
                        let additionalSuggestions = []
                        if (!subject.trim() && registrationDb) {
                          const allRegistrations = registrationDb.searchRegistrations('')
                          additionalSuggestions = allRegistrations
                            .filter((registration: any) => 
                              fuzzyMatch(registration.registrationNumber, keyword) &&
                              !subjectRelated.find(sr => sr.registrationNumber === registration.registrationNumber)
                            )
                            .map((registration: any) => ({ 
                              registrationNumber: registration.registrationNumber, 
                              usage_count: 0, 
                              is_primary: false,
                              id: registration.id 
                            }))
                            .slice(0, 10) // 追加分は10件まで
                        }
                        
                        // 3. 件名関連を上位、その他を下位に表示（最大30件）
                        const combinedSuggestions = [...subjectRelated, ...additionalSuggestions].slice(0, 30)
                        setRegistrationSuggestions(combinedSuggestions)
                        setShowRegistrationSuggestions(combinedSuggestions.length > 0)
                      } else {
                        // 入力が空の場合の表示制御
                        if (!subject.trim()) {
                          // 件名も空欄の場合は、全ての登録番号候補を表示
                          if (registrationDb) {
                            const allSuggestions = registrationDb.searchRegistrations('').map((reg: any) => ({
                              registrationNumber: reg.registrationNumber,
                              usage_count: 0,
                              is_primary: false,
                              id: reg.id
                            })).slice(0, 10)
                            setRegistrationSuggestions(allSuggestions)
                            setShowRegistrationSuggestions(allSuggestions.length > 0)
                          }
                        } else {
                          // 件名が入力されている場合は、件名関連の登録番号のみ表示
                          const subjectRelatedOnly = registrationSuggestions.filter(reg => reg.usage_count > 0)
                          setShowRegistrationSuggestions(subjectRelatedOnly.length > 0)
                        }
                      }
                    }}
                    onKeyDown={(e) => {
                      if (!showRegistrationSuggestions) return
                      
                      switch (e.key) {
                        case 'ArrowDown':
                          e.preventDefault()
                          setSelectedRegistrationIndex(prev => 
                            prev < registrationSuggestions.length - 1 ? prev + 1 : 0
                          )
                          break
                        case 'ArrowUp':
                          e.preventDefault()
                          setSelectedRegistrationIndex(prev => 
                            prev > 0 ? prev - 1 : registrationSuggestions.length - 1
                          )
                          break
                        case 'Enter':
                          e.preventDefault()
                          if (selectedRegistrationIndex >= 0 && selectedRegistrationIndex < registrationSuggestions.length) {
                            const selectedRegistration = registrationSuggestions[selectedRegistrationIndex]
                            setRegistrationNumber(selectedRegistration.registrationNumber)
                            setShowRegistrationSuggestions(false)
                            setSelectedRegistrationIndex(-1)
                            if (registrationDb) {
                              registrationDb.autoRegisterRegistration(selectedRegistration.registrationNumber)
                            }
                          }
                          break
                        case 'Escape':
                          setShowRegistrationSuggestions(false)
                          setSelectedRegistrationIndex(-1)
                          break
                      }
                    }}
                    onBlur={() => {
                      // 自動登録処理
                      if (registrationNumber.trim() && registrationDb) {
                        registrationDb.autoRegisterRegistration(registrationNumber.trim())
                      }
                      // ドロップダウンを閉じる（少し遅延させてクリックイベントが処理されるように）
                      setTimeout(() => setShowRegistrationSuggestions(false), 200)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="登録番号"
                  />
                  {showRegistrationSuggestions && registrationSuggestions.length > 0 && (
                    <div ref={registrationSuggestionsRef} className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                      {registrationSuggestions.map((suggestion, index) => {
                        const isSubjectRelated = suggestion.usage_count > 0
                        const isPrimary = suggestion.is_primary
                        return (
                          <button
                            key={suggestion.id}
                            type="button"
                            onClick={() => {
                              setRegistrationNumber(suggestion.registrationNumber)
                              setShowRegistrationSuggestions(false)
                              setSelectedRegistrationIndex(-1)
                              // 使用回数を増やす
                              if (registrationDb) {
                                registrationDb.autoRegisterRegistration(suggestion.registrationNumber)
                              }
                            }}
                            className={`w-full px-3 py-2 text-left first:rounded-t-lg last:rounded-b-lg text-sm border-b border-gray-100 last:border-b-0 ${
                              index === selectedRegistrationIndex 
                                ? 'bg-blue-100 text-blue-900' 
                                : isSubjectRelated 
                                  ? 'hover:bg-green-50 bg-green-25' 
                                  : 'hover:bg-blue-50'
                            } ${isSubjectRelated ? 'border-l-4 border-l-green-500' : ''}`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className={`font-medium ${isSubjectRelated ? 'text-green-800' : ''}`}>
                                  {suggestion.registrationNumber}
                                  {isPrimary && (
                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                      プライマリ
                                    </span>
                                  )}
                                </div>
                                {suggestion.description && (
                                  <div className="text-xs text-gray-600 mt-1">{suggestion.description}</div>
                                )}
                                {isSubjectRelated && (
                                  <div className="text-xs text-green-600 mt-1">
                                    📎 選択中の件名に関連
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-500 ml-2">
                                {suggestion.category && (
                                  <span className="bg-gray-100 px-2 py-1 rounded">{suggestion.category}</span>
                                )}
                                {isSubjectRelated ? (
                                  <span className="text-green-600 font-medium">使用: {suggestion.usage_count}回</span>
                                ) : (
                                  <span>使用: {suggestion.usageCount || 0}回</span>
                                )}
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    発注番号（任意）
                  </label>
                  <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="発注番号"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    オーダー番号（任意）
                  </label>
                  <input
                    type="text"
                    value={internalOrderNumber}
                    onChange={(e) => setInternalOrderNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="オーダー番号"
                  />
                </div>
              </div>
            </div>

            {/* 作業項目入力フォーム（prototype2スタイル） */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>🛠️ 作業項目入力</CardTitle>
                <button
                  type="button"
                  onClick={() => setShowPriceSearchModal(true)}
                  className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Search className="w-4 h-4" />
                  過去価格検索
                </button>
              </CardHeader>
              <CardContent>
                {dictLoading ? (
                  <div className="text-center py-8">
                    <div className="text-gray-600">作業辞書を読み込み中...</div>
                  </div>
                ) : dictError ? (
                  <div className="text-center py-8">
                    <div className="text-red-600">作業辞書の読み込みに失敗しました</div>
                  </div>
                ) : (
                  <div>
                    <Tabs defaultValue="individual">
                      <TabTrigger value="individual">個別作業</TabTrigger>
                      <TabTrigger value="set">セット作業</TabTrigger>
                      
                      <TabContent value="individual">
                        {/* PC: 3列レイアウト（対象・動作・位置） */}
                        <div className="hidden md:grid grid-cols-3 gap-3 items-end mb-4">
                        <div className="relative">
                        <div className="flex items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">対象</span>
                          <HelpTooltip text="入力した対象は確定保存時に対象マスタへ自動登録されます。次回から候補として表示されます。" />
                        </div>
                        <input
                          type="text"
                          value={target}
                          onChange={(e) => {
                            const value = e.target.value
                            setTarget(value)
                            setAction(undefined)
                            setIsTargetConfirmed(false)
                            
                            if (value.trim() && TARGETS) {
                              const filtered = TARGETS.filter(t => 
                                fuzzyMatch(t, value)
                              ).slice(0, 150)
                              setTargetSuggestions(filtered)
                              setShowTargetSuggestions(filtered.length > 0)
                              setSelectedTargetIndex(-1)
                            } else {
                              if (TARGETS) {
                                const startIndex = targetPage * TARGETS_PER_PAGE
                                setTargetSuggestions(TARGETS.slice(startIndex, startIndex + TARGETS_PER_PAGE))
                                setShowTargetSuggestions(true)
                                setSelectedTargetIndex(-1)
                              }
                            }
                          }}
                          onFocus={() => {
                            if (TARGETS) {
                              if (!target.trim()) {
                                const startIndex = targetPage * TARGETS_PER_PAGE
                                setTargetSuggestions(TARGETS.slice(startIndex, startIndex + TARGETS_PER_PAGE))
                              }
                              setShowTargetSuggestions(true)
                            }
                          }}
                          onBlur={() => {
                            // 対象をlocalStorageに自動登録
                            if (target.trim() && targetMasterDb) {
                              targetMasterDb.autoRegisterTarget(target.trim())
                            }
                            setTimeout(() => setShowTargetSuggestions(false), 200)
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'ArrowDown') {
                              e.preventDefault()
                              const newIndex = selectedTargetIndex === -1 ? 0 : Math.min(selectedTargetIndex + 1, targetSuggestions.length - 1)
                              setSelectedTargetIndex(newIndex)
                              // 少し遅延してスクロール実行（スムーズに）
                              setTimeout(() => {
                                if (targetRefs.current[newIndex]) {
                                  scrollToElement(targetRefs.current[newIndex])
                                }
                              }, 50)
                            } else if (e.key === 'ArrowUp') {
                              e.preventDefault()
                              const newIndex = selectedTargetIndex === -1 ? 0 : Math.max(selectedTargetIndex - 1, 0)
                              setSelectedTargetIndex(newIndex)
                              // 少し遅延してスクロール実行（スムーズに）
                              setTimeout(() => {
                                if (targetRefs.current[newIndex]) {
                                  scrollToElement(targetRefs.current[newIndex])
                                }
                              }, 50)
                            } else if (e.key === 'Enter') {
                              e.preventDefault()
                              if (selectedTargetIndex >= 0 && targetSuggestions[selectedTargetIndex]) {
                                setTarget(targetSuggestions[selectedTargetIndex])
                                setIsTargetConfirmed(true)
                                setShowTargetSuggestions(false)
                                setSelectedTargetIndex(-1)
                              } else if (target.trim()) {
                                setIsTargetConfirmed(true)
                                setShowTargetSuggestions(false)
                              }
                            } else if (e.key === 'Escape') {
                              setShowTargetSuggestions(false)
                              setSelectedTargetIndex(-1)
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="対象を入力"
                        />
                        {showTargetSuggestions && targetSuggestions.length > 0 && (
                          <div className="absolute z-20 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto" style={{ width: 'calc(200% + 0.75rem)', minWidth: '400px' }}>
                            {targetSuggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                ref={(el) => { targetRefs.current[index] = el }}
                                type="button"
                                onClick={() => {
                                  setTarget(suggestion)
                                  setIsTargetConfirmed(true)
                                  setShowTargetSuggestions(false)
                                  setSelectedTargetIndex(-1)
                                }}
                                className={`w-full px-3 py-2 text-left first:rounded-t-lg last:rounded-b-lg text-sm ${
                                  index === selectedTargetIndex
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'hover:bg-blue-50'
                                }`}
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="relative">
                        <div className="flex items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">動作</span>
                          <HelpTooltip text="マスタ未登録の動作は確定保存時に「登録待ち」に追加されます。作業辞書から読み仮名を入力してマスタ登録できます。" />
                        </div>
                        <input
                          type="text"
                          value={actionSearch || actions.join('・')}
                          onChange={(e) => {
                            const value = e.target.value
                            setActionSearch(value)

                            if (value.trim() && target && TARGET_ACTIONS && TARGET_ACTIONS[target]) {
                              // 対象に紐づく動作からフィルタ
                              const filtered = TARGET_ACTIONS[target].filter(a => 
                                fuzzyMatch(a, value)
                              ).slice(0, 50)
                              setActionSuggestions(filtered)
                              setShowActionSuggestions(filtered.length > 0)
                              setSelectedActionIndex(-1)
                            } else if (value.trim() && ACTIONS) {
                              // 全動作からフィルタ
                              const filtered = ACTIONS.filter(a => 
                                fuzzyMatch(a, value)
                              ).slice(0, 50)
                              setActionSuggestions(filtered)
                              setShowActionSuggestions(filtered.length > 0)
                              setSelectedActionIndex(-1)
                            } else {
                              setShowActionSuggestions(false)
                            }
                            
                            if (value === '') {
                              setActions([])
                            }
                          }}
                          onFocus={() => {
                            if (!actionSearch && target && TARGET_ACTIONS && TARGET_ACTIONS[target]) {
                              setActionSuggestions(TARGET_ACTIONS[target].slice(0, 50))
                              setShowActionSuggestions(true)
                            } else if (!actionSearch && ACTIONS) {
                              setActionSuggestions(ACTIONS.slice(0, 50))
                              setShowActionSuggestions(true)
                            }
                          }}
                          onBlur={() => setTimeout(() => setShowActionSuggestions(false), 200)}
                          onKeyDown={(e) => {
                            if (e.key === 'ArrowDown') {
                              e.preventDefault()
                              const newIndex = selectedActionIndex === -1 ? 0 : Math.min(selectedActionIndex + 1, actionSuggestions.length - 1)
                              setSelectedActionIndex(newIndex)
                              // 少し遅延してスクロール実行（スムーズに）
                              setTimeout(() => {
                                if (actionRefs.current[newIndex]) {
                                  scrollToElement(actionRefs.current[newIndex])
                                }
                              }, 50)
                            } else if (e.key === 'ArrowUp') {
                              e.preventDefault()
                              const newIndex = selectedActionIndex === -1 ? 0 : Math.max(selectedActionIndex - 1, 0)
                              setSelectedActionIndex(newIndex)
                              // 少し遅延してスクロール実行（スムーズに）
                              setTimeout(() => {
                                if (actionRefs.current[newIndex]) {
                                  scrollToElement(actionRefs.current[newIndex])
                                }
                              }, 50)
                            } else if (e.key === 'Enter') {
                              e.preventDefault()
                              if (selectedActionIndex >= 0 && actionSuggestions[selectedActionIndex]) {
                                const selectedAction = actionSuggestions[selectedActionIndex]
                                setActions([selectedAction])
                                setActionSearch('')
                                setShowActionSuggestions(false)
                                setSelectedActionIndex(-1)
                                handleActionSelect(selectedAction)
                              } else if (actionSearch.trim()) {
                                setActions([actionSearch])
                                setActionSearch('')
                                setShowActionSuggestions(false)
                              }
                            } else if (e.key === 'Escape') {
                              setShowActionSuggestions(false)
                              setSelectedActionIndex(-1)
                              setActionSearch('')
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="動作を検索... （ひらがな・カタカナ・英数字で検索可能）"
                        />
                        {showActionSuggestions && actionSuggestions.length > 0 && (
                          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                            {actionSuggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                ref={(el) => { actionRefs.current[index] = el }}
                                type="button"
                                onClick={() => {
                                  setActions([suggestion])
                                  setActionSearch('')
                                  setShowActionSuggestions(false)
                                  setSelectedActionIndex(-1)
                                  handleActionSelect(suggestion)
                                }}
                                className={`w-full text-left px-3 py-2 hover:bg-blue-50 ${
                                  index === selectedActionIndex
                                    ? 'bg-blue-100 text-blue-900'
                                    : 'text-gray-900'
                                }`}
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="relative">
                        <div className="flex items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">位置</span>
                          <HelpTooltip text="マスタ未登録の位置は確定保存時に「登録待ち」に追加されます。作業辞書から読み仮名を入力してマスタ登録できます。" />
                        </div>
                        <input
                          type="text"
                          value={positionSearch || positions.join('')}
                          onChange={(e) => {
                            const value = e.target.value
                            setPositionSearch(value)

                            if (value.trim() && actions.length > 0 && ACTION_POSITIONS && ACTION_POSITIONS[actions[0]]) {
                              // 動作に紐づく位置からフィルタ
                              const filtered = ACTION_POSITIONS[actions[0]].filter(p => 
                                fuzzyMatch(p, value)
                              ).slice(0, 50)
                              setPositionSuggestions(filtered)
                              setShowPositionSuggestions(filtered.length > 0)
                              setSelectedPositionIndex(-1)
                            } else if (value.trim() && POSITIONS) {
                              // 全位置からフィルタ
                              const filtered = POSITIONS.filter(p => 
                                fuzzyMatch(p, value)
                              ).slice(0, 50)
                              setPositionSuggestions(filtered)
                              setShowPositionSuggestions(filtered.length > 0)
                              setSelectedPositionIndex(-1)
                            } else {
                              setShowPositionSuggestions(false)
                            }
                            
                            if (value === '') {
                              setPositions([])
                            }
                          }}
                          onFocus={() => {
                            if (!positionSearch && actions.length > 0 && ACTION_POSITIONS && ACTION_POSITIONS[actions[0]]) {
                              setPositionSuggestions(ACTION_POSITIONS[actions[0]].slice(0, 50))
                              setShowPositionSuggestions(true)
                            } else if (!positionSearch && POSITIONS) {
                              setPositionSuggestions(POSITIONS.slice(0, 50))
                              setShowPositionSuggestions(true)
                            }
                          }}
                          onBlur={() => setTimeout(() => setShowPositionSuggestions(false), 200)}
                          onKeyDown={(e) => {
                            if (e.key === 'ArrowDown') {
                              e.preventDefault()
                              const newIndex = selectedPositionIndex === -1 ? 0 : Math.min(selectedPositionIndex + 1, positionSuggestions.length - 1)
                              setSelectedPositionIndex(newIndex)
                              // 少し遅延してスクロール実行（スムーズに）
                              setTimeout(() => {
                                if (positionRefs.current[newIndex]) {
                                  scrollToElement(positionRefs.current[newIndex])
                                }
                              }, 50)
                            } else if (e.key === 'ArrowUp') {
                              e.preventDefault()
                              const newIndex = selectedPositionIndex === -1 ? 0 : Math.max(selectedPositionIndex - 1, 0)
                              setSelectedPositionIndex(newIndex)
                              // 少し遅延してスクロール実行（スムーズに）
                              setTimeout(() => {
                                if (positionRefs.current[newIndex]) {
                                  scrollToElement(positionRefs.current[newIndex])
                                }
                              }, 50)
                            } else if (e.key === 'Enter') {
                              e.preventDefault()
                              if (selectedPositionIndex >= 0 && positionSuggestions[selectedPositionIndex]) {
                                const selectedPosition = positionSuggestions[selectedPositionIndex]
                                setPositions([selectedPosition])
                                setPositionSearch('')
                                setShowPositionSuggestions(false)
                                setSelectedPositionIndex(-1)
                              } else if (positionSearch.trim()) {
                                setPositions([positionSearch])
                                setPositionSearch('')
                                setShowPositionSuggestions(false)
                              }
                            } else if (e.key === 'Escape') {
                              setShowPositionSuggestions(false)
                              setSelectedPositionIndex(-1)
                              setPositionSearch('')
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="位置を検索... （ひらがな・カタカナ・英数字で検索可能）"
                        />
                        {showPositionSuggestions && positionSuggestions.length > 0 && (
                          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                            {positionSuggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                ref={(el) => { positionRefs.current[index] = el }}
                                type="button"
                                onClick={() => {
                                  setPositions([suggestion])
                                  setPositionSearch('')
                                  setShowPositionSuggestions(false)
                                  setSelectedPositionIndex(-1)
                                }}
                                className={`w-full text-left px-3 py-2 hover:bg-blue-50 ${
                                  index === selectedPositionIndex
                                    ? 'bg-blue-100 text-blue-900'
                                    : 'text-gray-900'
                                }`}
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* 対象・動作・位置の入力補助パネル（3列レイアウトの下に配置） */}
                    {isTargetConfirmed && target && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-2">動作（クリックで入力）:</div>
                          <div className="flex flex-wrap gap-1">
                            {(TARGET_ACTIONS && TARGET_ACTIONS[target] ? TARGET_ACTIONS[target] : ACTIONS || []).map((a) => {
                              const price = priceBookMap?.[`${target}_${a}`]
                              return (
                                <button
                                  key={a}
                                  type="button"
                                  onClick={() => {
                                    if (a === '（指定なし）') {
                                      // 何もしない（動作未設定のまま進む）
                                      return
                                    } else {
                                      if (actions.includes(a)) {
                                        setActions(actions.filter(act => act !== a))
                                      } else if (actions.length < 3) {
                                        setActions([...actions, a])
                                      }
                                    }
                                  }}
                                  className={`px-2 py-1 text-xs rounded border text-left transition-colors ${
                                    a === '（指定なし）' 
                                      ? (actions.length === 0 
                                        ? "bg-gray-200 border-gray-400 text-gray-700"
                                        : "bg-gray-100 hover:bg-gray-200 border-gray-300")
                                      : (actions.includes(a)
                                        ? "bg-blue-100 border-blue-300 text-blue-800"
                                        : "bg-gray-100 hover:bg-blue-100 border-gray-300")
                                  }`}
                                >
                                  <div>{a}</div>
                                  {price && price > 0 && (
                                    <div className="text-blue-600">¥{price.toLocaleString()}</div>
                                  )}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-2">位置（クリックで入力）:</div>
                          <div className="flex flex-wrap gap-1">
                            {target.trim() ? (
                              (actions.length > 0 && ACTION_POSITIONS && ACTION_POSITIONS[actions[0]] 
                                ? ACTION_POSITIONS[actions[0]] 
                                : POSITIONS || []
                              ).map((p) => (
                                <button
                                  key={p}
                                  type="button"
                                  onClick={() => {
                                    if (positions.includes(p)) {
                                      setPositions(positions.filter(pos => pos !== p))
                                    } else if (positions.length < 5) {
                                      setPositions([...positions, p])
                                    }
                                  }}
                                  className={`px-2 py-1 text-xs rounded border transition-colors ${
                                    positions.includes(p)
                                      ? "bg-blue-500 text-white border-blue-600"
                                      : "bg-gray-100 hover:bg-blue-100 border-gray-300"
                                  }`}
                                >
                                  {p}
                                </button>
                              ))
                            ) : (
                              <div className="text-xs text-gray-500 py-1">まず対象を入力してください</div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* スマホ: 対象・動作を1行、位置・その他を1行 */}
                    <div className="md:hidden space-y-3 mb-4">
                      {/* 1行目: 対象・動作 */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                          <div className="flex items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">対象</span>
                            <HelpTooltip text="入力した対象は確定保存時に対象マスタへ自動登録されます。" />
                          </div>
                          <input
                            type="text"
                            value={target}
                            onChange={(e) => {
                              const value = e.target.value
                              setTarget(value)
                              setAction(undefined)
                              setIsTargetConfirmed(false)
                              
                              if (value.trim() && TARGETS) {
                                const filtered = TARGETS.filter(t => 
                                  fuzzyMatch(t, value)
                                ).slice(0, 150)
                                setTargetSuggestions(filtered)
                                setShowTargetSuggestions(filtered.length > 0)
                                setSelectedTargetIndex(-1)
                              } else {
                                if (TARGETS) {
                                  const startIndex = targetPage * TARGETS_PER_PAGE
                                  setTargetSuggestions(TARGETS.slice(startIndex, startIndex + TARGETS_PER_PAGE))
                                  setShowTargetSuggestions(true)
                                  setSelectedTargetIndex(-1)
                                }
                              }
                            }}
                            onFocus={() => {
                              if (TARGETS) {
                                if (!target.trim()) {
                                  const startIndex = targetPage * TARGETS_PER_PAGE
                                  setTargetSuggestions(TARGETS.slice(startIndex, startIndex + TARGETS_PER_PAGE))
                                }
                                setShowTargetSuggestions(true)
                              }
                            }}
                            onBlur={() => setTimeout(() => setShowTargetSuggestions(false), 200)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="対象を入力"
                          />
                          {showTargetSuggestions && targetSuggestions.length > 0 && (
                            <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto" style={{ minWidth: '300px' }}>
                              {targetSuggestions.map((suggestion, index) => (
                                <button
                                  key={suggestion}
                                  onClick={() => {
                                    setTarget(suggestion)
                                    setIsTargetConfirmed(true)
                                    setShowTargetSuggestions(false)
                                    setSelectedTargetIndex(-1)
                                  }}
                                  className="w-full px-3 py-2 text-left hover:bg-blue-50 first:rounded-t-lg last:rounded-b-lg"
                                >
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">動作</span>
                            <HelpTooltip text="マスタ未登録の動作は確定保存時に「登録待ち」に追加されます。" />
                          </div>
                          <input
                            type="text"
                            value={actions.join('・')}
                            onChange={(e) => {
                              const value = e.target.value
                              if (value === '') {
                                setActions([])
                              } else {
                                setActions(value.split('・').filter(v => v.trim()))
                              }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="直接入力またはボタンで選択（複数は「・」区切り）"
                          />
                        </div>
                      </div>

                      {/* 2行目: 位置・その他 */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="flex items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">位置</span>
                            <HelpTooltip text="マスタ未登録の位置は確定保存時に「登録待ち」に追加されます。" />
                          </div>
                          <input
                            type="text"
                            value={positions.join('')}
                            onChange={(e) => {
                              const value = e.target.value
                              setPositions(value ? [value] : [])
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="直接入力またはボタンで選択"
                          />
                        </div>
                        <div>
                          <div className="flex items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">その他</span>
                            <HelpTooltip text="対象・動作・位置だけでは表現しきれない補足情報（状態、部品の種類、作業の詳細など）を入力します。" />
                          </div>
                          <input
                            type="text"
                            value={workMemo}
                            onChange={(e) => setWorkMemo(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="メモがあれば入力"
                          />
                        </div>
                      </div>
                    </div>

                    {/* PC: 4列レイアウト（その他・単価・数量・追加ボタン） */}
                    <div className="hidden md:grid grid-cols-4 gap-3 items-end mb-4">
                      <div>
                        <div className="flex items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">その他</span>
                          <HelpTooltip text="対象・動作・位置だけでは表現しきれない補足情報（状態、部品の種類、作業の詳細など）を入力します。" />
                        </div>
                        <input
                          type="text"
                          value={workMemo}
                          onChange={(e) => setWorkMemo(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="特記事項、追加情報..."
                        />
                      </div>
                      <div>
                        <SimpleLabel>単価</SimpleLabel>
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={unitPrice}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '')
                            setUnitPrice(value || '0')
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="金額を入力してください"
                        />
                      </div>
                      <div>
                        <SimpleLabel>数量</SimpleLabel>
                        <input
                          type="number"
                          value={qty}
                          onChange={(e) => setQty(Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min="1"
                        />
                      </div>
                      <div className="flex justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setTarget('')
                            setActions([])
                            setPositions([])
                            setWorkMemo('')
                            setUnitPrice('')
                            setQty(1)
                            setIsTargetConfirmed(false)
                          }}
                          className="h-10 w-10 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center justify-center"
                          title="入力をクリア"
                        >
                          ×
                        </button>
                        <button
                          type="button"
                          onClick={addStructured}
                          className="h-10 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 whitespace-nowrap"
                        >
                          追加
                        </button>
                      </div>
                    </div>
                    
                    {/* スマホ: 単価・数量を横並び、追加ボタンを右側 */}
                    <div className="md:hidden mb-4">
                      <div className="grid grid-cols-4 gap-2 items-end">
                        <div>
                          <SimpleLabel>単価</SimpleLabel>
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={unitPrice}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9]/g, '')
                              setUnitPrice(value || '0')
                            }}
                            className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            placeholder="金額"
                          />
                        </div>
                        <div className="w-16">
                          <SimpleLabel>数量</SimpleLabel>
                          <input
                            type="number"
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}
                            className="w-full px-1 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            min="1"
                          />
                        </div>
                        <div>
                          <button
                            type="button"
                            onClick={() => {
                              setTarget('')
                              setActions([])
                              setPositions([])
                              setWorkMemo('')
                              setUnitPrice('')
                              setQty(1)
                              setIsTargetConfirmed(false)
                              // 検索状態もクリア
                              setActionSearch('')
                              setPositionSearch('')
                              setShowActionSuggestions(false)
                              setShowPositionSuggestions(false)
                              setSelectedActionIndex(-1)
                              setSelectedPositionIndex(-1)
                            }}
                            className="h-9 w-9 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center justify-center text-sm"
                            title="入力をクリア"
                          >
                            ×
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            onClick={() => {
                              if (!target) {
                                alert('対象を入力してください')
                                return
                              }
                              if (!action) {
                                alert('動作を選択してください')
                                return
                              }
                              if (Number(unitPrice) <= 0) {
                                alert('単価を正しく入力してください')
                                return
                              }
                              addStructured()
                            }}
                            className="w-full h-11 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-1 font-medium text-sm"
                          >
                            <Plus size={16} />
                            追加
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 金額表示（スマホのみ） */}
                    <div className="md:hidden mb-4">
                      {Number(unitPrice) > 0 && qty > 0 && (
                        <div className="text-center p-2 bg-blue-50 rounded-lg">
                          <span className="text-blue-800 font-medium">
                            金額: ¥{(Number(unitPrice) * qty).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                    
                      
                      {/* 作業名表示（自動生成） */}
                      {target && actions.length > 0 && (
                        <div className="mb-4">
                          <SimpleLabel>作業名プレビュー</SimpleLabel>
                          <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 font-medium">
                            {composedLabel(target, actions, positions, workMemo)}
                          </div>
                        </div>
                      )}
                      
                      {/* 金額プレビュー */}
                      {Number(unitPrice) > 0 && qty > 0 && (
                        <div className="mb-4">
                          <div className="text-lg font-bold text-blue-600">
                            金額: ¥{(Number(unitPrice) * qty).toLocaleString()}
                          </div>
                        </div>
                        )}
                      </TabContent>
                      
                      <TabContent value="set">
                        {/* セット基本情報 */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end mb-4">
                          <div className="md:col-span-2">
                            <div className="flex items-center mb-2">
                              <span className="text-sm font-medium text-gray-700">セット名</span>
                              <HelpTooltip text="複数の作業をまとめて1つの金額で請求する場合に使用します。例：「板金塗装一式」" />
                            </div>
                            <input
                              type="text"
                              value={setName}
                              onChange={(e) => setSetName(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="例: 外装修理セット"
                            />
                          </div>
                          <div>
                            <SimpleLabel>単価</SimpleLabel>
                            <input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              value={setPrice}
                              onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9]/g, '')
                                setSetPrice(value || '')
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="セット価格を入力してください"
                            />
                          </div>
                          <div>
                            <SimpleLabel>数量</SimpleLabel>
                            <input
                              type="number"
                              value={setQuantity}
                              onChange={(e) => setSetQuantity(Number(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              min="1"
                            />
                          </div>
                        </div>

                        {/* セット明細入力 */}
                        <div className="mb-4">
                          <div className="flex items-center mb-2">
                            <h4 className="text-sm font-medium text-gray-700">セット明細</h4>
                            <HelpTooltip text="セットに含まれる作業の詳細を入力します。対象・動作・位置を入力して「追加」してください。" />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-start mb-2">
                            <div className="relative">
                              <div className="flex items-center mb-2">
                                <span className="text-sm font-medium text-gray-700">対象</span>
                                <HelpTooltip text="入力した対象は確定保存時に対象マスタへ自動登録されます。" />
                              </div>
                              <input
                                type="text"
                                value={detailTarget}
                                onChange={(e) => {
                                  const value = e.target.value
                                  setDetailTarget(value)
                                  setIsDetailTargetConfirmed(false)
                                  
                                  if (value.trim() && TARGETS) {
                                    const filtered = TARGETS.filter(t => 
                                      fuzzyMatch(t, value)
                                    ).slice(0, 150)
                                    setDetailTargetSuggestions(filtered)
                                    setShowDetailTargetSuggestions(filtered.length > 0)
                                    setSelectedDetailTargetIndex(-1)
                                  } else {
                                    setShowDetailTargetSuggestions(false)
                                  }
                                }}
                                onFocus={() => {
                                  if (TARGETS && !detailTarget.trim()) {
                                    setDetailTargetSuggestions(TARGETS.slice(0, 150))
                                    setShowDetailTargetSuggestions(true)
                                    setSelectedDetailTargetIndex(-1)
                                  }
                                }}
                                onBlur={() => setTimeout(() => setShowDetailTargetSuggestions(false), 200)}
                                onKeyDown={(e) => {
                                  if (e.key === 'ArrowDown') {
                                    e.preventDefault()
                                    const newIndex = selectedDetailTargetIndex === -1 ? 0 : Math.min(selectedDetailTargetIndex + 1, detailTargetSuggestions.length - 1)
                                    setSelectedDetailTargetIndex(newIndex)
                                    // スクロール実行
                                    setTimeout(() => {
                                      if (detailTargetRefs.current[newIndex]) {
                                        scrollToElement(detailTargetRefs.current[newIndex])
                                      }
                                    }, 50)
                                  } else if (e.key === 'ArrowUp') {
                                    e.preventDefault()
                                    const newIndex = selectedDetailTargetIndex === -1 ? 0 : Math.max(selectedDetailTargetIndex - 1, 0)
                                    setSelectedDetailTargetIndex(newIndex)
                                    // スクロール実行
                                    setTimeout(() => {
                                      if (detailTargetRefs.current[newIndex]) {
                                        scrollToElement(detailTargetRefs.current[newIndex])
                                      }
                                    }, 50)
                                  } else if (e.key === 'Enter') {
                                    e.preventDefault()
                                    if (selectedDetailTargetIndex >= 0 && detailTargetSuggestions[selectedDetailTargetIndex]) {
                                      setDetailTarget(detailTargetSuggestions[selectedDetailTargetIndex])
                                      setShowDetailTargetSuggestions(false)
                                      setSelectedDetailTargetIndex(-1)
                                    }
                                  } else if (e.key === 'Escape') {
                                    setShowDetailTargetSuggestions(false)
                                    setSelectedDetailTargetIndex(-1)
                                  }
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder="明細の対象"
                              />
                              {showDetailTargetSuggestions && detailTargetSuggestions.length > 0 && (
                                <div className="absolute z-30 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto" style={{ width: 'calc(200% + 0.75rem)', minWidth: '400px' }}>
                                  {detailTargetSuggestions.map((suggestion, index) => (
                                    <button
                                      key={index}
                                      ref={(el) => { detailTargetRefs.current[index] = el }}
                                      type="button"
                                      onClick={() => {
                                        setDetailTarget(suggestion)
                                        setIsDetailTargetConfirmed(true)
                                        setShowDetailTargetSuggestions(false)
                                        setSelectedDetailTargetIndex(-1)
                                      }}
                                      className={`w-full px-3 py-2 text-left first:rounded-t-lg last:rounded-b-lg text-sm ${
                                        index === selectedDetailTargetIndex
                                          ? 'bg-blue-100 text-blue-800'
                                          : 'hover:bg-blue-50'
                                      }`}
                                    >
                                      {suggestion}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="relative">
                              <div className="flex items-center mb-2">
                                <span className="text-sm font-medium text-gray-700">動作</span>
                                <HelpTooltip text="マスタ未登録の動作は確定保存時に「登録待ち」に追加されます。" />
                              </div>
                              <input
                                type="text"
                                value={detailActionSearch || detailActions.join('・')}
                                onChange={(e) => {
                                  const value = e.target.value
                                  setDetailActionSearch(value)

                                  if (value.trim() && detailTarget && TARGET_ACTIONS && TARGET_ACTIONS[detailTarget]) {
                                    // 対象に紐づく動作からフィルタ
                                    const filtered = TARGET_ACTIONS[detailTarget].filter(a => 
                                      fuzzyMatch(a, value)
                                    ).slice(0, 50)
                                    setDetailActionSuggestions(filtered)
                                    setShowDetailActionSuggestions(filtered.length > 0)
                                    setSelectedDetailActionIndex(-1)
                                  } else if (value.trim() && ACTIONS) {
                                    // 全動作からフィルタ
                                    const filtered = ACTIONS.filter(a => 
                                      fuzzyMatch(a, value)
                                    ).slice(0, 50)
                                    setDetailActionSuggestions(filtered)
                                    setShowDetailActionSuggestions(filtered.length > 0)
                                    setSelectedDetailActionIndex(-1)
                                  } else {
                                    setShowDetailActionSuggestions(false)
                                  }
                                  
                                  if (value === '') {
                                    setDetailActions([])
                                  }
                                }}
                                onFocus={() => {
                                  if (!detailActionSearch && detailTarget && TARGET_ACTIONS && TARGET_ACTIONS[detailTarget]) {
                                    setDetailActionSuggestions(TARGET_ACTIONS[detailTarget].slice(0, 50))
                                    setShowDetailActionSuggestions(true)
                                  } else if (!detailActionSearch && ACTIONS) {
                                    setDetailActionSuggestions(ACTIONS.slice(0, 50))
                                    setShowDetailActionSuggestions(true)
                                  }
                                }}
                                onBlur={() => setTimeout(() => setShowDetailActionSuggestions(false), 200)}
                                onKeyDown={(e) => {
                                  if (e.key === 'ArrowDown') {
                                    e.preventDefault()
                                    const newIndex = selectedDetailActionIndex === -1 ? 0 : Math.min(selectedDetailActionIndex + 1, detailActionSuggestions.length - 1)
                                    setSelectedDetailActionIndex(newIndex)
                                    // スクロール実行
                                    setTimeout(() => {
                                      if (detailActionRefs.current[newIndex]) {
                                        scrollToElement(detailActionRefs.current[newIndex])
                                      }
                                    }, 50)
                                  } else if (e.key === 'ArrowUp') {
                                    e.preventDefault()
                                    const newIndex = selectedDetailActionIndex === -1 ? 0 : Math.max(selectedDetailActionIndex - 1, 0)
                                    setSelectedDetailActionIndex(newIndex)
                                    // スクロール実行
                                    setTimeout(() => {
                                      if (detailActionRefs.current[newIndex]) {
                                        scrollToElement(detailActionRefs.current[newIndex])
                                      }
                                    }, 50)
                                  } else if (e.key === 'Enter') {
                                    e.preventDefault()
                                    if (selectedDetailActionIndex >= 0 && detailActionSuggestions[selectedDetailActionIndex]) {
                                      const selectedAction = detailActionSuggestions[selectedDetailActionIndex]
                                      setDetailActions([selectedAction])
                                      setDetailActionSearch('')
                                      setShowDetailActionSuggestions(false)
                                      setSelectedDetailActionIndex(-1)
                                    } else if (detailActionSearch.trim()) {
                                      setDetailActions([detailActionSearch])
                                      setDetailActionSearch('')
                                      setShowDetailActionSuggestions(false)
                                    }
                                  } else if (e.key === 'Escape') {
                                    setShowDetailActionSuggestions(false)
                                    setSelectedDetailActionIndex(-1)
                                    setDetailActionSearch('')
                                  }
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder="動作を検索... （ひらがな・カタカナ・英数字で検索可能）"
                              />
                              {showDetailActionSuggestions && detailActionSuggestions.length > 0 && (
                                <div className="absolute z-30 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                                  {detailActionSuggestions.map((suggestion, index) => (
                                    <button
                                      key={index}
                                      ref={(el) => { detailActionRefs.current[index] = el }}
                                      type="button"
                                      onClick={() => {
                                        setDetailActions([suggestion])
                                        setDetailActionSearch('')
                                        setShowDetailActionSuggestions(false)
                                        setSelectedDetailActionIndex(-1)
                                      }}
                                      className={`w-full text-left px-3 py-2 hover:bg-blue-50 text-sm ${
                                        index === selectedDetailActionIndex
                                          ? 'bg-blue-100 text-blue-900'
                                          : 'text-gray-900'
                                      }`}
                                    >
                                      {suggestion}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="relative">
                              <div className="flex items-center mb-2">
                                <span className="text-sm font-medium text-gray-700">位置</span>
                                <HelpTooltip text="マスタ未登録の位置は確定保存時に「登録待ち」に追加されます。" />
                              </div>
                              <input
                                type="text"
                                value={detailPositionSearch || detailPositions.join('')}
                                onChange={(e) => {
                                  const value = e.target.value
                                  setDetailPositionSearch(value)

                                  if (value.trim() && detailActions.length > 0 && ACTION_POSITIONS && ACTION_POSITIONS[detailActions[0]]) {
                                    // 動作に紐づく位置からフィルタ
                                    const filtered = ACTION_POSITIONS[detailActions[0]].filter(p => 
                                      fuzzyMatch(p, value)
                                    ).slice(0, 50)
                                    setDetailPositionSuggestions(filtered)
                                    setShowDetailPositionSuggestions(filtered.length > 0)
                                    setSelectedDetailPositionIndex(-1)
                                  } else if (value.trim() && POSITIONS) {
                                    // 全位置からフィルタ
                                    const filtered = POSITIONS.filter(p => 
                                      fuzzyMatch(p, value)
                                    ).slice(0, 50)
                                    setDetailPositionSuggestions(filtered)
                                    setShowDetailPositionSuggestions(filtered.length > 0)
                                    setSelectedDetailPositionIndex(-1)
                                  } else {
                                    setShowDetailPositionSuggestions(false)
                                  }
                                  
                                  if (value === '') {
                                    setDetailPositions([])
                                  }
                                }}
                                onFocus={() => {
                                  if (!detailPositionSearch && detailActions.length > 0 && ACTION_POSITIONS && ACTION_POSITIONS[detailActions[0]]) {
                                    setDetailPositionSuggestions(ACTION_POSITIONS[detailActions[0]].slice(0, 50))
                                    setShowDetailPositionSuggestions(true)
                                  } else if (!detailPositionSearch && POSITIONS) {
                                    setDetailPositionSuggestions(POSITIONS.slice(0, 50))
                                    setShowDetailPositionSuggestions(true)
                                  }
                                }}
                                onBlur={() => setTimeout(() => setShowDetailPositionSuggestions(false), 200)}
                                onKeyDown={(e) => {
                                  if (e.key === 'ArrowDown') {
                                    e.preventDefault()
                                    const newIndex = selectedDetailPositionIndex === -1 ? 0 : Math.min(selectedDetailPositionIndex + 1, detailPositionSuggestions.length - 1)
                                    setSelectedDetailPositionIndex(newIndex)
                                    // スクロール実行
                                    setTimeout(() => {
                                      if (detailPositionRefs.current[newIndex]) {
                                        scrollToElement(detailPositionRefs.current[newIndex])
                                      }
                                    }, 50)
                                  } else if (e.key === 'ArrowUp') {
                                    e.preventDefault()
                                    const newIndex = selectedDetailPositionIndex === -1 ? 0 : Math.max(selectedDetailPositionIndex - 1, 0)
                                    setSelectedDetailPositionIndex(newIndex)
                                    // スクロール実行
                                    setTimeout(() => {
                                      if (detailPositionRefs.current[newIndex]) {
                                        scrollToElement(detailPositionRefs.current[newIndex])
                                      }
                                    }, 50)
                                  } else if (e.key === 'Enter') {
                                    e.preventDefault()
                                    if (selectedDetailPositionIndex >= 0 && detailPositionSuggestions[selectedDetailPositionIndex]) {
                                      const selectedPosition = detailPositionSuggestions[selectedDetailPositionIndex]
                                      setDetailPositions([selectedPosition])
                                      setDetailPositionSearch('')
                                      setShowDetailPositionSuggestions(false)
                                      setSelectedDetailPositionIndex(-1)
                                    } else if (detailPositionSearch.trim()) {
                                      setDetailPositions([detailPositionSearch])
                                      setDetailPositionSearch('')
                                      setShowDetailPositionSuggestions(false)
                                    }
                                  } else if (e.key === 'Escape') {
                                    setShowDetailPositionSuggestions(false)
                                    setSelectedDetailPositionIndex(-1)
                                    setDetailPositionSearch('')
                                  }
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder="位置を検索... （ひらがな・カタカナ・英数字で検索可能）"
                              />
                              {showDetailPositionSuggestions && detailPositionSuggestions.length > 0 && (
                                <div className="absolute z-30 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                                  {detailPositionSuggestions.map((suggestion, index) => (
                                    <button
                                      key={index}
                                      ref={(el) => { detailPositionRefs.current[index] = el }}
                                      type="button"
                                      onClick={() => {
                                        setDetailPositions([suggestion])
                                        setDetailPositionSearch('')
                                        setShowDetailPositionSuggestions(false)
                                        setSelectedDetailPositionIndex(-1)
                                      }}
                                      className={`w-full text-left px-3 py-2 hover:bg-blue-50 text-sm ${
                                        index === selectedDetailPositionIndex
                                          ? 'bg-blue-100 text-blue-900'
                                          : 'text-gray-900'
                                      }`}
                                    >
                                      {suggestion}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center mb-2">
                                <span className="text-sm font-medium text-gray-700">その他</span>
                                <HelpTooltip text="対象・動作・位置だけでは表現しきれない補足情報（状態、部品の種類、作業の詳細など）を入力します。" />
                              </div>
                              <input
                                type="text"
                                value={detailOther}
                                onChange={(e) => setDetailOther(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder="その他"
                              />
                            </div>
                            <div className="w-20">
                              <SimpleLabel>数量</SimpleLabel>
                              <input
                                type="number"
                                value={detailQuantity}
                                onChange={(e) => setDetailQuantity(Number(e.target.value) || 1)}
                                className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder="1"
                                min="1"
                              />
                            </div>
                            <div className="flex justify-center items-end gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setDetailTarget('')
                                  setDetailActions([])
                                  setDetailPositions([])
                                  setDetailOther('')
                                  setDetailQuantity(1)
                                  // 検索状態もクリア
                                  setDetailActionSearch('')
                                  setDetailPositionSearch('')
                                  setShowDetailActionSuggestions(false)
                                  setShowDetailPositionSuggestions(false)
                                  setSelectedDetailActionIndex(-1)
                                  setSelectedDetailPositionIndex(-1)
                                  setShowDetailTargetSuggestions(false)
                                  setSelectedDetailTargetIndex(-1)
                                  setIsDetailTargetConfirmed(false)
                                }}
                                className="h-9 w-9 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm mt-6 flex items-center justify-center"
                                title="入力をクリア"
                              >
                                ×
                              </button>
                              <button
                                type="button"
                                onClick={addSetDetail}
                                disabled={!detailTarget.trim()}
                                className="h-9 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 text-sm mt-6 whitespace-nowrap"
                              >
                                明細追加
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* セット明細の入力補助ボタン */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <div className="text-sm font-medium text-gray-700 mb-2">動作（クリックで入力）:</div>
                            <div className="flex flex-wrap gap-1">
                              {(detailTarget && TARGET_ACTIONS && TARGET_ACTIONS[detailTarget] ? TARGET_ACTIONS[detailTarget] : ACTIONS || []).map((a) => {
                                const price = priceBookMap?.[`${detailTarget}_${a}`]
                                return (
                                  <button
                                    key={a}
                                    type="button"
                                    onClick={() => {
                                      if (a === '（指定なし）') {
                                        // 何もしない（動作未設定のまま進む）
                                        return
                                      } else {
                                        if (detailActions.includes(a)) {
                                          setDetailActions(detailActions.filter(act => act !== a))
                                        } else if (detailActions.length < 3) {
                                          setDetailActions([...detailActions, a])
                                        }
                                      }
                                    }}
                                    className={`px-2 py-1 text-xs rounded border text-left transition-colors ${
                                      a === '（指定なし）' 
                                        ? (detailActions.length === 0 
                                          ? "bg-gray-200 border-gray-400 text-gray-700"
                                          : "bg-gray-100 hover:bg-gray-200 border-gray-300")
                                        : (detailActions.includes(a)
                                          ? "bg-blue-100 border-blue-300 text-blue-800"
                                          : "bg-gray-100 hover:bg-blue-100 border-gray-300")
                                    }`}
                                  >
                                    <div>{a}</div>
                                    {price && price > 0 && (
                                      <div className="text-blue-600">¥{price.toLocaleString()}</div>
                                    )}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-700 mb-2">位置（クリックで入力）:</div>
                            <div className="flex flex-wrap gap-1 min-h-[2rem]">
                              {detailTarget.trim() ? (
                                (detailActions.length > 0 && ACTION_POSITIONS && ACTION_POSITIONS[detailActions[0]] 
                                  ? ACTION_POSITIONS[detailActions[0]] 
                                  : POSITIONS || []
                                ).map((p) => (
                                  <button
                                    key={p}
                                    type="button"
                                    onClick={() => {
                                      if (detailPositions.includes(p)) {
                                        setDetailPositions(detailPositions.filter(pos => pos !== p))
                                      } else if (detailPositions.length < 5) {
                                        setDetailPositions([...detailPositions, p])
                                      }
                                    }}
                                    className={`px-2 py-1 text-xs rounded border transition-colors ${
                                      detailPositions.includes(p)
                                        ? "bg-blue-500 text-white border-blue-600"
                                        : "bg-gray-100 hover:bg-blue-100 border-gray-300"
                                    }`}
                                  >
                                    {p}
                                  </button>
                                ))
                              ) : (
                                <div className="text-xs text-gray-500 py-1">まず対象を入力してください</div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* セット明細プレビュー */}
                        {detailTarget.trim() && (
                          <div className="mb-4">
                            <SimpleLabel>明細プレビュー</SimpleLabel>
                            <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 font-medium">
                              {composedLabel(detailTarget, detailActions, detailPositions, detailOther)}
                              {detailQuantity > 1 && (
                                <span className="bg-gray-300 px-1 rounded text-xs ml-2">
                                  数量: {detailQuantity}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* セット追加ボタン */}
                        <div className="flex justify-center mb-4">
                          <button
                            type="button"
                            onClick={addSet}
                            disabled={!setName.trim() || setDetails.length === 0}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                          >
                            セット追加
                          </button>
                        </div>
                      
                      {/* セット詳細一覧 */}
                      {setDetails.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">セット詳細 ({setDetails.length}件)</h4>
                          <div className="space-y-2">
                          {setDetails.map((detail, index) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span>{detail.label}</span>
                                  {detail.quantity && detail.quantity >= 1 && (
                                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                                      数量: {detail.quantity}
                                    </span>
                                  )}
                                </div>
                                {detail.unitPrice != null && detail.unitPrice > 0 && (
                                  <div className="text-xs text-blue-600 mt-1">
                                    ¥{detail.unitPrice.toLocaleString()}
                                  </div>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const newDetails = setDetails.filter((_, i) => i !== index)
                                  setSetDetails(newDetails)
                                  // セット価格を再計算
                                  const newTotalPrice = newDetails.reduce((sum, d) => sum + (d.unitPrice || 0), 0)
                                  setSetPrice(newTotalPrice.toString())
                                }}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                          </div>
                        </div>
                      )}
                      </TabContent>
                    </Tabs>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* 作業明細一覧 */}
            {workItems.length > 0 && (
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>📋 作業明細一覧 ({workItems.length}件)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {workItems.map((item, index) => (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-sm font-semibold text-white px-2 py-1 rounded ${
                                item.type === 'set' ? 'bg-blue-600' : 'bg-green-600'
                              }`}>
                                {item.type === 'set' ? 'セット' : '個別'}
                              </span>
                              <h4 className="text-lg font-semibold text-gray-800">{item.work_name}</h4>
                              {item.positions && item.positions.length > 0 && (
                                <span className="text-sm text-gray-600 bg-gray-200 px-2 py-1 rounded">
                                  {combinePositions(item.positions)}
                                </span>
                              )}
                            </div>
                            
                            {item.type === 'set' && item.set_details && (
                              <div className="ml-4 mb-2">
                                <div className="text-sm text-gray-600 mb-1">セット詳細:</div>
                                <ul className="text-sm text-gray-700 list-disc list-inside">
                                  {item.set_details.map((detail, detailIndex) => (
                                    <li key={detailIndex} className="flex items-center gap-2">
                                      <span>{detail}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                              <div>単価: ¥{(item.unit_price || 0).toLocaleString()}</div>
                              <div>数量: {item.quantity || 0}</div>
                              <div className="text-lg font-bold text-blue-600">
                                金額: ¥{(item.amount || 0).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => setWorkItems(prev => prev.filter(i => i.id !== item.id))}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded transition-colors ml-4"
                            title="この項目を削除"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* メモ */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">📝 メモ</h2>
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                placeholder="請求書に関するメモ（任意）"
              />
            </div>
          </div>

          {/* 金額サマリー */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                <Calculator size={20} className="text-blue-600" />
                💰 金額計算
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3">
                  <span className="text-lg font-bold">合計（内税）:</span>
                  <span className="text-xl font-bold text-blue-600">¥{totalAmount.toLocaleString()}</span>
                </div>
                <hr className="border-gray-300" />
                <div className="flex justify-between items-center py-2 text-sm">
                  <span className="text-gray-600">うち消費税 (10%):</span>
                  <span className="font-medium">¥{taxAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 text-sm">
                  <span className="text-gray-600">本体価格:</span>
                  <span className="font-medium">¥{subtotal.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">作業項目数</h3>
                <p className="text-2xl font-bold text-gray-800">{workItems.length}件</p>
              </div>

              {workItems.length > 1 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">平均単価</h3>
                  <p className="text-lg font-semibold text-gray-600">
                    ¥{workItems.length > 0 ? Math.round(subtotal / workItems.length).toLocaleString() : 0}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 下部の保存ボタン */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleSave(true)}
              className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center gap-2 font-medium text-lg"
            >
              <Save size={24} />
              下書き保存
            </button>
            <button
              onClick={() => handleSave(false)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium text-lg"
            >
              <Save size={24} />
              確定保存
            </button>
          </div>
          <p className="text-center text-sm text-gray-500 mt-3">
            下書き保存: 後で編集可能 | 確定保存: 請求書として完成
          </p>
        </div>
      </div>

      {/* 年月変更確認ダイアログ */}
      {dateWarningDialog.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">年月の確認</h3>
            </div>
            <p className="text-gray-700 whitespace-pre-line mb-6">
              {dateWarningDialog.message}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDateWarningDialog({ show: false, message: '', onConfirm: () => {} })}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                キャンセル
              </button>
              <button
                onClick={dateWarningDialog.onConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                はい、続ける
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 作業価格検索モーダル */}
      {showPriceSearchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* ヘッダー */}
            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">過去の作業価格検索</h2>
              <button
                onClick={() => {
                  setShowPriceSearchModal(false)
                  setPriceSearchKeyword('')
                  setPriceSearchSubject('')
                  setPriceSearchResults([])
                  setSelectedPriceInvoice(null)
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {/* 検索入力 */}
            <div className="px-6 py-4 border-b">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">作業名</label>
                  <input
                    type="text"
                    value={priceSearchKeyword}
                    onChange={(e) => setPriceSearchKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && searchPrices()}
                    placeholder="例: フェンダー、バンパー"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">件名</label>
                  <input
                    type="text"
                    value={priceSearchSubject}
                    onChange={(e) => setPriceSearchSubject(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && searchPrices()}
                    placeholder="例: 会社名"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={searchPrices}
                  disabled={priceSearchLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  {priceSearchLoading ? '検索中...' : '検索'}
                </button>
              </div>
            </div>

            {/* 検索結果 */}
            <div className="flex-1 overflow-auto px-6 py-4">
              {priceSearchResults.length === 0 && !priceSearchLoading && (
                <p className="text-gray-500 text-center py-8">
                  {(priceSearchKeyword || priceSearchSubject) ? '検索結果がありません' : '作業名または件名を入力して検索してください'}
                </p>
              )}

              {priceSearchResults.length > 0 && !selectedPriceInvoice && (
                <div className="overflow-x-auto">
                  <p className="text-sm text-gray-600 mb-2">※ 行をクリックすると請求書の全明細を確認できます</p>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">請求日</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">種別</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">件名</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作業名</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">数量</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">単価</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">金額</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {priceSearchResults.map((result, index) => (
                        <tr
                          key={`${result.invoice_id}-${index}`}
                          className="hover:bg-blue-50 cursor-pointer transition-colors"
                          onClick={() => fetchPriceInvoiceDetail(result.invoice_id)}
                        >
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                            {result.issue_date ? new Date(result.issue_date).toLocaleDateString('ja-JP') : '-'}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              result.task_type === 'S' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                            }`}>
                              {result.task_type === 'S' ? 'セット' : '個別'}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-900 max-w-[150px] truncate" title={result.subject || ''}>
                            {result.subject || '-'}
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-900 max-w-[250px]">
                            <div className="truncate" title={result.raw_label_part || result.work_name}>
                              {result.raw_label_part || result.work_name}
                            </div>
                            {result.set_details && result.set_details.length > 0 && (
                              <div className="text-xs text-gray-500 mt-0.5 truncate" title={result.set_details.join(' / ')}>
                                {result.set_details.join(' / ')}
                              </div>
                            )}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                            {result.quantity}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                            ¥{result.unit_price.toLocaleString()}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                            ¥{(result.unit_price * result.quantity).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="text-sm text-gray-500 mt-2 text-right">
                    {priceSearchResults.length}件の結果
                  </p>
                </div>
              )}

              {/* 請求書詳細表示 */}
              {selectedPriceInvoice && (
                <div>
                  <button
                    onClick={() => setSelectedPriceInvoice(null)}
                    className="mb-4 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-1"
                  >
                    ← 検索結果に戻る
                  </button>

                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">請求書番号:</span>
                        <span className="ml-2 font-medium">{selectedPriceInvoice.invoice_id}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">請求日:</span>
                        <span className="ml-2 font-medium">
                          {selectedPriceInvoice.issue_date ? new Date(selectedPriceInvoice.issue_date).toLocaleDateString('ja-JP') : '-'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">顧客名:</span>
                        <span className="ml-2 font-medium">{selectedPriceInvoice.customer_name || '-'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">件名:</span>
                        <span className="ml-2 font-medium">{selectedPriceInvoice.subject || '-'}</span>
                      </div>
                    </div>
                  </div>

                  <h4 className="font-medium text-gray-800 mb-2">明細一覧</h4>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">種別</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作業名</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">数量</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">単価</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">金額</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedPriceInvoice.line_items.map((item, index) => (
                        <tr
                          key={`${item.line_no}-${item.sub_no}`}
                          className={`hover:bg-gray-50 ${item.is_set_detail ? 'bg-gray-50' : ''}`}
                        >
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                            {item.is_set_detail ? '' : item.line_no}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">
                            {item.is_set_detail ? (
                              <span className="text-xs text-gray-400 ml-2">└</span>
                            ) : (
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                item.task_type === 'S' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                              }`}>
                                {item.task_type === 'S' ? 'セット' : '個別'}
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-900">
                            {item.is_set_detail ? (
                              <span className="pl-4 text-gray-600">{item.raw_label_part || item.raw_label}</span>
                            ) : item.set_name ? (
                              <span className="font-medium">{item.set_name}</span>
                            ) : (
                              item.raw_label
                            )}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                            {item.is_set_detail ? '' : item.quantity}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                            {item.is_set_detail ? '' : `¥${item.unit_price.toLocaleString()}`}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                            {item.is_set_detail ? '' : `¥${item.amount.toLocaleString()}`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={5} className="px-3 py-2 text-sm font-medium text-right">合計:</td>
                        <td className="px-3 py-2 text-sm font-bold text-right text-blue-600">
                          ¥{selectedPriceInvoice.line_items
                            .filter(item => !item.is_set_detail)
                            .reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}

              {priceDetailLoading && (
                <div className="text-center py-8">
                  <p className="text-gray-500">読み込み中...</p>
                </div>
              )}
            </div>

            {/* フッター */}
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
              <button
                onClick={() => {
                  setShowPriceSearchModal(false)
                  setPriceSearchKeyword('')
                  setPriceSearchSubject('')
                  setPriceSearchResults([])
                  setSelectedPriceInvoice(null)
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function InvoiceCreatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-center"><p className="text-lg text-gray-600">請求書作成画面を読み込み中...</p></div></div>}>
      <InvoiceCreateContent />
    </Suspense>
  )
}