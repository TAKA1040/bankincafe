#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import requests

def check_relations():
    """関連設定の現在状況を確認"""
    
    print("=== 関連設定状況確認開始 ===")
    
    supabase_url = "https://auwmmosfteomieyexkeh.supabase.co"
    api_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1d21tb3NmdGVvbWlleWV4a2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzcxNTYsImV4cCI6MjA3MTAxMzE1Nn0.9SsGplOy1PQak1y7WLfzadvTOfm4NuuX8254lEctvj0"
    
    headers = {
        "apikey": api_key,
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    try:
        # 対象-動作関連確認
        print("\n=== 対象-動作関連 (target_actions) ===")
        target_actions_response = requests.get(
            f"{supabase_url}/rest/v1/target_actions?select=*",
            headers=headers
        )
        target_actions_data = target_actions_response.json()
        print(f"対象↔動作関連数: {len(target_actions_data)}件")
        
        if len(target_actions_data) > 0:
            print("最初の5件:")
            for i, ta in enumerate(target_actions_data[:5]):
                print(f"  {i+1}: target_id={ta['target_id']}, action_id={ta['action_id']}")
        else:
            print("[警告] 対象-動作関連が0件です!")
        
        # 動作-位置関連確認
        print("\n=== 動作-位置関連 (action_positions) ===")
        action_positions_response = requests.get(
            f"{supabase_url}/rest/v1/action_positions?select=*",
            headers=headers
        )
        action_positions_data = action_positions_response.json()
        print(f"動作↔位置関連数: {len(action_positions_data)}件")
        
        if len(action_positions_data) > 0:
            print("最初の5件:")
            for i, ap in enumerate(action_positions_data[:5]):
                print(f"  {i+1}: action_id={ap['action_id']}, position_id={ap['position_id']}")
        else:
            print("[警告] 動作-位置関連が0件です!")
        
        # マスタデータ確認
        print("\n=== マスタデータ確認 ===")
        
        # 対象マスタ
        targets_response = requests.get(
            f"{supabase_url}/rest/v1/targets?select=*&eq.is_active.true",
            headers=headers
        )
        targets_data = targets_response.json()
        print(f"対象マスタ: {len(targets_data)}件")
        
        # 動作マスタ
        actions_response = requests.get(
            f"{supabase_url}/rest/v1/actions?select=*&eq.is_active.true",
            headers=headers
        )
        actions_data = actions_response.json()
        print(f"動作マスタ: {len(actions_data)}件")
        
        # 位置マスタ
        positions_response = requests.get(
            f"{supabase_url}/rest/v1/positions?select=*&eq.is_active.true",
            headers=headers
        )
        positions_data = positions_response.json()
        print(f"位置マスタ: {len(positions_data)}件")
        
        print(f"\n=== 関連設定状況確認完了 ===")
        
        return {
            'target_actions_count': len(target_actions_data),
            'action_positions_count': len(action_positions_data),
            'targets_count': len(targets_data),
            'actions_count': len(actions_data),
            'positions_count': len(positions_data)
        }
        
    except Exception as e:
        print(f"エラー: {e}")
        return None

if __name__ == "__main__":
    result = check_relations()
    if result:
        print(f"\n[SUCCESS] 関連設定確認完了!")
        print(f"対象-動作関連: {result['target_actions_count']}件")
        print(f"動作-位置関連: {result['action_positions_count']}件")
        print(f"マスタ - 対象:{result['targets_count']}, 動作:{result['actions_count']}, 位置:{result['positions_count']}")
        
        if result['target_actions_count'] == 0:
            print("[緊急] 対象-動作関連が0件になっています!")
        if result['action_positions_count'] == 0:
            print("[緊急] 動作-位置関連が0件になっています!")
    else:
        print(f"\n[ERROR] 関連設定確認に失敗しました")