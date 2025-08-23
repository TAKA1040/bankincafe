# 🚀 鈑金Cafe OAuth 新規設定ガイド

## 📋 **正しいSupabase OAuthフローの理解**

```
1. ユーザー → Google OAuth リクエスト
2. Google → Supabase OAuthエンドポイント (/auth/v1/callback)
3. Supabase → アプリケーションコールバック (/auth/callback)
```

---

## 🔧 **Step 1: Google OAuth Client ID 新規作成**

### Google Cloud Console
1. https://console.cloud.google.com/
2. APIs & Services → 認証情報
3. + 認証情報を作成 → OAuth 2.0 クライアントID
4. アプリケーションタイプ：ウェブアプリケーション
5. 名前：`bankincafe-oauth-v2`

### 設定値：
**承認済みの JavaScript 生成元:**
```
http://localhost:3000
https://bankincafe.apaf.me
```

**承認済みのリダイレクト URI:**
```
https://auwmmosfteomieyexkeh.supabase.co/auth/v1/callback
http://localhost:54321/auth/v1/callback
```

---

## 🔧 **Step 2: 環境変数更新**

新しいClient IDを `.env` に設定:
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=新しいクライアントID
```

---

## 🔧 **Step 3: Supabase Dashboard設定**

https://supabase.com/dashboard/project/auwmmosfteomieyexkeh

### Authentication → URL Configuration
**Site URL:**
```
https://bankincafe.apaf.me
```

**Redirect URLs (Allow List):**
```
http://localhost:3000/auth/callback
https://bankincafe.apaf.me/auth/callback
```

---

## 🔧 **Step 4: ローカル設定**

### supabase/config.toml の auth セクション
```toml
[auth]
site_url = "http://localhost:3000"
additional_redirect_urls = ["http://localhost:3000/auth/callback"]
```

---

## ✅ **期待される結果**

1. redirect_uri_mismatch エラーの完全解消
2. Google認証画面への正常遷移
3. 認証完了後の適切なコールバック処理

---

## 🎯 **トラブルシューティング**

この設定で動作しない場合：
1. ブラウザキャッシュクリア
2. 5-10分の設定反映待ち
3. シークレットモードでテスト

**この設定が正しいSupabase OAuthフローです！**