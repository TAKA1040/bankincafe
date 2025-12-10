'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Download, Trash2, RotateCcw, FileText, Calendar, User, Hash, Building2, Phone, Printer } from 'lucide-react';
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
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

        // ライン項目を取得（line_no, sub_no順でソート）
        const { data: lineItems, error: lineError } = await supabase
          .from('invoice_line_items')
          .select('*')
          .eq('invoice_id', params.id)
          .order('line_no', { ascending: true })
          .order('sub_no', { ascending: true });

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
              sub_no: item.sub_no,
              task_type: item.task_type,
              target: item.target,
              action: item.action1,
              position: item.position1,
              quantity: item.quantity,
              unit_price: item.unit_price,
              amount: item.amount,
              raw_label: item.raw_label,
              raw_label_part: item.raw_label_part,
              set_name: item.set_name,
              performed_at: item.performed_at,
              split_items: (splitItems as any) || []
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
          total: invoiceData.total || 0,
          remarks: invoiceData.remarks || null,
          closed_at: (invoiceData as any).closed_at || null,
          invoice_type: (invoiceData as any).invoice_type || 'standard'
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
      paid: { label: '入金済み', className: 'bg-purple-100 text-purple-800' }
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
                  戻る
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
              onClick={() => router.back()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              戻る
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
            onClick={() => {
              if ((invoice as any).closed_at) {
                setShowEditConfirm(true);
              } else {
                router.push(`/invoice-create?edit=${invoice.invoice_id}`);
              }
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            {(invoice as any).closed_at ? '修正' : '編集'}
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            削除
          </button>
          <button
            onClick={() => router.push(`/invoice-print/${invoice.invoice_id}`)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            印刷
          </button>
          <button
            onClick={() => router.push(`/invoice-print/${invoice.invoice_id}`)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
          >
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
      {(() => {
        // S作業はsub_no=1のみ、T作業は全て集計
        const subtotal = invoice.line_items
          .filter(item => !item.sub_no || item.sub_no === 1)
          .reduce((sum, item) => sum + (item.amount || 0), 0);
        const tax = Math.floor(subtotal * 0.1);
        const total = subtotal + tax;

        return (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Hash className="w-5 h-5" />
              金額情報
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <label className="text-sm font-medium text-gray-500">小計</label>
                <p className="text-xl font-bold text-gray-900">{formatAmount(subtotal)}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <label className="text-sm font-medium text-gray-500">税額</label>
                <p className="text-xl font-bold text-gray-900">{formatAmount(tax)}</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <label className="text-sm font-medium text-blue-600">合計金額</label>
                <p className="text-2xl font-bold text-blue-600">{formatAmount(total)}</p>
              </div>
            </div>
          </div>
        );
      })()}

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
              {(() => {
                // S作業をグループ化
                const processedLineNos = new Set<number>();
                const rows: JSX.Element[] = [];

                invoice.line_items.forEach((item, index) => {
                  const isSetWork = item.task_type === 'S' || item.task_type === 'set';

                  if (isSetWork) {
                    // S作業: 同じline_noは1回だけ表示
                    if (processedLineNos.has(item.line_no)) {
                      return; // 既に処理済み
                    }
                    processedLineNos.add(item.line_no);

                    // 同じline_noのS作業をすべて取得（内訳用）
                    const sameLineItems = invoice.line_items.filter(
                      i => i.line_no === item.line_no && (i.task_type === 'S' || i.task_type === 'set')
                    );

                    // セット名（set_nameがあれば使用、なければraw_labelの先頭部分）
                    const setName = item.set_name || item.raw_label || 'セット作業';

                    rows.push(
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.line_no}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 font-medium">
                            {setName}
                          </div>
                          {sameLineItems.length > 0 && (
                            <div className="text-xs text-gray-500 mt-1">
                              <span className="text-gray-600">内訳</span>
                              {sameLineItems.map((subItem, idx) => (
                                <div key={idx} className="ml-2">
                                  • {subItem.raw_label_part || [subItem.target, subItem.action, subItem.position].filter(Boolean).join(' ') || '-'}
                                </div>
                              ))}
                            </div>
                          )}
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
                  } else {
                    // T作業（個別）：行番号をline_no-sub_noで表示
                    const lineNoDisplay = item.sub_no ? `${item.line_no}-${item.sub_no}` : item.line_no;

                    rows.push(
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {lineNoDisplay}
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
                });

                return rows;
              })()}
            </tbody>
          </table>
        </div>

        {invoice.line_items.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">明細データがありません</div>
          </div>
        )}

        {/* メモ欄 */}
        {(() => {
          // sub_no === 1のレコードからraw_labelを取得
          const rawLabels = invoice.line_items
            .filter(item => item.raw_label && (!item.sub_no || item.sub_no === 1))
            .map(item => item.raw_label);

          if (!invoice.remarks && rawLabels.length === 0) return null;

          return (
            <div className="p-6 border-t border-gray-200 bg-yellow-50">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">メモ</h3>
              {invoice.remarks && (
                <p className="text-gray-900 whitespace-pre-wrap mb-4">{invoice.remarks}</p>
              )}
              {rawLabels.length > 0 && (
                <>
                  <div className="text-xs text-gray-500 mt-2 mb-1">旧システム明細内容</div>
                  {rawLabels.map((label, idx) => (
                    <p key={idx} className="text-gray-700 text-sm">{label}</p>
                  ))}
                </>
              )}
            </div>
          );
        })()}
      </div>

      {/* 修正確認モーダル（月〆後） */}
      {showEditConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">修正伝票の作成</h3>
            <p className="text-gray-600 mb-4">
              この請求書は月〆処理済みのため、直接編集できません。
            </p>
            <p className="text-gray-600 mb-4">
              修正を行うと、赤伝（マイナス伝票）と黒伝（正しい金額の伝票）が自動生成されます。
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
              <p className="text-sm text-yellow-800">
                <strong>注意:</strong> 修正伝票は枝番が付与されます（例: {invoice.invoice_id} → {invoice.invoice_id.split('-')[0]}-{parseInt(invoice.invoice_id.split('-')[1] || '1') + 1}）
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowEditConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                キャンセル
              </button>
              <button
                onClick={() => {
                  setShowEditConfirm(false);
                  router.push(`/invoice-create?edit=${invoice.invoice_id}&revision=true`);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                修正伝票を作成
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 削除確認モーダル */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-red-600 mb-4">請求書の削除</h3>
            {(invoice as any).closed_at ? (
              <>
                <p className="text-gray-600 mb-4">
                  この請求書は月〆処理済みのため、直接削除できません。
                </p>
                <p className="text-gray-600 mb-4">
                  削除を行うと、赤伝（マイナス伝票）が発行され、この請求書は相殺されます。
                </p>
                <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
                  <p className="text-sm text-red-800">
                    <strong>発行される赤伝:</strong><br />
                    請求書番号: {invoice.invoice_id.split('-')[0]}-{parseInt(invoice.invoice_id.split('-')[1] || '1') + 1}<br />
                    金額: -{(invoice.total || 0).toLocaleString()}円
                  </p>
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-600 mb-4">
                  この請求書を削除しますか？
                </p>
                <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
                  <p className="text-sm text-red-800">
                    <strong>注意:</strong> この操作は取り消せません。請求書番号 {invoice.invoice_id} が削除されます。
                  </p>
                </div>
              </>
            )}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                キャンセル
              </button>
              <button
                onClick={async () => {
                  setShowDeleteConfirm(false);
                  if ((invoice as any).closed_at) {
                    // 月〆後: 赤伝処理
                    router.push(`/invoice-create?delete=${invoice.invoice_id}&red=true`);
                  } else {
                    // 月〆前: 直接削除
                    if (confirm('本当に削除しますか？')) {
                      const { error } = await supabase
                        .from('invoices')
                        .delete()
                        .eq('invoice_id', invoice.invoice_id);

                      if (error) {
                        alert('削除に失敗しました: ' + error.message);
                      } else {
                        // 明細も削除
                        await supabase
                          .from('invoice_line_items')
                          .delete()
                          .eq('invoice_id', invoice.invoice_id);

                        alert('請求書を削除しました');
                        router.push('/invoice-list');
                      }
                    }
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                {(invoice as any).closed_at ? '赤伝を発行' : '削除する'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}