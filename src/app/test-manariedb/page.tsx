'use client'

import { useState } from 'react'
import { dbClient } from '@/lib/db-client'

export default function TestManarieDB() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testConnection = async () => {
    setLoading(true)
    setError(null)
    setResult('')

    try {
      // テスト1: invoices件数を取得
      const countResult = await dbClient.executeSQL('SELECT COUNT(*) as count FROM invoices')
      const invoiceCount = countResult.data?.rows?.[0]?.count || 0

      // テスト2: 最新の請求書3件を取得
      const invoicesResult = await dbClient.executeSQL(`
        SELECT invoice_id, customer_name, billing_date, total_amount
        FROM invoices
        ORDER BY billing_date DESC
        LIMIT 3
      `)
      const invoices = invoicesResult.data?.rows || []

      // テスト3: invoice_line_items件数を取得
      const lineCountResult = await dbClient.executeSQL('SELECT COUNT(*) as count FROM invoice_line_items')
      const lineItemCount = lineCountResult.data?.rows?.[0]?.count || 0

      setResult(JSON.stringify({
        success: true,
        invoiceCount,
        lineItemCount,
        sampleInvoices: invoices
      }, null, 2))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const testQueryBuilder = async () => {
    setLoading(true)
    setError(null)
    setResult('')

    try {
      // QueryBuilderを使ったテスト
      const builder = dbClient.from('invoices')
        .select('invoice_id, customer_name, billing_date, status')
        .neq('status', 'deleted')
        .order('billing_date', { ascending: false })
        .limit(5)

      const { data, error: queryError } = await (builder as any).execute()

      if (queryError) {
        throw queryError
      }

      setResult(JSON.stringify({
        success: true,
        message: 'QueryBuilder test passed',
        data
      }, null, 2))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">manarieDB 接続テスト</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={testConnection}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'テスト中...' : '基本接続テスト'}
        </button>

        <button
          onClick={testQueryBuilder}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'テスト中...' : 'QueryBuilderテスト'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
          <strong>エラー:</strong> {error}
        </div>
      )}

      {result && (
        <div className="p-4 bg-gray-100 rounded">
          <h2 className="text-lg font-semibold mb-2">結果:</h2>
          <pre className="text-sm overflow-auto whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  )
}
