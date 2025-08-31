'use client'

import { useState, useMemo, useEffect } from 'react'
import { Input } from '@/components/ui/Input'
import { WorkItemDB, WorkItem, WorkItemSuggestion } from '@/components/work-entry/WorkItemDB'

// 基本データ
const TARGETS = ["タイヤ", "ホイール", "ライト", "コーナーパネル", "フラッシャー", "バンパー", "ライニング", "スプリングシート", "フレーム", "サイドパネル", "ハンパー"];
const ACTIONS = ["（指定なし）", "交換", "修理", "脱着", "点検", "調整", "清掃", "塗装", "張替", "溶接", "取付", "入替", "ASSY"];
const POSITIONS = ["右", "左", "前", "後", "上", "下", "内側", "外側", "右前", "左前", "右後", "左後", "左右", "前後"];

// 対象別の可能な動作の組み合わせ（プロトタイプからの高度な機能）
const TARGET_ACTIONS: { [key: string]: string[] } = {
  "タイヤ": ["（指定なし）", "交換", "脱着", "点検"],
  "ホイール": ["（指定なし）", "脱着", "取付", "清掃"],
  "ライト": ["（指定なし）", "交換", "取付", "調整"],
  "コーナーパネル": ["（指定なし）", "脱着", "修理", "塗装"],
  "フラッシャー": ["（指定なし）", "取付", "交換"],
  "バンパー": ["（指定なし）", "修理", "塗装", "脱着"],
  "ライニング": ["（指定なし）", "張替", "修理"],
  "スプリングシート": ["（指定なし）", "溶接", "修理"],
  "フレーム": ["（指定なし）", "修理", "溶接", "交換"],
  "サイドパネル": ["（指定なし）", "修理", "塗装", "脱着"],
  "ハンパー": ["（指定なし）", "修理", "交換"]
}

// 読み仮名マッピング（プロトタイプからの高度な検索機能）
const READING_MAP: { [key: string]: string[] } = {
  "交換": ["こうかん", "コウカン"],
  "修理": ["しゅうり", "シュウリ"],
  "脱着": ["だっちゃく", "ダッチャク"],
  "点検": ["てんけん", "テンケン"],
  "取付": ["とりつけ", "トリツケ"],
  "清掃": ["せいそう", "セイソウ"],
  "調整": ["ちょうせい", "チョウセイ"],
  "塗装": ["とそう", "トソウ"],
  "張替": ["はりかえ", "ハリカエ"],
  "溶接": ["ようせつ", "ヨウセツ"],
  "入替": ["いれかえ", "イレカエ"],
  "右": ["みぎ", "ミギ"],
  "左": ["ひだり", "ヒダリ"],
  "前": ["まえ", "マエ"],
  "後": ["うしろ", "ウシロ", "あと", "アト"],
  "右前": ["みぎまえ", "ミギマエ"],
  "左前": ["ひだりまえ", "ヒダリマエ"],
  "右後": ["みぎうしろ", "ミギウシロ"],
  "左後": ["ひだりうしろ", "ヒダリウシロ"]
}

// 読み仮名検索用のヘルパー関数
function matchesReading(term: string, keyword: string): boolean {
  const readings = READING_MAP[term] || []
  return readings.some(reading => 
    reading.toLowerCase().includes(keyword.toLowerCase())
  )
}

// 高度なフィルタリング：対象に基づいて動作を絞り込む
function getFilteredActions(target: string, keyword: string = ''): string[] {
  let availableActions = ACTIONS
  
  // 対象が選択されている場合、関連する動作のみ表示
  if (target && TARGET_ACTIONS[target]) {
    availableActions = TARGET_ACTIONS[target]
  }
  
  // キーワード検索（読み仮名対応）
  if (keyword.trim()) {
    const normalizedKeyword = keyword.toLowerCase()
    return availableActions.filter(action => 
      action.toLowerCase().includes(normalizedKeyword) ||
      matchesReading(action, keyword)
    )
  }
  
  return availableActions
}

export default function WorkEntryTestPage() {
  // WorkItemDBインスタンス
  const workDB = useMemo(() => new WorkItemDB(), [])
  
  // フォーム状態
  const [target, setTarget] = useState('')
  const [action, setAction] = useState('')
  const [position, setPosition] = useState('')
  const [memo, setMemo] = useState('')
  const [unitPrice, setUnitPrice] = useState<number | undefined>(undefined)
  const [quantity, setQuantity] = useState(1)
  
  // 保存された項目の状態
  const [items, setItems] = useState<WorkItem[]>([])
  
  // サジェスト表示状態
  const [showTargetSuggestions, setShowTargetSuggestions] = useState(false)
  const [showActionSuggestions, setShowActionSuggestions] = useState(false)
  const [showPositionSuggestions, setShowPositionSuggestions] = useState(false)
  
  // キーボードナビゲーション用インデックス
  const [selectedTargetIndex, setSelectedTargetIndex] = useState(-1)
  const [selectedActionIndex, setSelectedActionIndex] = useState(-1)
  const [selectedPositionIndex, setSelectedPositionIndex] = useState(-1)
  
  // 高度なファジー検索関数（prototypeから移植）
  function advancedFuzzySearch(keyword: string, targetList: string[]): string[] {
    if (!keyword.trim()) return targetList.slice(0, 8) // 空の場合は全リストから8個表示
    
    const normalizedKeyword = keyword.toLowerCase()
    return targetList
      .filter(item => {
        const normalizedItem = item.toLowerCase()
        
        // 直接マッチング
        let matches = normalizedItem.includes(normalizedKeyword)
        
        // 読み仮名でのマッチング
        if (!matches && READING_MAP[item]) {
          matches = READING_MAP[item].some(reading => {
            return reading.toLowerCase().includes(normalizedKeyword)
          })
        }
        
        return matches
      })
      .slice(0, 8)
  }

  // サジェストデータ（prototypeベース + 学習データ統合）
  const targetSuggestions = useMemo(() => {
    // マスタデータからのサジェスト
    const masterSuggestions = advancedFuzzySearch(target, TARGETS)
    
    // 学習データからのサジェスト（入力がある場合のみ）
    const learnedSuggestions = target.trim() 
      ? workDB.getTargetSuggestions(target).map(s => s.value)
      : []
    
    // マージして重複除去
    const combined = [...new Set([...masterSuggestions, ...learnedSuggestions])]
    return combined.slice(0, 8)
  }, [target, workDB])
  
  // 対象に基づく利用可能な動作（prototypeロジック）
  const availableActions = useMemo(() => {
    if (!target || !(target in TARGET_ACTIONS)) return ACTIONS
    return TARGET_ACTIONS[target as keyof typeof TARGET_ACTIONS]
  }, [target])
  
  const actionSuggestions = useMemo(() => {
    // 利用可能な動作から検索
    const masterSuggestions = advancedFuzzySearch(action, availableActions)
    
    // 学習データも統合
    const learnedSuggestions = action.trim()
      ? workDB.getActionSuggestions(action, target).map(s => s.value)
      : []
    
    // マージして重複除去
    const combined = [...new Set([...masterSuggestions, ...learnedSuggestions])]
    return combined.slice(0, 8)
  }, [action, target, availableActions, workDB])
  
  // 利用可能な位置（動作が選択された場合）
  const availablePositions = useMemo(() => {
    if (!action) return POSITIONS
    // よく使われる位置のみ表示
    return ["右", "左", "前", "後", "右前", "左前", "右後", "左後", "左右", "前後"]
  }, [action])
  
  const positionSuggestions = useMemo(() => {
    const masterSuggestions = advancedFuzzySearch(position, availablePositions)
    
    // 学習データも統合
    const learnedSuggestions = position.trim()
      ? workDB.getPositionSuggestions(position, target, action).map(s => s.value)
      : []
    
    // マージして重複除去
    const combined = [...new Set([...masterSuggestions, ...learnedSuggestions])]
    return combined.slice(0, 8)
  }, [position, availablePositions, target, action, workDB])
  
  // データ読み込み
  useEffect(() => {
    const savedItems = workDB.getWorkItems()
    setItems(savedItems)
  }, [workDB])
  
  // ラベル生成
  const composedLabel = (target: string, action: string, position: string, memo: string) => {
    let label = ''
    if (position) label += `${position} `
    if (target) label += target
    if (action && action !== '（指定なし）') label += ` ${action}`
    if (memo) label += ` (${memo})`
    return label.trim()
  }
  
  // イベントハンドラ（prototypeベース）
  function handleTargetInputChange(value: string) {
    setTarget(value)
    setSelectedTargetIndex(-1)
    
    // サジェスト表示制御
    setShowTargetSuggestions(true)
    
    // 現在の動作が新しい対象で利用不可能な場合はクリア
    if (action && TARGET_ACTIONS[value as keyof typeof TARGET_ACTIONS] && 
        !TARGET_ACTIONS[value as keyof typeof TARGET_ACTIONS].includes(action)) {
      setAction("")
      setPosition("")
    }
  }
  
  function handleActionInputChange(value: string) {
    setAction(value)
    setSelectedActionIndex(-1)
    setShowActionSuggestions(true)
    
    // 動作が変更されたら位置をリセット
    if (value !== action) {
      setPosition("")
    }
  }
  
  function handlePositionInputChange(value: string) {
    setPosition(value)
    setSelectedPositionIndex(-1)
    setShowPositionSuggestions(true)
  }
  
  // キーボードナビゲーション
  function handleTargetKeyDown(e: React.KeyboardEvent) {
    if (!showTargetSuggestions || targetSuggestions.length === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedTargetIndex(prev => 
          prev < targetSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedTargetIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedTargetIndex >= 0) {
          handleTargetSuggestionSelect(targetSuggestions[selectedTargetIndex]);
        }
        break;
      case 'Escape':
        setShowTargetSuggestions(false);
        setSelectedTargetIndex(-1);
        break;
    }
  }
  
  function handleActionKeyDown(e: React.KeyboardEvent) {
    if (!showActionSuggestions || actionSuggestions.length === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedActionIndex(prev => 
          prev < actionSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedActionIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedActionIndex >= 0) {
          handleActionSuggestionSelect(actionSuggestions[selectedActionIndex]);
        }
        break;
      case 'Escape':
        setShowActionSuggestions(false);
        setSelectedActionIndex(-1);
        break;
    }
  }
  
  function handlePositionKeyDown(e: React.KeyboardEvent) {
    if (!showPositionSuggestions || positionSuggestions.length === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedPositionIndex(prev => 
          prev < positionSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedPositionIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedPositionIndex >= 0) {
          handlePositionSuggestionSelect(positionSuggestions[selectedPositionIndex]);
        }
        break;
      case 'Escape':
        setShowPositionSuggestions(false);
        setSelectedPositionIndex(-1);
        break;
    }
  }
  
  // サジェスト選択（prototypeベース）
  function handleTargetSuggestionSelect(suggestion: string) {
    setTarget(suggestion)
    setShowTargetSuggestions(false)
    setSelectedTargetIndex(-1)
    
    // 対象変更時に動作・位置をリセット
    setAction("")
    setPosition("")
  }
  
  function handleActionSuggestionSelect(suggestion: string) {
    setAction(suggestion)
    setShowActionSuggestions(false)
    setSelectedActionIndex(-1)
    
    // 動作変更時に位置をリセット
    setPosition("")
  }
  
  function handlePositionSuggestionSelect(suggestion: string) {
    setPosition(suggestion)
    setShowPositionSuggestions(false)
    setSelectedPositionIndex(-1)
  }
  
  // フォーカス時の処理（空の場合に全リスト表示）
  function handleTargetFocus() {
    setShowTargetSuggestions(true)
    if (!target.trim()) {
      setSelectedTargetIndex(-1)
    }
  }
  
  function handleActionFocus() {
    setShowActionSuggestions(true)
    if (!action.trim()) {
      setSelectedActionIndex(-1)
    }
  }
  
  function handlePositionFocus() {
    setShowPositionSuggestions(true)
    if (!position.trim()) {
      setSelectedPositionIndex(-1)
    }
  }
  
  // アイテム追加
  function addItem() {
    if (!target) return;
    
    const newItem = workDB.saveWorkItem(target, action, position, memo, unitPrice, quantity);
    const updatedItems = workDB.getWorkItems();
    setItems(updatedItems);
    
    // フォームをクリア
    setTarget('');
    setAction('');
    setPosition('');
    setMemo('');
    setUnitPrice(undefined);
    setQuantity(1);
  }
  
  // 統計情報
  const stats = workDB.getStatistics();
  
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <h1 className="text-2xl font-bold mb-2">作業項目入力（統合版）</h1>
        <p className="text-sm text-gray-600 mb-6">
          プロトタイプの高度な機能を統合：対象別動作フィルタリング、読み仮名検索、学習機能、キーボードナビゲーション対応
        </p>
        
        {/* 基本入力フィールド */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* 対象 */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">対象</label>
            <Input 
              value={target}
              onChange={e => handleTargetInputChange(e.target.value)}
              onKeyDown={e => handleTargetKeyDown(e)}
              onFocus={handleTargetFocus}
              onBlur={() => setTimeout(() => setShowTargetSuggestions(false), 200)}
              placeholder="タイヤ、ホイール..."
              className="w-full"
            />
            {showTargetSuggestions && targetSuggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {targetSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onMouseDown={() => handleTargetSuggestionSelect(suggestion)}
                    onMouseEnter={() => setSelectedTargetIndex(index)}
                    className={`w-full px-3 py-2 text-left text-sm border-b border-gray-100 last:border-b-0 ${
                      index === selectedTargetIndex 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'hover:bg-blue-50'
                    }`}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* 動作（高度なフィルタリング付き） */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              動作 {target && TARGET_ACTIONS[target] && (
                <span className="text-xs text-blue-600">（{target}向け絞り込み）</span>
              )}
            </label>
            <Input 
              value={action}
              onChange={e => handleActionInputChange(e.target.value)}
              onKeyDown={e => handleActionKeyDown(e)}
              onFocus={handleActionFocus}
              onBlur={() => setTimeout(() => setShowActionSuggestions(false), 200)}
              placeholder="交換、修理..."
              className="w-full"
            />
            {showActionSuggestions && actionSuggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {actionSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleActionSuggestionSelect(suggestion)}
                    onMouseEnter={() => setSelectedActionIndex(index)}
                    className={`w-full px-3 py-2 text-left text-sm border-b border-gray-100 last:border-b-0 ${
                      index === selectedActionIndex 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'hover:bg-blue-50'
                    }`}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* 位置 */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">位置</label>
            <Input 
              value={position}
              onChange={e => handlePositionInputChange(e.target.value)}
              onKeyDown={e => handlePositionKeyDown(e)}
              onFocus={handlePositionFocus}
              onBlur={() => setTimeout(() => setShowPositionSuggestions(false), 200)}
              placeholder="前、左..."
              className="w-full"
            />
            {showPositionSuggestions && positionSuggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {positionSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handlePositionSuggestionSelect(suggestion)}
                    onMouseEnter={() => setSelectedPositionIndex(index)}
                    className={`w-full px-3 py-2 text-left text-sm border-b border-gray-100 last:border-b-0 ${
                      index === selectedPositionIndex 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'hover:bg-blue-50'
                    }`}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* メモ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">メモ</label>
            <Input 
              value={memo}
              onChange={e => setMemo(e.target.value)}
              placeholder="追加情報..."
              className="w-full"
            />
          </div>
        </div>
        
        {/* 単価・数量セクション */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">単価（円）</label>
            <Input 
              type="number"
              value={unitPrice || ''}
              onChange={e => setUnitPrice(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="10000"
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">数量</label>
            <Input 
              type="number"
              min="1"
              value={quantity}
              onChange={e => setQuantity(Number(e.target.value) || 1)}
              className="w-full"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={addItem}
              disabled={!target}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              追加
            </button>
          </div>
        </div>
        
        {/* プレビュー */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">プレビュー:</label>
          <div className="p-3 bg-gray-50 border rounded-lg min-h-[40px] flex items-center">
            {target && (
              <span className="text-gray-900">
                {composedLabel(target, action, position, memo)}
              </span>
            )}
            {!target && (
              <span className="text-gray-500">対象を入力してください</span>
            )}
          </div>
        </div>
        
        {/* 統計情報 */}
        {stats && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">学習統計</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">登録項目:</span> {stats.totalItems}
              </div>
              <div>
                <span className="text-gray-600">使用回数:</span> {stats.totalUsage}
              </div>
              <div>
                <span className="text-gray-600">平均単価:</span> ¥{stats.avgPrice.toLocaleString()}
              </div>
              <div>
                <span className="text-gray-600">最頻対象:</span> {stats.mostUsedTarget || '-'}
              </div>
            </div>
          </div>
        )}
        
        {/* 追加された項目リスト */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">追加された項目 ({items.length}件)</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {items.length === 0 ? (
              <div className="text-gray-500 text-sm">まだ項目はありません</div>
            ) : (
              items.slice(-10).reverse().map(item => (
                <div key={item.id} className="p-3 bg-gray-50 border rounded">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-900">{item.composed_label}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        使用回数: {item.usage_count}回 
                        {item.unit_price && (
                          <span className="ml-2">単価: ¥{item.unit_price.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* 機能説明 */}
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">統合された高度な機能</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• <strong>関連性フィルタリング:</strong> 対象選択時に関連する動作のみ表示</li>
            <li>• <strong>読み仮名検索:</strong> ひらがな・カタカナでの検索対応</li>
            <li>• <strong>学習機能:</strong> 使用履歴に基づく候補表示・優先度調整</li>
            <li>• <strong>キーボードナビゲーション:</strong> ↑↓キーでの選択、Enterで確定</li>
            <li>• <strong>統計表示:</strong> 使用パターンの可視化</li>
            <li>• <strong>プログレッシブフィルタ:</strong> 対象→動作→位置の段階的絞り込み</li>
          </ul>
        </div>
      </div>
    </div>
  )
}