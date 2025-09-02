'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Trash2, Save, Search, Calculator } from 'lucide-react'

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

export default function InvoiceCreatePage() {
  const router = useRouter()
  const [db, setDb] = useState<WorkHistoryDB | null>(null)
  const [categoryDb, setCategoryDb] = useState<CustomerCategoryDB | null>(null)
  const [subjectDb, setSubjectDb] = useState<SubjectMasterDB | null>(null)
  const [registrationDb, setRegistrationDb] = useState<RegistrationMasterDB | null>(null)
  
  // 基本情報の状態
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
  
  // 作業項目の状態
  const [workItems, setWorkItems] = useState<WorkItem[]>([
    { id: 1, type: 'individual', work_name: '', unit_price: 0, quantity: 1, amount: 0, memo: '', set_details: [] }
  ])
  
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
  
  // クライアントサイドでDBを初期化
  useEffect(() => {
    setDb(new WorkHistoryDB())
    const catDb = new CustomerCategoryDB()
    setCategoryDb(catDb)
    const categories = catDb.getCategories()
    setCustomerCategories(categories)
    
    // 件名・登録番号マスターDB初期化
    setSubjectDb(new SubjectMasterDB())
    setRegistrationDb(new RegistrationMasterDB())
    
    // 初期選択したカテゴリーの会社名を設定
    const initialCategory = catDb.getCategoryById('ud')
    if (initialCategory && initialCategory.companyName) {
      setCustomerName(initialCategory.companyName)
    }
  }, [])

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
    setSelectedPositions(prev => ({ ...prev, [newId]: [] }))
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

  // セット詳細追加
  const addSetDetail = (itemId: number) => {
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
  
  // 位置選択ハンドラー
  const handlePositionSelect = (itemId: number, position: string) => {
    setSelectedPositions(prev => {
      const itemPositions = prev[itemId] || [];
      const newSelected = itemPositions.includes(position) 
        ? itemPositions.filter(p => p !== position)
        : [...itemPositions, position];
      
      const combined = combinePositions(newSelected);
      
      setWorkItems(prevItems => prevItems.map(item =>
        item.id === itemId ? { ...item, position: combined } : item
      ));
      
      return { ...prev, [itemId]: newSelected };
    });
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
  const handleSave = (isDraft = true) => {
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
      if (typeof window !== 'undefined') {
        // 請求書データを保存
        const existingInvoices = JSON.parse(localStorage.getItem('bankin_invoices') || '[]')
        const newInvoice = {
          id: Date.now(),
          ...invoiceData,
          created_at: new Date().toISOString(),
          status: isDraft ? 'draft' : 'finalized'
        }
        existingInvoices.push(newInvoice)
        localStorage.setItem('bankin_invoices', JSON.stringify(existingInvoices))
        
        alert(isDraft ? '請求書を下書き保存しました' : '請求書を確定保存しました')
        router.push('/invoice-list')
      }
    } catch (error) {
      alert('保存に失敗しました')
      console.error('Save error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <header className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">請求書作成</h1>
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
                <ArrowLeft size={20} />
                戻る
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* メインフォーム */}
          <div className="lg:col-span-2 space-y-6">
            {/* 基本情報 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-6 text-gray-800">📋 基本情報</h2>
              
              {/* 年月・日付セクション */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    請求データ年月 <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => adjustMonth(-1)}
                      className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors"
                    >
                      前月
                    </button>
                    <div className="flex gap-1 flex-1">
                      <select
                        value={invoiceYear}
                        onChange={(e) => setInvoiceYear(Number(e.target.value))}
                        className="flex-1 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                      <span className="py-2 text-gray-500">年</span>
                      <select
                        value={invoiceMonth}
                        onChange={(e) => setInvoiceMonth(Number(e.target.value))}
                        className="flex-1 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                          <option key={month} value={month}>{month}</option>
                        ))}
                      </select>
                      <span className="py-2 text-gray-500">月</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => adjustMonth(1)}
                      className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors"
                    >
                      次月
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    請求日（発行日） <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => adjustBillingDate(-1)}
                      className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors"
                    >
                      前日
                    </button>
                    <input
                      type="date"
                      value={billingDate}
                      onChange={(e) => setBillingDate(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={setBillingDateToday}
                      className="px-2 py-1 bg-blue-100 hover:bg-blue-200 rounded text-sm transition-colors"
                    >
                      今日
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustBillingDate(1)}
                      className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors"
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
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => handleCustomerNameChange(e.target.value)}
                    onBlur={() => setTimeout(() => setShowCustomerSuggestions(false), 200)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={
                      customerCategory === 'other' 
                        ? '顧客名を入力してください' 
                        : customerCategories.find(cat => cat.id === customerCategory)?.companyName || '顧客名を入力してください'
                    }
                    required
                    disabled={customerCategory !== 'other' && customerCategories.find(cat => cat.id === customerCategory)?.companyName}
                  />
                  {showCustomerSuggestions && customerSuggestions.length > 0 && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
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
                      <span className="text-xs text-gray-500 ml-2">（顧客名から自動入力されます。変更可能）</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => router.push('/subject-settings')}
                      className="text-xs text-blue-600 hover:text-blue-800 underline"
                    >
                      件名設定
                    </button>
                  </div>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => {
                      setSubject(e.target.value)
                      if (subjectDb && e.target.value.trim()) {
                        const suggestions = subjectDb.searchSubjects(e.target.value)
                        setSubjectSuggestions(suggestions)
                        setShowSubjectSuggestions(suggestions.length > 0)
                      } else {
                        setShowSubjectSuggestions(false)
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
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {subjectSuggestions.map((suggestion, index) => (
                        <button
                          key={suggestion.id}
                          type="button"
                          onClick={() => {
                            setSubject(suggestion.subjectName)
                            setShowSubjectSuggestions(false)
                            // 使用回数を増やす
                            if (subjectDb) {
                              subjectDb.autoRegisterSubject(suggestion.subjectName)
                            }
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-blue-50 first:rounded-t-lg last:rounded-b-lg text-sm border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{suggestion.subjectName}</span>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              {suggestion.category && (
                                <span className="bg-gray-100 px-2 py-1 rounded">{suggestion.category}</span>
                              )}
                              <span>使用: {suggestion.usageCount}回</span>
                            </div>
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
                    onChange={(e) => {
                      setRegistrationNumber(e.target.value)
                      if (registrationDb && e.target.value.trim()) {
                        const suggestions = registrationDb.searchRegistrations(e.target.value)
                        setRegistrationSuggestions(suggestions)
                        setShowRegistrationSuggestions(suggestions.length > 0)
                      } else {
                        setShowRegistrationSuggestions(false)
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
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {registrationSuggestions.map((suggestion, index) => (
                        <button
                          key={suggestion.id}
                          type="button"
                          onClick={() => {
                            setRegistrationNumber(suggestion.registrationNumber)
                            setShowRegistrationSuggestions(false)
                            // 使用回数を増やす
                            if (registrationDb) {
                              registrationDb.autoRegisterRegistration(suggestion.registrationNumber)
                            }
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-blue-50 first:rounded-t-lg last:rounded-b-lg text-sm border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-medium">{suggestion.registrationNumber}</div>
                              {suggestion.description && (
                                <div className="text-xs text-gray-600 mt-1">{suggestion.description}</div>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 ml-2">
                              {suggestion.category && (
                                <span className="bg-gray-100 px-2 py-1 rounded">{suggestion.category}</span>
                              )}
                              <span>使用: {suggestion.usageCount}回</span>
                            </div>
                          </div>
                        </button>
                      ))}
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

            {/* 作業項目 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">🛠️ 作業項目</h2>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => addWorkItem('individual')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 font-medium transition-colors"
                  >
                    <Plus size={16} />
                    個別作業
                  </button>
                  <button
                    type="button"
                    onClick={() => addWorkItem('set')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium transition-colors"
                  >
                    <Plus size={16} />
                    セット作業
                  </button>
                </div>
              </div>
              
              <div className="space-y-6">
                {workItems.map((item, index) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-semibold text-white px-2 py-1 rounded ${
                          item.type === 'set' ? 'bg-blue-600' : 'bg-green-600'
                        }`}>
                          {item.type === 'set' ? 'セット' : '個別'} {index + 1}
                        </span>
                        <select
                          value={item.type}
                          onChange={(e) => handleTypeChange(item.id, e.target.value as 'individual' | 'set')}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="individual">個別作業</option>
                          <option value="set">セット作業</option>
                        </select>
                      </div>
                      {workItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeWorkItem(item.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 rounded transition-colors"
                          title="この項目を削除"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="relative md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          作業名 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={item.work_name}
                          onChange={(e) => handleWorkNameChange(item.id, e.target.value)}
                          onBlur={() => setTimeout(() => setShowWorkSuggestions(prev => ({ ...prev, [item.id]: false })), 200)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="作業名を入力"
                          required
                        />
                        {showWorkSuggestions[item.id] && workSuggestions[item.id] && workSuggestions[item.id].length > 0 && (
                          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {workSuggestions[item.id].map((suggestion, suggestionIndex) => (
                              <button
                                key={suggestionIndex}
                                type="button"
                                onClick={() => handleWorkNameSelect(item.id, suggestion)}
                                className="w-full px-3 py-2 text-left hover:bg-blue-50 first:rounded-t-lg last:rounded-b-lg text-sm"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          単価 (円)
                        </label>
                        <input
                          type="number"
                          value={item.unit_price}
                          onChange={(e) => handleUnitPriceChange(item.id, Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min="0"
                          step="1000"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          数量
                        </label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min="1"
                        />
                      </div>
                    </div>
                    
                    {/* 位置選択 */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        位置 (複数選択可)
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {POSITIONS.map((position) => {
                          const isSelected = (selectedPositions[item.id] || []).includes(position);
                          return (
                            <button
                              key={position}
                              type="button"
                              onClick={() => handlePositionSelect(item.id, position)}
                              className={`px-3 py-1 text-sm rounded border transition-colors ${
                                isSelected
                                  ? 'bg-blue-500 text-white border-blue-600'
                                  : 'bg-gray-100 hover:bg-blue-100 border-gray-300'
                              }`}
                            >
                              {position}
                            </button>
                          );
                        })}
                      </div>
                      {item.position && (
                        <div className="mt-2 text-sm text-gray-600">
                          選択中: <span className="font-medium">{item.position}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* セット詳細（セット作業のみ） */}
                    {item.type === 'set' && (
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            セット詳細 <span className="text-red-500">*</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => addSetDetail(item.id)}
                            className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
                          >
                            + 詳細追加
                          </button>
                        </div>
                        <div className="space-y-4">
                          {(item.set_details || []).map((detail, detailIndex) => (
                            <div key={detailIndex} className="border border-gray-200 rounded-lg p-3 bg-white">
                              <div className="flex gap-2 mb-3">
                                <input
                                  type="text"
                                  value={detail}
                                  onChange={(e) => handleSetDetailChange(item.id, detailIndex, e.target.value)}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                  placeholder={`詳細項目 ${detailIndex + 1}`}
                                  required
                                />
                                {(item.set_details || []).length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeSetDetail(item.id, detailIndex)}
                                    className="px-2 py-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                    title="この詳細を削除"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                )}
                              </div>
                              {/* 詳細項目の位置選択 */}
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  位置 (複数選択可)
                                </label>
                                <div className="flex flex-wrap gap-1">
                                  {POSITIONS.map((position) => {
                                    const isSelected = ((selectedDetailPositions[item.id] || {})[detailIndex] || []).includes(position);
                                    return (
                                      <button
                                        key={position}
                                        type="button"
                                        onClick={() => handleDetailPositionSelect(item.id, detailIndex, position)}
                                        className={`px-2 py-1 text-xs rounded border transition-colors ${
                                          isSelected
                                            ? 'bg-blue-500 text-white border-blue-600'
                                            : 'bg-gray-100 hover:bg-blue-100 border-gray-300'
                                        }`}
                                      >
                                        {position}
                                      </button>
                                    );
                                  })}
                                </div>
                                {((item.detail_positions || [])[detailIndex]) && (
                                  <div className="mt-1 text-xs text-gray-500">
                                    選択中: <span className="font-medium">{(item.detail_positions || [])[detailIndex]}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        メモ（任意）
                      </label>
                      <input
                        type="text"
                        value={item.memo}
                        onChange={(e) => handleMemoChange(item.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="作業に関するメモ"
                      />
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <div className="text-right">
                        <span className="text-lg font-bold text-blue-600">
                          金額: ¥{item.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

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
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">小計:</span>
                  <span className="font-semibold text-lg">¥{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">消費税 (10%):</span>
                  <span className="font-semibold text-lg">¥{taxAmount.toLocaleString()}</span>
                </div>
                <hr className="border-gray-300" />
                <div className="flex justify-between items-center py-3">
                  <span className="text-lg font-bold">合計:</span>
                  <span className="text-xl font-bold text-blue-600">¥{totalAmount.toLocaleString()}</span>
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
                    ¥{Math.round(subtotal / workItems.length).toLocaleString()}
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
    </div>
  )
}