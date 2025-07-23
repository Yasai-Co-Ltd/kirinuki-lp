'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { OrderFormData, VideoInfo, VideoOrderItem, OrderEstimate } from '@/types/order';
import { formatDuration } from '@/lib/youtube';
import { formatPrice, getPricingBreakdown } from '@/lib/pricing';
import { ADMIN_CONFIG, isPlanAvailable } from '@/lib/admin-config';
import StepBar from '@/components/ui/StepBar';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface OrderFormProps {
  onSuccess?: () => void;
}

export default function OrderForm({ onSuccess }: OrderFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <OrderFormContent onSuccess={onSuccess} />
    </Elements>
  );
}

function OrderFormContent({ onSuccess }: OrderFormProps) {
  const [step, setStep] = useState<'form' | 'confirm' | 'payment' | 'processing'>('form');

  // フォーマット選択肢の定義
  const formatOptions = [
    {
      value: 'default',
      label: 'デフォルト',
      description: '標準的なレイアウト(人物)',
      image: '/images/format-sample/default.png',
      imageAlt: 'デフォルトサンプル',
      isRecommended: true,
      isDefault: true
    },
    {
      value: 'separate',
      label: '2分割',
      description: '画面を2つに分割(人物)',
      image: '/images/format-sample/sepalate.png',
      imageAlt: '2分割サンプル',
      isRecommended: false,
      isDefault: false
    },
    {
      value: 'zoom',
      label: 'ズーム',
      description: '拡大表示で迫力アップ(人物)',
      image: '/images/format-sample/zoom.png',
      imageAlt: 'ズームサンプル',
      isRecommended: false,
      isDefault: false
    },
    {
      value: 'screen',
      label: '画面キャプチャ',
      description: '画面録画の場合はこちらを選択',
      image: '/images/format-sample/screen.png', // 画面キャプチャ用の画像がない場合はデフォルトを使用
      imageAlt: '画面キャプチャサンプル',
      isRecommended: false,
      isDefault: false
    }
  ];

  // ステップバー用の設定
  const steps = [
    {
      id: 'form',
      title: '注文情報入力',
      description: '動画URLと設定を入力'
    },
    {
      id: 'confirm',
      title: '内容確認',
      description: '注文内容と料金を確認'
    },
    {
      id: 'payment',
      title: 'お支払い',
      description: 'クレジットカード決済'
    },
    {
      id: 'processing',
      title: '完了',
      description: '注文完了・制作開始'
    }
  ];

  const getCompletedSteps = () => {
    const stepOrder = ['form', 'confirm', 'payment', 'processing'];
    const currentIndex = stepOrder.indexOf(step);
    return stepOrder.slice(0, currentIndex);
  };
  const [videos, setVideos] = useState<VideoOrderItem[]>([{ videoUrl: '' }]);
  const [videoInfos, setVideoInfos] = useState<VideoInfo[]>([]);
  const [estimate, setEstimate] = useState<OrderEstimate | null>(null);
  const [formData, setFormData] = useState<OrderFormData | null>(null);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OrderFormData>({
    defaultValues: {
      videos: [{ videoUrl: '' }],
      format: 'default',
      qualityOption: 'ai_only',
      preferLength: 0,
      aspectRatio: 1, // 9:16 (縦型) を初期値に設定
      subtitleSwitch: 1,
      headlineSwitch: 1,
      language: 'japanese', // 日本語を初期値に設定
    }
  });

  const watchedVideos = watch('videos');
  const watchedFormat = watch('format');
  const watchedQualityOption = watch('qualityOption');
  const watchedAspectRatio = watch('aspectRatio');
  const watchedLanguage = watch('language');

  // 複数動画情報を取得
  const fetchVideoInfos = async (videoUrls: string[]) => {
    const validUrls = videoUrls.filter(url => url.trim() !== '');
    if (validUrls.length === 0) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/video-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrls: validUrls }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setVideoInfos(data.videoInfos || []);
      if (data.errors && data.errors.length > 0) {
        setError(data.errors.join(', '));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '動画情報の取得に失敗しました');
      setVideoInfos([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 単一動画情報を取得（後方互換性のため）
  const fetchVideoInfo = async (videoUrl: string) => {
    if (!videoUrl) return;
    await fetchVideoInfos([videoUrl]);
  };

  // 見積もりを作成（確認画面へ）
  const createEstimate = async (data: OrderFormData) => {
    if (!videoInfos || videoInfos.length === 0) return;

    setIsLoading(true);
    setError('');

    console.log('送信データ:', data);
    console.log('動画情報:', videoInfos);

    try {
      // Stripe環境変数が設定されていない場合はモックデータを使用
      const hasStripeKeys = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY &&
                           process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY !== 'pk_test_51234567890abcdef';

      if (!hasStripeKeys) {
        console.log('Stripe環境変数が設定されていないため、モックデータを使用します');
        
        // モック見積もりデータを作成
        const { calculateEstimate } = await import('@/lib/pricing');
        const durations = videoInfos.map(info => info.duration);
        const mockEstimate = calculateEstimate(
          durations,
          data.format,
          data.qualityOption
        );

        setEstimate(mockEstimate);
        setClientSecret('mock_client_secret');
        setFormData(data);
        setStep('confirm');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        console.log('確認画面に遷移しました（モックデータ使用）');
        return;
      }

      const durations = videoInfos.map(info => info.duration);
      const requestData = {
        ...data,
        videoDurations: durations,
        videoInfos: videoInfos, // 動画情報を追加
      };

      console.log('APIリクエストデータ:', requestData);

      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      const responseData = await response.json();
      console.log('APIレスポンス:', responseData);

      if (!response.ok) {
        console.error('APIエラー:', responseData);
        throw new Error(responseData.error || `HTTPエラー: ${response.status}`);
      }

      setEstimate(responseData.estimate);
      setClientSecret(responseData.clientSecret);
      setFormData(data);
      setStep('confirm');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      console.log('確認画面に遷移しました');
    } catch (err) {
      console.error('見積もり作成エラー:', err);
      setError(err instanceof Error ? err.message : '見積もりの作成に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // 決済画面へ進む
  const proceedToPayment = () => {
    setStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // フォームに戻る
  const backToForm = () => {
    setStep('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 確認画面に戻る
  const backToConfirm = () => {
    setStep('confirm');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 決済処理
  const handlePayment = async () => {
    setIsLoading(true);
    setError('');

    try {
      // モックデータの場合は決済をスキップ
      if (clientSecret === 'mock_client_secret') {
        console.log('モックデータのため決済をスキップします');
        setTimeout(() => {
          setStep('processing');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          onSuccess?.();
          setIsLoading(false);
        }, 1000);
        return;
      }

      if (!stripe || !elements || !clientSecret) return;

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) return;

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent?.status === 'succeeded') {
        setStep('processing');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        onSuccess?.();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '決済に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // デバッグ情報
  console.log('現在のステップ:', step);
  console.log('見積もり:', estimate);
  console.log('動画情報:', videoInfos);
  console.log('フォームデータ:', formData);

  if (step === 'processing') {
    return (
      <div className="max-w-4xl mx-auto">
        <StepBar
          steps={steps}
          currentStep={step}
          completedSteps={getCompletedSteps()}
        />
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-green-600 mb-6">ご注文ありがとうございます！</h2>
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <p className="text-green-800 text-lg leading-relaxed">
                決済が完了しました。<br />
                制作完了次第、メールにてお届けいたします。
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'confirm' && estimate && videoInfos.length > 0 && formData) {
    const breakdown = getPricingBreakdown(estimate, formData.format, formData.qualityOption);

    return (
      <div className="max-w-4xl mx-auto">
        <StepBar
          steps={steps}
          currentStep={step}
          completedSteps={getCompletedSteps()}
        />
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">ご注文内容の確認</h2>
          <p className="text-gray-600">内容をご確認の上、お支払いへお進みください</p>
        </div>

        {/* 注文内容確認 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 md:p-8 mb-8">
          <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            注文内容
          </h3>
          
          <div className="space-y-6">
            {/* 動画情報 */}
            <div className="bg-white rounded-xl p-6 border border-blue-200">
              <h5 className="font-semibold text-blue-900 mb-4">
                注文動画 ({videoInfos.length}本・合計{formatDuration(videoInfos.reduce((sum, info) => sum + info.duration, 0))})
              </h5>
              <div className="space-y-4">
                {videoInfos.slice(0, 3).map((videoInfo, index) => (
                  <div key={index} className="flex flex-col lg:flex-row gap-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={videoInfo.thumbnailUrl}
                      alt={videoInfo.title}
                      className="w-full lg:w-32 h-24 object-cover rounded-lg shadow-sm"
                    />
                    <div className="flex-1">
                      <h6 className="font-medium text-gray-900 text-sm mb-1 leading-tight">{videoInfo.title}</h6>
                      <p className="text-gray-600 text-xs mb-1">{videoInfo.channelTitle}</p>
                      <p className="text-gray-600 text-xs">長さ: {formatDuration(videoInfo.duration)}</p>
                    </div>
                  </div>
                ))}
                {videoInfos.length > 3 && (
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-gray-500 text-sm">他{videoInfos.length - 3}本</p>
                  </div>
                )}
              </div>
            </div>

            {/* 制作設定 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-4 border border-blue-200">
                <h5 className="font-semibold text-blue-900 mb-3">基本設定</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">フォーマット:</span>
                    <span className="font-medium text-gray-900">
                      {formData.format === 'default' && 'デフォルト'}
                      {formData.format === 'separate' && '2分割'}
                      {formData.format === 'zoom' && 'ズーム'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">品質オプション:</span>
                    <span className="font-medium text-gray-900">
                      {formData.qualityOption === 'ai_only' && 'AIのみ'}
                      {formData.qualityOption === 'human_review' && '人の目で確認'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">納期:</span>
                    <span className="font-medium text-gray-900">約{estimate.estimatedDeliveryDays}営業日</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">言語:</span>
                    <span className="font-medium text-gray-900">
                      {formData.language === 'japanese' && '日本語'}
                      {formData.language === 'english' && '英語'}
                      {formData.language === 'chinese' && '中国語'}
                      {formData.language === 'korean' && '韓国語'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-blue-200">
                <h5 className="font-semibold text-blue-900 mb-3">切り抜き設定</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">優先クリップ長:</span>
                    <span className="font-medium text-gray-900">
                      {formData.preferLength === 0 && '自動'}
                      {formData.preferLength === 1 && '〜30秒'}
                      {formData.preferLength === 2 && '30秒〜60秒'}
                      {formData.preferLength === 3 && '60秒〜90秒'}
                      {formData.preferLength === 4 && '90秒〜3分'}
                    </span>
                  </div>
                  {/* <div className="flex justify-between">
                    <span className="text-gray-600">アスペクト比:</span>
                    <span className="font-medium text-gray-900">
                      {formData.aspectRatio === 1 && '9:16 (縦型)'}
                      {formData.aspectRatio === 2 && '1:1 (正方形)'}
                      {formData.aspectRatio === 3 && '4:5 (ポートレート)'}
                      {formData.aspectRatio === 4 && '16:9 (横型)'}
                    </span>
                  </div> */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">字幕:</span>
                    <span className="font-medium text-gray-900">{formData.subtitleSwitch ? 'あり' : 'なし'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">タイトル:</span>
                    <span className="font-medium text-gray-900">{formData.headlineSwitch ? 'あり' : 'なし'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* お客様情報 */}
            <div className="bg-white rounded-xl p-4 border border-blue-200">
              <h5 className="font-semibold text-blue-900 mb-3">お客様情報</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">お名前:</span>
                  <span className="font-medium text-gray-900">{formData.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">メールアドレス:</span>
                  <span className="font-medium text-gray-900">{formData.customerEmail}</span>
                </div>
              </div>
              {formData.specialRequests && (
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <span className="text-gray-600 text-sm block mb-2">特別なご要望:</span>
                  <p className="text-gray-900 text-sm bg-gray-50 p-3 rounded-lg">{formData.specialRequests}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 料金詳細 */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-6 md:p-8 mb-8">
          <h3 className="text-xl font-bold text-orange-900 mb-6 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            料金詳細
          </h3>
          <div className="bg-white rounded-xl p-6 border border-orange-200">
            <div className="space-y-3">
              {breakdown.breakdown.map((item, index) => (
                <div key={index}>
                  <div className={`flex justify-between items-center ${
                    item.isTotal
                      ? 'font-bold text-xl border-t border-orange-300 pt-4 mt-4 text-orange-900'
                      : item.isMinimumCharge
                        ? 'text-blue-800 font-medium'
                        : 'text-orange-800'
                  }`}>
                    <div className="flex flex-col">
                      <span className={item.isMinimumCharge ? 'flex items-center gap-2' : ''}>
                        {item.isMinimumCharge && (
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                        {item.label}
                      </span>
                      {item.note && (
                        <span className="text-xs text-gray-600 mt-1">{item.note}</span>
                      )}
                    </div>
                    <span className={item.isTotal ? 'text-2xl' : ''}>{formatPrice(item.amount)}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* 最低料金についての説明を追加 */}
            {breakdown.breakdown.some(item => item.isMinimumCharge) && (
              <div className="mt-4 pt-4 border-t border-orange-200">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-blue-900 font-medium text-sm mb-1">最低料金について</p>
                      <p className="text-blue-800 text-sm leading-relaxed">
                        動画の長さが10分以内の場合、品質を保つため最低料金{formatPrice(1000)}を設定させていただいております。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-800 px-6 py-4 rounded-xl mb-6">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold mb-1">エラーが発生しました</p>
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* アクションボタン */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={backToForm}
            className="flex-1 px-8 py-4 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            内容を修正する
          </button>
          <button
            onClick={proceedToPayment}
            disabled={isLoading}
            className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-bold text-lg hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                処理中...
              </>
            ) : (
              <>
                {`${formatPrice(estimate.totalPrice)}でお支払いへ進む`}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  if (step === 'payment' && estimate && videoInfos.length > 0 && formData) {
    const breakdown = getPricingBreakdown(estimate, formData.format, formData.qualityOption);

    return (
      <div className="max-w-4xl mx-auto">
        <StepBar
          steps={steps}
          currentStep={step}
          completedSteps={getCompletedSteps()}
        />
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">お支払い</h2>
          <p className="text-gray-600">カード情報を入力してお支払いを完了してください</p>
        </div>
        
        {/* 注文サマリー（簡潔版） */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            注文サマリー
          </h3>
          <div className="bg-white rounded-xl p-4 border border-blue-200">
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 text-sm mb-3">
                注文動画 ({videoInfos.length}本・合計{Math.ceil(videoInfos.reduce((sum, info) => sum + info.duration, 0) / 60)}分)
              </h4>
              <div className="space-y-2">
                {videoInfos.slice(0, 3).map((videoInfo, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <img
                      src={videoInfo.thumbnailUrl}
                      alt={videoInfo.title}
                      className="w-12 h-9 object-cover rounded shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-xs leading-tight truncate">{videoInfo.title}</p>
                      <p className="text-gray-600 text-xs">{formatDuration(videoInfo.duration)}</p>
                    </div>
                  </div>
                ))}
                {videoInfos.length > 3 && (
                  <p className="text-gray-500 text-xs">他{videoInfos.length - 3}本</p>
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-gray-600 text-xs">
                  {formData.format === 'default' ? 'デフォルト' : formData.format === 'separate' ? '2分割' : 'ズーム'} • {formData.qualityOption === 'ai_only' ? 'AIのみ' : '人の目で確認'}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-blue-200">
              <span className="font-semibold text-blue-900">合計金額</span>
              <span className="text-2xl font-bold text-blue-900">{formatPrice(estimate.totalPrice)}</span>
            </div>
          </div>
        </div>

        {/* カード情報入力 */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 md:p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            {clientSecret === 'mock_client_secret' ? 'お支払い（デモモード）' : 'カード情報'}
          </h3>
          {clientSecret === 'mock_client_secret' ? (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4 className="font-bold text-yellow-800">デモモード</h4>
              </div>
              <p className="text-yellow-700 text-sm">
                Stripe環境変数が設定されていないため、デモモードで動作しています。<br />
                実際の決済は行われません。「お支払いを完了する」ボタンをクリックすると完了画面に進みます。
              </p>
            </div>
          ) : (
            <>
              <div className="border-2 border-gray-200 rounded-xl p-4 bg-gray-50">
                <CardElement
                  options={{
                    hidePostalCode: true,
                    style: {
                      base: {
                        fontSize: '18px',
                        color: '#374151',
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        '::placeholder': {
                          color: '#9CA3AF',
                        },
                      },
                    },
                  }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-3">SSL暗号化により安全に処理されます</p>
            </>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-800 px-6 py-4 rounded-xl mb-6">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold mb-1">エラーが発生しました</p>
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={backToConfirm}
            className="flex-1 px-8 py-4 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            確認画面に戻る
          </button>
          <button
            onClick={handlePayment}
            disabled={(clientSecret !== 'mock_client_secret' && !stripe) || isLoading}
            className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-bold text-lg hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                処理中...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                {clientSecret === 'mock_client_secret' ?
                 `お支払いを完了する（デモ）` :
                 `${formatPrice(estimate.totalPrice)}を支払う`}
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // 受付停止チェック
  if (!ADMIN_CONFIG.orderStatus.isAcceptingOrders) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-orange-600 mb-6">受付を一時停止中</h2>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
              <p className="text-orange-800 text-lg leading-relaxed">
                {ADMIN_CONFIG.orderStatus.stopMessage}
              </p>
            </div>
            <div className="mt-8">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all duration-200"
              >
                ページを更新
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-4xl mx-auto">
        <StepBar
          steps={steps}
          currentStep={step}
          completedSteps={getCompletedSteps()}
        />
        <form onSubmit={handleSubmit(createEstimate)} className="max-w-3xl mx-auto space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">切り抜き動画制作のご注文</h2>
            <p className="text-gray-600">必要な情報を入力してください</p>
          </div>

        {/* 複数動画URL入力 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-lg font-bold text-blue-900">
              YouTube動画URL *
            </label>
            <span className="text-sm text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
              {videos.length}本の動画
            </span>
          </div>
          
          <div className="space-y-4">
            {videos.map((video, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex-1">
                  <input
                    type="url"
                    {...register(`videos.${index}.videoUrl` as const, {
                      required: index === 0 ? '最低1つの動画URLは必須です' : false
                    })}
                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all bg-white"
                    placeholder={`動画${index + 1}のURL: https://www.youtube.com/watch?v=...`}
                    onBlur={(e) => {
                      const newVideos = [...videos];
                      newVideos[index] = { ...newVideos[index], videoUrl: e.target.value };
                      setVideos(newVideos);
                      setValue('videos', newVideos);
                      
                      // エラーメッセージをクリア
                      setError('');
                      
                      // 全ての有効なURLを取得して動画情報を更新
                      const validUrls = newVideos.filter(v => v.videoUrl.trim() !== '').map(v => v.videoUrl);
                      if (validUrls.length > 0) {
                        fetchVideoInfos(validUrls);
                      }
                    }}
                  />
                  {errors.videos?.[index]?.videoUrl && (
                    <p className="text-red-600 text-sm mt-1">{errors.videos[index]?.videoUrl?.message}</p>
                  )}
                </div>
                
                {videos.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newVideos = videos.filter((_, i) => i !== index);
                      setVideos(newVideos);
                      setValue('videos', newVideos);
                      
                      // 動画情報も更新
                      const validUrls = newVideos.filter(v => v.videoUrl.trim() !== '').map(v => v.videoUrl);
                      if (validUrls.length > 0) {
                        fetchVideoInfos(validUrls);
                      } else {
                        setVideoInfos([]);
                      }
                    }}
                    className="px-3 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    title="この動画を削除"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <button
              type="button"
              onClick={() => {
                const newVideos = [...videos, { videoUrl: '' }];
                setVideos(newVideos);
                setValue('videos', newVideos);
              }}
              disabled={videos.length >= 3}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                videos.length >= 3
                  ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              動画を追加 ({videos.length}/3)
            </button>
            
            {videos.length > 1 && videos.length < 3 && (
              <p className="text-sm text-blue-700">
                複数動画の一括制作で効率的に！
              </p>
            )}
            
            {videos.length >= 3 && (
              <p className="text-sm text-orange-600">
                最大3本まで同時注文可能です
              </p>
            )}
          </div>
          
          {/* 動画制限に関する注意事項 */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">動画の制限について</p>
                <p>・動画の長さは<strong>{ADMIN_CONFIG.videoLimits.minDurationMinutes}分以上</strong>である必要があります</p>
                <p>・YouTube動画のURLを入力してください</p>
                <p>・一度に注文できる動画数は<strong>最大3本</strong>までです</p>
                <p>・複数の動画を一括制作で効率的に処理できます</p>
              </div>
            </div>
          </div>
        </div>

        {/* エラーメッセージ表示 */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-800 px-6 py-4 rounded-xl">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold mb-1">エラーが発生しました</p>
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* 動画情報表示 */}
        {videoInfos.length > 0 && (
          <div className="bg-white border-2 border-green-200 rounded-2xl p-6 md:p-8 shadow-lg">
            <h3 className="text-lg font-bold text-green-800 mb-4">
              動画情報を取得しました ({videoInfos.length}本・合計{Math.ceil(videoInfos.reduce((sum, info) => sum + info.duration, 0) / 60)}分)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {videoInfos.map((videoInfo, index) => (
                <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                  <img
                    src={videoInfo.thumbnailUrl}
                    alt={videoInfo.title}
                    className="w-24 h-18 object-cover rounded-lg shadow-sm flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1 leading-tight line-clamp-2">{videoInfo.title}</h4>
                    <p className="text-gray-600 text-xs mb-1">{videoInfo.channelTitle}</p>
                    <p className="text-gray-600 text-xs">長さ: {formatDuration(videoInfo.duration)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* フォーマット選択 */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-6 md:p-8">
          <label className="block text-lg font-bold text-orange-900 mb-6">
            フォーマット選択 *
          </label>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-5">
            {formatOptions.map((format) => (
              <label
                key={format.value}
                className={`flex flex-col p-2 md:p-4 border-2 rounded-xl cursor-pointer transition-all group ${
                  watchedFormat === format.value
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-orange-300 bg-white/50'
                }`}
              >
                <div className={`flex items-start md:mb-2 flex-col relative`}>
                  <input
                    type="radio"
                    value={format.value}
                    {...register('format', { required: 'フォーマットを選択してください' })}
                    className="mt-1 mr-4 text-orange-500 w-5 h-5"
                  />
                  <div className={`flex-1 py-1`}>
                    {format.isDefault ? (
                      <div className="flex flex-col items-start mb-2">
                        {format.isRecommended && (
                          <span className="absolute right-0 top-0 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">おすすめ</span>
                        )}
                        <span className="font-bold text-gray-900 text-sm md:text-lg mr-2">{format.label}</span>
                      </div>
                    ) : (
                      <div className="font-bold text-gray-900 text-sm md:text-lg mr-2  mb-2">{format.label}</div>
                    )}
                    <div className={`text-xs md:text-sm text-gray-600`}>
                      {format.description}
                    </div>
                  </div>
                </div>
                <div className="mt-1 md:mt-2 border-t border-gray-200 pt-1 md:pt-2">
                  {/* <div className="text-sm font-medium text-gray-700 mb-2">サンプル:</div> */}
                  <img
                    src={format.image}
                    alt={format.imageAlt}
                    className="w-full h-auto rounded-lg shadow-sm border border-gray-200 group-hover:shadow-md transition-shadow"
                  />
                </div>
              </label>
            ))}
          </div>
          {errors.format && (
            <p className="text-red-600 font-medium mt-3">{errors.format.message}</p>
          )}
        </div>

        {/* 品質オプション選択 */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 md:p-8">
          <label className="block text-lg font-bold text-green-900 mb-6">
            品質オプション *
          </label>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <label className={`flex flex-col p-6 border-2 rounded-xl cursor-pointer transition-all group ${
              watchedQualityOption === 'ai_only'
                ? 'border-green-500 bg-green-50'
                : 'border-green-300 hover:border-green-400 bg-white'
            }`}>
              <div className="flex items-start mb-4">
                <input
                  type="radio"
                  value="ai_only"
                  {...register('qualityOption', { required: '品質オプションを選択してください' })}
                  className="mt-1 mr-4 text-green-500 w-5 h-5"
                />
                <div className="flex-1">
                  <div className="flex flex-col items-start mb-2">
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">お得</span>
                    <span className="font-bold text-gray-900 text-lg mr-2">AIのみ</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">AI技術のみで制作</div>
                  <div className="text-xs text-green-700 font-medium">追加料金なし</div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <ul className="space-y-1">
                  <li>• 高速な制作スピード</li>
                  <li>• コストパフォーマンス重視</li>
                  <li>• 基本的な品質保証</li>
                </ul>
              </div>
            </label>
            
            <label className={`flex flex-col p-6 border-2 rounded-xl transition-all group ${
              !isPlanAvailable('human_review')
                ? 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-60'
                : watchedQualityOption === 'human_review'
                ? 'border-green-500 bg-green-50 cursor-pointer'
                : 'border-gray-200 hover:border-green-300 bg-white/50 cursor-pointer'
            }`}>
              <div className="flex items-start mb-4">
                <input
                  type="radio"
                  value="human_review"
                  {...register('qualityOption', { required: '品質オプションを選択してください' })}
                  className="mt-1 mr-4 text-green-500 w-5 h-5"
                  disabled={!isPlanAvailable('human_review')}
                />
                <div className="flex-1">
                  <div className="flex flex-col items-start mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      !isPlanAvailable('human_review')
                        ? 'bg-gray-400 text-white'
                        : 'bg-blue-500 text-white'
                    }`}>
                      {!isPlanAvailable('human_review') ? '受付停止中' : '高品質'}
                    </span>
                    <span className={`font-bold text-lg mr-2 ${
                      !isPlanAvailable('human_review') ? 'text-gray-500' : 'text-gray-900'
                    }`}>
                      人の目で確認
                    </span>
                  </div>
                  <div className={`text-sm mb-2 ${
                    !isPlanAvailable('human_review') ? 'text-gray-500' : 'text-gray-600'
                  }`}>
                    {!isPlanAvailable('human_review')
                      ? '現在受付を停止しています'
                      : '専門スタッフによる品質チェック'
                    }
                  </div>
                  {isPlanAvailable('human_review') && (
                    <div className="text-xs text-orange-700 font-medium">+{ADMIN_CONFIG.pricing.humanReviewSurcharge}円/分</div>
                  )}
                </div>
              </div>
              {isPlanAvailable('human_review') ? (
                <div className="text-sm text-gray-600">
                  <ul className="space-y-1">
                    <li>• 人による最終チェック</li>
                    <li>• より高い品質保証</li>
                    <li>• 修正対応</li>
                  </ul>
                </div>
              ) : (
                <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <p>{ADMIN_CONFIG.orderStatus.planStatus.humanReviewStopMessage}</p>
                </div>
              )}
            </label>
          </div>
          {errors.qualityOption && (
            <p className="text-red-600 font-medium mt-3">{errors.qualityOption.message}</p>
          )}
        </div>

        {/* 言語選択 */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6 md:p-8">
          <label className="block text-lg font-bold text-purple-900 mb-6">
            字幕・タイトルの言語 *
          </label>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <label className={`flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all group ${
              watchedLanguage === 'japanese'
                ? 'border-purple-500 bg-purple-50'
                : 'border-purple-200 hover:border-purple-300 bg-white'
            }`}>
              <input
                type="radio"
                value="japanese"
                defaultChecked
                {...register('language', { required: '言語を選択してください' })}
                className="sr-only"
              />
              <div className="text-2xl mb-2">🇯🇵</div>
              <span className="font-semibold text-gray-900 text-sm">日本語</span>
              <span className="text-xs text-gray-600 mt-1">Japanese</span>
            </label>
            
            <label className={`flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all group ${
              watchedLanguage === 'english'
                ? 'border-purple-500 bg-purple-50'
                : 'border-purple-200 hover:border-purple-300 bg-white'
            }`}>
              <input
                type="radio"
                value="english"
                {...register('language', { required: '言語を選択してください' })}
                className="sr-only"
              />
              <div className="text-2xl mb-2">🇺🇸</div>
              <span className="font-semibold text-gray-900 text-sm">英語</span>
              <span className="text-xs text-gray-600 mt-1">English</span>
            </label>
            
            <label className={`flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all group ${
              watchedLanguage === 'chinese'
                ? 'border-purple-500 bg-purple-50'
                : 'border-purple-200 hover:border-purple-300 bg-white'
            }`}>
              <input
                type="radio"
                value="chinese"
                {...register('language', { required: '言語を選択してください' })}
                className="sr-only"
              />
              <div className="text-2xl mb-2">🇨🇳</div>
              <span className="font-semibold text-gray-900 text-sm">中国語</span>
              <span className="text-xs text-gray-600 mt-1">Chinese</span>
            </label>
            
            <label className={`flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all group ${
              watchedLanguage === 'korean'
                ? 'border-purple-500 bg-purple-50'
                : 'border-purple-200 hover:border-purple-300 bg-white'
            }`}>
              <input
                type="radio"
                value="korean"
                {...register('language', { required: '言語を選択してください' })}
                className="sr-only"
              />
              <div className="text-2xl mb-2">🇰🇷</div>
              <span className="font-semibold text-gray-900 text-sm">韓国語</span>
              <span className="text-xs text-gray-600 mt-1">Korean</span>
            </label>
          </div>
          {errors.language && (
            <p className="text-red-600 font-medium mt-3">{errors.language.message}</p>
          )}
          <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-xl">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-purple-800">
                <p className="font-semibold mb-1">言語設定について</p>
                <p>正確な字幕やタイトルを挿入するために重要な設定です。</p>
              </div>
            </div>
          </div>
        </div>

        {/* 切り抜き生成設定 */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="border-b pb-4 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              切り抜き生成設定
            </h3>
            <p className="text-gray-600 mt-1">動画から生成する切り抜きの詳細設定</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 優先長 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                優先的な切り抜き動画の長さ（秒）
              </label>
              <div className="text-xs my-2 text-red-700">
                <p>※選択する切り抜き動画の長さによって、生成される動画の本数が変わります。</p>
              </div>
              <select
                {...register('preferLength', { required: '優先クリップ長を選択してください' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value={0}>自動</option>
                <option value={1}>〜30秒</option>
                <option value={2}>30秒〜60秒</option>
                <option value={3}>60秒〜90秒</option>
                <option value={4}>90秒〜3分</option>
              </select>
              {errors.preferLength && (
                <p className="text-red-600 text-sm mt-1">{errors.preferLength.message}</p>
              )}
            </div>

            {/* アスペクト比 */}
            {/* <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                アスペクト比
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <label className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all bg-white group ${
                  watchedAspectRatio == 1
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-orange-300'
                }`}>
                  <input
                    type="radio"
                    value={1}
                    defaultChecked
                    {...register('aspectRatio', { required: 'アスペクト比を選択してください' })}
                    className="sr-only"
                  />
                  <img
                    src="/images/aspect-9-16.svg"
                    alt="9:16 縦型"
                    className="w-full h-16 mb-2 group-hover:scale-105 transition-transform"
                  />
                  <span className="text-xs font-medium text-gray-700 text-center">9:16</span>
                  <span className="text-xs text-gray-500 text-center">縦型・ショート</span>
                </label>
                <label className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all bg-white group ${
                  watchedAspectRatio == 2
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-orange-300'
                }`}>
                  <input
                    type="radio"
                    value={2}
                    {...register('aspectRatio', { required: 'アスペクト比を選択してください' })}
                    className="sr-only"
                  />
                  <img
                    src="/images/aspect-1-1.svg"
                    alt="1:1 正方形"
                    className="w-full h-16 mb-2 group-hover:scale-105 transition-transform"
                  />
                  <span className="text-xs font-medium text-gray-700 text-center">1:1</span>
                  <span className="text-xs text-gray-500 text-center">正方形・SNS</span>
                </label>
                <label className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all bg-white group ${
                  watchedAspectRatio == 3
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-orange-300'
                }`}>
                  <input
                    type="radio"
                    value={3}
                    {...register('aspectRatio', { required: 'アスペクト比を選択してください' })}
                    className="sr-only"
                  />
                  <img
                    src="/images/aspect-4-5.svg"
                    alt="4:5 ポートレート"
                    className="w-full h-16 mb-2 group-hover:scale-105 transition-transform"
                  />
                  <span className="text-xs font-medium text-gray-700 text-center">4:5</span>
                  <span className="text-xs text-gray-500 text-center">ポートレート</span>
                </label>
                <label className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all bg-white group ${
                  watchedAspectRatio == 4
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-orange-300'
                }`}>
                  <input
                    type="radio"
                    value={4}
                    {...register('aspectRatio', { required: 'アスペクト比を選択してください' })}
                    className="sr-only"
                  />
                  <img
                    src="/images/aspect-16-9.svg"
                    alt="16:9 横型"
                    className="w-full h-16 mb-2 group-hover:scale-105 transition-transform"
                  />
                  <span className="text-xs font-medium text-gray-700 text-center">16:9</span>
                  <span className="text-xs text-gray-500 text-center">横型・標準</span>
                </label>
              </div>
              {errors.aspectRatio && (
                <p className="text-red-600 text-sm mt-2">{errors.aspectRatio.message}</p>
              )}
            </div> */}
          </div>

          {/* 追加オプション */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="h-5 w-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
              字幕・タイトル設定
            </h4>
            {/* <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <svg className="h-6 w-6 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <p className="font-semibold text-yellow-800 mb-1">重要：字幕・タイトルの設定</p>
                  <p className="text-yellow-700 text-sm">以下のオプションを見落とさないよう、必ずご確認ください。設定により動画の見栄えが大きく変わります。</p>
                </div>
              </div>
            </div> */}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 字幕オプション */}
              <div className="bg-white border-2 border-blue-200 rounded-xl p-6 hover:border-blue-300 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-lg font-bold text-blue-900 flex items-center gap-2">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
                    </svg>
                    字幕設定
                  </h5>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold">推奨</span>
                </div>
                <p className="text-blue-700 text-sm mb-4">動画に字幕を表示するかどうかを選択してください</p>
                
                <div className="space-y-3">
                  <label className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    watch('subtitleSwitch') === 1
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 bg-white'
                  }`}>
                    <input
                      type="radio"
                      value={1}
                      defaultChecked
                      {...register('subtitleSwitch', {
                        setValueAs: (value) => parseInt(value)
                      })}
                      className="mr-3 w-5 h-5 text-blue-600"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">字幕を表示する</div>
                      <div className="text-sm text-gray-600">視聴者にとって分かりやすい動画になります</div>
                    </div>
                  </label>
                  
                  <label className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    watch('subtitleSwitch') === 0
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 bg-white'
                  }`}>
                    <input
                      type="radio"
                      value={0}
                      {...register('subtitleSwitch', {
                        setValueAs: (value) => parseInt(value)
                      })}
                      className="mr-3 w-5 h-5 text-blue-600"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">字幕を非表示にする</div>
                      <div className="text-sm text-gray-600">シンプルな見た目の動画になります</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* タイトルオプション */}
              <div className="bg-white border-2 border-purple-200 rounded-xl p-6 hover:border-purple-300 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-lg font-bold text-purple-900 flex items-center gap-2">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    タイトル設定
                  </h5>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-bold">注目度UP</span>
                </div>
                <p className="text-purple-700 text-sm mb-4">動画にキャッチーなタイトルを表示するかどうかを選択してください</p>
                
                <div className="space-y-3">
                  <label className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    watch('headlineSwitch') === 1
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300 bg-white'
                  }`}>
                    <input
                      type="radio"
                      value={1}
                      {...register('headlineSwitch', {
                        setValueAs: (value) => parseInt(value)
                      })}
                      className="mr-3 w-5 h-5 text-purple-600"
                      defaultChecked
                    />
                    <div>
                      <div className="font-semibold text-gray-900">タイトルを表示する</div>
                      <div className="text-sm text-gray-600">視聴者の注目を集めやすくなります</div>
                    </div>
                  </label>
                  
                  <label className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    watch('headlineSwitch') === 0
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300 bg-white'
                  }`}>
                    <input
                      type="radio"
                      value={0}
                      {...register('headlineSwitch', {
                        setValueAs: (value) => parseInt(value)
                      })}
                      className="mr-3 w-5 h-5 text-purple-600"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">タイトルを非表示にする</div>
                      <div className="text-sm text-gray-600">すっきりとした見た目の動画になります</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* お客様情報 */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-lg font-bold text-gray-900">お客様情報</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                お名前 *
              </label>
              <input
                type="text"
                {...register('customerName', { required: 'お名前は必須です' })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-400 transition-all"
                placeholder="山田太郎"
              />
              {errors.customerName && (
                <p className="text-red-600 text-sm mt-1">{errors.customerName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                メールアドレス *
              </label>
              <input
                type="email"
                {...register('customerEmail', {
                  required: 'メールアドレスは必須です',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: '有効なメールアドレスを入力してください'
                  }
                })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-400 transition-all"
                placeholder="example@email.com"
              />
              {errors.customerEmail && (
                <p className="text-red-600 text-sm mt-1">{errors.customerEmail.message}</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              備考
            </label>
            <textarea
              {...register('specialRequests')}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-400 transition-all resize-vertical"
              placeholder="何かお伝えしたいこと等ございましたらお書きください"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-800 px-6 py-4 rounded-xl">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold mb-1">エラーが発生しました</p>
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={videoInfos.length === 0 || isLoading}
          className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-bold text-lg hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              見積もり作成中...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              見積もりを確認する
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>
        </form>
      </div>
    </div>
  );
}