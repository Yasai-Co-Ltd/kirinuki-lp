import { NextRequest, NextResponse } from 'next/server';
import { extractVideoId, getVideoInfo } from '@/lib/youtube';

export async function POST(request: NextRequest) {
  try {
    const { videoUrl } = await request.json();

    if (!videoUrl) {
      return NextResponse.json(
        { error: '動画URLが必要です' },
        { status: 400 }
      );
    }

    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      return NextResponse.json(
        { error: '有効なYouTube URLを入力してください' },
        { status: 400 }
      );
    }

    const videoInfo = await getVideoInfo(videoId);
    if (!videoInfo) {
      return NextResponse.json(
        { error: '動画情報を取得できませんでした。URLを確認してください。' },
        { status: 404 }
      );
    }

    return NextResponse.json({ videoInfo });
  } catch (error) {
    console.error('Video info API error:', error);
    return NextResponse.json(
      { error: '動画情報の取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
}