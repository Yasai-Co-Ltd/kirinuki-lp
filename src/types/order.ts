export interface VideoInfo {
  id: string;
  title: string;
  duration: number; // 秒数
  thumbnailUrl: string;
  channelTitle: string;
}

export interface OrderFormData {
  videoUrl: string;
  format: 'with_subtitles' | 'without_subtitles';
  // 切り抜き設定
  preferLength: number; // 0: 自動, 1: ~30秒, 2: 30-60秒, 3: 60-90秒, 4: 90秒-3分
  aspectRatio: number; // 1: 9:16, 2: 1:1, 3: 4:5, 4: 16:9
  subtitleSwitch: number; // 0: なし, 1: あり
  headlineSwitch: number; // 0: なし, 1: あり
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  specialRequests?: string;
}

export interface OrderEstimate {
  basePricePerMinute: number;
  subtitleSurcharge: number;
  videoDurationMinutes: number;
  totalPrice: number;
  estimatedDeliveryDays: number;
}

export interface Order {
  id: string;
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  videoInfo: VideoInfo;
  format: 'with_subtitles' | 'without_subtitles';
  estimate: OrderEstimate;
  specialRequests?: string;
  status: 'pending' | 'paid' | 'processing' | 'completed' | 'cancelled';
  paymentIntentId?: string;
  createdAt: Date;
  updatedAt: Date;
}