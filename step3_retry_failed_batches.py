#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
import os

def retry_failed_batch(batch_num):
    """失敗バッチの再処理（データクリーニング付き）"""
    
    print(f"=== バッチ {batch_num:03d} 再処理開始 ===")
    
    # 元データ読み込み
    input_file = 'batch_processing/split_work_items.csv'
    df = pd.read_csv(input_file)
    
    # NaN値をクリーニング
    df = df.dropna()
    df['work_item'] = df['work_item'].astype(str)  # 強制的に文字列に変換
    
    work_items = df.values.tolist()
    batch_size = 500
    
    start_idx = (batch_num - 1) * batch_size
    end_idx = min(start_idx + batch_size, len(work_items))
    
    print(f"データクリーニング後の範囲: {start_idx+1} - {end_idx} ({end_idx-start_idx}件)")
    
    # step2の分類ルールをインポート
    from step2_batch_classification import create_classification_rules, classify_work_item
    
    actions, targets, positions = create_classification_rules()
    batch_items = work_items[start_idx:end_idx]
    results = []
    
    for item_data in batch_items:
        item = str(item_data[0])  # 強制的に文字列変換
        freq = item_data[1] if not pd.isna(item_data[1]) else 1
        
        # 分類実行
        classification = classify_work_item(item, actions, targets, positions)
        
        results.append({
            'work_item': item,
            'target': classification['target'],
            'action': classification['action'],
            'position': classification['position'], 
            'other': classification['other'],
            'confidence': classification['confidence'],
            'frequency': freq
        })
    
    # CSV保存
    output_file = f'batch_processing/batch_{batch_num:03d}_classified.csv'
    df_result = pd.DataFrame(results)
    df_result.to_csv(output_file, index=False, encoding='utf-8')
    
    # 統計情報
    classified_count = sum(1 for r in results if r['target'] or r['action'])
    avg_confidence = sum(r['confidence'] for r in results) / len(results)
    
    print(f"再処理完了: {len(results)}件")
    print(f"分類成功: {classified_count}件 ({classified_count/len(results)*100:.1f}%)")
    print(f"平均信頼度: {avg_confidence:.1f}%")
    print(f"保存先: {output_file}")
    
    return True

def retry_all_failed_batches():
    """すべての失敗バッチを再処理"""
    
    print("=== ステップ3: 失敗バッチ再処理開始 ===")
    
    # 失敗バッチリストを確認
    failed_file = 'batch_processing/failed_batches.txt'
    if not os.path.exists(failed_file):
        print("失敗バッチなし。処理完了です。")
        return
    
    with open(failed_file, 'r') as f:
        failed_batches = [int(line.strip()) for line in f if line.strip()]
    
    print(f"再処理対象バッチ: {failed_batches}")
    
    # 各失敗バッチを再処理
    success_count = 0
    for batch_num in failed_batches:
        try:
            retry_failed_batch(batch_num)
            success_count += 1
        except Exception as e:
            print(f"バッチ {batch_num:03d} 再処理でもエラー: {e}")
    
    print(f"\n=== 再処理完了 ===")
    print(f"成功: {success_count}/{len(failed_batches)}バッチ")
    
    if success_count == len(failed_batches):
        # 失敗バッチファイルを削除
        os.remove(failed_file)
        print("全バッチ処理完了！")
        return True
    else:
        print("一部のバッチで再処理も失敗しました")
        return False

if __name__ == "__main__":
    retry_all_failed_batches()