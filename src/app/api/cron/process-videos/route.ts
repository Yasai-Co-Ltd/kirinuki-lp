import { NextRequest, NextResponse } from 'next/server';
import { getPendingVideoUrls, updateRowStatus, recordVideoGenerationResult, recordProjectIdMapping } from '@/lib/sheets';
import { createVizardProject, createVideoGeneration, DEFAULT_VIZARD_PROJECT_SETTINGS, DEFAULT_VIDEO_SETTINGS, createVizardRequestFromFormData, VizardCreateProjectResponse } from '@/lib/vizard';

// Vercel cron jobで実行される動画処理エンドポイント
export async function GET(request: NextRequest) {
  console.log('🎬 動画処理cron jobが開始されました');

  try {
    // 認証チェック（cron jobの場合はVercelの認証ヘッダーをチェック）
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.error('❌ 認証エラー: 無効なcron secret');
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    // スプレッドシートから処理待ちの動画URLを取得
    const pendingRows = await getPendingVideoUrls();
    
    if (pendingRows.length === 0) {
      console.log('✅ 処理待ちの動画はありません');
      return NextResponse.json({
        success: true,
        message: '処理待ちの動画はありません',
        processed: 0
      });
    }

    console.log(`📋 ${pendingRows.length}件の処理待ち動画を発見しました`);

    let totalProcessed = 0;
    let totalErrors = 0;

    // 各行を処理
    for (const row of pendingRows) {
      try {
        console.log(`🔄 処理開始: 決済ID ${row.paymentIntentId} (${row.videoUrls.length}本の動画)`);

        // ステータスを「処理中」に更新
        await updateRowStatus(row.rowIndex, '処理中', `動画生成開始: ${new Date().toLocaleString('ja-JP')}`);

        const results = [];
        
        // 各動画URLに対してVizard.ai APIを呼び出し
        for (let index = 0; index < row.videoUrls.length; index++) {
          const videoUrl = row.videoUrls[index];
          try {
            console.log(`🎥 動画生成開始 (${index + 1}/${row.videoUrls.length}): ${videoUrl}`);
            console.log(`📋 フォームデータ:`, row.formData);

            // フォームデータからVizardリクエストを生成
            const vizardRequest = createVizardRequestFromFormData(
              videoUrl,
              row.formData,
              row.customerName
            );

            console.log(`🔧 Vizardリクエスト:`, vizardRequest);

            // 新しいAPI仕様でプロジェクトを作成
            const generationResult: VizardCreateProjectResponse = await createVizardProject(vizardRequest);

            // projectIdとpaymentIntentIdの関連付けを記録
            // 最初の動画は新規作成、2つ目以降は追加モード
            const isAppend = index > 0;
            await recordProjectIdMapping(row.rowIndex, generationResult.projectId, row.paymentIntentId, isAppend);

            results.push({
              originalUrl: videoUrl,
              vizardId: generationResult.projectId.toString(),
              status: 'processing' as const, // プロジェクト作成成功時は処理中
              downloadUrl: generationResult.shareLink,
            });

            console.log(`✅ 動画生成リクエスト送信完了: プロジェクトID ${generationResult.projectId} (${isAppend ? '追加' : '新規'})`);

          } catch (videoError) {
            console.error(`❌ 動画生成エラー (${videoUrl}):`, videoError);
            results.push({
              originalUrl: videoUrl,
              vizardId: '',
              status: 'failed' as const,
              error: videoError instanceof Error ? videoError.message : '不明なエラー',
            });
          }
        }

        // 結果をスプレッドシートに記録
        await recordVideoGenerationResult(row.rowIndex, results);

        // 全ての動画が失敗した場合は「エラー」、一部でも成功した場合は「処理中」
        const hasSuccess = results.some(r => r.status === 'processing');
        const newStatus = hasSuccess ? '処理中' : 'エラー';
        
        await updateRowStatus(
          row.rowIndex, 
          newStatus,
          `動画生成リクエスト完了: 成功${results.filter(r => r.status !== 'failed').length}件、失敗${results.filter(r => r.status === 'failed').length}件`
        );

        totalProcessed++;
        console.log(`✅ 処理完了: 決済ID ${row.paymentIntentId}`);

      } catch (rowError) {
        console.error(`❌ 行処理エラー (決済ID: ${row.paymentIntentId}):`, rowError);
        
        // エラーをスプレッドシートに記録
        await updateRowStatus(
          row.rowIndex, 
          'エラー',
          `処理エラー: ${rowError instanceof Error ? rowError.message : '不明なエラー'}`
        );
        
        totalErrors++;
      }
    }

    console.log(`🎉 cron job完了: 処理済み${totalProcessed}件、エラー${totalErrors}件`);

    return NextResponse.json({
      success: true,
      message: `動画処理が完了しました`,
      processed: totalProcessed,
      errors: totalErrors,
      details: {
        totalRows: pendingRows.length,
        successfulRows: totalProcessed,
        errorRows: totalErrors,
      }
    });

  } catch (error) {
    console.error('❌ cron job実行エラー:', error);
    
    return NextResponse.json(
      {
        error: 'cron job実行中にエラーが発生しました',
        details: error instanceof Error ? error.message : '不明なエラー'
      },
      { status: 500 }
    );
  }
}

// POST メソッドでも同じ処理を実行（手動実行用）
export async function POST(request: NextRequest) {
  return GET(request);
}