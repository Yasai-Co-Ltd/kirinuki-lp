import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { OrderFormData } from '@/types/order';
import { calculateEstimate } from '@/lib/pricing';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export async function POST(request: NextRequest) {
  try {
    const requestData: OrderFormData & { videoDurations: number[]; videoInfos?: any[] } = await request.json();

    if (!requestData.videos || requestData.videos.length === 0 || !requestData.format || !requestData.qualityOption || !requestData.customerName || !requestData.customerEmail) {
      return NextResponse.json(
        { error: '必要な情報が不足しています' },
        { status: 400 }
      );
    }

    // 見積もり計算（複数動画対応）
    const estimate = calculateEstimate(
      requestData.videoDurations,
      requestData.format,
      requestData.qualityOption
    );

    // 動画URLリストを作成
    const videoUrls = requestData.videos.map(video => video.videoUrl);
    
    // 動画情報を取得（リクエストデータから直接取得）
    const videoInfos = requestData.videoInfos || [];
    
    // 動画数制限チェック（Stripeメタデータ制限対策）
    const MAX_VIDEOS = 3; // 安全な上限
    if (requestData.videos.length > MAX_VIDEOS) {
      return NextResponse.json(
        { error: `一度に注文できる動画数は${MAX_VIDEOS}本までです` },
        { status: 400 }
      );
    }
    
    // 動画情報を必要最小限に削減（メタデータの文字数制限対策）
    const compactVideoInfos = videoInfos.map(info => ({
      id: info.id,
      title: info.title.length > 30 ? info.title.substring(0, 30) + '...' : info.title, // さらに短縮
      duration: info.duration
    }));
    
    // トータル分数を計算
    const totalMinutes = Math.ceil(requestData.videoDurations.reduce((sum, duration) => sum + duration, 0) / 60);
    const videoCount = requestData.videos.length;

    // Stripe PaymentIntentを作成
    // 注意: Stripeは最小通貨単位で金額を受け取るため、日本円の場合はそのまま円単位で送信
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(estimate.totalPrice), // 円単位の金額をそのまま使用（小数点以下は四捨五入）
      currency: 'jpy',
      metadata: {
        customerName: requestData.customerName,
        customerEmail: requestData.customerEmail,
        videoUrls: JSON.stringify(videoUrls), // 複数URLをJSON形式で保存
        videoCount: videoCount.toString(),
        totalDurationMinutes: totalMinutes.toString(),
        format: requestData.format,
        qualityOption: requestData.qualityOption,
        videoDurations: JSON.stringify(requestData.videoDurations),
        // 切り抜き設定を圧縮（4つの値を1つの文字列に）
        settings: `${requestData.preferLength || 0},${requestData.aspectRatio || 1},${requestData.subtitleSwitch || 0},${requestData.headlineSwitch || 0}`,
        // 見積もり情報
        deliveryDays: estimate.estimatedDeliveryDays.toString(),
        // 特別要望は文字数制限のため除外（必要に応じて別途保存）
      },
      receipt_email: requestData.customerEmail,
      description: `切り抜き動画制作 - ${videoCount}本 (合計${totalMinutes}分) - ${
        requestData.format === 'default' ? 'デフォルト' :
        requestData.format === 'separate' ? '2分割' :
        requestData.format === 'zoom' ? 'ズーム' : requestData.format
      } (${requestData.qualityOption === 'ai_only' ? 'AIのみ' : '人の目で確認'})`,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      estimate,
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    return NextResponse.json(
      { error: '決済の準備中にエラーが発生しました' },
      { status: 500 }
    );
  }
}