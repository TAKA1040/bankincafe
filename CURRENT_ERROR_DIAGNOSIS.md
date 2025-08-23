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

## 🎯 必要な設定修正

### Google Cloud Console
**OAuth 2.0 クライアントID**: `351623689886-v266i1gs0ctq4c1vsail0amacegocmpi`

**🚨 現在の設定エラーを修正**:
```
❌ 間違い: https://bankincafe.apaf.me/auth/v1/callback
✅ 正しい: https://bankincafe.apaf.me/auth/callback
```

**承認済みのリダイレクト URI** の正しい設定:
```
http://localhost:3000/auth/callback
https://bankincafe.apaf.me/auth/callback
https://bankin-b2fdzcnzj-takas-projects-ebc9ff02.vercel.app/auth/callback
```

**承認済みの JavaScript 生成元** の設定:
```
http://localhost:3000
https://bankincafe.apaf.me
https://bankin-b2fdzcnzj-takas-projects-ebc9ff02.vercel.app
```

### Supabase Authentication
**プロジェクト**: `auwmmosfteomieyexkeh.supabase.co`

**🚨 現在の本番設定エラー発見**:
```
❌ Site URL現在: http://bankincafe.apaf.me/  (httpで設定されている)
✅ Site URL正しい: https://bankincafe.apaf.me (httpsに修正必要)

❌ Redirect URL現在: /api/auth/callback/google (古いNextAuth設定)
✅ Redirect URL正しい: /auth/callback (Supabase Auth用)
```

**正しい Redirect URLs 設定**:
```
http://localhost:3000/auth/callback          ← ローカル開発用
https://bankincafe.apaf.me/auth/callback     ← 本番用（httpsのみ！）
```

**❌ 設定してはいけないURL:**
```
http://bankincafe.apaf.me/auth/callback      ← 削除必要（httpの本番URLは存在しない）
```

## ⚠️ 重要な注意点

1. **完全一致必須**: URLは文字レベルで完全に一致する必要があります
2. **保存の確認**: 設定変更後、必ず「保存」ボタンを押す
3. **反映時間**: Google側の反映には5-10分かかる場合があります
4. **ブラウザキャッシュ**: 設定後はブラウザキャッシュをクリア

## 🔧 解決手順

### ✅ 第1段階（完了）
1. Google Cloud Console で上記URIを追加 ✅
2. Supabase Dashboard で上記URLを設定
3. 両方の設定を保存
4. 10分待機
5. ブラウザキャッシュクリア
6. シークレットモードで再テスト

### 🚨 第2段階（設定済みなのにエラーが続く場合）

**原因候補:**
1. **Google設定の反映遅延** (最大30分かかる場合がある)
2. **ブラウザキャッシュ残存** (OAuth認証情報が古いまま)
3. **OAuth Client ID の混在** (複数のClient IDが存在する可能性)
4. **Supabase設定未修正** (まだ古いNextAuth設定のまま)

**追加対処法:**
1. **完全キャッシュクリア**:
   ```
   Ctrl+Shift+Delete → すべて選択 → すべて削除
   ```

2. **別ブラウザでテスト**:
   ```
   Chrome → Firefox / Edge で試行
   ```

3. **OAuth Client ID確認**:
   ```
   Google Cloud Console で複数のClient IDがないか確認
   正しいClient ID: 351623689886-v266i1gs0ctq4c1vsail0amacegocmpi
   ```

4. **Supabase URL Configuration確認**:
   ```
   Site URL: https://bankincafe.apaf.me (httpsで設定済みか確認)
   Redirect URLs: /auth/callback (NextAuthパスでないか確認)
   ```

5. **30分待機後再テスト**:
   ```
   Google OAuth設定は完全反映に時間がかかります
   ```

## 📋 設定確認済み項目

✅ Next.js アプリケーション設定
✅ Supabase クライアント設定
✅ OAuth フロー実装
✅ エラーハンドリング
✅ 本番環境デプロイ

🔴 **未完了**: 外部サービス設定（Google Cloud Console + Supabase Dashboard）

現在のエラーは、アプリケーション側の問題ではなく、外部サービスの設定が未完了のためです。