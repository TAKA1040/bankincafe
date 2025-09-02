-- 関連データ復旧マイグレーション
-- 2025年9月1日：業務ロジックに基づく対象-動作、動作-位置の関連性を再構築

-- 1. 対象→動作の関連性（target_actions）の復旧
-- 業務ロジック：車体整備における対象と動作の合理的な組み合わせを定義

-- まず既存データをクリア（安全のため）
DELETE FROM target_actions;
DELETE FROM action_positions;

-- 対象→動作の関連性を業務ロジックに基づいて構築
WITH 
target_data AS (
  SELECT id, name FROM targets WHERE is_active = true ORDER BY id
),
action_data AS (
  SELECT id, name FROM actions WHERE is_active = true ORDER BY id
),
-- 業務ルール定義：対象の種類に応じた適用可能な動作を定義
business_rules AS (
  -- ボディパーツ系（ドア、フェンダー、フード等）
  SELECT t.id as target_id, a.id as action_id
  FROM target_data t, action_data a
  WHERE t.name IN ('ドア', 'サイドガード', 'ステー', 'フェンダー', 'フード', 'トランク', 'ボンネット', 'バンパー', 'サイドミラー', 'ピラー', 'パネル', 'カバー')
    AND a.name IN ('取替', '脱着', '鈑金', '溶接', '加工', '修正', '調整', '塗装', '研磨', '清掃')
  
  UNION ALL
  
  -- 電装系（ライト、ウィンカー等）
  SELECT t.id as target_id, a.id as action_id
  FROM target_data t, action_data a
  WHERE t.name IN ('タイヤ灯', 'ヘッドライト', 'テールランプ', 'ウィンカー', 'フォグランプ', '室内灯')
    AND a.name IN ('取替', '脱着', '配線', '点検', '調整', '清掃', '修理')
  
  UNION ALL
  
  -- エンジン・駆動系
  SELECT t.id as target_id, a.id as action_id
  FROM target_data t, action_data a
  WHERE t.name IN ('燃料タンク', 'エンジン', 'トランスミッション', 'ラジエーター', 'バッテリー', 'オイル', 'フィルター')
    AND a.name IN ('取替', '脱着', '点検', '清掃', '修理', '調整', '給油', '交換')
  
  UNION ALL
  
  -- 足回り・シャーシ系
  SELECT t.id as target_id, a.id as action_id
  FROM target_data t, action_data a
  WHERE t.name IN ('タイヤ', 'ホイール', 'ブレーキ', 'サスペンション', 'シャーシ', 'フレーム')
    AND a.name IN ('取替', '脱着', '点検', '調整', '修理', '清掃', 'バランス', '組み付け')
  
  UNION ALL
  
  -- 内装系
  SELECT t.id as target_id, a.id as action_id
  FROM target_data t, action_data a
  WHERE t.name IN ('シート', 'ダッシュボード', 'ハンドル', 'メーター', 'エアコン', 'カーペット')
    AND a.name IN ('取替', '脱着', '清掃', '修理', '調整')
  
  UNION ALL
  
  -- ガラス系
  SELECT t.id as target_id, a.id as action_id
  FROM target_data t, action_data a
  WHERE t.name IN ('フロントガラス', 'リアガラス', 'サイドガラス', 'ウィンドウ')
    AND a.name IN ('取替', '脱着', '修理', '清掃', '研磨')
  
  UNION ALL
  
  -- 一般的な動作（ほぼ全ての対象に適用可能）
  SELECT t.id as target_id, a.id as action_id
  FROM target_data t, action_data a
  WHERE a.name IN ('点検', '清掃', '確認')
)

-- 重複排除して関連データを挿入
INSERT INTO target_actions (target_id, action_id)
SELECT DISTINCT target_id, action_id 
FROM business_rules
WHERE target_id IS NOT NULL AND action_id IS NOT NULL;

-- 2. 動作→位置の関連性（action_positions）の復旧

WITH 
action_data AS (
  SELECT id, name FROM actions WHERE is_active = true ORDER BY id
),
position_data AS (
  SELECT id, name FROM positions WHERE is_active = true ORDER BY id
),
-- 業務ルール定義：動作の種類に応じた適用可能な位置を定義
position_rules AS (
  -- 外装作業（外側での作業）
  SELECT a.id as action_id, p.id as position_id
  FROM action_data a, position_data p
  WHERE a.name IN ('鈑金', '溶接', '塗装', '研磨')
    AND p.name IN ('外', 'フロント', 'リア', '左', '右', 'サイド', '上', '下', 'アッパー', 'ロア')
  
  UNION ALL
  
  -- 内装作業（内側での作業）
  SELECT a.id as action_id, p.id as position_id
  FROM action_data a, position_data p
  WHERE a.name IN ('清掃', '調整', '配線')
    AND p.name IN ('内', '左', '右', 'フロント', 'リア', '上', '下', 'センター')
  
  UNION ALL
  
  -- 脱着作業（位置を問わず実施可能）
  SELECT a.id as action_id, p.id as position_id
  FROM action_data a, position_data p
  WHERE a.name IN ('取替', '脱着', '組み付け')
    AND p.name IN ('左', '右', 'フロント', 'リア', '上', '下', 'アッパー', 'ロア', 'センター', 'サイド')
  
  UNION ALL
  
  -- 点検・確認作業（全位置で実施可能）
  SELECT a.id as action_id, p.id as position_id
  FROM action_data a, position_data p
  WHERE a.name IN ('点検', '確認', '修理')
  
  UNION ALL
  
  -- 位置依存の専門作業
  SELECT a.id as action_id, p.id as position_id
  FROM action_data a, position_data p
  WHERE a.name IN ('加工', '修正', '給油', 'バランス')
    AND p.name IN ('フロント', 'リア', '左', '右', 'センター', '外', '上', '下')
)

-- 重複排除して関連データを挿入
INSERT INTO action_positions (action_id, position_id)
SELECT DISTINCT action_id, position_id 
FROM position_rules
WHERE action_id IS NOT NULL AND position_id IS NOT NULL;

-- 実行結果のログ出力
DO $$
DECLARE
    target_action_count INTEGER;
    action_position_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO target_action_count FROM target_actions;
    SELECT COUNT(*) INTO action_position_count FROM action_positions;
    
    RAISE NOTICE '関連データ復旧完了:';
    RAISE NOTICE '  target_actions: %件', target_action_count;
    RAISE NOTICE '  action_positions: %件', action_position_count;
END $$;