import { NextRequest, NextResponse } from 'next/server'
import { ContactFormData } from '../../../types'
import { sendContactEmail } from '../../../lib/email'

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json()
    
    // バリデーション
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: '必須項目が入力されていません' },
        { status: 400 }
      )
    }

    // メールアドレスの形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: '有効なメールアドレスを入力してください' },
        { status: 400 }
      )
    }

    // メール送信
    await sendContactEmail(body)

    return NextResponse.json(
      { message: 'お問い合わせを受け付けました。ありがとうございます。' },
      { status: 200 }
    )
  } catch (error) {
    console.error('お問い合わせ送信エラー:', error)
    return NextResponse.json(
      { error: 'お問い合わせの送信に失敗しました。しばらく時間をおいて再度お試しください。' },
      { status: 500 }
    )
  }
}