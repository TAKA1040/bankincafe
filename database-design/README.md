# データベース設計書 - 作業入力ツール

## 📁 ファイル構成

このフォルダには、bankincafeシステムの新しいSupabaseベースデータベース設計に関する全ての資料が含まれています。

### 📋 設計書類

| ファイル名 | 説明 | 用途 |
|-----------|------|------|
| **`SCHEMA.md`** | メイン設計書 | データベース構造・ER図・制約の詳細 |
| **`ddl.sql`** | DDLスクリプト | テーブル作成・インデックス・制約・RLS設定 |
| **`views.sql`** | ビュー定義 | アプリケーション用の12のビュー |
| **`README-IMPORT-NEXT.md`** | 移行計画書 | 既存データからの移行手順 |
| **`LEGACY-MAPPING.md`** | マッピング分析 | 現行システムとの対応関係 |

### 🚀 利用手順

#### 1. 設計確認
```bash
# メイン設計書を確認
cat SCHEMA.md
```

#### 2. データベース構築
```bash
# Supabaseプロジェクトでの実行
psql -h your-supabase-host -p 5432 -d postgres -f ddl.sql
psql -h your-supabase-host -p 5432 -d postgres -f views.sql
```

#### 3. データ移行準備
```bash
# 移行計画を確認
cat README-IMPORT-NEXT.md
# 現行システム分析を確認  
cat LEGACY-MAPPING.md
```

### 🎯 主要な設計ポイント

- **拡張性**: jsonb + EAV による柔軟な項目追加
- **正規化**: 作業名の表記ゆれ対策（task_master + task_aliases）
- **セキュリティ**: RLS による完全なユーザー分離
- **パフォーマンス**: 検索・集計用の最適化されたインデックス
- **運用性**: アプリケーション安定化のためのビュー層

### 📊 ER図概要（データの流れ）

```
users (ログインユーザー)
  ↓
invoices (請求書ヘッダー) → line_items (作業明細) → set_details (セットの中身)
  ↓                           ↓
task_master (作業名正規表記) → task_aliases (作業名の別表記)
  ↓
line_item_attrs (将来のカスタム項目)
```

**データの関係性**:
- 1枚の請求書に複数の作業項目がつく
- セット作業は内訳として複数の詳細項目を持つ
- 作業名は正規表記と別表記で管理し、表記ゆれを吸収

### ⚠️ 実装時の注意点

1. **RLS設定**: 必ず `owner_id = auth.uid()` でユーザー分離
2. **インデックス**: 大量データでのパフォーマンス確保
3. **正規化関数**: `normalize_simple()` の言語特性調整
4. **移行検証**: データ整合性の徹底チェック

### 📦 実装例・使用例

**請求書一覧表示の実装**:
```sql
-- 請求書一覧ページ用
SELECT * FROM v_invoices_stable 
WHERE billing_date >= '2024-01-01' 
ORDER BY created_at DESC;
```

**作業名サジェストの実装**:
```sql
-- 「Web」と入力した時のサジェスト候補
SELECT display_name, default_price 
FROM v_task_suggestions 
WHERE search_name LIKE normalize_simple('Web') || '%' 
LIMIT 10;
```

**月別売上グラフの実装**:
```sql
-- 2024年の月別売上データ
SELECT invoice_month, total_amount, confirmed_sales
FROM v_sales_summary_by_month 
WHERE invoice_year = 2024
ORDER BY invoice_month;
```

### 🔄 更新履歴

- `2024-08-27`: 初回設計書作成、用途説明追加
- 今後の変更はこのREADMEで管理

---

**問い合わせ**: 設計に関する質問や変更要望は開発チームまで