# ダウンロードページ設定ガイド

## 概要

このドキュメントでは、動画をまとめてダウンロードできるダウンロードページの設定方法について説明します。

## 実装された機能

### 1. ダウンロードページ
- **URL**: `/download/[paymentIntentId]`
- **機能**: 
  - 完成した動画の一覧表示
  - 個別ダウンロード
  - 複数選択での一括ダウンロード
  - 動画情報の表示（ファイルサイズ、時間、バイラルスコアなど）

### 2. APIエンドポイント
- **GET** `/api/download/[paymentIntentId]`: ダウンロードデータ取得
- **POST** `/api/download/zip`: 複数ファイルのダウンロード処理

### 3. メール通知の変更
- 動画完了通知メールのリンクを新しいダウンロードページに変更
- 注文確認メールの説明文を更新

## 必要な環境変数

```bash
# 基本設定
NEXT_PUBLIC_BASE_URL=https://your-domain.com

# Google Cloud Storage設定
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_STORAGE_BUCKET_NAME=your-bucket-name
GOOGLE_CLOUD_CREDENTIALS={"type":"service_account",...}

# Google Sheets設定
GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# SendGrid設定（メール送信用）
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@your-domain.com
ADMIN_EMAIL=admin@your-domain.com

# Vizard.ai設定
VIZARD_API_KEY=your-vizard-api-key
VIZARD_WEBHOOK_SECRET=your-webhook-secret
```

## ファイル構成

### 新規作成されたファイル

1. **`src/app/download/[paymentIntentId]/page.tsx`**
   - ダウンロードページのメインコンポーネント
   - 動画一覧表示、選択機能、ダウンロード機能

2. **`src/app/api/download/[paymentIntentId]/route.ts`**
   - 注文情報と動画ファイル情報を取得するAPI
   - Google SheetsとGoogle Cloud Storageからデータを取得

3. **`src/app/api/download/zip/route.ts`**
   - 複数ファイルのダウンロード処理API
   - 現在は個別ダウンロードの順次実行で実装

### 修正されたファイル

1. **`src/lib/email.ts`**
   - 動画完了通知メールのリンクを新しいダウンロードページに変更
   - 注文確認メールの説明文を更新

2. **`src/app/api/webhook/vizard/route.ts`**
   - Webhook処理でのメール送信時のリンクを新しいページに変更

## 使用方法

### 1. 顧客の動画ダウンロード手順

1. 動画制作完了後、顧客にメールが送信される
2. メール内の「ダウンロードページを開く」ボタンをクリック
3. `/download/[paymentIntentId]` ページが開く
4. 動画一覧から必要な動画を選択
5. 「選択した動画をダウンロード」ボタンでダウンロード開始

### 2. ダウンロードページの機能

- **全選択/全解除**: 全ての動画を一括で選択/解除
- **個別ダウンロード**: 各動画の「個別DL」ボタンで単体ダウンロード
- **一括ダウンロード**: 選択した複数動画を順次ダウンロード
- **動画情報表示**: ファイル名、サイズ、時間、バイラルスコア

### 3. エラーハンドリング

- 注文が見つからない場合: 404エラー表示
- 動画制作が未完了の場合: 制作中メッセージ表示
- ネットワークエラー: エラーメッセージとリトライ案内

## セキュリティ

- Google Cloud Storageの署名付きURL（24時間有効）を使用
- paymentIntentIdによる認証（URLを知らない限りアクセス不可）
- ダウンロードリンクの有効期限設定

## 今後の改善案

1. **ZIPダウンロード機能の実装**
   - `archiver` パッケージを追加してZIPファイル生成
   - 大容量ファイルのストリーミング処理

2. **ダウンロード履歴の記録**
   - ダウンロード日時の記録
   - ダウンロード回数の制限

3. **プレビュー機能**
   - 動画のサムネイル表示
   - 簡易プレビュー再生

4. **パスワード保護**
   - 追加のセキュリティレイヤー
   - 顧客固有のアクセスコード

## トラブルシューティング

### よくある問題

1. **「動画ファイルが見つかりません」エラー**
   - Google Cloud Storageの設定を確認
   - バケット名とプロジェクトIDが正しいか確認

2. **「注文が見つかりません」エラー**
   - Google Sheetsの設定を確認
   - paymentIntentIdが正しいか確認

3. **ダウンロードが開始されない**
   - ブラウザのポップアップブロック設定を確認
   - 署名付きURLの有効期限を確認

### ログの確認

```bash
# サーバーログの確認
npm run dev

# 主要なログメッセージ
- "📥 ダウンロードデータ取得リクエスト"
- "✅ 注文情報を取得しました"
- "📹 X個の動画ファイルを取得しました"
```

## デプロイ時の注意事項

1. **環境変数の設定**
   - 本番環境で `NEXT_PUBLIC_BASE_URL` を正しく設定
   - Google Cloud認証情報の安全な管理

2. **Google Cloud Storage**
   - バケットのCORS設定
   - 適切なIAM権限の設定

3. **メール送信**
   - SendGridの送信制限確認
   - メールテンプレートのテスト

## サポート

問題が発生した場合は、以下の情報を含めてサポートにお問い合わせください：

- エラーメッセージ
- paymentIntentId
- ブラウザとバージョン
- 実行した操作の詳細