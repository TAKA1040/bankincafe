import { NextRequest, NextResponse } from 'next/server'

const MANARIEDB_ENDPOINT = 'https://manariedb.apaf.me'
const MANARIEDB_API_KEY = process.env.MANARIEDB_API_KEY || ''

export async function POST(request: NextRequest) {
  try {
    const { sql } = await request.json()

    if (!sql) {
      return NextResponse.json({ error: 'SQL is required' }, { status: 400 })
    }

    // セキュリティチェック: DROP, TRUNCATE等の危険なクエリをブロック
    const dangerousPatterns = /\b(DROP|TRUNCATE|ALTER|CREATE|GRANT|REVOKE)\b/i
    if (dangerousPatterns.test(sql)) {
      return NextResponse.json({ error: 'Dangerous SQL operation not allowed' }, { status: 403 })
    }

    const body = JSON.stringify({ sql })

    const response = await fetch(`${MANARIEDB_ENDPOINT}/api/external/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${MANARIEDB_API_KEY}`,
      },
      body,
    })

    const result = await response.json()

    return NextResponse.json(result)
  } catch (error) {
    console.error('DB query error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
