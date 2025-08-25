# 鈑金Cafe

Next.js 15 + Supabase Auth を使用したGoogle OAuth認証システム

## 🚀 機能

- ✅ Google OAuth認証 (Supabase Auth)
- ✅ 管理者判定 (dash201206@gmail.com)
- ✅ セッション管理
- ✅ レスポンシブデザイン
- ✅ 請求書作成・管理システム
- ✅ 顧客管理システム
- ✅ 作業履歴検索・分析機能
- ✅ 売上管理・レポート機能
- ✅ CSV出力機能

## 📚 ドキュメント

### 🔧 開発者ガイド
- **[📖 全ページ機能マニュアル](./docs/全ページ機能マニュアル.md)** - 完全な機能仕様・セキュリティ設計
- **[🎨 UI変更ガイド](./docs/UI_MODIFICATION_GUIDE.md)** - 全AIツール対応UI変更手順
- **[📋 ドキュメント概要](./docs/README.md)** - ドキュメント構成・使用方法

### 🛡️ セキュリティ設計
- **RLS (Row Level Security)**: ユーザー別データ分離
- **SecurityWrapper**: 全ページ認証チェック
- **XSS対策**: React自動エスケープ活用
- **CSRF対策**: SameSite Cookie設定

## 🔧 開発

```bash
npm install
npm run dev
```

### 📋 開発時の重要事項
- 全ページで`SecurityWrapper`必須
- CSS競合回避のため分離設計
- TypeScript型安全性を維持
- セキュリティチェックリスト確認

## 🔗 本番URL
- https://bankincafe.apaf.me

## 📋 OAuth設定

### Google Cloud Console
- 承認済みのリダイレクト URI: `https://auwmmosfteomieyexkeh.supabase.co/auth/v1/callback`

### Supabase Dashboard  
- Site URL: `https://bankincafe.apaf.me`
- Redirect URLs: `https://bankincafe.apaf.me/auth/callback`