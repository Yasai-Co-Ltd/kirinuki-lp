import sgMail from '@sendgrid/mail';

// SendGrid APIキーを設定
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export interface OrderEmailData {
  paymentIntentId: string;
  customerName: string;
  customerEmail: string;
  videoUrls: string[];
  videoInfos: Array<{
    title: string;
    duration: number;
    thumbnailUrl: string;
    channelTitle: string;
  }>;
  format: 'default' | 'separate' | 'zoom';
  qualityOption: 'ai_only' | 'human_review';
  preferLength: number;
  aspectRatio: number;
  subtitleSwitch: number;
  headlineSwitch: number;
  specialRequests?: string;
  amount: number;
  estimatedDeliveryDays: number;
  createdAt: Date;
}

// フォーマット名を日本語に変換
const getFormatName = (format: string): string => {
  switch (format) {
    case 'default': return 'デフォルト';
    case 'separate': return '2分割';
    case 'zoom': return 'ズーム';
    default: return format;
  }
};

// 品質オプション名を日本語に変換
const getQualityOptionName = (qualityOption: string): string => {
  switch (qualityOption) {
    case 'ai_only': return 'AIのみ';
    case 'human_review': return '人の目で確認';
    default: return qualityOption;
  }
};

// 優先クリップ長を日本語に変換
const getPreferLengthName = (preferLength: number): string => {
  switch (preferLength) {
    case 0: return '自動';
    case 1: return '〜30秒';
    case 2: return '30秒〜60秒';
    case 3: return '60秒〜90秒';
    case 4: return '90秒〜3分';
    default: return '自動';
  }
};

// アスペクト比を日本語に変換
const getAspectRatioName = (aspectRatio: number): string => {
  switch (aspectRatio) {
    case 1: return '9:16 (縦型)';
    case 2: return '1:1 (正方形)';
    case 3: return '4:5 (ポートレート)';
    case 4: return '16:9 (横型)';
    default: return '9:16 (縦型)';
  }
};

// 時間を分:秒形式に変換
const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// 顧客向け注文確認メールを送信
export async function sendCustomerOrderConfirmationEmail(orderData: OrderEmailData): Promise<void> {
  if (!process.env.SENDGRID_API_KEY || !process.env.FROM_EMAIL) {
    const error = 'SendGrid設定が不完全です (SENDGRID_API_KEY または FROM_EMAIL が設定されていません)';
    console.error(error);
    throw new Error(error);
  }

  const totalDurationMinutes = Math.ceil(
    orderData.videoInfos.reduce((sum, info) => sum + info.duration, 0) / 60
  );

  const videoListHtml = orderData.videoInfos.map((video, index) => `
    <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 12px; background-color: #f9fafb;">
      <div style="display: flex; gap: 16px; align-items: flex-start;">
        <img src="${video.thumbnailUrl}" alt="${video.title}" style="width: 120px; height: 90px; object-fit: cover; border-radius: 6px;">
        <div style="flex: 1;">
          <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #111827; line-height: 1.4;">${video.title}</h4>
          <p style="margin: 0 0 4px 0; font-size: 12px; color: #6b7280;">${video.channelTitle}</p>
          <p style="margin: 0; font-size: 12px; color: #6b7280;">長さ: ${formatDuration(video.duration)}</p>
        </div>
      </div>
    </div>
  `).join('');

  const msg = {
    to: orderData.customerEmail,
    from: process.env.FROM_EMAIL!,
    subject: '【切り抜き動画制作】ご注文を承りました',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ご注文確認</title>
      </head>
      <body style="font-family: 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Meiryo', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
          <h1 style="margin: 0; font-size: 24px; font-weight: bold;">ご注文ありがとうございます！</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">切り抜き動画制作のご注文を承りました</p>
        </div>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <h2 style="margin: 0 0 20px 0; font-size: 18px; color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 8px;">
            📋 ご注文内容
          </h2>
          
          <div style="margin-bottom: 20px;">
            <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #1f2937;">
              📹 注文動画 (${orderData.videoInfos.length}本・合計${totalDurationMinutes}分)
            </h3>
            ${videoListHtml}
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
            <div style="background-color: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px;">
              <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #1f2937;">⚙️ 基本設定</h4>
              <div style="font-size: 13px; line-height: 1.8;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                  <span style="color: #6b7280;">フォーマット:</span>
                  <span style="font-weight: 500;">${getFormatName(orderData.format)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                  <span style="color: #6b7280;">品質オプション:</span>
                  <span style="font-weight: 500;">${getQualityOptionName(orderData.qualityOption)}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #6b7280;">納期:</span>
                  <span style="font-weight: 500;">約${orderData.estimatedDeliveryDays}営業日</span>
                </div>
              </div>
            </div>

            <div style="background-color: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px;">
              <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #1f2937;">✂️ 切り抜き設定</h4>
              <div style="font-size: 13px; line-height: 1.8;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                  <span style="color: #6b7280;">優先クリップ長:</span>
                  <span style="font-weight: 500;">${getPreferLengthName(orderData.preferLength)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                  <span style="color: #6b7280;">アスペクト比:</span>
                  <span style="font-weight: 500;">${getAspectRatioName(orderData.aspectRatio)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                  <span style="color: #6b7280;">字幕:</span>
                  <span style="font-weight: 500;">${orderData.subtitleSwitch ? 'あり' : 'なし'}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #6b7280;">タイトル:</span>
                  <span style="font-weight: 500;">${orderData.headlineSwitch ? 'あり' : 'なし'}</span>
                </div>
              </div>
            </div>
          </div>

          ${orderData.specialRequests ? `
            <div style="background-color: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
              <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #1f2937;">💬 特別なご要望</h4>
              <p style="margin: 0; font-size: 13px; color: #374151; background-color: #f9fafb; padding: 12px; border-radius: 6px;">${orderData.specialRequests}</p>
            </div>
          ` : ''}

          <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; border-radius: 8px; padding: 20px; text-align: center;">
            <h3 style="margin: 0 0 8px 0; font-size: 18px;">💰 お支払い金額</h3>
            <p style="margin: 0; font-size: 28px; font-weight: bold;">¥${orderData.amount.toLocaleString()}</p>
          </div>
        </div>

        <div style="background-color: #ecfdf5; border: 1px solid #10b981; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <h2 style="margin: 0 0 16px 0; font-size: 18px; color: #065f46;">✅ 今後の流れ</h2>
          <ol style="margin: 0; padding-left: 20px; color: #047857;">
            <li style="margin-bottom: 8px;">決済完了の確認</li>
            <li style="margin-bottom: 8px;">動画の分析・切り抜き箇所の選定</li>
            <li style="margin-bottom: 8px;">切り抜き動画の制作</li>
            <li style="margin-bottom: 8px;">品質チェック${orderData.qualityOption === 'human_review' ? '（人の目による確認）' : ''}</li>
            <li>完成動画のお届け（専用ダウンロードページでのお受け取り）</li>
          </ol>
        </div>

        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #92400e;">📞 お問い合わせ</h3>
          <p style="margin: 0; font-size: 14px; color: #92400e;">
            ご不明な点がございましたら、このメールに返信するか、お問い合わせフォームよりご連絡ください。<br>
            制作状況についても随時お知らせいたします。
          </p>
        </div>

        <div style="text-align: center; padding: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
          <p style="margin: 0;">このメールは自動送信されています。</p>
          <p style="margin: 4px 0 0 0;">注文ID: ${orderData.paymentIntentId}</p>
        </div>

      </body>
      </html>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log('顧客向け注文確認メールを送信しました:', orderData.customerEmail);
  } catch (error) {
    console.error('顧客向けメール送信エラー:', error);
    throw error;
  }
}

// 管理者向け新規注文通知メールを送信
export async function sendAdminOrderNotificationEmail(orderData: OrderEmailData): Promise<void> {
  if (!process.env.SENDGRID_API_KEY || !process.env.FROM_EMAIL || !process.env.ADMIN_EMAIL) {
    const error = 'SendGrid設定または管理者メールアドレスが不完全です (SENDGRID_API_KEY, FROM_EMAIL, または ADMIN_EMAIL が設定されていません)';
    console.error(error);
    throw new Error(error);
  }

  const totalDurationMinutes = Math.ceil(
    orderData.videoInfos.reduce((sum, info) => sum + info.duration, 0) / 60
  );

  const videoListHtml = orderData.videoInfos.map((video, index) => `
    <tr>
      <td style="padding: 8px; border: 1px solid #e5e7eb; font-size: 12px;">
        <img src="${video.thumbnailUrl}" alt="${video.title}" style="width: 80px; height: 60px; object-fit: cover; border-radius: 4px; display: block; margin-bottom: 4px;">
        <div style="font-weight: 600; margin-bottom: 2px;">${video.title}</div>
        <div style="color: #6b7280;">${video.channelTitle}</div>
        <div style="color: #6b7280;">長さ: ${formatDuration(video.duration)}</div>
      </td>
      <td style="padding: 8px; border: 1px solid #e5e7eb; font-size: 12px;">
        <a href="${orderData.videoUrls[index]}" target="_blank" style="color: #3b82f6; text-decoration: none;">動画を開く</a>
      </td>
    </tr>
  `).join('');

  const msg = {
    to: process.env.ADMIN_EMAIL!,
    from: process.env.FROM_EMAIL!,
    subject: `【新規注文】${orderData.customerName}様より切り抜き動画制作の注文`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>新規注文通知</title>
      </head>
      <body style="font-family: 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Meiryo', sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px;">
        
        <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
          <h1 style="margin: 0; font-size: 24px; font-weight: bold;">🚨 新規注文通知</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">切り抜き動画制作の新しい注文が入りました</p>
        </div>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <h2 style="margin: 0 0 20px 0; font-size: 18px; color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 8px;">
            👤 顧客情報
          </h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
              <strong>お名前:</strong> ${orderData.customerName}
            </div>
            <div>
              <strong>メールアドレス:</strong> ${orderData.customerEmail}
            </div>
          </div>
        </div>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <h2 style="margin: 0 0 20px 0; font-size: 18px; color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 8px;">
            📹 注文動画 (${orderData.videoInfos.length}本・合計${totalDurationMinutes}分)
          </h2>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="padding: 12px; border: 1px solid #e5e7eb; background-color: #f3f4f6; text-align: left; font-size: 14px;">動画情報</th>
                <th style="padding: 12px; border: 1px solid #e5e7eb; background-color: #f3f4f6; text-align: left; font-size: 14px;">リンク</th>
              </tr>
            </thead>
            <tbody>
              ${videoListHtml}
            </tbody>
          </table>
        </div>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <h2 style="margin: 0 0 20px 0; font-size: 18px; color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 8px;">
            ⚙️ 制作設定
          </h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
              <div style="margin-bottom: 12px;">
                <strong>フォーマット:</strong> ${getFormatName(orderData.format)}
              </div>
              <div style="margin-bottom: 12px;">
                <strong>品質オプション:</strong> ${getQualityOptionName(orderData.qualityOption)}
              </div>
              <div style="margin-bottom: 12px;">
                <strong>納期:</strong> 約${orderData.estimatedDeliveryDays}営業日
              </div>
            </div>
            <div>
              <div style="margin-bottom: 12px;">
                <strong>優先クリップ長:</strong> ${getPreferLengthName(orderData.preferLength)}
              </div>
              <div style="margin-bottom: 12px;">
                <strong>アスペクト比:</strong> ${getAspectRatioName(orderData.aspectRatio)}
              </div>
              <div style="margin-bottom: 12px;">
                <strong>字幕:</strong> ${orderData.subtitleSwitch ? 'あり' : 'なし'}
              </div>
              <div style="margin-bottom: 12px;">
                <strong>タイトル:</strong> ${orderData.headlineSwitch ? 'あり' : 'なし'}
              </div>
            </div>
          </div>
          
          ${orderData.specialRequests ? `
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <strong>特別なご要望:</strong>
              <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 12px; margin-top: 8px;">
                ${orderData.specialRequests}
              </div>
            </div>
          ` : ''}
        </div>

        <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <h2 style="margin: 0 0 12px 0; font-size: 20px;">💰 注文金額</h2>
          <p style="margin: 0; font-size: 32px; font-weight: bold;">¥${orderData.amount.toLocaleString()}</p>
        </div>

        <div style="background-color: #fef2f2; border: 1px solid #fca5a5; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #dc2626;">⚡ 対応が必要な作業</h3>
          <ul style="margin: 0; padding-left: 20px; color: #dc2626;">
            <li>動画の分析・切り抜き箇所の選定</li>
            <li>切り抜き動画の制作開始</li>
            <li>進捗状況の顧客への連絡</li>
            ${orderData.qualityOption === 'human_review' ? '<li><strong>人の目による品質チェック</strong></li>' : ''}
          </ul>
        </div>

        <div style="text-align: center; padding: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
          <p style="margin: 0;">注文日時: ${orderData.createdAt.toLocaleString('ja-JP')}</p>
          <p style="margin: 4px 0 0 0;">注文ID: ${orderData.paymentIntentId}</p>
        </div>

      </body>
      </html>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log('管理者向け新規注文通知メールを送信しました:', process.env.ADMIN_EMAIL);
  } catch (error) {
    console.error('管理者向けメール送信エラー:', error);
    throw error;
  }
}

// 両方のメールを送信する統合関数
export async function sendOrderConfirmationEmails(orderData: OrderEmailData): Promise<void> {
  const errors: string[] = [];

  // 顧客向けメール送信
  try {
    await sendCustomerOrderConfirmationEmail(orderData);
    console.log('✅ 顧客向けメール送信完了');
  } catch (error) {
    console.error('❌ 顧客向けメール送信失敗:', error);
    errors.push(`顧客向けメール: ${error instanceof Error ? error.message : String(error)}`);
  }

  // 管理者向けメール送信
  try {
    await sendAdminOrderNotificationEmail(orderData);
    console.log('✅ 管理者向けメール送信完了');
  } catch (error) {
    console.error('❌ 管理者向けメール送信失敗:', error);
    errors.push(`管理者向けメール: ${error instanceof Error ? error.message : String(error)}`);
  }

  // エラーがあった場合は例外を投げる
  if (errors.length > 0) {
    const errorMessage = `メール送信エラー: ${errors.join(', ')}`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  console.log('✅ 注文確認メールの送信が完了しました');
}

// お問い合わせメール送信機能
export interface ContactEmailData {
  name: string;
  email: string;
  message: string;
}

// お問い合わせメールを送信
export async function sendContactEmail(contactData: ContactEmailData): Promise<void> {
  if (!process.env.SENDGRID_API_KEY || !process.env.FROM_EMAIL || !process.env.ADMIN_EMAIL) {
    const error = 'SendGrid設定または管理者メールアドレスが不完全です (SENDGRID_API_KEY, FROM_EMAIL, または ADMIN_EMAIL が設定されていません)';
    console.error(error);
    throw new Error(error);
  }

  // 管理者向けお問い合わせ通知メール
  const adminMsg = {
    to: process.env.ADMIN_EMAIL!,
    from: process.env.FROM_EMAIL!,
    subject: `【お問い合わせ】${contactData.name}様からのお問い合わせ`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>お問い合わせ通知</title>
      </head>
      <body style="font-family: 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Meiryo', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
          <h1 style="margin: 0; font-size: 24px; font-weight: bold;">📧 新しいお問い合わせ</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">お客様からお問い合わせが届きました</p>
        </div>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <h2 style="margin: 0 0 20px 0; font-size: 18px; color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 8px;">
            👤 お客様情報
          </h2>
          
          <div style="margin-bottom: 16px;">
            <strong style="color: #374151;">お名前:</strong>
            <span style="margin-left: 8px;">${contactData.name}</span>
          </div>
          
          <div style="margin-bottom: 20px;">
            <strong style="color: #374151;">メールアドレス:</strong>
            <span style="margin-left: 8px;">${contactData.email}</span>
          </div>
          
          <div>
            <strong style="color: #374151;">お問い合わせ内容:</strong>
            <div style="background-color: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-top: 8px; white-space: pre-wrap;">${contactData.message}</div>
          </div>
        </div>

        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #92400e;">📞 対応について</h3>
          <p style="margin: 0; font-size: 14px; color: #92400e;">
            お客様への返信をお忘れなく。迅速な対応を心がけましょう。
          </p>
        </div>

        <div style="text-align: center; padding: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
          <p style="margin: 0;">このメールは自動送信されています。</p>
          <p style="margin: 4px 0 0 0;">受信日時: ${new Date().toLocaleString('ja-JP')}</p>
        </div>

      </body>
      </html>
    `,
  };

  // お客様向け自動返信メール
  const customerMsg = {
    to: contactData.email,
    from: process.env.FROM_EMAIL!,
    subject: 'お問い合わせを受け付けました',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>お問い合わせ受付確認</title>
      </head>
      <body style="font-family: 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Meiryo', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
          <h1 style="margin: 0; font-size: 24px; font-weight: bold;">✅ お問い合わせありがとうございます</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">お問い合わせを受け付けました</p>
        </div>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <p style="margin: 0 0 16px 0; font-size: 16px;">
            ${contactData.name} 様
          </p>
          
          <p style="margin: 0 0 16px 0;">
            この度は、お問い合わせいただきありがとうございます。<br>
            以下の内容でお問い合わせを受け付けました。
          </p>
          
          <div style="background-color: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <h3 style="margin: 0 0 12px 0; font-size: 14px; color: #374151;">お問い合わせ内容:</h3>
            <div style="white-space: pre-wrap; font-size: 14px; line-height: 1.6;">${contactData.message}</div>
          </div>
          
          <p style="margin: 16px 0 0 0;">
            担当者が内容を確認し、2営業日以内にご返信いたします。<br>
            しばらくお待ちください。
          </p>
        </div>

        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #92400e;">📞 緊急のお問い合わせについて</h3>
          <p style="margin: 0; font-size: 14px; color: #92400e;">
            緊急を要するお問い合わせの場合は、このメールに直接返信していただくか、<br>
            お電話にてお問い合わせください。
          </p>
        </div>

        <div style="text-align: center; padding: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
          <p style="margin: 0;">このメールは自動送信されています。</p>
          <p style="margin: 4px 0 0 0;">受付日時: ${new Date().toLocaleString('ja-JP')}</p>
        </div>

      </body>
      </html>
    `,
  };

  try {
    // 管理者向けメール送信
    await sgMail.send(adminMsg);
    console.log('管理者向けお問い合わせ通知メールを送信しました:', process.env.ADMIN_EMAIL);

    // お客様向け自動返信メール送信
    await sgMail.send(customerMsg);
    console.log('お客様向け自動返信メールを送信しました:', contactData.email);

  } catch (error) {
    console.error('お問い合わせメール送信エラー:', error);
    throw error;
  }
}

// 動画完了通知メール用のデータ型
export interface VideoCompletionEmailData {
  customerName: string;
  customerEmail: string;
  paymentIntentId: string;
  videoTitle: string;
  downloadUrl: string;
  originalUrl: string;
}

// 顧客向け動画完了通知メールを送信
export async function sendVideoCompletionEmail(data: VideoCompletionEmailData): Promise<void> {
  if (!process.env.SENDGRID_API_KEY || !process.env.FROM_EMAIL) {
    const error = 'SendGrid設定が不完全です (SENDGRID_API_KEY または FROM_EMAIL が設定されていません)';
    console.error(error);
    throw new Error(error);
  }

  const msg = {
    to: data.customerEmail,
    from: process.env.FROM_EMAIL!,
    subject: '【切り抜き動画制作】動画が完成しました！',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>動画完成通知</title>
      </head>
      <body style="font-family: 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Meiryo', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
          <h1 style="margin: 0; font-size: 24px; font-weight: bold;">🎉 動画が完成しました！</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">切り抜き動画の制作が完了いたしました</p>
        </div>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <h2 style="margin: 0 0 20px 0; font-size: 18px; color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 8px;">
            📹 完成動画情報
          </h2>
          
          <div style="background-color: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #1f2937;">動画タイトル</h3>
            <p style="margin: 0 0 16px 0; font-size: 14px; color: #374151; background-color: #f9fafb; padding: 12px; border-radius: 6px;">${data.videoTitle}</p>
            
            <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #1f2937;">元動画URL</h3>
            <p style="margin: 0; font-size: 14px;">
              <a href="${data.originalUrl}" target="_blank" style="color: #3b82f6; text-decoration: none;">元動画を確認する</a>
            </p>
          </div>

          <div style="background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: white; border-radius: 8px; padding: 20px; text-align: center;">
            <h3 style="margin: 0 0 16px 0; font-size: 18px;">📥 動画をダウンロード</h3>
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/download/${data.paymentIntentId}" target="_blank" style="display: inline-block; background-color: white; color: #1e40af; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 16px;">
              ダウンロードページを開く
            </a>
          </div>
        </div>

        <div style="background-color: #ecfdf5; border: 1px solid #10b981; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <h2 style="margin: 0 0 16px 0; font-size: 18px; color: #065f46;">✅ ご利用について</h2>
          <ul style="margin: 0; padding-left: 20px; color: #047857;">
            <li style="margin-bottom: 8px;">動画は高品質でダウンロードいただけます</li>
            <li style="margin-bottom: 8px;">SNSでの投稿や配信にご自由にお使いください</li>
            <li style="margin-bottom: 8px;">ダウンロードリンクは30日間有効です</li>
            <li>追加のご要望がございましたらお気軽にお問い合わせください</li>
          </ul>
        </div>

        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #92400e;">📞 お問い合わせ</h3>
          <p style="margin: 0; font-size: 14px; color: #92400e;">
            ご不明な点やご感想がございましたら、このメールに返信するか、お問い合わせフォームよりご連絡ください。<br>
            今後ともどうぞよろしくお願いいたします。
          </p>
        </div>

        <div style="text-align: center; padding: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
          <p style="margin: 0;">このメールは自動送信されています。</p>
          <p style="margin: 4px 0 0 0;">注文ID: ${data.paymentIntentId}</p>
        </div>

      </body>
      </html>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log('動画完了通知メールを送信しました:', data.customerEmail);
  } catch (error) {
    console.error('動画完了通知メール送信エラー:', error);
    throw error;
  }
}