import { NextRequest, NextResponse } from 'next/server';
import { extractVideoId, getVideoInfo } from '@/lib/youtube';

export async function POST(request: NextRequest) {
  try {
    const { videoUrl, videoUrls } = await request.json();

    // 単一動画または複数動画に対応
    const urls = videoUrls || (videoUrl ? [videoUrl] : []);

    if (!urls || urls.length === 0) {
      return NextResponse.json(
        { error: '動画URLが必要です' },
        { status: 400 }
      );
    }

    const videoInfos = [];
    const errors = [];

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const videoId = extractVideoId(url);
      
      if (!videoId) {
        errors.push(`動画${i + 1}: 有効なYouTube URLを入力してください`);
        continue;
      }

      const videoInfo = await getVideoInfo(videoId);
      if (!videoInfo) {
        console.error('Failed to get video info for videoId:', videoId);
        errors.push(`動画${i + 1}: 動画情報を取得できませんでした`);
        continue;
      }

      videoInfos.push(videoInfo);
    }

    if (videoInfos.length === 0) {
      return NextResponse.json(
        { error: errors.join(', ') || '動画情報を取得できませんでした' },
        { status: 404 }
      );
    }

    // 単一動画の場合は後方互換性のため videoInfo を返す
    if (videoUrl && !videoUrls) {
      return NextResponse.json({
        videoInfo: videoInfos[0],
        errors: errors.length > 0 ? errors : undefined
      });
    }

    // 複数動画の場合は videoInfos を返す
    return NextResponse.json({
      videoInfos,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Video info API error:', error);
    return NextResponse.json(
      { error: '動画情報の取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
}