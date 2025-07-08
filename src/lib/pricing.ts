import { OrderEstimate } from '@/types/order';

// 料金設定
const PRICING_CONFIG = {
  basePricePerMinute: 100, // 基本料金: 1分あたり100円
  qualityOptions: {
    ai_only: 0,      // AIのみ: 追加料金なし
    human_review: 80, // 人の目で確認: 1分あたり80円追加
  },
  minimumCharge: 1000, // 最低料金
  maxFreeMinutes: 5,   // 5分以下は最低料金
};

export function calculateEstimate(
  durationSeconds: number | number[],
  format: 'default' | 'separate' | 'zoom',
  qualityOption: 'ai_only' | 'human_review' = 'ai_only'
): OrderEstimate {
  // 複数動画対応
  const durations = Array.isArray(durationSeconds) ? durationSeconds : [durationSeconds];
  const videoCount = durations.length;
  
  // 各動画の分数を計算
  const durationMinutesArray = durations.map(seconds => Math.ceil(seconds / 60));
  const totalVideoDurationMinutes = durationMinutesArray.reduce((sum, minutes) => sum + minutes, 0);
  
  // 料金計算（各動画に最低料金を適用）
  const basePricePerMinute = PRICING_CONFIG.basePricePerMinute;
  const qualitySurcharge = PRICING_CONFIG.qualityOptions[qualityOption];
  const totalPricePerMinute = basePricePerMinute + qualitySurcharge;
  
  // 各動画ごとに最低料金を適用してから合計
  const totalPrice = durationMinutesArray.reduce((sum, minutes) => {
    const effectiveMinutes = Math.max(minutes, PRICING_CONFIG.maxFreeMinutes);
    const videoPrice = Math.max(effectiveMinutes * totalPricePerMinute, PRICING_CONFIG.minimumCharge);
    return sum + videoPrice;
  }, 0);
  
  // 納期計算（品質オプションと動画数に応じて調整）
  const baseDays = 2;
  const qualityDays = qualityOption === 'human_review' ? 1 : 0;
  const complexityDays = totalVideoDurationMinutes > 30 ? 1 : 0;
  const volumeDays = videoCount > 3 ? Math.ceil(videoCount / 3) - 1 : 0; // 3本を超える場合は追加日数
  const estimatedDeliveryDays = baseDays + qualityDays + complexityDays + volumeDays;

  return {
    basePricePerMinute: totalPricePerMinute,
    subtitleSurcharge: 0,
    videoDurationMinutes: totalVideoDurationMinutes, // 後方互換性のため
    totalVideoDurationMinutes,
    totalPrice,
    estimatedDeliveryDays,
    qualityOption,
    videoCount
  };
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY'
  }).format(price);
}

export function getPricingBreakdown(
  estimate: OrderEstimate,
  format: 'default' | 'separate' | 'zoom',
  qualityOption: 'ai_only' | 'human_review' = 'ai_only'
) {
  const totalMinutes = estimate.totalVideoDurationMinutes;
  const videoCount = estimate.videoCount;
  
  const qualityLabels = {
    ai_only: 'AIのみ',
    human_review: '人の目で確認'
  };
  
  const breakdown: Array<{label: string; amount: number; isTotal?: boolean}> = [];
  
  // 動画数と総分数を表示
  if (videoCount > 1) {
    breakdown.push({
      label: `動画制作料金 (${videoCount}本・合計${totalMinutes}分)`,
      amount: estimate.totalPrice - (estimate.totalPrice - Math.floor(estimate.totalPrice / estimate.basePricePerMinute) * estimate.basePricePerMinute)
    });
  } else {
    const effectiveMinutes = Math.max(totalMinutes, PRICING_CONFIG.maxFreeMinutes);
    const baseAmount = effectiveMinutes * PRICING_CONFIG.basePricePerMinute;
    breakdown.push({
      label: `基本料金 (${effectiveMinutes}分)`,
      amount: baseAmount
    });
  }
  
  // 品質オプション料金
  if (qualityOption === 'human_review') {
    const qualitySurcharge = totalMinutes * PRICING_CONFIG.qualityOptions[qualityOption] * videoCount;
    if (qualitySurcharge > 0) {
      breakdown.push({
        label: `${qualityLabels[qualityOption]}オプション`,
        amount: qualitySurcharge
      });
    }
  }
  
  breakdown.push({
    label: '合計',
    amount: estimate.totalPrice,
    isTotal: true
  });
  
  return {
    baseAmount: estimate.totalPrice,
    qualitySurcharge: qualityOption === 'human_review' ? totalMinutes * PRICING_CONFIG.qualityOptions[qualityOption] * videoCount : 0,
    totalAmount: estimate.totalPrice,
    breakdown
  };
}