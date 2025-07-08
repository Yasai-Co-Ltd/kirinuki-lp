export interface VideoInfo {
  id: string;
  title: string;
  duration: number; // 秒数
  thumbnailUrl: string;
  channelTitle: string;
}

export interface VideoOrderItem {
  videoUrl: string;
  videoInfo?: VideoInfo;
}

export interface OrderFormData {
  videos: VideoOrderItem[]; // 複数動画対応
  format: 'default' | 'separate' | 'zoom';
  qualityOption: 'ai_only' | 'human_review'; // 品質オプション
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
  totalVideoDurationMinutes: number; // 全動画の合計分数
  totalPrice: number;
  estimatedDeliveryDays: number;
  qualityOption?: 'ai_only' | 'human_review';
  videoCount: number; // 動画数
}

export interface Order {
  id: string;
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  videoInfo: VideoInfo;
  format: 'default' | 'separate' | 'zoom';
  qualityOption: 'ai_only' | 'human_review';
  estimate: OrderEstimate;
  specialRequests?: string;
  status: 'pending' | 'paid' | 'processing' | 'completed' | 'cancelled';
  paymentIntentId?: string;
  createdAt: Date;
  updatedAt: Date;
}