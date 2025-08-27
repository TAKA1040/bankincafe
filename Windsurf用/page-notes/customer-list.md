# customer-list ページ分析とリファクタリング計画

対象: `src/app/customer-list/page.tsx`
目的: 顧客の検索・一覧表示・追加/編集/削除を行う管理ページの現状把握と改善方針の策定。

---

## 1. 概要
- __クライアントコンポーネント__: `'use client'`
- __主要依存__: `next/navigation` の `useRouter`、`SecurityWrapper`、`lucide-react` アイコン
- __データ層__: ページ内に `CustomerDB` クラス（`localStorage` 永続化）
- __スタイル__: 大量の CSS-in-JS（テンプレ文字列）を `<style dangerouslySetInnerHTML={{ __html: styles }} />` で注入
- __機能__: 検索（疑似デバウンス200ms）、一覧表示、追加/編集（モーダルフォーム）、削除
- __ファイルサイズ__: 1,042行（CSS-in-JS 490行含む）

---

## 2. 型・データ構造
- __型__: 多数の `any` を使用（`customers: any[]`、`editingCustomer: any`、引数・戻り値も `any` が多い）
- __顧客レコード項目__（例）:
  - `id`, `company_name`, `person_in_charge`, `position`, `phone`, `email`, `zip_code`, `address1`, `address2`, `invoice_reg_no`, `memo`

改善: `src/types/customer.ts` に `Customer`, `NewCustomer`, `CustomerUpdate` などを定義し、ページから `any` を排除。

---

## 3. `CustomerDB` クラス（lines 12-115）
- __`constructor()`__: `loadData('bankin_customers', default)` で初期化（サンプル3件：テクノロジー、サブル商事B、UDトラックス）
- __`loadData(key, default)`__ (lines 59-67): `localStorage` から読み出し、失敗時はデフォルト、`console.warn` でエラー出力
- __`save()`__ (lines 69-75): `localStorage.setItem` + try-catch、失敗時は `console.warn`
- __`searchCustomers(keyword)`__ (lines 77-89):
  - 未入力なら全件返却
  - `company_name` / `person_in_charge` / `position` / `phone` / `email` / `address1` / `memo` に対して `includes`
  - 大文字小文字は `toLowerCase` で正規化（`phone` のみ元の文字列で検索）
- __`addCustomer(data)`__ (lines 91-99): `id: Date.now()` で採番し push → `save()` → 新規レコード返却
- __`updateCustomer(id, data)`__ (lines 101-109): `findIndex` でマージ更新 → `save()` → 更新レコード返却、見つからない場合は `null`
- __`deleteCustomer(id)`__ (lines 111-114): `filter` で該当を除外 → `save()`

リスク: `localStorage` 依存（データ破損・環境差）、`Date.now()` 採番、型安全性なし。

---

## 4. 状態管理（useState/useEffect）
- `searchKeyword: string`
- `showAddForm: boolean`（モーダル開閉）
- `editingCustomer: Customer | null`（編集対象）
- `customers: Customer[]`（表示用コレクション）
- `isSearching: boolean`（擬似ローディング）
- `isSaving: boolean`（保存中状態）
- `newCustomer`（フォーム入力データ）

__検索効果__（疑似デバウンス、lines 634-644）:
```ts
useEffect(() => {
  const searchCustomers = async () => {
    setIsSearching(true)
    await new Promise(resolve => setTimeout(resolve, 200))
    const filtered = db.searchCustomers(searchKeyword)
    setCustomers(filtered)
    setIsSearching(false)
  }
  searchCustomers()
}, [searchKeyword, db.customers, db])
```
- 依存配列に `db` と `db.customers` が含まれる。
- `db` は `useState(() => new CustomerDB())` により参照は安定だが、`db.customers` は配列参照が不変なため変更検知されにくい。
- 一方で保存時に `setCustomers([...db.customers])` を直接呼ぶため、二重更新経路が存在。

改善: `rawCustomers` を状態として保持し、`useMemo` でフィルタリング。依存は `[searchKeyword, rawCustomers]` に簡素化。

---

## 5. UIセクション
- __ヘッダー__ (lines 717-740)：タイトル「顧客管理システム」+ Users アイコン、`新規顧客登録` + Plus アイコン、`戻る` + ArrowLeft アイコン
- __検索セクション__ (lines 742-759)：テキストボックス + Search アイコン、`検索結果: N件` 表示（検索キーワード入力時のみ）
- __一覧テーブル__ (lines 763-878)：
  - 列: 顧客名（+ 備考） / 担当者（+ 役職） / 連絡先（+ 郵便番号） / 住所・メール / 操作
  - 行 hover ハイライト、空状態/検索中の表示（lines 797-817）
  - 操作: 編集（Edit アイコン）/ 削除（Trash2 アイコン）
- __モーダルフォーム__ (lines 882-1037)：
  - セクション: 基本情報 / 住所情報 / その他情報
  - 入力: 顧客名（必須、赤アスタリスク）他、メール/電話/住所、登録番号、備考
  - ボタン: キャンセル/保存（Save アイコン + `isSaving` 表示切替）

---

## 6. スタイリング
- __現状__: ページ内のテンプレ文字列でCSSを大量定義し、`dangerouslySetInnerHTML` で注入
- __問題__: 
  - ガイドライン違反（CSS-in-JS 禁止、`dangerouslySetInnerHTML` 禁止）
  - 再利用・保守性・テーマ適用が困難

改善: Tailwind CSS + 必要最小限の CSS Modules（`*.module.css`）へ移行。デザイントークンは `memo` のルール準拠。

---

## 7. アクセシビリティ（A11y）
- 検索入力に `label`/`aria-label` 不足（line 746-752、placeholder のみ）
- テーブルヘッダ `th` に `scope="col"` 不足（lines 769-794）
- モーダルに `role="dialog" aria-modal="true"`、フォーカストラップ、Escape閉じが無い（lines 883-891）
- 動的な検索結果件数に `aria-live` なし（lines 754-758）
- フォームラベルは存在するが、必須項目の `required` 属性なし（line 900-909）

改善: 適切なARIA付与、キーボード操作対応、フォーカス管理を追加。

---

## 8. セキュリティ
- `dangerouslySetInnerHTML` によるスタイル注入はガイドラインで禁止
- `alert/confirm` の多用（UI/トラストの観点で置換推奨）
- `localStorage` によるデータ保持（権限制御/検証が無い）

改善: 
- スタイルは Tailwind/CSS Modules に移行
- 確認/通知はアクセシブルなモーダル/トーストに置換
- 将来は Supabase + サーバ側バリデーション/認可へ移行

---

## 9. パフォーマンス
- 疑似デバウンス（200ms）だが、`useEffect` 再計算経路が二重
- フィルタリングは `includes` ベースで軽量、現状ページングなし

改善:
- `useMemo` で `filteredCustomers` を計算
- 大量データ時はページング/仮想化（オプション）
- 依存配列から `db`/`db.customers` を排除し、`rawCustomers` を単一ソース化

---

## 10. コード品質
- 未使用/過多インポート（`lucide-react` のアイコン複数）
- `any` 多用、関数引数/戻り値に型注釈なし
- フォームバリデーションは顧客名必須のみ（`alert` 依存、line 667）
- 保存処理に500ms疑似遅延（line 672）、成功/失敗時に `alert` 表示（lines 683, 686）
- 削除時に `confirm` 確認ダイアログ（line 701）、削除後に `alert` 通知（line 704）

改善: 
- 使うアイコンだけをインポート
- TypeScript 型の整備、Zodで入力検証
- 共通ユーティリティ/DB/型を分離

---

## 11. すぐに直せる改善（短期）
1. __A11y__: 検索ラベル、`th scope="col"`、モーダル `role/aria-modal/Escape`、`aria-live` の追加
2. __型__: `Customer`/`NewCustomer` インターフェース作成、`any` 排除
3. __依存配列__: 検索 `useEffect` を `useMemo` + `useEffect`（ローディング表示）に整理
4. __UI__: `alert/confirm` をアクセシブルなダイアログ/トーストに置換
5. __スタイル__: `dangerouslySetInnerHTML` を撤廃し、Tailwindに段階移行

---

## 12. リファクタリング計画（中期）
- ディレクトリ構成（例）:
  - `src/app/customer-list/components/`
    - `Header.tsx`, `SearchBar.tsx`, `CustomersTable.tsx`, `CustomerFormModal.tsx`, `EmptyState.tsx`
  - `src/lib/customer/db.ts`（`CustomerDB` 移動、将来 Supabase 置換）
  - `src/types/customer.ts`（型定義）
  - `src/hooks/customer/useCustomerSearch.ts`（検索/フィルタ/デバウンス）
- テスト:
  - Playwright: 検索、追加、編集、削除、モーダルA11y
  - 単体: 正規化/検索、バリデーション

---

## 13. 将来拡張
- サーバサイドデータ/認証/権限（Supabase）
- 住所/郵便番号の自動補完
- CSV/Excel エクスポート（エスケープ/エンコーディング対策）

---

## 14. 参考
- 対象: `src/app/customer-list/page.tsx`
- ガイド: `docs/TOOL_GUIDELINES_JA.md`, `memo`
- 関連: `src/app/invoice-list/page.tsx`（命名・UI 方針の整合）、`work-history` のA11y/テスト実装

本計画に沿って、保守性/アクセシビリティ/セキュリティ/性能を改善していきます。
