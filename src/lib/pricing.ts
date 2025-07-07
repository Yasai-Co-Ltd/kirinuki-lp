import { OrderEstimate } from '@/types/order';

// 料金設定
const PRICING_CONFIG = {
  basePricePerMinute: 500, // 1分あたり500円
  subtitleSurcharge: 200, // 字幕ありの場合の追加料金（1分あたり）
  minimumCharge: 3000, // 最低料金
  maxFreeMinutes: 10, // 10分以下は最低料金
};

export function calculateEstimate(
  durationSeconds: number,
  withSubtitles: boolean
): OrderEstimate {
  const durationMinutes = Math.ceil(durationSeconds / 60);
  
  // 基本料金計算
  const effectiveMinutes = Math.max(durationMinutes, PRICING_CONFIG.maxFreeMinutes);
  const basePrice = effectiveMinutes * PRICING_CONFIG.basePricePerMinute;
  
  // 字幕追加料金
  const subtitlePrice = withSubtitles ? effectiveMinutes * PRICING_CONFIG.subtitleSurcharge : 0;
  
  // 合計金額（最低料金を適用）
  const totalPrice = Math.max(basePrice + subtitlePrice, PRICING_CONFIG.minimumCharge);
  
  // 納期計算（基本3-5営業日、字幕ありの場合は+2日）
  const baseDays = 3;
  const subtitleDays = withSubtitles ? 2 : 0;
  const complexityDays = durationMinutes > 30 ? 2 : 0; // 30分以上の場合は追加日数
  const estimatedDeliveryDays = baseDays + subtitleDays + complexityDays;

  return {
    basePricePerMinute: PRICING_CONFIG.basePricePerMinute,
    subtitleSurcharge: PRICING_CONFIG.subtitleSurcharge,
    videoDurationMinutes: durationMinutes,
    totalPrice,
    estimatedDeliveryDays
  };
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY'
  }).format(price);
}

export function getPricingBreakdown(estimate: OrderEstimate, withSubtitles: boolean) {
  const baseAmount = estimate.videoDurationMinutes * estimate.basePricePerMinute;
  const subtitleAmount = withSubtitles ? estimate.videoDurationMinutes * estimate.subtitleSurcharge : 0;
  
  return {
    baseAmount,
    subtitleAmount,
    totalAmount: estimate.totalPrice,
    breakdown: [
      {
        label: `基本料金 (${estimate.videoDurationMinutes}分)`,
        amount: baseAmount
      },
      ...(withSubtitles ? [{
        label: `字幕追加料金 (${estimate.videoDurationMinutes}分)`,
        amount: subtitleAmount
      }] : []),
      {
        label: '合計',
        amount: estimate.totalPrice,
        isTotal: true
      }
    ]
  };
}