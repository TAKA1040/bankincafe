'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestDbPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const testDb = async () => {
      try {
        console.log('🔍 データベーステスト開始')
        const supabase = createClient()
        
        // セッション状態確認
        const { data: sessionData } = await supabase.auth.getSession()
        console.log('📱 セッション状態:', sessionData.session?.user?.email || 'ログインしていません')
        
        // 簡単なクエリテスト
        const { data: invoices, error: invError, count } = await supabase
          .from('invoices')
          .select('invoice_id, customer_name', { count: 'exact' })
          .limit(5)
        
        console.log('📋 請求書クエリ結果:', {
          error: invError?.message,
          count,
          data: invoices?.length
        })

        if (invError) {
          setError(invError.message)
        } else {
          setData({ count, invoices })
        }
      } catch (err) {
        console.error('❌ テストエラー:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    testDb()
  }, [])

  if (loading) return <div className="p-8">テスト実行中...</div>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">データベース接続テスト</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          エラー: {error}
        </div>
      )}
      
      {data && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <p>成功: {data.count}件の請求書が見つかりました</p>
          <p>サンプル件数: {data.invoices?.length}</p>
          <pre className="mt-2 text-xs">
            {JSON.stringify(data.invoices, null, 2)}
          </pre>
        </div>
      )}
      
      <div className="mt-4">
        <a href="/invoice-list" className="text-blue-600 hover:underline">
          請求書一覧に戻る
        </a>
      </div>
    </div>
  )
}