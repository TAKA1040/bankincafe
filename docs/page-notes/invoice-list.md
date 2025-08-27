# Invoice List Page 徹底分析レポート

## 📋 基本情報
- **ファイルパス**: `src/app/invoice-list/page.tsx`
- **ファイルサイズ**: 約930行
- **作成目的**: 請求書一覧（検索/フィルタ/ページネーション/赤伝処理/詳細モーダル）
- **技術スタック**: Next.js 15 + React 19 + TypeScript + インラインCSS
- **必須機能**: メニューに戻るボタンの実装

## 🏗️ アーキテクチャ構成

### TypeScript型定義
```typescript
interface Invoice {
  // 請求書データ型（id, invoice_no, billing_month等）
}

interface Customer {
  // 顧客データ型（id, company_name, person_in_charge等）
}

interface InvoiceItem {
  // 請求項目型（id, invoice_id, item_type, name等）
}
```

### 状態管理 (useState)
| 状態名 | 型 | 初期値 | 用途 |
|--------|----|---------|----|  
| `db` | InvoiceDB | new InvoiceDB() | データベースインスタンス |
| `searchKeyword` | string | '' | フリーテキスト検索 |
| `statusFilter` | string | 'all' | ステータスフィルタ |
| `selectedInvoice` | Invoice | null | 詳細モーダル対象 |
| `invoices` | Invoice[] | [] | 描画用請求書配列 |
| `debouncedSearch` | string | '' | デバウンス後キーワード |
| `currentPage` | number | 1 | 現在ページ |
| `monthFrom` | string | '' | 開始月フィルタ |
| `monthTo` | string | '' | 終了月フィルタ |
- `selectedInvoice`: 詳細モーダル表示対象
- `invoices`: 描画用の請求書配列（`db.invoices` のスナップショット）
- `debouncedSearch`: 200ms デバウンス後キーワード
- `currentPage`: 現在ページ（1始まり）
- `monthFrom` / `monthTo`: `YYYY-MM` 文字列の月範囲フィルタ

派生値
- 正規化関数 `normalize`
- 月→YYMM 変換 `toYYMM`
- 検索語配列 `terms`（AND条件）
- `filteredInvoices` / `paginatedInvoices` / `pageCount` など

---

## 4. 主な機能とUIセクション
- __ヘッダー__: タイトル、ホームへ戻る、"新規請求書作成" ボタン（`/invoice-create`）。
- __検索/フィルタ__: 
  - テキスト検索（Escでクリア、クリアボタン付き）
  - ステータス切替（すべて/下書き/確定済/取消済）
  - 月範囲フィルタ（`<input type="month">` ×2、当月/前月/クリア）
  - 開発用: テストデータ 50件追加/削除（右端配置）
- __一覧テーブル__: 日付/件名/金額/状態/操作
  - 日付列: 請求日（上）+ 請求書番号（下、小文字グレー）
  - 件名列: 顧客名（上）+ 作成日（下、小文字グレー）
  - 金額列: 右寄せ、¥記号付き3桁区切り
  - 状態列: バッジ表示（下書きは行背景も淡黄色 `#fffbeb`）+ 赤伝チップ
  - 操作列: 詳細/編集（下書きのみ）/削除（確定済み→実際は赤伝処理）
- __ページネーション__: 件数表示、前へ/次へ、現在ページ/総ページ
- __統計カード__: 全体/下書き/確定/取消の件数（グリッドレイアウト）
- __詳細モーダル__: 選択した請求書の要約（顧客/請求日/金額/ステータス/メモ）、閉じるボタン

---

## 5. 関数一覧（抜粋）
- __`updateData()`__: `setInvoices([...db.invoices])` により描画データ更新
- __ナビゲーション__：`handleBack()`（`/`へ）、`handleCreateNew()`（`/invoice-create`）、`handleEdit(id)`
- __詳細モーダル__：`handleViewDetail(invoice)` / `setSelectedInvoice(null)` で閉じる
- __赤伝処理__：`handleRedSlip(invoice)` → confirm → `db.createRedSlip(id)` 成功時 alert と再描画
- __検索/月フィルタ__：`normalize`、`ymOf`、`handleThisMonth/PrevMonth/ClearMonth`
- __HMR対策__：`getDb()`（古いインスタンスに新メソッドが無い場合のフォールバック）
- __テストデータ__：`handleAddTestData(n)` / `handleClearTestData()`
- __ページング__：`goPrev()` / `goNext()`
- __表示補助__：`getStatusBadge(status)`（テキスト/色クラス）

### InvoiceDBクラスの重要メソッド
- __`createRedSlip(originalInvoiceId)`__: 元請求書から赤伝を生成（マイナス金額、番号は`-R1`等）
- __`deleteInvoice(invoiceId)`__: 下書きのみ削除可能（実際には使用されていない）
- __`addTestData(count=50)`__: ランダムなテストデータを生成（直近6ヶ月に分散）
- __`clearTestData()`__: `[TEST]`で始まるmemoの請求書を削除

---

## 6. 検索・フィルタロジックの詳細
- __正規化__: `toLowerCase().normalize('NFKC')`
- __キーワード__: 空白区切り AND 条件（`terms.every(...)`）
- __対象フィールド__: `invoice_no`, `client_name`, 顧客名, `order_no`, `internal_order_no`, `memo`
- __月範囲__: `billing_month` と `monthFrom/to` を YYMM で比較、`from>to` の場合は自動スワップ
- __ステータス__: `'all'` は無条件、それ以外は一致フィルタ

改善余地
- 顧客名取得がループ内 `find` で O(N^2)。`Map<customer_id, company_name>` で前処理推奨。
- 並び順（例: 日付降順）の保証なし。ソート導入が望ましい。

---

## 7. 既知の技術的課題
- __スタイリング（重要）__:
  - ほぼ全て `style` によるインラインCSS。ガイド（`docs/TOOL_GUIDELINES_JA.md` / `memo`）では __CSS Modules + Tailwind__ を推奨。
  - デザイントークン（色/余白/影など）未活用。
- __アクセシビリティ__:
  - 入力に `label` 不足（関連付け/`aria-label` 不足）。
  - モーダルに `role="dialog" aria-modal="true"` なし。フォーカストラップ/Escape閉じ対応なし。
  - テーブル `th` に `scope` なし。
  - 結果件数の動的変更に対する `aria-live` 無し。
- __パフォーマンス__:
  - フィルタ内で都度 `customers.find(...)`。前処理マップ化/`useMemo` 化推奨。
  - 1ページ20件固定。大量データ時は仮想スクロール or サーバサイドページング検討。
  - `filteredInvoices`/`paginatedInvoices` の再計算に `useMemo` 未適用。
- __UX/文言__:
  - 確定済みに対するボタンラベルが "削除" だが実体は __赤伝__。誤解の恐れあり（行789）。
  - `alert/confirm` ベース。非モーダル/トースト/確認モーダルへの置換が望ましい。
  - 赤伝作成時の確認メッセージ：「この請求書を赤伝で取り消しますか？\n取り消し後は元に戻せません。」
- __設計/再利用性__:
  - 型とDBクラスがページ内に内包。`src/types/`・`src/lib/invoice/`・`src/hooks/` への分離が必要。
  - HMRワークアラウンド（`getDb`）は本番不要のため排除可能。
  - `InvoiceDB`に未使用の`deleteInvoice`メソッドが存在（実際のUIでは赤伝のみ）。
- __テスト__:
  - Playwright/E2E の前提はあるが、当ページの検証項目に対するテスト未整備。

---

## 8. セキュリティ観点
- React の自動エスケープにより XSS リスクは低い。`dangerouslySetInnerHTML` 未使用。
- ただし、ユーザ入力/外部データを扱う将来実装では __CSV出力時のエスケープ__、__入力値のサニタイズ__ をガイドに従い必須化。
- 認可は `SecurityWrapper` + PIN だが、本番は Supabase 認証/権限制御とサーバ側再検証を併用。

---

## 9. 推奨リファクタリング計画（ガイドライン準拠）

### 9.1 フォルダ構成（例）
- `src/app/invoice-list/`
  - `page.tsx`（コンテナ。データ取得/状態連携の最小化）
  - `components/`
    - `Header.tsx`
    - `SearchFilters.tsx`
    - `InvoicesTable.tsx`
    - `Pagination.tsx`
    - `StatsCards.tsx`
    - `InvoiceDetailModal.tsx`
  - `hooks/`
    - `useInvoiceFilter.ts`（正規化/AND検索/月範囲/ステータス/ページング）
    - `useDebouncedValue.ts`
  - `styles/`
    - `invoiceList.module.css`（最小限。可能な限り Tailwind ユーティリティ）
- 共通:
  - `src/types/invoice.ts`（`Invoice`/`Customer`/`InvoiceItem` など）
  - `src/lib/invoice/db.ts`（開発用 in-memory 実装。将来 Supabase に差し替え）

### 9.2 スタイリング
- 全インラインCSS撤廃。Tailwind + CSS Modules へ移行。
- デザイントークン（色/spacing/shadow）を `:root` のCSSカスタムプロパティ/既存トークンで統一。
- ステータスバッジは `cva` などでバリアント管理。

### 9.3 パフォーマンス
- `customersMap = useMemo(() => new Map(customers.map(c => [c.id, c.company_name])), [customers])`。
- 検索/フィルタ/ページング結果を `useMemo` 化。
- ページサイズ選択（20/50/100）＋大量時は仮想リスト導入検討。

### 9.4 アクセシビリティ
- 入力要素に `label`/`htmlFor` を付与。`aria-label`/`aria-describedby` を適宜追加。
- 検索結果件数は `aria-live="polite"` を付与した要素で更新通知。
- モーダル: `role="dialog" aria-modal="true"`, フォーカストラップ, Escape キー閉じ。
- テーブル `th` に `scope="col"`。行選択/操作ボタンには説明的ラベル。

### 9.5 UX/言語
- 確定済みの操作ボタン表記を __「赤伝」__ に変更。
- `confirm/alert` をアクセシブルな確認モーダル/トーストへ置換。
- 並び替え（例: 請求日・番号・金額、昇降順）をテーブルヘッダで提供。

### 9.6 型/責務分離
- 型を `src/types/` に移動し共通化。
- フィルタやバッジのロジックを関数/フックに抽出して単体テスト可能に。
- HMR用の `getDb` を削除し、開発専用実装は `NODE_ENV` で分岐。

### 9.7 テスト（最低限）
- Playwright スモーク: 
  - 検索/ステータス/月範囲でのフィルタ結果変化
  - ページネーション遷移
  - 赤伝作成フロー（確認→作成→件数/状態の反映）
  - モーダルの開閉とフォーカス管理
- 単体テスト: 正規化/AND検索/月比較/バッジマッピング

---

## 10. リスク/移行計画
- __機能同等性__: 操作（詳細/編集/赤伝）と検索/フィルタ/ページング/統計を維持。
- __データ層__: 初期は in-memory のまま。段階的に Supabase API + サーバ再検証へ移行。
- __段階導入__: コンポーネント分割→スタイル移行→A11y強化→パフォーマンス→テストの順。

---

## 11. すぐに直せる改善（優先度順）
1. __文言修正__: 確定済み行の操作ボタンを「削除」→「赤伝」に変更（行789）。
2. __A11y__: モーダルに `role/aria-modal/Escape閉じ`、検索/期間入力に `label` 追加。
3. __性能__: 顧客名参照を Map 化、`filtered/paginated` を `useMemo` 化。
4. __スタイル__: 主要レイアウトを Tailwind へ移行（インラインCSS削減）。
5. __責務分離__: 型・DB・ユーティリティを `types/`・`lib/`・`hooks/` へ分離。
6. __未使用コード削除__: `InvoiceDB.deleteInvoice`メソッドの削除（UIで使用されていない）。

---

## 12. 参考（関連ファイル/ガイド）
- ガイド: `docs/TOOL_GUIDELINES_JA.md`
- UIメモ: `memo`
- 対象ページ: `src/app/invoice-list/page.tsx`

このドキュメントに従い、段階的に `invoice-list` の保守性・性能・A11y・セキュリティを高水準に引き上げます。
