# Kirinuki LP - Next.js 15 App Router

このプロジェクトは、Next.js 15のApp Routerを使用したランディングページです。

## ディレクトリ構成

```
src/
├── app/                    # App Router のページファイル
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx           # ホームページ
│   ├── contact/           # お問い合わせページ
│   ├── form/              # フォームページ
│   ├── confirm/           # 確認ページ
│   └── finish/            # 完了ページ
├── components/            # コンポーネント
│   ├── layout/           # レイアウト関連コンポーネント
│   │   ├── Layout.tsx
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── ui/               # 再利用可能なUIコンポーネント
│   │   └── Button.tsx
│   └── features/         # 機能別コンポーネント
│       └── ContactForm.tsx
├── hooks/                # カスタムフック
│   ├── useMainScript.ts
│   └── useInView.ts
├── lib/                  # ユーティリティ関数
│   └── utils.ts
├── types/                # TypeScript型定義
│   └── index.ts
└── styles/               # スタイルファイル
    ├── globals.css
    ├── style.css
    └── inview.css
```

## 技術スタック

- **Next.js 15**: React フレームワーク（App Router使用）
- **TypeScript**: 型安全性の確保
- **React 18**: UIライブラリ
- **Stripe**: 決済処理
- **SendGrid**: メール送信
- **CSS**: スタイリング

## 開発環境のセットアップ

1. 依存関係のインストール:
```bash
npm install
```

2. 開発サーバーの起動:
```bash
npm run dev
```

3. ブラウザで http://localhost:3000 を開く

## ビルド

```bash
npm run build
```

## 主な機能

- レスポンシブデザイン
- スムーススクロール
- パララックス効果
- InView アニメーション
- お問い合わせフォーム
- ハンバーガーメニュー
- ローディングアニメーション
- **切り抜き動画注文システム**
  - 複数動画対応の注文フォーム
  - Stripe決済統合
  - 注文完了時の自動メール送信（顧客・管理者）
  - 管理者パネル

## ディレクトリ構成の特徴

### App Router
Next.js 15のApp Routerを採用し、ファイルベースルーティングを活用しています。

### コンポーネント分離
- `layout/`: ページ全体のレイアウトに関するコンポーネント
- `ui/`: 再利用可能な汎用UIコンポーネント
- `features/`: 特定の機能に特化したコンポーネント

### 型安全性
TypeScriptを使用し、`types/`ディレクトリで型定義を管理しています。

### ユーティリティ
`lib/`ディレクトリに共通のユーティリティ関数を配置し、コードの再利用性を高めています。

## カスタムフック

- `useMainScript`: メニュー、スクロール、パララックスなどの主要機能
- `useInView`: Intersection Observer を使用したアニメーション効果

## スタイリング

- CSS Modules や Tailwind CSS ではなく、従来のCSSファイルを使用
- `globals.css`で他のCSSファイルをインポート
- レスポンシブデザインに対応

## メール送信機能

注文完了時に顧客と管理者に自動でメールが送信されます。

### 設定方法
詳細な設定方法は [`EMAIL_SETUP.md`](./EMAIL_SETUP.md) を参照してください。

### 必要な環境変数
```env
# SendGrid設定
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com

# Stripe設定
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### 送信されるメール
1. **顧客向け注文確認メール**: 注文内容、制作設定、今後の流れ
2. **管理者向け新規注文通知メール**: 顧客情報、注文詳細、対応が必要な作業

## 注意事項

- このプロジェクトは静的エクスポート（`output: 'export'`）に対応しています
- 画像の最適化は無効化されています（`unoptimized: true`）
- トレイリングスラッシュが有効になっています
- メール送信機能を使用する場合は、SendGridとStripeの設定が必要です