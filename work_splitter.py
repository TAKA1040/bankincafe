import pandas as pd
import re
import os

class WorkSplitter:
    def __init__(self):
        # 基本的な作業部品辞書
        self.targets = {
            'フェンダー': ['フェンダー'],
            'ハンドル': ['ハンドル'],
            'タンク': ['タンク', 'オイルタンク', '燃料タンク'],
            'バンパー': ['バンパー', 'インナーバンパー'],
            'ドア': ['ドア', '扉', '煽りドア', '観音扉'],
            'ランプ': ['ランプ', 'ヘッドライト', 'フォグランプ', 'フラッシャー', 'マーカーランプ', 'コーナーランプ'],
            'ステイ': ['ステイ', 'ブラケット', 'ステップブラケット'],
            'ガード': ['ガード', 'サイドガード'],
            'レール': ['レール', 'ガイドレール', 'ラッシングレール'],
            'パイプ': ['パイプ', 'クランプ'],
            'ゴム': ['ゴム', 'アーチゴム'],
            'ワイヤー': ['ワイヤー', 'カプラーワイヤー', 'ハーネス'],
            'メンバー': ['メンバー', 'クロスメンバー'],
            'グリル': ['グリル', 'フロントグリル'],
            'ミラー': ['ミラー', 'アンダーミラー'],
            'キャッチ': ['キャッチ', 'ウィングキャッチ'],
            '鋼板': ['鋼板', '縞鋼板'],
            '支柱': ['支柱'],
            '枠骨': ['枠骨'],
            'カバー': ['カバー', 'ロアカバー', 'エンドカバー', 'フィニッシャー'],
            'その他': []
        }
        
        # 基本的な作業動作辞書
        self.actions = {
            '交換': ['交換', '取替'],
            '脱着': ['脱着'],
            '溶接': ['溶接'],
            '切断': ['切断'],
            '製作': ['製作'],
            '修理': ['修理'],
            '修正': ['修正'],
            '塗装': ['塗装'],
            '加工': ['加工'],
            '取付': ['取付', '取り付け'],
            '引出し': ['引出し'],
            '打替': ['打ち替え', '打替'],
            'その他': []
        }
        
        # 位置辞書
        self.positions = {
            '左': ['左'],
            '右': ['右'],
            '前': ['前'],
            '後': ['後', 'リヤ'],
            '中央': ['中央', 'センター'],
            '上': ['上'],
            '下': ['下'],
            '内': ['内', 'インナー'],
            '外': ['外'],
            'なし': []
        }

    def find_matches(self, text, dictionary):
        """テキストから辞書の項目にマッチするものを見つける"""
        matches = []
        text_lower = text.lower()
        
        for category, keywords in dictionary.items():
            for keyword in keywords:
                if keyword in text:
                    matches.append(category)
                    break
        
        return list(set(matches))  # 重複除去

    def split_work_item(self, work_description):
        """作業内容を分割して構造化"""
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
        """CSVデータを処理して分割結果を生成"""
        try:
            # CSVファイルを読み込み
            print("CSVファイルを読み込み中...")
            
            # 請求書ヘッダー（最初の行をスキップしてヘッダーを手動設定）
            invoices_df = pd.read_csv(invoices_path, encoding='utf-8-sig', header=0)
            
            # カラム名を適切に設定
            expected_cols = [
                'index', 'invoice_id', 'invoice_month', 'invoice_date', 'customer_name', 
                'subject', 'registration_number', 'order_number', 'internal_order_number',
                'subtotal', 'tax_amount', 'total_amount', 'item1_name', 'item1_qty', 'item1_price', 'item1_amount'
            ]
            
            # カラム数を確認して調整
            actual_cols = len(invoices_df.columns)
            if actual_cols >= len(expected_cols):
                invoices_df.columns = expected_cols + [f'extra_{i}' for i in range(actual_cols - len(expected_cols))]
            
            print(f"請求書データ: {len(invoices_df)}件")
            
            # 作業項目を抽出（横展開された明細を縦に変換）
            work_items = []
            
            for idx, row in invoices_df.iterrows():
                invoice_id = row['invoice_id']
                customer_name = row['customer_name']
                invoice_date = row['invoice_date']
                
                # 各明細項目を処理（item1から始まって、空でない項目まで）
                item_index = 1
                while True:
                    name_col = f'item{item_index}_name'
                    qty_col = f'item{item_index}_qty'
                    price_col = f'item{item_index}_price'
                    amount_col = f'item{item_index}_amount'
                    
                    # カラムが存在し、作業名が空でない場合
                    if (name_col in row and pd.notna(row[name_col]) and 
                        str(row[name_col]).strip() != ''):
                        
                        work_item = {
                            'invoice_id': invoice_id,
                            'customer_name': customer_name,
                            'invoice_date': invoice_date,
                            'item_description': str(row[name_col]).strip(),
                            'quantity': float(row[qty_col]) if pd.notna(row.get(qty_col, 0)) else 1.0,
                            'unit_price': int(row[price_col]) if pd.notna(row.get(price_col, 0)) else 0,
                            'amount': int(row[amount_col]) if pd.notna(row.get(amount_col, 0)) else 0
                        }
                        work_items.append(work_item)
                        item_index += 1
                    else:
                        break
            
            print(f"作業項目: {len(work_items)}件")
            
            # 分割処理を実行
            split_results = []
            
            for item in work_items:
                splits = self.split_work_item(item['item_description'])
                
                for split in splits:
                    result = {
                        'invoice_id': item['invoice_id'],
                        'customer_name': item['customer_name'],
                        'invoice_date': item['invoice_date'],
                        'original_description': item['item_description'],
                        'part_description': split['part_text'],
                        'part_index': split['part_index'],
                        'work_type': split['work_type'],
                        'target_primary': split['target_primary'],
                        'action_primary': split['action_primary'],
                        'position_primary': split['position_primary'],
                        'targets_all': '|'.join(split['targets']),
                        'actions_all': '|'.join(split['actions']),
                        'positions_all': '|'.join(split['positions']),
                        'original_quantity': item['quantity'],
                        'original_unit_price': item['unit_price'],
                        'original_amount': item['amount']
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
        print(f"\n=== 分割結果統計 ===")
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

def main():
    splitter = WorkSplitter()
    
    # ファイルパス
    invoices_path = r"C:\Windsurf\bankincafe\請求書システム画像\hondata\invoices_import_v2.csv"
    items_path = r"C:\Windsurf\bankincafe\請求書システム画像\hondata\invoice_items_import_v2.csv"
    output_path = r"C:\Windsurf\bankincafe\請求書システム画像\hondata\work_items_split.csv"
    
    # 処理実行
    print("作業分割処理を開始...")
    results = splitter.process_csv_data(invoices_path, items_path)
    
    if results:
        splitter.export_results(results, output_path)
        print("処理が完了しました")
    else:
        print("処理に失敗しました")

if __name__ == "__main__":
    main()