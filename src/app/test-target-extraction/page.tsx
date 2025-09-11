'use client'

import React, { useState, useEffect } from 'react'
import { extractTargetFromWorkName } from '@/lib/target-extractor'

export default function TestTargetExtractionPage() {
  const [results, setResults] = useState<Array<{workName: string, target: string | null, time: number}>>([])
  const [loading, setLoading] = useState(false)

  const testWorkNames = [
    'ドア交換',
    'DPFセンサー取替',
    'ブレーキパッド交換',
    'ヘッドライト脱着',
    'タイヤ交換',
    'エンジンカバーステイ修正・折損溶接',
    'フロントリッド・グリル・キャブマウントリンク脱着・リンクブッシュ前後切断取替加工',
    'リヤバンパー折損鈑金修理',
    'DPFマフラーセンサーボルト折れ込み修理',
    'メイン燃料タンクホース延長サブタンク付替え加工'
  ]

  const runTest = async () => {
    console.log('🧪 Target extraction test starting...')
    setLoading(true)
    setResults([])
    
    const testResults: Array<{workName: string, target: string | null, time: number}> = []
    
    for (const workName of testWorkNames) {
      console.log(`\n🔍 Testing: "${workName}"`)
      const startTime = Date.now()
      
      try {
        const target = await extractTargetFromWorkName(workName)
        const endTime = Date.now()
        const result = {
          workName,
          target,
          time: endTime - startTime
        }
        
        testResults.push(result)
        console.log(`✅ Result: "${workName}" -> "${target}" (${result.time}ms)`)
        
        // リアルタイム更新
        setResults([...testResults])
        
      } catch (error) {
        console.error(`❌ Error testing "${workName}":`, error)
        const result = {
          workName,
          target: `ERROR: ${error}`,
          time: Date.now() - startTime
        }
        testResults.push(result)
        setResults([...testResults])
      }
    }
    
    console.log('\n📊 Test summary:')
    console.log('Total tests:', testResults.length)
    console.log('Successful matches:', testResults.filter(r => r.target && !r.target.startsWith('ERROR')).length)
    console.log('No matches:', testResults.filter(r => r.target === null).length)
    console.log('Errors:', testResults.filter(r => r.target?.startsWith('ERROR')).length)
    console.log('Average time:', Math.round(testResults.reduce((sum, r) => sum + r.time, 0) / testResults.length), 'ms')
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">🧪 Target Extraction Test</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <button 
            onClick={runTest}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '🔄 Testing...' : '🚀 Run Target Extraction Test'}
          </button>
          
          {loading && (
            <div className="mt-4 text-blue-600">
              Testing {results.length + 1} / {testWorkNames.length}...
            </div>
          )}
        </div>

        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h2 className="text-xl font-semibold text-gray-800">📋 Test Results</h2>
              <div className="text-sm text-gray-600 mt-1">
                {results.length} / {testWorkNames.length} completed
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">#</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Work Name</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Extracted Target</th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">Time (ms)</th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {results.map((result, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                        <div className="truncate" title={result.workName}>{result.workName}</div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {result.target ? (
                          <span className={result.target.startsWith('ERROR') ? 'text-red-600' : 'text-green-600 font-medium'}>
                            {result.target}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 text-right">{result.time}</td>
                      <td className="px-6 py-4 text-center">
                        {result.target?.startsWith('ERROR') ? (
                          <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">ERROR</span>
                        ) : result.target ? (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">MATCH</span>
                        ) : (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">NO MATCH</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">📝 Instructions</h3>
          <ol className="text-blue-700 space-y-2">
            <li>1. ボタンをクリックしてテストを開始</li>
            <li>2. ブラウザのDevToolsコンソールを開いて詳細なログを確認</li>
            <li>3. 各作業名に対して正しい対象が抽出されるかチェック</li>
            <li>4. エラーや異常に長い処理時間がないか確認</li>
          </ol>
        </div>
      </div>
    </div>
  )
}