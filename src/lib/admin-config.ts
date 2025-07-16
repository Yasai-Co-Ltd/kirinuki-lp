// 管理者用設定ファイル
// このファイルで価格や受付状況を簡単に管理できます

export const ADMIN_CONFIG = {
  // 価格設定（人の目で確認プラン）
  pricing: {
    humanReviewSurcharge: 80, // 1分あたりの追加料金（円）
    displayPrice: 180, // 表示価格（基本料金100円 + 追加料金80円）
  },
  
  // 動画制限設定
  videoLimits: {
    minDurationSeconds: 600, // 最小動画長（秒）- 10分
    minDurationMinutes: 10, // 最小動画長（分）- 表示用
    durationErrorMessage: "動画の長さが10分未満です。10分以上の動画をご利用ください。", // エラーメッセージ
  },
  
  // 受付状況管理
  orderStatus: {
    isAcceptingOrders: true, // true: 受付中, false: 受付停止
    stopMessage: "現在、注文の受付を一時的に停止しております。再開まで今しばらくお待ちください。", // 受付停止時のメッセージ
    
    // プラン別受付状況
    planStatus: {
      aiOnly: true, // AIのみプランの受付状況
      humanReview: true, // 人の目で確認プランの受付状況
      humanReviewStopMessage: "現在、「人の目で確認」プランの受付を一時的に停止しております。AIのみプランはご利用いただけます。", // 人の目で確認プラン停止時のメッセージ
    }
  },
  
  // 表示設定
  display: {
    showPriceInTitle: true, // タイトルに価格を表示するか
    highlightHumanReview: true, // 人の目で確認プランを強調表示するか
  }
};

// 価格を更新する関数（開発時に使用）
export function updateHumanReviewPrice(newSurcharge: number) {
  console.log(`価格を更新: ${ADMIN_CONFIG.pricing.humanReviewSurcharge}円 → ${newSurcharge}円`);
  // 実際の更新は手動でADMIN_CONFIGを編集してください
}

// 受付状況を切り替える関数（開発時に使用）
export function toggleOrderAcceptance() {
  console.log(`受付状況を切り替え: ${ADMIN_CONFIG.orderStatus.isAcceptingOrders ? '受付中' : '停止中'} → ${!ADMIN_CONFIG.orderStatus.isAcceptingOrders ? '受付中' : '停止中'}`);
  // 実際の切り替えは手動でADMIN_CONFIGを編集してください
}

// 現在の設定を確認する関数
export function getCurrentConfig() {
  return {
    humanReviewPrice: ADMIN_CONFIG.pricing.displayPrice,
    isAcceptingOrders: ADMIN_CONFIG.orderStatus.isAcceptingOrders,
    stopMessage: ADMIN_CONFIG.orderStatus.stopMessage,
    planStatus: ADMIN_CONFIG.orderStatus.planStatus
  };
}

// プラン別の受付状況を確認する関数
export function isPlanAvailable(plan: 'ai_only' | 'human_review'): boolean {
  // 全体が停止している場合は両方とも停止
  if (!ADMIN_CONFIG.orderStatus.isAcceptingOrders) {
    return false;
  }
  
  // プラン別の状況を確認
  if (plan === 'ai_only') {
    return ADMIN_CONFIG.orderStatus.planStatus.aiOnly;
  } else {
    return ADMIN_CONFIG.orderStatus.planStatus.humanReview;
  }
}