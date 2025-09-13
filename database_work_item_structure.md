# データベースの作業項目構造

## 作業項目の4要素とデータベース上の対応

### 1. 対象（Target）
- **データベーステーブル名**: `targets`
- **カラム名**: `name`
- **例**: ドア、フロントバンパー、ヘッドライト、エンジン、タイヤハウスカバー など
- **総数**: 63種類

### 2. 動作（Action）
- **データベーステーブル名**: `actions`
- **カラム名**: `name`
- **例**: 取替、脱着、溶接、加工、交換、修理、取付、修正 など
- **総数**: 36種類

### 3. 位置（Position）
- **データベーステーブル名**: `positions`
- **カラム名**: `name`
- **例**: 左、右、外、サイド、フロント、前、上、センター、下 など
- **総数**: 24種類

### 4. その他（Memo/Other）
- **作業項目作成画面では**: `workMemo`という変数名
- **請求書明細テーブルでは**: `invoice_line_items.raw_label`
- **作業履歴テーブルでは**: `work_history.memo`

## 請求書明細での格納構造

請求書明細テーブル（`invoice_line_items`）では以下のカラムに分けて格納：

```sql
CREATE TABLE invoice_line_items (
  id BIGSERIAL PRIMARY KEY,
  invoice_id TEXT NOT NULL,
  line_no INTEGER NOT NULL,
  task_type TEXT NOT NULL,           -- 'fuzzy' | 'structured' | 'set'
  action TEXT,                       -- 動作名（structuredの場合）
  target TEXT,                       -- 対象名
  position TEXT,                     -- 位置名（NULLの場合は指定なし）
  raw_label TEXT,                    -- 生の作業名文字列またはメモ
  unit_price NUMERIC(12,0) DEFAULT 0,
  quantity INTEGER DEFAULT 1,
  amount NUMERIC(12,0) DEFAULT 0,
  -- その他のカラム...
);
```

## 作業履歴での格納構造

作業履歴テーブル（`work_history`）では以下の構造：

```sql
CREATE TABLE work_history (
  id SERIAL PRIMARY KEY,
  target_id INTEGER NOT NULL REFERENCES targets(id),
  action_id INTEGER NOT NULL REFERENCES actions(id),
  position_id INTEGER REFERENCES positions(id), -- NULL = 指定なし
  memo TEXT DEFAULT '',                          -- その他/メモ
  unit_price DECIMAL(10,2) DEFAULT 0,
  quantity INTEGER DEFAULT 1,
  raw_label TEXT, -- 元入力内容保存
  -- その他のカラム...
);
```

## UI上での変数名

請求書作成画面（`invoice-create/page.tsx`）での変数名：

1. **対象**: `target` (string)
2. **動作**: `action` (string) 
3. **位置**: `position` (string)
4. **その他**: `workMemo` (string)

## マスターデータの詳細

### 対象マスター（targets テーブル）の例
- ドア、サイドガード、ステー、ブラケット、パイプ
- 燃料タンク、テールライト、ホース、ハンドル
- フロントバンパー、ヘッドライト、エンジン など

### 動作マスター（actions テーブル）の例  
- 取替、脱着、溶接、加工、交換、修理
- 取付、修正、曲がり直し、製作、点検 など

### 位置マスター（positions テーブル）の例
- 左、右、外、サイド、フロント、前、上
- センター、下、インナー、ロア、内、後 など

これらのマスターデータは実際の請求書データ4088件から抽出された実用的なデータです。