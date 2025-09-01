import pandas as pd
import re
import os

class RealDataWorkSplitter:
    def __init__(self):
        # 実データベースから作成した辞書を読み込み
        self.load_real_dictionaries()
        
    def load_real_dictionaries(self):
        """実データベースから作成された辞書を読み込み"""
        base_path = r"C:\Windsurf\bankincafe\請求書システム画像\hondata"
        
        try:
            # Targets辞書読み込み
            targets_df = pd.read_csv(f"{base_path}\\targets_dictionary.csv", encoding='utf-8-sig')
            self.targets = {}
            for _, row in targets_df.iterrows():
                category = row['category']
                keyword = row['keyword']
                if category not in self.targets:
                    self.targets[category] = []
                self.targets[category].append(keyword)
            
            # Actions辞書読み込み
            actions_df = pd.read_csv(f"{base_path}\\actions_dictionary.csv", encoding='utf-8-sig')
            self.actions = {}
            for _, row in actions_df.iterrows():
                category = row['category']
                keyword = row['keyword']
                if category not in self.actions:
                    self.actions[category] = []
                self.actions[category].append(keyword)
            
            # Positions辞書読み込み
            positions_df = pd.read_csv(f"{base_path}\\positions_dictionary.csv", encoding='utf-8-sig')
            self.positions = {}
            for _, row in positions_df.iterrows():
                category = row['category']
                keyword = row['keyword']
                if category not in self.positions:
                    self.positions[category] = []
                self.positions[category].append(keyword)
            
            print(f"実データ辞書読み込み完了:")
            print(f"  - Targets: {len(self.targets)}カテゴリ")
            print(f"  - Actions: {len(self.actions)}カテゴリ")
            print(f"  - Positions: {len(self.positions)}カテゴリ")
            
        except Exception as e:
            print(f"辞書読み込みエラー: {e}")
            # フォールバック用の基本辞書
            self.set_fallback_dictionaries()
    
    def set_fallback_dictionaries(self):
        """辞書読み込みに失敗した場合のフォールバック"""
        self.targets = {
            'フェンダー': ['フェンダー'],
            'ドア': ['ドア', '扉'],
            'その他': []
        }
        self.actions = {
            '交換': ['交換', '取替'],
            'その他': []
        }
        self.positions = {
            '左': ['左'],
            '右': ['右'],
            'なし': []
        }

    def find_matches(self, text, dictionary):
        """テキストから辞書の項目にマッチするものを見つける（改良版）"""
        matches = []
        text_lower = text.lower()
        
        # より精密なマッチング（長いキーワードから優先）
        sorted_items = []
        for category, keywords in dictionary.items():
            for keyword in keywords:
                sorted_items.append((category, keyword, len(keyword)))
        
        # キーワード長の降順でソート（長いキーワードを優先）
        sorted_items.sort(key=lambda x: x[2], reverse=True)
        
        matched_keywords = set()
        for category, keyword, _ in sorted_items:
            if keyword in text and keyword not in matched_keywords:
                matches.append(category)
                matched_keywords.add(keyword)
        
        return list(set(matches))  # 重複除去

    def split_work_item(self, work_description):
        """作業内容を分割して構造化（改良版）"""
        # ・で分割
        if '・' in work_description:
            parts = [part.strip() for part in work_description.split('・')]
            work_type = 'set'
        else:
            parts = [work_description.strip()]
            work_type = 'individual'
        
        results = []
        
        for i, part in enumerate(parts):
            if not part:
                continue
                
            # 各部分から要素を抽出
            targets = self.find_matches(part, self.targets)
            actions = self.find_matches(part, self.actions)
            positions = self.find_matches(part, self.positions)
            
            # マッチしなかった場合のデフォルト
            if not targets:
                targets = ['その他']
            if not actions:
                actions = ['その他']
            if not positions:
                positions = ['なし']
            
            result = {
                'original_text': work_description,
                'part_text': part,
                'part_index': i + 1,
                'work_type': work_type,
                'targets': targets,
                'actions': actions,
                'positions': positions,
                'target_primary': targets[0],
                'action_primary': actions[0],
                'position_primary': positions[0]
            }
            results.append(result)
        
        return results

    def process_csv_data(self, invoices_path, items_path):
        """CSVデータを処理して分割結果を生成（改良版）"""
        try:
            print("実データ辞書を使用してCSV処理開始...")
            
            # 既存のCSVデータを読み込み（正しい形式のファイルを使用）
            items_df = pd.read_csv(r"C:\Windsurf\bankincafe\請求書システム画像\hondata\invoice_items_import.csv", encoding='utf-8-sig')
            
            print(f"作業項目データ読み込み: {len(items_df)}件")
            
            # 分割処理を実行
            split_results = []
            
            for idx, row in items_df.iterrows():
                if pd.isna(row.get('item_description')):
                    continue
                    
                splits = self.split_work_item(str(row['item_description']))
                
                for split in splits:
                    result = {
                        'invoice_id': row.get('invoice_id', ''),
                        'original_description': str(row['item_description']),
                        'part_description': split['part_text'],
                        'part_index': split['part_index'],
                        'work_type': split['work_type'],
                        'target_primary': split['target_primary'],
                        'action_primary': split['action_primary'],
                        'position_primary': split['position_primary'],
                        'targets_all': '|'.join(split['targets']),
                        'actions_all': '|'.join(split['actions']),
                        'positions_all': '|'.join(split['positions']),
                        'original_quantity': row.get('quantity', 1),
                        'original_unit_price': row.get('unit_price', 0),
                        'original_amount': row.get('amount', 0)
                    }
                    split_results.append(result)
            
            return split_results
            
        except Exception as e:
            print(f"エラーが発生しました: {e}")
            return []

    def export_results(self, results, output_path):
        """結果をCSVファイルにエクスポート"""
        if not results:
            print("結果データがありません")
            return
        
        df = pd.DataFrame(results)
        df.to_csv(output_path, index=False, encoding='utf-8-sig')
        print(f"分割結果を保存しました: {output_path}")
        
        # 統計情報を表示
        print(f"\n=== 実データ辞書による分割結果統計 ===")
        print(f"総分割項目数: {len(df)}件")
        print(f"セット作業: {len(df[df['work_type'] == 'set'])}件")
        print(f"個別作業: {len(df[df['work_type'] == 'individual'])}件")
        
        print(f"\n=== よく使われる対象 TOP10 ===")
        target_counts = df['target_primary'].value_counts().head(10)
        for target, count in target_counts.items():
            print(f"{target}: {count}件")
        
        print(f"\n=== よく使われる動作 TOP10 ===")
        action_counts = df['action_primary'].value_counts().head(10)
        for action, count in action_counts.items():
            print(f"{action}: {count}件")
        
        # 改善状況の確認
        other_targets = len(df[df['target_primary'] == 'その他'])
        other_actions = len(df[df['action_primary'] == 'その他'])
        
        print(f"\n=== 辞書改善効果 ===")
        print(f"「その他」分類の対象: {other_targets}件 ({other_targets/len(df)*100:.1f}%)")
        print(f"「その他」分類の動作: {other_actions}件 ({other_actions/len(df)*100:.1f}%)")

def main():
    splitter = RealDataWorkSplitter()
    
    # ファイルパス
    invoices_path = r"C:\Windsurf\bankincafe\請求書システム画像\hondata\invoices_import_v2.csv"
    items_path = r"C:\Windsurf\bankincafe\請求書システム画像\hondata\invoice_items_import_v2.csv"
    output_path = r"C:\Windsurf\bankincafe\請求書システム画像\hondata\work_items_split_v2_real_dict.csv"
    
    # 処理実行
    print("実データ辞書を使用した作業分割処理を開始...")
    results = splitter.process_csv_data(invoices_path, items_path)
    
    if results:
        splitter.export_results(results, output_path)
        print("処理が完了しました")
    else:
        print("処理に失敗しました")

if __name__ == "__main__":
    main()