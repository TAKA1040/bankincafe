#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
import re
from collections import defaultdict

def create_real_relationships():
    """実際のデータベースIDに基づいて関連設定を生成"""
    
    print("=== 実データベースID対応関連設定生成 ===")
    
    # 分類済みデータ読み込み
    df = pd.read_csv('batch_processing/final_4088_classified_work_items.csv')
    
    # 詳細マスター読み込み
    targets_df = pd.read_csv('batch_processing/detailed_targets_master.csv')
    actions_df = pd.read_csv('batch_processing/detailed_actions_master.csv')  
    positions_df = pd.read_csv('batch_processing/detailed_positions_master.csv')
    
    print(f"詳細対象マスター: {len(targets_df)}種類")
    print(f"詳細動作マスター: {len(actions_df)}種類") 
    print(f"詳細位置マスター: {len(positions_df)}種類")
    
    # 実際のIDは1から連番で割り当てられる（PostgreSQLのSERIAL）
    # CSVのIDではなく、名前→実際のsort_orderベースIDマッピングを作成
    target_name_to_db_id = {}
    action_name_to_db_id = {}
    position_name_to_db_id = {}
    
    # sort_order順で実際のIDを割り当て（1から始まる）
    for idx, row in targets_df.sort_values('sort_order').iterrows():
        target_name_to_db_id[row['name']] = row['sort_order']
    
    for idx, row in actions_df.sort_values('sort_order').iterrows():
        action_name_to_db_id[row['name']] = row['sort_order']
    
    for idx, row in positions_df.sort_values('sort_order').iterrows():
        position_name_to_db_id[row['name']] = row['sort_order']
    
    # 関連設定のセット（重複を除去）
    target_action_pairs = set()
    action_position_pairs = set()
    
    # 実データから関連性を抽出
    for _, row in df.iterrows():
        work_item = str(row['work_item'])
        
        if pd.isna(work_item) or work_item == 'nan':
            continue
        
        # マッチした対象・動作・位置
        matched_targets = []
        matched_actions = []
        matched_positions = []
        
        # 対象マスターからマッチング
        for target_name in targets_df['name']:
            # より柔軟なマッチング
            if target_name in work_item or re.search(re.escape(target_name), work_item, re.IGNORECASE):
                matched_targets.append(target_name)
        
        # 動作マスターからマッチング  
        for action_name in actions_df['name']:
            if action_name in work_item or re.search(re.escape(action_name), work_item, re.IGNORECASE):
                matched_actions.append(action_name)
        
        # 位置マスターからマッチング
        for position_name in positions_df['name']:
            if position_name in work_item or re.search(re.escape(position_name), work_item, re.IGNORECASE):
                matched_positions.append(position_name)
        
        # 関連設定を追加
        for target_name in matched_targets:
            for action_name in matched_actions:
                if target_name in target_name_to_db_id and action_name in action_name_to_db_id:
                    target_id = target_name_to_db_id[target_name]
                    action_id = action_name_to_db_id[action_name]
                    target_action_pairs.add((target_id, action_id))
        
        # 動作-位置の関連
        for action_name in matched_actions:
            for position_name in matched_positions:
                if action_name in action_name_to_db_id and position_name in position_name_to_db_id:
                    action_id = action_name_to_db_id[action_name]
                    position_id = position_name_to_db_id[position_name]
                    action_position_pairs.add((action_id, position_id))
    
    print(f"対象-動作関連: {len(target_action_pairs)}組み合わせ")
    print(f"動作-位置関連: {len(action_position_pairs)}組み合わせ")
    
    # 最低限の関連設定を追加（実データで検出されなかった基本的な組み合わせ）
    basic_pairs = set()
    
    # すべての対象に基本動作（取替、脱着、修理、点検）を追加
    basic_actions = ['取替', '脱着', '修理', '点検']
    for target_name in targets_df['name'][:20]:  # 上位20個の対象
        for action_name in basic_actions:
            if target_name in target_name_to_db_id and action_name in action_name_to_db_id:
                target_id = target_name_to_db_id[target_name]
                action_id = action_name_to_db_id[action_name] 
                basic_pairs.add((target_id, action_id))
    
    # 基本関連を追加
    target_action_pairs.update(basic_pairs)
    
    # すべての動作に基本位置（左、右、前、後）を追加
    basic_positions = ['左', '右', '前', '後']
    for action_name in actions_df['name'][:15]:  # 上位15個の動作
        for position_name in basic_positions:
            if action_name in action_name_to_db_id and position_name in position_name_to_db_id:
                action_id = action_name_to_db_id[action_name]
                position_id = position_name_to_db_id[position_name]
                action_position_pairs.add((action_id, position_id))
    
    print(f"基本関連追加後:")
    print(f"対象-動作関連: {len(target_action_pairs)}組み合わせ")
    print(f"動作-位置関連: {len(action_position_pairs)}組み合わせ")
    
    # SQLマイグレーション生成
    timestamp = "20250902021700"
    filename = f'supabase/migrations/{timestamp}_real_dictionary_relationships.sql'
    
    sql_content = f"""-- Real Database ID Dictionary Relationships Migration
-- Based on actual database IDs (sort_order based)
-- Target-Action relationships: {len(target_action_pairs)} pairs
-- Action-Position relationships: {len(action_position_pairs)} pairs

-- Clear existing relationships
DELETE FROM target_actions;
DELETE FROM action_positions;

-- Insert Target-Action relationships
INSERT INTO target_actions (target_id, action_id) VALUES
"""
    
    # target_actions挿入
    target_action_values = []
    for target_id, action_id in sorted(target_action_pairs):
        target_action_values.append(f"({target_id}, {action_id})")
    
    sql_content += ',\n'.join(target_action_values) + ";\n\n"
    
    # action_positions挿入
    sql_content += "-- Insert Action-Position relationships\n"
    sql_content += "INSERT INTO action_positions (action_id, position_id) VALUES\n"
    
    action_position_values = []
    for action_id, position_id in sorted(action_position_pairs):
        action_position_values.append(f"({action_id}, {position_id})")
    
    sql_content += ',\n'.join(action_position_values) + ";\n\n"
    
    # 結果確認クエリ
    sql_content += f"""-- Verify relationships
SELECT 'target_actions' as table_name, COUNT(*) as total_count FROM target_actions
UNION ALL
SELECT 'action_positions' as table_name, COUNT(*) as total_count FROM action_positions;

-- Sample relationships with names
SELECT 'TARGET-ACTION PAIRS (TOP 30)' as category, t.name as target_name, a.name as action_name
FROM target_actions ta
JOIN targets t ON ta.target_id = t.id
JOIN actions a ON ta.action_id = a.id
ORDER BY t.sort_order, a.sort_order
LIMIT 30;

SELECT 'ACTION-POSITION PAIRS (TOP 20)' as category, a.name as action_name, p.name as position_name  
FROM action_positions ap
JOIN actions a ON ap.action_id = a.id
JOIN positions p ON ap.position_id = p.id
ORDER BY a.sort_order, p.sort_order
LIMIT 20;

-- Expected results:
-- target_actions: {len(target_action_pairs)} relationships
-- action_positions: {len(action_position_pairs)} relationships
"""
    
    # ファイルに保存
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(sql_content)
    
    print(f"\n=== 実データベースID対応関連設定完了 ===")
    print(f"マイグレーションファイル: {filename}")
    print(f"対象-動作関連: {len(target_action_pairs)}組み合わせ")
    print(f"動作-位置関連: {len(action_position_pairs)}組み合わせ")
    
    return {
        'target_actions': len(target_action_pairs),
        'action_positions': len(action_position_pairs),
        'migration_file': filename
    }

if __name__ == "__main__":
    result = create_real_relationships()
    print(f"\n[SUCCESS] 実データベースID対応の関連設定生成完了!")
    print(f"次のステップ: supabase db push で関連設定を適用")