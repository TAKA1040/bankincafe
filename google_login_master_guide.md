# マスター手順書: Next.js Googleログイン実装ガイド

## 0. このドキュメントの目的 (Purpose)

このドキュメントは、本Next.jsプロジェクトにGoogleログイン機能（NextAuth.js利用）を導入するためのマスター手順書です。

AIアシスタントにこのファイルを提示することで、**迅速かつ正確な実装を指示すること**を目的とします。将来のメンテナンスや改修時にも、本書を基準としてください。

---

## 1. 実装の概要 (Overview)

実装は、以下の3つの主要なステップで構成されます。

1.  **コード実装:** バックエンドAPIとフロントエンドUIを構築します。
2.  **環境設定:** Google Cloudとローカル環境で、必要な認証情報や変数を設定します。
3.  **デプロイ:** Vercelに本番環境を構築します。

---

## 2. コード実装 (Code Implementation)

### Step 2.1: バックエンドAPIの構築

**指示:** 以下の内容で `src/app/api/auth/[...nextauth]/route.ts` を作成または上書きしてください。

```typescript
import NextAuth, { type AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'

const providers = []

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  )
}

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

export const authOptions: AuthOptions = {
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
    async session({ session, token: _token }) {
      if (session.user) {
        // session.user.id = _token.id as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
```

### Step 2.2: フロントエンドUIの構築

**指示:** 以下の内容で `src/app/login/page.tsx` を作成または上書きしてください。

```typescript
'use client'

import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push('/')
    }
  }, [session, router])

  if (session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p>リダイレクト中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 px-4">
        <div>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Banking Cafe
          </h1>
        </div>
        <div className="mt-8 space-y-4">
          <div>
            <button
              onClick={() => signIn('google', { callbackUrl: '/' })}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-md font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Googleでログイン
            </button>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <div>
              <div className="my-4 flex items-center justify-center">
                <div className="border-t border-gray-300 w-full"></div>
                <p className="px-2 text-center text-sm text-gray-500 bg-gray-50">OR</p>
                <div className="border-t border-gray-300 w-full"></div>
              </div>
              <button
                onClick={() => signIn('credentials', { 
                  username: 'dev-user',
                  callbackUrl: '/' 
                })}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-md font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                開発用アカウントでログイン
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

---

## 3. 環境設定 (Environment Setup)

### Step 3.1: Google Cloud Platform (GCP) での準備

1.  GCPでOAuthクライアントIDを作成します。
2.  **クライアントID** と **クライアントシークレット** を取得します。

### Step 3.2: ローカル環境変数 (`.env`)

**指示:** プロジェクトルートに `.env` ファイルを作成し、以下の内容を記述してください。値はGCPで取得したもの、および自身で生成したものに置き換えてください。

```
# Google Cloud Platformで取得した認証情報
GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID_HERE"
GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET_HERE"

# NextAuth.jsのセッション暗号化キー
# ※ openssl rand -base64 32 コマンドなどで生成したランダムな文字列
NEXTAUTH_SECRET="YOUR_GENERATED_SECRET_HERE"

# 開発環境でのNextAuth.jsのベースURL
NEXTAUTH_URL="http://localhost:3000"
```

---

## 4. デプロイ手順 (Deployment to Vercel)

### Step 4.1: Vercel 環境変数の設定

**指示:** Vercelプロジェクトの「Settings」>「Environment Variables」で、Step 3.2で設定した**全ての環境変数を登録**してください。

**【重要】** `NEXTAUTH_URL` の値は、`http://localhost:3000` ではなく、**実際のVercelのURL (`https://...`) に必ず変更**してください。

### Step 4.2: GCP リダイレクトURIの更新

**指示:** GCPのOAuthクライアント設定に戻り、「承認済みのリダイレクト URI」に**本番環境のコールバックURLを追加**してください。

-   `https://[あなたのVercelアプリURL]/api/auth/callback/google`

### Step 4.3: デプロイの実行

**指示:** ローカル環境から以下のコマンドを実行し、手動で本番環境へデプロイします。

```bash
vercel --prod
```
