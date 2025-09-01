import pandas as pd
import json

def analyze_excel_data():
    file_path = r"C:\Windsurf\bankincafe\請求書システム画像\hondata\dadatest.xlsx"
    
    try:
        # Excelファイルを読み込み（ヘッダー行を適切に処理）
        df = pd.read_excel(file_path, sheet_name="請求書データ", header=1)  # 2行目をヘッダーに
        
        print("=== 請求書データ分析 ===")
        print(f"総行数: {len(df)}")
        print(f"総列数: {len(df.columns)}")
        
        # カラム名を表示
        print("\n=== カラム構造分析 ===")
        for i, col in enumerate(df.columns):
            non_null_count = df[col].notna().sum()
            print(f"{i+1:2d}. {col} (非NULL: {non_null_count}行)")
        
        # 請求書IDと基本情報の確認
        print("\n=== 請求書基本情報サンプル ===")
        basic_cols = ['請求書番号', '請求月', '請求日', '顧客名', '登録番号', 'オーダー番号', '小計', '消費税', '請求合計']
        available_basic = [col for col in basic_cols if col in df.columns]
        
        if available_basic:
            sample_df = df[available_basic].head(10)
            print(sample_df.to_string(index=False))
        
        # 明細項目の分析
        print("\n=== 明細項目分析 ===")
        item_cols = [col for col in df.columns if '項目' in col or '作業' in col or '単価' in col or '金額' in col]
        
        if item_cols:
            print(f"明細関連カラム数: {len(item_cols)}")
            # 各項目列の使用状況
            for col in item_cols[:20]:  # 最初の20項目のみ表示
                non_null = df[col].notna().sum()
                if non_null > 0:
                    print(f"  {col}: {non_null}件の記録")
        
        # ユニークな請求書番号数
        if '請求書番号' in df.columns:
            unique_invoices = df['請求書番号'].nunique()
            print(f"\nユニークな請求書数: {unique_invoices}")
        
        # データの型と値の例
        print("\n=== データサンプル（最初の3行） ===")
        for i in range(min(3, len(df))):
            print(f"\n--- 請求書 {i+1} ---")
            row = df.iloc[i]
            for col in available_basic:
                if pd.notna(row[col]):
                    print(f"{col}: {row[col]}")
        
        # CSVとしてエクスポート（分析用）
        output_file = "dadatest_analysis.csv"
        df.to_csv(output_file, encoding='utf-8-sig', index=False)
        print(f"\n分析用CSVファイルを作成しました: {output_file}")
        
    except Exception as e:
        print(f"エラー: {e}")

if __name__ == "__main__":
    analyze_excel_data()