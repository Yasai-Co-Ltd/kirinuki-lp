import { NextRequest, NextResponse } from 'next/server';
import { initializeSheetHeaders, checkSheetsConfiguration } from '@/lib/sheets';

export async function POST(request: NextRequest) {
  try {
    // 設定確認
    const config = checkSheetsConfiguration();
    if (!config.configured) {
      return NextResponse.json(
        { 
          error: 'Google Sheets設定が不完全です',
          missing: config.missing
        },
        { status: 400 }
      );
    }

    // ヘッダー初期化
    await initializeSheetHeaders();

    return NextResponse.json({
      success: true,
      message: 'スプレッドシートのヘッダーを初期化しました'
    });

  } catch (error) {
    console.error('スプレッドシートヘッダー初期化エラー:', error);
    return NextResponse.json(
      { 
        error: 'スプレッドシートの初期化に失敗しました',
        details: error instanceof Error ? error.message : '不明なエラー'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // 設定状況を確認
    const config = checkSheetsConfiguration();
    
    return NextResponse.json({
      configured: config.configured,
      missing: config.missing,
      message: config.configured 
        ? 'Google Sheets設定は正常です' 
        : 'Google Sheets設定が不完全です'
    });

  } catch (error) {
    console.error('Google Sheets設定確認エラー:', error);
    return NextResponse.json(
      { 
        error: '設定確認に失敗しました',
        details: error instanceof Error ? error.message : '不明なエラー'
      },
      { status: 500 }
    );
  }
}