'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { OrderFormData, VideoInfo, OrderEstimate } from '@/types/order';
import { formatDuration } from '@/lib/youtube';
import { formatPrice, getPricingBreakdown } from '@/lib/pricing';

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
  const [step, setStep] = useState<'form' | 'payment' | 'processing'>('form');
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [estimate, setEstimate] = useState<OrderEstimate | null>(null);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<OrderFormData>({
    defaultValues: {
      preferLength: 0,
      aspectRatio: 1,
      subtitleSwitch: 0,
      headlineSwitch: 0,
    }
  });

  const watchedVideoUrl = watch('videoUrl');
  const watchedFormat = watch('format');
  const watchedAspectRatio = watch('aspectRatio');

  // 動画情報を取得
  const fetchVideoInfo = async (videoUrl: string) => {
    if (!videoUrl) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/video-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setVideoInfo(data.videoInfo);
    } catch (err) {
      setError(err instanceof Error ? err.message : '動画情報の取得に失敗しました');
      setVideoInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 見積もりを作成
  const createEstimate = async (formData: OrderFormData) => {
    if (!videoInfo) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          videoDuration: videoInfo.duration,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setEstimate(data.estimate);
      setClientSecret(data.clientSecret);
      setStep('payment');
    } catch (err) {
      setError(err instanceof Error ? err.message : '見積もりの作成に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // 決済処理
  const handlePayment = async () => {
    if (!stripe || !elements || !clientSecret) return;

    setIsLoading(true);
    setError('');

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    try {
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
        onSuccess?.();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '決済に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'processing') {
    return (
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
    );
  }

  if (step === 'payment' && estimate && videoInfo) {
    const breakdown = getPricingBreakdown(estimate, watchedFormat === 'with_subtitles');

    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">お支払い</h2>
          <p className="text-gray-600">注文内容をご確認の上、お支払いください</p>
        </div>
        
        {/* 注文内容確認 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 md:p-8 mb-8">
          <h3 className="text-xl font-bold text-blue-900 mb-6">注文内容</h3>
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
              <div className="flex-1">
                <span className="font-semibold text-blue-900 block mb-1">動画:</span>
                <span className="text-blue-800 leading-relaxed">{videoInfo.title}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="font-semibold text-blue-900 block mb-1">長さ:</span>
                <span className="text-blue-800">{formatDuration(videoInfo.duration)}</span>
              </div>
              <div>
                <span className="font-semibold text-blue-900 block mb-1">フォーマット:</span>
                <span className="text-blue-800">{watchedFormat === 'with_subtitles' ? '字幕あり' : '字幕なし'}</span>
              </div>
              <div>
                <span className="font-semibold text-blue-900 block mb-1">納期:</span>
                <span className="text-blue-800">約{estimate.estimatedDeliveryDays}営業日</span>
              </div>
            </div>
            
            {/* 切り抜き設定詳細 */}
            <div className="mt-6 pt-4 border-t border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-3">切り抜き設定</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-blue-800 block mb-1">優先クリップ長:</span>
                  <span className="text-blue-700">
                    {watch('preferLength') === 0 && '自動'}
                    {watch('preferLength') === 1 && '〜30秒'}
                    {watch('preferLength') === 2 && '30秒〜60秒'}
                    {watch('preferLength') === 3 && '60秒〜90秒'}
                    {watch('preferLength') === 4 && '90秒〜3分'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-blue-800 block mb-1">アスペクト比:</span>
                  <span className="text-blue-700">
                    {watch('aspectRatio') === 1 && '9:16 (縦型)'}
                    {watch('aspectRatio') === 2 && '1:1 (正方形)'}
                    {watch('aspectRatio') === 3 && '4:5 (ポートレート)'}
                    {watch('aspectRatio') === 4 && '16:9 (横型)'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-blue-800 block mb-1">字幕:</span>
                  <span className="text-blue-700">{watch('subtitleSwitch') ? 'あり' : 'なし'}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-800 block mb-1">ヘッドライン:</span>
                  <span className="text-blue-700">{watch('headlineSwitch') ? 'あり' : 'なし'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 料金詳細 */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-6 md:p-8 mb-8">
          <h3 className="text-xl font-bold text-orange-900 mb-6">料金詳細</h3>
          <div className="space-y-3">
            {breakdown.breakdown.map((item, index) => (
              <div key={index} className={`flex justify-between items-center ${item.isTotal ? 'font-bold text-xl border-t border-orange-300 pt-4 mt-4 text-orange-900' : 'text-orange-800'}`}>
                <span>{item.label}</span>
                <span className={item.isTotal ? 'text-2xl' : ''}>{formatPrice(item.amount)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* カード情報入力 */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 md:p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">カード情報</h3>
          <div className="border-2 border-gray-200 rounded-xl p-4 bg-gray-50">
            <CardElement
              options={{
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
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-800 px-6 py-4 rounded-xl mb-6">
            <p className="font-semibold">エラーが発生しました</p>
            <p>{error}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={() => setStep('form')}
            className="flex-1 px-8 py-4 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all"
            disabled={isLoading}
          >
            戻る
          </button>
          <button
            onClick={handlePayment}
            disabled={!stripe || isLoading}
            className="flex-1 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-lg hover:from-orange-600 hover:to-red-600 disabled:opacity-50 transition-all"
          >
            {isLoading ? '処理中...' : `${formatPrice(estimate.totalPrice)}を支払う`}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="order-form">
      <form onSubmit={handleSubmit(createEstimate)} className="max-w-3xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">切り抜き動画制作のご注文</h2>
          <p className="text-gray-600">必要な情報を入力してください</p>
        </div>

        {/* 動画URL入力 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 md:p-8">
          <label className="block text-lg font-bold text-blue-900 mb-4">
            YouTube動画URL *
          </label>
          <input
            type="url"
            {...register('videoUrl', { required: '動画URLは必須です' })}
            className="w-full px-6 py-4 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all text-lg bg-white"
            placeholder="https://www.youtube.com/watch?v=..."
            onBlur={(e) => fetchVideoInfo(e.target.value)}
          />
          {errors.videoUrl && (
            <p className="text-red-600 font-medium mt-2">{errors.videoUrl.message}</p>
          )}
        </div>

        {/* 動画情報表示 */}
        {videoInfo && (
          <div className="bg-white border-2 border-green-200 rounded-2xl p-6 md:p-8 shadow-lg">
            <h3 className="text-lg font-bold text-green-800 mb-4">動画情報を取得しました</h3>
            <div className="flex flex-col lg:flex-row gap-6">
              <img
                src={videoInfo.thumbnailUrl}
                alt={videoInfo.title}
                className="w-full lg:w-48 h-36 object-cover rounded-xl shadow-md"
              />
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 text-lg mb-2 leading-tight">{videoInfo.title}</h4>
                <p className="text-gray-600 mb-2">{videoInfo.channelTitle}</p>
                <p className="text-gray-600">長さ: {formatDuration(videoInfo.duration)}</p>
              </div>
            </div>
          </div>
        )}

        {/* フォーマット選択 */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-6 md:p-8">
          <label className="block text-lg font-bold text-orange-900 mb-6">
            フォーマット選択 *
          </label>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <label className={`flex flex-col p-6 border-2 rounded-xl cursor-pointer transition-all group ${
              watchedFormat === 'without_subtitles'
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 hover:border-orange-300 bg-white/50'
            }`}>
              <div className="flex items-start mb-4">
                <input
                  type="radio"
                  value="without_subtitles"
                  {...register('format', { required: 'フォーマットを選択してください' })}
                  className="mt-1 mr-4 text-orange-500 w-5 h-5"
                />
                <div className="flex-1">
                  <div className="font-bold text-gray-900 text-lg mb-2">字幕なし</div>
                  <div className="text-orange-600 font-bold text-xl mb-2">500円/分</div>
                  <div className="text-sm text-gray-600">シンプルで素早い制作</div>
                </div>
              </div>
              <div className="mt-4 border-t border-gray-200 pt-4">
                <div className="text-sm font-medium text-gray-700 mb-2">サンプル:</div>
                <img
                  src="/images/sample-without-subtitles.svg"
                  alt="字幕なしサンプル"
                  className="w-full h-auto rounded-lg shadow-sm border border-gray-200 group-hover:shadow-md transition-shadow"
                />
              </div>
            </label>
            <label className={`flex flex-col p-6 border-2 rounded-xl cursor-pointer transition-all group ${
              watchedFormat === 'with_subtitles'
                ? 'border-orange-500 bg-orange-50'
                : 'border-orange-300 hover:border-orange-400 bg-white'
            }`}>
              <div className="flex items-start mb-4">
                <input
                  type="radio"
                  value="with_subtitles"
                  {...register('format', { required: 'フォーマットを選択してください' })}
                  className="mt-1 mr-4 text-orange-500 w-5 h-5"
                />
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="font-bold text-gray-900 text-lg mr-2">字幕あり</span>
                    <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">おすすめ</span>
                  </div>
                  <div className="text-orange-600 font-bold text-xl mb-2">700円/分</div>
                  <div className="text-sm text-gray-600">視聴者に優しい字幕付き</div>
                </div>
              </div>
              <div className="mt-4 border-t border-gray-200 pt-4">
                <div className="text-sm font-medium text-gray-700 mb-2">サンプル:</div>
                <img
                  src="/images/sample-with-subtitles.svg"
                  alt="字幕ありサンプル"
                  className="w-full h-auto rounded-lg shadow-sm border border-gray-200 group-hover:shadow-md transition-shadow"
                />
              </div>
            </label>
          </div>
          {errors.format && (
            <p className="text-red-600 font-medium mt-3">{errors.format.message}</p>
          )}
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
            {/* 優先クリップ長 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                優先クリップ長（秒）
              </label>
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                アスペクト比
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <label className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all bg-white group ${
                  watchedAspectRatio === 1
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-orange-300'
                }`}>
                  <input
                    type="radio"
                    value={1}
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
                  watchedAspectRatio === 2
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
                  watchedAspectRatio === 3
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
                  watchedAspectRatio === 4
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
            </div>
          </div>

          {/* 追加オプション */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="h-5 w-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
              追加オプション
            </h4>
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <svg className="h-6 w-6 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <p className="font-semibold text-yellow-800 mb-1">重要：字幕・ヘッドラインの設定</p>
                  <p className="text-yellow-700 text-sm">以下のオプションを見落とさないよう、必ずご確認ください。設定により動画の見栄えが大きく変わります。</p>
                </div>
              </div>
            </div>
            
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

              {/* ヘッドラインオプション */}
              <div className="bg-white border-2 border-purple-200 rounded-xl p-6 hover:border-purple-300 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-lg font-bold text-purple-900 flex items-center gap-2">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    ヘッドライン設定
                  </h5>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-bold">注目度UP</span>
                </div>
                <p className="text-purple-700 text-sm mb-4">動画にキャッチーなヘッドラインを表示するかどうかを選択してください</p>
                
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
                    />
                    <div>
                      <div className="font-semibold text-gray-900">ヘッドラインを表示する</div>
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
                      <div className="font-semibold text-gray-900">ヘッドラインを非表示にする</div>
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
          <h3 className="text-lg font-bold text-gray-900 mb-6">お客様情報</h3>
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
              電話番号
            </label>
            <input
              type="tel"
              {...register('customerPhone')}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-400 transition-all"
              placeholder="090-1234-5678"
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              特別なご要望
            </label>
            <textarea
              {...register('specialRequests')}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-400 transition-all resize-vertical"
              placeholder="切り抜きの内容や特別なご要望があればお書きください"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-800 px-6 py-4 rounded-xl">
            <p className="font-semibold">エラーが発生しました</p>
            <p>{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={!videoInfo || isLoading}
          className="w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-lg hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:hover:scale-100 shadow-lg"
        >
          {isLoading ? '処理中...' : '見積もりを確認する'}
        </button>
      </form>
    </div>
  );
}