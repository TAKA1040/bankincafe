import NextAuth, { type AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'

// プロバイダーのリストを事前に作成
const providers = []

// Google Provider (環境変数が設定されている場合のみ)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  )
}

// 開発環境でのみCredentialsProviderを有効にする
if (process.env.NODE_ENV === 'development') {
  providers.push(
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
      },
      async authorize(credentials) {
        if (credentials?.username === 'dev-user') {
          return { id: '1', name: '開発者', email: 'dev@example.com' }
        }
        return null
      },
    }),
  )
}

const authOptions: AuthOptions = {
  providers,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        // @ts-ignore - Extending session.user with id property
        session.user.id = token.id as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }