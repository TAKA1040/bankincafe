"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Building2, Home } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'

interface CompanyInfo {
  companyName: string
  companyNameKana: string
  representativeName: string
  postalCode: string
  prefecture: string
  city: string
  address: string
  buildingName: string
  phoneNumber: string
  faxNumber: string
  mobileNumber: string
  email: string
  website: string
  fiscalYearEndMonth: string
  taxRegistrationNumber: string
  invoiceRegistrationNumber: string
  bankName: string
  bankBranch: string
  accountType: string
  accountNumber: string
  accountHolder: string
  remarks: string
}

const defaultCompanyInfo: CompanyInfo = {
  companyName: '',
  companyNameKana: '',
  representativeName: '',
  postalCode: '',
  prefecture: '',
  city: '',
  address: '',
  buildingName: '',
  phoneNumber: '',
  faxNumber: '',
  mobileNumber: '',
  email: '',
  website: '',
  fiscalYearEndMonth: '3',
  taxRegistrationNumber: '',
  invoiceRegistrationNumber: '',
  bankName: '',
  bankBranch: '',
  accountType: '普通',
  accountNumber: '',
  accountHolder: '',
  remarks: ''
}

export default function CompanySettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(defaultCompanyInfo)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // // console.log('useEffect実行: loadCompanyInfo開始')
    loadCompanyInfo()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  
  useEffect(() => {
    // // console.log('companyInfo state更新:', companyInfo)
  }, [companyInfo])

  const loadCompanyInfo = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const userId = user?.id || '00000000-0000-0000-0000-000000000000'
      
      // // console.log('データ読み込み開始 - ユーザーID:', userId)

      // // console.log('クエリ実行:', { userId })
      
      // まず現在のユーザーIDでデータを取得
      const { data: initialData, error } = await supabase
        .from('company_info')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()
      
      let data = initialData
      // データが見つからない場合、デフォルトユーザーIDでも試す
      if (!data && !error && userId !== '00000000-0000-0000-0000-000000000000') {
        // // console.log('現在ユーザーIDで見つからず、デフォルトユーザーIDで再試行')
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('company_info')
          .select('*')
          .eq('user_id', '00000000-0000-0000-0000-000000000000')
          .maybeSingle()
        
        if (fallbackData && !fallbackError) {
          // // console.log('デフォルトユーザーIDのデータを現在ユーザーIDに更新中...')
          // データを現在のユーザーIDに移行
          await (supabase as any)
            .from('company_info')
            .update({ user_id: userId })
            .eq('user_id', '00000000-0000-0000-0000-000000000000')
          
          data = { ...fallbackData, user_id: userId }
        }
      }

      // // console.log('クエリ結果:', { data, error })
      
      if (error) {
        console.error('データ読み込みエラー:', error)
        return
      }
      
      if (!data) {
        // // console.log('会社情報データが見つかりません')
        return
      }

      // // console.log('読み込み成功:', data)
      // // console.log('設定前のcompanyInfo:', companyInfo)

      const newCompanyInfo = {
        companyName: data.company_name || '',
        companyNameKana: data.company_name_kana || '',
        representativeName: data.representative_name || '',
        postalCode: data.postal_code || '',
        prefecture: data.prefecture || '',
        city: data.city || '',
        address: data.address || '',
        buildingName: data.building_name || '',
        phoneNumber: data.phone_number || '',
        faxNumber: data.fax_number || '',
        mobileNumber: data.mobile_number || '',
        email: data.email || '',
        website: data.website || '',
        fiscalYearEndMonth: data.fiscal_year_end_month?.toString() || '3',
        taxRegistrationNumber: data.tax_registration_number || '',
        invoiceRegistrationNumber: data.invoice_registration_number || '',
        bankName: data.bank_name || '',
        bankBranch: data.bank_branch || '',
        accountType: data.account_type || '普通',
        accountNumber: data.account_number || '',
        accountHolder: data.account_holder || '',
        remarks: data.remarks || ''
      }
      
      // // console.log('設定するcompanyInfo:', newCompanyInfo)
      setCompanyInfo(newCompanyInfo)
    } catch (error) {
      console.error('会社情報読み込みエラー:', error)
    }
  }

  const handleInputChange = (field: keyof CompanyInfo, value: string) => {
    setCompanyInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // // console.log('保存開始...')
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      // // console.log('認証情報:', { user: user?.id, authError })
      
      const userId = user?.id || '00000000-0000-0000-0000-000000000000'
      // // console.log('使用するユーザーID:', userId)

      const dbData = {
        user_id: userId,
        company_name: companyInfo.companyName,
        company_name_kana: companyInfo.companyNameKana,
        representative_name: companyInfo.representativeName,
        postal_code: companyInfo.postalCode,
        prefecture: companyInfo.prefecture,
        city: companyInfo.city,
        address: companyInfo.address,
        building_name: companyInfo.buildingName,
        phone_number: companyInfo.phoneNumber,
        fax_number: companyInfo.faxNumber,
        mobile_number: companyInfo.mobileNumber,
        email: companyInfo.email,
        website: companyInfo.website,
        fiscal_year_end_month: companyInfo.fiscalYearEndMonth,
        tax_registration_number: companyInfo.taxRegistrationNumber,
        invoice_registration_number: companyInfo.invoiceRegistrationNumber,
        bank_name: companyInfo.bankName,
        bank_branch: companyInfo.bankBranch,
        account_type: companyInfo.accountType,
        account_number: companyInfo.accountNumber,
        account_holder: companyInfo.accountHolder,
        remarks: companyInfo.remarks
      }
      
      // // console.log('データベースに送信するデータ:', dbData)

      const { data: result, error } = await (supabase as any)
        .from('company_info')
        .upsert(dbData)
        
      // // console.log('データベース応答:', { result, error })

      if (error) {
        throw error
      }

      toast({
        title: "保存完了",
        description: "会社情報が正常に保存されました。",
      })
      
      // 保存後にデータを再読み込み
      await loadCompanyInfo()
    } catch (error: any) {
      console.error('保存エラー詳細:', {
        error,
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint
      })
      toast({
        title: "保存エラー",
        description: `会社情報の保存に失敗しました。エラー: ${error?.message || 'Unknown error'}`,
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-4xl p-6 space-y-6">
        {/* ヘッダー */}
        <header className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6" />
              <h1 className="text-2xl font-bold text-gray-800">会社情報設定</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Save size={20} />
                {isLoading ? '保存中...' : '保存'}
              </button>
              <button
                onClick={() => router.back()}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2 font-medium"
              >
                <ArrowLeft size={20} />
                戻る
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium"
              >
                <Home size={20} />
                メニューへ
              </button>
            </div>
          </div>
        </header>

      {/* 基本情報 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            基本情報
          </CardTitle>
          <CardDescription>
            請求書に記載される会社の基本情報を設定してください
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">会社名 *</Label>
              <Input
                id="companyName"
                placeholder="例：株式会社〇〇"
                value={companyInfo.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyNameKana">会社名（フリガナ）</Label>
              <Input
                id="companyNameKana"
                placeholder="例：カブシキガイシャ○○"
                value={companyInfo.companyNameKana}
                onChange={(e) => handleInputChange('companyNameKana', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3 space-y-2">
              <Label htmlFor="representativeName">代表者名</Label>
              <Input
                id="representativeName"
                placeholder="例：代表取締役 山田太郎"
                value={companyInfo.representativeName}
                onChange={(e) => handleInputChange('representativeName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fiscalYearEndMonth">決算月</Label>
              <select
                id="fiscalYearEndMonth"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={companyInfo.fiscalYearEndMonth}
                onChange={(e) => handleInputChange('fiscalYearEndMonth', e.target.value)}
              >
                <option value="1">1月</option>
                <option value="2">2月</option>
                <option value="3">3月</option>
                <option value="4">4月</option>
                <option value="5">5月</option>
                <option value="6">6月</option>
                <option value="7">7月</option>
                <option value="8">8月</option>
                <option value="9">9月</option>
                <option value="10">10月</option>
                <option value="11">11月</option>
                <option value="12">12月</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 住所情報 */}
      <Card>
        <CardHeader>
          <CardTitle>住所情報</CardTitle>
          <CardDescription>
            請求書の送付先として使用される会社住所を設定してください
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postalCode">郵便番号</Label>
              <Input
                id="postalCode"
                placeholder="123-4567"
                value={companyInfo.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prefecture">都道府県</Label>
              <Input
                id="prefecture"
                placeholder="東京都"
                value={companyInfo.prefecture}
                onChange={(e) => handleInputChange('prefecture', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">市区町村</Label>
              <Input
                id="city"
                placeholder="港区"
                value={companyInfo.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address">住所 *</Label>
              <Input
                id="address"
                placeholder="赤坂1-2-3"
                value={companyInfo.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buildingName">建物名・部屋番号</Label>
              <Input
                id="buildingName"
                placeholder="○○ビル 4階"
                value={companyInfo.buildingName}
                onChange={(e) => handleInputChange('buildingName', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 連絡先情報 */}
      <Card>
        <CardHeader>
          <CardTitle>連絡先情報</CardTitle>
          <CardDescription>
            請求書やお客様との連絡に使用する連絡先情報を設定してください
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">電話番号 *</Label>
              <Input
                id="phoneNumber"
                placeholder="03-1234-5678"
                value={companyInfo.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="faxNumber">FAX番号</Label>
              <Input
                id="faxNumber"
                placeholder="03-1234-5679"
                value={companyInfo.faxNumber}
                onChange={(e) => handleInputChange('faxNumber', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobileNumber">携帯番号</Label>
              <Input
                id="mobileNumber"
                placeholder="090-1234-5678"
                value={companyInfo.mobileNumber}
                onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                placeholder="info@company.co.jp"
                value={companyInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">ウェブサイト</Label>
              <Input
                id="website"
                placeholder="https://www.company.co.jp"
                value={companyInfo.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 税務・請求情報 */}
      <Card>
        <CardHeader>
          <CardTitle>税務・請求情報</CardTitle>
          <CardDescription>
            適格請求書（インボイス）発行に必要な税務情報を設定してください
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="taxRegistrationNumber">法人番号</Label>
              <Input
                id="taxRegistrationNumber"
                placeholder="1234567890123"
                value={companyInfo.taxRegistrationNumber}
                onChange={(e) => handleInputChange('taxRegistrationNumber', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invoiceRegistrationNumber">適格請求書発行事業者登録番号</Label>
              <Input
                id="invoiceRegistrationNumber"
                placeholder="T1234567890123"
                value={companyInfo.invoiceRegistrationNumber}
                onChange={(e) => handleInputChange('invoiceRegistrationNumber', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 銀行口座情報 */}
      <Card>
        <CardHeader>
          <CardTitle>銀行口座情報</CardTitle>
          <CardDescription>
            請求書に記載する振込先口座情報を設定してください
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bankName">銀行名</Label>
              <Input
                id="bankName"
                placeholder="○○銀行"
                value={companyInfo.bankName}
                onChange={(e) => handleInputChange('bankName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bankBranch">支店名</Label>
              <Input
                id="bankBranch"
                placeholder="本店"
                value={companyInfo.bankBranch}
                onChange={(e) => handleInputChange('bankBranch', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accountType">口座種別</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={companyInfo.accountType}
                onChange={(e) => handleInputChange('accountType', e.target.value)}
              >
                <option value="普通">普通</option>
                <option value="当座">当座</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountNumber">口座番号</Label>
              <Input
                id="accountNumber"
                placeholder="1234567"
                value={companyInfo.accountNumber}
                onChange={(e) => handleInputChange('accountNumber', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountHolder">口座名義</Label>
              <Input
                id="accountHolder"
                placeholder="カ）○○"
                value={companyInfo.accountHolder}
                onChange={(e) => handleInputChange('accountHolder', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* その他・備考 */}
      <Card>
        <CardHeader>
          <CardTitle>その他・備考</CardTitle>
          <CardDescription>
            その他の情報や特記事項を記載してください
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="remarks">備考</Label>
            <Textarea
              id="remarks"
              placeholder="営業時間、特記事項など"
              rows={4}
              value={companyInfo.remarks}
              onChange={(e) => handleInputChange('remarks', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

        {/* 保存ボタン */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            {isLoading ? '保存中...' : '設定を保存'}
          </button>
        </div>
      </div>
    </div>
  )
}