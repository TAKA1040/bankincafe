# 作業入力機能のためのデータベース要件レポート

## 📊 概要

作業入力プロトタイプの機能を実装するために必要なデータベース設計とテーブル構造についてまとめます。

## 🎯 現在の機能要件

### 1. 個別作業入力
- 対象、動作、位置、メモの構造化入力
- 単価・数量による金額計算
- 曖昧検索による入力補助

### 2. セット作業入力
- セット名による親作業の定義
- 複数の子作業（セット詳細）の管理
- 子作業は金額なし（工数のみ）

### 3. 入力補助機能
- 対象に基づく動作フィルタリング
- 動作に基づく位置フィルタリング
- 読み仮名による曖昧検索
- ~~過去の作業履歴からの価格提案~~ (work-search機能完成まで無効化)

### 4. ユーザー設定機能
- 入力方式の選択（モーダル表示 vs インライン表示）
- 個別・セット入力での統一されたUX設定

## 📋 必要なテーブル構造

### 1. マスターデータテーブル

#### targets（対象マスター）
```sql
CREATE TABLE targets (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**初期データ例：**
- タイヤ、ホイール、ライト、コーナーパネル、フラッシャー、バンパー、ライニング、スプリングシート

#### actions（動作マスター）
```sql
CREATE TABLE actions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**初期データ例：**
- （指定なし）、交換、脱着、取付、修理、調整、点検、清掃、溶接、張替、入替、塗装、ASSY

#### positions（位置マスター）
```sql
CREATE TABLE positions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**初期データ例：**
- 右、左、前、後、右前、左前、右後、左後、左右、前後

### 2. 関連性管理テーブル

#### target_actions（対象→動作の関連性）
```sql
CREATE TABLE target_actions (
  id SERIAL PRIMARY KEY,
  target_id INTEGER REFERENCES targets(id) ON DELETE CASCADE,
  action_id INTEGER REFERENCES actions(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(target_id, action_id)
);
```

**目的：** 「タイヤ」選択時に「交換、脱着、点検」のみ表示

#### action_positions（動作→位置の関連性）
```sql
CREATE TABLE action_positions (
  id SERIAL PRIMARY KEY,
  action_id INTEGER REFERENCES actions(id) ON DELETE CASCADE,
  position_id INTEGER REFERENCES positions(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(action_id, position_id)
);
```

**目的：** 「交換」選択時に「右、左、前、後、右前、左前、右後、左後」のみ表示

### 3. 読み仮名・検索支援テーブル

#### reading_mappings（読み仮名マッピング）
```sql
CREATE TABLE reading_mappings (
  id SERIAL PRIMARY KEY,
  word VARCHAR(100) NOT NULL,
  reading_hiragana VARCHAR(200) NOT NULL,
  reading_katakana VARCHAR(200) NOT NULL,
  word_type ENUM('target', 'action', 'position') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(word, word_type)
);
```

**初期データ例：**
```sql
INSERT INTO reading_mappings (word, reading_hiragana, reading_katakana, word_type) VALUES
('交換', 'こうかん', 'コウカン', 'action'),
('修理', 'しゅうり', 'シュウリ', 'action'),
('脱着', 'だっちゃく', 'ダッチャク', 'action'),
('右', 'みぎ', 'ミギ', 'position'),
('左', 'ひだり', 'ヒダリ', 'position');
```

### 4. 作業履歴・価格管理テーブル

#### work_history（作業履歴）
```sql
CREATE TABLE work_history (
  id SERIAL PRIMARY KEY,
  target_id INTEGER REFERENCES targets(id),
  action_id INTEGER REFERENCES actions(id),
  position_id INTEGER REFERENCES positions(id), -- NULL許可：「指定なし」はNULLで表現
  memo TEXT,
  unit_price DECIMAL(10,2) DEFAULT 0,
  quantity INTEGER DEFAULT 1,
  total_amount DECIMAL(10,2) GENERATED ALWAYS AS (unit_price * quantity) STORED,
  raw_label TEXT, -- 元の入力内容をそのまま保存（将来の再解釈用）
  task_type TEXT CHECK (task_type IN ('structured', 'fuzzy')) DEFAULT 'structured',
  invoice_id INTEGER, -- 将来の請求書管理用
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### price_suggestions（価格提案マスター）
```sql
CREATE TABLE price_suggestions (
  id SERIAL PRIMARY KEY,
  target_id INTEGER REFERENCES targets(id),
  action_id INTEGER REFERENCES actions(id),
  suggested_price DECIMAL(10,2) NOT NULL,
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(target_id, action_id)
);
```

### 5. セット作業管理テーブル

#### work_sets（セット作業ヘッダー）
```sql
CREATE TABLE work_sets (
  id SERIAL PRIMARY KEY,
  set_name VARCHAR(200) NOT NULL,
  unit_price DECIMAL(10,2) DEFAULT 0,
  quantity INTEGER DEFAULT 1,
  total_amount DECIMAL(10,2) GENERATED ALWAYS AS (unit_price * quantity) STORED,
  invoice_id INTEGER, -- 将来の請求書管理用
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### work_set_details（セット詳細）
```sql
CREATE TABLE work_set_details (
  id SERIAL PRIMARY KEY,
  work_set_id INTEGER REFERENCES work_sets(id) ON DELETE CASCADE,
  target_id INTEGER REFERENCES targets(id),
  action_id INTEGER REFERENCES actions(id),
  position_id INTEGER REFERENCES positions(id), -- NULL許可：「指定なし」はNULLで表現
  memo TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 6. ユーザー設定管理テーブル

#### user_preferences（ユーザー設定）
```sql
CREATE TABLE user_preferences (
  id SERIAL PRIMARY KEY,
  user_id INTEGER, -- 将来のユーザー管理用
  preference_key VARCHAR(100) NOT NULL,
  preference_value TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, preference_key)
);
```

**設定項目例：**
- `input_assist_mode`: `'modal'` または `'inline'` (入力補助表示方式)
- `default_tab`: `'individual'` または `'set'` (デフォルトタブ)
- `auto_suggest`: `true` または `false` (自動サジェスト有効/無効)

## 🔍 必要なインデックス

```sql
-- 検索性能向上のためのインデックス
CREATE INDEX idx_work_history_target_action ON work_history(target_id, action_id);
CREATE INDEX idx_work_history_created_at ON work_history(created_at);
CREATE INDEX idx_price_suggestions_target_action ON price_suggestions(target_id, action_id);
CREATE INDEX idx_reading_mappings_word ON reading_mappings(word);
CREATE INDEX idx_reading_mappings_type ON reading_mappings(word_type);

-- 関連テーブル用インデックス
CREATE INDEX idx_target_actions_target ON target_actions(target_id);
CREATE INDEX idx_action_positions_action ON action_positions(action_id);
```

## 📊 NULL位置の表示対応

### position_id NULL の表示クエリ例
```sql
-- 作業履歴表示用（position_id がNULLの場合は「（指定なし）」と表示）
SELECT 
  wh.id,
  t.name as target_name,
  a.name as action_name,
  COALESCE(p.name, '（指定なし）') as position_name,
  wh.memo,
  wh.unit_price,
  wh.quantity,
  wh.total_amount
FROM work_history wh
JOIN targets t ON wh.target_id = t.id
JOIN actions a ON wh.action_id = a.id
LEFT JOIN positions p ON wh.position_id = p.id;  -- LEFT JOINでNULLを許可
```

## 🔧 必要な関数・ビュー

### 1. 価格提案関数（将来実装予定）
```sql
-- 注意: 現在は無効化済み。work-search機能完成後に再実装予定
CREATE OR REPLACE FUNCTION get_suggested_price(
  p_target_id INTEGER,
  p_action_id INTEGER
) RETURNS DECIMAL AS $$
BEGIN
  -- TODO: work-search機能と連携した正確な価格提案ロジックを実装
  -- - 同一顧客・同一作業の履歴重視
  -- - 時系列での価格変動考慮
  -- - 物価変動の影響を適切に反映
  
  RETURN NULL; -- 現在は無効化
END;
$$ LANGUAGE plpgsql;
```

### 2. 曖昧検索ビュー
```sql
CREATE VIEW searchable_targets AS
SELECT 
  t.id,
  t.name,
  t.name as search_text,
  'exact' as match_type
FROM targets t
WHERE t.is_active = true

UNION ALL

SELECT 
  t.id,
  t.name,
  rm.reading_hiragana as search_text,
  'reading' as match_type
FROM targets t
JOIN reading_mappings rm ON rm.word = t.name AND rm.word_type = 'target'
WHERE t.is_active = true;
```

## 📊 初期データ投入スクリプト

### マスターデータ
```sql
-- 対象マスター
INSERT INTO targets (name, sort_order) VALUES
('タイヤ', 1), ('ホイール', 2), ('ライト', 3), ('コーナーパネル', 4),
('フラッシャー', 5), ('バンパー', 6), ('ライニング', 7), ('スプリングシート', 8);

-- 動作マスター
INSERT INTO actions (name, sort_order) VALUES
('交換', 1), ('脱着', 2), ('取付', 3), ('修理', 4),
('調整', 5), ('点検', 6), ('清掃', 7), ('溶接', 8), ('張替', 9), ('入替', 10), ('塗装', 11), ('ASSY', 12);
-- 注意：「（指定なし）」は削除。NULLで未指定を表現

-- 位置マスター
INSERT INTO positions (name, sort_order) VALUES
('右', 1), ('左', 2), ('前', 3), ('後', 4), ('右前', 5), ('左前', 6), ('右後', 7), ('左後', 8), ('左右', 9), ('前後', 10);
```

### 関連性データ
```sql
-- 対象→動作の関連性（現在のTARGET_ACTIONSマッピングから）
INSERT INTO target_actions (target_id, action_id)
SELECT t.id, a.id FROM targets t, actions a
WHERE (t.name, a.name) IN (
  ('タイヤ', '（指定なし）'), ('タイヤ', '交換'), ('タイヤ', '脱着'), ('タイヤ', '点検'),
  ('ホイール', '（指定なし）'), ('ホイール', '脱着'), ('ホイール', '取付'), ('ホイール', '清掃'),
  -- ... 他の組み合わせ
);

-- 動作→位置の関連性（現在のACTION_POSITIONSマッピングから）
INSERT INTO action_positions (action_id, position_id)
SELECT a.id, p.id FROM actions a, positions p
WHERE (a.name, p.name) IN (
  ('交換', '右'), ('交換', '左'), ('交換', '前'), ('交換', '後'),
  ('交換', '右前'), ('交換', '左前'), ('交換', '右後'), ('交換', '左後'),
  -- ... 他の組み合わせ
);
```

## 💡 実装のポイント

### 1. 曖昧検索の実装
- ひらがな・カタカナ・漢字の正規化関数が必要
- PostgreSQLの場合は拡張機能を活用
- 部分一致・前方一致の優先度設定

### 2. パフォーマンス考慮
- 頻繁に使用される検索クエリのインデックス最適化
- 価格提案の計算結果キャッシュ
- マスターデータの適切な正規化

### 3. データ整合性
- 外部キー制約による参照整合性
- 論理削除（is_activeフラグ）による履歴保持
- 重複データの防止（UNIQUE制約）

### 4. 拡張性
- 将来の請求書システムとの連携を考慮
- カスタム項目追加の余地
- 権限管理・マルチテナント対応の準備

## 📈 段階的実装案

### Phase 1: 基本機能
1. マスターテーブル作成・初期データ投入
2. 基本的なCRUD API実装
3. シンプルな検索機能

### Phase 2: 高度な機能
1. 関連性管理テーブル実装
2. 曖昧検索機能実装
3. 価格提案機能実装

### Phase 3: 最適化・拡張
1. パフォーマンス最適化
2. セット作業機能完全実装
3. 請求書システムとの連携準備

---

**作成日**: 2024-08-28  
**対象システム**: bankincafe 作業入力機能  
**データベース**: PostgreSQL (Supabase想定)