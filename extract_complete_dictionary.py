#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
import re
from collections import Counter

def extract_complete_dictionary():
    """CSVから完全な辞書を抽出（タイヤ等の見落とし防止）"""
    
    # CSVファイルを読み込み
    df = pd.read_csv('請求書システム画像/hondata/dada2.csv')
    print(f"データ読み込み完了: {len(df)}行")
    
    # 品名カラムを抽出（品名1～品名32）
    work_names = []
    for col in df.columns:
        if '品名' in col:
            work_names.extend(df[col].dropna().tolist())
    
    print(f"抽出された作業項目: {len(work_names)}個")
    
    # すべてのユニークな単語を抽出
    all_words = Counter()
    
    for work in work_names:
        if pd.isna(work) or work == '':
            continue
            
        work_str = str(work)
        
        # 文字・記号で分割して単語を抽出
        words = re.findall(r'[一-龯ア-ヶー]+', work_str)
        for word in words:
            if len(word) >= 2:  # 2文字以上
                all_words[word] += 1
    
    print(f"抽出された全単語: {len(all_words)}個")
    
    # 頻度でソートして上位を確認
    top_words = all_words.most_common(100)
    print("頻出単語TOP30:")
    for i, (word, count) in enumerate(top_words[:30]):
        print(f"{i+1:2d}: {word} ({count}回)")
    
    # 手動でタイヤ関連、部品関連を分類
    targets = set()
    actions = set() 
    positions = set()
    
    for word, count in all_words.items():
        if count >= 3:  # 3回以上出現するもののみ
            # タイヤ・ホイール関連
            if any(kw in word for kw in ['タイヤ', 'ホイール', 'スペア']):
                targets.add(word)
            # 基本部品
            elif any(kw in word for kw in [
                'フェンダー', 'バンパー', 'ドア', 'ハンドル', 'タンク', 'ランプ', 'ライト',
                'ステー', 'ガード', 'パイプ', 'カバー', 'シート', '鋼板', '反射板',
                'ガラス', 'ゴム', 'キャッチ', 'グリル', 'ミラー', 'レール', 'メンバー',
                'ステップ', 'パネル', 'ブラケット', 'フィニッシャー', 'ヒンジ', 'センサー'
            ]):
                targets.add(word)
            # 動作関連
            elif any(kw in word for kw in [
                '交換', '脱着', '溶接', '切断', '製作', '修理', '塗装', '加工',
                '張替', '打替', '取付', '取替', '調整', '修正', '組替', '建付'
            ]):
                actions.add(word)
            # 位置関連  
            elif any(kw in word for kw in [
                '左', '右', '前', '後', '上', '下', '内', '外', '中央', 'センター',
                'インナー', 'アウター', 'アッパー', 'ロア', 'リア', 'フロント'
            ]):
                positions.add(word)
    
    # 結果をCSVに保存
    def save_to_csv(words, filename):
        sorted_words = sorted(words, key=lambda x: all_words[x], reverse=True)
        with open(f'請求書システム画像/hondata/{filename}', 'w', encoding='utf-8') as f:
            f.write('name,frequency\n')
            for word in sorted_words:
                f.write(f'{word},{all_words[word]}\n')
        return sorted_words
    
    targets_list = save_to_csv(targets, 'complete_targets.csv')
    actions_list = save_to_csv(actions, 'complete_actions.csv')  
    positions_list = save_to_csv(positions, 'complete_positions.csv')
    
    print(f"\n=== 完全辞書抽出結果 ===")
    print(f"Targets: {len(targets_list)}個")
    print(f"Actions: {len(actions_list)}個")
    print(f"Positions: {len(positions_list)}個")
    
    print(f"\nTargets TOP15:")
    for word in targets_list[:15]:
        print(f"  {word} ({all_words[word]}回)")
    
    print(f"\nActions TOP15:")
    for word in actions_list[:15]:
        print(f"  {word} ({all_words[word]}回)")
        
    print(f"\nPositions TOP10:")
    for word in positions_list[:10]:
        print(f"  {word} ({all_words[word]}回)")

if __name__ == "__main__":
    extract_complete_dictionary()