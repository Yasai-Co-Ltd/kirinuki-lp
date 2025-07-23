import { OrderEstimate, PricingBreakdown, PricingBreakdownItem } from '@/types/order';
import { ADMIN_CONFIG } from './admin-config';

// 料金設定
const PRICING_CONFIG = {
  basePricePerMinute: 100, // 基本料金: 1分あたり100円
  qualityOptions: {
    ai_only: 0,      // AIのみ: 追加料金なし
    human_review: ADMIN_CONFIG.pricing.humanReviewSurcharge, // 人の目で確認: 管理設定から取得
  },
  minimumCharge: 1000, // 最低料金
  maxFreeMinutes: 10,  // 10分未満は最低料金
};

export function calculateEstimate(
  durationSeconds: number | number[],
  format: 'default' | 'separate' | 'zoom' | 'screen',
  qualityOption: 'ai_only' | 'human_review' = 'ai_only'
): OrderEstimate {
  // 複数動画対応
  const durations = Array.isArray(durationSeconds) ? durationSeconds : [durationSeconds];
  const videoCount = durations.length;
  
  // 合計秒数を計算してから分数に変換（切り上げ）
  const totalDurationSeconds = durations.reduce((sum, seconds) => sum + seconds, 0);
  const totalVideoDurationMinutes = Math.ceil(totalDurationSeconds / 60);
  
  // 料金計算（合計金額に最低料金を適用）
  const basePricePerMinute = PRICING_CONFIG.basePricePerMinute;
  const qualitySurcharge = PRICING_CONFIG.qualityOptions[qualityOption];
  const totalPricePerMinute = basePricePerMinute + qualitySurcharge;
  
  // 全動画の合計分数で料金計算し、最後に最低料金を適用
  const calculatedPrice = totalVideoDurationMinutes * totalPricePerMinute;
  const totalPrice = Math.max(calculatedPrice, PRICING_CONFIG.minimumCharge);
  
  // 納期計算（品質オプションに応じて統一）
  // AIのみの場合：当日〜2営業日、人が確認する場合：1〜3営業日
  const estimatedDeliveryDays = qualityOption === 'human_review' ? 3 : 2;

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
  format: 'default' | 'separate' | 'zoom' | 'screen',
  qualityOption: 'ai_only' | 'human_review' = 'ai_only'
): PricingBreakdown {
  const totalMinutes = estimate.totalVideoDurationMinutes;
  const videoCount = estimate.videoCount;
  
  const qualityLabels = {
    ai_only: 'AIのみ',
    human_review: '人の目で確認'
  };
  
  const breakdown: PricingBreakdownItem[] = [];
  
  // 統一された料金計算ロジック（単一・複数動画共通）
  const basePricePerMinute = PRICING_CONFIG.basePricePerMinute;
  const qualitySurcharge = PRICING_CONFIG.qualityOptions[qualityOption];
  const totalPricePerMinute = basePricePerMinute + qualitySurcharge;
  
  const calculatedBasePrice = totalMinutes * basePricePerMinute;
  const calculatedQualityPrice = totalMinutes * qualitySurcharge;
  const calculatedTotalPrice = totalMinutes * totalPricePerMinute;
  
  const isMinimumChargeApplied = calculatedTotalPrice < PRICING_CONFIG.minimumCharge;
  
  if (isMinimumChargeApplied) {
    breakdown.push({
      label: `基本料金 (${videoCount > 1 ? `${videoCount}本・` : ''}${totalMinutes}分)`,
      amount: calculatedBasePrice,
      note: `${totalMinutes}分 × ${formatPrice(basePricePerMinute)}/分`
    });
    
    // 品質オプション料金（最低料金適用前）
    if (qualityOption === 'human_review' && calculatedQualityPrice > 0) {
      breakdown.push({
        label: `${qualityLabels[qualityOption]}オプション`,
        amount: calculatedQualityPrice,
        note: `${totalMinutes}分 × ${formatPrice(qualitySurcharge)}/分`
      });
    }
    
    breakdown.push({
      label: `最低料金保証`,
      amount: PRICING_CONFIG.minimumCharge - calculatedTotalPrice,
      isMinimumCharge: true,
      note: `${PRICING_CONFIG.maxFreeMinutes}分未満は最低${formatPrice(PRICING_CONFIG.minimumCharge)}となります`
    });
  } else {
    breakdown.push({
      label: `基本料金 (${videoCount > 1 ? `${videoCount}本・` : ''}${totalMinutes}分)`,
      amount: calculatedBasePrice,
      note: `${totalMinutes}分 × ${formatPrice(basePricePerMinute)}/分`
    });
    
    // 品質オプション料金（通常料金）
    if (qualityOption === 'human_review' && calculatedQualityPrice > 0) {
      breakdown.push({
        label: `${qualityLabels[qualityOption]}オプション`,
        amount: calculatedQualityPrice,
        note: `${totalMinutes}分 × ${formatPrice(qualitySurcharge)}/分`
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