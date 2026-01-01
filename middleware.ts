import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  // 認証不要なパス
  const publicPaths = ['/login', '/auth/error', '/auth/callback', '/api/auth']
  const { pathname } = request.nextUrl

  // 認証不要なパスの場合はそのまま通す
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // 静的ファイルやAPIルートは通す
  if (pathname.startsWith('/_next') || pathname.startsWith('/api/db')) {
    return NextResponse.next()
  }

  // NextAuthのトークンをチェック
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET })

  // 認証されていない場合はログインページにリダイレクト
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
