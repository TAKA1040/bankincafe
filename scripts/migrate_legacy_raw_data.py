#!/usr/bin/env python3
"""
旧原文データ移行スクリプト
invoice_line_itemsテーブルの旧システムraw_labelデータをlegacy_line_item_rawsテーブルに移行
"""

import psycopg2
import logging
from typing import List, Tuple

# ログ設定
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def get_legacy_line_items(conn) -> List[Tuple]:
    """
    旧システムから来た明細項目を特定して取得
    
    Args:
        conn: データベース接続
        
    Returns:
        [(line_item_id, raw_label), ...] のタプルリスト
    """
    try:
        cursor = conn.cursor()
        
        # 旧システムデータの特定条件:
        # 1. task_type = 'fuzzy' (非構造化データ)
        # 2. raw_labelが存在し、空でない
        query = """
        SELECT 
            id as line_item_id,
            raw_label,
            task_type,
            created_at
        FROM invoice_line_items
        WHERE task_type = 'fuzzy' 
          AND raw_label IS NOT NULL 
          AND TRIM(raw_label) != ''
        ORDER BY id
        """
        
        cursor.execute(query)
        results = cursor.fetchall()
        
        # raw_labelが存在するもののみ抽出
        legacy_items = []
        for line_item_id, raw_label, task_type, created_at in results:
            if raw_label and raw_label.strip():
                legacy_items.append((line_item_id, raw_label.strip()))
                
        cursor.close()
        logger.info(f"旧システム明細項目特定完了: {len(legacy_items)} 件")
        
        # サンプルデータをログ出力
        if legacy_items:
            logger.info("サンプルデータ:")
            for i, (item_id, raw_label) in enumerate(legacy_items[:3]):
                logger.info(f"  ID:{item_id} - {raw_label[:50]}...")
                
        return legacy_items
        
    except Exception as e:
        logger.error(f"旧システムデータ特定エラー: {e}")
        raise

def migrate_to_legacy_table(conn, legacy_items: List[Tuple]):
    """
    旧原文データをlegacy_line_item_rawsテーブルに移行
    
    Args:
        conn: データベース接続
        legacy_items: [(line_item_id, raw_label), ...] のリスト
    """
    try:
        cursor = conn.cursor()
        
        # 既存データをクリア
        cursor.execute("DELETE FROM legacy_line_item_raws")
        logger.info("既存の旧原文データをクリア")
        
        inserted_count = 0
        error_count = 0
        
        for line_item_id, raw_text in legacy_items:
            try:
                # legacy_line_item_rawsに挿入
                insert_query = """
                INSERT INTO legacy_line_item_raws (line_item_id, raw_text)
                VALUES (%s, %s)
                """
                
                cursor.execute(insert_query, (line_item_id, raw_text))
                inserted_count += 1
                
            except psycopg2.IntegrityError as e:
                # 重複キーエラーなど
                logger.warning(f"挿入エラー (ID:{line_item_id}): {e}")
                error_count += 1
                conn.rollback()
                continue
            except Exception as e:
                logger.error(f"予期しないエラー (ID:{line_item_id}): {e}")
                error_count += 1
                conn.rollback()
                continue
        
        conn.commit()
        logger.info(f"旧原文データ移行完了: 挿入 {inserted_count} 件, エラー {error_count} 件")
        
        cursor.close()
        
    except Exception as e:
        conn.rollback()
        logger.error(f"旧原文データ移行エラー: {e}")
        raise

def verify_migration(conn):
    """
    移行結果の検証
    
    Args:
        conn: データベース接続
    """
    try:
        cursor = conn.cursor()
        
        # 元データ件数
        cursor.execute("""
            SELECT COUNT(*) 
            FROM invoice_line_items 
            WHERE task_type = 'fuzzy' 
              AND raw_label IS NOT NULL 
              AND TRIM(raw_label) != ''
        """)
        source_count = cursor.fetchone()[0]
        
        # 移行先データ件数
        cursor.execute("SELECT COUNT(*) FROM legacy_line_item_raws")
        target_count = cursor.fetchone()[0]
        
        # 結合テスト
        cursor.execute("""
            SELECT COUNT(*) 
            FROM invoice_line_items ili
            INNER JOIN legacy_line_item_raws llr ON ili.id = llr.line_item_id
        """)
        joined_count = cursor.fetchone()[0]
        
        logger.info("=== 移行結果検証 ===")
        logger.info(f"元データ件数: {source_count}")
        logger.info(f"移行先データ件数: {target_count}")
        logger.info(f"結合可能件数: {joined_count}")
        
        if source_count == target_count == joined_count:
            logger.info("✅ 移行成功: データ整合性確認済み")
        else:
            logger.warning("⚠️ データ不整合の可能性あり")
            
        # サンプル確認
        cursor.execute("""
            SELECT 
                ili.id,
                ili.raw_label,
                llr.raw_text
            FROM invoice_line_items ili
            INNER JOIN legacy_line_item_raws llr ON ili.id = llr.line_item_id
            LIMIT 3
        """)
        
        samples = cursor.fetchall()
        logger.info("サンプル確認:")
        for item_id, original, migrated in samples:
            match_status = "✅" if original.strip() == migrated.strip() else "❌"
            logger.info(f"  {match_status} ID:{item_id} - {original[:30]}...")
            
        cursor.close()
        
    except Exception as e:
        logger.error(f"検証エラー: {e}")
        raise

def main():
    """メイン処理"""
    
    # データベース接続情報（クラウドSupabase用）
    DB_CONFIG = {
        'host': 'aws-0-ap-northeast-1.pooler.supabase.com',
        'port': 6543,
        'database': 'postgres',
        'user': 'postgres.auwmmosfteomieyexkeh',
        'password': 'bankincafe2024!'  # 適切なパスワードに置き換えてください
    }
    
    try:
        logger.info("旧原文データ移行スクリプト開始")
        
        # データベースに接続
        conn = psycopg2.connect(**DB_CONFIG)
        logger.info("データベース接続成功")
        
        # 旧システム明細項目を特定
        legacy_items = get_legacy_line_items(conn)
        
        if not legacy_items:
            logger.warning("移行対象の旧原文データが見つかりません")
            conn.close()
            return
        
        # 旧原文データを移行
        migrate_to_legacy_table(conn, legacy_items)
        
        # 移行結果を検証
        verify_migration(conn)
        
        conn.close()
        logger.info("旧原文データ移行スクリプト完了")
        
    except Exception as e:
        logger.error(f"移行スクリプト実行エラー: {e}")
        raise

if __name__ == "__main__":
    main()