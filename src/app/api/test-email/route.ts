import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmationEmails, OrderEmailData } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    // テスト用の注文データ
    const testOrderData: OrderEmailData = {
      paymentIntentId: 'pi_test_' + Date.now(),
      customerName: 'テスト太郎',
      customerEmail: 'test@example.com',
      videoUrls: ['https://www.youtube.com/watch?v=dQw4w9WgXcQ'],
      videoInfos: [{
        title: 'テスト動画',
        duration: 180,
        thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        channelTitle: 'テストチャンネル'
      }],
      format: 'default',
      qualityOption: 'ai_only',
      preferLength: 1,
      aspectRatio: 1,
      subtitleSwitch: 1,
      headlineSwitch: 1,
      specialRequests: 'テスト用の特別な要望',
      amount: 5000,
      estimatedDeliveryDays: 3,
      createdAt: new Date(),
    };

    console.log('🧪 テストメール送信を開始します...');
    
    // 環境変数チェック
    const envVars = {
      SENDGRID_API_KEY: !!process.env.SENDGRID_API_KEY,
      FROM_EMAIL: !!process.env.FROM_EMAIL,
      ADMIN_EMAIL: !!process.env.ADMIN_EMAIL,
    };
    
    console.log('📋 環境変数の設定状況:', envVars);
    
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('SENDGRID_API_KEY が設定されていません');
    }
    if (!process.env.FROM_EMAIL) {
      throw new Error('FROM_EMAIL が設定されていません');
    }
    if (!process.env.ADMIN_EMAIL) {
      throw new Error('ADMIN_EMAIL が設定されていません');
    }

    await sendOrderConfirmationEmails(testOrderData);
    
    return NextResponse.json({ 
      success: true, 
      message: 'テストメールの送信が完了しました',
      envVars 
    });
    
  } catch (error) {
    console.error('❌ テストメール送信エラー:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : String(error),
      envVars: {
        SENDGRID_API_KEY: !!process.env.SENDGRID_API_KEY,
        FROM_EMAIL: !!process.env.FROM_EMAIL,
        ADMIN_EMAIL: !!process.env.ADMIN_EMAIL,
      }
    }, { status: 500 });
  }
}