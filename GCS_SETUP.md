# Google Cloud Storage セットアップガイド

このガイドでは、切り抜き動画制作システムでGoogle Cloud Storageを使用するための設定方法を説明します。

## 前提条件

- Google Cloud Platformアカウント
- Google Cloud Storageが有効化されたプロジェクト
- 適切な権限を持つサービスアカウント

## 1. Google Cloud Storageバケットの作成

1. Google Cloud Consoleにログイン
2. Cloud Storageページに移動
3. 「バケットを作成」をクリック
4. バケット名を設定（例: `kirinuki-videos-storage`）
5. リージョンを選択（推奨: `asia-northeast1` - 東京）
6. ストレージクラスを選択（推奨: `Standard`）
7. アクセス制御を「均一」に設定
8. 「作成」をクリック

## 2. サービスアカウントの作成

1. Google Cloud Consoleで「IAMと管理」→「サービスアカウント」に移動
2. 「サービスアカウントを作成」をクリック
3. サービスアカウント名を入力（例: `kirinuki-storage-service`）
4. 以下の役割を付与：
   - `Storage Object Admin`（ストレージオブジェクトの読み書き）
   - `Storage Legacy Bucket Reader`（バケット情報の読み取り）

## 3. サービスアカウントキーの生成

1. 作成したサービスアカウントをクリック
2. 「キー」タブに移動
3. 「キーを追加」→「新しいキーを作成」
4. 形式を「JSON」に選択
5. 「作成」をクリックしてキーファイルをダウンロード

## 4. 環境変数の設定

`.env.local`ファイルに以下の環境変数を追加：

```env
# Google Cloud Storage設定
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_STORAGE_BUCKET_NAME=your-bucket-name

# 認証方法1: サービスアカウントキーファイルを使用
GOOGLE_CLOUD_KEY_FILE=/path/to/your/service-account-key.json

# 認証方法2: 環境変数で直接認証情報を設定（本番環境推奨）
# GOOGLE_CLOUD_CREDENTIALS={"type":"service_account","project_id":"..."}
```

### 環境変数の説明

- `GOOGLE_CLOUD_PROJECT_ID`: Google CloudプロジェクトのID
- `GOOGLE_CLOUD_STORAGE_BUCKET_NAME`: 作成したバケット名
- `GOOGLE_CLOUD_KEY_FILE`: サービスアカウントキーファイルのパス
- `GOOGLE_CLOUD_CREDENTIALS`: サービスアカウントキーのJSON文字列（本番環境用）

## 5. 本番環境での設定

### Vercelでの設定例

1. Vercelダッシュボードでプロジェクトを選択
2. 「Settings」→「Environment Variables」に移動
3. 以下の環境変数を追加：

```
GOOGLE_CLOUD_PROJECT_ID = your-project-id
GOOGLE_CLOUD_STORAGE_BUCKET_NAME = your-bucket-name
GOOGLE_CLOUD_CREDENTIALS = {"type":"service_account","project_id":"..."}
```

**注意**: `GOOGLE_CLOUD_CREDENTIALS`には、ダウンロードしたJSONキーファイルの内容をそのまま文字列として設定します。

## 6. 動作確認

システムが正常に動作するか確認するには：

1. 動画生成が完了したときのWebhook通知を確認
2. Google Cloud Storageバケットに動画ファイルが保存されているか確認
3. 顧客にメール通知が送信されているか確認

## 7. セキュリティ考慮事項

- サービスアカウントキーファイルは安全に保管し、バージョン管理システムにコミットしない
- 本番環境では環境変数を使用してキー情報を設定
- 定期的にサービスアカウントキーをローテーション
- バケットのアクセス権限を最小限に設定

## 8. コスト最適化

- 古い動画ファイルの自動削除ポリシーを設定
- 適切なストレージクラスを選択
- 不要なファイルの定期的な削除

## トラブルシューティング

### よくあるエラー

1. **認証エラー**: サービスアカウントの権限とキーファイルを確認
2. **バケットアクセスエラー**: バケット名と権限設定を確認
3. **アップロードエラー**: ファイルサイズ制限とネットワーク接続を確認

### ログの確認

システムログで以下のメッセージを確認：
- `✅ 動画をGoogle Cloud Storageに保存しました`
- `❌ Google Cloud Storage保存エラー`

## 参考リンク

- [Google Cloud Storage ドキュメント](https://cloud.google.com/storage/docs)
- [Node.js用Google Cloud Storageクライアント](https://googleapis.dev/nodejs/storage/latest/)
- [サービスアカウントの管理](https://cloud.google.com/iam/docs/service-accounts)