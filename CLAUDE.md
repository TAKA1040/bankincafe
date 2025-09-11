# Claude Code - bankincafe

## 📖 Inherits From
**Global Rules**: C:\Windsurf\CLAUDE.md

## 🚨 経理データ保護ルール（最優先）

### ❌ 絶対禁止事項
- **データベースからの削除**: invoices, invoice_line_items テーブルからの DELETE 操作
- **件数制限**: データ取得時の安易な LIMIT 使用
- **データ消失**: パフォーマンス改善を理由とした件数削減
- **中途半端な修正**: 経理データが見えなくなる可能性のある変更

### ✅ 必須事項
- **全件表示**: 経理データは漏れなく表示すること
- **データ完全性**: 修正前後でデータ件数が変わらないこと
- **慎重な変更**: 経理関連の修正は事前にデータ件数を確認
- **復旧優先**: 問題発生時は即座に全件表示に復旧

### 📋 経理データとは
- 請求書データ（invoices テーブル）
- 請求書明細データ（invoice_line_items テーブル）
- 顧客データ、金額データ、作業履歴データ
- 税務・法的根拠として保存が義務付けられたデータ

**⚠️ 重要**: 経理データは企業の生命線。軽微な修正でも慎重に行うこと。

## 🛡️ 自動データ保護システム

### 📋 実装済み保護機能
1. **data-protection.js**: サーバーサイド保護システム
   - DELETE/TRUNCATE/DROP操作の完全ブロック
   - 最小データ件数の強制チェック（請求書1000件、明細500件）
   - 操作前後の件数比較・検証

2. **data-guard.ts**: フロントエンド保護システム
   - リアルタイムデータ監視
   - 危険操作の事前ブロック
   - 保護されたSupabaseクライアント

3. **pre-commit-data-check.js**: Git保護システム
   - コミット前のデータ件数自動チェック
   - データ不足時のコミット自動ブロック
   - 緊急復旧コマンドの自動提示

### 🚨 自動ブロック対象
- `invoices`テーブルのDELETE操作
- `invoice_line_items`テーブルのDELETE操作
- 最小件数を下回る状態でのコミット
- 危険なLIMIT制限付きクエリ

### 🔧 緊急復旧コマンド
```bash
node emergency_restore.js  # CSVから全データ復旧
```

### 📊 監視基準値
- **invoices**: 最低1000件
- **invoice_line_items**: 最低500件

## 📚 プロジェクト内ドキュメント管理

### 🗂️ ファイル整理システム
- **ファイル整理記録**: `./FILE_ORGANIZATION_LOG.md`
  - **役割**: プロジェクト内ファイルの整理履歴・archiveフォルダのルール説明
  - **重要性**: ファイル削除・移動の安全性確保、過去の整理履歴確認
  - **場所**: プロジェクトルート直下（いつでもアクセス可能）
  - **内容**: archive/フォルダ構造、移動済みファイル一覧、整理ルール

### 機能説明書・マニュアル作成用メモ
- **請求書一覧ページ機能説明**: `C:\Windsurf\bankincafe\docs\invoice-list-features.md`
  - ページネーション機能（10/30/50件表示切り替え）
  - 曖昧検索機能（ひらがな/カタカナ、大小文字、全角半角区別なし）
  - 統計ダッシュボード、6列テーブルレイアウト
  - 作業タイプ識別（T:個別、S:セット）
  - ユーザーマニュアル作成時の参考資料として使用

**📝 Note**: 今後の機能追加時も同様に docs/ フォルダに機能説明メモを作成し、ここに記録すること

## 🎯 Project-Specific Context
- **プロジェクト目的**: 請求書管理システム（bankincafe）
- **技術スタック**: Next.js 14, TypeScript, Supabase, Tailwind CSS
- **主要機能**: 請求書作成、一覧表示、詳細表示、CSV処理、辞書システム

## 🚀 Project CLI Automation
- **Development**: `npm run dev` - 開発サーバー起動
- **Database**: `supabase start` - ローカルSupabase起動
- **Build**: `npm run build` - 本番ビルド
- **Type Check**: `npm run type-check` - TypeScript型チェック
- **Deployment**: Vercel経由での自動デプロイ

## 📋 Project Standards
- **データベース設計**: invoice系テーブル構造の維持
- **コンポーネント設計**: 既存のhooks/components構造に従う
- **UIデザイン**: Tailwind CSS + Lucide Reactアイコンの統一
- **データ処理**: CSV一括処理システムとの整合性維持

## 🔄 Current Development Status
- ✅ 請求書一覧機能完成（ページネーション・曖昧検索・統計表示）
- ✅ 請求書詳細表示機能実装
- ✅ CSV大量データ処理システム構築
- ✅ 作業辞書システム基盤構築
- 🔄 次のフェーズ: ユーザーマニュアル作成、追加機能開発

## 📝 Important Files & Locations
- **メイン設定**: `/src/app/` - Next.js App Router構造
- **データフック**: `/src/hooks/` - カスタムフック群
- **データベース**: `/supabase/migrations/` - DB migration files
- **処理スクリプト**: `/scripts/` - CSV処理・データ変換スクリプト
- **ドキュメント**: `/docs/` - 機能説明書・メモ類