'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Plus, Eye, Edit, Download, Trash2, RotateCcw, ArrowLeft, Home } from 'lucide-react';
import { useInvoiceList, type SearchFilters } from '@/hooks/useInvoiceList';
import { getFiscalYearInfo, getFiscalYearDisplayName, type FiscalYearInfo } from '@/utils/fiscalYear';

export default function InvoiceListPage() {
  const router = useRouter();
  
  // 決算期情報の状態
  const [fiscalYearInfo, setFiscalYearInfo] = useState<FiscalYearInfo | null>(null);
  
  // 年度フィルター状態（フックよりも前に定義）
  const [selectedYear, setSelectedYear] = useState<string>('multi'); // 複数年度選択
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false); // 初期化状態管理
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // 初期化完了まではallを使用
  const yearFilter = !isInitialized ? 'all' : (
    selectedYear === 'all' ? 'all' : 
    selectedYear === 'multi' ? selectedYears : 
    selectedYear
  );

  const { invoices, loading, error, searchInvoices, updateInvoiceStatus, updatePaymentStatus, createRedInvoice, deleteInvoice } = useInvoiceList(yearFilter);
  


  // 検索フィルター状態
  const [filters, setFilters] = useState<SearchFilters>({
    keyword: '',
    status: 'all',
    payment_status: 'all',
    year: 'all',
    month: 'all',
    startDate: '',
    endDate: ''
  });

  // ページネーション状態
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // 検索結果
  const filteredInvoices = useMemo(() => {
    return searchInvoices(filters);
  }, [searchInvoices, filters]);

  // ページネーション計算
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedInvoices = filteredInvoices.slice(startIndex, endIndex);

  // 統計情報
  const stats = useMemo(() => {
    return {
      total: filteredInvoices.length,
      draft: filteredInvoices.filter(inv => inv.status === 'draft').length,
      finalized: filteredInvoices.filter(inv => inv.status === 'finalized').length,
      sent: filteredInvoices.filter(inv => inv.status === 'sent').length,
      paid: filteredInvoices.filter(inv => inv.status === 'paid').length,
      unpaid: filteredInvoices.filter(inv => inv.payment_status === 'unpaid').length,
      totalAmount: filteredInvoices.reduce((sum, inv) => sum + inv.total, 0)
    };
  }, [filteredInvoices]);

  // 年度選択肢を動的生成（決算期ベース、データがある年度のみ）
  const yearOptions = useMemo(() => {
    if (!fiscalYearInfo) return []; // 決算期情報が読み込まれるまで待機
    
    const years = new Set<number>();
    
    // データから存在する決算期のみを抽出
    invoices.forEach(invoice => {
      if (invoice.billing_date) {
        const billingDate = new Date(invoice.billing_date);
        const billingYear = billingDate.getFullYear();
        const billingMonth = billingDate.getMonth() + 1;
        
        // 請求日の月が決算月より後の場合は翌年度、そうでない場合は当年度
        const fiscalYear = billingMonth > fiscalYearInfo.fiscalYearEndMonth 
          ? billingYear + 1 
          : billingYear;
        
        // 現在の決算期以降（未来）の年度は除外
        if (fiscalYear <= fiscalYearInfo.currentFiscalYear) {
          years.add(fiscalYear);
        }
      }
    });
    

    
    return Array.from(years).sort((a, b) => b - a); // 降順でソート
  }, [invoices, fiscalYearInfo]);

  // 年度フィルター更新
  const updateYearFilter = (year: string) => {

    setSelectedYear(year);
    setCurrentPage(1);
  };

  // 複数年度選択の切り替え
  const toggleYearSelection = (year: string) => {
    setSelectedYears(prev => {
      const newSelection = prev.includes(year) 
        ? prev.filter(y => y !== year)
        : [...prev, year];
      

      return newSelection;
    });
  };

  // 複数年度フィルターの適用
  const applyMultiYearFilter = () => {
    if (selectedYears.length === 0) {
      setSelectedYear('all');
    } else if (selectedYears.length === 1) {
      setSelectedYear(selectedYears[0]);
    } else {
      // 複数年度選択時は'multi'モードに設定
      setSelectedYear('multi');
    }
    setIsYearDropdownOpen(false);
    setCurrentPage(1);

  };

  // 全期間選択
  const selectAllYears = () => {
    setSelectedYears([]);
    setSelectedYear('all');
    setCurrentPage(1);
    setIsYearDropdownOpen(false);
  };

  // 決算期情報の初期化（データ読み込み後に実行）
  useEffect(() => {
    if (!fiscalYearInfo || invoices.length === 0 || isInitialized) return;
    
    // データがある年度のみを抽出
    const availableYears = new Set<number>();
    invoices.forEach(invoice => {
      if (invoice.billing_date) {
        const billingDate = new Date(invoice.billing_date);
        const billingYear = billingDate.getFullYear();
        const billingMonth = billingDate.getMonth() + 1;
        
        const fiscalYear = billingMonth > fiscalYearInfo.fiscalYearEndMonth 
          ? billingYear + 1 
          : billingYear;
        
        if (fiscalYear <= fiscalYearInfo.currentFiscalYear) {
          availableYears.add(fiscalYear);
        }
      }
    });
    
    // 今期と前期のうち、データが存在するもののみデフォルト選択
    const defaultYears: string[] = [];
    if (availableYears.has(fiscalYearInfo.currentFiscalYear)) {
      defaultYears.push(fiscalYearInfo.currentFiscalYear.toString());
    }
    if (availableYears.has(fiscalYearInfo.previousFiscalYear)) {
      defaultYears.push(fiscalYearInfo.previousFiscalYear.toString());
    }
    
    // データがない場合は、最新の2年度をデフォルト選択
    if (defaultYears.length === 0) {
      const sortedYears = Array.from(availableYears).sort((a, b) => b - a);
      defaultYears.push(...sortedYears.slice(0, 2).map(y => y.toString()));
    }
    
    setSelectedYears(defaultYears);
    setIsInitialized(true);
    

  }, [fiscalYearInfo, invoices, isInitialized]);

  // 決算期情報の初期化
  useEffect(() => {
    const initializeFiscalYear = async () => {
      try {
        const info = await getFiscalYearInfo();
        setFiscalYearInfo(info);
      } catch (error) {
        console.error('決算期情報の初期化エラー:', error);
      }
    };
    
    initializeFiscalYear();
  }, []);

  // ドロップダウン外クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsYearDropdownOpen(false);
      }
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.removeEventListener('mousedown', handleClickOutside);
      }
    };
  }, []);

  // フィルター更新
  const updateFilter = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // フィルター変更時は1ページ目に戻る
  };

  // ページネーション関数
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // 表示件数変更時は1ページ目に戻る
  };

  // ステータス表示用の関数
  const getStatusBadge = (status: string) => {
    const statusMap = {
      draft: { label: '下書き', className: 'bg-gray-100 text-gray-800' },
      finalized: { label: '確定', className: 'bg-blue-100 text-blue-800' },
      sent: { label: '送信済み', className: 'bg-green-100 text-green-800' },
      paid: { label: '支払済み', className: 'bg-purple-100 text-purple-800' }
    };
    const config = statusMap[status as keyof typeof statusMap] || { label: status, className: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusMap = {
      unpaid: { label: '未入金', className: 'bg-red-100 text-red-800' },
      partial: { label: '一部入金', className: 'bg-yellow-100 text-yellow-800' },
      paid: { label: '入金済み', className: 'bg-green-100 text-green-800' }
    };
    const config = statusMap[status as keyof typeof statusMap] || { label: status, className: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  // 金額フォーマット
  const formatAmount = (amount: number) => {
    return amount.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' });
  };

  // 日付フォーマット
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  // 請求月フォーマット (YYMM → YY年M月)
  const formatBillingMonth = (billingMonth: string | null) => {
    if (!billingMonth || billingMonth.length !== 4) return '-';
    const year = billingMonth.substring(0, 2);
    const month = parseInt(billingMonth.substring(2, 4));
    return `${year}年${month}月`;
  };

  // 作業タイプのプレフィックス取得
  const getWorkTypePrefix = (taskType: string) => {
    switch (taskType) {
      case 'S':
      case 'set':
        return 'S:';
      case 'T':
      case 'individual':
      case 'structured':
      case 'fuzzy':
      default:
        return 'T:';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="text-red-400">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">エラーが発生しました</h3>
              <p className="mt-2 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">請求書一覧</h1>
          <p className="text-gray-600 mt-2">登録済みの請求書を管理できます</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/invoice-create')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium"
          >
            <Plus className="w-4 h-4" />
            新規作成
          </button>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium"
          >
            <Home size={20} />
            メニューへ
          </button>
        </div>
      </div>

      {/* 統計情報 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-600">総件数</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-600">未入金</div>
          <div className="text-2xl font-bold text-red-600">{stats.unpaid}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-600">入金済み</div>
          <div className="text-2xl font-bold text-green-600">{stats.paid}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-600">合計金額</div>
          <div className="text-xl font-bold text-gray-900">{formatAmount(stats.totalAmount)}</div>
        </div>
      </div>

      {/* 検索・フィルター */}
      <div className="bg-white rounded-lg shadow-sm border mb-6 p-4">
        <div className="flex items-center gap-4 mb-4">
          {/* 決算期フィルター（チェックボックス付きドロップダウン） */}
          <div className="flex items-center gap-2 relative">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">決算期:</span>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                className="border border-gray-300 rounded-lg px-3 py-2 min-w-[200px] bg-blue-50 border-blue-200 text-left flex items-center justify-between"
              >
                <span>
                  {selectedYear === 'all' 
                    ? `全期間 (${invoices.length}件)`
                    : selectedYear === 'multi' && selectedYears.length > 1 && fiscalYearInfo
                    ? selectedYears.sort().map(y => getFiscalYearDisplayName(parseInt(y), fiscalYearInfo.fiscalYearEndMonth)).join('・')
                    : selectedYears.length === 1 && fiscalYearInfo
                    ? getFiscalYearDisplayName(parseInt(selectedYears[0]), fiscalYearInfo.fiscalYearEndMonth)
                    : selectedYears.length > 1 && fiscalYearInfo
                    ? selectedYears.sort().map(y => getFiscalYearDisplayName(parseInt(y), fiscalYearInfo.fiscalYearEndMonth)).join('・')
                    : '決算期を選択'
                  }
                </span>
                <div className={`transform transition-transform ${isYearDropdownOpen ? 'rotate-180' : ''}`}>
                  ▼
                </div>
              </button>
              
              {isYearDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  <div className="p-2">
                    {/* 全期間オプション */}
                    <label className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedYear === 'all'}
                        onChange={selectAllYears}
                        className="rounded"
                      />
                      <span>全期間 ({invoices.length}件)</span>
                    </label>
                    
                    {/* 年度別オプション */}
                    {yearOptions.map(fiscalYear => {
                      // 決算期ベースで件数を計算
                      const yearCount = fiscalYearInfo ? invoices.filter(inv => {
                        if (!inv.billing_date) return false;
                        const billingDate = new Date(inv.billing_date);
                        const billingYear = billingDate.getFullYear();
                        const billingMonth = billingDate.getMonth() + 1;
                        
                        // 請求日の月が決算月より後の場合は翌年度、そうでない場合は当年度
                        const invoiceFiscalYear = billingMonth > fiscalYearInfo.fiscalYearEndMonth 
                          ? billingYear + 1 
                          : billingYear;
                        
                        return invoiceFiscalYear === fiscalYear;
                      }).length : 0;
                      
                      const displayName = fiscalYearInfo 
                        ? getFiscalYearDisplayName(fiscalYear, fiscalYearInfo.fiscalYearEndMonth)
                        : `${fiscalYear}年度`;
                      
                      return (
                        <label key={fiscalYear} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedYears.includes(fiscalYear.toString())}
                            onChange={() => toggleYearSelection(fiscalYear.toString())}
                            className="rounded"
                          />
                          <span>{displayName} ({yearCount}件)</span>
                        </label>
                      );
                    })}
                  </div>
                  
                  {selectedYears.length > 0 && (
                    <div className="border-t border-gray-200 p-2">
                      <button
                        onClick={applyMultiYearFilter}
                        className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                      >
                        フィルター適用
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="請求書番号、顧客名、件名、作業内容で曖昧検索..."
                value={filters.keyword}
                onChange={(e) => updateFilter('keyword', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <select
            value={filters.year}
            onChange={(e) => updateFilter('year', e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 min-w-[120px]"
          >
            <option value="all">すべての年</option>
            {Array.from({ length: 5 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return <option key={year} value={year}>{year}年</option>;
            })}
          </select>

          <select
            value={filters.month}
            onChange={(e) => updateFilter('month', e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 min-w-[120px]"
          >
            <option value="all">すべての月</option>
            {Array.from({ length: 12 }, (_, i) => {
              const month = i + 1;
              return <option key={month} value={month}>{month}月</option>;
            })}
          </select>

          <button
            onClick={() => {
              setFilters({
                keyword: '',
                status: 'all',
                payment_status: 'all',
                year: 'all',
                month: 'all',
                startDate: '',
                endDate: ''
              });
              setSelectedYear('all');
              setCurrentPage(1);
            }}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap"
          >
            クリア
          </button>
        </div>
      </div>

      {/* ページネーション情報 */}
      <div className="bg-white rounded-lg shadow-sm border mb-4 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {filteredInvoices.length > 0 ? (
                <>
                  {startIndex + 1}〜{Math.min(endIndex, filteredInvoices.length)} 件 / {filteredInvoices.length} 件中
                </>
              ) : (
                '0 件'
              )}
            </span>
            <div className="flex items-center gap-2 ml-4">
              <label className="text-sm text-gray-600">表示件数:</label>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                className="border border-gray-300 rounded px-3 py-1 text-sm bg-white min-w-20 relative z-10 shadow-sm"
              >
                <option value={10}>10件</option>
                <option value={30}>30件</option>
                <option value={50}>50件</option>
              </select>
            </div>
          </div>
          
          {/* ページネーション */}
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                前へ
              </button>
              
              {/* ページ番号 */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else {
                    if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 border rounded text-sm ${
                        pageNum === currentPage
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                次へ
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 請求書一覧テーブル */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  請求書番号<br/>発行日<br/>請求月
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  請求先<br/>件名<br/>登録番号
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  発注番号<br/>オーダー番号
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  品名明細<br/>（最大3件）<br/>T個別Sセット
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  数量
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  請求金額<br/>ステータス<br/>詳細
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedInvoices.map((invoice) => {
                // 品名明細を3件まで表示し、4件目以降は「その他N件あり」として表示
                const lineItems = invoice.line_items || [];
                // デバッグログ: 請求書ごとの明細数確認

                const displayItems = lineItems.slice(0, 3);
                const remainingCount = Math.max(0, lineItems.length - 3);

                return (
                  <tr key={invoice.invoice_id} className="hover:bg-gray-50">
                    {/* 1列目: 請求書番号、発行日、請求月 */}
                    <td className="px-4 py-4 align-top">
                      <div className="text-sm font-medium text-gray-900">
                        {invoice.invoice_number || invoice.invoice_id}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {formatDate(invoice.issue_date)}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {formatBillingMonth(invoice.billing_month)}
                      </div>
                    </td>

                    {/* 2列目: 請求先、件名、登録番号 */}
                    <td className="px-4 py-4 align-top">
                      <div className="text-sm font-medium text-gray-900">
                        {invoice.customer_name || '-'}
                      </div>
                      <div className="text-sm text-gray-600 mt-1 max-w-xs truncate">
                        {invoice.subject_name || invoice.subject || '-'}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {invoice.registration_number || '-'}
                      </div>
                    </td>

                    {/* 3列目: 発注番号、オーダー番号 */}
                    <td className="px-4 py-4 align-top">
                      <div className="text-sm text-gray-900">
                        {invoice.purchase_order_number || '-'}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {invoice.order_number || '-'}
                      </div>
                    </td>

                    {/* 4列目: 品名明細（3段構成） */}
                    <td className="px-4 py-4 align-top">
                      {displayItems.map((item, index) => {
                        // デバッグ用ログ
                        if (index === 0) {

                        }
                        
                        // S作業の場合はtarget（セット名）を表示、T作業の場合はraw_labelまたは構造化名称
                        const itemName = (item.task_type === 'S') 
                          ? (item.target || 'セット作業')
                          : (item.raw_label || [item.target, item.action, item.position].filter(Boolean).join(' ') || '-');
                        const prefix = getWorkTypePrefix(item.task_type);
                        const displayName = `${prefix}${itemName}`;
                        const isLastItem = index === 2 && remainingCount > 0;
                        
                        return (
                          <div key={index} className="text-sm text-gray-900 mt-1 first:mt-0">
                            {isLastItem ? (
                              <div className="flex items-center">
                                <span className="truncate flex-shrink mr-2" style={{ maxWidth: '120px' }}>
                                  {displayName.length > 15 ? `${displayName.substring(0, 15)}...` : displayName}
                                </span>
                                <span className="text-xs text-gray-500 whitespace-nowrap">
                                  その他{remainingCount}件あり
                                </span>
                              </div>
                            ) : (
                              <span className="max-w-xs truncate block">
                                {displayName}
                              </span>
                            )}
                          </div>
                        );
                      })}
                      {displayItems.length === 0 && (
                        <div className="text-sm text-gray-500">-</div>
                      )}
                    </td>

                    {/* 5列目: 数量 */}
                    <td className="px-4 py-4 align-top">
                      {displayItems.map((item, index) => (
                        <div key={index} className="text-sm text-gray-900 mt-1 first:mt-0">
                          {item.quantity || 0}
                        </div>
                      ))}
                      {displayItems.length === 0 && (
                        <div className="text-sm text-gray-500">0</div>
                      )}
                    </td>

                    {/* 6列目: 請求金額、ステータス、詳細ボタン */}
                    <td className="px-4 py-4 align-top">
                      <div className="text-sm font-medium text-gray-900">
                        {formatAmount(invoice.total)}
                      </div>
                      <div className="mt-2">
                        {getStatusBadge(invoice.status)}
                      </div>
                      <div className="mt-2">
                        <button
                          onClick={() => router.push(`/invoice-view/${invoice.invoice_id}`)}
                          className="text-blue-600 hover:text-blue-900 text-sm underline"
                        >
                          詳細
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {paginatedInvoices.length === 0 && filteredInvoices.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">請求書が見つかりません</div>
            <div className="text-gray-400 text-sm mt-2">検索条件を変更するか、新しい請求書を作成してください</div>
            <button
              onClick={() => router.push('/invoice-create')}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center gap-2 font-medium"
            >
              <Plus className="w-4 h-4" />
              新規作成
            </button>
          </div>
        )}

        {/* 下部の補助ページネーション */}
        {totalPages > 1 && paginatedInvoices.length > 0 && (
          <div className="flex justify-end p-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-2 py-1 text-sm text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-800"
              >
                前へ
              </button>
              
              {/* ページ番号（簡略版） */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 3) {
                    pageNum = i + 1;
                  } else {
                    if (currentPage <= 2) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 1) {
                      pageNum = totalPages - 2 + i;
                    } else {
                      pageNum = currentPage - 1 + i;
                    }
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-2 py-1 text-sm ${
                        pageNum === currentPage
                          ? 'text-blue-600 font-medium'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-2 py-1 text-sm text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-800"
              >
                次へ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}