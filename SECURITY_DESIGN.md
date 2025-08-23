# 🔐 鈑金Cafe セキュリティ設計

## 🛡️ 多層セキュリティアプローチ

### 第1層: Google OAuth認証
- ✅ **実装済み**: Supabase Auth + Google OAuth
- ✅ **目的**: ユーザー識別とセッション管理
- ✅ **管理者判定**: dash201206@gmail.com

### 第2層: 4桁PIN認証（予定実装）
- 🔄 **目的**: 同一端末での不正アクセス防止
- 🔄 **実装方法**: クライアントサイドでのPIN入力
- 🔄 **有効期間**: セッション中（30分自動タイムアウト）
- 🔄 **保存場所**: sessionStorage（ブラウザ再起動で消去）

---

## 🔒 PIN認証の実装計画

### データ構造
```typescript
interface SecurityState {
  pinAuthenticated: boolean
  pinTimestamp: number
  pinExpiryMinutes: 30
}
```

### フロー設計
```
1. Google OAuth認証 → ログイン成功
2. dashboard.tsx アクセス時
   ↓
3. PIN認証状態チェック
   - 未認証 OR タイムアウト → PIN入力画面
   - 認証済み → ダッシュボード表示
   ↓
4. PIN入力 (4桁)
   - 正解 → sessionStorage保存 + ダッシュボード
   - 不正解 → エラー表示（3回でロックアウト）
```

### セキュリティ仕様
```typescript
// 環境変数で管理（後から変更可能）
NEXT_PUBLIC_DASHBOARD_PIN=1040  // 例: 4桁PIN

// セッション管理
const SECURITY_CONFIG = {
  PIN_LENGTH: 4,
  TIMEOUT_MINUTES: 30,
  MAX_ATTEMPTS: 3,
  LOCKOUT_MINUTES: 15
}
```

### 実装ファイル構成
```
src/components/
├── pin-input-dialog.tsx    (PIN入力ダイアログ)
├── security-wrapper.tsx    (セキュリティラッパー)
└── pin-timeout-handler.tsx (タイムアウト処理)

src/lib/security/
├── pin-auth.ts            (PIN認証ロジック)
├── session-manager.ts     (セッション管理)
└── security-utils.ts      (セキュリティユーティリティ)
```

---

## 📋 実装段階

### Phase 1: ダッシュボード基本実装 ✅
- トップメニューUI作成
- セキュリティラッパー準備
- PIN認証なしでの基本機能

### Phase 2: PIN認証実装 (後日)
- PIN入力ダイアログ作成
- セッション管理実装  
- タイムアウト処理実装
- 環境変数設定

### Phase 3: セキュリティ強化 (将来)
- PIN変更機能
- 操作ログ記録
- 不正アクセス検知

---

## 🔧 現在の実装方針

**dashboard.tsx では:**
1. セキュリティラッパーコンポーネントで囲む
2. PIN認証状態を管理するstate準備
3. 現在はPIN認証をスキップ（後から有効化）

**準備するinterface:**
```typescript
interface DashboardProps {
  user: User
  securityEnabled?: boolean  // 後からPIN認証を有効化
}

interface SecurityWrapperProps {
  children: React.ReactNode
  requirePin?: boolean       // PIN認証必須フラグ
  onPinRequired?: () => void // PIN入力が必要な時のコールバック
}
```

これにより、後からセキュリティ機能を追加しても既存コードに影響しません。