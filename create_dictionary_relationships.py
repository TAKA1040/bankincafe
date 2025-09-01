#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
import re
from collections import defaultdict

def create_dictionary_relationships():
    """詳細辞書マスターから関連設定を自動生成"""
    
    print("=== 辞書関連設定の自動生成開始 ===")
    
    # 分類済みデータ読み込み
    df = pd.read_csv('batch_processing/final_4088_classified_work_items.csv')
    
    # 詳細マスター読み込み
    targets_df = pd.read_csv('batch_processing/detailed_targets_master.csv')
    actions_df = pd.read_csv('batch_processing/detailed_actions_master.csv')  
    positions_df = pd.read_csv('batch_processing/detailed_positions_master.csv')
    
    print(f"詳細対象マスター: {len(targets_df)}種類")
    print(f"詳細動作マスター: {len(actions_df)}種類") 
    print(f"詳細位置マスター: {len(positions_df)}種類")
    
    # マスター名とIDのマッピング作成
    target_name_to_id = dict(zip(targets_df['name'], targets_df['id']))
    action_name_to_id = dict(zip(actions_df['name'], actions_df['id']))
    position_name_to_id = dict(zip(positions_df['name'], positions_df['id']))
    
    # 関連設定のカウンタ
    target_action_pairs = defaultdict(int)
    action_position_pairs = defaultdict(int)
    target_action_position_triples = defaultdict(int)
    
    # 実データから関連性を抽出
    for _, row in df.iterrows():
        work_item = str(row['work_item'])
        target = str(row.get('classified_target', ''))
        action = str(row.get('classified_action', ''))
        position = str(row.get('classified_position', ''))
        
        if pd.isna(work_item) or work_item == 'nan':
            continue
            
        # 対象-動作の関連を抽出
        matched_targets = []
        matched_actions = []
        matched_positions = []
        
        # 対象マスターからマッチング
        for target_name in targets_df['name']:
            if re.search(target_name, work_item, re.IGNORECASE):
                matched_targets.append(target_name)
        
        # 動作マスターからマッチング
        for action_name in actions_df['name']:
            if re.search(action_name, work_item, re.IGNORECASE):
                matched_actions.append(action_name)
        
        # 位置マスターからマッチング
        for position_name in positions_df['name']:
            if re.search(position_name, work_item, re.IGNORECASE):
                matched_positions.append(position_name)
        
        # 関連設定をカウント
        for target_name in matched_targets:
            for action_name in matched_actions:
                target_id = target_name_to_id[target_name]
                action_id = action_name_to_id[action_name]
                target_action_pairs[(target_id, action_id)] += 1
                
                # 位置も含む3段階関連
                for position_name in matched_positions:
                    position_id = position_name_to_id[position_name]
                    target_action_position_triples[(target_id, action_id, position_id)] += 1
        
        # 動作-位置の関連
        for action_name in matched_actions:
            for position_name in matched_positions:
                action_id = action_name_to_id[action_name]
                position_id = position_name_to_id[position_name]
                action_position_pairs[(action_id, position_id)] += 1
    
    print(f"\n=== 関連性抽出結果 ===")
    print(f"対象-動作関連: {len(target_action_pairs)}組み合わせ")
    print(f"動作-位置関連: {len(action_position_pairs)}組み合わせ")
    print(f"3段階関連: {len(target_action_position_triples)}組み合わせ")
    
    # 対象-動作関連のCSV作成
    target_action_data = []
    for (target_id, action_id), count in sorted(target_action_pairs.items(), key=lambda x: x[1], reverse=True):
        target_name = targets_df[targets_df['id'] == target_id]['name'].iloc[0]
        action_name = actions_df[actions_df['id'] == action_id]['name'].iloc[0]
        target_action_data.append({
            'target_id': target_id,
            'action_id': action_id,
            'target_name': target_name,
            'action_name': action_name,
            'frequency': count,
            'is_recommended': count >= 3  # 3回以上出現したものを推奨とする
        })
    
    target_actions_df = pd.DataFrame(target_action_data)
    target_actions_df.to_csv('batch_processing/target_actions_relationships.csv', index=False, encoding='utf-8')
    
    # 動作-位置関連のCSV作成
    action_position_data = []
    for (action_id, position_id), count in sorted(action_position_pairs.items(), key=lambda x: x[1], reverse=True):
        action_name = actions_df[actions_df['id'] == action_id]['name'].iloc[0]
        position_name = positions_df[positions_df['id'] == position_id]['name'].iloc[0]
        action_position_data.append({
            'action_id': action_id,
            'position_id': position_id,
            'action_name': action_name,
            'position_name': position_name,
            'frequency': count,
            'is_recommended': count >= 2  # 2回以上出現したものを推奨とする
        })
    
    action_positions_df = pd.DataFrame(action_position_data)
    action_positions_df.to_csv('batch_processing/action_positions_relationships.csv', index=False, encoding='utf-8')
    
    # 3段階関連のCSV作成
    triple_data = []
    for (target_id, action_id, position_id), count in sorted(target_action_position_triples.items(), key=lambda x: x[1], reverse=True):
        target_name = targets_df[targets_df['id'] == target_id]['name'].iloc[0]
        action_name = actions_df[actions_df['id'] == action_id]['name'].iloc[0]
        position_name = positions_df[positions_df['id'] == position_id]['name'].iloc[0]
        triple_data.append({
            'target_id': target_id,
            'action_id': action_id,
            'position_id': position_id,
            'target_name': target_name,
            'action_name': action_name,
            'position_name': position_name,
            'frequency': count,
            'is_recommended': count >= 2
        })
    
    triples_df = pd.DataFrame(triple_data)
    triples_df.to_csv('batch_processing/target_action_position_relationships.csv', index=False, encoding='utf-8')
    
    # SQLマイグレーション生成
    timestamp = "20250902021500"
    filename = f'supabase/migrations/{timestamp}_dictionary_relationships.sql'
    
    sql_content = f"""-- Dictionary Relationships Migration
-- Generated from 4088 real work items analysis
-- Target-Action relationships: {len(target_action_pairs)} pairs
-- Action-Position relationships: {len(action_position_pairs)} pairs
-- 3-stage relationships: {len(target_action_position_triples)} triples

-- Clear existing relationships
DELETE FROM target_action_positions;
DELETE FROM target_actions;
DELETE FROM action_positions;

-- Insert Target-Action relationships
INSERT INTO target_actions (target_id, action_id, frequency, is_recommended) VALUES
"""
    
    # target_actions挿入
    target_action_values = []
    for _, row in target_actions_df.iterrows():
        target_action_values.append(f"({row['target_id']}, {row['action_id']}, {row['frequency']}, {str(row['is_recommended']).lower()})")
    
    sql_content += ',\n'.join(target_action_values) + ";\n\n"
    
    # action_positions挿入  
    sql_content += "-- Insert Action-Position relationships\n"
    sql_content += "INSERT INTO action_positions (action_id, position_id, frequency, is_recommended) VALUES\n"
    
    action_position_values = []
    for _, row in action_positions_df.iterrows():
        action_position_values.append(f"({row['action_id']}, {row['position_id']}, {row['frequency']}, {str(row['is_recommended']).lower()})")
    
    sql_content += ',\n'.join(action_position_values) + ";\n\n"
    
    # 3段階関連挿入（テーブルが存在する場合）
    sql_content += "-- Insert Target-Action-Position 3-stage relationships (if table exists)\n"
    sql_content += "INSERT INTO target_action_positions (target_id, action_id, position_id, frequency, is_recommended) VALUES\n"
    
    triple_values = []
    for _, row in triples_df.iterrows():
        triple_values.append(f"({row['target_id']}, {row['action_id']}, {row['position_id']}, {row['frequency']}, {str(row['is_recommended']).lower()})")
    
    sql_content += ',\n'.join(triple_values) + ";\n\n"
    
    # 結果確認クエリ
    sql_content += f"""-- Verify relationships
SELECT 'target_actions' as table_name, COUNT(*) as total_count, COUNT(*) FILTER (WHERE is_recommended = true) as recommended_count FROM target_actions
UNION ALL
SELECT 'action_positions' as table_name, COUNT(*) as total_count, COUNT(*) FILTER (WHERE is_recommended = true) as recommended_count FROM action_positions
UNION ALL  
SELECT 'target_action_positions' as table_name, COUNT(*) as total_count, COUNT(*) FILTER (WHERE is_recommended = true) as recommended_count FROM target_action_positions;

-- Sample high-frequency relationships
SELECT 'TOP TARGET-ACTION PAIRS' as category, t.name as target_name, a.name as action_name, ta.frequency
FROM target_actions ta
JOIN targets t ON ta.target_id = t.id
JOIN actions a ON ta.action_id = a.id
WHERE ta.is_recommended = true
ORDER BY ta.frequency DESC
LIMIT 20;
"""
    
    # ファイルに保存
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(sql_content)
    
    print(f"\n=== 関連設定生成完了 ===")
    print(f"対象-動作関連: {len(target_action_data)}組み合わせ")
    print(f"動作-位置関連: {len(action_position_data)}組み合わせ")
    print(f"3段階関連: {len(triple_data)}組み合わせ")
    print(f"マイグレーションファイル: {filename}")
    
    # 推奨関連の統計
    recommended_target_actions = sum(1 for row in target_action_data if row['is_recommended'])
    recommended_action_positions = sum(1 for row in action_position_data if row['is_recommended'])
    recommended_triples = sum(1 for row in triple_data if row['is_recommended'])
    
    print(f"\n=== 推奨関連統計 ===")
    print(f"推奨対象-動作: {recommended_target_actions}組み合わせ")
    print(f"推奨動作-位置: {recommended_action_positions}組み合わせ")
    print(f"推奨3段階: {recommended_triples}組み合わせ")
    
    return {
        'target_actions': len(target_action_data),
        'action_positions': len(action_position_data),
        'triples': len(triple_data),
        'recommended_target_actions': recommended_target_actions,
        'recommended_action_positions': recommended_action_positions,
        'recommended_triples': recommended_triples,
        'migration_file': filename
    }

if __name__ == "__main__":
    result = create_dictionary_relationships()
    print(f"\n[SUCCESS] 辞書関連設定の自動生成完了!")
    print(f"次のステップ: supabase db push で関連設定を適用")