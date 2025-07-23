export interface SampleVideo {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number; // 秒数
}

export interface ProductionSample {
  id: string;
  title: string;
  description: string;
  category: 'game' | 'talk' | 'education' | 'business' | 'entertainment';
  
  // 注文内容
  orderDetails: {
    format: 'default' | 'separate' | 'zoom' | 'screen';
    qualityOption: 'ai_only' | 'human_review';
    preferLength: number; // 0: 自動, 1: ~30秒, 2: 30-60秒, 3: 60-90秒, 4: 90秒-3分
    aspectRatio: number; // 1: 9:16, 2: 1:1, 3: 4:5, 4: 16:9
    subtitleSwitch: number; // 0: なし, 1: あり
    headlineSwitch: number; // 0: なし, 1: あり
    language: 'japanese' | 'english' | 'chinese' | 'korean';
  };
  
  // 元動画情報
  originalVideo: {
    title: string;
    duration: number; // 秒数
    thumbnailUrl: string;
    description: string;
  };
  
  // 制作結果
  results: {
    totalClips: number;
    clips: SampleVideo[];
    totalViews?: number; // 総再生数（オプショナル）
    engagementRate?: number; // エンゲージメント率（オプショナル）
  };
  
  // 制作統計
  stats: {
    processingTime: string; // "2時間30分" など
    deliveryDays: number;
    customerSatisfaction?: number; // 1-5の評価
  };
  
  createdAt: Date;
  featured: boolean; // おすすめサンプルかどうか
}

export interface SamplePageData {
  featuredSamples: ProductionSample[];
  categorySamples: {
    [key in ProductionSample['category']]: ProductionSample[];
  };
  totalSamples: number;
  totalClipsCreated: number;
  averageClipsPerVideo: number;
}