'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, GripVertical, ChevronUp, ChevronDown, RotateCcw, Home, Users, Building2, ArrowUpCircle } from 'lucide-react'
import { dbClient, escapeValue } from '@/lib/db-client'

import { CustomerCategory, CustomerCategoryDB } from '@/lib/customer-categories'

// その他顧客の型定義
interface OtherCustomer {
  id: string
  customer_name: string
  customer_name_kana: string | null
  usage_count: number
  last_used_at: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function CustomerSettingsPage() {
  const router = useRouter()
  const [db] = useState(() => new CustomerCategoryDB())
  const [categories, setCategories] = useState<CustomerCategory[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newCategory, setNewCategory] = useState({ name: '', companyName: '' })
  const [showAddForm, setShowAddForm] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  // タブ状態
  const [activeTab, setActiveTab] = useState<'category' | 'other'>('category')

  // その他顧客の状態
  const [otherCustomers, setOtherCustomers] = useState<OtherCustomer[]>([])
  const [otherCustomersLoading, setOtherCustomersLoading] = useState(false)
  const [editingOtherId, setEditingOtherId] = useState<string | null>(null)
  const [newOtherCustomer, setNewOtherCustomer] = useState({ customer_name: '', customer_name_kana: '' })
  const [showAddOtherForm, setShowAddOtherForm] = useState(false)

  useEffect(() => {
    const initialCategories = db.getCategories()
    setCategories(initialCategories)
  }, [db])

  // その他顧客データを取得
  const fetchOtherCustomers = async () => {
    setOtherCustomersLoading(true)
    try {
      const result = await dbClient.executeSQL<OtherCustomer>(
        `SELECT * FROM "other_customers" ORDER BY "customer_name"`
      )
      if (!result.success) {
        console.error('その他顧客取得エラー:', result.error)
        return
      }
      setOtherCustomers(result.data?.rows || [])
    } catch (error) {
      console.error('その他顧客取得エラー:', error)
    } finally {
      setOtherCustomersLoading(false)
    }
  }

  // タブ切り替え時にデータ取得
  useEffect(() => {
    if (activeTab === 'other') {
      fetchOtherCustomers()
    }
  }, [activeTab])

  const handleSaveEdit = (id: string, name: string, companyName: string) => {
    if (name.trim() && companyName.trim()) {
      db.updateCategory(id, { name: name.trim(), companyName: companyName.trim() })

      const updatedCategories = db.getCategories()

      setCategories(updatedCategories)
      setEditingId(null)
    }
  }

  const handleAddCategory = () => {
    if (newCategory.name.trim() && newCategory.companyName.trim()) {
      db.addCategory({
        name: newCategory.name.trim(),
        companyName: newCategory.companyName.trim()
      })
      setCategories(db.getCategories())
      setNewCategory({ name: '', companyName: '' })
      setShowAddForm(false)
    }
  }

  const handleDeleteCategory = (id: string) => {
    if (confirm('この顧客カテゴリーを削除してもよろしいですか？')) {
      db.deleteCategory(id)
      setCategories(db.getCategories())
    }
  }

  const handleResetToDefaults = () => {
    if (confirm('顧客カテゴリーをデフォルト状態にリセットしますか？\n※カスタム追加したカテゴリーは削除されます')) {
      db.resetToDefaults()

      const resetCategories = db.getCategories()

      setCategories(resetCategories)
      setEditingId(null)
      setShowAddForm(false)
    }
  }

  const moveCategory = (index: number, direction: 'up' | 'down') => {
    const newCategories = [...categories]
    const targetIndex = direction === 'up' ? index - 1 : index + 1

    if (targetIndex >= 0 && targetIndex < newCategories.length) {
      [newCategories[index], newCategories[targetIndex]] = [newCategories[targetIndex], newCategories[index]]
      setCategories(newCategories)
      db.reorderCategories(newCategories)
    }
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === dropIndex) return

    const newCategories = [...categories]
    const draggedItem = newCategories[draggedIndex]
    newCategories.splice(draggedIndex, 1)
    newCategories.splice(dropIndex, 0, draggedItem)

    setCategories(newCategories)
    db.reorderCategories(newCategories)
    setDraggedIndex(null)
  }

  // その他顧客の追加
  const handleAddOtherCustomer = async () => {
    if (!newOtherCustomer.customer_name.trim()) return

    try {
      const customerName = escapeValue(newOtherCustomer.customer_name.trim())
      const customerNameKana = newOtherCustomer.customer_name_kana.trim()
        ? escapeValue(newOtherCustomer.customer_name_kana.trim())
        : 'NULL'

      const result = await dbClient.executeSQL(
        `INSERT INTO "other_customers" ("customer_name", "customer_name_kana", "usage_count") VALUES (${customerName}, ${customerNameKana}, 0)`
      )

      if (!result.success) {
        if (result.error?.includes('duplicate') || result.error?.includes('unique')) {
          alert('この顧客名は既に登録されています')
        } else {
          console.error('追加エラー:', result.error)
          alert('追加に失敗しました')
        }
        return
      }

      setNewOtherCustomer({ customer_name: '', customer_name_kana: '' })
      setShowAddOtherForm(false)
      fetchOtherCustomers()
    } catch (error) {
      console.error('追加エラー:', error)
    }
  }

  // その他顧客の編集保存
  const handleSaveOtherEdit = async (id: string, customer_name: string, customer_name_kana: string) => {
    if (!customer_name.trim()) return

    try {
      const customerNameVal = escapeValue(customer_name.trim())
      const customerNameKanaVal = customer_name_kana.trim()
        ? escapeValue(customer_name_kana.trim())
        : 'NULL'
      const updatedAt = escapeValue(new Date().toISOString())

      const result = await dbClient.executeSQL(
        `UPDATE "other_customers" SET "customer_name" = ${customerNameVal}, "customer_name_kana" = ${customerNameKanaVal}, "updated_at" = ${updatedAt} WHERE "id" = ${escapeValue(id)}`
      )

      if (!result.success) {
        console.error('更新エラー:', result.error)
        alert('更新に失敗しました')
        return
      }

      setEditingOtherId(null)
      fetchOtherCustomers()
    } catch (error) {
      console.error('更新エラー:', error)
    }
  }

  // その他顧客の削除
  const handleDeleteOtherCustomer = async (id: string, name: string) => {
    if (!confirm(`「${name}」を削除してもよろしいですか？`)) return

    try {
      const result = await dbClient.executeSQL(
        `DELETE FROM "other_customers" WHERE "id" = ${escapeValue(id)}`
      )

      if (!result.success) {
        console.error('削除エラー:', result.error)
        alert('削除に失敗しました')
        return
      }

      fetchOtherCustomers()
    } catch (error) {
      console.error('削除エラー:', error)
    }
  }

  // その他顧客の有効/無効切り替え
  const handleToggleOtherActive = async (id: string, currentActive: boolean) => {
    try {
      const newActive = !currentActive
      const updatedAt = escapeValue(new Date().toISOString())

      const result = await dbClient.executeSQL(
        `UPDATE "other_customers" SET "is_active" = ${newActive}, "updated_at" = ${updatedAt} WHERE "id" = ${escapeValue(id)}`
      )

      if (!result.success) {
        console.error('更新エラー:', result.error)
        return
      }

      fetchOtherCustomers()
    } catch (error) {
      console.error('更新エラー:', error)
    }
  }

  // その他顧客をカテゴリに昇格
  const handlePromoteToCategory = async (customer: OtherCustomer) => {
    const confirmMessage = `「${customer.customer_name}」を顧客カテゴリに昇格しますか？\n\n` +
      `・顧客カテゴリとして選択可能になります\n` +
      `・既存の請求書データのカテゴリも更新されます\n` +
      `・集計時もカテゴリとして集計されます`

    if (!confirm(confirmMessage)) return

    try {
      // 1. CustomerCategoryDBに新しいカテゴリを追加
      db.addCategory({
        name: customer.customer_name,
        companyName: customer.customer_name
      })
      setCategories(db.getCategories())

      // 2. 既存の請求書データを更新（その他 + この顧客名 → 新カテゴリ）
      const customerName = escapeValue(customer.customer_name)
      const updateResult = await dbClient.executeSQL(
        `UPDATE "invoices" SET "customer_category" = ${customerName} WHERE "customer_category" = 'その他' AND "customer_name" = ${customerName}`
      )

      if (!updateResult.success) {
        console.error('請求書更新エラー:', updateResult.error)
        alert('請求書データの更新に失敗しました。カテゴリは追加されましたが、既存データは手動で更新が必要です。')
      }

      // 3. other_customersを無効化
      const updatedAt = escapeValue(new Date().toISOString())
      const deactivateResult = await dbClient.executeSQL(
        `UPDATE "other_customers" SET "is_active" = FALSE, "updated_at" = ${updatedAt} WHERE "id" = ${escapeValue(customer.id)}`
      )

      if (!deactivateResult.success) {
        console.error('その他顧客無効化エラー:', deactivateResult.error)
      }

      // 更新数を取得して通知
      const countResult = await dbClient.executeSQL<{ count: number }>(
        `SELECT COUNT(*) as count FROM "invoices" WHERE "customer_category" = ${customerName}`
      )
      const count = countResult.data?.rows?.[0]?.count || 0

      alert(`「${customer.customer_name}」をカテゴリに昇格しました！\n\n` +
        `・カテゴリ一覧に追加されました\n` +
        `・${count}件の請求書データが更新されました`)

      // データ再取得
      fetchOtherCustomers()
    } catch (error) {
      console.error('昇格処理エラー:', error)
      alert('昇格処理中にエラーが発生しました')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <header className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Edit2 className="text-blue-600" size={32} />
              <h1 className="text-2xl font-bold text-gray-800">顧客設定</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Home size={20} />
                メニューへ
              </button>
            </div>
          </div>
        </header>

        {/* タブ */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('category')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'category'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <Building2 size={20} />
              顧客カテゴリー
            </button>
            <button
              onClick={() => setActiveTab('other')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'other'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <Users size={20} />
              その他顧客
            </button>
          </div>
        </div>

        {/* 顧客カテゴリータブ */}
        {activeTab === 'category' && (
          <>
            {/* 操作ボタン */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Plus size={20} />
                新規追加
              </button>
              <button
                onClick={handleResetToDefaults}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
              >
                <RotateCcw size={20} />
                リセット
              </button>
            </div>

            {/* 説明 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm">
                <strong>顧客カテゴリー設定について:</strong><br />
                ここで設定したカテゴリーは請求書作成時に選択できるようになります。<br />
                カテゴリーを選択すると、対応する会社名が自動で顧客名に入力されます。<br />
                <strong>順序変更:</strong> ドラッグ&ドロップまたは矢印ボタンで表示順序を変更できます。
              </p>
            </div>

            {/* 新規追加フォーム */}
            {showAddForm && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-green-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">新しい顧客カテゴリーを追加</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリー名</label>
                    <input
                      type="text"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                      placeholder="例: ABC商事"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">会社名（正式名称）</label>
                    <input
                      type="text"
                      value={newCategory.companyName}
                      onChange={(e) => setNewCategory({...newCategory, companyName: e.target.value})}
                      placeholder="例: 株式会社ABCコマース"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddCategory}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <Save size={16} />
                    追加
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false)
                      setNewCategory({ name: '', companyName: '' })
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2"
                  >
                    <X size={16} />
                    キャンセル
                  </button>
                </div>
              </div>
            )}

            {/* カテゴリー一覧 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-800">登録済みカテゴリー</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">順序</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">カテゴリー名</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">会社名</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">種別</th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">操作</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categories.map((category, index) => (
                      <tr
                        key={category.id}
                        className={`hover:bg-gray-50 transition-colors ${
                          draggedIndex === index ? 'opacity-50' : ''
                        }`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <GripVertical
                              className="text-gray-400 cursor-grab active:cursor-grabbing"
                              size={16}
                            />
                            <div className="flex flex-col gap-1">
                              <button
                                onClick={() => moveCategory(index, 'up')}
                                disabled={index === 0}
                                className={`p-1 rounded ${
                                  index === 0
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                                }`}
                                title="上に移動"
                              >
                                <ChevronUp size={12} />
                              </button>
                              <button
                                onClick={() => moveCategory(index, 'down')}
                                disabled={index === categories.length - 1}
                                className={`p-1 rounded ${
                                  index === categories.length - 1
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                                }`}
                                title="下に移動"
                              >
                                <ChevronDown size={12} />
                              </button>
                            </div>
                            <span className="text-sm text-gray-500 font-mono">#{index + 1}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {editingId === category.id ? (
                            <input
                              type="text"
                              defaultValue={category.name}
                              data-name-for={category.id}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            />
                          ) : (
                            <div className="text-sm font-medium text-gray-900">{category.name}</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {editingId === category.id ? (
                            <input
                              type="text"
                              defaultValue={category.companyName}
                              data-company-for={category.id}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            />
                          ) : (
                            <div className="text-sm text-gray-700">{category.companyName || '（手動入力）'}</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            category.isDefault
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {category.isDefault ? 'システム標準' : 'カスタム'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center gap-2">
                            {editingId === category.id ? (
                              <button
                                onClick={() => {
                                  const nameInput = typeof document !== 'undefined' ? document.querySelector(`input[data-name-for="${category.id}"]`) as HTMLInputElement : null
                                  const companyInput = typeof document !== 'undefined' ? document.querySelector(`input[data-company-for="${category.id}"]`) as HTMLInputElement : null
                                  if (nameInput && companyInput) {
                                    handleSaveEdit(category.id, nameInput.value, companyInput.value)
                                  }
                                }}
                                className="p-1 text-green-600 hover:bg-green-50 rounded"
                                title="保存"
                              >
                                <Save size={16} />
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingId(category.id)
                                }}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                title="編集"
                              >
                                <Edit2 size={16} />
                              </button>
                            )}

                            {!category.isDefault && (
                              <button
                                onClick={() => handleDeleteCategory(category.id)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                title="削除"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {categories.length === 0 && (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center text-gray-500">
                顧客カテゴリーがありません。新規追加ボタンから追加してください。
              </div>
            )}
          </>
        )}

        {/* その他顧客タブ */}
        {activeTab === 'other' && (
          <>
            {/* 操作ボタン */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setShowAddOtherForm(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Plus size={20} />
                新規追加
              </button>
            </div>

            {/* 説明 */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <p className="text-purple-800 text-sm">
                <strong>その他顧客について:</strong><br />
                「その他」カテゴリーで入力した顧客名はここで管理されます。<br />
                請求書を確定すると自動的に登録され、次回からサジェストに表示されます。<br />
                <strong>昇格機能:</strong> よく使う顧客は「顧客カテゴリ」に昇格できます。昇格すると、集計時もカテゴリとして扱われます。
              </p>
            </div>

            {/* 新規追加フォーム */}
            {showAddOtherForm && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-green-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">その他顧客を追加</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">顧客名 <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={newOtherCustomer.customer_name}
                      onChange={(e) => setNewOtherCustomer({...newOtherCustomer, customer_name: e.target.value})}
                      placeholder="例: 山田自動車"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">顧客名（かな）</label>
                    <input
                      type="text"
                      value={newOtherCustomer.customer_name_kana}
                      onChange={(e) => setNewOtherCustomer({...newOtherCustomer, customer_name_kana: e.target.value})}
                      placeholder="例: やまだじどうしゃ"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddOtherCustomer}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <Save size={16} />
                    追加
                  </button>
                  <button
                    onClick={() => {
                      setShowAddOtherForm(false)
                      setNewOtherCustomer({ customer_name: '', customer_name_kana: '' })
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2"
                  >
                    <X size={16} />
                    キャンセル
                  </button>
                </div>
              </div>
            )}

            {/* その他顧客一覧 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-800">
                  登録済みその他顧客
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({otherCustomers.length}件)
                  </span>
                </h2>
              </div>

              {otherCustomersLoading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-500">読み込み中...</p>
                </div>
              ) : otherCustomers.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  その他顧客はまだ登録されていません。<br />
                  請求書作成時に「その他」カテゴリーで顧客名を入力し確定すると自動登録されます。
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">顧客名</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">かな</th>
                        <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">使用回数</th>
                        <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">状態</th>
                        <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">操作</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {otherCustomers.map((customer) => (
                        <tr
                          key={customer.id}
                          className={`hover:bg-gray-50 transition-colors ${!customer.is_active ? 'opacity-50' : ''}`}
                        >
                          <td className="px-6 py-4">
                            {editingOtherId === customer.id ? (
                              <input
                                type="text"
                                defaultValue={customer.customer_name}
                                data-other-name-for={customer.id}
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                              />
                            ) : (
                              <div className="text-sm font-medium text-gray-900">{customer.customer_name}</div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {editingOtherId === customer.id ? (
                              <input
                                type="text"
                                defaultValue={customer.customer_name_kana || ''}
                                data-other-kana-for={customer.id}
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                              />
                            ) : (
                              <div className="text-sm text-gray-500">{customer.customer_name_kana || '-'}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="text-sm text-gray-700">{customer.usage_count}回</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleToggleOtherActive(customer.id, customer.is_active)}
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                customer.is_active
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {customer.is_active ? '有効' : '無効'}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center gap-2">
                              {editingOtherId === customer.id ? (
                                <button
                                  onClick={() => {
                                    const nameInput = document.querySelector(`input[data-other-name-for="${customer.id}"]`) as HTMLInputElement
                                    const kanaInput = document.querySelector(`input[data-other-kana-for="${customer.id}"]`) as HTMLInputElement
                                    if (nameInput) {
                                      handleSaveOtherEdit(customer.id, nameInput.value, kanaInput?.value || '')
                                    }
                                  }}
                                  className="p-1 text-green-600 hover:bg-green-50 rounded"
                                  title="保存"
                                >
                                  <Save size={16} />
                                </button>
                              ) : (
                                <>
                                  <button
                                    onClick={() => setEditingOtherId(customer.id)}
                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                    title="編集"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  {customer.is_active && (
                                    <button
                                      onClick={() => handlePromoteToCategory(customer)}
                                      className="p-1 text-purple-600 hover:bg-purple-50 rounded"
                                      title="カテゴリに昇格"
                                    >
                                      <ArrowUpCircle size={16} />
                                    </button>
                                  )}
                                </>
                              )}
                              <button
                                onClick={() => handleDeleteOtherCustomer(customer.id, customer.customer_name)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                title="削除"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
