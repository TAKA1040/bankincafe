#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
from collections import Counter
import os

def create_master_dictionaries():
    """分類済みデータから辞書マスターを作成"""
    
    print("=== ステップ5: 辞書マスター作成開始 ===")
    
    # 分類済みデータ読み込み
    df = pd.read_csv('batch_processing/final_4088_classified_work_items.csv')
    print(f"分類済みデータ読み込み: {len(df)}件")
    
    # 各分類の統計
    target_items = df[df['target'].notna() & (df['target'] != '')]['target'].tolist()
    action_items = df[df['action'].notna() & (df['action'] != '')]['action'].tolist()
    position_items = df[df['position'].notna() & (df['position'] != '')]['position'].tolist()
    
    print(f"対象分類: {len(target_items)}件")
    print(f"動作分類: {len(action_items)}件")
    print(f"位置分類: {len(position_items)}件")
    
    # 頻度カウント
    target_counts = Counter(target_items)
    action_counts = Counter(action_items)
    position_counts = Counter(position_items)
    
    print(f"ユニーク対象: {len(target_counts)}種類")
    print(f"ユニーク動作: {len(action_counts)}種類")
    print(f"ユニーク位置: {len(position_counts)}種類")
    
    # 辞書マスター作成
    def create_master_csv(counts, filename, category_name):
        """マスターCSVファイル作成"""
        master_data = []
        for sort_order, (name, frequency) in enumerate(counts.most_common(), 1):
            master_data.append({
                'id': sort_order,
                'name': name,
                'frequency': frequency,
                'sort_order': sort_order,
                'is_active': True,
                'category': category_name
            })
        
        master_df = pd.DataFrame(master_data)
        output_file = f'batch_processing/{filename}'
        master_df.to_csv(output_file, index=False, encoding='utf-8')
        
        print(f"\n=== {category_name}マスター ===")
        print(f"ファイル: {output_file}")
        print(f"総数: {len(master_data)}種類")
        print(f"TOP10:")
        for i, (name, freq) in enumerate(counts.most_common(10)):
            print(f"{i+1:2d}. {name} ({freq}回)")
        
        return output_file, len(master_data)
    
    # 各マスター作成
    target_file, target_count = create_master_csv(target_counts, 'targets_master.csv', '対象')
    action_file, action_count = create_master_csv(action_counts, 'actions_master.csv', '動作')
    position_file, position_count = create_master_csv(position_counts, 'positions_master.csv', '位置')
    
    # 統合マスター情報
    summary = {
        'target_file': target_file,
        'target_count': target_count,
        'action_file': action_file,
        'action_count': action_count,
        'position_file': position_file,
        'position_count': position_count,
        'total_classifications': target_count + action_count + position_count
    }
    
    # サマリーファイル作成
    summary_file = 'batch_processing/dictionary_masters_summary.txt'
    with open(summary_file, 'w', encoding='utf-8') as f:
        f.write("=== 辞書マスター作成結果 ===\n")
        f.write(f"作成日時: {pd.Timestamp.now()}\n")
        f.write(f"元データ: final_4088_classified_work_items.csv\n\n")
        
        f.write(f"対象マスター: {target_count}種類 ({target_file})\n")
        f.write(f"動作マスター: {action_count}種類 ({action_file})\n")
        f.write(f"位置マスター: {position_count}種類 ({position_file})\n")
        f.write(f"合計マスター項目: {summary['total_classifications']}種類\n\n")
        
        f.write("=== 対象マスター TOP20 ===\n")
        for i, (name, freq) in enumerate(target_counts.most_common(20)):
            f.write(f"{i+1:2d}. {name} ({freq}回)\n")
        
        f.write("\n=== 動作マスター TOP20 ===\n")
        for i, (name, freq) in enumerate(action_counts.most_common(20)):
            f.write(f"{i+1:2d}. {name} ({freq}回)\n")
        
        f.write(f"\n=== 位置マスター 全{position_count}種類 ===\n")
        for i, (name, freq) in enumerate(position_counts.most_common()):
            f.write(f"{i+1:2d}. {name} ({freq}回)\n")
    
    print(f"\n=== 作成完了 ===")
    print(f"対象マスター: {target_count}種類")
    print(f"動作マスター: {action_count}種類")
    print(f"位置マスター: {position_count}種類")
    print(f"合計: {summary['total_classifications']}種類の辞書マスター")
    print(f"サマリー: {summary_file}")
    
    return summary

if __name__ == "__main__":
    result = create_master_dictionaries()
    print(f"\n[SUCCESS] 辞書マスター作成完了!")
    print(f"次のステップ: Supabaseマイグレーション作成")