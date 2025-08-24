/**
 * パス: src/app/customer-list/page.tsx
 * 目的: 顧客管理システム
 */
'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SecurityWrapper from '@/components/security-wrapper'
import { Search, Plus, Edit, Trash2, X, Save, User, Phone, Mail, MapPin, Building2, ArrowLeft, Users } from 'lucide-react'

// 顧客データ管理クラス
class CustomerDB {
  customers: any[]
  
  constructor() {
    this.customers = this.loadData('bankin_customers', [
      {
        id: 1,
        company_name: '株式会社テクノロジー',
        person_in_charge: '山田太郎',
        position: '部長',
        phone: '03-1234-5678',
        email: 'yamada@example.com',
        zip_code: '100-0001',
        address1: '東京都千代田区丸の内1-1-1',
        address2: '丸の内ビル5F',
        invoice_reg_no: 'T1234567890123',
        memo: '主要取引先'
      },
      {
        id: 2,
        company_name: '有限会社サブル商事B',
        person_in_charge: '佐藤花子',
        position: '課長',
        phone: '06-9876-5432',
        email: 'sato@example.com',
        zip_code: '530-0001',
        address1: '大阪府大阪市北区梅田2-2-2',
        address2: '',
        invoice_reg_no: 'T9876543210987',
        memo: ''
      },
      {
        id: 3,
        company_name: 'UDトラックス株式会社',
        person_in_charge: '田中次郎',
        position: '主任',
        phone: '03-5555-1234',
        email: 'tanaka@ud-trucks.com',
        zip_code: '108-0075',
        address1: '東京都港区港南2-16-4',
        address2: '品川グランドセントラルタワー',
        invoice_reg_no: 'T1122334455667',
        memo: 'メイン顧客'
      }
    ])
  }

  loadData(key: string, defaultData: any): any {
    try {
      const stored = JSON.parse(localStorage.getItem(key) || 'null')
      return stored || defaultData
    } catch (error) {
      console.warn(`Failed to load ${key}:`, error)
      return defaultData
    }
  }

  save() {
    try {
      localStorage.setItem('bankin_customers', JSON.stringify(this.customers))
    } catch (error) {
      console.warn('Failed to save customers:', error)
    }
  }

  searchCustomers(keyword: string): any[] {
    if (!keyword) return this.customers
    const lowerKeyword = keyword.toLowerCase()
    return this.customers.filter(customer => 
      customer.company_name.toLowerCase().includes(lowerKeyword) ||
      customer.person_in_charge.toLowerCase().includes(lowerKeyword) ||
      customer.position.toLowerCase().includes(lowerKeyword) ||
      customer.phone.includes(keyword) ||
      customer.email.toLowerCase().includes(lowerKeyword) ||
      customer.address1.toLowerCase().includes(lowerKeyword) ||
      customer.memo.toLowerCase().includes(lowerKeyword)
    )
  }

  addCustomer(customerData: any): any {
    const newCustomer = {
      id: Date.now(),
      ...customerData
    }
    this.customers.push(newCustomer)
    this.save()
    return newCustomer
  }

  updateCustomer(id: any, customerData: any): any {
    const index = this.customers.findIndex(c => c.id === id)
    if (index !== -1) {
      this.customers[index] = { ...this.customers[index], ...customerData }
      this.save()
      return this.customers[index]
    }
    return null
  }

  deleteCustomer(id: any): void {
    this.customers = this.customers.filter(c => c.id !== id)
    this.save()
  }
}

export default function CustomerManagementPage() {
  const router = useRouter()
  const [db] = useState(() => new CustomerDB())
  const [searchKeyword, setSearchKeyword] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [customers, setCustomers] = useState<any[]>(db.customers)
  const [isSearching, setIsSearching] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [newCustomer, setNewCustomer] = useState({
    company_name: '',
    person_in_charge: '',
    position: '',
    phone: '',
    email: '',
    zip_code: '',
    address1: '',
    address2: '',
    invoice_reg_no: '',
    memo: ''
  })

  // CSS-in-JS用のスタイルシート
  const styles = `
    .customer-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
      font-family: system-ui, sans-serif;
    }

    .customer-card {
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      margin-bottom: 1.5rem;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.2);
    }

    .customer-card-header {
      background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
      color: white;
      padding: 2rem;
      position: relative;
    }

    .customer-card-header::before {
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

    .customer-title {
      font-size: 2.2rem;
      font-weight: bold;
      margin: 0 0 0.5rem 0;
      text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .customer-subtitle {
      opacity: 0.9;
      margin: 0;
      font-size: 1.1rem;
    }

    .customer-content {
      padding: 2rem;
    }

    .search-section {
      padding: 2rem;
      border-bottom: 2px solid #f3f4f6;
    }

    .search-input {
      width: 100%;
      padding: 0.875rem 1rem 0.875rem 3rem;
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

    .search-wrapper {
      position: relative;
    }

    .search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #9ca3af;
    }

    .add-customer-btn {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      padding: 0.875rem 2rem;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .add-customer-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
    }

    .customer-table {
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid #e5e7eb;
    }

    .customer-table table {
      width: 100%;
      border-collapse: collapse;
    }

    .customer-table th {
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      padding: 1.5rem 1rem;
      text-align: left;
      font-weight: 600;
      color: #374151;
      border-bottom: 2px solid #e5e7eb;
      font-size: 0.9rem;
    }

    .customer-table td {
      padding: 1.5rem 1rem;
      border-bottom: 1px solid #f3f4f6;
      vertical-align: top;
    }

    .customer-table tbody tr:hover {
      background: #f8fafc;
    }

    .customer-name {
      font-weight: 600;
      color: #1f2937;
      font-size: 1.1rem;
      margin-bottom: 0.25rem;
    }

    .customer-memo {
      color: #6b7280;
      font-size: 0.85rem;
    }

    .contact-info {
      color: #374151;
      margin-bottom: 0.25rem;
    }

    .contact-detail {
      color: #6b7280;
      font-size: 0.85rem;
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .btn-edit {
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
      justify-content: center;
      gap: 0.25rem;
    }

    .btn-edit:hover {
      transform: scale(1.05);
    }

    .btn-delete {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
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
      justify-content: center;
      gap: 0.25rem;
    }

    .btn-delete:hover {
      transform: scale(1.05);
    }

    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      z-index: 50;
      backdrop-filter: blur(4px);
    }

    .modal-content {
      background: white;
      border-radius: 20px;
      box-shadow: 0 25px 50px rgba(0,0,0,0.25);
      width: 100%;
      max-width: 1000px;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      padding: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-title {
      font-size: 1.5rem;
      font-weight: bold;
      margin: 0;
    }

    .modal-close {
      background: none;
      border: none;
      color: white;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 8px;
      transition: background 0.2s;
    }

    .modal-close:hover {
      background: rgba(255,255,255,0.1);
    }

    .form-section {
      margin-bottom: 2rem;
    }

    .form-section-title {
      font-size: 1.2rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #e5e7eb;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .form-field {
      display: flex;
      flex-direction: column;
    }

    .form-label {
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }

    .required {
      color: #ef4444;
    }

    .form-input {
      padding: 0.875rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.2s ease;
      background: #fafafa;
    }

    .form-input:focus {
      outline: none;
      border-color: #3b82f6;
      background: white;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-textarea {
      padding: 0.875rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.2s ease;
      background: #fafafa;
      resize: vertical;
      min-height: 100px;
    }

    .form-textarea:focus {
      outline: none;
      border-color: #3b82f6;
      background: white;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-buttons {
      display: flex;
      gap: 1rem;
      padding: 2rem;
      border-top: 2px solid #f3f4f6;
      background: #f8fafc;
    }

    .btn-cancel {
      flex: 1;
      background: #6b7280;
      color: white;
      padding: 0.875rem 2rem;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-cancel:hover {
      background: #4b5563;
    }

    .btn-save {
      flex: 1;
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      padding: 0.875rem 2rem;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .btn-save:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
    }

    .btn-save:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
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

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #6b7280;
    }

    .search-results {
      color: #3b82f6;
      font-weight: 600;
      margin-top: 1rem;
    }

    /* アニメーション */
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .customer-card {
      animation: fadeIn 0.3s ease-out;
    }

    /* モバイル対応 */
    @media (max-width: 768px) {
      .customer-container {
        padding: 1rem;
      }

      .customer-card-header {
        padding: 1.5rem;
      }

      .customer-title {
        font-size: 1.8rem;
      }

      .customer-content {
        padding: 1.5rem;
      }

      .search-section {
        padding: 1.5rem;
      }

      .form-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .form-buttons {
        flex-direction: column;
        gap: 0.75rem;
      }

      .action-buttons {
        flex-direction: row;
        gap: 0.25rem;
      }

      .customer-table th,
      .customer-table td {
        padding: 1rem 0.5rem;
        font-size: 0.85rem;
      }

      .modal-content {
        margin: 0.5rem;
        max-height: 95vh;
      }

      .modal-header {
        padding: 1.5rem;
      }
    }

    @media (max-width: 640px) {
      .customer-table {
        font-size: 0.8rem;
      }

      .customer-table th,
      .customer-table td {
        padding: 0.75rem 0.25rem;
      }
    }
  `

  // 検索結果の更新
  useEffect(() => {
    const searchCustomers = async () => {
      setIsSearching(true)
      await new Promise(resolve => setTimeout(resolve, 200))
      const filtered = db.searchCustomers(searchKeyword)
      setCustomers(filtered)
      setIsSearching(false)
    }

    searchCustomers()
  }, [searchKeyword, db.customers, db])

  // フォームリセット
  const resetForm = () => {
    setNewCustomer({
      company_name: '',
      person_in_charge: '',
      position: '',
      phone: '',
      email: '',
      zip_code: '',
      address1: '',
      address2: '',
      invoice_reg_no: '',
      memo: ''
    })
    setEditingCustomer(null)
    setShowAddForm(false)
  }

  // 顧客保存
  const saveCustomer = async () => {
    if (!newCustomer.company_name.trim()) {
      alert('顧客名は必須項目です')
      return
    }

    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 500))

    try {
      if (editingCustomer) {
        db.updateCustomer(editingCustomer.id, newCustomer)
      } else {
        db.addCustomer(newCustomer)
      }

      setCustomers([...db.customers])
      resetForm()
      alert(editingCustomer ? '顧客情報を更新しました' : '新規顧客を登録しました')
    } catch (error) {
      console.error('Save error:', error)
      alert('保存中にエラーが発生しました')
    } finally {
      setIsSaving(false)
    }
  }

  // 編集開始
  const startEdit = (customer: any) => {
    setEditingCustomer(customer)
    setNewCustomer({ ...customer })
    setShowAddForm(true)
  }

  // 削除
  const deleteCustomer = (id: any, companyName: string) => {
    if (confirm(`「${companyName}」を削除しますか？この操作は取り消せません。`)) {
      db.deleteCustomer(id)
      setCustomers([...db.customers])
      alert('顧客を削除しました')
    }
  }

  return (
    <SecurityWrapper requirePin={false}>
      <>
        {/* インラインCSS */}
        <style dangerouslySetInnerHTML={{ __html: styles }} />
        
        <div className="customer-container">
          <div className="max-w-7xl mx-auto">
            {/* ヘッダー */}
            <div className="customer-card">
              <div className="customer-card-header">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="customer-title flex items-center">
                      <Users className="h-8 w-8 mr-3" />
                      顧客管理システム
                    </h1>
                    <p className="customer-subtitle">
                      顧客情報の登録・編集・管理
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <button onClick={() => setShowAddForm(true)} className="add-customer-btn">
                      <Plus className="h-5 w-5" />
                      新規顧客登録
                    </button>
                    <button onClick={() => router.back()} className="back-btn">
                      <ArrowLeft className="h-4 w-4" />
                      戻る
                    </button>
                  </div>
                </div>
              </div>

              {/* 検索セクション */}
              <div className="search-section">
                <div className="search-wrapper">
                  <Search className="search-icon h-5 w-5" />
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="顧客名、担当者名、役職、電話番号、メールアドレスで検索..."
                    className="search-input"
                  />
                </div>
                {searchKeyword && (
                  <div className="search-results">
                    検索結果: {customers.length}件
                  </div>
                )}
              </div>
            </div>

            {/* 顧客一覧テーブル */}
            <div className="customer-card">
              <div className="customer-table">
                <div className="overflow-x-auto">
                  <table>
                    <thead>
                      <tr>
                        <th style={{ width: '25%' }}>
                          <div className="flex items-center">
                            <Building2 className="h-4 w-4 mr-1" />
                            顧客名
                          </div>
                        </th>
                        <th style={{ width: '20%' }}>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            担当者
                          </div>
                        </th>
                        <th style={{ width: '20%' }}>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-1" />
                            連絡先
                          </div>
                        </th>
                        <th style={{ width: '25%' }}>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            住所・メール
                          </div>
                        </th>
                        <th style={{ width: '10%', textAlign: 'center' }}>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isSearching ? (
                        <tr>
                          <td colSpan="5" className="empty-state">
                            <Search className="h-8 w-8 mx-auto mb-2 animate-pulse" style={{ color: '#3b82f6' }} />
                            <div>検索中...</div>
                          </td>
                        </tr>
                      ) : customers.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="empty-state">
                            <Users className="h-16 w-16 mx-auto mb-4" />
                            <div className="text-xl font-semibold mb-2">
                              {searchKeyword ? '検索条件に一致する顧客が見つかりません' : '登録されている顧客がありません'}
                            </div>
                            {!searchKeyword && (
                              <div className="text-gray-500">
                                「新規顧客登録」ボタンから顧客を追加してください
                              </div>
                            )}
                          </td>
                        </tr>
                      ) : (
                        customers.map(customer => (
                          <tr key={customer.id}>
                            {/* 顧客名列 */}
                            <td>
                              <div className="customer-name">{customer.company_name}</div>
                              <div className="customer-memo">
                                {customer.memo || '（支店名・部署名）'}
                              </div>
                            </td>
                            
                            {/* 担当者列 */}
                            <td>
                              <div className="contact-info">{customer.person_in_charge}</div>
                              <div className="contact-detail">{customer.position}</div>
                            </td>
                            
                            {/* 連絡先列 */}
                            <td>
                              <div className="contact-info">{customer.phone}</div>
                              <div className="contact-detail">
                                〒{customer.zip_code}
                              </div>
                            </td>
                            
                            {/* 住所・メール列 */}
                            <td>
                              <div className="contact-info" style={{ fontSize: '0.85rem' }}>{customer.email}</div>
                              <div className="contact-detail">
                                {customer.address1}
                                {customer.address2 && <div>{customer.address2}</div>}
                              </div>
                            </td>
                            
                            {/* 操作列 */}
                            <td>
                              <div className="action-buttons">
                                <button
                                  onClick={() => startEdit(customer)}
                                  className="btn-edit"
                                >
                                  <Edit className="h-3 w-3" />
                                  編集
                                </button>
                                <button
                                  onClick={() => deleteCustomer(customer.id, customer.company_name)}
                                  className="btn-delete"
                                >
                                  <Trash2 className="h-3 w-3" />
                                  削除
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* 顧客登録・編集フォーム */}
          {showAddForm && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h2 className="modal-title">
                    {editingCustomer ? '顧客情報編集' : '新規顧客登録'}
                  </h2>
                  <button onClick={resetForm} className="modal-close">
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="customer-content">
                  {/* 基本情報 */}
                  <div className="form-section">
                    <div className="form-section-title">基本情報</div>
                    <div className="form-grid">
                      <div className="form-field">
                        <label className="form-label">
                          顧客名 <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          value={newCustomer.company_name}
                          onChange={(e) => setNewCustomer({...newCustomer, company_name: e.target.value})}
                          className="form-input"
                          placeholder="株式会社○○"
                        />
                      </div>

                      <div className="form-field">
                        <label className="form-label">担当者名</label>
                        <input
                          type="text"
                          value={newCustomer.person_in_charge}
                          onChange={(e) => setNewCustomer({...newCustomer, person_in_charge: e.target.value})}
                          className="form-input"
                          placeholder="山田太郎"
                        />
                      </div>

                      <div className="form-field">
                        <label className="form-label">役職</label>
                        <input
                          type="text"
                          value={newCustomer.position}
                          onChange={(e) => setNewCustomer({...newCustomer, position: e.target.value})}
                          className="form-input"
                          placeholder="部長、課長、主任、社長、専務取締役等"
                        />
                      </div>

                      <div className="form-field">
                        <label className="form-label">電話番号</label>
                        <input
                          type="tel"
                          value={newCustomer.phone}
                          onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                          className="form-input"
                          placeholder="03-1234-5678"
                        />
                      </div>

                      <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label">メールアドレス</label>
                        <input
                          type="email"
                          value={newCustomer.email}
                          onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                          className="form-input"
                          placeholder="example@company.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 住所情報 */}
                  <div className="form-section">
                    <div className="form-section-title">住所情報</div>
                    <div className="form-grid">
                      <div className="form-field">
                        <label className="form-label">郵便番号</label>
                        <input
                          type="text"
                          value={newCustomer.zip_code}
                          onChange={(e) => setNewCustomer({...newCustomer, zip_code: e.target.value})}
                          className="form-input"
                          placeholder="100-0001"
                        />
                      </div>

                      <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label">住所1（都道府県・市区町村）</label>
                        <input
                          type="text"
                          value={newCustomer.address1}
                          onChange={(e) => setNewCustomer({...newCustomer, address1: e.target.value})}
                          className="form-input"
                          placeholder="東京都千代田区丸の内1-1-1"
                        />
                      </div>

                      <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label">住所2（番地・建物名）</label>
                        <input
                          type="text"
                          value={newCustomer.address2}
                          onChange={(e) => setNewCustomer({...newCustomer, address2: e.target.value})}
                          className="form-input"
                          placeholder="丸の内ビル5F"
                        />
                      </div>
                    </div>
                  </div>

                  {/* その他情報 */}
                  <div className="form-section">
                    <div className="form-section-title">その他情報</div>
                    <div className="form-grid">
                      <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label">適格請求書発行事業者登録番号</label>
                        <input
                          type="text"
                          value={newCustomer.invoice_reg_no}
                          onChange={(e) => setNewCustomer({...newCustomer, invoice_reg_no: e.target.value})}
                          className="form-input"
                          placeholder="T1234567890123"
                        />
                      </div>

                      <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label">備考</label>
                        <textarea
                          value={newCustomer.memo}
                          onChange={(e) => setNewCustomer({...newCustomer, memo: e.target.value})}
                          className="form-textarea"
                          placeholder="特記事項や覚書など"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* フォームボタン */}
                <div className="form-buttons">
                  <button onClick={resetForm} className="btn-cancel" disabled={isSaving}>
                    キャンセル
                  </button>
                  <button onClick={saveCustomer} className="btn-save" disabled={isSaving}>
                    <Save className="h-5 w-5" />
                    {isSaving ? '保存中...' : (editingCustomer ? '更新' : '登録')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    </SecurityWrapper>
  )
}