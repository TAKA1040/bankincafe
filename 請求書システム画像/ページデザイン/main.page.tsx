import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Edit, Trash2, FileText, BarChart3, Users, Settings, Calendar, Save, Send, Eye, RotateCcw, CheckCircle, Clock, AlertCircle, Home, Filter, Download, X, Check } from 'lucide-react';

// システム全体のデータ管理クラス
class InvoiceSystemDB {
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
        memo: ''
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
      }
    ]));

    this.invoices = JSON.parse(localStorage.getItem('bankin_invoices') || JSON.stringify([
      {
        id: 1,
        invoice_no: '25050001-1',
        billing_month: 2505,
        billing_date: '2025-05-15',
        customer_id: 1,
        client_name: 'UD',
        registration_no: '',
        order_no: '',
        internal_order_no: '',
        subtotal: 100000,
        tax: 10000,
        total: 110000,
        status: 'finalized',
        created_by: 'user1',
        created_at: '2025-05-15T10:00:00Z',
        updated_at: '2025-05-15T10:00:00Z',
        memo: '',
        category: 'UD',
        original_invoice_id: null
      },
      {
        id: 2,
        invoice_no: '25050002-1',
        billing_month: 2505,
        billing_date: '2025-05-20',
        customer_id: 2,
        client_name: 'DEF商事',
        registration_no: '',
        order_no: '',
        internal_order_no: '',
        subtotal: 50000,
        tax: 5000,
        total: 55000,
        status: 'draft',
        created_by: 'user1',
        created_at: '2025-05-20T14:00:00Z',
        updated_at: '2025-05-20T14:00:00Z',
        memo: '',
        category: 'その他',
        original_invoice_id: null
      }
    ]));

    this.invoiceItems = JSON.parse(localStorage.getItem('bankin_invoice_items') || JSON.stringify([
      {
        id: 1,
        invoice_id: 1,
        item_type: 'individual',
        name: 'バンパー修理',
        quantity: 1,
        unit_price: 100000,
        total: 100000,
        set_details: ''
      },
      {
        id: 2,
        invoice_id: 2,
        item_type: 'set',
        name: 'フルメンテナンスセット',
        quantity: 1,
        unit_price: 50000,
        total: 50000,
        set_details: 'サイドパネル塗装、バンパー点検、ライト調整'
      }
    ]));

    this.payments = JSON.parse(localStorage.getItem('bankin_payments') || JSON.stringify([
      {
        id: 1,
        invoice_id: 1,
        paid: true,
        memo: '2025-06-10入金確認',
        created_at: '2025-06-10T09:00:00Z'
      }
    ]));

    this.workHistory = JSON.parse(localStorage.getItem('bankin_work_history') || JSON.stringify([
      {
        name: 'バンパー修理',
        unit_price: 100000,
        last_used: '2025-05-15T10:00:00Z',
        customer_id: 1
      },
      {
        name: 'サイドパネル塗装',
        unit_price: 50000,
        last_used: '2025-05-20T14:00:00Z',
        customer_id: 2
      },
      {
        name: 'フロントパネル交換',
        unit_price: 80000,
        last_used: '2025-04-10T10:00:00Z',
        customer_id: 1
      },
      {
        name: 'ライト調整',
        unit_price: 15000,
        last_used: '2025-05-01T10:00:00Z',
        customer_id: 1
      }
    ]));

    this.companyInfo = JSON.parse(localStorage.getItem('bankin_company_info') || JSON.stringify({
      company_name: '鈑金Cafe',
      zip_code: '123-4567',
      address: '○○県○○市○○町1-1-1',
      phone: '012-345-6789',
      email: 'info@bankin-cafe.com',
      registration_number: 'T1234567890123'
    }));

    this.currentUser = { id: 'user1', name: '管理者', email: 'admin@bankin-cafe.com' };
  }

  save() {
    localStorage.setItem('bankin_customers', JSON.stringify(this.customers));
    localStorage.setItem('bankin_invoices', JSON.stringify(this.invoices));
    localStorage.setItem('bankin_invoice_items', JSON.stringify(this.invoiceItems));
    localStorage.setItem('bankin_payments', JSON.stringify(this.payments));
    localStorage.setItem('bankin_work_history', JSON.stringify(this.workHistory));
    localStorage.setItem('bankin_company_info', JSON.stringify(this.companyInfo));
  }

  generateInvoiceNumber(billingMonth, isRedSlip = false, originalInvoiceNo = null) {
    if (isRedSlip && originalInvoiceNo) {
      const basePart = originalInvoiceNo.split('-')[0];
      const redSlips = this.invoices.filter(inv => 
        inv.invoice_no.startsWith(basePart + '-R')
      );
      const redSlipCount = redSlips.length + 1;
      return `${basePart}-R${redSlipCount}`;
    }

    const sameMonthInvoices = this.invoices.filter(inv => 
      Math.floor(parseInt(inv.invoice_no.split('-')[0]) / 10000) === billingMonth &&
      !inv.invoice_no.includes('-R')
    );
    
    let maxSerial = 0;
    sameMonthInvoices.forEach(inv => {
      const serialPart = parseInt(inv.invoice_no.split('-')[0]) % 10000;
      if (serialPart > maxSerial) maxSerial = serialPart;
    });

    const newSerial = maxSerial + 1;
    const baseNumber = `${billingMonth.toString().padStart(4, '0')}${newSerial.toString().padStart(4, '0')}`;
    
    return `${baseNumber}-1`;
  }

  searchWorkHistory(keyword) {
    if (!keyword || keyword.length < 1) return [];
    
    const results = this.workHistory.filter(work => 
      work.name.toLowerCase().includes(keyword.toLowerCase())
    );

    results.sort((a, b) => {
      const aCount = this.workHistory.filter(w => w.name === a.name).length;
      const bCount = this.workHistory.filter(w => w.name === b.name).length;
      if (aCount !== bCount) return bCount - aCount;
      return new Date(b.last_used) - new Date(a.last_used);
    });

    const unique = [];
    const seen = new Set();
    for (const item of results) {
      if (!seen.has(item.name) && unique.length < 10) {
        seen.add(item.name);
        unique.push(item);
      }
    }
    
    return unique;
  }

  searchCustomers(keyword) {
    if (!keyword) return this.customers;
    return this.customers.filter(customer => 
      customer.company_name.includes(keyword) ||
      customer.person_in_charge.includes(keyword) ||
      customer.email.includes(keyword)
    );
  }

  createRedSlip(originalInvoiceId) {
    const originalInvoice = this.invoices.find(inv => inv.id === originalInvoiceId);
    if (!originalInvoice || originalInvoice.status !== 'finalized') return null;

    const redSlipNumber = this.generateInvoiceNumber(originalInvoice.billing_month, true, originalInvoice.invoice_no);
    
    const redSlip = {
      id: Date.now(),
      invoice_no: redSlipNumber,
      billing_month: originalInvoice.billing_month,
      billing_date: new Date().toISOString().split('T')[0],
      customer_id: originalInvoice.customer_id,
      client_name: originalInvoice.client_name,
      registration_no: originalInvoice.registration_no,
      order_no: originalInvoice.order_no,
      internal_order_no: originalInvoice.internal_order_no,
      subtotal: -originalInvoice.subtotal,
      tax: -originalInvoice.tax,
      total: -originalInvoice.total,
      status: 'finalized',
      created_by: this.currentUser.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      memo: `${originalInvoice.invoice_no} の取り消し`,
      category: originalInvoice.category,
      original_invoice_id: originalInvoiceId
    };

    this.invoices.push(redSlip);

    const originalItems = this.invoiceItems.filter(item => item.invoice_id === originalInvoiceId);
    originalItems.forEach(item => {
      this.invoiceItems.push({
        id: Date.now() + Math.random(),
        invoice_id: redSlip.id,
        item_type: item.item_type,
        name: item.name,
        quantity: -item.quantity,
        unit_price: item.unit_price,
        total: -item.total,
        set_details: item.set_details
      });
    });

    originalInvoice.status = 'canceled';
    originalInvoice.updated_at = new Date().toISOString();

    this.save();
    return redSlip;
  }
}

// メインアプリケーション
function BankinInvoiceSystem() {
  const [db] = useState(() => new InvoiceSystemDB());
  const [currentScreen, setCurrentScreen] = useState('menu');
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  
  const navigateTo = (screen, invoiceId = null) => {
    setCurrentScreen(screen);
    if (invoiceId) setSelectedInvoiceId(invoiceId);
  };

  // TOPメニュー画面
  const MenuScreen = () => {
    const menuItems = [
      { id: 'create-invoice', title: '請求書新規作成', desc: '新しい請求書を作成する', color: 'bg-cyan-400' },
      { id: 'invoice-list', title: '請求書一覧', desc: '請求書の確認・編集', color: 'bg-cyan-400' },
      { id: 'sales-management', title: '売上管理', desc: '売上データの確認', color: 'bg-cyan-400' },
      { id: 'work-search', title: '作業内容履歴', desc: '過去の作業価格などの確認', color: 'bg-cyan-400' },
      { id: 'settings', title: '設定', desc: '各種設定画面', color: 'bg-cyan-400' }
    ];

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">請求書システム</h1>
          
          <div className="space-y-4">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`w-full ${item.color} text-white py-4 px-6 rounded-lg hover:opacity-90 transition-opacity shadow-md`}
              >
                <div className="text-xl font-bold">{item.title}</div>
                <div className="text-sm mt-1 opacity-90">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 請求書作成画面
  const CreateInvoiceScreen = ({ editInvoiceId = null }) => {
    const editInvoice = editInvoiceId ? db.invoices.find(inv => inv.id === editInvoiceId) : null;
    const editItems = editInvoiceId ? db.invoiceItems.filter(item => item.invoice_id === editInvoiceId) : [];

    const [formData, setFormData] = useState(editInvoice ? {
      billing_month: editInvoice.billing_month,
      billing_date: editInvoice.billing_date,
      customer_id: editInvoice.customer_id,
      client_name: editInvoice.client_name,
      subject_name: editInvoice.client_name,
      registration_no: editInvoice.registration_no,
      order_no: editInvoice.order_no,
      internal_order_no: editInvoice.internal_order_no,
      memo: editInvoice.memo,
      category: editInvoice.category || 'UD'
    } : {
      billing_month: parseInt(`${new Date().getFullYear() - 2018}${(new Date().getMonth() + 1).toString().padStart(2, '0')}`),
      billing_date: new Date().toISOString().split('T')[0],
      customer_id: '',
      client_name: '株式会社UDトラックス',
      subject_name: '',
      registration_no: '',
      order_no: '',
      internal_order_no: '',
      memo: '',
      category: 'UD'
    });

    const [items, setItems] = useState(editItems.map(item => ({...item, id: Date.now() + Math.random()})) || []);
    const [workSearchKeyword, setWorkSearchKeyword] = useState('');
    const [workSuggestions, setWorkSuggestions] = useState([]);
    const [currentItemInput, setCurrentItemInput] = useState({
      type: 'individual',
      name: '',
      quantity: 1,
      unit_price: 0,
      set_details: ['']
    });

    // 日付移動機能
    const adjustDate = (days) => {
      const currentDate = new Date(formData.billing_date);
      currentDate.setDate(currentDate.getDate() + days);
      setFormData({...formData, billing_date: currentDate.toISOString().split('T')[0]});
    };

    // 顧客タイプ変更
    const handleCustomerTypeChange = (type) => {
      if (type === 'UD') {
        setFormData({
          ...formData,
          category: 'UD',
          client_name: '株式会社UDトラックス',
          subject_name: formData.subject_name
        });
      } else {
        setFormData({
          ...formData,
          category: 'その他',
          client_name: '',
          subject_name: ''
        });
      }
    };

    // 顧客名入力時の処理（その他の場合）
    const handleCustomerNameChange = (name) => {
      if (formData.category === 'その他') {
        setFormData({
          ...formData,
          client_name: name,
          subject_name: name
        });
      }
    };

    const handleWorkSearch = (keyword) => {
      setWorkSearchKeyword(keyword);
      const suggestions = db.searchWorkHistory(keyword);
      setWorkSuggestions(suggestions);
    };

    // 個別作業追加
    const addIndividualWork = () => {
      const newItem = {
        id: Date.now(),
        type: 'individual',
        name: '',
        quantity: 1,
        unit_price: 0,
        total: 0,
        set_details: ''
      };
      setItems([...items, newItem]);
    };

    // セット作業追加
    const addSetWork = () => {
      const newItem = {
        id: Date.now(),
        type: 'set',
        name: '',
        quantity: 1,
        unit_price: 0,
        total: 0,
        set_details: ['']
      };
      setItems([...items, newItem]);
    };

    // 作業項目の更新
    const updateItem = (id, field, value) => {
      setItems(items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unit_price') {
            updatedItem.total = updatedItem.quantity * updatedItem.unit_price;
          }
          return updatedItem;
        }
        return item;
      }));
    };

    // セット内作業追加
    const addSetDetail = (itemId) => {
      setItems(items.map(item => {
        if (item.id === itemId) {
          const newDetails = Array.isArray(item.set_details) ? [...item.set_details, ''] : [''];
          return { ...item, set_details: newDetails };
        }
        return item;
      }));
    };

    // セット内作業更新
    const updateSetDetail = (itemId, index, value) => {
      setItems(items.map(item => {
        if (item.id === itemId) {
          const newDetails = Array.isArray(item.set_details) ? [...item.set_details] : [''];
          newDetails[index] = value;
          return { ...item, set_details: newDetails };
        }
        return item;
      }));
    };

    // セット内作業削除
    const removeSetDetail = (itemId, index) => {
      setItems(items.map(item => {
        if (item.id === itemId) {
          const newDetails = Array.isArray(item.set_details) ? [...item.set_details] : [''];
          // 1つ以上ある場合のみ削除可能
          if (newDetails.length > 1) {
            newDetails.splice(index, 1);
          }
          return { ...item, set_details: newDetails };
        }
        return item;
      }));
    };

    // 作業項目削除
    const removeItem = (id) => {
      setItems(items.filter(item => item.id !== id));
    };

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const tax = Math.floor(subtotal * 0.1);
    const total = subtotal + tax;

    const saveDraft = () => {
      if (editInvoiceId) {
        const invoice = db.invoices.find(inv => inv.id === editInvoiceId);
        Object.assign(invoice, {
          ...formData,
          client_name: formData.category === 'UD' ? '株式会社UDトラックス' : formData.client_name,
          subtotal,
          tax,
          total,
          updated_at: new Date().toISOString()
        });

        db.invoiceItems = db.invoiceItems.filter(item => item.invoice_id !== editInvoiceId);
        items.forEach(item => {
          db.invoiceItems.push({
            id: Date.now() + Math.random(),
            invoice_id: editInvoiceId,
            item_type: item.type,
            name: item.name,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total: item.total,
            set_details: Array.isArray(item.set_details) ? item.set_details.join('\n') : (item.set_details || '')
          });
        });
      } else {
        const invoiceNumber = db.generateInvoiceNumber(formData.billing_month);
        
        const invoice = {
          id: Date.now(),
          invoice_no: invoiceNumber,
          ...formData,
          client_name: formData.category === 'UD' ? '株式会社UDトラックス' : formData.client_name,
          subtotal,
          tax,
          total,
          status: 'draft',
          created_by: db.currentUser.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          original_invoice_id: null
        };

        db.invoices.push(invoice);
        
        items.forEach(item => {
          db.invoiceItems.push({
            id: Date.now() + Math.random(),
            invoice_id: invoice.id,
            item_type: item.type,
            name: item.name,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total: item.total,
            set_details: Array.isArray(item.set_details) ? item.set_details.join('\n') : (item.set_details || '')
          });
        });
      }

      db.save();
      alert(editInvoiceId ? '下書きを更新しました' : '下書きとして保存しました');
      navigateTo('invoice-list');
    };

    const finalize = () => {
      if (editInvoiceId) {
        const invoice = db.invoices.find(inv => inv.id === editInvoiceId);
        Object.assign(invoice, {
          ...formData,
          client_name: formData.category === 'UD' ? '株式会社UDトラックス' : formData.client_name,
          subtotal,
          tax,
          total,
          status: 'finalized',
          updated_at: new Date().toISOString()
        });

        db.invoiceItems = db.invoiceItems.filter(item => item.invoice_id !== editInvoiceId);
        items.forEach(item => {
          db.invoiceItems.push({
            id: Date.now() + Math.random(),
            invoice_id: editInvoiceId,
            item_type: item.type,
            name: item.name,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total: item.total,
            set_details: Array.isArray(item.set_details) ? item.set_details.join('\n') : (item.set_details || '')
          });
        });
      } else {
        const invoiceNumber = db.generateInvoiceNumber(formData.billing_month);
        
        const invoice = {
          id: Date.now(),
          invoice_no: invoiceNumber,
          ...formData,
          client_name: formData.category === 'UD' ? '株式会社UDトラックス' : formData.client_name,
          subtotal,
          tax,
          total,
          status: 'finalized',
          created_by: db.currentUser.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          original_invoice_id: null
        };

        db.invoices.push(invoice);
        
        items.forEach(item => {
          db.invoiceItems.push({
            id: Date.now() + Math.random(),
            invoice_id: invoice.id,
            item_type: item.type,
            name: item.name,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total: item.total,
            set_details: Array.isArray(item.set_details) ? item.set_details.join('\n') : (item.set_details || '')
          });
        });
      }

      db.save();
      alert('請求書を確定しました');
      navigateTo('invoice-list');
    };

    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => navigateTo('invoice-list')}
            className="mb-4 text-blue-600 hover:text-blue-800 flex items-center"
          >
            ← 請求書一覧に戻る
          </button>

          <h1 className="text-2xl font-bold text-center mb-6">
            {editInvoiceId ? '請求書編集' : '請求書作成'}
          </h1>

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            {/* 請求年月と請求日の横並び */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">請求データ年月</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={`${Math.floor(formData.billing_month / 100).toString().padStart(2, '0')}/${(formData.billing_month % 100).toString().padStart(2, '0')}`}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-700"
                  />
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => setFormData({...formData, billing_month: formData.billing_month - 1})}
                      className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                    >
                      前月
                    </button>
                    <button 
                      onClick={() => setFormData({...formData, billing_month: parseInt(`${new Date().getFullYear() - 2018}${(new Date().getMonth() + 1).toString().padStart(2, '0')}`)})}
                      className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                    >
                      当月
                    </button>
                    <button 
                      onClick={() => setFormData({...formData, billing_month: formData.billing_month + 1})}
                      className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                    >
                      次月
                    </button>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">請求日</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    value={formData.billing_date}
                    onChange={(e) => setFormData({...formData, billing_date: e.target.value})}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => adjustDate(-1)}
                      className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                    >
                      前日
                    </button>
                    <button 
                      onClick={() => setFormData({...formData, billing_date: new Date().toISOString().split('T')[0]})}
                      className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                    >
                      当日
                    </button>
                    <button 
                      onClick={() => adjustDate(1)}
                      className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                    >
                      翌日
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 顧客名とラジオボタン、件名の横並び */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <div className="flex items-center space-x-4 mb-2">
                  <label className="block text-sm font-medium">顧客名</label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="customerType"
                      value="UD"
                      checked={formData.category === 'UD'}
                      onChange={() => handleCustomerTypeChange('UD')}
                      className="mr-1"
                    />
                    UD
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="customerType"
                      value="その他"
                      checked={formData.category === 'その他'}
                      onChange={() => handleCustomerTypeChange('その他')}
                      className="mr-1"
                    />
                    その他
                  </label>
                </div>
                <input
                  type="text"
                  value={formData.client_name}
                  onChange={(e) => handleCustomerNameChange(e.target.value)}
                  placeholder={formData.category === 'UD' ? '株式会社UDトラックス' : '顧客名を入力'}
                  disabled={formData.category === 'UD'}
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formData.category === 'UD' 
                      ? 'bg-gray-100 border-gray-300 text-gray-700' 
                      : 'bg-white border-gray-300'
                  }`}
                />
              </div>
              
              <div>
                <div className="mb-2 h-6 flex items-center">
                  <label className="block text-sm font-medium">件名</label>
                </div>
                <input
                  type="text"
                  value={formData.subject_name}
                  onChange={(e) => setFormData({...formData, subject_name: e.target.value})}
                  placeholder="件名を入力"
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* 登録番号、発注番号、オーダー番号の横並び */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">登録番号</label>
                <input
                  type="text"
                  value={formData.registration_no}
                  onChange={(e) => setFormData({...formData, registration_no: e.target.value})}
                  placeholder="登録番号"
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">発注番号</label>
                <input
                  type="text"
                  value={formData.order_no}
                  onChange={(e) => setFormData({...formData, order_no: e.target.value})}
                  placeholder="発注番号"
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">オーダー番号</label>
                <input
                  type="text"
                  value={formData.internal_order_no}
                  onChange={(e) => setFormData({...formData, internal_order_no: e.target.value})}
                  placeholder="オーダー番号"
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* 作業項目セクション */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-bold mb-4">作業項目</h2>
            
            <div className="flex space-x-4 mb-6">
              <button 
                onClick={addIndividualWork}
                className="bg-blue-500 text-white px-4 py-2 rounded flex items-center hover:bg-blue-600"
              >
                <Plus className="h-4 w-4 mr-1" />
                個別作業追加
              </button>
              <button 
                onClick={addSetWork}
                className="bg-blue-500 text-white px-4 py-2 rounded flex items-center hover:bg-blue-600"
              >
                <Plus className="h-4 w-4 mr-1" />
                セット作業追加
              </button>
            </div>

            {/* 作業項目一覧 */}
            {items.map((item, index) => (
              <div key={item.id} className={`border rounded p-4 mb-4 ${item.type === 'set' ? 'border-gray-300 bg-gray-50' : 'border-gray-300 bg-gray-50'}`}>
                <div className="flex justify-between items-start mb-3">
                  <h3 className={`font-medium ${item.type === 'set' ? 'text-gray-700' : 'text-gray-700'}`}>
                    {item.type === 'individual' ? '個別作業' : 'セット作業'}
                  </h3>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 flex items-center"
                  >
                    <X className="h-3 w-3 mr-1" />
                    削除
                  </button>
                </div>
                
                {item.type === 'individual' ? (
                  /* 個別作業 */
                  <div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-1">作業内容</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => {
                            updateItem(item.id, 'name', e.target.value);
                            handleWorkSearch(e.target.value);
                          }}
                          className="w-full px-3 py-2 border border-blue-300 rounded bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="作業内容を入力"
                        />
                        
                        {workSuggestions.length > 0 && workSearchKeyword && (
                          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded shadow-lg z-10 mt-1">
                            {workSuggestions.map((suggestion, suggestionIndex) => (
                              <div
                                key={suggestionIndex}
                                onClick={() => {
                                  updateItem(item.id, 'name', suggestion.name);
                                  updateItem(item.id, 'unit_price', suggestion.unit_price);
                                  setWorkSuggestions([]);
                                  setWorkSearchKeyword('');
                                }}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                              >
                                <div className="text-sm font-medium">{suggestion.name}</div>
                                <div className="text-xs text-gray-500">前回単価: ¥{suggestion.unit_price?.toLocaleString()}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">数量</label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                          className="w-full px-3 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="1"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">単価</label>
                        <input
                          type="number"
                          value={item.unit_price}
                          onChange={(e) => updateItem(item.id, 'unit_price', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="0"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">小計</label>
                        <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded text-right font-medium">
                          ¥{item.total.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* セット作業 */
                  <div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-1">セット名</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="セット名を入力"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">数量</label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                          className="w-full px-3 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="1"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">単価</label>
                        <input
                          type="number"
                          value={item.unit_price}
                          onChange={(e) => updateItem(item.id, 'unit_price', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="0"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">小計</label>
                        <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded text-right font-medium">
                          ¥{item.total.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* セット内作業内容 */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-2">セット内作業内容</label>
                      <div className="space-y-2">
                        {(Array.isArray(item.set_details) ? item.set_details : ['']).map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-center space-x-2">
                            <span className="text-sm font-medium w-6">{detailIndex + 1}.</span>
                            <input
                              type="text"
                              value={detail}
                              onChange={(e) => updateSetDetail(item.id, detailIndex, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="作業内容を入力"
                            />
                            {(Array.isArray(item.set_details) ? item.set_details : ['']).length > 1 && (
                              <button
                                onClick={() => removeSetDetail(item.id, detailIndex)}
                                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 flex items-center"
                              >
                                <X className="h-3 w-3 mr-1" />
                                削除
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => addSetDetail(item.id)}
                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 flex items-center"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        セット内作業内容追加
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 総計 */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="text-right space-y-2">
              <div className="flex justify-between">
                <span>小計:</span>
                <span>¥{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>消費税:</span>
                <span>¥{tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>合計:</span>
                <span>¥{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* 備考 */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <label className="block text-sm font-medium mb-2">備考</label>
            <textarea
              value={formData.memo}
              onChange={(e) => setFormData({...formData, memo: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="備考・特記事項があれば記載してください"
            />
          </div>

          {/* アクションボタン */}
          <div className="flex space-x-4">
            <button
              onClick={saveDraft}
              className="flex-1 bg-gray-600 text-white py-3 px-6 rounded hover:bg-gray-700"
            >
              下書き保存
            </button>
            <button
              onClick={finalize}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded hover:bg-blue-700"
            >
              確定
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 請求書一覧画面
  const InvoiceListScreen = () => {
    const [searchKeyword, setSearchKeyword] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredInvoices = db.invoices.filter(invoice => {
      const matchesSearch = !searchKeyword || 
        invoice.invoice_no.includes(searchKeyword) ||
        invoice.client_name.includes(searchKeyword);
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'draft' && invoice.status === 'draft') ||
        (statusFilter === 'finalized' && invoice.status === 'finalized');
      
      return matchesSearch && matchesStatus;
    });

    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <button 
            onClick={() => navigateTo('menu')}
            className="mb-4 text-blue-600 hover:text-blue-800"
          >
            ← ホームに戻る
          </button>

          <h1 className="text-2xl font-bold mb-6">請求書一覧</h1>

          {/* 検索・フィルター */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="請求書を検索..."
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-4 py-2 rounded ${statusFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                  すべて
                </button>
                <button
                  onClick={() => setStatusFilter('draft')}
                  className={`px-4 py-2 rounded ${statusFilter === 'draft' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                  下書き
                </button>
                <button
                  onClick={() => setStatusFilter('finalized')}
                  className={`px-4 py-2 rounded ${statusFilter === 'finalized' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                  確定済
                </button>
              </div>
            </div>
          </div>

          {/* 請求書テーブル */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">日付</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">件名</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">金額</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">状態</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInvoices.map(invoice => (
                  <tr key={invoice.id} className={invoice.status === 'draft' ? 'bg-yellow-50' : ''}>
                    <td className="px-4 py-3 text-sm">{invoice.billing_date}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{invoice.client_name}</div>
                      <div className="text-sm text-gray-500">
                        作成: {new Date(invoice.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">¥{invoice.total?.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 rounded text-xs ${
                        invoice.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 
                        invoice.status === 'finalized' ? 'bg-green-100 text-green-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {invoice.status === 'draft' ? '下書き' : 
                         invoice.status === 'finalized' ? '確定済' : '取消済'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => navigateTo('invoice-detail', invoice.id)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        >
                          詳細
                        </button>
                        {invoice.status === 'draft' && (
                          <button 
                            onClick={() => navigateTo('edit-invoice', invoice.id)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                          >
                            編集
                          </button>
                        )}
                        {invoice.status === 'finalized' && (
                          <button 
                            onClick={() => {
                              if (confirm('この請求書を赤伝で取り消しますか？')) {
                                const redSlip = db.createRedSlip(invoice.id);
                                if (redSlip) {
                                  alert(`赤伝 ${redSlip.invoice_no} を作成しました`);
                                  window.location.reload();
                                }
                              }
                            }}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                          >
                            削除
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 新規作成ボタン */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigateTo('create-invoice')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center mx-auto"
            >
              <Plus className="h-5 w-5 mr-2" />
              新規請求書作成
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 売上管理画面
  const SalesManagementScreen = () => {
    const [selectedYear, setSelectedYear] = useState(2025);
    const [categoryFilter, setCategoryFilter] = useState('all');

    const getSalesData = () => {
      const startDate = new Date(selectedYear - 1, 3, 1);
      const endDate = new Date(selectedYear, 2, 31);
      
      const periodInvoices = db.invoices.filter(invoice => {
        const invoiceDate = new Date(invoice.billing_date);
        return invoiceDate >= startDate && invoiceDate <= endDate && invoice.status === 'finalized';
      });

      const monthlyData = {};
      for (let month = 4; month <= 15; month++) {
        const actualMonth = month > 12 ? month - 12 : month;
        const year = month > 12 ? selectedYear : selectedYear - 1;
        const key = `${year}-${actualMonth.toString().padStart(2, '0')}`;
        monthlyData[key] = { UD: 0, other: 0, total: 0 };
      }

      periodInvoices.forEach(invoice => {
        const date = new Date(invoice.billing_date);
        const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        
        if (monthlyData[key]) {
          if (invoice.category === 'UD') {
            monthlyData[key].UD += invoice.total || 0;
          } else {
            monthlyData[key].other += invoice.total || 0;
          }
          monthlyData[key].total = monthlyData[key].UD + monthlyData[key].other;
        }
      });

      return monthlyData;
    };

    const salesData = getSalesData();
    const totalUD = Object.values(salesData).reduce((sum, data) => sum + data.UD, 0);
    const totalOther = Object.values(salesData).reduce((sum, data) => sum + data.other, 0);
    const grandTotal = totalUD + totalOther;

    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <button 
            onClick={() => navigateTo('menu')}
            className="mb-4 text-blue-600 hover:text-blue-800"
          >
            ← ホームに戻る
          </button>

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">売上管理</h1>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold mb-4">
              {selectedYear - 1}年04月〜{selectedYear}年03月 売上集計
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">年月</th>
                    <th className="text-right py-2">UD売上 (円)</th>
                    <th className="text-right py-2">その他売上 (円)</th>
                    <th className="text-right py-2">合計 (円)</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(salesData).map(([key, data]) => {
                    const [year, month] = key.split('-');
                    const displayMonth = `${year}-${month}`;
                    
                    return (
                      <tr key={key} className="border-b hover:bg-gray-50">
                        <td className="py-2">{displayMonth}</td>
                        <td className="text-right py-2">{data.UD.toLocaleString()}</td>
                        <td className="text-right py-2">{data.other.toLocaleString()}</td>
                        <td className="text-right py-2 font-medium">{data.total.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                  <tr className="border-t-2 border-gray-800 font-bold bg-gray-100">
                    <td className="py-3">{selectedYear - 1}年04月〜{selectedYear}年03月 合計:</td>
                    <td className="text-right py-3">{totalUD.toLocaleString()}</td>
                    <td className="text-right py-3">{totalOther.toLocaleString()}</td>
                    <td className="text-right py-3">{grandTotal.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 作業検索画面
  const WorkSearchScreen = () => {
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = () => {
      if (!searchKeyword) return;

      const results = [];
      db.invoices.forEach(invoice => {
        const items = db.invoiceItems.filter(item => item.invoice_id === invoice.id);
        items.forEach(item => {
          if (item.name.toLowerCase().includes(searchKeyword.toLowerCase())) {
            const customer = db.customers.find(c => c.id === invoice.customer_id);
            results.push({
              invoice_no: invoice.invoice_no,
              customer_name: customer?.company_name || invoice.client_name,
              date: invoice.billing_date,
              work_name: item.name,
              quantity: item.quantity,
              unit_price: item.unit_price,
              total: item.total
            });
          }
        });
      });

      setSearchResults(results);
    };

    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <button 
            onClick={() => navigateTo('menu')}
            className="mb-4 text-blue-600 hover:text-blue-800"
          >
            ← ホームに戻る
          </button>

          <h1 className="text-2xl font-bold mb-6">作業内容履歴</h1>

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="作業名で検索..."
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                検索
              </button>
            </div>
          </div>

          {searchResults.length > 0 && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">請求書No</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">顧客名</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">日付</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">作業名</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">数量</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">単価</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">合計</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {searchResults.map((result, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm">{result.invoice_no}</td>
                      <td className="px-4 py-3 text-sm">{result.customer_name}</td>
                      <td className="px-4 py-3 text-sm">{result.date}</td>
                      <td className="px-4 py-3 text-sm font-medium">{result.work_name}</td>
                      <td className="px-4 py-3 text-sm">{result.quantity}</td>
                      <td className="px-4 py-3 text-sm">¥{result.unit_price.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm">¥{result.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 設定画面
  const SettingsScreen = () => {
    const settingsItems = [
      { id: 'customer-management', title: '顧客管理', desc: '顧客情報の登録・編集', color: 'bg-cyan-400' },
      { id: 'dictionary', title: '辞書登録・編集', desc: '作業内容辞書の管理', color: 'bg-cyan-400' },
      { id: 'company-settings', title: '会社情報設定', desc: '自社情報の登録・編集', color: 'bg-cyan-400' },
      { id: 'work-search', title: '作業内容履歴', desc: '過去の作業価格などの確認', color: 'bg-cyan-400' }
    ];

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">各種設定</h1>
          
          <div className="space-y-4">
            {settingsItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'customer-management') {
                    navigateTo('customer-management');
                  } else if (item.id === 'work-search') {
                    navigateTo('work-search');
                  } else {
                    alert('この機能は開発中です');
                  }
                }}
                className={`w-full ${item.color} text-white py-4 px-6 rounded-lg hover:opacity-90 transition-opacity shadow-md`}
              >
                <div className="text-xl font-bold">{item.title}</div>
                <div className="text-sm mt-1 opacity-90">{item.desc}</div>
              </button>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button 
              onClick={() => navigateTo('menu')}
              className="text-blue-600 hover:text-blue-800"
            >
              ← ホームに戻る
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 顧客管理画面
  const CustomerManagementScreen = () => {
    const [searchKeyword, setSearchKeyword] = useState('');

    const filteredCustomers = db.searchCustomers(searchKeyword);

    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <button 
            onClick={() => navigateTo('settings')}
            className="mb-4 text-blue-600 hover:text-blue-800"
          >
            ← 戻る
          </button>

          <h1 className="text-2xl font-bold mb-6">顧客一覧</h1>

          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="顧客名、担当者名、役職、電話番号、メールアドレスで検索..."
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">顧客名</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">担当者名</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">役職</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">電話番号</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">メールアドレス</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCustomers.map(customer => (
                  <tr key={customer.id}>
                    <td className="px-4 py-3 text-sm font-medium">{customer.company_name}</td>
                    <td className="px-4 py-3 text-sm">{customer.person_in_charge}</td>
                    <td className="px-4 py-3 text-sm">{customer.position}</td>
                    <td className="px-4 py-3 text-sm">{customer.phone}</td>
                    <td className="px-4 py-3 text-sm">{customer.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // 画面ルーティング
  const renderScreen = () => {
    switch (currentScreen) {
      case 'menu': return <MenuScreen />;
      case 'create-invoice': return <CreateInvoiceScreen />;
      case 'edit-invoice': return <CreateInvoiceScreen editInvoiceId={selectedInvoiceId} />;
      case 'invoice-list': return <InvoiceListScreen />;
      case 'sales-management': return <SalesManagementScreen />;
      case 'work-search': return <WorkSearchScreen />;
      case 'customer-management': return <CustomerManagementScreen />;
      case 'settings': return <SettingsScreen />;
      default: return <MenuScreen />;
    }
  };

  return (
    <div className="app">
      {renderScreen()}
    </div>
  );
}

export default BankinInvoiceSystem;