# 切り抜き動画発注機能 セットアップガイド

## 概要
このプロジェクトに切り抜き動画の発注機能が追加されました。ユーザーはYouTube動画のURLを入力し、オンラインで決済して切り抜き動画を注文できます。

## 機能
- YouTube動画URL入力と動画情報自動取得
- 字幕有無の選択
- 動画の長さに基づく自動見積もり
- Stripeによるクレジットカード決済
- 決済完了後の自動メール送信（設定次第）

## 必要な設定

### 1. 環境変数の設定
`.env.local`ファイルに以下の値を設定してください：

```env
# Stripe設定（必須）
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
STRIPE_SECRET_KEY=sk_test_your_actual_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_actual_webhook_secret_here

# YouTube API設定（必須）
YOUTUBE_API_KEY=your_actual_youtube_api_key_here

# メール設定（オプション）
SENDGRID_API_KEY=your_sendgrid_api_key_here
FROM_EMAIL=your_email@example.com

# アプリケーション設定
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 2. Stripeの設定

#### 2.1 Stripeアカウントの作成
1. [Stripe](https://stripe.com)でアカウントを作成
2. ダッシュボードから「開発者」→「APIキー」でキーを取得
3. テスト環境用のキーを`.env.local`に設定

#### 2.2 Webhookの設定
1. Stripeダッシュボードで「開発者」→「Webhook」
2. 新しいエンドポイントを追加：`https://yourdomain.com/api/webhook/stripe`
3. イベント`payment_intent.succeeded`を選択
4. Webhook署名シークレットを`.env.local`に設定

### 3. YouTube Data API v3の設定

#### 3.1 Google Cloud Consoleでの設定
1. [Google Cloud Console](https://console.cloud.google.com/)でプロジェクトを作成
2. YouTube Data API v3を有効化
3. 認証情報でAPIキーを作成
4. APIキーを`.env.local`に設定

#### 3.2 APIキーの制限設定（推奨）
- HTTPリファラーでドメインを制限
- APIでYouTube Data API v3のみを許可

### 4. メール送信の設定（オプション）

#### 4.1 SendGridを使用する場合
1. [SendGrid](https://sendgrid.com)でアカウントを作成
2. APIキーを生成
3. 送信者メールアドレスを認証
4. 設定を`.env.local`に追加

#### 4.2 他のメールサービスを使用する場合
`src/app/api/webhook/stripe/route.ts`の`sendOrderConfirmationEmail`関数を修正してください。

## 料金設定のカスタマイズ

`src/lib/pricing.ts`で料金設定を変更できます：

```typescript
const PRICING_CONFIG = {
  basePricePerMinute: 500, // 1分あたりの基本料金
  subtitleSurcharge: 200,  // 字幕追加料金（1分あたり）
  minimumCharge: 3000,     // 最低料金
  maxFreeMinutes: 10,      // 最低料金が適用される分数
};
```

## 開発環境での起動

```bash
npm install
npm run dev
```

## 本番環境への対応

### 1. 環境変数の更新
- Stripeの本番環境キーに変更
- `NEXT_PUBLIC_BASE_URL`を本番ドメインに変更

### 2. Webhookエンドポイントの更新
- Stripeダッシュボードで本番環境のWebhookエンドポイントを設定

### 3. セキュリティ対策
- APIキーの適切な制限設定
- CORS設定の確認
- レート制限の実装（必要に応じて）

## 注文の流れ

1. **注文フォーム入力**
   - YouTube動画URL
   - フォーマット選択（字幕有無）
   - 顧客情報

2. **動画情報取得**
   - YouTube APIで動画情報を自動取得
   - 動画の長さから見積もりを計算

3. **決済処理**
   - Stripeで安全にクレジットカード決済
   - 決済完了後にWebhookで通知

4. **注文完了**
   - 顧客にメール送信（設定済みの場合）
   - 管理者に注文通知

## トラブルシューティング

### よくある問題

1. **YouTube動画が取得できない**
   - APIキーが正しく設定されているか確認
   - 動画が公開されているか確認
   - API制限に達していないか確認

2. **決済が完了しない**
   - Stripeキーが正しく設定されているか確認
   - テスト用カード番号を使用しているか確認（開発環境）

3. **Webhookが動作しない**
   - Webhook URLが正しく設定されているか確認
   - Webhook署名シークレットが正しいか確認

## サポート

設定や使用方法でご不明な点がございましたら、開発チームまでお問い合わせください。