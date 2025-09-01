import pandas as pd
import os
from datetime import datetime

def create_database_insert_sql():
    """実データ辞書からデータベース投入用SQLを生成"""
    
    base_path = r"C:\Windsurf\bankincafe\請求書システム画像\hondata"
    output_path = r"C:\Windsurf\bankincafe\supabase"
    
    try:
        # 各辞書CSVを読み込み
        targets_df = pd.read_csv(f"{base_path}\\targets_dictionary.csv", encoding='utf-8-sig')
        actions_df = pd.read_csv(f"{base_path}\\actions_dictionary.csv", encoding='utf-8-sig')
        positions_df = pd.read_csv(f"{base_path}\\positions_dictionary.csv", encoding='utf-8-sig')
        
        print(f"辞書データ読み込み完了:")
        print(f"  - Targets: {len(targets_df)}件")
        print(f"  - Actions: {len(actions_df)}件") 
        print(f"  - Positions: {len(positions_df)}件")
        
        # SQL生成開始
        sql_content = f"""-- 実データ辞書投入SQL
-- 生成日時: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

-- =====================================
-- 1. TARGETS (対象マスター) の更新
-- =====================================

"""
        
        # Targetsテーブル用SQL生成
        target_categories = targets_df['category'].unique()
        
        for category in target_categories:
            keywords = targets_df[targets_df['category'] == category]['keyword'].tolist()
            keywords_str = ', '.join([f"'{kw}'" for kw in keywords])
            
            sql_content += f"""-- {category}の更新/追加
INSERT INTO targets (name, description, keywords, created_at, updated_at)
VALUES (
  '{category}',
  '{category}関連の作業対象',
  ARRAY[{keywords_str}],
  NOW(),
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  updated_at = NOW();

"""
        
        # Actionsテーブル用SQL生成
        sql_content += """
-- =====================================
-- 2. ACTIONS (動作マスター) の更新
-- =====================================

"""
        
        action_categories = actions_df['category'].unique()
        
        for category in action_categories:
            keywords = actions_df[actions_df['category'] == category]['keyword'].tolist()
            keywords_str = ', '.join([f"'{kw}'" for kw in keywords])
            
            sql_content += f"""-- {category}の更新/追加
INSERT INTO actions (name, description, keywords, created_at, updated_at)
VALUES (
  '{category}',
  '{category}関連の作業動作',
  ARRAY[{keywords_str}],
  NOW(),
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  updated_at = NOW();

"""
        
        # Positionsテーブル用SQL生成
        sql_content += """
-- =====================================
-- 3. POSITIONS (位置マスター) の更新
-- =====================================

"""
        
        position_categories = positions_df['category'].unique()
        
        for category in position_categories:
            keywords = positions_df[positions_df['category'] == category]['keyword'].tolist()
            keywords_str = ', '.join([f"'{kw}'" for kw in keywords])
            
            sql_content += f"""-- {category}の更新/追加
INSERT INTO positions (name, description, keywords, created_at, updated_at)
VALUES (
  '{category}',
  '{category}関連の位置情報',
  ARRAY[{keywords_str}],
  NOW(),
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  updated_at = NOW();

"""
        
        # 古いデータクリーンアップSQL
        sql_content += f"""
-- =====================================
-- 4. 古いデータのクリーンアップ
-- =====================================

-- 今回の更新で含まれていない古いデータを削除
DELETE FROM targets WHERE updated_at < '{datetime.now().strftime('%Y-%m-%d')}' AND name NOT IN ({', '.join([f"'{cat}'" for cat in target_categories])});
DELETE FROM actions WHERE updated_at < '{datetime.now().strftime('%Y-%m-%d')}' AND name NOT IN ({', '.join([f"'{cat}'" for cat in action_categories])});
DELETE FROM positions WHERE updated_at < '{datetime.now().strftime('%Y-%m-%d')}' AND name NOT IN ({', '.join([f"'{cat}'" for cat in position_categories])});

-- =====================================
-- 5. 更新結果確認
-- =====================================

SELECT 'targets' as table_name, COUNT(*) as record_count FROM targets
UNION ALL
SELECT 'actions' as table_name, COUNT(*) as record_count FROM actions  
UNION ALL
SELECT 'positions' as table_name, COUNT(*) as record_count FROM positions;
"""
        
        # SQLファイルとして保存
        sql_file_path = f"{output_path}\\update_real_dictionary.sql"
        with open(sql_file_path, 'w', encoding='utf-8') as f:
            f.write(sql_content)
        
        print(f"\nSQL投入ファイルを生成しました: {sql_file_path}")
        
        # データベース投入用CSVファイルも生成
        create_csv_for_import(targets_df, actions_df, positions_df, base_path)
        
        return sql_file_path
        
    except Exception as e:
        print(f"エラーが発生しました: {e}")
        return None

def create_csv_for_import(targets_df, actions_df, positions_df, base_path):
    """データベース投入用の統合CSVファイルを生成"""
    
    # Targetsデータの整形
    targets_import = []
    for category in targets_df['category'].unique():
        keywords = targets_df[targets_df['category'] == category]['keyword'].tolist()
        targets_import.append({
            'table_type': 'targets',
            'name': category,
            'description': f'{category}関連の作業対象',
            'keywords': '|'.join(keywords)
        })
    
    # Actionsデータの整形
    actions_import = []
    for category in actions_df['category'].unique():
        keywords = actions_df[actions_df['category'] == category]['keyword'].tolist()
        actions_import.append({
            'table_type': 'actions',
            'name': category,
            'description': f'{category}関連の作業動作',
            'keywords': '|'.join(keywords)
        })
    
    # Positionsデータの整形
    positions_import = []
    for category in positions_df['category'].unique():
        keywords = positions_df[positions_df['category'] == category]['keyword'].tolist()
        positions_import.append({
            'table_type': 'positions',
            'name': category,
            'description': f'{category}関連の位置情報',
            'keywords': '|'.join(keywords)
        })
    
    # 統合データフレーム作成
    all_import_data = targets_import + actions_import + positions_import
    import_df = pd.DataFrame(all_import_data)
    
    # CSV出力
    csv_file_path = f"{base_path}\\dictionary_import_unified.csv"
    import_df.to_csv(csv_file_path, index=False, encoding='utf-8-sig')
    print(f"統合CSVファイルを生成しました: {csv_file_path}")
    
    # 各テーブル別のCSVも生成
    targets_import_df = pd.DataFrame(targets_import)
    targets_import_df.to_csv(f"{base_path}\\targets_import.csv", index=False, encoding='utf-8-sig')
    
    actions_import_df = pd.DataFrame(actions_import)
    actions_import_df.to_csv(f"{base_path}\\actions_import.csv", index=False, encoding='utf-8-sig')
    
    positions_import_df = pd.DataFrame(positions_import)
    positions_import_df.to_csv(f"{base_path}\\positions_import.csv", index=False, encoding='utf-8-sig')
    
    print("個別テーブル用CSVも生成完了")

def show_summary():
    """生成されたファイルの概要を表示"""
    
    base_path = r"C:\Windsurf\bankincafe\請求書システム画像\hondata"
    
    print("\n" + "="*60)
    print("📋 実データ辞書のデータベース投入準備完了")
    print("="*60)
    
    print("\n🎯 生成されたファイル:")
    print("1. SQL投入ファイル:")
    print("   - C:\\Windsurf\\bankincafe\\supabase\\update_real_dictionary.sql")
    
    print("\n2. CSV投入ファイル:")
    print("   - dictionary_import_unified.csv (統合版)")
    print("   - targets_import.csv (対象マスター)")
    print("   - actions_import.csv (動作マスター)")
    print("   - positions_import.csv (位置マスター)")
    
    print("\n🚀 次のステップ:")
    print("1. SQLファイルをSupabaseで実行")
    print("2. または、CSVファイルをSupabaseにインポート")
    print("3. 動作確認")
    
    print("\n💡 投入内容:")
    try:
        targets_df = pd.read_csv(f"{base_path}\\targets_dictionary.csv", encoding='utf-8-sig')
        actions_df = pd.read_csv(f"{base_path}\\actions_dictionary.csv", encoding='utf-8-sig')
        positions_df = pd.read_csv(f"{base_path}\\positions_dictionary.csv", encoding='utf-8-sig')
        
        print(f"   - Targets: {len(targets_df['category'].unique())}カテゴリ, {len(targets_df)}キーワード")
        print(f"   - Actions: {len(actions_df['category'].unique())}カテゴリ, {len(actions_df)}キーワード")
        print(f"   - Positions: {len(positions_df['category'].unique())}カテゴリ, {len(positions_df)}キーワード")
    except:
        print("   - 統計情報の取得に失敗")

def main():
    print("実データ辞書のデータベース投入準備を開始...")
    
    sql_file_path = create_database_insert_sql()
    
    if sql_file_path:
        show_summary()
    else:
        print("処理に失敗しました")

if __name__ == "__main__":
    main()