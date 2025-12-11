'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, Trash2, Settings, Users, ChevronDown, ChevronUp } from 'lucide-react';
import {
  useInvoicePrintSettings,
  HEADER_ITEMS,
  FOOTER_ITEMS,
  LAYOUTS,
  HeaderItemId,
  FooterItemId,
  LayoutId,
} from '@/hooks/useInvoicePrintSettings';

export default function InvoicePrintSettingsPage() {
  const router = useRouter();
  const {
    globalSettings,
    customerSettings,
    loading,
    error,
    updateGlobalSettings,
    upsertCustomerSettings,
    deleteCustomerSettings,
  } = useInvoicePrintSettings();

  // UI状態
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);
  const [newCustomerName, setNewCustomerName] = useState('');

  // グローバル設定の一時状態
  const [tempGlobalLayout, setTempGlobalLayout] = useState<LayoutId | null>(null);
  const [tempGlobalHeader, setTempGlobalHeader] = useState<HeaderItemId[] | null>(null);
  const [tempGlobalFooter, setTempGlobalFooter] = useState<FooterItemId[] | null>(null);

  // 初期値を設定
  const currentGlobalLayout = tempGlobalLayout ?? globalSettings?.default_layout ?? 'minimal';
  const currentGlobalHeader = tempGlobalHeader ?? globalSettings?.header_items ?? [];
  const currentGlobalFooter = tempGlobalFooter ?? globalSettings?.footer_items ?? [];

  // グローバル設定を保存
  const handleSaveGlobal = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await updateGlobalSettings({
        default_layout: currentGlobalLayout,
        header_items: currentGlobalHeader,
        footer_items: currentGlobalFooter,
      });
      setMessage({ type: 'success', text: 'グローバル設定を保存しました' });
      setTempGlobalLayout(null);
      setTempGlobalHeader(null);
      setTempGlobalFooter(null);
    } catch {
      setMessage({ type: 'error', text: '保存に失敗しました' });
    }
    setSaving(false);
  };

  // 顧客別設定を追加
  const handleAddCustomer = async () => {
    if (!newCustomerName.trim()) return;
    setSaving(true);
    try {
      await upsertCustomerSettings({
        customer_name: newCustomerName.trim(),
        layout: null,
        header_items: null,
        footer_items: null,
      });
      setNewCustomerName('');
      setMessage({ type: 'success', text: '顧客設定を追加しました' });
    } catch {
      setMessage({ type: 'error', text: '追加に失敗しました' });
    }
    setSaving(false);
  };

  // 顧客別設定を更新
  const handleUpdateCustomer = async (customerName: string, layout: LayoutId | null) => {
    setSaving(true);
    try {
      await upsertCustomerSettings({
        customer_name: customerName,
        layout,
        header_items: null,
        footer_items: null,
      });
      setMessage({ type: 'success', text: '顧客設定を更新しました' });
    } catch {
      setMessage({ type: 'error', text: '更新に失敗しました' });
    }
    setSaving(false);
  };

  // 顧客別設定を削除
  const handleDeleteCustomer = async (customerName: string) => {
    if (!confirm(`「${customerName}」の設定を削除しますか？`)) return;
    setSaving(true);
    try {
      await deleteCustomerSettings(customerName);
      setMessage({ type: 'success', text: '顧客設定を削除しました' });
    } catch {
      setMessage({ type: 'error', text: '削除に失敗しました' });
    }
    setSaving(false);
  };

  // チェックボックスのトグル
  const toggleHeaderItem = (itemId: HeaderItemId) => {
    const current = tempGlobalHeader ?? globalSettings?.header_items ?? [];
    if (current.includes(itemId)) {
      setTempGlobalHeader(current.filter(id => id !== itemId));
    } else {
      setTempGlobalHeader([...current, itemId]);
    }
  };

  const toggleFooterItem = (itemId: FooterItemId) => {
    const current = tempGlobalFooter ?? globalSettings?.footer_items ?? [];
    if (current.includes(itemId)) {
      setTempGlobalFooter(current.filter(id => id !== itemId));
    } else {
      setTempGlobalFooter([...current, itemId]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-gray-800">請求書印刷設定</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* メッセージ */}
        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        {error && (
          <div className="p-4 rounded-lg bg-red-100 text-red-800">{error}</div>
        )}

        {/* グローバル設定 */}
        <section className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings size={20} className="text-blue-600" />
            <h2 className="text-lg font-semibold">グローバル設定（デフォルト）</h2>
          </div>

          {/* デフォルトレイアウト */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              デフォルトレイアウト
            </label>
            <select
              value={currentGlobalLayout}
              onChange={(e) => setTempGlobalLayout(e.target.value as LayoutId)}
              className="w-full md:w-64 border border-gray-300 rounded-lg px-3 py-2"
            >
              {LAYOUTS.map((layout) => (
                <option key={layout.id} value={layout.id}>
                  {layout.name} - {layout.description}
                </option>
              ))}
            </select>
          </div>

          {/* ヘッダー表示項目 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ヘッダー表示項目
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {HEADER_ITEMS.map((item) => (
                <label key={item.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentGlobalHeader.includes(item.id)}
                    onChange={() => toggleHeaderItem(item.id)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* フッター表示項目 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              フッター表示項目
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {FOOTER_ITEMS.map((item) => (
                <label key={item.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentGlobalFooter.includes(item.id)}
                    onChange={() => toggleFooterItem(item.id)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 保存ボタン */}
          <button
            onClick={handleSaveGlobal}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save size={16} />
            グローバル設定を保存
          </button>
        </section>

        {/* 顧客別設定 */}
        <section className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users size={20} className="text-green-600" />
            <h2 className="text-lg font-semibold">顧客別設定</h2>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            特定の顧客に対して、グローバル設定とは異なるレイアウトを適用できます。
            設定がない顧客にはグローバル設定が適用されます。
          </p>

          {/* 新規追加 */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newCustomerName}
              onChange={(e) => setNewCustomerName(e.target.value)}
              placeholder="顧客名を入力"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
            />
            <button
              onClick={handleAddCustomer}
              disabled={saving || !newCustomerName.trim()}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              <Plus size={16} />
              追加
            </button>
          </div>

          {/* 顧客一覧 */}
          <div className="space-y-2">
            {customerSettings.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                顧客別設定はありません
              </p>
            ) : (
              customerSettings.map((customer) => (
                <div
                  key={customer.customer_name}
                  className="border border-gray-200 rounded-lg"
                >
                  <div
                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
                    onClick={() =>
                      setExpandedCustomer(
                        expandedCustomer === customer.customer_name
                          ? null
                          : customer.customer_name
                      )
                    }
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{customer.customer_name}</span>
                      <span className="text-sm text-gray-500">
                        {customer.layout
                          ? LAYOUTS.find((l) => l.id === customer.layout)?.name
                          : 'グローバル設定を使用'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCustomer(customer.customer_name);
                        }}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                      {expandedCustomer === customer.customer_name ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </div>
                  </div>

                  {expandedCustomer === customer.customer_name && (
                    <div className="border-t border-gray-200 p-3 bg-gray-50">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        レイアウト
                      </label>
                      <select
                        value={customer.layout || ''}
                        onChange={(e) =>
                          handleUpdateCustomer(
                            customer.customer_name,
                            e.target.value ? (e.target.value as LayoutId) : null
                          )
                        }
                        className="w-full md:w-64 border border-gray-300 rounded-lg px-3 py-2"
                      >
                        <option value="">グローバル設定を使用</option>
                        {LAYOUTS.map((layout) => (
                          <option key={layout.id} value={layout.id}>
                            {layout.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
