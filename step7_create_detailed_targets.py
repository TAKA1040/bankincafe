#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
import re
from collections import Counter

def extract_detailed_targets():
    """請求書明細として成り立つ詳細な対象マスターを作成"""
    
    print("=== 詳細対象マスター作成開始 ===")
    
    # 分類済みデータ読み込み
    df = pd.read_csv('batch_processing/final_4088_classified_work_items.csv')
    
    # 元の作業項目から詳細対象を抽出
    all_work_items = df['work_item'].tolist()
    
    detailed_targets = Counter()
    
    # 具体的な対象パターンを定義
    target_patterns = [
        # センサー類
        (r'NOX?センサー', 'NOXセンサー'),
        (r'DPF.*センサー', 'DPFセンサー'),
        (r'レベリングセンサー', 'レベリングセンサー'),
        (r'サイドセンサー', 'サイドセンサー'),
        (r'ノックセンサー', 'ノックセンサー'),
        (r'水温センサー', '水温センサー'),
        (r'油圧センサー', '油圧センサー'),
        (r'速度センサー', '速度センサー'),
        
        # ライト・ランプ類
        (r'ヘッドライト', 'ヘッドライト'),
        (r'テールライト|テールランプ', 'テールライト'),
        (r'フォグライト|フォグランプ', 'フォグライト'),
        (r'マーカーライト|マーカーランプ', 'マーカーライト'),
        (r'コーナーライト|コーナーランプ', 'コーナーライト'),
        (r'フラッシャーライト|フラッシャー', 'フラッシャーライト'),
        (r'バックライト|バックランプ', 'バックライト'),
        (r'ストップライト|ストップランプ', 'ストップライト'),
        (r'タイヤ灯', 'タイヤ灯'),
        
        # カバー類
        (r'タイヤハウスカバー', 'タイヤハウスカバー'),
        (r'エンジンカバー', 'エンジンカバー'),
        (r'マフラーカバー', 'マフラーカバー'),
        (r'バッテリーカバー', 'バッテリーカバー'),
        (r'エアフィルターカバー', 'エアフィルターカバー'),
        (r'ホイールカバー', 'ホイールカバー'),
        (r'アンダーカバー', 'アンダーカバー'),
        (r'エンドカバー', 'エンドカバー'),
        (r'ロアカバー', 'ロアカバー'),
        
        # パネル類
        (r'ドアパネル', 'ドアパネル'),
        (r'サイドパネル', 'サイドパネル'),
        (r'フロアパネル', 'フロアパネル'),
        (r'ダッシュパネル', 'ダッシュパネル'),
        (r'インナーパネル', 'インナーパネル'),
        (r'アウターパネル', 'アウターパネル'),
        (r'コーナーパネル', 'コーナーパネル'),
        (r'クオーターパネル', 'クオーターパネル'),
        
        # フェンダー類
        (r'フロントフェンダー', 'フロントフェンダー'),
        (r'リアフェンダー', 'リアフェンダー'),
        (r'アッパーフェンダー', 'アッパーフェンダー'),
        (r'ロアフェンダー', 'ロアフェンダー'),
        (r'インナーフェンダー', 'インナーフェンダー'),
        
        # バンパー類
        (r'フロントバンパー', 'フロントバンパー'),
        (r'リアバンパー', 'リアバンパー'),
        (r'インナーバンパー', 'インナーバンパー'),
        (r'バンパーフィニッシャー', 'バンパーフィニッシャー'),
        
        # ステップ類
        (r'ファーストステップ', 'ファーストステップ'),
        (r'セカンドステップ', 'セカンドステップ'),
        (r'サードステップ', 'サードステップ'),
        (r'アッパーステップ', 'アッパーステップ'),
        (r'ロアステップ', 'ロアステップ'),
        
        # ガード類
        (r'サイドガード', 'サイドガード'),
        (r'マッドガード', 'マッドガード'),
        (r'アンダーガード', 'アンダーガード'),
        (r'フロントガード', 'フロントガード'),
        
        # タンク類
        (r'燃料タンク', '燃料タンク'),
        (r'オイルタンク', 'オイルタンク'),
        (r'ウォッシャータンク', 'ウォッシャータンク'),
        (r'エアタンク', 'エアタンク'),
        (r'アドブルータンク', 'アドブルータンク'),
        
        # ミラー類
        (r'バックミラー', 'バックミラー'),
        (r'サイドミラー', 'サイドミラー'),
        (r'アンダーミラー', 'アンダーミラー'),
        (r'フェンダーミラー', 'フェンダーミラー'),
        
        # その他重要部品
        (r'エンジン', 'エンジン'),
        (r'ブレーキ', 'ブレーキ'),
        (r'クラッチ', 'クラッチ'),
        (r'ギアボックス', 'ギアボックス'),
        (r'ラジエーター', 'ラジエーター'),
        (r'コンプレッサー', 'コンプレッサー'),
        (r'オルタネーター', 'オルタネーター'),
        (r'スターター', 'スターター'),
        (r'バッテリー', 'バッテリー'),
        (r'フィルター', 'フィルター'),
        (r'フロアマット', 'フロアマット'),
        (r'シートベルト', 'シートベルト'),
        (r'ハンドル', 'ハンドル'),
        (r'ペダル', 'ペダル'),
        (r'ダッシュボード', 'ダッシュボード'),
        (r'スピードメーター', 'スピードメーター'),
        (r'ウィンカー', 'ウィンカー'),
        (r'ホーン', 'ホーン'),
        (r'ワイパー', 'ワイパー'),
        
        # 基本部品（シンプルなパターン）
        (r'ドア(?!パネル)', 'ドア'),
        (r'ステー(?!.*具体名)', 'ステー'),
        (r'ブラケット', 'ブラケット'),
        (r'パイプ', 'パイプ'),
        (r'ホース', 'ホース'),
    ]
    
    # 各作業項目に対してパターンマッチング実行
    for work_item in all_work_items:
        if pd.isna(work_item):
            continue
            
        item_str = str(work_item)
        found_target = None
        
        # より具体的なパターンから順に検索
        for pattern, target_name in target_patterns:
            if re.search(pattern, item_str, re.IGNORECASE):
                found_target = target_name
                break
        
        if found_target:
            detailed_targets[found_target] += 1
    
    print(f"抽出された詳細対象: {len(detailed_targets)}種類")
    
    # 頻度順でソート
    sorted_targets = detailed_targets.most_common()
    
    # 詳細対象マスター作成
    detailed_master_data = []
    for sort_order, (name, frequency) in enumerate(sorted_targets, 1):
        detailed_master_data.append({
            'id': sort_order,
            'name': name,
            'frequency': frequency,
            'sort_order': sort_order,
            'is_active': True,
            'category': '対象（詳細）'
        })
    
    # CSVに保存
    detailed_df = pd.DataFrame(detailed_master_data)
    output_file = 'batch_processing/detailed_targets_master.csv'
    detailed_df.to_csv(output_file, index=False, encoding='utf-8')
    
    print(f"\n=== 詳細対象マスター作成完了 ===")
    print(f"ファイル: {output_file}")
    print(f"対象種類数: {len(detailed_targets)}種類")
    print(f"総出現回数: {sum(detailed_targets.values())}回")
    
    print(f"\n=== 詳細対象マスター TOP30 ===")
    for i, (name, freq) in enumerate(sorted_targets[:30]):
        print(f"{i+1:2d}. {name} ({freq}回)")
    
    # 比較表示
    original_df = pd.read_csv('batch_processing/targets_master.csv')
    print(f"\n=== 改善比較 ===")
    print(f"従来の対象マスター: {len(original_df)}種類")
    print(f"詳細対象マスター: {len(detailed_targets)}種類")
    print(f"改善: +{len(detailed_targets) - len(original_df)}種類 ({((len(detailed_targets)/len(original_df))-1)*100:.1f}%増)")
    
    return {
        'output_file': output_file,
        'target_count': len(detailed_targets),
        'total_frequency': sum(detailed_targets.values()),
        'improvement': len(detailed_targets) - len(original_df)
    }

if __name__ == "__main__":
    result = extract_detailed_targets()
    print(f"\n[SUCCESS] 請求書明細レベルの詳細対象マスター完成!")
    print(f"次のステップ: Supabaseマイグレーション更新")