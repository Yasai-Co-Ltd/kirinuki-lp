import axios from 'axios';

// Vizard.ai APIの設定
const VIZARD_API_BASE_URL = 'https://api.vizard.ai/v1';
const VIZARD_API_KEY = process.env.VIZARD_API_KEY;

// Vizard.ai APIクライアント
const vizardClient = axios.create({
  baseURL: VIZARD_API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${VIZARD_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

// 動画生成リクエストの型定義
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

// 動画生成レスポンスの型定義
export interface VideoGenerationResponse {
  id: string;
  status: 'processing' | 'completed' | 'failed';
  url?: string;
  download_url?: string;
  created_at: string;
  updated_at: string;
}

// Webhook通知の型定義
export interface VizardWebhookPayload {
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

// 動画生成を開始
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

// デフォルトの動画生成設定
export const DEFAULT_VIDEO_SETTINGS = {
  aspect_ratio: '9:16' as const,
  subtitle: true,
  language: 'ja',
};