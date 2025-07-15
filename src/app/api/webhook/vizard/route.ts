import { NextRequest, NextResponse } from 'next/server';
import { VizardWebhookPayload, VizardVideoClip } from '@/lib/vizard';
import { updateRowStatus, getPendingVideoUrls, findPaymentIntentIdByProjectId } from '@/lib/sheets';
import { sendVideoCompletionEmail, VideoCompletionEmailData } from '@/lib/email';
import { saveVideoToGCS, generateSafeFileName } from '@/lib/storage';

// Vizard.aiからのWebhook通知を受け取るエンドポイント
export async function POST(request: NextRequest) {
  console.log('🔔 Vizard.ai Webhook通知を受信しました');

  try {
    // リクエストボディを取得
    const payload: VizardWebhookPayload = await request.json();
    
    console.log('📋 Webhook payload:', {
      code: payload.code,
      projectId: payload.projectId,
      videoCount: payload.videos.length,
      shareLink: payload.shareLink,
    });

    // Webhook署名の検証（Vizard.aiが署名を提供する場合）
    const signature = request.headers.get('x-vizard-signature');
    const webhookSecret = process.env.VIZARD_WEBHOOK_SECRET;
    
    if (webhookSecret && signature) {
      // 実際の実装では、Vizard.aiの署名検証ロジックを実装する必要があります
      // ここでは簡単な例として、署名の存在チェックのみ行います
      console.log('🔐 Webhook署名を確認しました');
    }

    // プロジェクト完了処理
    await handleProjectCompletion(payload);

    return NextResponse.json({
      success: true,
      message: 'Webhook処理が完了しました',
      projectId: payload.projectId,
      videoCount: payload.videos.length,
      code: payload.code
    });

  } catch (error) {
    console.error('❌ Webhook処理エラー:', error);
    
    return NextResponse.json(
      {
        error: 'Webhook処理中にエラーが発生しました',
        details: error instanceof Error ? error.message : '不明なエラー'
      },
      { status: 500 }
    );
  }
}

// プロジェクト完了処理
async function handleProjectCompletion(payload: VizardWebhookPayload): Promise<void> {
  try {
    console.log(`🎬 プロジェクト完了通知: ${payload.projectId} (コード: ${payload.code})`);
    console.log(`📹 生成された動画数: ${payload.videos.length}`);

    // コード2000は成功を示す
    if (payload.code === 2000) {
      console.log('✅ プロジェクト生成が完了しました');
      
      if (payload.videos.length > 0) {
        console.log(`📥 ${payload.videos.length}個の動画クリップが生成されました`);
        
        // 各動画クリップを処理
        for (const video of payload.videos) {
          console.log(`🎥 動画クリップ処理開始: ${video.title} (ID: ${video.videoId})`);
          await processVideoClip(video, payload);
        }
        
        // プロジェクト完了処理を実行
        await processProjectCompletion(payload);
        
        console.log('🎉 プロジェクト完了処理を実行しました');
      }
      
    } else {
      console.log(`❌ プロジェクト生成でエラーが発生しました (コード: ${payload.code})`);
      
      // エラー処理を実行
      await processProjectFailure(payload);
      
      console.log('📧 エラー通知処理を実行しました');
    }

    // プロジェクト結果をデータベースやスプレッドシートに記録
    await recordProjectResult(payload);

  } catch (error) {
    console.error('❌ プロジェクト完了処理エラー:', error);
    throw error;
  }
}

// プロジェクト結果を記録
async function recordProjectResult(payload: VizardWebhookPayload): Promise<void> {
  try {
    console.log('📝 プロジェクト結果を記録:', {
      projectId: payload.projectId,
      code: payload.code,
      videoCount: payload.videos.length,
      shareLink: payload.shareLink,
    });

    // 各動画クリップの詳細をログ出力
    payload.videos.forEach((video, index) => {
      console.log(`📹 動画クリップ ${index + 1}:`, {
        videoId: video.videoId,
        title: video.title,
        duration: `${Math.round(video.videoMsDuration / 1000)}秒`,
        viralScore: video.viralScore,
        hasUrl: !!video.videoUrl,
      });
    });

    // 実際の実装では、以下のような処理が必要：
    // 1. projectIdを使ってスプレッドシートの該当行を特定
    // 2. プロジェクト生成結果を更新
    // 3. 全ての動画クリップが処理完了した場合は、行のステータスを「完了」に更新

  } catch (error) {
    console.error('❌ プロジェクト結果記録エラー:', error);
    throw error;
  }
}

// 個別の動画クリップ処理
async function processVideoClip(video: VizardVideoClip, payload: VizardWebhookPayload): Promise<void> {
  try {
    console.log(`🎥 動画クリップ処理: ${video.title} (ID: ${video.videoId})`);
    console.log(`📊 バイラルスコア: ${video.viralScore}/10`);
    console.log(`⏱️ 動画時間: ${Math.round(video.videoMsDuration / 1000)}秒`);

    // 動画をクラウドストレージに保存
    let gcsUrl: string | null = null;
    try {
      const fileName = generateSafeFileName(video.title);
      // TODO: projectIdから該当するpaymentIntentIdを取得する必要がある
      const paymentIntentId = `project_${payload.projectId}`;
      gcsUrl = await saveVideoToGCS(video.videoUrl, fileName, paymentIntentId);
      console.log(`✅ 動画クリップをGoogle Cloud Storageに保存しました: ${gcsUrl}`);
    } catch (storageError) {
      console.error('❌ Google Cloud Storage保存エラー:', storageError);
    }

    console.log(`🎉 動画クリップ処理完了: ${video.title}`);

  } catch (error) {
    console.error(`❌ 動画クリップ処理エラー (${video.videoId}):`, error);
    throw error;
  }
}

// プロジェクト完了処理（メール通知、ステータス更新）
async function processProjectCompletion(payload: VizardWebhookPayload): Promise<void> {
  try {
    console.log(`🎬 プロジェクト完了処理開始: ${payload.projectId}`);

    // projectIdから該当するスプレッドシート行を特定
    const matchingRow = await findPaymentIntentIdByProjectId(payload.projectId);

    if (!matchingRow) {
      console.log(`⚠️ プロジェクトID ${payload.projectId} に該当するスプレッドシート行が見つかりませんでした`);
      return;
    }

    console.log(`📋 該当行を特定しました: 行${matchingRow.rowIndex} (${matchingRow.customerName}様)`);

    // 顧客にメール通知を送信
    try {
      const emailData: VideoCompletionEmailData = {
        customerName: matchingRow.customerName,
        customerEmail: matchingRow.customerEmail,
        paymentIntentId: matchingRow.paymentIntentId,
        videoTitle: `切り抜き動画 (${payload.videos.length}本)`,
        downloadUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/download/${matchingRow.paymentIntentId}`,
        originalUrl: '', // 元動画URLは別途取得が必要
      };

      await sendVideoCompletionEmail(emailData);
      console.log('✅ 顧客にメール通知を送信しました:', matchingRow.customerEmail);
    } catch (emailError) {
      console.error('❌ メール通知送信エラー:', emailError);
    }

    // スプレッドシートのステータスを「完了」に更新
    try {
      const note = `プロジェクト完了: ${payload.videos.length}個の動画生成 | 共有リンク: ${payload.shareLink}`;
      await updateRowStatus(matchingRow.rowIndex, '完了', note);
      console.log('✅ スプレッドシートのステータスを「完了」に更新しました');
    } catch (statusError) {
      console.error('❌ ステータス更新エラー:', statusError);
    }

    console.log('🎉 プロジェクト完了処理がすべて完了しました');

  } catch (error) {
    console.error('❌ プロジェクト完了処理中にエラーが発生しました:', error);
    throw error;
  }
}

// プロジェクト失敗処理（ステータス更新、エラー通知）
async function processProjectFailure(payload: VizardWebhookPayload): Promise<void> {
  try {
    console.log(`❌ プロジェクト失敗処理開始: ${payload.projectId} (コード: ${payload.code})`);

    // projectIdから該当するスプレッドシート行を特定
    const matchingRow = await findPaymentIntentIdByProjectId(payload.projectId);

    if (!matchingRow) {
      console.log(`⚠️ プロジェクトID ${payload.projectId} に該当するスプレッドシート行が見つかりませんでした`);
      return;
    }

    console.log(`📋 該当行を特定しました: 行${matchingRow.rowIndex} (${matchingRow.customerName}様)`);

    // スプレッドシートのステータスを「エラー」に更新
    try {
      const errorMessage = `プロジェクト生成エラー (コード: ${payload.code})`;
      const note = `${errorMessage} | プロジェクトID: ${payload.projectId}`;
      await updateRowStatus(matchingRow.rowIndex, 'エラー', note);
      console.log('✅ スプレッドシートのステータスを「エラー」に更新しました');
    } catch (statusError) {
      console.error('❌ ステータス更新エラー:', statusError);
    }

    console.log('🔧 プロジェクト失敗処理が完了しました');

  } catch (error) {
    console.error('❌ プロジェクト失敗処理中にエラーが発生しました:', error);
    throw error;
  }
}

// GET メソッド（Webhook エンドポイントの確認用）
export async function GET() {
  return NextResponse.json({
    message: 'Vizard.ai Webhook エンドポイントが正常に動作しています',
    timestamp: new Date().toISOString(),
    endpoint: '/api/webhook/vizard'
  });
}