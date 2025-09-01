#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
テスト環境の完全性チェックスクリプト
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

def test_database_connection():
    """データベース接続とテーブル構造をテスト"""
    print("=" * 60)
    print("テスト環境完全性チェック開始")
    print("=" * 60)
    
    try:
        supabase = get_supabase_client()
        print("OK Supabase接続成功")
        
        # 1. テーブル存在確認
        print("\nテーブル構造確認:")
        
        tables_to_check = [
            "invoices",
            "invoice_line_items", 
            "invoice_line_items_split"
        ]
        
        table_status = {}
        
        for table in tables_to_check:
            try:
                result = supabase.table(table).select('*', count='exact').limit(1).execute()
                count = result.count if result.count is not None else 0
                table_status[table] = {
                    'exists': True,
                    'count': count,
                    'status': '✅'
                }
                print(f"  {table}: ✅ ({count}件)")
            except Exception as e:
                table_status[table] = {
                    'exists': False,
                    'error': str(e),
                    'status': '❌'
                }
                print(f"  {table}: ❌ エラー - {e}")
        
        # 2. データ整合性チェック
        print("\n🔗 データ関係性チェック:")
        
        if table_status["invoices"]["exists"] and table_status["invoice_line_items"]["exists"]:
            # invoices と invoice_line_items の整合性
            invoices_result = supabase.table("invoices").select("invoice_id", count='exact').execute()
            line_items_result = supabase.table("invoice_line_items").select("invoice_id", count='exact').execute()
            
            print(f"  請求書数: {invoices_result.count}件")
            print(f"  明細数: {line_items_result.count}件")
            
            if invoices_result.count > 0 and line_items_result.count > 0:
                print("  ✅ 基本データ存在")
            else:
                print("  ⚠️ データが不足している可能性")
        
        # 3. 分割テーブルのデータ確認
        if table_status["invoice_line_items_split"]["exists"]:
            split_result = supabase.table("invoice_line_items_split").select("*", count='exact').limit(5).execute()
            print(f"\n📊 分割データ詳細:")
            print(f"  分割項目数: {split_result.count}件")
            
            if split_result.data:
                print("  サンプルデータ:")
                for i, item in enumerate(split_result.data[:3], 1):
                    print(f"    {i}. {item['invoice_id']}-{item['line_no']}-{item['sub_no']}: {item['raw_label_part']}")
                    print(f"       金額: ¥{item['amount']}, 数量: {item['quantity']}")
                print("  ✅ 分割データ正常")
            else:
                print("  ⚠️ 分割データが空です")
        
        # 4. 機能別テスト
        print("\n🚀 機能別動作テスト:")
        
        # 売上集計テスト
        try:
            invoices_data = supabase.table("invoices").select("total_amount, issue_date, customer_name").execute()
            if invoices_data.data:
                total_sales = sum(item['total_amount'] or 0 for item in invoices_data.data)
                customers = set(item['customer_name'] for item in invoices_data.data if item['customer_name'])
                print(f"  売上集計: ✅ (総額: ¥{total_sales:,}, 顧客数: {len(customers)})")
            else:
                print("  売上集計: ⚠️ データなし")
        except Exception as e:
            print(f"  売上集計: ❌ エラー - {e}")
        
        # 分割表示テスト
        try:
            if table_status["invoice_line_items_split"]["exists"] and split_result.count > 0:
                # 分割項目のある明細を取得
                split_test = supabase.table("invoice_line_items_split").select("invoice_id, line_no").limit(1).execute()
                if split_test.data:
                    test_invoice = split_test.data[0]['invoice_id']
                    test_line = split_test.data[0]['line_no']
                    
                    # その明細の分割項目を全取得
                    splits = supabase.table("invoice_line_items_split").select("*").eq("invoice_id", test_invoice).eq("line_no", test_line).execute()
                    print(f"  分割表示: ✅ ({test_invoice}-{test_line} で {len(splits.data)}項目)")
                else:
                    print("  分割表示: ⚠️ テストデータなし")
            else:
                print("  分割表示: ⚠️ 分割テーブル未対応")
        except Exception as e:
            print(f"  分割表示: ❌ エラー - {e}")
        
        # 5. 総合判定
        print("\n" + "=" * 60)
        print("📋 テスト環境完全性レポート")
        print("=" * 60)
        
        all_tables_exist = all(status["exists"] for status in table_status.values())
        has_data = any(status.get("count", 0) > 0 for status in table_status.values() if status["exists"])
        has_split_data = table_status.get("invoice_line_items_split", {}).get("count", 0) > 0
        
        print(f"✅ テーブル構造: {'完備' if all_tables_exist else '不完全'}")
        print(f"✅ 基本データ: {'存在' if has_data else '不足'}")
        print(f"✅ 分割機能: {'動作可能' if has_split_data else '未整備'}")
        
        if all_tables_exist and has_data and has_split_data:
            print("\n🎉 テスト環境は完全に整っています！")
            print("   - 請求書一覧表示: 動作可能")
            print("   - 作業明細分割表示: 動作可能") 
            print("   - 売上管理システム: 動作可能")
            return True
        else:
            print("\n⚠️ テスト環境に不足があります")
            if not all_tables_exist:
                print("   - テーブル作成が必要")
            if not has_data:
                print("   - テストデータの投入が必要")
            if not has_split_data:
                print("   - 分割データの生成・インポートが必要")
            return False
            
    except Exception as e:
        print(f"❌ データベース接続エラー: {e}")
        return False

if __name__ == "__main__":
    success = test_database_connection()
    exit(0 if success else 1)