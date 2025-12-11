'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Search, Edit, Trash2, Users, X, Save, Building2, UserCircle, RefreshCw } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { CustomerCategoryDB } from '@/lib/customer-categories'

// 型定義
interface Customer {
  id: number
  company_name: string
  person_in_charge: string
  position: string
  phone: string
  email: string
  zip_code: string
  address1: string
  address2: string
  invoice_reg_no: string
  memo: string
  category_type: 'category' | 'other'  // カテゴリ顧客 or その他顧客
}

// CustomerDBクラス
class CustomerDB {
  customers: Customer[]

  constructor() {
    this.customers = this.loadData('bankin_customers_v2', [])
  }

  private loadData(key: string, defaultValue: Customer[]): Customer[] {
    if (typeof window === 'undefined') return defaultValue
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : defaultValue
    } catch (error) {
      return defaultValue
    }
  }

  save(): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem('bankin_customers_v2', JSON.stringify(this.customers))
    } catch (error) {
      console.error('顧客データ保存エラー:', error)
    }
  }

  searchCustomers(keyword: string): Customer[] {
    if (!keyword.trim()) return this.customers

    const normalizedKeyword = keyword.toLowerCase()
    return this.customers.filter(customer =>
      customer.company_name?.toLowerCase().includes(normalizedKeyword) ||
      customer.person_in_charge?.toLowerCase().includes(normalizedKeyword) ||
      customer.position?.toLowerCase().includes(normalizedKeyword) ||
      customer.phone?.includes(keyword) ||
      customer.email?.toLowerCase().includes(normalizedKeyword) ||
      customer.address1?.toLowerCase().includes(normalizedKeyword) ||
      customer.memo?.toLowerCase().includes(normalizedKeyword)
    )
  }

  getByType(type: 'category' | 'other'): Customer[] {
    return this.customers.filter(c => c.category_type === type)
  }

  findByCompanyName(companyName: string): Customer | undefined {
    return this.customers.find(c => c.company_name === companyName)
  }

  addCustomer(data: Omit<Customer, 'id'>): Customer {
    const newCustomer: Customer = {
      id: Date.now(),
      ...data
    }
    this.customers.push(newCustomer)
    this.save()
    return newCustomer
  }

  updateCustomer(id: number, data: Partial<Customer>): Customer | null {
    const index = this.customers.findIndex(c => c.id === id)
    if (index === -1) return null

    this.customers[index] = { ...this.customers[index], ...data }
    this.save()
    return this.customers[index]
  }

  deleteCustomer(id: number): void {
    this.customers = this.customers.filter(c => c.id !== id)
    this.save()
  }

  // マスタから同期（カテゴリ顧客）
  syncFromCategoryMaster(categoryDB: CustomerCategoryDB): number {
    let addedCount = 0
    const categories = categoryDB.getCategories()

    for (const cat of categories) {
      // 「その他」カテゴリはスキップ
      if (cat.name === 'その他') continue

      // companyNameが空でないカテゴリのみ
      const companyName = cat.companyName || cat.name
      if (!companyName) continue

      // 既に登録済みかチェック
      const existing = this.findByCompanyName(companyName)
      if (!existing) {
        this.addCustomer({
          company_name: companyName,
          person_in_charge: '',
          position: '',
          phone: '',
          email: '',
          zip_code: '',
          address1: '',
          address2: '',
          invoice_reg_no: '',
          memo: `カテゴリ「${cat.name}」から自動追加`,
          category_type: 'category'
        })
        addedCount++
      }
    }
    return addedCount
  }

  // マスタから同期（その他顧客）
  async syncFromOtherCustomersMaster(): Promise<number> {
    let addedCount = 0
    try {
      const { data, error } = await (supabase as any)
        .from('other_customers')
        .select('*')
        .eq('is_active', true)

      if (error) {
        console.error('その他顧客取得エラー:', error)
        return 0
      }

      for (const other of (data || [])) {
        const existing = this.findByCompanyName(other.customer_name)
        if (!existing) {
          this.addCustomer({
            company_name: other.customer_name,
            person_in_charge: '',
            position: '',
            phone: '',
            email: '',
            zip_code: '',
            address1: '',
            address2: '',
            invoice_reg_no: '',
            memo: 'その他顧客マスタから自動追加',
            category_type: 'other'
          })
          addedCount++
        }
      }
    } catch (error) {
      console.error('同期エラー:', error)
    }
    return addedCount
  }
}

export default function CustomerListPage() {
  const router = useRouter()
  const [db] = useState(() => new CustomerDB())
  const [categoryDB] = useState(() => new CustomerCategoryDB())
  const [searchKeyword, setSearchKeyword] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, 'id'>>({
    company_name: '',
    person_in_charge: '',
    position: '',
    phone: '',
    email: '',
    zip_code: '',
    address1: '',
    address2: '',
    invoice_reg_no: '',
    memo: '',
    category_type: 'other'
  })

  // カテゴリ顧客とその他顧客を分離
  const categoryCustomers = customers.filter(c => c.category_type === 'category')
  const otherCustomers = customers.filter(c => c.category_type === 'other')

  // 検索処理
  useEffect(() => {
    const searchCustomers = async () => {
      setIsSearching(true)
      await new Promise(resolve => setTimeout(resolve, 100))
      const filtered = db.searchCustomers(searchKeyword)
      setCustomers(filtered)
      setIsSearching(false)
    }
    searchCustomers()
  }, [searchKeyword, db])

  // 初期データロード
  useEffect(() => {
    setCustomers(db.customers)
  }, [db])

  const handleBack = () => router.push('/')

  // マスタから同期
  const handleSyncFromMaster = async () => {
    setIsSyncing(true)
    try {
      const categoryAdded = db.syncFromCategoryMaster(categoryDB)
      const otherAdded = await db.syncFromOtherCustomersMaster()

      setCustomers([...db.customers])

      if (categoryAdded > 0 || otherAdded > 0) {
        alert(`マスタから同期しました\n・カテゴリ顧客: ${categoryAdded}件追加\n・その他顧客: ${otherAdded}件追加`)
      } else {
        alert('新しい顧客はありませんでした')
      }
    } catch (error) {
      console.error('同期エラー:', error)
      alert('同期中にエラーが発生しました')
    } finally {
      setIsSyncing(false)
    }
  }

  const handleSave = async () => {
    if (!newCustomer.company_name.trim()) {
      alert('顧客名は必須です')
      return
    }

    setIsSaving(true)

    try {
      if (editingCustomer) {
        // 編集
        db.updateCustomer(editingCustomer.id, newCustomer)

        // マスタも更新
        if (newCustomer.category_type === 'category') {
          // カテゴリマスタに追加/更新
          const categories = categoryDB.getCategories()
          const existing = categories.find(c => c.companyName === editingCustomer.company_name)
          if (existing) {
            categoryDB.updateCategory(existing.id, {
              name: newCustomer.company_name,
              companyName: newCustomer.company_name
            })
          }
        } else {
          // その他顧客マスタを更新
          await (supabase as any)
            .from('other_customers')
            .update({
              customer_name: newCustomer.company_name,
              updated_at: new Date().toISOString()
            })
            .eq('customer_name', editingCustomer.company_name)
        }

        alert('顧客情報を更新しました')
      } else {
        // 新規追加
        db.addCustomer(newCustomer)

        // マスタにも登録
        if (newCustomer.category_type === 'category') {
          // カテゴリマスタに追加
          categoryDB.addCategory({
            name: newCustomer.company_name,
            companyName: newCustomer.company_name
          })
        } else {
          // その他顧客マスタに追加
          await (supabase as any)
            .from('other_customers')
            .upsert({
              customer_name: newCustomer.company_name,
              usage_count: 0,
              is_active: true
            }, {
              onConflict: 'customer_name'
            })
        }

        alert('新規顧客を登録しました')
      }

      setCustomers([...db.customers])
      setShowAddForm(false)
      setEditingCustomer(null)
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
        memo: '',
        category_type: 'other'
      })
    } catch (error) {
      console.error('保存エラー:', error)
      alert('保存中にエラーが発生しました')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer)
    setNewCustomer({
      company_name: customer.company_name,
      person_in_charge: customer.person_in_charge,
      position: customer.position,
      phone: customer.phone,
      email: customer.email,
      zip_code: customer.zip_code,
      address1: customer.address1,
      address2: customer.address2,
      invoice_reg_no: customer.invoice_reg_no,
      memo: customer.memo,
      category_type: customer.category_type
    })
    setShowAddForm(true)
  }

  const handleDelete = async (customer: Customer) => {
    if (!confirm(`「${customer.company_name}」を削除してもよろしいですか？`)) return

    db.deleteCustomer(customer.id)

    // マスタからも削除/無効化
    if (customer.category_type === 'other') {
      await (supabase as any)
        .from('other_customers')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('customer_name', customer.company_name)
    }

    setCustomers([...db.customers])
    alert('顧客を削除しました')
  }

  // 顧客テーブル行コンポーネント
  const CustomerRow = ({ customer }: { customer: Customer }) => (
    <tr key={customer.id} className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-gray-900">{customer.company_name}</div>
        {customer.memo && (
          <div className="text-xs text-gray-500">{customer.memo}</div>
        )}
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">{customer.person_in_charge || '-'}</div>
        {customer.position && (
          <div className="text-xs text-gray-500">{customer.position}</div>
        )}
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">{customer.phone || '-'}</div>
        {customer.zip_code && (
          <div className="text-xs text-gray-500">〒{customer.zip_code}</div>
        )}
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">
          {customer.address1 || customer.address2 ? `${customer.address1}${customer.address2}` : '-'}
        </div>
        <div className="text-xs text-gray-500">{customer.email || ''}</div>
      </td>
      <td className="px-6 py-4">
        <div className="flex justify-center gap-2">
          <button
            onClick={() => handleEdit(customer)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
            title="編集"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handleDelete(customer)}
            className="p-2 text-red-600 hover:bg-red-50 rounded"
            title="削除"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <header className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Users className="text-blue-600" size={32} />
              <h1 className="text-2xl font-bold text-gray-800">顧客管理システム</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSyncFromMaster}
                disabled={isSyncing}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 disabled:opacity-50"
                title="マスタから未登録の顧客を同期"
              >
                <RefreshCw size={20} className={isSyncing ? 'animate-spin' : ''} />
                マスタ同期
              </button>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus size={20} />
                新規顧客登録
              </button>
              <button
                onClick={handleBack}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
              >
                <ArrowLeft size={20} />
                戻る
              </button>
            </div>
          </div>
        </header>

        {/* 検索セクション */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="顧客名、担当者名、メモなどで検索..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {searchKeyword && (
            <div className="mt-2 text-sm text-gray-600">
              検索結果: {customers.length}件（カテゴリ: {categoryCustomers.length}件 / その他: {otherCustomers.length}件）
            </div>
          )}
        </div>

        {/* カテゴリ顧客セクション */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="p-4 bg-blue-50 border-b border-blue-200 flex items-center gap-2">
            <Building2 className="text-blue-600" size={24} />
            <h2 className="text-lg font-semibold text-blue-800">カテゴリ顧客</h2>
            <span className="ml-2 px-2 py-0.5 bg-blue-200 text-blue-800 rounded-full text-sm">
              {categoryCustomers.length}件
            </span>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  顧客名
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  担当者
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  連絡先
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  住所・メール
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isSearching ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    検索中...
                  </td>
                </tr>
              ) : categoryCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    カテゴリ顧客はまだ登録されていません
                  </td>
                </tr>
              ) : (
                categoryCustomers.map((customer) => (
                  <CustomerRow key={customer.id} customer={customer} />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* その他顧客セクション */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 bg-purple-50 border-b border-purple-200 flex items-center gap-2">
            <UserCircle className="text-purple-600" size={24} />
            <h2 className="text-lg font-semibold text-purple-800">その他顧客</h2>
            <span className="ml-2 px-2 py-0.5 bg-purple-200 text-purple-800 rounded-full text-sm">
              {otherCustomers.length}件
            </span>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  顧客名
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  担当者
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  連絡先
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  住所・メール
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isSearching ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    検索中...
                  </td>
                </tr>
              ) : otherCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    その他顧客はまだ登録されていません
                  </td>
                </tr>
              ) : (
                otherCustomers.map((customer) => (
                  <CustomerRow key={customer.id} customer={customer} />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 追加/編集フォームモーダル */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">
                    {editingCustomer ? '顧客情報編集' : '新規顧客登録'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddForm(false)
                      setEditingCustomer(null)
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* 顧客タイプ選択 */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    顧客タイプ <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    <label className={`flex items-center gap-2 px-4 py-3 border-2 rounded-lg cursor-pointer transition-colors ${
                      newCustomer.category_type === 'category'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="category_type"
                        value="category"
                        checked={newCustomer.category_type === 'category'}
                        onChange={(e) => setNewCustomer({...newCustomer, category_type: 'category'})}
                        className="sr-only"
                      />
                      <Building2 className={newCustomer.category_type === 'category' ? 'text-blue-600' : 'text-gray-400'} size={20} />
                      <span className={newCustomer.category_type === 'category' ? 'text-blue-800 font-medium' : 'text-gray-600'}>
                        カテゴリ顧客
                      </span>
                    </label>
                    <label className={`flex items-center gap-2 px-4 py-3 border-2 rounded-lg cursor-pointer transition-colors ${
                      newCustomer.category_type === 'other'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="category_type"
                        value="other"
                        checked={newCustomer.category_type === 'other'}
                        onChange={(e) => setNewCustomer({...newCustomer, category_type: 'other'})}
                        className="sr-only"
                      />
                      <UserCircle className={newCustomer.category_type === 'other' ? 'text-purple-600' : 'text-gray-400'} size={20} />
                      <span className={newCustomer.category_type === 'other' ? 'text-purple-800 font-medium' : 'text-gray-600'}>
                        その他顧客
                      </span>
                    </label>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    {newCustomer.category_type === 'category'
                      ? 'カテゴリ顧客として登録すると、請求書作成時にカテゴリとして選択できます'
                      : 'その他顧客として登録すると、「その他」カテゴリ選択時にサジェストされます'}
                  </p>
                </div>

                {/* 基本情報 */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">基本情報</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        顧客名 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newCustomer.company_name}
                        onChange={(e) => setNewCustomer({...newCustomer, company_name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        担当者名
                      </label>
                      <input
                        type="text"
                        value={newCustomer.person_in_charge}
                        onChange={(e) => setNewCustomer({...newCustomer, person_in_charge: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        役職
                      </label>
                      <input
                        type="text"
                        value={newCustomer.position}
                        onChange={(e) => setNewCustomer({...newCustomer, position: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        電話番号
                      </label>
                      <input
                        type="tel"
                        value={newCustomer.phone}
                        onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        メールアドレス
                      </label>
                      <input
                        type="email"
                        value={newCustomer.email}
                        onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 住所情報 */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">住所情報</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        郵便番号
                      </label>
                      <input
                        type="text"
                        value={newCustomer.zip_code}
                        onChange={(e) => setNewCustomer({...newCustomer, zip_code: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        インボイス登録番号
                      </label>
                      <input
                        type="text"
                        value={newCustomer.invoice_reg_no}
                        onChange={(e) => setNewCustomer({...newCustomer, invoice_reg_no: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        住所1
                      </label>
                      <input
                        type="text"
                        value={newCustomer.address1}
                        onChange={(e) => setNewCustomer({...newCustomer, address1: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        住所2
                      </label>
                      <input
                        type="text"
                        value={newCustomer.address2}
                        onChange={(e) => setNewCustomer({...newCustomer, address2: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* その他情報 */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">その他情報</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      メモ
                    </label>
                    <textarea
                      value={newCustomer.memo}
                      onChange={(e) => setNewCustomer({...newCustomer, memo: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>
                </div>

                {/* ボタン */}
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setShowAddForm(false)
                      setEditingCustomer(null)
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save size={18} />
                    {isSaving ? '保存中...' : '保存'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
