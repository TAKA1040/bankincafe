# 旧システム → 新システム データマッピング分析

## 概要

現在のbankincafeシステム（localStorage + React）から新しいSupabaseベースシステムへのデータ構造マッピングを分析・整理します。

## 現行システムのデータ構造分析

### 1. 請求書データ (`bankin_invoices`)

```typescript
// 現在の InvoiceData インターフェース（invoice-create/page.tsx）
interface InvoiceData {
  invoice_year: number
  invoice_month: number
  billing_date: string
  customer_category: string  // 'ud' | 'other' | カスタムID
  customer_name: string
  subject: string
  registration_number: string
  order_number: string
  internal_order_number: string
  work_items: WorkItem[]
  subtotal: number
  tax_amount: number
  total_amount: number
  memo: string
}

// WorkItem の構造
interface WorkItem {
  id: number
  type: 'individual' | 'set'
  work_name: string
  unit_price: number
  quantity: number
  amount: number
  memo: string
  set_details?: string[]  // セット作業の場合のみ
}

// 実際のlocalStorage保存データ
interface SavedInvoice extends InvoiceData {
  id: number  // タイムスタンプベース
  created_at: string  // ISO文字列
  status: 'draft' | 'finalized'
}
```

### 2. 作業履歴データ (`bankin_work_history`)

```typescript
// 現在の WorkHistoryItem インターフェース
interface WorkHistoryItem {
  id: number
  work_name: string
  unit_price: number
  customer_name: string
  date: string  // ISO文字列
}

// デフォルトデータ例
const defaultData = [
  { id: 1, work_name: 'Webサイト制作', unit_price: 100000, customer_name: 'テクノロジー株式会社', date: '2024-01-15' },
  { id: 2, work_name: 'システム保守', unit_price: 50000, customer_name: 'サンプル商事株式会社B', date: '2024-02-10' },
  // ...
]
```

### 3. 顧客カテゴリーデータ (`bankin_customer_categories`)

```typescript
// 現在の CustomerCategory インターフェース
interface CustomerCategory {
  id: string
  name: string
  companyName: string
  isDefault?: boolean
}

// デフォルトデータ
const defaultCategories = [
  {
    id: 'ud',
    name: 'UD',
    companyName: '株式会社UDトラックス',
    isDefault: true
  },
  {
    id: 'other',
    name: 'その他',
    companyName: '',
    isDefault: true
  }
]
```

## 新旧システム対応表

### 1. invoices テーブル マッピング

| 旧フィールド | 旧データ型 | 新フィールド | 新データ型 | 変換ルール | 注意点 |
|------------|-----------|------------|-----------|-----------|--------|
| `id` | `number` | `id` | `uuid` | タイムスタンプ → UUID変換 | 連番表示は別途ビュー対応 |
| - | - | `owner_id` | `uuid` | 現在のユーザーID | 新規フィールド（RLS用） |
| `invoice_year` | `number` | `invoice_year` | `integer` | 直接コピー | - |
| `invoice_month` | `number` | `invoice_month` | `integer` | 直接コピー | - |
| `billing_date` | `string` | `billing_date` | `date` | ISO文字列 → date変換 | - |
| `customer_category` | `string` | `customer_category` | `text` | ID → 名前変換 | カテゴリーマスタ要参照 |
| `customer_name` | `string` | `customer_name` | `text` | 直接コピー | - |
| `subject` | `string` | `subject` | `text` | 直接コピー | - |
| `registration_number` | `string` | `registration_number` | `text` | 直接コピー | - |
| `order_number` | `string` | `order_number` | `text` | 直接コピー | - |
| `internal_order_number` | `string` | `internal_order_number` | `text` | 直接コピー | - |
| `subtotal` | `number` | `subtotal` | `integer` | 直接コピー | 自動再計算で検証 |
| `tax_amount` | `number` | `tax_amount` | `integer` | 直接コピー | 自動再計算で検証 |
| `total_amount` | `number` | `total_amount` | `integer` | 直接コピー | 自動再計算で検証 |
| `memo` | `string` | `memo` | `text` | 直接コピー | - |
| `status` | `'draft' \| 'finalized'` | `status` | `text` | 直接コピー | CHECKで拡張可能 |
| `created_at` | `string` | `created_at` | `timestamp with time zone` | ISO文字列 → timestamp変換 | - |
| - | - | `updated_at` | `timestamp with time zone` | created_atと同じ値で初期化 | 新規フィールド |

### 2. line_items テーブル マッピング

| 旧フィールド（WorkItem） | 旧データ型 | 新フィールド | 新データ型 | 変換ルール | 注意点 |
|---------------------|-----------|------------|-----------|-----------|--------|
| `id` | `number` | `id` | `uuid` | UUID新規生成 | 旧IDは使用しない |
| - | - | `invoice_id` | `uuid` | 親請求書のUUID | FK制約 |
| - | - | `owner_id` | `uuid` | 現在のユーザーID | RLS用 |
| `type` | `'individual' \| 'set'` | `item_type` | `text` | 直接コピー | CHECK制約で検証 |
| `work_name` | `string` | `work_name` | `text` | 直接コピー | - |
| - | - | `normalized_work_name` | `text` | normalize_simple()で生成 | 自動生成 |
| `unit_price` | `number` | `unit_price` | `integer` | 直接コピー | - |
| `quantity` | `number` | `quantity` | `integer` | 直接コピー | - |
| `amount` | `number` | `amount` | `integer` | 直接コピー | 自動検証 |
| `memo` | `string` | `memo` | `text` | 直接コピー | - |
| - | - | `extra` | `jsonb` | NULL | 将来拡張用 |
| - | - | `sort_order` | `integer` | 配列インデックス | 表示順序用 |

### 3. set_details テーブル マッピング

| 旧フィールド | 旧データ型 | 新フィールド | 新データ型 | 変換ルール | 注意点 |
|------------|-----------|------------|-----------|-----------|--------|
| `set_details[i]` | `string` | `detail_name` | `text` | 配列要素を行に展開 | 1対多の関係に変換 |
| - | - | `line_item_id` | `uuid` | 親line_itemのUUID | FK制約 |
| - | - | `normalized_detail_name` | `text` | normalize_simple()で生成 | 自動生成 |
| - | - | `sort_order` | `integer` | 配列インデックス | 表示順序 |

### 4. task_master + task_aliases テーブル マッピング

作業履歴から正規名マスタを構築：

| 旧データソース | 新テーブル | 変換ルール | 注意点 |
|-------------|----------|-----------|--------|
| `bankin_work_history[].work_name` | `task_master.canonical_name` | 最頻出の表記を正規名に採用 | 重複除去・統合処理が必要 |
| `line_items[].work_name` | `task_aliases.alias_name` | 異なる表記をすべて別名として登録 | 使用頻度カウント |
| `WorkHistoryItem.unit_price` | `task_master.default_price` | 最新または平均価格 | 価格変動の考慮 |
| - | `task_master.usage_count` | 出現回数をカウント | 統計情報 |

## データ変換の課題と対策

### 1. 主要課題

#### A. IDの互換性
- **課題**: 数値ID → UUID への変換で既存参照が無効化
- **対策**: 移行時に対応表を作成、必要に応じて旧ID情報をextraフィールドに保存

#### B. 正規化の必要性  
- **課題**: 作業名の表記ゆれが多数存在する可能性
- **対策**: 移行前に表記統一、normalize_simple()による自動正規化

#### C. データ整合性
- **課題**: 手動計算された金額と自動計算の差異
- **対策**: 移行後に全請求書の金額を再計算、差異をレポート

### 2. 移行時の変換関数

```sql
-- 顧客カテゴリー変換関数
CREATE OR REPLACE FUNCTION convert_customer_category_id(old_id text, categories jsonb)
RETURNS text AS $$
DECLARE
    category jsonb;
BEGIN
    FOR category IN SELECT jsonb_array_elements(categories)
    LOOP
        IF category->>'id' = old_id THEN
            RETURN category->>'name';
        END IF;
    END LOOP;
    -- デフォルトマッピング
    CASE old_id
        WHEN 'ud' THEN RETURN 'UD';
        WHEN 'other' THEN RETURN 'その他';
        ELSE RETURN old_id;
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- 作業項目展開関数（改良版）
CREATE OR REPLACE FUNCTION expand_work_items(
    p_invoice_id uuid,
    p_owner_id uuid,
    p_work_items jsonb
)
RETURNS integer AS $$
DECLARE
    work_item jsonb;
    new_line_item_id uuid;
    detail_text text;
    sort_counter integer := 0;
    detail_counter integer;
    total_items integer := 0;
BEGIN
    FOR work_item IN SELECT jsonb_array_elements(p_work_items)
    LOOP
        sort_counter := sort_counter + 1;
        
        -- line_items レコード作成
        INSERT INTO line_items (
            invoice_id, owner_id, item_type, work_name, normalized_work_name,
            unit_price, quantity, amount, memo, sort_order
        ) VALUES (
            p_invoice_id,
            p_owner_id,
            CASE WHEN (work_item->>'type') = 'set' THEN 'set' ELSE 'individual' END,
            work_item->>'work_name',
            normalize_simple(work_item->>'work_name'),
            (work_item->>'unit_price')::integer,
            (work_item->>'quantity')::integer,
            (work_item->>'amount')::integer,
            work_item->>'memo',
            sort_counter
        ) RETURNING id INTO new_line_item_id;
        
        total_items := total_items + 1;
        
        -- セット詳細の処理
        IF work_item->>'type' = 'set' AND work_item->'set_details' IS NOT NULL THEN
            detail_counter := 0;
            FOR detail_text IN SELECT jsonb_array_elements_text(work_item->'set_details')
            LOOP
                detail_counter := detail_counter + 1;
                INSERT INTO set_details (
                    line_item_id, owner_id, detail_name, 
                    normalized_detail_name, sort_order
                ) VALUES (
                    new_line_item_id, 
                    p_owner_id, 
                    detail_text, 
                    normalize_simple(detail_text),
                    detail_counter
                );
            END LOOP;
        END IF;
        
        -- 作業マスタ・別名の更新
        PERFORM update_task_usage(p_owner_id, work_item->>'work_name');
    END LOOP;
    
    RETURN total_items;
END;
$$ LANGUAGE plpgsql;
```

### 3. 検証クエリ

```sql
-- 移行前後のデータ対比
WITH migration_summary AS (
    -- 旧データの集計
    SELECT 
        COUNT(*) FILTER (WHERE raw_data IS NOT NULL) as old_invoice_count,
        SUM((raw_data->>'total_amount')::integer) FILTER (WHERE raw_data IS NOT NULL) as old_total_amount,
        SUM(jsonb_array_length(raw_data->'work_items')) FILTER (WHERE raw_data IS NOT NULL) as old_work_item_count
    FROM staging.old_invoices
    WHERE processing_status = 'processed'
),
new_summary AS (
    -- 新データの集計  
    SELECT 
        COUNT(DISTINCT i.id) as new_invoice_count,
        SUM(i.total_amount) as new_total_amount,
        COUNT(li.id) as new_line_item_count,
        COUNT(sd.id) as new_set_detail_count
    FROM invoices i
    LEFT JOIN line_items li ON i.id = li.invoice_id
    LEFT JOIN set_details sd ON li.id = sd.line_item_id
    WHERE i.owner_id = $1  -- 移行対象ユーザー
)
SELECT 
    -- レコード数比較
    ms.old_invoice_count,
    ns.new_invoice_count,
    ms.old_work_item_count,
    ns.new_line_item_count,
    -- 金額比較
    ms.old_total_amount,
    ns.new_total_amount,
    ABS(ms.old_total_amount - ns.new_total_amount) as amount_difference,
    -- セット詳細
    ns.new_set_detail_count,
    -- 整合性チェック
    CASE WHEN ms.old_invoice_count = ns.new_invoice_count THEN '✅ OK' ELSE '❌ NG' END as invoice_count_check,
    CASE WHEN ms.old_work_item_count = ns.new_line_item_count THEN '✅ OK' ELSE '❌ NG' END as line_item_count_check,
    CASE WHEN ABS(ms.old_total_amount - ns.new_total_amount) < 100 THEN '✅ OK' ELSE '❌ NG' END as amount_check
FROM migration_summary ms, new_summary ns;
```

## 現行システムから新システムへの移行優先度

### Phase 1（必須移行）
1. **請求書基本情報**: `invoices` テーブル
2. **作業明細**: `line_items` + `set_details` テーブル  
3. **基本的な作業履歴**: `task_master` の基礎データ

### Phase 2（機能拡張）
1. **顧客カテゴリー管理**: 動的カテゴリーシステム
2. **作業名正規化**: `task_aliases` による表記ゆれ対応
3. **統計・分析機能**: ビューを活用した高度な集計

### Phase 3（最適化）
1. **パフォーマンスチューニング**: インデックス最適化
2. **拡張属性**: `extra` jsonb や `line_item_attrs` 活用
3. **レポート機能**: マテリアライズドビュー等

## まとめ

現行システムは比較的シンプルな構造のため、新システムへの移行は技術的に実現可能です。主な課題は：

1. **ID体系の変更**: 数値 → UUID
2. **正規化の導入**: 作業名の表記ゆれ対策  
3. **構造の拡張**: EAV、ビュー等による柔軟性向上

段階的な移行アプローチにより、データ品質を保ちながら新機能の恩恵を受けることが可能です。