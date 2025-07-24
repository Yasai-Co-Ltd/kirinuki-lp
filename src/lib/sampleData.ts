import { ProductionSample, SamplePageData } from '@/types/sample';

export const sampleData: ProductionSample[] = [
  {
    id: 'sample-001',
    title: 'REAL VALUE動画切り抜きサンプル',
    description: '',
    category: 'business',
    orderDetails: {
      format: 'default',
      qualityOption: 'ai_only',
      preferLength: 4, // ~30秒
      aspectRatio: 1, // 9:16
      subtitleSwitch: 1,
      headlineSwitch: 1,
      language: 'japanese'
    },
    originalVideo: {
      title: 'ホリエモン史上最凶のブチギレ...俺の前から今すぐ消えろバカが！【REAL VALUE#15】',
      duration: 3237, // 2時間30分
      thumbnailUrl: '/images/sample01.jpg',
      description: ''
    },
    results: {
      totalClips: 32,
      totalViews: 125000,
      engagementRate: 8.5,
      clips: [
        {
          id: 'clip-001-1',
          title: '激論勃発！芸能界の現実と市場を語る熱い言葉',
          thumbnailUrl: '/images/sample-thumb01.png',
          videoUrl: '/videos/sample01.mp4',
          duration: 95
        }
      ],
    },
    stats: {
      processingTime: '3時間15分',
      deliveryDays: 2,
      customerSatisfaction: 5
    },
    createdAt: new Date('2024-01-15'),
    featured: true
  },
  {
    id: 'sample-002',
    title: '粗品 Official Channel動画切り抜きサンプル',
    description: '',
    category: 'business',
    orderDetails: {
      format: 'default',
      qualityOption: 'ai_only',
      preferLength: 4, // 30-60秒
      aspectRatio: 1, // 9:16
      subtitleSwitch: 1,
      headlineSwitch: 1,
      language: 'japanese'
    },
    originalVideo: {
      title: '生涯収支マイナス４億円君の小倉記念予想',
      duration: 497, // 1時間
      thumbnailUrl: '/images/sample02.jpg',
      description: ''
    },
    results: {
      totalClips: 4,
      totalViews: 45000,
      engagementRate: 6.2,
      clips: [
        {
          id: 'clip-002-1',
          title: '小倉記念本命はラスカンブレス！勝負の展開予想とは？',
          thumbnailUrl: '/images/sample-thumb02.png',
          videoUrl: '/videos/sample02.mp4',
          duration: 91
        },
      ]
    },
    stats: {
      processingTime: '2時間45分',
      deliveryDays: 1,
      customerSatisfaction: 4
    },
    createdAt: new Date('2024-01-20'),
    featured: true
  },
  {
    id: 'sample-003',
    title: '令和の虎CHANNEL動画切り抜きサンプル',
    description: '',
    category: 'business',
    orderDetails: {
      format: 'default',
      qualityOption: 'ai_only',
      preferLength: 4, // 30-60秒
      aspectRatio: 1, // 9:16
      subtitleSwitch: 1,
      headlineSwitch: 1,
      language: 'japanese'
    },
    originalVideo: {
      title: '【前編】｢いつもよりイケてるね｣「AI CAMP」で早すぎるAIの進化に皆でついていきたい！【青笹 寛史】[14人目]虎版令和の虎',
      duration: 1671,
      thumbnailUrl: '/images/sample03.jpg',
      description: ''
    },
    results: {
      totalClips: 19,
      totalViews: 78000,
      engagementRate: 7.8,
      clips: [
        {
          id: 'clip-003-1',
          title: '日本の労働力激減！AIで2倍働く未来を作るしかない',
          thumbnailUrl: '/images/sample-thumb03.png',
          videoUrl: '/videos/sample03.mp4',
          duration: 103
        },
      ]
    },
    stats: {
      processingTime: '2時間45分',
      deliveryDays: 1,
      customerSatisfaction: 4
    },
    createdAt: new Date('2024-01-20'),
    featured: true
  },
];

export const getSamplePageData = (): SamplePageData => {
  const featuredSamples = sampleData.filter(sample => sample.featured);
  
  const categorySamples = sampleData.reduce((acc, sample) => {
    if (!acc[sample.category]) {
      acc[sample.category] = [];
    }
    acc[sample.category].push(sample);
    return acc;
  }, {} as SamplePageData['categorySamples']);

  const totalClipsCreated = sampleData.reduce((sum, sample) => sum + sample.results.totalClips, 0);
  const averageClipsPerVideo = Math.round(totalClipsCreated / sampleData.length);

  return {
    featuredSamples,
    categorySamples,
    totalSamples: sampleData.length,
    totalClipsCreated,
    averageClipsPerVideo
  };
};

// フォーマット名を日本語に変換
export const getFormatLabel = (format: string): string => {
  const formatLabels: { [key: string]: string } = {
    'default': 'デフォルト',
    'separate': '2分割',
    'zoom': 'ズーム',
    'screen': '画面キャプチャ'
  };
  return formatLabels[format] || format;
};

// 品質オプション名を日本語に変換
export const getQualityOptionLabel = (option: string): string => {
  const optionLabels: { [key: string]: string } = {
    'ai_only': 'AIのみ',
    'human_review': '人の目で確認'
  };
  return optionLabels[option] || option;
};

// 優先クリップ長を日本語に変換
export const getPreferLengthLabel = (length: number): string => {
  const lengthLabels: { [key: number]: string } = {
    0: '自動',
    1: '〜30秒',
    2: '30秒〜60秒',
    3: '60秒〜90秒',
    4: '90秒〜3分'
  };
  return lengthLabels[length] || '自動';
};

// 言語名を日本語に変換
export const getLanguageLabel = (language: string): string => {
  const languageLabels: { [key: string]: string } = {
    'japanese': '日本語',
    'english': '英語',
    'chinese': '中国語',
    'korean': '韓国語'
  };
  return languageLabels[language] || language;
};

// カテゴリー名を日本語に変換
export const getCategoryLabel = (category: string): string => {
  const categoryLabels: { [key: string]: string } = {
    'game': 'ゲーム実況',
    'talk': 'トーク・雑談',
    'education': '教育・学習',
    'business': 'ビジネス',
    'entertainment': 'エンターテイメント'
  };
  return categoryLabels[category] || category;
};

// 時間をフォーマット
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}時間${minutes}分`;
  } else if (minutes > 0) {
    return `${minutes}分${secs > 0 ? `${secs}秒` : ''}`;
  } else {
    return `${secs}秒`;
  }
};

// 数値をフォーマット（カンマ区切り）
export const formatNumber = (num: number): string => {
  return num.toLocaleString('ja-JP');
};