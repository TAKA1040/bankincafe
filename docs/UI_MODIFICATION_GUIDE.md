# BankInCafe UI変更マニュアル - 全AIツール対応版

## 📋 概要
このマニュアルは、BankInCafeプロジェクトのUI変更時に、**どのAIツールでも**正確に理解し修正できるよう作成された包括的なガイドです。Windsurf、Claude Code、Gemini、その他のAIツールで共通して使用できる標準的なリファレンスです。

---

## 🛠️ 対応AIツール
- ✅ **Windsurf** - VS Code拡張版AI
- ✅ **Claude Code** - Anthropic公式CLI
- ✅ **Gemini** - Google AI
- ✅ **その他のコード生成AI** - 汎用的な構造説明

---

## 🎯 作業履歴ページ（Work History Page）

### 📁 ファイル基本情報
- **メインファイル**: `C:\Windsurf\bankincafe\src\app\work-history\page.tsx`
- **ファイル行数**: ~1600行（最新更新後）
- **ファイルサイズ**: 大容量（部分修正推奨）
- **技術構成**: CSS-in-JS + React + TypeScript + Next.js App Router
- **最終更新**: 2025年（検索フィルター、ページネーション強化版）

### 🏗️ アーキテクチャ概要

#### 技術スタック
- **フロントエンド**: React 18 + Next.js 15 (App Router)
- **スタイリング**: CSS-in-JS（Tailwind併用）
- **言語**: TypeScript（厳密型付け）
- **状態管理**: React Hooks（useState, useEffect）
- **データベース**: インメモリサンプルデータ（WorkHistoryDB class）

#### ファイル構造パターン
```typescript
// このファイルは以下の構造を持つ：
1. Import文 (1-9行)
2. Type定義 (11-51行)
3. Utility関数 (文字正規化など)
4. データベースクラス (54-284行)
5. CSS-in-JSスタイル (307-995行)
6. メインコンポーネント (996-1600行)
```

### 🎨 スタイル構造詳細

#### CSS-in-JSスタイル定義
```typescript
// 行数: 307-995行目 (約690行のスタイル定義)
const styles = `
  .work-history-container { 
    /* ページ全体のコンテナ */ 
  }
  .work-history-card { 
    /* カード型レイアウト */ 
  }
  .results-table th { 
    /* テーブルヘッダー */ 
    padding: 0.75rem 0.75rem; /* ← 重要：スペーシング調整ポイント */
  }
  .results-table td { 
    /* テーブルセル */ 
    padding: 0.75rem 0.75rem; /* ← 重要：スペーシング調整ポイント */
  }
  .action-btn { 
    /* アクションボタン */ 
    padding: 0.5rem 0.75rem; /* ← 重要：ボタンサイズ調整ポイント */
  }
  /* 他50+クラス定義... */
`
```

### 🔧 主要UI要素と修正箇所（2025年最新版）

#### 1. ページヘッダー（行1218-1230）
```tsx
<div className="work-history-header">
  <h1 className="work-history-title">作業内容履歴</h1>
  <p className="work-history-subtitle">説明文</p>
</div>
```
**修正ポイント**: タイトル文字サイズは`.work-history-title`で調整

#### 2. 検索条件セクション（行1236-1366）- **⚠️ 大幅アップデート**
```tsx
<div className="form-section-title" style={{ position: 'relative' }}>
  {/* 左側：検索条件タイトル */}
  <div style={{ display: 'flex', alignItems: 'center', paddingRight: '260px' }}>
    <Search className="h-5 w-5 text-blue-600" />
    検索条件
  </div>
  
  {/* 右側：詳細フィルター・CSV出力ボタン */}
  <div style={{ position: 'absolute', right: 0 }}>
    <button className="btn-secondary">詳細フィルター</button>
    <button className="btn-success">CSV出力</button>
  </div>
</div>

{/* 検索フィールド */}
<div className="flex items-center gap-6 mb-4">
  {/* 件名フィールド（ドロップダウン付き） */}
  <div style={{ position: 'relative' }}>
    <label>件名</label>
    <input type="text" ... />
    {/* リアルタイム候補表示 */}
  </div>
  
  {/* 作業内容フィールド（ドロップダウン付き） */}
  <div style={{ position: 'relative' }}>
    <label>作業内容</label>
    <input type="text" ... />
    {/* リアルタイム候補表示 */}
  </div>
  
  {/* 検索・クリアボタン */}
  <div style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem' }}>
    <button className="btn-primary">検索</button>
    <button className="btn-secondary">クリア</button>
  </div>
</div>
```

#### 3. 検索結果セクション（行1421-1594）- **⚠️ 大幅アップデート**
```tsx
<div className="results-table">
  <div className="table-header">
    <div style={{ position: 'relative' }}>
      {/* 左側：検索結果タイトル */}
      <div style={{ paddingRight: '560px' }}>
        <Calendar />
        検索結果 ({searchResults.length}件)
      </div>
      
      {/* 右側：統計情報＋ページネーション */}
      <div style={{ position: 'absolute', right: 0 }}>
        {/* 平均・価格帯表示 */}
        <div>平均 ¥{avg}　価格帯 ¥{min}〜¥{max}</div>
        
        {/* 高機能ページネーション */}
        <nav>
          <button>‹‹</button>
          <button>‹</button>
          {/* ページ番号（1 ... 5 6 [7] 8 9 ... 20 形式） */}
          <button>›</button>
          <button>››</button>
        </nav>
      </div>
    </div>
  </div>
  
  <table>
    <thead>
      <tr>
        <th>請求書No<br />請求日</th>
        <th>顧客名<br />件名</th>
        <th>登録番号<br />作業名</th>
        <th>数量<br />種別</th>
        <th>単価<br />合計</th>
        <th>請求書表示</th> {/* ← 1ボタンのみに簡素化 */}
      </tr>
    </thead>
    <tbody>
      {/* 2段表示データ行 */}
    </tbody>
  </table>
</div>
```

---

## 📝 よくある修正パターン（2025年最新版対応）

### 🎯 パターン1: テーブルのスペーシング調整
**修正箇所**: CSS-in-JSスタイル（行804-820）
```css
.results-table th {
  padding: 0.75rem 0.75rem; /* ← 現在値：コンパクト設計 */
  /* 例：より詰める場合 → 0.5rem 0.5rem */
  /* 例：より広げる場合 → 1rem 1rem */
}
.results-table td {
  padding: 0.75rem 0.75rem; /* ← th と同じ値に統一 */
}
```

### 🎯 パターン2: ボタンサイズ・レイアウト調整
**修正箇所**: CSS-in-JSスタイル（行831-841）
```css
.action-btn {
  padding: 0.5rem 0.75rem; /* ← 現在値：小さめ設計 */
  font-size: 0.75rem; /* ← 現在値：小さめテキスト */
  margin-bottom: 0.25rem; /* ← 現在値：最小間隔 */
}
```

**修正箇所**: JSX内ボタングループ（行1358-1365）
```tsx
<div style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem' }}>
  <button className="btn-primary">検索</button>
  <button className="btn-secondary">クリア</button> {/* ← 新機能 */}
</div>
```

### 🎯 パターン3: 検索フィールドの配置・機能
**修正箇所**: 検索フォーム（行1264-1366）
```tsx
<div className="flex items-center gap-6 mb-4" style={{ gap: '1.5rem' }}>
  {/* gap値変更でフィールド間隔調整 */}
```

**ドロップダウン候補の調整**:
- 顧客名候補: 行1290-1310
- 作業内容候補: 行1327-1347

### 🎯 パターン4: 統計情報・ページネーション
**修正箇所**: 統計計算ロジック（行1431-1444）
```tsx
{/* 平均・価格帯の計算と表示 */}
const avg = Math.round(sum / prices.length)
const min = Math.min(...prices)
const max = Math.max(...prices)
```

**修正箇所**: ページネーション（行1447-1506）
```tsx
{/* 高機能ページネーション：1 ... 5 6 [7] 8 9 ... 20 形式 */}
<nav className="flex items-center">
  <button disabled={currentPage <= 1}>‹‹</button> {/* 最初へ */}
  <button disabled={currentPage <= 1}>‹</button>  {/* 前へ */}
  {/* 動的ページ番号表示 */}
  <button disabled={currentPage >= pageCount}>›</button>  {/* 次へ */}
  <button disabled={currentPage >= pageCount}>››</button> {/* 最後へ */}
</nav>
```

### 🎯 パターン5: 新機能の追加・削除

#### A) ボタンの追加・削除
- **検索条件エリアのボタン**: 行1242-1259（詳細フィルター、CSV出力）
- **検索フォームのボタン**: 行1358-1365（検索、クリア）
- **テーブル内アクションボタン**: 行1574-1578（請求書表示のみ）

#### B) フィルター機能の拡張
- **詳細フィルター**: 行1400-1417（日付範囲、クイック設定）
- **リアルタイム検索**: useEffect hook内（行1055-1090）

#### C) 表示項目の追加・削除
- **テーブル列**: ヘッダー（行1521-1539）とデータ（行1544-1580）
- **統計情報**: 行1431-1444の計算ロジック

---

## 🚨 全AIツール共通の修正時の注意点

### 1. 大容量ファイルの扱い方
```
❌ 避けるべき操作:
- ファイル全体の読み込み・書き換え
- 一度に大量行の修正
- 曖昧な行数指定での修正

✅ 推奨操作:
- 特定行数範囲での部分修正（50-100行程度）
- 明確な行数指定（例：行1240-1266）
- 小さな変更を段階的に実行
```

### 2. CSS-in-JSの構造理解
```typescript
// 重要：スタイルは文字列リテラル内で定義
const styles = `
  .class-name {
    property: value;
    /* ここでCSSプロパティを直接編集 */
  }
`

// 修正時のポイント：
// - CSS構文で記述（JSではない）
// - セレクタはクラス名で管理
// - 値の単位はCSS準拠（rem, px, % など）
```

### 3. React状態管理の把握
```typescript
// 重要な状態変数（行305-325付近）- 2025年最新版
const [searchKeyword, setSearchKeyword] = useState('') // 作業内容検索
const [customerFilter, setCustomerFilter] = useState('') // 顧客名検索  
const [filteredCustomers, setFilteredCustomers] = useState<string[]>([]) // 顧客候補
const [filteredWorkSuggestions, setFilteredWorkSuggestions] = useState<string[]>([]) // 作業候補
const [searchResults, setSearchResults] = useState<SearchResult[]>([]) // 検索結果
const [currentPage, setCurrentPage] = useState(1) // ページネーション
const [showAdvancedFilters, setShowAdvancedFilters] = useState(false) // 詳細フィルター表示
```

### 4. TypeScript型定義の理解
```typescript
// 重要な型定義（行11-51）
interface SearchResult {
  invoice_no: string
  customer_name: string
  subject: string
  registration: string
  date: string
  work_name: string
  quantity: number
  unit_price: number
  total: number
  is_set: number
}

// 修正時は型に合致するデータ構造を維持
```

---

## 🎛️ AIツール別修正アプローチ

### 🔵 Windsurf向けアプローチ
```bash
# 1. 事前調査
Read ツールで対象行を確認
Glob ツールでファイル構造確認

# 2. 段階的修正
Edit ツールで小範囲を修正
Bash ツールで動作確認（npm run dev）

# 3. 検証
Read ツールで修正結果確認
```

### 🟢 Claude Code向けアプローチ
```bash
# 1. ファイル分析
構造把握のための Read
型定義・状態管理の確認

# 2. 精密修正
MultiEdit で関連箇所を一括修正
TodoWrite で進捗管理

# 3. 品質保証
mcp__ide__getDiagnostics で型チェック
```

### 🔴 Gemini向けアプローチ
```bash
# 1. コンテキスト理解
ファイル全体の構造説明要求
修正対象の明確化

# 2. コード生成
具体的なコード例の生成
差分形式での修正提案

# 3. 統合確認
既存コードとの整合性チェック
```

### 🟡 汎用的アプローチ（全ツール共通）
```bash
# 修正の基本フロー
1. 📍 対象特定：行数・セクション・機能を明確化
2. 🔍 現状確認：該当箇所の現在の実装を把握
3. 📝 修正実行：小さな変更を段階的に実行
4. ✅ 動作確認：ブラウザまたは開発サーバーで確認
5. 📊 影響範囲チェック：他部分への影響を確認
```

## 🛠️ 具体的修正手順（詳細版）

### 🎯 パターンA: スペーシング・サイズ調整
```typescript
// Step 1: 対象特定
行804-820: テーブルセルのpadding
行831-841: ボタンのpadding・font-size

// Step 2: 修正値の決定
padding: 0.75rem → 0.5rem (より詰める)
padding: 0.75rem → 1rem (より広げる)

// Step 3: CSS-in-JS内で修正
const styles = `
  .results-table th {
    padding: 0.5rem 0.5rem; /* 修正 */
  }
`
```

### 🎯 パターンB: レイアウト・配置変更  
```tsx
// Step 1: 対象特定
行1264: 検索フィールドの横配置
行1425: 検索結果ヘッダーの配置

// Step 2: Flexboxプロパティ調整
gap: '1.5rem' → gap: '1rem' (間隔調整)
flexDirection: 'row' → flexDirection: 'column' (縦配置)

// Step 3: JSX内style属性修正
<div className="flex items-center gap-6" style={{ gap: '1rem' }}>
```

### 🎯 パターンC: 機能追加・削除
```tsx
// Step 1: 既存パターン確認
既存ボタン: <button className="btn-primary">検索</button>

// Step 2: 同様構造で新規作成
<button className="btn-secondary">新機能</button>

// Step 3: イベントハンドラー追加
const handleNewFeature = () => {
  // 新機能のロジック
}
onClick={handleNewFeature}
```

### 🎯 パターンD: データ表示項目変更
```tsx
// Step 1: テーブル構造確認
<th>列名<br />副項目</th> // ヘッダー
<td><div>値1</div><div>値2</div></td> // データ

// Step 2: 新列追加の場合
ヘッダー追加 → データ追加 → CSS幅調整

// Step 3: 計算ロジック追加（必要な場合）
統計情報: 行1431-1444の計算式を参考
```

---

## 📊 ファイル構成マップ（2025年最新版）

```
src/app/work-history/page.tsx (総行数: ~1600行)
├── 📦 Imports (1-9行)
│   └── React, Next.js, Lucide Icons, SecurityWrapper
├── 🏷️ Types (11-51行)
│   ├── Invoice, InvoiceItem, SearchResult
│   └── WorkStatistics interface
├── 🔧 Utility Functions (286-305行)
│   └── normalizeText() - ひらがな/カタカナ正規化
├── 💾 Database Class (54-284行)
│   ├── WorkHistoryDB class
│   ├── サンプルデータ生成
│   └── 検索・統計機能
├── 🎨 CSS-in-JS Styles (307-995行) ⭐ 重要
│   ├── .work-history-container
│   ├── .work-history-card  
│   ├── .results-table th/td ← スペーシング調整
│   ├── .action-btn ← ボタンサイズ調整
│   ├── .btn-primary/secondary/success
│   └── レスポンシブ対応
├── ⚙️ Main Component (996-1600行)
│   ├── 📊 State Management (1000-1020行)
│   │   ├── search states (keyword, filters)
│   │   ├── UI states (pagination, loading)
│   │   └── data states (results, suggestions)
│   ├── 🔄 Effect Hooks (1025-1090行)
│   │   ├── データ初期化
│   │   ├── リアルタイム検索
│   │   └── フィルタリング
│   ├── 📝 Event Handlers (1095-1185行)
│   │   ├── handleSearch()
│   │   ├── exportToCSV()
│   │   └── ページネーション
│   └── 🖼️ JSX Template (1210-1600行)
│       ├── 🏷️ Header (1218-1230行)
│       ├── 🔍 Search Section (1232-1417行) ⭐ 大幅更新
│       │   ├── 検索条件タイトル + ボタン (1236-1261行)
│       │   ├── 検索フォーム (1264-1366行)
│       │   └── 詳細フィルター (1385-1417行)
│       ├── 📈 Statistics (統計情報は結果内に統合)
│       └── 📋 Results Table (1421-1594行) ⭐ 大幅更新
│           ├── テーブルヘッダー + 統計 + ページネーション (1425-1515行)
│           ├── データ表示 (1517-1585行)
│           └── 空状態表示 (1586-1593行)
```

### 🔍 セクション別重要度と修正頻度

| セクション | 重要度 | 修正頻度 | 主な用途 |
|------------|--------|----------|----------|
| CSS-in-JS Styles | ⭐⭐⭐ | 高 | 見た目・レイアウト調整 |
| Search Section | ⭐⭐⭐ | 高 | 機能追加・UI改善 |  
| Results Table | ⭐⭐⭐ | 高 | 表示項目・ページネーション |
| State Management | ⭐⭐ | 中 | 新機能追加時 |
| Effect Hooks | ⭐⭐ | 中 | 検索ロジック変更時 |
| Event Handlers | ⭐⭐ | 中 | ボタン動作変更時 |
| Database Class | ⭐ | 低 | データ構造変更時 |
| Types | ⭐ | 低 | 型定義変更時 |

---

## ⚡ クイックリファレンス（2025年最新版）

### 🎨 よく修正するCSS-in-JSクラス名
```css
/* テーブル関連（行804-830） */
.results-table th { /* ヘッダーセル */ }
.results-table td { /* データセル */ }

/* ボタン関連（行506-565） */
.btn-primary { /* 検索ボタン */ }
.btn-secondary { /* 詳細フィルター、クリアボタン */ }
.btn-success { /* CSV出力ボタン */ }
.action-btn { /* テーブル内アクションボタン */ }

/* レイアウト関連（行308-415） */
.work-history-card { /* カード全体 */ }
.work-history-container { /* ページ全体 */ }
.form-section { /* 検索条件セクション */ }

/* 高頻度調整対象 */
.results-table th, .results-table td {
  padding: 0.75rem 0.75rem; /* ← 最も修正される値 */
}
.action-btn {
  padding: 0.5rem 0.75rem; /* ← 2番目に修正される値 */
  font-size: 0.75rem;
}
```

### 🖱️ 重要なインラインスタイル箇所（行数付き）
```tsx
/* 検索条件セクション内配置 */
行1236: style={{ position: 'relative', display: 'flex', width: '100%' }}
行1241: style={{ position: 'absolute', right: 0 }} /* ボタン配置 */

/* 検索フォーム配置 */  
行1264: style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}

/* ドロップダウン表示 */
行1284: style={{ position: 'absolute', top: '100%', zIndex: 1000 }} /* 顧客候補 */
行1320: style={{ position: 'absolute', top: '100%', zIndex: 1000 }} /* 作業候補 */

/* 検索・クリアボタン配置 */
行1349: style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem' }}

/* 検索結果ヘッダー配置 */
行1425: style={{ position: 'relative' }}
行1430: style={{ position: 'absolute', right: 0 }} /* 統計+ページネーション */
```

### 📊 状態変数クイックリスト
```typescript
/* 検索関連 */
searchKeyword: string // 作業内容検索
customerFilter: string // 顧客名検索
debouncedKeyword: string // リアルタイム検索用

/* UI状態 */
currentPage: number // 現在ページ
showAdvancedFilters: boolean // 詳細フィルター表示
isLoading: boolean // ローディング状態

/* データ */
searchResults: SearchResult[] // 検索結果
filteredCustomers: string[] // 顧客名候補
filteredWorkSuggestions: string[] // 作業内容候補
```

### 🎯 頻出修正パターン早見表

| 修正内容 | 対象箇所 | 修正方法 |
|----------|----------|----------|
| テーブルを詰める | 行804,815 | padding値を小さく |
| ボタンを大きく | 行833 | padding値を大きく |
| 検索フィールド間隔 | 行1264 | gap値変更 |
| ページネーション位置 | 行1430 | position/right値変更 |
| 統計情報の計算式 | 行1436-1438 | 計算ロジック変更 |
| 新ボタン追加 | 行1241, 1358 | 既存パターン複製 |
| テーブル列追加 | 行1521, 1544 | th/td要素追加 |
| ドロップダウンスタイル | 行1284, 1320 | position/zIndex調整 |

---

## ✅ 修正後の確認チェックリスト

### 🖥️ 機能動作チェック
- [ ] **検索機能**: 件名・作業内容での絞り込みが正常動作
- [ ] **リアルタイム検索**: 入力時の候補表示が適切
- [ ] **ページネーション**: ページ移動・統計情報表示が正常  
- [ ] **ボタン動作**: 全ボタンのクリック動作確認
- [ ] **フィルター機能**: 詳細フィルター・CSV出力が動作
- [ ] **データ表示**: テーブル内容・ハイライトが適切

### 📱 レスポンシブ・デザインチェック
- [ ] **デスクトップ表示**: 1920px以上で崩れなし
- [ ] **タブレット表示**: 768px-1024pxで適切にスケール
- [ ] **モバイル表示**: 480px以下でスクロール・操作可能
- [ ] **ドロップダウン**: 小画面でも適切に表示
- [ ] **ボタン配置**: タッチデバイスで操作しやすい

### 🎨 スタイル・UI一貫性チェック
- [ ] **色合い**: 全体的な色使いが統一
- [ ] **フォント**: サイズ・ウェイトが階層的に適切
- [ ] **スペーシング**: 要素間の間隔が統一
- [ ] **アニメーション**: ホバー効果・トランジションが滑らか
- [ ] **アイコン**: サイズ・位置が統一

### ⚡ パフォーマンス・品質チェック
- [ ] **型安全性**: TypeScriptエラーなし
- [ ] **ESLint**: 構文・スタイル警告なし
- [ ] **Console**: ブラウザコンソールにエラーなし
- [ ] **描画速度**: データ表示・検索レスポンスが高速
- [ ] **メモリリーク**: 長時間使用でも安定動作

---

## 📚 関連ファイル・依存関係

### 🔗 直接関連ファイル
```
C:\Windsurf\bankincafe\src\app\work-history\page.tsx  ← メインファイル
├── C:\Windsurf\bankincafe\src\components\security-wrapper.tsx ← セキュリティ
├── C:\Windsurf\bankincafe\src\lib\supabase\server.ts ← データベース接続（未使用）
└── C:\Windsurf\bankincafe\src\app\page.tsx ← ダッシュボード（ナビゲーション元）
```

### 🎨 スタイル関連
```
- CSS-in-JS（page.tsx内に定義）← 主要スタイル
- Tailwind CSS（グローバル）← ユーティリティクラス
- Lucide React Icons ← アイコン
```

### 📦 技術スタック依存
```
- Next.js 15 (App Router) ← ルーティング・SSR
- React 18 ← UI フレームワーク
- TypeScript ← 型安全性
- ES2022+ ← 最新JavaScript構文
```

---

## 🚀 高度なカスタマイズガイド

### 🔧 新機能追加テンプレート

#### A) 新しい検索条件追加
```tsx
// 1. state追加
const [newFilter, setNewFilter] = useState('')

// 2. UI追加（行1264付近）
<div style={{ position: 'relative' }}>
  <label>新項目</label>
  <input 
    type="text"
    value={newFilter}
    onChange={(e) => setNewFilter(e.target.value)}
  />
</div>

// 3. 検索ロジック追加（行1055-1090のuseEffect内）
if (newFilter) {
  results = results.filter(r => 
    r.someField.includes(newFilter)
  )
}
```

#### B) 新しい統計情報追加
```tsx
// 検索結果ヘッダー内（行1431-1444）
const newStat = searchResults.reduce((acc, curr) => {
  // 計算ロジック
}, 0)

// 表示（行1441-1443付近）
<div className="text-sm">
  新統計: {newStat.toLocaleString()}
</div>
```

#### C) 新しいテーブル列追加  
```tsx
// ヘッダー追加（行1521-1539）
<th>新列名<br />サブ項目</th>

// データ追加（行1544-1580）
<td>
  <div className="text-sm">{result.newField}</div>
  <div className="text-sm text-gray-500">{result.newSubField}</div>
</td>
```

### 🎨 スタイルカスタマイズテンプレート

#### A) 新しいボタンスタイル追加
```css
/* CSS-in-JS内（行550-565付近） */
.btn-warning {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 16px;
  /* 他プロパティは.btn-primaryを参考 */
}
```

#### B) レスポンシブ調整
```css
/* CSS-in-JS内（行980-994付近） */
@media (max-width: 480px) {
  .work-history-title {
    font-size: 1.5rem; /* モバイル用サイズ */
  }
  .results-table th,
  .results-table td {
    padding: 0.5rem 0.25rem; /* モバイル用コンパクト */
  }
}
```

---

## 🎯 AIツール使用時のベストプラクティス

### ✅ 効果的な指示の出し方
```bash
# Good例：具体的・明確
"work-history/page.tsx の行804の .results-table th の padding を 0.5rem に変更"

# Bad例：曖昧・広範囲
"テーブルをもっと小さくして"
```

### ✅ 段階的アプローチ
```bash
1️⃣ 小さな変更から開始
2️⃣ 1箇所ずつ修正・確認
3️⃣ 動作確認後に次の修正
4️⃣ 最後に全体最適化
```

### ✅ エラー対応
```bash
# TypeScriptエラーの場合
型定義（行11-51）を確認
state変数の型を確認

# スタイルが効かない場合  
CSS-in-JS内のクラス名確認
HTMLのclassName属性確認

# 機能が動作しない場合
useEffect の依存配列確認
イベントハンドラーの binding確認
```

---

*このマニュアルは、BankInCafe作業履歴ページの完全な修正ガイドです。どのAIツールでも、このマニュアルを参照することで、効率的で正確な修正が可能です。*

---

**📅 最終更新**: 2025年1月（検索フィルター強化・ページネーション改良版対応）  
**📋 対象バージョン**: Next.js 15 + React 18 + TypeScript  
**🔄 メンテナンス**: 大幅な機能追加時に更新予定