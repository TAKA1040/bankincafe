# 🚨 必須設定手順 - 鈑金Cafe

## ❗ 重要: 以下の設定を完了するまでログインは動作しません

### 📋 現在の設定値

- **Google Client ID**: `351623689886-v266i1gs0ctq4c1vsail0amacegocmpi.apps.googleusercontent.com`
- **Supabase Project**: `auwmmosfteomieyexkeh.supabase.co`
- **本番URL**: `https://bankincafe.apaf.me`
- **ローカル**: `http://localhost:3000`

---

## 🔧 1. Google Cloud Console設定

### 手順:
1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 「APIs & Services」 → 「認証情報」
3. OAuth 2.0 クライアントID: `351623689886-v266i1gs0ctq4c1vsail0amacegocmpi` を選択
4. **「承認済みのリダイレクト URI」**に以下を**完全一致**で追加:

```
https://bankincafe.apaf.me/auth/callback
http://localhost:3000/auth/callback
```

### ⚠️ 注意:
- URLは完全一致である必要があります
- `/`の有無も重要です
- `https`と`http`を間違えないでください

---

## 🔧 2. Supabase Authentication設定

### 手順:
1. [Supabase Dashboard](https://supabase.com/dashboard/projects) にアクセス
2. プロジェクト `auwmmosfteomieyexkeh` を選択
3. 「Authentication」 → 「URL Configuration」
4. 以下を設定:

**Site URL:**
```
https://bankincafe.apaf.me
```

**Redirect URLs (Allow List):**
```
https://bankincafe.apaf.me/auth/callback
http://localhost:3000/auth/callback
http://127.0.0.1:3000/auth/callback
```

---

## ✅ 3. 設定確認方法

### Google Cloud Console確認:
- OAuth 2.0 クライアント設定画面で承認済みURIが表示されているか確認

### Supabase確認:
- URL Configuration画面で設定値が保存されているか確認

---

## 🎯 4. テスト手順

### 設定完了後:
1. https://bankincafe.apaf.me/login にアクセス
2. 「Googleでログイン」をクリック
3. Google認証画面に遷移することを確認
4. dash201206@gmail.com でログイン
5. https://bankincafe.apaf.me に戻ってきて「管理者」表示を確認

---

## 🚨 トラブルシューティング

### ❌ 「アクセスをブロック: このアプリのリクエストは無効です (Error 400: redirect_uri_mismatch)」が出る場合:

**🔴 これは最も多いエラーです。以下を必ず確認してください:**

1. **Google Cloud Console の設定確認**:
   - [Google Cloud Console](https://console.cloud.google.com/) → 「APIs & Services」 → 「認証情報」
   - OAuth 2.0 クライアントID: `351623689886-v266i1gs0ctq4c1vsail0amacegocmpi` を選択
   - **「承認済みのリダイレクト URI」に以下が正確に入力されているか確認**:
     ```
     https://bankincafe.apaf.me/auth/callback
     http://localhost:3000/auth/callback
     ```
   - ⚠️ **重要**: URLは完全一致である必要があります（`/`の有無、`https`/`http`の違いも重要）

2. **設定の保存確認**:
   - 「保存」ボタンを押したか確認
   - 設定変更から5〜10分待つ（Googleの反映に時間がかかります）

3. **ブラウザキャッシュのクリア**:
   ```
   Ctrl+Shift+Delete → すべてのキャッシュとCookieを削除
   ```

4. **シークレット/プライベートモードで再テスト**

### その他のエラーが出る場合:
1. Supabase Dashboard の URL Configuration を確認
2. 設定変更後、10分程度待つ
3. ブラウザの開発者コンソールでエラー詳細を確認

---

## 📞 サポート

設定で困った場合、以下の情報を提供してください:
- どの手順で詰まったか
- ブラウザのコンソールエラー
- 実際に設定した値のスクリーンショット