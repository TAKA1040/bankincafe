'use client'

import { useProgressiveFilter } from '../../hooks/useProgressiveFilter'

export default function WorkEntryPage() {
  const {
    targets,
    availableActions,
    availablePositions,
    selectedTarget,
    selectedAction,
    selectedPosition,
    loading,
    error,
    handleTargetSelect,
    handleActionSelect,
    handlePositionSelect,
    reset
  } = useProgressiveFilter()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">読み込み中...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">作業項目入力</h1>
            <button
              onClick={reset}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              リセット
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700">エラー: {error}</p>
            </div>
          )}

          {/* 選択状況の表示 */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">選択状況</h2>
            <div className="space-y-2">
              <div>
                <span className="font-medium">対象:</span>{' '}
                {selectedTarget ? (
                  <span className="text-blue-700">{selectedTarget.name}</span>
                ) : (
                  <span className="text-gray-500">未選択</span>
                )}
              </div>
              <div>
                <span className="font-medium">動作:</span>{' '}
                {selectedAction ? (
                  <span className="text-blue-700">{selectedAction.name}</span>
                ) : (
                  <span className="text-gray-500">未選択</span>
                )}
              </div>
              <div>
                <span className="font-medium">位置:</span>{' '}
                {selectedPosition ? (
                  <span className="text-blue-700">{selectedPosition.name}</span>
                ) : (
                  <span className="text-gray-500">未選択</span>
                )}
              </div>
            </div>
          </div>

          {/* ステップ1: 対象選択 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. 対象を選択してください</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {targets.map((target) => (
                <button
                  key={target.id}
                  onClick={() => handleTargetSelect(target)}
                  className={`p-3 rounded-md border text-left transition-all ${
                    selectedTarget?.id === target.id
                      ? 'bg-blue-100 border-blue-500 text-blue-900'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  {target.name}
                </button>
              ))}
            </div>
          </div>

          {/* ステップ2: 動作選択 */}
          {selectedTarget && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                2. 「{selectedTarget.name}」の動作を選択してください
              </h2>
              {availableActions.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {availableActions.map((actionData) => (
                    <button
                      key={actionData.action_id}
                      onClick={() => handleActionSelect(actionData)}
                      className={`p-3 rounded-md border text-left transition-all ${
                        selectedAction?.id === actionData.action_id
                          ? 'bg-green-100 border-green-500 text-green-900'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                      }`}
                    >
                      {actionData.action_name}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">この対象に利用可能な動作がありません</div>
              )}
            </div>
          )}

          {/* ステップ3: 位置選択 */}
          {selectedTarget && selectedAction && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                3. 「{selectedTarget.name}」→「{selectedAction.name}」の位置を選択してください
              </h2>
              {availablePositions.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {availablePositions.map((positionData, index) => (
                    <button
                      key={`${positionData.target_id}-${positionData.action_id}-${positionData.position_id || 'null'}-${index}`}
                      onClick={() => handlePositionSelect(positionData)}
                      className={`p-3 rounded-md border text-left transition-all relative ${
                        selectedPosition?.id === positionData.position_id
                          ? 'bg-purple-100 border-purple-500 text-purple-900'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{positionData.position_name}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">
                            使用回数: {positionData.usage_count}
                          </span>
                          {positionData.is_recommended && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-1 rounded">
                              推奨
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">この組み合わせに利用可能な位置がありません</div>
              )}
            </div>
          )}

          {/* 確定ボタン */}
          {selectedTarget && selectedAction && selectedPosition && (
            <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-green-900">選択完了</h3>
                  <p className="text-green-700">
                    {selectedTarget.name} → {selectedAction.name} → {selectedPosition.name}
                  </p>
                </div>
                <button className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                  作業項目を登録
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}