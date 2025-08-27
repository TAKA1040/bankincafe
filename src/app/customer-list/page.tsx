'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Search, Edit, Trash2, Users, X, Save } from 'lucide-react'

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
}

// CustomerDBクラス
class CustomerDB {
  customers: Customer[]

  constructor() {
    this.customers = this.loadData('bankin_customers', this.getDefaultCustomers())
  }

  private getDefaultCustomers(): Customer[] {
    return [
      {
        id: 1,
        company_name: 'テクノロジー株式会社',
        person_in_charge: '山田太郎',
        position: '営業部長',
        phone: '03-1234-5678',
        email: 'yamada@technology.co.jp',
        zip_code: '100-0001',
        address1: '東京都千代田区',
        address2: '丸の内1-1-1',
        invoice_reg_no: 'T1234567890123',
        memo: '重要顧客'
      },
      {
        id: 2,
        company_name: 'サンプル商事株式会社B',
        person_in_charge: '佐藤花子',
        position: '総務部',
        phone: '06-9876-5432',
        email: 'sato@sample.co.jp',
        zip_code: '530-0001',
        address1: '大阪府大阪市北区',
        address2: '梅田2-2-2',
        invoice_reg_no: 'T9876543210987',
        memo: ''
      },
      {
        id: 3,
        company_name: '株式会社UDトラックス',
        person_in_charge: '田中一郎',
        position: '購買部',
        phone: '048-123-4567',
        email: 'tanaka@udtrucks.co.jp',
        zip_code: '362-0806',
        address1: '埼玉県上尾市',
        address2: '',
        invoice_reg_no: 'T1111222233334',
        memo: '定期発注あり'
      }
    ]
  }

  private loadData(key: string, defaultValue: Customer[]): Customer[] {
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : defaultValue
    } catch (error) {
      // データ読み込みエラー
      return defaultValue
    }
  }

  save(): void {
    try {
      localStorage.setItem('bankin_customers', JSON.stringify(this.customers))
    } catch (error) {
      // データ保存エラー
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
}

export default function CustomerListPage() {
  const router = useRouter()
  const [db] = useState(() => new CustomerDB())
  const [searchKeyword, setSearchKeyword] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
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
    memo: ''
  })

  // 検索処理
  useEffect(() => {
    const searchCustomers = async () => {
      setIsSearching(true)
      await new Promise(resolve => setTimeout(resolve, 200))
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

  const handleSave = async () => {
    if (!newCustomer.company_name.trim()) {
      alert('顧客名は必須です')
      return
    }

    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 500))

    if (editingCustomer) {
      db.updateCustomer(editingCustomer.id, newCustomer)
      alert('顧客情報を更新しました')
    } else {
      db.addCustomer(newCustomer)
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
      memo: ''
    })
    setIsSaving(false)
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
      memo: customer.memo
    })
    setShowAddForm(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('この顧客を削除してもよろしいですか？')) {
      db.deleteCustomer(id)
      setCustomers([...db.customers])
      alert('顧客を削除しました')
    }
  }

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
              検索結果: {customers.length}件
            </div>
          )}
        </div>

        {/* 顧客一覧テーブル */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    検索中...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    {searchKeyword ? '検索結果がありません' : 'データがありません'}
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{customer.company_name}</div>
                      {customer.memo && (
                        <div className="text-xs text-gray-500">{customer.memo}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{customer.person_in_charge}</div>
                      {customer.position && (
                        <div className="text-xs text-gray-500">{customer.position}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{customer.phone}</div>
                      {customer.zip_code && (
                        <div className="text-xs text-gray-500">〒{customer.zip_code}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {customer.address1}{customer.address2}
                      </div>
                      <div className="text-xs text-gray-500">{customer.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(customer)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          aria-label="編集"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(customer.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                          aria-label="削除"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
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
