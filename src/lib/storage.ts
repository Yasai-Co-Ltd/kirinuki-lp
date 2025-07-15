import { Storage } from '@google-cloud/storage';
import axios from 'axios';

// Google Cloud Storageの設定
const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  // 環境変数から直接認証情報を設定（本番環境推奨）
  credentials: process.env.GOOGLE_CLOUD_CREDENTIALS ? JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS) : undefined,
  // または、キーファイルを使用する場合：
  // keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE,
});

const BUCKET_NAME = process.env.GOOGLE_CLOUD_STORAGE_BUCKET_NAME;

// 動画ファイルをGoogle Cloud Storageに保存
export async function saveVideoToGCS(
  downloadUrl: string,
  fileName: string,
  paymentIntentId: string
): Promise<string> {
  if (!BUCKET_NAME) {
    throw new Error('Google Cloud Storageバケット名が設定されていません (GOOGLE_CLOUD_STORAGE_BUCKET_NAME)');
  }

  if (!process.env.GOOGLE_CLOUD_PROJECT_ID) {
    throw new Error('Google Cloud プロジェクトIDが設定されていません (GOOGLE_CLOUD_PROJECT_ID)');
  }

  try {
    console.log(`動画をダウンロード中: ${downloadUrl}`);
    
    // Vizard.aiから動画をダウンロード
    const response = await axios.get(downloadUrl, {
      responseType: 'stream',
      timeout: 300000, // 5分のタイムアウト
    });

    const contentType = response.headers['content-type'] || 'video/mp4';
    
    // GCSのオブジェクト名を生成（注文ID/ファイル名の形式）
    const objectName = `videos/${paymentIntentId}/${fileName}`;
    
    console.log(`Google Cloud Storageに動画をアップロード中: ${objectName}`);
    
    // バケットとファイルの参照を取得
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(objectName);

    // メタデータを設定
    const metadata = {
      contentType,
      metadata: {
        'payment-intent-id': paymentIntentId,
        'original-download-url': downloadUrl,
        'uploaded-at': new Date().toISOString(),
      },
    };

    // ストリームを使用してアップロード
    const stream = file.createWriteStream({
      metadata,
      resumable: false, // 小さなファイルの場合はresumableを無効にする
    });

    return new Promise((resolve, reject) => {
      stream.on('error', (error) => {
        console.error('Google Cloud Storageアップロードエラー:', error);
        reject(error);
      });

      stream.on('finish', () => {
        console.log(`動画をGoogle Cloud Storageに保存しました: gs://${BUCKET_NAME}/${objectName}`);
        resolve(`gs://${BUCKET_NAME}/${objectName}`);
      });

      // レスポンスストリームをGCSストリームにパイプ
      response.data.pipe(stream);
    });

  } catch (error) {
    console.error('Google Cloud Storageへの動画保存エラー:', error);
    throw error;
  }
}

// Google Cloud Storageから動画の署名付きURLを生成（ダウンロード用）
export async function generateSignedDownloadUrl(
  objectName: string,
  expiresIn: number = 3600 // デフォルト1時間（秒）
): Promise<string> {
  if (!BUCKET_NAME) {
    throw new Error('Google Cloud Storageバケット名が設定されていません (GOOGLE_CLOUD_STORAGE_BUCKET_NAME)');
  }

  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(objectName);

    // 署名付きURLを生成
    const [signedUrl] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + expiresIn * 1000, // ミリ秒に変換
    });

    return signedUrl;

  } catch (error) {
    console.error('署名付きURL生成エラー:', error);
    throw error;
  }
}

// 環境変数の設定状況を確認
export function checkStorageConfiguration(): { configured: boolean; missing: string[] } {
  const missing: string[] = [];
  
  if (!process.env.GOOGLE_CLOUD_PROJECT_ID) missing.push('GOOGLE_CLOUD_PROJECT_ID');
  if (!process.env.GOOGLE_CLOUD_STORAGE_BUCKET_NAME) missing.push('GOOGLE_CLOUD_STORAGE_BUCKET_NAME');
  
  // 認証方法のチェック（キーファイルまたは認証情報のいずれかが必要）
  if (!process.env.GOOGLE_CLOUD_KEY_FILE && !process.env.GOOGLE_CLOUD_CREDENTIALS) {
    missing.push('GOOGLE_CLOUD_KEY_FILE または GOOGLE_CLOUD_CREDENTIALS');
  }
  
  return {
    configured: missing.length === 0,
    missing
  };
}

// ファイル名を生成（動画タイトルから安全なファイル名を作成）
export function generateSafeFileName(title: string, extension: string = 'mp4'): string {
  // 日本語文字や特殊文字を安全な文字に変換
  const safeTitle = title
    .replace(/[^\w\s-]/g, '') // 英数字、スペース、ハイフン以外を削除
    .replace(/\s+/g, '_') // スペースをアンダースコアに変換
    .substring(0, 50); // 長さを制限
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `${safeTitle}_${timestamp}.${extension}`;
}

// バケットが存在するかチェック（オプション）
export async function checkBucketExists(): Promise<boolean> {
  if (!BUCKET_NAME) {
    return false;
  }

  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const [exists] = await bucket.exists();
    return exists;
  } catch (error) {
    console.error('バケット存在チェックエラー:', error);
    return false;
  }
}

// 後方互換性のためのエイリアス（既存のコードが動作するように）
export const saveVideoToS3 = saveVideoToGCS;