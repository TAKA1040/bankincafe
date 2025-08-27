'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import SecurityWrapper from '@/components/layout/SecurityWrapper'
import Navbar from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit,
  Trash2,
  Users,
  Phone,
  Mail,
  Building,
  ArrowLeft,
  Eye,
  RefreshCw
} from 'lucide-react'

interface Customer {
  id: string
  companyName: string
  personInCharge: string
  position: string
  phone: string
  email: string
  address?: string
  taxNumber?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

const sampleCustomers: Customer[] = [
  {
    id: '1',
    companyName: '株式会社UDトラックス',
    personInCharge: '山田太郎',
    position: '部長',
    phone: '03-1234-5678',
    email: 'yamada@udtrucks.com',
    address: '東京都品川区南大井6-26-2',
    taxNumber: 'T1234567890123',
    notes: '主要取引先。月間30-50台の修理依頼。',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    companyName: '田中自動車',
    personInCharge: '田中花子',
    position: '代表取締役',
    phone: '03-9876-5432',
    email: 'tanaka@tanaka-auto.com',
    address: '東京都足立区西新井5-7-8',
    taxNumber: 'T9876543210987',
    notes: '個人経営。バンパー修理が多い。',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-20T14:15:00Z'
  },
  {
    id: '3',
    companyName: '佐藤運送株式会社',
    personInCharge: '佐藤次郎',
    position: '整備課長',
    phone: '03-5555-1111',
    email: 'sato@sato-unsou.com',
    address: '東京都練馬区大泉学園町2-3-4',
    taxNumber: 'T1111222233334',
    notes: '大型トラック中心。定期点検契約あり。',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-25T16:45:00Z'
  },
  {
    id: '4',
    companyName: '鈴木商事',
    personInCharge: '鈴木三郎',
    position: '総務部長',
    phone: '03-7777-8888',
    email: 'suzuki@suzuki-trading.com',
    address: '東京都江戸川区平井1-2-3',
    taxNumber: 'T4444555566667',
    notes: '中型車両の修理多め。支払いサイトは月末締め翌月末払い。',
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-28T09:20:00Z'
  }
]

export default function CustomerListPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  const loadCustomers = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setCustomers(sampleCustomers)
    } catch (error) {
      console.error('Failed to load customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterCustomers = useCallback(() => {
    let filtered = [...customers]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(customer =>
        customer.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.personInCharge.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.position.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort by company name
    filtered.sort((a, b) => a.companyName.localeCompare(b.companyName, 'ja'))

    setFilteredCustomers(filtered)
  }, [customers, searchQuery])

  useEffect(() => {
    loadCustomers()
  }, [])

  useEffect(() => {
    filterCustomers()
  }, [filterCustomers])

  const handleDelete = async (customerId: string) => {
    if (!confirm('この顧客を削除してもよろしいですか？')) {
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      setCustomers(prev => prev.filter(customer => customer.id !== customerId))
      alert('顧客を削除しました')
    } catch (error) {
      alert('削除に失敗しました')
    }
  }

  const handleViewDetail = (customer: Customer) => {
    setSelectedCustomer(customer)
  }

  const clearFilters = () => {
    setSearchQuery('')
  }

  if (loading) {
    return (
      <SecurityWrapper>
        <div className="min-h-screen bg-secondary-50">
          <Navbar />
          <div className="container py-8">
            <div className="flex justify-center items-center h-64">
              <RefreshCw className="h-8 w-8 animate-spin text-primary-600" />
              <span className="ml-2 text-lg text-secondary-600">読み込み中...</span>
            </div>
          </div>
        </div>
      </SecurityWrapper>
    )
  }


  return (
    <SecurityWrapper>
      <div className="min-h-screen bg-secondary-50">
        <Navbar />
        
        <div className="container py-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-secondary-900">顧客管理</h1>
              <p className="text-secondary-600">顧客情報の登録・管理・履歴</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => router.push('/')}
                icon={<ArrowLeft className="h-4 w-4" />}
              >
                戻る
              </Button>
              <Button
                variant="primary"
                onClick={() => router.push('/customer-create')}
                icon={<Plus className="h-4 w-4" />}
              >
                新規登録
              </Button>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">{filteredCustomers.length}</div>
                  <div className="text-sm text-secondary-600">登録顧客数</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-success-600">
                    {customers.filter(c => c.companyName.includes('株式会社') || c.companyName.includes('有限会社')).length}
                  </div>
                  <div className="text-sm text-secondary-600">法人顧客</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning-600">
                    {customers.filter(c => c.companyName.includes('UD')).length}
                  </div>
                  <div className="text-sm text-secondary-600">UD系顧客</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                検索・フィルター
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="会社名、担当者名、電話番号、メールで検索"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="h-4 w-4" />}
                />
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  icon={<Filter className="h-4 w-4" />}
                >
                  検索クリア
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Customer List */}
          {filteredCustomers.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <Users className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                  <p className="text-secondary-600">
                    {searchQuery
                      ? '検索条件に一致する顧客が見つかりません'
                      : '顧客が登録されていません'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredCustomers.map((customer) => (
                <Card key={customer.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {/* Company Info */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                            {customer.companyName}
                          </h3>
                          <div className="flex items-center text-sm text-secondary-600 mb-2">
                            <Building className="h-4 w-4 mr-2" />
                            <span>{customer.personInCharge}</span>
                            <span className="ml-2 px-2 py-1 bg-secondary-100 text-secondary-700 rounded text-xs">
                              {customer.position}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-secondary-600">
                          <Phone className="h-4 w-4 mr-2" />
                          <span>{customer.phone}</span>
                        </div>
                        <div className="flex items-center text-sm text-secondary-600">
                          <Mail className="h-4 w-4 mr-2" />
                          <span className="truncate">{customer.email}</span>
                        </div>
                      </div>

                      {/* Address */}
                      {customer.address && (
                        <div className="text-sm text-secondary-600">
                          <div className="font-medium">住所</div>
                          <div>{customer.address}</div>
                        </div>
                      )}

                      {/* Tax Number */}
                      {customer.taxNumber && (
                        <div className="text-sm text-secondary-600">
                          <span className="font-medium">法人番号: </span>
                          <span>{customer.taxNumber}</span>
                        </div>
                      )}

                      {/* Notes */}
                      {customer.notes && (
                        <div className="text-sm text-secondary-600">
                          <div className="font-medium">備考</div>
                          <div className="text-xs bg-secondary-50 p-2 rounded">{customer.notes}</div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-secondary-200">
                        <div className="text-xs text-secondary-500">
                          登録日: {new Date(customer.createdAt).toLocaleDateString('ja-JP')}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetail(customer)}
                            icon={<Eye className="h-4 w-4" />}
                          >
                            詳細
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/customer-create?edit=${customer.id}`)}
                            icon={<Edit className="h-4 w-4" />}
                          >
                            編集
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(customer.id)}
                            icon={<Trash2 className="h-4 w-4" />}
                          >
                            削除
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Detail Modal */}
          {selectedCustomer && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-auto">
                <h3 className="text-xl font-bold text-secondary-900 mb-4">
                  顧客詳細 - {selectedCustomer.companyName}
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-secondary-700">会社名</div>
                      <div className="text-secondary-900">{selectedCustomer.companyName}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-secondary-700">担当者</div>
                      <div className="text-secondary-900">{selectedCustomer.personInCharge}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-secondary-700">役職</div>
                      <div className="text-secondary-900">{selectedCustomer.position}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-secondary-700">電話番号</div>
                      <div className="text-secondary-900">{selectedCustomer.phone}</div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="text-sm font-medium text-secondary-700">メールアドレス</div>
                      <div className="text-secondary-900">{selectedCustomer.email}</div>
                    </div>
                    {selectedCustomer.address && (
                      <div className="md:col-span-2">
                        <div className="text-sm font-medium text-secondary-700">住所</div>
                        <div className="text-secondary-900">{selectedCustomer.address}</div>
                      </div>
                    )}
                    {selectedCustomer.taxNumber && (
                      <div className="md:col-span-2">
                        <div className="text-sm font-medium text-secondary-700">法人番号</div>
                        <div className="text-secondary-900">{selectedCustomer.taxNumber}</div>
                      </div>
                    )}
                    {selectedCustomer.notes && (
                      <div className="md:col-span-2">
                        <div className="text-sm font-medium text-secondary-700">備考</div>
                        <div className="text-secondary-900 bg-secondary-50 p-3 rounded">{selectedCustomer.notes}</div>
                      </div>
                    )}
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="text-xs text-secondary-500">
                      <div>作成日: {new Date(selectedCustomer.createdAt).toLocaleString('ja-JP')}</div>
                      <div>更新日: {new Date(selectedCustomer.updatedAt).toLocaleString('ja-JP')}</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/customer-create?edit=${selectedCustomer.id}`)}
                    icon={<Edit className="h-4 w-4" />}
                  >
                    編集
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setSelectedCustomer(null)}
                  >
                    閉じる
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </SecurityWrapper>
  )
}