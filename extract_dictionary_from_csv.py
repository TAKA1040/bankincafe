import pandas as pd
import re
from collections import Counter
import json

class DictionaryExtractor:
    def __init__(self):
        self.all_work_names = []
        
    def extract_work_names_from_csv(self, csv_path):
        """CSVから全ての品名を抽出"""
        try:
            # CSVを読み込み
            df = pd.read_csv(csv_path, encoding='utf-8-sig')
            print(f"データ読み込み完了: {len(df)}行")
            
            # 品名1～品名32の全てのカラムから品名を抽出
            work_names = []
            
            for index, row in df.iterrows():
                for i in range(1, 33):  # 品名1～品名32
                    col_name = f'品名{i}'
                    if col_name in df.columns:
                        work_name = row[col_name]
                        if pd.notna(work_name) and str(work_name).strip() != '':
                            work_names.append(str(work_name).strip())
            
            self.all_work_names = work_names
            print(f"抽出された品名総数: {len(work_names)}件")
            
            # 重複を除いたユニークな品名
            unique_work_names = list(set(work_names))
            print(f"ユニーク品名数: {len(unique_work_names)}件")
            
            return work_names
            
        except Exception as e:
            print(f"エラー: {e}")
            return []
    
    def analyze_patterns(self):
        """品名のパターンを分析して辞書の要素を抽出"""
        
        # 全品名を結合してテキスト分析
        all_text = ' '.join(self.all_work_names)
        
        # 対象物（部品）のパターン抽出
        target_patterns = [
            # 車体部品
            r'(フェンダー|バンパー|ドア|扉|ボンネット|トランク)',
            # 内装・操作系
            r'(ハンドル|シート|レギュレター|ラッチ|サッシュ|内張り)',
            # ライト・電装系
            r'(ヘッドライト|フォグランプ|マーカーランプ|コーナーランプ|フラッシャー|反射板)',
            # エンジン・機械系
            r'(タンク|パイプ|ホース|シャフト|ベルト|マフラー)',
            # 構造・支持系
            r'(ステー|ブラケット|ステイ|フレーム|メンバー|リブ)',
            # ガード・カバー系
            r'(ガード|カバー|サイド|プロテクター)',
            # ガラス・樹脂系
            r'(ガラス|ゴム|シート)',
            # 金属部材
            r'(鋼板|縞鋼板|フラットバー|パイプ|クランプ)',
            # その他部品
            r'(キャッチ|ウイング|蝶番|ストライカー|レール|グリル|ミラー)'
        ]
        
        # 動作のパターン抽出
        action_patterns = [
            r'(交換|取替|取り替え)',
            r'(脱着|取り外し|取付|取り付け)',
            r'(溶接|接合)',
            r'(切断|切替|切り替え)',
            r'(製作|制作)',
            r'(修理|修正|補修)',
            r'(塗装|研磨|仕上げ)',
            r'(加工|調整|直し)',
            r'(張替|打ち換え|打替)',
            r'(応急|補強)'
        ]
        
        # 位置のパターン抽出
        position_patterns = [
            r'(左|右)',
            r'(前|後|リヤ)',
            r'(上|下|上側|下側)',
            r'(内|外|内側|外側)',
            r'(中央|センター)',
            r'(インナー|アウター)'
        ]
        
        # パターンマッチングで要素を抽出
        targets = self.extract_patterns(all_text, target_patterns)
        actions = self.extract_patterns(all_text, action_patterns)
        positions = self.extract_patterns(all_text, position_patterns)
        
        return targets, actions, positions
    
    def extract_patterns(self, text, patterns):
        """正規表現パターンから要素を抽出"""
        found_items = []
        
        for pattern in patterns:
            matches = re.findall(pattern, text)
            found_items.extend(matches)
        
        # 頻度をカウント
        counter = Counter(found_items)
        return counter
    
    def create_dictionary_mapping(self, targets, actions, positions):
        """抽出した要素から辞書マッピングを作成"""
        
        # より詳細な辞書マッピング（実際のデータに基づく）
        target_mapping = {
            'フェンダー': ['フェンダー'],
            'バンパー': ['バンパー', 'インナーバンパー'],
            'ドア': ['ドア', '扉', '観音扉', '煽りドア'],
            'ハンドル': ['ハンドル', 'アウターハンドル'],
            'タンク': ['タンク', '燃料タンク', 'オイルタンク'],
            'ランプ': ['ヘッドライト', 'フォグランプ', 'マーカーランプ', 'コーナーランプ', 'フラッシャー'],
            'ステー': ['ステー', 'ブラケット', 'ステイ'],
            'ガード': ['ガード', 'サイドガード'],
            'パイプ': ['パイプ', 'ホース', 'ヒーターパイプ'],
            'カバー': ['カバー', 'ロアカバー', 'エンドカバー', 'アウターカバー', 'マフラーカバー'],
            'シート': ['シート', 'ウイングシート'],
            '鋼板': ['鋼板', '縞鋼板'],
            '反射板': ['反射板'],
            'ガラス': ['ガラス', '安全ガラス'],
            'ゴム': ['ゴム', 'アーチゴム'],
            'キャッチ': ['キャッチ', 'ウィングキャッチ'],
            'グリル': ['グリル', 'フロントグリル'],
            'ミラー': ['ミラー', 'アンダーミラー'],
            'レール': ['レール', 'ガイドレール', 'ラッシングレール'],
            'メンバー': ['メンバー', 'クロスメンバー'],
            'その他': []
        }
        
        action_mapping = {
            '交換': ['交換', '取替', '取り替え'],
            '脱着': ['脱着', '取り外し', '取付', '取り付け'],
            '溶接': ['溶接', '接合'],
            '切断': ['切断', '切替', '切り替え'],
            '製作': ['製作', '制作'],
            '修理': ['修理', '修正', '補修'],
            '塗装': ['塗装', '研磨', '仕上げ'],
            '加工': ['加工', '調整', '直し', '曲がり直し'],
            '張替': ['張替', '張り替え'],
            '打替': ['打ち換え', '打替', 'リベット打ち換え'],
            'その他': []
        }
        
        position_mapping = {
            '左': ['左'],
            '右': ['右'],
            '前': ['前'],
            '後': ['後', 'リヤ'],
            '上': ['上', '上側'],
            '下': ['下', '下側'],
            '内': ['内', '内側', 'インナー'],
            '外': ['外', '外側', 'アウター'],
            '中央': ['中央', 'センター'],
            'なし': []
        }
        
        return target_mapping, action_mapping, position_mapping
    
    def export_dictionaries(self, target_mapping, action_mapping, position_mapping):
        """辞書をCSVファイルとして出力"""
        
        output_dir = r"C:\Windsurf\bankincafe\請求書システム画像\hondata"
        
        # Targetsの辞書CSV
        target_data = []
        for main_key, keywords in target_mapping.items():
            for keyword in keywords:
                target_data.append({'category': main_key, 'keyword': keyword})
        
        target_df = pd.DataFrame(target_data)
        target_csv = f"{output_dir}\\targets_dictionary.csv"
        target_df.to_csv(target_csv, index=False, encoding='utf-8-sig')
        print(f"Targets辞書を保存: {target_csv}")
        
        # Actionsの辞書CSV
        action_data = []
        for main_key, keywords in action_mapping.items():
            for keyword in keywords:
                action_data.append({'category': main_key, 'keyword': keyword})
        
        action_df = pd.DataFrame(action_data)
        action_csv = f"{output_dir}\\actions_dictionary.csv"
        action_df.to_csv(action_csv, index=False, encoding='utf-8-sig')
        print(f"Actions辞書を保存: {action_csv}")
        
        # Positionsの辞書CSV
        position_data = []
        for main_key, keywords in position_mapping.items():
            for keyword in keywords:
                if keyword:  # 空文字列を除外
                    position_data.append({'category': main_key, 'keyword': keyword})
        
        position_df = pd.DataFrame(position_data)
        position_csv = f"{output_dir}\\positions_dictionary.csv"
        position_df.to_csv(position_csv, index=False, encoding='utf-8-sig')
        print(f"Positions辞書を保存: {position_csv}")
        
        # 全品名のサンプルも出力
        unique_names = list(set(self.all_work_names))
        sample_df = pd.DataFrame({'work_name': unique_names})
        sample_csv = f"{output_dir}\\all_work_names_sample.csv"
        sample_df.to_csv(sample_csv, index=False, encoding='utf-8-sig')
        print(f"全品名サンプルを保存: {sample_csv}")
    
    def run_analysis(self, csv_path):
        """全体の分析を実行"""
        print("=== 辞書作成開始 ===")
        
        # 1. 品名データ抽出
        work_names = self.extract_work_names_from_csv(csv_path)
        if not work_names:
            return
        
        # 2. パターン分析
        targets, actions, positions = self.analyze_patterns()
        
        print(f"\n=== パターン分析結果 ===")
        print(f"対象物パターン数: {len(targets)}")
        print("対象物TOP10:", dict(targets.most_common(10)))
        
        print(f"\n動作パターン数: {len(actions)}")
        print("動作TOP10:", dict(actions.most_common(10)))
        
        print(f"\n位置パターン数: {len(positions)}")
        print("位置TOP10:", dict(positions.most_common(10)))
        
        # 3. 辞書マッピング作成
        target_mapping, action_mapping, position_mapping = self.create_dictionary_mapping(targets, actions, positions)
        
        # 4. 辞書エクスポート
        self.export_dictionaries(target_mapping, action_mapping, position_mapping)
        
        print(f"\n=== 辞書作成完了 ===")

def main():
    extractor = DictionaryExtractor()
    csv_path = r"C:\Windsurf\bankincafe\請求書システム画像\hondata\dada2.csv"
    
    extractor.run_analysis(csv_path)

if __name__ == "__main__":
    main()