/**
 * 環境変数の型定義
 */
declare namespace NodeJS {
  interface ProcessEnv {
    // manarieDB
    MANARIEDB_API_KEY: string

    // NextAuth.js
    AUTH_SECRET: string
    NEXTAUTH_URL: string
    GOOGLE_CLIENT_ID: string
    GOOGLE_CLIENT_SECRET: string

    // アプリケーション設定
    ALLOWED_EMAILS: string // サーバーサイド専用（セキュリティ向上）
  }
}

declare global {
  interface Window {
    checkRLSStatus?: () => Promise<void>
  }
}