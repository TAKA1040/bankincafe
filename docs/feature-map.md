# Feature Map - bankincafe

最終更新: 2025-08-23

## OAuth 実値記録（セキュリティ宣言 10項 準拠）

### 本番環境設定
- **本番 SITE_URL**: `https://bankincafe.apaf.me`
- **本番ドメイン**: bankincafe.apaf.me
- **Vercel URL**: bankincafe-1jg82ll2d-takas-projects-ebc9ff02.vercel.app

### Supabase Authentication 設定
- **SITE_URL**: `https://bankincafe.apaf.me`
- **Redirect URLs Allow List**:
  - `https://bankincafe.apaf.me/auth/callback`
  - `http://localhost:3000/auth/callback`
  - `http://127.0.0.1:3000/auth/callback`

### Google Cloud Console OAuth 2.0 設定
**必須設定 - Authorized redirect URIs（完全一致）:**
- `https://bankincafe.apaf.me/auth/callback`
- `http://localhost:3000/auth/callback`

## 機能レジストリ

| 機能名 | パス | 状態 | 説明 | コミットID | 最終更新 |
|--------|------|------|------|-----------|----------|
| Google認証ログイン | `/login` | ✅ 実装完了 | Supabase Auth + Google OAuth | 8934ff8 | 2025-08-23 |
| 認証コールバック | `/auth/callback` | ✅ 実装完了 | 認証後の処理とリダイレクト | 8934ff8 | 2025-08-23 |
| 認証エラーページ | `/auth/auth-code-error` | ✅ 実装完了 | 詳細エラー表示と対処方法 | 8934ff8 | 2025-08-23 |
| ログイン完了ページ | `/` | ✅ 実装完了 | ユーザー情報表示と管理者判定 | 8934ff8 | 2025-08-23 |
| ミドルウェア | `src/middleware.ts` | ✅ 実装完了 | Supabaseセッション同期 | 8934ff8 | 2025-08-23 |

## 環境分離設定

| 環境 | URL | Supabase Project | 状態 |
|------|-----|------------------|------|
| Development (Local) | http://localhost:3000 | auwmmosfteomieyexkeh | ✅ 設定済 |
| Production | https://bankincafe.apaf.me | auwmmosfteomieyexkeh | ✅ デプロイ済・動作確認済 |

## セキュリティ設定

### RLS (Row Level Security)
- [ ] **TODO**: 全テーブルでRLS有効化 (profiles等)
- [ ] **TODO**: ポリシー実装

### 環境変数
- ✅ NEXT_PUBLIC_SUPABASE_URL: Vercelに設定済
- ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: Vercelに設定済
- ✅ .env.local: ローカル開発用設定済
- ✅ .env.cli.secret: CLI専用秘密変数設定済

### セキュリティ対策
- ✅ .gitignore: 秘密情報除外設定
- ✅ TypeScript型定義: 環境変数型安全性
- ✅ ログレベル制御: 本番/開発分離

## 已知の問題と解決状況

| 問題 | 状態 | 対応 |
|------|------|------|
| redirect_uri_mismatch | 🔄 要手動設定 | Google Cloud Console設定必要 |
| ローカル開発ポート競合 | ✅ 解決済 | ポート指定スクリプト追加 |
| Vercel環境変数 | ✅ 解決済 | 設定確認済 |

## 次期開発予定

| 機能 | 優先度 | 想定工数 |
|------|--------|----------|
| プロフィール管理 | High | 2-3日 |
| 承認フロー (PENDING→APPROVED) | Medium | 1-2日 |
| 管理者機能 | Medium | 2-3日 |
| RLS実装 | High | 1日 |