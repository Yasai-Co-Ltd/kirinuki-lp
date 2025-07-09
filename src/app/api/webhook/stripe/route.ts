import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { sendOrderConfirmationEmails, OrderEmailData } from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  // 決済成功時の処理
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    
    try {
      // ここで発注完了の処理を行う
      await handleOrderCompletion(paymentIntent);
    } catch (error) {
      console.error('Order completion handling failed:', error);
      return NextResponse.json({ error: 'Order processing failed' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}

async function handleOrderCompletion(paymentIntent: Stripe.PaymentIntent) {
  const metadata = paymentIntent.metadata;
  
  try {
    // メタデータから注文情報を構築
    const videoUrls = metadata.videoUrls ? JSON.parse(metadata.videoUrls) : [metadata.videoUrl];
    const videoInfos = metadata.videoInfos ? JSON.parse(metadata.videoInfos) : [];
    
    const orderEmailData: OrderEmailData = {
      paymentIntentId: paymentIntent.id,
      customerName: metadata.customerName || '',
      customerEmail: metadata.customerEmail || '',
      videoUrls: videoUrls,
      videoInfos: videoInfos,
      format: (metadata.format as 'default' | 'separate' | 'zoom') || 'default',
      qualityOption: (metadata.qualityOption as 'ai_only' | 'human_review') || 'ai_only',
      preferLength: parseInt(metadata.preferLength || '0'),
      aspectRatio: parseInt(metadata.aspectRatio || '1'),
      subtitleSwitch: parseInt(metadata.subtitleSwitch || '1'),
      headlineSwitch: parseInt(metadata.headlineSwitch || '1'),
      specialRequests: metadata.specialRequests,
      amount: paymentIntent.amount / 100, // Stripeは金額をセント単位で保存するため100で割る
      estimatedDeliveryDays: parseInt(metadata.estimatedDeliveryDays || '3'),
      createdAt: new Date(),
    };

    console.log('Order completed:', orderEmailData);

    // 顧客と管理者にメール送信
    await sendOrderConfirmationEmails(orderEmailData);
    
  } catch (error) {
    console.error('注文完了処理中にエラーが発生しました:', error);
    // メール送信エラーでも注文処理は継続
  }
}