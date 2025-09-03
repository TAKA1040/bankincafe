# bankincafe

- 概要: Next.js + TypeScript のアプリケーション（Vercel デプロイ、推定）。

## セットアップ（依存関係の導入）
```sh
npm install
```

## 起動方法
```sh
# 開発起動（http://localhost:3000）
npm run dev

# 本番ビルド／起動（http://localhost:3000）
npm run build
npm start

# テスト（存在する場合）
npm test
```

## 注意点（.env、バージョンなど）
- `.env.local` を推奨（Git 管理外）。
- Next.js 既定ポートは 3000。Node 18+ 推奨。
