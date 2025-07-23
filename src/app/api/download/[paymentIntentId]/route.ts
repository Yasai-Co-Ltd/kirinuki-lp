import { NextRequest, NextResponse } from 'next/server';
import { generateSignedDownloadUrl } from '@/lib/storage';
import { google } from 'googleapis';

// Google Sheets APIの設定
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const GOOGLE_SHEETS_SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const GOOGLE_SHEETS_CLIENT_EMAIL = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
const GOOGLE_SHEETS_PRIVATE_KEY = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');

// Google Sheets認証を取得
async function getGoogleSheetsAuth() {
  if (!GOOGLE_SHEETS_CLIENT_EMAIL || !GOOGLE_SHEETS_PRIVATE_KEY) {
    throw new Error('Google Sheets認証情報が設定されていません');
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: GOOGLE_SHEETS_PRIVATE_KEY,
    },
    scopes: SCOPES,
  });

  return auth;
}

// Google Sheetsクライアントを取得
async function getSheetsClient() {
  const auth = await getGoogleSheetsAuth();
  return google.sheets({ version: 'v4', auth });
}

// paymentIntentIdから注文情報と動画情報を取得
async function getOrderVideosByPaymentIntentId(paymentIntentId: string) {
  if (!GOOGLE_SHEETS_SPREADSHEET_ID) {
    throw new Error('Google Sheets スプレッドシートIDが設定されていません');
  }

  try {
    const sheets = await getSheetsClient();

    // スプレッドシートの全データを取得
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEETS_SPREADSHEET_ID,
      range: 'A:U', // U列からV列まで
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) {
      return null;
    }

    // ヘッダー行をスキップして検索
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const storedPaymentIntentId = row[1]; // B列（決済ID）
      
      if (storedPaymentIntentId === paymentIntentId) {
        const status = row[17]; // R列（ステータス）
        
        // 完了状態の注文のみ対象とする
        if (status !== '完了') {
          return {
            found: true,
            completed: false,
            status: status || '処理中',
            customerName: row[2] || '',
            customerEmail: row[3] || '',
          };
        }

        return {
          found: true,
          completed: true,
          rowIndex: i + 1,
          paymentIntentId: storedPaymentIntentId,
          customerName: row[2] || '', // C列
          customerEmail: row[3] || '', // D列
          videoCount: parseInt(row[4]) || 0, // E列
          videoTitles: row[5] || '', // F列
          // videoChannels: row[6] || '', // G列
          videoDurations: row[6] || '', // G列
          videoUrls: row[7] || '', // H列
          projectId: row[20] || '', // U列
          note: row[18] || '', // S列（備考）
        };
      }
    }

    return null;

  } catch (error) {
    console.error('スプレッドシートからの注文情報取得エラー:', error);
    throw error;
  }
}

// Google Cloud Storageから複数プロジェクトIDの動画ファイル一覧を取得（グループ化対応）
async function getVideoFilesFromMultipleProjects(projectIds: number[], orderInfo: any) {
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
    
    // 元動画の情報を取得
    const originalVideoTitles = orderInfo.videoTitles ? orderInfo.videoTitles.split(' | ') : [];
    const originalVideoUrls = orderInfo.videoUrls ? orderInfo.videoUrls.split(' | ') : [];
    
    const videoGroups: any[] = [];
    
    // 各プロジェクトIDのフォルダから動画ファイルを取得
    for (let i = 0; i < projectIds.length; i++) {
      const projectId = projectIds[i];
      const prefix = `videos/project_${projectId}/`;
      console.log(`📁 プロジェクトフォルダを検索中: ${prefix}`);
      
      try {
        const [files] = await bucket.getFiles({ prefix });
        
        const videoFiles = await Promise.all(
          files.map(async (file: any, index: number) => {
            try {
              // ファイルのメタデータを取得
              const [metadata] = await file.getMetadata();
              
              // 署名付きURLを生成（24時間有効）
              const downloadUrl = await generateSignedDownloadUrl(file.name, 86400);
              
              // ファイルサイズを人間が読みやすい形式に変換
              const formatFileSize = (bytes: number) => {
                if (bytes === 0) return '0 Bytes';
                const k = 1024;
                const sizes = ['Bytes', 'KB', 'MB', 'GB'];
                const i = Math.floor(Math.log(bytes) / Math.log(k));
                return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
              };

              return {
                id: `project_${projectId}_video_${index + 1}`,
                title: metadata.metadata?.['original-title'] || file.name.split('/').pop()?.replace(/\.[^/.]+$/, '') || `切り抜き動画 ${index + 1}`,
                fileName: file.name.split('/').pop() || `video_${index + 1}.mp4`,
                downloadUrl,
                fileSize: formatFileSize(metadata.size || 0),
                duration: metadata.metadata?.['duration'] || undefined,
                viralScore: metadata.metadata?.['viral-score'] || undefined,
                uploadedAt: metadata.timeCreated,
                projectId: projectId,
              };
            } catch (error) {
              console.error(`ファイル ${file.name} の処理エラー:`, error);
              return null;
            }
          })
        );

        const validVideoFiles = videoFiles.filter(file => file !== null);
        
        // 元動画の情報と組み合わせてグループを作成
        const originalTitle = originalVideoTitles[i] || `元動画 ${i + 1}`;
        const originalUrl = originalVideoUrls[i] || '';
        
        videoGroups.push({
          groupId: `group_${i + 1}`,
          originalTitle,
          originalUrl,
          projectId,
          videos: validVideoFiles,
          videoCount: validVideoFiles.length
        });
        
        console.log(`📹 プロジェクト ${projectId} (${originalTitle}): ${validVideoFiles.length}個のファイルを取得`);
        
      } catch (error) {
        console.error(`プロジェクト ${projectId} のファイル取得エラー:`, error);
        // エラーが発生しても他のプロジェクトの処理は続行
        videoGroups.push({
          groupId: `group_${i + 1}`,
          originalTitle: originalVideoTitles[i] || `元動画 ${i + 1}`,
          originalUrl: originalVideoUrls[i] || '',
          projectId,
          videos: [],
          videoCount: 0,
          error: 'ファイル取得エラー'
        });
      }
    }

    const totalVideos = videoGroups.reduce((sum, group) => sum + group.videoCount, 0);
    console.log(`📊 ${videoGroups.length}グループ、合計 ${totalVideos}個の動画ファイルを取得しました`);
    
    return videoGroups;

  } catch (error) {
    console.error('Google Cloud Storageからの動画ファイル取得エラー:', error);
    throw error;
  }
}

// ダウンロードページのデータを取得
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ paymentIntentId: string }> }
) {
  const { paymentIntentId } = await params;

  console.log(`📥 ダウンロードデータ取得リクエスト: ${paymentIntentId}`);

  try {
    // 注文情報を取得
    const orderInfo = await getOrderVideosByPaymentIntentId(paymentIntentId);

    if (!orderInfo) {
      console.log(`❌ 注文が見つかりません: ${paymentIntentId}`);
      return NextResponse.json(
        { error: '指定された注文が見つかりません。' },
        { status: 404 }
      );
    }

    if (!orderInfo.completed) {
      console.log(`⏳ 注文がまだ完了していません: ${paymentIntentId} (ステータス: ${orderInfo.status})`);
      return NextResponse.json(
        { 
          error: '動画の制作がまだ完了していません。',
          status: orderInfo.status,
          customerName: orderInfo.customerName
        },
        { status: 202 }
      );
    }

    console.log(`✅ 注文情報を取得しました: ${orderInfo.customerName}様 (${orderInfo.videoCount}本)`);

    // paymentIntentIdに関連する全てのプロジェクトIDを取得
    const { findAllProjectIdsByPaymentIntentId } = await import('@/lib/sheets');
    const projectIds = await findAllProjectIdsByPaymentIntentId(paymentIntentId);
    
    if (projectIds.length === 0) {
      console.log(`⚠️ プロジェクトIDが見つかりません: ${paymentIntentId}`);
      return NextResponse.json(
        { error: 'プロジェクトIDが見つかりません。動画の処理が完了していない可能性があります。' },
        { status: 404 }
      );
    }

    console.log(`📋 ${projectIds.length}個のプロジェクトIDを取得: ${projectIds.join(', ')}`);

    // 複数プロジェクトIDから動画ファイル一覧を取得（グループ化）
    const videoGroups = await getVideoFilesFromMultipleProjects(projectIds, orderInfo);

    if (videoGroups.length === 0) {
      console.log(`⚠️ 動画ファイルが見つかりません: ${paymentIntentId}`);
      return NextResponse.json(
        { error: '動画ファイルが見つかりません。サポートにお問い合わせください。' },
        { status: 404 }
      );
    }

    const totalVideos = videoGroups.reduce((sum, group) => sum + group.videoCount, 0);
    console.log(`📹 ${videoGroups.length}グループ、合計 ${totalVideos}個の動画ファイルを取得しました`);

    return NextResponse.json({
      success: true,
      paymentIntentId,
      customerName: orderInfo.customerName,
      customerEmail: orderInfo.customerEmail,
      videoGroups: videoGroups,
      totalCount: totalVideos,
      groupCount: videoGroups.length,
      orderInfo: {
        videoTitles: orderInfo.videoTitles,
        videoUrls: orderInfo.videoUrls,
        projectIds: projectIds,
      }
    });

  } catch (error) {
    console.error('❌ ダウンロードデータ取得エラー:', error);
    
    return NextResponse.json(
      {
        error: 'データの取得中にエラーが発生しました。',
        details: error instanceof Error ? error.message : '不明なエラー'
      },
      { status: 500 }
    );
  }
}