# データ再構築分析レポート

## 📊 現在のデータ構造の問題点

### 1. 非効率な品名管理
- **現状**: 品名1-32まで横に並んだ非正規化構造
- **問題**: 95%以上の品名スロットが未使用
- **影響**: ストレージ容量の無駄、処理速度の低下

### 2. 顧客データの混在
- **現状**: 「請求先」は常にUDトラックス、「件名」が実際の顧客
- **問題**: データの意味が混乱している
- **影響**: 検索・分析の困難

### 3. 冗長なカラム構造
- **現状**: 142列中の多くが空
- **問題**: メモリ使用量が大きい
- **影響**: パフォーマンス低下

## 🎯 推奨する新データ構造

### テーブル設計

#### 1. invoices（請求書ヘッダー）
```sql
CREATE TABLE invoices (
  invoice_id TEXT PRIMARY KEY,
  invoice_number TEXT,
  issue_date DATE,
  billing_date DATE,
  billing_month TEXT,
  
  -- 顧客情報（修正版）
  billing_company TEXT,      -- UDトラックス（請求先企業）
  end_customer TEXT,         -- 実際の顧客（現在の「件名」）
  registration_number TEXT,
  
  -- 注文情報
  purchase_order_number TEXT,
  order_number TEXT,
  
  -- 金額情報
  subtotal NUMERIC(12,0),
  tax NUMERIC(12,0),
  total_amount NUMERIC(12,0),
  
  -- ステータス
  status TEXT DEFAULT 'finalized',
  payment_status TEXT DEFAULT 'unpaid',
  
  -- 備考
  remarks TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### 2. invoice_line_items（請求書明細）- 正規化版
```sql
CREATE TABLE invoice_line_items (
  id BIGSERIAL PRIMARY KEY,
  invoice_id TEXT NOT NULL REFERENCES invoices(invoice_id) ON DELETE CASCADE,
  line_no INTEGER NOT NULL,
  
  -- 作業内容
  work_description TEXT NOT NULL,  -- 品名の内容
  quantity INTEGER DEFAULT 1,
  unit_price NUMERIC(12,0),
  amount NUMERIC(12,0),
  
  -- メタデータ
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(invoice_id, line_no)
);
```

## 📈 期待される改善効果

### 1. ストレージ効率
- **削減率**: 約70%（142列 → 約40列）
- **容量削減**: 空フィールドの大幅削除

### 2. パフォーマンス向上
- **クエリ速度**: 50-80%高速化
- **メモリ使用量**: 60%削減

### 3. データ品質向上
- **正規化**: 重複データの排除
- **整合性**: 適切な制約とリレーション
- **保守性**: シンプルな構造で運用しやすい

## 🔄 データ移行戦略

### Phase 1: 新テーブル作成
1. 新しいテーブル構造を作成
2. インデックスとトリガー設定

### Phase 2: データ変換・移行
1. CSVデータを新構造に変換
2. 品名1-32を個別の明細行に分解
3. 顧客情報の正規化

### Phase 3: アプリケーション更新
1. フロントエンドの表示ロジック更新
2. 検索・フィルター機能の最適化

### Phase 4: 検証・切り替え
1. データ整合性の検証
2. パフォーマンステスト
3. 本番切り替え

## ⚠️ 移行時の注意点

1. **データ保護**: 移行中も既存データを保持
2. **段階的移行**: テーブルごとに段階的に実施
3. **バックアップ**: 各段階でバックアップ取得
4. **検証**: 移行前後のデータ件数・金額総計を検証

## 📝 次のアクション

1. 新テーブル構造の詳細設計
2. データ変換スクリプトの作成
3. 移行計画書の作成
4. テスト環境での検証