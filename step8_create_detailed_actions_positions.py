#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
import re
from collections import Counter

def extract_detailed_actions_positions():
    """請求書明細レベルの詳細動作・位置マスターを作成"""
    
    print("=== 詳細動作・位置マスター作成開始 ===")
    
    # 分類済みデータ読み込み
    df = pd.read_csv('batch_processing/final_4088_classified_work_items.csv')
    all_work_items = df['work_item'].tolist()
    
    detailed_actions = Counter()
    detailed_positions = Counter()
    
    # 詳細動作パターンを定義
    action_patterns = [
        # 基本動作の詳細化
        (r'脱着', '脱着'),
        (r'取替|取り替え', '取替'),
        (r'交換', '交換'),
        (r'修理', '修理'),
        (r'調整', '調整'),
        (r'溶接', '溶接'),
        (r'切断', '切断'),
        (r'製作', '製作'),
        (r'塗装', '塗装'),
        (r'加工', '加工'),
        (r'張替|張り替え', '張替'),
        (r'打替|打ち替え|打ち換え', '打替'),
        (r'取付|取り付け', '取付'),
        (r'取り外し', '取り外し'),
        (r'組替|組み替え', '組替'),
        (r'建付|建付け', '建付'),
        (r'修正', '修正'),
        
        # 詳細動作
        (r'曲がり直し', '曲がり直し'),
        (r'引出し', '引出し'),
        (r'鈑金', '鈑金'),
        (r'研磨', '研磨'),
        (r'仕上げ', '仕上げ'),
        (r'補修', '補修'),
        (r'制作', '制作'),
        (r'接合', '接合'),
        (r'切替|切り替え', '切替'),
        (r'付替|付け替え', '付替'),
        (r'点検', '点検'),
        (r'清掃', '清掃'),
        (r'洗浄', '洗浄'),
        (r'給油', '給油'),
        (r'注油', '注油'),
        (r'補給', '補給'),
        (r'充填', '充填'),
        (r'排出', '排出'),
        (r'吸引', '吸引'),
        (r'締付|締め付け', '締付'),
        (r'緩め', '緩め'),
        (r'固定', '固定'),
        (r'解除', '解除'),
        (r'開放', '開放'),
        (r'密閉', '密閉'),
        (r'貼付|貼り付け', '貼付'),
        (r'剥がし', '剥がし'),
        (r'穴開け|穴掘り', '穴開け'),
        (r'切欠き', '切欠き'),
        (r'面取り', '面取り'),
        (r'バリ取り', 'バリ取り'),
        (r'サビ取り|錆取り', 'サビ取り'),
        (r'錆止め', '錆止め'),
        (r'下地処理', '下地処理'),
        (r'プライマー', 'プライマー'),
        (r'コーティング', 'コーティング'),
        (r'防錆処理', '防錆処理'),
        (r'脱脂', '脱脂'),
        (r'マスキング', 'マスキング'),
        (r'養生', '養生'),
        (r'保護', '保護'),
        (r'カバー', 'カバー'),
        (r'梱包', '梱包'),
        (r'運搬', '運搬'),
        (r'移動', '移動'),
        (r'設置', '設置'),
        (r'据付|据え付け', '据付'),
        (r'組立|組み立て', '組立'),
        (r'分解', '分解'),
        (r'解体', '解体'),
        (r'撤去', '撤去'),
        (r'廃棄', '廃棄'),
    ]
    
    # 詳細位置パターンを定義
    position_patterns = [
        # 基本方向
        (r'左', '左'),
        (r'右', '右'),
        (r'前', '前'),
        (r'後|リア', '後'),
        (r'上', '上'),
        (r'下', '下'),
        (r'内', '内'),
        (r'外', '外'),
        (r'中央', '中央'),
        
        # 詳細位置
        (r'フロント', 'フロント'),
        (r'リア(?!フェンダー|バンパー)', 'リア'),
        (r'サイド', 'サイド'),
        (r'センター', 'センター'),
        (r'アッパー', 'アッパー'),
        (r'ロア|ロワー', 'ロア'),
        (r'インナー', 'インナー'),
        (r'アウター', 'アウター'),
        (r'トップ', 'トップ'),
        (r'ボトム', 'ボトム'),
        (r'奥', '奥'),
        (r'手前', '手前'),
        (r'上側', '上側'),
        (r'下側', '下側'),
        (r'内側', '内側'),
        (r'外側', '外側'),
        
        # 車両固有位置
        (r'運転席', '運転席'),
        (r'助手席', '助手席'),
        (r'後部座席', '後部座席'),
        (r'荷台', '荷台'),
        (r'キャビン', 'キャビン'),
        (r'エンジンルーム', 'エンジンルーム'),
        (r'トランク', 'トランク'),
        (r'バンパー下', 'バンパー下'),
        (r'フェンダー内', 'フェンダー内'),
        (r'ドア内', 'ドア内'),
        (r'パネル内', 'パネル内'),
        
        # 数値位置
        (r'1番|１番', '1番'),
        (r'2番|２番', '2番'),
        (r'3番|３番', '3番'),
        (r'4番|４番', '4番'),
        (r'5番|５番', '5番'),
        (r'6番|６番', '6番'),
        
        # 段階位置
        (r'第1', '第1'),
        (r'第2', '第2'),
        (r'第3', '第3'),
        (r'ファースト', 'ファースト'),
        (r'セカンド', 'セカンド'),
        (r'サード', 'サード'),
    ]
    
    # 各作業項目に対してパターンマッチング実行
    for work_item in all_work_items:
        if pd.isna(work_item):
            continue
            
        item_str = str(work_item)
        
        # 動作パターンマッチング
        found_action = None
        for pattern, action_name in action_patterns:
            if re.search(pattern, item_str, re.IGNORECASE):
                found_action = action_name
                break
        
        if found_action:
            detailed_actions[found_action] += 1
        
        # 位置パターンマッチング
        found_position = None
        for pattern, position_name in position_patterns:
            if re.search(pattern, item_str, re.IGNORECASE):
                found_position = position_name
                break
        
        if found_position:
            detailed_positions[found_position] += 1
    
    print(f"抽出された詳細動作: {len(detailed_actions)}種類")
    print(f"抽出された詳細位置: {len(detailed_positions)}種類")
    
    # 詳細動作マスター作成
    def create_detailed_master(counter, filename, category_name):
        sorted_items = counter.most_common()
        master_data = []
        
        for sort_order, (name, frequency) in enumerate(sorted_items, 1):
            master_data.append({
                'id': sort_order,
                'name': name,
                'frequency': frequency,
                'sort_order': sort_order,
                'is_active': True,
                'category': category_name
            })
        
        df = pd.DataFrame(master_data)
        output_file = f'batch_processing/{filename}'
        df.to_csv(output_file, index=False, encoding='utf-8')
        
        print(f"\n=== {category_name}マスター ===")
        print(f"ファイル: {output_file}")
        print(f"種類数: {len(master_data)}種類")
        print(f"総出現回数: {sum(counter.values())}回")
        
        print(f"TOP20:")
        for i, (name, freq) in enumerate(sorted_items[:20]):
            print(f"{i+1:2d}. {name} ({freq}回)")
        
        return output_file, len(master_data)
    
    # 各マスター作成
    actions_file, actions_count = create_detailed_master(
        detailed_actions, 'detailed_actions_master.csv', '動作（詳細）'
    )
    
    positions_file, positions_count = create_detailed_master(
        detailed_positions, 'detailed_positions_master.csv', '位置（詳細）'
    )
    
    # 従来との比較
    original_actions = pd.read_csv('batch_processing/actions_master.csv')
    original_positions = pd.read_csv('batch_processing/positions_master.csv')
    
    print(f"\n=== 改善比較 ===")
    print(f"動作マスター: {len(original_actions)}種類 → {actions_count}種類 (+{actions_count - len(original_actions)})")
    print(f"位置マスター: {len(original_positions)}種類 → {positions_count}種類 (+{positions_count - len(original_positions)})")
    
    return {
        'actions_file': actions_file,
        'actions_count': actions_count,
        'positions_file': positions_file,
        'positions_count': positions_count,
        'actions_improvement': actions_count - len(original_actions),
        'positions_improvement': positions_count - len(original_positions)
    }

if __name__ == "__main__":
    result = extract_detailed_actions_positions()
    print(f"\n[SUCCESS] 詳細動作・位置マスター作成完了!")
    print(f"動作マスター: {result['actions_count']}種類")
    print(f"位置マスター: {result['positions_count']}種類")
    print("次のステップ: 3つの詳細マスターでSupabaseマイグレーション作成")