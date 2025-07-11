import { OrderEstimate } from '@/types/order';
import { ADMIN_CONFIG } from './admin-config';

// 料金設定
const PRICING_CONFIG = {
  basePricePerMinute: 100, // 基本料金: 1分あたり100円
  qualityOptions: {
    ai_only: 0,      // AIのみ: 追加料金なし
    human_review: ADMIN_CONFIG.pricing.humanReviewSurcharge, // 人の目で確認: 管理設定から取得
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

// 1本あたりの価格計算（1時間動画から20-30本の切り抜きが作成される前提）
export function calculatePricePerClip(
  durationMinutes: number = 60, // デフォルト1時間
  qualityOption: 'ai_only' | 'human_review' = 'ai_only',
  estimatedClips: { min: number; max: number } = { min: 20, max: 30 }
): {
  totalPrice: number;
  pricePerClipMin: number;
  pricePerClipMax: number;
  averagePricePerClip: number;
  estimatedClips: { min: number; max: number };
} {
  const basePricePerMinute = PRICING_CONFIG.basePricePerMinute;
  const qualitySurcharge = PRICING_CONFIG.qualityOptions[qualityOption];
  const totalPricePerMinute = basePricePerMinute + qualitySurcharge;
  
  // 1時間動画の総額を計算
  const totalPrice = Math.max(durationMinutes * totalPricePerMinute, PRICING_CONFIG.minimumCharge);
  
  // 1本あたりの価格を計算
  const pricePerClipMax = Math.floor(totalPrice / estimatedClips.min); // 最小本数で割る = 最高価格
  const pricePerClipMin = Math.floor(totalPrice / estimatedClips.max); // 最大本数で割る = 最低価格
  const averagePricePerClip = Math.floor(totalPrice / ((estimatedClips.min + estimatedClips.max) / 2));
  
  return {
    totalPrice,
    pricePerClipMin,
    pricePerClipMax,
    averagePricePerClip,
    estimatedClips
  };
}

// 1本あたりの価格表示用のテキストを生成
export function generatePricePerClipText(
  durationMinutes: number = 60,
  qualityOption: 'ai_only' | 'human_review' = 'ai_only'
): string {
  const calculation = calculatePricePerClip(durationMinutes, qualityOption);
  
  if (calculation.pricePerClipMin === calculation.pricePerClipMax) {
    return `1本あたり約${formatPrice(calculation.averagePricePerClip)}`;
  } else {
    return `1本あたり${formatPrice(calculation.pricePerClipMin)}〜${formatPrice(calculation.pricePerClipMax)}`;
  }
}