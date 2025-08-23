# 🚨 現在のエラー診断 - redirect_uri_mismatch

## エラー詳細
```
アクセスをブロック: このアプリのリクエストは無効です
dash201206@gmail.com
このアプリが無効なリクエストを送信したため、ログインできません。
エラー 400: redirect_uri_mismatch
```

## 🔍 原因分析

**redirect_uri_mismatch** エラーは、Google OAuth設定の承認済みリダイレクトURIと実際のリクエストURIが一致しないことが原因です。

## 🎯 必要な設定（未完了のため）

### Google Cloud Console
**OAuth 2.0 クライアントID**: `351623689886-v266i1gs0ctq4c1vsail0amacegocmpi`

**承認済みのリダイレクト URI** に以下を追加必須:
```
https://bankincafe.apaf.me/auth/callback
http://localhost:3000/auth/callback
```

### Supabase Authentication
**プロジェクト**: `auwmmosfteomieyexkeh.supabase.co`

**Site URL**:
```
https://bankincafe.apaf.me
```

**Redirect URLs**:
```
https://bankincafe.apaf.me/auth/callback
http://localhost:3000/auth/callback
http://127.0.0.1:3000/auth/callback
```

## ⚠️ 重要な注意点

1. **完全一致必須**: URLは文字レベルで完全に一致する必要があります
2. **保存の確認**: 設定変更後、必ず「保存」ボタンを押す
3. **反映時間**: Google側の反映には5-10分かかる場合があります
4. **ブラウザキャッシュ**: 設定後はブラウザキャッシュをクリア

## 🔧 解決手順

1. Google Cloud Console で上記URIを追加
2. Supabase Dashboard で上記URLを設定
3. 両方の設定を保存
4. 10分待機
5. ブラウザキャッシュクリア
6. シークレットモードで再テスト

## 📋 設定確認済み項目

✅ Next.js アプリケーション設定
✅ Supabase クライアント設定
✅ OAuth フロー実装
✅ エラーハンドリング
✅ 本番環境デプロイ

🔴 **未完了**: 外部サービス設定（Google Cloud Console + Supabase Dashboard）

現在のエラーは、アプリケーション側の問題ではなく、外部サービスの設定が未完了のためです。