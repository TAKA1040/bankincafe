import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // NextAuth対応のミドルウェア（Supabase認証を削除）
  // 特別な処理が必要な場合はここに追加
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
