import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { downloadUrl, fileName } = await request.json();

    if (!downloadUrl || !fileName) {
      return NextResponse.json(
        { error: 'downloadUrlとfileNameが必要です' },
        { status: 400 }
      );
    }

    console.log(`📥 ファイルプロキシダウンロード開始: ${fileName}`);

    // サーバーサイドでファイルを取得
    const response = await fetch(downloadUrl);
    
    if (!response.ok) {
      console.error(`❌ ファイル取得エラー: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: `ファイルの取得に失敗しました: ${response.status}` },
        { status: response.status }
      );
    }

    // レスポンスヘッダーを設定
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const contentLength = response.headers.get('content-length');

    const headers: Record<string, string> = {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
      'Cache-Control': 'no-cache',
    };

    if (contentLength) {
      headers['Content-Length'] = contentLength;
    }

    // ストリームとしてファイルを返す
    const arrayBuffer = await response.arrayBuffer();
    
    console.log(`✅ ファイルプロキシダウンロード完了: ${fileName} (${arrayBuffer.byteLength} bytes)`);

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers,
    });

  } catch (error) {
    console.error('❌ ファイルプロキシダウンロードエラー:', error);
    return NextResponse.json(
      { 
        error: 'ファイルのダウンロードに失敗しました',
        details: error instanceof Error ? error.message : '不明なエラー'
      },
      { status: 500 }
    );
  }
}