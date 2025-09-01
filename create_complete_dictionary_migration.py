#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
from datetime import datetime

def generate_complete_migration():
    """CSVファイルから完全な辞書マイグレーションSQLを生成"""
    
    # CSVファイルを読み込み
    targets_df = pd.read_csv('請求書システム画像/hondata/targets_dictionary.csv')
    actions_df = pd.read_csv('請求書システム画像/hondata/actions_dictionary.csv')
    positions_df = pd.read_csv('請求書システム画像/hondata/positions_dictionary.csv')
    
    # 空行を除去
    targets_df = targets_df.dropna()
    actions_df = actions_df.dropna()
    positions_df = positions_df.dropna()
    
    print(f"Targets: {len(targets_df)} rows")
    print(f"Actions: {len(actions_df)} rows")
    print(f"Positions: {len(positions_df)} rows")
    
    # SQLファイル生成
    sql_content = f"""-- Complete dictionary migration from real data
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

-- Insert all targets with keywords
"""
    
    # Targetsの挿入
    targets_by_category = targets_df.groupby('category')
    sql_content += "INSERT INTO targets (name, sort_order, is_active) VALUES\n"
    target_values = []
    sort_order = 1
    
    for category, group in targets_by_category:
        target_values.append(f"('{category}', {sort_order}, true)")
        sort_order += 1
    
    sql_content += ',\n'.join(target_values) + ";\n\n"
    
    # Actionsの挿入
    actions_by_category = actions_df.groupby('category')
    sql_content += "INSERT INTO actions (name, sort_order, is_active) VALUES\n"
    action_values = []
    sort_order = 1
    
    for category, group in actions_by_category:
        action_values.append(f"('{category}', {sort_order}, true)")
        sort_order += 1
    
    sql_content += ',\n'.join(action_values) + ";\n\n"
    
    # Positionsの挿入
    positions_by_category = positions_df.groupby('category')
    sql_content += "INSERT INTO positions (name, sort_order, is_active) VALUES\n"
    position_values = []
    sort_order = 1
    
    for category, group in positions_by_category:
        position_values.append(f"('{category}', {sort_order}, true)")
        sort_order += 1
    
    sql_content += ',\n'.join(position_values) + ";\n\n"
    
    # 読み仮名マッピング（キーワード）の挿入
    sql_content += "-- Insert reading mappings for all keywords\n"
    sql_content += "INSERT INTO reading_mappings (word, reading_hiragana, reading_katakana, word_type) VALUES\n"
    
    reading_values = []
    
    # Targetsのキーワード
    for _, row in targets_df.iterrows():
        if row['keyword'] != row['category']:  # 基本カテゴリと違うキーワードのみ
            reading_values.append(f"('{row['keyword']}', '', '', 'target')")
    
    # Actionsのキーワード
    for _, row in actions_df.iterrows():
        if row['keyword'] != row['category']:
            reading_values.append(f"('{row['keyword']}', '', '', 'action')")
    
    # Positionsのキーワード
    for _, row in positions_df.iterrows():
        if row['keyword'] != row['category']:
            reading_values.append(f"('{row['keyword']}', '', '', 'position')")
    
    if reading_values:
        sql_content += ',\n'.join(reading_values) + ";\n\n"
    else:
        sql_content += "-- No additional keywords to insert\n\n"
    
    # 結果確認
    sql_content += """-- Check results
SELECT 'targets' as table_name, COUNT(*) as record_count FROM targets
UNION ALL
SELECT 'actions' as table_name, COUNT(*) as record_count FROM actions  
UNION ALL
SELECT 'positions' as table_name, COUNT(*) as record_count FROM positions
UNION ALL
SELECT 'reading_mappings' as table_name, COUNT(*) as record_count FROM reading_mappings;

-- Display sample data
SELECT 'TARGETS SAMPLE' as info, name, sort_order FROM targets ORDER BY sort_order LIMIT 5;
SELECT 'ACTIONS SAMPLE' as info, name, sort_order FROM actions ORDER BY sort_order LIMIT 5;  
SELECT 'POSITIONS SAMPLE' as info, name, sort_order FROM positions ORDER BY sort_order LIMIT 5;
SELECT 'KEYWORDS SAMPLE' as info, word, word_type FROM reading_mappings LIMIT 10;
"""
    
    # ファイルに保存
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    filename = f'supabase/migrations/{timestamp}_complete_dictionary_with_keywords.sql'
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(sql_content)
    
    print(f"完全な辞書マイグレーション生成完了: {filename}")
    print(f"総キーワード数: {len(reading_values)}")
    
    return filename

if __name__ == "__main__":
    generate_complete_migration()