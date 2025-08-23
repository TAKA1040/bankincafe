# 🔍 Supabase設定分析結果

## 📋 リンク後に発見された設定差分

### ❌ 現在の本番Supabase設定（修正が必要）

**Site URL:**
```
http://bankincafe.apaf.me/  # ← https が抜けている！
```

**Additional Redirect URLs:**
```
http://localhost:3000/api/auth/callback/google  # ← 古いNextAuth設定のまま
http://bankincafe.apaf.me/api/auth/callback/google  # ← 古いNextAuth設定のまま
```

### ✅ 必要な正しい設定

**Site URL:**
```
https://bankincafe.apaf.me  # ← https に修正必要
```

**Additional Redirect URLs:**
```
http://localhost:3000/auth/callback              # ← Supabase Auth用
https://bankincafe.apaf.me/auth/callback         # ← Supabase Auth用
http://127.0.0.1:3000/auth/callback             # ← ローカル開発用
```

## 🚨 設定エラーの原因分析

1. **プロトコル不一致**: `http` vs `https`
2. **パス不一致**: `/api/auth/callback/google` (NextAuth) vs `/auth/callback` (Supabase Auth)
3. **古い設定が残存**: 以前のNextAuth設定がSupabase Dashboardに残っている

## 🔧 修正手順

### Supabase Dashboard での設定修正
1. https://supabase.com/dashboard/project/auwmmosfteomieyexkeh
2. Authentication → URL Configuration
3. 以下に変更:

**Site URL:**
```
https://bankincafe.apaf.me
```

**Redirect URLs (Allow List):**
```
http://localhost:3000/auth/callback
https://bankincafe.apaf.me/auth/callback
http://127.0.0.1:3000/auth/callback
```

## 📝 Google Cloud Console設定との対応

**Google OAuth設定** ↔️ **Supabase設定**
```
Google承認済みリダイレクトURI     Supabase Redirect URLs
http://localhost:3000/auth/callback    ↔️    http://localhost:3000/auth/callback    ✅
https://bankincafe.apaf.me/auth/callback ↔️   https://bankincafe.apaf.me/auth/callback ✅
```

両方の設定が完全に一致する必要があります。

## 🎯 管理者ユーザーについて

ユーザーテーブルの確認はDocker Desktopが必要ですが、アプリケーション側で以下の管理者判定を実装済み:

```typescript
const isAdmin = user.email === 'dash201206@gmail.com'
```

認証が成功すれば、dash201206@gmail.com のユーザーは自動的に「管理者」として表示されます。