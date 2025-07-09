export interface EmailTemplate {
  to: string;
  from: string;
  subject: string;
  html: string;
}

export interface VideoEmailInfo {
  title: string;
  duration: number;
  thumbnailUrl: string;
  channelTitle: string;
}

export interface OrderEmailData {
  paymentIntentId: string;
  customerName: string;
  customerEmail: string;
  videoUrls: string[];
  videoInfos: VideoEmailInfo[];
  format: 'default' | 'separate' | 'zoom';
  qualityOption: 'ai_only' | 'human_review';
  preferLength: number;
  aspectRatio: number;
  subtitleSwitch: number;
  headlineSwitch: number;
  specialRequests?: string;
  amount: number;
  estimatedDeliveryDays: number;
  createdAt: Date;
}

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}