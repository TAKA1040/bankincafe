import React, { useState, useEffect } from 'react';
import { Search, Download, Filter, Calendar } from 'lucide-react';

// データ管理クラス
class WorkHistoryDB {
  constructor() {
    this.invoices = [];
    this.invoiceItems = [];
    this.initialized = false;
  }

  // CSVデータを読み込んで初期化
  async initialize() {
    if (this.initialized) return;

    try {
      // 動的インポート
      const Papa = (await import('https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.0/papaparse.min.js')).default;
      
      // 請求書データ読み込み
      const invoicesData = await window.fs.readFile('invoices_transformed  コピー.csv', { encoding: 'utf8' });
      const invoicesParsed = Papa.parse(invoicesData, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true
      });
      
      // 請求書明細データ読み込み
      const invoiceItemsData = await window.fs.readFile('invoice_items_transformed  コピー.csv', { encoding: 'utf8' });
      const invoiceItemsParsed = Papa.parse(invoiceItemsData, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true
      });

      this.invoices = invoicesParsed.data;
      this.invoiceItems = invoiceItemsParsed.data;
      this.initialized = true;
    } catch (error) {
      console.error('データ読み込みエラー:', error);
      // エラーの場合はサンプルデータを使用
      this.initializeSampleData();
    }
  }

  // サンプルデータで初期化（フォールバック）
  initializeSampleData() {
    this.invoices = [
      {
        invoice_no: '25050001-1',
        invoice_date: '2025/5/15',
        customer_name: 'UDトラックス株式会社',
        subject: 'サンプル顧客A',
        registration: '筑豊130え1234',
        total_amount_incl_tax: 100000
      },
      {
        invoice_no: '25050002-1',
        invoice_date: '2025/5/20',
        customer_name: 'サブル商事',
        subject: 'サンプル顧客B',
        registration: '福岡100か5678',
        total_amount_incl_tax: 50000
      }
    ];

    this.invoiceItems = [
      {
        invoice_no: '25050001-1',
        is_set: 0,
        raw_text: 'バンパー修理',
        quantity: 1,
        unit_price: 100000,
        amount: 100000
      },
      {
        invoice_no: '25050002-1',
        is_set: 0,
        raw_text: 'サイドパネル塗装',
        quantity: 1,
        unit_price: 50000,
        amount: 50000
      }
    ];
    this.initialized = true;
  }

  // 作業検索（セット項目の処理を含む）
  searchWorkHistory(keyword, customerFilter, dateFrom, dateTo) {
    const results = [];
    
    this.invoices.forEach(invoice => {
      // 顧客フィルター
      if (customerFilter && !invoice.customer_name.includes(customerFilter)) {
        return;
      }
      
      // 日付フィルター（YYYY/M/D形式に対応）
      const invoiceDate = this.parseDate(invoice.invoice_date);
      if (dateFrom && invoiceDate < new Date(dateFrom)) {
        return;
      }
      if (dateTo && invoiceDate > new Date(dateTo)) {
        return;
      }
      
      const items = this.invoiceItems.filter(item => item.invoice_no === invoice.invoice_no);
      
      items.forEach(item => {
        // セットの子項目（unit_price=0）は除外
        if (item.unit_price === 0) return;
        
        // 作業名フィルター
        if (!keyword || item.raw_text.toLowerCase().includes(keyword.toLowerCase())) {
          results.push({
            invoice_no: invoice.invoice_no,
            customer_name: invoice.customer_name,
            subject: invoice.subject,
            registration: invoice.registration,
            date: invoice.invoice_date,
            work_name: item.raw_text,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total: item.amount,
            is_set: item.is_set
          });
        }
      });
    });

    // 日付順でソート（新しい順）
    results.sort((a, b) => this.parseDate(b.date) - this.parseDate(a.date));
    
    return results;
  }

  // 日付パース（YYYY/M/D形式対応）
  parseDate(dateStr) {
    if (!dateStr) return new Date();
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    }
    return new Date(dateStr);
  }

  // 作業名の候補を取得
  getWorkNameSuggestions() {
    const workNames = [...new Set(
      this.invoiceItems
        .filter(item => item.unit_price > 0 && item.raw_text) // 有料作業のみ
        .map(item => item.raw_text)
    )];
    return workNames.sort();
  }

  // 統計情報を取得
  getWorkStatistics(workName) {
    const items = this.invoiceItems.filter(item => 
      item.raw_text === workName && item.unit_price > 0
    );
    if (items.length === 0) return null;

    const prices = items.map(item => item.unit_price);
    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

    // 最新使用日を取得
    const relatedInvoices = this.invoices.filter(inv => 
      items.some(item => item.invoice_no === inv.invoice_no)
    );
    const lastUsed = relatedInvoices.length > 0 
      ? Math.max(...relatedInvoices.map(inv => this.parseDate(inv.invoice_date)))
      : null;

    return {
      count: items.length,
      totalQuantity: totalCount,
      totalAmount: totalAmount,
      avgPrice: Math.round(totalAmount / totalCount),
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      lastUsed: lastUsed
    };
  }

  // 顧客一覧を取得
  getCustomers() {
    const customers = [...new Set(this.invoices.map(inv => inv.customer_name))];
    return customers.sort();
  }
}

// メインコンポーネント
function WorkHistoryPage() {
  const [db] = useState(() => new WorkHistoryDB());
  const [searchKeyword, setSearchKeyword] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [workSuggestions, setWorkSuggestions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [workStats, setWorkStats] = useState(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 初期データ読み込み
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      await db.initialize();
      setWorkSuggestions(db.getWorkNameSuggestions());
      setCustomers(db.getCustomers());
      // 初期表示として全データを表示
      setSearchResults(db.searchWorkHistory('', '', '', ''));
      setIsLoading(false);
    };

    initializeData();
  }, [db]);

  // 検索実行
  const handleSearch = () => {
    const results = db.searchWorkHistory(searchKeyword, customerFilter, dateFrom, dateTo);
    setSearchResults(results);
    
    if (searchKeyword) {
      const stats = db.getWorkStatistics(searchKeyword);
      setWorkStats(stats);
    } else {
      setWorkStats(null);
    }
  };

  // 作業名候補選択
  const selectWorkSuggestion = (workName) => {
    setSearchKeyword(workName);
    const results = db.searchWorkHistory(workName, customerFilter, dateFrom, dateTo);
    setSearchResults(results);
    const stats = db.getWorkStatistics(workName);
    setWorkStats(stats);
  };

  // CSVエクスポート
  const exportToCSV = () => {
    const headers = ['請求書番号', '顧客名', '登録番号', '数量', '単価', '請求日', '件名', '作業名', '種別', '合計'];
    const csvData = [
      headers.join(','),
      ...searchResults.map(result => [
        result.invoice_no,
        `"${result.customer_name}"`,
        `"${result.registration}"`,
        result.quantity,
        result.unit_price,
        result.date,
        `"${result.subject}"`,
        `"${result.work_name}"`,
        result.is_set ? 'セット' : '個別',
        result.total
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `作業履歴_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">データを読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">作業内容履歴</h1>
              <p className="text-gray-600">過去の作業価格や実績を検索・確認できます</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center"
              >
                <Filter className="h-4 w-4 mr-2" />
                {showAdvancedFilters ? '簡易表示' : '詳細フィルター'}
              </button>
              {searchResults.length > 0 && (
                <button
                  onClick={exportToCSV}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  CSV出力
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 検索フィルター */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="space-y-4">
            {/* 基本検索 */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">作業名で検索</label>
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="作業名を入力（部分一致）"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 flex items-center"
                >
                  <Search className="h-4 w-4 mr-2" />
                  検索
                </button>
              </div>
            </div>

            {/* 詳細フィルター */}
            {showAdvancedFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium mb-1">顧客で絞り込み</label>
                  <select
                    value={customerFilter}
                    onChange={(e) => setCustomerFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">すべての顧客</option>
                    {customers.map(customer => (
                      <option key={customer} value={customer}>
                        {customer}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">期間開始</label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">期間終了</label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 作業名候補 */}
        {!searchKeyword && workSuggestions.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">よく使用される作業</h2>
            <div className="flex flex-wrap gap-2">
              {workSuggestions.map(workName => (
                <button
                  key={workName}
                  onClick={() => selectWorkSuggestion(workName)}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors text-sm"
                >
                  {workName}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 統計情報 */}
        {workStats && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">「{searchKeyword}」の統計情報</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-3 rounded">
                <div className="text-sm text-gray-600">実施回数</div>
                <div className="text-xl font-bold text-blue-600">{workStats.count}回</div>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <div className="text-sm text-gray-600">平均単価</div>
                <div className="text-xl font-bold text-green-600">¥{workStats.avgPrice.toLocaleString()}</div>
              </div>
              <div className="bg-orange-50 p-3 rounded">
                <div className="text-sm text-gray-600">価格帯</div>
                <div className="text-sm font-bold text-orange-600">
                  ¥{workStats.minPrice.toLocaleString()} 〜 ¥{workStats.maxPrice.toLocaleString()}
                </div>
              </div>
              <div className="bg-purple-50 p-3 rounded">
                <div className="text-sm text-gray-600">総売上</div>
                <div className="text-xl font-bold text-purple-600">¥{workStats.totalAmount.toLocaleString()}</div>
              </div>
            </div>
          </div>
        )}

        {/* 検索結果 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                検索結果 ({searchResults.length}件)
              </h2>
              {searchResults.length > 0 && (
                <div className="text-sm text-gray-600">
                  総額: ¥{searchResults.reduce((sum, result) => sum + result.total, 0).toLocaleString()}
                </div>
              )}
            </div>
          </div>

          {/* カラムヘッダー */}
          {searchResults.length > 0 && (
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
              <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-700">
                <div className="col-span-2">請求書No</div>
                <div className="col-span-3">顧客名</div>
                <div className="col-span-2">登録番号</div>
                <div className="col-span-1 text-center">数量</div>
                <div className="col-span-2 text-right">単価</div>
                <div className="col-span-2 text-center">請求書表示</div>
              </div>
              <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-700 mt-2">
                <div className="col-span-2">請求日</div>
                <div className="col-span-3">件名</div>
                <div className="col-span-2">作業名</div>
                <div className="col-span-1 text-center">種別</div>
                <div className="col-span-2 text-right">合計</div>
                <div className="col-span-2 text-center">作業価格検索</div>
              </div>
            </div>
          )}

          {searchResults.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>該当する作業履歴がありません</p>
              <p className="text-sm mt-2">検索条件を変更して再度お試しください</p>
            </div>
          ) : (
            <div className="p-6 space-y-2">
              {searchResults.map((result, index) => (
                <div key={index} className="border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  {/* 1段目 */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-2">
                        <div className="text-sm font-mono font-medium">{result.invoice_no}</div>
                      </div>
                      <div className="col-span-3">
                        <div className="text-sm font-medium truncate" title={result.customer_name}>
                          {result.customer_name.length > 20 ? `${result.customer_name.substring(0, 20)}...` : result.customer_name}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-sm">{result.registration}</div>
                      </div>
                      <div className="col-span-1">
                        <div className="text-sm text-center">{result.quantity}</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-sm text-right">¥{result.unit_price.toLocaleString()}</div>
                      </div>
                      <div className="col-span-2">
                        <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 w-full">
                          請求書表示
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* 2段目 */}
                  <div className="px-4 py-3">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-2">
                        <div className="text-sm">{result.date}</div>
                      </div>
                      <div className="col-span-3">
                        <div className="text-sm truncate" title={result.subject}>
                          {result.subject}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-sm truncate" title={result.work_name}>
                          <span className={`${searchKeyword && result.work_name.toLowerCase().includes(searchKeyword.toLowerCase()) ? 'bg-yellow-200' : ''}`}>
                            {result.work_name.length > 20 ? `${result.work_name.substring(0, 20)}...` : result.work_name}
                          </span>
                        </div>
                      </div>
                      <div className="col-span-1">
                        <div className="text-center">
                          <span className={`px-2 py-1 rounded-full text-xs ${result.is_set ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                            {result.is_set ? 'セット' : '個別'}
                          </span>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-sm text-right font-medium">¥{result.total.toLocaleString()}</div>
                      </div>
                      <div className="col-span-2">
                        <button 
                          className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 w-full"
                          onClick={() => selectWorkSuggestion(result.work_name)}
                        >
                          作業価格検索
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>🔧 鈑金Cafe 作業履歴システム</p>
          <p>過去の作業実績から適切な価格設定をサポートします</p>
        </div>
      </div>
    </div>
  );
}

export default WorkHistoryPage;