'use client'

import { Button } from '@/components/ui/Button'
import { Car, AlertTriangle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-danger-50 to-secondary-100">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-danger-600 rounded-full">
              <AlertTriangle className="h-12 w-12 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-secondary-900">
            認証エラー
          </h2>
          <p className="mt-2 text-secondary-600">
            ログイン処理中にエラーが発生しました
          </p>
        </div>

        <div className="card">
          <div className="space-y-6">
            <div className="bg-danger-50 border border-danger-200 text-danger-600 px-4 py-3 rounded-lg text-sm">
              <p className="font-medium mb-2">考えられる原因：</p>
              <ul className="space-y-1">
                <li>• 認証コードの有効期限切れ</li>
                <li>• 不正なリクエスト</li>
                <li>• ネットワーク接続の問題</li>
                <li>• サーバーエラー</li>
              </ul>
            </div>

            <div className="space-y-3">
              <Link href="/login">
                <Button className="w-full" size="lg">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  ログインページに戻る
                </Button>
              </Link>

              <Link href="/">
                <Button variant="secondary" className="w-full">
                  ホームページに戻る
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-secondary-600">
            問題が解決しない場合は<br />
            システム管理者にお問い合わせください
          </p>
        </div>
      </div>
    </div>
  )
}