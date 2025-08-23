import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, X, Save } from 'lucide-react';

// 顧客データ管理クラス
class CustomerDB {
  constructor() {
    this.customers = JSON.parse(localStorage.getItem('bankin_customers') || JSON.stringify([
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
        company_name: '株式会社UDトラックス',
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
    ]));
  }

  save() {
    localStorage.setItem('bankin_customers', JSON.stringify(this.customers));
  }

  searchCustomers(keyword) {
    if (!keyword) return this.customers;
    return this.customers.filter(customer => 
      customer.company_name.includes(keyword) ||
      customer.person_in_charge.includes(keyword) ||
      customer.position.includes(keyword) ||
      customer.phone.includes(keyword) ||
      customer.email.includes(keyword)
    );
  }

  addCustomer(customerData) {
    const newCustomer = {
      id: Date.now(),
      ...customerData
    };
    this.customers.push(newCustomer);
    this.save();
    return newCustomer;
  }

  updateCustomer(id, customerData) {
    const index = this.customers.findIndex(c => c.id === id);
    if (index !== -1) {
      this.customers[index] = { ...this.customers[index], ...customerData };
      this.save();
      return this.customers[index];
    }
    return null;
  }

  deleteCustomer(id) {
    this.customers = this.customers.filter(c => c.id !== id);
    this.save();
  }
}

// メイン顧客管理コンポーネント
function CustomerManagementPage() {
  const [db] = useState(() => new CustomerDB());
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [customers, setCustomers] = useState(db.customers);

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
  });

  // 検索結果の更新
  useEffect(() => {
    const filtered = db.searchCustomers(searchKeyword);
    setCustomers(filtered);
  }, [searchKeyword, db.customers]);

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
    });
    setEditingCustomer(null);
    setShowAddForm(false);
  };

  // 顧客保存
  const saveCustomer = () => {
    if (!newCustomer.company_name.trim()) {
      alert('顧客名は必須項目です');
      return;
    }

    if (editingCustomer) {
      db.updateCustomer(editingCustomer.id, newCustomer);
    } else {
      db.addCustomer(newCustomer);
    }

    setCustomers([...db.customers]);
    resetForm();
    alert(editingCustomer ? '顧客情報を更新しました' : '新規顧客を登録しました');
  };

  // 編集開始
  const startEdit = (customer) => {
    setEditingCustomer(customer);
    setNewCustomer({ ...customer });
    setShowAddForm(true);
  };

  // 削除
  const deleteCustomer = (id, companyName) => {
    if (confirm(`「${companyName}」を削除しますか？この操作は取り消せません。`)) {
      db.deleteCustomer(id);
      setCustomers([...db.customers]);
      alert('顧客を削除しました');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">顧客管理システム</h1>
              <p className="text-gray-600">顧客情報の登録・編集・管理</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              新規顧客登録
            </button>
          </div>
        </div>

        {/* 検索バー */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="顧客名、担当者名、役職、電話番号、メールアドレスで検索..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 w-1/4">顧客名</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 w-1/6">担当者</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 w-1/6">電話番号</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 w-1/4">メールアドレス</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 w-1/6">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      {searchKeyword ? '検索条件に一致する顧客が見つかりません' : '登録されている顧客がありません'}
                    </td>
                  </tr>
                ) : (
                  customers.map(customer => (
                    <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                      {/* 顧客名列 */}
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 mb-1">{customer.company_name}</div>
                        <div className="text-sm text-gray-500">
                          {customer.memo || '（支店名・部署名）'}
                        </div>
                      </td>
                      
                      {/* 担当者列 */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 mb-1">{customer.person_in_charge}</div>
                        <div className="text-sm text-gray-500">{customer.position}</div>
                      </td>
                      
                      {/* 電話番号列 */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 mb-1">{customer.phone}</div>
                        <div className="text-sm text-gray-500">
                          〒{customer.zip_code}
                        </div>
                      </td>
                      
                      {/* メールアドレス列 */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 mb-1">{customer.email}</div>
                        <div className="text-sm text-gray-500">
                          {customer.address1}
                          {customer.address2 && <div>{customer.address2}</div>}
                        </div>
                      </td>
                      
                      {/* 操作列 */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => startEdit(customer)}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center justify-center"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            編集
                          </button>
                          <button
                            onClick={() => deleteCustomer(customer.id, customer.company_name)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 flex items-center justify-center"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
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

      {/* 顧客登録・編集フォーム */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* フォームヘッダー */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingCustomer ? '顧客情報編集' : '新規顧客登録'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* フォーム内容 */}
              <div className="space-y-6">
                {/* 基本情報 */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">基本情報</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        顧客名 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newCustomer.company_name}
                        onChange={(e) => setNewCustomer({...newCustomer, company_name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="株式会社○○"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">担当者名</label>
                      <input
                        type="text"
                        value={newCustomer.person_in_charge}
                        onChange={(e) => setNewCustomer({...newCustomer, person_in_charge: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="山田太郎"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">役職</label>
                      <input
                        type="text"
                        value={newCustomer.position}
                        onChange={(e) => setNewCustomer({...newCustomer, position: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="部長、課長、主任、社長、専務取締役等"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">電話番号</label>
                      <input
                        type="tel"
                        value={newCustomer.phone}
                        onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="03-1234-5678"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
                      <input
                        type="email"
                        value={newCustomer.email}
                        onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="example@company.com"
                      />
                    </div>
                  </div>
                </div>

                {/* 住所情報 */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">住所情報</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">郵便番号</label>
                      <input
                        type="text"
                        value={newCustomer.zip_code}
                        onChange={(e) => setNewCustomer({...newCustomer, zip_code: e.target.value})}
                        className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="100-0001"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">住所1（都道府県・市区町村）</label>
                      <input
                        type="text"
                        value={newCustomer.address1}
                        onChange={(e) => setNewCustomer({...newCustomer, address1: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="東京都千代田区丸の内1-1-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">住所2（番地・建物名）</label>
                      <input
                        type="text"
                        value={newCustomer.address2}
                        onChange={(e) => setNewCustomer({...newCustomer, address2: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="丸の内ビル5F"
                      />
                    </div>
                  </div>
                </div>

                {/* その他情報 */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">その他情報</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">適格請求書発行事業者登録番号</label>
                      <input
                        type="text"
                        value={newCustomer.invoice_reg_no}
                        onChange={(e) => setNewCustomer({...newCustomer, invoice_reg_no: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="T1234567890123"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">備考</label>
                      <textarea
                        value={newCustomer.memo}
                        onChange={(e) => setNewCustomer({...newCustomer, memo: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                        placeholder="特記事項や覚書など"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* フォームボタン */}
              <div className="flex space-x-4 mt-8 pt-6 border-t">
                <button
                  onClick={resetForm}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  onClick={saveCustomer}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Save className="h-5 w-5 mr-2" />
                  {editingCustomer ? '更新' : '登録'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerManagementPage;