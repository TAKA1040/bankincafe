import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ isAdmin: false, error: 'Email required' }, { status: 400 });
    }

    // サーバーサイドで環境変数から管理者メールを取得（クライアントに露出されない）
    const rawAllowedEmails = process.env.ALLOWED_EMAILS; // NEXT_PUBLIC_ プレフィックスを除去
    
    if (!rawAllowedEmails) {
      console.warn('ALLOWED_EMAILS環境変数が設定されていません');
      return NextResponse.json({ isAdmin: false, error: 'Configuration error' }, { status: 500 });
    }

    const allowedEmails = rawAllowedEmails
      .replace(/[\r\n]/g, '')
      .split(',')
      .map(email => email.trim())
      .filter(email => email.length > 0);

    const isAdmin = allowedEmails.includes(email.toLowerCase());
    
    return NextResponse.json({ isAdmin });
    
  } catch (error) {
    console.error('Admin check error:', error);
    return NextResponse.json({ isAdmin: false, error: 'Server error' }, { status: 500 });
  }
}