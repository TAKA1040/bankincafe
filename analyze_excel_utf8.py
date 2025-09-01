import pandas as pd
import json

def analyze_excel_data():
    file_path = r"C:\Windsurf\bankincafe\請求書システム画像\hondata\dadatest.xlsx"
    
    try:
        # Excelファイルを読み込み（ヘッダー行を適切に処理）
        df = pd.read_excel(file_path, sheet_name="請求書データ", header=1)
        
        print("=== 請求書データ分析 ===")
        print(f"総行数: {len(df)}")
        print(f"総列数: {len(df.columns)}")
        
        # カラム名を表示（最初の20カラムのみ）
        print("\n=== 主要カラム構造分析 ===")
        main_cols = df.columns[:20]
        for i, col in enumerate(main_cols):
            non_null_count = df[col].notna().sum()
            print(f"{i+1:2d}. {col} (非NULL: {non_null_count}行)")
        
        # 請求書基本情報の確認
        print("\n=== 請求書基本情報サンプル（最初の5行） ===")
        basic_cols = ['請求書番号', '請求月', '請求日', '顧客名', '登録番号', 'オーダー番号', '小計', '消費税', '請求合計']
        available_basic = [col for col in basic_cols if col in df.columns]
        
        if available_basic:
            sample_df = df[available_basic].head(5)
            for idx, row in sample_df.iterrows():
                print(f"\n{idx+1}行目:")
                for col in available_basic:
                    if pd.notna(row[col]):
                        print(f"  {col}: {row[col]}")
        
        # 明細項目の分析（項目1-6のみ）
        print("\n=== 明細項目分析（使用されている項目のみ） ===")
        item_analysis = []
        for i in range(1, 7):
            item_col = f'項目{i}'
            amount_col = f'金額{i}'
            if item_col in df.columns and amount_col in df.columns:
                item_count = df[item_col].notna().sum()
                if item_count > 0:
                    item_analysis.append({
                        'index': i,
                        'count': item_count,
                        'sample_items': df[df[item_col].notna()][item_col].head(3).tolist(),
                        'sample_amounts': df[df[amount_col].notna()][amount_col].head(3).tolist()
                    })
        
        for item in item_analysis:
            print(f"項目{item['index']}: {item['count']}件の記録")
            print(f"  サンプル項目: {item['sample_items']}")
            print(f"  サンプル金額: {item['sample_amounts']}")
            print()
        
        # データの統計情報
        print("=== データ統計 ===")
        if '小計' in df.columns:
            print(f"小計の平均: {df['小計'].mean():.0f}円")
            print(f"小計の範囲: {df['小計'].min()}円 - {df['小計'].max()}円")
        
        if '顧客名' in df.columns:
            unique_customers = df['顧客名'].nunique()
            print(f"ユニークな顧客数: {unique_customers}")
            print("主要顧客:")
            customer_counts = df['顧客名'].value_counts().head(5)
            for customer, count in customer_counts.items():
                print(f"  {customer}: {count}件")
        
    except Exception as e:
        print(f"エラー: {e}")

if __name__ == "__main__":
    analyze_excel_data()