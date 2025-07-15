import { NextRequest, NextResponse } from 'next/server';
import { VizardWebhookPayload } from '@/lib/vizard';
import { updateRowStatus, getPendingVideoUrls } from '@/lib/sheets';
import { sendVideoCompletionEmail, VideoCompletionEmailData } from '@/lib/email';
import { saveVideoToGCS, generateSafeFileName } from '@/lib/storage';

// Vizard.aiからのWebhook通知を受け取るエンドポイント
export async function POST(request: NextRequest) {
  console.log('🔔 Vizard.ai Webhook通知を受信しました');

  try {
    // リクエストボディを取得
    const payload: VizardWebhookPayload = await request.json();
    
    console.log('📋 Webhook payload:', {
      id: payload.id,
      status: payload.status,
      hasDownloadUrl: !!payload.download_url,
      originalUrl: payload.metadata?.original_url,
    });

    // Webhook署名の検証（Vizard.aiが署名を提供する場合）
    const signature = request.headers.get('x-vizard-signature');
    const webhookSecret = process.env.VIZARD_WEBHOOK_SECRET;
    
    if (webhookSecret && signature) {
      // 実際の実装では、Vizard.aiの署名検証ロジックを実装する必要があります
      // ここでは簡単な例として、署名の存在チェックのみ行います
      console.log('🔐 Webhook署名を確認しました');
    }

    // 動画生成の完了/失敗を処理
    await handleVideoCompletion(payload);

    return NextResponse.json({
      success: true,
      message: 'Webhook処理が完了しました',
      videoId: payload.id,
      status: payload.status
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

// 動画生成完了/失敗の処理
async function handleVideoCompletion(payload: VizardWebhookPayload): Promise<void> {
  try {
    console.log(`🎬 動画処理完了通知: ${payload.id} - ${payload.status}`);

    if (payload.status === 'completed') {
      console.log('✅ 動画生成が完了しました');
      
      // 成功の場合の処理
      if (payload.download_url) {
        console.log(`📥 ダウンロードURL: ${payload.download_url}`);
        
        // 動画完了処理を実行
        await processVideoCompletion(payload);
        
        console.log('🎉 動画生成完了処理を実行しました');
      }
      
    } else if (payload.status === 'failed') {
      console.log('❌ 動画生成が失敗しました');
      
      // 失敗の場合の処理
      const errorMessage = payload.error || '不明なエラー';
      console.log(`💥 エラー詳細: ${errorMessage}`);
      
      // 失敗処理を実行
      await processVideoFailure(payload);
      
      console.log('📧 エラー通知処理を実行しました');
    }

    // 動画生成結果をデータベースやスプレッドシートに記録
    await recordVideoResult(payload);

  } catch (error) {
    console.error('❌ 動画完了処理エラー:', error);
    throw error;
  }
}

// 動画生成結果を記録
async function recordVideoResult(payload: VizardWebhookPayload): Promise<void> {
  try {
    // TODO: より詳細な実装が必要
    // 現在は簡単なログ出力のみ
    
    console.log('📝 動画生成結果を記録:', {
      videoId: payload.id,
      status: payload.status,
      originalUrl: payload.metadata?.original_url,
      downloadUrl: payload.download_url,
      error: payload.error,
    });

    // 実際の実装では、以下のような処理が必要：
    // 1. payload.metadata.original_urlを使ってスプレッドシートの該当行を特定
    // 2. 動画生成結果を更新
    // 3. 全ての動画が完了した場合は、行のステータスを「完了」に更新

  } catch (error) {
    console.error('❌ 動画結果記録エラー:', error);
    throw error;
  }
}

// 動画完了処理（クラウドストレージ保存、メール通知、ステータス更新）
async function processVideoCompletion(payload: VizardWebhookPayload): Promise<void> {
  try {
    if (!payload.download_url || !payload.metadata?.original_url) {
      console.log('⚠️ ダウンロードURLまたは元動画URLが不足しています');
      return;
    }

    // 1. 元動画URLから該当するスプレッドシート行を特定
    const pendingRows = await getPendingVideoUrls();
    const matchingRow = pendingRows.find(row =>
      row.videoUrls.includes(payload.metadata!.original_url)
    );

    if (!matchingRow) {
      console.log('⚠️ 該当するスプレッドシート行が見つかりませんでした:', payload.metadata.original_url);
      return;
    }

    console.log(`📋 該当行を特定しました: 行${matchingRow.rowIndex} (${matchingRow.customerName}様)`);

    // 2. 完成した動画をクラウドストレージに保存
    let gcsUrl: string | null = null;
    try {
      const videoTitle = payload.metadata.title || 'untitled_video';
      const fileName = generateSafeFileName(videoTitle);
      gcsUrl = await saveVideoToGCS(payload.download_url, fileName, matchingRow.paymentIntentId);
      console.log('✅ 動画をGoogle Cloud Storageに保存しました:', gcsUrl);
    } catch (storageError) {
      console.error('❌ Google Cloud Storage保存エラー:', storageError);
      // ストレージ保存に失敗してもメール通知は続行
    }

    // 3. 顧客にメール通知を送信
    try {
      const emailData: VideoCompletionEmailData = {
        customerName: matchingRow.customerName,
        customerEmail: matchingRow.customerEmail,
        paymentIntentId: matchingRow.paymentIntentId,
        videoTitle: payload.metadata.title || 'タイトル不明',
        downloadUrl: payload.download_url,
        originalUrl: payload.metadata.original_url,
      };

      await sendVideoCompletionEmail(emailData);
      console.log('✅ 顧客にメール通知を送信しました:', matchingRow.customerEmail);
    } catch (emailError) {
      console.error('❌ メール通知送信エラー:', emailError);
      // メール送信に失敗してもステータス更新は続行
    }

    // 4. スプレッドシートのステータスを「完了」に更新
    try {
      const note = gcsUrl ? `動画保存先: ${gcsUrl}` : '動画ダウンロードURL提供済み';
      await updateRowStatus(matchingRow.rowIndex, '完了', note);
      console.log('✅ スプレッドシートのステータスを「完了」に更新しました');
    } catch (statusError) {
      console.error('❌ ステータス更新エラー:', statusError);
    }

    console.log('🎉 動画完了処理がすべて完了しました');

  } catch (error) {
    console.error('❌ 動画完了処理中にエラーが発生しました:', error);
    throw error;
  }
}

// 動画生成失敗処理（ステータス更新、エラー通知）
async function processVideoFailure(payload: VizardWebhookPayload): Promise<void> {
  try {
    if (!payload.metadata?.original_url) {
      console.log('⚠️ 元動画URLが不足しています');
      return;
    }

    // 元動画URLから該当するスプレッドシート行を特定
    const pendingRows = await getPendingVideoUrls();
    const matchingRow = pendingRows.find(row =>
      row.videoUrls.includes(payload.metadata!.original_url)
    );

    if (!matchingRow) {
      console.log('⚠️ 該当するスプレッドシート行が見つかりませんでした:', payload.metadata.original_url);
      return;
    }

    console.log(`📋 該当行を特定しました: 行${matchingRow.rowIndex} (${matchingRow.customerName}様)`);

    // スプレッドシートのステータスを「エラー」に更新
    try {
      const errorMessage = payload.error || '不明なエラー';
      const note = `動画生成エラー: ${errorMessage}`;
      await updateRowStatus(matchingRow.rowIndex, 'エラー', note);
      console.log('✅ スプレッドシートのステータスを「エラー」に更新しました');
    } catch (statusError) {
      console.error('❌ ステータス更新エラー:', statusError);
    }

    console.log('🔧 動画失敗処理が完了しました');

  } catch (error) {
    console.error('❌ 動画失敗処理中にエラーが発生しました:', error);
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