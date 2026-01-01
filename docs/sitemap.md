# Bankincafe サイトマップ

## 概要

請求書管理システム「Bankincafe」のページ構成とナビゲーション。

---

## トップページ `/`（ダッシュボード）

ログイン後に表示されるメイン画面。各機能へのボタンが配置されている。

---

## 🚀 基本機能

| ボタン名 | URL | 説明 |
|----------|-----|------|
| 請求書作成 | `/invoice-create` | 新規請求書を作成・編集 |
| 請求書一覧 | `/invoice-list` | 作成済み請求書の確認・管理 |
| 請求書発行 | `/invoice-publish` | 印刷・メール・PDF作成 |

---

## 📊 管理・分析機能

| ボタン名 | URL | 説明 |
|----------|-----|------|
| 顧客管理 | `/customer-list` | 顧客情報の登録・編集・検索 |
| 作業価格検索 | `/work-history` | 過去の作業実績を検索・管理 |
| 顧客別作業履歴 | `/work-search` | 作業内容と価格を確認・分析 |
| 売上管理 | `/sales-management` | 月別売上の分析・レポート作成 |

---

## ⚙️ マスター設定

| ボタン名 | URL | 説明 |
|----------|-----|------|
| 会社情報設定 | `/company-settings` | 会社情報・請求書発行元情報の設定 |
| 顧客カテゴリ設定 | `/customer-settings` | 顧客カテゴリの管理・追加・編集 |
| 件名マスタ管理 | `/subject-master` | 件名と登録番号の関連管理 |
| 登録番号マスタ設定 | `/registration-settings` | 登録番号のマスター管理・自動登録 |
| 作業辞書管理 | `/work-dictionary` | 作業項目・動作・位置の辞書管理 |
| マスター確認 | `/master-confirmation` | マスターデータの登録状況と統計情報（削除予定） |

---

## 🛡️ 管理者機能

| ボタン名 | URL | 説明 |
|----------|-----|------|
| 管理者設定 | `/admin-settings` | ユーザー管理・システム設定・Google認証 |

---

## 認証関連

| URL | 説明 |
|-----|------|
| `/login` | ログイン画面（Google OAuth） |

---

## 請求書関連（詳細ページ）

| URL | 説明 | 遷移元 |
|-----|------|--------|
| `/invoice-view/[id]` | 請求書詳細表示 | 請求書一覧から |
| `/invoice-create?edit=[id]` | 請求書編集 | 請求書一覧・詳細から |
| `/invoice-print/[id]` | 請求書印刷プレビュー | 請求書詳細から |
| `/invoice-print/batch` | 一括印刷 | 請求書発行から |
| `/invoice-print/list` | 印刷リスト | 請求書発行から |
| `/invoice-print/adjustment` | 調整印刷 | 請求書発行から |
| `/invoice-print/zip-export` | ZIP一括出力 | 請求書発行から |
| `/invoice-corrections` | 請求書修正 | - |
| `/invoice-print-settings` | 印刷設定 | - |

---

## マスター詳細ページ

| URL | 説明 | 遷移元 |
|-----|------|--------|
| `/subject-master/[id]` | 件名マスタ詳細・編集 | 件名マスタ管理から |
| `/registration-settings/[id]` | 登録番号詳細・編集 | 登録番号マスタ設定から |

---

## その他

| URL | 説明 |
|-----|------|
| `/work-entry` | 作業入力 |
| `/test-manariedb` | manarieDB接続テスト（開発用） |
| `/test-invoice-page` | 請求書ページテスト（開発用） |

---

## ページ遷移フロー

```
[ログイン] /login
    ↓ Google OAuth認証
[ダッシュボード] /
    ├── [請求書作成] /invoice-create
    │       └── 保存後 → /invoice-list
    ├── [請求書一覧] /invoice-list
    │       ├── 詳細 → /invoice-view/[id]
    │       │       └── 印刷 → /invoice-print/[id]
    │       └── 編集 → /invoice-create?edit=[id]
    ├── [請求書発行] /invoice-publish
    │       ├── 一括印刷 → /invoice-print/batch
    │       ├── リスト → /invoice-print/list
    │       └── ZIP出力 → /invoice-print/zip-export
    ├── [顧客管理] /customer-list
    ├── [売上管理] /sales-management
    ├── [作業価格検索] /work-history
    ├── [顧客別作業履歴] /work-search
    ├── [会社情報設定] /company-settings
    ├── [顧客カテゴリ設定] /customer-settings
    ├── [件名マスタ管理] /subject-master
    │       └── 詳細 → /subject-master/[id]
    ├── [登録番号マスタ設定] /registration-settings
    │       └── 詳細 → /registration-settings/[id]
    ├── [作業辞書管理] /work-dictionary
    └── [管理者設定] /admin-settings
```

---

## 技術情報

- **フレームワーク**: Next.js 14 (App Router)
- **認証**: NextAuth.js + Google OAuth
- **データベース**: manarieDB
- **本番URL**: https://bankincafe.apaf.me

---

*最終更新: 2026-01-01*
