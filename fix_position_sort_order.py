#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import requests

def fix_position_sort_order():
    """位置マスタの順序重複を修正"""
    
    print("=== 位置マスタ順序重複修正開始 ===")
    
    supabase_url = "https://auwmmosfteomieyexkeh.supabase.co"
    api_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1d21tb3NmdGVvbWlleWV4a2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzcxNTYsImV4cCI6MjA3MTAxMzE1Nn0.9SsGplOy1PQak1y7WLfzadvTOfm4NuuX8254lEctvj0"
    
    headers = {
        "apikey": api_key,
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    try:
        # 位置マスタデータ取得
        print("位置マスタデータ取得中...")
        positions_response = requests.get(
            f"{supabase_url}/rest/v1/positions?select=*&order=id",
            headers=headers
        )
        positions_data = positions_response.json()
        print(f"位置マスタデータ: {len(positions_data)}件")
        
        # 現在の状態を表示
        print("\n=== 現在の順序状態 ===")
        for pos in positions_data:
            print(f"ID: {pos['id']}, 名前: {pos['name']}, 順序: {pos['sort_order']}")
        
        # 順序重複チェック
        sort_orders = [pos['sort_order'] for pos in positions_data]
        duplicates = set([x for x in sort_orders if sort_orders.count(x) > 1])
        
        if duplicates:
            print(f"\n[WARNING] 重複している順序: {duplicates}")
            
            # 順序を正しく再設定
            print("\n=== 順序修正実行 ===")
            positions_data.sort(key=lambda x: (x['sort_order'], x['id']))  # 順序とIDでソート
            
            for i, pos in enumerate(positions_data, start=1):
                new_sort_order = i
                if pos['sort_order'] != new_sort_order:
                    print(f"ID {pos['id']} ({pos['name']}): {pos['sort_order']} → {new_sort_order}")
                    
                    # 順序を更新
                    update_response = requests.patch(
                        f"{supabase_url}/rest/v1/positions?id=eq.{pos['id']}",
                        headers=headers,
                        json={"sort_order": new_sort_order}
                    )
                    
                    if update_response.status_code != 204:
                        print(f"更新エラー ID {pos['id']}: {update_response.text}")
            
            # 修正後の状態を確認
            print("\n=== 修正後の状態確認 ===")
            positions_response = requests.get(
                f"{supabase_url}/rest/v1/positions?select=*&order=sort_order",
                headers=headers
            )
            updated_positions = positions_response.json()
            
            for pos in updated_positions:
                print(f"ID: {pos['id']}, 名前: {pos['name']}, 順序: {pos['sort_order']}")
            
            print(f"\n=== 位置マスタ順序重複修正完了 ===")
            print(f"修正件数: {len([p for p in positions_data if positions_data.index(p) + 1 != p['sort_order']])}")
        else:
            print("\n[OK] 順序重複なし - 修正不要")
        
        return {
            'positions_count': len(positions_data),
            'duplicates_found': len(duplicates) > 0,
            'duplicates': list(duplicates)
        }
        
    except Exception as e:
        print(f"エラー: {e}")
        return None

if __name__ == "__main__":
    result = fix_position_sort_order()
    if result:
        print(f"\n[SUCCESS] 位置マスタ順序修正完了!")
        if result['duplicates_found']:
            print(f"修正対象の重複順序: {result['duplicates']}")
        print(f"総位置マスタ数: {result['positions_count']}")
    else:
        print(f"\n[ERROR] 順序修正に失敗しました")