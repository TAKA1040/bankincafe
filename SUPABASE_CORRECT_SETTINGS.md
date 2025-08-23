# ✅ Supabase正しい設定ガイド

## 🎯 Supabase Dashboard設定（修正版）

### プロジェクト
- **プロジェクト名**: bankincafe
- **プロジェクトID**: auwmmosfteomieyexkeh
- **URL**: https://supabase.com/dashboard/project/auwmmosfteomieyexkeh

---

## 🔧 Authentication → URL Configuration

### 1. Site URL
```
https://bankincafe.apaf.me
```
**注意**: 末尾の `/` は付けない、`https` を使用

### 2. Redirect URLs (Allow List)
**正しい設定（この2つのみ）:**
```
http://localhost:3000/auth/callback
https://bankincafe.apaf.me/auth/callback
```

**❌ 削除が必要な間違った設定:**
- ~~`http://bankincafe.apaf.me/auth/callback`~~ ← httpの本番URL（削除）
- ~~`/api/auth/callback/google`~~ ← 古いNextAuth設定（削除）
- ~~その他の古い設定~~ ← すべて削除

---

## 🚨 重要なポイント

### なぜ `http://bankincafe.apaf.me` はダメなのか？
1. **存在しないURL**: 本番環境は常にhttpsにリダイレクトされる
2. **セキュリティ**: OAuthコールバックでhttpは使用しない
3. **Google OAuth**: httpsのリダイレクトURLのみ受け入れる

### 正しい理解
- **ローカル開発**: `http://localhost:3000` (httpでOK)
- **本番環境**: `https://bankincafe.apaf.me` (httpsのみ)

---

## 📝 設定手順

### Supabase Dashboardで
1. https://supabase.com/dashboard/project/auwmmosfteomieyexkeh
2. 左メニュー → **Authentication**
3. **URL Configuration** タブ
4. **Site URL** を `https://bankincafe.apaf.me` に設定
5. **Redirect URLs** を以下の2つのみに設定:
   - `http://localhost:3000/auth/callback`
   - `https://bankincafe.apaf.me/auth/callback`
6. 他のRedirect URLsはすべて削除
7. **Save** をクリック

---

## ✅ 設定完了後の確認

設定後、以下でテスト:
1. ブラウザキャッシュクリア
2. https://bankincafe.apaf.me/login でログインテスト
3. Google認証画面が正常に表示されることを確認

この設定により、redirect_uri_mismatchエラーが解決されるはずです。