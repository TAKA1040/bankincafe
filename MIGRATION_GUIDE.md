# 📋 スキーマ再設計マイグレーション実行ガイド

## 🎯 概要

DATABASE_SCHEMA.mdの最新設計に基づくデータベースマイグレーションとデータ移行の実行手順です。

## ⚠️ 重要な注意事項

- **システムの根幹に関わる変更です**
- **必ず順序通りに実行してください**  
- **各ステップ完了後に動作確認を行ってください**
- **問題が発生した場合は作業を中断し確認を求めてください**

## 📋 実行手順

### **Phase 1: データベースマイグレーション**

#### ステップ1: Supabaseの起動
```bash
supabase start
```

#### ステップ2: 新テーブル作成マイグレーション実行
```bash
supabase db push --include-all
```

**または手動実行:**
```bash
psql "postgresql://postgres:postgres@127.0.0.1:54322/postgres" -f supabase/migrations/20250905000001_schema_redesign_step1.sql
```

**✅ 確認ポイント:**
- work_item_positions テーブル作成済み
- invoice_payments テーブル作成済み  
- legacy_line_item_raws テーブル作成済み
- invoices テーブルに invoice_type, original_invoice_id 追加済み
- 全インデックスと外部キー制約設定済み

### **Phase 2: データ移行**

#### ステップ3: 位置データの移行
```bash
cd C:\Windsurf\bankincafe
python scripts\migrate_position_data.py
```

**✅ 確認ポイント:**
- CSVファイルの positions_all カラムからデータ抽出
- パイプ区切り（|）の位置情報を分解
- work_item_positions テーブルに正しく移行

#### ステップ4: 旧原文データの移行  
```bash
python scripts\migrate_legacy_raw_data.py
```

**✅ 確認ポイント:**
- task_type='fuzzy' の明細項目を特定
- raw_label を legacy_line_item_raws に移行
- データ整合性確認済み

#### ステップ5: カラム削除マイグレーション実行
```bash
psql "postgresql://postgres:postgres@127.0.0.1:54322/postgres" -f supabase/migrations/20250905000002_schema_redesign_step2.sql
```

**✅ 確認ポイント:**
- invoices テーブルから payment_date, partial_payment_amount 削除済み
- invoice_line_items_split テーブルから position 削除済み
- 緊急データ移行処理が完了（必要な場合のみ）

### **Phase 3: データ検証**

#### ステップ6: 移行結果の確認
```sql
-- 新テーブルのデータ確認
SELECT COUNT(*) FROM work_item_positions;
SELECT COUNT(*) FROM invoice_payments; 
SELECT COUNT(*) FROM legacy_line_item_raws;

-- テーブル構造確認
\d work_item_positions
\d invoice_payments
\d legacy_line_item_raws

-- サンプルデータ確認
SELECT * FROM work_item_positions LIMIT 5;
SELECT * FROM legacy_line_item_raws LIMIT 5;
```

## 🔧 トラブルシューティング

### **問題1: Docker Desktop未起動**
```bash
# Docker Desktop を起動してから実行
supabase start
```

### **問題2: 外部キー制約エラー**
```bash
# データ整合性を確認
SELECT * FROM invoice_line_items_split 
WHERE id NOT IN (SELECT DISTINCT split_item_id FROM work_item_positions);
```

### **問題3: CSVファイルが見つからない**
```bash
# ファイルパスを確認
ls -la "C:\Windsurf\bankincafe\請求書システム画像\hondata\work_items_split_v2_real_dict.csv"
```

### **問題4: マイグレーション失敗時のロールバック**
```bash
# 手動でテーブルを削除（開発環境のみ）
DROP TABLE IF EXISTS work_item_positions CASCADE;
DROP TABLE IF EXISTS invoice_payments CASCADE;
DROP TABLE IF EXISTS legacy_line_item_raws CASCADE;
```

## 📊 実行後の確認項目

### **✅ データベース構造確認**
- [ ] 新テーブル3つが正しく作成されている
- [ ] invoices テーブルの新カラムが追加されている
- [ ] 不要カラムが削除されている
- [ ] 全インデックスが作成されている
- [ ] 外部キー制約が設定されている

### **✅ データ移行確認**
- [ ] 位置データが正しく work_item_positions に移行
- [ ] 旧原文データが legacy_line_item_raws に移行
- [ ] データ件数が期待値と一致
- [ ] サンプルデータが正しく表示される

### **✅ システム動作確認**
- [ ] work-search ページが正常に表示される
- [ ] sales-management ページが正常に表示される
- [ ] エラーログにDB関連エラーがない

## 🚨 緊急時の対応

### **重大なエラーが発生した場合**
1. **すぐに作業を中断**
2. **エラーメッセージを記録**
3. **データベースの状態を確認**
4. **必要に応じてロールバック**
5. **確認を求める**

## 📝 実行記録テンプレート

```
### 実行日時: ____年__月__日 __:__

#### ステップ1: 新テーブル作成
- [ ] 実行完了
- [ ] 確認済み
- 備考: ________________

#### ステップ2: データ移行  
- [ ] 位置データ移行完了
- [ ] 旧原文データ移行完了
- [ ] 確認済み
- 備考: ________________

#### ステップ3: カラム削除
- [ ] 実行完了
- [ ] 確認済み
- 備考: ________________

### 最終確認
- [ ] 全てのフェーズが正常完了
- [ ] システム動作確認済み
- [ ] 問題なし

実行者: ________________
```

## 🔄 次のステップ

マイグレーション完了後、以下に進みます:
1. **アプリケーションコードの修正**
   - sales-management ページの修正
   - work-search ページの修正  
   - データ作成・更新処理の修正

2. **システム全体の動作確認**
3. **パフォーマンステスト**

**重要**: 各フェーズ完了後、必ず動作確認を行い、問題ないことを確認してから次に進んでください。