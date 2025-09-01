#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
import os
import glob

def combine_all_batches():
    """全バッチファイルを統合"""
    
    print("=== ステップ4: バッチファイル統合開始 ===")
    
    # バッチファイルを検索
    batch_files = glob.glob('batch_processing/batch_*_classified.csv')
    batch_files.sort()  # ファイル名順にソート
    
    print(f"発見したバッチファイル: {len(batch_files)}個")
    
    all_data = []
    total_items = 0
    
    # 各バッチファイルを読み込み
    for batch_file in batch_files:
        batch_num = int(os.path.basename(batch_file).split('_')[1])
        print(f"バッチ{batch_num:03d} 読み込み中: {batch_file}")
        
        try:
            df = pd.read_csv(batch_file)
            batch_count = len(df)
            total_items += batch_count
            all_data.append(df)
            print(f"  -> {batch_count}件追加")
            
        except Exception as e:
            print(f"  -> エラー: {e}")
            continue
    
    # データフレーム統合
    if all_data:
        combined_df = pd.concat(all_data, ignore_index=True)
        print(f"\n統合完了: {len(combined_df)}件の作業項目")
        
        # 統計情報計算
        target_classified = len(combined_df[combined_df['target'] != ''])
        action_classified = len(combined_df[combined_df['action'] != '']) 
        position_classified = len(combined_df[combined_df['position'] != ''])
        fully_classified = len(combined_df[(combined_df['target'] != '') & (combined_df['action'] != '')])
        
        avg_confidence = combined_df['confidence'].mean()
        
        print(f"\n=== 分類統計 ===")
        print(f"総作業項目: {len(combined_df)}件")
        print(f"対象分類済み: {target_classified}件 ({target_classified/len(combined_df)*100:.1f}%)")
        print(f"動作分類済み: {action_classified}件 ({action_classified/len(combined_df)*100:.1f}%)")
        print(f"位置分類済み: {position_classified}件 ({position_classified/len(combined_df)*100:.1f}%)")
        print(f"完全分類済み: {fully_classified}件 ({fully_classified/len(combined_df)*100:.1f}%)")
        print(f"平均信頼度: {avg_confidence:.1f}%")
        
        # 最終ファイルに保存
        output_file = 'batch_processing/final_4088_classified_work_items.csv'
        combined_df.to_csv(output_file, index=False, encoding='utf-8')
        print(f"\n最終統合ファイル保存: {output_file}")
        
        # サンプル表示（上位20件）
        print(f"\n=== 分類結果サンプル（上位20件） ===")
        sample_df = combined_df.head(20)
        for idx, row in sample_df.iterrows():
            target = row['target'] if row['target'] else '?'
            action = row['action'] if row['action'] else '?'
            position = row['position'] if row['position'] else '?'
            print(f"{idx+1:2d}. {row['work_item']}")
            print(f"    対象:{target} | 動作:{action} | 位置:{position} | 信頼度:{row['confidence']}%")
        
        # 分類別の統計
        print(f"\n=== 対象TOP10 ===")
        target_counts = combined_df[combined_df['target'] != '']['target'].value_counts().head(10)
        for i, (target, count) in enumerate(target_counts.items()):
            print(f"{i+1:2d}. {target}: {count}件")
        
        print(f"\n=== 動作TOP10 ===")
        action_counts = combined_df[combined_df['action'] != '']['action'].value_counts().head(10)
        for i, (action, count) in enumerate(action_counts.items()):
            print(f"{i+1:2d}. {action}: {count}件")
        
        return {
            'total_items': len(combined_df),
            'target_classified': target_classified,
            'action_classified': action_classified, 
            'position_classified': position_classified,
            'fully_classified': fully_classified,
            'avg_confidence': avg_confidence,
            'output_file': output_file
        }
    else:
        print("エラー: 統合するデータがありません")
        return None

if __name__ == "__main__":
    result = combine_all_batches()
    if result:
        print(f"\n[SUCCESS] 4088件作業項目の4分類完了!")
        print(f"完全分類率: {result['fully_classified']/result['total_items']*100:.1f}%")
        print(f"出力ファイル: {result['output_file']}")