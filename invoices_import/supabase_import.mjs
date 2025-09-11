import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { readFileSync, writeFileSync } from 'fs'
import { parse } from 'csv-parse/sync'

// 環境変数を読み込み
dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ 環境変数が設定されていません')
  console.error('SUPABASE_URL:', supabaseUrl ? '設定済み' : '未設定')
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceRoleKey ? '設定済み' : '未設定')
  process.exit(1)
}

console.log('✅ 環境変数読み込み完了')
console.log('📡 Supabase URL:', supabaseUrl)

// Supabase クライアント作成（Service Role Key使用）
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

async function setupStagingAndImport() {
  console.log('\n🚀 Supabase インポート処理開始\n')

  try {
    // 1. staging スキーマを作成（psqlコマンド使用）
    console.log('1️⃣ staging スキーマとテーブル作成中...')
    
    // supabase sql コマンドを使用してスキーマとテーブルを作成
    const createSQL = `
      CREATE SCHEMA IF NOT EXISTS staging;
      
      DROP TABLE IF EXISTS staging.invoices_import;
      CREATE TABLE staging.invoices_import (
        "請求書番号" TEXT,
        "請求月"     TEXT,
        "請求日"     TEXT,
        "請求先"     TEXT,
        "件名"       TEXT,
        "登録番号"   TEXT,
        "発注番号"   TEXT,
        "オーダー番号" TEXT,
        "小計"       TEXT,
        "消費税"     TEXT,
        "請求金額"   TEXT
      );
    `
    
    // SQLファイルを一時的に作成
    writeFileSync('setup_staging.sql', createSQL)
    
    console.log('✅ staging スキーマとテーブル作成用SQL準備完了')
    console.log('📝 手動実行が必要: supabase db psql < setup_staging.sql')

    // 3. CSVファイルを読み込み、データ変換
    console.log('\n3️⃣ CSV ファイル読み込み・変換中...')
    const csvContent = readFileSync('invoices_extract.csv', 'utf-8')
    
    // BOMを除去
    const cleanCsvContent = csvContent.replace(/^\uFEFF/, '')
    
    const records = parse(cleanCsvContent, {
      columns: true,
      skip_empty_lines: true
    })

    console.log(`📊 CSV レコード数: ${records.length}件`)

    // データ変換（英語カラム → 日本語カラム）
    const transformedData = records.map(record => ({
      '請求書番号': record.invoice_id || '',
      '請求月': record.invoice_month || '',
      '請求日': record.invoice_date || '',
      '請求先': record.customer_name || '',
      '件名': record.subject || '',
      '登録番号': record.registration_number || '',
      '発注番号': '', // 元データにないため空
      'オーダー番号': record.order_number || '',
      '小計': record.subtotal || '0',
      '消費税': record.tax_amount || '0',
      '請求金額': record.total_amount || '0'
    }))

    console.log('✅ データ変換完了')

    // 4. バッチでデータを挿入（1000件ずつ）
    console.log('\n4️⃣ Supabase へデータ挿入中...')
    
    const batchSize = 1000
    let insertedCount = 0

    for (let i = 0; i < transformedData.length; i += batchSize) {
      const batch = transformedData.slice(i, i + batchSize)
      
      const { error: insertError } = await supabase
        .from('staging.invoices_import')
        .insert(batch)

      if (insertError) {
        console.error(`❌ バッチ${Math.floor(i/batchSize) + 1} 挿入エラー:`, insertError)
        continue
      }

      insertedCount += batch.length
      console.log(`✅ バッチ${Math.floor(i/batchSize) + 1} 完了: ${batch.length}件 (累計: ${insertedCount}件)`)
    }

    // 5. データ確認
    console.log('\n5️⃣ データ確認中...')
    
    const { data: countData, error: countError } = await supabase
      .rpc('exec_sql', {
        sql: 'SELECT COUNT(*) as count FROM staging.invoices_import;'
      })

    if (countError) {
      console.error('❌ カウントエラー:', countError)
    } else {
      console.log(`📊 staging.invoices_import 総件数: ${countData[0]?.count || 0}件`)
    }

    // サンプルデータ表示
    const { data: sampleData, error: sampleError } = await supabase
      .from('staging.invoices_import')
      .select('*')
      .limit(5)

    if (sampleError) {
      console.error('❌ サンプルデータ取得エラー:', sampleError)
    } else {
      console.log('\n📋 サンプルデータ (最初の5件):')
      sampleData?.forEach((row, index) => {
        console.log(`${index + 1}. 請求書番号: ${row.請求書番号}, 請求先: ${row.請求先}, 請求金額: ¥${row.請求金額}`)
      })
    }

    console.log('\n🎉 インポート処理完了！')

  } catch (error) {
    console.error('💥 処理中にエラーが発生:', error)
  }
}

// 実行
setupStagingAndImport()