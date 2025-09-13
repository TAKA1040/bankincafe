'use client'

import { useState, useEffect, useRef } from 'react'
import { useProgressiveFilter } from '../../hooks/useProgressiveFilter'

// あいまい検索用のユーティリティ関数
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[ァ-ヴ]/g, (match) => String.fromCharCode(match.charCodeAt(0) - 0x60))
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (match) => String.fromCharCode(match.charCodeAt(0) - 0xFEE0))
    .replace(/[　\s]/g, '')
}

const fuzzyMatch = (searchTerm: string, targetText: string): boolean => {
  if (!searchTerm.trim()) return true
  const normalizedSearch = normalizeText(searchTerm)
  const normalizedTarget = normalizeText(targetText)
  return normalizedTarget.includes(normalizedSearch)
}

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

  // 検索状態
  const [targetSearch, setTargetSearch] = useState('')
  const [actionSearch, setActionSearch] = useState('')
  const [positionSearch, setPositionSearch] = useState('')

  // キーボード選択状態
  const [selectedTargetIndex, setSelectedTargetIndex] = useState(-1)
  const [selectedActionIndex, setSelectedActionIndex] = useState(-1)
  const [selectedPositionIndex, setSelectedPositionIndex] = useState(-1)

  // Ref for scroll
  const targetRefs = useRef<(HTMLButtonElement | null)[]>([])
  const actionRefs = useRef<(HTMLButtonElement | null)[]>([])
  const positionRefs = useRef<(HTMLButtonElement | null)[]>([])

  // フィルタされたデータ
  const filteredTargets = targets.filter(target => fuzzyMatch(targetSearch, target.name))
  const filteredActions = availableActions.filter(action => fuzzyMatch(actionSearch, action.action_name))
  const filteredPositions = availablePositions.filter(position => fuzzyMatch(positionSearch, position.position_name))

  // 検索リセット時にキーボード選択もリセット
  useEffect(() => {
    setSelectedTargetIndex(-1)
  }, [targetSearch])

  useEffect(() => {
    setSelectedActionIndex(-1)
  }, [actionSearch])

  useEffect(() => {
    setSelectedPositionIndex(-1)
  }, [positionSearch])

  // キーボード選択時のオートスクロール
  useEffect(() => {
    if (selectedTargetIndex >= 0 && targetRefs.current[selectedTargetIndex]) {
      console.log('Target scroll:', selectedTargetIndex, targetRefs.current[selectedTargetIndex])
      scrollToElement(targetRefs.current[selectedTargetIndex])
    }
  }, [selectedTargetIndex])

  useEffect(() => {
    if (selectedActionIndex >= 0 && actionRefs.current[selectedActionIndex]) {
      console.log('Action scroll:', selectedActionIndex, actionRefs.current[selectedActionIndex])
      scrollToElement(actionRefs.current[selectedActionIndex])
    }
  }, [selectedActionIndex])

  useEffect(() => {
    if (selectedPositionIndex >= 0 && positionRefs.current[selectedPositionIndex]) {
      console.log('Position scroll:', selectedPositionIndex, positionRefs.current[selectedPositionIndex])
      scrollToElement(positionRefs.current[selectedPositionIndex])
    }
  }, [selectedPositionIndex])

  // オートスクロール機能
  const scrollToElement = (element: HTMLElement | null) => {
    if (element) {
      // より確実にスクロールするために複数の方法を試す
      setTimeout(() => {
        // 方法1: scrollIntoViewで即座にスクロール
        element.scrollIntoView({
          behavior: 'auto',
          block: 'center',
          inline: 'nearest'
        })
        
        // 方法2: 親要素からの直接スクロール
        const rect = element.getBoundingClientRect()
        const container = element.closest('.overflow-auto, .overflow-y-auto') || document.documentElement
        
        if (rect.top < 0 || rect.bottom > window.innerHeight) {
          container.scrollTop = container.scrollTop + rect.top - window.innerHeight / 2
        }
        
        // 方法3: スムーズスクロールで仕上げ
        setTimeout(() => {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
          })
        }, 100)
      }, 0)
    }
  }

  // キーボードイベントハンドラ
  const handleKeyDown = (e: React.KeyboardEvent, type: 'target' | 'action' | 'position') => {
    const isTarget = type === 'target'
    const isAction = type === 'action'
    const isPosition = type === 'position'

    const currentIndex = isTarget ? selectedTargetIndex : isAction ? selectedActionIndex : selectedPositionIndex
    const filteredData = isTarget ? filteredTargets : isAction ? filteredActions : filteredPositions
    const refs = isTarget ? targetRefs.current : isAction ? actionRefs.current : positionRefs.current

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        const nextIndex = currentIndex === -1 ? 0 : Math.min(currentIndex + 1, filteredData.length - 1)
        if (isTarget) setSelectedTargetIndex(nextIndex)
        else if (isAction) setSelectedActionIndex(nextIndex)
        else setSelectedPositionIndex(nextIndex)
        break

      case 'ArrowUp':
        e.preventDefault()
        const prevIndex = currentIndex === -1 ? 0 : Math.max(currentIndex - 1, 0)
        if (isTarget) setSelectedTargetIndex(prevIndex)
        else if (isAction) setSelectedActionIndex(prevIndex)
        else setSelectedPositionIndex(prevIndex)
        break

      case 'Enter':
        e.preventDefault()
        if (currentIndex >= 0 && currentIndex < filteredData.length) {
          const selectedItem = filteredData[currentIndex]
          if (isTarget) {
            handleTargetSelect(selectedItem as any)
            setTargetSearch('')
            setSelectedTargetIndex(-1)
          } else if (isAction) {
            handleActionSelect(selectedItem as any)
            setActionSearch('')
            setSelectedActionIndex(-1)
          } else {
            handlePositionSelect(selectedItem as any)
            setPositionSearch('')
            setSelectedPositionIndex(-1)
          }
        }
        break

      case 'Escape':
        e.preventDefault()
        if (isTarget) {
          setTargetSearch('')
          setSelectedTargetIndex(-1)
        } else if (isAction) {
          setActionSearch('')
          setSelectedActionIndex(-1)
        } else {
          setPositionSearch('')
          setSelectedPositionIndex(-1)
        }
        break
    }
  }

  const handleReset = () => {
    reset()
    setTargetSearch('')
    setActionSearch('')
    setPositionSearch('')
    setSelectedTargetIndex(-1)
    setSelectedActionIndex(-1)
    setSelectedPositionIndex(-1)
  }

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
              onClick={handleReset}
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
            
            {/* 検索フィールド */}
            <div className="mb-4">
              <input
                type="text"
                value={targetSearch}
                onChange={(e) => setTargetSearch(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 'target')}
                placeholder="対象を検索... (ひらがな・カタカナ・英数字で検索可能)"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredTargets.map((target, index) => (
                <button
                  key={target.id}
                  ref={(el) => (targetRefs.current[index] = el)}
                  onClick={() => {
                    handleTargetSelect(target)
                    setTargetSearch('')
                    setSelectedTargetIndex(-1)
                  }}
                  className={`p-3 rounded-md border text-left transition-all ${
                    selectedTarget?.id === target.id
                      ? 'bg-blue-100 border-blue-500 text-blue-900'
                      : index === selectedTargetIndex
                      ? 'bg-gray-100 border-gray-500 text-gray-900'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  {target.name}
                </button>
              ))}
            </div>
            
            {filteredTargets.length === 0 && targetSearch && (
              <div className="text-center text-gray-500 mt-4">「{targetSearch}」に一致する対象が見つかりません</div>
            )}
          </div>

          {/* ステップ2: 動作選択 */}
          {selectedTarget && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                2. 「{selectedTarget.name}」の動作を選択してください
              </h2>
              
              {/* 検索フィールド */}
              <div className="mb-4">
                <input
                  type="text"
                  value={actionSearch}
                  onChange={(e) => setActionSearch(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, 'action')}
                  placeholder="動作を検索... (ひらがな・カタカナ・英数字で検索可能)"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {availableActions.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {filteredActions.map((actionData, index) => (
                      <button
                        key={actionData.action_id}
                        ref={(el) => (actionRefs.current[index] = el)}
                        onClick={() => {
                          handleActionSelect(actionData)
                          setActionSearch('')
                          setSelectedActionIndex(-1)
                        }}
                        className={`p-3 rounded-md border text-left transition-all ${
                          selectedAction?.id === actionData.action_id
                            ? 'bg-green-100 border-green-500 text-green-900'
                            : index === selectedActionIndex
                            ? 'bg-gray-100 border-gray-500 text-gray-900'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                        }`}
                      >
                        {actionData.action_name}
                      </button>
                    ))}
                  </div>
                  
                  {filteredActions.length === 0 && actionSearch && (
                    <div className="text-center text-gray-500 mt-4">「{actionSearch}」に一致する動作が見つかりません</div>
                  )}
                </>
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
              
              {/* 検索フィールド */}
              <div className="mb-4">
                <input
                  type="text"
                  value={positionSearch}
                  onChange={(e) => setPositionSearch(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, 'position')}
                  placeholder="位置を検索... (ひらがな・カタカナ・英数字で検索可能)"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              {availablePositions.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {filteredPositions.map((positionData, index) => (
                      <button
                        key={`${positionData.target_id}-${positionData.action_id}-${positionData.position_id || 'null'}-${index}`}
                        ref={(el) => (positionRefs.current[index] = el)}
                        onClick={() => {
                          handlePositionSelect(positionData)
                          setPositionSearch('')
                          setSelectedPositionIndex(-1)
                        }}
                        className={`p-3 rounded-md border text-left transition-all relative ${
                          selectedPosition?.id === positionData.position_id
                            ? 'bg-purple-100 border-purple-500 text-purple-900'
                            : index === selectedPositionIndex
                            ? 'bg-gray-100 border-gray-500 text-gray-900'
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
                  
                  {filteredPositions.length === 0 && positionSearch && (
                    <div className="text-center text-gray-500 mt-4">「{positionSearch}」に一致する位置が見つかりません</div>
                  )}
                </>
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

          {/* キーボード操作ヘルプ */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="font-semibold text-blue-900 mb-2">⌨️ キーボード操作ガイド</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <h4 className="font-medium mb-1">検索フィールド内：</h4>
                <ul className="space-y-1">
                  <li>• <kbd className="px-1 bg-white rounded border">↑</kbd> <kbd className="px-1 bg-white rounded border">↓</kbd> 項目を選択</li>
                  <li>• <kbd className="px-1 bg-white rounded border">Enter</kbd> 選択確定</li>
                  <li>• <kbd className="px-1 bg-white rounded border">Esc</kbd> 検索をクリア</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-1">検索機能：</h4>
                <ul className="space-y-1">
                  <li>• ひらがな・カタカナ区別なし</li>
                  <li>• 大文字・小文字区別なし</li>
                  <li>• 全角・半角区別なし</li>
                  <li>• 部分一致検索対応</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}