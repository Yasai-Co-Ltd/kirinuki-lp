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