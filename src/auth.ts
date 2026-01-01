import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

// 許可されたメールアドレスリスト
const ALLOWED_EMAILS = (process.env.NEXT_PUBLIC_ALLOWED_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean)

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  callbacks: {
    // サインイン時にメールアドレスをチェック
    async signIn({ user }) {
      if (!user.email) {
        return false
      }

      // 許可リストが空の場合は全員許可
      if (ALLOWED_EMAILS.length === 0) {
        return true
      }

      // 許可リストにあるメールアドレスのみ許可
      return ALLOWED_EMAILS.includes(user.email)
    },
    // セッションにユーザー情報を追加
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      return session
    },
    // JWTにユーザー情報を追加
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
  },
  session: {
    strategy: 'jwt',
  },
  // 本番環境ではHTTPSを強制
  trustHost: true,
})
