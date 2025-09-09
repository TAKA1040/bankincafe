import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const response = await updateSession(request)

  // 認証不要なパス
  const publicPaths = ['/login', '/auth/pending']
  const { pathname } = request.nextUrl

  // 認証不要なパスの場合はそのまま通す
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return response
  }

  // 認証が必要なパスの場合はセッションをチェック
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}