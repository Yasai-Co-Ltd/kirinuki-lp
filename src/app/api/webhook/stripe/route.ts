import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

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
  
  // 発注情報をデータベースに保存（今回は簡略化）
  const orderData = {
    paymentIntentId: paymentIntent.id,
    customerName: metadata.customerName,
    customerEmail: metadata.customerEmail,
    videoUrl: metadata.videoUrl,
    format: metadata.format,
    videoDuration: parseInt(metadata.videoDuration),
    specialRequests: metadata.specialRequests,
    amount: paymentIntent.amount,
    status: 'paid',
    createdAt: new Date(),
  };

  console.log('Order completed:', orderData);

  // メール送信処理（実装例）
  await sendOrderConfirmationEmail(orderData);
}

async function sendOrderConfirmationEmail(orderData: any) {
  // SendGridやその他のメールサービスを使用してメール送信
  // 今回は簡略化してコンソールログのみ
  console.log('Sending confirmation email to:', orderData.customerEmail);
  
  // 実際の実装例：
  /*
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: orderData.customerEmail,
    from: process.env.FROM_EMAIL,
    subject: '切り抜き動画制作のご注文を承りました',
    html: `
      <h2>ご注文ありがとうございます</h2>
      <p>${orderData.customerName}様</p>
      <p>切り抜き動画制作のご注文を承りました。</p>
      <ul>
        <li>動画URL: ${orderData.videoUrl}</li>
        <li>フォーマット: ${orderData.format === 'with_subtitles' ? '字幕あり' : '字幕なし'}</li>
        <li>料金: ¥${orderData.amount.toLocaleString()}</li>
      </ul>
      <p>制作完了次第、メールにてお届けいたします。</p>
    `,
  };

  await sgMail.send(msg);
  */
}