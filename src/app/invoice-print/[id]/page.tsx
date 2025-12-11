'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Printer, Download, ArrowLeft, Home, FileText, Layout, Grid, Briefcase, ChevronDown, ChevronUp, Settings } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { CustomerCategoryDB } from '@/lib/customer-categories';
import { useInvoicePrintSettings, LayoutId } from '@/hooks/useInvoicePrintSettings';
import { InvoicePagesContainer, PageRenderInfo } from '@/components/invoice-print/InvoicePageTemplate';
import { paginateLineItems, GroupedLineItem, InvoicePage } from '@/lib/invoice-pagination';

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
  invoice_type?: 'standard' | 'red' | 'black';
  original_invoice_id?: string;
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

// 出力形式タイプ
type OutputFormat = 'current' | 'positive' | 'negative' | 'corrected';

// 関連請求書用の簡易型（line_itemsなし）
interface RelatedInvoice {
  invoice_id: string;
  invoice_type?: 'standard' | 'red' | 'black';
  subtotal: number;
  tax: number;
  total_amount: number;
}

interface CompanyInfo {
  companyName: string;
  postalCode: string;
  prefecture: string;
  city: string;
  address: string;
  buildingName: string;
  phoneNumber: string;
  bankName: string;
  bankBranch: string;
  accountType: string;
  accountNumber: string;
  accountHolder: string;
  taxRegistrationNumber?: string;
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
  const [selectedLayout, setSelectedLayout] = useState<'minimal' | 'gradient' | 'geometric' | 'corporate' | 'standard' | 'modern' | 'compact' | 'detailed' | 'basic' | 'traditional' | 'classic' | 'plain' | 'multiline'>('minimal');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('current');
  const [relatedInvoices, setRelatedInvoices] = useState<RelatedInvoice[]>([]);
  const [isLayoutSelectorOpen, setIsLayoutSelectorOpen] = useState(false);
  const [settingsApplied, setSettingsApplied] = useState(false);
  const [activeHeaderItems, setActiveHeaderItems] = useState<string[]>([]);
  const [activeFooterItems, setActiveFooterItems] = useState<string[]>([]);

  // 印刷設定フックを使用
  const { getSettingsForCustomer, loading: settingsLoading } = useInvoicePrintSettings();

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

  // 顧客別設定の自動適用（請求書データと設定がロードされた後）
  useEffect(() => {
    if (invoice && !settingsLoading && !settingsApplied) {
      const customerSettings = getSettingsForCustomer(invoice.customer_name);
      // レイアウトIDをselectedLayoutの型に変換
      const layoutMapping: Record<LayoutId, typeof selectedLayout> = {
        'minimal': 'minimal',
        'standard': 'standard',
        'modern': 'modern',
        'compact': 'compact',
        'detailed': 'detailed',
      };
      const mappedLayout = layoutMapping[customerSettings.layout] || 'minimal';
      setSelectedLayout(mappedLayout);
      // ヘッダー/フッター表示項目も適用
      setActiveHeaderItems(customerSettings.headerItems);
      setActiveFooterItems(customerSettings.footerItems);
      setSettingsApplied(true);
      console.log('✅ 顧客別設定を適用:', invoice.customer_name, '→', customerSettings.layout, 'header:', customerSettings.headerItems, 'footer:', customerSettings.footerItems);
    }
  }, [invoice, settingsLoading, settingsApplied, getSettingsForCustomer]);

  const fetchInvoiceData = async () => {
    try {
      console.log('🔍 Fetching invoice data for invoiceId:', invoiceId);
      
      // Supabaseクライアントの状態確認
      if (!supabase) {
        throw new Error('データベース接続サービスが初期化されていません');
      }
      
      // タイムアウト付きでデータ取得を実行
      const fetchWithTimeout = async () => {
        // 請求書基本データ取得（invoice_idで検索）
        console.log('📋 Querying invoices table with invoice_id:', invoiceId);
        const invoicePromise = supabase
          .from('invoices')
          .select('*')
          .eq('invoice_id', invoiceId)
          .single();

        const { data: invoiceData, error: invoiceError } = await invoicePromise;
        console.log('📋 Invoice query result:', { data: invoiceData, error: invoiceError });

        // データベース接続エラーの詳細判定
        if (invoiceError) {
          if (invoiceError.code === 'PGRST116') {
            throw new Error(`請求書ID「${invoiceId}」は存在しません。正しい請求書IDを確認してください。`);
          }
          if (invoiceError.message?.includes('connect') || invoiceError.message?.includes('timeout')) {
            throw new Error('データベースサービスに接続できません。システム管理者にお問い合わせください。');
          }
          throw new Error(`データ取得エラー: ${invoiceError.message}`);
        }

        if (!invoiceData) {
          throw new Error(`請求書ID「${invoiceId}」のデータが見つかりません。`);
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
      console.log('🏢 Fetching company info...');
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || '00000000-0000-0000-0000-000000000000';
      console.log('👤 User ID:', userId);
      
      // 現在のユーザーIDで最新のデータを取得
      console.log('🔍 Querying company_info with user_id:', userId);
      const { data: initialData, error } = await supabase
        .from('company_info')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      console.log('📊 Initial query result:', { data: initialData, error });
      console.log('📊 Raw data fields:', initialData ? Object.keys(initialData) : 'No data');
      
      let data = initialData;
      // データが見つからない場合、デフォルトユーザーIDでも試す
      if (!data && !error && userId !== '00000000-0000-0000-0000-000000000000') {
        console.log('🔄 Trying fallback with default user ID...');
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('company_info')
          .select('*')
          .eq('user_id', '00000000-0000-0000-0000-000000000000')
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        
        console.log('📊 Fallback query result:', { data: fallbackData, error: fallbackError });
        data = fallbackData;
      }

      if (data) {
        console.log('✅ Company data found, setting company info:', data);
        const companyInfo = {
          companyName: data.company_name || 'BankinCafe',
          postalCode: data.postal_code || '〒000-0000',
          prefecture: data.prefecture || '',
          city: data.city || '',
          address: data.address || '住所未設定',
          buildingName: data.building_name || '',
          phoneNumber: data.phone_number || 'TEL: 000-0000-0000',
          bankName: data.bank_name || '銀行名',
          bankBranch: data.bank_branch || '支店名',
          accountType: data.account_type || '普通',
          accountNumber: data.account_number || '0000000',
          accountHolder: data.account_holder || '口座名義'
        };
        console.log('🏢 Setting company info to:', companyInfo);
        setCompanyInfo(companyInfo);
      } else {
        console.log('⚠️ No company data found, using defaults');
        // デフォルト情報を使用
        setCompanyInfo({
          companyName: 'BankinCafe',
          postalCode: '〒000-0000',
          prefecture: '',
          city: '',
          address: '住所未設定',
          buildingName: '',
          phoneNumber: 'TEL: 000-0000-0000',
          bankName: '銀行名',
          bankBranch: '支店名',
          accountType: '普通',
          accountNumber: '0000000',
          accountHolder: '口座名義'
        });
      }
    } catch (err) {
      console.error('Company info fetch error:', err);
      // デフォルト情報を使用
      setCompanyInfo({
        companyName: 'BankinCafe',
        postalCode: '〒000-0000',
        prefecture: '',
        city: '',
        address: '住所未設定',
        buildingName: '',
        phoneNumber: 'TEL: 000-0000-0000',
        bankName: '銀行名',
        bankBranch: '支店名',
        accountType: '普通',
        accountNumber: '0000000',
        accountHolder: '口座名義'
      });
    }
  };

  // 関連請求書を取得（修正履歴）
  useEffect(() => {
    const fetchRelatedInvoices = async () => {
      if (!invoice) return;

      // 親番号を取得（枝番を除く）
      const parentNumber = invoice.invoice_id.split('-')[0];

      const { data } = await supabase
        .from('invoices')
        .select('*')
        .like('invoice_id', `${parentNumber}-%`)
        .order('invoice_id', { ascending: true });

      if (data && data.length > 1) {
        setRelatedInvoices(data as RelatedInvoice[]);
      }
    };

    fetchRelatedInvoices();
  }, [invoice]);

  // 出力形式に応じた金額を計算
  const getDisplayAmounts = () => {
    if (!invoice) return { subtotal: 0, tax: 0, total: 0 };

    switch (outputFormat) {
      case 'current':
        // 現在の請求書の金額をそのまま表示
        return {
          subtotal: invoice.subtotal,
          tax: invoice.tax,
          total: invoice.total_amount || (invoice.subtotal + invoice.tax)
        };
      case 'positive':
        // +請求（黒伝のみ、または正の金額のみ）
        if (relatedInvoices.length > 0) {
          const blackInvoice = relatedInvoices.find(inv => inv.invoice_type === 'black');
          if (blackInvoice) {
            return {
              subtotal: blackInvoice.subtotal,
              tax: blackInvoice.tax,
              total: blackInvoice.total_amount || (blackInvoice.subtotal + blackInvoice.tax)
            };
          }
        }
        return {
          subtotal: Math.max(0, invoice.subtotal),
          tax: Math.max(0, invoice.tax),
          total: Math.max(0, invoice.total_amount || (invoice.subtotal + invoice.tax))
        };
      case 'negative':
        // -請求（赤伝のみ）
        if (relatedInvoices.length > 0) {
          const redInvoice = relatedInvoices.find(inv => inv.invoice_type === 'red');
          if (redInvoice) {
            return {
              subtotal: redInvoice.subtotal,
              tax: redInvoice.tax,
              total: redInvoice.total_amount || (redInvoice.subtotal + redInvoice.tax)
            };
          }
        }
        return {
          subtotal: Math.min(0, invoice.subtotal),
          tax: Math.min(0, invoice.tax),
          total: Math.min(0, invoice.total_amount || (invoice.subtotal + invoice.tax))
        };
      case 'corrected':
        // 訂正後金額（全ての伝票を合算）
        if (relatedInvoices.length > 0) {
          const totals = relatedInvoices.reduce((acc, inv) => {
            acc.subtotal += inv.subtotal;
            acc.tax += inv.tax;
            acc.total += inv.total_amount || (inv.subtotal + inv.tax);
            return acc;
          }, { subtotal: 0, tax: 0, total: 0 });
          return totals;
        }
        return {
          subtotal: invoice.subtotal,
          tax: invoice.tax,
          total: invoice.total_amount || (invoice.subtotal + invoice.tax)
        };
      default:
        return {
          subtotal: invoice.subtotal,
          tax: invoice.tax,
          total: invoice.total_amount || (invoice.subtotal + invoice.tax)
        };
    }
  };

  // 表示用金額を取得（レイアウト共通で使用）
  const displayAmounts = getDisplayAmounts();

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


  // 金額フォーマット
  const formatAmount = (amount: number) => {
    return amount.toLocaleString('ja-JP');
  };

  // 明細をline_noでグループ化して印刷用に整形
  interface PrintLineItem {
    lineNo: number;
    isSet: boolean;
    setName?: string;
    items: Array<{
      label: string;
      isFirstOfSet: boolean;
      quantity: number;
      unitPrice: number;
      amount: number;
    }>;
    totalAmount: number;
  }

  const getGroupedLineItems = (): PrintLineItem[] => {
    if (!invoice?.line_items?.length) return [];

    // line_noでグループ化
    const grouped = new Map<number, typeof invoice.line_items>();
    invoice.line_items.forEach(item => {
      const lineNo = item.line_no || 0;
      if (!grouped.has(lineNo)) {
        grouped.set(lineNo, []);
      }
      grouped.get(lineNo)!.push(item);
    });

    // グループを整形
    const result: PrintLineItem[] = [];
    grouped.forEach((items, lineNo) => {
      // sub_noでソート
      const sortedItems = [...items].sort((a, b) => ((a as any).sub_no || 0) - ((b as any).sub_no || 0));
      const firstItem = sortedItems[0];
      const isSet = firstItem.task_type === 'S';

      if (isSet) {
        // セット作業: set_nameを1行目に、その後にraw_label_partを複数行で表示
        const setName = (firstItem as any).set_name || firstItem.target || 'セット作業';

        // 最初の行はset_name（金額あり）
        const printItems: PrintLineItem['items'] = [{
          label: setName,
          isFirstOfSet: true,
          quantity: firstItem.quantity,
          unitPrice: firstItem.unit_price,
          amount: firstItem.amount
        }];

        // 明細行: 各アイテムのraw_label_partを追加
        sortedItems.forEach((item) => {
          const rawLabelPart = (item as any).raw_label_part;
          if (rawLabelPart) {
            printItems.push({
              label: rawLabelPart,
              isFirstOfSet: false,
              quantity: 0,
              unitPrice: 0,
              amount: 0
            });
          }
        });

        result.push({
          lineNo,
          isSet: true,
          setName,
          items: printItems,
          totalAmount: firstItem.amount
        });
      } else {
        // 個別作業: raw_label_partを表示
        const label = (firstItem as any).raw_label_part ||
          [firstItem.target, (firstItem as any).action1 || firstItem.action, (firstItem as any).position1 || firstItem.position].filter(Boolean).join(' ') ||
          firstItem.raw_label || '-';
        result.push({
          lineNo,
          isSet: false,
          items: [{
            label,
            isFirstOfSet: false,
            quantity: firstItem.quantity,
            unitPrice: firstItem.unit_price,
            amount: firstItem.amount
          }],
          totalAmount: firstItem.amount
        });
      }
    });

    // line_no順にソート
    return result.sort((a, b) => a.lineNo - b.lineNo);
  };

  const groupedLineItems = getGroupedLineItems();

  // PrintLineItemをGroupedLineItemに変換してページ分割
  const convertToGroupedLineItems = (items: PrintLineItem[]): GroupedLineItem[] => {
    return items.map(item => ({
      lineNo: item.lineNo,
      isSet: item.isSet,
      setName: item.setName,
      items: item.items.map(i => ({
        label: i.label,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        amount: i.amount,
        isFirstOfSet: i.isFirstOfSet,
      })),
    }));
  };

  // ページ分割されたデータ
  const paginatedPages = paginateLineItems(convertToGroupedLineItems(groupedLineItems));

  // 共通明細テーブルコンポーネント（全レイアウトで使用）
  // 列幅: 項目55-60%, 数量10%, 単価15%, 金額15% (prompt.txt指示)
  // 行高18px・フォント10px（A4 1ページ厳守）
  const LineItemsTable = ({
    headerBg = 'bg-gray-100',
    headerText = 'text-gray-900',
    borderColor = 'border-gray-300',
    compact = false
  }: {
    headerBg?: string;
    headerText?: string;
    borderColor?: string;
    compact?: boolean;
  }) => (
    <table className="w-full" style={{ tableLayout: 'fixed', fontSize: '12px' }}>
      <colgroup>
        <col style={{ width: '58%' }} />
        <col style={{ width: '10%' }} />
        <col style={{ width: '16%' }} />
        <col style={{ width: '16%' }} />
      </colgroup>
      <thead>
        <tr className={headerBg}>
          <th className={`px-2 py-1 text-left border ${borderColor} ${headerText} font-medium`} style={{ fontSize: '12px' }}>作業内容</th>
          <th className={`px-2 py-1 text-center border ${borderColor} ${headerText} font-medium`} style={{ fontSize: '12px' }}>数量</th>
          <th className={`px-2 py-1 text-right border ${borderColor} ${headerText} font-medium`} style={{ fontSize: '12px' }}>単価</th>
          <th className={`px-2 py-1 text-right border ${borderColor} ${headerText} font-medium`} style={{ fontSize: '12px' }}>金額</th>
        </tr>
      </thead>
      <tbody>
        {groupedLineItems.map((group) => (
          group.items.map((item, itemIdx) => {
            const isSetChild = !item.isFirstOfSet && group.isSet;
            return (
              <tr key={`${group.lineNo}-${itemIdx}`} className="bg-white set-group" style={{ height: '24px' }}>
                <td className={`px-2 py-0.5 border ${borderColor}`} style={{ overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '12px' }}>
                  {isSetChild ? (
                    <div className="pl-3 invoice-set-child" style={{ fontSize: '11px', color: '#666' }}>
                      ・{item.label}
                    </div>
                  ) : (
                    <div className="font-medium invoice-body" style={{ fontSize: '12px', lineHeight: '1.4' }}>
                      {item.label}
                    </div>
                  )}
                </td>
                <td className={`px-2 py-0.5 text-center border ${borderColor}`} style={{ fontSize: '12px' }}>
                  {/* セット子行は数量表示なし */}
                  {!isSetChild && item.quantity > 0 ? item.quantity : ''}
                </td>
                <td className={`px-2 py-0.5 text-right border ${borderColor} amount-cell`} style={{ fontSize: '12px' }}>
                  {/* セット子行は単価表示なし */}
                  {!isSetChild && item.unitPrice > 0 ? `¥${formatAmount(item.unitPrice)}` : ''}
                </td>
                <td className={`px-2 py-0.5 text-right border ${borderColor} amount-cell font-medium invoice-amount`} style={{ fontSize: '14px', fontWeight: 700 }}>
                  {/* セット子行は金額表示なし（親行のみ金額表示） */}
                  {!isSetChild && item.amount > 0 ? `¥${formatAmount(item.amount)}` : ''}
                </td>
              </tr>
            );
          })
        ))}
      </tbody>
    </table>
  );

  // 顧客情報の取得
  const getCustomerInfo = () => {
    if (!invoice) return { name: '', company: '' };
    
    if (!customerCategoryDB) return { name: invoice?.customer_name || '', company: '' };
    
    const categories = customerCategoryDB.getCategories();
    const category = categories.find(cat => cat.name === invoice?.customer_category);
    
    const customerName = invoice?.customer_name || '';
    const categoryCompanyName = category?.companyName || '';
    
    // 顧客名とカテゴリーの会社名が同じ場合、または片方に他方が含まれる場合は重複を避ける
    const isSimilar = customerName && categoryCompanyName && (
      customerName === categoryCompanyName ||
      customerName.includes(categoryCompanyName.replace(/株式会社|有限会社|合同会社/, '')) ||
      categoryCompanyName.includes(customerName.replace(/株式会社|有限会社|合同会社/, ''))
    );
    
    return {
      name: customerName,
      company: isSimilar ? '' : categoryCompanyName
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
            
            <div className="flex gap-2 justify-center">
              <button 
                onClick={() => window.location.reload()} 
                className="bg-blue-600 text-white px-6 py-1 rounded-lg hover:bg-blue-700 transition-colors"
              >
                ページを再読み込み
              </button>
              <button 
                onClick={() => router.back()} 
                className="bg-gray-600 text-white px-6 py-1 rounded-lg hover:bg-gray-700 transition-colors"
              >
                前のページに戻る
              </button>
              <button 
                onClick={() => router.push('/invoice-list')} 
                className="bg-green-600 text-white px-6 py-1 rounded-lg hover:bg-green-700 transition-colors"
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

  // レイアウトタブの定義
  const layoutTabs = [
    { id: 'minimal', name: 'ミニマル', icon: FileText, description: 'クリーンで洗練されたデザイン' },
    { id: 'gradient', name: 'グラデーション', icon: Layout, description: 'モダンで視覚的に魅力的' },
    { id: 'geometric', name: 'ジオメトリック', icon: Grid, description: '幾何学的プロフェッショナル' },
    { id: 'corporate', name: 'コーポレート', icon: Briefcase, description: 'ブランドカラー活用' },
    { id: 'standard', name: '法人標準', icon: FileText, description: '適格請求書対応・法人向け' },
    { id: 'modern', name: 'ビジネス', icon: Layout, description: 'プロフェッショナル仕様' },
    { id: 'compact', name: 'シンプル', icon: Grid, description: 'A4一枚完結型' },
    { id: 'detailed', name: '詳細・監査', icon: Briefcase, description: '税務・監査対応' },
    { id: 'basic', name: '基本', icon: FileText, description: '最もシンプルな一般的フォーマット' },
    { id: 'traditional', name: '伝統的', icon: Layout, description: '日本の従来型請求書スタイル' },
    { id: 'classic', name: 'クラシック', icon: Grid, description: '白黒のオーソドックスデザイン' },
    { id: 'plain', name: 'プレーン', icon: Briefcase, description: '装飾なし・実用重視' },
    { id: 'multiline', name: '多明細', icon: FileText, description: '明細行が多い場合向け・小フォント' }
  ] as const;

  // 出力形式オプション
  const outputFormatOptions = [
    { id: 'current' as OutputFormat, name: '現在の請求書', description: 'この請求書の金額をそのまま表示' },
    { id: 'positive' as OutputFormat, name: '+請求（黒伝）', description: '追加請求金額のみ表示' },
    { id: 'negative' as OutputFormat, name: '-請求（赤伝）', description: '取消・減額金額のみ表示' },
    { id: 'corrected' as OutputFormat, name: '訂正後合計', description: '全修正を反映した最終金額' }
  ];

  // タブコンポーネント（折りたたみ式）
  const TabSelector = () => {
    const currentLayout = layoutTabs.find(tab => tab.id === selectedLayout);

    return (
    <div className="mb-6 print:hidden">
      {/* 折りたたみヘッダー */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">レイアウト:</span>
          <span className="font-medium text-gray-800">{currentLayout?.name || 'ミニマル'}</span>
          <button
            onClick={() => setIsLayoutSelectorOpen(!isLayoutSelectorOpen)}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {isLayoutSelectorOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {isLayoutSelectorOpen ? '閉じる' : '変更'}
          </button>
        </div>
        <button
          onClick={() => router.push('/invoice-print-settings')}
          className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Settings size={14} />
          設定
        </button>
      </div>

      {/* 展開時のレイアウト選択 */}
      {isLayoutSelectorOpen && (
        <div className="mt-3 p-4 bg-gray-50 rounded-lg border">
          <div className="flex flex-wrap gap-2">
            {layoutTabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedLayout(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                    selectedLayout === tab.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  <IconComponent size={16} />
                  <div className="text-left">
                    <div className="font-medium">{tab.name}</div>
                    <div className="text-xs opacity-75">{tab.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 出力形式選択（修正伝票がある場合のみ表示） */}
      {(invoice?.invoice_type === 'red' || invoice?.invoice_type === 'black' || relatedInvoices.length > 1) && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="text-md font-semibold mb-2 text-yellow-800">
            ⚠️ 修正履歴あり - 出力形式を選択
          </h4>
          <p className="text-sm text-yellow-700 mb-2">
            この請求書には修正履歴があります。印刷する金額の形式を選択してください。
          </p>
          <div className="flex flex-wrap gap-2">
            {outputFormatOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setOutputFormat(option.id)}
                className={`px-4 py-1 rounded-lg border transition-all ${
                  outputFormat === option.id
                    ? 'bg-yellow-600 text-white border-yellow-600 shadow-md'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-yellow-400 hover:bg-yellow-50'
                }`}
              >
                <div className="text-left">
                  <div className="font-medium">{option.name}</div>
                  <div className="text-xs opacity-75">{option.description}</div>
                </div>
              </button>
            ))}
          </div>
          {relatedInvoices.length > 1 && (
            <div className="mt-3 text-sm text-yellow-700">
              <strong>関連伝票:</strong> {relatedInvoices.map(inv => inv.invoice_id).join(', ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
  };

  return (
    <>
      {/* 印刷用CSSスタイル - 法人向けA4縦1ページ請求書 */}
      <style jsx global>{`
        /* フォント統一: Noto Sans JP */
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap');

        /* 印刷時の@pageルール */
        @page {
          size: A4 portrait;
          margin: 0mm;
        }

        @media print {
          html, body {
            margin: 0;
            padding: 0;
            width: 210mm;
            font-family: 'Noto Sans JP', 'Noto Sans', sans-serif;
            font-size: 12px;
            line-height: 1.4;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
            background: white;
          }
          .no-print { display: none !important; }
          .a4-print-container {
            width: 210mm;
            margin: 0;
            padding: 0;
          }
          /* 複数ページ対応 - invoice-page クラス */
          .invoice-page {
            width: 210mm;
            min-height: 297mm;
            padding: 15mm;
            box-sizing: border-box;
            background: white;
            page-break-after: always;
          }
          .invoice-page:last-child {
            page-break-after: auto;
          }
          /* A4ページ: 余白 上下20mm/左右15mm（prompt.txt指示） */
          .a4-page, .print-container {
            width: 210mm;
            height: 297mm;
            max-height: 297mm;
            padding: 20mm 15mm;
            box-sizing: border-box;
            background: white;
            overflow: hidden;
          }
          /* 改ページ制御（prompt.txt指示）: テーブルはauto、セットグループのみavoid */
          table { page-break-inside: auto; }
          tr { page-break-inside: auto; }
          .set-group { page-break-inside: avoid; }
          .summary-section { page-break-inside: avoid; }
          thead { display: table-header-group; }

          /* フォントサイズ固定（prompt.txt指示: 本文12px、見出し14-16px、金額14px bold） */
          .invoice-title { font-size: 16px; font-weight: 700; }
          .invoice-heading { font-size: 14px; font-weight: 500; }
          .invoice-body { font-size: 12px; line-height: 1.4; }
          .invoice-amount { font-size: 14px; font-weight: 700; }
          .invoice-small { font-size: 11px; }
          .invoice-set-child { font-size: 11px; color: #666; }

          /* 金額右寄せ固定幅 */
          .amount-cell {
            text-align: right;
            font-variant-numeric: tabular-nums;
            white-space: nowrap;
          }
        }

        /* 画面プレビュー用 */
        @media screen {
          .a4-print-container {
            padding: 20px;
            background: #e5e7eb;
          }
          /* 複数ページ対応 - invoice-page クラス（画面プレビュー） */
          .invoice-page {
            width: 210mm;
            min-height: 297mm;
            padding: 15mm;
            box-sizing: border-box;
            background: white;
            margin: 20px auto;
            box-shadow: 0 .5mm 2mm rgba(0,0,0,.3);
            border: 1px solid #ccc;
            font-family: 'Noto Sans JP', 'Noto Sans', sans-serif;
          }
          .a4-page, .print-container {
            width: 210mm;
            height: 297mm;
            max-height: 297mm;
            padding: 20mm 15mm;
            box-sizing: border-box;
            background: white;
            margin: 20px auto;
            box-shadow: 0 .5mm 2mm rgba(0,0,0,.3);
            border: 1px solid #ccc;
            overflow: hidden;
            font-family: 'Noto Sans JP', 'Noto Sans', sans-serif;
          }
          /* フォントサイズ固定（prompt.txt指示: 本文12px、見出し14-16px、金額14px bold） */
          .invoice-title { font-size: 16px; font-weight: 700; }
          .invoice-heading { font-size: 14px; font-weight: 500; }
          .invoice-body { font-size: 12px; line-height: 1.4; }
          .invoice-amount { font-size: 14px; font-weight: 700; }
          .invoice-small { font-size: 11px; }
          .invoice-set-child { font-size: 11px; color: #666; }

          /* 金額右寄せ固定幅 */
          .amount-cell {
            text-align: right;
            font-variant-numeric: tabular-nums;
            white-space: nowrap;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gray-100">
        {/* ツールバー（印刷時非表示） */}
        <div className="no-print bg-white border-b sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
            <div>
              <h1 className="text-base font-bold text-gray-800">請求書印刷</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="px-4 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 font-medium"
              >
                <Printer size={20} />
                印刷
              </button>
              <button
                onClick={handlePDF}
                className="px-4 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 font-medium"
              >
                <Download size={20} />
                PDF
              </button>
              <button
                onClick={() => router.back()}
                className="px-4 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2 font-medium"
              >
                <ArrowLeft size={20} />
                戻る
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium"
              >
                <Home size={20} />
                メニューへ
              </button>
            </div>
          </div>
        </div>

        {/* タブセレクタ */}
        <div className="max-w-4xl mx-auto px-4 py-4">
          <TabSelector />
        </div>

        {/* 請求書本体 - 全レイアウトA4ページ対応 */}
        <div className="a4-print-container">
          {selectedLayout === 'minimal' && <MinimalLayout />}
          {selectedLayout === 'gradient' && <GradientLayout />}
          {selectedLayout === 'geometric' && <GeometricLayout />}
          {selectedLayout === 'corporate' && <CorporateLayout />}
          {selectedLayout === 'standard' && <StandardLayout />}
          {selectedLayout === 'modern' && <ModernLayout />}
          {selectedLayout === 'compact' && <CompactLayout />}
          {selectedLayout === 'detailed' && <DetailedLayout />}
          {selectedLayout === 'basic' && <BasicLayout />}
          {selectedLayout === 'traditional' && <TraditionalLayout />}
          {selectedLayout === 'classic' && <ClassicLayout />}
          {selectedLayout === 'plain' && <PlainLayout />}
          {selectedLayout === 'multiline' && <MultilineLayout />}
        </div>
      </div>
    </>
  );

  // 1. ミニマル・クリーンデザイン - 共通ひな型使用
  function MinimalLayout() {
    // ヘッダー項目の表示判定ヘルパー
    const showHeaderItem = (id: string) => activeHeaderItems.length === 0 || activeHeaderItems.includes(id);

    // ミニマル用ヘッダー
    const renderMinimalHeader = () => (
      <>
        {/* ヘッダー: 請求書番号・発行日を左、支払期限/合計を右で強調 */}
        <div className="flex justify-between items-start pb-2 border-b-2 border-gray-800" style={{ marginBottom: '10px' }}>
          <div>
            <h1 className="invoice-title" style={{ fontSize: '16px', fontWeight: 700 }}>請 求 書</h1>
            {showHeaderItem('invoice_number') && (
              <div className="invoice-body" style={{ fontSize: '12px', marginTop: '4px' }}>
                No. {invoice?.invoice_number}
              </div>
            )}
            {showHeaderItem('issue_date') && (
              <div className="invoice-small" style={{ fontSize: '11px', color: '#666' }}>
                発行日: {formatDate(invoice?.issue_date || '')}
              </div>
            )}
            {showHeaderItem('due_date') && invoice?.billing_date && (
              <div className="invoice-small" style={{ fontSize: '11px', color: '#666' }}>
                支払期限: {formatDate(invoice.billing_date)}
              </div>
            )}
          </div>
          {showHeaderItem('total_amount') && (
            <div className="text-right">
              <div className="invoice-small" style={{ fontSize: '11px', color: '#666' }}>ご請求金額（税込）</div>
              <div className="invoice-amount amount-cell" style={{ fontSize: '14px', fontWeight: 700 }}>
                ¥{formatAmount(displayAmounts.total)}
              </div>
            </div>
          )}
        </div>

        {/* 請求先・請求元 - コンパクト */}
        <div className="grid grid-cols-2 gap-3" style={{ marginBottom: '10px' }}>
          {showHeaderItem('customer_name') && (
            <div className="border border-gray-300 p-2">
              <div className="invoice-small" style={{ fontSize: '11px', color: '#666' }}>請求先</div>
              <div className="invoice-heading" style={{ fontSize: '14px', fontWeight: 500 }}>{customerInfo.name} 様</div>
              {showHeaderItem('subject') && (
                <div className="invoice-body" style={{ fontSize: '12px', color: '#444' }}>{invoice?.subject_name || invoice?.subject}</div>
              )}
              {showHeaderItem('registration_number') && invoice?.registration_number && (
                <div className="invoice-small" style={{ fontSize: '11px', color: '#444' }}>登録番号: {invoice.registration_number}</div>
              )}
            </div>
          )}
          {showHeaderItem('company_name') && (
            <div className="border border-gray-300 p-2">
              <div className="invoice-small" style={{ fontSize: '11px', color: '#666' }}>請求元</div>
              <div className="invoice-heading" style={{ fontSize: '14px', fontWeight: 500 }}>{companyInfo?.companyName}</div>
              {showHeaderItem('company_address') && (
                <div className="invoice-small" style={{ fontSize: '11px', color: '#444', lineHeight: '1.4' }}>
                  〒{companyInfo?.postalCode} {companyInfo?.prefecture}{companyInfo?.city}{companyInfo?.address}
                </div>
              )}
              {showHeaderItem('company_phone') && (
                <div className="invoice-small" style={{ fontSize: '11px', color: '#444' }}>TEL: {companyInfo?.phoneNumber}</div>
              )}
              {showHeaderItem('company_registration') && companyInfo?.taxRegistrationNumber && (
                <div className="invoice-small" style={{ fontSize: '11px', color: '#444' }}>登録番号: {companyInfo.taxRegistrationNumber}</div>
              )}
            </div>
          )}
        </div>
      </>
    );

    // ミニマル用明細テーブル（ページ内アイテム用）
    // ページの残りスペースを計算して空白行で埋める
    // A4: 297mm - padding 30mm = 267mm使用可能
    // 行の高さ: 約8mm（p-2 = 8px padding × 2 + font 12px = 約28px ≈ 7.4mm）
    // ヘッダー部分: 約80mm、フッター部分: 約50mm
    const ROW_HEIGHT_MM = 8;
    const PAGE_CONTENT_HEIGHT_MM = 267; // A4 - 上下パディング
    const HEADER_HEIGHT_MM = 85; // ヘッダー部分の高さ
    const FOOTER_HEIGHT_MM = 55; // フッター部分の高さ
    const TABLE_HEADER_HEIGHT_MM = 10; // テーブルヘッダー行

    const renderMinimalLineItems = (pageItems: GroupedLineItem[], pageInfo: PageRenderInfo) => {
      // 実際のデータ行数を計算
      const dataRowCount = pageItems.reduce((sum, group) => sum + group.items.length, 0);

      // ページの種類に応じた使用可能な高さを計算
      let availableHeight = PAGE_CONTENT_HEIGHT_MM;
      if (pageInfo.showHeader) {
        availableHeight -= HEADER_HEIGHT_MM;
      }
      if (pageInfo.showFooter) {
        availableHeight -= FOOTER_HEIGHT_MM;
      }

      // テーブルヘッダーを除いた行数を計算
      const tableBodyHeight = availableHeight - TABLE_HEADER_HEIGHT_MM;
      const maxRows = Math.floor(tableBodyHeight / ROW_HEIGHT_MM);

      // 空白行の数（データ行との差分）
      const emptyRowCount = Math.max(0, maxRows - dataRowCount);

      return (
        <table className="w-full border-collapse" style={{ tableLayout: 'fixed', fontSize: '12px', borderCollapse: 'collapse' }}>
          <colgroup>
            <col style={{ width: '58%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '16%' }} />
            <col style={{ width: '16%' }} />
          </colgroup>
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left border border-gray-400" style={{ borderWidth: '1px' }}>項目</th>
              <th className="p-2 text-center border border-gray-400" style={{ borderWidth: '1px' }}>数量</th>
              <th className="p-2 text-right border border-gray-400" style={{ borderWidth: '1px' }}>単価</th>
              <th className="p-2 text-right border border-gray-400" style={{ borderWidth: '1px' }}>金額</th>
            </tr>
          </thead>
          <tbody>
            {/* データ行 */}
            {pageItems.map((group) =>
              group.items.map((item, idx) => (
                <tr key={`${group.lineNo}-${idx}`} className={item.isFirstOfSet ? 'font-medium' : ''}>
                  <td className={`p-2 border border-gray-300 ${!item.isFirstOfSet && group.isSet ? 'pl-6 text-gray-600' : ''}`} style={{ borderWidth: '1px' }}>
                    {item.label}
                  </td>
                  <td className="p-2 text-center border border-gray-300" style={{ borderWidth: '1px' }}>
                    {item.isFirstOfSet || !group.isSet ? (item.quantity > 0 ? item.quantity : '') : ''}
                  </td>
                  <td className="p-2 text-right border border-gray-300 amount-cell" style={{ borderWidth: '1px' }}>
                    {item.isFirstOfSet || !group.isSet ? (item.unitPrice > 0 ? `¥${formatAmount(item.unitPrice)}` : '') : ''}
                  </td>
                  <td className="p-2 text-right border border-gray-300 amount-cell" style={{ borderWidth: '1px' }}>
                    {item.isFirstOfSet || !group.isSet ? (item.amount > 0 ? `¥${formatAmount(item.amount)}` : '') : ''}
                  </td>
                </tr>
              ))
            )}
            {/* 空白行（枠を埋める） */}
            {Array.from({ length: emptyRowCount }).map((_, idx) => (
              <tr key={`empty-${idx}`}>
                <td className="p-2 border border-gray-300" style={{ borderWidth: '1px' }}>&nbsp;</td>
                <td className="p-2 border border-gray-300" style={{ borderWidth: '1px' }}>&nbsp;</td>
                <td className="p-2 border border-gray-300" style={{ borderWidth: '1px' }}>&nbsp;</td>
                <td className="p-2 border border-gray-300" style={{ borderWidth: '1px' }}>&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    };

    // フッター項目の表示判定ヘルパー
    const showFooterItem = (id: string) => activeFooterItems.length === 0 || activeFooterItems.includes(id);

    // ミニマル用フッター
    const renderMinimalFooter = () => (
      <>
        {/* 合計欄 */}
        {(showFooterItem('subtotal') || showFooterItem('tax') || showFooterItem('total')) && (
          <div className="flex justify-end summary-section" style={{ marginBottom: '10px', marginTop: '10px' }}>
            <div style={{ width: '180px' }} className="border border-gray-400">
              {showFooterItem('subtotal') && (
                <div className="flex justify-between px-2 py-1 border-b border-gray-300 invoice-body" style={{ fontSize: '12px' }}>
                  <span>小計</span>
                  <span className="amount-cell">¥{formatAmount(displayAmounts.subtotal)}</span>
                </div>
              )}
              {showFooterItem('tax') && (
                <div className="flex justify-between px-2 py-1 border-b border-gray-300 invoice-body" style={{ fontSize: '12px' }}>
                  <span>消費税(10%)</span>
                  <span className="amount-cell">¥{formatAmount(displayAmounts.tax)}</span>
                </div>
              )}
              {showFooterItem('total') && (
                <div className="flex justify-between px-2 py-1 bg-gray-100 invoice-amount" style={{ fontSize: '14px', fontWeight: 700 }}>
                  <span>合計</span>
                  <span className="amount-cell">¥{formatAmount(displayAmounts.total)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 振込先 */}
        {showFooterItem('bank_info') && companyInfo?.bankName && (
          <div className="border border-gray-300 p-2 invoice-body" style={{ marginBottom: '8px', fontSize: '12px' }}>
            <span className="font-medium">お振込先: </span>
            {companyInfo.bankName} {companyInfo.bankBranch} {companyInfo.accountType} {companyInfo.accountNumber} {companyInfo.accountHolder}
          </div>
        )}

        {/* 備考 */}
        {showFooterItem('remarks') && invoice?.remarks && (
          <div className="border border-gray-300 p-2">
            <div className="invoice-body font-medium" style={{ fontSize: '12px' }}>備考</div>
            <div className="invoice-small" style={{ fontSize: '11px', color: '#666', maxHeight: '48px', overflow: 'hidden', lineHeight: '1.4' }}>
              {invoice.remarks}
            </div>
          </div>
        )}
      </>
    );

    return (
      <InvoicePagesContainer
        pages={paginatedPages}
        renderHeader={renderMinimalHeader}
        renderLineItems={renderMinimalLineItems}
        renderFooter={renderMinimalFooter}
        className="invoice-body"
      />
    );
  }

  // 2. 標準レイアウト（適格請求書対応）- A4最適化
  function StandardLayout() {
    return (
      <div className="a4-page text-xs">
        {/* ヘッダー */}
        <div className="border-2 border-gray-800 mb-2">
          <div className="bg-gray-800 text-white px-2 py-1 text-center">
            <h1 className="text-base font-bold">適格請求書</h1>
          </div>
          <div className="p-2 grid grid-cols-2 gap-2">
            <div>
              <div className="text-[10px] text-gray-500 mb-1">【発行事業者】</div>
              <div className="font-bold">{companyInfo?.companyName}</div>
              <div className="text-[10px] text-gray-600">
                登録番号：T{companyInfo?.taxRegistrationNumber || '未設定'}
              </div>
              <div className="text-[10px] text-gray-600">
                〒{companyInfo?.postalCode} {companyInfo?.prefecture}{companyInfo?.city}{companyInfo?.address}
              </div>
              <div className="text-[10px] text-gray-600">TEL: {companyInfo?.phoneNumber}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-gray-500">No. {invoice?.invoice_number}</div>
              <div className="text-[10px] text-gray-500">{formatDate(invoice?.issue_date || '')}</div>
              <div className="text-base font-bold mt-2">¥{formatAmount(displayAmounts.total)}</div>
              <div className="text-[10px] text-gray-500">（税込）</div>
            </div>
          </div>
        </div>

        {/* 請求先 */}
        <div className="border border-gray-400 mb-2 p-2">
          <div className="text-[10px] text-gray-500">【請求先】</div>
          <div className="font-bold">{customerInfo.name} 様</div>
          <div className="text-[10px] text-gray-600">
            件名: {invoice?.subject_name || invoice?.subject}
            {invoice?.registration_number && ` | 登録番号: ${invoice?.registration_number}`}
          </div>
        </div>

        {/* 明細テーブル */}
        <LineItemsTable headerBg="bg-gray-800 text-white" borderColor="border-gray-400" compact={true} />

        {/* 合計 */}
        <div className="flex justify-end mb-2">
          <div className="w-52 border border-gray-400">
            <div className="flex justify-between px-2 py-1 border-b border-gray-400 bg-gray-100">
              <span>税抜金額</span><span>¥{formatAmount(displayAmounts.subtotal)}</span>
            </div>
            <div className="flex justify-between px-2 py-1 border-b border-gray-400 bg-gray-100">
              <span>消費税(10%)</span><span>¥{formatAmount(displayAmounts.tax)}</span>
            </div>
            <div className="flex justify-between px-2 py-1 bg-blue-100 font-bold">
              <span>税込合計</span><span>¥{formatAmount(displayAmounts.total)}</span>
            </div>
          </div>
        </div>

        {/* 振込先 */}
        {companyInfo?.bankName && (
          <div className="border border-gray-400 mb-2 p-2 bg-yellow-50">
            <div className="text-[10px] font-bold mb-1">【お振込先】</div>
            <div className="text-[10px]">
              {companyInfo.bankName} {companyInfo.bankBranch} {companyInfo.accountType} {companyInfo.accountNumber} {companyInfo.accountHolder}
            </div>
            <div className="text-[10px] text-gray-500 mt-1">※振込手数料はお客様負担でお願いいたします</div>
          </div>
        )}

        {/* 備考 */}
        <div className="border border-gray-300 p-2 mb-2">
          <div className="text-[10px] font-bold mb-1">備考</div>
          <div className="text-[10px] text-gray-600 min-h-[20px]">{invoice?.remarks || ''}</div>
        </div>

        {/* フッター */}
        <div className="text-center text-[10px] text-gray-500 border-t border-gray-300 pt-2">
          本書面は適格請求書（インボイス）として発行されています
        </div>
      </div>
    );
  }

  // 3. モダンレイアウト - A4最適化・青基調
  function ModernLayout() {
    return (
      <div className="a4-page text-xs">
        {/* ヘッダー */}
        <div className="border-b-2 border-blue-600 pb-2 mb-2">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-base font-bold text-blue-600">請 求 書</h1>
              <div className="text-[10px] text-gray-600">
                No. {invoice?.invoice_number} | {formatDate(invoice?.issue_date || '')}
              </div>
            </div>
            <div className="text-right">
              <div className="text-base font-bold text-blue-600">¥{formatAmount(displayAmounts.total)}</div>
              <div className="text-[10px] text-gray-500">（税込）</div>
            </div>
          </div>
        </div>

        {/* 請求先・請求元 */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="bg-gray-50 p-2 rounded">
            <div className="text-[10px] text-gray-500 mb-1">請求先</div>
            <div className="font-bold">{customerInfo.name} 様</div>
            <div className="text-[10px] text-gray-600 mt-1">{invoice?.subject_name || invoice?.subject}</div>
          </div>
          <div className="bg-blue-50 p-2 rounded">
            <div className="text-[10px] text-gray-500 mb-1">請求元</div>
            <div className="font-bold">{companyInfo?.companyName}</div>
            <div className="text-[10px] text-gray-600">
              〒{companyInfo?.postalCode} {companyInfo?.prefecture}{companyInfo?.city}{companyInfo?.address}
            </div>
            <div className="text-[10px] text-gray-600">TEL: {companyInfo?.phoneNumber}</div>
          </div>
        </div>

        {/* 明細テーブル */}
        <LineItemsTable headerBg="bg-blue-600 text-white" borderColor="border-gray-300" compact={true} />

        {/* 合計 */}
        <div className="flex justify-end mb-2">
          <div className="w-48 bg-gray-50 rounded">
            <div className="flex justify-between px-2 py-1 border-b border-gray-200">
              <span>小計</span><span>¥{formatAmount(displayAmounts.subtotal)}</span>
            </div>
            <div className="flex justify-between px-2 py-1 border-b border-gray-200">
              <span>消費税</span><span>¥{formatAmount(displayAmounts.tax)}</span>
            </div>
            <div className="flex justify-between px-2 py-1 font-bold text-blue-600">
              <span>合計</span><span>¥{formatAmount(displayAmounts.total)}</span>
            </div>
          </div>
        </div>

        {/* 振込先 */}
        {companyInfo?.bankName && (
          <div className="bg-blue-50 p-2 rounded mb-2">
            <div className="text-[10px] font-bold mb-1">お振込先</div>
            <div className="text-[10px]">
              {companyInfo.bankName} {companyInfo.bankBranch} {companyInfo.accountType} {companyInfo.accountNumber} {companyInfo.accountHolder}
            </div>
          </div>
        )}

        {/* 備考 */}
        <div className="border border-gray-300 p-2 rounded">
          <div className="text-[10px] font-bold mb-1">備考</div>
          <div className="text-[10px] text-gray-600 min-h-[20px]">{invoice?.remarks || ''}</div>
        </div>
      </div>
    );
  }

  // 4. コンパクトレイアウト - A4最適化・最小余白
  function CompactLayout() {
    return (
      <div className="a4-page text-xs">
        {/* ヘッダー（1行） */}
        <div className="flex justify-between items-center mb-2 pb-1 border-b border-gray-400">
          <div>
            <span className="font-bold">請求書</span>
            <span className="text-gray-600 ml-2">#{invoice?.invoice_number}</span>
            <span className="text-gray-600 ml-2">{formatDate(invoice?.issue_date || '')}</span>
          </div>
          <div className="font-bold">¥{formatAmount(displayAmounts.total)}</div>
        </div>

        {/* 3列情報 */}
        <div className="grid grid-cols-3 gap-2 mb-2 text-[10px]">
          <div className="border border-gray-300 p-1">
            <div className="text-gray-500">請求先</div>
            <div className="font-bold">{customerInfo.name} 様</div>
            <div className="text-gray-600">{invoice?.subject_name || invoice?.subject}</div>
          </div>
          <div className="border border-gray-300 p-1">
            <div className="text-gray-500">請求元</div>
            <div className="font-bold">{companyInfo?.companyName}</div>
            <div className="text-gray-600">TEL: {companyInfo?.phoneNumber}</div>
          </div>
          <div className="border border-gray-300 p-1">
            <div className="text-gray-500">振込先</div>
            <div>{companyInfo?.bankName} {companyInfo?.bankBranch}</div>
            <div>{companyInfo?.accountType} {companyInfo?.accountNumber}</div>
          </div>
        </div>

        {/* 明細テーブル */}
        <LineItemsTable headerBg="bg-gray-200" borderColor="border-gray-400" compact={true} />

        {/* 合計（右寄せ・コンパクト） */}
        <div className="flex justify-end">
          <div className="text-[10px] border border-gray-400">
            <div className="flex justify-between px-2 py-0.5 border-b border-gray-400">
              <span>小計</span><span className="ml-4">¥{formatAmount(displayAmounts.subtotal)}</span>
            </div>
            <div className="flex justify-between px-2 py-0.5 border-b border-gray-400">
              <span>消費税</span><span className="ml-4">¥{formatAmount(displayAmounts.tax)}</span>
            </div>
            <div className="flex justify-between px-2 py-0.5 bg-gray-100 font-bold">
              <span>合計</span><span className="ml-4">¥{formatAmount(displayAmounts.total)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 5. 詳細型レイアウト - A4最適化・情報量多め
  function DetailedLayout() {
    return (
      <div className="a4-page text-xs">
        {/* ヘッダー */}
        <div className="border-2 border-gray-800 mb-2">
          <div className="bg-gray-800 text-white px-2 py-1 text-center">
            <h1 className="text-base font-bold">請 求 書</h1>
          </div>
          <div className="p-2 grid grid-cols-3 gap-2">
            <div>
              <div className="text-[10px] text-gray-500 border-b mb-1">請求書情報</div>
              <div className="text-[10px]">No. {invoice?.invoice_number}</div>
              <div className="text-[10px]">{formatDate(invoice?.issue_date || '')}</div>
              {invoice?.order_number && <div className="text-[10px]">注文: {invoice?.order_number}</div>}
            </div>
            <div>
              <div className="text-[10px] text-gray-500 border-b mb-1">請求先</div>
              <div className="font-bold">{customerInfo.name} 様</div>
              <div className="text-[10px] text-gray-600">{invoice?.subject_name}</div>
              {invoice?.registration_number && <div className="text-[10px] text-gray-500">登録: {invoice?.registration_number}</div>}
            </div>
            <div>
              <div className="text-[10px] text-gray-500 border-b mb-1">合計金額</div>
              <div className="text-base font-bold text-center bg-gray-100 rounded py-1">
                ¥{formatAmount(displayAmounts.total)}
              </div>
            </div>
          </div>
        </div>

        {/* 請求元・振込先 */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="border border-gray-300 p-2">
            <div className="text-[10px] text-gray-500 border-b mb-1">請求元</div>
            <div className="font-bold">{companyInfo?.companyName}</div>
            <div className="text-[10px] text-gray-600">
              〒{companyInfo?.postalCode} {companyInfo?.prefecture}{companyInfo?.city}{companyInfo?.address}
            </div>
            <div className="text-[10px] text-gray-600">TEL: {companyInfo?.phoneNumber}</div>
          </div>
          <div className="border border-gray-300 p-2 bg-yellow-50">
            <div className="text-[10px] text-gray-500 border-b mb-1">お振込先</div>
            <div className="text-[10px]">
              {companyInfo?.bankName} {companyInfo?.bankBranch} {companyInfo?.accountType} {companyInfo?.accountNumber}
            </div>
            <div className="text-[10px]">名義: {companyInfo?.accountHolder}</div>
          </div>
        </div>

        {/* 明細テーブル */}
        <LineItemsTable headerBg="bg-gray-800 text-white" borderColor="border-gray-300" compact={true} />

        {/* 合計 */}
        <div className="flex justify-end mb-2">
          <div className="w-48 border-2 border-gray-800">
            <div className="flex justify-between px-2 py-1 border-b border-gray-300">
              <span>小計</span><span>¥{formatAmount(displayAmounts.subtotal)}</span>
            </div>
            <div className="flex justify-between px-2 py-1 border-b border-gray-300">
              <span>消費税(10%)</span><span>¥{formatAmount(displayAmounts.tax)}</span>
            </div>
            <div className="flex justify-between px-2 py-1 bg-gray-100 font-bold">
              <span>合計</span><span>¥{formatAmount(displayAmounts.total)}</span>
            </div>
          </div>
        </div>

        {/* 備考 */}
        <div className="border border-gray-300 p-2">
          <div className="text-[10px] font-bold mb-1">備考</div>
          <div className="text-[10px] text-gray-600 min-h-[20px]">{invoice?.remarks || ''}</div>
        </div>
      </div>
    );
  }

  // 6. グラデーションレイアウト - A4最適化・紫基調
  function GradientLayout() {
    return (
      <div className="a4-page text-xs">
        <style jsx>{`
          .gradient-header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        `}</style>

        {/* ヘッダー */}
        <div className="gradient-header text-white p-2 mb-2 rounded">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-base font-bold">請 求 書</h1>
              <div className="text-[10px] opacity-90">
                No. {invoice?.invoice_number} | {formatDate(invoice?.issue_date || '')}
              </div>
            </div>
            <div className="text-right">
              <div className="text-base font-bold">¥{formatAmount(displayAmounts.total)}</div>
              <div className="text-[10px] opacity-80">（税込）</div>
            </div>
          </div>
        </div>

        {/* 請求先・請求元 */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="bg-purple-50 p-2 rounded">
            <div className="text-[10px] text-purple-600 mb-1">請求先</div>
            <div className="font-bold">{customerInfo.name} 様</div>
            <div className="text-[10px] text-gray-600">{invoice?.subject_name || invoice?.subject}</div>
          </div>
          <div className="bg-indigo-50 p-2 rounded">
            <div className="text-[10px] text-indigo-600 mb-1">請求元</div>
            <div className="font-bold">{companyInfo?.companyName}</div>
            <div className="text-[10px] text-gray-600">
              〒{companyInfo?.postalCode} {companyInfo?.prefecture}{companyInfo?.city}{companyInfo?.address}
            </div>
            <div className="text-[10px] text-gray-600">TEL: {companyInfo?.phoneNumber}</div>
          </div>
        </div>

        {/* 明細テーブル */}
        <LineItemsTable headerBg="gradient-header text-white" borderColor="border-gray-200" compact={true} />

        {/* 合計 */}
        <div className="flex justify-end mb-2">
          <div className="w-48 bg-purple-50 rounded">
            <div className="flex justify-between px-2 py-1 border-b border-purple-100">
              <span>小計</span><span>¥{formatAmount(displayAmounts.subtotal)}</span>
            </div>
            <div className="flex justify-between px-2 py-1 border-b border-purple-100">
              <span>消費税</span><span>¥{formatAmount(displayAmounts.tax)}</span>
            </div>
            <div className="flex justify-between px-2 py-1 font-bold text-purple-800">
              <span>合計</span><span>¥{formatAmount(displayAmounts.total)}</span>
            </div>
          </div>
        </div>

        {/* 振込先 */}
        {companyInfo?.bankName && (
          <div className="gradient-header text-white p-2 rounded mb-2">
            <div className="text-[10px] font-bold mb-1">お振込先</div>
            <div className="text-[10px]">
              {companyInfo.bankName} {companyInfo.bankBranch} {companyInfo.accountType} {companyInfo.accountNumber} {companyInfo.accountHolder}
            </div>
          </div>
        )}

        {/* 備考 */}
        <div className="border border-gray-300 p-2 rounded">
          <div className="text-[10px] font-bold mb-1">備考</div>
          <div className="text-[10px] text-gray-600 min-h-[20px]">{invoice?.remarks || ''}</div>
        </div>
      </div>
    );
  }

  // 7. ジオメトリックレイアウト - A4最適化・ダーク基調
  function GeometricLayout() {
    return (
      <div className="a4-page text-xs">
        <style jsx>{`
          .geometric-accent { background: linear-gradient(45deg, #1e293b, #334155); }
        `}</style>

        {/* ヘッダー */}
        <div className="geometric-accent text-white p-2 mb-2 rounded">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-base font-bold">請 求 書</h1>
              <div className="text-[10px] opacity-90">
                No. {invoice?.invoice_number} | {formatDate(invoice?.issue_date || '')}
              </div>
            </div>
            <div className="text-right">
              <div className="text-base font-bold">¥{formatAmount(displayAmounts.total)}</div>
              <div className="text-[10px] opacity-80">（税込）</div>
            </div>
          </div>
        </div>

        {/* 請求先・請求元 */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="bg-gray-50 border-l-4 border-gray-800 p-2">
            <div className="text-[10px] text-gray-500 mb-1">請求先</div>
            <div className="font-bold">{customerInfo.name} 様</div>
            <div className="text-[10px] text-gray-600">{invoice?.subject_name || invoice?.subject}</div>
          </div>
          <div className="bg-gray-50 border-l-4 border-gray-800 p-2">
            <div className="text-[10px] text-gray-500 mb-1">請求元</div>
            <div className="font-bold">{companyInfo?.companyName}</div>
            <div className="text-[10px] text-gray-600">
              〒{companyInfo?.postalCode} {companyInfo?.prefecture}{companyInfo?.city}{companyInfo?.address}
            </div>
            <div className="text-[10px] text-gray-600">TEL: {companyInfo?.phoneNumber}</div>
          </div>
        </div>

        {/* 明細テーブル */}
        <LineItemsTable headerBg="geometric-accent text-white" borderColor="border-gray-300" compact={true} />

        {/* 合計 */}
        <div className="flex justify-end mb-2">
          <div className="w-48 border-2 border-gray-800">
            <div className="flex justify-between px-2 py-1 border-b border-gray-300">
              <span>小計</span><span>¥{formatAmount(displayAmounts.subtotal)}</span>
            </div>
            <div className="flex justify-between px-2 py-1 border-b border-gray-300">
              <span>消費税</span><span>¥{formatAmount(displayAmounts.tax)}</span>
            </div>
            <div className="flex justify-between px-2 py-1 geometric-accent text-white font-bold">
              <span>合計</span><span>¥{formatAmount(displayAmounts.total)}</span>
            </div>
          </div>
        </div>

        {/* 振込先 */}
        {companyInfo?.bankName && (
          <div className="bg-gray-100 border-l-4 border-gray-800 p-2 mb-2">
            <div className="text-[10px] font-bold mb-1">お振込先</div>
            <div className="text-[10px]">
              {companyInfo.bankName} {companyInfo.bankBranch} {companyInfo.accountType} {companyInfo.accountNumber} {companyInfo.accountHolder}
            </div>
          </div>
        )}

        {/* 備考 */}
        <div className="border border-gray-300 p-2">
          <div className="text-[10px] font-bold mb-1">備考</div>
          <div className="text-[10px] text-gray-600 min-h-[20px]">{invoice?.remarks || ''}</div>
        </div>
      </div>
    );
  }

  // 8. コーポレートレイアウト - A4最適化・青基調
  function CorporateLayout() {
    return (
      <div className="a4-page text-xs">
        <style jsx>{`
          .corporate-primary { background: #1e3a8a; }
          .corporate-light { background: #dbeafe; }
        `}</style>

        {/* ヘッダー */}
        <div className="corporate-primary text-white p-2 mb-2 rounded">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-base font-bold">請 求 書</h1>
              <div className="text-[10px] opacity-90">
                No. {invoice?.invoice_number} | {formatDate(invoice?.issue_date || '')}
              </div>
            </div>
            <div className="text-right">
              <div className="text-base font-bold">¥{formatAmount(displayAmounts.total)}</div>
              <div className="text-[10px] opacity-80">（税込）</div>
            </div>
          </div>
        </div>

        {/* 請求先・請求元 */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="corporate-light p-2 rounded">
            <div className="text-[10px] text-blue-600 mb-1">請求先</div>
            <div className="font-bold">{customerInfo.name} 様</div>
            <div className="text-[10px] text-gray-600">{invoice?.subject_name || invoice?.subject}</div>
          </div>
          <div className="corporate-light p-2 rounded">
            <div className="text-[10px] text-blue-600 mb-1">請求元</div>
            <div className="font-bold">{companyInfo?.companyName}</div>
            <div className="text-[10px] text-gray-600">
              〒{companyInfo?.postalCode} {companyInfo?.prefecture}{companyInfo?.city}{companyInfo?.address}
            </div>
            <div className="text-[10px] text-gray-600">TEL: {companyInfo?.phoneNumber}</div>
          </div>
        </div>

        {/* 明細テーブル */}
        <LineItemsTable headerBg="corporate-primary text-white" borderColor="border-gray-300" compact={true} />

        {/* 合計 */}
        <div className="flex justify-end mb-2">
          <div className="w-48 border border-blue-200 rounded">
            <div className="flex justify-between px-2 py-1 border-b border-blue-100 corporate-light">
              <span>小計</span><span>¥{formatAmount(displayAmounts.subtotal)}</span>
            </div>
            <div className="flex justify-between px-2 py-1 border-b border-blue-100 corporate-light">
              <span>消費税</span><span>¥{formatAmount(displayAmounts.tax)}</span>
            </div>
            <div className="flex justify-between px-2 py-1 corporate-primary text-white font-bold">
              <span>合計</span><span>¥{formatAmount(displayAmounts.total)}</span>
            </div>
          </div>
        </div>

        {/* 振込先 */}
        {companyInfo?.bankName && (
          <div className="corporate-light p-2 rounded mb-2">
            <div className="text-[10px] font-bold text-blue-800 mb-1">お振込先</div>
            <div className="text-[10px]">
              {companyInfo.bankName} {companyInfo.bankBranch} {companyInfo.accountType} {companyInfo.accountNumber} {companyInfo.accountHolder}
            </div>
          </div>
        )}

        {/* 備考 */}
        <div className="border border-gray-300 p-2 rounded">
          <div className="text-[10px] font-bold mb-1">備考</div>
          <div className="text-[10px] text-gray-600 min-h-[20px]">{invoice?.remarks || ''}</div>
        </div>
      </div>
    );
  }

  // 9. 基本レイアウト - A4最適化・シンプル
  function BasicLayout() {
    return (
      <div className="a4-page text-xs">
        {/* ヘッダー */}
        <div className="text-center mb-2 pb-2 border-b-2 border-gray-400">
          <h1 className="text-base font-bold">請 求 書</h1>
          <div className="text-[10px] text-gray-600">
            No. {invoice?.invoice_number} | {formatDate(invoice?.issue_date || '')}
          </div>
        </div>

        {/* 請求先・請求元・合計 */}
        <div className="grid grid-cols-3 gap-2 mb-2">
          <div className="border border-gray-400 p-2">
            <div className="text-[10px] text-gray-500">請求先</div>
            <div className="font-bold">{customerInfo.name} 様</div>
            <div className="text-[10px] text-gray-600">{invoice?.subject_name || invoice?.subject}</div>
          </div>
          <div className="border border-gray-400 p-2">
            <div className="text-[10px] text-gray-500">請求元</div>
            <div className="font-bold">{companyInfo?.companyName}</div>
            <div className="text-[10px] text-gray-600">TEL: {companyInfo?.phoneNumber}</div>
          </div>
          <div className="border border-gray-400 p-2 bg-gray-50 text-center">
            <div className="text-[10px] text-gray-500">合計金額</div>
            <div className="text-base font-bold">¥{formatAmount(displayAmounts.total)}</div>
          </div>
        </div>

        {/* 明細テーブル */}
        <LineItemsTable headerBg="bg-gray-100" borderColor="border-gray-400" compact={true} />

        {/* 合計 */}
        <div className="flex justify-end mb-2">
          <div className="w-48 border border-gray-400">
            <div className="flex justify-between px-2 py-1 border-b border-gray-400">
              <span>小計</span><span>¥{formatAmount(displayAmounts.subtotal)}</span>
            </div>
            <div className="flex justify-between px-2 py-1 border-b border-gray-400">
              <span>消費税</span><span>¥{formatAmount(displayAmounts.tax)}</span>
            </div>
            <div className="flex justify-between px-2 py-1 bg-gray-100 font-bold">
              <span>合計</span><span>¥{formatAmount(displayAmounts.total)}</span>
            </div>
          </div>
        </div>

        {/* 振込先 */}
        {companyInfo?.bankName && (
          <div className="border border-gray-400 p-2 mb-2">
            <div className="text-[10px] font-bold mb-1">お振込先</div>
            <div className="text-[10px]">
              {companyInfo.bankName} {companyInfo.bankBranch} {companyInfo.accountType} {companyInfo.accountNumber} {companyInfo.accountHolder}
            </div>
          </div>
        )}

        {/* 備考 */}
        <div className="border border-gray-300 p-2">
          <div className="text-[10px] font-bold mb-1">備考</div>
          <div className="text-[10px] text-gray-600 min-h-[20px]">{invoice?.remarks || ''}</div>
        </div>
      </div>
    );
  }

  // 10. 伝統的レイアウト - A4最適化・日本式
  function TraditionalLayout() {
    return (
      <div className="a4-page text-xs">
        {/* ヘッダー */}
        <div className="border-2 border-gray-900 mb-2">
          <div className="bg-gray-900 text-white px-2 py-1 text-center">
            <h1 className="text-base font-bold">御 請 求 書</h1>
          </div>
          <div className="p-2 grid grid-cols-2 gap-2">
            <div>
              <div className="text-[10px] text-gray-500">請求元</div>
              <div className="font-bold">{companyInfo?.companyName}</div>
              <div className="text-[10px] text-gray-600">
                〒{companyInfo?.postalCode} {companyInfo?.prefecture}{companyInfo?.city}{companyInfo?.address}
              </div>
              <div className="text-[10px] text-gray-600">TEL: {companyInfo?.phoneNumber}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-gray-500">No. {invoice?.invoice_number}</div>
              <div className="text-[10px] text-gray-500">{formatDate(invoice?.issue_date || '')}</div>
              <div className="text-base font-bold mt-1">¥{formatAmount(displayAmounts.total)}</div>
            </div>
          </div>
        </div>

        {/* 請求先 */}
        <div className="border-l-4 border-gray-900 pl-2 mb-2">
          <div className="font-bold">{customerInfo.name} 様</div>
          <div className="text-[10px] text-gray-600">{invoice?.subject_name || invoice?.subject}</div>
        </div>

        {/* 明細テーブル */}
        <LineItemsTable headerBg="bg-gray-100" borderColor="border-gray-300" compact={true} />

        {/* 合計 */}
        <div className="flex justify-end mb-2">
          <div className="w-48 border-2 border-gray-900">
            <div className="flex justify-between px-2 py-1 border-b border-gray-300">
              <span>小計</span><span>¥{formatAmount(displayAmounts.subtotal)}</span>
            </div>
            <div className="flex justify-between px-2 py-1 border-b border-gray-300">
              <span>消費税</span><span>¥{formatAmount(displayAmounts.tax)}</span>
            </div>
            <div className="flex justify-between px-2 py-1 bg-gray-900 text-white font-bold">
              <span>合計</span><span>¥{formatAmount(displayAmounts.total)}</span>
            </div>
          </div>
        </div>

        {/* 振込先 */}
        {companyInfo?.bankName && (
          <div className="border-2 border-gray-900 mb-2">
            <div className="bg-gray-100 px-2 py-1 border-b border-gray-900">
              <span className="text-[10px] font-bold">お振込先</span>
            </div>
            <div className="p-2 text-[10px]">
              {companyInfo.bankName} {companyInfo.bankBranch} {companyInfo.accountType} {companyInfo.accountNumber} {companyInfo.accountHolder}
            </div>
          </div>
        )}

        {/* 備考 */}
        <div className="border border-gray-300 p-2">
          <div className="text-[10px] font-bold mb-1">備考</div>
          <div className="text-[10px] text-gray-600 min-h-[20px]">{invoice?.remarks || ''}</div>
        </div>
      </div>
    );
  }

  // 11. クラシックレイアウト - 白黒のオーソドックスデザイン（A4対応）
  function ClassicLayout() {
    return (
      <div className="a4-page text-xs">
        {/* ヘッダー */}
        <div className="border-b-2 border-gray-800 pb-2 mb-2">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-base font-serif font-bold text-gray-900">請 求 書</h1>
              <div className="text-[10px] text-gray-600">
                No. {invoice?.invoice_number} | {formatDate(invoice?.issue_date || '')}
              </div>
            </div>
            <div className="text-right border border-gray-800 p-2">
              <div className="text-base font-bold">¥{formatAmount(displayAmounts.total)}</div>
              <div className="text-[10px] text-gray-500">（税込）</div>
            </div>
          </div>
        </div>

        {/* 請求先・請求元 */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="border border-gray-600 p-2">
            <div className="text-[10px] text-gray-500 mb-1 border-b border-gray-300 pb-1">請求先</div>
            <div className="font-bold">{customerInfo.name} 様</div>
            <div className="text-[10px] text-gray-600">{invoice?.subject_name || invoice?.subject}</div>
          </div>
          <div className="border border-gray-600 p-2">
            <div className="text-[10px] text-gray-500 mb-1 border-b border-gray-300 pb-1">請求元</div>
            <div className="font-bold">{companyInfo?.companyName}</div>
            <div className="text-[10px] text-gray-600">
              〒{companyInfo?.postalCode} {companyInfo?.prefecture}{companyInfo?.city}{companyInfo?.address}
            </div>
            <div className="text-[10px] text-gray-600">TEL: {companyInfo?.phoneNumber}</div>
          </div>
        </div>

        {/* 明細テーブル */}
        <LineItemsTable headerBg="bg-white border-b-2 border-gray-800" borderColor="border-gray-400" compact={true} />

        {/* 合計 */}
        <div className="flex justify-end mb-2">
          <div className="w-48 border-2 border-gray-800">
            <div className="flex justify-between px-2 py-1 border-b border-gray-400">
              <span>小計</span><span>¥{formatAmount(displayAmounts.subtotal)}</span>
            </div>
            <div className="flex justify-between px-2 py-1 border-b border-gray-400">
              <span>消費税</span><span>¥{formatAmount(displayAmounts.tax)}</span>
            </div>
            <div className="flex justify-between px-2 py-1 font-bold">
              <span>合計</span><span>¥{formatAmount(displayAmounts.total)}</span>
            </div>
          </div>
        </div>

        {/* 振込先 */}
        {companyInfo?.bankName && (
          <div className="border border-gray-600 p-2 mb-2">
            <div className="text-[10px] font-bold mb-1">お振込先</div>
            <div className="text-[10px]">
              {companyInfo.bankName} {companyInfo.bankBranch} {companyInfo.accountType} {companyInfo.accountNumber} {companyInfo.accountHolder}
            </div>
          </div>
        )}

        {/* 備考 */}
        <div className="border border-gray-600 p-2">
          <div className="text-[10px] font-bold mb-1">備考</div>
          <div className="text-[10px] text-gray-600 min-h-[20px]">{invoice?.remarks || ''}</div>
        </div>
      </div>
    );
  }

  // 12. プレーンレイアウト - 装飾なし・実用重視（A4対応）
  function PlainLayout() {
    return (
      <div className="a4-page text-xs">
        {/* ヘッダー */}
        <div className="border-b border-gray-400 pb-2 mb-2">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-base font-bold">請求書</h1>
              <div className="text-[10px] text-gray-600">
                No. {invoice?.invoice_number} | {formatDate(invoice?.issue_date || '')}
              </div>
            </div>
            <div className="text-right">
              <div className="text-base font-bold">¥{formatAmount(displayAmounts.total)}</div>
              <div className="text-[10px] text-gray-500">（税込）</div>
            </div>
          </div>
        </div>

        {/* 請求先・請求元 */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>
            <div className="text-[10px] text-gray-500 mb-1">請求先</div>
            <div className="font-bold">{customerInfo.name} 様</div>
            <div className="text-[10px] text-gray-600">{invoice?.subject_name || invoice?.subject}</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 mb-1">請求元</div>
            <div className="font-bold">{companyInfo?.companyName}</div>
            <div className="text-[10px] text-gray-600">
              〒{companyInfo?.postalCode} {companyInfo?.prefecture}{companyInfo?.city}{companyInfo?.address}
            </div>
            <div className="text-[10px] text-gray-600">TEL: {companyInfo?.phoneNumber}</div>
          </div>
        </div>

        {/* 明細テーブル */}
        <LineItemsTable headerBg="border-b border-gray-400" borderColor="border-gray-200" compact={true} />

        {/* 合計 */}
        <div className="flex justify-end mb-2">
          <div className="w-48 border border-gray-300">
            <div className="flex justify-between px-2 py-1 border-b border-gray-200">
              <span>小計</span><span>¥{formatAmount(displayAmounts.subtotal)}</span>
            </div>
            <div className="flex justify-between px-2 py-1 border-b border-gray-200">
              <span>消費税</span><span>¥{formatAmount(displayAmounts.tax)}</span>
            </div>
            <div className="flex justify-between px-2 py-1 font-bold bg-gray-50">
              <span>合計</span><span>¥{formatAmount(displayAmounts.total)}</span>
            </div>
          </div>
        </div>

        {/* 振込先 */}
        {companyInfo?.bankName && (
          <div className="border-t border-gray-200 pt-2 mb-2">
            <div className="text-[10px] font-bold mb-1">お振込先</div>
            <div className="text-[10px]">
              {companyInfo.bankName} {companyInfo.bankBranch} {companyInfo.accountType} {companyInfo.accountNumber} {companyInfo.accountHolder}
            </div>
          </div>
        )}

        {/* 備考 */}
        <div className="border-t border-gray-200 pt-2">
          <div className="text-[10px] font-bold mb-1">備考</div>
          <div className="text-[10px] text-gray-600 min-h-[20px]">{invoice?.remarks || ''}</div>
        </div>
      </div>
    );
  }

  // 13. 多明細レイアウト - A4ページ区切り対応
  function MultilineLayout() {
    // 明細を全行に展開（セットの場合は複数行になる）
    const flattenedItems: Array<{
      lineNo: number;
      label: string;
      quantity: number;
      unitPrice: number;
      amount: number;
      isSetHeader: boolean;
      isSetItem: boolean;
    }> = [];

    groupedLineItems.forEach((group) => {
      group.items.forEach((item, idx) => {
        flattenedItems.push({
          lineNo: group.lineNo,
          label: item.label,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          amount: item.amount,
          isSetHeader: group.isSet && idx === 0,
          isSetItem: group.isSet && idx > 0
        });
      });
    });

    // 1ページに表示する行数（A4に収まる想定）
    const LINES_PER_PAGE_FIRST = 25; // 1ページ目（ヘッダー情報あり）
    const LINES_PER_PAGE_CONTINUE = 35; // 2ページ目以降

    // ページ分割
    const pages: Array<typeof flattenedItems> = [];
    let remaining = [...flattenedItems];
    let isFirstPage = true;

    while (remaining.length > 0) {
      const linesForThisPage = isFirstPage ? LINES_PER_PAGE_FIRST : LINES_PER_PAGE_CONTINUE;
      pages.push(remaining.slice(0, linesForThisPage));
      remaining = remaining.slice(linesForThisPage);
      isFirstPage = false;
    }

    // ページが空なら1ページ追加
    if (pages.length === 0) {
      pages.push([]);
    }

    const totalPages = pages.length;

    return (
      <>
        {pages.map((pageItems, pageIndex) => (
          <div key={pageIndex} className="a4-page">
            {/* 1ページ目のヘッダー */}
            {pageIndex === 0 && (
              <>
                {/* ヘッダー */}
                <div className="flex justify-between items-start mb-2 pb-2 border-b-2 border-gray-800">
                  <div>
                    <h1 className="text-base font-bold">請求書</h1>
                    <div className="text-xs text-gray-600">No. {invoice?.invoice_number}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-600">発行日: {formatDate(invoice?.issue_date || '')}</div>
                    <div className="text-base font-bold mt-1">¥{formatAmount(displayAmounts.total)}</div>
                  </div>
                </div>

                {/* 2列情報 */}
                <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
                  <div className="border border-gray-300 p-2 rounded">
                    <div className="font-bold text-gray-600 mb-1">請求先</div>
                    <div className="font-medium">{customerInfo.name}</div>
                    {customerInfo.company && <div className="text-gray-600">{customerInfo.company}</div>}
                    <div className="text-gray-600 mt-1">件名: {invoice?.subject_name || invoice?.subject || '-'}</div>
                  </div>

                  <div className="border border-gray-300 p-2 rounded">
                    <div className="font-bold text-gray-600 mb-1">発行者</div>
                    <div className="font-medium">{companyInfo?.companyName}</div>
                    <div className="text-gray-600">〒{companyInfo?.postalCode}</div>
                    <div className="text-gray-600">{companyInfo?.prefecture}{companyInfo?.city}{companyInfo?.address}</div>
                    <div className="text-gray-600">Tel: {companyInfo?.phoneNumber}</div>
                  </div>
                </div>
              </>
            )}

            {/* 2ページ目以降のミニヘッダー */}
            {pageIndex > 0 && (
              <div className="flex justify-between items-center mb-2 pb-1 border-b border-gray-400 text-xs text-gray-600">
                <div>請求書 No. {invoice?.invoice_number}（続き）</div>
                <div>ページ {pageIndex + 1} / {totalPages}</div>
              </div>
            )}

            {/* 明細テーブル */}
            <table className="w-full text-xs mb-2">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-1 py-1 text-left border border-gray-300 w-8">No</th>
                  <th className="px-1 py-1 text-left border border-gray-300">作業内容</th>
                  <th className="px-1 py-1 text-center border border-gray-300 w-10">数量</th>
                  <th className="px-1 py-1 text-right border border-gray-300 w-16">単価</th>
                  <th className="px-1 py-1 text-right border border-gray-300 w-18">金額</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((item, idx) => (
                  <tr key={idx}>
                    <td className="px-1 py-0.5 border border-gray-300 text-center text-gray-500">
                      {!item.isSetItem ? item.lineNo : ''}
                    </td>
                    <td className="px-1 py-0.5 border border-gray-300">
                      <div className={item.isSetItem ? 'pl-3' : ''}>
                        {item.label}
                      </div>
                    </td>
                    <td className="px-1 py-0.5 border border-gray-300 text-center">
                      {item.quantity > 0 ? item.quantity : ''}
                    </td>
                    <td className="px-1 py-0.5 border border-gray-300 text-right">
                      {item.unitPrice > 0 ? `¥${formatAmount(item.unitPrice)}` : ''}
                    </td>
                    <td className="px-1 py-0.5 border border-gray-300 text-right font-medium">
                      {item.amount > 0 ? `¥${formatAmount(item.amount)}` : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 最終ページのみ合計・振込先表示 */}
            {pageIndex === totalPages - 1 && (
              <>
                <div className="grid grid-cols-2 gap-2 text-xs mt-auto">
                  {/* 振込先 */}
                  {companyInfo?.bankName && (
                    <div className="border border-gray-300 p-2 rounded">
                      <div className="font-bold text-gray-600 mb-1">お振込先</div>
                      <div>{companyInfo.bankName} {companyInfo.bankBranch}</div>
                      <div>{companyInfo.accountType} {companyInfo.accountNumber}</div>
                      <div>名義: {companyInfo.accountHolder}</div>
                    </div>
                  )}

                  {/* 金額集計 */}
                  <div className="border border-gray-300 p-2 rounded">
                    <div className="flex justify-between mb-1">
                      <span>小計</span>
                      <span>¥{formatAmount(displayAmounts.subtotal)}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span>消費税 (10%)</span>
                      <span>¥{formatAmount(displayAmounts.tax)}</span>
                    </div>
                    <div className="flex justify-between font-bold border-t border-gray-300 pt-1">
                      <span>合計</span>
                      <span>¥{formatAmount(displayAmounts.total)}</span>
                    </div>
                  </div>
                </div>

                {/* 備考欄（必須表示） */}
                <div className="mt-2 text-xs border-t border-gray-300 pt-2">
                  <div className="font-bold text-gray-600 mb-1">備考:</div>
                  <div className="text-gray-600 min-h-[20px] border border-gray-200 p-1 rounded bg-gray-50">
                    {invoice?.remarks || ''}
                  </div>
                </div>
              </>
            )}

            {/* ページ番号（1ページ目） */}
            {pageIndex === 0 && totalPages > 1 && (
              <div className="text-right text-xs text-gray-500 mt-auto pt-2">
                ページ {pageIndex + 1} / {totalPages}
              </div>
            )}
          </div>
        ))}
      </>
    );
  }
}