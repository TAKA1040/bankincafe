import pandas as pd
import os

def create_db_format_csv():
    """
    元のExcelデータを新しいDB設計に適した形式に変換してCSVファイルを作成
    """
    
    # 元のExcelファイルパス
    excel_path = r"C:\Windsurf\bankincafe\請求書システム画像\hondata\dadatest.xlsx"
    
    # 出力フォルダ
    output_folder = r"C:\Windsurf\bankincafe\請求書システム画像\hondata"
    
    try:
        # Excelファイルを読み込み
        df = pd.read_excel(excel_path, sheet_name="請求書データ", header=1)
        print(f"元データ読み込み完了: {len(df)}行")
        
        # === 1. 請求書ヘッダーデータの作成 ===
        invoice_headers = []
        
        for idx, row in df.iterrows():
            # 基本項目
            header = {
                'invoice_id': row['請求書番号'],
                'customer_name': row['請求先'],
                'invoice_date': row['請求日'].strftime('%Y-%m-%d') if pd.notna(row['請求日']) else '',
                'subject': row['件名'] if pd.notna(row['件名']) else '',
                'order_number': str(row['発注番号']) if pd.notna(row['発注番号']) else '',
                'registration_number': row['登録番号'] if pd.notna(row['登録番号']) else '',
                'invoice_month': str(int(row['請求月'])) if pd.notna(row['請求月']) else '',
                'subtotal': int(row['小計']) if pd.notna(row['小計']) else 0,
                'tax_amount': int(row['消費税']) if pd.notna(row['消費税']) else 0,
                'total_amount': int(row['請求金額']) if pd.notna(row['請求金額']) else 0,
                'payment_status': 'unpaid',  # デフォルト値
                'status': 'finalized'  # 実データなので確定済み
            }
            invoice_headers.append(header)
        
        # 請求書ヘッダーCSV作成
        headers_df = pd.DataFrame(invoice_headers)
        headers_csv_path = os.path.join(output_folder, 'invoices_import.csv')
        headers_df.to_csv(headers_csv_path, index=False, encoding='utf-8-sig')
        print(f"請求書ヘッダーCSV作成完了: {headers_csv_path}")
        print(f"作成件数: {len(headers_df)}件")
        
        # === 2. 請求書明細データの作成 ===
        invoice_items = []
        
        for idx, row in df.iterrows():
            invoice_id = row['請求書番号']
            sort_order = 1
            
            # 各項目をチェック（最大32項目）
            for item_num in range(1, 33):
                item_col = f'品名{item_num}'
                qty_col = f'数量{item_num}'
                price_col = f'単価{item_num}'
                amount_col = f'金額{item_num}'
                
                # 該当カラムが存在し、品名にデータがある場合のみ処理
                if (item_col in df.columns and 
                    pd.notna(row[item_col]) and 
                    str(row[item_col]).strip() != ''):
                    
                    item = {
                        'invoice_id': invoice_id,
                        'item_description': str(row[item_col]).strip(),
                        'quantity': float(row[qty_col]) if pd.notna(row[qty_col]) else 1.0,
                        'unit_price': int(row[price_col]) if pd.notna(row[price_col]) else 0,
                        'amount': int(row[amount_col]) if pd.notna(row[amount_col]) else 0,
                        'sort_order': sort_order
                    }
                    invoice_items.append(item)
                    sort_order += 1
        
        # 請求書明細CSV作成
        items_df = pd.DataFrame(invoice_items)
        items_csv_path = os.path.join(output_folder, 'invoice_items_import.csv')
        items_df.to_csv(items_csv_path, index=False, encoding='utf-8-sig')
        print(f"請求書明細CSV作成完了: {items_csv_path}")
        print(f"作成件数: {len(items_df)}件")
        
        # === 3. データ概要レポート作成 ===
        report = f"""
=== データ変換レポート ===

【請求書ヘッダー】
- 総請求書数: {len(headers_df)}件
- 期間: {headers_df['invoice_date'].min()} ～ {headers_df['invoice_date'].max()}
- 顧客数: {headers_df['customer_name'].nunique()}社
- 総売上: {headers_df['total_amount'].sum():,}円

【請求書明細】
- 総明細数: {len(items_df)}件
- 請求書あたりの平均明細数: {len(items_df)/len(headers_df):.1f}件
- 最高単価: {items_df['unit_price'].max():,}円
- 最低単価: {items_df['unit_price'].min():,}円

【主要顧客】
{headers_df['customer_name'].value_counts().head().to_string()}

【出力ファイル】
1. {headers_csv_path}
2. {items_csv_path}
        """
        
        report_path = os.path.join(output_folder, 'conversion_report.txt')
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write(report)
        
        print(report)
        print(f"\n変換レポート保存: {report_path}")
        
        return True
        
    except Exception as e:
        print(f"エラーが発生しました: {e}")
        return False

if __name__ == "__main__":
    success = create_db_format_csv()
    if success:
        print("\nデータ変換が正常に完了しました")
    else:
        print("\nデータ変換でエラーが発生しました")