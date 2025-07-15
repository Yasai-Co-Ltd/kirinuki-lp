import { NextResponse } from 'next/server';
import { checkStorageConfiguration, checkBucketExists } from '@/lib/storage';

export async function GET() {
  try {
    console.log('🔍 Google Cloud Storage設定をテスト中...');

    // 環境変数の設定状況を確認
    const configCheck = checkStorageConfiguration();
    console.log('📋 設定確認結果:', configCheck);

    if (!configCheck.configured) {
      return NextResponse.json({
        success: false,
        error: 'Google Cloud Storage設定が不完全です',
        missing: configCheck.missing,
        details: {
          GOOGLE_CLOUD_PROJECT_ID: !!process.env.GOOGLE_CLOUD_PROJECT_ID,
          GOOGLE_CLOUD_STORAGE_BUCKET_NAME: !!process.env.GOOGLE_CLOUD_STORAGE_BUCKET_NAME,
          GOOGLE_CLOUD_CREDENTIALS: !!process.env.GOOGLE_CLOUD_CREDENTIALS,
          GOOGLE_CLOUD_KEY_FILE: !!process.env.GOOGLE_CLOUD_KEY_FILE,
        }
      }, { status: 400 });
    }

    // バケットの存在確認
    console.log('🪣 バケットの存在確認中...');
    const bucketExists = await checkBucketExists();
    console.log(`📦 バケット存在確認: ${bucketExists ? '✅ 存在' : '❌ 存在しない'}`);

    if (!bucketExists) {
      return NextResponse.json({
        success: false,
        error: 'Google Cloud Storageバケットが存在しないか、アクセスできません',
        bucketName: process.env.GOOGLE_CLOUD_STORAGE_BUCKET_NAME,
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Google Cloud Storage設定が正常に動作しています',
      config: {
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
        bucketName: process.env.GOOGLE_CLOUD_STORAGE_BUCKET_NAME,
        authMethod: process.env.GOOGLE_CLOUD_CREDENTIALS ? 'credentials' : 'keyFile',
        bucketExists: true,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ Google Cloud Storageテストエラー:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Google Cloud Storageテスト中にエラーが発生しました',
      details: error instanceof Error ? error.message : '不明なエラー',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}