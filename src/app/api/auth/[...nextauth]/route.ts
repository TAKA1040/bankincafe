import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'

// 開発環境でのダミー認証情報チェック
const isDummyCredentials = 
  process.env.GOOGLE_CLIENT_ID === 'dummy-client-id-for-testing' ||
  process.env.GOOGLE_CLIENT_SECRET === 'dummy-client-secret-for-testing'

// 環境変数バリデーション (本物の認証情報の場合のみ)
if (!isDummyCredentials) {
  const requiredEnvVars = {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  }

  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`)
    }
  }
}

const providers = []

// 本物のGoogle認証がある場合は追加
if (!isDummyCredentials) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  )
}

// 開発用認証プロバイダー (ダミー認証情報の場合)
if (isDummyCredentials) {
  providers.push(
    CredentialsProvider({
      id: "credentials",
      name: "development",
      credentials: {
        username: { 
          label: "Username", 
          type: "text", 
          placeholder: "dev-user" 
        },
      },
      async authorize(credentials) {
        console.log('Development authorize called with:', credentials)
        // 開発環境用の固定ユーザー
        return {
          id: "dev-user",
          name: "テストユーザー", 
          email: "test@example.com",
        }
      }
    })
  )
}

const handler = NextAuth({
  providers,
  callbacks: {
    async signIn({ user }) {
      console.log('signIn callback called with user:', user)
      // ダミー認証情報の場合は開発用認証を許可
      if (isDummyCredentials) {
        return true
      }
      
      // 許可されたメールアドレスのチェック
      const allowedEmails = process.env.ALLOWED_EMAILS?.split(',') || []
      
      if (allowedEmails.length > 0 && user.email && !allowedEmails.includes(user.email)) {
        return false
      }
      
      return true
    },
    async session({ session, token }) {
      console.log('session callback called with session:', session, 'token:', token)
      // トークンからセッションにユーザー情報を設定
      if (token && session.user) {
        session.user.name = token.name
        session.user.email = token.email
      }
      return session
    },
    async jwt({ token, user }) {
      console.log('jwt callback called with token:', token, 'user:', user)
      // 初回ログイン時にユーザー情報をトークンに保存
      if (user) {
        token.name = user.name
        token.email = user.email
      }
      return token
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development', // 開発時のデバッグログ有効
})

export { handler as GET, handler as POST }