import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function main() {
  console.log('🚀 stagingスキーマ作成開始...')
  
  // 直接テーブルを public スキーマに作成（staging スキーマのサポートが限定的）
  try {
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'invoices_import')
      .single()
    
    if (!error) {
      console.log('⚠️ テーブルが既に存在します。削除してから再作成します。')
    }
  } catch (e) {
    console.log('✅ テーブルは存在しません。新規作成します。')
  }
  
  // Supabaseダッシュボードで実行するSQL
  const createTableSQL = `
  DROP TABLE IF EXISTS public.invoices_import;
  CREATE TABLE public.invoices_import (
    id SERIAL PRIMARY KEY,
    請求書番号 TEXT,
    請求月 TEXT,
    請求日 TEXT,
    請求先 TEXT,
    件名 TEXT,
    登録番号 TEXT,
    発注番号 TEXT,
    オーダー番号 TEXT,
    小計 TEXT,
    消費税 TEXT,
    請求金額 TEXT,
    created_at TIMESTAMP DEFAULT NOW()
  );`
  
  console.log('📋 以下のSQLをSupabase SQLエディタで実行してください:')
  console.log('─'.repeat(60))
  console.log(createTableSQL)
  console.log('─'.repeat(60))
  
  console.log('✅ SQL準備完了')
  console.log('👉 次のステップ: Subaseダッシュボード → SQL Editor → 上記SQLを実行')
}

main().catch(console.error)