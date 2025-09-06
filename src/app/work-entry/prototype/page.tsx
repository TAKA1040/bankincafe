"use client";
import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, ClipboardList, History } from "lucide-react";
import { useWorkDictionary } from "@/hooks/useWorkDictionary";

// ---------- util ----------
const genId = () =>
  typeof crypto !== "undefined" && (crypto as any).randomUUID
    ? (crypto as any).randomUUID()
    : Math.random().toString(36).slice(2);



function suggestPrice(action?: string, target?: string, priceBookMap?: { [key: string]: number }): number | null {
  if (!action || !target || !priceBookMap) return null;
  
  // Supabaseの価格提案データから取得
  const priceKey = `${target}_${action}`;
  return priceBookMap[priceKey] || null;
}

function formatJPY(n: number | string) {
  const num = typeof n === "string" ? Number(n || 0) : n;
  return new Intl.NumberFormat("ja-JP").format(num);
}

// 文字正規化関数（ひらがな・カタカナ・大文字小文字を統一）
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    // カタカナをひらがなに変換
    .replace(/[\u30A1-\u30F6]/g, (match) => {
      return String.fromCharCode(match.charCodeAt(0) - 0x60);
    })
    // 全角英数を半角に変換
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (match) => {
      return String.fromCharCode(match.charCodeAt(0) - 0xFEE0);
    })
    // スペースを除去
    .replace(/\s+/g, '');
}

// 高度なFuzzy検索関数（読み仮名対応）
function advancedFuzzySearch(keyword: string, targetList: string[], readingMap: { [key: string]: string[] } = {}): string[] {
  if (!keyword.trim()) return [];
  
  const normalizedKeyword = normalizeText(keyword);
  return targetList
    .filter(item => {
      const normalizedItem = normalizeText(item);
      
      // 直接マッチング
      let matches = normalizedItem.includes(normalizedKeyword);
      
      // 読み仮名でのマッチング
      if (!matches && readingMap[item]) {
        matches = readingMap[item].some(reading => {
          const normalizedReading = normalizeText(reading);
          return normalizedReading.includes(normalizedKeyword);
        });
      }
      
      // 逆方向チェック（入力が読み仮名の場合）
      if (!matches) {
        const itemReadings = readingMap[item] || [];
        matches = itemReadings.some(reading => {
          const normalizedReading = normalizeText(reading);
          return normalizedKeyword.includes(normalizedReading) || normalizedReading.includes(normalizedKeyword);
        });
      }
      
      return matches;
    })
    .sort((a, b) => {
      // より短いマッチを優先
      const aIndex = normalizeText(a).indexOf(normalizedKeyword);
      const bIndex = normalizeText(b).indexOf(normalizedKeyword);
      if (aIndex !== bIndex) return aIndex - bIndex;
      return a.length - b.length;
    })
    .slice(0, 8);
}


// ---------- 型 ----------
interface LineItem {
  id: string;
  type: "structured" | "set";
  label: string;
  action?: string;
  target?: string;
  position?: string;
  memo?: string;
  unitPrice: number;
  quantity: number;
  amount: number;
  details?: Array<{ action?: string; target?: string; position?: string; memo?: string; label: string }>;
}

// シンプルなSelect実装
interface SimpleSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  children: React.ReactNode;
}

function SimpleSelect({ value, onValueChange, placeholder, children }: SimpleSelectProps) {
  return (
    <select 
      value={value || ""} 
      onChange={(e) => onValueChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {children}
    </select>
  );
}

function SimpleSelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  return <option value={value}>{children}</option>;
}

// シンプルなBadge実装
function SimpleBadge({ variant = "default", children }: { variant?: "default" | "secondary" | "outline"; children: React.ReactNode }) {
  const baseClasses = "inline-flex items-center px-2 py-1 text-xs font-medium rounded-full";
  const variantClasses = {
    default: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800", 
    outline: "bg-white text-gray-700 border border-gray-300"
  };
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </span>
  );
}

// シンプルなTabs実装
interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
}

function SimpleTabs({ defaultValue, children, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  
  return (
    <div className={`tabs-container ${className || ""}`} data-active-tab={activeTab}>
      {React.Children.map(children, child => 
        React.isValidElement(child) 
          ? React.cloneElement(child as any, { activeTab, setActiveTab })
          : child
      )}
    </div>
  );
}

function SimpleTabsList({ children, activeTab, setActiveTab }: any) {
  return (
    <div className="flex space-x-2 mb-4 border-b border-gray-200">
      {React.Children.map(children, child =>
        React.isValidElement(child) 
          ? React.cloneElement(child as any, { activeTab, setActiveTab })
          : child
      )}
    </div>
  );
}

function SimpleTabsTrigger({ value, children, activeTab, setActiveTab }: any) {
  const isActive = activeTab === value;
  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`px-4 py-2 text-sm font-medium transition-colors ${
        isActive 
          ? "text-blue-600 border-b-2 border-blue-600" 
          : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {children}
    </button>
  );
}

function SimpleTabsContent({ value, children, activeTab }: any) {
  if (activeTab !== value) return null;
  return <div className="tabs-content space-y-4">{children}</div>;
}

// Label実装
function SimpleLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={`block text-sm font-medium text-gray-700 mb-2 ${className || ""}`}>{children}</label>;
}

export default function WorkEntryPrototype() {
  // Supabaseデータ取得
  const {
    targetsArray: TARGETS,
    actionsArray: ACTIONS, 
    positionsArray: POSITIONS,
    readingMap: READING_MAP,
    targetActionsMap: TARGET_ACTIONS,
    actionPositionsMap: ACTION_POSITIONS,
    priceBookMap,
    saveWorkHistory,
    saveWorkSet,
    loading: dictLoading,
    error: dictError
  } = useWorkDictionary();

  // 入力方式設定
  const [useModalInput, setUseModalInput] = useState<boolean>(true); // true: モーダル表示, false: インライン表示

  // structured
  const [action, setAction] = useState<string | undefined>();
  const [target, setTarget] = useState<string>("");
  const [position, setPosition] = useState<string | undefined>();
  const [memo, setMemo] = useState<string>("");
  const suggested = useMemo(() => suggestPrice(action, target, priceBookMap), [action, target, priceBookMap]);
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [qty, setQty] = useState<number>(1);
  
  // 対象の入力補助関連
  const [targetSuggestions, setTargetSuggestions] = useState<string[]>([]);
  const [showTargetSuggestions, setShowTargetSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  // 動作の入力補助関連
  const [actionSuggestions, setActionSuggestions] = useState<string[]>([]);
  const [showActionSuggestions, setShowActionSuggestions] = useState(false);
  const [selectedActionSuggestionIndex, setSelectedActionSuggestionIndex] = useState(-1);

  // 位置の入力補助関連
  const [positionSuggestions, setPositionSuggestions] = useState<string[]>([]);
  const [showPositionSuggestions, setShowPositionSuggestions] = useState(false);
  const [selectedPositionSuggestionIndex, setSelectedPositionSuggestionIndex] = useState(-1);
  
  // 対象に基づく利用可能な動作
  const availableActions = useMemo(() => {
    if (!target || !TARGET_ACTIONS || !(target in TARGET_ACTIONS)) return ACTIONS || [];
    return TARGET_ACTIONS[target] || ACTIONS || [];
  }, [target, TARGET_ACTIONS, ACTIONS]);

  // 対象に基づく利用可能な位置（動作が選択された場合）
  const availablePositions = useMemo(() => {
    if (!action || !ACTION_POSITIONS) return POSITIONS || [];
    return ACTION_POSITIONS[action] || POSITIONS || [];
  }, [action, ACTION_POSITIONS, POSITIONS]);



  // set
  const [setName, setSetName] = useState("");
  const [setPrice, setSetPrice] = useState<number>(0);
  const [setQuantity, setSetQuantity] = useState<number>(1);
  const [setDetails, setSetDetails] = useState<Array<{ action?: string; target?: string; position?: string; memo?: string; label: string }>>([]);
  // 子作業の一時状態（window未使用）
  const [detailTarget, setDetailTarget] = useState<string>("");
  const [detailAction, setDetailAction] = useState<string>("");
  const [detailPosition, setDetailPosition] = useState<string>("");
  const [detailMemo, setDetailMemo] = useState<string>("");
  
  // セット詳細の入力補助関連
  const [detailTargetSuggestions, setDetailTargetSuggestions] = useState<string[]>([]);
  const [showDetailTargetSuggestions, setShowDetailTargetSuggestions] = useState(false);
  const [selectedDetailSuggestionIndex, setSelectedDetailSuggestionIndex] = useState(-1);
  
  // セット詳細用動作サジェスト
  const [detailActionSuggestions, setDetailActionSuggestions] = useState<string[]>([]);
  const [showDetailActionSuggestions, setShowDetailActionSuggestions] = useState(false);
  const [selectedDetailActionSuggestionIndex, setSelectedDetailActionSuggestionIndex] = useState(-1);
  
  // セット詳細用位置サジェスト
  const [detailPositionSuggestions, setDetailPositionSuggestions] = useState<string[]>([]);
  const [showDetailPositionSuggestions, setShowDetailPositionSuggestions] = useState(false);
  const [selectedDetailPositionSuggestionIndex, setSelectedDetailPositionSuggestionIndex] = useState(-1);

  // セット詳細用：対象に基づく利用可能な動作
  const detailAvailableActions = useMemo(() => {
    if (!detailTarget || !(detailTarget in TARGET_ACTIONS)) return ACTIONS;
    return TARGET_ACTIONS[detailTarget as keyof typeof TARGET_ACTIONS];
  }, [detailTarget, ACTIONS, TARGET_ACTIONS]);

  // 全明細
  const [items, setItems] = useState<LineItem[]>([]);

  // 専用入力補助モーダル関連
  const [showInputModal, setShowInputModal] = useState(false);
  const [modalSearchKeyword, setModalSearchKeyword] = useState("");
  const [modalSelectedTarget, setModalSelectedTarget] = useState("");
  const [modalSelectedAction, setModalSelectedAction] = useState("");
  const [modalSelectedPosition, setModalSelectedPosition] = useState<string | null>(null);
  const [modalMemo, setModalMemo] = useState("");
  const [modalSuggestedPrice, setModalSuggestedPrice] = useState(0);

  // モーダル動作入力補助関連
  const [modalActionSuggestions, setModalActionSuggestions] = useState<string[]>([]);
  const [showModalActionSuggestions, setShowModalActionSuggestions] = useState(false);
  const [selectedModalActionSuggestionIndex, setSelectedModalActionSuggestionIndex] = useState(-1);

  // モーダル位置入力補助関連
  const [modalPositionSuggestions, setModalPositionSuggestions] = useState<string[]>([]);
  const [showModalPositionSuggestions, setShowModalPositionSuggestions] = useState(false);
  const [selectedModalPositionSuggestionIndex, setSelectedModalPositionSuggestionIndex] = useState(-1);

  // セット詳細モーダル関連の状態
  const [showDetailInputModal, setShowDetailInputModal] = useState(false);
  const [detailModalType, setDetailModalType] = useState<'action' | 'position'>('action');
  const [detailModalTarget, setDetailModalTarget] = useState("");
  const [detailModalSuggestions, setDetailModalSuggestions] = useState<string[]>([]);
  const [selectedDetailModalIndex, setSelectedDetailModalIndex] = useState(-1);

  // モーダルの呼び出し元を追跡
  const [modalCallerType, setModalCallerType] = useState<'individual' | 'set'>('individual');

  // 提案単価の自動反映（未入力時のみ）
  React.useEffect(() => {
    if (suggested != null && (unitPrice === 0 || Number.isNaN(unitPrice))) setUnitPrice(suggested);
  }, [suggested, unitPrice]);

  // 対象が変更されたときに動作をリセット
  React.useEffect(() => {
    if (target && action && !availableActions.includes(action)) {
      setAction(undefined);
    }
  }, [target, action, availableActions]);

  // 対象入力変更ハンドラ（高度な曖昧検索対応）
  function handleTargetInputChange(value: string) {
    setTarget(value);
    setSelectedSuggestionIndex(-1);
    
    if (value.trim()) {
      // 高度な曖昧検索で候補を表示
      const suggestions = advancedFuzzySearch(value, TARGETS, READING_MAP);
      setTargetSuggestions(suggestions);
      setShowTargetSuggestions(suggestions.length > 0);
    } else {
      setShowTargetSuggestions(false);
    }
    
    // 現在の動作が新しい対象で利用不可能な場合はクリア
    if (action && TARGET_ACTIONS[value as keyof typeof TARGET_ACTIONS] && 
        !TARGET_ACTIONS[value as keyof typeof TARGET_ACTIONS].includes(action)) {
      setAction(undefined);
      setUnitPrice(0);
    }
  }

  // キーボードイベントハンドラ
  function handleTargetKeyDown(e: React.KeyboardEvent) {
    if (!showTargetSuggestions || targetSuggestions.length === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < targetSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : targetSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleTargetSuggestionSelect(targetSuggestions[selectedSuggestionIndex]);
        }
        break;
      case 'Escape':
        setShowTargetSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  }

  // 対象候補選択ハンドラ（自然にモーダルに移行）
  function handleTargetSuggestionSelect(selectedTarget: string) {
    // ドロップダウンを閉じる
    setShowTargetSuggestions(false);
    setSelectedSuggestionIndex(-1);
    
    if (useModalInput) {
      // モーダル設定時: モーダルを開いて対象を事前選択
      setModalCallerType('individual');
      setShowInputModal(true);
      setModalSearchKeyword("");
      setModalSelectedTarget(selectedTarget);
      setModalSelectedAction("");
      setModalSelectedPosition(null);
      setModalSuggestedPrice(0);
    } else {
      // インライン設定時: 直接入力欄に反映
      setTarget(selectedTarget);
    }
  }

  // 動作選択ハンドラ
  function handleActionSelect(selectedAction: string) {
    setAction(selectedAction);
    setPosition(undefined); // 位置をリセット（undefinedで未指定を表現）
    const price = suggestPrice(selectedAction, target, priceBookMap);
    if (price && price > 0) {
      setUnitPrice(price);
    }
  }

  // 位置選択ハンドラ
  function handlePositionSelect(selectedPosition: string) {
    setPosition(selectedPosition);
  }

  // モーダル開く
  function openInputModal(callerType: 'individual' | 'set' = 'individual') {
    setModalCallerType(callerType);
    setShowInputModal(true);
    setModalSearchKeyword("");
    setModalSelectedTarget("");
    setModalSelectedAction("");
    setModalSelectedPosition(null);
    setModalMemo("");
    setModalSuggestedPrice(0);
    
    // モーダル用サジェスト状態をクリア
    setShowModalActionSuggestions(false);
    setShowModalPositionSuggestions(false);
    setSelectedModalActionSuggestionIndex(-1);
    setSelectedModalPositionSuggestionIndex(-1);
  }

  // モーダル検索処理
  function handleModalSearch(keyword: string) {
    setModalSearchKeyword(keyword);
  }

  // モーダル対象選択
  function handleModalTargetSelect(selectedTarget: string) {
    setModalSelectedTarget(selectedTarget);
    setModalSelectedAction(""); // 動作をリセット
    setModalSelectedPosition(null); // 位置をリセット
  }

  // モーダル動作選択
  function handleModalActionSelect(selectedAction: string) {
    setModalSelectedAction(selectedAction);
    const price = suggestPrice(selectedAction, modalSelectedTarget, priceBookMap);
    setModalSuggestedPrice(price || 0);
    setShowModalActionSuggestions(false);
  }

  // モーダル動作入力変更ハンドラー
  function handleModalActionInputChange(value: string) {
    setModalSelectedAction(value);
    setSelectedModalActionSuggestionIndex(-1);
    
    if (value.trim()) {
      // 対象に応じた動作候補を取得
      const availableModalActions = modalSelectedTarget && TARGET_ACTIONS[modalSelectedTarget as keyof typeof TARGET_ACTIONS]
        ? TARGET_ACTIONS[modalSelectedTarget as keyof typeof TARGET_ACTIONS]
        : ACTIONS;
      const suggestions = advancedFuzzySearch(value, availableModalActions, READING_MAP);
      setModalActionSuggestions(suggestions);
      setShowModalActionSuggestions(suggestions.length > 0);
    } else {
      setShowModalActionSuggestions(false);
    }
    
    // 価格提案を更新
    const price = suggestPrice(value, modalSelectedTarget, priceBookMap);
    setModalSuggestedPrice(price || 0);
  }

  // モーダル動作キーボードイベントハンドラー
  function handleModalActionKeyDown(e: React.KeyboardEvent) {
    if (!showModalActionSuggestions || modalActionSuggestions.length === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedModalActionSuggestionIndex(prev => 
          prev < modalActionSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedModalActionSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : modalActionSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedModalActionSuggestionIndex >= 0) {
          handleModalActionSelect(modalActionSuggestions[selectedModalActionSuggestionIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowModalActionSuggestions(false);
        setSelectedModalActionSuggestionIndex(-1);
        break;
    }
  }

  // モーダル動作サジェスト選択ハンドラー
  function handleModalActionSuggestionSelect(suggestion: string) {
    handleModalActionSelect(suggestion);
  }

  // モーダル位置選択
  function handleModalPositionSelect(selectedPosition: string) {
    setModalSelectedPosition(selectedPosition);
    setShowModalPositionSuggestions(false);
  }

  // モーダル位置入力変更ハンドラー
  function handleModalPositionInputChange(value: string) {
    setModalSelectedPosition(value);
    setSelectedModalPositionSuggestionIndex(-1);
    
    if (value.trim()) {
      const suggestions = advancedFuzzySearch(value, POSITIONS, READING_MAP);
      setModalPositionSuggestions(suggestions);
      setShowModalPositionSuggestions(suggestions.length > 0);
    } else {
      setShowModalPositionSuggestions(false);
    }
  }

  // モーダル位置キーボードイベントハンドラー
  function handleModalPositionKeyDown(e: React.KeyboardEvent) {
    if (!showModalPositionSuggestions || modalPositionSuggestions.length === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedModalPositionSuggestionIndex(prev => 
          prev < modalPositionSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedModalPositionSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : modalPositionSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedModalPositionSuggestionIndex >= 0) {
          handleModalPositionSelect(modalPositionSuggestions[selectedModalPositionSuggestionIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowModalPositionSuggestions(false);
        setSelectedModalPositionSuggestionIndex(-1);
        break;
    }
  }

  // モーダル位置サジェスト選択ハンドラー
  function handleModalPositionSuggestionSelect(suggestion: string) {
    handleModalPositionSelect(suggestion);
  }

  // セット詳細モーダル関数
  function openDetailActionModal() {
    if (!detailTarget) return;
    setDetailModalType('action');
    setDetailModalTarget(detailTarget);
    const availableActions = TARGET_ACTIONS[detailTarget as keyof typeof TARGET_ACTIONS] || ACTIONS;
    setDetailModalSuggestions(availableActions);
    setSelectedDetailModalIndex(-1);
    setShowDetailInputModal(true);
  }

  function openDetailPositionModal() {
    setDetailModalType('position');
    setDetailModalSuggestions(POSITIONS);
    setSelectedDetailModalIndex(-1);
    setShowDetailInputModal(true);
  }

  function selectDetailModalOption(option: string) {
    if (detailModalType === 'action') {
      setDetailAction(option);
    } else {
      setDetailPosition(option);
    }
    setShowDetailInputModal(false);
  }

  function cancelDetailModal() {
    setShowDetailInputModal(false);
  }

  // モーダル決定処理
  function confirmModalSelection() {
    if (!modalSelectedTarget) return; // 対象のみ必須、動作は任意
    
    // 呼び出し元に応じて適切な状態に反映
    if (modalCallerType === 'set') {
      // セット詳細に反映
      setDetailTarget(modalSelectedTarget);
      setDetailAction(modalSelectedAction || '');
      setDetailPosition(modalSelectedPosition || '');
      setDetailMemo(modalMemo);
    } else {
      // 個別に反映
      setTarget(modalSelectedTarget);
      setAction(modalSelectedAction || undefined);
      setPosition(modalSelectedPosition || undefined);
      setMemo(modalMemo);
      if (modalSuggestedPrice > 0) {
        setUnitPrice(modalSuggestedPrice);
      }
    }
    
    // モーダルを閉じる
    setShowInputModal(false);
  }

  // モーダルキャンセル
  function cancelModal() {
    setShowInputModal(false);
  }

  // 動作入力変更ハンドラー
  function handleActionInputChange(value: string) {
    setAction(value);
    setSelectedActionSuggestionIndex(-1);
    
    if (value.trim()) {
      const suggestions = advancedFuzzySearch(value, availableActions, READING_MAP);
      setActionSuggestions(suggestions);
      setShowActionSuggestions(suggestions.length > 0);
    } else {
      setShowActionSuggestions(false);
    }
  }

  // 動作キーボードイベントハンドラー
  function handleActionKeyDown(e: React.KeyboardEvent) {
    if (!showActionSuggestions || actionSuggestions.length === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedActionSuggestionIndex(prev => 
          prev < actionSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedActionSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : actionSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedActionSuggestionIndex >= 0) {
          handleActionSuggestionSelect(actionSuggestions[selectedActionSuggestionIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowActionSuggestions(false);
        setSelectedActionSuggestionIndex(-1);
        break;
    }
  }

  // 動作サジェスト選択ハンドラー
  function handleActionSuggestionSelect(suggestion: string) {
    setAction(suggestion);
    setShowActionSuggestions(false);
    setSelectedActionSuggestionIndex(-1);
  }

  // 位置入力変更ハンドラー
  function handlePositionInputChange(value: string) {
    setPosition(value);
    setSelectedPositionSuggestionIndex(-1);
    
    if (value.trim()) {
      const suggestions = advancedFuzzySearch(value, POSITIONS, READING_MAP);
      setPositionSuggestions(suggestions);
      setShowPositionSuggestions(suggestions.length > 0);
    } else {
      setShowPositionSuggestions(false);
    }
  }

  // 位置キーボードイベントハンドラー
  function handlePositionKeyDown(e: React.KeyboardEvent) {
    if (!showPositionSuggestions || positionSuggestions.length === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedPositionSuggestionIndex(prev => 
          prev < positionSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedPositionSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : positionSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedPositionSuggestionIndex >= 0) {
          handlePositionSuggestionSelect(positionSuggestions[selectedPositionSuggestionIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowPositionSuggestions(false);
        setSelectedPositionSuggestionIndex(-1);
        break;
    }
  }

  // 位置サジェスト選択ハンドラー
  function handlePositionSuggestionSelect(suggestion: string) {
    setPosition(suggestion);
    setShowPositionSuggestions(false);
    setSelectedPositionSuggestionIndex(-1);
  }

  // セット詳細対象入力変更ハンドラ
  function handleDetailTargetInputChange(value: string) {
    setDetailTarget(value);
    setSelectedDetailSuggestionIndex(-1);
    
    if (value.trim()) {
      const suggestions = advancedFuzzySearch(value, TARGETS, READING_MAP);
      setDetailTargetSuggestions(suggestions);
      setShowDetailTargetSuggestions(suggestions.length > 0);
    } else {
      setShowDetailTargetSuggestions(false);
    }
    
    // 現在の動作が新しい対象で利用不可能な場合はクリア
    if (detailAction && TARGET_ACTIONS[value as keyof typeof TARGET_ACTIONS] && 
        !TARGET_ACTIONS[value as keyof typeof TARGET_ACTIONS].includes(detailAction)) {
      setDetailAction("");
    }
  }
  
  // セット詳細動作入力変更ハンドラ
  function handleDetailActionInputChange(value: string) {
    console.log('handleDetailActionInputChange called:', value);
    console.log('detailAvailableActions:', detailAvailableActions);
    setDetailAction(value);
    setSelectedDetailActionSuggestionIndex(-1);
    
    if (value.trim()) {
      const suggestions = advancedFuzzySearch(value, detailAvailableActions, READING_MAP);
      console.log('Detail action suggestions:', suggestions);
      setDetailActionSuggestions(suggestions);
      setShowDetailActionSuggestions(suggestions.length > 0);
      console.log('showDetailActionSuggestions:', suggestions.length > 0);
    } else {
      setShowDetailActionSuggestions(false);
    }
  }
  
  // セット詳細位置入力変更ハンドラ
  function handleDetailPositionInputChange(value: string) {
    setDetailPosition(value);
    setSelectedDetailPositionSuggestionIndex(-1);
    
    if (value.trim()) {
      const suggestions = advancedFuzzySearch(value, POSITIONS, READING_MAP);
      setDetailPositionSuggestions(suggestions);
      setShowDetailPositionSuggestions(suggestions.length > 0);
    } else {
      setShowDetailPositionSuggestions(false);
    }
  }

  // セット詳細キーボードイベントハンドラ
  function handleDetailTargetKeyDown(e: React.KeyboardEvent) {
    if (!showDetailTargetSuggestions || detailTargetSuggestions.length === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedDetailSuggestionIndex(prev => 
          prev < detailTargetSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedDetailSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : detailTargetSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedDetailSuggestionIndex >= 0) {
          handleDetailTargetSuggestionSelect(detailTargetSuggestions[selectedDetailSuggestionIndex]);
        }
        break;
      case 'Escape':
        setShowDetailTargetSuggestions(false);
        setSelectedDetailSuggestionIndex(-1);
        break;
    }
  }

  // セット詳細対象候補選択ハンドラ
  function handleDetailTargetSuggestionSelect(selectedTarget: string) {
    setShowDetailTargetSuggestions(false);
    setSelectedDetailSuggestionIndex(-1);
    
    if (useModalInput) {
      // モーダル設定時: モーダルを開いて対象を事前選択
      setModalCallerType('set');
      setShowInputModal(true);
      setModalSearchKeyword("");
      setModalSelectedTarget(selectedTarget);
      setModalSelectedAction("");
      setModalSelectedPosition(null);
      setModalSuggestedPrice(0);
    } else {
      // インライン設定時: 直接入力欄に反映
      setDetailTarget(selectedTarget);
      
      // 現在の動作が新しい対象で利用不可能な場合はクリア
      if (detailAction && TARGET_ACTIONS[selectedTarget as keyof typeof TARGET_ACTIONS] && 
          !TARGET_ACTIONS[selectedTarget as keyof typeof TARGET_ACTIONS].includes(detailAction)) {
        setDetailAction("");
      }
    }
  }
  
  // セット詳細動作キーボードハンドラー
  function handleDetailActionKeyDown(e: React.KeyboardEvent) {
    if (!showDetailActionSuggestions || detailActionSuggestions.length === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedDetailActionSuggestionIndex(prev => 
          prev < detailActionSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedDetailActionSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : detailActionSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedDetailActionSuggestionIndex >= 0) {
          handleDetailActionSuggestionSelect(detailActionSuggestions[selectedDetailActionSuggestionIndex]);
        }
        break;
      case 'Escape':
        setShowDetailActionSuggestions(false);
        setSelectedDetailActionSuggestionIndex(-1);
        break;
    }
  }
  
  // セット詳細動作候補選択ハンドラ
  function handleDetailActionSuggestionSelect(selectedAction: string) {
    setDetailAction(selectedAction);
    setShowDetailActionSuggestions(false);
    setSelectedDetailActionSuggestionIndex(-1);
  }
  
  // セット詳細位置キーボードハンドラー
  function handleDetailPositionKeyDown(e: React.KeyboardEvent) {
    if (!showDetailPositionSuggestions || detailPositionSuggestions.length === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedDetailPositionSuggestionIndex(prev => 
          prev < detailPositionSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedDetailPositionSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : detailPositionSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedDetailPositionSuggestionIndex >= 0) {
          handleDetailPositionSuggestionSelect(detailPositionSuggestions[selectedDetailPositionSuggestionIndex]);
        }
        break;
      case 'Escape':
        setShowDetailPositionSuggestions(false);
        setSelectedDetailPositionSuggestionIndex(-1);
        break;
    }
  }
  
  // セット詳細位置候補選択ハンドラ
  function handleDetailPositionSuggestionSelect(selectedPosition: string) {
    setDetailPosition(selectedPosition);
    setShowDetailPositionSuggestions(false);
    setSelectedDetailPositionSuggestionIndex(-1);
  }

  // セット詳細追加処理（改良版）
  function addSetDetailImproved() {
    if (!detailTarget) return; // 対象のみ必須
    
    const label = composedLabel(detailTarget, detailAction, detailPosition, detailMemo);
    setSetDetails(prev => [...prev, { 
      action: detailAction, 
      target: detailTarget, 
      position: detailPosition,
      memo: detailMemo,
      label 
    }]);
    
    // フォームをクリア
    setDetailTarget("");
    setDetailAction("");
    setDetailPosition("");
    setDetailMemo("");
    
    // サジェスト状態もクリア
    setShowDetailTargetSuggestions(false);
    setShowDetailActionSuggestions(false);
    setShowDetailPositionSuggestions(false);
    setSelectedDetailSuggestionIndex(-1);
    setSelectedDetailActionSuggestionIndex(-1);
    setSelectedDetailPositionSuggestionIndex(-1);
  }

  function composedLabel(t?: string, a?: string, p?: string, m?: string) {
    const pos = p ? ` ${p}` : ""; // nullまたは空文字列なら位置表示なし
    const memoText = m && m.trim() ? ` ${m.trim()}` : "";
    return `${t ?? ""}${a ?? ""}${pos}${memoText}`.trim();
  }

  async function addStructured() {
    if (!target) return; // 対象のみ必須、動作は任意
    const label = composedLabel(target, action, position, memo);
    const amount = Math.round((unitPrice || 0) * (qty || 0));
    
    // Supabaseに保存
    const saveSuccess = await saveWorkHistory(
      target,
      action || '（指定なし）',
      position || null,
      memo || '',
      unitPrice || 0,
      qty || 1
    );
    
    if (!saveSuccess) {
      alert('データベースへの保存に失敗しました');
      return;
    }
    
    setItems(prev => [
      {
        id: genId(),
        type: "structured",
        label,
        action,
        target,
        position,
        memo,
        unitPrice: unitPrice || 0,
        quantity: qty || 0,
        amount,
      },
      ...prev,
    ]);
    
    // 追加後にフォームをクリア
    setTarget("");
    setAction(undefined);
    setPosition(undefined);
    setMemo("");
    setUnitPrice(0);
    setQty(1);
    
    // サジェスト状態もクリア
    setShowTargetSuggestions(false);
    setShowActionSuggestions(false);
    setShowPositionSuggestions(false);
  }


  async function addSet() {
    if (!setName.trim()) return;
    
    // Supabaseに保存
    const details = setDetails.map(detail => ({
      targetName: detail.target || '',
      actionName: detail.action || '（指定なし）',
      positionName: detail.position || '',
      memo: detail.memo || ''
    }));
    
    const saveSuccess = await saveWorkSet(
      setName.trim(),
      setPrice || 0,
      setQuantity || 1,
      details
    );
    
    if (!saveSuccess) {
      alert('セット作業の保存に失敗しました');
      return;
    }
    
    setItems(prev => [
      {
        id: genId(),
        type: "set",
        label: setName.trim(),
        unitPrice: setPrice || 0,
        quantity: setQuantity || 0,
        amount: Math.round((setPrice || 0) * (setQuantity || 0)),
        details: [...setDetails],
      },
      ...prev,
    ]);
    setSetDetails([]);
    setSetName("");
    setSetPrice(0);
    setSetQuantity(1);
  }


  function removeItem(id: string) {
    setItems(prev => prev.filter(i => i.id !== id));
  }

  const totalAmount = useMemo(() => items.reduce((s, i) => s + (i.amount || 0), 0), [items]);

  // データ読み込み中の表示
  if (dictLoading) {
    return (
      <div className="mx-auto max-w-6xl p-6 space-y-6">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="text-gray-600">辞書データを読み込み中...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // エラー状態の表示
  if (dictError) {
    return (
      <div className="mx-auto max-w-6xl p-6 space-y-6">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="text-red-600">エラー: {dictError}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-6">
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl">
              <ClipboardList className="h-5 w-5" /> 作業入力プロトタイプ（辞書3段 + fuzzy + セット）
            </CardTitle>
            <div className="flex items-center gap-3">
              {/* 入力方式設定切り替え */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">入力補助:</span>
                <button
                  onClick={() => setUseModalInput(!useModalInput)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    useModalInput 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {useModalInput ? 'モーダル' : 'インライン'}
                </button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6" style={{ overflow: 'visible' }}>
          <SimpleTabs defaultValue="structured" className="w-full">
            <SimpleTabsList>
              <SimpleTabsTrigger value="structured">個別</SimpleTabsTrigger>
              <SimpleTabsTrigger value="set">セット</SimpleTabsTrigger>
            </SimpleTabsList>

            {/* Structured */}
            <SimpleTabsContent value="structured" className="space-y-4">
              {/* シンプルな横一列レイアウト */}
              <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-end">
                <div className="relative">
                  <SimpleLabel>対象</SimpleLabel>
                  <Input 
                    value={target} 
                    onChange={e => handleTargetInputChange(e.target.value)}
                    onKeyDown={handleTargetKeyDown}
                    onBlur={() => setTimeout(() => setShowTargetSuggestions(false), 200)}
                    placeholder="タイヤ、バンパー..." 
                  />
                  {showTargetSuggestions && targetSuggestions.length > 0 && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {targetSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleTargetSuggestionSelect(suggestion)}
                          className={`w-full px-3 py-2 text-left first:rounded-t-lg last:rounded-b-lg text-sm border-b border-gray-100 last:border-b-0 transition-all ${
                            index === selectedSuggestionIndex 
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
                <div className="relative">
                  <SimpleLabel>動作</SimpleLabel>
                  <Input 
                    value={action || ""} 
                    onChange={e => handleActionInputChange(e.target.value)}
                    onKeyDown={handleActionKeyDown}
                    onBlur={() => setTimeout(() => setShowActionSuggestions(false), 200)}
                    placeholder="（指定なし）、交換、修理..." 
                  />
                  {showActionSuggestions && actionSuggestions.length > 0 && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {actionSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleActionSuggestionSelect(suggestion)}
                          className={`w-full px-3 py-2 text-left first:rounded-t-lg last:rounded-b-lg text-sm border-b border-gray-100 last:border-b-0 transition-all ${
                            index === selectedActionSuggestionIndex 
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
                <div className="relative">
                  <SimpleLabel>位置</SimpleLabel>
                  <Input 
                    value={position || ""} 
                    onChange={e => handlePositionInputChange(e.target.value)}
                    onKeyDown={handlePositionKeyDown}
                    onBlur={() => setTimeout(() => setShowPositionSuggestions(false), 200)}
                    placeholder="右、左、前、後..." 
                  />
                  {showPositionSuggestions && positionSuggestions.length > 0 && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {positionSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handlePositionSuggestionSelect(suggestion)}
                          className={`w-full px-3 py-2 text-left first:rounded-t-lg last:rounded-b-lg text-sm border-b border-gray-100 last:border-b-0 transition-all ${
                            index === selectedPositionSuggestionIndex 
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
                <div>
                  <SimpleLabel>メモ</SimpleLabel>
                  <Input 
                    value={memo} 
                    onChange={e => setMemo(e.target.value)} 
                    placeholder="特記事項、追加情報..." 
                  />
                </div>
                <div>
                  <SimpleLabel>単価</SimpleLabel>
                  <Input type="number" value={unitPrice} onChange={e => setUnitPrice(Number(e.target.value))} />
                </div>
                <div>
                  <SimpleLabel>数量</SimpleLabel>
                  <Input type="number" value={qty} onChange={e => setQty(Number(e.target.value))} />
                </div>
                <div className="flex justify-center">
                  <Button onClick={addStructured} className="h-10 px-4">
                    追加
                  </Button>
                </div>
              </div>
              
              {/* 動作・位置のクイック選択ボタン - インライン表示時&対象入力後のみ */}
              {!useModalInput && target && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 動作のクイック選択 - 対象に関連する動作のみ表示 */}
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">動作（クリックで入力）:</div>
                    <div className="flex flex-wrap gap-1">
                      {(TARGET_ACTIONS[target as keyof typeof TARGET_ACTIONS] || []).map((actionItem) => {
                        const price = suggestPrice(actionItem, target || "", priceBookMap);
                        return (
                          <button
                            key={actionItem}
                            type="button"
                            onClick={() => handleActionSelect(actionItem)}
                            className={`px-2 py-1 text-xs rounded border text-left transition-colors ${
                              action === actionItem 
                                ? 'bg-blue-100 border-blue-300 text-blue-800' 
                                : 'bg-gray-100 hover:bg-blue-100 border-gray-300'
                            }`}
                          >
                            <div>{actionItem}</div>
                            {price && price > 0 && <div className="text-blue-600">¥{formatJPY(price)}</div>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* 位置のクイック選択 - 動作に関連する位置のみ表示 */}
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">位置（クリックで入力）:</div>
                    <div className="flex flex-wrap gap-1">
                      {action ? (
                        (ACTION_POSITIONS[action as keyof typeof ACTION_POSITIONS] || []).map((positionItem) => (
                          <button
                            key={positionItem}
                            type="button"
                            onClick={() => handlePositionSelect(positionItem)}
                            className={`px-2 py-1 text-xs rounded border transition-colors ${
                              position === positionItem 
                                ? 'bg-blue-100 border-blue-300 text-blue-800' 
                                : 'bg-gray-100 hover:bg-blue-100 border-gray-300'
                            }`}
                          >
                            {positionItem}
                          </button>
                        ))
                      ) : (
                        <div className="text-xs text-gray-500 py-1">まず動作を選択してください</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </SimpleTabsContent>

            {/* Set */}
            <SimpleTabsContent value="set" className="space-y-4">
              {/* セット入力：スリム化 */}
              <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-end mb-4">
                <div className="md:col-span-4">
                  <SimpleLabel>セット名</SimpleLabel>
                  <Input value={setName} onChange={e => setSetName(e.target.value)} placeholder="例：外装修理セット" />
                </div>
                <div>
                  <SimpleLabel>単価</SimpleLabel>
                  <Input type="number" value={setPrice} onChange={e => setSetPrice(Number(e.target.value))} />
                </div>
                <div>
                  <SimpleLabel>数量</SimpleLabel>
                  <Input type="number" value={setQuantity} onChange={e => setSetQuantity(Number(e.target.value))} />
                </div>
                <div className="flex justify-center">
                  <Button onClick={addSet} className="h-10 px-4">
                    追加
                  </Button>
                </div>
              </div>

              {/* セット詳細入力 */}
              <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-start mb-4">
                    <div className="relative">
                      <SimpleLabel>対象</SimpleLabel>
                      <Input 
                        value={detailTarget} 
                        onChange={e => handleDetailTargetInputChange(e.target.value)}
                        onKeyDown={handleDetailTargetKeyDown}
                        onBlur={() => setTimeout(() => setShowDetailTargetSuggestions(false), 200)}
                        placeholder="タイヤ、バンパー..." 
                      />
                      {showDetailTargetSuggestions && detailTargetSuggestions.length > 0 && (
                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {detailTargetSuggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => handleDetailTargetSuggestionSelect(suggestion)}
                              className={`w-full px-3 py-2 text-left first:rounded-t-lg last:rounded-b-lg text-sm border-b border-gray-100 last:border-b-0 transition-all ${
                                index === selectedDetailSuggestionIndex 
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
                    <div className="relative">
                      <SimpleLabel>動作</SimpleLabel>
                      <Input 
                        value={detailAction} 
                        onChange={e => handleDetailActionInputChange(e.target.value)}
                        onKeyDown={handleDetailActionKeyDown}
                        onBlur={() => setTimeout(() => setShowDetailActionSuggestions(false), 200)}
                        placeholder="交換、修理、点検..." 
                      />
                      {showDetailActionSuggestions && detailActionSuggestions.length > 0 && (
                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {detailActionSuggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              type="button"
                              onMouseDown={() => handleDetailActionSuggestionSelect(suggestion)}
                              className={`w-full px-3 py-2 text-left first:rounded-t-lg last:rounded-b-lg text-sm border-b border-gray-100 last:border-b-0 transition-all ${
                                index === selectedDetailActionSuggestionIndex 
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
                    <div className="relative">
                      <SimpleLabel>位置</SimpleLabel>
                      <Input 
                        value={detailPosition} 
                        onChange={e => handleDetailPositionInputChange(e.target.value)}
                        onKeyDown={handleDetailPositionKeyDown}
                        onBlur={() => setTimeout(() => setShowDetailPositionSuggestions(false), 200)}
                        placeholder="前、左、右後..." 
                      />
                      {showDetailPositionSuggestions && detailPositionSuggestions.length > 0 && (
                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {detailPositionSuggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              type="button"
                              onMouseDown={() => handleDetailPositionSuggestionSelect(suggestion)}
                              className={`w-full px-3 py-2 text-left first:rounded-t-lg last:rounded-b-lg text-sm border-b border-gray-100 last:border-b-0 transition-all ${
                                index === selectedDetailPositionSuggestionIndex 
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
                    <div>
                      <SimpleLabel>メモ</SimpleLabel>
                      <Input 
                        value={detailMemo} 
                        onChange={e => setDetailMemo(e.target.value)}
                        placeholder="追加情報..." 
                      />
                    </div>
                    <div>
                      {/* 個別の単価に相当するスペーサー */}
                    </div>
                    <div>
                      {/* 個別の数量に相当するスペーサー */}
                    </div>
                    <div className="flex justify-center">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        className="h-10 gap-1 text-xs"
                        onClick={addSetDetailImproved}
                      >
                        <Plus className="h-3 w-3"/> 追加
                      </Button>
                    </div>
                  </div>

                  {/* セット詳細用：動作・位置のクイック選択ボタン - インライン表示時&対象入力後のみ */}
                  {!useModalInput && detailTarget && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* セット詳細：動作のクイック選択 - 対象に関連する動作のみ表示 */}
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">動作（クリックで入力）:</div>
                        <div className="flex flex-wrap gap-1">
                          {(TARGET_ACTIONS[detailTarget as keyof typeof TARGET_ACTIONS] || []).map((actionItem) => (
                            <button
                              key={actionItem}
                              type="button"
                              onClick={() => setDetailAction(actionItem)}
                              className={`px-2 py-1 text-xs rounded border text-left transition-colors ${
                                detailAction === actionItem 
                                  ? 'bg-blue-100 border-blue-300 text-blue-800' 
                                  : 'bg-gray-100 hover:bg-blue-100 border-gray-300'
                              }`}
                            >
                              {actionItem}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* セット詳細：位置のクイック選択 - 動作に関連する位置のみ表示 */}
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">位置（クリックで入力）:</div>
                        <div className="flex flex-wrap gap-1">
                          {detailAction ? (
                            (ACTION_POSITIONS[detailAction as keyof typeof ACTION_POSITIONS] || []).map((positionItem) => (
                              <button
                                key={positionItem}
                                type="button"
                                onClick={() => setDetailPosition(positionItem)}
                                className={`px-2 py-1 text-xs rounded border transition-colors ${
                                  detailPosition === positionItem 
                                    ? 'bg-blue-100 border-blue-300 text-blue-800' 
                                    : 'bg-gray-100 hover:bg-blue-100 border-gray-300'
                                }`}
                              >
                                {positionItem}
                              </button>
                            ))
                          ) : (
                            <div className="text-xs text-gray-500 py-1">まず動作を選択してください</div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

              {/* セット詳細表示 */}
              {setDetails.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {setDetails.map((d, i) => (<SimpleBadge key={i} variant="secondary">{d.label}</SimpleBadge>))}
                </div>
              )}

            </SimpleTabsContent>
          </SimpleTabs>

          <hr className="border-gray-200" />

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <History className="h-4 w-4"/> 明細（プレビュー）
                <span className="ml-auto text-sm text-gray-500">合計 ¥{formatJPY(totalAmount)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {items.length === 0 ? (
                <div className="text-sm text-gray-500">まだ明細はありません</div>
              ) : (
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-start rounded-xl border p-3">
                      <div className="col-span-12 md:col-span-7">
                        <div className="flex items-center gap-2">
                          <SimpleBadge variant={item.type === "structured" ? "default" : item.type === "set" ? "secondary" : "outline"}>
                            {item.type}
                          </SimpleBadge>
                          <div className="font-medium">{item.label}</div>
                        </div>
                        {item.type === "structured" && (
                          <div className="mt-1 text-xs text-gray-500">
                            {item.target} / {item.action} {item.position ? `/ ${item.position}` : ""} {item.memo && `/ ${item.memo}`}
                          </div>
                        )}
                        {item.type === "set" && item.details && item.details.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {item.details.map((d, i) => <SimpleBadge key={i} variant="outline">{d.label}</SimpleBadge>)}
                          </div>
                        )}
                      </div>
                      <div className="col-span-12 md:col-span-4 text-right">
                        <div className="text-sm">単価 ¥{formatJPY(item.unitPrice)} × 数量 {item.quantity}</div>
                        <div className="text-lg font-semibold">¥{formatJPY(item.amount)}</div>
                      </div>
                      <div className="col-span-12 md:col-span-1 flex justify-end">
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* 専用入力補助モーダル */}
      {showInputModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                🔧 {modalSelectedTarget ? `${modalSelectedTarget}の` : ""}作業入力補助
                <span className="text-sm font-normal text-gray-600">
                  （ひらがな・カタカナ・大文字小文字対応）
                </span>
              </h2>
              
              {/* 対象が事前選択されていない場合のみ検索セクション */}
              {!modalSelectedTarget && (
                <>
                  <div className="mb-6">
                    <SimpleLabel>🔤 対象を検索（ひらがな・カタカナ・大文字小文字無関係）</SimpleLabel>
                    <Input 
                      value={modalSearchKeyword}
                      onChange={e => handleModalSearch(e.target.value)}
                      placeholder="例：タイヤ、たいや、タイヤ、TIRE..." 
                      className="text-lg"
                    />
                    <div className="mt-2 text-sm text-gray-500">
                      💡 「タイヤ」「たいや」「タイヤ」「TIRE」などどの表記でも検索できます
                    </div>
                  </div>

                  {/* 対象一覧 */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">
                      {modalSearchKeyword ? '📋 検索結果' : '📋 対象を選択'}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {(modalSearchKeyword ? 
                        advancedFuzzySearch(modalSearchKeyword, TARGETS, READING_MAP) : 
                        TARGETS
                      ).map((target) => (
                        <button
                          key={target}
                          type="button"
                          onClick={() => handleModalTargetSelect(target)}
                          className={`p-3 text-left rounded-lg border text-sm transition-all ${
                            modalSelectedTarget === target
                              ? 'bg-blue-100 border-blue-300 text-blue-800 font-medium'
                              : 'bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-200'
                          }`}
                        >
                          {target}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* 対象が事前選択されている場合の表示 */}
              {modalSelectedTarget && (
                <div className="mb-6 bg-blue-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-700 mb-2">
                    ✅ 選択済み: {modalSelectedTarget}
                  </h3>
                  <p className="text-sm text-blue-600">
                    続いて動作と位置を選択してください
                  </p>
                </div>
              )}

              {/* 動作選択・入力セクション */}
              {modalSelectedTarget && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">
                    🔧 {modalSelectedTarget}の動作を入力（フリー入力可能）
                  </h3>
                  <div className="relative mb-4">
                    <Input 
                      value={modalSelectedAction} 
                      onChange={e => handleModalActionInputChange(e.target.value)}
                      onKeyDown={handleModalActionKeyDown}
                      onBlur={() => setTimeout(() => setShowModalActionSuggestions(false), 200)}
                      placeholder="（指定なし）、交換、修理、カスタム作業..." 
                      className="text-lg"
                    />
                    {showModalActionSuggestions && modalActionSuggestions.length > 0 && (
                      <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {modalActionSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleModalActionSuggestionSelect(suggestion)}
                            className={`w-full px-3 py-2 text-left first:rounded-t-lg last:rounded-b-lg text-sm border-b border-gray-100 last:border-b-0 transition-all ${
                              index === selectedModalActionSuggestionIndex 
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
                  {TARGET_ACTIONS[modalSelectedTarget as keyof typeof TARGET_ACTIONS] && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-600 mb-2">よく使われる動作（クリックで入力）:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {TARGET_ACTIONS[modalSelectedTarget as keyof typeof TARGET_ACTIONS].map((action) => {
                          const price = suggestPrice(action, modalSelectedTarget, priceBookMap);
                          return (
                            <button
                              key={action}
                              type="button"
                              onClick={() => handleModalActionSelect(action)}
                              className="p-2 text-left rounded-lg border text-sm transition-all bg-white border-gray-200 hover:bg-green-50 hover:border-green-200"
                            >
                              <div className="font-medium">{action}</div>
                              {price && price > 0 && (
                                <div className="text-xs text-gray-600">¥{formatJPY(price)}</div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 位置選択・入力セクション */}
              {modalSelectedAction && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">📍 位置を入力（フリー入力可能）</h3>
                  <div className="relative mb-4">
                    <Input 
                      value={modalSelectedPosition || ''} 
                      onChange={e => handleModalPositionInputChange(e.target.value)}
                      onKeyDown={handleModalPositionKeyDown}
                      onBlur={() => setTimeout(() => setShowModalPositionSuggestions(false), 200)}
                      placeholder="（指定なし）、右、左、前、エンジンルーム内..." 
                      className="text-lg"
                    />
                    {showModalPositionSuggestions && modalPositionSuggestions.length > 0 && (
                      <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {modalPositionSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleModalPositionSuggestionSelect(suggestion)}
                            className={`w-full px-3 py-2 text-left first:rounded-t-lg last:rounded-b-lg text-sm border-b border-gray-100 last:border-b-0 transition-all ${
                              index === selectedModalPositionSuggestionIndex 
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
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-600 mb-2">よく使われる位置（クリックで入力）:</h4>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                      {["（指定なし）", "右", "左", "前", "後"].map((position) => (
                        <button
                          key={position}
                          type="button"
                          onClick={() => handleModalPositionSelect(position)}
                          className="p-2 text-center rounded-lg border text-sm transition-all bg-white border-gray-200 hover:bg-orange-50 hover:border-orange-200"
                        >
                          {position}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* メモ入力セクション */}
              {modalSelectedTarget && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">📝 メモ・特記事項（任意）</h3>
                  <textarea 
                    value={modalMemo}
                    onChange={e => setModalMemo(e.target.value)}
                    placeholder="追加情報、注意点、特記事項などを自由に記入してください..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows={3}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    例：部品持参、保証期間外、要相談 等
                  </div>
                </div>
              )}

              {/* プレビューと確定ボタン */}
              {modalSelectedTarget && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">✅ 選択内容の確認</h3>
                  <div className="text-lg font-bold text-blue-600">
                    {composedLabel(modalSelectedTarget, modalSelectedAction, modalSelectedPosition || undefined, modalMemo)}
                  </div>
                  {modalSuggestedPrice > 0 && (
                    <div className="text-sm text-gray-600 mt-1">
                      提案価格: ¥{formatJPY(modalSuggestedPrice)}
                    </div>
                  )}
                </div>
              )}

              {/* ボタンエリア */}
              <div className="flex justify-end gap-3">
                <Button 
                  type="button" 
                  onClick={cancelModal}
                  variant="secondary"
                >
                  キャンセル
                </Button>
                <Button 
                  type="button" 
                  onClick={confirmModalSelection}
                  disabled={!modalSelectedTarget || !modalSelectedAction}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  決定して反映
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* セット詳細選択モーダル */}
      {showDetailInputModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[70vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {detailModalType === 'action' ? `${detailModalTarget}の動作選択` : '位置選択'}
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
                {detailModalSuggestions.map((option, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => selectDetailModalOption(option)}
                    className="p-3 text-left border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  >
                    {option}
                  </button>
                ))}
              </div>
              
              <div className="flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={cancelDetailModal}
                >
                  キャンセル
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}