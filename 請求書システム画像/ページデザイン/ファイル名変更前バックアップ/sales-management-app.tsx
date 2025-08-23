import React, { useState, useCallback } from 'react';
import { Check } from 'lucide-react';

// 売上管理専用のデータ管理クラス（メモリベース）
class SalesDB {
  constructor() {
    this.customers = [
      {
        id: 1,
        company_name: 'UDトラックス株式会社',
        person_in_charge: '営業部',
        position: '担当者',
        phone: '03-1234-5678',
        email: 'sales@ud-trucks.com'
      },
      {
        id: 2,
        company_name: 'いすゞ自動車九州株式会社',
        person_in_charge: '長崎サービスセンター',
        position: 'サービス担当',
        phone: '095-8765-4321',
        email: 'service@isuzu-kyushu.com'
      },
      {
        id: 3,
        company_name: '株式会社ロジコム・アイ',
        person_in_charge: '整備部',
        position: '部長',
        phone: '093-111-2222',
        email: 'maintenance@logicom.com'
      },
      {
        id: 4,
        company_name: '東邦興産株式会社',
        person_in_charge: '運送課',
        position: '課長',
        phone: '093-333-4444',
        email: 'transport@toho-kosan.com'
      },
      {
        id: 5,
        company_name: '鶴丸海運株式会社',
        person_in_charge: '車両管理部',
        position: 'マネージャー',
        phone: '093-555-6666',
        email: 'fleet@tsurumaru.com'
      },
      {
        id: 6,
        company_name: '中野運送',
        person_in_charge: '中野正博',
        position: '代表',
        phone: '0948-777-8888',
        email: 'nakano@transport.com'
      }
    ];

    this.invoices = [
      // 2025年6月のデータ
      {
        id: 1,
        invoice_no: '25063417-1',
        billing_month: 202506,
        billing_date: '2025-06-02',
        customer_id: 6,
        client_name: '燃料キャップ嚙み込み分解取外し',
        registration_no: '筑豊130え･･89',
        order_no: '1700414488',
        internal_order_no: '2502636-01',
        subtotal: 8000,
        tax: 800,
        total: 8800,
        status: 'finalized',
        created_by: 'user1',
        created_at: '2025-06-02T10:00:00Z',
        updated_at: '2025-06-02T10:00:00Z',
        memo: '燃料キャップ嚙み込み分解取外し',
        category: 'UD',
        original_invoice_id: null
      },
      {
        id: 2,
        invoice_no: '25063418-1',
        billing_month: 202506,
        billing_date: '2025-06-02',
        customer_id: 2,
        client_name: 'マフラーカバー脱着ステイ折損ステン溶接 等',
        registration_no: '長崎101か･･･1',
        order_no: '1700414490',
        internal_order_no: '250262-01',
        subtotal: 23000,
        tax: 2300,
        total: 25300,
        status: 'finalized',
        created_by: 'user1',
        created_at: '2025-06-02T14:00:00Z',
        updated_at: '2025-06-02T14:00:00Z',
        memo: 'マフラーカバー修理一式',
        category: 'UD',
        original_invoice_id: null
      },
      {
        id: 3,
        invoice_no: '25063418-2',
        billing_month: 202506,
        billing_date: '2025-06-02',
        customer_id: 2,
        client_name: '床亀裂溶接',
        registration_no: '長崎101か･･･1',
        order_no: '1700414490',
        internal_order_no: '250262-01',
        subtotal: 5000,
        tax: 500,
        total: 5500,
        status: 'finalized',
        created_by: 'user1',
        created_at: '2025-06-02T14:30:00Z',
        updated_at: '2025-06-02T14:30:00Z',
        memo: '床亀裂溶接',
        category: 'UD',
        original_invoice_id: null
      },
      {
        id: 4,
        invoice_no: '25063419-1',
        billing_month: 202506,
        billing_date: '2025-06-04',
        customer_id: 2,
        client_name: 'マフラーカバー脱着ステイ折損ステン溶接 等',
        registration_no: '長崎130あ5380',
        order_no: '1700414489',
        internal_order_no: '2502626-01',
        subtotal: 18000,
        tax: 1800,
        total: 19800,
        status: 'finalized',
        created_by: 'user1',
        created_at: '2025-06-04T11:00:00Z',
        updated_at: '2025-06-04T11:00:00Z',
        memo: 'マフラーカバー修理・リベット打ち替え',
        category: 'UD',
        original_invoice_id: null
      },
      {
        id: 5,
        invoice_no: '25063420-1',
        billing_month: 202506,
        billing_date: '2025-06-04',
        customer_id: 3,
        client_name: 'ドライバーシート分解作動不良点検',
        registration_no: '北九州100あ9036',
        order_no: '1700414494',
        internal_order_no: '2502667-01',
        subtotal: 10000,
        tax: 1000,
        total: 11000,
        status: 'finalized',
        created_by: 'user1',
        created_at: '2025-06-04T13:00:00Z',
        updated_at: '2025-06-04T13:00:00Z',
        memo: 'ドライバーシート分解作動不良点検',
        category: 'UD',
        original_invoice_id: null
      },
      {
        id: 6,
        invoice_no: '25063421-1',
        billing_month: 202506,
        billing_date: '2025-06-05',
        customer_id: 4,
        client_name: '煽りスケット取替加工',
        registration_no: '北九州100き3314',
        order_no: '1700414495',
        internal_order_no: '2502533-01',
        subtotal: 10000,
        tax: 1000,
        total: 11000,
        status: 'finalized',
        created_by: 'user1',
        created_at: '2025-06-05T09:00:00Z',
        updated_at: '2025-06-05T09:00:00Z',
        memo: '煽りスケット取替加工',
        category: 'UD',
        original_invoice_id: null
      },
      {
        id: 7,
        invoice_no: '25063422-1',
        billing_month: 202506,
        billing_date: '2025-06-05',
        customer_id: 5,
        client_name: 'ウィング蝶番点検・グリスアップ 等',
        registration_no: '北九州100え3245',
        order_no: '1700414500',
        internal_order_no: '2502707-01',
        subtotal: 8000,
        tax: 800,
        total: 8800,
        status: 'finalized',
        created_by: 'user1',
        created_at: '2025-06-05T15:00:00Z',
        updated_at: '2025-06-05T15:00:00Z',
        memo: 'ウィング蝶番点検とグリスアップ',
        category: 'UD',
        original_invoice_id: null
      },
      {
        id: 8,
        invoice_no: '25063423-1',
        billing_month: 202506,
        billing_date: '2025-06-05',
        customer_id: 5,
        client_name: '右煽りキャッチ取替',
        registration_no: '北九州130か3001',
        order_no: '1700414501',
        internal_order_no: '2502650-01',
        subtotal: 5000,
        tax: 500,
        total: 5500,
        status: 'finalized',
        created_by: 'user1',
        created_at: '2025-06-05T16:00:00Z',
        updated_at: '2025-06-05T16:00:00Z',
        memo: '右煽りキャッチ取替',
        category: 'UD',
        original_invoice_id: null
      },
      // 2025年5月のデータ
      {
        id: 9,
        invoice_no: '25053410-1',
        billing_month: 202505,
        billing_date: '2025-05-15',
        customer_id: 1,
        client_name: 'トラック荷台修理',
        registration_no: '福岡100あ1234',
        order_no: '1700414400',
        internal_order_no: '2505001-01',
        subtotal: 45000,
        tax: 4500,
        total: 49500,
        status: 'finalized',
        created_by: 'user1',
        created_at: '2025-05-15T10:00:00Z',
        updated_at: '2025-05-15T10:00:00Z',
        memo: 'トラック荷台修理',
        category: 'UD',
        original_invoice_id: null
      },
      {
        id: 10,
        invoice_no: '25053411-1',
        billing_month: 202505,
        billing_date: '2025-05-20',
        customer_id: 2,
        client_name: 'バンパー交換・塗装',
        registration_no: '長崎100か5678',
        order_no: '1700414401',
        internal_order_no: '2505002-01',
        subtotal: 35000,
        tax: 3500,
        total: 38500,
        status: 'finalized',
        created_by: 'user1',
        created_at: '2025-05-20T14:00:00Z',
        updated_at: '2025-05-20T14:00:00Z',
        memo: 'バンパー交換・塗装',
        category: 'UD',
        original_invoice_id: null
      },
      // 2025年4月のデータ
      {
        id: 11,
        invoice_no: '25043401-1',
        billing_month: 202504,
        billing_date: '2025-04-10',
        customer_id: 3,
        client_name: 'キャビン修理・溶接',
        registration_no: '北九州100き9999',
        order_no: '1700414350',
        internal_order_no: '2504001-01',
        subtotal: 28000,
        tax: 2800,
        total: 30800,
        status: 'finalized',
        created_by: 'user1',
        created_at: '2025-04-10T11:00:00Z',
        updated_at: '2025-04-10T11:00:00Z',
        memo: 'キャビン修理・溶接',
        category: 'UD',
        original_invoice_id: null
      },
      {
        id: 12,
        invoice_no: '25043402-1',
        billing_month: 202504,
        billing_date: '2025-04-25',
        customer_id: 4,
        client_name: 'エンジンカバー塗装',
        registration_no: '北九州100え7777',
        order_no: '1700414351',
        internal_order_no: '2504002-01',
        subtotal: 22000,
        tax: 2200,
        total: 24200,
        status: 'finalized',
        created_by: 'user1',
        created_at: '2025-04-25T15:00:00Z',
        updated_at: '2025-04-25T15:00:00Z',
        memo: 'エンジンカバー塗装',
        category: 'UD',
        original_invoice_id: null
      },
      // その他のサンプルデータ（2025年1-3月）
      {
        id: 13,
        invoice_no: '25013401-1',
        billing_month: 202501,
        billing_date: '2025-01-15',
        customer_id: 1,
        client_name: 'システム開発・保守',
        registration_no: '福岡100あ0001',
        order_no: '1700415000',
        internal_order_no: '2501001-01',
        subtotal: 500000,
        tax: 50000,
        total: 550000,
        status: 'finalized',
        created_by: 'user1',
        created_at: '2025-01-15T10:00:00Z',
        updated_at: '2025-01-15T10:00:00Z',
        memo: 'システム開発・保守',
        category: 'その他',
        original_invoice_id: null
      },
      {
        id: 14,
        invoice_no: '25023401-1',
        billing_month: 202502,
        billing_date: '2025-02-10',
        customer_id: 2,
        client_name: 'コンサルティング業務',
        registration_no: '長崎100か0002',
        order_no: '1700415001',
        internal_order_no: '2502001-01',
        subtotal: 300000,
        tax: 30000,
        total: 330000,
        status: 'finalized',
        created_by: 'user1',
        created_at: '2025-02-10T14:00:00Z',
        updated_at: '2025-02-10T14:00:00Z',
        memo: 'コンサルティング業務',
        category: 'その他',
        original_invoice_id: null
      },
      {
        id: 15,
        invoice_no: '25033401-1',
        billing_month: 202503,
        billing_date: '2025-03-05',
        customer_id: 3,
        client_name: 'イベント企画・運営',
        registration_no: '北九州100き0003',
        order_no: '1700415002',
        internal_order_no: '2503001-01',
        subtotal: 180000,
        tax: 18000,
        total: 198000,
        status: 'finalized',
        created_by: 'user1',
        created_at: '2025-03-05T11:00:00Z',
        updated_at: '2025-03-05T11:00:00Z',
        memo: 'イベント企画・運営',
        category: 'その他',
        original_invoice_id: null
      }
    ];

    this.payments = [
      { id: 1, invoice_id: 1, paid: true, payment_date: '2025-06-20', memo: '2025-06-20入金確認', created_at: '2025-06-20T09:00:00Z' },
      { id: 2, invoice_id: 2, paid: true, payment_date: '2025-06-18', memo: '2025-06-18入金確認', created_at: '2025-06-18T09:00:00Z' },
      { id: 3, invoice_id: 3, paid: true, payment_date: '2025-06-18', memo: '2025-06-18入金確認', created_at: '2025-06-18T09:00:00Z' },
      { id: 4, invoice_id: 4, paid: false, payment_date: null, memo: '', created_at: '2025-06-04T11:00:00Z' },
      { id: 5, invoice_id: 5, paid: true, payment_date: '2025-06-25', memo: '2025-06-25入金確認', created_at: '2025-06-25T09:00:00Z' },
      { id: 6, invoice_id: 6, paid: false, payment_date: null, memo: '', created_at: '2025-06-05T09:00:00Z' },
      { id: 7, invoice_id: 7, paid: true, payment_date: '2025-06-22', memo: '2025-06-22入金確認', created_at: '2025-06-22T09:00:00Z' },
      { id: 8, invoice_id: 8, paid: true, payment_date: '2025-06-22', memo: '2025-06-22入金確認', created_at: '2025-06-22T09:00:00Z' },
      { id: 9, invoice_id: 9, paid: true, payment_date: '2025-06-01', memo: '2025-06-01入金確認', created_at: '2025-06-01T09:00:00Z' },
      { id: 10, invoice_id: 10, paid: true, payment_date: '2025-06-05', memo: '2025-06-05入金確認', created_at: '2025-06-05T09:00:00Z' },
      { id: 11, invoice_id: 11, paid: true, payment_date: '2025-05-05', memo: '2025-05-05入金確認', created_at: '2025-05-05T09:00:00Z' },
      { id: 12, invoice_id: 12, paid: false, payment_date: null, memo: '', created_at: '2025-04-25T15:00:00Z' },
      { id: 13, invoice_id: 13, paid: true, payment_date: '2025-02-01', memo: '2025-02-01入金確認', created_at: '2025-02-01T09:00:00Z' },
      { id: 14, invoice_id: 14, paid: true, payment_date: '2025-02-28', memo: '2025-02-28入金確認', created_at: '2025-02-28T09:00:00Z' },
      { id: 15, invoice_id: 15, paid: false, payment_date: null, memo: '', created_at: '2025-03-05T11:00:00Z' }
    ];

    this.currentUser = { id: 'user1', name: '管理者', email: 'admin@bankin-company.com' };
  }

  // 決算期ベース（4月〜翌3月）でのデータ集計
  getSalesData(selectedYear) {
    const startDate = new Date(selectedYear - 1, 3, 1); // 4月1日
    const endDate = new Date(selectedYear, 2, 31, 23, 59, 59); // 翌年3月31日
    
    const periodInvoices = this.invoices.filter(invoice => {
      const invoiceDate = new Date(invoice.billing_date);
      return invoiceDate >= startDate && invoiceDate <= endDate && invoice.status === 'finalized';
    });

    const monthlyData = {};
    // 4月から翌年3月まで初期化
    for (let month = 4; month <= 15; month++) {
      const actualMonth = month > 12 ? month - 12 : month;
      const year = month > 12 ? selectedYear : selectedYear - 1;
      const key = `${year}-${actualMonth.toString().padStart(2, '0')}`;
      monthlyData[key] = { 
        UD: 0,      // UD売上
        other: 0,   // その他売上
        total: 0 
      };
    }

    periodInvoices.forEach(invoice => {
      const date = new Date(invoice.billing_date);
      const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      
      if (monthlyData[key]) {
        // カテゴリで分類：UD = 鈑金関連業務、その他 = その他の業務
        if (invoice.category === 'UD') {
          monthlyData[key].UD += invoice.total || 0;
        } else {
          monthlyData[key].other += invoice.total || 0;
        }
        monthlyData[key].total = monthlyData[key].UD + monthlyData[key].other;
      }
    });

    return { monthlyData, periodInvoices };
  }

  // 入金状況更新
  updatePaymentStatus(invoiceId, paid, memo) {
    const existingPaymentIndex = this.payments.findIndex(p => p.invoice_id === invoiceId);
    if (existingPaymentIndex >= 0) {
      this.payments[existingPaymentIndex] = {
        ...this.payments[existingPaymentIndex],
        paid,
        memo,
        payment_date: paid ? new Date().toISOString().split('T')[0] : null
      };
    } else {
      this.payments.push({
        id: Date.now(),
        invoice_id: invoiceId,
        paid,
        memo,
        payment_date: paid ? new Date().toISOString().split('T')[0] : null,
        created_at: new Date().toISOString()
      });
    }
  }
}

// 売上管理メインコンポーネント
function SalesManagementPage() {
  const [db] = useState(() => new SalesDB());
  const [selectedYear, setSelectedYear] = useState(2025);
  const [categoryFilter, setCategoryFilter] = useState('全て');
  const [viewMode, setViewMode] = useState('invoices'); // 'invoices' or 'monthly'
  const [paymentUpdates, setPaymentUpdates] = useState({});
  const [searchKeyword, setSearchKeyword] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('すべて');

  const { monthlyData, periodInvoices } = db.getSalesData(selectedYear);
  
  // カテゴリ別合計計算
  const totals = Object.values(monthlyData).reduce(
    (acc, data) => ({
      UD: acc.UD + data.UD,
      other: acc.other + data.other,
      total: acc.total + data.total
    }),
    { UD: 0, other: 0, total: 0 }
  );

  // 入金状況更新（リアルタイム更新対応）
  const updatePaymentStatus = useCallback((invoiceId, paid, memo) => {
    db.updatePaymentStatus(invoiceId, paid, memo);
    setPaymentUpdates(prev => ({
      ...prev,
      [invoiceId]: { paid, memo, timestamp: Date.now() }
    }));
  }, [db]);

  // フィルタリングされた請求書
  const filteredInvoices = periodInvoices.filter(invoice => {
    const customer = db.customers.find(c => c.id === invoice.customer_id);
    const payment = db.payments.find(p => p.invoice_id === invoice.id);
    
    // カテゴリフィルタ
    if (categoryFilter === 'UDのみ') {
      if (invoice.category !== 'UD') return false;
    }
    if (categoryFilter === 'その他のみ') {
      if (invoice.category !== 'その他') return false;
    }
    
    // 入金ステータスフィルタ
    if (paymentStatusFilter === '入金済み' && !payment?.paid) return false;
    if (paymentStatusFilter === '未入金' && payment?.paid) return false;
    
    // キーワード検索
    if (searchKeyword) {
      const searchText = searchKeyword.toLowerCase();
      const searchTargets = [
        invoice.invoice_no,
        customer?.company_name || '',
        invoice.client_name,
        payment?.memo || ''
      ].join(' ').toLowerCase();
      
      if (!searchTargets.includes(searchText)) return false;
    }
    
    return true;
  });

  // 月別集計のフィルタリング（表示フィルタに応じて）
  const getFilteredMonthlyData = () => {
    return Object.entries(monthlyData).filter(([key, data]) => {
      switch (categoryFilter) {
        case 'UDのみ':
          return data.UD > 0;
        case 'その他のみ':
          return data.other > 0;
        default:
          return true; // 全て表示
      }
    });
  };

  // CSVエクスポート機能
  const exportToCSV = () => {
    const headers = ['請求書番号', '請求日', '請求月', '顧客名', '件名', '登録番号', '発注番号', 'オーダー番号', '請求金額(円)', '入金', '入金メモ'];
    const csvData = filteredInvoices.map(invoice => {
      const payment = db.payments.find(p => p.invoice_id === invoice.id);
      const customer = db.customers.find(c => c.id === invoice.customer_id);
      return [
        invoice.invoice_no,
        invoice.billing_date,
        `${Math.floor(invoice.billing_month / 100)}-${(invoice.billing_month % 100).toString().padStart(2, '0')}`,
        customer?.company_name || '',
        invoice.client_name,
        invoice.registration_no || '-',
        invoice.order_no || '-',
        invoice.internal_order_no || '-',
        invoice.total,
        payment?.paid ? '✓' : '',
        payment?.memo || ''
      ];
    });

    const csvContent = [headers, ...csvData].map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `売上管理_${selectedYear}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="bg-white border-b-2 border-blue-500 p-4 mb-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">売上管理</h1>
            <div className="flex space-x-2">
              <button 
                onClick={() => setViewMode('monthly')}
                className={`px-4 py-2 rounded ${viewMode === 'monthly' ? 'bg-blue-500 text-white' : 'bg-white border border-blue-500 text-blue-500'}`}
              >
                月別集計
              </button>
              <button 
                onClick={() => setViewMode('invoices')}
                className={`px-4 py-2 rounded ${viewMode === 'invoices' ? 'bg-blue-500 text-white' : 'bg-white border border-blue-500 text-blue-500'}`}
              >
                請求書一覧
              </button>
            </div>
          </div>
        </div>

        {/* 年度・月選択 */}
        <div className="bg-white p-4 mb-4 border rounded">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm">対象年度（期末年）</label>
              <button 
                onClick={() => setSelectedYear(selectedYear - 1)}
                className="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
              >
                前年
              </button>
              <input 
                type="number"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="px-3 py-1 border rounded w-20 text-center"
              />
              <button 
                onClick={() => setSelectedYear(selectedYear + 1)}
                className="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
              >
                翌年
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm">対象月（会計年度内）</label>
              <select className="px-3 py-1 border rounded">
                <option>通年 ({selectedYear - 1}年04月～{selectedYear}年03月)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 月別売上集計ビュー */}
        {viewMode === 'monthly' && (
          <div className="bg-white border rounded">
            <div className="p-4 border-b">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm">表示フィルタ:</label>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setCategoryFilter('全て')}
                      className={`px-3 py-1 rounded text-sm ${categoryFilter === '全て' ? 'bg-gray-400 text-white' : 'bg-gray-100'}`}
                    >
                      全て
                    </button>
                    <button
                      onClick={() => setCategoryFilter('UDのみ')}
                      className={`px-3 py-1 rounded text-sm ${categoryFilter === 'UDのみ' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                    >
                      UDのみ
                    </button>
                    <button
                      onClick={() => setCategoryFilter('その他のみ')}
                      className={`px-3 py-1 rounded text-sm ${categoryFilter === 'その他のみ' ? 'bg-gray-600 text-white' : 'bg-gray-100'}`}
                    >
                      その他のみ
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4">
              <h2 className="text-lg font-bold mb-4">
                {selectedYear - 1}年04月～{selectedYear}年03月 売上集計
              </h2>
              
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border p-2 text-left">年月</th>
                    {(categoryFilter === '全て' || categoryFilter === 'UDのみ') && (
                      <th className="border p-2 text-right">UD売上 (円)</th>
                    )}
                    {(categoryFilter === '全て' || categoryFilter === 'その他のみ') && (
                      <th className="border p-2 text-right">その他売上 (円)</th>
                    )}
                    {categoryFilter === '全て' && (
                      <th className="border p-2 text-right">合計 (円)</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {getFilteredMonthlyData().map(([key, data]) => {
                    const [year, month] = key.split('-');
                    return (
                      <tr key={key}>
                        <td className="border p-2">{year}-{month}</td>
                        {(categoryFilter === '全て' || categoryFilter === 'UDのみ') && (
                          <td className="border p-2 text-right text-blue-600">{data.UD.toLocaleString()}</td>
                        )}
                        {(categoryFilter === '全て' || categoryFilter === 'その他のみ') && (
                          <td className="border p-2 text-right text-gray-600">{data.other.toLocaleString()}</td>
                        )}
                        {categoryFilter === '全て' && (
                          <td className="border p-2 text-right font-medium">{data.total.toLocaleString()}</td>
                        )}
                      </tr>
                    );
                  })}
                  <tr className="bg-blue-50 font-bold">
                    <td className="border p-2">{selectedYear - 1}年04月～{selectedYear}年03月 合計:</td>
                    {(categoryFilter === '全て' || categoryFilter === 'UDのみ') && (
                      <td className="border p-2 text-right text-blue-600">{totals.UD.toLocaleString()}</td>
                    )}
                    {(categoryFilter === '全て' || categoryFilter === 'その他のみ') && (
                      <td className="border p-2 text-right text-gray-600">{totals.other.toLocaleString()}</td>
                    )}
                    {categoryFilter === '全て' && (
                      <td className="border p-2 text-right text-lg">{totals.total.toLocaleString()}</td>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 請求書一覧ビュー */}
        {viewMode === 'invoices' && (
          <div className="bg-white border rounded">
            <div className="p-4 border-b">
              <h2 className="text-lg font-bold mb-3">{selectedYear - 1}年度 請求書一覧</h2>
              
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm">キーワード検索</label>
                  <input
                    type="text"
                    placeholder="請求書番号、顧客名、件名などで検索..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="px-3 py-1 border rounded w-64"
                  />
                  <button 
                    onClick={() => setSearchKeyword('')}
                    className="px-3 py-1 bg-gray-200 rounded text-sm"
                  >
                    クリア
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <label className="text-sm">入金ステータス</label>
                  <select
                    value={paymentStatusFilter}
                    onChange={(e) => setPaymentStatusFilter(e.target.value)}
                    className="px-3 py-1 border rounded"
                  >
                    <option>すべて</option>
                    <option>入金済み</option>
                    <option>未入金</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2 mb-4">
                <span className="text-sm text-gray-600">検索結果 {filteredInvoices.length}件</span>
                <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm">PDF出力</button>
                <button 
                  onClick={exportToCSV}
                  className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                >
                  Excel出力
                </button>
                <select className="ml-auto px-3 py-1 border rounded text-sm">
                  <option>10件表示</option>
                  <option>25件表示</option>
                  <option>50件表示</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border p-2 text-left">請求書番号</th>
                    <th className="border p-2 text-left">請求日</th>
                    <th className="border p-2 text-left">請求月</th>
                    <th className="border p-2 text-left">顧客名</th>
                    <th className="border p-2 text-left">件名</th>
                    <th className="border p-2 text-left">登録番号</th>
                    <th className="border p-2 text-left">発注番号</th>
                    <th className="border p-2 text-left">オーダー番号</th>
                    <th className="border p-2 text-right">請求金額(円)</th>
                    <th className="border p-2 text-center">入金</th>
                    <th className="border p-2 text-left">入金メモ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices
                    .sort((a, b) => new Date(b.billing_date) - new Date(a.billing_date))
                    .map(invoice => {
                      const payment = db.payments.find(p => p.invoice_id === invoice.id);
                      const customer = db.customers.find(c => c.id === invoice.customer_id);
                      const currentPayment = paymentUpdates[invoice.id] || {
                        paid: payment?.paid || false,
                        memo: payment?.memo || ''
                      };
                      
                      const getCategoryColor = (category) => {
                        switch (category) {
                          case 'UD': return 'text-blue-600 bg-blue-50';
                          default: return 'text-gray-600 bg-gray-50';
                        }
                      };
                      
                      return (
                        <tr key={invoice.id} className="hover:bg-gray-50">
                          <td className="border p-2">
                            <span className="text-blue-600 font-medium">{invoice.invoice_no}</span>
                          </td>
                          <td className="border p-2">{invoice.billing_date}</td>
                          <td className="border p-2">
                            {Math.floor(invoice.billing_month / 100)}-{(invoice.billing_month % 100).toString().padStart(2, '0')}
                          </td>
                          <td className="border p-2">
                            <div>
                              <div className="font-medium">{customer?.company_name || ''}</div>
                              <div className="text-xs text-gray-500">{customer?.person_in_charge}</div>
                            </div>
                          </td>
                          <td className="border p-2">
                            <div>
                              <div>{invoice.client_name}</div>
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getCategoryColor(invoice.category)}`}>
                                {invoice.category}
                              </span>
                            </div>
                          </td>
                          <td className="border p-2 text-xs">{invoice.registration_no || '-'}</td>
                          <td className="border p-2 text-xs">{invoice.order_no || '-'}</td>
                          <td className="border p-2 text-xs">{invoice.internal_order_no || '-'}</td>
                          <td className="border p-2 text-right font-medium">{invoice.total.toLocaleString()}</td>
                          <td className="border p-2 text-center">
                            <div className="flex items-center justify-center">
                              <input
                                type="checkbox"
                                checked={currentPayment.paid}
                                onChange={(e) => updatePaymentStatus(invoice.id, e.target.checked, currentPayment.memo)}
                                className="w-4 h-4"
                              />
                              {currentPayment.paid && <Check className="inline h-4 w-4 text-blue-600 ml-1" />}
                            </div>
                          </td>
                          <td className="border p-2">
                            <input
                              type="text"
                              value={currentPayment.memo}
                              onChange={(e) => updatePaymentStatus(invoice.id, currentPayment.paid, e.target.value)}
                              className="w-full px-2 py-1 text-xs"
                            />
                            {payment?.payment_date && (
                              <div className="text-xs text-gray-500 mt-1">
                                入金日: {payment.payment_date}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            {/* ページネーション */}
            <div className="p-4 border-t flex justify-center">
              <div className="flex space-x-1">
                <button className="px-3 py-1 border rounded">前へ</button>
                <button className="px-3 py-1 bg-blue-500 text-white rounded">1</button>
                <button className="px-3 py-1 border rounded">2</button>
                <button className="px-3 py-1 border rounded">次へ</button>
              </div>
            </div>
          </div>
        )}

        {/* フッターボタン */}
        <div className="mt-4 flex space-x-2">
          <button className="px-6 py-2 bg-blue-500 text-white rounded">ホームに戻る</button>
        </div>
      </div>
    </div>
  );
}

export default SalesManagementPage;