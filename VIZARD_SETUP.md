# Vizard.ai 動画生成システム セットアップガイド

このガイドでは、Vercel cron jobを使用してスプレッドシートのYouTube URLからVizard.aiで自動的に動画を生成するシステムのセットアップ方法を説明します。

## 概要

システムは以下の流れで動作します：

1. **毎日午前9時**にVercel cron jobが実行される
2. **Google Sheets**から「未着手」ステータスの注文を取得
3. **YouTube URL**を抽出してVizard.ai APIに送信
4. **動画生成**が開始され、完了時にWebhookで通知を受信
5. **結果**をスプレッドシートに記録

## 必要な環境変数

### 1. Vizard.ai API設定

```bash
# Vizard.ai APIキー
VIZARD_API_KEY=your_vizard_api_key_here

# Vizard.ai Webhook署名検証用（オプション）
VIZARD_WEBHOOK_SECRET=your_webhook_secret_here
```

### 2. Google Sheets設定（既存）

```bash
# Google Sheets スプレッドシートID
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id

# Google Sheets サービスアカウント認証
GOOGLE_SHEETS_CLIENT_EMAIL=your_service_account_email
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 3. Cron Job認証設定

```bash
# Cron Job実行時の認証用シークレット（推奨）
CRON_SECRET=your_random_secret_string

# アプリケーションのベースURL（Webhook URL生成用）
NEXTAUTH_URL=https://your-domain.vercel.app
```

## セットアップ手順

### 1. Vizard.ai APIキーの取得

1. [Vizard.ai](https://vizard.ai/)にアカウントを作成
2. APIキーを取得
3. Vercelの環境変数に`VIZARD_API_KEY`を設定

### 2. Webhook URLの設定

Vizard.aiのダッシュボードで以下のWebhook URLを設定：

```
https://your-domain.vercel.app/api/webhook/vizard
```

### 3. スプレッドシートの準備

既存のスプレッドシートに以下の列が必要です：

- **A列**: 注文日時
- **B列**: 決済ID
- **C列**: 顧客名
- **D列**: メールアドレス
- **I列**: 動画URL（複数の場合は ` | ` で区切り）
- **S列**: ステータス（「未着手」「処理中」「完了」「エラー」）
- **T列**: 備考
- **U列**: 動画生成結果

### 4. Vercelへのデプロイ

1. プロジェクトをVercelにデプロイ
2. 環境変数を設定
3. cron jobが自動的に有効になります

## Cron Jobの設定

[`vercel.json`](vercel.json)で以下のように設定されています：

```json
{
  "crons": [
    {
      "path": "/api/cron/process-videos",
      "schedule": "0 9 * * *"
    }
  ]
}
```

- **実行時間**: 毎日午前9時（UTC）
- **エンドポイント**: `/api/cron/process-videos`

### スケジュールの変更

必要に応じて`schedule`を変更できます：

- `"0 */6 * * *"` - 6時間ごと
- `"0 9,17 * * *"` - 毎日9時と17時
- `"0 9 * * 1-5"` - 平日の9時のみ

## API エンドポイント

### 1. 動画処理 Cron Job

```
GET /api/cron/process-videos
```

- スプレッドシートから処理待ちの動画を取得
- Vizard.ai APIで動画生成を開始
- 結果をスプレッドシートに記録

### 2. Vizard.ai Webhook

```
POST /api/webhook/vizard
```

- Vizard.aiからの完了通知を受信
- 動画生成結果を処理
- スプレッドシートのステータスを更新

## 手動実行

開発・テスト時は以下のURLで手動実行できます：

```bash
# 認証ありの場合
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
     https://your-domain.vercel.app/api/cron/process-videos

# 認証なしの場合
curl https://your-domain.vercel.app/api/cron/process-videos
```

## 動画生成設定

[`src/lib/vizard.ts`](src/lib/vizard.ts)でデフォルト設定を変更できます：

```typescript
export const DEFAULT_VIDEO_SETTINGS = {
  aspect_ratio: '9:16' as const, // 縦型動画
  subtitle: true,                // 字幕あり
  language: 'ja',                // 日本語
};
```

## トラブルシューティング

### 1. Cron Jobが実行されない

- Vercelの環境変数が正しく設定されているか確認
- Vercelのダッシュボードでcron jobのログを確認

### 2. Vizard.ai APIエラー

- APIキーが正しく設定されているか確認
- APIの利用制限に達していないか確認

### 3. スプレッドシートエラー

- Google Sheets APIの認証情報を確認
- スプレッドシートの権限設定を確認

### 4. Webhook通知が届かない

- Webhook URLが正しく設定されているか確認
- Vercelのログでエラーを確認

## ログの確認

Vercelのダッシュボードで以下のログを確認できます：

- Cron job実行ログ
- API エンドポイントのログ
- エラーログ

## セキュリティ

- `CRON_SECRET`を設定してcron jobへの不正アクセスを防止
- Webhook署名検証を有効にして不正な通知を防止
- 環境変数は必ずVercelの環境変数設定で管理

## サポート

問題が発生した場合は、以下を確認してください：

1. Vercelのログ
2. Google Sheetsのデータ形式
3. Vizard.ai APIの応答
4. 環境変数の設定

---

**注意**: このシステムは自動的に動画生成を行うため、Vizard.aiの利用料金が発生します。事前に料金体系を確認してください。