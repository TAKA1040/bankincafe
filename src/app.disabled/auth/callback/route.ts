import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // 認証成功
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // エラーまたはコードなしの場合はエラーページにリダイレクト
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}