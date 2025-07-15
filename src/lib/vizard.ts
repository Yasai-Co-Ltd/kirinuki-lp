import axios from 'axios';

// Vizard.ai APIの設定
const VIZARD_API_BASE_URL = 'https://elb-api.vizard.ai/hvizard-server-front/open-api/v1';
const VIZARD_API_KEY = process.env.VIZARD_API_KEY;

// Vizard.ai APIクライアント
const vizardClient = axios.create({
  baseURL: VIZARD_API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${VIZARD_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

// Vizard.ai プロジェクト作成リクエストの型定義（新しいAPI仕様）
export interface VizardCreateProjectRequest {
  lang?: string;
  preferLength?: number[];
  videoUrl: string;
  videoType?: number;
  ratioOfClip?: number;
  templateId?: number;
  removeSilenceSwitch?: number;
  maxClipNumber?: number;
  keyword?: string;
  subtitleSwitch?: number;
  headlineSwitch?: number;
  projectName?: string;
}

// 従来の動画生成リクエストの型定義（後方互換性のため保持）
export interface VideoGenerationRequest {
  url: string;
  webhook_url?: string;
  settings?: {
    aspect_ratio?: '9:16' | '16:9' | '1:1' | '4:5';
    duration?: number;
    subtitle?: boolean;
    language?: string;
  };
}

// Vizard API プロジェクト作成レスポンスの型定義
export interface VizardCreateProjectResponse {
  code: number;
  projectId: number;
  shareLink: string;
  errMsg: string;
}

// 従来の動画生成レスポンスの型定義（後方互換性のため保持）
export interface VideoGenerationResponse {
  id: string;
  status: 'processing' | 'completed' | 'failed';
  url?: string;
  download_url?: string;
  created_at: string;
  updated_at: string;
}

// 新しいVizardのWebhook通知の型定義
export interface VizardWebhookPayload {
  code: number;
  shareLink: string;
  videos: VizardVideoClip[];
  projectId: number;
}

// 動画クリップの型定義
export interface VizardVideoClip {
  videoId: number;
  videoUrl: string;
  videoMsDuration: number;
  title: string;
  transcript: string;
  viralScore: string;
  viralReason: string;
  relatedTopic: string;
  clipEditorUrl: string;
}

// 従来のWebhook通知の型定義（後方互換性のため保持）
export interface LegacyVizardWebhookPayload {
  id: string;
  status: 'completed' | 'failed';
  url?: string;
  download_url?: string;
  error?: string;
  metadata?: {
    original_url: string;
    duration: number;
    title: string;
  };
}

// 新しいAPI仕様でプロジェクトを作成
export async function createVizardProject(request: VizardCreateProjectRequest): Promise<VizardCreateProjectResponse> {
  if (!VIZARD_API_KEY) {
    throw new Error('Vizard API キーが設定されていません (VIZARD_API_KEY)');
  }

  // デフォルト値を設定
  const projectRequest: VizardCreateProjectRequest = {
    lang: request.lang || 'ja',
    preferLength: request.preferLength || [60],
    videoUrl: request.videoUrl,
    videoType: request.videoType || 2,
    ratioOfClip: request.ratioOfClip || 1,
    templateId: request.templateId || 64976905,
    removeSilenceSwitch: request.removeSilenceSwitch || 0,
    maxClipNumber: request.maxClipNumber || 5,
    keyword: request.keyword || '',
    subtitleSwitch: request.subtitleSwitch || 1,
    headlineSwitch: request.headlineSwitch || 1,
    projectName: request.projectName || `DOGA NO AIKATA - ${new Date().toLocaleString('ja-JP')}`,
  };

  try {
    const response = await vizardClient.post('/project/create', projectRequest);
    const data: VizardCreateProjectResponse = response.data;
    
    // エラーレスポンスの場合は例外を投げる
    if (data.code !== 2000) {
      throw new Error(`Vizard API エラー: コード ${data.code} - ${data.errMsg || '不明なエラー'}`);
    }
    
    return data;
  } catch (error) {
    console.error('Vizard API エラー:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(`Vizard API エラー: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
    }
    throw error;
  }
}

// 従来の動画生成関数（後方互換性のため保持）
export async function createVideoGeneration(request: VideoGenerationRequest): Promise<VideoGenerationResponse> {
  if (!VIZARD_API_KEY) {
    throw new Error('Vizard API キーが設定されていません (VIZARD_API_KEY)');
  }

  try {
    const response = await vizardClient.post('/videos', request);
    return response.data;
  } catch (error) {
    console.error('Vizard API エラー:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(`Vizard API エラー: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
    }
    throw error;
  }
}

// 動画生成ステータスを取得
export async function getVideoGenerationStatus(id: string): Promise<VideoGenerationResponse> {
  if (!VIZARD_API_KEY) {
    throw new Error('Vizard API キーが設定されていません (VIZARD_API_KEY)');
  }

  try {
    const response = await vizardClient.get(`/videos/${id}`);
    return response.data;
  } catch (error) {
    console.error('Vizard API エラー:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(`Vizard API エラー: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
    }
    throw error;
  }
}

// 環境変数の設定状況を確認
export function checkVizardConfiguration(): { configured: boolean; missing: string[] } {
  const missing: string[] = [];
  
  if (!VIZARD_API_KEY) missing.push('VIZARD_API_KEY');
  
  return {
    configured: missing.length === 0,
    missing
  };
}

// デフォルトの動画生成設定（従来のAPI用）
export const DEFAULT_VIDEO_SETTINGS = {
  aspect_ratio: '9:16' as const,
  subtitle: true,
  language: 'ja',
};

// デフォルトのVizardプロジェクト設定（新しいAPI用）
export const DEFAULT_VIZARD_PROJECT_SETTINGS: Partial<VizardCreateProjectRequest> = {
  lang: 'ja',
  preferLength: [60],
  videoType: 2,
  ratioOfClip: 1,
  templateId: 64976905,
  removeSilenceSwitch: 0,
  maxClipNumber: 5,
  keyword: '',
  subtitleSwitch: 1,
  headlineSwitch: 1,
};

// フォーマットからtemplateIdへのマッピング
export const FORMAT_TO_TEMPLATE_ID: Record<string, number> = {
  'default': 64976905,  // デフォルト
  'separate': 64977436, // ２分割
  'zoom': 64977280,     // ズーム
};

// 優先クリップ長の設定をpreferLengthに変換
export function convertPreferLengthToArray(preferLength: number): number[] {
  switch (preferLength) {
    case 0: return [60]; // 自動（デフォルト60秒）
    case 1: return [30]; // 〜30秒
    case 2: return [45]; // 30秒〜60秒（中間値45秒）
    case 3: return [75]; // 60秒〜90秒（中間値75秒）
    case 4: return [120]; // 90秒〜3分（中間値120秒）
    default: return [60];
  }
}

// フォームデータからVizardプロジェクト作成リクエストを生成
export function createVizardRequestFromFormData(
  videoUrl: string,
  formData: {
    format: 'default' | 'separate' | 'zoom';
    preferLength: number;
    subtitleSwitch: number;
    headlineSwitch: number;
  },
  customerName: string
): VizardCreateProjectRequest {
  return {
    lang: 'ja',
    preferLength: convertPreferLengthToArray(formData.preferLength),
    videoUrl: videoUrl,
    videoType: 2,
    ratioOfClip: 1,
    templateId: FORMAT_TO_TEMPLATE_ID[formData.format] || FORMAT_TO_TEMPLATE_ID['default'],
    removeSilenceSwitch: 0,
    maxClipNumber: 5,
    keyword: '',
    subtitleSwitch: formData.subtitleSwitch,
    headlineSwitch: formData.headlineSwitch,
    projectName: `DOGA NO AIKATA - ${customerName} - ${new Date().toLocaleString('ja-JP')}`,
  };
}