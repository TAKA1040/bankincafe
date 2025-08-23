import React, { useState, useEffect } from 'react';
import { Search, ArrowLeft, FileText, Calendar, DollarSign, User, TrendingUp, Filter, Download, Eye } from 'lucide-react';

// サンプルデータ管理クラス
class WorkSearchDB {
  constructor() {
    // 実際のCSVデータに基づくデータ構造に修正
    this.invoices = this.loadData('work_search_invoices', [
      {
        id: 1,
        invoice_no: '25063417-1',
        billing_date: '2025-06-02',
        customer_name: 'UDトラックス株式会社',
        client_name: '中野運送　中野正博',
        total: 8800
      },
      {
        id: 2,
        invoice_no: '25063418-1',
        billing_date: '2025-06-02',
        customer_name: 'UDトラックス株式会社',
        client_name: 'いすゞ自動車九州株式会社長崎サービスセンター',
        total: 25300
      },
      {
        id: 3,
        invoice_no: '25063418-2',
        billing_date: '2025-06-02',
        customer_name: 'UDトラックス株式会社',
        client_name: 'いすゞ自動車九州株式会社長崎サービスセンター',
        total: 5500
      },
      {
        id: 4,
        invoice_no: '25063419-1',
        billing_date: '2025-06-04',
        customer_name: 'UDトラックス株式会社',
        client_name: 'いすゞ自動車九州株式会社長崎サービスセンター',
        total: 19800
      },
      {
        id: 5,
        invoice_no: '25063420-1',
        billing_date: '2025-06-04',
        customer_name: 'UDトラックス株式会社',
        client_name: '株式会社ロジコム・アイ',
        total: 11000
      },
      {
        id: 6,
        invoice_no: '25063421-1',
        billing_date: '2025-06-05',
        customer_name: 'UDトラックス株式会社',
        client_name: '東邦興産株式会社',
        total: 11000
      },
      {
        id: 7,
        invoice_no: '25063422-1',
        billing_date: '2025-06-05',
        customer_name: 'UDトラックス株式会社',
        client_name: '鶴丸海運株式会社',
        total: 8800
      },
      {
        id: 8,
        invoice_no: '25063423-1',
        billing_date: '2025-06-05',
        customer_name: 'UDトラックス株式会社',
        client_name: '鶴丸海運株式会社',
        total: 5500
      }
    ]);

    // 実際のCSVデータに完全に基づく明細データ
    this.invoiceItems = this.loadData('work_search_items', [
      // 25063417-1 の明細
      {
        id: 1,
        invoice_id: 1,
        name: '燃料キャップ嚙み込み分解取外し',
        quantity: 1,
        unit_price: 8000,
        total: 8000,
        is_set: false
      },
      // 25063418-1 の明細
      {
        id: 2,
        invoice_id: 2,
        name: '床亀裂溶接',
        quantity: 1,
        unit_price: 5000,
        total: 5000,
        is_set: false
      },
      {
        id: 3,
        invoice_id: 2,
        name: 'マフラーカバー脱着ステイ折損ステン溶接 等一式',
        quantity: 1,
        unit_price: 0,
        total: 18000,
        is_set: true,
        set_items: ['マフラーカバー脱着ステイ折損ステン溶接', 'リベット打ち替え加工']
      },
      // 25063418-2 の明細
      {
        id: 4,
        invoice_id: 3,
        name: '床亀裂溶接',
        quantity: 1,
        unit_price: 5000,
        total: 5000,
        is_set: false
      },
      // 25063419-1 の明細
      {
        id: 5,
        invoice_id: 4,
        name: 'マフラーカバー脱着ステイ折損ステン溶接 等一式',
        quantity: 1,
        unit_price: 0,
        total: 18000,
        is_set: true,
        set_items: ['マフラーカバー脱着ステイ折損ステン溶接', 'リベット打ち替え加工']
      },
      // 25063420-1 の明細
      {
        id: 6,
        invoice_id: 5,
        name: 'ドライバーシート分解作動不良点検',
        quantity: 1,
        unit_price: 10000,
        total: 10000,
        is_set: false
      },
      // 25063421-1 の明細
      {
        id: 7,
        invoice_id: 6,
        name: '煽りスケット取替加工',
        quantity: 1,
        unit_price: 10000,
        total: 10000,
        is_set: false
      },
      // 25063422-1 の明細
      {
        id: 8,
        invoice_id: 7,
        name: 'ウィング蝶番点検 等一式',
        quantity: 1,
        unit_price: 0,
        total: 8000,
        is_set: true,
        set_items: ['ウィング蝶番点検', 'グリスアップ']
      },
      // 25063423-1 の明細
      {
        id: 9,
        invoice_id: 8,
        name: '右煽りキャッチ取替',
        quantity: 1,
        unit_price: 5000,
        total: 5000,
        is_set: false
      }
    ]);
  }

  loadData(key, defaultData) {
    try {
      const stored = JSON.parse(sessionStorage.getItem(key) || 'null');
      return stored || defaultData;
    } catch (error) {
      console.warn(`Failed to load ${key}:`, error);
      return defaultData;
    }
  }

  saveData(key, data) {
    try {
      sessionStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.warn(`Failed to save ${key}:`, error);
    }
  }

  // 最新版の請求書のみを取得する関数
  getLatestInvoices() {
    const invoiceGroups = {};
    
    // 請求書番号のベース部分でグループ化
    this.invoices.forEach(invoice => {
      const baseNumber = invoice.invoice_no.split('-')[0];
      if (!invoiceGroups[baseNumber]) {
        invoiceGroups[baseNumber] = [];
      }
      invoiceGroups[baseNumber].push(invoice);
    });
    
    // 各グループで最新版（末尾番号が最大）を取得
    const latestInvoices = [];
    Object.keys(invoiceGroups).forEach(baseNumber => {
      const group = invoiceGroups[baseNumber];
      const latest = group.reduce((latest, current) => {
        const latestSuffix = parseInt(latest.invoice_no.split('-')[1]);
        const currentSuffix = parseInt(current.invoice_no.split('-')[1]);
        return currentSuffix > latestSuffix ? current : latest;
      });
      latestInvoices.push(latest);
    });
    
    return latestInvoices;
  }

  // 最新版の請求書IDを取得
  getLatestInvoiceIds() {
    return this.getLatestInvoices().map(invoice => invoice.id);
  }

  // 作業検索（最新版の請求書のみ対象）
  searchWork(keyword, dateFrom = '', dateTo = '', customerName = '') {
    if (!keyword && !customerName) return [];

    let results = [];
    const latestInvoiceIds = this.getLatestInvoiceIds();
    
    this.invoices.forEach(invoice => {
      // 最新版の請求書のみを対象とする
      if (!latestInvoiceIds.includes(invoice.id)) return;
      
      // 日付フィルター
      if (dateFrom && invoice.billing_date < dateFrom) return;
      if (dateTo && invoice.billing_date > dateTo) return;
      
      // 顧客名フィルター（より柔軟な検索）
      if (customerName && !this.matchesSearch(invoice.customer_name, customerName)) return;

      const items = this.invoiceItems.filter(item => item.invoice_id === invoice.id);
      
      items.forEach(item => {
        let matchFound = false;
        let isInSet = false;
        
        // 通常の作業名検索
        if (!keyword || this.matchesSearch(item.name, keyword)) {
          matchFound = true;
        }
        
        // セット作業内の検索
        if (!matchFound && item.is_set && item.set_items) {
          isInSet = item.set_items.some(setItem => 
            !keyword || this.matchesSearch(setItem, keyword)
          );
          matchFound = isInSet;
        }
        
        if (matchFound) {
          results.push({
            invoice_no: invoice.invoice_no,
            customer_name: invoice.customer_name,
            billing_date: invoice.billing_date,
            client_name: invoice.client_name,
            work_name: item.name,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total: item.total,
            is_set: item.is_set || false,
            is_in_set: isInSet,
            set_items: item.set_items || []
          });
        }
      });
    });

    // 日付順でソート（新しい順）
    results.sort((a, b) => new Date(b.billing_date) - new Date(a.billing_date));
    
    return results;
  }

  // より柔軟な検索マッチング
  matchesSearch(text, searchTerm) {
    const normalizedText = text.toLowerCase().replace(/\s/g, '');
    const normalizedSearch = searchTerm.toLowerCase().replace(/\s/g, '');
    return normalizedText.includes(normalizedSearch);
  }

  // よく検索される作業一覧（最新版のみ対象）
  getPopularWorks() {
    const workCounts = {};
    const latestInvoiceIds = this.getLatestInvoiceIds();
    
    this.invoiceItems.forEach(item => {
      // 最新版の請求書の作業のみを対象とする
      if (latestInvoiceIds.includes(item.invoice_id)) {
        workCounts[item.name] = (workCounts[item.name] || 0) + 1;
      }
    });

    return Object.entries(workCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8)
      .map(([name, count]) => ({ name, count }));
  }

  // 作業の価格履歴（最新版のみ対象）
  getWorkPriceHistory(workName) {
    const results = [];
    const latestInvoiceIds = this.getLatestInvoiceIds();
    
    this.invoices.forEach(invoice => {
      // 最新版の請求書のみを対象とする
      if (!latestInvoiceIds.includes(invoice.id)) return;
      
      const items = this.invoiceItems.filter(item => 
        item.invoice_id === invoice.id && 
        this.matchesSearch(item.name, workName)
      );
      
      items.forEach(item => {
        results.push({
          invoice_no: invoice.invoice_no,
          customer_name: invoice.customer_name,
          billing_date: invoice.billing_date,
          client_name: invoice.client_name,
          work_name: item.name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total: item.total
        });
      });
    });

    return results.sort((a, b) => new Date(b.billing_date) - new Date(a.billing_date));
  }
}

function WorkSearchPage() {
  const [db] = useState(() => new WorkSearchDB());
  const [searchKeyword, setSearchKeyword] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [periodFilter, setPeriodFilter] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [popularWorks, setPopularWorks] = useState([]);
  const [selectedWork, setSelectedWork] = useState('');
  const [priceHistory, setPriceHistory] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoiceDetail, setShowInvoiceDetail] = useState(false);

  useEffect(() => {
    setPopularWorks(db.getPopularWorks());
  }, [db]);

  const handlePeriodFilterChange = (months) => {
    const today = new Date();
    const fromDate = new Date(today.getFullYear(), today.getMonth() - parseInt(months), today.getDate());
    const toDate = new Date();
    
    // 日付フィールドに値を設定
    setDateFrom(fromDate.toISOString().split('T')[0]);
    setDateTo(toDate.toISOString().split('T')[0]);
    
    // ラジオボタンの状態も更新
    setPeriodFilter(months);
  };

  const handleSearch = () => {
    let fromDate = dateFrom;
    let toDate = dateTo;
    
    // 期間フィルターが設定されている場合（念のため、通常は既に日付フィールドに入力済み）
    if (periodFilter && (!fromDate || !toDate)) {
      const today = new Date();
      const monthsBack = parseInt(periodFilter);
      const calculatedFromDate = new Date(today.getFullYear(), today.getMonth() - monthsBack, today.getDate());
      fromDate = calculatedFromDate.toISOString().split('T')[0];
      toDate = today.toISOString().split('T')[0];
    }
    
    let results = db.searchWork(searchKeyword, fromDate, toDate, customerName);
    results = sortResults(results);
    setSearchResults(results);
  };

  const sortResults = (results) => {
    return [...results].sort((a, b) => {
      let aVal, bVal;
      
      switch (sortBy) {
        case 'date':
          aVal = new Date(a.billing_date);
          bVal = new Date(b.billing_date);
          break;
        case 'price':
          aVal = a.unit_price;
          bVal = b.unit_price;
          break;
        case 'customer':
          aVal = a.customer_name;
          bVal = b.customer_name;
          break;
        case 'work':
          aVal = a.work_name;
          bVal = b.work_name;
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  };

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
    
    if (searchResults.length > 0) {
      setSearchResults(sortResults(searchResults));
    }
  };

  const handlePopularWorkClick = (workName) => {
    setSearchKeyword(workName);
    setSelectedWork(workName);
    const results = db.searchWork(workName, dateFrom, dateTo, customerName);
    setSearchResults(sortResults(results));
    
    // 価格履歴も取得
    const history = db.getWorkPriceHistory(workName);
    setPriceHistory(history);
  };

  const clearSearch = () => {
    setSearchKeyword('');
    setDateFrom('');
    setDateTo('');
    setCustomerName('');
    setPeriodFilter('');
    setSearchResults([]);
    setSelectedWork('');
    setPriceHistory([]);
  };

  const showInvoiceDetails = (invoiceNo) => {
    // 請求書詳細情報を取得
    const invoice = db.invoices.find(inv => inv.invoice_no === invoiceNo);
    if (!invoice) return;
    
    const items = db.invoiceItems.filter(item => item.invoice_id === invoice.id);
    
    setSelectedInvoice({
      ...invoice,
      items: items
    });
    setShowInvoiceDetail(true);
  };

  const closeInvoiceDetail = () => {
    setShowInvoiceDetail(false);
    setSelectedInvoice(null);
  };

  const exportResults = () => {
    if (searchResults.length === 0) return;
    
    const csv = [
      ['請求書No', '顧客名', '日付', '件名', '作業名', '数量', '単価', '合計'],
      ...searchResults.map(r => [
        r.invoice_no,
        r.customer_name,
        r.billing_date,
        r.client_name,
        r.work_name,
        r.quantity,
        r.unit_price,
        r.total
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `作業履歴検索結果_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // 統計情報の計算
  const getStatistics = () => {
    if (searchResults.length === 0) return null;

    // セット作業を除外した統計
    const nonSetResults = searchResults.filter(r => !r.is_set);
    const setResults = searchResults.filter(r => r.is_set);
    
    if (nonSetResults.length === 0) {
      return { 
        avgPrice: 0, 
        maxPrice: 0, 
        minPrice: 0, 
        count: searchResults.length,
        setCount: setResults.length 
      };
    }

    const prices = nonSetResults.map(r => r.unit_price);
    const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);

    return { 
      avgPrice, 
      maxPrice, 
      minPrice, 
      count: searchResults.length,
      setCount: setResults.length 
    };
  };

  const stats = getStatistics();

  const getSortIcon = (column) => {
    if (sortBy !== column) return null;
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <FileText className="h-8 w-8 mr-3 text-blue-600" />
              作業内容確認・履歴検索
            </h1>
            <div className="flex space-x-2">
              {searchResults.length > 0 && (
                <button
                  onClick={exportResults}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center"
                >
                  <Download className="h-4 w-4 mr-1" />
                  CSV出力
                </button>
              )}
              <button
                onClick={() => window.history.back()}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                戻る
              </button>
            </div>
          </div>
          <p className="text-gray-600">
            過去の作業内容と価格履歴を検索・確認できます。「この作業、過去いくらで出してたっけ？」がすぐに分かります。
          </p>
        </div>

        {/* 検索フィルター */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <Search className="h-5 w-5 mr-2 text-blue-600" />
              検索条件
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <Filter className="h-4 w-4 mr-1" />
              {showFilters ? '詳細設定を閉じる' : '詳細設定'}
            </button>
          </div>
          
          {/* 基本検索 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">作業名</label>
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="作業名で検索..."
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">顧客名、件名</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="顧客名、件名で絞り込み..."
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>

          {/* 詳細フィルター */}
          {showFilters && (
            <div className="border-t pt-4">
              {/* 期間指定 */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">期間指定</label>
                <div className="flex items-center space-x-2 mb-3">
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => {
                      setDateFrom(e.target.value);
                      // 手動で日付を変更した場合はラジオボタンをリセット
                      if (periodFilter) setPeriodFilter('');
                    }}
                    className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-500">〜</span>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => {
                      setDateTo(e.target.value);
                      // 手動で日付を変更した場合はラジオボタンをリセット
                      if (periodFilter) setPeriodFilter('');
                    }}
                    className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* 期間ラジオボタン */}
                <div className="flex flex-wrap gap-4">
                  {[
                    { value: '3', label: '3ヶ月以内' },
                    { value: '6', label: '半年以内' },
                    { value: '12', label: '１年以内' },
                    { value: '24', label: '２年以内' },
                    { value: '36', label: '３年以内' }
                  ].map(period => (
                    <label key={period.value} className="flex items-center">
                      <input
                        type="radio"
                        name="periodFilter"
                        value={period.value}
                        checked={periodFilter === period.value}
                        onChange={(e) => handlePeriodFilterChange(e.target.value)}
                        className="mr-2"
                      />
                      {period.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 flex items-center"
            >
              <Search className="h-4 w-4 mr-1" />
              検索
            </button>
            <button
              onClick={clearSearch}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
            >
              クリア
            </button>
          </div>
        </div>

        {/* よく検索される作業 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">よく使われる作業</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
            {popularWorks.map((work, index) => (
              <button
                key={index}
                onClick={() => handlePopularWorkClick(work.name)}
                className={`p-3 rounded border-2 text-left hover:bg-blue-50 hover:border-blue-300 transition-colors ${
                  selectedWork === work.name ? 'bg-blue-100 border-blue-400' : 'border-gray-200'
                }`}
              >
                <div className="font-medium text-sm">{work.name}</div>
                <div className="text-xs text-gray-500">{work.count}回使用</div>
              </button>
            ))}
          </div>
        </div>

        {/* 統計情報 */}
        {stats && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
              検索結果統計
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.count}{stats.setCount > 0 && (
                    <span className="text-sm ml-1">（セット{stats.setCount}件）</span>
                  )}
                </div>
                <div className="text-sm text-gray-600">件数</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {stats.avgPrice > 0 ? `¥${stats.avgPrice.toLocaleString()}` : '---'}
                </div>
                <div className="text-sm text-gray-600">平均単価</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {stats.maxPrice > 0 ? `¥${stats.maxPrice.toLocaleString()}` : '---'}
                </div>
                <div className="text-sm text-gray-600">最高単価</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {stats.minPrice > 0 ? `¥${stats.minPrice.toLocaleString()}` : '---'}
                </div>
                <div className="text-sm text-gray-600">最低単価</div>
              </div>
            </div>
          </div>
        )}

        {/* 検索結果 */}
        {searchResults.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">検索結果 ({searchResults.length}件)</h2>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-600">並び順:</span>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [newSortBy, newSortOrder] = e.target.value.split('-');
                    setSortBy(newSortBy);
                    setSortOrder(newSortOrder);
                    setSearchResults(sortResults(searchResults));
                  }}
                  className="border border-gray-300 rounded px-2 py-1"
                >
                  <option value="date-desc">日付（新しい順）</option>
                  <option value="date-asc">日付（古い順）</option>
                  <option value="price-desc">単価（高い順）</option>
                  <option value="price-asc">単価（安い順）</option>
                  <option value="customer-asc">顧客名（あいうえお順）</option>
                  <option value="work-asc">作業名（あいうえお順）</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSortChange('invoice')}
                    >
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        請求書No {getSortIcon('invoice')}
                      </div>
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSortChange('customer')}
                    >
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        件名 {getSortIcon('customer')}
                      </div>
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSortChange('date')}
                    >
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        日付 {getSortIcon('date')}
                      </div>
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSortChange('work')}
                    >
                      作業名 {getSortIcon('work')}
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">セット</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">数量</th>
                    <th 
                      className="px-4 py-3 text-right text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSortChange('price')}
                    >
                      <div className="flex items-center justify-end">
                        <DollarSign className="h-4 w-4 mr-1" />
                        単価 {getSortIcon('price')}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {searchResults.map((result, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-blue-600">{result.invoice_no}</td>
                      <td className="px-4 py-3 text-sm">{result.client_name}</td>
                      <td className="px-4 py-3 text-sm">{result.billing_date}</td>
                      <td className="px-4 py-3 text-sm font-medium">{result.work_name}</td>
                      <td className="px-4 py-3 text-center">
                        {result.is_set || result.is_in_set ? (
                          <span className="text-green-600 text-lg">✅</span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-center">{result.quantity}</td>
                      <td className="px-4 py-3 text-sm text-right">
                        {result.is_set ? (
                          <span className="text-gray-500">セット価格</span>
                        ) : (
                          `¥${result.unit_price.toLocaleString()}`
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => showInvoiceDetails(result.invoice_no)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center mx-auto"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          詳細
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 価格履歴詳細 */}
        {selectedWork && priceHistory.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              「{selectedWork}」の価格履歴
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left">日付</th>
                    <th className="px-3 py-2 text-left">顧客名</th>
                    <th className="px-3 py-2 text-left">件名</th>
                    <th className="px-3 py-2 text-center">数量</th>
                    <th className="px-3 py-2 text-right">単価</th>
                    <th className="px-3 py-2 text-right">合計</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {priceHistory.slice(0, 10).map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 py-2">{item.billing_date}</td>
                      <td className="px-3 py-2">{item.customer_name}</td>
                      <td className="px-3 py-2">{item.client_name}</td>
                      <td className="px-3 py-2 text-center">{item.quantity}</td>
                      <td className="px-3 py-2 text-right">¥{item.unit_price.toLocaleString()}</td>
                      <td className="px-3 py-2 text-right">¥{item.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {priceHistory.length > 10 && (
              <div className="mt-4 text-center">
                <button className="text-blue-600 hover:text-blue-800 text-sm">
                  すべての履歴を表示 ({priceHistory.length}件)
                </button>
              </div>
            )}
          </div>
        )}

        {/* 請求書詳細ポップアップ */}
        {showInvoiceDetail && selectedInvoice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">請求書詳細</h2>
                  <button
                    onClick={closeInvoiceDetail}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {/* 請求書基本情報 */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">請求書情報</h3>
                    <div className="space-y-2">
                      <div className="flex">
                        <span className="w-24 text-sm text-gray-600">請求書No:</span>
                        <span className="font-medium">{selectedInvoice.invoice_no}</span>
                      </div>
                      <div className="flex">
                        <span className="w-24 text-sm text-gray-600">請求日:</span>
                        <span>{selectedInvoice.billing_date}</span>
                      </div>
                      <div className="flex">
                        <span className="w-24 text-sm text-gray-600">件名:</span>
                        <span>{selectedInvoice.client_name}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">顧客情報</h3>
                    <div className="space-y-2">
                      <div className="flex">
                        <span className="w-24 text-sm text-gray-600">顧客名:</span>
                        <span className="font-medium">{selectedInvoice.customer_name}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 作業明細 */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">作業明細</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="border border-gray-200 px-4 py-2 text-left">作業名</th>
                          <th className="border border-gray-200 px-4 py-2 text-center">数量</th>
                          <th className="border border-gray-200 px-4 py-2 text-right">単価</th>
                          <th className="border border-gray-200 px-4 py-2 text-right">金額</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedInvoice.items.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-200 px-4 py-2">
                              {item.name}
                              {item.is_set && item.set_items && (
                                <div className="mt-1 text-sm text-gray-600">
                                  セット内容: {item.set_items.join(', ')}
                                </div>
                              )}
                            </td>
                            <td className="border border-gray-200 px-4 py-2 text-center">{item.quantity}</td>
                            <td className="border border-gray-200 px-4 py-2 text-right">
                              {item.is_set ? (
                                <span className="text-gray-500">セット価格</span>
                              ) : (
                                `¥${item.unit_price.toLocaleString()}`
                              )}
                            </td>
                            <td className="border border-gray-200 px-4 py-2 text-right">¥{item.total.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td colSpan="3" className="border border-gray-200 px-4 py-2 text-right font-bold">合計金額</td>
                          <td className="border border-gray-200 px-4 py-2 text-right font-bold text-lg">
                            ¥{selectedInvoice.total.toLocaleString()}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t bg-gray-50 flex justify-end">
                <button
                  onClick={closeInvoiceDetail}
                  className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 検索結果がない場合 */}
        {searchResults.length === 0 && (searchKeyword || customerName) && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">検索結果が見つかりません</h3>
            <p className="text-gray-600 mb-4">
              検索条件を変更してお試しください。または、上記の「よく使われる作業」から選択してください。
            </p>
            <div className="bg-yellow-50 p-4 rounded-lg text-left max-w-md mx-auto">
              <h4 className="font-medium text-yellow-800 mb-2">検索のコツ</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• 部分的なキーワードで検索してみてください</li>
                <li>• 期間を広げて検索してみてください</li>
                <li>• 異なる表記（ひらがな・カタカナ）で試してみてください</li>
              </ul>
            </div>
          </div>
        )}

        {/* 初期状態のガイド */}
        {searchResults.length === 0 && !searchKeyword && !customerName && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-blue-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">作業内容を検索してください</h3>
            <p className="text-gray-600 mb-6">
              作業名や顧客名で検索すると、過去の請求履歴から関連する作業と価格情報が表示されます。
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-blue-50 p-6 rounded-lg text-left">
                <h4 className="font-medium text-blue-800 mb-3 flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  基本的な使い方
                </h4>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li>• 「バンパー」「塗装」など部分的なキーワードでも検索可能</li>
                  <li>• 期間を指定すると該当期間内の履歴に絞り込めます</li>
                  <li>• よく使われる作業から選択すると素早く検索できます</li>
                  <li>• 検索結果は並び順を変更できます</li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg text-left">
                <h4 className="font-medium text-green-800 mb-3 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  活用できる機能
                </h4>
                <ul className="text-sm text-green-700 space-y-2">
                  <li>• 統計情報で価格の傾向を把握できます</li>
                  <li>• 特定作業の価格履歴を詳しく確認できます</li>
                  <li>• 検索結果をCSVファイルで出力できます</li>
                  <li>• 詳細フィルターで細かく絞り込めます</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg max-w-2xl mx-auto">
              <h4 className="font-medium text-gray-800 mb-2">💡 こんな時に便利です</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>「前回のバンパー修理、いくらで見積もったっけ？」</p>
                <p>「この顧客には普段どんな作業をしているかな？」</p>
                <p>「最近の塗装作業の相場はどのくらい？」</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WorkSearchPage;