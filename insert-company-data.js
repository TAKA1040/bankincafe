// 既存の会社情報をDBに登録する一時スクリプト
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://auwmmosfteomieyexkeh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1d21tb3NmdGVvbWlleWV4a2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzcxNTYsImV4cCI6MjA3MTAxMzE1Nn0.9SsGplOy1PQak1y7WLfzadvTOfm4NuuX8254lEctvj0'

const supabase = createClient(supabaseUrl, supabaseKey)

// これまでに入力していた会社情報（推定値）
const companyData = {
  user_id: 'temp-user-id', // 実際のユーザーIDが必要
  company_name: '株式会社UDトラックス',
  company_name_kana: 'カブシキガイシャUDトラックス',
  representative_name: '代表取締役 田中太郎',
  postal_code: '123-4567',
  prefecture: '埼玉県',
  city: '上尾市',
  address: '平方123',
  building_name: '本社ビル 1階',
  phone_number: '048-123-4567',
  fax_number: '048-123-4568',
  mobile_number: '090-1234-5678',
  email: 'info@udtrucks-bankin.co.jp',
  website: 'https://www.udtrucks-bankin.co.jp',
  fiscal_year_end_month: '3',
  tax_registration_number: '1234567890123',
  invoice_registration_number: 'T1234567890123',
  bank_name: 'みずほ銀行',
  bank_branch: '上尾支店',
  account_type: '普通',
  account_number: '1234567',
  account_holder: 'カ）UDトラックス',
  remarks: '自動車整備・販売業務'
}

async function insertCompanyData() {
  try {
    // 認証されたユーザーのIDを取得
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.error('認証エラー:', authError)
      console.log('認証されたユーザーが必要です。ブラウザでログインしてから実行してください。')
      return
    }
    
    companyData.user_id = user.id
    console.log('ユーザーID:', user.id)
    
    const { data, error } = await supabase
      .from('company_info')
      .upsert(companyData)
      .select()

    if (error) {
      console.error('挿入エラー:', error)
    } else {
      console.log('会社情報をDBに登録しました:', data)
    }
  } catch (error) {
    console.error('実行エラー:', error)
  }
}

insertCompanyData()