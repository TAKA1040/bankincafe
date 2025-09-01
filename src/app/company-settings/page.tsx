"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Building2, Phone, Mail, MapPin, FileText, User, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'

interface CompanyInfo {
  // 基本情報
  companyName: string
  companyNameKana: string
  representativeName: string
  
  // 住所情報
  postalCode: string
  prefecture: string
  city: string
  address: string
  buildingName: string
  
  // 連絡先情報
  phoneNumber: string
  faxNumber: string
  mobileNumber: string
  email: string
  website: string
  
  // 事業情報
  businessType: string
  establishedDate: string
  capital: string
  
  // 税務・請求情報
  taxRegistrationNumber: string
  invoiceRegistrationNumber: string
  bankName: string
  bankBranch: string
  accountType: string
  accountNumber: string
  accountHolder: string
  
  // その他
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
  businessType: '',
  establishedDate: '',
  capital: '',
  taxRegistrationNumber: '',
  invoiceRegistrationNumber: '',
  bankName: '',
  bankBranch: '',
  accountType: '普通',
  accountNumber: '',
  accountHolder: '',
  remarks: ''
}

// 会社情報管理クラス
class CompanyInfoDB {
  private readonly STORAGE_KEY = 'bankin_company_info'

  getCompanyInfo(): CompanyInfo {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? { ...defaultCompanyInfo, ...JSON.parse(stored) } : defaultCompanyInfo
    } catch {
      return defaultCompanyInfo
    }
  }

  saveCompanyInfo(companyInfo: CompanyInfo): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(companyInfo))
    } catch (error) {
      console.error('Failed to save company info:', error)
      throw new Error('会社情報の保存に失敗しました')
    }
  }
}

const companyInfoDB = new CompanyInfoDB()

export default function CompanySettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(defaultCompanyInfo)
  const [isLoading, setSaving] = useState(false)

  useEffect(() => {
    const savedInfo = companyInfoDB.getCompanyInfo()
    setCompanyInfo(savedInfo)
  }, [])

  const handleInputChange = (field: keyof CompanyInfo, value: string) => {
    setCompanyInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      companyInfoDB.saveCompanyInfo(companyInfo)
      toast({
        title: "保存完了",
        description: "会社情報が正常に保存されました。",
      })
    } catch (error) {
      toast({
        title: "保存エラー",
        description: "会社情報の保存に失敗しました。",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container mx-auto max-w-4xl p-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            戻る
          </Button>
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            <h1 className="text-2xl font-bold">会社情報設定</h1>
          </div>
        </div>
        <Button onClick={handleSave} disabled={isLoading} className="gap-2">
          <Save className="h-4 w-4" />
          {isLoading ? '保存中...' : '保存'}
        </Button>
      </div>

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
                placeholder="株式会社〇〇"
                value={companyInfo.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyNameKana">会社名（フリガナ）</Label>
              <Input
                id="companyNameKana"
                placeholder="カブシキガイシャ○○"
                value={companyInfo.companyNameKana}
                onChange={(e) => handleInputChange('companyNameKana', e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="representativeName">代表者名</Label>
            <Input
              id="representativeName"
              placeholder="代表取締役 山田太郎"
              value={companyInfo.representativeName}
              onChange={(e) => handleInputChange('representativeName', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessType">事業内容</Label>
              <Input
                id="businessType"
                placeholder="自動車整備業"
                value={companyInfo.businessType}
                onChange={(e) => handleInputChange('businessType', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="establishedDate">設立年月日</Label>
              <Input
                id="establishedDate"
                type="date"
                value={companyInfo.establishedDate}
                onChange={(e) => handleInputChange('establishedDate', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capital">資本金</Label>
              <Input
                id="capital"
                placeholder="1,000万円"
                value={companyInfo.capital}
                onChange={(e) => handleInputChange('capital', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 住所情報 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            住所情報
          </CardTitle>
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
        </CardContent>
      </Card>

      {/* 連絡先情報 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            連絡先情報
          </CardTitle>
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
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            税務・請求情報
          </CardTitle>
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
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            銀行口座情報
          </CardTitle>
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
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            その他・備考
          </CardTitle>
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
        <Button onClick={handleSave} disabled={isLoading} size="lg" className="gap-2">
          <Save className="h-4 w-4" />
          {isLoading ? '保存中...' : '設定を保存'}
        </Button>
      </div>
    </div>
  )
}