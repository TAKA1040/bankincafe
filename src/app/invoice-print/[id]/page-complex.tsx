'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Printer, Download, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { CustomerCategoryDB } from '@/lib/customer-categories';

interface InvoiceData {
  invoice_id: string;
  invoice_number: string;
  issue_date: string;
  billing_date: string;
  billing_month: string;
  customer_name: string;
  customer_category: string;
  subject_name: string;
  subject: string;
  registration_number: string;
  order_number: string;
  purchase_order_number: string;
  subtotal: number;
  tax: number;
  total_amount: number;
  status: string;
  payment_status: string;
  remarks: string;
  line_items: {
    id: number;
    line_no: number;
    task_type: string;
    target: string;
    action: string;
    position: string;
    quantity: number;
    unit_price: number;
    amount: number;
    raw_label: string;
    performed_at: string;
  }[];
}

interface CompanyInfo {
  company_name: string;
  representative_name: string;
  postal_code: string;
  address: string;
  phone: string;
  fax: string;
  email: string;
  bank_name: string;
  branch_name: string;
  account_type: string;
  account_number: string;
  account_holder: string;
}

export default function InvoicePrintPage() {
  const router = useRouter();
  const params = useParams();
  const invoiceId = params?.id as string;

  // SSR時のエラーを回避するため、マウント後に処理開始
  const [isMounted, setIsMounted] = useState(false);

  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customerCategoryDB, setCustomerCategoryDB] = useState<CustomerCategoryDB | null>(null);

  // マウント後の初期化
  useEffect(() => {
    setIsMounted(true);
    setCustomerCategoryDB(new CustomerCategoryDB());
  }, []);

  useEffect(() => {
    if (!isMounted) return; // SSR時は処理しない
    
    if (!invoiceId) {
      console.error('❌ No invoice ID provided');
      setError('請求書IDが指定されていません');
      setLoading(false);
      return;
    }
    
    console.log('🚀 Starting data fetch for invoice:', invoiceId);
    fetchInvoiceData();
    fetchCompanyInfo();
  }, [invoiceId, isMounted]);

  const fetchInvoiceData = async () => {
    try {
      console.log('🔍 Fetching invoice data for invoiceId:', invoiceId);
      
      // Supabaseクライアントの状態確認
      if (!supabase) {
        throw new Error('データベース接続サービスが初期化されていません');
      }
      
      // タイムアウト付きでデータ取得を実行
      const fetchWithTimeout = async () => {
        // 請求書基本データ取得（invoice_numberで検索）
        console.log('📋 Querying invoices table with invoice_number:', invoiceId);
        const invoicePromise = supabase
          .from('invoices')
          .select('*')
          .eq('invoice_number', invoiceId)
          .single();

        const { data: invoiceData, error: invoiceError } = await invoicePromise;
        console.log('📋 Invoice query result:', { data: invoiceData, error: invoiceError });

        // データベース接続エラーの詳細判定
        if (invoiceError) {
          if (invoiceError.code === 'PGRST116') {
            throw new Error(`請求書番号「${invoiceId}」は存在しません。正しい請求書番号を確認してください。`);
          }
          if (invoiceError.message?.includes('connect') || invoiceError.message?.includes('timeout')) {
            throw new Error('データベースサービスに接続できません。システム管理者にお問い合わせください。');
          }
          throw new Error(`データ取得エラー: ${invoiceError.message}`);
        }

        if (!invoiceData) {
          throw new Error(`請求書番号「${invoiceId}」のデータが見つかりません。`);
        }

        console.log('✅ Invoice data found:', invoiceData);

        // ライン項目取得（invoice_idを使用）
        console.log('📝 Querying line items with invoice_id:', invoiceData.invoice_id);
        const lineItemsPromise = supabase
          .from('invoice_line_items')
          .select('*')
          .eq('invoice_id', invoiceData.invoice_id)
          .order('line_no', { ascending: true });

        const { data: lineItems, error: lineError } = await lineItemsPromise;
        console.log('📝 Line items query result:', { data: lineItems, error: lineError });

        if (lineError) {
          console.warn('⚠️ Line items fetch warning:', lineError);
          // 明細データが取得できない場合でも請求書は表示
        }

        return {
          ...(invoiceData as any),
          line_items: (lineItems as any) || []
        } as InvoiceData;
      };

      // 10秒タイムアウト設定
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('データベース接続がタイムアウトしました。ネットワーク状況を確認するか、しばらく時間をおいて再度お試しください。')), 10000)
      );
      
      const invoiceData = await Promise.race([fetchWithTimeout(), timeoutPromise]);
      console.log('✅ Successfully fetched all data');
      setInvoice(invoiceData);

    } catch (err) {
      console.error('❌ Invoice fetch error:', err);
      let errorMessage = '請求書データの取得に失敗しました。';
      
      if (err instanceof Error) {
        if (err.message.includes('timeout') || err.message.includes('connect')) {
          errorMessage = err.message + '\n\n【対処法】\n• ネットワーク接続を確認してください\n• データベースサービスの状態を確認してください\n• 時間をおいて再度アクセスしてください';
        } else if (err.message.includes('存在しません')) {
          errorMessage = err.message + '\n\n【対処法】\n• 請求書番号をご確認ください\n• 請求書一覧から正しい番号を選択してください';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyInfo = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('company_settings')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setCompanyInfo((data as any) || {
        company_name: 'BankinCafe',
        representative_name: '代表取締役',
        postal_code: '〒000-0000',
        address: '住所未設定',
        phone: 'TEL: 000-0000-0000',
        fax: 'FAX: 000-0000-0000',
        email: 'info@bankincafe.com',
        bank_name: '銀行名',
        branch_name: '支店名',
        account_type: '普通',
        account_number: '0000000',
        account_holder: '口座名義'
      });
    } catch (err) {
      console.error('Company info fetch error:', err);
      // デフォルト情報を使用
      setCompanyInfo({
        company_name: 'BankinCafe',
        representative_name: '代表取締役',
        postal_code: '〒000-0000',
        address: '住所未設定',
        phone: 'TEL: 000-0000-0000',
        fax: 'FAX: 000-0000-0000',
        email: 'info@bankincafe.com',
        bank_name: '銀行名',
        branch_name: '支店名',
        account_type: '普通',
        account_number: '0000000',
        account_holder: '口座名義'
      });
    }
  };

  // 印刷機能
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  // PDF出力機能（ブラウザの印刷でPDF保存）
  const handlePDF = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  // 日付フォーマット
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '年').replace(/年(\d+)年/, '年$1月').replace(/月(\d+)$/, '月$1日');
  };

  // 請求月フォーマット
  const formatBillingMonth = (billingMonth: string) => {
    if (!billingMonth || billingMonth.length !== 4) return '';
    const year = `20${billingMonth.substring(0, 2)}`;
    const month = parseInt(billingMonth.substring(2, 4));
    return `${year}年${month}月分`;
  };

  // 金額フォーマット
  const formatAmount = (amount: number) => {
    return amount.toLocaleString('ja-JP');
  };

  // 作業タイプのプレフィックス
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

  // 顧客情報の取得
  const getCustomerInfo = () => {
    if (!invoice) return { name: '', company: '' };
    
    if (!customerCategoryDB) return { name: invoice.customer_name || '', company: '' };
    
    const categories = customerCategoryDB.getCategories();
    const category = categories.find(cat => cat.name === invoice.customer_category);
    
    return {
      name: invoice.customer_name || '',
      company: category?.companyName || ''
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">請求書の表示に問題が発生しました</h1>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-red-800 mb-2">エラー詳細:</h3>
                <div className="text-red-700 whitespace-pre-line text-sm">
                  {error}
                </div>
              </div>
            )}
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-blue-800 mb-2">💡 よくある解決方法:</h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• ページを再読み込みしてください</li>
                <li>• 請求書番号が正確かご確認ください</li>
                <li>• ネットワーク接続をご確認ください</li>
                <li>• しばらく時間をおいて再度お試しください</li>
              </ul>
            </div>
            
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => window.location.reload()} 
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                ページを再読み込み
              </button>
              <button 
                onClick={() => router.back()} 
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                前のページに戻る
              </button>
              <button 
                onClick={() => router.push('/invoice-list')} 
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                請求書一覧へ
              </button>
            </div>
            
            <div className="mt-6 text-xs text-gray-500">
              問題が解決しない場合は、システム管理者にお問い合わせください。<br/>
              請求書番号: {invoiceId}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const customerInfo = getCustomerInfo();

  return (
    <>
      {/* 印刷用CSSスタイル */}
      <style jsx global>{`
        @media print {
          body { margin: 0; padding: 0; font-family: 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', sans-serif; }
          .no-print { display: none !important; }
          .print-container { 
            width: 210mm; 
            min-height: 297mm; 
            margin: 0 auto; 
            padding: 15mm; 
            box-sizing: border-box;
            font-size: 11pt;
            line-height: 1.3;
          }
          .page-break { page-break-after: always; }
          .avoid-break { page-break-inside: avoid; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }
          .work-detail-table { font-size: 10pt; }
        }
        @media screen {
          .print-container {
            max-width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            padding: 20mm;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
        }
      `}</style>

      <div className="min-h-screen bg-gray-100">
        {/* ツールバー（印刷時非表示） */}
        <div className="no-print bg-white border-b sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-4 h-4" />
              戻る
            </button>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Printer className="w-4 h-4" />
                印刷
              </button>
              <button
                onClick={handlePDF}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                <Download className="w-4 h-4" />
                PDF
              </button>
            </div>
          </div>
        </div>

        {/* 請求書本体 */}
        <div className="print-container">
          {/* ヘッダー */}
          <div className="flex justify-between items-start mb-8">
            {/* 会社情報 */}
            <div className="w-1/2">
              <h1 className="text-2xl font-bold mb-2">{companyInfo?.company_name}</h1>
              <div className="text-sm space-y-1">
                <div>{companyInfo?.representative_name}</div>
                <div>{companyInfo?.postal_code}</div>
                <div>{companyInfo?.address}</div>
                <div className="flex gap-4">
                  <span>{companyInfo?.phone}</span>
                  <span>{companyInfo?.fax}</span>
                </div>
                <div>{companyInfo?.email}</div>
              </div>
            </div>

            {/* 請求書タイトルと番号 */}
            <div className="w-1/2 text-right">
              <h2 className="text-3xl font-bold mb-4 text-gray-800">請求書</h2>
              <div className="space-y-2 text-sm">
                <div><strong>請求書番号:</strong> {invoice.invoice_number}</div>
                <div><strong>発行日:</strong> {formatDate(invoice.issue_date)}</div>
                <div><strong>請求月:</strong> {formatBillingMonth(invoice.billing_month)}</div>
              </div>
            </div>
          </div>

          {/* 請求先情報 */}
          <div className="mb-8">
            <div className="text-lg font-semibold mb-2">
              {customerInfo.name} 様
            </div>
            {customerInfo.company && (
              <div className="text-sm text-gray-600 mb-4">
                {customerInfo.company}
              </div>
            )}
            
            {/* 件名・登録番号・その他詳細情報 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>件名:</strong> {invoice.subject_name || invoice.subject || '未設定'}</div>
                <div><strong>登録番号:</strong> {invoice.registration_number || '未設定'}</div>
                {invoice.order_number && (
                  <div><strong>注文番号:</strong> {invoice.order_number}</div>
                )}
                {invoice.purchase_order_number && (
                  <div><strong>発注番号:</strong> {invoice.purchase_order_number}</div>
                )}
                <div><strong>請求書ステータス:</strong> {
                  {
                    'draft': '下書き',
                    'finalized': '確定',
                    'sent': '送信済み',
                    'paid': '支払済み'
                  }[invoice.status] || invoice.status
                }</div>
                <div><strong>支払いステータス:</strong> {
                  {
                    'unpaid': '未入金',
                    'partial': '一部入金',
                    'paid': '入金済み'
                  }[invoice.payment_status] || invoice.payment_status
                }</div>
                {invoice.billing_date && (
                  <div><strong>請求日:</strong> {formatDate(invoice.billing_date)}</div>
                )}
              </div>
            </div>
          </div>

          {/* 合計金額（目立つ位置） */}
          <div className="text-right mb-6">
            <div className="inline-block bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">ご請求金額</div>
              <div className="text-3xl font-bold text-blue-800">
                ¥{formatAmount(invoice.total_amount)}
              </div>
              <div className="text-xs text-gray-500 mt-1">（税込）</div>
            </div>
          </div>

          {/* 作業明細 */}
          <div className="mb-8 avoid-break">
            <h3 className="text-lg font-semibold mb-4 pb-2 border-b">作業明細（全{invoice.line_items.length}項目）</h3>
            <table className="w-full border-collapse border border-gray-300 work-detail-table">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-2 py-2 text-center text-sm w-12">No.</th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-sm">項目</th>
                  <th className="border border-gray-300 px-3 py-2 text-center text-sm w-16">数量</th>
                  <th className="border border-gray-300 px-3 py-2 text-right text-sm w-20">単価</th>
                  <th className="border border-gray-300 px-3 py-2 text-right text-sm w-20">金額</th>
                </tr>
              </thead>
              <tbody>
                {invoice.line_items.length > 0 ? (
                  invoice.line_items.map((item, index) => {
                    // S作業（セット）の場合を判別 - task_typeベースで判断
                    const isSetWork = item.task_type === 'S' || item.task_type === 'set';
                    
                    // システムルールに従った作業名の決定
                    const itemName = isSetWork 
                      ? (item.target || 'セット作業')
                      : (item.raw_label || [item.target, item.action, item.position].filter(Boolean).join(' ') || '作業項目未設定');
                    
                    const prefix = getWorkTypePrefix(item.task_type);
                    const displayName = `${prefix}${itemName}`;
                    
                    // S作業の内訳を取得
                    const breakdownItems = isSetWork && item.raw_label ? 
                      item.raw_label.split(/[,、，・･]/).map(s => s.trim()).filter(s => s.length > 0) : [];

                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-2 py-2 text-center text-sm">
                          {item.line_no || (index + 1)}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-sm">
                          <div className="font-medium">{displayName}</div>
                          
                          {/* S作業の内訳表示 */}
                          {isSetWork && breakdownItems.length > 0 && (
                            <div className="text-xs text-gray-600 mt-1">
                              <span className="text-gray-500">内訳</span>
                              {breakdownItems.map((breakdown, idx) => (
                                <div key={idx} className="ml-2">
                                  • {breakdown}
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {item.performed_at && (
                            <div className="text-xs text-gray-500 mt-1">
                              実施日: {formatDate(item.performed_at)}
                            </div>
                          )}
                          
                          {/* T作業の詳細情報（従来の表示） */}
                          {!isSetWork && (item.target || item.action || item.position) && !item.raw_label && (
                            <div className="text-xs text-gray-600 mt-1">
                              対象: {item.target || '-'} / 動作: {item.action || '-'} / 位置: {item.position || '-'}
                            </div>
                          )}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-center text-sm">
                          {item.quantity || 1}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-right text-sm">
                          ¥{formatAmount(item.unit_price || 0)}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-right text-sm font-medium">
                          ¥{formatAmount(item.amount || 0)}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="border border-gray-300 px-3 py-4 text-center text-gray-500">
                      作業項目が登録されていません
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 金額計算 */}
          <div className="flex justify-end mb-8">
            <div className="w-64">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-1 border-b border-gray-200">
                  <span>小計:</span>
                  <span>¥{formatAmount(invoice.subtotal)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200">
                  <span>消費税:</span>
                  <span>¥{formatAmount(invoice.tax)}</span>
                </div>
                <div className="flex justify-between py-2 border-t-2 border-gray-400 font-bold text-lg">
                  <span>合計:</span>
                  <span>¥{formatAmount(invoice.total_amount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 振込先情報 */}
          {companyInfo?.bank_name && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">お振込先</h3>
              <div className="bg-gray-50 p-4 rounded-lg text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div><strong>銀行名:</strong> {companyInfo.bank_name}</div>
                  <div><strong>支店名:</strong> {companyInfo.branch_name}</div>
                  <div><strong>預金種別:</strong> {companyInfo.account_type}</div>
                  <div><strong>口座番号:</strong> {companyInfo.account_number}</div>
                  <div className="col-span-2"><strong>口座名義:</strong> {companyInfo.account_holder}</div>
                </div>
              </div>
            </div>
          )}

          {/* 備考 */}
          {invoice.remarks && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">備考</h3>
              <div className="bg-gray-50 p-4 rounded-lg text-sm">
                {invoice.remarks}
              </div>
            </div>
          )}

          {/* フッター */}
          <div className="text-center text-xs text-gray-500 mt-8 pt-4 border-t">
            この請求書は BankinCafe システムにより自動生成されました
          </div>
        </div>
      </div>
    </>
  );
}