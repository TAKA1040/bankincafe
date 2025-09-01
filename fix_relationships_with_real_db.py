#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import requests
import pandas as pd
import re
from collections import defaultdict
import os

def get_real_db_data():
    """実際のSupabaseデータベースから現在のIDとデータを取得"""
    
    supabase_url = "https://auwmmosfteomieyexkeh.supabase.co"
    api_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1d21tb3NmdGVvbWlleWV4a2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzcxNTYsImV4cCI6MjA3MTAxMzE1Nn0.9SsGplOy1PQak1y7WLfzadvTOfm4NuuX8254lEctvj0"
    
    headers = {
        "apikey": api_key,
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    try:
        # 対象データ取得
        print("対象データ取得中...")
        targets_response = requests.get(
            f"{supabase_url}/rest/v1/targets?select=*&order=sort_order",
            headers=headers
        )
        targets_data = targets_response.json()
        print(f"対象データ: {len(targets_data)}件")
        
        # 動作データ取得
        print("動作データ取得中...")
        actions_response = requests.get(
            f"{supabase_url}/rest/v1/actions?select=*&order=sort_order",
            headers=headers
        )
        actions_data = actions_response.json()
        print(f"動作データ: {len(actions_data)}件")
        
        # 位置データ取得
        print("位置データ取得中...")
        positions_response = requests.get(
            f"{supabase_url}/rest/v1/positions?select=*&order=sort_order",
            headers=headers
        )
        positions_data = positions_response.json()
        print(f"位置データ: {len(positions_data)}件")
        
        return targets_data, actions_data, positions_data
        
    except Exception as e:
        print(f"データベース接続エラー: {e}")
        return None, None, None

def create_relationships_with_real_ids():
    """実際のデータベースIDを使用して関連設定を生成"""
    
    print("=== 実データベースID使用の関連設定生成 ===")
    
    # 実際のDBデータ取得
    targets_data, actions_data, positions_data = get_real_db_data()
    
    if not targets_data:
        print("データベースアクセスに失敗しました")
        return None
    
    # 分類済みデータ読み込み
    df = pd.read_csv('batch_processing/final_4088_classified_work_items.csv')
    
    # 実データベースからのマッピング作成
    target_name_to_id = {item['name']: item['id'] for item in targets_data}
    action_name_to_id = {item['name']: item['id'] for item in actions_data}
    position_name_to_id = {item['name']: item['id'] for item in positions_data}
    
    print(f"実DB対象マッピング: {len(target_name_to_id)}件")
    print(f"実DB動作マッピング: {len(action_name_to_id)}件")
    print(f"実DB位置マッピング: {len(position_name_to_id)}件")
    
    # 関連設定のセット
    target_action_pairs = set()
    action_position_pairs = set()
    
    # 基本的な関連設定を追加（確実に動作するもの）
    basic_target_names = ['ドア', 'サイドガード', 'ステー', 'ブラケット', 'パイプ']
    basic_action_names = ['取替', '脱着', '溶接', '加工', '交換', '修理']
    basic_position_names = ['左', '右', '外', 'サイド', 'フロント']
    
    # 基本的な対象-動作関連
    for target_name in basic_target_names:
        if target_name in target_name_to_id:
            for action_name in basic_action_names:
                if action_name in action_name_to_id:
                    target_id = target_name_to_id[target_name]
                    action_id = action_name_to_id[action_name]
                    target_action_pairs.add((target_id, action_id))
    
    # 基本的な動作-位置関連
    for action_name in basic_action_names:
        if action_name in action_name_to_id:
            for position_name in basic_position_names:
                if position_name in position_name_to_id:
                    action_id = action_name_to_id[action_name]
                    position_id = position_name_to_id[position_name]
                    action_position_pairs.add((action_id, position_id))
    
    # 全対象に基本動作を追加
    for target_name in target_name_to_id.keys():
        for action_name in ['取替', '脱着', '修理']:
            if action_name in action_name_to_id:
                target_id = target_name_to_id[target_name]
                action_id = action_name_to_id[action_name]
                target_action_pairs.add((target_id, action_id))
    
    # 全動作に基本位置を追加
    for action_name in action_name_to_id.keys():
        for position_name in ['左', '右']:
            if position_name in position_name_to_id:
                action_id = action_name_to_id[action_name]
                position_id = position_name_to_id[position_name]
                action_position_pairs.add((action_id, position_id))
    
    print(f"対象-動作関連: {len(target_action_pairs)}組み合わせ")
    print(f"動作-位置関連: {len(action_position_pairs)}組み合わせ")
    
    # SQLマイグレーション生成
    timestamp = "20250902021800"
    filename = f'supabase/migrations/{timestamp}_real_db_relationships.sql'
    
    sql_content = f"""-- Real Database Relationships Migration  
-- Using actual database IDs from live Supabase instance
-- Target-Action relationships: {len(target_action_pairs)} pairs
-- Action-Position relationships: {len(action_position_pairs)} pairs

-- Clear existing relationships
DELETE FROM target_actions;
DELETE FROM action_positions;

-- Insert Target-Action relationships (using real DB IDs)
INSERT INTO target_actions (target_id, action_id) VALUES
"""
    
    # target_actions挿入
    target_action_values = []
    for target_id, action_id in sorted(target_action_pairs):
        target_action_values.append(f"({target_id}, {action_id})")
    
    sql_content += ',\n'.join(target_action_values) + ";\n\n"
    
    # action_positions挿入
    sql_content += "-- Insert Action-Position relationships (using real DB IDs)\n"
    sql_content += "INSERT INTO action_positions (action_id, position_id) VALUES\n"
    
    action_position_values = []
    for action_id, position_id in sorted(action_position_pairs):
        action_position_values.append(f"({action_id}, {position_id})")
    
    sql_content += ',\n'.join(action_position_values) + ";\n\n"
    
    # 結果確認クエリ
    sql_content += f"""-- Verify relationships with actual data
SELECT 'target_actions' as table_name, COUNT(*) as total_count FROM target_actions
UNION ALL
SELECT 'action_positions' as table_name, COUNT(*) as total_count FROM action_positions;

-- Display actual relationships with names
SELECT 'WORKING TARGET-ACTION PAIRS' as info, t.name as target_name, a.name as action_name
FROM target_actions ta
JOIN targets t ON ta.target_id = t.id
JOIN actions a ON ta.action_id = a.id
ORDER BY t.sort_order, a.sort_order
LIMIT 20;
"""
    
    # ファイルに保存
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(sql_content)
    
    print(f"\n=== 実データベースID関連設定完了 ===")
    print(f"マイグレーションファイル: {filename}")
    print(f"対象-動作関連: {len(target_action_pairs)}組み合わせ")
    print(f"動作-位置関連: {len(action_position_pairs)}組み合わせ")
    
    # IDサンプル表示
    print(f"\n=== 実際のIDサンプル ===")
    for i, (name, db_id) in enumerate(list(target_name_to_id.items())[:5]):
        print(f"対象「{name}」: DB ID = {db_id}")
    for i, (name, db_id) in enumerate(list(action_name_to_id.items())[:5]):
        print(f"動作「{name}」: DB ID = {db_id}")
    
    return {
        'target_actions': len(target_action_pairs),
        'action_positions': len(action_position_pairs),
        'migration_file': filename
    }

if __name__ == "__main__":
    result = create_relationships_with_real_ids()
    if result:
        print(f"\n[SUCCESS] 実データベース対応の関連設定生成完了!")
        print(f"次のステップ: supabase db push で関連設定を適用")
    else:
        print(f"\n[ERROR] 関連設定生成に失敗しました")