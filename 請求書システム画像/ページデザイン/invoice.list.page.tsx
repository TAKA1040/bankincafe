import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye, RotateCcw, CheckCircle, Clock, AlertCircle, Home } from 'lucide-react';

// データベース管理クラス
class InvoiceDB {
  constructor() {
    this.customers = JSON.parse(localStorage.getItem('bankin_customers') || JSON.stringify([
      {
        id: 1,
        company_name: '株式会社テクノロジー',
        person_in_charge: '山田太郎',
        position: '部長',
        phone: '03-1234-5678',
        email: 'yamada@example.com'
      },
      {
        id: 2,
        company_name: '有限会社サブル商事B',
        person_in_charge: '佐藤花子',
        position: '課長',
        phone: '06-9876-5432',
        email: 'sato@example.com'
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
        registration_no: 'T1234567890123',
        order_no: 'ORD-001',
        internal_order_no: 'INT-001',
        subtotal: 100000,
        tax: 10000,
        total: 110000,
        status: 'finalized',
        created_by: 'user1',
        created_at: '2025-05-15T10:00:00Z',
        updated_at: '2025-05-15T10:00:00Z',
        memo: 'バンパー修理作業',
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
        registration_no: 'T9876543210987',
        order_no: 'ORD-002',
        internal_order_no: 'INT-002',
        subtotal: 50000,
        tax: 5000,
        total: 55000,
        status: 'draft',
        created_by: 'user1',
        created_at: '2025-05-20T14:00:00Z',
        updated_at: '2025-05-20T14:00:00Z',
        memo: 'フルメンテナンスセット',
        category: 'その他',
        original_invoice_id: null
      },
      {
        id: 3,
        invoice_no: '25040015-1',
        billing_month: 2504,
        billing_date: '2025-04-10',
        customer_id: 1,
        client_name: 'UD',
        registration_no: 'T1234567890123',
        order_no: 'ORD-015',
        internal_order_no: 'INT-015',
        subtotal: 80000,
        tax: 8000,
        total: 88000,
        status: 'finalized',
        created_by: 'user1',
        created_at: '2025-04-10T09:00:00Z',
        updated_at: '2025-04-10T09:00:00Z',
        memo: 'サイドパネル塗装',
        category: 'UD',
        original_invoice_id: null
      },
      {
        id: 4,
        invoice_no: '25040020-1',
        billing_month: 2504,
        billing_date: '2025-04-25',
        customer_id: 2,
        client_name: 'GHI運輸',
        registration_no: '',
        order_no: 'ORD-020',
        internal_order_no: 'INT-020',
        subtotal: 30000,
        tax: 3000,
        total: 33000,
        status: 'canceled',
        created_by: 'user1',
        created_at: '2025-04-25T16:00:00Z',
        updated_at: '2025-04-25T16:00:00Z',
        memo: '取り消し済み',
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

    this.currentUser = { id: 'user1', name: '管理者', email: 'admin@bankin-cafe.com' };
  }

  save() {
    localStorage.setItem('bankin_customers', JSON.stringify(this.customers));
    localStorage.setItem('bankin_invoices', JSON.stringify(this.invoices));
    localStorage.setItem('bankin_invoice_items', JSON.stringify(this.invoiceItems));
  }

  // 赤伝処理
  createRedSlip(originalInvoiceId) {
    const originalInvoice = this.invoices.find(inv => inv.id === originalInvoiceId);
    if (!originalInvoice || originalInvoice.status !== 'finalized') return null;

    // 赤伝番号生成
    const basePart = originalInvoice.invoice_no.split('-')[0];
    const redSlips = this.invoices.filter(inv => 
      inv.invoice_no.startsWith(basePart + '-R')
    );
    const redSlipCount = redSlips.length + 1;
    const redSlipNumber = `${basePart}-R${redSlipCount}`;
    
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

    // 元の請求書のアイテムを取得して、マイナス値で赤伝アイテムを作成
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

    // 元の請求書のステータスを取消済みに変更
    originalInvoice.status = 'canceled';
    originalInvoice.updated_at = new Date().toISOString();

    this.save();
    return redSlip;
  }

  // 請求書削除
  deleteInvoice(invoiceId) {
    this.invoices = this.invoices.filter(inv => inv.id !== invoiceId);
    this.invoiceItems = this.invoiceItems.filter(item => item.invoice_id !== invoiceId);
    this.save();
  }
}

// 請求書詳細モーダル
function InvoiceDetailModal({ invoice, items, customer, db, onClose, onUpdate }) {
  if (!invoice) return null;

  const handleRedSlip = () => {
    if (confirm('この請求書を赤伝で取り消しますか？\n取り消し後は元に戻せません。')) {
      const redSlip = db.createRedSlip(invoice.id);
      if (redSlip) {
        alert(`赤伝 ${redSlip.invoice_no} を作成しました`);
        onUpdate();
        onClose();
      } else {
        alert('赤伝の作成に失敗しました');
      }
    }
  };

  const handleDelete = () => {
    if (confirm('この請求書を削除しますか？\n削除後は元に戻せません。')) {
      db.deleteInvoice(invoice.id);
      alert('請求書を削除しました');
      onUpdate();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">請求書詳細</h2>
              <div className="text-lg">請求書番号: {invoice.invoice_no}</div>
            </div>
            <div className="flex space-x-2">
              {invoice.status === 'draft' && (
                <button 
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  編集
                </button>
              )}
              {invoice.status === 'finalized' && (
                <button 
                  onClick={handleRedSlip}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center"
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  赤伝
                </button>
              )}
              {invoice.status === 'draft' && (
                <button 
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  削除
                </button>
              )}
              <button
                onClick={onClose}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                閉じる
              </button>
            </div>
          </div>

          {/* 基本情報 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold mb-3">請求情報</h3>
              <div className="space-y-2 text-sm">
                <div><strong>請求日:</strong> {invoice.billing_date}</div>
                <div><strong>件名:</strong> {invoice.client_name}</div>
                <div><strong>登録番号:</strong> {invoice.registration_no || '未設定'}</div>
                <div><strong>発注番号:</strong> {invoice.order_no || '未設定'}</div>
                <div><strong>オーダー番号:</strong> {invoice.internal_order_no || '未設定'}</div>
                <div><strong>ステータス:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    invoice.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 
                    invoice.status === 'finalized' ? 'bg-green-100 text-green-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {invoice.status === 'draft' ? '下書き' : 
                     invoice.status === 'finalized' ? '確定済' : '取消済'}
                  </span>
                </div>
              </div>
            </div>

            {customer && (
              <div>
                <h3 className="font-semibold mb-3">顧客情報</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>会社名:</strong> {customer.company_name}</div>
                  <div><strong>担当者:</strong> {customer.person_in_charge}</div>
                  <div><strong>役職:</strong> {customer.position}</div>
                  <div><strong>電話:</strong> {customer.phone}</div>
                  <div><strong>メール:</strong> {customer.email}</div>
                </div>
              </div>
            )}
          </div>

          {/* 作業項目 */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">作業項目</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-2 text-left">項目名</th>
                    <th className="border border-gray-200 px-4 py-2 text-center">数量</th>
                    <th className="border border-gray-200 px-4 py-2 text-right">単価</th>
                    <th className="border border-gray-200 px-4 py-2 text-right">小計</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.id}>
                      <td className="border border-gray-200 px-4 py-2">
                        <div>{item.name}</div>
                        {item.item_type === 'set' && item.set_details && (
                          <div className="text-xs text-gray-500 mt-1">({item.set_details})</div>
                        )}
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-center">{item.quantity}</td>
                      <td className="border border-gray-200 px-4 py-2 text-right">¥{item.unit_price.toLocaleString()}</td>
                      <td className="border border-gray-200 px-4 py-2 text-right">¥{item.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 金額計算 */}
          <div className="text-right space-y-2 mb-6">
            <div className="flex justify-between">
              <span>小計:</span>
              <span>¥{invoice.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>消費税:</span>
              <span>¥{invoice.tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>合計:</span>
              <span>¥{invoice.total.toLocaleString()}</span>
            </div>
          </div>

          {/* 備考 */}
          {invoice.memo && (
            <div>
              <h3 className="font-semibold mb-2">備考</h3>
              <div className="bg-gray-50 p-3 rounded">{invoice.memo}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// メイン請求書一覧コンポーネント
function InvoiceListPage() {
  const [db] = useState(() => new InvoiceDB());
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoices, setInvoices] = useState(db.invoices);

  // データ更新用
  const updateData = () => {
    setInvoices([...db.invoices]);
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = !searchKeyword || 
      invoice.invoice_no.includes(searchKeyword) ||
      invoice.client_name.includes(searchKeyword);
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'draft' && invoice.status === 'draft') ||
      (statusFilter === 'finalized' && invoice.status === 'finalized') ||
      (statusFilter === 'canceled' && invoice.status === 'canceled');
    
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'draft': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'finalized': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'canceled': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'draft': return '下書き';
      case 'finalized': return '確定済み';
      case 'canceled': return '取消済み';
      default: return '不明';
    }
  };

  const handleViewDetail = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const handleEdit = (invoiceId) => {
    alert(`請求書 ID: ${invoiceId} の編集機能は未実装です`);
  };

  const handleCreateNew = () => {
    alert('新規請求書作成機能は未実装です');
  };

  const handleRedSlip = (invoice) => {
    if (confirm('この請求書を赤伝で取り消しますか？')) {
      const redSlip = db.createRedSlip(invoice.id);
      if (redSlip) {
        alert(`赤伝 ${redSlip.invoice_no} を作成しました`);
        updateData();
      }
    }
  };

  const selectedInvoiceItems = selectedInvoice ? 
    db.invoiceItems.filter(item => item.invoice_id === selectedInvoice.id) : [];
  const selectedCustomer = selectedInvoice ? 
    db.customers.find(c => c.id === selectedInvoice.customer_id) : null;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">請求書一覧</h1>
              <p className="text-gray-600">作成済み請求書の確認・管理</p>
            </div>
            <button 
              onClick={handleCreateNew}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              新規作成
            </button>
          </div>
        </div>

        {/* 検索・フィルター */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="請求書番号や件名で検索..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded ${statusFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                すべて
              </button>
              <button
                onClick={() => setStatusFilter('draft')}
                className={`px-4 py-2 rounded ${statusFilter === 'draft' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                下書き
              </button>
              <button
                onClick={() => setStatusFilter('finalized')}
                className={`px-4 py-2 rounded ${statusFilter === 'finalized' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                確定済み
              </button>
              <button
                onClick={() => setStatusFilter('canceled')}
                className={`px-4 py-2 rounded ${statusFilter === 'canceled' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                取消済み
              </button>
            </div>
          </div>
        </div>

        {/* 請求書一覧 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredInvoices.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg mb-2">該当する請求書がありません</p>
              <p className="text-sm">検索条件を変更するか、新しい請求書を作成してください</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">日付</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">件名</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">番号</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">金額</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">状態</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInvoices.map(invoice => (
                  <tr key={invoice.id} className={`hover:bg-gray-50 ${invoice.status === 'draft' ? 'bg-yellow-50' : ''}`}>
                    {/* 日付欄（2段表示） */}
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">{invoice.billing_date}</div>
                      <div className="text-xs text-gray-500">
                        作成: {new Date(invoice.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    
                    {/* 件名欄（2段表示） */}
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">
                        {db.customers.find(c => c.id === invoice.customer_id)?.company_name || invoice.client_name}
                      </div>
                      <div className="text-xs text-gray-500">{invoice.client_name}</div>
                    </td>
                    
                    {/* 番号欄（2段表示） */}
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">{invoice.invoice_no}</div>
                      <div className="text-xs text-gray-500">{invoice.internal_order_no || 'オーダー番号なし'}</div>
                    </td>
                    
                    {/* 金額欄 */}
                    <td className="px-4 py-3 text-right">
                      <div className="text-sm font-medium text-gray-900">
                        ¥{invoice.total.toLocaleString()}
                      </div>
                    </td>
                    
                    {/* 状態欄 */}
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        invoice.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 
                        invoice.status === 'finalized' ? 'bg-green-100 text-green-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {invoice.status === 'draft' ? '下書き' : 
                         invoice.status === 'finalized' ? '確定済' : '取消済'}
                      </span>
                      {invoice.original_invoice_id && (
                        <div className="mt-1">
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-red-100 text-red-800">
                            赤伝
                          </span>
                        </div>
                      )}
                    </td>
                    
                    {/* 操作欄 */}
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center space-x-2">
                        <button 
                          onClick={() => handleViewDetail(invoice)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                        >
                          詳細
                        </button>
                        {invoice.status === 'draft' && (
                          <button 
                            onClick={() => handleEdit(invoice.id)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                          >
                            編集
                          </button>
                        )}
                        {invoice.status === 'finalized' && (
                          <button 
                            onClick={() => handleRedSlip(invoice)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
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
          )}
        </div>

        {/* 統計情報 */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">全体</div>
            <div className="text-2xl font-bold text-gray-900">{invoices.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">下書き</div>
            <div className="text-2xl font-bold text-yellow-600">
              {invoices.filter(inv => inv.status === 'draft').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">確定済み</div>
            <div className="text-2xl font-bold text-green-600">
              {invoices.filter(inv => inv.status === 'finalized').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">取消済み</div>
            <div className="text-2xl font-bold text-red-600">
              {invoices.filter(inv => inv.status === 'canceled').length}
            </div>
          </div>
        </div>

        {/* 請求書詳細モーダル */}
        {selectedInvoice && (
          <InvoiceDetailModal
            invoice={selectedInvoice}
            items={selectedInvoiceItems}
            customer={selectedCustomer}
            db={db}
            onClose={() => setSelectedInvoice(null)}
            onUpdate={updateData}
          />
        )}
      </div>
    </div>
  );
}

export default InvoiceListPage;