# データ移行計画書 - 将来の実装ガイド

## 概要

本ドキュメントは、現在のlocalStorageベースのbankincafeシステムから、新しいSupabase（PostgreSQL）ベースのシステムへの移行手順を記載します。今回は設計段階のため実際の移行は行いませんが、将来の移行時に参考となる手順とチェックポイントを整理しています。

## 前提条件

- **既存システム**: localStorage + Next.js（クライアントサイド）
- **移行先システム**: Supabase + PostgreSQL（サーバーサイド）  
- **データ整合性**: 既存データは参考程度で、完全な移行よりも新システムでの運用開始を重視
- **ダウンタイム**: 最小限に抑制（段階的移行）

## 移行戦略の概要

### Phase 1: インフラ準備
- 新データベース構築
- テストデータでの動作確認
- 基本機能の実装・テスト

### Phase 2: データ移行準備
- 既存データのエクスポート
- データクレンジング
- ステージング環境での検証

### Phase 3: 段階的移行
- パラレル運用期間
- データ同期・検証
- 本格稼働

## 詳細移行手順

### 1. 事前準備

#### 1.1 現状データの棚卸し

```javascript
// localStorage からの全データ抽出
const existingData = {
    invoices: JSON.parse(localStorage.getItem('bankin_invoices') || '[]'),
    workHistory: JSON.parse(localStorage.getItem('bankin_work_history') || '[]'),
    customerCategories: JSON.parse(localStorage.getItem('bankin_customer_categories') || '[]')
};

console.log('Existing data inventory:', {
    invoiceCount: existingData.invoices.length,
    workHistoryCount: existingData.workHistory.length,
    customerCategoryCount: existingData.customerCategories.length
});
```

#### 1.2 Supabaseプロジェクト準備

```bash
# Supabase CLI インストール・セットアップ
npm install -g @supabase/cli
supabase init
supabase start

# DDL実行
psql -h localhost -p 54322 -d postgres -U postgres -f ddl.sql

# ビュー作成
psql -h localhost -p 54322 -d postgres -U postgres -f views.sql
```

### 2. ステージングテーブル構築

#### 2.1 ステージングテーブル定義

```sql
-- 既存データ取り込み用のステージングテーブル
CREATE SCHEMA staging;

-- 旧請求書データ用ステージング
CREATE TABLE staging.old_invoices (
    raw_data jsonb NOT NULL,
    processed_at timestamp with time zone DEFAULT now(),
    processing_status text DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processed', 'error')),
    error_message text,
    mapped_invoice_id uuid REFERENCES invoices(id)
);

-- 旧作業履歴データ用ステージング  
CREATE TABLE staging.old_work_history (
    raw_data jsonb NOT NULL,
    processed_at timestamp with time zone DEFAULT now(),
    processing_status text DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processed', 'error')),
    error_message text,
    mapped_task_master_id uuid REFERENCES task_master(id)
);

-- 顧客カテゴリー用ステージング
CREATE TABLE staging.old_customer_categories (
    raw_data jsonb NOT NULL,
    processed_at timestamp with time zone DEFAULT now(),
    processing_status text DEFAULT 'pending',
    category_mapping jsonb  -- 旧ID -> 新システムでの扱い
);
```

#### 2.2 フィールドマッピング定義

```sql
-- フィールド対応表の作成
CREATE TABLE staging.field_mapping (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name text NOT NULL,
    old_field text NOT NULL,
    new_field text NOT NULL,
    transformation_rule text, -- 変換ルール（関数名など）
    is_required boolean DEFAULT false,
    default_value text,
    notes text
);

-- 基本マッピングの挿入
INSERT INTO staging.field_mapping (table_name, old_field, new_field, transformation_rule, is_required) VALUES
-- invoices マッピング
('invoices', 'invoice_year', 'invoice_year', 'direct', true),
('invoices', 'invoice_month', 'invoice_month', 'direct', true),
('invoices', 'billing_date', 'billing_date', 'date_iso_conversion', true),
('invoices', 'customer_category', 'customer_category', 'category_id_to_name', true),
('invoices', 'customer_name', 'customer_name', 'direct', true),
('invoices', 'subject', 'subject', 'direct', true),
('invoices', 'work_items', 'line_items', 'work_items_expansion', true),

-- line_items マッピング  
('line_items', 'work_name', 'work_name', 'direct', true),
('line_items', 'unit_price', 'unit_price', 'direct', true),
('line_items', 'quantity', 'quantity', 'direct', true),
('line_items', 'amount', 'amount', 'direct', true),
('line_items', 'type', 'item_type', 'type_name_mapping', true),
('line_items', 'set_details', 'set_details', 'array_to_related_table', false);
```

### 3. データ変換・投入処理

#### 3.1 データ変換関数

```sql
-- 旧データ変換用の関数群

-- 日付変換関数
CREATE OR REPLACE FUNCTION staging.convert_date(date_str text)
RETURNS date AS $$
BEGIN
    -- 様々な日付形式に対応
    BEGIN
        RETURN date_str::date;
    EXCEPTION WHEN OTHERS THEN
        -- ISO形式から日付部分を抽出
        BEGIN
            RETURN (date_str::timestamp)::date;
        EXCEPTION WHEN OTHERS THEN
            RETURN NULL;
        END;
    END;
END;
$$ LANGUAGE plpgsql;

-- カテゴリー変換関数
CREATE OR REPLACE FUNCTION staging.convert_customer_category(old_category text)
RETURNS text AS $$
BEGIN
    CASE old_category
        WHEN 'ud' THEN RETURN 'UD';
        WHEN 'other' THEN RETURN 'その他';
        ELSE RETURN old_category;
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- 作業項目展開関数
CREATE OR REPLACE FUNCTION staging.process_work_items(
    p_invoice_id uuid,
    p_owner_id uuid, 
    p_work_items jsonb
)
RETURNS void AS $$
DECLARE
    work_item jsonb;
    new_line_item_id uuid;
    set_detail jsonb;
BEGIN
    FOR work_item IN SELECT jsonb_array_elements(p_work_items)
    LOOP
        -- line_items レコード作成
        INSERT INTO line_items (
            invoice_id, owner_id, item_type, work_name, normalized_work_name,
            unit_price, quantity, amount, memo
        ) VALUES (
            p_invoice_id,
            p_owner_id,
            CASE WHEN (work_item->>'type') = 'set' THEN 'set' ELSE 'individual' END,
            work_item->>'work_name',
            normalize_simple(work_item->>'work_name'),
            (work_item->>'unit_price')::integer,
            (work_item->>'quantity')::integer,
            (work_item->>'amount')::integer,
            work_item->>'memo'
        ) RETURNING id INTO new_line_item_id;
        
        -- セット詳細の処理
        IF work_item->>'type' = 'set' AND work_item->'set_details' IS NOT NULL THEN
            FOR set_detail IN SELECT jsonb_array_elements_text(work_item->'set_details')
            LOOP
                INSERT INTO set_details (line_item_id, owner_id, detail_name, normalized_detail_name)
                VALUES (new_line_item_id, p_owner_id, set_detail::text, normalize_simple(set_detail::text));
            END LOOP;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
```

#### 3.2 メイン変換処理

```sql
-- 請求書データの変換・投入処理
CREATE OR REPLACE FUNCTION staging.import_invoices(p_owner_id uuid)
RETURNS TABLE(processed_count integer, error_count integer) AS $$
DECLARE
    old_invoice record;
    new_invoice_id uuid;
    error_msg text;
    processed_count integer := 0;
    error_count integer := 0;
BEGIN
    FOR old_invoice IN 
        SELECT * FROM staging.old_invoices WHERE processing_status = 'pending'
    LOOP
        BEGIN
            -- invoices レコードの作成
            INSERT INTO invoices (
                owner_id, invoice_year, invoice_month, billing_date,
                customer_category, customer_name, subject,
                registration_number, order_number, internal_order_number,
                memo, status, created_at
            ) VALUES (
                p_owner_id,
                (old_invoice.raw_data->>'invoice_year')::integer,
                (old_invoice.raw_data->>'invoice_month')::integer,
                staging.convert_date(old_invoice.raw_data->>'billing_date'),
                staging.convert_customer_category(old_invoice.raw_data->>'customer_category'),
                old_invoice.raw_data->>'customer_name',
                old_invoice.raw_data->>'subject',
                old_invoice.raw_data->>'registration_number',
                old_invoice.raw_data->>'order_number',
                old_invoice.raw_data->>'internal_order_number',
                old_invoice.raw_data->>'memo',
                COALESCE(old_invoice.raw_data->>'status', 'draft'),
                COALESCE(
                    (old_invoice.raw_data->>'created_at')::timestamp with time zone,
                    now()
                )
            ) RETURNING id INTO new_invoice_id;
            
            -- 作業項目の処理
            PERFORM staging.process_work_items(
                new_invoice_id, 
                p_owner_id, 
                old_invoice.raw_data->'work_items'
            );
            
            -- ステージングテーブル更新
            UPDATE staging.old_invoices 
            SET processing_status = 'processed',
                mapped_invoice_id = new_invoice_id
            WHERE id = old_invoice.id;
            
            processed_count := processed_count + 1;
            
        EXCEPTION WHEN OTHERS THEN
            GET STACKED DIAGNOSTICS error_msg = MESSAGE_TEXT;
            
            UPDATE staging.old_invoices 
            SET processing_status = 'error',
                error_message = error_msg
            WHERE id = old_invoice.id;
            
            error_count := error_count + 1;
        END;
    END LOOP;
    
    RETURN QUERY SELECT processed_count, error_count;
END;
$$ LANGUAGE plpgsql;
```

### 4. データ検証・整合性チェック

#### 4.1 検証用クエリ

```sql
-- データ移行後の検証クエリ集

-- 1. レコード数比較
WITH old_counts AS (
    SELECT 
        COUNT(*) as old_invoice_count,
        SUM(jsonb_array_length(raw_data->'work_items')) as old_work_item_count
    FROM staging.old_invoices
    WHERE processing_status = 'processed'
),
new_counts AS (
    SELECT 
        COUNT(DISTINCT i.id) as new_invoice_count,
        COUNT(li.id) as new_line_item_count
    FROM invoices i
    LEFT JOIN line_items li ON i.id = li.invoice_id
    WHERE i.owner_id = auth.uid()
)
SELECT 
    old_counts.old_invoice_count,
    new_counts.new_invoice_count,
    old_counts.old_work_item_count,
    new_counts.new_line_item_count,
    CASE WHEN old_counts.old_invoice_count = new_counts.new_invoice_count 
         THEN '✓ OK' ELSE '✗ NG' END as invoice_count_check,
    CASE WHEN old_counts.old_work_item_count = new_counts.new_line_item_count 
         THEN '✓ OK' ELSE '✗ NG' END as work_item_count_check
FROM old_counts, new_counts;

-- 2. 金額整合性チェック
SELECT 
    'Total Amount Check' as check_name,
    COUNT(*) as invoice_count,
    COUNT(CASE WHEN ABS(
        (raw_data->>'total_amount')::integer - total_amount
    ) > 1 THEN 1 END) as amount_mismatch_count
FROM staging.old_invoices oi
JOIN invoices i ON oi.mapped_invoice_id = i.id
WHERE oi.processing_status = 'processed';

-- 3. セット詳細整合性チェック  
SELECT 
    li.work_name,
    COUNT(sd.id) as set_detail_count,
    jsonb_array_length(
        (SELECT raw_data->'work_items'->0->'set_details' 
         FROM staging.old_invoices oi 
         WHERE oi.mapped_invoice_id = li.invoice_id)
    ) as original_detail_count
FROM line_items li
LEFT JOIN set_details sd ON li.id = sd.line_item_id
WHERE li.item_type = 'set'
GROUP BY li.id, li.work_name;
```

#### 4.2 エラー分析・対応

```sql
-- エラー分析用クエリ
SELECT 
    processing_status,
    COUNT(*) as count,
    array_agg(DISTINCT error_message) as error_messages
FROM staging.old_invoices
GROUP BY processing_status;

-- エラー詳細の確認
SELECT 
    raw_data->>'customer_name' as customer_name,
    raw_data->>'billing_date' as billing_date,
    error_message
FROM staging.old_invoices
WHERE processing_status = 'error'
ORDER BY processed_at DESC;
```

### 5. ロールバック手順

#### 5.1 ロールバック用バックアップ

```sql
-- ロールバック用のバックアップテーブル作成
CREATE SCHEMA backup_$(date +%Y%m%d);

CREATE TABLE backup_$(date +%Y%m%d).invoices AS SELECT * FROM invoices WHERE owner_id = $1;
CREATE TABLE backup_$(date +%Y%m%d).line_items AS SELECT * FROM line_items WHERE owner_id = $1;
CREATE TABLE backup_$(date +%Y%m%d).set_details AS SELECT * FROM set_details WHERE owner_id = $1;
CREATE TABLE backup_$(date +%Y%m%d).task_master AS SELECT * FROM task_master WHERE owner_id = $1;
CREATE TABLE backup_$(date +%Y%m%d).task_aliases AS SELECT * FROM task_aliases WHERE owner_id = $1;
```

#### 5.2 ロールバック実行

```sql
-- データのクリア（指定ユーザーのみ）
DELETE FROM set_details WHERE owner_id = $1;
DELETE FROM line_items WHERE owner_id = $1;  
DELETE FROM invoices WHERE owner_id = $1;
DELETE FROM task_aliases WHERE owner_id = $1;
DELETE FROM task_master WHERE owner_id = $1;

-- バックアップからの復旧
INSERT INTO invoices SELECT * FROM backup_$(date +%Y%m%d).invoices;
INSERT INTO line_items SELECT * FROM backup_$(date +%Y%m%d).line_items;
INSERT INTO set_details SELECT * FROM backup_$(date +%Y%m%d).set_details;
INSERT INTO task_master SELECT * FROM backup_$(date +%Y%m%d).task_master;
INSERT INTO task_aliases SELECT * FROM backup_$(date +%Y%m%d).task_aliases;
```

### 6. パラレル運用期間

#### 6.1 データ同期スクリプト

```javascript
// 旧システム -> 新システム 定期同期スクリプト
async function syncToNewSystem() {
    const oldData = {
        invoices: JSON.parse(localStorage.getItem('bankin_invoices') || '[]'),
        lastSync: localStorage.getItem('lastSyncTimestamp')
    };
    
    // 最終同期以降の変更を検出
    const changedInvoices = oldData.invoices.filter(invoice => 
        !oldData.lastSync || new Date(invoice.updated_at) > new Date(oldData.lastSync)
    );
    
    if (changedInvoices.length > 0) {
        // Supabase へのデータ送信
        const { data, error } = await supabase
            .from('invoices')
            .upsert(changedInvoices.map(transformToNewFormat));
            
        if (!error) {
            localStorage.setItem('lastSyncTimestamp', new Date().toISOString());
            console.log(`${changedInvoices.length} invoices synced`);
        }
    }
}

// 定期実行設定
setInterval(syncToNewSystem, 5 * 60 * 1000); // 5分ごと
```

#### 6.2 整合性監視

```sql
-- 同期状況の監視用ビュー
CREATE VIEW sync_status AS
WITH sync_summary AS (
    SELECT 
        COUNT(*) as total_new_invoices,
        COUNT(CASE WHEN created_at > CURRENT_DATE - INTERVAL '1 day' THEN 1 END) as recent_invoices,
        MAX(created_at) as last_invoice_created,
        AVG(total_amount) as avg_amount
    FROM invoices 
    WHERE owner_id = auth.uid()
)
SELECT 
    ss.*,
    CASE 
        WHEN ss.last_invoice_created > CURRENT_TIMESTAMP - INTERVAL '1 hour' 
        THEN 'ACTIVE' 
        ELSE 'INACTIVE' 
    END as sync_status,
    CURRENT_TIMESTAMP as check_time
FROM sync_summary ss;
```

### 7. 本格稼働移行

#### 7.1 切り替え手順

```bash
#!/bin/bash
# 本格切り替えスクリプト

echo "=== 本格稼働移行開始 ==="

# 1. 最終データ同期
echo "最終データ同期実行中..."
psql -h $SUPABASE_HOST -p $SUPABASE_PORT -d $SUPABASE_DB \
     -c "SELECT staging.import_invoices('$USER_ID');"

# 2. データ整合性チェック
echo "データ整合性チェック実行中..."
VALIDATION_RESULT=$(psql -h $SUPABASE_HOST -p $SUPABASE_PORT -d $SUPABASE_DB \
     -t -c "SELECT COUNT(*) FROM invoices WHERE owner_id = '$USER_ID';")

echo "移行されたレコード数: $VALIDATION_RESULT"

# 3. 旧データのバックアップ
echo "旧データバックアップ作成中..."
node -e "
    const fs = require('fs');
    const backup = {
        invoices: JSON.parse(localStorage.getItem('bankin_invoices') || '[]'),
        workHistory: JSON.parse(localStorage.getItem('bankin_work_history') || '[]'),
        customerCategories: JSON.parse(localStorage.getItem('bankin_customer_categories') || '[]'),
        backupDate: new Date().toISOString()
    };
    fs.writeFileSync('localstorage_backup_$(date +%Y%m%d).json', JSON.stringify(backup, null, 2));
    console.log('バックアップ完了: localstorage_backup_$(date +%Y%m%d).json');
"

# 4. フロントエンド設定の切り替え
echo "フロントエンド設定切り替え中..."
sed -i 's/USE_LOCALSTORAGE=true/USE_LOCALSTORAGE=false/g' .env.local
echo "SUPABASE_URL=$SUPABASE_URL" >> .env.local  
echo "SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY" >> .env.local

# 5. アプリケーション再起動
echo "アプリケーション再起動中..."
npm run build
pm2 restart bankincafe

echo "=== 本格稼働移行完了 ==="
```

#### 7.2 移行後の監視

```sql
-- 移行後監視用のアラートクエリ
WITH performance_check AS (
    SELECT 
        COUNT(*) as total_invoices,
        COUNT(CASE WHEN created_at > CURRENT_DATE THEN 1 END) as today_invoices,
        AVG(EXTRACT(EPOCH FROM (updated_at - created_at))) as avg_processing_time,
        COUNT(CASE WHEN status = 'error' THEN 1 END) as error_count
    FROM invoices 
    WHERE owner_id = auth.uid()
)
SELECT 
    pc.*,
    CASE WHEN pc.error_count > 0 THEN '⚠️ ERRORS DETECTED' 
         WHEN pc.avg_processing_time > 10 THEN '⚠️ SLOW PROCESSING'
         ELSE '✅ OK' END as status
FROM performance_check pc;
```

## チェックリスト

### 移行前チェックリスト

- [ ] **環境準備**
  - [ ] Supabase プロジェクト作成済み
  - [ ] DDL実行完了（テーブル・インデックス・制約）
  - [ ] Views実行完了（アプリケーション用ビュー）
  - [ ] RLSポリシー設定完了
  - [ ] 認証設定（auth.users テーブル準備）

- [ ] **データ準備**  
  - [ ] 既存データのエクスポート完了
  - [ ] ステージングテーブル作成済み
  - [ ] フィールドマッピング定義済み
  - [ ] データ変換関数テスト済み

- [ ] **テスト準備**
  - [ ] テストデータでの変換処理確認済み
  - [ ] バックアップ・ロールバック手順テスト済み
  - [ ] パフォーマンステスト完了

### 移行中チェックリスト

- [ ] **データ移行**
  - [ ] ステージングデータ投入完了
  - [ ] データ変換処理実行完了  
  - [ ] エラー件数確認（許容範囲内）
  - [ ] データ整合性チェック完了

- [ ] **検証**
  - [ ] レコード数一致確認
  - [ ] 金額計算一致確認  
  - [ ] セット詳細展開確認
  - [ ] 顧客カテゴリーマッピング確認

### 移行後チェックリスト

- [ ] **機能確認**
  - [ ] 請求書一覧表示確認
  - [ ] 請求書作成機能確認
  - [ ] 作業履歴検索確認
  - [ ] サジェスト機能確認
  - [ ] CSV出力確認

- [ ] **パフォーマンス**
  - [ ] 応答時間測定（目標: 2秒以内）
  - [ ] 同時アクセステスト
  - [ ] メモリ・CPU使用率確認

- [ ] **運用準備**
  - [ ] バックアップスケジュール設定
  - [ ] 監視・アラート設定  
  - [ ] ドキュメント更新
  - [ ] ユーザートレーニング実施

## 注意事項・推奨事項

### 重要な注意事項

1. **データバックアップの重要性**
   - 移行前に必ず既存データの完全バックアップを取得
   - 複数世代のバックアップを保持（最低1週間分）

2. **段階的移行の推奨**  
   - いきなり全機能を切り替えず、段階的に移行
   - パラレル運用期間を設けて安全性を確保

3. **ユーザー体験の維持**
   - 移行中もサービス継続を最優先
   - パフォーマンス低下を最小限に抑制

### 推奨事項

1. **事前テスト**
   - 本番と同様のデータ量でのテスト実施
   - 複数のブラウザ・デバイスでの動作確認

2. **監視体制**
   - 移行後1週間は24時間監視体制
   - 異常検知時の迅速な対応体制構築

3. **ドキュメント整備**
   - トラブルシューティングガイド作成
   - FAQ・よくある質問集の準備

## 付録

### A. エラー対応マニュアル

#### よくあるエラーと対処法

```sql
-- ERROR: duplicate key value violates unique constraint
-- 対処: 重複データの確認・除去
SELECT owner_id, normalized_name, COUNT(*)
FROM task_master 
GROUP BY owner_id, normalized_name 
HAVING COUNT(*) > 1;

-- ERROR: invalid input syntax for type integer
-- 対処: 数値型変換エラーの確認
SELECT raw_data->>'unit_price' as original_value
FROM staging.old_invoices 
WHERE (raw_data->>'unit_price') !~ '^[0-9]+$';
```

#### パフォーマンスチューニング

```sql
-- インデックス使用状況の確認
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- クエリ実行計画の確認  
EXPLAIN ANALYZE 
SELECT * FROM v_work_price_history 
WHERE normalized_work_name LIKE 'web%';
```

### B. 緊急時連絡先・手順

```bash
# 緊急時ロールバック（ワンライナー）
psql -h $SUPABASE_HOST -c "
    DELETE FROM line_items WHERE owner_id = '$USER_ID';
    DELETE FROM invoices WHERE owner_id = '$USER_ID';
    -- バックアップからの復元処理
"

# サービス停止（メンテナンスモード）
echo "MAINTENANCE_MODE=true" >> .env.local && pm2 restart bankincafe
```

---

このドキュメントは将来の移行時に参照・更新してください。
実際の移行時には、最新のデータ状況と要件に応じて手順の調整が必要になる場合があります。