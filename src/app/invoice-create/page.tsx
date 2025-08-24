/**
 * パス: src/app/invoice-create/page.tsx
 * 目的: 請求書作成ページ
 */
'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import SecurityWrapper from '@/components/security-wrapper'

interface WorkItem {
  id: string
  type: 'individual' | 'set'
  name: string
  quantity: number
  unitPrice: number
  amount: number
  setDetails?: string[]
}

interface WorkHistoryItem {
  name: string
  unitPrice: number
  lastUsed: string
  frequency: number
}

export default function InvoiceCreatePage() {
  const router = useRouter()
  
  // サンプル作業履歴データ
  const workHistory: WorkHistoryItem[] = [
    { name: 'バンパー修理', unitPrice: 100000, lastUsed: '2025-05-15T10:00:00Z', frequency: 15 },
    { name: 'サイドパネル塗装', unitPrice: 50000, lastUsed: '2025-05-20T14:00:00Z', frequency: 8 },
    { name: 'フロントパネル交換', unitPrice: 80000, lastUsed: '2025-04-10T10:00:00Z', frequency: 12 },
    { name: 'ライト調整', unitPrice: 15000, lastUsed: '2025-05-01T10:00:00Z', frequency: 25 },
    { name: 'ドア交換', unitPrice: 120000, lastUsed: '2025-04-15T10:00:00Z', frequency: 5 },
    { name: 'ミラー修理', unitPrice: 25000, lastUsed: '2025-05-10T10:00:00Z', frequency: 10 }
  ]
  
  // フォーム状態管理
  const [billingMonth, setBillingMonth] = useState(
    parseInt(`${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}`)
  )
  const [billingDate, setBillingDate] = useState(new Date().toISOString().split('T')[0])
  const [customerCategory, setCustomerCategory] = useState<'UD' | 'その他'>('UD')
  const [customerName, setCustomerName] = useState('株式会社UDトラックス')
  const [subject, setSubject] = useState('')
  const [registrationNumber, setRegistrationNumber] = useState('')
  const [orderNumber, setOrderNumber] = useState('')
  const [internalOrderNumber, setInternalOrderNumber] = useState('')
  const [memo, setMemo] = useState('')
  const [workItems, setWorkItems] = useState<WorkItem[]>([])
  
  // 検索・サジェスト
  const [workSearchKeyword, setWorkSearchKeyword] = useState('')
  const [workSearch, setWorkSearch] = useState('')
  const [workSuggestions, setWorkSuggestions] = useState<WorkHistoryItem[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  
  // エラー・状態管理
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleBack = () => {
    router.push('/')
  }

  // 作業履歴検索
  const searchWorkHistory = (keyword: string) => {
    if (!keyword || keyword.length < 1) return []
    
    const results = workHistory.filter(work => 
      work.name.toLowerCase().includes(keyword.toLowerCase())
    )

    // 頻度と最終使用日でソート
    results.sort((a, b) => {
      if (a.frequency !== b.frequency) return b.frequency - a.frequency
      return new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime()
    })

    return results.slice(0, 10) // 最大10件
  }

  // 作業検索ハンドラ
  const handleWorkSearch = (keyword: string) => {
    setWorkSearchKeyword(keyword)
    if (keyword.trim()) {
      const suggestions = searchWorkHistory(keyword)
      setWorkSuggestions(suggestions)
    } else {
      setWorkSuggestions([])
    }
  }

  // 月調整機能
  const adjustMonth = (delta: number) => {
    let year = Math.floor(billingMonth / 100)
    let month = billingMonth % 100
    
    month += delta
    if (month > 12) {
      year += 1
      month = 1
    } else if (month < 1) {
      year -= 1
      month = 12
    }
    
    const newBillingMonth = year * 100 + month
    setBillingMonth(newBillingMonth)
  }

  // 日付調整ヘルパー
  const formatYMD = (date: Date) => date.toISOString().split('T')[0]
  const adjustBillingDate = (delta: number) => {
    const d = new Date(billingDate)
    d.setDate(d.getDate() + delta)
    setBillingDate(formatYMD(d))
  }
  const setBillingDateToday = () => {
    setBillingDate(formatYMD(new Date()))
  }

  // 顧客タイプ変更
  const handleCustomerTypeChange = (type: 'UD' | 'その他') => {
    setCustomerCategory(type)
    if (type === 'UD') {
      setCustomerName('株式会社UDトラックス')
      setSubject(subject) // 件名は保持
    } else {
      setCustomerName('')
      setSubject('')
    }
    // エラーをクリア
    setErrors(prev => ({ ...prev, customerName: '' }))
  }

  // 顧客名変更時の処理
  const handleCustomerNameChange = (name: string) => {
    setCustomerName(name)
    if (customerCategory === 'その他') {
      setSubject(name) // その他の場合は件名も同じに
    }
    // エラーをクリア
    setErrors(prev => ({ ...prev, customerName: '' }))
  }

  // 音声入力は現状未対応のため、UIボタンとハンドラを削除しました

  const addWorkItem = (type: 'individual' | 'set') => {
    const newItem: WorkItem = {
      id: Date.now().toString(),
      type,
      name: '',
      quantity: 1,
      unitPrice: 0,
      amount: 0,
      setDetails: type === 'set' ? [''] : undefined
    }
    setWorkItems([...workItems, newItem])
    // エラーをクリア
    setErrors(prev => ({ ...prev, items: '' }))
  }

  // 作業項目の更新
  const updateItem = (id: string, field: keyof WorkItem, value: any) => {
    setWorkItems(prev => prev.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value }
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.amount = updatedItem.quantity * updatedItem.unitPrice
        }
        return updatedItem
      }
      return item
    }))
    
    // エラーをクリア
    const itemIndex = workItems.findIndex(item => item.id === id)
    if (itemIndex !== -1) {
      if (field === 'name') {
        setErrors(prev => ({ ...prev, [`item_${itemIndex}_name`]: '' }))
      } else if (field === 'unitPrice') {
        setErrors(prev => ({ ...prev, [`item_${itemIndex}_price`]: '' }))
      } else if (field === 'quantity') {
        setErrors(prev => ({ ...prev, [`item_${itemIndex}_quantity`]: '' }))
      }
    }
  }

  // セット作業詳細の追加
  const addSetDetail = (itemId: string) => {
    setWorkItems(prev => prev.map(item => {
      if (item.id === itemId && item.setDetails) {
        return { ...item, setDetails: [...item.setDetails, ''] }
      }
      return item
    }))
  }

  // セット作業詳細の更新
  const updateSetDetail = (itemId: string, index: number, value: string) => {
    setWorkItems(prev => prev.map(item => {
      if (item.id === itemId && item.setDetails) {
        const newDetails = [...item.setDetails]
        newDetails[index] = value
        return { ...item, setDetails: newDetails }
      }
      return item
    }))
  }

  // セット作業詳細の削除
  const removeSetDetail = (itemId: string, index: number) => {
    setWorkItems(prev => prev.map(item => {
      if (item.id === itemId && item.setDetails && item.setDetails.length > 1) {
        const newDetails = [...item.setDetails]
        newDetails.splice(index, 1)
        return { ...item, setDetails: newDetails }
      }
      return item
    }))
  }

  // 作業項目削除
  const removeItem = (id: string) => {
    setWorkItems(prev => prev.filter(item => item.id !== id))
  }

  // 金額計算
  const subtotal = workItems.reduce((sum, item) => sum + item.amount, 0)
  const tax = Math.floor(subtotal * 0.1)
  const total = subtotal + tax

  // バリデーション
  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!customerName.trim()) {
      newErrors.customerName = '顧客名は必須です'
    }
    
    if (!subject.trim()) {
      newErrors.subject = '件名は必須です'
    }
    
    if (workItems.length === 0) {
      newErrors.items = '作業項目を少なくとも1つ追加してください'
    }
    
    workItems.forEach((item, index) => {
      if (!item.name.trim()) {
        newErrors[`item_${index}_name`] = '作業内容は必須です'
      }
      if (item.quantity < 1) {
        newErrors[`item_${index}_quantity`] = '数量は1以上を入力してください'
      }
      if (item.unitPrice <= 0) {
        newErrors[`item_${index}_price`] = '単価は0より大きい値を入力してください'
      }
      if (item.type === 'set' && item.setDetails && item.setDetails.every(detail => !detail.trim())) {
        newErrors[`item_${index}_details`] = 'セット内作業内容を入力してください'
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async (isDraft = false) => {
    if (!validateForm()) {
      alert('入力内容に不備があります')
      return
    }

    setIsLoading(true)
    
    try {
      const invoice = {
        billingMonth,
        billingDate,
        customerCategory,
        customerName: customerCategory === 'UD' ? '株式会社UDトラックス' : customerName,
        subject,
        registrationNumber,
        orderNumber,
        internalOrderNumber,
        memo,
        items: workItems,
        subtotal,
        tax,
        total,
        status: isDraft ? 'draft' : 'finalized',
        createdAt: new Date().toISOString()
      }

      // 保存処理のシミュレーション
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('請求書保存:', invoice)
      alert(isDraft ? '下書きを保存しました' : '請求書を確定しました')
      
      // 成功時はリストページに戻る
      router.push('/invoice-list')
    } catch (error) {
      alert('保存に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const styles = `
    .invoice-container {
      min-height: 100vh;
      background: #f8f9fa;
      padding: 1rem;
    }

    .invoice-header {
      background: white;
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .invoice-title {
      font-size: 1.5rem;
      font-weight: bold;
      color: #1f2937;
      margin: 0;
    }

    .back-button {
      padding: 0.5rem 1rem;
      background: #6b7280;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
    }

    .form-section {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .section-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #e5e7eb;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-label {
      font-size: 0.9rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.5rem;
    }

    .form-input {
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 0.9rem;
    }

    .input-with-voice {
      display: flex;
      gap: 0.5rem;
    }

    .voice-button {
      padding: 0.75rem 1rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.8rem;
      white-space: nowrap;
    }

    .add-work-buttons {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .add-button {
      padding: 0.75rem 1.5rem;
      background: #10b981;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
    }

    .work-item {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 1rem;
      margin-bottom: 0.5rem;
    }

    .work-item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .work-type-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .delete-button {
      background: #ef4444;
      color: white;
      border: none;
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.8rem;
    }

    .work-item-content {
      background: white;
      padding: 1rem;
      border-radius: 6px;
    }

    .work-input-row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 1rem;
      align-items: start;
    }

    .work-input-group {
      display: flex;
      flex-direction: column;
    }

    .work-label {
      font-size: 0.8rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.5rem;
    }

    .work-search-container {
      position: relative;
      display: flex;
      gap: 0.5rem;
    }

    .work-search-input {
      flex: 1;
    }

    .voice-small {
      padding: 0.5rem;
      font-size: 0.8rem;
      min-width: auto;
    }

    .suggestions-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      z-index: 10;
      background: white;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      max-height: 200px;
      overflow-y: auto;
    }

    .suggestion-item {
      padding: 0.75rem;
      cursor: pointer;
      border-bottom: 1px solid #f3f4f6;
    }

    .suggestion-item:hover {
      background: #f9fafb;
    }

    .suggestion-item:last-child {
      border-bottom: none;
    }

    .suggestion-name {
      font-weight: 500;
      color: #111827;
      margin-bottom: 0.25rem;
    }

    .suggestion-meta {
      font-size: 0.8rem;
      color: #6b7280;
    }

    .error-text {
      color: #ef4444;
      font-size: 0.8rem;
      margin-top: 0.25rem;
    }

    .set-details-section {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #e5e7eb;
    }

    .set-details-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .add-detail-button {
      background: #10b981;
      color: white;
      border: none;
      padding: 0.5rem 0.75rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.8rem;
    }

    .set-detail-row {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .remove-detail-button {
      background: #ef4444;
      color: white;
      border: none;
      padding: 0.5rem 0.75rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.8rem;
      min-width: auto;
    }

    .calculation-section {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      border: 2px solid #e5e7eb;
    }

    .calculation-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid #f3f4f6;
    }

    .calculation-row:last-child {
      border-bottom: none;
    }

    .total-row {
      border-top: 2px solid #374151;
      margin-top: 0.5rem;
      padding-top: 1rem;
    }

    .calculation-label {
      font-size: 1rem;
      color: #374151;
      font-weight: 500;
    }

    .calculation-value {
      font-size: 1rem;
      font-weight: 600;
      color: #111827;
    }

    .total-amount {
      font-size: 1.25rem;
      font-weight: 700;
      color: #dc2626;
    }

    .save-section {
      text-align: center;
      padding: 2rem;
    }

    .save-button {
      padding: 1rem 3rem;
      background: #dc2626;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1.1rem;
      font-weight: 600;
    }

    .voice-info {
      background: #dbeafe;
      border: 1px solid #3b82f6;
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1rem;
    }

    .voice-info-title {
      color: #1d4ed8;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .voice-info-list {
      color: #1e40af;
      font-size: 0.9rem;
      margin: 0;
      padding-left: 1.5rem;
    }

    .warning-note {
      background: #fef3c7;
      border: 1px solid #f59e0b;
      border-radius: 6px;
      padding: 0.75rem;
      color: #92400e;
      font-size: 0.9rem;
      margin-top: 0.5rem;
    }

    /* 顧客名ラベルの右側に種別ラジオを配置するための行レイアウト */
    .form-label-row {
      display: flex;
      align-items: center;
      justify-content: flex-start; /* 顧客名ラベルの直後にラジオを寄せる */
      gap: 0.5rem;
      margin-bottom: 0.5rem;
      flex-wrap: wrap;
    }

    .customer-type-options {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
      margin-left: 0.25rem; /* ラベルとの距離を少しだけ空ける */
    }

    @media (max-width: 768px) {
      .invoice-header {
        flex-direction: column;
        gap: 1rem;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .input-with-voice {
        flex-direction: column;
      }

      .voice-button {
        align-self: stretch;
      }

      .add-work-buttons {
        flex-direction: column;
      }
    }
  `

  // 提案ドロップダウンを閉じる
  const handleClickOutside = () => {
    setShowSuggestions(false)
  }

  React.useEffect(() => {
    if (showSuggestions) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showSuggestions])

  return (
    <SecurityWrapper requirePin={true}>
      <>
        <style dangerouslySetInnerHTML={{ __html: styles }} />
        
        <div className="invoice-container">
          {/* ヘッダー */}
          <div className="invoice-header">
            <h1 className="invoice-title">請求書作成</h1>
            <button 
              onClick={handleBack}
              className="back-button"
            >
              ← 請求書一覧に戻る
            </button>
          </div>

          {/* 基本情報セクション */}
          <div className="form-section">
            <div className="section-title">基本情報</div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">請求データ年月</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span>📅</span>
                  <input
                    type="text"
                    value={`${Math.floor(billingMonth / 100).toString().padStart(4, '0')}/${(billingMonth % 100).toString().padStart(2, '0')}`}
                    readOnly
                    className="form-input"
                    style={{ flex: 1, backgroundColor: '#f3f4f6' }}
                  />
                  <button 
                    onClick={() => adjustMonth(-1)}
                    className="voice-button" 
                    style={{ background: '#6b7280', fontSize: '0.8rem' }}
                  >
                    前月
                  </button>
                  <button 
                    onClick={() => setBillingMonth(parseInt(`${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}`))}
                    className="voice-button" 
                    style={{ background: '#6b7280', fontSize: '0.8rem' }}
                  >
                    当月
                  </button>
                  <button 
                    onClick={() => adjustMonth(1)}
                    className="voice-button" 
                    style={{ background: '#6b7280', fontSize: '0.8rem' }}
                  >
                    次月
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">請求日 (発行日) *</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="date"
                    value={billingDate}
                    onChange={(e) => setBillingDate(e.target.value)}
                    className="form-input"
                    required
                    style={{ flex: 1 }}
                  />
                  <button 
                    onClick={() => adjustBillingDate(-1)}
                    className="voice-button" 
                    style={{ background: '#6b7280', fontSize: '0.8rem' }}
                  >
                    前日
                  </button>
                  <button 
                    onClick={setBillingDateToday}
                    className="voice-button" 
                    style={{ background: '#6b7280', fontSize: '0.8rem' }}
                  >
                    当日
                  </button>
                  <button 
                    onClick={() => adjustBillingDate(1)}
                    className="voice-button" 
                    style={{ background: '#6b7280', fontSize: '0.8rem' }}
                  >
                    翌日
                  </button>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <div className="form-label-row">
                  <label className="form-label" style={{ marginBottom: 0 }}>顧客名 *</label>
                  <div className="customer-type-options">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <input
                        type="radio"
                        name="customerType"
                        value="UD"
                        checked={customerCategory === 'UD'}
                        onChange={() => handleCustomerTypeChange('UD')}
                      />
                      UD
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <input
                        type="radio"
                        name="customerType"
                        value="その他"
                        checked={customerCategory === 'その他'}
                        onChange={() => handleCustomerTypeChange('その他')}
                      />
                      その他
                    </label>
                  </div>
                </div>
                <div className="input-with-voice">
                  <input
                    type="text"
                    placeholder={customerCategory === 'UD' ? '株式会社UDトラックス' : '顧客名を入力'}
                    value={customerName}
                    onChange={(e) => handleCustomerNameChange(e.target.value)}
                    disabled={customerCategory === 'UD'}
                    className="form-input"
                    style={{ 
                      flex: 1,
                      backgroundColor: customerCategory === 'UD' ? '#f3f4f6' : 'white'
                    }}
                    required
                  />
                  {/* 音声入力ボタン削除 */}
                </div>
                {errors.customerName && (
                  <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    {errors.customerName}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">件名 *</label>
                <div className="input-with-voice">
                  <input
                    type="text"
                    placeholder="件名を入力"
                    value={subject}
                    onChange={(e) => {
                      setSubject(e.target.value)
                      setErrors(prev => ({ ...prev, subject: '' }))
                    }}
                    className="form-input"
                    style={{ flex: 1 }}
                    required
                  />
                  {/* 音声入力ボタン削除 */}
                </div>
                {errors.subject && (
                  <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    {errors.subject}
                  </p>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">登録番号</label>
                <input
                  type="text"
                  placeholder="登録番号 (任意)"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">発注番号</label>
                <input
                  type="text"
                  placeholder="発注番号 (任意)"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">オーダー番号</label>
                <input
                  type="text"
                  placeholder="オーダー番号 (任意)"
                  value={internalOrderNumber}
                  onChange={(e) => setInternalOrderNumber(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* 作業項目セクション */}
          <div className="form-section">
            <div className="section-title">作業項目</div>
            
            <div className="add-work-buttons">
              <button 
                onClick={() => addWorkItem('individual')}
                className="add-button"
              >
                + 個別作業追加
              </button>
              <button 
                onClick={() => addWorkItem('set')}
                className="add-button"
              >
                + セット作業追加
              </button>
            </div>

{workItems.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                color: '#6b7280', 
                padding: '2rem',
                background: '#f9fafb',
                borderRadius: '6px',
                border: '2px dashed #d1d5db'
              }}>
                作業項目を追加してください
              </div>
            ) : (
              workItems.map((item, index) => (
                <div key={item.id} className="work-item">
                  <div className="work-item-header">
                    <span className="work-type-badge" style={{ 
                      backgroundColor: item.type === 'individual' ? '#d1fae5' : '#fee2e2',
                      color: item.type === 'individual' ? '#059669' : '#dc2626'
                    }}>
                      {item.type === 'individual' ? '個別作業' : 'セット作業'}
                    </span>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="delete-button"
                    >
                      削除
                    </button>
                  </div>

                  <div className="work-item-content">
                    <div className="work-input-row">
                      <div className="work-input-group" style={{ flex: '2' }}>
                        <label className="work-label">作業内容 *</label>
                        <div className="work-search-container">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => {
                              updateItem(item.id, 'name', e.target.value)
                              setWorkSearch(e.target.value)
                            }}
                            onFocus={() => setShowSuggestions(true)}
                            placeholder="作業内容を入力または検索"
                            className="form-input work-search-input"
                          />
                          {/* 音声入力ボタン削除 */}
                          
                          {showSuggestions && workSearch && searchWorkHistory(workSearch).length > 0 && (
                            <div className="suggestions-dropdown">
                              {searchWorkHistory(workSearch).map((suggestion, idx) => (
                                <div 
                                  key={idx} 
                                  className="suggestion-item"
                                  onClick={() => {
                                    updateItem(item.id, 'name', suggestion.name)
                                    updateItem(item.id, 'unitPrice', suggestion.unitPrice)
                                    setWorkSearch('')
                                    setShowSuggestions(false)
                                  }}
                                >
                                  <div className="suggestion-name">{suggestion.name}</div>
                                  <div className="suggestion-meta">
                                    ¥{suggestion.unitPrice.toLocaleString()} | 使用回数: {suggestion.frequency}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        {errors[`item_${index}_name`] && (
                          <p className="error-text">{errors[`item_${index}_name`]}</p>
                        )}
                      </div>

                      <div className="work-input-group">
                        <label className="work-label">数量 *</label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const v = Math.max(1, parseInt(e.target.value) || 1)
                            updateItem(item.id, 'quantity', v)
                          }}
                          className="form-input"
                          min="1"
                          step="1"
                        />
                        {errors[`item_${index}_quantity`] && (
                          <p className="error-text">{errors[`item_${index}_quantity`]}</p>
                        )}
                      </div>

                      <div className="work-input-group">
                        <label className="work-label">単価 *</label>
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(item.id, 'unitPrice', parseInt(e.target.value) || 0)}
                          className="form-input"
                          min="0"
                          step="1000"
                        />
                        {errors[`item_${index}_price`] && (
                          <p className="error-text">{errors[`item_${index}_price`]}</p>
                        )}
                      </div>

                      <div className="work-input-group">
                        <label className="work-label">金額</label>
                        <input
                          type="text"
                          value={`¥${item.amount.toLocaleString()}`}
                          readOnly
                          className="form-input"
                          style={{ backgroundColor: '#f3f4f6', fontWeight: '600' }}
                        />
                      </div>
                    </div>

                    {/* セット作業の詳細入力 */}
                    {item.type === 'set' && (
                      <div className="set-details-section">
                        <div className="set-details-header">
                          <label className="work-label">セット内作業内容</label>
                          <button 
                            onClick={() => addSetDetail(item.id)}
                            className="add-detail-button"
                          >
                            + 詳細追加
                          </button>
                        </div>
                        {item.setDetails && item.setDetails.map((detail, detailIndex) => (
                          <div key={detailIndex} className="set-detail-row">
                            <input
                              type="text"
                              value={detail}
                              onChange={(e) => updateSetDetail(item.id, detailIndex, e.target.value)}
                              placeholder={`詳細作業 ${detailIndex + 1}`}
                              className="form-input"
                              style={{ flex: 1 }}
                            />
                            {/* 音声入力ボタン削除 */}
                            {item.setDetails && item.setDetails.length > 1 && (
                              <button 
                                onClick={() => removeSetDetail(item.id, detailIndex)}
                                className="remove-detail-button"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                        {errors[`item_${index}_details`] && (
                          <p className="error-text">{errors[`item_${index}_details`]}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            {errors.items && (
              <p style={{ color: '#ef4444', fontSize: '0.9rem', marginTop: '0.5rem', textAlign: 'center' }}>
                {errors.items}
              </p>
            )}
          </div>

          {/* 合計金額セクション */}
          {workItems.length > 0 && (
            <div className="form-section">
              <div className="section-title">合計金額</div>
              
              <div className="calculation-section">
                <div className="calculation-row">
                  <span className="calculation-label">小計</span>
                  <span className="calculation-value">¥{subtotal.toLocaleString()}</span>
                </div>
                <div className="calculation-row">
                  <span className="calculation-label">消費税 (10%)</span>
                  <span className="calculation-value">¥{tax.toLocaleString()}</span>
                </div>
                <div className="calculation-row total-row">
                  <span className="calculation-label">合計</span>
                  <span className="calculation-value total-amount">¥{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* 保存セクション */}
          <div className="save-section">
            <button onClick={() => handleSave(true)} className="save-button" style={{ background: '#6b7280', marginRight: '1rem' }} disabled={isLoading}>
              下書き保存
            </button>
            <button onClick={() => handleSave()} className="save-button" disabled={isLoading}>
              請求書を保存
            </button>
          </div>
        </div>
      </>
    </SecurityWrapper>
  )
}