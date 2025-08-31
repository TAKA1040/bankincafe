import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { History, Trash2 } from 'lucide-react';

// 共通の明細データ型
export interface WorkLineItem {
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
  details?: Array<{ 
    action?: string; 
    target?: string; 
    position?: string; 
    memo?: string; 
    label: string 
  }>;
}

// バッジコンポーネント（プロトタイプから移植）
interface SimpleBadgeProps {
  variant?: "default" | "secondary" | "outline";
  children: React.ReactNode;
}

function SimpleBadge({ variant = "default", children }: SimpleBadgeProps) {
  const baseClasses = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";
  const variantClasses = {
    default: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800", 
    outline: "border border-gray-300 text-gray-700"
  };
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </span>
  );
}

// 日本円フォーマット関数
function formatJPY(n: number | string) {
  const num = typeof n === "string" ? Number(n || 0) : n;
  return new Intl.NumberFormat("ja-JP").format(num);
}

interface WorkItemListProps {
  items: WorkLineItem[];
  onRemoveItem: (id: string) => void;
  title?: string;
  showTotal?: boolean;
}

export function WorkItemList({ 
  items, 
  onRemoveItem, 
  title = "明細（プレビュー）",
  showTotal = true 
}: WorkItemListProps) {
  const totalAmount = items.reduce((sum, item) => sum + (item.amount || 0), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <History className="h-4 w-4"/> {title}
          {showTotal && (
            <span className="ml-auto text-sm text-gray-500">
              合計 ¥{formatJPY(totalAmount)}
            </span>
          )}
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
                    <SimpleBadge 
                      variant={
                        item.type === "structured" ? "default" : 
                        item.type === "set" ? "secondary" : "outline"
                      }
                    >
                      {item.type}
                    </SimpleBadge>
                    <div className="font-medium">{item.label}</div>
                  </div>
                  
                  {/* 個別作業の詳細情報 */}
                  {item.type === "structured" && (
                    <div className="mt-1 text-xs text-gray-500">
                      {item.target} / {item.action} {
                        item.position && item.position !== "（指定なし）" ? `/ ${item.position}` : ""
                      } {item.memo && `/ ${item.memo}`}
                    </div>
                  )}
                  
                  {/* セット作業の詳細情報 */}
                  {item.type === "set" && item.details && item.details.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {item.details.map((detail, index) => (
                        <SimpleBadge key={index} variant="outline">
                          {detail.label}
                        </SimpleBadge>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* 金額情報 */}
                <div className="col-span-12 md:col-span-4 text-right">
                  <div className="text-sm">
                    単価 ¥{formatJPY(item.unitPrice)} × 数量 {item.quantity}
                  </div>
                  <div className="text-lg font-semibold">¥{formatJPY(item.amount)}</div>
                </div>
                
                {/* 削除ボタン */}
                <div className="col-span-12 md:col-span-1 flex justify-end">
                  <button 
                    onClick={() => onRemoveItem(item.id)}
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
  );
}

export default WorkItemList;