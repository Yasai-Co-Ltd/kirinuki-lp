import { NextRequest, NextResponse } from 'next/server';
import { generateSignedDownloadUrl } from '@/lib/storage';
import axios from 'axios';
import { Readable } from 'stream';

interface ZipDownloadRequest {
  paymentIntentId: string;
  videoIds: string[];
}

// Google Cloud Storageから動画ファイル情報を取得
async function getVideoFileInfo(paymentIntentId: string, projectId: string, videoId: string) {
  try {
    const { Storage } = require('@google-cloud/storage');
    
    const storage = new Storage({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      credentials: process.env.GOOGLE_CLOUD_CREDENTIALS ? JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS) : undefined,
    });

    const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET_NAME;
    if (!bucketName) {
      throw new Error('Google Cloud Storageバケット名が設定されていません');
    }

    const bucket = storage.bucket(bucketName);
    const prefix = `project_${projectId}/`;
    
    const [files] = await bucket.getFiles({ prefix });
    
    // videoIdに対応するファイルを検索（インデックスベース）
    const videoIndex = parseInt(videoId.replace('video_', '')) - 1;
    const file = files[videoIndex];
    
    if (!file) {
      throw new Error(`動画ファイルが見つかりません: ${videoId}`);
    }

    // 署名付きURLを生成（1時間有効）
    const downloadUrl = await generateSignedDownloadUrl(file.name, 3600);
    
    return {
      fileName: file.name.split('/').pop() || `${videoId}.mp4`,
      downloadUrl,
      file
    };

  } catch (error) {
    console.error(`動画ファイル情報取得エラー (${videoId}):`, error);
    throw error;
  }
}

// 複数の動画をZIPファイルにまとめてダウンロード
export async function POST(request: NextRequest) {
  console.log('📦 ZIPダウンロードリクエストを受信しました');

  try {
    const body: ZipDownloadRequest = await request.json();
    const { paymentIntentId, videoIds } = body;

    if (!paymentIntentId || !videoIds || videoIds.length === 0) {
      return NextResponse.json(
        { error: '必要なパラメータが不足しています。' },
        { status: 400 }
      );
    }

    console.log(`📋 ZIPダウンロード: ${paymentIntentId} (${videoIds.length}個の動画)`);

    // paymentIntentIdからprojectIdを取得（簡易実装）
    // 実際の実装では、Google Sheetsから取得する必要がある
    const projectId = paymentIntentId; // 暫定的にpaymentIntentIdをprojectIdとして使用

    // 各動画ファイルの情報を取得
    const videoFiles = await Promise.all(
      videoIds.map(async (videoId) => {
        try {
          return await getVideoFileInfo(paymentIntentId, projectId, videoId);
        } catch (error) {
          console.error(`動画ファイル取得エラー (${videoId}):`, error);
          return null;
        }
      })
    );

    const validVideoFiles = videoFiles.filter(file => file !== null);

    if (validVideoFiles.length === 0) {
      return NextResponse.json(
        { error: '有効な動画ファイルが見つかりません。' },
        { status: 404 }
      );
    }

    console.log(`✅ ${validVideoFiles.length}個の動画ファイルを取得しました`);

    // 複数ファイルのダウンロードリンクを返す（ZIPの代替案）
    const downloadLinks = validVideoFiles.map(videoFile => ({
      fileName: videoFile.fileName,
      downloadUrl: videoFile.downloadUrl
    }));

    console.log('✅ 複数ファイルのダウンロードリンクを生成しました');

    return NextResponse.json({
      success: true,
      paymentIntentId,
      downloadType: 'multiple',
      files: downloadLinks,
      totalCount: downloadLinks.length,
      message: '各ファイルを個別にダウンロードしてください。'
    });

  } catch (error) {
    console.error('❌ ZIPダウンロードエラー:', error);
    
    return NextResponse.json(
      {
        error: 'ZIPファイルの生成中にエラーが発生しました。',
        details: error instanceof Error ? error.message : '不明なエラー'
      },
      { status: 500 }
    );
  }
}