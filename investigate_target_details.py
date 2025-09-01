#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
import re

def investigate_target_reduction():
    """対象マスターの削減が適切かどうか調査"""
    
    print("=== 対象マスター削減調査 ===")
    
    # 分類済みデータ読み込み
    df = pd.read_csv('batch_processing/final_4088_classified_work_items.csv')
    
    # 対象として分類された全項目を詳細分析
    target_items = df[df['target'].notna() & (df['target'] != '')].copy()
    
    print(f"対象分類済み項目数: {len(target_items)}件")
    
    # 元の作業項目から対象関連を詳細抽出
    print(f"\n=== センサー関連の詳細分析 ===")
    sensor_items = target_items[target_items['work_item'].str.contains('センサー|センサ', na=False, case=False)]
    print(f"センサー関連項目数: {len(sensor_items)}件")
    
    if len(sensor_items) > 0:
        print("センサー関連の作業項目:")
        for idx, row in sensor_items.head(20).iterrows():
            print(f"  - {row['work_item']} → 分類:{row['target']}")
    
    # 他の細分化可能な対象を調査
    print(f"\n=== ランプ・ライト関連の詳細分析 ===")
    light_items = target_items[target_items['work_item'].str.contains('ライト|ランプ|灯', na=False)]
    print(f"ライト関連項目数: {len(light_items)}件")
    
    if len(light_items) > 0:
        print("ライト関連の作業項目サンプル:")
        unique_lights = light_items['work_item'].unique()[:20]
        for item in unique_lights:
            target = light_items[light_items['work_item'] == item]['target'].iloc[0]
            print(f"  - {item} → 分類:{target}")
    
    # カバー関連の詳細分析
    print(f"\n=== カバー関連の詳細分析 ===")
    cover_items = target_items[target_items['work_item'].str.contains('カバー', na=False)]
    print(f"カバー関連項目数: {len(cover_items)}件")
    
    if len(cover_items) > 0:
        print("カバー関連の作業項目サンプル:")
        unique_covers = cover_items['work_item'].unique()[:20]
        for item in unique_covers:
            target = cover_items[cover_items['work_item'] == item]['target'].iloc[0]
            print(f"  - {item} → 分類:{target}")
    
    # 分類ルールが取りこぼした可能性のある対象を探す
    print(f"\n=== 分類されなかった対象の調査 ===")
    unclassified = df[df['target'].isna() | (df['target'] == '')].copy()
    print(f"対象未分類項目数: {len(unclassified)}件")
    
    # 明らかに対象と思われるが未分類のものを探す
    potential_targets = []
    target_keywords = [
        'タイヤ', 'ホイール', 'バンパー', 'フェンダー', 'ドア', 'パネル',
        'ミラー', 'ガラス', 'ウィンドウ', 'シート', 'マット', 'ベルト',
        'エンジン', 'ブレーキ', 'クラッチ', 'ギア', 'オイル', 'フィルター',
        'バッテリー', 'ヒューズ', 'リレー', 'コンデンサ', 'インバーター',
        'モーター', 'コンプレッサー', 'ラジエーター', 'クーラー'
    ]
    
    for keyword in target_keywords:
        keyword_items = unclassified[unclassified['work_item'].str.contains(keyword, na=False)]
        if len(keyword_items) > 0:
            potential_targets.extend(keyword_items['work_item'].unique()[:5])
    
    if potential_targets:
        print("分類されなかった潜在的な対象（サンプル）:")
        for item in potential_targets[:15]:
            print(f"  - {item}")
    
    # 現在のマスターファイルを確認
    print(f"\n=== 現在の対象マスター ===")
    targets_master = pd.read_csv('batch_processing/targets_master.csv')
    print(f"現在のマスター数: {len(targets_master)}種類")
    print("現在のマスター一覧:")
    for idx, row in targets_master.iterrows():
        print(f"{row['sort_order']:2d}. {row['name']} ({row['frequency']}回)")
    
    return {
        'total_classified': len(target_items),
        'current_masters': len(targets_master),
        'sensor_items': len(sensor_items),
        'light_items': len(light_items),
        'cover_items': len(cover_items),
        'unclassified': len(unclassified)
    }

if __name__ == "__main__":
    investigate_target_reduction()