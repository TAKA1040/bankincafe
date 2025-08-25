'use client'

import { Button } from '@/components/ui/Button'
import { Car, FileText, Users, Settings } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100">
      <div className="container py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary-600 rounded-full">
              <Car className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-secondary-900 mb-4">
            鈑金Cafe
          </h1>
          <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
            自動車鈑金業向け請求書・顧客管理システム
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="card text-center">
            <div className="flex justify-center mb-4">
              <FileText className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              請求書管理
            </h3>
            <p className="text-secondary-600 text-sm mb-4">
              請求書の作成・一覧・PDF出力
            </p>
            <Button variant="primary" size="sm" className="w-full">
              作成
            </Button>
          </div>

          <div className="card text-center">
            <div className="flex justify-center mb-4">
              <Users className="h-8 w-8 text-success-600" />
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              顧客管理
            </h3>
            <p className="text-secondary-600 text-sm mb-4">
              顧客情報の登録・管理・履歴
            </p>
            <Button variant="success" size="sm" className="w-full">
              管理
            </Button>
          </div>

          <div className="card text-center">
            <div className="flex justify-center mb-4">
              <FileText className="h-8 w-8 text-warning-600" />
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              作業履歴
            </h3>
            <p className="text-secondary-600 text-sm mb-4">
              過去の作業内容・価格検索
            </p>
            <Button variant="warning" size="sm" className="w-full">
              検索
            </Button>
          </div>

          <div className="card text-center">
            <div className="flex justify-center mb-4">
              <Settings className="h-8 w-8 text-secondary-600" />
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              設定
            </h3>
            <p className="text-secondary-600 text-sm mb-4">
              システム設定・データ管理
            </p>
            <Button variant="secondary" size="sm" className="w-full">
              設定
            </Button>
          </div>
        </div>

        <div className="card max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-6 text-center">
            システム構築状況
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-secondary-900 mb-4">完了項目</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-success-500 rounded-full mr-3"></div>
                  <span className="text-secondary-700">プロジェクト初期化</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-success-500 rounded-full mr-3"></div>
                  <span className="text-secondary-700">Supabase認証設定</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-success-500 rounded-full mr-3"></div>
                  <span className="text-secondary-700">基本UIコンポーネント</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-success-500 rounded-full mr-3"></div>
                  <span className="text-secondary-700">TypeScript型定義</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-secondary-900 mb-4">実装予定</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-warning-500 rounded-full mr-3"></div>
                  <span className="text-secondary-700">認証ページ</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-warning-500 rounded-full mr-3"></div>
                  <span className="text-secondary-700">請求書作成</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-warning-500 rounded-full mr-3"></div>
                  <span className="text-secondary-700">顧客管理</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-warning-500 rounded-full mr-3"></div>
                  <span className="text-secondary-700">作業履歴検索</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}