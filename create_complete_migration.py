#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
from datetime import datetime

def create_complete_migration():
    """完全辞書からマイグレーションSQLを生成"""
    
    # 完全辞書CSVを読み込み
    targets_df = pd.read_csv('請求書システム画像/hondata/complete_targets.csv')
    actions_df = pd.read_csv('請求書システム画像/hondata/complete_actions.csv')
    positions_df = pd.read_csv('請求書システム画像/hondata/complete_positions.csv')
    
    print(f"Complete Targets: {len(targets_df)} items")
    print(f"Complete Actions: {len(actions_df)} items")
    print(f"Complete Positions: {len(positions_df)} items")
    
    # SQLファイル生成
    sql_content = f"""-- Complete business dictionary migration from real invoice data
-- Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
-- Total items: {len(targets_df) + len(actions_df) + len(positions_df)}

-- Clear existing data first (delete dependent data first)
DELETE FROM work_history;
DELETE FROM work_set_details;
DELETE FROM work_sets;
DELETE FROM price_suggestions;
DELETE FROM target_actions;
DELETE FROM action_positions;
DELETE FROM reading_mappings;
DELETE FROM targets;
DELETE FROM actions;
DELETE FROM positions;

-- Insert ALL target keywords from real data
INSERT INTO targets (name, sort_order, is_active) VALUES
"""
    
    # 全Targetsを挿入
    target_values = []
    for idx, row in targets_df.iterrows():
        name = row['name'].replace("'", "''")  # エスケープ
        target_values.append(f"('{name}', {idx + 1}, true)")
    
    sql_content += ',\n'.join(target_values) + ";\n\n"
    
    # 全Actionsを挿入
    sql_content += "-- Insert ALL action keywords from real data\n"
    sql_content += "INSERT INTO actions (name, sort_order, is_active) VALUES\n"
    
    action_values = []
    for idx, row in actions_df.iterrows():
        name = row['name'].replace("'", "''")  # エスケープ
        action_values.append(f"('{name}', {idx + 1}, true)")
    
    sql_content += ',\n'.join(action_values) + ";\n\n"
    
    # 全Positionsを挿入
    sql_content += "-- Insert ALL position keywords from real data\n"
    sql_content += "INSERT INTO positions (name, sort_order, is_active) VALUES\n"
    
    position_values = []
    for idx, row in positions_df.iterrows():
        name = row['name'].replace("'", "''")  # エスケープ
        position_values.append(f"('{name}', {idx + 1}, true)")
    
    sql_content += ',\n'.join(position_values) + ";\n\n"
    
    # 結果確認
    sql_content += f"""-- Verify results
SELECT 'targets' as table_name, COUNT(*) as record_count FROM targets
UNION ALL
SELECT 'actions' as table_name, COUNT(*) as record_count FROM actions  
UNION ALL
SELECT 'positions' as table_name, COUNT(*) as record_count FROM positions;

-- Sample high-frequency keywords
SELECT 'HIGH FREQ TARGETS' as category, name, sort_order FROM targets WHERE sort_order <= 10 ORDER BY sort_order;
SELECT 'HIGH FREQ ACTIONS' as category, name, sort_order FROM actions WHERE sort_order <= 10 ORDER BY sort_order;
SELECT 'HIGH FREQ POSITIONS' as category, name, sort_order FROM positions WHERE sort_order <= 5 ORDER BY sort_order;

-- Expected counts: targets={len(targets_df)}, actions={len(actions_df)}, positions={len(positions_df)}
-- Total business keywords: {len(targets_df) + len(actions_df) + len(positions_df)}
"""
    
    # ファイルに保存
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    filename = f'supabase/migrations/{timestamp}_complete_business_dictionary.sql'
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(sql_content)
    
    print(f"完全業務辞書マイグレーション生成完了: {filename}")
    print(f"総キーワード数: {len(targets_df) + len(actions_df) + len(positions_df)}個")
    print(f"内訳:")
    print(f"  - Targets: {len(targets_df)}個 (タイヤ・ホイール含む)")
    print(f"  - Actions: {len(actions_df)}個")
    print(f"  - Positions: {len(positions_df)}個")
    
    return filename

if __name__ == "__main__":
    create_complete_migration()