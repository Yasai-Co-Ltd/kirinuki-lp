import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { OrderFormData } from '@/types/order';
import { calculateEstimate } from '@/lib/pricing';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export async function POST(request: NextRequest) {
  try {
    const orderData: OrderFormData & { videoDurations: number[] } = await request.json();

    if (!orderData.videos || orderData.videos.length === 0 || !orderData.format || !orderData.qualityOption || !orderData.customerName || !orderData.customerEmail) {
      return NextResponse.json(
        { error: '必要な情報が不足しています' },
        { status: 400 }
      );
    }

    // 見積もり計算（複数動画対応）
    const estimate = calculateEstimate(
      orderData.videoDurations,
      orderData.format,
      orderData.qualityOption
    );

    // 動画URLリストを作成
    const videoUrls = orderData.videos.map(video => video.videoUrl);
    
    // トータル分数を計算
    const totalMinutes = Math.ceil(orderData.videoDurations.reduce((sum, duration) => sum + duration, 0) / 60);
    const videoCount = orderData.videos.length;

    // Stripe PaymentIntentを作成
    const paymentIntent = await stripe.paymentIntents.create({
      amount: estimate.totalPrice,
      currency: 'jpy',
      metadata: {
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        videoUrls: JSON.stringify(videoUrls), // 複数URLをJSON形式で保存
        videoCount: videoCount.toString(),
        totalDurationMinutes: totalMinutes.toString(),
        format: orderData.format,
        qualityOption: orderData.qualityOption,
        videoDurations: JSON.stringify(orderData.videoDurations),
        specialRequests: orderData.specialRequests || '',
        // 切り抜き設定
        preferLength: orderData.preferLength?.toString() || '0',
        aspectRatio: orderData.aspectRatio?.toString() || '1',
        subtitleSwitch: orderData.subtitleSwitch?.toString() || '0',
        headlineSwitch: orderData.headlineSwitch?.toString() || '0',
      },
      receipt_email: orderData.customerEmail,
      description: `切り抜き動画制作 - ${videoCount}本 (合計${totalMinutes}分) - ${
        orderData.format === 'default' ? 'デフォルト' :
        orderData.format === 'separate' ? '2分割' :
        orderData.format === 'zoom' ? 'ズーム' : orderData.format
      } (${orderData.qualityOption === 'ai_only' ? 'AIのみ' : '人の目で確認'})`,
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