import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { sendOrderConfirmationEmails, OrderEmailData } from '@/lib/email';
import { saveOrderToSheet } from '@/lib/sheets';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// 環境変数の設定状況をチェック
function checkEnvironmentVariables() {
  const missing: string[] = [];
  const warnings: string[] = [];

  // 必須の環境変数をチェック
  if (!process.env.STRIPE_SECRET_KEY) missing.push('STRIPE_SECRET_KEY');
  if (!process.env.STRIPE_WEBHOOK_SECRET) missing.push('STRIPE_WEBHOOK_SECRET');
  if (!process.env.SENDGRID_API_KEY) missing.push('SENDGRID_API_KEY');
  if (!process.env.FROM_EMAIL) missing.push('FROM_EMAIL');
  if (!process.env.ADMIN_EMAIL) missing.push('ADMIN_EMAIL');
  if (!process.env.GOOGLE_SHEETS_SPREADSHEET_ID) missing.push('GOOGLE_SHEETS_SPREADSHEET_ID');
  if (!process.env.GOOGLE_SHEETS_CLIENT_EMAIL) missing.push('GOOGLE_SHEETS_CLIENT_EMAIL');
  if (!process.env.GOOGLE_SHEETS_PRIVATE_KEY) missing.push('GOOGLE_SHEETS_PRIVATE_KEY');

  // テスト値の警告
  if (process.env.STRIPE_WEBHOOK_SECRET === 'whsec_1234567890abcdef') {
    warnings.push('STRIPE_WEBHOOK_SECRET がテスト値のままです');
  }

  return { missing, warnings };
}

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
  
  // 環境変数の設定状況をチェック
  const envCheck = checkEnvironmentVariables();
  if (envCheck.missing.length > 0) {
    console.error('❌ 必須の環境変数が設定されていません:', envCheck.missing);
  }
  if (envCheck.warnings.length > 0) {
    console.warn('⚠️ 環境変数の警告:', envCheck.warnings);
  }
  
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

  console.log('📋 Order completed:', {
    paymentIntentId: orderEmailData.paymentIntentId,
    customerName: orderEmailData.customerName,
    customerEmail: orderEmailData.customerEmail,
    videoCount: orderEmailData.videoInfos.length,
    amount: orderEmailData.amount
  });

  // エラーを収集して最後に報告
  const errors: string[] = [];

  // 顧客と管理者にメール送信
  try {
    await sendOrderConfirmationEmails(orderEmailData);
    console.log('✅ メール送信が完了しました');
  } catch (error) {
    console.error('❌ メール送信に失敗しました:', error);
    errors.push(`メール送信エラー: ${error instanceof Error ? error.message : String(error)}`);
  }
  
  // スプレッドシートに注文データを保存
  try {
    await saveOrderToSheet(orderEmailData);
    console.log('✅ スプレッドシートへの保存が完了しました');
  } catch (error) {
    console.error('❌ スプレッドシートへの保存に失敗しました:', error);
    errors.push(`スプレッドシート保存エラー: ${error instanceof Error ? error.message : String(error)}`);
  }

  // エラーがあった場合は詳細をログに出力
  if (errors.length > 0) {
    console.error('注文完了処理で以下のエラーが発生しました:', errors);
    // エラーがあってもwebhookは成功として返す（決済は完了しているため）
  } else {
    console.log('✅ 注文完了処理がすべて正常に完了しました');
  }
}