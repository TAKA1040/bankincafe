#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
分割CSVデータをSupabaseにインポートするスクリプト
"""

import pandas as pd
import os
from supabase import create_client, Client
from dotenv import load_dotenv

# 環境変数を読み込み
load_dotenv()

def get_supabase_client() -> Client:
    """Supabaseクライアントを初期化"""
    url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    key = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
    
    if not url or not key:
        raise Exception("Supabase環境変数が設定されていません")
    
    return create_client(url, key)

def import_split_data():
    """分割CSVデータをインポート"""
    
    # CSVファイル読み込み
    csv_path = r"C:\Windsurf\bankincafe\請求書システム画像\karidata\out\invoice_line_items_split.csv"
    
    if not os.path.exists(csv_path):
        print(f"エラー: CSVファイルが見つかりません: {csv_path}")
        return
    
    df = pd.read_csv(csv_path, encoding='utf-8-sig')
    print(f"読み込み件数: {len(df)} 件")
    
    # Supabaseクライアント初期化
    supabase = get_supabase_client()
    
    # 既存データをクリア
    try:
        result = supabase.table('invoice_line_items_split').delete().neq('id', 0).execute()
        print("既存データをクリアしました")
    except Exception as e:
        print(f"データクリア中にエラー: {e}")
    
    # データ変換とインポート
    batch_size = 50
    total_inserted = 0
    
    for i in range(0, len(df), batch_size):
        batch = df.iloc[i:i+batch_size]
        
        # データ形式を変換
        records = []
        for _, row in batch.iterrows():
            record = {
                'invoice_id': str(row['invoice_id']),
                'line_no': int(row['line_no']),
                'sub_no': int(row['sub_no']),
                'raw_label_part': str(row['raw_label_part']),
                'action': str(row['action']) if pd.notna(row['action']) and row['action'].strip() else None,
                'target': str(row['target']) if pd.notna(row['target']) and row['target'].strip() else None,
                'position': str(row['position']) if pd.notna(row['position']) and row['position'].strip() else None,
                'unit_price': float(row['unit_price']),
                'quantity': int(row['quantity']),
                'amount': float(row['amount']),
                'is_cancelled': bool(row['is_cancelled'])
            }
            records.append(record)
        
        # バッチインサート
        try:
            result = supabase.table('invoice_line_items_split').insert(records).execute()
            batch_count = len(result.data) if result.data else 0
            total_inserted += batch_count
            print(f"バッチ {i//batch_size + 1}: {batch_count} 件インサート (累計: {total_inserted})")
        except Exception as e:
            print(f"バッチ {i//batch_size + 1} インサート中にエラー: {e}")
            continue
    
    print(f"\nインポート完了: 総 {total_inserted} 件")
    
    # 確認クエリ
    try:
        result = supabase.table('invoice_line_items_split').select('*', count='exact').execute()
        print(f"データベース確認: {result.count} 件のレコードが存在します")
        
        # サンプルデータ表示
        if result.data and len(result.data) > 0:
            print("\n=== サンプルデータ（最初の3件） ===")
            for i, record in enumerate(result.data[:3]):
                print(f"{i+1}. {record['invoice_id']}-{record['line_no']}-{record['sub_no']}: {record['raw_label_part']}")
                
    except Exception as e:
        print(f"確認クエリエラー: {e}")

if __name__ == "__main__":
    try:
        import_split_data()
    except Exception as e:
        print(f"実行エラー: {e}")
        print("pip install supabase python-dotenv が必要な場合があります")