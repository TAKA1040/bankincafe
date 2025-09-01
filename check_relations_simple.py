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
        # target_actions確認
        print("\n=== target_actions テーブル ===")
        ta_response = requests.get(f"{supabase_url}/rest/v1/target_actions?select=count", headers=headers)
        ta_data = ta_response.json()
        ta_count = len(ta_data) if isinstance(ta_data, list) else 0
        print(f"対象動作関連数: {ta_count}件")
        
        # action_positions確認
        print("\n=== action_positions テーブル ===")
        ap_response = requests.get(f"{supabase_url}/rest/v1/action_positions?select=count", headers=headers)
        ap_data = ap_response.json()
        ap_count = len(ap_data) if isinstance(ap_data, list) else 0
        print(f"動作位置関連数: {ap_count}件")
        
        # マスタデータ確認
        print("\n=== マスタデータ ===")
        
        targets_response = requests.get(f"{supabase_url}/rest/v1/targets?select=id&eq.is_active.true", headers=headers)
        targets_count = len(targets_response.json()) if targets_response.json() else 0
        print(f"対象マスタ: {targets_count}件")
        
        actions_response = requests.get(f"{supabase_url}/rest/v1/actions?select=id&eq.is_active.true", headers=headers)
        actions_count = len(actions_response.json()) if actions_response.json() else 0
        print(f"動作マスタ: {actions_count}件")
        
        positions_response = requests.get(f"{supabase_url}/rest/v1/positions?select=id&eq.is_active.true", headers=headers)
        positions_count = len(positions_response.json()) if positions_response.json() else 0
        print(f"位置マスタ: {positions_count}件")
        
        print(f"\n=== 確認完了 ===")
        
        if ta_count == 0:
            print("[緊急] target_actions が0件です!")
        if ap_count == 0:
            print("[緊急] action_positions が0件です!")
            
        return True
        
    except Exception as e:
        print(f"エラー: {e}")
        return False

if __name__ == "__main__":
    check_relations()