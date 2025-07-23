import { NextRequest, NextResponse } from 'next/server';
import { sendVideoCompletionEmail, VideoCompletionEmailData } from '@/lib/email';

// 動画完成メールのテスト用エンドポイント
export async function POST(request: NextRequest) {
  console.log('🧪 動画完成メールテストを開始します');

  try {
    // リクエストボディからテストデータを取得
    const body = await request.json();
    
    // デフォルトのテストデータ（複数動画対応）
    const testData: VideoCompletionEmailData = {
      customerName: body.customerName || 'テスト太郎',
      customerEmail: body.customerEmail || process.env.ADMIN_EMAIL || 'test@example.com',
      paymentIntentId: body.paymentIntentId || 'pi_test_123456789',
      videoTitles: body.videoTitles || [
        '【テスト動画1】面白い瞬間まとめ',
        '【テスト動画2】感動的なシーン集',
        '【テスト動画3】爆笑ハイライト'
      ],
      videoUrls: body.videoUrls || [
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'https://www.youtube.com/watch?v=test123456',
        'https://www.youtube.com/watch?v=test789012'
      ],
      downloadUrl: body.downloadUrl || `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/download/pi_test_123456789`,
      totalVideos: body.totalVideos || 3,
    };

    console.log('📧 テストメールデータ:', {
      customerName: testData.customerName,
      customerEmail: testData.customerEmail,
      totalVideos: testData.totalVideos,
      videoTitles: testData.videoTitles,
      videoUrls: testData.videoUrls,
    });

    // メール送信を実行
    await sendVideoCompletionEmail(testData);

    console.log('✅ 動画完成メールテストが完了しました');

    return NextResponse.json({
      success: true,
      message: `動画完成メールのテスト送信が完了しました (${testData.totalVideos}本)`,
      testData: {
        customerName: testData.customerName,
        customerEmail: testData.customerEmail,
        totalVideos: testData.totalVideos,
        videoTitles: testData.videoTitles,
        videoUrls: testData.videoUrls,
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
    message: '動画完成メールテスト用エンドポイントが正常に動作しています（複数動画対応）',
    timestamp: new Date().toISOString(),
    endpoint: '/api/test-video-completion-email',
    usage: {
      method: 'POST',
      body: {
        customerName: 'テスト太郎 (オプション)',
        customerEmail: 'test@example.com (オプション)',
        paymentIntentId: 'pi_test_123456789 (オプション)',
        videoTitles: ['動画1', '動画2', '動画3'] + ' (オプション)',
        videoUrls: ['https://youtube.com/1', 'https://youtube.com/2', 'https://youtube.com/3'] + ' (オプション)',
        totalVideos: '3 (オプション)'
      }
    },
    note: '複数動画の注文では全ての動画が完成してから1通のメールが送信されます'
  });
}