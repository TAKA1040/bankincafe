# bankincafe システムルール

## 📋 重要な基本原則

### 🚨 経理データ保護ルール（最優先）
- **絶対禁止**: invoices, invoice_line_items テーブルからのDELETE操作
- **全件表示**: 経理データは漏れなく表示すること
- **データ完全性**: 修正前後でデータ件数が変わらないこと

### 🎯 システム全体に適用されるルール
**これらのルールはページごとではなく、システム全体の統一ルールです**

## 📊 作業タイプ分類ルール

### T作業（個別作業）
- **定義**: 単一の作業項目
- **判定**: `task_type = 'T'`
- **表示**: `raw_label` または構造化された作業名をそのまま表示
- **例**: "右ステップパネル取替鈑金", "コンテナロックガード取替"

### S作業（セット作業）
- **定義**: 複数の作業をまとめたセット価格の作業
- **判定**: `task_type = 'S'`
- **データ構造**:
  - `target`: セット作業名（例: "バンパー作業一式"）
  - `raw_label`: 内訳詳細（カンマ区切り）
- **表示ルール**:
  - **セット名**: `target` フィールドを使用
  - **内訳**: `raw_label` を分割して「• 項目1, • 項目2」形式で表示
  - **分割文字**: `,`, `、`, `，`, `・`, `･`

## 🔧 システム全体の表示ロジック

### invoice-list（一覧画面）
```javascript
const getWorkTypePrefix = (taskType) => {
  switch (taskType) {
    case 'S':
    case 'set':
      return 'S:';
    case 'T':
    case 'individual':
    case 'structured':
    case 'fuzzy':
    default:
      return 'T:';
  }
};

const itemName = (item.task_type === 'S') 
  ? (item.target || 'セット作業')
  : (item.raw_label || [item.target, item.action, item.position].filter(Boolean).join(' ') || '-');
```

### invoice-view（詳細画面）
```javascript
const isSetWork = item.task_type === 'S' || item.task_type === 'set';

if (isSetWork) {
  const setName = item.target || 'セット作業';
  const breakdownItems = item.raw_label ? 
    item.raw_label.split(/[,、，・･]/).map(s => s.trim()).filter(s => s.length > 0) : [];
  
  // セット名 + 内訳リスト表示
}
```

### invoice-create（編集画面）
```javascript
const isSetWork = item.task_type === 'S' || item.task_type === 'set'
return {
  type: isSetWork ? 'set' : 'individual',
  work_name: isSetWork ? item.target || item.raw_label || '' : `${item.target || ''}${item.action || ''}${item.position ? ` (${item.position})` : ''}`,
  // ... その他のプロパティ
}
```

### invoice-publish（発行画面）
```javascript
const getWorkDisplayName = (item) => {
  if (item.task_type === 'S' || item.task_type === 'set') {
    return item.target || item.set_name || item.raw_label || '名称不明';
  } else {
    return item.raw_label || [item.target, item.action, item.position].filter(Boolean).join(' ') || '名称不明';
  }
};
```

## 💰 価格データルール

### データベース構造
- **quantity**: 数量（常に設定される）
- **unit_price**: 単価（必須、0の場合null不可）
- **amount**: 金額（必須、0の場合null不可）

### 価格データの完全性
- **元データ**: CSV（dada2.csv）に全ての価格情報が含まれている
- **データベース**: 価格情報欠損時は元CSVから復元する
- **システム表示**: 価格情報は全画面で一貫して表示

## 🔍 請求書・見積書識別ルール

### ID命名規則
- **請求書**: `YYMM####-#` (Mプレフィックスなし)
- **見積書**: `YYMMM####-#` (Mプレフィックスあり)

### 判定ロジック
```javascript
const isEstimate = invoice_id.includes('M');
const documentType = isEstimate ? 'estimate' : 'invoice';
```

## 🗂️ データ構造の重要ポイント

### invoice_line_items テーブル
```sql
-- S作業の場合
task_type: 'S'
target: 'セット作業名'           -- 必須
raw_label: '内訳1, 内訳2, 内訳3'  -- カンマ区切り

-- T作業の場合  
task_type: 'T'
target: null または部品名
raw_label: '作業内容'           -- そのまま表示
```

### セット作業のtarget生成ルール
1. **「一式」キーワード**: 明確なセット作業として自動認識
2. **複数作業検出**: カンマ区切り、中点区切りで複数作業を検出
3. **自動命名**: 「○○等一式」「○○関連作業一式」として命名

## 🎨 UIルール

### 戻るボタン
```javascript
// ❌ 問題のあるパターン
onClick={() => router.back()}

// ✅ 正しいパターン  
onClick={() => router.push('/invoice-list')}
```

### 表示件数ドロップダウン
```css
className="border border-gray-300 rounded px-3 py-1 text-sm bg-white min-w-20 relative z-10 shadow-sm"
```

## 🚀 システム保守ルール

### 新機能追加時の注意
1. **全画面での一貫性**: 新しい表示ロジックは全画面に適用
2. **データ構造の尊重**: T/S作業の区別ルールを維持
3. **価格データの完全性**: 価格情報は必ず表示

### データ修正時の原則
1. **元CSVとの照合**: データ不整合時は元CSVデータで修正
2. **バッチ処理**: 大量データ修正時は適切なバッチサイズで実行
3. **検証必須**: 修正後は必ずサンプルデータで動作確認

## 📚 重要なスクリプト

### データ修正用スクリプト
- `fix-task-type-logic.mjs`: タスクタイプ分類の修正
- `fix-all-set-work-structure.mjs`: セット作業のtarget設定修正
- `fix-missing-price-data.mjs`: 価格データの修正

### 検証用スクリプト
- `check-all-set-work.mjs`: セット作業構造の確認
- `check-csv-price-data.mjs`: 元CSV価格データの確認

---

**このルールは全開発者が必ず従うべきシステムの基盤ルールです。**  
**ページ固有の実装ではなく、システム全体の統一ルールとして扱ってください。**