/**
 * 環境変数の型定義
 */
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_URL: string
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string
    NEXT_PUBLIC_ALLOWED_EMAILS: string
    SUPABASE_SERVICE_ROLE_KEY?: string
  }
}

declare global {
  interface Window {
    checkRLSStatus?: () => Promise<void>
  }
}