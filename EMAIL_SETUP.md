# メール送信機能の設定ガイド

このドキュメントでは、SendGridを使用した注文完了メール送信機能の設定方法について説明します。

## 必要な環境変数

以下の環境変数を `.env.local` ファイルに設定してください：

```env
# SendGrid設定
SENDGRID_API_KEY=SG.your_sendgrid_api_key_here
FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com

# 既存のStripe設定
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

## SendGridの設定手順

### 1. SendGridアカウントの作成
1. [SendGrid](https://sendgrid.com/)にアクセス
2. アカウントを作成またはログイン
3. 無料プランでも月12,000通まで送信可能

### 2. APIキーの作成
1. SendGridダッシュボードで「Settings」→「API Keys」に移動
2. 「Create API Key」をクリック
3. 名前を入力（例：kirinuki-lp-production）
4. 権限を「Full Access」または「Mail Send」に設定
5. 生成されたAPIキーをコピーして `SENDGRID_API_KEY` に設定

### 3. 送信者認証の設定
1. 「Settings」→「Sender Authentication」に移動
2. 「Single Sender Verification」または「Domain Authentication」を設定
3. 認証されたメールアドレスを `FROM_EMAIL` に設定

## メール送信の仕組み

### 送信タイミング
- Stripeの決済完了webhook（`payment_intent.succeeded`）が発火した時
- 顧客向けと管理者向けのメールが同時に送信される

### 送信されるメール

#### 1. 顧客向け注文確認メール
- **宛先**: 注文時に入力されたメールアドレス
- **件名**: 【切り抜き動画制作】ご注文を承りました
- **内容**:
  - 注文内容の詳細
  - 動画情報（サムネイル、タイトル、長さ）
  - 制作設定（フォーマット、品質オプション、切り抜き設定）
  - 支払い金額
  - 今後の流れ
  - お問い合わせ先

#### 2. 管理者向け新規注文通知メール
- **宛先**: `ADMIN_EMAIL` で設定されたメールアドレス
- **件名**: 【新規注文】{顧客名}様より切り抜き動画制作の注文
- **内容**:
  - 顧客情報
  - 注文動画の詳細（動画リンク付き）
  - 制作設定
  - 注文金額
  - 対応が必要な作業リスト

## テスト方法

### 1. 開発環境でのテスト
```bash
# 開発サーバーを起動
npm run dev

# 別のターミナルでStripe CLIを使用してwebhookをテスト
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

### 2. メール送信のテスト
1. テスト用の注文を作成
2. Stripe CLIまたはStripeダッシュボードでwebhookイベントを送信
3. コンソールログでメール送信状況を確認
4. 実際にメールが届くかを確認

## エラーハンドリング

### メール送信失敗時の動作
- メール送信に失敗してもアプリケーションは停止しない
- エラーはコンソールログに記録される
- 注文処理は正常に継続される

### よくあるエラーと対処法

#### 1. `Unauthorized` エラー
- SendGrid APIキーが正しく設定されているか確認
- APIキーの権限が適切か確認

#### 2. `Forbidden` エラー
- 送信者メールアドレスが認証されているか確認
- SendGridアカウントの状態を確認

#### 3. `Bad Request` エラー
- メールアドレスの形式が正しいか確認
- 必要な環境変数が設定されているか確認

## 本番環境での注意事項

### 1. 環境変数の設定
- 本番環境では必ず実際のAPIキーを使用
- 送信者メールアドレスは実際のドメインを使用
- 管理者メールアドレスは実際に監視されているアドレスを設定

### 2. 送信制限
- SendGridの送信制限を確認
- 必要に応じて有料プランへのアップグレードを検討

### 3. セキュリティ
- APIキーは絶対に公開しない
- 環境変数ファイルは `.gitignore` に含める

## カスタマイズ

### メールテンプレートの変更
`src/lib/email.ts` ファイルの以下の関数を編集：
- `sendCustomerOrderConfirmationEmail()`: 顧客向けメール
- `sendAdminOrderNotificationEmail()`: 管理者向けメール

### 追加の通知設定
- Slack通知の追加
- SMS通知の追加
- 複数の管理者への通知

## トラブルシューティング

### ログの確認
```bash
# 本番環境のログを確認
npm run build && npm start

# 開発環境のログを確認
npm run dev
```

### デバッグモード
環境変数 `DEBUG=true` を設定すると詳細なログが出力されます。

## サポート

メール送信機能に関する問題が発生した場合は、以下の情報を含めてお問い合わせください：
- エラーメッセージ
- 発生時刻
- 注文ID（PaymentIntent ID）
- 環境（開発/本番）