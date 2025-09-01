import pandas as pd
import sys
import os

def read_excel_file(file_path):
    try:
        # ファイルの存在確認
        if not os.path.exists(file_path):
            print(f"ファイルが見つかりません: {file_path}")
            return
        
        # Excelファイルを読み込み
        df = pd.read_excel(file_path, sheet_name=None)  # 全シート読み込み
        
        print(f"ファイル: {file_path}")
        print("=" * 60)
        
        # 各シートの情報を表示
        for sheet_name, sheet_df in df.items():
            print(f"\nシート名: {sheet_name}")
            print(f"行数: {len(sheet_df)}")
            print(f"列数: {len(sheet_df.columns)}")
            print(f"カラム名: {list(sheet_df.columns)}")
            print("\n最初の5行:")
            print(sheet_df.head().to_string(index=False))
            print("-" * 60)
            
    except Exception as e:
        print(f"エラーが発生しました: {e}")

if __name__ == "__main__":
    file_path = r"C:\Windsurf\bankincafe\請求書システム画像\hondata\dadatest.xlsx"
    read_excel_file(file_path)