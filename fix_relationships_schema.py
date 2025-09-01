#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
import re
from collections import defaultdict

def create_simple_relationships():
    """既存テーブル構造に合わせて関連設定を生成"""
    
    print("=== 簡潔版関連設定生成開始 ===")
    
    # 分類済みデータ読み込み
    df = pd.read_csv('batch_processing/final_4088_classified_work_items.csv')
    
    # 詳細マスター読み込み
    targets_df = pd.read_csv('batch_processing/detailed_targets_master.csv')
    actions_df = pd.read_csv('batch_processing/detailed_actions_master.csv')  
    positions_df = pd.read_csv('batch_processing/detailed_positions_master.csv')
    
    # マスター名とIDのマッピング作成
    target_name_to_id = dict(zip(targets_df['name'], targets_df['id']))
    action_name_to_id = dict(zip(actions_df['name'], actions_df['id']))
    position_name_to_id = dict(zip(positions_df['name'], positions_df['id']))
    
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
            if re.search(re.escape(target_name), work_item, re.IGNORECASE):
                matched_targets.append(target_name)
        
        # 動作マスターからマッチング
        for action_name in actions_df['name']:
            if re.search(re.escape(action_name), work_item, re.IGNORECASE):
                matched_actions.append(action_name)
        
        # 位置マスターからマッチング
        for position_name in positions_df['name']:
            if re.search(re.escape(position_name), work_item, re.IGNORECASE):
                matched_positions.append(position_name)
        
        # 関連設定を追加
        for target_name in matched_targets:
            for action_name in matched_actions:
                target_id = target_name_to_id[target_name]
                action_id = action_name_to_id[action_name]
                target_action_pairs.add((target_id, action_id))
        
        # 動作-位置の関連
        for action_name in matched_actions:
            for position_name in matched_positions:
                action_id = action_name_to_id[action_name]
                position_id = position_name_to_id[position_name]
                action_position_pairs.add((action_id, position_id))
    
    print(f"対象-動作関連: {len(target_action_pairs)}組み合わせ")
    print(f"動作-位置関連: {len(action_position_pairs)}組み合わせ")
    
    # SQLマイグレーション生成（既存スキーマに合わせる）
    timestamp = "20250902021600"
    filename = f'supabase/migrations/{timestamp}_simple_dictionary_relationships.sql'
    
    sql_content = f"""-- Simple Dictionary Relationships Migration
-- Compatible with existing table schema
-- Target-Action relationships: {len(target_action_pairs)} pairs
-- Action-Position relationships: {len(action_position_pairs)} pairs

-- Clear existing relationships
DELETE FROM target_actions;
DELETE FROM action_positions;

-- Insert Target-Action relationships (basic schema)
INSERT INTO target_actions (target_id, action_id) VALUES
"""
    
    # target_actions挿入（基本スキーマに合わせる）
    target_action_values = []
    for target_id, action_id in sorted(target_action_pairs):
        target_action_values.append(f"({target_id}, {action_id})")
    
    sql_content += ',\n'.join(target_action_values) + ";\n\n"
    
    # action_positions挿入
    sql_content += "-- Insert Action-Position relationships (basic schema)\n"
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
SELECT 'TARGET-ACTION PAIRS' as category, t.name as target_name, a.name as action_name
FROM target_actions ta
JOIN targets t ON ta.target_id = t.id
JOIN actions a ON ta.action_id = a.id
ORDER BY t.sort_order, a.sort_order
LIMIT 20;

-- Expected results:
-- target_actions: {len(target_action_pairs)} relationships
-- action_positions: {len(action_position_pairs)} relationships
"""
    
    # ファイルに保存
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(sql_content)
    
    print(f"\n=== 簡潔版関連設定生成完了 ===")
    print(f"マイグレーションファイル: {filename}")
    print(f"対象-動作関連: {len(target_action_pairs)}組み合わせ")
    print(f"動作-位置関連: {len(action_position_pairs)}組み合わせ")
    
    return {
        'target_actions': len(target_action_pairs),
        'action_positions': len(action_position_pairs),
        'migration_file': filename
    }

if __name__ == "__main__":
    result = create_simple_relationships()
    print(f"\n[SUCCESS] 既存スキーマ対応の関連設定生成完了!")
    print(f"次のステップ: supabase db push で関連設定を適用")