'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Download, Trash2, RotateCcw, FileText, Calendar, User, Hash, Building2, Phone } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { InvoiceWithItems } from '@/hooks/useInvoiceList';

interface PageProps {
  params: {
    id: string;
  };
}

export default function InvoiceViewPage({ params }: PageProps) {
  const router = useRouter();
  const [invoice, setInvoice] = useState<InvoiceWithItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 請求書データを取得
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        setError(null);

        // 請求書基本情報を取得
        const { data: invoiceData, error: invoiceError } = await supabase
          .from('invoices')
          .select('*')
          .eq('invoice_id', params.id)
          .single();

        if (invoiceError) {
          throw invoiceError;
        }

        if (!invoiceData) {
          throw new Error('請求書が見つかりません');
        }

        // ライン項目を取得
        const { data: lineItems, error: lineError } = await supabase
          .from('invoice_line_items')
          .select('*')
          .eq('invoice_id', params.id)
          .order('line_no', { ascending: true });

        if (lineError) {
          throw lineError;
        }

        // 各ライン項目の分割データを取得
        const lineItemsWithSplits = await Promise.all(
          (lineItems || []).map(async (item) => {
            // invoice_line_items_splitテーブルが存在しない場合の対応
            let splitItems = null;
            try {
              const { data, error: splitError } = await supabase
                .from('invoice_line_items' as any)
                .select('*')
                .eq('invoice_id', item.invoice_id)
                .eq('line_no', item.line_no)
                .order('line_no', { ascending: true });
              
              if (!splitError) {
                splitItems = data;
              }
            } catch (e) {
              // テーブルが存在しない場合はスキップ
              console.warn('invoice_line_items_split table not found');
            }


            return {
              id: item.id,
              line_no: item.line_no,
              task_type: item.task_type,
              target: item.target,
              action: item.action,
              position: item.position,
              quantity: item.quantity,
              unit_price: item.unit_price,
              amount: item.amount,
              raw_label: item.raw_label,
              performed_at: item.performed_at,
              split_items: splitItems || []
            };
          })
        );

        // 総数量と作業名を計算
        let totalQuantity = 0;
        const workNames: string[] = [];

        lineItemsWithSplits.forEach(item => {
          if (item.split_items && item.split_items.length > 0) {
            totalQuantity += item.split_items.reduce((sum: number, split: any) => sum + split.quantity, 0);
            workNames.push(...item.split_items.map((split: any) => split.raw_label_part));
          } else {
            totalQuantity += item.quantity || 0;
            workNames.push(item.raw_label || [item.target, item.action, item.position].filter(Boolean).join(' '));
          }
        });

        const invoiceWithItems: InvoiceWithItems = {
          ...invoiceData,
          invoice_number: (invoiceData as any).invoice_number || invoiceData.invoice_id,
          customer_category: ((invoiceData as any).customer_category as 'UD' | 'その他') || 'その他',
          subject: (invoiceData as any).subject || (invoiceData as any).subject_name || '',
          line_items: lineItemsWithSplits,
          total_quantity: totalQuantity,
          work_names: workNames.join(' / '),
          status: (invoiceData.status as 'draft' | 'finalized' | 'sent' | 'paid') || 'draft',
          payment_status: (invoiceData.payment_status as 'unpaid' | 'paid' | 'partial') || 'unpaid',
          subtotal: invoiceData.subtotal || 0,
          tax: invoiceData.tax || 0,
          total: invoiceData.total || 0
        };

        setInvoice(invoiceWithItems);
      } catch (err) {
        console.error('Failed to fetch invoice:', err);
        setError(err instanceof Error ? err.message : 'データの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchInvoice();
    }
  }, [params.id]);

  // 金額フォーマット
  const formatAmount = (amount: number) => {
    return amount.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' });
  };

  // 日付フォーマット
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  // ステータス表示
  const getStatusBadge = (status: string) => {
    const statusMap = {
      draft: { label: '下書き', className: 'bg-gray-100 text-gray-800' },
      finalized: { label: '確定', className: 'bg-blue-100 text-blue-800' },
      sent: { label: '送信済み', className: 'bg-green-100 text-green-800' },
      paid: { label: '支払済み', className: 'bg-purple-100 text-purple-800' }
    };
    const config = statusMap[status as keyof typeof statusMap] || { label: status, className: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.className}`}>
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
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.className}`}>
        {config.label}
      </span>
    );
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
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex">
            <div className="text-red-400">
              <FileText className="h-6 w-6" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-800">エラーが発生しました</h3>
              <p className="mt-2 text-red-700">{error}</p>
              <div className="mt-4">
                <button
                  onClick={() => router.push('/invoice-list')}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  一覧に戻る
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">請求書が見つかりません</h3>
          <p className="mt-1 text-gray-500">指定された請求書は存在しないか、削除されています。</p>
          <div className="mt-6">
            <button
              onClick={() => router.push('/invoice-list')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              一覧に戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* ヘッダー */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/invoice-list')}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">請求書詳細</h1>
            <p className="text-gray-600">請求書番号: {invoice.invoice_number}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/invoice-edit/${invoice.invoice_id}`)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            編集
          </button>
          <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2">
            <Download className="w-4 h-4" />
            PDF出力
          </button>
        </div>
      </div>

      {/* 基本情報 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* 請求書情報 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            請求書情報
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">請求書番号</label>
              <p className="text-gray-900 font-medium">{invoice.invoice_number}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">発行日</label>
              <p className="text-gray-900">{formatDate(invoice.issue_date)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">請求月</label>
              <p className="text-gray-900">{formatDate(invoice.billing_date)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">登録番号</label>
              <p className="text-gray-900">{invoice.registration_number || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">発注番号</label>
              <p className="text-gray-900">{invoice.order_number || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">ステータス</label>
              <div className="mt-1">{getStatusBadge(invoice.status)}</div>
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-500">入金状況</label>
              <div className="mt-1">{getPaymentStatusBadge(invoice.payment_status)}</div>
            </div>
          </div>
        </div>

        {/* 顧客情報 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            顧客情報
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">顧客名</label>
              <p className="text-gray-900 font-medium">{invoice.customer_name || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">件名</label>
              <p className="text-gray-900">{invoice.subject_name || invoice.subject || '-'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 金額情報 */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Hash className="w-5 h-5" />
          金額情報
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <label className="text-sm font-medium text-gray-500">小計</label>
            <p className="text-xl font-bold text-gray-900">{formatAmount(invoice.subtotal)}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <label className="text-sm font-medium text-gray-500">税額</label>
            <p className="text-xl font-bold text-gray-900">{formatAmount(invoice.tax)}</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <label className="text-sm font-medium text-blue-600">合計金額</label>
            <p className="text-2xl font-bold text-blue-600">{formatAmount(invoice.total)}</p>
          </div>
        </div>
      </div>

      {/* 明細情報 */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            作業明細
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">行番号</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">作業内容</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">数量</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">単価</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">金額</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">実施日</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoice.line_items.map((item, index) => {
                // 分割項目がある場合とない場合を判別
                const hasSplitItems = item.split_items && item.split_items.length > 0;
                
                if (hasSplitItems) {
                  // セット内容：セットの作業名＋作業の内訳を表示
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.line_no}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 font-medium">
                          {item.raw_label || 'セット作業'}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {item.split_items.map((split: any, idx: number) => (
                            <div key={idx}>
                              • {split.raw_label_part} ({split.quantity})
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {item.split_items.reduce((sum: number, split: any) => sum + split.quantity, 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {item.unit_price ? formatAmount(item.unit_price) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                        {item.amount ? formatAmount(item.amount) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(item.performed_at)}
                      </td>
                    </tr>
                  );
                } else {
                  // 個別情報：作業内容をそのまま表示
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.line_no}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {item.raw_label || [item.target, item.action, item.position].filter(Boolean).join(' ') || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {item.quantity || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {item.unit_price ? formatAmount(item.unit_price) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                        {item.amount ? formatAmount(item.amount) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(item.performed_at)}
                      </td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        </div>

        {invoice.line_items.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">明細データがありません</div>
          </div>
        )}
      </div>
    </div>
  );
}