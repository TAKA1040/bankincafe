# 🔧 鈑金Cafe 開発ルール

## 🎨 UI/CSS ルール

### ✅ **絶対ルール: ページ独立性**
- **各ページのスタイルは完全に独立**
- **共通CSSは使用しない**
- **グローバルスタイルは最小限**
- **各ページで inline style または独自 CSS Module を使用**

### 🚫 **禁止事項**
- ❌ グローバルCSS の広範囲適用
- ❌ 全ページに影響する共通スタイル
- ❌ layout.tsx での強制的なスタイル適用
- ❌ ページ間でのスタイル依存関係

### ✅ **推奨パターン**
```tsx
// ✅ 良い例: 各ページで独立したスタイル
export default function InvoicePage() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa', 
      padding: '2rem'
    }}>
      {/* ページ固有のスタイル */}
    </div>
  )
}
```

```tsx
// ❌ 悪い例: 共通スタイルに依存
<div className="global-container"> {/* これは禁止 */}
```

---

## 🔒 セキュリティルール（請求書ツール）

### 🛡️ **情報漏洩防止 - 絶対ルール**

#### データ保護
- **請求書データはSupabaseで暗号化保存**
- **RLS (Row Level Security) 必須適用**
- **個人情報は最小限の保持**
- **ログに機密情報を出力禁止**

#### アクセス制御
- **認証必須**: 全ての請求書機能にログイン必須
- **権限管理**: 自分のデータのみアクセス可能
- **セッション管理**: 適切なタイムアウト設定
- **入力値検証**: SQLインジェクション対策

#### データ処理
```tsx
// ✅ 良い例: セキュアなデータ処理
const { data, error } = await supabase
  .from('invoices')
  .select('*')
  .eq('user_id', user.id) // 必須: ユーザーフィルタ
  .single()
```

```tsx
// ❌ 悪い例: 危険なデータ処理
console.log('請求書データ:', invoiceData) // ログ出力禁止
const query = `SELECT * FROM invoices WHERE id = ${id}` // SQLインジェクション危険
```

#### 暗号化・マスキング
- **金額データ**: 暗号化保存
- **顧客情報**: 必要最小限の保持
- **印刷用PDF**: 一時的な生成、長期保存禁止
- **画面表示**: 機密データのマスキング

---

## 📁 ファイル構造ルール

### 🎯 **ページ構造**
```
src/app/
├── login/page.tsx           (認証)
├── dashboard/page.tsx       (ダッシュボード)
├── invoices/
│   ├── page.tsx            (請求書一覧)
│   ├── create/page.tsx     (請求書作成)
│   ├── [id]/page.tsx       (請求書詳細)
│   └── [id]/edit/page.tsx  (請求書編集)
└── customers/
    ├── page.tsx            (顧客管理)
    └── [id]/page.tsx       (顧客詳細)
```

### 🔐 **セキュリティ実装**
```
src/lib/
├── supabase/
│   ├── client.ts           (クライアント設定)
│   ├── server.ts           (サーバー設定)
│   └── database.types.ts   (型定義)
├── auth/
│   ├── middleware.ts       (認証チェック)
│   └── permissions.ts      (権限管理)
└── security/
    ├── validation.ts       (入力値検証)
    ├── encryption.ts       (暗号化処理)
    └── audit.ts           (監査ログ)
```

---

## 📁 **ファイル命名ルール**

### 🚫 **絶対禁止: 同一ファイル名の使用**
- **階層が違っても同じファイル名は禁止**
- **page.tsx を複数使用しない**
- **component.tsx など汎用名は禁止**

### ✅ **推奨命名パターン**
```
❌ 悪い例: 同じファイル名
src/app/dashboard/page.tsx
src/app/invoices/page.tsx
src/app/customers/page.tsx

✅ 良い例: 固有のファイル名
src/app/dashboard.tsx
src/app/invoice-list.tsx  
src/app/invoice-create.tsx
src/app/customer-list.tsx
src/app/customer-detail.tsx
```

### 🎯 **具体的な命名規則**
```
📁 src/app/
├── 📄 dashboard.tsx           (メインダッシュボード)
├── 📄 invoice-list.tsx        (請求書一覧)
├── 📄 invoice-create.tsx      (請求書作成)  
├── 📄 invoice-detail.tsx      (請求書詳細)
├── 📄 invoice-edit.tsx        (請求書編集)
├── 📄 customer-list.tsx       (顧客一覧)
├── 📄 customer-create.tsx     (顧客登録)
├── 📄 customer-detail.tsx     (顧客詳細)
├── 📄 sales-management.tsx    (売上管理)
├── 📄 work-history.tsx        (作業履歴)
└── 📄 settings.tsx           (設定)

📁 src/components/
├── 📄 invoice-form.tsx        (請求書フォーム)
├── 📄 customer-form.tsx       (顧客フォーム)
├── 📄 work-item-input.tsx     (作業項目入力)
└── 📄 voice-input-button.tsx  (音声入力ボタン)
```

### 📋 **命名の原則**
1. **機能-動作** の組み合わせ (例: `invoice-create`)
2. **英語での統一**
3. **kebab-case 使用**
4. **省略形を避ける** (例: `cust` → `customer`)
5. **一意性の確保**

---

## ✅ **実装チェックリスト**

### 各ページ作成時
- [ ] 独立したスタイル実装
- [ ] 認証チェック実装
- [ ] RLS適用確認
- [ ] 入力値検証実装
- [ ] エラーハンドリング実装
- [ ] 機密情報のログ出力チェック

### デプロイ前
- [ ] セキュリティテスト実行
- [ ] 権限テスト実行
- [ ] データ漏洩チェック実行
- [ ] パフォーマンステスト実行

---

**これらのルールを厳格に遵守して、安全で柔軟な請求書システムを構築します。**