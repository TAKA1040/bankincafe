# 🚀 実データ辞書のSupabase投入手順

## 📋 手動実行ステップ

### 1. Supabaseダッシュボードにアクセス
1. https://supabase.com/dashboard にログイン
2. bankincafe プロジェクトを選択
3. 左メニューから「SQL Editor」をクリック

### 2. 実データ辞書SQLを実行
**実行するファイル:** `C:\Windsurf\bankincafe\supabase\update_real_dictionary.sql`

**手順:**
1. SQL Editorの「New Query」をクリック
2. SQLファイルの内容をコピー&ペースト
3. 「Run」ボタンをクリック
4. 実行結果を確認

### 3. 実行されるSQL内容

#### 🎯 Targets (対象マスター) - 20カテゴリ
- フェンダー
- バンパー  
- ドア
- ハンドル
- タンク
- ランプ
- ステー
- ガード
- パイプ
- カバー
- シート
- 鋼板
- 反射板
- ガラス
- ゴム
- キャッチ
- グリル
- ミラー
- レール
- メンバー

#### ⚡ Actions (動作マスター) - 10カテゴリ
- 交換
- 脱着
- 溶接
- 切断
- 製作
- 修理
- 塗装
- 加工
- 張替
- 打替

#### 📍 Positions (位置マスター) - 9カテゴリ
- 左
- 右
- 前
- 後
- 上
- 下
- 内
- 外
- 中央

### 4. 実行後の確認

実行が完了したら、以下のクエリで結果を確認：

```sql
-- レコード数の確認
SELECT 'targets' as table_name, COUNT(*) as record_count FROM targets
UNION ALL
SELECT 'actions' as table_name, COUNT(*) as record_count FROM actions  
UNION ALL
SELECT 'positions' as table_name, COUNT(*) as record_count FROM positions;

-- データ内容の確認
SELECT * FROM targets ORDER BY name;
SELECT * FROM actions ORDER BY name;
SELECT * FROM positions ORDER BY name;
```

**期待される結果:**
- targets: 20件
- actions: 10件  
- positions: 9件

### 5. エラーが発生した場合

#### よくあるエラーと対処法

**エラー1: テーブルが存在しない**
```
relation "targets" does not exist
```
**対処:** 先にマイグレーションファイルを実行してテーブル作成

**エラー2: カラム不一致**
```
column "keywords" does not exist
```
**対処:** テーブル構造を確認し、必要に応じてALTER TABLE実行

**エラー3: 外部キー制約エラー**
**対処:** 関連データを先に削除してから実行

### 6. 次のステップ

辞書投入が完了したら：
1. **フロントエンド動作確認**
2. **作業分割機能のテスト**
3. **メインデータベース設計の検討**

---

## 📁 関連ファイル

- **SQLファイル:** `C:\Windsurf\bankincafe\supabase\update_real_dictionary.sql`
- **CSVファイル:** `C:\Windsurf\bankincafe\請求書システム画像\hondata\dictionary_import_unified.csv`
- **個別CSVファイル:** 
  - `targets_import.csv`
  - `actions_import.csv`  
  - `positions_import.csv`

---

## ✅ 完了チェックリスト

- [ ] Supabaseダッシュボードにログイン
- [ ] SQL Editorを開く
- [ ] update_real_dictionary.sql を実行
- [ ] 実行結果の確認（20件、10件、9件）
- [ ] データ内容の確認
- [ ] エラーがないことを確認
- [ ] 次のステップへ進む準備完了