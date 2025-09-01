#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
import re

def analyze_work_items():
    """品名を分解して個別作業項目数を分析"""
    
    # CSVファイルを読み込み
    df = pd.read_csv('請求書システム画像/hondata/dada2.csv')
    print(f"データ読み込み完了: {len(df)}行")
    
    # 品名カラムを抽出
    work_items = []
    for col in df.columns:
        if '品名' in col:
            work_items.extend(df[col].dropna().tolist())
    
    print(f"総品名項目数: {len(work_items)}個")
    
    # 分解パターン
    separators = ['・', '、', '，', ',', '　', '  ', '／', '/', '及び', 'および']
    
    split_items = []
    complex_items = []  # 複数作業が含まれている品名
    
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
                    complex_items.append({
                        'original': item_str,
                        'split_count': len(parts),
                        'parts': parts
                    })
                    found_separator = True
                    break
        
        if not found_separator:
            split_items.append(item_str)
    
    print(f"\n=== 分解結果 ===")
    print(f"分解前の品名数: {len(work_items)}個")
    print(f"分解後の作業項目数: {len(split_items)}個")
    print(f"複数作業を含む品名: {len(complex_items)}個")
    
    if len(complex_items) > 0:
        print(f"\n=== 複数作業の例（上位10件） ===")
        # 分解数でソート
        complex_items.sort(key=lambda x: x['split_count'], reverse=True)
        for i, item in enumerate(complex_items[:10]):
            print(f"{i+1:2d}. {item['original']}")
            print(f"    → {item['split_count']}個に分解: {item['parts']}")
    
    # ユニーク作業項目数
    unique_items = list(set(split_items))
    print(f"\nユニークな作業項目数: {len(unique_items)}個")
    
    # 頻度分析
    from collections import Counter
    item_counts = Counter(split_items)
    print(f"\n=== 頻出作業項目 TOP20 ===")
    for i, (item, count) in enumerate(item_counts.most_common(20)):
        print(f"{i+1:2d}. {item} ({count}回)")
    
    # CSVに保存
    with open('請求書システム画像/hondata/split_work_items.csv', 'w', encoding='utf-8') as f:
        f.write('work_item,frequency\n')
        for item, count in item_counts.most_common():
            f.write(f'"{item}",{count}\n')
    
    print(f"\n結果をCSVに保存: split_work_items.csv")
    
    return {
        'original_count': len(work_items),
        'split_count': len(split_items),
        'unique_count': len(unique_items),
        'complex_items': len(complex_items)
    }

if __name__ == "__main__":
    result = analyze_work_items()