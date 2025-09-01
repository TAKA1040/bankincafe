-- 実データ辞書投入SQL
-- 生成日時: 2025-09-01 23:33:01

-- =====================================
-- 1. TARGETS (対象マスター) の更新
-- =====================================

-- フェンダーの更新/追加
INSERT INTO targets (name, description, keywords, created_at, updated_at)
VALUES (
  'フェンダー',
  'フェンダー関連の作業対象',
  ARRAY['フェンダー'],
  NOW(),
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  updated_at = NOW();

-- バンパーの更新/追加
INSERT INTO targets (name, description, keywords, created_at, updated_at)
VALUES (
  'バンパー',
  'バンパー関連の作業対象',
  ARRAY['バンパー', 'インナーバンパー'],
  NOW(),
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  updated_at = NOW();

-- ドアの更新/追加
INSERT INTO targets (name, description, keywords, created_at, updated_at)
VALUES (
  'ドア',
  'ドア関連の作業対象',
  ARRAY['ドア', '扉', '観音扉', '煽りドア'],
  NOW(),
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  updated_at = NOW();

-- ハンドルの更新/追加
INSERT INTO targets (name, description, keywords, created_at, updated_at)
VALUES (
  'ハンドル',
  'ハンドル関連の作業対象',
  ARRAY['ハンドル', 'アウターハンドル'],
  NOW(),
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  updated_at = NOW();

-- タンクの更新/追加
INSERT INTO targets (name, description, keywords, created_at, updated_at)
VALUES (
  'タンク',
  'タンク関連の作業対象',
  ARRAY['タンク', '燃料タンク', 'オイルタンク'],
  NOW(),
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  updated_at = NOW();

-- ランプの更新/追加
INSERT INTO targets (name, description, keywords, created_at, updated_at)
VALUES (
  'ランプ',
  'ランプ関連の作業対象',
  ARRAY['ヘッドライト', 'フォグランプ', 'マーカーランプ', 'コーナーランプ', 'フラッシャー'],
  NOW(),
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  updated_at = NOW();

-- ステーの更新/追加
INSERT INTO targets (name, description, keywords, created_at, updated_at)
VALUES (
  'ステー',
  'ステー関連の作業対象',
  ARRAY['ステー', 'ブラケット', 'ステイ'],
  NOW(),
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  updated_at = NOW();

-- ガードの更新/追加
INSERT INTO targets (name, description, keywords, created_at, updated_at)
VALUES (
  'ガード',
  'ガード関連の作業対象',
  ARRAY['ガード', 'サイドガード'],
  NOW(),
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  updated_at = NOW();

-- パイプの更新/追加
INSERT INTO targets (name, description, keywords, created_at, updated_at)
VALUES (
  'パイプ',
  'パイプ関連の作業対象',
  ARRAY['パイプ', 'ホース', 'ヒーターパイプ'],
  NOW(),
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  updated_at = NOW();

-- カバーの更新/追加
INSERT INTO targets (name, description, keywords, created_at, updated_at)
VALUES (
  'カバー',
  'カバー関連の作業対象',
  ARRAY['カバー', 'ロアカバー', 'エンドカバー', 'アウターカバー', 'マフラーカバー'],
  NOW(),
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  updated_at = NOW();

-- シートの更新/追加
INSERT INTO targets (name, description, keywords, created_at, updated_at)
VALUES (
  'シート',
  'シート関連の作業対象',
  ARRAY['シート', 'ウイングシート'],
  NOW(),
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  updated_at = NOW();

-- 鋼板の更新/追加
INSERT INTO targets (name, description, keywords, created_at, updated_at)
VALUES (
  '鋼板',
  '鋼板関連の作業対象',
  ARRAY['鋼板', '縞鋼板'],
  NOW(),
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  updated_at = NOW();

-- 反射板の更新/追加
INSERT INTO targets (name, description, keywords, created_at, updated_at)
VALUES (
  '反射板',
  '反射板関連の作業対象',
  ARRAY['反射板'],
  NOW(),
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  updated_at = NOW();

-- ガラスの更新/追加
INSERT INTO targets (name, description, keywords, created_at, updated_at)
VALUES (
  'ガラス',
  'ガラス関連の作業対象',
  ARRAY['ガラス', '安全ガラス'],
  NOW(),
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  updated_at = NOW();

-- ゴムの更新/追加
INSERT INTO targets (name, description, keywords, created_at, updated_at)
VALUES (
  'ゴム',
  'ゴム関連の作業対象',
  ARRAY['ゴム', 'アーチゴム'],
  NOW(),
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  updated_at = NOW();

-- キャッチの更新/追加
INSERT INTO targets (name, description, keywords, created_at, updated_at)
VALUES (
  'キャッチ',
  'キャッチ関連の作業対象',
  ARRAY['キャッチ', 'ウィングキャッチ'],
  NOW(),
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  updated_at = NOW();

-- グリルの更新/追加
INSERT INTO targets (name, description, keywords, created_at, updated_at)
VALUES (
  'グリル',
  'グリル関連の作業対象',
  ARRAY['グリル', 'フロントグリル'],
  NOW(),
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  updated_at = NOW();

-- ミラーの更新/追加
INSERT INTO targets (name, description, keywords, created_at, updated_at)
VALUES (
  'ミラー',
  'ミラー関連の作業対象',
  ARRAY['ミラー', 'アンダーミラー'],
  NOW(),
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  updated_at = NOW();

-- レールの更新/追加
INSERT INTO targets (name, description, keywords, created_at, updated_at)
VALUES (
  'レール',
  'レール関連の作業対象',
  ARRAY['レール', 'ガイドレール', 'ラッシングレール'],
  NOW(),
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  updated_at = NOW();

-- メンバーの更新/追加
INSERT INTO targets (name, description, keywords, created_at, updated_at)
VALUES (
  'メンバー',
  'メンバー関連の作業対象',
  ARRAY['メンバー', 'クロスメンバー'],
  NOW(),
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  updated_at = NOW();


-- =====================================
-- 2. ACTIONS (動作マスター) の更新
-- =====================================

-- 交換の更新/追加
INSERT INTO actions (name, description, keywords, created_at, updated_at)
VALUES (
  '交換',
  '交換関連の作業動作',
  ARRAY['交換', '取替', '取り替え'],
  NOW(),
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  updated_at = NOW();

-- 脱着の更新/追加
INSERT INTO actions (name, description, keywords, created_at, updated_at)
VALUES (
  '脱着',
  '脱着関連の作業動作',
  ARRAY['脱着', '取り外し', '取付', '取り付け'],
  NOW(),
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  updated_at = NOW();

-- 溶接の更新/追加
INSERT INTO actions (name, description, keywords, created_at, updated_at)
VALUES (
  '溶接',
  '溶接関連の作業動作',
  ARRAY['溶接', '接合'],
  NOW(),
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  updated_at = NOW();

-- 切断の更新/追加
INSERT INTO actions (name, description, keywords, created_at, updated_at)
VALUES (
  '切断',
  '切断関連の作業動作',
  ARRAY['切断', '切替', '切り替え'],
  NOW(),
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  updated_at = NOW();

-- 製作の更新/追加
INSERT INTO actions (name, description, keywords, created_at, updated_at)
VALUES (
  '製作',
  '製作関連の作業動作',
  ARRAY['製作', '制作'],
  NOW(),
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  updated_at = NOW();

-- 修理の更新/追加
INSERT INTO actions (name, description, keywords, created_at, updated_at)
VALUES (
  '修理',
  '修理関連の作業動作',
  ARRAY['修理', '修正', '補修'],
  NOW(),
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  updated_at = NOW();

-- 塗装の更新/追加
INSERT INTO actions (name, description, keywords, created_at, updated_at)
VALUES (
  '塗装',
  '塗装関連の作業動作',
  ARRAY['塗装', '研磨', '仕上げ'],
  NOW(),
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  updated_at = NOW();

-- 加工の更新/追加
INSERT INTO actions (name, description, keywords, created_at, updated_at)
VALUES (
  '加工',
  '加工関連の作業動作',
  ARRAY['加工', '調整', '直し', '曲がり直し'],
  NOW(),
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  updated_at = NOW();

-- 張替の更新/追加
INSERT INTO actions (name, description, keywords, created_at, updated_at)
VALUES (
  '張替',
  '張替関連の作業動作',
  ARRAY['張替', '張り替え'],
  NOW(),
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  updated_at = NOW();

-- 打替の更新/追加
INSERT INTO actions (name, description, keywords, created_at, updated_at)
VALUES (
  '打替',
  '打替関連の作業動作',
  ARRAY['打ち換え', '打替', 'リベット打ち換え'],
  NOW(),
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  updated_at = NOW();


-- =====================================
-- 3. POSITIONS (位置マスター) の更新
-- =====================================

-- 左の更新/追加
INSERT INTO positions (name, description, keywords, created_at, updated_at)
VALUES (
  '左',
  '左関連の位置情報',
  ARRAY['左'],
  NOW(),
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  updated_at = NOW();

-- 右の更新/追加
INSERT INTO positions (name, description, keywords, created_at, updated_at)
VALUES (
  '右',
  '右関連の位置情報',
  ARRAY['右'],
  NOW(),
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  updated_at = NOW();

-- 前の更新/追加
INSERT INTO positions (name, description, keywords, created_at, updated_at)
VALUES (
  '前',
  '前関連の位置情報',
  ARRAY['前'],
  NOW(),
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  updated_at = NOW();

-- 後の更新/追加
INSERT INTO positions (name, description, keywords, created_at, updated_at)
VALUES (
  '後',
  '後関連の位置情報',
  ARRAY['後', 'リヤ'],
  NOW(),
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  updated_at = NOW();

-- 上の更新/追加
INSERT INTO positions (name, description, keywords, created_at, updated_at)
VALUES (
  '上',
  '上関連の位置情報',
  ARRAY['上', '上側'],
  NOW(),
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  updated_at = NOW();

-- 下の更新/追加
INSERT INTO positions (name, description, keywords, created_at, updated_at)
VALUES (
  '下',
  '下関連の位置情報',
  ARRAY['下', '下側'],
  NOW(),
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  updated_at = NOW();

-- 内の更新/追加
INSERT INTO positions (name, description, keywords, created_at, updated_at)
VALUES (
  '内',
  '内関連の位置情報',
  ARRAY['内', '内側', 'インナー'],
  NOW(),
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  updated_at = NOW();

-- 外の更新/追加
INSERT INTO positions (name, description, keywords, created_at, updated_at)
VALUES (
  '外',
  '外関連の位置情報',
  ARRAY['外', '外側', 'アウター'],
  NOW(),
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  updated_at = NOW();

-- 中央の更新/追加
INSERT INTO positions (name, description, keywords, created_at, updated_at)
VALUES (
  '中央',
  '中央関連の位置情報',
  ARRAY['中央', 'センター'],
  NOW(),
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  updated_at = NOW();


-- =====================================
-- 4. 古いデータのクリーンアップ
-- =====================================

-- 今回の更新で含まれていない古いデータを削除
DELETE FROM targets WHERE updated_at < '2025-09-01' AND name NOT IN ('フェンダー', 'バンパー', 'ドア', 'ハンドル', 'タンク', 'ランプ', 'ステー', 'ガード', 'パイプ', 'カバー', 'シート', '鋼板', '反射板', 'ガラス', 'ゴム', 'キャッチ', 'グリル', 'ミラー', 'レール', 'メンバー');
DELETE FROM actions WHERE updated_at < '2025-09-01' AND name NOT IN ('交換', '脱着', '溶接', '切断', '製作', '修理', '塗装', '加工', '張替', '打替');
DELETE FROM positions WHERE updated_at < '2025-09-01' AND name NOT IN ('左', '右', '前', '後', '上', '下', '内', '外', '中央');

-- =====================================
-- 5. 更新結果確認
-- =====================================

SELECT 'targets' as table_name, COUNT(*) as record_count FROM targets
UNION ALL
SELECT 'actions' as table_name, COUNT(*) as record_count FROM actions  
UNION ALL
SELECT 'positions' as table_name, COUNT(*) as record_count FROM positions;
