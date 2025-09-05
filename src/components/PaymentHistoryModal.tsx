'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, CreditCard, Calendar, DollarSign, FileText } from 'lucide-react'
import { PaymentRecord, SalesInvoice } from '@/hooks/useSalesData'

interface PaymentHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  invoice: SalesInvoice | null
  onAddPayment?: (invoiceId: string, paymentData: {
    payment_date: string
    payment_amount: number
    payment_method?: string
    notes?: string
  }) => Promise<boolean>
}

export function PaymentHistoryModal({ 
  isOpen, 
  onClose, 
  invoice,
  onAddPayment 
}: PaymentHistoryModalProps) {
  if (!invoice) return null

  const formatCurrency = (amount: number): string => {
    return `¥${amount.toLocaleString()}`
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getPaymentMethodLabel = (method: string | null): string => {
    if (!method) return '未指定'
    
    const methodMap: { [key: string]: string } = {
      'bank_transfer': '銀行振込',
      'cash': '現金',
      'check': '小切手',
      'credit_card': 'クレジットカード',
      '一括更新': '一括更新',
      'other': 'その他'
    }
    
    return methodMap[method] || method
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 flex items-center"
                  >
                    <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                    入金履歴 - {invoice.invoice_id}
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={onClose}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* 請求書基本情報 */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">顧客名:</span>
                      <div className="font-medium">{invoice.customer_name || '不明'}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">件名:</span>
                      <div className="font-medium">{invoice.subject_name || invoice.subject || '不明'}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">発行日:</span>
                      <div className="font-medium">
                        {invoice.issue_date ? formatDate(invoice.issue_date) : '不明'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 支払い状況サマリー */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <DollarSign className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="text-sm text-blue-600 font-medium">請求金額</span>
                    </div>
                    <div className="text-lg font-semibold text-blue-900 mt-1">
                      {formatCurrency(invoice.total_amount)}
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <CreditCard className="w-5 h-5 text-green-600 mr-2" />
                      <span className="text-sm text-green-600 font-medium">入金合計</span>
                    </div>
                    <div className="text-lg font-semibold text-green-900 mt-1">
                      {formatCurrency(invoice.total_paid)}
                    </div>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-orange-600 mr-2" />
                      <span className="text-sm text-orange-600 font-medium">残額</span>
                    </div>
                    <div className="text-lg font-semibold text-orange-900 mt-1">
                      {formatCurrency(invoice.remaining_amount)}
                    </div>
                  </div>
                </div>

                {/* 入金履歴テーブル */}
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    入金履歴 ({invoice.payment_history.length}件)
                  </h4>
                  
                  {invoice.payment_history.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>入金履歴がありません</p>
                    </div>
                  ) : (
                    <div className="overflow-hidden border border-gray-200 rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              入金日
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              入金額
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              入金方法
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              備考
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {invoice.payment_history.map((payment, index) => (
                            <tr key={payment.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatDate(payment.payment_date)}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {formatCurrency(payment.payment_amount)}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                {getPaymentMethodLabel(payment.payment_method)}
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-500">
                                <div className="max-w-xs truncate" title={payment.notes || ''}>
                                  {payment.notes || '-'}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* アクションボタン */}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    onClick={onClose}
                  >
                    閉じる
                  </button>
                  
                  {onAddPayment && invoice.remaining_amount > 0 && (
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                      onClick={() => {
                        // TODO: 入金追加モーダルの実装
                        alert('入金追加機能は後で実装します')
                      }}
                    >
                      入金を追加
                    </button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}