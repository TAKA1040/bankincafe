-- 辞書登録機能を含む完全なDB設計
-- ChatGPT提案 + Claude Code調整版
-- 作成日: 2025-08-29

-- =====================================
-- 1. 拡張機能の有効化
-- =====================================

-- 日本語全文検索用（pg_trgmではなくpg_bigmを推奨だが、まずは基本機能から）
-- CREATE EXTENSION IF NOT EXISTS pg_bigm;  -- 日本語対応版
CREATE EXTENSION IF NOT EXISTS pg_trgm;    -- 基本版（英数字・部分的日本語）

-- =====================================
-- 2. マスターテーブル作成
-- =====================================

-- 対象マスター（タイヤ、ホイール等）
CREATE TABLE IF NOT EXISTS targets (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 動作マスター（交換、脱着等）
CREATE TABLE IF NOT EXISTS actions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 位置マスター（右、左等）※「指定なし」レコードは作らない
CREATE TABLE IF NOT EXISTS positions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================
-- 3. 関連性管理テーブル
-- =====================================

-- 対象→動作の関連性（タイヤ→交換、脱着等）
CREATE TABLE IF NOT EXISTS target_actions (
  id SERIAL PRIMARY KEY,
  target_id INTEGER NOT NULL REFERENCES targets(id) ON DELETE CASCADE,
  action_id INTEGER NOT NULL REFERENCES actions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(target_id, action_id)
);

-- 動作→位置の関連性（交換→右、左等）
CREATE TABLE IF NOT EXISTS action_positions (
  id SERIAL PRIMARY KEY,
  action_id INTEGER NOT NULL REFERENCES actions(id) ON DELETE CASCADE,
  position_id INTEGER NOT NULL REFERENCES positions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(action_id, position_id)
);

-- =====================================
-- 4. 読み仮名・検索支援テーブル
-- =====================================

-- 読み仮名マッピング（曖昧検索対応）
CREATE TABLE IF NOT EXISTS reading_mappings (
  id SERIAL PRIMARY KEY,
  word VARCHAR(100) NOT NULL,
  reading_hiragana VARCHAR(200) NOT NULL DEFAULT '',
  reading_katakana VARCHAR(200) NOT NULL DEFAULT '',
  word_type TEXT NOT NULL CHECK (word_type IN ('target', 'action', 'position')),
  normalized VARCHAR(100), -- 正規化形（将来の表記統一用）
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(word, word_type)
);

-- =====================================
-- 5. 作業履歴・価格管理テーブル
-- =====================================

-- 作業履歴（position_id は NULL許可）
CREATE TABLE IF NOT EXISTS work_history (
  id SERIAL PRIMARY KEY,
  target_id INTEGER NOT NULL REFERENCES targets(id),
  action_id INTEGER NOT NULL REFERENCES actions(id),
  position_id INTEGER REFERENCES positions(id), -- NULL = 指定なし
  memo TEXT DEFAULT '',
  unit_price DECIMAL(10,2) DEFAULT 0,
  quantity INTEGER DEFAULT 1,
  total_amount DECIMAL(10,2) GENERATED ALWAYS AS (unit_price * quantity) STORED,
  raw_label TEXT, -- 元入力内容保存（将来の再解釈用）
  task_type TEXT CHECK (task_type IN ('structured', 'fuzzy')) DEFAULT 'structured',
  invoice_id INTEGER, -- 将来の請求書管理用
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 価格提案マスター
CREATE TABLE IF NOT EXISTS price_suggestions (
  id SERIAL PRIMARY KEY,
  target_id INTEGER NOT NULL REFERENCES targets(id),
  action_id INTEGER NOT NULL REFERENCES actions(id),
  suggested_price DECIMAL(10,2) NOT NULL,
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(target_id, action_id)
);

-- =====================================
-- 6. セット作業管理テーブル
-- =====================================

-- セット作業ヘッダー
CREATE TABLE IF NOT EXISTS work_sets (
  id SERIAL PRIMARY KEY,
  set_name VARCHAR(200) NOT NULL,
  unit_price DECIMAL(10,2) DEFAULT 0,
  quantity INTEGER DEFAULT 1,
  total_amount DECIMAL(10,2) GENERATED ALWAYS AS (unit_price * quantity) STORED,
  invoice_id INTEGER, -- 将来の請求書管理用
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- セット詳細（position_id は NULL許可）
CREATE TABLE IF NOT EXISTS work_set_details (
  id SERIAL PRIMARY KEY,
  work_set_id INTEGER NOT NULL REFERENCES work_sets(id) ON DELETE CASCADE,
  target_id INTEGER NOT NULL REFERENCES targets(id),
  action_id INTEGER NOT NULL REFERENCES actions(id),
  position_id INTEGER REFERENCES positions(id), -- NULL = 指定なし
  memo TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================
-- 7. ユーザー設定管理テーブル
-- =====================================

-- ユーザー設定（将来のマルチユーザー対応）
CREATE TABLE IF NOT EXISTS user_preferences (
  id SERIAL PRIMARY KEY,
  user_id INTEGER DEFAULT 1, -- 現在は単一ユーザー想定
  preference_key VARCHAR(100) NOT NULL,
  preference_value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, preference_key)
);

-- =====================================
-- 8. インデックス作成
-- =====================================

-- 正規化ユニーク制約（重複防止）
CREATE UNIQUE INDEX IF NOT EXISTS uniq_targets_name_norm ON targets (lower(name));
CREATE UNIQUE INDEX IF NOT EXISTS uniq_actions_name_norm ON actions (lower(name));
CREATE UNIQUE INDEX IF NOT EXISTS uniq_positions_name_norm ON positions (lower(name));

-- 検索性能向上インデックス
CREATE INDEX IF NOT EXISTS idx_work_history_target_action ON work_history(target_id, action_id);
CREATE INDEX IF NOT EXISTS idx_work_history_created_at ON work_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_price_suggestions_target_action ON price_suggestions(target_id, action_id);
CREATE INDEX IF NOT EXISTS idx_reading_mappings_word ON reading_mappings(word);
CREATE INDEX IF NOT EXISTS idx_reading_mappings_type ON reading_mappings(word_type);
CREATE INDEX IF NOT EXISTS idx_target_actions_target ON target_actions(target_id);
CREATE INDEX IF NOT EXISTS idx_action_positions_action ON action_positions(action_id);

-- 全文検索インデックス（trgm）
CREATE INDEX IF NOT EXISTS gin_targets_name_trgm ON targets USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS gin_actions_name_trgm ON actions USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS gin_positions_name_trgm ON positions USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS gin_readings_word_trgm ON reading_mappings USING gin (word gin_trgm_ops);
CREATE INDEX IF NOT EXISTS gin_readings_hiragana_trgm ON reading_mappings USING gin (reading_hiragana gin_trgm_ops);

-- =====================================
-- 9. 自動更新トリガー
-- =====================================

-- updated_at 自動更新関数
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END$$ LANGUAGE plpgsql;

-- トリガー作成
DROP TRIGGER IF EXISTS trg_targets_updated ON targets;
CREATE TRIGGER trg_targets_updated BEFORE UPDATE ON targets
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_actions_updated ON actions;
CREATE TRIGGER trg_actions_updated BEFORE UPDATE ON actions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_positions_updated ON positions;
CREATE TRIGGER trg_positions_updated BEFORE UPDATE ON positions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_reading_mappings_updated ON reading_mappings;
CREATE TRIGGER trg_reading_mappings_updated BEFORE UPDATE ON reading_mappings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_work_history_updated ON work_history;
CREATE TRIGGER trg_work_history_updated BEFORE UPDATE ON work_history
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_price_suggestions_updated ON price_suggestions;
CREATE TRIGGER trg_price_suggestions_updated BEFORE UPDATE ON price_suggestions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_work_sets_updated ON work_sets;
CREATE TRIGGER trg_work_sets_updated BEFORE UPDATE ON work_sets
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_work_set_details_updated ON work_set_details;
CREATE TRIGGER trg_work_set_details_updated BEFORE UPDATE ON work_set_details
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_user_preferences_updated ON user_preferences;
CREATE TRIGGER trg_user_preferences_updated BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =====================================
-- 10. ビュー作成
-- =====================================

-- 作業履歴表示用ビュー（position_id NULL対応）
CREATE OR REPLACE VIEW work_history_view AS
SELECT 
  wh.id,
  wh.target_id,
  wh.action_id,
  wh.position_id,
  t.name as target_name,
  a.name as action_name,
  COALESCE(p.name, '（指定なし）') as position_name,
  wh.memo,
  wh.unit_price,
  wh.quantity,
  wh.total_amount,
  wh.raw_label,
  wh.task_type,
  wh.invoice_id,
  wh.created_at,
  wh.updated_at
FROM work_history wh
JOIN targets t ON wh.target_id = t.id
JOIN actions a ON wh.action_id = a.id
LEFT JOIN positions p ON wh.position_id = p.id;

-- セット詳細表示用ビュー（position_id NULL対応）
CREATE OR REPLACE VIEW work_set_details_view AS
SELECT 
  wsd.id,
  wsd.work_set_id,
  wsd.target_id,
  wsd.action_id,
  wsd.position_id,
  t.name as target_name,
  a.name as action_name,
  COALESCE(p.name, '（指定なし）') as position_name,
  wsd.memo,
  wsd.sort_order,
  wsd.created_at,
  wsd.updated_at
FROM work_set_details wsd
JOIN targets t ON wsd.target_id = t.id
JOIN actions a ON wsd.action_id = a.id
LEFT JOIN positions p ON wsd.position_id = p.id;

-- 曖昧検索用ビュー
CREATE OR REPLACE VIEW searchable_items AS
-- 対象（正確な名前）
SELECT 
  t.id,
  t.name,
  t.name as search_text,
  'target' as item_type,
  'exact' as match_type,
  t.sort_order
FROM targets t
WHERE t.is_active = true

UNION ALL

-- 対象（読み仮名）
SELECT 
  t.id,
  t.name,
  rm.reading_hiragana as search_text,
  'target' as item_type,
  'reading_hiragana' as match_type,
  t.sort_order
FROM targets t
JOIN reading_mappings rm ON rm.word = t.name AND rm.word_type = 'target'
WHERE t.is_active = true AND rm.reading_hiragana != ''

UNION ALL

-- 対象（カタカナ読み）
SELECT 
  t.id,
  t.name,
  rm.reading_katakana as search_text,
  'target' as item_type,
  'reading_katakana' as match_type,
  t.sort_order
FROM targets t
JOIN reading_mappings rm ON rm.word = t.name AND rm.word_type = 'target'
WHERE t.is_active = true AND rm.reading_katakana != ''

UNION ALL

-- 動作（正確な名前）
SELECT 
  a.id,
  a.name,
  a.name as search_text,
  'action' as item_type,
  'exact' as match_type,
  a.sort_order
FROM actions a
WHERE a.is_active = true

UNION ALL

-- 動作（読み仮名）
SELECT 
  a.id,
  a.name,
  rm.reading_hiragana as search_text,
  'action' as item_type,
  'reading_hiragana' as match_type,
  a.sort_order
FROM actions a
JOIN reading_mappings rm ON rm.word = a.name AND rm.word_type = 'action'
WHERE a.is_active = true AND rm.reading_hiragana != ''

UNION ALL

-- 位置（正確な名前）
SELECT 
  p.id,
  p.name,
  p.name as search_text,
  'position' as item_type,
  'exact' as match_type,
  p.sort_order
FROM positions p
WHERE p.is_active = true

UNION ALL

-- 位置（読み仮名）
SELECT 
  p.id,
  p.name,
  rm.reading_hiragana as search_text,
  'position' as item_type,
  'reading_hiragana' as match_type,
  p.sort_order
FROM positions p
JOIN reading_mappings rm ON rm.word = p.name AND rm.word_type = 'position'
WHERE p.is_active = true AND rm.reading_hiragana != '';

-- =====================================
-- 11. コメント追加
-- =====================================

COMMENT ON TABLE targets IS '対象マスター（タイヤ、ホイール等）';
COMMENT ON TABLE actions IS '動作マスター（交換、脱着等）';
COMMENT ON TABLE positions IS '位置マスター（右、左等）※指定なしはNULLで表現';
COMMENT ON TABLE target_actions IS '対象→動作の関連性管理';
COMMENT ON TABLE action_positions IS '動作→位置の関連性管理';
COMMENT ON TABLE reading_mappings IS '読み仮名マッピング（曖昧検索用）';
COMMENT ON TABLE work_history IS '作業履歴（position_id=NULLで指定なし）';
COMMENT ON TABLE price_suggestions IS '価格提案マスター';
COMMENT ON TABLE work_sets IS 'セット作業ヘッダー';
COMMENT ON TABLE work_set_details IS 'セット作業詳細（position_id=NULLで指定なし）';
COMMENT ON TABLE user_preferences IS 'ユーザー設定管理';

COMMENT ON COLUMN work_history.position_id IS 'NULLの場合「指定なし」を表現';
COMMENT ON COLUMN work_set_details.position_id IS 'NULLの場合「指定なし」を表現';
COMMENT ON COLUMN reading_mappings.normalized IS '正規化形（将来の表記統一用）';
COMMENT ON COLUMN work_history.raw_label IS '元入力内容保存（将来の再解釈用）';
COMMENT ON COLUMN work_history.task_type IS 'structured: 構造化入力, fuzzy: 曖昧入力';

-- マイグレーション完了
SELECT 'Complete dictionary system migration completed successfully!' as result;