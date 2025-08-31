"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ClipboardList, History, Plus, Trash2 } from "lucide-react";
import { useWorkDictionary } from "@/hooks/useWorkDictionary";

// utils
const genId = () =>
  typeof crypto !== "undefined" && (crypto as any).randomUUID
    ? (crypto as any).randomUUID()
    : Math.random().toString(36).slice(2);

function formatJPY(n: number | string) {
  const num = typeof n === "string" ? Number(n || 0) : n;
  return new Intl.NumberFormat("ja-JP").format(num);
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\u30A1-\u30F6]/g, (m) => String.fromCharCode(m.charCodeAt(0) - 0x60))
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (m) => String.fromCharCode(m.charCodeAt(0) - 0xFEE0))
    .replace(/\s+/g, "");
}

function advancedFuzzySearch(
  keyword: string,
  list: string[],
  readingMap: { [k: string]: string[] } = {}
): string[] {
  if (!keyword.trim()) return [];
  const norm = normalizeText(keyword);
  return list
    .filter((item) => {
      const ni = normalizeText(item);
      let match = ni.includes(norm);
      if (!match && readingMap[item]) match = readingMap[item].some((r) => normalizeText(r).includes(norm));
      if (!match) match = (readingMap[item] || []).some((r) => norm.includes(normalizeText(r)));
      return match;
    })
    .sort((a, b) => {
      const ai = normalizeText(a).indexOf(norm);
      const bi = normalizeText(b).indexOf(norm);
      if (ai !== bi) return ai - bi;
      return a.length - b.length;
    })
    .slice(0, 8);
}

function suggestPrice(
  action?: string,
  target?: string,
  priceBookMap?: { [k: string]: number }
): number | null {
  if (!action || !target || !priceBookMap) return null;
  return priceBookMap[`${target}_${action}`] || null;
}

// simple tabs
function Tabs({ defaultValue, children }: { defaultValue: string; children: React.ReactNode }) {
  const [tab, setTab] = useState(defaultValue);
  return (
    <div>
      <div className="flex gap-2 border-b border-gray-200 mb-4">
        {React.Children.map(children as any, (child: any) =>
          child?.type?.displayName === "TabTrigger" ? (
            React.cloneElement(child, { active: tab, onClick: () => setTab(child.props.value) })
          ) : child?.type?.displayName === "TabContent" ? null : child
        )}
      </div>
      {React.Children.map(children as any, (child: any) =>
        child?.type?.displayName === "TabContent" ? React.cloneElement(child, { active: tab }) : null
      )}
    </div>
  );
}
function TabTrigger({ value, children, active, onClick }: any) {
  const isActive = active === value;
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium ${
        isActive ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {children}
    </button>
  );
}
TabTrigger.displayName = "TabTrigger";
function TabContent({ value, active, children }: any) {
  if (active !== value) return null;
  return <div className="space-y-4">{children}</div>;
}
TabContent.displayName = "TabContent";
function SimpleLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-gray-700 mb-2">{children}</label>;
}

// types
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
  details?: Array<{ action?: string; target?: string; position?: string; memo?: string; label: string; quantity?: number }>;
}

export default function WorkEntryPrototype2() {
  const {
    targetsArray: TARGETS,
    actionsArray: ACTIONS,
    positionsArray: POSITIONS,
    readingMap: READING_MAP,
    targetActionsMap: TARGET_ACTIONS,
    actionPositionsMap: ACTION_POSITIONS,
    priceBookMap,
    loading: dictLoading,
    error: dictError,
  } = useWorkDictionary();

  // structured state
  const [target, setTarget] = useState("");
  const [action, setAction] = useState<string | undefined>();
  const [position, setPosition] = useState<string | undefined>();
  const [memo, setMemo] = useState("");
  const [unitPrice, setUnitPrice] = useState(0);
  const [qty, setQty] = useState(1);
  const [isTargetConfirmed, setIsTargetConfirmed] = useState(false);

  const suggested = useMemo(() => suggestPrice(action, target, priceBookMap), [action, target, priceBookMap]);
  React.useEffect(() => {
    if (suggested != null && (unitPrice === 0 || Number.isNaN(unitPrice))) setUnitPrice(suggested);
  }, [suggested]);

  // target suggestions with empty-input full list paging
  const [targetSuggestions, setTargetSuggestions] = useState<string[]>([]);
  const [showTargetSuggestions, setShowTargetSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const TARGETS_PER_PAGE = 50;
  const [targetPage, setTargetPage] = useState(0);
  const totalTargetPages = useMemo(
    () => Math.max(1, Math.ceil((TARGETS?.length || 0) / TARGETS_PER_PAGE)),
    [TARGETS]
  );
  const showFullTargetPage = (page: number) => {
    const p = Math.min(Math.max(0, page), totalTargetPages - 1);
    setTargetPage(p);
    const start = p * TARGETS_PER_PAGE;
    setTargetSuggestions(TARGETS.slice(start, start + TARGETS_PER_PAGE));
    setShowTargetSuggestions(true);
    setSelectedSuggestionIndex(-1);
  };

  // action/position suggestions
  const [actionSuggestions, setActionSuggestions] = useState<string[]>([]);
  const [showActionSuggestions, setShowActionSuggestions] = useState(false);
  const [selectedActionSuggestionIndex, setSelectedActionSuggestionIndex] = useState(-1);
  const [positionSuggestions, setPositionSuggestions] = useState<string[]>([]);
  const [showPositionSuggestions, setShowPositionSuggestions] = useState(false);
  const [selectedPositionSuggestionIndex, setSelectedPositionSuggestionIndex] = useState(-1);

  // available lists
  const availableActions = useMemo(() => {
    if (!target || !TARGET_ACTIONS || !(target in TARGET_ACTIONS)) return ACTIONS || [];
    return TARGET_ACTIONS[target] || ACTIONS || [];
  }, [target, TARGET_ACTIONS, ACTIONS]);
  const availablePositions = useMemo(() => {
    if (!action || !ACTION_POSITIONS) return POSITIONS || [];
    return ACTION_POSITIONS[action] || POSITIONS || [];
  }, [action, ACTION_POSITIONS, POSITIONS]);

  // set state
  const [setName, setSetName] = useState("");
  const [setPrice, setSetPrice] = useState(0);
  const [setQuantity, setSetQuantity] = useState(1);
  const [
    setDetails,
    setSetDetails,
  ] = useState<Array<{ action?: string; target?: string; position?: string; memo?: string; label: string; quantity?: number }>>([]);

  // set detail + gating
  const [detailTarget, setDetailTarget] = useState("");
  const [detailAction, setDetailAction] = useState("");
  const [detailPosition, setDetailPosition] = useState("");
  const [detailMemo, setDetailMemo] = useState("");
  const [detailQuantity, setDetailQuantity] = useState<number>(1);
  const [isDetailTargetConfirmed, setIsDetailTargetConfirmed] = useState(false);

  // set detail target suggestions with paging
  const [detailTargetSuggestions, setDetailTargetSuggestions] = useState<string[]>([]);
  const [showDetailTargetSuggestions, setShowDetailTargetSuggestions] = useState(false);
  const [selectedDetailSuggestionIndex, setSelectedDetailSuggestionIndex] = useState(-1);
  const [detailTargetPage, setDetailTargetPage] = useState(0);
  const detailTotalTargetPages = useMemo(
    () => Math.max(1, Math.ceil((TARGETS?.length || 0) / TARGETS_PER_PAGE)),
    [TARGETS]
  );
  const showDetailFullTargetPage = (page: number) => {
    const p = Math.min(Math.max(0, page), detailTotalTargetPages - 1);
    setDetailTargetPage(p);
    const start = p * TARGETS_PER_PAGE;
    setDetailTargetSuggestions(TARGETS.slice(start, start + TARGETS_PER_PAGE));
    setShowDetailTargetSuggestions(true);
    setSelectedDetailSuggestionIndex(-1);
  };

  const [detailActionSuggestions, setDetailActionSuggestions] = useState<string[]>([]);
  const [showDetailActionSuggestions, setShowDetailActionSuggestions] = useState(false);
  const [selectedDetailActionSuggestionIndex, setSelectedDetailActionSuggestionIndex] = useState(-1);
  const [detailPositionSuggestions, setDetailPositionSuggestions] = useState<string[]>([]);
  const [showDetailPositionSuggestions, setShowDetailPositionSuggestions] = useState(false);
  const [selectedDetailPositionSuggestionIndex, setSelectedDetailPositionSuggestionIndex] = useState(-1);

  const detailAvailableActions = useMemo(() => {
    if (!detailTarget || !(detailTarget in TARGET_ACTIONS)) return ACTIONS;
    return TARGET_ACTIONS[detailTarget as keyof typeof TARGET_ACTIONS];
  }, [detailTarget, TARGET_ACTIONS, ACTIONS]);

  // handlers
  function handleTargetInputChange(value: string) {
    setTarget(value);
    setIsTargetConfirmed(false);
    setSelectedSuggestionIndex(-1);
    if (value.trim()) {
      const s = advancedFuzzySearch(value, TARGETS, READING_MAP);
      setTargetSuggestions(s);
      setShowTargetSuggestions(s.length > 0);
    } else {
      showFullTargetPage(0);
    }
    if (
      action &&
      TARGET_ACTIONS[value as keyof typeof TARGET_ACTIONS] &&
      !TARGET_ACTIONS[value as keyof typeof TARGET_ACTIONS].includes(action)
    ) {
      setAction(undefined);
      setUnitPrice(0);
    }
  }
  function handleTargetFocus() {
    if (!target.trim()) showFullTargetPage(0);
  }
  function handleTargetKeyDown(e: React.KeyboardEvent) {
    if (!showTargetSuggestions || targetSuggestions.length === 0) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedSuggestionIndex((p) => (p < targetSuggestions.length - 1 ? p + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedSuggestionIndex((p) => (p > 0 ? p - 1 : targetSuggestions.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedSuggestionIndex >= 0)
          handleTargetSuggestionSelect(targetSuggestions[selectedSuggestionIndex]);
        break;
      case "Escape":
        setShowTargetSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  }
  function handleTargetSuggestionSelect(t: string) {
    setShowTargetSuggestions(false);
    setSelectedSuggestionIndex(-1);
    setTarget(t);
    setIsTargetConfirmed(true);
  }

  function handleActionInputChange(value: string) {
    setAction(value);
    setSelectedActionSuggestionIndex(-1);
    if (value.trim()) {
      const s = advancedFuzzySearch(value, availableActions, READING_MAP);
      setActionSuggestions(s);
      setShowActionSuggestions(s.length > 0);
    } else {
      setShowActionSuggestions(false);
    }
  }
  function handleActionKeyDown(e: React.KeyboardEvent) {
    if (!showActionSuggestions || actionSuggestions.length === 0) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedActionSuggestionIndex((p) => (p < actionSuggestions.length - 1 ? p + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedActionSuggestionIndex((p) => (p > 0 ? p - 1 : actionSuggestions.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedActionSuggestionIndex >= 0)
          handleActionSuggestionSelect(actionSuggestions[selectedActionSuggestionIndex]);
        break;
      case "Escape":
        e.preventDefault();
        setShowActionSuggestions(false);
        setSelectedActionSuggestionIndex(-1);
        break;
    }
  }
  function handleActionSuggestionSelect(s: string) {
    setAction(s);
    setShowActionSuggestions(false);
    setSelectedActionSuggestionIndex(-1);
    const price = suggestPrice(s, target, priceBookMap);
    if (price && price > 0) setUnitPrice(price);
  }
  function handleActionSelect(a: string) {
    handleActionSuggestionSelect(a);
  }

  function handlePositionInputChange(value: string) {
    setPosition(value);
    setSelectedPositionSuggestionIndex(-1);
    if (value.trim()) {
      const s = advancedFuzzySearch(value, POSITIONS, READING_MAP);
      setPositionSuggestions(s);
      setShowPositionSuggestions(s.length > 0);
    } else {
      setShowPositionSuggestions(false);
    }
  }
  function handlePositionKeyDown(e: React.KeyboardEvent) {
    if (!showPositionSuggestions || positionSuggestions.length === 0) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedPositionSuggestionIndex((p) => (p < positionSuggestions.length - 1 ? p + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedPositionSuggestionIndex((p) => (p > 0 ? p - 1 : positionSuggestions.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedPositionSuggestionIndex >= 0)
          handlePositionSuggestionSelect(positionSuggestions[selectedPositionSuggestionIndex]);
        break;
      case "Escape":
        e.preventDefault();
        setShowPositionSuggestions(false);
        setSelectedPositionSuggestionIndex(-1);
        break;
    }
  }
  function handlePositionSuggestionSelect(s: string) {
    setPosition(s);
    setShowPositionSuggestions(false);
    setSelectedPositionSuggestionIndex(-1);
  }
  function handlePositionSelect(p: string) {
    handlePositionSuggestionSelect(p);
  }

  // set detail handlers
  function handleDetailTargetInputChange(value: string) {
    setDetailTarget(value);
    setIsDetailTargetConfirmed(false);
    setSelectedDetailSuggestionIndex(-1);
    if (value.trim()) {
      const s = advancedFuzzySearch(value, TARGETS, READING_MAP);
      setDetailTargetSuggestions(s);
      setShowDetailTargetSuggestions(s.length > 0);
    } else {
      showDetailFullTargetPage(0);
    }
    if (
      detailAction &&
      TARGET_ACTIONS[value as keyof typeof TARGET_ACTIONS] &&
      !TARGET_ACTIONS[value as keyof typeof TARGET_ACTIONS].includes(detailAction)
    )
      setDetailAction("");
  }
  function handleDetailTargetFocus() {
    if (!detailTarget.trim()) showDetailFullTargetPage(0);
  }
  function handleDetailTargetKeyDown(e: React.KeyboardEvent) {
    if (!showDetailTargetSuggestions || detailTargetSuggestions.length === 0) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedDetailSuggestionIndex((p) => (p < detailTargetSuggestions.length - 1 ? p + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedDetailSuggestionIndex((p) => (p > 0 ? p - 1 : detailTargetSuggestions.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedDetailSuggestionIndex >= 0)
          handleDetailTargetSuggestionSelect(detailTargetSuggestions[selectedDetailSuggestionIndex]);
        break;
      case "Escape":
        setShowDetailTargetSuggestions(false);
        setSelectedDetailSuggestionIndex(-1);
        break;
    }
  }
  function handleDetailTargetSuggestionSelect(t: string) {
    setShowDetailTargetSuggestions(false);
    setSelectedDetailSuggestionIndex(-1);
    setDetailTarget(t);
    setIsDetailTargetConfirmed(true);
  }
  function handleDetailActionInputChange(value: string) {
    setDetailAction(value);
    setSelectedDetailActionSuggestionIndex(-1);
    if (value.trim()) {
      const s = advancedFuzzySearch(value, detailAvailableActions, READING_MAP);
      setDetailActionSuggestions(s);
      setShowDetailActionSuggestions(s.length > 0);
    } else {
      setShowDetailActionSuggestions(false);
    }
  }
  function handleDetailActionKeyDown(e: React.KeyboardEvent) {
    if (!showDetailActionSuggestions || detailActionSuggestions.length === 0) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedDetailActionSuggestionIndex((p) => (p < detailActionSuggestions.length - 1 ? p + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedDetailActionSuggestionIndex((p) => (p > 0 ? p - 1 : detailActionSuggestions.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedDetailActionSuggestionIndex >= 0)
          handleDetailActionSuggestionSelect(detailActionSuggestions[selectedDetailActionSuggestionIndex]);
        break;
      case "Escape":
        setShowDetailActionSuggestions(false);
        setSelectedDetailActionSuggestionIndex(-1);
        break;
    }
  }
  function handleDetailActionSuggestionSelect(s: string) {
    setDetailAction(s);
    setShowDetailActionSuggestions(false);
    setSelectedDetailActionSuggestionIndex(-1);
  }
  function handleDetailPositionInputChange(value: string) {
    setDetailPosition(value);
    setSelectedDetailPositionSuggestionIndex(-1);
    if (value.trim()) {
      const s = advancedFuzzySearch(value, POSITIONS, READING_MAP);
      setDetailPositionSuggestions(s);
      setShowDetailPositionSuggestions(s.length > 0);
    } else {
      setShowDetailPositionSuggestions(false);
    }
  }
  function handleDetailPositionKeyDown(e: React.KeyboardEvent) {
    if (!showDetailPositionSuggestions || detailPositionSuggestions.length === 0) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedDetailPositionSuggestionIndex((p) => (p < detailPositionSuggestions.length - 1 ? p + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedDetailPositionSuggestionIndex((p) => (p > 0 ? p - 1 : detailPositionSuggestions.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedDetailPositionSuggestionIndex >= 0)
          handleDetailPositionSuggestionSelect(
            detailPositionSuggestions[selectedDetailPositionSuggestionIndex]
          );
        break;
      case "Escape":
        setShowDetailPositionSuggestions(false);
        setSelectedDetailPositionSuggestionIndex(-1);
        break;
    }
  }
  function handleDetailPositionSuggestionSelect(s: string) {
    setDetailPosition(s);
    setShowDetailPositionSuggestions(false);
    setSelectedDetailPositionSuggestionIndex(-1);
  }

  // add/save
  function composedLabel(t?: string, a?: string, p?: string, m?: string) {
    const pos = p ? ` ${p}` : "";
    const memoText = m && m.trim() ? ` ${m.trim()}` : "";
    return `${t ?? ""}${a ?? ""}${pos}${memoText}`.trim();
  }
  function addStructured() {
    if (!target) return;
    const label = composedLabel(target, action, position, memo);
    const amount = Math.round((unitPrice || 0) * (qty || 0));
    // DB保存は行わず、明細にのみ追加（保存はメインページで集約）
    setItems((prev) => [
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
    setTarget("");
    setAction(undefined);
    setPosition(undefined);
    setMemo("");
    setUnitPrice(0);
    setQty(1);
    setIsTargetConfirmed(false);
    setShowTargetSuggestions(false);
    setShowActionSuggestions(false);
    setShowPositionSuggestions(false);
  }
  function addSet() {
    if (!setName.trim()) return;
    // DB保存は行わず、明細にのみ追加（保存はメインページで集約）
    setItems((prev) => [
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
  function addSetDetail() {
    if (!detailTarget) return;
    const label = composedLabel(detailTarget, detailAction, detailPosition, detailMemo);
    setSetDetails((prev) => [
      {
        action: detailAction,
        target: detailTarget,
        position: detailPosition,
        memo: detailMemo,
        label,
        quantity: detailQuantity || 1,
      },
      ...prev,
    ]);
    setDetailTarget("");
    setDetailAction("");
    setDetailPosition("");
    setDetailMemo("");
    setDetailQuantity(1);
    setIsDetailTargetConfirmed(false);
    setShowDetailTargetSuggestions(false);
    setShowDetailActionSuggestions(false);
    setShowDetailPositionSuggestions(false);
    setSelectedDetailSuggestionIndex(-1);
    setSelectedDetailActionSuggestionIndex(-1);
    setSelectedDetailPositionSuggestionIndex(-1);
  }
  function removeSetDetailAt(index: number) {
    setSetDetails((prev) => prev.filter((_, i) => i !== index));
  }
  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }
  const [items, setItems] = useState<LineItem[]>([]);
  const totalAmount = useMemo(() => items.reduce((s, i) => s + (i.amount || 0), 0), [items]);

  if (dictLoading)
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
  if (dictError)
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

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-6">
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl">
              <ClipboardList className="h-5 w-5" /> 作業入力プロトタイプ2
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6" style={{ overflow: "visible" }}>
          <Tabs defaultValue="structured">
            <TabTrigger value="structured">個別</TabTrigger>
            <TabTrigger value="set">セット</TabTrigger>
            <TabContent value="structured">
              <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-end">
                <div className="relative">
                  <SimpleLabel>対象</SimpleLabel>
                  <Input
                    value={target}
                    onChange={(e) => handleTargetInputChange(e.target.value)}
                    onKeyDown={handleTargetKeyDown}
                    onFocus={handleTargetFocus}
                    onBlur={() => setTimeout(() => setShowTargetSuggestions(false), 200)}
                    placeholder="タイヤ、バンパー..."
                  />
                  {showTargetSuggestions && targetSuggestions.length > 0 && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {targetSuggestions.map((s, i) => (
                        <button
                          key={`${s}-${i}`}
                          type="button"
                          onClick={() => handleTargetSuggestionSelect(s)}
                          className={`w-full px-3 py-2 text-left first:rounded-t-lg last:rounded-b-lg text-sm border-b border-gray-100 last:border-b-0 transition-all ${
                            i === selectedSuggestionIndex ? "bg-blue-100 text-blue-800" : "hover:bg-blue-50"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                      {!target.trim() && (
                        <div className="sticky bottom-0 bg-white border-t border-gray-200 flex items-center justify-between px-2 py-1 text-xs">
                          <button
                            className="px-2 py-1 rounded border bg-gray-50 hover:bg-gray-100"
                            onMouseDown={() => showFullTargetPage(Math.max(0, targetPage - 1))}
                          >
                            前
                          </button>
                          <div>
                            ページ {targetPage + 1} / {totalTargetPages}
                          </div>
                          <button
                            className="px-2 py-1 rounded border bg-gray-50 hover:bg-gray-100"
                            onMouseDown={() => showFullTargetPage(Math.min(totalTargetPages - 1, targetPage + 1))}
                          >
                            次
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <SimpleLabel>動作</SimpleLabel>
                  <Input
                    value={action || ""}
                    onChange={(e) => handleActionInputChange(e.target.value)}
                    onKeyDown={handleActionKeyDown}
                    onBlur={() => setTimeout(() => setShowActionSuggestions(false), 200)}
                    placeholder="（指定なし）、交換、修理..."
                  />
                  {showActionSuggestions && actionSuggestions.length > 0 && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {actionSuggestions.map((s, i) => (
                        <button
                          key={`${s}-${i}`}
                          type="button"
                          onClick={() => handleActionSuggestionSelect(s)}
                          className={`w-full px-3 py-2 text-left first:rounded-t-lg last:rounded-b-lg text-sm border-b border-gray-100 last:border-b-0 transition-all ${
                            i === selectedActionSuggestionIndex ? "bg-blue-100 text-blue-800" : "hover:bg-blue-50"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <SimpleLabel>位置</SimpleLabel>
                  <Input
                    value={position || ""}
                    onChange={(e) => handlePositionInputChange(e.target.value)}
                    onKeyDown={handlePositionKeyDown}
                    onBlur={() => setTimeout(() => setShowPositionSuggestions(false), 200)}
                    placeholder="右、左、前、後..."
                  />
                  {showPositionSuggestions && positionSuggestions.length > 0 && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {positionSuggestions.map((s, i) => (
                        <button
                          key={`${s}-${i}`}
                          type="button"
                          onClick={() => handlePositionSuggestionSelect(s)}
                          className={`w-full px-3 py-2 text-left first:rounded-t-lg last:rounded-b-lg text-sm border-b border-gray-100 last:border-b-0 transition-all ${
                            i === selectedPositionSuggestionIndex ? "bg-blue-100 text-blue-800" : "hover:bg-blue-50"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <SimpleLabel>メモ</SimpleLabel>
                  <Input value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="特記事項、追加情報..." />
                </div>
                <div>
                  <SimpleLabel>単価</SimpleLabel>
                  <Input type="number" value={unitPrice} onChange={(e) => setUnitPrice(Number(e.target.value))} />
                </div>
                <div>
                  <SimpleLabel>数量</SimpleLabel>
                  <Input type="number" value={qty} onChange={(e) => setQty(Number(e.target.value))} />
                </div>
                <div className="flex justify-center">
                  <Button onClick={addStructured} className="h-10 px-4">
                    追加
                  </Button>
                </div>
              </div>
              {isTargetConfirmed && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">動作（クリックで入力）:</div>
                    <div className="flex flex-wrap gap-1">
                      {(TARGET_ACTIONS[target as keyof typeof TARGET_ACTIONS] || []).map((a) => {
                        const price = suggestPrice(a, target || "", priceBookMap);
                        return (
                          <button
                            key={a}
                            type="button"
                            onClick={() => handleActionSelect(a)}
                            className={`px-2 py-1 text-xs rounded border text-left transition-colors ${
                              action === a
                                ? "bg-blue-100 border-blue-300 text-blue-800"
                                : "bg-gray-100 hover:bg-blue-100 border-gray-300"
                            }`}
                          >
                            <div>{a}</div>
                            {price && price > 0 && (
                              <div className="text-blue-600">¥{formatJPY(price)}</div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">位置（クリックで入力）:</div>
                    <div className="flex flex-wrap gap-1">
                      {action ? (
                        (ACTION_POSITIONS[action as keyof typeof ACTION_POSITIONS] || []).map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => handlePositionSelect(p)}
                            className={`px-2 py-1 text-xs rounded border transition-colors ${
                              position === p
                                ? "bg-blue-100 border-blue-300 text-blue-800"
                                : "bg-gray-100 hover:bg-blue-100 border-gray-300"
                            }`}
                          >
                            {p}
                          </button>
                        ))
                      ) : (
                        <div className="text-xs text-gray-500 py-1">まず動作を選択してください</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </TabContent>

            <TabContent value="set">
              <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-end mb-4">
                <div className="md:col-span-4">
                  <SimpleLabel>セット名</SimpleLabel>
                  <Input value={setName} onChange={(e) => setSetName(e.target.value)} placeholder="例：外装修理セット" />
                </div>
                <div>
                  <SimpleLabel>単価</SimpleLabel>
                  <Input type="number" value={setPrice} onChange={(e) => setSetPrice(Number(e.target.value))} />
                </div>
                <div>
                  <SimpleLabel>数量</SimpleLabel>
                  <Input type="number" value={setQuantity} onChange={(e) => setSetQuantity(Number(e.target.value))} />
                </div>
                <div className="flex justify-center">
                  <Button onClick={addSet} className="h-10 px-4">
                    追加
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-start mb-4">
                <div className="relative">
                  <SimpleLabel>対象</SimpleLabel>
                  <Input
                    value={detailTarget}
                    onChange={(e) => handleDetailTargetInputChange(e.target.value)}
                    onKeyDown={handleDetailTargetKeyDown}
                    onFocus={handleDetailTargetFocus}
                    onBlur={() => setTimeout(() => setShowDetailTargetSuggestions(false), 200)}
                    placeholder="タイヤ、バンパー..."
                  />
                  {showDetailTargetSuggestions && detailTargetSuggestions.length > 0 && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {detailTargetSuggestions.map((s, i) => (
                        <button
                          key={`${s}-${i}`}
                          type="button"
                          onClick={() => handleDetailTargetSuggestionSelect(s)}
                          className={`w-full px-3 py-2 text-left first:rounded-t-lg last:rounded-b-lg text-sm border-b border-gray-100 last:border-b-0 transition-all ${
                            i === selectedDetailSuggestionIndex ? "bg-blue-100 text-blue-800" : "hover:bg-blue-50"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                      {!detailTarget.trim() && (
                        <div className="sticky bottom-0 bg-white border-t border-gray-200 flex items-center justify-between px-2 py-1 text-xs">
                          <button
                            className="px-2 py-1 rounded border bg-gray-50 hover:bg-gray-100"
                            onMouseDown={() => showDetailFullTargetPage(Math.max(0, detailTargetPage - 1))}
                          >
                            前
                          </button>
                          <div>
                            ページ {detailTargetPage + 1} / {detailTotalTargetPages}
                          </div>
                          <button
                            className="px-2 py-1 rounded border bg-gray-50 hover:bg-gray-100"
                            onMouseDown={() => showDetailFullTargetPage(Math.min(detailTotalTargetPages - 1, detailTargetPage + 1))}
                          >
                            次
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <SimpleLabel>動作</SimpleLabel>
                  <Input
                    value={detailAction}
                    onChange={(e) => handleDetailActionInputChange(e.target.value)}
                    onKeyDown={handleDetailActionKeyDown}
                    onBlur={() => setTimeout(() => setShowDetailActionSuggestions(false), 200)}
                    placeholder="交換、修理、点検..."
                  />
                  {showDetailActionSuggestions && detailActionSuggestions.length > 0 && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {detailActionSuggestions.map((s, i) => (
                        <button
                          key={`${s}-${i}`}
                          type="button"
                          onMouseDown={() => handleDetailActionSuggestionSelect(s)}
                          className={`w-full px-3 py-2 text-left first:rounded-t-lg last:rounded-b-lg text-sm border-b border-gray-100 last:border-b-0 transition-all ${
                            i === selectedDetailActionSuggestionIndex ? "bg-blue-100 text-blue-800" : "hover:bg-blue-50"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <SimpleLabel>位置</SimpleLabel>
                  <Input
                    value={detailPosition}
                    onChange={(e) => handleDetailPositionInputChange(e.target.value)}
                    onKeyDown={handleDetailPositionKeyDown}
                    onBlur={() => setTimeout(() => setShowDetailPositionSuggestions(false), 200)}
                    placeholder="前、左、右後..."
                  />
                  {showDetailPositionSuggestions && detailPositionSuggestions.length > 0 && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {detailPositionSuggestions.map((s, i) => (
                        <button
                          key={`${s}-${i}`}
                          type="button"
                          onMouseDown={() => handleDetailPositionSuggestionSelect(s)}
                          className={`w-full px-3 py-2 text-left first:rounded-t-lg last:rounded-b-lg text-sm border-b border-gray-100 last:border-b-0 transition-all ${
                            i === selectedDetailPositionSuggestionIndex ? "bg-blue-100 text-blue-800" : "hover:bg-blue-50"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <SimpleLabel>メモ</SimpleLabel>
                  <Input value={detailMemo} onChange={(e) => setDetailMemo(e.target.value)} placeholder="追加情報..." />
                </div>
                <div>
                  <SimpleLabel>数量</SimpleLabel>
                  <Input
                    type="number"
                    min={1}
                    value={detailQuantity}
                    onChange={(e) =>
                      setDetailQuantity(
                        Number.isFinite(e.currentTarget.valueAsNumber) && e.currentTarget.valueAsNumber > 0
                          ? e.currentTarget.valueAsNumber
                          : 1
                      )
                    }
                  />
                </div>
                <div></div>
                <div className="flex justify-center">
                  <Button variant="secondary" size="sm" className="h-10 gap-1 text-xs" onClick={addSetDetail}>
                    <Plus className="h-3 w-3" /> 明細行追加
                  </Button>
                </div>
              </div>

              {setDetails.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    セット明細（{setDetails.length}件）
                  </div>
                  <div className="space-y-2">
                    {setDetails.map((d, i) => (
                      <div key={`${d.label}-${i}`} className="flex items-center justify-between rounded-lg border p-2">
                        <div className="text-sm text-gray-700">
                          {d.label}
                          {d.quantity && d.quantity !== 1 ? (
                            <span className="ml-2 text-gray-500">×{d.quantity}</span>
                          ) : null}
                        </div>
                        <button
                          onClick={() => removeSetDetailAt(i)}
                          className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                          aria-label={`明細${i + 1}を削除`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isDetailTargetConfirmed && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">動作（クリックで入力）:</div>
                    <div className="flex flex-wrap gap-1">
                      {(TARGET_ACTIONS[detailTarget as keyof typeof TARGET_ACTIONS] || []).map((a) => (
                        <button
                          key={a}
                          type="button"
                          onClick={() => setDetailAction(a)}
                          className={`px-2 py-1 text-xs rounded border text-left transition-colors ${
                            detailAction === a
                              ? "bg-blue-100 border-blue-300 text-blue-800"
                              : "bg-gray-100 hover:bg-blue-100 border-gray-300"
                          }`}
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">位置（クリックで入力）:</div>
                    <div className="flex flex-wrap gap-1">
                      {detailAction ? (
                        (ACTION_POSITIONS[detailAction as keyof typeof ACTION_POSITIONS] || []).map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setDetailPosition(p)}
                            className={`px-2 py-1 text-xs rounded border transition-colors ${
                              detailPosition === p
                                ? "bg-blue-100 border-blue-300 text-blue-800"
                                : "bg-gray-100 hover:bg-blue-100 border-gray-300"
                            }`}
                          >
                            {p}
                          </button>
                        ))
                      ) : (
                        <div className="text-xs text-gray-500 py-1">まず動作を選択してください</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </TabContent>
          </Tabs>

          <hr className="border-gray-200" />

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <History className="h-4 w-4" /> 明細（プレビュー）
                <span className="ml-auto text-sm text-gray-500">合計 ¥{formatJPY(totalAmount)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {items.length === 0 ? (
                <>
                  <div className="text-sm text-gray-500">まだ明細はありません</div>
                  {/* spacer rows to ensure enough lower space on desktop */}
                  <div aria-hidden="true" className="h-6" />
                  <div aria-hidden="true" className="h-6" />
                </>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-start rounded-xl border p-3">
                      <div className="col-span-12 md:col-span-7">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                              item.type === "structured"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {item.type}
                          </span>
                          <div className="font-medium">{item.label}</div>
                        </div>
                        {item.type === "structured" && (
                          <div className="mt-1 text-xs text-gray-500">
                            {item.target} / {item.action} {item.position ? `/ ${item.position}` : ""} {item.memo && `/ ${item.memo}`}
                          </div>
                        )}
                        {item.type === "set" && item.details && item.details.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {item.details.map((d, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-white text-gray-700 border border-gray-300"
                              >
                                {d.label}
                                {d.quantity && d.quantity !== 1 ? (
                                  <span className="ml-1 text-gray-500">×{d.quantity}</span>
                                ) : null}
                              </span>
                            ))}
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
    </div>
  );
}
