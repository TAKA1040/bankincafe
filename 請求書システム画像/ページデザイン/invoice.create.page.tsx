import React, { useState, useCallback, useMemo } from 'react';
import { Plus, X, Save, FileText, Calendar, Search, AlertCircle, Check } from 'lucide-react';

class InvoiceSystemDB {
  constructor() {
    this.workHistory = [
      {
        name: 'バンパー修理',
        unit_price: 100000,
        last_used: '2025-05-15T10:00:00Z',
        customer_id: 1,
        frequency: 15
      },
      {
        name: 'サイドパネル塗装',
        unit_price: 50000,
        last_used: '2025-05-20T14:00:00Z',
        customer_id: 2,
        frequency: 8
      },
      {
        name: 'フロントパネル交換',
        unit_price: 80000,
        last_used: '2025-04-10T10:00:00Z',
        customer_id: 1,
        frequency: 12
      },
      {
        name: 'ライト調整',
        unit_price: 15000,
        last_used: '2025-05-01T10:00:00Z',
        customer_id: 1,
        frequency: 25
      },
      {
        name: 'ドア交換',
        unit_price: 120000,
        last_used: '2025-04-15T10:00:00Z',
        customer_id: 1,
        frequency: 5
      },
      {
        name: 'ミラー修理',
        unit_price: 25000,
        last_used: '2025-05-10T10:00:00Z',
        customer_id: 2,
        frequency: 10
      }
    ];

    this.currentUser = { id: 'user1', name: '管理者', email: 'admin@bankin-cafe.com' };
    this.savedDrafts = [];
  }

  searchWorkHistory(keyword) {
    if (!keyword || keyword.length < 1) return [];
    
    const results = this.workHistory.filter(work => 
      work.name.toLowerCase().includes(keyword.toLowerCase())
    );

    results.sort((a, b) => {
      if (a.frequency !== b.frequency) return b.frequency - a.frequency;
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

  generateInvoiceNumber(billingMonth) {
    const baseNumber = `${billingMonth.toString().padStart(4, '0')}0001`;
    return `${baseNumber}-1`;
  }

  saveDraft(invoice) {
    this.savedDrafts.push({...invoice, id: Date.now()});
    console.log('下書き保存:', invoice);
  }

  save() {
    console.log('データを保存しました');
  }
}

const CreateInvoiceScreen = () => {
  const [db] = useState(() => new InvoiceSystemDB());
  
  const [formData, setFormData] = useState({
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

  const [items, setItems] = useState([]);
  const [workSearchKeyword, setWorkSearchKeyword] = useState('');
  const [workSuggestions, setWorkSuggestions] = useState([]);
  const [errors, setErrors] = useState({});
  const [saveStatus, setSaveStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // バリデーション
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!formData.client_name.trim()) {
      newErrors.client_name = '顧客名は必須です';
    }
    
    if (!formData.subject_name.trim()) {
      newErrors.subject_name = '件名は必須です';
    }
    
    if (items.length === 0) {
      newErrors.items = '作業項目を少なくとも1つ追加してください';
    }
    
    items.forEach((item, index) => {
      if (!item.name.trim()) {
        newErrors[`item_${index}_name`] = '作業内容は必須です';
      }
      if (item.unit_price <= 0) {
        newErrors[`item_${index}_price`] = '単価は0より大きい値を入力してください';
      }
      if (item.type === 'set' && (!item.set_details || item.set_details.every(detail => !detail.trim()))) {
        newErrors[`item_${index}_details`] = 'セット内作業内容を入力してください';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, items]);

  // 日付移動機能
  const adjustDate = useCallback((days) => {
    const currentDate = new Date(formData.billing_date);
    currentDate.setDate(currentDate.getDate() + days);
    setFormData(prev => ({...prev, billing_date: currentDate.toISOString().split('T')[0]}));
  }, [formData.billing_date]);

  // 月調整機能
  const adjustMonth = useCallback((delta) => {
    const currentMonth = formData.billing_month;
    let year = Math.floor(currentMonth / 100);
    let month = currentMonth % 100;
    
    month += delta;
    if (month > 12) {
      year += 1;
      month = 1;
    } else if (month < 1) {
      year -= 1;
      month = 12;
    }
    
    const newBillingMonth = year * 100 + month;
    setFormData(prev => ({...prev, billing_month: newBillingMonth}));
  }, [formData.billing_month]);

  // 顧客タイプ変更
  const handleCustomerTypeChange = useCallback((type) => {
    if (type === 'UD') {
      setFormData(prev => ({
        ...prev,
        category: 'UD',
        client_name: '株式会社UDトラックス',
        subject_name: prev.subject_name
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        category: 'その他',
        client_name: '',
        subject_name: ''
      }));
    }
    // エラーをクリア
    setErrors(prev => ({...prev, client_name: undefined}));
  }, []);

  // 顧客名入力時の処理
  const handleCustomerNameChange = useCallback((name) => {
    if (formData.category === 'その他') {
      setFormData(prev => ({
        ...prev,
        client_name: name,
        subject_name: name
      }));
    }
    // エラーをクリア
    setErrors(prev => ({...prev, client_name: undefined}));
  }, [formData.category]);

  // 作業検索
  const handleWorkSearch = useCallback((keyword) => {
    setWorkSearchKeyword(keyword);
    const suggestions = db.searchWorkHistory(keyword);
    setWorkSuggestions(suggestions);
  }, [db]);

  // 作業項目追加
  const addIndividualWork = useCallback(() => {
    const newItem = {
      id: Date.now(),
      type: 'individual',
      name: '',
      quantity: 1,
      unit_price: 0,
      total: 0,
      set_details: ''
    };
    setItems(prev => [...prev, newItem]);
    setErrors(prev => ({...prev, items: undefined}));
  }, []);

  const addSetWork = useCallback(() => {
    const newItem = {
      id: Date.now(),
      type: 'set',
      name: '',
      quantity: 1,
      unit_price: 0,
      total: 0,
      set_details: ['']
    };
    setItems(prev => [...prev, newItem]);
    setErrors(prev => ({...prev, items: undefined}));
  }, []);

  // 作業項目の更新
  const updateItem = useCallback((id, field, value) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unit_price') {
          updatedItem.total = updatedItem.quantity * updatedItem.unit_price;
        }
        return updatedItem;
      }
      return item;
    }));
    
    // エラーをクリア
    const itemIndex = items.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
      if (field === 'name') {
        setErrors(prev => ({...prev, [`item_${itemIndex}_name`]: undefined}));
      } else if (field === 'unit_price') {
        setErrors(prev => ({...prev, [`item_${itemIndex}_price`]: undefined}));
      }
    }
  }, [items]);

  // セット作業関連の関数
  const addSetDetail = useCallback((itemId) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const newDetails = Array.isArray(item.set_details) ? [...item.set_details, ''] : [''];
        return { ...item, set_details: newDetails };
      }
      return item;
    }));
  }, []);

  const updateSetDetail = useCallback((itemId, index, value) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const newDetails = Array.isArray(item.set_details) ? [...item.set_details] : [''];
        newDetails[index] = value;
        return { ...item, set_details: newDetails };
      }
      return item;
    }));
    
    // エラーをクリア
    const itemIndex = items.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
      setErrors(prev => ({...prev, [`item_${itemIndex}_details`]: undefined}));
    }
  }, [items]);

  const removeSetDetail = useCallback((itemId, index) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const newDetails = Array.isArray(item.set_details) ? [...item.set_details] : [''];
        if (newDetails.length > 1) {
          newDetails.splice(index, 1);
        }
        return { ...item, set_details: newDetails };
      }
      return item;
    }));
  }, []);

  // 作業項目削除
  const removeItem = useCallback((id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  // 金額計算（メモ化）
  const { subtotal, tax, total } = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const tax = Math.floor(subtotal * 0.1);
    const total = subtotal + tax;
    return { subtotal, tax, total };
  }, [items]);

  // 保存関数
  const saveDraft = useCallback(async () => {
    if (!validateForm()) {
      setSaveStatus('validation-error');
      setTimeout(() => setSaveStatus(''), 3000);
      return;
    }

    setIsLoading(true);
    
    try {
      const invoiceNumber = db.generateInvoiceNumber(formData.billing_month);
      
      const invoice = {
        id: Date.now(),
        invoice_no: invoiceNumber,
        ...formData,
        client_name: formData.category === 'UD' ? '株式会社UDトラックス' : formData.client_name,
        items: items,
        subtotal,
        tax,
        total,
        status: 'draft',
        created_by: db.currentUser.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        original_invoice_id: null
      };

      await new Promise(resolve => setTimeout(resolve, 500)); // 保存処理のシミュレーション
      
      db.saveDraft(invoice);
      setSaveStatus('draft-saved');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setIsLoading(false);
    }
  }, [formData, items, subtotal, tax, total, db, validateForm]);

  const finalize = useCallback(async () => {
    if (!validateForm()) {
      setSaveStatus('validation-error');
      setTimeout(() => setSaveStatus(''), 3000);
      return;
    }

    setIsLoading(true);
    
    try {
      const invoiceNumber = db.generateInvoiceNumber(formData.billing_month);
      
      const invoice = {
        id: Date.now(),
        invoice_no: invoiceNumber,
        ...formData,
        client_name: formData.category === 'UD' ? '株式会社UDトラックス' : formData.client_name,
        items: items,
        subtotal,
        tax,
        total,
        status: 'finalized',
        created_by: db.currentUser.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        original_invoice_id: null
      };

      await new Promise(resolve => setTimeout(resolve, 1000)); // 確定処理のシミュレーション
      
      console.log('請求書確定:', invoice);
      db.save();
      setSaveStatus('finalized');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setIsLoading(false);
    }
  }, [formData, items, subtotal, tax, total, db, validateForm]);

  // ステータス表示
  const StatusMessage = () => {
    if (!saveStatus) return null;
    
    const statusConfig = {
      'draft-saved': { icon: Save, text: '下書きを保存しました', color: 'bg-green-500' },
      'finalized': { icon: Check, text: '請求書を確定しました', color: 'bg-blue-500' },
      'validation-error': { icon: AlertCircle, text: '入力内容に不備があります', color: 'bg-red-500' },
      'error': { icon: AlertCircle, text: '保存に失敗しました', color: 'bg-red-500' }
    };
    
    const config = statusConfig[saveStatus];
    if (!config) return null;
    
    const Icon = config.icon;
    
    return (
      <div className={`fixed top-4 right-4 ${config.color} text-white px-4 py-2 rounded-lg shadow-lg flex items-center z-50`}>
        <Icon className="h-4 w-4 mr-2" />
        {config.text}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <StatusMessage />
      
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-6">
          <FileText className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-800">請求書作成</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">請求データ年月</label>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={`${Math.floor(formData.billing_month / 100).toString().padStart(2, '0')}/${(formData.billing_month % 100).toString().padStart(2, '0')}`}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-700"
                />
                <div className="flex space-x-1">
                  <button 
                    onClick={() => adjustMonth(-1)}
                    className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300 transition-colors"
                  >
                    前月
                  </button>
                  <button 
                    onClick={() => setFormData(prev => ({...prev, billing_month: parseInt(`${new Date().getFullYear() - 2018}${(new Date().getMonth() + 1).toString().padStart(2, '0')}`)}))}
                    className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300 transition-colors"
                  >
                    当月
                  </button>
                  <button 
                    onClick={() => adjustMonth(1)}
                    className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300 transition-colors"
                  >
                    次月
                  </button>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">請求日</label>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={formData.billing_date}
                  onChange={(e) => setFormData(prev => ({...prev, billing_date: e.target.value}))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex space-x-1">
                  <button 
                    onClick={() => adjustDate(-1)}
                    className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300 transition-colors"
                  >
                    前日
                  </button>
                  <button 
                    onClick={() => setFormData(prev => ({...prev, billing_date: new Date().toISOString().split('T')[0]}))}
                    className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300 transition-colors"
                  >
                    当日
                  </button>
                  <button 
                    onClick={() => adjustDate(1)}
                    className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300 transition-colors"
                  >
                    翌日
                  </button>
                </div>
              </div>
            </div>
          </div>

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
                } ${errors.client_name ? 'border-red-500' : ''}`}
              />
              {errors.client_name && (
                <p className="text-red-500 text-xs mt-1">{errors.client_name}</p>
              )}
            </div>
            
            <div>
              <div className="mb-2 h-6 flex items-center">
                <label className="block text-sm font-medium">件名</label>
              </div>
              <input
                type="text"
                value={formData.subject_name}
                onChange={(e) => {
                  setFormData(prev => ({...prev, subject_name: e.target.value}));
                  setErrors(prev => ({...prev, subject_name: undefined}));
                }}
                placeholder="件名を入力"
                className={`w-full px-3 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.subject_name ? 'border-red-500' : ''
                }`}
              />
              {errors.subject_name && (
                <p className="text-red-500 text-xs mt-1">{errors.subject_name}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">登録番号</label>
              <input
                type="text"
                value={formData.registration_no}
                onChange={(e) => setFormData(prev => ({...prev, registration_no: e.target.value}))}
                placeholder="登録番号"
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">発注番号</label>
              <input
                type="text"
                value={formData.order_no}
                onChange={(e) => setFormData(prev => ({...prev, order_no: e.target.value}))}
                placeholder="発注番号"
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">オーダー番号</label>
              <input
                type="text"
                value={formData.internal_order_no}
                onChange={(e) => setFormData(prev => ({...prev, internal_order_no: e.target.value}))}
                placeholder="オーダー番号"
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 作業項目セクション */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">作業項目</h2>
          
          {errors.items && (
            <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
              <p className="text-red-600 text-sm">{errors.items}</p>
            </div>
          )}

          {items.map((item, index) => (
            <div key={item.id} className={`border rounded p-4 mb-4 ${item.type === 'set' ? 'border-green-300 bg-green-50' : 'border-blue-300 bg-blue-50'}`}>
              <div className="flex justify-between items-start mb-3">
                <h3 className={`font-medium ${item.type === 'set' ? 'text-green-700' : 'text-blue-700'}`}>
                  {item.type === 'individual' ? '個別作業' : 'セット作業'} #{index + 1}
                </h3>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 flex items-center transition-colors"
                >
                  <X className="h-3 w-3 mr-1" />
                  削除
                </button>
              </div>
              
              {item.type === 'individual' ? (
                <div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">作業内容</label>
                    <div className="relative">
                      <div className="flex items-center">
                        <Search className="h-4 w-4 text-gray-400 absolute left-3 z-10" />
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => {
                            updateItem(item.id, 'name', e.target.value);
                            handleWorkSearch(e.target.value);
                          }}
                          className={`w-full pl-10 pr-3 py-2 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors[`item_${index}_name`] ? 'border-red-500' : 'border-blue-300'
                          }`}
                          placeholder="作業内容を入力"
                        />
                      </div>
                      
                      {workSuggestions.length > 0 && workSearchKeyword && (
                        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded shadow-lg z-20 mt-1">
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
                              <div className="text-xs text-gray-500">
                                前回単価: ¥{suggestion.unit_price?.toLocaleString()} | 使用頻度: {suggestion.frequency}回
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {errors[`item_${index}_name`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_name`]}</p>
                    )}
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
                        className={`w-full px-3 py-2 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors[`item_${index}_price`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        min="0"
                      />
                      {errors[`item_${index}_price`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_price`]}</p>
                      )}
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
                <div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">セット名</label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                      className={`w-full px-3 py-2 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors[`item_${index}_name`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="セット名を入力"
                    />
                    {errors[`item_${index}_name`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_name`]}</p>
                    )}
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
                        className={`w-full px-3 py-2 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors[`item_${index}_price`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        min="0"
                      />
                      {errors[`item_${index}_price`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_price`]}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">小計</label>
                      <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded text-right font-medium">
                        ¥{item.total.toLocaleString()}
                      </div>
                    </div>
                  </div>

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
                              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 flex items-center transition-colors"
                            >
                              <X className="h-3 w-3 mr-1" />
                              削除
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    {errors[`item_${index}_details`] && (
                      <p className="text-red-500 text-xs mt-2">{errors[`item_${index}_details`]}</p>
                    )}
                    <button
                      onClick={() => addSetDetail(item.id)}
                      className="mt-2 bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600 flex items-center transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      セット内作業内容追加
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {items.length === 0 && (
            <div className="text-center py-8 text-gray-500 mb-6">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>作業項目を追加してください</p>
            </div>
          )}

          <div className="flex space-x-4">
            <button 
              onClick={addIndividualWork}
              className="bg-blue-500 text-white px-4 py-2 rounded flex items-center hover:bg-blue-600 transition-colors"
            >
              <Plus className="h-4 w-4 mr-1" />
              個別作業追加
            </button>
            <button 
              onClick={addSetWork}
              className="bg-green-500 text-white px-4 py-2 rounded flex items-center hover:bg-green-600 transition-colors"
            >
              <Plus className="h-4 w-4 mr-1" />
              セット作業追加
            </button>
          </div>
        </div>

        {/* 総計 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">金額</h3>
          <div className="text-right space-y-2">
            <div className="flex justify-between text-lg">
              <span>小計:</span>
              <span>¥{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span>消費税 (10%):</span>
              <span>¥{tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xl font-bold border-t pt-2">
              <span>合計:</span>
              <span className="text-blue-600">¥{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* 備考 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <label className="block text-sm font-medium mb-2">備考</label>
          <textarea
            value={formData.memo}
            onChange={(e) => setFormData(prev => ({...prev, memo: e.target.value}))}
            className="w-full px-3 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            placeholder="備考・特記事項があれば記載してください"
          />
        </div>

        {/* アクションボタン */}
        <div className="flex space-x-4">
          <button
            onClick={saveDraft}
            disabled={isLoading}
            className="flex-1 bg-gray-600 text-white py-3 px-6 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                保存中...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                下書き保存
              </>
            )}
          </button>
          <button
            onClick={finalize}
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                確定中...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                確定
              </>
            )}
          </button>
        </div>

        {/* キーボードショートカット案内 */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Ctrl + S: 下書き保存 | Ctrl + Enter: 確定</p>
        </div>
      </div>
    </div>
  );
};

// キーボードショートカット対応
const EnhancedCreateInvoiceScreen = () => {
  const [showCreateInvoice, setShowCreateInvoice] = useState(true);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        // 下書き保存のトリガー
        console.log('下書き保存ショートカット');
      } else if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        // 確定のトリガー
        console.log('確定ショートカット');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return <CreateInvoiceScreen />;
};

export default EnhancedCreateInvoiceScreen;