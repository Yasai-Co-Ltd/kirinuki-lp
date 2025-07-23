import { NextRequest, NextResponse } from 'next/server';
import { sendVideoCompletionEmail, VideoCompletionEmailData } from '@/lib/email';

// 動画完成メールのテスト用エンドポイント
export async function POST(request: NextRequest) {
  console.log('🧪 動画完成メールテストを開始します');

  try {
    // リクエストボディからテストデータを取得
    const body = await request.json();
    
    // デフォルトのテストデータ
    const testData: VideoCompletionEmailData = {
      customerName: body.customerName || 'テスト太郎',
      customerEmail: body.customerEmail || process.env.ADMIN_EMAIL || 'test@example.com',
      paymentIntentId: body.paymentIntentId || 'pi_test_123456789',
      videoTitle: body.videoTitle || '【テスト動画】面白い瞬間まとめ',
      downloadUrl: body.downloadUrl || `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/download/pi_test_123456789`,
      originalUrl: body.originalUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    };

    console.log('📧 テストメールデータ:', {
      customerName: testData.customerName,
      customerEmail: testData.customerEmail,
      videoTitle: testData.videoTitle,
      originalUrl: testData.originalUrl,
    });

    // メール送信を実行
    await sendVideoCompletionEmail(testData);

    console.log('✅ 動画完成メールテストが完了しました');

    return NextResponse.json({
      success: true,
      message: '動画完成メールのテスト送信が完了しました',
      testData: {
        customerName: testData.customerName,
        customerEmail: testData.customerEmail,
        videoTitle: testData.videoTitle,
        originalUrl: testData.originalUrl,
      }
    });

  } catch (error) {
    console.error('❌ 動画完成メールテストエラー:', error);
    
    return NextResponse.json(
      {
        error: '動画完成メールテスト中にエラーが発生しました',
        details: error instanceof Error ? error.message : '不明なエラー'
      },
      { status: 500 }
    );
  }
}

// GET メソッド（エンドポイントの確認用）
export async function GET() {
  return NextResponse.json({
    message: '動画完成メールテスト用エンドポイントが正常に動作しています',
    timestamp: new Date().toISOString(),
    endpoint: '/api/test-video-completion-email',
    usage: {
      method: 'POST',
      body: {
        customerName: 'テスト太郎 (オプション)',
        customerEmail: 'test@example.com (オプション)',
        paymentIntentId: 'pi_test_123456789 (オプション)',
        videoTitle: '【テスト動画】面白い瞬間まとめ (オプション)',
        originalUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ (オプション)'
      }
    }
  });
}