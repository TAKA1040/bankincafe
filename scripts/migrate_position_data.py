#!/usr/bin/env python3
"""
位置データ移行スクリプト
CSVファイルのpositions_allカラムから位置情報を抽出し、work_item_positionsテーブルに移行
"""

import pandas as pd
import psycopg2
import os
from typing import List, Dict
import logging

# ログ設定
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def parse_positions_from_csv(csv_file_path: str) -> List[Dict]:
    """
    CSVファイルから位置データを解析
    
    Args:
        csv_file_path: CSVファイルのパス
        
    Returns:
        位置データのリスト [{split_item_id, position}, ...]
    """
    try:
        df = pd.read_csv(csv_file_path, encoding='utf-8')
        logger.info(f"CSV読み込み完了: {len(df)} 行")
        
        position_records = []
        
        for index, row in df.iterrows():
            invoice_id = row.get('invoice_id')
            part_index = row.get('part_index', 1)  # sub_no相当
            positions_all = row.get('positions_all', '')
            
            if pd.isna(positions_all) or positions_all.strip() == '':
                continue
                
            # split_item_idは後でDBから取得する必要があるため、一時的にinvoice_id + part_indexで識別
            # パイプ区切り（|）で分割
            positions = [pos.strip() for pos in str(positions_all).split('|') if pos.strip()]
            
            for position in positions:
                if position and position != 'なし':  # 'なし'は除外
                    position_records.append({
                        'invoice_id': invoice_id,
                        'part_index': part_index,  
                        'position': position
                    })
        
        logger.info(f"位置データ解析完了: {len(position_records)} 件")
        return position_records
        
    except Exception as e:
        logger.error(f"CSV解析エラー: {e}")
        raise

def get_split_item_mapping(conn) -> Dict[tuple, int]:
    """
    invoice_id + line_no + sub_no から split_item_id へのマッピングを取得
    
    Args:
        conn: データベース接続
        
    Returns:
        {(invoice_id, part_index): split_item_id} のマッピング辞書
    """
    try:
        cursor = conn.cursor()
        
        # invoice_line_items_splitテーブルからマッピング情報を取得
        query = """
        SELECT invoice_id, sub_no, id as split_item_id
        FROM invoice_line_items_split
        ORDER BY invoice_id, sub_no
        """
        
        cursor.execute(query)
        results = cursor.fetchall()
        
        # マッピング辞書を作成
        mapping = {}
        for invoice_id, sub_no, split_item_id in results:
            mapping[(invoice_id, sub_no)] = split_item_id
            
        cursor.close()
        logger.info(f"split_item_idマッピング取得完了: {len(mapping)} 件")
        return mapping
        
    except Exception as e:
        logger.error(f"マッピング取得エラー: {e}")
        raise

def migrate_positions_to_db(conn, position_records: List[Dict], mapping: Dict[tuple, int]):
    """
    位置データをwork_item_positionsテーブルに移行
    
    Args:
        conn: データベース接続
        position_records: 位置データのリスト
        mapping: split_item_idマッピング
    """
    try:
        cursor = conn.cursor()
        
        # 既存データをクリア
        cursor.execute("DELETE FROM work_item_positions")
        logger.info("既存の位置データをクリア")
        
        inserted_count = 0
        skipped_count = 0
        
        for record in position_records:
            invoice_id = record['invoice_id']
            part_index = record['part_index']
            position = record['position']
            
            # split_item_idを取得
            key = (invoice_id, part_index)
            split_item_id = mapping.get(key)
            
            if split_item_id is None:
                logger.warning(f"split_item_id が見つからない: {key}")
                skipped_count += 1
                continue
            
            # work_item_positionsに挿入
            insert_query = """
            INSERT INTO work_item_positions (split_item_id, position, created_at)
            VALUES (%s, %s, NOW())
            """
            
            cursor.execute(insert_query, (split_item_id, position))
            inserted_count += 1
        
        conn.commit()
        logger.info(f"位置データ移行完了: 挿入 {inserted_count} 件, スキップ {skipped_count} 件")
        
        cursor.close()
        
    except Exception as e:
        conn.rollback()
        logger.error(f"位置データ移行エラー: {e}")
        raise

def main():
    """メイン処理"""
    
    # 設定
    CSV_FILE = r"C:\Windsurf\bankincafe\請求書システム画像\hondata\work_items_split_v2_real_dict.csv"
    
    # データベース接続情報（必要に応じて環境変数から取得）
    DB_CONFIG = {
        'host': 'localhost',
        'port': 54322,
        'database': 'postgres',
        'user': 'postgres', 
        'password': 'postgres'
    }
    
    try:
        logger.info("位置データ移行スクリプト開始")
        
        # CSVから位置データを解析
        position_records = parse_positions_from_csv(CSV_FILE)
        
        if not position_records:
            logger.warning("移行対象の位置データが見つかりません")
            return
        
        # データベースに接続
        conn = psycopg2.connect(**DB_CONFIG)
        logger.info("データベース接続成功")
        
        # split_item_idマッピングを取得
        mapping = get_split_item_mapping(conn)
        
        # 位置データを移行
        migrate_positions_to_db(conn, position_records, mapping)
        
        conn.close()
        logger.info("位置データ移行スクリプト完了")
        
    except Exception as e:
        logger.error(f"移行スクリプト実行エラー: {e}")
        raise

if __name__ == "__main__":
    main()