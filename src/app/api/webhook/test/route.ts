import { NextRequest, NextResponse } from 'next/server';

// Stripe webhookのテスト用エンドポイント
export async function POST(request: NextRequest) {
  console.log('🧪 Webhook test endpoint called');
  
  const body = await request.text();
  const headers = Object.fromEntries(request.headers.entries());
  
  console.log('📋 Request details:', {
    method: 'POST',
    url: request.url,
    headers: {
      'content-type': headers['content-type'],
      'stripe-signature': headers['stripe-signature'] ? 'present' : 'missing',
      'user-agent': headers['user-agent'],
    },
    bodyLength: body.length,
    bodyPreview: body.substring(0, 100) + (body.length > 100 ? '...' : ''),
  });

  return NextResponse.json({
    success: true,
    message: 'Webhook test endpoint received request',
    timestamp: new Date().toISOString(),
    requestInfo: {
      method: 'POST',
      hasStripeSignature: !!headers['stripe-signature'],
      bodyLength: body.length,
      contentType: headers['content-type'],
    }
  });
}

export async function GET() {
  return NextResponse.json({
    message: 'Webhook test endpoint is active',
    timestamp: new Date().toISOString(),
    endpoint: '/api/webhook/test'
  });
}