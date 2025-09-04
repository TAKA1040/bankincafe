# Claude Code - bankincafe

## 📖 Inherits From
**Global Rules**: C:\Windsurf\CLAUDE.md

## 📚 プロジェクト内ドキュメント管理

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