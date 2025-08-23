# 鈑金Cafe

Next.js 15 + Supabase Auth を使用したGoogle OAuth認証システム

## 🚀 機能

- ✅ Google OAuth認証 (Supabase Auth)
- ✅ 管理者判定 (dash201206@gmail.com)
- ✅ セッション管理
- ✅ レスポンシブデザイン

## 🔧 開発

```bash
npm install
npm run dev
```

## 🔗 本番URL
- https://bankincafe.apaf.me

## 📋 OAuth設定

### Google Cloud Console
- 承認済みのリダイレクト URI: `https://auwmmosfteomieyexkeh.supabase.co/auth/v1/callback`

### Supabase Dashboard  
- Site URL: `https://bankincafe.apaf.me`
- Redirect URLs: `https://bankincafe.apaf.me/auth/callback`