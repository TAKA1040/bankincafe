import pandas as pd
import re

def analyze_work_names():
    """
    実際の作業名データを分析して、自動車整備業の作業パターンを抽出
    """
    
    # CSVファイルを読み込み
    csv_path = r"C:\Windsurf\bankincafe\請求書システム画像\hondata\invoice_items_import.csv"
    
    try:
        df = pd.read_csv(csv_path, encoding='utf-8-sig')
        
        print("=== 実際の作業名データ分析 ===")
        print(f"総明細数: {len(df)}件\n")
        
        # 作業名の長さ分析
        work_lengths = df['item_description'].str.len()
        print("=== 作業名の長さ統計 ===")
        print(f"平均文字数: {work_lengths.mean():.1f}文字")
        print(f"最短: {work_lengths.min()}文字")
        print(f"最長: {work_lengths.max()}文字")
        print(f"中央値: {work_lengths.median():.1f}文字\n")
        
        # 最も長い作業名 TOP10
        print("=== 最も長い作業名 TOP10 ===")
        longest_works = df.nlargest(10, df['item_description'].str.len())
        for idx, row in longest_works.iterrows():
            print(f"{len(row['item_description'])}文字: {row['item_description']}")
        print()
        
        # 最も短い作業名 TOP10
        print("=== 最も短い作業名 TOP10 ===")
        shortest_works = df.nsmallest(10, df['item_description'].str.len())
        for idx, row in shortest_works.iterrows():
            print(f"{len(row['item_description'])}文字: {row['item_description']}")
        print()
        
        # よく使われるキーワード分析
        print("=== よく使われるキーワード分析 ===")
        all_text = ' '.join(df['item_description'].astype(str))
        
        # 特定のパターンを抽出
        patterns = {
            '部品名': r'(フェンダー|ハンドル|タンク|バンパー|ガード|ランプ|扉|レール|ステイ|ブラケット)',
            '作業動詞': r'(交換|取替|脱着|溶接|切断|製作|修理|修正|塗装|加工)',
            '位置': r'(左|右|前|後|中央|上|下|内|外)',
            '材質・部材': r'(鋼板|パイプ|ワイヤー|ゴム|クランプ)'
        }
        
        for category, pattern in patterns.items():
            matches = re.findall(pattern, all_text)
            if matches:
                unique_matches = list(set(matches))
                print(f"{category}: {', '.join(unique_matches[:10])}")  # 最初の10個のみ表示
        print()
        
        # 複合作業パターンの識別
        print("=== 複合作業パターン（・で区切られた作業） ===")
        complex_works = df[df['item_description'].str.contains('・')]['item_description']
        print(f"複合作業数: {len(complex_works)}件 ({len(complex_works)/len(df)*100:.1f}%)")
        
        print("\n複合作業例（最初の5件）:")
        for work in complex_works.head():
            parts = work.split('・')
            print(f"- {work}")
            print(f"  → 分割候補: {len(parts)}個 [{', '.join(parts)}]")
            print()
        
        # 単価との相関
        print("=== 作業名長さと単価の相関 ===")
        df_with_length = df.copy()
        df_with_length['name_length'] = df_with_length['item_description'].str.len()
        
        # 長さ別の平均単価
        length_groups = df_with_length.groupby(pd.cut(df_with_length['name_length'], 
                                                    bins=[0, 10, 20, 30, 50, 100], 
                                                    labels=['～10字', '11-20字', '21-30字', '31-50字', '51字～']))
        
        for group, data in length_groups:
            if len(data) > 0:
                print(f"{group}: 平均単価 ¥{data['unit_price'].mean():.0f} ({len(data)}件)")
        
        # 実際の作業パターンをサンプルデータとして出力
        print("\n=== サンプルデータ候補（価格付き） ===")
        sample_works = df.groupby('item_description').agg({
            'unit_price': 'mean',
            'amount': 'mean',
            'quantity': 'mean'
        }).reset_index()
        
        # 頻度順でトップ20
        work_counts = df['item_description'].value_counts()
        top_works = work_counts.head(20)
        
        print("頻度の高い作業 TOP20:")
        for work_name, count in top_works.items():
            work_data = sample_works[sample_works['item_description'] == work_name].iloc[0]
            print(f"- {work_name}")
            print(f"  頻度: {count}回, 平均単価: ¥{work_data['unit_price']:.0f}")
            print()
            
    except Exception as e:
        print(f"エラー: {e}")

if __name__ == "__main__":
    analyze_work_names()