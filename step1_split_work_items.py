#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
import re
import os

def create_split_work_items():
    """ステップ1: 品名から6000件の分解済み作業項目を作成"""
    
    print("=== ステップ1: 作業項目分解開始 ===")
    
    # CSVファイルを読み込み
    df = pd.read_csv('請求書システム画像/hondata/dada2.csv')
    print(f"データ読み込み完了: {len(df)}行")
    
    # 品名カラムを抽出
    work_items = []
    for col in df.columns:
        if '品名' in col:
            items = df[col].dropna().tolist()
            work_items.extend(items)
    
    print(f"総品名項目数: {len(work_items)}個")
    
    # 分解パターン
    separators = ['・', '、', '，', ',', '　', '  ', '／', '/', '及び', 'および']
    
    split_items = []
    complex_count = 0
    
    for item in work_items:
        if pd.isna(item) or item == '':
            continue
        
        item_str = str(item).strip()
        
        # 分解実行
        found_separator = False
        for sep in separators:
            if sep in item_str:
                parts = [part.strip() for part in item_str.split(sep)]
                parts = [part for part in parts if part and len(part) > 1]
                if len(parts) > 1:
                    split_items.extend(parts)
                    complex_count += 1
                    found_separator = True
                    break
        
        if not found_separator:
            split_items.append(item_str)
    
    print(f"分解結果:")
    print(f"  - 分解前: {len(work_items)}個")
    print(f"  - 分解後: {len(split_items)}個")
    print(f"  - 複合項目: {complex_count}個")
    
    # 頻度カウント
    from collections import Counter
    item_counts = Counter(split_items)
    unique_count = len(item_counts)
    print(f"  - ユニーク項目: {unique_count}個")
    
    # batch_processingディレクトリ作成
    os.makedirs('batch_processing', exist_ok=True)
    
    # CSVに保存
    output_file = 'batch_processing/split_work_items.csv'
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('work_item,frequency\n')
        for item, count in item_counts.most_common():
            # CSVエスケープ
            escaped_item = item.replace('"', '""')
            f.write(f'"{escaped_item}",{count}\n')
    
    print(f"\n[OK] 分解済み作業項目をCSVに保存: {output_file}")
    print(f"処理完了: {unique_count}個のユニーク作業項目")
    
    # 上位10項目を表示
    print(f"\n頻出作業項目 TOP10:")
    for i, (item, count) in enumerate(item_counts.most_common(10)):
        print(f"{i+1:2d}. {item} ({count}回)")
    
    return {
        'total_items': len(split_items),
        'unique_items': unique_count,
        'output_file': output_file
    }

if __name__ == "__main__":
    result = create_split_work_items()
    print(f"\n次のステップ: {result['unique_items']}個の項目を500件ずつバッチ分類")