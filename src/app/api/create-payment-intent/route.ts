import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { OrderFormData } from '@/types/order';
import { calculateEstimate } from '@/lib/pricing';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export async function POST(request: NextRequest) {
  try {
    const orderData: OrderFormData & { videoDuration: number } = await request.json();

    if (!orderData.videoUrl || !orderData.format || !orderData.customerName || !orderData.customerEmail) {
      return NextResponse.json(
        { error: '必要な情報が不足しています' },
        { status: 400 }
      );
    }

    // 見積もり計算
    const estimate = calculateEstimate(
      orderData.videoDuration,
      orderData.format === 'with_subtitles'
    );

    // Stripe PaymentIntentを作成
    const paymentIntent = await stripe.paymentIntents.create({
      amount: estimate.totalPrice,
      currency: 'jpy',
      metadata: {
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        videoUrl: orderData.videoUrl,
        format: orderData.format,
        videoDuration: orderData.videoDuration.toString(),
        specialRequests: orderData.specialRequests || '',
        // 切り抜き設定
        preferLength: orderData.preferLength?.toString() || '0',
        aspectRatio: orderData.aspectRatio?.toString() || '1',
        subtitleSwitch: orderData.subtitleSwitch?.toString() || '0',
        headlineSwitch: orderData.headlineSwitch?.toString() || '0',
      },
      receipt_email: orderData.customerEmail,
      description: `切り抜き動画制作 - ${orderData.format === 'with_subtitles' ? '字幕あり' : '字幕なし'}`,
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