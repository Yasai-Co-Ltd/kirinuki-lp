import { OrderEstimate } from '@/types/order';

// 料金設定
const PRICING_CONFIG = {
  formatPrices: {
    default: 500,   // デフォルト: 1分あたり500円
    separate: 600,  // 2分割: 1分あたり600円
    zoom: 700,      // ズーム: 1分あたり700円
  },
  minimumCharge: 3000, // 最低料金
  maxFreeMinutes: 10, // 10分以下は最低料金
};

export function calculateEstimate(
  durationSeconds: number,
  format: 'default' | 'separate' | 'zoom'
): OrderEstimate {
  const durationMinutes = Math.ceil(durationSeconds / 60);
  
  // フォーマットに応じた料金計算
  const effectiveMinutes = Math.max(durationMinutes, PRICING_CONFIG.maxFreeMinutes);
  const pricePerMinute = PRICING_CONFIG.formatPrices[format];
  const totalPrice = Math.max(effectiveMinutes * pricePerMinute, PRICING_CONFIG.minimumCharge);
  
  // 納期計算（フォーマットの複雑さに応じて調整）
  const baseDays = 3;
  const formatDays = format === 'zoom' ? 2 : format === 'separate' ? 1 : 0;
  const complexityDays = durationMinutes > 30 ? 2 : 0; // 30分以上の場合は追加日数
  const estimatedDeliveryDays = baseDays + formatDays + complexityDays;

  return {
    basePricePerMinute: pricePerMinute,
    subtitleSurcharge: 0, // 新しいフォーマットでは字幕追加料金は廃止
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

export function getPricingBreakdown(estimate: OrderEstimate, format: 'default' | 'separate' | 'zoom') {
  const baseAmount = estimate.videoDurationMinutes * estimate.basePricePerMinute;
  
  const formatLabels = {
    default: 'デフォルト',
    separate: '2分割',
    zoom: 'ズーム'
  };
  
  return {
    baseAmount,
    subtitleAmount: 0,
    totalAmount: estimate.totalPrice,
    breakdown: [
      {
        label: `${formatLabels[format]}フォーマット (${estimate.videoDurationMinutes}分)`,
        amount: baseAmount
      },
      {
        label: '合計',
        amount: estimate.totalPrice,
        isTotal: true
      }
    ]
  };
}