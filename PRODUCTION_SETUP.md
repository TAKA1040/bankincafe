# Banking Cafe - 本番環境セットアップ手順

## 🔐 1. Google Cloud Console 設定

### プロジェクト作成
1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 新しいプロジェクトを作成: `banking-cafe-auth`
3. プロジェクトIDをメモしておく

### API有効化
1. **APIs & Services** > **Library** に移動
2. 以下のAPIを有効化:
   - Google+ API (または People API)
   - Google Identity API

### OAuth同意画面設定
1. **APIs & Services** > **OAuth consent screen** に移動
2. 設定項目:
   - **User Type**: External
   - **App name**: Banking Cafe
   - **User support email**: あなたのメールアドレス
   - **App logo**: (任意)
   - **Authorized domains**: あなたのドメイン (例: yourdomain.com)
   - **Developer contact information**: あなたのメールアドレス

### OAuth 2.0 認証情報作成
1. **APIs & Services** > **Credentials** に移動
2. **Create Credentials** > **OAuth client ID** をクリック
3. 設定項目:
   - **Application type**: Web application
   - **Name**: Banking Cafe Production
   - **Authorized redirect URIs**: 
     - `https://yourdomain.com/api/auth/callback/google`
     - `https://your-vercel-app.vercel.app/api/auth/callback/google`

4. **作成**をクリックして、クライアントIDとシークレットをメモ

## 🚀 2. Vercel デプロイメント設定

### Vercel CLI セットアップ
```bash
# Vercel にログイン
npx vercel login

# プロジェクトをリンク
npx vercel link

# 環境変数を設定
npx vercel env add NEXTAUTH_SECRET
npx vercel env add GOOGLE_CLIENT_ID
npx vercel env add GOOGLE_CLIENT_SECRET
npx vercel env add ALLOWED_EMAILS
npx vercel env add NEXTAUTH_URL
```

### 環境変数設定値
```
NEXTAUTH_SECRET=[新しい32文字の秘密キーを生成]
GOOGLE_CLIENT_ID=[Google Cloud Consoleで取得したクライアントID]
GOOGLE_CLIENT_SECRET=[Google Cloud Consoleで取得したクライアントシークレット]
ALLOWED_EMAILS=[許可するメールアドレス（カンマ区切り）]
NEXTAUTH_URL=https://your-vercel-app.vercel.app
```

### デプロイ実行
```bash
# 本番環境にデプロイ
npx vercel --prod
```

## 🧪 3. テスト手順

### 本番環境テスト
1. デプロイされたURLにアクセス
2. 「Googleでログイン」ボタンをクリック
3. Google OAuth同意画面で認証
4. ログイン成功を確認

### トラブルシューティング
- **invalid_client エラー**: Google Cloud ConsoleのリダイレクトURIを確認
- **OAuth consent screen エラー**: 同意画面の設定を確認
- **環境変数エラー**: Vercelの環境変数設定を確認

## 📝 4. セキュリティチェックリスト

- [ ] Google Cloud Consoleの認証情報が正しく設定されている
- [ ] リダイレクトURIが本番環境のURLと一致している
- [ ] 環境変数が本番環境で正しく設定されている
- [ ] ALLOWED_EMAILSで適切にアクセス制限されている
- [ ] NEXTAUTH_SECRETが本番用の新しい値になっている

## 🔄 5. 開発環境との切り替え

開発環境では自動的にダミー認証が使用され、本番環境では自動的にGoogle OAuthが使用されます。

環境の判定は `.env.local` の `GOOGLE_CLIENT_ID` の値で行われます:
- `dummy-client-id-for-testing` → 開発モード（ダミー認証）
- 実際のGoogle Client ID → 本番モード（Google OAuth）