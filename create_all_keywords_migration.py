#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
from datetime import datetime

def generate_all_keywords_migration():
    """CSVファイルから全キーワードを含む完全な辞書マイグレーションSQLを生成"""
    
    # CSVファイルを読み込み
    targets_df = pd.read_csv('請求書システム画像/hondata/targets_dictionary.csv')
    actions_df = pd.read_csv('請求書システム画像/hondata/actions_dictionary.csv')  
    positions_df = pd.read_csv('請求書システム画像/hondata/positions_dictionary.csv')
    
    # 空行を除去
    targets_df = targets_df.dropna()
    actions_df = actions_df.dropna()
    positions_df = positions_df.dropna()
    
    print(f"Targets: {len(targets_df)} keywords")
    print(f"Actions: {len(actions_df)} keywords")
    print(f"Positions: {len(positions_df)} keywords")
    
    # SQLファイル生成
    sql_content = f"""-- All keywords dictionary migration from real data
-- Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
-- Total keywords: {len(targets_df) + len(actions_df) + len(positions_df)}

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

-- Insert ALL target keywords as individual entries
INSERT INTO targets (name, sort_order, is_active) VALUES
"""
    
    # 全Targetsキーワードを個別に挿入
    target_values = []
    for idx, row in targets_df.iterrows():
        keyword = row['keyword'].replace("'", "''")  # エスケープ
        target_values.append(f"('{keyword}', {idx + 1}, true)")
    
    sql_content += ',\n'.join(target_values) + ";\n\n"
    
    # 全Actionsキーワードを個別に挿入
    sql_content += "-- Insert ALL action keywords as individual entries\n"
    sql_content += "INSERT INTO actions (name, sort_order, is_active) VALUES\n"
    
    action_values = []
    for idx, row in actions_df.iterrows():
        keyword = row['keyword'].replace("'", "''")  # エスケープ
        action_values.append(f"('{keyword}', {idx + 1}, true)")
    
    sql_content += ',\n'.join(action_values) + ";\n\n"
    
    # 全Positionsキーワードを個別に挿入
    sql_content += "-- Insert ALL position keywords as individual entries\n"
    sql_content += "INSERT INTO positions (name, sort_order, is_active) VALUES\n"
    
    position_values = []
    for idx, row in positions_df.iterrows():
        keyword = row['keyword'].replace("'", "''")  # エスケープ
        position_values.append(f"('{keyword}', {idx + 1}, true)")
    
    sql_content += ',\n'.join(position_values) + ";\n\n"
    
    # 結果確認
    sql_content += f"""-- Check results
SELECT 'targets' as table_name, COUNT(*) as record_count FROM targets
UNION ALL
SELECT 'actions' as table_name, COUNT(*) as record_count FROM actions  
UNION ALL
SELECT 'positions' as table_name, COUNT(*) as record_count FROM positions;

-- Display sample data (first 10 entries from each)
SELECT 'TARGET KEYWORDS' as info, name, sort_order FROM targets ORDER BY sort_order LIMIT 10;
SELECT 'ACTION KEYWORDS' as info, name, sort_order FROM actions ORDER BY sort_order LIMIT 10;
SELECT 'POSITION KEYWORDS' as info, name, sort_order FROM positions ORDER BY sort_order LIMIT 10;

-- Expected counts: targets={len(targets_df)}, actions={len(actions_df)}, positions={len(positions_df)}
"""
    
    # ファイルに保存
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    filename = f'supabase/migrations/{timestamp}_all_keywords_dictionary.sql'
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(sql_content)
    
    print(f"全キーワード辞書マイグレーション生成完了: {filename}")
    print(f"期待される投入数:")
    print(f"  - Targets: {len(targets_df)}個")
    print(f"  - Actions: {len(actions_df)}個") 
    print(f"  - Positions: {len(positions_df)}個")
    print(f"  - 合計: {len(targets_df) + len(actions_df) + len(positions_df)}個のキーワード")
    
    return filename

if __name__ == "__main__":
    generate_all_keywords_migration()