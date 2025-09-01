#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import requests
import re

def add_target_readings():
    """対象マスタに読み仮名カラムを追加し、自動生成した読み仮名を投入"""
    
    print("=== 対象マスタ読み仮名追加開始 ===")
    
    # 読み仮名変換ルール
    def generate_reading(name):
        """部品名から読み仮名を自動生成"""
        
        # カタカナ変換規則
        katakana_rules = {
            # 基本部品
            'ドア': 'どあ',
            'サイドガード': 'さいどがーど',
            'ステー': 'すてー',
            'ブラケット': 'ぶらけっと',
            'パイプ': 'ぱいぷ',
            'ホース': 'ほーす',
            'ハンドル': 'はんどる',
            'パネル': 'ぱねる',
            'カバー': 'かばー',
            'ライト': 'らいと',
            'ランプ': 'らんぷ',
            'ミラー': 'みらー',
            'フェンダー': 'ふぇんだー',
            'バンパー': 'ばんぱー',
            'ステップ': 'すてっぷ',
            'センサー': 'せんさー',
            'タンク': 'たんく',
            'フィルター': 'ふぃるたー',
            'エンジン': 'えんじん',
            'ブレーキ': 'ぶれーき',
            'クラッチ': 'くらっち',
            'ワイパー': 'わいぱー',
            'ホーン': 'ほーん',
            'ペダル': 'ぺだる',
            'バッテリー': 'ばってりー',
            'コンプレッサー': 'こんぷれっさー',
            'ダッシュボード': 'だっしゅぼーど',
            'シートベルト': 'しーとべると',
            
            # 複合語
            'テールライト': 'てーるらいと',
            'ヘッドライト': 'へっどらいと',
            'フォグライト': 'ふぉぐらいと',
            'バックライト': 'ばっくらいと',
            'コーナーライト': 'こーなーらいと',
            'フラッシャーライト': 'ふらっしゃーらいと',
            'マーカーライト': 'まーかーらいと',
            'タイヤ灯': 'たいやとう',
            
            'サイドミラー': 'さいどみらー',
            'バックミラー': 'ばっくみらー',
            'アンダーミラー': 'あんだーみらー',
            
            'フロントバンパー': 'ふろんとばんぱー',
            'インナーバンパー': 'いんなーばんぱー',
            'バンパーフィニッシャー': 'ばんぱーふぃにっしゃー',
            
            'アッパーフェンダー': 'あっぱーふぇんだー',
            'ロアフェンダー': 'ろあふぇんだー',
            'フロントフェンダー': 'ふろんとふぇんだー',
            'リアフェンダー': 'りあふぇんだー',
            
            'ファーストステップ': 'ふぁーすとすてっぷ',
            'セカンドステップ': 'せかんどすてっぷ',
            'サードステップ': 'さーどすてっぷ',
            'アッパーステップ': 'あっぱーすてっぷ',
            'ロアステップ': 'ろあすてっぷ',
            
            '燃料タンク': 'ねんりょうたんく',
            'エアタンク': 'えあたんく',
            'オイルタンク': 'おいるたんく',
            'アドブルータンク': 'あどぶるーたんく',
            'ウォッシャータンク': 'うぉっしゃーたんく',
            
            'コーナーパネル': 'こーなーぱねる',
            'ドアパネル': 'どあぱねる',
            'サイドパネル': 'さいどぱねる',
            'インナーパネル': 'いんなーぱねる',
            
            'マフラーカバー': 'まふらーかばー',
            'エンジンカバー': 'えんじんかばー',
            'アンダーカバー': 'あんだーかばー',
            'ロアカバー': 'ろあかばー',
            'バッテリーカバー': 'ばってりーかばー',
            'タイヤハウスカバー': 'たいやはうすかばー',
            'ホイールカバー': 'ほいーるかばー',
            'エンドカバー': 'えんどかばー',
            
            'NOXセンサー': 'のっくすせんさー',
            'DPFセンサー': 'でぃーぴーえふせんさー',
            'サイドセンサー': 'さいどせんさー',
            'レベリングセンサー': 'れべりんぐせんさー',
            
            'マッドガード': 'まっどがーど'
        }
        
        # 直接マッピングがあれば使用
        if name in katakana_rules:
            return katakana_rules[name]
        
        # 基本的な変換規則
        reading = name.lower()
        
        # カタカナ → ひらがな簡易変換
        katakana_to_hiragana = {
            'ア': 'あ', 'イ': 'い', 'ウ': 'う', 'エ': 'え', 'オ': 'お',
            'カ': 'か', 'キ': 'き', 'ク': 'く', 'ケ': 'け', 'コ': 'こ',
            'ガ': 'が', 'ギ': 'ぎ', 'グ': 'ぐ', 'ゲ': 'げ', 'ゴ': 'ご',
            'サ': 'さ', 'シ': 'し', 'ス': 'す', 'セ': 'せ', 'ソ': 'そ',
            'ザ': 'ざ', 'ジ': 'じ', 'ズ': 'ず', 'ゼ': 'ぜ', 'ゾ': 'ぞ',
            'タ': 'た', 'チ': 'ち', 'ツ': 'つ', 'テ': 'て', 'ト': 'と',
            'ダ': 'だ', 'ヂ': 'ぢ', 'ヅ': 'づ', 'デ': 'で', 'ド': 'ど',
            'ナ': 'な', 'ニ': 'に', 'ヌ': 'ぬ', 'ネ': 'ね', 'ノ': 'の',
            'ハ': 'は', 'ヒ': 'ひ', 'フ': 'ふ', 'ヘ': 'へ', 'ホ': 'ほ',
            'バ': 'ば', 'ビ': 'び', 'ブ': 'ぶ', 'ベ': 'べ', 'ボ': 'ぼ',
            'パ': 'ぱ', 'ピ': 'ぴ', 'プ': 'ぷ', 'ペ': 'ぺ', 'ポ': 'ぽ',
            'マ': 'ま', 'ミ': 'み', 'ム': 'む', 'メ': 'め', 'モ': 'も',
            'ヤ': 'や', 'ユ': 'ゆ', 'ヨ': 'よ',
            'ラ': 'ら', 'リ': 'り', 'ル': 'る', 'レ': 'れ', 'ロ': 'ろ',
            'ワ': 'わ', 'ヲ': 'を', 'ン': 'ん',
            'ー': 'ー', 'ッ': 'っ'
        }
        
        # カタカナをひらがなに変換
        for kata, hira in katakana_to_hiragana.items():
            reading = reading.replace(kata, hira)
        
        return reading
    
    # 実データベースから対象データ取得
    supabase_url = "https://auwmmosfteomieyexkeh.supabase.co"
    api_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1d21tb3NmdGVvbWlleWV4a2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzcxNTYsImV4cCI6MjA3MTAxMzE1Nn0.9SsGplOy1PQak1y7WLfzadvTOfm4NuuX8254lEctvj0"
    
    headers = {
        "apikey": api_key,
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    try:
        # 対象データ取得
        print("対象データ取得中...")
        targets_response = requests.get(
            f"{supabase_url}/rest/v1/targets?select=*&order=sort_order",
            headers=headers
        )
        targets_data = targets_response.json()
        print(f"対象データ: {len(targets_data)}件")
        
        # 読み仮名生成
        readings_data = []
        for target in targets_data:
            name = target['name']
            reading = generate_reading(name)
            readings_data.append({
                'name': name,
                'reading': reading,
                'id': target['id']
            })
            print(f"「{name}」→「{reading}」")
        
        # SQLマイグレーション生成
        timestamp = "20250902022000"
        filename = f'supabase/migrations/{timestamp}_add_target_readings.sql'
        
        sql_content = f"""-- Add reading column to targets table
-- Generated readings for {len(readings_data)} targets

-- Add reading column to targets table
ALTER TABLE targets ADD COLUMN IF NOT EXISTS reading TEXT;

-- Update targets with generated readings
"""
        
        # 各対象の読み仮名更新SQL
        for data in readings_data:
            escaped_name = data['name'].replace("'", "''")
            escaped_reading = data['reading'].replace("'", "''")
            sql_content += f"UPDATE targets SET reading = '{escaped_reading}' WHERE name = '{escaped_name}';\n"
        
        sql_content += f"""
-- Create index for reading search
CREATE INDEX IF NOT EXISTS idx_targets_reading ON targets(reading);

-- Verify readings
SELECT name, reading FROM targets ORDER BY sort_order LIMIT 20;
"""
        
        # ファイルに保存
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(sql_content)
        
        print(f"\n=== 対象マスタ読み仮名追加完了 ===")
        print(f"マイグレーションファイル: {filename}")
        print(f"読み仮名生成数: {len(readings_data)}件")
        
        return {
            'readings_count': len(readings_data),
            'migration_file': filename
        }
        
    except Exception as e:
        print(f"エラー: {e}")
        return None

if __name__ == "__main__":
    result = add_target_readings()
    if result:
        print(f"\n[SUCCESS] 対象マスタ読み仮名追加完了!")
        print(f"次のステップ: supabase db push で読み仮名を適用")
    else:
        print(f"\n[ERROR] 読み仮名追加に失敗しました")