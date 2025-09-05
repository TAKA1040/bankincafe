# 📋 アプリケーションコード修正計画

## 🎯 目標
新しいデータベーススキーマ（DATABASE_SCHEMA.md）に対応したアプリケーションコードへの完全移行

## 📊 修正対象の分析結果

### **🔍 現在の問題点**
1. **invoice_payments テーブル未対応**: 支払い情報が invoices.payment_date で管理されている
2. **work_item_positions テーブル未対応**: 位置情報が単一フィールドで管理
3. **赤伝（credit_note）未対応**: invoice_type による請求書種別の区別なし
4. **legacy_line_item_raws テーブル未対応**: 旧原文データの分離が不完全

### **📁 修正対象ファイル**

#### **Phase 1: 売上管理ページ (最優先)**
- `src/hooks/useSalesData.ts` - **完全書き換え必要**
- `src/app/sales-management/page.tsx` - **大幅修正必要**

#### **Phase 2: 作業価格検索ページ**
- `src/app/work-search/page.tsx` - **位置情報表示の修正**

#### **Phase 3: データ作成・更新ロジック**  
- 請求書作成API
- 作業項目作成・更新処理

## 🚀 Phase 1: 売上管理ページの修正

### **1.1 useSalesData.ts の修正内容**

#### **🔄 SalesInvoice インターフェース更新**
```typescript
// 変更前
export interface SalesInvoice {
  payment_date: string | null  // 削除
  remaining_amount: number | null  // 要計算化
}

// 変更後  
export interface SalesInvoice {
  invoice_type: 'standard' | 'credit_note'  // 追加
  original_invoice_id: string | null  // 追加
  total_paid: number  // 追加（計算値）
  remaining_amount: number  // 変更（計算値）
  last_payment_date: string | null  // 追加（最終入金日）
  payment_history: PaymentRecord[]  // 追加
}

export interface PaymentRecord {
  id: number
  payment_date: string
  payment_amount: number
  payment_method: string | null
  notes: string | null
}
```

#### **🔄 データ取得ロジックの変更**
```typescript
// 新しいクエリ構造
const { data, error } = await supabase
  .from('invoices')
  .select(`
    *,
    invoice_payments(*)
  `)
  .eq('invoice_type', 'standard')  // 通常請求書のみ
  .order('issue_date', { ascending: false })
```

#### **🔄 統計計算の修正**
- 支払済み金額: invoice_payments テーブルから集計
- 残額計算: total - 入金合計
- 入金履歴表示機能の追加

### **1.2 sales-management/page.tsx の修正内容**

#### **🔄 PaymentManagementTab の修正**
- 支払い状況更新時に invoice_payments テーブルへレコード挿入
- 既存の invoices.payment_date 更新を削除
- 入金履歴表示モーダルの追加

#### **🔄 赤伝表示の追加**
- invoice_type='credit_note' の請求書を区別表示
- 元請求書へのリンク表示

## 🔧 Phase 2: work-search ページの修正

### **2.1 位置情報表示の修正**

#### **🔄 データ取得の変更**
```typescript
// work_item_positions テーブルから位置情報を取得
const { data } = await supabase
  .from('invoice_line_items')
  .select(`
    *,
    invoices(*),
    invoice_line_items_split(
      *,
      work_item_positions(position)
    )
  `)
```

#### **🔄 表示ロジックの修正**
- 複数位置の配列表示: `["右", "前"]` → `"右, 前"`
- 位置なしの場合の適切な表示

## 🛠️ Phase 3: データ作成・更新ロジック

### **3.1 請求書作成時の修正**
```typescript
// 請求書作成時にinvoice_typeを明示的に設定
const invoiceData = {
  ...otherFields,
  invoice_type: 'standard',  // デフォルト値
  original_invoice_id: null  // 通常請求書の場合
}
```

### **3.2 入金記録の作成**
```typescript
// 入金時にinvoice_paymentsテーブルに記録
const paymentData = {
  invoice_id,
  payment_date,
  payment_amount,
  payment_method,
  notes
}
```

### **3.3 作業項目作成時の位置情報処理**
```typescript
// 位置情報をwork_item_positionsテーブルに保存
positions.forEach(position => {
  await supabase.from('work_item_positions').insert({
    split_item_id,
    position
  })
})
```

## 📋 実装順序

### **ステップ1: useSalesData.ts の修正**
- インターフェース更新
- データ取得ロジックの新テーブル対応
- 支払い統計計算の修正

### **ステップ2: sales-management ページの修正** 
- PaymentManagementTab の invoice_payments 対応
- 入金履歴表示機能の追加
- 赤伝表示機能の追加

### **ステップ3: work-search ページの修正**
- work_item_positions テーブル対応
- 複数位置情報表示

### **ステップ4: データ作成・更新ロジックの修正**
- API エンドポイントの新テーブル対応
- バリデーションロジックの更新

## ⚠️ 注意事項

### **データ整合性の確保**
- マイグレーション完了後にのみ新機能を有効化
- フォールバック処理の実装（古いテーブル構造への対応）

### **UI/UX の考慮**
- 入金履歴表示の際のローディング状態
- エラーハンドリングの強化
- レスポンシブ対応の維持

### **パフォーマンス最適化**
- invoice_payments の JOIN クエリ最適化
- work_item_positions の効率的な取得

## 🧪 テスト項目

### **機能テスト**
- [ ] 売上統計の正確性
- [ ] 入金履歴表示
- [ ] 複数位置情報表示
- [ ] 赤伝識別表示

### **エラーハンドリング**
- [ ] データ欠損時の適切な表示
- [ ] API エラー時のフォールバック
- [ ] ネットワーク障害時の対応

### **パフォーマンス**
- [ ] 大量データでの表示速度
- [ ] メモリ使用量の確認
- [ ] レンダリング最適化

これらの修正により、新しいデータベーススキーマに完全対応したアプリケーションが完成します。