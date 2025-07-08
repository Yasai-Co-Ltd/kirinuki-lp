import { OrderEstimate } from '@/types/order';

// 料金設定
const PRICING_CONFIG = {
  basePricePerMinute: 100, // 基本料金: 1分あたり100円
  qualityOptions: {
    ai_only: 0,      // AIのみ: 追加料金なし
    human_review: 50, // 人の目で確認: 1分あたり50円追加
  },
  minimumCharge: 1000, // 最低料金
  maxFreeMinutes: 5,   // 5分以下は最低料金
};

export function calculateEstimate(
  durationSeconds: number,
  format: 'default' | 'separate' | 'zoom',
  qualityOption: 'ai_only' | 'human_review' = 'ai_only'
): OrderEstimate {
  const durationMinutes = Math.ceil(durationSeconds / 60);
  
  // 料金計算
  const effectiveMinutes = Math.max(durationMinutes, PRICING_CONFIG.maxFreeMinutes);
  const basePricePerMinute = PRICING_CONFIG.basePricePerMinute;
  const qualitySurcharge = PRICING_CONFIG.qualityOptions[qualityOption];
  
  const totalPricePerMinute = basePricePerMinute + qualitySurcharge;
  const totalPrice = Math.max(effectiveMinutes * totalPricePerMinute, PRICING_CONFIG.minimumCharge);
  
  // 納期計算（品質オプションに応じて調整）
  const baseDays = 2;
  const qualityDays = qualityOption === 'human_review' ? 1 : 0; // 人の確認が入る場合は1日追加
  const complexityDays = durationMinutes > 30 ? 1 : 0; // 30分以上の場合は追加日数
  const estimatedDeliveryDays = baseDays + qualityDays + complexityDays;

  return {
    basePricePerMinute: totalPricePerMinute,
    subtitleSurcharge: 0, // 新しいフォーマットでは字幕追加料金は廃止
    videoDurationMinutes: durationMinutes,
    totalPrice,
    estimatedDeliveryDays,
    qualityOption
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
  const durationMinutes = estimate.videoDurationMinutes;
  const effectiveMinutes = Math.max(durationMinutes, PRICING_CONFIG.maxFreeMinutes);
  
  const baseAmount = effectiveMinutes * PRICING_CONFIG.basePricePerMinute;
  const qualitySurcharge = effectiveMinutes * PRICING_CONFIG.qualityOptions[qualityOption];
  
  const qualityLabels = {
    ai_only: 'AIのみ',
    human_review: '人の目で確認'
  };
  
  const breakdown: Array<{label: string; amount: number; isTotal?: boolean}> = [
    {
      label: `基本料金 (${effectiveMinutes}分)`,
      amount: baseAmount
    }
  ];
  
  if (qualitySurcharge > 0) {
    breakdown.push({
      label: `${qualityLabels[qualityOption]}オプション`,
      amount: qualitySurcharge
    });
  }
  
  breakdown.push({
    label: '合計',
    amount: estimate.totalPrice,
    isTotal: true
  });
  
  return {
    baseAmount,
    qualitySurcharge,
    totalAmount: estimate.totalPrice,
    breakdown
  };
}