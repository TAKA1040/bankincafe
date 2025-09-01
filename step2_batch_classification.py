#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
import re
import os
from datetime import datetime

def create_classification_rules():
    """分類ルールを定義"""
    
    # 動作キーワード
    actions = [
        '脱着', '取替', '交換', '修理', '調整', '溶接', '切断', '製作', '塗装', '加工',
        '張替', '打替', '取付', '取り付け', '取り外し', '組替', '建付', '修正',
        '直し', '曲がり直し', '引出し', '鈑金', '研磨', '仕上げ', '補修', '制作',
        '接合', '切替', '切り替え', '付替', 'リベット打ち換え', '打ち換え'
    ]
    
    # 対象キーワード
    targets = [
        'タイヤ', 'ホイール', 'バンパー', 'フェンダー', 'ドア', 'パネル', 'ステップ',
        'ハンドル', 'ミラー', 'ランプ', 'ライト', 'ガラス', 'ステー', 'ブラケット',
        'カバー', 'シート', 'ゴム', 'パイプ', 'ホース', 'タンク', 'グリル',
        'ガード', 'キャッチ', 'レール', 'メンバー', 'フィニッシャー', 'ヒンジ',
        'センサー', 'ガーニッシュ', 'ウィング', 'マッド', '鋼板', '反射板'
    ]
    
    # 位置キーワード
    positions = [
        '左', '右', '前', '後', '上', '下', '内', '外', '中央', 'センター',
        'フロント', 'リア', 'アッパー', 'ロア', 'インナー', 'アウター',
        'サイド', '奥', '手前', '上側', '下側', '内側', '外側'
    ]
    
    return actions, targets, positions

def classify_work_item(item, actions, targets, positions):
    """単一作業項目を4分類"""
    
    found_action = ""
    found_target = ""  
    found_position = ""
    found_other = ""
    
    item_lower = item.lower()
    
    # 動作を検索
    for action in actions:
        if action in item:
            found_action = action
            break
    
    # 対象を検索 
    for target in targets:
        if target in item:
            found_target = target
            break
    
    # 位置を検索
    for position in positions:
        if position in item:
            found_position = position
            break
    
    # 信頼度計算
    confidence = 0
    if found_target: confidence += 40
    if found_action: confidence += 40  
    if found_position: confidence += 20
    
    # その他（分類されなかった部分）
    remaining = item
    if found_position: remaining = remaining.replace(found_position, "", 1).strip()
    if found_target: remaining = remaining.replace(found_target, "", 1).strip()
    if found_action: remaining = remaining.replace(found_action, "", 1).strip()
    
    if remaining and remaining != item:
        found_other = remaining
    
    return {
        'target': found_target,
        'action': found_action, 
        'position': found_position,
        'other': found_other,
        'confidence': confidence
    }

def process_batch(batch_num, work_items, start_idx, end_idx):
    """バッチ処理実行"""
    
    print(f"\n=== バッチ {batch_num:03d} 処理開始 ===")
    print(f"範囲: {start_idx+1} - {end_idx} ({end_idx-start_idx}件)")
    
    # 分類ルール取得
    actions, targets, positions = create_classification_rules()
    
    # バッチデータ
    batch_items = work_items[start_idx:end_idx]
    results = []
    
    for item_data in batch_items:
        item = item_data[0]  # work_item
        freq = item_data[1]  # frequency
        
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
    df = pd.DataFrame(results)
    df.to_csv(output_file, index=False, encoding='utf-8')
    
    # 統計情報
    classified_count = sum(1 for r in results if r['target'] or r['action'])
    avg_confidence = sum(r['confidence'] for r in results) / len(results)
    
    print(f"処理完了: {len(results)}件")
    print(f"分類成功: {classified_count}件 ({classified_count/len(results)*100:.1f}%)")
    print(f"平均信頼度: {avg_confidence:.1f}%")
    print(f"保存先: {output_file}")
    
    return {
        'batch_num': batch_num,
        'processed': len(results),
        'classified': classified_count,
        'avg_confidence': avg_confidence,
        'output_file': output_file
    }

def run_batch_classification():
    """500件バッチ分類システム実行"""
    
    print("=== ステップ2: バッチ分類システム開始 ===")
    
    # 分解済み作業項目を読み込み
    input_file = 'batch_processing/split_work_items.csv'
    if not os.path.exists(input_file):
        print(f"エラー: {input_file} が見つかりません")
        return
    
    df = pd.read_csv(input_file)
    work_items = df.values.tolist()  # [work_item, frequency]
    total_items = len(work_items)
    
    print(f"読み込み完了: {total_items}個のユニーク作業項目")
    
    # バッチサイズ
    batch_size = 500
    total_batches = (total_items + batch_size - 1) // batch_size
    
    print(f"バッチ設定: 1バッチ={batch_size}件, 総バッチ数={total_batches}")
    
    # 処理状況管理
    status_file = 'batch_processing/batch_processing_status.csv'
    failed_batches = []
    batch_results = []
    
    # 各バッチ処理
    for batch_num in range(1, total_batches + 1):
        start_idx = (batch_num - 1) * batch_size
        end_idx = min(start_idx + batch_size, total_items)
        
        try:
            result = process_batch(batch_num, work_items, start_idx, end_idx)
            batch_results.append(result)
            
        except Exception as e:
            print(f"バッチ {batch_num:03d} でエラー: {e}")
            failed_batches.append(batch_num)
            continue
    
    # 処理状況保存
    with open(status_file, 'w', encoding='utf-8') as f:
        f.write('batch_num,start_time,end_time,status,processed_count,avg_confidence\n')
        for result in batch_results:
            f.write(f"{result['batch_num']:03d},,完了,{result['processed']},{result['avg_confidence']:.1f}\n")
        
        for failed in failed_batches:
            f.write(f"{failed:03d},,エラー,0,0\n")
    
    # 失敗バッチ保存
    if failed_batches:
        with open('batch_processing/failed_batches.txt', 'w') as f:
            for batch in failed_batches:
                f.write(f"{batch:03d}\n")
    
    print(f"\n=== バッチ処理完了 ===")
    print(f"成功: {len(batch_results)}バッチ")
    print(f"失敗: {len(failed_batches)}バッチ")
    
    if failed_batches:
        print(f"失敗バッチ: {failed_batches}")
        print("注意: 失敗バッチは後で再処理が必要です")
    
    return {
        'total_batches': total_batches,
        'success_batches': len(batch_results), 
        'failed_batches': failed_batches
    }

if __name__ == "__main__":
    run_batch_classification()