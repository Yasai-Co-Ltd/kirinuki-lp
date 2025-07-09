'use client';

import { useState } from 'react';
import { ADMIN_CONFIG, getCurrentConfig, isPlanAvailable } from '@/lib/admin-config';

// 管理者パネル - 価格と受付状況を確認・管理するためのコンポーネント
// 本番環境では適切な認証を追加してください
export default function AdminPanel() {
  const [isVisible, setIsVisible] = useState(false);
  const config = getCurrentConfig();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* 管理パネル表示ボタン */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
        title="管理パネル"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* 管理パネル */}
      {isVisible && (
        <div className="absolute bottom-16 right-0 bg-white border border-gray-200 rounded-lg shadow-xl p-6 w-80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">管理パネル</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            {/* 現在の価格設定 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">現在の価格設定</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">基本料金:</span>
                  <span className="font-medium">100円/分</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">人の目で確認 追加料金:</span>
                  <span className="font-medium">{ADMIN_CONFIG.pricing.humanReviewSurcharge}円/分</span>
                </div>
                <div className="flex justify-between border-t border-blue-300 pt-1 mt-2">
                  <span className="text-blue-700 font-semibold">人の目で確認 総額:</span>
                  <span className="font-bold text-blue-900">{config.humanReviewPrice}円/分</span>
                </div>
              </div>
            </div>

            {/* 受付状況 */}
            <div className="border rounded-lg p-4 bg-gray-50 border-gray-200">
              <h4 className="font-semibold mb-3 text-gray-900">受付状況</h4>
              
              {/* 全体の受付状況 */}
              <div className="mb-3 pb-3 border-b border-gray-300">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${config.isAcceptingOrders ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`font-medium ${config.isAcceptingOrders ? 'text-green-800' : 'text-red-800'}`}>
                    全体: {config.isAcceptingOrders ? '受付中' : '受付停止中'}
                  </span>
                </div>
                {!config.isAcceptingOrders && (
                  <p className="text-sm text-red-700 bg-red-100 p-2 rounded">
                    {config.stopMessage}
                  </p>
                )}
              </div>

              {/* プラン別受付状況 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">AIのみプラン:</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isPlanAvailable('ai_only') ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className={`text-sm font-medium ${isPlanAvailable('ai_only') ? 'text-green-700' : 'text-red-700'}`}>
                      {isPlanAvailable('ai_only') ? '受付中' : '停止中'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">人の目で確認プラン:</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isPlanAvailable('human_review') ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className={`text-sm font-medium ${isPlanAvailable('human_review') ? 'text-green-700' : 'text-red-700'}`}>
                      {isPlanAvailable('human_review') ? '受付中' : '停止中'}
                    </span>
                  </div>
                </div>
                
                {!isPlanAvailable('human_review') && config.isAcceptingOrders && (
                  <p className="text-xs text-orange-700 bg-orange-100 p-2 rounded mt-2">
                    {config.planStatus.humanReviewStopMessage}
                  </p>
                )}
              </div>
            </div>

            {/* 設定変更の案内 */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">設定変更方法</h4>
              <p className="text-sm text-yellow-800 mb-2">
                価格や受付状況を変更するには、以下のファイルを編集してください：
              </p>
              <code className="text-xs bg-yellow-100 px-2 py-1 rounded block mb-2">
                src/lib/admin-config.ts
              </code>
              <div className="text-xs text-yellow-700 space-y-1">
                <p>• 価格変更: ADMIN_CONFIG.pricing.humanReviewSurcharge</p>
                <p>• 全体受付停止: ADMIN_CONFIG.orderStatus.isAcceptingOrders</p>
                <p>• AIのみプラン停止: ADMIN_CONFIG.orderStatus.planStatus.aiOnly</p>
                <p>• 人の目で確認プラン停止: ADMIN_CONFIG.orderStatus.planStatus.humanReview</p>
                <p>• 停止メッセージ: ADMIN_CONFIG.orderStatus.stopMessage</p>
                <p>• 人の目で確認プラン停止メッセージ: ADMIN_CONFIG.orderStatus.planStatus.humanReviewStopMessage</p>
              </div>
            </div>

            {/* 現在の設定をコンソールに出力 */}
            <button
              onClick={() => {
                console.log('=== 現在の管理設定 ===');
                console.log('人の目で確認プラン価格:', config.humanReviewPrice + '円/分');
                console.log('全体受付状況:', config.isAcceptingOrders ? '受付中' : '受付停止中');
                console.log('AIのみプラン:', isPlanAvailable('ai_only') ? '受付中' : '停止中');
                console.log('人の目で確認プラン:', isPlanAvailable('human_review') ? '受付中' : '停止中');
                console.log('全体停止メッセージ:', config.stopMessage);
                console.log('人の目で確認プラン停止メッセージ:', config.planStatus.humanReviewStopMessage);
                console.log('===================');
                alert('現在の設定をコンソールに出力しました');
              }}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
            >
              設定をコンソールに出力
            </button>
          </div>
        </div>
      )}
    </div>
  );
}