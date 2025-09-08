'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Plus, Eye, Edit, Download, Mail, Printer, FileText, CheckSquare, Square, Home } from 'lucide-react';
import { useInvoiceList, type SearchFilters } from '@/hooks/useInvoiceList';
import { CustomerCategoryDB } from '@/lib/customer-categories';

export default function InvoicePublishPage() {
  const router = useRouter();
  const { invoices, loading, error, searchInvoices } = useInvoiceList();
  
  // 顧客カテゴリー設定のDB
  const [customerCategoryDB] = useState(() => new CustomerCategoryDB());

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

  // 期間フィルター状態（デフォルト：発行10日以内）
  const [periodFilter, setPeriodFilter] = useState<'10days' | 'recent' | 'all'>('10days');

  // 作業選択ボックス状態
  const [selectedOperation, setSelectedOperation] = useState<'print' | 'email' | 'pdf'>('print');

  // 請求先選択状態
  const [selectedCustomer, setSelectedCustomer] = useState<string>('all');

  // 選択された請求書IDのセット
  const [selectedInvoices, setSelectedInvoices] = useState<Set<string>>(new Set());

  // 検索結果（期間フィルター適用）
  const filteredInvoices = useMemo(() => {
    let result = searchInvoices(filters);
    
    // 期間フィルター適用
    if (periodFilter === '10days') {
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
      result = result.filter(invoice => {
        if (!invoice.issue_date) return false;
        const issueDate = new Date(invoice.issue_date);
        return issueDate >= tenDaysAgo;
      });
    } else if (periodFilter === 'recent') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      result = result.filter(invoice => {
        if (!invoice.issue_date) return false;
        const issueDate = new Date(invoice.issue_date);
        return issueDate >= oneMonthAgo;
      });
    }

    // 請求先フィルター適用（顧客カテゴリー設定と照合）
    if (selectedCustomer !== 'all') {
      const categories = customerCategoryDB.getCategories();
      const selectedCategory = categories.find(cat => cat.name === selectedCustomer);
      if (selectedCategory) {
        // カテゴリー名または会社名で照合
        result = result.filter(invoice => 
          invoice.customer_name === selectedCategory.name || 
          invoice.customer_name === selectedCategory.companyName
        );
      }
    }

    return result;
  }, [searchInvoices, filters, periodFilter, selectedCustomer]);

  // ユニークな請求先一覧（顧客カテゴリー設定から取得）
  const customerList = useMemo(() => {
    const categories = customerCategoryDB.getCategories();
    return categories.map(cat => cat.name);
  }, [customerCategoryDB]);

  // フィルター更新
  const updateFilter = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // 全選択/全解除
  const toggleAllSelection = () => {
    if (selectedInvoices.size === filteredInvoices.length) {
      setSelectedInvoices(new Set());
    } else {
      setSelectedInvoices(new Set(filteredInvoices.map(inv => inv.invoice_id)));
    }
  };

  // 個別選択切り替え
  const toggleInvoiceSelection = (invoiceId: string) => {
    const newSelected = new Set(selectedInvoices);
    if (newSelected.has(invoiceId)) {
      newSelected.delete(invoiceId);
    } else {
      newSelected.add(invoiceId);
    }
    setSelectedInvoices(newSelected);
  };

  // 操作実行（印刷、メール、PDF作成）
  const executeOperation = () => {
    if (selectedInvoices.size === 0) {
      alert('請求書を選択してください');
      return;
    }

    const selectedCount = selectedInvoices.size;
    const operationName = {
      print: '印刷',
      email: 'メール送信',
      pdf: 'PDF作成'
    }[selectedOperation];

    // 実際の操作はここで実装
    alert(`${selectedCount}件の請求書を${operationName}します。\n\n実装予定の機能です。`);
  };

  // 修正ボタンの動作（ステータスチェック付き）
  const handleEditClick = (invoice: typeof filteredInvoices[0]) => {
    // ステータスが確定の場合はポップアップのみ表示
    if (invoice.status === 'finalized' || invoice.status === 'sent' || invoice.status === 'paid') {
      alert('下書きの請求書のみ編集できます');
      return; // ページ移動せずにそのまま作業継続
    }
    
    // 下書きの場合は修正画面に移動
    if (invoice.status === 'draft') {
      router.push(`/invoice-create?edit=${invoice.invoice_id}`);
    }
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

  // 金額フォーマット
  const formatAmount = (amount: number) => {
    return amount.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' });
  };

  // 日付フォーマット
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  // 請求月フォーマット
  const formatBillingMonth = (billingMonth: string | null) => {
    if (!billingMonth || billingMonth.length !== 4) return '-';
    const year = billingMonth.substring(0, 2);
    const month = parseInt(billingMonth.substring(2, 4));
    return `${year}年${month}月`;
  };

  // 作業タイプのプレフィックス取得
  const getWorkTypePrefix = (taskType: string) => {
    switch (taskType) {
      case 'set':
        return 'S:';
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
          <h1 className="text-3xl font-bold text-gray-900">請求書発行</h1>
          <p className="text-gray-600 mt-2">下書き請求書の完成と印刷・メール送信・PDF作成</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/')}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            メニューに戻る
          </button>
        </div>
      </div>

      {/* 上部フィルターエリア */}
      <div className="bg-white rounded-lg shadow-sm border mb-6 p-4">
        {/* 作業選択と請求先選択の行 */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">作業選択:</label>
            <select
              value={selectedOperation}
              onChange={(e) => setSelectedOperation(e.target.value as 'print' | 'email' | 'pdf')}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="print">印刷</option>
              <option value="email">メール</option>
              <option value="pdf">PDF作成</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">請求先:</label>
            <select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value as string)}
              className="border border-gray-300 rounded-lg px-3 py-2 min-w-[150px]"
            >
              <option value="all">すべて</option>
              {customerList.map(customer => (
                <option key={customer} value={customer || ''}>{customer}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">期間:</label>
            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value as '10days' | 'recent' | 'all')}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="10days">発行10日以内</option>
              <option value="recent">発行1ヶ月以内</option>
              <option value="all">全表示</option>
            </select>
          </div>

          <button
            onClick={executeOperation}
            disabled={selectedInvoices.size === 0}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 ml-auto"
          >
            {selectedOperation === 'print' && <Printer className="w-4 h-4" />}
            {selectedOperation === 'email' && <Mail className="w-4 h-4" />}
            {selectedOperation === 'pdf' && <FileText className="w-4 h-4" />}
            {selectedInvoices.size > 0 ? `${selectedInvoices.size}件を` : ''}
            {{
              print: '印刷',
              email: 'メール送信',
              pdf: 'PDF作成'
            }[selectedOperation]}
          </button>
        </div>

        {/* 検索行 */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="請求書番号、顧客名、件名で曖昧検索（大小文字・ひらがなカタカナ区別なし）..."
                value={filters.keyword}
                onChange={(e) => updateFilter('keyword', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

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
              setSelectedCustomer('all');
              setPeriodFilter('10days');
              setSelectedInvoices(new Set());
            }}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap"
          >
            クリア
          </button>
        </div>
      </div>

      {/* 6列テーブル */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {/* 1列目: 選択用チェックボックス */}
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={toggleAllSelection}
                    className="flex items-center justify-center"
                  >
                    {selectedInvoices.size === filteredInvoices.length && filteredInvoices.length > 0 ? (
                      <CheckSquare className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </th>

                {/* 2列目: 請求書番号 + 請求月 */}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  請求書番号<br/>請求月
                </th>

                {/* 3列目: 件名 + 登録番号 */}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  件名<br/>登録番号
                </th>

                {/* 4列目: 作業明細（上から2段のみ表示） */}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  作業明細
                </th>

                {/* 5列目: 請求金額 + ステータス */}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  請求金額<br/>ステータス
                </th>

                {/* 6列目: 詳細・印刷・修正ボタン */}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  詳細・印刷<br/>修正ボタン
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => {
                const isSelected = selectedInvoices.has(invoice.invoice_id);

                // 作業明細を上から2件まで表示（既存の請求書一覧の実装と同様）
                const lineItems = invoice.line_items || [];
                const displayItems = lineItems.slice(0, 2);

                return (
                  <tr key={invoice.invoice_id} className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}>
                    {/* 1列目: 選択チェックボックス */}
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleInvoiceSelection(invoice.invoice_id)}
                        className="flex items-center justify-center"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </td>

                    {/* 2列目: 請求書番号 + 請求月 */}
                    <td className="px-4 py-4 align-top">
                      <div className="text-sm font-medium text-gray-900">
                        {invoice.invoice_number || invoice.invoice_id}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {formatBillingMonth(invoice.billing_month)}
                      </div>
                    </td>

                    {/* 3列目: 件名 + 登録番号 */}
                    <td className="px-4 py-4 align-top">
                      <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                        {invoice.subject_name || invoice.subject || '-'}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {invoice.registration_number || '-'}
                      </div>
                    </td>

                    {/* 4列目: 作業明細（上から2段のみ表示） */}
                    <td className="px-4 py-4 align-top">
                      {displayItems.map((item, index) => {
                        const itemName = item.raw_label || [item.target, item.action, item.position].filter(Boolean).join(' ') || '-';
                        const prefix = getWorkTypePrefix(item.task_type);
                        const displayName = `${prefix}${itemName}`;
                        
                        return (
                          <div key={index} className="text-sm text-gray-900 mt-1 first:mt-0">
                            <span className="max-w-xs truncate block">
                              {displayName}
                            </span>
                          </div>
                        );
                      })}
                      {displayItems.length === 0 && (
                        <div className="text-sm text-gray-500">-</div>
                      )}
                    </td>

                    {/* 5列目: 請求金額 + ステータス */}
                    <td className="px-4 py-4 align-top">
                      <div className="text-sm font-medium text-gray-900">
                        {formatAmount(invoice.total)}
                      </div>
                      <div className="mt-2">
                        {getStatusBadge(invoice.status)}
                      </div>
                    </td>

                    {/* 6列目: 詳細ボタン + 修正ボタン */}
                    <td className="px-4 py-4 align-top">
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => router.push(`/invoice-view/${invoice.invoice_id}`)}
                          className="text-blue-600 hover:text-blue-900 text-sm underline flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          詳細
                        </button>
                        <button
                          onClick={() => router.push(`/invoice-print/${invoice.invoice_id}`)}
                          className="text-purple-600 hover:text-purple-900 text-sm underline flex items-center gap-1"
                        >
                          <Printer className="w-4 h-4" />
                          印刷
                        </button>
                        <button
                          onClick={() => handleEditClick(invoice)}
                          className="text-green-600 hover:text-green-900 text-sm underline flex items-center gap-1"
                        >
                          <Edit className="w-4 h-4" />
                          修正
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredInvoices.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">条件に合う請求書が見つかりません</div>
            <div className="text-gray-400 text-sm mt-2">検索条件を変更してください</div>
          </div>
        )}
      </div>

      {/* 選択状況表示 */}
      {selectedInvoices.size > 0 && (
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-blue-800">
              {selectedInvoices.size}件の請求書が選択されています
            </div>
            <button
              onClick={() => setSelectedInvoices(new Set())}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              選択解除
            </button>
          </div>
        </div>
      )}
    </div>
  );
}