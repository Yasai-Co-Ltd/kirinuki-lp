# 管理者ガイド - 価格設定と受付停止機能

このガイドでは、180円プランの価格確認と受付停止機能の使い方を説明します。

## 🎯 実装された機能

### 1. 価格設定の一元管理
- 「人の目で確認」プランの価格を一箇所で管理
- サイト全体の価格表示が自動的に更新される

### 2. 受付停止機能
- 簡単なフラグで注文受付を一時停止
- カスタマイズ可能な停止メッセージ

### 3. 管理パネル
- 現在の設定を視覚的に確認
- 設定変更方法の案内

## 📁 関連ファイル

### `src/lib/admin-config.ts` - メイン設定ファイル
```typescript
export const ADMIN_CONFIG = {
  // 価格設定
  pricing: {
    humanReviewSurcharge: 80, // 追加料金（円/分）
    displayPrice: 180, // 表示価格（基本100円 + 追加80円）
  },
  
  // 受付状況管理
  orderStatus: {
    isAcceptingOrders: true, // 全体の受付状況
    stopMessage: "現在、注文の受付を一時的に停止しております。", // 全体停止時のメッセージ
    
    // プラン別受付状況
    planStatus: {
      aiOnly: true, // AIのみプランの受付状況
      humanReview: true, // 人の目で確認プランの受付状況
      humanReviewStopMessage: "現在、「人の目で確認」プランの受付を一時的に停止しております。AIのみプランはご利用いただけます。",
    }
  },
};
```

## 🔧 設定変更方法

### 価格を変更する場合

1. `src/lib/admin-config.ts` を開く
2. `pricing.humanReviewSurcharge` の値を変更
3. `pricing.displayPrice` も合わせて更新（基本料金100円 + 追加料金）

**例：200円/分に変更する場合**
```typescript
pricing: {
  humanReviewSurcharge: 100, // 80 → 100に変更
  displayPrice: 200, // 180 → 200に変更
},
```

### 全体の受付を停止する場合

1. `src/lib/admin-config.ts` を開く
2. `orderStatus.isAcceptingOrders` を `false` に変更
3. 必要に応じて `stopMessage` を編集

```typescript
orderStatus: {
  isAcceptingOrders: false, // true → false に変更
  stopMessage: "システムメンテナンスのため、一時的に受付を停止しています。", // メッセージ変更
},
```

### 「人の目で確認」プランのみ停止する場合

1. `src/lib/admin-config.ts` を開く
2. `orderStatus.planStatus.humanReview` を `false` に変更
3. 必要に応じて `humanReviewStopMessage` を編集

```typescript
orderStatus: {
  isAcceptingOrders: true, // 全体は受付中のまま
  planStatus: {
    aiOnly: true, // AIのみプランは受付中
    humanReview: false, // 人の目で確認プランのみ停止
    humanReviewStopMessage: "品質チェック体制の見直しのため、一時的に受付を停止しています。",
  }
},
```

### 受付を再開する場合

```typescript
// 全体再開
orderStatus: {
  isAcceptingOrders: true, // false → true に変更
},

// 人の目で確認プランのみ再開
orderStatus: {
  planStatus: {
    humanReview: true, // false → true に変更
  }
},
```

## 🖥️ 管理パネルの使い方

### アクセス方法
1. メインページ（`/`）を開く
2. 右下の歯車アイコンをクリック

### 機能
- **現在の価格設定**: リアルタイムで価格を確認
- **受付状況**: 現在の受付状況を確認
- **設定変更方法**: 変更手順の案内
- **コンソール出力**: 現在の設定をコンソールに出力

## 📍 価格が反映される箇所

設定変更により、以下の箇所が自動的に更新されます：

1. **メインページの料金表**
   - テーブルヘッダーの価格表示
   - 料金行の価格表示

2. **料金例セクション**
   - 30分動画の料金例
   - 1時間動画の料金例

3. **FAQセクション**
   - 料金説明の価格表示

4. **注文フォーム**
   - 見積もり計算
   - 確認画面の料金表示

## ⚠️ 注意事項

### セキュリティ
- 本番環境では管理パネルに適切な認証を追加してください
- 管理設定ファイルへのアクセスを制限してください

### 変更後の確認
1. 設定変更後はページをリロード
2. 各価格表示箇所を確認
3. 注文フローをテスト

### バックアップ
- 設定変更前に現在の設定をバックアップ
- 重要な変更前はGitでコミット

## 🚀 使用例

### 例1: 価格を160円に変更
```typescript
// src/lib/admin-config.ts
pricing: {
  humanReviewSurcharge: 60, // 80 → 60
  displayPrice: 160, // 180 → 160
},
```

### 例2: メンテナンスで受付停止
```typescript
// src/lib/admin-config.ts
orderStatus: {
  isAcceptingOrders: false,
  stopMessage: "システムメンテナンスのため、12/25 10:00まで受付を停止しています。",
},
```

### 例3: 年末年始の受付停止
```typescript
// src/lib/admin-config.ts
orderStatus: {
  isAcceptingOrders: false,
  stopMessage: "年末年始休業のため、1/4より順次対応いたします。ご迷惑をおかけいたします。",
},
```

### 例4: 人の目で確認プランのみ停止（品質チェック体制見直し）
```typescript
// src/lib/admin-config.ts
orderStatus: {
  isAcceptingOrders: true, // 全体は受付中
  planStatus: {
    aiOnly: true, // AIのみプランは通常通り
    humanReview: false, // 人の目で確認プランのみ停止
    humanReviewStopMessage: "品質チェック体制の見直しのため、「人の目で確認」プランを一時停止しています。AIのみプランは通常通りご利用いただけます。",
  }
},
```

### 例5: 人の目で確認プランのみ停止（スタッフ不足）
```typescript
// src/lib/admin-config.ts
orderStatus: {
  isAcceptingOrders: true,
  planStatus: {
    aiOnly: true,
    humanReview: false,
    humanReviewStopMessage: "チェックスタッフの体調不良により、「人の目で確認」プランを一時停止しています。復旧まで今しばらくお待ちください。",
  }
},
```

## 📞 サポート

設定変更で問題が発生した場合：
1. 管理パネルで現在の設定を確認
2. コンソールで設定値を確認
3. 必要に応じて設定を元に戻す

---

このシステムにより、価格変更や受付停止を簡単かつ安全に管理できます。