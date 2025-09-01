#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
テスト環境の完全性チェックスクリプト（シンプル版）
"""

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

def test_database():
    """データベース接続とテーブル構造をテスト"""
    print("=" * 50)
    print("テスト環境完全性チェック開始")
    print("=" * 50)
    
    try:
        supabase = get_supabase_client()
        print("OK Supabase接続成功")
        
        # テーブル存在確認
        tables = ["invoices", "invoice_line_items", "invoice_line_items_split"]
        
        results = {}
        for table in tables:
            try:
                result = supabase.table(table).select('*', count='exact').limit(1).execute()
                count = result.count if result.count is not None else 0
                results[table] = count
                print(f"  {table}: OK ({count}件)")
            except Exception as e:
                results[table] = -1
                print(f"  {table}: ERROR - {e}")
        
        # データ整合性チェック
        print("\nデータ整合性チェック:")
        
        if results["invoices"] > 0:
            print(f"  請求書データ: {results['invoices']}件")
        else:
            print("  請求書データ: なし")
            
        if results["invoice_line_items"] > 0:
            print(f"  明細データ: {results['invoice_line_items']}件")
        else:
            print("  明細データ: なし")
            
        if results["invoice_line_items_split"] > 0:
            print(f"  分割データ: {results['invoice_line_items_split']}件")
            
            # 分割データのサンプル確認
            sample = supabase.table("invoice_line_items_split").select("invoice_id, raw_label_part, amount").limit(3).execute()
            if sample.data:
                print("  分割データサンプル:")
                for item in sample.data:
                    print(f"    {item['invoice_id']}: {item['raw_label_part']} (¥{item['amount']})")
        else:
            print("  分割データ: なし")
        
        # 総合判定
        print("\n" + "=" * 50)
        print("テスト環境ステータス")
        print("=" * 50)
        
        all_tables = all(count >= 0 for count in results.values())
        has_invoices = results["invoices"] > 0
        has_line_items = results["invoice_line_items"] > 0
        has_split_items = results["invoice_line_items_split"] > 0
        
        print(f"テーブル構造: {'OK' if all_tables else 'NG'}")
        print(f"請求書データ: {'OK' if has_invoices else 'NG'}")
        print(f"明細データ: {'OK' if has_line_items else 'NG'}")
        print(f"分割データ: {'OK' if has_split_items else 'NG'}")
        
        if all_tables and has_invoices and has_line_items and has_split_items:
            print("\n結果: テスト環境は完全に整っています")
            print("- 請求書一覧: 動作可能")
            print("- 分割表示: 動作可能") 
            print("- 売上管理: 動作可能")
            return True
        else:
            print("\n結果: テスト環境に不足があります")
            if not all_tables:
                print("- テーブル作成が必要")
            if not (has_invoices and has_line_items):
                print("- 基本データが必要")
            if not has_split_items:
                print("- 分割データが必要")
            return False
            
    except Exception as e:
        print(f"ERROR: {e}")
        return False

if __name__ == "__main__":
    success = test_database()
    print(f"\n最終結果: {'成功' if success else '要対応'}")