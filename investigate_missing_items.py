#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd

def investigate_missing_items():
    """6146件から4088件に減った原因を調査"""
    
    print("=== データ減少原因調査 ===")
    
    # Step1の結果を再確認
    print("Step1の分解処理を再実行...")
    
    # CSVファイルを読み込み
    df = pd.read_csv('請求書システム画像/hondata/dada2.csv')
    
    # 品名カラムを抽出
    work_items = []
    for col in df.columns:
        if '品名' in col:
            items = df[col].dropna().tolist()
            work_items.extend(items)
    
    print(f"元の品名項目数: {len(work_items)}個")
    
    # 分解処理
    separators = ['・', '、', '，', ',', '　', '  ', '／', '/', '及び', 'および']
    
    split_items = []
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
                    found_separator = True
                    break
        
        if not found_separator:
            split_items.append(item_str)
    
    print(f"分解後の全項目数: {len(split_items)}個")
    
    # 重複除去前後を比較
    from collections import Counter
    item_counts = Counter(split_items)
    unique_items = len(item_counts)
    
    print(f"ユニーク項目数: {unique_items}個")
    print(f"重複による減少: {len(split_items)} - {unique_items} = {len(split_items) - unique_items}個")
    
    # 保存されたCSVと比較
    try:
        saved_df = pd.read_csv('batch_processing/split_work_items.csv')
        print(f"保存されたCSVの件数: {len(saved_df)}個")
        
        if len(saved_df) != unique_items:
            print(f"⚠️ 不一致発見: 計算値{unique_items}個 vs CSV{len(saved_df)}個")
            
    except Exception as e:
        print(f"CSVファイル読み込みエラー: {e}")
    
    # 最終結果との比較
    try:
        final_df = pd.read_csv('batch_processing/final_4088_classified_work_items.csv')
        print(f"最終分類結果の件数: {len(final_df)}個")
        
        # データクリーニングによる減少を確認
        if unique_items != len(final_df):
            print(f"データクリーニングによる減少: {unique_items} - {len(final_df)} = {unique_items - len(final_df)}個")
            
    except Exception as e:
        print(f"最終CSVファイル読み込みエラー: {e}")
    
    # 減少の内訳まとめ
    print(f"\n=== 減少の内訳 ===")
    print(f"1. 元の品名項目: {len(work_items)}個")
    print(f"2. 分解後の全項目: {len(split_items)}個 (増加: +{len(split_items) - len(work_items)})")
    print(f"3. 重複除去後: {unique_items}個 (減少: -{len(split_items) - unique_items})")
    print(f"4. 最終結果: 4088個 (減少: -{unique_items - 4088} ※データクリーニング等)")
    
    return {
        'original': len(work_items),
        'after_split': len(split_items),
        'after_dedup': unique_items,
        'final': 4088
    }

if __name__ == "__main__":
    investigate_missing_items()