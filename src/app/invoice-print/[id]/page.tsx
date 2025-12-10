'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Printer, Download, ArrowLeft, Home, FileText, Layout, Grid, Briefcase } from 'lucide-react';
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

  // 共通明細テーブルコンポーネント（全レイアウトで使用）
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
    <table className="w-full text-sm">
      <thead>
        <tr className={headerBg}>
          <th className={`px-2 py-2 text-left border ${borderColor} ${headerText} font-medium`}>作業内容</th>
          <th className={`px-2 py-2 text-center border ${borderColor} ${headerText} font-medium w-14`}>数量</th>
          <th className={`px-2 py-2 text-right border ${borderColor} ${headerText} font-medium w-20`}>単価</th>
          <th className={`px-2 py-2 text-right border ${borderColor} ${headerText} font-medium w-20`}>金額</th>
        </tr>
      </thead>
      <tbody>
        {groupedLineItems.map((group) => (
          group.items.map((item, itemIdx) => (
            <tr key={`${group.lineNo}-${itemIdx}`} className={itemIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className={`px-2 ${compact ? 'py-1' : 'py-2'} border ${borderColor}`}>
                <div className={!item.isFirstOfSet && group.isSet ? 'pl-4 text-gray-600' : 'font-medium'}>
                  {!item.isFirstOfSet && group.isSet ? `・${item.label}` : item.label}
                </div>
              </td>
              <td className={`px-2 ${compact ? 'py-1' : 'py-2'} text-center border ${borderColor}`}>
                {item.quantity > 0 ? item.quantity : ''}
              </td>
              <td className={`px-2 ${compact ? 'py-1' : 'py-2'} text-right border ${borderColor}`}>
                {item.unitPrice > 0 ? `¥${formatAmount(item.unitPrice)}` : ''}
              </td>
              <td className={`px-2 ${compact ? 'py-1' : 'py-2'} text-right font-medium border ${borderColor}`}>
                {item.amount > 0 ? `¥${formatAmount(item.amount)}` : ''}
              </td>
            </tr>
          ))
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

  // タブコンポーネント
  const TabSelector = () => (
    <div className="mb-6 print:hidden">
      <h3 className="text-lg font-semibold mb-3 text-gray-700">請求書レイアウト選択</h3>
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

      {/* 出力形式選択（修正伝票がある場合のみ表示） */}
      {(invoice?.invoice_type === 'red' || invoice?.invoice_type === 'black' || relatedInvoices.length > 1) && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="text-md font-semibold mb-2 text-yellow-800">
            ⚠️ 修正履歴あり - 出力形式を選択
          </h4>
          <p className="text-sm text-yellow-700 mb-3">
            この請求書には修正履歴があります。印刷する金額の形式を選択してください。
          </p>
          <div className="flex flex-wrap gap-2">
            {outputFormatOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setOutputFormat(option.id)}
                className={`px-4 py-2 rounded-lg border transition-all ${
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

  return (
    <>
      {/* 印刷用CSSスタイル - 全レイアウトA4ページ対応 */}
      <style jsx global>{`
        @media print {
          body { margin: 0; padding: 0; font-family: 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', sans-serif; }
          .no-print { display: none !important; }
          .a4-print-container {
            width: auto;
            margin: 0;
            padding: 0;
          }
          .a4-page, .print-container {
            width: 210mm;
            min-height: 297mm;
            padding: 12mm 15mm;
            box-sizing: border-box;
            page-break-after: always;
            background: white;
          }
          .a4-page:last-child, .print-container:last-child {
            page-break-after: auto;
          }
          .page-break { page-break-after: always; }
          .avoid-break { page-break-inside: avoid; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }
        }
        @media screen {
          .a4-print-container {
            padding: 20px;
            background: #e5e7eb;
          }
          .a4-page, .print-container {
            width: 210mm;
            min-height: 297mm;
            padding: 12mm 15mm;
            box-sizing: border-box;
            background: white;
            margin: 20px auto;
            box-shadow: 0 2px 10px rgba(0,0,0,0.15);
            border: 1px solid #ccc;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gray-100">
        {/* ツールバー（印刷時非表示） */}
        <div className="no-print bg-white border-b sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-800">請求書印刷</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 font-medium"
              >
                <Printer size={20} />
                印刷
              </button>
              <button
                onClick={handlePDF}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 font-medium"
              >
                <Download size={20} />
                PDF
              </button>
              <button
                onClick={() => router.back()}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2 font-medium"
              >
                <ArrowLeft size={20} />
                戻る
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

  // 1. ミニマル・クリーンデザイン
  function MinimalLayout() {
    return (
      <div className="a4-page">
        {/* ミニマルヘッダー */}
        <div className="border-b border-gray-300 pb-8 mb-8">
          <div className="flex justify-between items-start">
            <div className="w-2/3">
              <h1 className="text-4xl font-thin text-gray-900 mb-2">INVOICE</h1>
              <div className="w-16 h-0.5 bg-gray-900 mb-6"></div>
              <div className="space-y-1 text-sm text-gray-600">
                <div><strong>Invoice #:</strong> {invoice?.invoice_number}</div>
                <div><strong>Date:</strong> {formatDate(invoice?.issue_date || '')}</div>
              </div>
            </div>
            <div className="w-1/3 text-right">
              <div className="text-3xl font-light text-gray-900 mb-2">¥{formatAmount(displayAmounts.total)}</div>
              <div className="text-sm text-gray-500">Total Amount</div>
            </div>
          </div>
        </div>

        {/* ミニマル情報セクション */}
        <div className="grid grid-cols-2 gap-12 mb-12">
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Bill To</h2>
            <div className="space-y-2">
              <div className="text-xl font-medium text-gray-900">{customerInfo.name}</div>
              {customerInfo.company && <div className="text-gray-600">{customerInfo.company}</div>}
              <div className="text-sm text-gray-500 mt-4">
                <div><strong>Subject:</strong> {invoice?.subject_name || invoice?.subject || 'Service'}</div>
                {invoice?.registration_number && <div><strong>Reg. No:</strong> {invoice?.registration_number}</div>}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">From</h2>
            <div className="space-y-2">
              <div className="text-xl font-medium text-gray-900">{companyInfo?.companyName}</div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>{companyInfo?.postalCode}</div>
                <div>
                  {[companyInfo?.prefecture, companyInfo?.city, companyInfo?.address]
                    .filter(Boolean)
                    .join(' ')}
                </div>
                <div>{companyInfo?.phoneNumber}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ミニマルテーブル - groupedLineItems使用 */}
        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left py-3 text-sm font-medium text-gray-900">Description</th>
                <th className="text-center py-3 text-sm font-medium text-gray-900 w-16">Qty</th>
                <th className="text-right py-3 text-sm font-medium text-gray-900 w-20">Rate</th>
                <th className="text-right py-3 text-sm font-medium text-gray-900 w-20">Amount</th>
              </tr>
            </thead>
            <tbody>
              {groupedLineItems.map((group) => (
                group.items.map((item, itemIdx) => (
                  <tr key={`${group.lineNo}-${itemIdx}`} className="border-b border-gray-100">
                    <td className="py-2">
                      <div className={`font-medium text-gray-900 ${!item.isFirstOfSet && group.isSet ? 'pl-4 text-sm text-gray-600' : ''}`}>
                        {!item.isFirstOfSet && group.isSet ? `・${item.label}` : item.label}
                      </div>
                    </td>
                    <td className="py-2 text-center text-gray-600">{item.quantity > 0 ? item.quantity : ''}</td>
                    <td className="py-2 text-right text-gray-600">{item.unitPrice > 0 ? `¥${formatAmount(item.unitPrice)}` : ''}</td>
                    <td className="py-2 text-right font-medium text-gray-900">{item.amount > 0 ? `¥${formatAmount(item.amount)}` : ''}</td>
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </div>

        {/* ミニマル合計 */}
        <div className="flex justify-end mb-12">
          <div className="w-80">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-gray-900">¥{formatAmount(displayAmounts.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (10%):</span>
                <span className="text-gray-900">¥{formatAmount(displayAmounts.tax)}</span>
              </div>
              <div className="flex justify-between text-lg font-medium border-t border-gray-300 pt-2">
                <span className="text-gray-900">Total:</span>
                <span className="text-gray-900">¥{formatAmount(displayAmounts.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ミニマル支払い情報 */}
        {companyInfo?.bankName && (
          <div className="border-t border-gray-300 pt-8 mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h3>
            <div className="grid grid-cols-2 gap-8 text-sm">
              <div className="space-y-2">
                <div><span className="text-gray-600">Bank:</span> <span className="font-medium">{companyInfo.bankName}</span></div>
                <div><span className="text-gray-600">Branch:</span> <span className="font-medium">{companyInfo.bankBranch}</span></div>
                <div><span className="text-gray-600">Account Type:</span> <span className="font-medium">{companyInfo.accountType}</span></div>
              </div>
              <div className="space-y-2">
                <div><span className="text-gray-600">Account Number:</span> <span className="font-medium">{companyInfo.accountNumber}</span></div>
                <div><span className="text-gray-600">Account Holder:</span> <span className="font-medium">{companyInfo.accountHolder}</span></div>
                <div className="text-xs text-gray-500 mt-4">Payment due within 30 days</div>
              </div>
            </div>
          </div>
        )}

        {/* 備考欄（必須表示） */}
        <div className="border-t border-gray-300 pt-6 mb-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">備考</h3>
          <div className="text-sm text-gray-600 min-h-[30px] border border-gray-200 p-2 rounded bg-gray-50">
            {invoice?.remarks || ''}
          </div>
        </div>
      </div>
    );
  }

  // 法人標準レイアウト（適格請求書対応）
  function StandardLayout() {
    return (
      <div className="a4-page">
        {/* 適格請求書ヘッダー */}
        <div className="border-2 border-gray-900 mb-8">
          <div className="bg-gray-900 text-white p-4 text-center">
            <h1 className="text-2xl font-bold">適格請求書</h1>
            <div className="text-sm mt-1">QUALIFIED INVOICE</div>
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-start">
              {/* 発行者情報 */}
              <div className="w-1/2">
                <div className="border-b-2 border-gray-300 pb-3 mb-3">
                  <h2 className="text-xs font-semibold text-gray-600 mb-2">【適格請求書発行事業者】</h2>
                  <h3 className="text-lg font-bold mb-2">{companyInfo?.companyName}</h3>
                  <div className="text-sm space-y-1">
                    <div><strong>登録番号：</strong>T{companyInfo?.taxRegistrationNumber || '未設定'}</div>
                    <div>{companyInfo?.postalCode}</div>
                    <div>
                      {[companyInfo?.prefecture, companyInfo?.city, companyInfo?.address, companyInfo?.buildingName]
                        .filter(Boolean)
                        .join('')}
                    </div>
                    <div><strong>TEL：</strong>{companyInfo?.phoneNumber}</div>
                  </div>
                </div>
              </div>

              {/* 請求書詳細情報 */}
              <div className="w-1/2">
                <div className="border border-gray-300 p-4 bg-blue-50">
                  <div className="text-center mb-4">
                    <div className="text-xs text-gray-600">Document No.</div>
                    <div className="text-xl font-bold">{invoice?.invoice_number}</div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b border-gray-300 pb-1">
                      <span>発行日：</span>
                      <span className="font-semibold">{formatDate(invoice?.issue_date || '')}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-300 pb-1">
                      <span>合計金額：</span>
                      <span className="font-bold text-lg text-blue-600">¥{formatAmount(displayAmounts.total)}</span>
                    </div>
                    <div className="text-xs text-gray-600 text-center mt-3">
                      （消費税込み）
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 請求先情報 */}
        <div className="border border-gray-400 mb-6">
          <div className="bg-gray-200 px-4 py-2 border-b border-gray-400">
            <h3 className="font-bold text-gray-800">【請求先】</h3>
          </div>
          <div className="p-4">
            <div className="text-xl font-bold mb-3 border-b border-gray-300 pb-2">
              {customerInfo.name} 様
            </div>
            {customerInfo.company && (
              <div className="text-sm text-gray-700 mb-3">{customerInfo.company}</div>
            )}
            
            <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-3 rounded">
              <div><strong>件名：</strong> {invoice?.subject_name || invoice?.subject || '未設定'}</div>
              <div><strong>登録番号：</strong> {invoice?.registration_number || '未設定'}</div>
              {invoice?.order_number && (
                <div><strong>注文番号：</strong> {invoice?.order_number}</div>
              )}
              {invoice?.purchase_order_number && (
                <div><strong>発注番号：</strong> {invoice?.purchase_order_number}</div>
              )}
            </div>
          </div>
        </div>

          {/* 合計金額（目立つ位置） */}
          <div className="text-right mb-6">
            <div className="inline-block bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">ご請求金額</div>
              <div className="text-3xl font-bold text-blue-800">
                ¥{formatAmount(displayAmounts.total)}
              </div>
              <div className="text-xs text-gray-500 mt-1">（税込）</div>
            </div>
          </div>

          {/* 作業明細 */}
          <div className="mb-6 avoid-break">
            <h3 className="text-sm font-semibold mb-2 pb-1 border-b">作業明細</h3>
            <LineItemsTable headerBg="bg-gray-800 text-white" borderColor="border-gray-400" />
          </div>

        {/* 税込金額計算（適格請求書対応） */}
        <div className="border-2 border-gray-900 mb-6">
          <div className="bg-gray-900 text-white px-4 py-2">
            <h3 className="font-bold">【税額計算】</h3>
          </div>
          <div className="p-4">
            <div className="flex justify-end">
              <div className="w-80">
                <table className="w-full border-collapse border border-gray-400">
                  <tr className="bg-gray-100">
                    <td className="border border-gray-400 px-3 py-2 font-semibold">税抜金額</td>
                    <td className="border border-gray-400 px-3 py-2 text-right font-bold">¥{formatAmount(displayAmounts.subtotal)}</td>
                  </tr>
                  <tr className="bg-gray-100">
                    <td className="border border-gray-400 px-3 py-2 font-semibold">消費税（10%）</td>
                    <td className="border border-gray-400 px-3 py-2 text-right font-bold">¥{formatAmount(displayAmounts.tax)}</td>
                  </tr>
                  <tr className="bg-blue-100">
                    <td className="border border-gray-400 px-3 py-2 font-bold text-lg">税込合計金額</td>
                    <td className="border border-gray-400 px-3 py-2 text-right font-bold text-xl text-blue-700">¥{formatAmount(displayAmounts.total)}</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* 支払条件・振込先情報 */}
        {companyInfo?.bankName && (
          <div className="border border-gray-400 mb-6">
            <div className="bg-yellow-100 px-4 py-2 border-b border-gray-400">
              <h3 className="font-bold text-gray-800">【お支払い方法・振込先】</h3>
            </div>
            <div className="p-4 bg-yellow-50">
              <div className="mb-3 text-sm font-semibold text-red-600">
                ※ お支払期限：請求書発行日より30日以内
              </div>
              <table className="w-full text-sm">
                <tr>
                  <td className="py-1 pr-4 font-semibold w-24">金融機関：</td>
                  <td className="py-1 font-bold">{companyInfo.bankName}</td>
                </tr>
                <tr>
                  <td className="py-1 pr-4 font-semibold">支店名：</td>
                  <td className="py-1 font-bold">{companyInfo.bankBranch}</td>
                </tr>
                <tr>
                  <td className="py-1 pr-4 font-semibold">預金種別：</td>
                  <td className="py-1 font-bold">{companyInfo.accountType}</td>
                </tr>
                <tr>
                  <td className="py-1 pr-4 font-semibold">口座番号：</td>
                  <td className="py-1 font-bold text-lg">{companyInfo.accountNumber}</td>
                </tr>
                <tr>
                  <td className="py-1 pr-4 font-semibold">口座名義：</td>
                  <td className="py-1 font-bold">{companyInfo.accountHolder}</td>
                </tr>
              </table>
              <div className="mt-3 text-xs text-gray-700 bg-white p-2 rounded border">
                <strong>※振込手数料は恐れ入りますがお客様負担でお願いいたします。</strong>
                </div>
              </div>
            </div>
          )}

        {/* 特記事項・備考 */}
        {/* 備考欄（必須表示） */}
        <div className="border-t border-gray-300 pt-4 mb-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">備考</h3>
          <div className="text-sm text-gray-600 min-h-[30px] border border-gray-200 p-2 rounded bg-gray-50">
            {invoice?.remarks || ''}
          </div>
        </div>

        {/* 法的事項・フッター */}
        <div className="border-t-2 border-gray-900 pt-4 mt-8">
          <div className="text-center space-y-2">
            <div className="text-sm font-semibold text-gray-700">
              本書面は適格請求書（インボイス）として発行されています
            </div>
            <div className="text-xs text-gray-600">
              本請求書に関するお問い合わせは上記連絡先までお願いいたします
            </div>
            <div className="text-xs text-gray-500 border-t border-gray-300 pt-2 mt-3">
              この請求書は {companyInfo?.companyName} 請求書管理システムにより生成されました
            </div>
          </div>
        </div>
      </div>
    );
  }

  // モダンレイアウト - すっきりとしたデザイン
  function ModernLayout() {
    return (
      <div className="a4-page">
        <div className="border-b-2 border-blue-600 pb-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-light text-gray-800 mb-2">INVOICE</h1>
              <div className="text-sm text-gray-600">
                請求書番号: <span className="font-semibold">{invoice?.invoice_number}</span>
              </div>
              <div className="text-sm text-gray-600">
                発行日: {formatDate(invoice?.issue_date || '')}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                ¥{formatAmount(displayAmounts.total)}
              </div>
              <div className="text-sm text-gray-600">合計金額</div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* 請求先 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">請求先</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="font-semibold text-lg">{customerInfo.name} 様</div>
              {customerInfo.company && <div className="text-sm text-gray-600 mt-1">{customerInfo.company}</div>}
            </div>
          </div>
          
          {/* 請求元 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">請求元</h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="font-semibold">{companyInfo?.companyName}</div>
              <div className="text-sm mt-2">
                <div>{companyInfo?.postalCode}</div>
                <div>
                  {[companyInfo?.prefecture, companyInfo?.city, companyInfo?.address, companyInfo?.buildingName]
                    .filter(Boolean)
                    .join('')}
                </div>
                <div className="mt-1">{companyInfo?.phoneNumber}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 明細テーブル */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">明細</h3>
          <LineItemsTable headerBg="bg-blue-600 text-white" borderColor="border-gray-300" />
        </div>

        {/* 合計金額 */}
        <div className="flex justify-end mb-8">
          <div className="w-72 bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between py-2">
              <span>小計:</span>
              <span>¥{formatAmount(displayAmounts.subtotal)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span>消費税:</span>
              <span>¥{formatAmount(displayAmounts.tax)}</span>
            </div>
            <div className="flex justify-between py-3 text-xl font-bold border-t">
              <span>合計:</span>
              <span className="text-blue-600">¥{formatAmount(displayAmounts.total)}</span>
            </div>
          </div>
        </div>

        {/* 振込先情報 */}
        <div className="bg-blue-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4 text-blue-800">お振込先</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><strong>銀行名:</strong> {companyInfo?.bankName}</div>
            <div><strong>支店名:</strong> {companyInfo?.bankBranch}</div>
            <div><strong>預金種別:</strong> {companyInfo?.accountType}</div>
            <div><strong>口座番号:</strong> {companyInfo?.accountNumber}</div>
            <div className="col-span-2"><strong>口座名義:</strong> {companyInfo?.accountHolder}</div>
          </div>
        </div>
      </div>
    );
  }

  // コンパクトレイアウト - 省スペース型
  function CompactLayout() {
    return (
      <div className="a4-page">
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          <div>
            <h1 className="text-xl font-bold">請求書 #{invoice?.invoice_number}</h1>
            <div className="text-sm text-gray-600">{formatDate(invoice?.issue_date || '')}</div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold">¥{formatAmount(displayAmounts.total)}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <h4 className="font-semibold text-sm mb-2">請求先</h4>
            <div className="text-sm">{customerInfo.name} 様</div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-2">請求元</h4>
            <div className="text-sm">{companyInfo?.companyName}</div>
            <div className="text-xs text-gray-600">{companyInfo?.phoneNumber}</div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-2">振込先</h4>
            <div className="text-xs">
              {companyInfo?.bankName} {companyInfo?.bankBranch}<br/>
              {companyInfo?.accountType} {companyInfo?.accountNumber}
            </div>
          </div>
        </div>

        {/* シンプルな明細テーブル */}
        <LineItemsTable headerBg="bg-gray-200" borderColor="border-gray-400" compact={true} />

        <div className="flex justify-end">
          <div className="text-sm">
            <div>小計: ¥{formatAmount(displayAmounts.subtotal)}</div>
            <div>税込: ¥{formatAmount(displayAmounts.total)}</div>
          </div>
        </div>
      </div>
    );
  }

  // 詳細型レイアウト - 項目を多く表示
  function DetailedLayout() {
    return (
      <div className="a4-page">
        <div className="border-2 border-gray-800 p-6 mb-6">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold">請 求 書</h1>
            <div className="text-lg font-semibold mt-2">INVOICE</div>
          </div>
          
          <div className="grid grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold border-b mb-2">請求書情報</h4>
              <div className="space-y-1 text-sm">
                <div><strong>請求書番号:</strong> {invoice?.invoice_number}</div>
                <div><strong>発行日:</strong> {formatDate(invoice?.issue_date || '')}</div>
                {invoice?.order_number && <div><strong>注文番号:</strong> {invoice?.order_number}</div>}
                {invoice?.purchase_order_number && <div><strong>発注番号:</strong> {invoice?.purchase_order_number}</div>}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold border-b mb-2">請求先情報</h4>
              <div className="space-y-1 text-sm">
                <div className="font-semibold">{customerInfo.name} 様</div>
                {customerInfo.company && <div>{customerInfo.company}</div>}
                <div>件名: {invoice?.subject_name}</div>
                {invoice?.registration_number && <div>登録番号: {invoice?.registration_number}</div>}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold border-b mb-2">合計金額</h4>
              <div className="text-2xl font-bold text-center py-4 bg-gray-100 rounded">
                ¥{formatAmount(displayAmounts.total)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-semibold border-b mb-3">請求元詳細</h4>
            <div className="space-y-1 text-sm">
              <div className="font-semibold text-base">{companyInfo?.companyName}</div>
              <div>{companyInfo?.postalCode}</div>
              <div>
                {[companyInfo?.prefecture, companyInfo?.city, companyInfo?.address, companyInfo?.buildingName]
                  .filter(Boolean)
                  .join('')}
              </div>
              <div><strong>TEL:</strong> {companyInfo?.phoneNumber}</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold border-b mb-3">お振込先詳細</h4>
            <div className="space-y-1 text-sm bg-yellow-50 p-3 rounded">
              <div><strong>銀行名:</strong> {companyInfo?.bankName}</div>
              <div><strong>支店名:</strong> {companyInfo?.bankBranch}</div>
              <div><strong>預金種別:</strong> {companyInfo?.accountType}</div>
              <div><strong>口座番号:</strong> {companyInfo?.accountNumber}</div>
              <div><strong>口座名義:</strong> {companyInfo?.accountHolder}</div>
            </div>
          </div>
        </div>

        {/* 詳細な明細テーブル */}
        <div className="mb-6">
          <h4 className="font-semibold border-b mb-3">作業明細</h4>
          <LineItemsTable headerBg="bg-gray-800 text-white" borderColor="border-gray-300" />
        </div>

        {/* 詳細な合計計算 */}
        <div className="flex justify-end mb-6">
          <div className="w-80 border-2 border-gray-800 p-4">
            <h4 className="font-semibold border-b mb-3 text-center">金額詳細</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>作業小計:</span>
                <span>¥{formatAmount(displayAmounts.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>消費税 (10%):</span>
                <span>¥{formatAmount(displayAmounts.tax)}</span>
              </div>
              <div className="border-t-2 border-gray-800 pt-2 mt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>合計金額:</span>
                  <span>¥{formatAmount(displayAmounts.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 備考 */}
        {/* 備考欄（必須表示） */}
        <div className="border-t border-gray-300 pt-4 mb-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">備考</h3>
          <div className="text-sm text-gray-600 min-h-[30px] border border-gray-200 p-2 rounded bg-gray-50">
            {invoice?.remarks || ''}
          </div>
        </div>

        <div className="text-center text-xs text-gray-500 border-t pt-4">
          この請求書は BankinCafe システムにより自動生成されました
        </div>
      </div>
    );
  }

  // 2. グラデーション・モダンデザイン
  function GradientLayout() {
    return (
      <div className="a4-page">
        <style jsx>{`
          .gradient-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .gradient-accent {
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          }
        `}</style>

        {/* グラデーションヘッダー */}
        <div className="gradient-header text-white p-8 mb-8 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4">INVOICE</h1>
              <div className="grid grid-cols-2 gap-8 text-sm">
                <div>
                  <div className="opacity-90 mb-1">Invoice Number</div>
                  <div className="text-lg font-semibold">{invoice?.invoice_number}</div>
                </div>
                <div>
                  <div className="opacity-90 mb-1">Issue Date</div>
                  <div className="text-lg font-semibold">{formatDate(invoice?.issue_date || '')}</div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="opacity-90 text-sm mb-2">Total Amount</div>
              <div className="text-4xl font-bold">¥{formatAmount(displayAmounts.total)}</div>
            </div>
          </div>
        </div>

        {/* 情報セクション */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-lg">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <div className="w-3 h-3 gradient-accent rounded-full mr-3"></div>
              Bill To
            </h2>
            <div className="space-y-2">
              <div className="text-xl font-bold text-gray-900">{customerInfo.name}</div>
              {customerInfo.company && <div className="text-gray-600">{customerInfo.company}</div>}
              <div className="mt-4 space-y-1 text-sm">
                <div><strong>Subject:</strong> {invoice?.subject_name || invoice?.subject || 'Service'}</div>
                {invoice?.registration_number && <div><strong>Registration:</strong> {invoice?.registration_number}</div>}
                {invoice?.order_number && <div><strong>Order #:</strong> {invoice?.order_number}</div>}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-lg">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <div className="w-3 h-3 gradient-accent rounded-full mr-3"></div>
              From
            </h2>
            <div className="space-y-2">
              <div className="text-xl font-bold text-gray-900">{companyInfo?.companyName}</div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>{companyInfo?.postalCode}</div>
                <div>
                  {[companyInfo?.prefecture, companyInfo?.city, companyInfo?.address]
                    .filter(Boolean)
                    .join(' ')}
                </div>
                <div>{companyInfo?.phoneNumber}</div>
              </div>
            </div>
          </div>
        </div>

        {/* グラデーションテーブル */}
        <div className="mb-8 bg-white shadow-lg rounded-lg overflow-hidden">
          <LineItemsTable headerBg="gradient-header text-white" borderColor="border-gray-200" />
        </div>

        {/* グラデーション合計セクション */}
        <div className="flex justify-end mb-8">
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-lg w-96">
            <div className="space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span>¥{formatAmount(displayAmounts.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax (10%):</span>
                <span>¥{formatAmount(displayAmounts.tax)}</span>
              </div>
              <div className="gradient-accent h-0.5 rounded"></div>
              <div className="flex justify-between text-xl font-bold text-gray-900">
                <span>Total:</span>
                <span>¥{formatAmount(displayAmounts.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* グラデーション支払い情報 */}
        {companyInfo?.bankName && (
          <div className="gradient-header text-white p-6 rounded-lg mb-8">
            <h3 className="text-xl font-bold mb-4">Payment Information</h3>
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div className="space-y-2">
                <div><span className="opacity-90">Bank:</span> <span className="font-semibold ml-2">{companyInfo.bankName}</span></div>
                <div><span className="opacity-90">Branch:</span> <span className="font-semibold ml-2">{companyInfo.bankBranch}</span></div>
                <div><span className="opacity-90">Account Type:</span> <span className="font-semibold ml-2">{companyInfo.accountType}</span></div>
              </div>
              <div className="space-y-2">
                <div><span className="opacity-90">Account Number:</span> <span className="font-semibold ml-2">{companyInfo.accountNumber}</span></div>
                <div><span className="opacity-90">Account Holder:</span> <span className="font-semibold ml-2">{companyInfo.accountHolder}</span></div>
                <div className="text-xs opacity-80 mt-4">Payment due within 30 days from issue date</div>
              </div>
            </div>
          </div>
        )}

        {/* 備考欄（必須表示） */}
        <div className="border-t border-gray-300 pt-4 mb-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">備考</h3>
          <div className="text-sm text-gray-600 min-h-[30px] border border-gray-200 p-2 rounded bg-gray-50">
            {invoice?.remarks || ''}
          </div>
        </div>

        <div className="text-center text-xs text-gray-400 pt-6 border-t border-gray-200">
          <div className="gradient-accent h-1 w-16 mx-auto mb-2 rounded"></div>
          Invoice generated by {companyInfo?.companyName} System
        </div>
      </div>
    );
  }

  // 3. ジオメトリック・プロフェッショナルデザイン
  function GeometricLayout() {
    return (
      <div className="a4-page">
        <style jsx>{`
          .geometric-pattern {
            background-image: linear-gradient(45deg, #f8fafc 25%, transparent 25%),
                              linear-gradient(-45deg, #f8fafc 25%, transparent 25%),
                              linear-gradient(45deg, transparent 75%, #f8fafc 75%),
                              linear-gradient(-45deg, transparent 75%, #f8fafc 75%);
            background-size: 20px 20px;
            background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
          }
          .geometric-accent {
            background: linear-gradient(45deg, #1e293b, #334155);
          }
          .geometric-border {
            position: relative;
          }
          .geometric-border::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(45deg, #1e293b, #334155, #1e293b);
            border-radius: 8px;
            z-index: -1;
          }
        `}</style>

        {/* ジオメトリックヘッダー */}
        <div className="geometric-accent text-white p-8 mb-8 rounded-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 transform rotate-45 translate-x-16 -translate-y-16 bg-white opacity-5"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 transform -rotate-45 -translate-x-12 translate-y-12 bg-white opacity-5"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-white transform rotate-45 mr-4"></div>
                  <h1 className="text-3xl font-bold">INVOICE</h1>
                </div>
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div>
                    <div className="opacity-90 mb-1">Document #</div>
                    <div className="text-lg font-semibold">{invoice?.invoice_number}</div>
                  </div>
                  <div>
                    <div className="opacity-90 mb-1">Issue Date</div>
                    <div className="text-lg font-semibold">{formatDate(invoice?.issue_date || '')}</div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="geometric-border bg-white text-gray-900 p-4 rounded-lg">
                  <div className="text-sm font-medium mb-1">Total Amount</div>
                  <div className="text-2xl font-bold">¥{formatAmount(displayAmounts.total)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ジオメトリック情報セクション */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="geometric-pattern p-6 rounded-lg border-2 border-gray-200">
            <div className="bg-white p-4 rounded">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <div className="w-4 h-4 geometric-accent mr-3 transform rotate-45"></div>
                BILL TO
              </h2>
              <div className="space-y-2">
                <div className="text-xl font-bold text-gray-900">{customerInfo.name}</div>
                {customerInfo.company && <div className="text-gray-600 font-medium">{customerInfo.company}</div>}
                <div className="mt-4 space-y-1 text-sm">
                  <div className="flex"><span className="font-semibold w-20">Subject:</span> {invoice?.subject_name || invoice?.subject || 'Service'}</div>
                  {invoice?.registration_number && <div className="flex"><span className="font-semibold w-20">Reg. No:</span> {invoice?.registration_number}</div>}
                  {invoice?.order_number && <div className="flex"><span className="font-semibold w-20">Order:</span> {invoice?.order_number}</div>}
                </div>
              </div>
            </div>
          </div>

          <div className="geometric-pattern p-6 rounded-lg border-2 border-gray-200">
            <div className="bg-white p-4 rounded">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <div className="w-4 h-4 geometric-accent mr-3 transform rotate-45"></div>
                FROM
              </h2>
              <div className="space-y-2">
                <div className="text-xl font-bold text-gray-900">{companyInfo?.companyName}</div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>{companyInfo?.postalCode}</div>
                  <div>
                    {[companyInfo?.prefecture, companyInfo?.city, companyInfo?.address]
                      .filter(Boolean)
                      .join(' ')}
                  </div>
                  <div className="font-medium">{companyInfo?.phoneNumber}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ジオメトリックテーブル */}
        <div className="mb-8 border-2 border-gray-300 rounded-lg overflow-hidden">
          <LineItemsTable headerBg="geometric-accent text-white" borderColor="border-gray-200" />
        </div>

        {/* ジオメトリック合計 */}
        <div className="flex justify-end mb-8">
          <div className="geometric-border bg-white p-6 rounded-lg w-96">
            <div className="space-y-3 text-lg">
              <div className="flex justify-between">
                <span className="font-semibold">Subtotal:</span>
                <span>¥{formatAmount(displayAmounts.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Tax (10%):</span>
                <span>¥{formatAmount(displayAmounts.tax)}</span>
              </div>
              <div className="geometric-accent h-1 rounded transform -skew-x-12"></div>
              <div className="flex justify-between text-2xl font-bold text-gray-900">
                <span>TOTAL:</span>
                <span>¥{formatAmount(displayAmounts.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ジオメトリック支払い情報 */}
        {companyInfo?.bankName && (
          <div className="geometric-pattern p-6 rounded-lg border-2 border-gray-300 mb-8">
            <div className="bg-white p-6 rounded">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <div className="w-4 h-4 geometric-accent mr-3 transform rotate-45"></div>
                PAYMENT DETAILS
              </h3>
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div className="space-y-2">
                  <div className="flex"><span className="font-bold w-24">Bank:</span> <span className="ml-2">{companyInfo.bankName}</span></div>
                  <div className="flex"><span className="font-bold w-24">Branch:</span> <span className="ml-2">{companyInfo.bankBranch}</span></div>
                  <div className="flex"><span className="font-bold w-24">Type:</span> <span className="ml-2">{companyInfo.accountType}</span></div>
                </div>
                <div className="space-y-2">
                  <div className="flex"><span className="font-bold w-24">Account:</span> <span className="ml-2 font-mono">{companyInfo.accountNumber}</span></div>
                  <div className="flex"><span className="font-bold w-24">Holder:</span> <span className="ml-2">{companyInfo.accountHolder}</span></div>
                  <div className="text-xs text-gray-600 mt-4 font-semibold">▲ Payment due within 30 days</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 備考欄（必須表示） */}
        <div className="border-t border-gray-300 pt-4 mb-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">備考</h3>
          <div className="text-sm text-gray-600 min-h-[30px] border border-gray-200 p-2 rounded bg-gray-50">
            {invoice?.remarks || ''}
          </div>
        </div>

        <div className="text-center pt-6">
          <div className="flex justify-center items-center mb-2">
            <div className="w-2 h-2 geometric-accent transform rotate-45 mr-2"></div>
            <div className="text-xs text-gray-400">Invoice generated by {companyInfo?.companyName} System</div>
            <div className="w-2 h-2 geometric-accent transform rotate-45 ml-2"></div>
          </div>
        </div>
      </div>
    );
  }

  // 4. カラーブロック・コーポレートデザイン
  function CorporateLayout() {
    return (
      <div className="a4-page">
        <style jsx>{`
          .corporate-primary { background: #1e3a8a; }
          .corporate-secondary { background: #3b82f6; }
          .corporate-accent { background: #60a5fa; }
          .corporate-light { background: #dbeafe; }
        `}</style>

        {/* コーポレートヘッダー */}
        <div className="corporate-primary text-white mb-8">
          <div className="p-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold mb-6">INVOICE</h1>
                <div className="bg-white text-gray-900 p-4 rounded inline-block">
                  <div className="grid grid-cols-2 gap-6 text-sm">
                    <div>
                      <div className="font-semibold text-gray-600">Invoice Number</div>
                      <div className="text-lg font-bold">{invoice?.invoice_number}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-600">Issue Date</div>
                      <div className="text-lg font-bold">{formatDate(invoice?.issue_date || '')}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="corporate-accent p-6 rounded-lg">
                  <div className="text-sm opacity-90 mb-2">TOTAL AMOUNT</div>
                  <div className="text-4xl font-bold">¥{formatAmount(displayAmounts.total)}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="corporate-secondary h-4"></div>
        </div>

        {/* コーポレート情報セクション */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <div className="corporate-secondary text-white p-4 mb-4">
              <h2 className="text-lg font-bold">BILL TO</h2>
            </div>
            <div className="corporate-light p-6">
              <div className="space-y-3">
                <div className="text-2xl font-bold text-gray-900">{customerInfo.name}</div>
                {customerInfo.company && <div className="text-lg text-gray-700">{customerInfo.company}</div>}
                <div className="space-y-2 text-sm border-t border-gray-300 pt-4">
                  <div className="flex">
                    <span className="font-bold corporate-primary text-white px-2 py-1 rounded text-xs mr-3">SUBJECT</span>
                    <span>{invoice?.subject_name || invoice?.subject || 'Service'}</span>
                  </div>
                  {invoice?.registration_number && (
                    <div className="flex">
                      <span className="font-bold corporate-primary text-white px-2 py-1 rounded text-xs mr-3">REG</span>
                      <span>{invoice?.registration_number}</span>
                    </div>
                  )}
                  {invoice?.order_number && (
                    <div className="flex">
                      <span className="font-bold corporate-primary text-white px-2 py-1 rounded text-xs mr-3">ORDER</span>
                      <span>{invoice?.order_number}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="corporate-secondary text-white p-4 mb-4">
              <h2 className="text-lg font-bold">FROM</h2>
            </div>
            <div className="corporate-light p-6">
              <div className="space-y-3">
                <div className="text-2xl font-bold text-gray-900">{companyInfo?.companyName}</div>
                <div className="text-sm text-gray-700 space-y-1">
                  <div className="font-semibold">{companyInfo?.postalCode}</div>
                  <div>
                    {[companyInfo?.prefecture, companyInfo?.city, companyInfo?.address]
                      .filter(Boolean)
                      .join(' ')}
                  </div>
                  <div className="corporate-primary text-white px-2 py-1 rounded inline-block text-xs font-bold mt-2">
                    {companyInfo?.phoneNumber}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* コーポレートテーブル */}
        <div className="mb-8 border-2 border-gray-300 rounded-lg overflow-hidden">
          <LineItemsTable headerBg="corporate-primary text-white" borderColor="border-gray-200" />
        </div>

        {/* コーポレート合計 */}
        <div className="flex justify-end mb-8">
          <div className="w-96 border-2 border-gray-300 rounded-lg overflow-hidden">
            <div className="corporate-secondary text-white p-4">
              <h3 className="font-bold text-lg">PAYMENT SUMMARY</h3>
            </div>
            <div className="bg-white p-6 space-y-4">
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Subtotal:</span>
                <span>¥{formatAmount(displayAmounts.subtotal)}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Tax (10%):</span>
                <span>¥{formatAmount(displayAmounts.tax)}</span>
              </div>
              <div className="corporate-accent h-1"></div>
              <div className="flex justify-between text-2xl font-bold corporate-primary text-white p-3 rounded">
                <span>TOTAL AMOUNT:</span>
                <span>¥{formatAmount(displayAmounts.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* コーポレート支払い情報 */}
        {companyInfo?.bankName && (
          <div className="mb-8 border-2 border-gray-300 rounded-lg overflow-hidden">
            <div className="corporate-primary text-white p-4">
              <h3 className="text-lg font-bold">PAYMENT INFORMATION</h3>
            </div>
            <div className="corporate-light p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="corporate-secondary text-white px-3 py-1 rounded text-xs font-bold mr-3">BANK</div>
                    <div className="font-semibold">{companyInfo.bankName}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="corporate-secondary text-white px-3 py-1 rounded text-xs font-bold mr-3">BRANCH</div>
                    <div className="font-semibold">{companyInfo.bankBranch}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="corporate-secondary text-white px-3 py-1 rounded text-xs font-bold mr-3">TYPE</div>
                    <div className="font-semibold">{companyInfo.accountType}</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="corporate-secondary text-white px-3 py-1 rounded text-xs font-bold mr-3">ACCOUNT</div>
                    <div className="font-mono font-bold text-lg">{companyInfo.accountNumber}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="corporate-secondary text-white px-3 py-1 rounded text-xs font-bold mr-3">HOLDER</div>
                    <div className="font-semibold">{companyInfo.accountHolder}</div>
                  </div>
                  <div className="corporate-accent text-white px-3 py-2 rounded text-sm font-bold">
                    ⏰ Payment due within 30 days
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 備考欄（必須表示） */}
        <div className="border-t border-gray-300 pt-4 mb-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">備考</h3>
          <div className="text-sm text-gray-600 min-h-[30px] border border-gray-200 p-2 rounded bg-gray-50">
            {invoice?.remarks || ''}
          </div>
        </div>

        <div className="text-center">
          <div className="corporate-primary text-white p-4 rounded">
            <div className="text-xs font-bold">Invoice generated by {companyInfo?.companyName} Corporate System</div>
          </div>
        </div>
      </div>
    );
  }

  // 9. 基本レイアウト - 最もシンプルな一般的フォーマット
  function BasicLayout() {
    return (
      <div className="a4-page">
        {/* 基本ヘッダー */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">請求書</h1>
            <div className="text-sm text-gray-600">No. {invoice?.invoice_number}</div>
          </div>
          
          <div className="flex justify-between items-start border-b border-gray-400 pb-4">
            <div className="w-1/2">
              <div className="text-sm text-gray-600 mb-1">請求先</div>
              <div className="text-lg font-bold text-gray-900">{customerInfo.name} 様</div>
              {customerInfo.company && <div className="text-sm text-gray-600 mt-1">{customerInfo.company}</div>}
              <div className="text-sm text-gray-600 mt-3">
                {invoice?.subject_name || invoice?.subject || 'Service'}
              </div>
            </div>
            
            <div className="w-1/2 text-right">
              <div className="text-sm text-gray-600 mb-1">発行日</div>
              <div className="text-lg font-bold text-gray-900">{formatDate(invoice?.issue_date || '')}</div>
              <div className="text-sm text-gray-600 mt-4 mb-1">合計金額</div>
              <div className="text-3xl font-bold text-gray-900">¥{formatAmount(displayAmounts.total)}</div>
            </div>
          </div>
        </div>

        {/* 基本明細テーブル */}
        <div className="mb-8">
          <LineItemsTable headerBg="bg-gray-100" borderColor="border-gray-400" />
          {/* 合計欄 */}
          <div className="border border-gray-400 border-t-0">
            <div className="flex justify-end py-2 px-3 border-b border-gray-400">
              <span className="text-sm font-bold mr-4">小計</span>
              <span className="font-bold w-24 text-right">¥{formatAmount(displayAmounts.subtotal)}</span>
            </div>
            <div className="flex justify-end py-2 px-3 border-b border-gray-400">
              <span className="text-sm font-bold mr-4">消費税(10%)</span>
              <span className="font-bold w-24 text-right">¥{formatAmount(displayAmounts.tax)}</span>
            </div>
            <div className="flex justify-end py-2 px-3 bg-gray-100">
              <span className="text-lg font-bold mr-4">合計</span>
              <span className="text-lg font-bold w-24 text-right">¥{formatAmount(displayAmounts.total)}</span>
            </div>
          </div>
        </div>

        {/* 基本情報セクション */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <div className="border border-gray-400 p-4">
              <h3 className="font-bold text-gray-900 mb-3 border-b border-gray-300 pb-2">発行者情報</h3>
              <div className="space-y-1 text-sm">
                <div className="font-bold text-lg">{companyInfo?.companyName}</div>
                <div>〒{companyInfo?.postalCode}</div>
                <div>
                  {[companyInfo?.prefecture, companyInfo?.city, companyInfo?.address]
                    .filter(Boolean)
                    .join(' ')}
                </div>
                <div>TEL: {companyInfo?.phoneNumber}</div>
              </div>
            </div>
          </div>

          <div>
            {companyInfo?.bankName && (
              <div className="border border-gray-400 p-4">
                <h3 className="font-bold text-gray-900 mb-3 border-b border-gray-300 pb-2">お振込先</h3>
                <div className="space-y-1 text-sm">
                  <div>銀行: {companyInfo.bankName}</div>
                  <div>支店: {companyInfo.bankBranch}</div>
                  <div>種別: {companyInfo.accountType}</div>
                  <div>口座番号: {companyInfo.accountNumber}</div>
                  <div>名義: {companyInfo.accountHolder}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 備考欄（必須表示） */}
        <div className="border-t border-gray-300 pt-4 mb-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">備考</h3>
          <div className="text-sm text-gray-600 min-h-[30px] border border-gray-200 p-2 rounded bg-gray-50">
            {invoice?.remarks || ''}
          </div>
        </div>

        <div className="text-center text-xs text-gray-500 border-t border-gray-300 pt-4">
          {companyInfo?.companyName} より発行
        </div>
      </div>
    );
  }

  // 10. 伝統的レイアウト - 日本の従来型請求書スタイル  
  function TraditionalLayout() {
    return (
      <div className="a4-page">
        {/* 伝統的ヘッダー */}
        <div className="border-2 border-gray-900 mb-8">
          <div className="bg-gray-900 text-white p-2 text-center">
            <h1 className="text-xl font-bold">請　求　書</h1>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="mb-4">
                  <div className="text-sm mb-1">〒{companyInfo?.postalCode}</div>
                  <div className="text-sm mb-1">
                    {[companyInfo?.prefecture, companyInfo?.city, companyInfo?.address]
                      .filter(Boolean)
                      .join(' ')}
                  </div>
                  <div className="text-lg font-bold mt-2">{companyInfo?.companyName}</div>
                  <div className="text-sm">TEL: {companyInfo?.phoneNumber}</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="border border-gray-400 p-3">
                  <div className="text-sm mb-1">請求書番号</div>
                  <div className="font-bold text-lg">{invoice?.invoice_number}</div>
                  <div className="text-sm mt-3 mb-1">発行日</div>
                  <div className="font-bold">{formatDate(invoice?.issue_date || '')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 請求先 */}
        <div className="mb-6">
          <div className="border-l-4 border-gray-900 pl-3">
            <div className="text-lg font-bold">{customerInfo.name} 様</div>
            {customerInfo.company && <div className="text-sm text-gray-600 mt-1">{customerInfo.company}</div>}
          </div>
          <div className="mt-3 text-sm">
            件名: {invoice?.subject_name || invoice?.subject || 'Service'}
          </div>
        </div>

        {/* 合計金額（大きく表示） */}
        <div className="text-center mb-8">
          <div className="border-2 border-gray-900 p-4 inline-block">
            <div className="text-sm mb-1">ご請求金額</div>
            <div className="text-4xl font-bold text-gray-900">¥{formatAmount(displayAmounts.total)}</div>
          </div>
        </div>

        {/* 明細（シンプル表） */}
        <div className="mb-8">
          <div className="border-2 border-gray-900">
            <div className="bg-gray-100 p-2 border-b border-gray-900">
              <h3 className="font-bold text-center">明細</h3>
            </div>
            <LineItemsTable headerBg="bg-gray-50" borderColor="border-gray-200" compact={true} />
            <div className="p-3 bg-gray-50 border-t-2 border-gray-900">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div></div>
                <div className="space-y-1">
                  <div className="flex justify-between"><span>小計:</span><span>¥{formatAmount(displayAmounts.subtotal)}</span></div>
                  <div className="flex justify-between"><span>消費税(10%):</span><span>¥{formatAmount(displayAmounts.tax)}</span></div>
                  <div className="flex justify-between font-bold text-lg border-t border-gray-400 pt-1">
                    <span>合計:</span><span>¥{formatAmount(displayAmounts.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 振込先 */}
        {companyInfo?.bankName && (
          <div className="border-2 border-gray-900 mb-8">
            <div className="bg-gray-100 p-2 border-b border-gray-900">
              <h3 className="font-bold text-center">お振込先</h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div><span className="font-bold">銀行名:</span> {companyInfo.bankName}</div>
                  <div><span className="font-bold">支店名:</span> {companyInfo.bankBranch}</div>
                </div>
                <div>
                  <div><span className="font-bold">預金種別:</span> {companyInfo.accountType}</div>
                  <div><span className="font-bold">口座番号:</span> {companyInfo.accountNumber}</div>
                </div>
                <div className="col-span-2">
                  <div><span className="font-bold">口座名義:</span> {companyInfo.accountHolder}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 備考欄（必須表示） */}
        <div className="border-t border-gray-300 pt-4 mb-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">備考</h3>
          <div className="text-sm text-gray-600 min-h-[30px] border border-gray-200 p-2 rounded bg-gray-50">
            {invoice?.remarks || ''}
          </div>
        </div>

        <div className="text-center text-xs text-gray-600 mt-8">
          ※ このたびはありがとうございます。
        </div>
      </div>
    );
  }

  // 11. クラシックレイアウト - 白黒のオーソドックスデザイン
  function ClassicLayout() {
    return (
      <div className="a4-page">
        {/* クラシックヘッダー */}
        <div className="border-b-2 border-gray-800 mb-8 pb-4">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-serif font-bold text-gray-900 tracking-wider">INVOICE</h1>
            <div className="text-sm text-gray-700 mt-1">請求書</div>
          </div>
          
          <div className="flex justify-between">
            <div className="w-1/2">
              <div className="text-xs text-gray-600 mb-1 uppercase tracking-wide">Bill To:</div>
              <div className="font-bold text-lg text-gray-900">{customerInfo.name}</div>
              {customerInfo.company && <div className="text-sm text-gray-700">{customerInfo.company}</div>}
              <div className="text-sm text-gray-600 mt-2">
                Subject: {invoice?.subject_name || invoice?.subject || 'Service'}
              </div>
            </div>
            
            <div className="w-1/2 text-right">
              <div className="border border-gray-800 p-3">
                <div className="text-xs text-gray-600 mb-1">Invoice No.</div>
                <div className="font-mono font-bold text-lg">{invoice?.invoice_number}</div>
                <div className="text-xs text-gray-600 mt-3 mb-1">Issue Date</div>
                <div className="font-mono">{formatDate(invoice?.issue_date || '')}</div>
                <div className="text-xs text-gray-600 mt-3 mb-1">Amount Due</div>
                <div className="font-mono font-bold text-xl">¥{formatAmount(displayAmounts.total)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* クラシック明細テーブル */}
        <div className="mb-8 border-2 border-gray-800">
          <LineItemsTable headerBg="bg-white" borderColor="border-gray-400" />
          {/* 合計セクション */}
          <div className="flex justify-end border-t-2 border-gray-800">
            <div className="w-80 space-y-1 p-3">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span className="font-mono">¥{formatAmount(displayAmounts.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (10%):</span>
                <span className="font-mono">¥{formatAmount(displayAmounts.tax)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t-2 border-gray-800 pt-2">
                <span>TOTAL:</span>
                <span className="font-mono">¥{formatAmount(displayAmounts.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* クラシック会社情報と支払い情報 */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="border border-gray-600 p-4">
            <h3 className="font-bold text-sm tracking-wide mb-3 border-b border-gray-400 pb-1">FROM</h3>
            <div className="space-y-1 text-sm">
              <div className="font-bold">{companyInfo?.companyName}</div>
              <div>〒{companyInfo?.postalCode}</div>
              <div>
                {[companyInfo?.prefecture, companyInfo?.city, companyInfo?.address]
                  .filter(Boolean)
                  .join(' ')}
              </div>
              <div>Tel: {companyInfo?.phoneNumber}</div>
            </div>
          </div>
          
          {companyInfo?.bankName && (
            <div className="border border-gray-600 p-4">
              <h3 className="font-bold text-sm tracking-wide mb-3 border-b border-gray-400 pb-1">PAYMENT</h3>
              <div className="space-y-1 text-xs">
                <div><span className="font-medium">Bank:</span> {companyInfo.bankName}</div>
                <div><span className="font-medium">Branch:</span> {companyInfo.bankBranch}</div>
                <div><span className="font-medium">Type:</span> {companyInfo.accountType}</div>
                <div><span className="font-medium">Account:</span> <span className="font-mono">{companyInfo.accountNumber}</span></div>
                <div><span className="font-medium">Holder:</span> {companyInfo.accountHolder}</div>
                <div className="text-xs text-gray-600 mt-3 italic">Payment due within 30 days</div>
              </div>
            </div>
          )}
        </div>

        {/* 備考欄（必須表示） */}
        <div className="border-t border-gray-300 pt-4 mb-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">備考</h3>
          <div className="text-sm text-gray-600 min-h-[30px] border border-gray-200 p-2 rounded bg-gray-50">
            {invoice?.remarks || ''}
          </div>
        </div>

        <div className="text-center border-t border-gray-400 pt-4">
          <div className="text-xs text-gray-600">Thank you for your business</div>
          <div className="text-xs text-gray-500 mt-1 font-mono">{companyInfo?.companyName}</div>
        </div>
      </div>
    );
  }

  // 12. プレーンレイアウト - 装飾なし・実用重視
  function PlainLayout() {
    return (
      <div className="a4-page">
        {/* プレーンヘッダー */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-1">請求書</h1>
              <div className="text-sm text-gray-600">#{invoice?.invoice_number}</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">¥{formatAmount(displayAmounts.total)}</div>
              <div className="text-sm text-gray-600">{formatDate(invoice?.issue_date || '')}</div>
            </div>
          </div>
        </div>

        {/* プレーン情報 */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <div className="font-bold">請求先:</div>
            <div className="ml-4 mt-1">
              <div className="font-medium">{customerInfo.name}</div>
              {customerInfo.company && <div className="text-sm text-gray-600">{customerInfo.company}</div>}
              <div className="text-sm text-gray-600 mt-2">
                件名: {invoice?.subject_name || invoice?.subject || 'Service'}
              </div>
            </div>
          </div>
          
          <div>
            <div className="font-bold">発行者:</div>
            <div className="ml-4 mt-1">
              <div className="font-medium">{companyInfo?.companyName}</div>
              <div className="text-sm">〒{companyInfo?.postalCode}</div>
              <div className="text-sm">
                {[companyInfo?.prefecture, companyInfo?.city, companyInfo?.address]
                  .filter(Boolean)
                  .join(' ')}
              </div>
              <div className="text-sm">Tel: {companyInfo?.phoneNumber}</div>
            </div>
          </div>
        </div>

        {/* プレーン明細 */}
        <div className="mb-8">
          <div className="font-bold mb-2">明細:</div>
          <LineItemsTable headerBg="border-b-2 border-gray-800" borderColor="border-gray-200" />
          <div className="flex justify-end mt-4">
            <div className="w-64 space-y-1">
              <div className="flex justify-between"><span>小計:</span><span>¥{formatAmount(displayAmounts.subtotal)}</span></div>
              <div className="flex justify-between"><span>税:</span><span>¥{formatAmount(displayAmounts.tax)}</span></div>
              <div className="flex justify-between font-bold text-lg border-t border-gray-800 pt-1">
                <span>合計:</span><span>¥{formatAmount(displayAmounts.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* プレーン支払い情報 */}
        {companyInfo?.bankName && (
          <div className="mb-8">
            <div className="font-bold mb-2">振込先:</div>
            <div className="ml-4 space-y-1 text-sm">
              <div>{companyInfo.bankName} {companyInfo.bankBranch} {companyInfo.accountType}</div>
              <div>口座番号: {companyInfo.accountNumber}</div>
              <div>名義: {companyInfo.accountHolder}</div>
            </div>
          </div>
        )}

        {/* 備考欄（必須表示） */}
        <div className="border-t border-gray-300 pt-4 mb-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">備考</h3>
          <div className="text-sm text-gray-600 min-h-[30px] border border-gray-200 p-2 rounded bg-gray-50">
            {invoice?.remarks || ''}
          </div>
        </div>

        <div className="text-center text-sm text-gray-600 border-t border-gray-400 pt-4">
          {companyInfo?.companyName}
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
                <div className="flex justify-between items-start mb-3 pb-2 border-b-2 border-gray-800">
                  <div>
                    <h1 className="text-xl font-bold">請求書</h1>
                    <div className="text-xs text-gray-600">No. {invoice?.invoice_number}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-600">発行日: {formatDate(invoice?.issue_date || '')}</div>
                    <div className="text-lg font-bold mt-1">¥{formatAmount(displayAmounts.total)}</div>
                  </div>
                </div>

                {/* 2列情報 */}
                <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
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
            <table className="w-full text-xs mb-3">
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
                <div className="grid grid-cols-2 gap-3 text-xs mt-auto">
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