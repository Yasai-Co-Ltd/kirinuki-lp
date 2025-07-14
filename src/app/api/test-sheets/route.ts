import { NextRequest, NextResponse } from 'next/server';
import { saveOrderToSheet, checkSheetsConfiguration } from '@/lib/sheets';
import { OrderEmailData } from '@/types/email';

export async function POST(request: NextRequest) {
  try {
    // 環境変数の設定状況をチェック
    const sheetsConfig = checkSheetsConfiguration();
    console.log('📋 スプレッドシート設定状況:', sheetsConfig);
    
    if (!sheetsConfig.configured) {
      throw new Error(`スプレッドシート設定が不完全です。不足している環境変数: ${sheetsConfig.missing.join(', ')}`);
    }

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

    console.log('🧪 テストスプレッドシート保存を開始します...');
    
    await saveOrderToSheet(testOrderData);
    
    return NextResponse.json({ 
      success: true, 
      message: 'テストデータのスプレッドシート保存が完了しました',
      config: sheetsConfig
    });
    
  } catch (error) {
    console.error('❌ テストスプレッドシート保存エラー:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : String(error),
      config: checkSheetsConfiguration()
    }, { status: 500 });
  }
}