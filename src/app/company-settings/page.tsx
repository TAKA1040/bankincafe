"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Building2, Home } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { dbClient, escapeValue } from '@/lib/db-client'

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
    loadCompanyInfo()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  
  useEffect(() => {
  }, [companyInfo])

  const loadCompanyInfo = async () => {
    try {
      const userId = '00000000-0000-0000-0000-000000000000'

      // ユーザーIDでデータを取得
      const result = await dbClient.executeSQL<Record<string, unknown>>(
        `SELECT * FROM "company_info" WHERE "user_id" = ${escapeValue(userId)} LIMIT 1`
      )

      if (!result.success) {
        console.error('データ読み込みエラー:', result.error)
        return
      }

      const data = result.data?.rows?.[0]
      if (!data) {
        return
      }

      const newCompanyInfo = {
        companyName: (data.company_name as string) || '',
        companyNameKana: (data.company_name_kana as string) || '',
        representativeName: (data.representative_name as string) || '',
        postalCode: (data.postal_code as string) || '',
        prefecture: (data.prefecture as string) || '',
        city: (data.city as string) || '',
        address: (data.address as string) || '',
        buildingName: (data.building_name as string) || '',
        phoneNumber: (data.phone_number as string) || '',
        faxNumber: (data.fax_number as string) || '',
        mobileNumber: (data.mobile_number as string) || '',
        email: (data.email as string) || '',
        website: (data.website as string) || '',
        fiscalYearEndMonth: (data.fiscal_year_end_month as string)?.toString() || '3',
        taxRegistrationNumber: (data.tax_registration_number as string) || '',
        invoiceRegistrationNumber: (data.invoice_registration_number as string) || '',
        bankName: (data.bank_name as string) || '',
        bankBranch: (data.bank_branch as string) || '',
        accountType: (data.account_type as string) || '普通',
        accountNumber: (data.account_number as string) || '',
        accountHolder: (data.account_holder as string) || '',
        remarks: (data.remarks as string) || ''
      }

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
      const userId = '00000000-0000-0000-0000-000000000000'

      // UPSERT用のSQL（ON CONFLICT）
      const sql = `
        INSERT INTO "company_info" (
          "user_id", "company_name", "company_name_kana", "representative_name",
          "postal_code", "prefecture", "city", "address", "building_name",
          "phone_number", "fax_number", "mobile_number", "email", "website",
          "fiscal_year_end_month", "tax_registration_number", "invoice_registration_number",
          "bank_name", "bank_branch", "account_type", "account_number", "account_holder", "remarks"
        ) VALUES (
          ${escapeValue(userId)}, ${escapeValue(companyInfo.companyName)}, ${escapeValue(companyInfo.companyNameKana)}, ${escapeValue(companyInfo.representativeName)},
          ${escapeValue(companyInfo.postalCode)}, ${escapeValue(companyInfo.prefecture)}, ${escapeValue(companyInfo.city)}, ${escapeValue(companyInfo.address)}, ${escapeValue(companyInfo.buildingName)},
          ${escapeValue(companyInfo.phoneNumber)}, ${escapeValue(companyInfo.faxNumber)}, ${escapeValue(companyInfo.mobileNumber)}, ${escapeValue(companyInfo.email)}, ${escapeValue(companyInfo.website)},
          ${escapeValue(companyInfo.fiscalYearEndMonth)}, ${escapeValue(companyInfo.taxRegistrationNumber)}, ${escapeValue(companyInfo.invoiceRegistrationNumber)},
          ${escapeValue(companyInfo.bankName)}, ${escapeValue(companyInfo.bankBranch)}, ${escapeValue(companyInfo.accountType)}, ${escapeValue(companyInfo.accountNumber)}, ${escapeValue(companyInfo.accountHolder)}, ${escapeValue(companyInfo.remarks)}
        )
        ON CONFLICT ("user_id") DO UPDATE SET
          "company_name" = EXCLUDED."company_name",
          "company_name_kana" = EXCLUDED."company_name_kana",
          "representative_name" = EXCLUDED."representative_name",
          "postal_code" = EXCLUDED."postal_code",
          "prefecture" = EXCLUDED."prefecture",
          "city" = EXCLUDED."city",
          "address" = EXCLUDED."address",
          "building_name" = EXCLUDED."building_name",
          "phone_number" = EXCLUDED."phone_number",
          "fax_number" = EXCLUDED."fax_number",
          "mobile_number" = EXCLUDED."mobile_number",
          "email" = EXCLUDED."email",
          "website" = EXCLUDED."website",
          "fiscal_year_end_month" = EXCLUDED."fiscal_year_end_month",
          "tax_registration_number" = EXCLUDED."tax_registration_number",
          "invoice_registration_number" = EXCLUDED."invoice_registration_number",
          "bank_name" = EXCLUDED."bank_name",
          "bank_branch" = EXCLUDED."bank_branch",
          "account_type" = EXCLUDED."account_type",
          "account_number" = EXCLUDED."account_number",
          "account_holder" = EXCLUDED."account_holder",
          "remarks" = EXCLUDED."remarks"
      `

      const result = await dbClient.executeSQL(sql)

      if (!result.success) {
        throw new Error(result.error)
      }

      toast({
        title: "保存完了",
        description: "会社情報が正常に保存されました。",
      })

      // 保存後にデータを再読み込み
      await loadCompanyInfo()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('保存エラー詳細:', error)
      toast({
        title: "保存エラー",
        description: `会社情報の保存に失敗しました。エラー: ${errorMessage}`,
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