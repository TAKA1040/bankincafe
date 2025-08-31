'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

// 現在のハードコーディングされたデータをインポート（実際は共通化が必要）
const TARGETS = ["タイヤ","ホイール","ライト","コーナーパネル","フラッシャー","バンパー","ライニング","スプリングシート"]
const ACTIONS = ["（指定なし）","交換","脱着","取付","修理","調整","点検","清掃","溶接","張替","入替","塗装","ASSY"]
const POSITIONS = ["右","左","前","後","右前","左前","右後","左後","左右","前後"]

const TARGET_ACTIONS = {
  "タイヤ": ["（指定なし）", "交換", "脱着", "点検"],
  "ホイール": ["（指定なし）", "脱着", "取付", "清掃"],
  "ライト": ["（指定なし）", "交換", "取付", "調整"],
  "コーナーパネル": ["（指定なし）", "脱着", "修理", "塗装"],
  "フラッシャー": ["（指定なし）", "取付", "交換"],
  "バンパー": ["（指定なし）", "修理", "塗装", "脱着"],
  "ライニング": ["（指定なし）", "張替", "修理"],
  "スプリングシート": ["（指定なし）", "溶接", "修理"]
}

const ACTION_POSITIONS = {
  "交換": ["右", "左", "前", "後", "右前", "左前", "右後", "左後"],
  "修理": ["右", "左", "前", "後", "右前", "左前", "右後", "左後"],
  "脱着": ["右", "左", "前", "後", "右前", "左前", "右後", "左後"],
  "点検": ["右", "左", "前", "後", "左右", "前後"],
  "取付": ["右", "左", "前", "後", "右前", "左前", "右後", "左後"],
  "調整": ["右", "左", "前", "後"],
  "清掃": ["右", "左", "前", "後", "左右", "前後"],
  "塗装": ["右", "左", "前", "後", "右前", "左前", "右後", "左後"],
  "張替": ["右", "左", "前", "後"],
  "溶接": ["右", "左", "前", "後", "右前", "左前", "右後", "左後"],
  "入替": ["右", "左", "前", "後"],
  "ASSY": ["右", "左", "前", "後"]
}

export default function RelationshipsPage() {
  const [selectedTarget, setSelectedTarget] = useState<string>("")
  const [selectedAction, setSelectedAction] = useState<string>("")

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <h1 className="text-2xl font-bold mb-6">作業項目の関連性確認</h1>
        <p className="text-gray-600 mb-6">
          現在のハードコーディングされた関連性を確認し、DB設計の参考にします
        </p>

        {/* 基本マスターデータ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">対象マスター ({TARGETS.length}件)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {TARGETS.map((target, index) => (
                  <button
                    key={target}
                    onClick={() => {
                      setSelectedTarget(target)
                      setSelectedAction("")
                    }}
                    className={`block w-full text-left p-2 rounded text-sm transition-colors ${
                      selectedTarget === target
                        ? 'bg-blue-100 text-blue-800 font-medium'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {index + 1}. {target}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">動作マスター ({ACTIONS.length}件)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {ACTIONS.map((action, index) => (
                  <button
                    key={action}
                    onClick={() => setSelectedAction(action)}
                    className={`block w-full text-left p-2 rounded text-sm transition-colors ${
                      selectedAction === action
                        ? 'bg-green-100 text-green-800 font-medium'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {index + 1}. {action}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">位置マスター ({POSITIONS.length}件)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {POSITIONS.map((position, index) => (
                  <div
                    key={position}
                    className="p-2 text-sm"
                  >
                    {index + 1}. {position}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 対象→動作の関連性 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">
              対象→動作の関連性 ({selectedTarget || "対象を選択してください"})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedTarget ? (
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  選択中: <span className="font-medium text-blue-600">{selectedTarget}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TARGET_ACTIONS[selectedTarget as keyof typeof TARGET_ACTIONS]?.map((action) => (
                    <button
                      key={action}
                      onClick={() => setSelectedAction(action)}
                      className={`px-3 py-1 text-sm border rounded transition-colors ${
                        selectedAction === action
                          ? 'bg-green-100 border-green-300 text-green-800'
                          : 'bg-gray-50 border-gray-200 hover:bg-green-50'
                      }`}
                    >
                      {action}
                    </button>
                  )) || (
                    <div className="text-sm text-gray-500">
                      この対象に関連する動作は定義されていません
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                左側の対象マスターから項目を選択してください
              </div>
            )}
          </CardContent>
        </Card>

        {/* 動作→位置の関連性 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              動作→位置の関連性 ({selectedAction || "動作を選択してください"})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedAction ? (
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  選択中: <span className="font-medium text-green-600">{selectedAction}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {ACTION_POSITIONS[selectedAction as keyof typeof ACTION_POSITIONS]?.map((position) => (
                    <div
                      key={position}
                      className="px-3 py-1 text-sm bg-purple-50 border border-purple-200 rounded text-purple-800"
                    >
                      {position}
                    </div>
                  )) || (
                    <div className="text-sm text-gray-500">
                      この動作に関連する位置は定義されていません
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                上の動作マスターまたは関連動作から項目を選択してください
              </div>
            )}
          </CardContent>
        </Card>

        {/* DB設計情報 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-base">DB設計に必要な項目</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">マスターテーブル</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• targets (対象マスター): id, name, sort_order</li>
                  <li>• actions (動作マスター): id, name, sort_order</li>
                  <li>• positions (位置マスター): id, name, sort_order</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">関連テーブル</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• target_actions: target_id, action_id</li>
                  <li>• action_positions: action_id, position_id</li>
                  <li>• 価格情報: target_id, action_id, price</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}