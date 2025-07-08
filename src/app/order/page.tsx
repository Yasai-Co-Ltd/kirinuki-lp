import OrderForm from '@/components/features/OrderForm';
import Layout from '@/components/layout/Layout';

export default function OrderPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-[gradient-to-br from-orange-50 via-white to-red-50] pt-24">
        {/* ヒーローセクション */}
        <div className="bg-[#3498db] text-white py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                切り抜き動画制作
              </h1>
              <p className="text-lg opacity-80">
                長編動画から魅力的な切り抜き動画を制作いたします
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-6xl py-12">
          {/* 注文フォーム */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 mb-12 border border-gray-100">
            <OrderForm />
          </div>

          {/* 料金プランセクション */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 mb-12 border border-gray-100">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">料金プラン</h2>
              <p className="text-lg text-gray-600">2つのシンプルなプランから選択</p>
            </div>
            
            {/* 2つのプラン */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* AIのみプラン */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-blue-900 mb-2">AIのみ</h3>
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-blue-600">100円</span>
                    <span className="text-xl text-gray-600">/分</span>
                  </div>
                  <p className="text-gray-700">高速制作・基本品質保証</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">AI自動チェック</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">納期: 2営業日</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">最低料金: 1,000円</span>
                  </div>
                </div>
              </div>

              {/* 人の目で確認プラン */}
              <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-400 rounded-2xl p-8">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                    おすすめ
                  </span>
                </div>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-green-900 mb-2">人の目で確認</h3>
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-green-600">150円</span>
                    <span className="text-xl text-gray-600">/分</span>
                  </div>
                  <p className="text-gray-700">専門スタッフチェック・高品質保証</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">専門スタッフチェック</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">納期: 3営業日</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">最低料金: 1,000円</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 共通仕様 */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-12">
              <h4 className="text-lg font-bold text-gray-900 mb-4 text-center">両プラン共通仕様</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <h5 className="font-semibold text-gray-800 mb-2">フォーマット</h5>
                  <p className="text-sm text-gray-600">デフォルト・2分割・ズーム<br />（すべて同料金）</p>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800 mb-2">字幕・タイトル</h5>
                  <p className="text-sm text-gray-600">注文時に選択可能<br />（追加料金なし）</p>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800 mb-2">長時間動画</h5>
                  <p className="text-sm text-gray-600">30分超の場合<br />+1営業日</p>
                </div>
              </div>
            </div>

            {/* 料金例 */}
            <div className="bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-2xl p-8">
              <h4 className="text-xl font-bold text-gray-900 mb-6 text-center">料金例</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <h5 className="font-semibold text-gray-900 mb-2">10分動画（AIのみ）</h5>
                  <p className="text-3xl font-bold text-blue-600 mb-2">1,000円</p>
                  <p className="text-sm text-gray-600">100円 × 10分</p>
                </div>
                <div className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <h5 className="font-semibold text-gray-900 mb-2">20分動画（人の目で確認）</h5>
                  <p className="text-3xl font-bold text-green-600 mb-2">3,000円</p>
                  <p className="text-sm text-gray-600">150円 × 20分</p>
                </div>
                <div className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <h5 className="font-semibold text-gray-900 mb-2">30分動画（人の目で確認）</h5>
                  <p className="text-3xl font-bold text-green-600 mb-2">4,500円</p>
                  <p className="text-sm text-gray-600">150円 × 30分</p>
                </div>
              </div>
            </div>
            
            {/* 注意事項 */}
            <div className="mt-12 max-w-4xl mx-auto">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-amber-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-bold text-amber-800 mb-3">ご注意事項</h4>
                    <ul className="text-sm text-amber-700 space-y-2">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-amber-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                        5分以下の動画でも最低料金1,000円が適用されます
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-amber-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                        30分を超える動画は追加で1営業日の納期をいただきます
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-amber-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                        著作権に問題のある動画は制作をお断りする場合があります
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-amber-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                        納品はメールにて行います
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 制作の流れセクション */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-100">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">制作の流れ</h2>
              <p className="text-lg text-gray-600">簡単4ステップで完了</p>
            </div>
            
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    step: 1,
                    title: "ご注文",
                    description: "動画URLとフォーマットを選択してご注文",
                    icon: "📝",
                    color: "from-blue-500 to-blue-600"
                  },
                  {
                    step: 2,
                    title: "お支払い",
                    description: "クレジットカードで安全にお支払い",
                    icon: "💳",
                    color: "from-green-500 to-green-600"
                  },
                  {
                    step: 3,
                    title: "制作開始",
                    description: "プロが丁寧に切り抜き動画を制作",
                    icon: "🎬",
                    color: "from-purple-500 to-purple-600"
                  },
                  {
                    step: 4,
                    title: "納品",
                    description: "完成した動画をメールでお届け",
                    icon: "📧",
                    color: "from-orange-500 to-red-500"
                  }
                ].map((item, index) => (
                  <div key={index} className="text-center group">
                    <div className={`w-20 h-20 bg-gradient-to-r ${item.color} text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl font-bold shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110`}>
                      {item.step}
                    </div>
                    <div className="text-4xl mb-4">{item.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                    
                    {/* 矢印（最後の要素以外） */}
                    {index < 3 && (
                      <div className="hidden lg:block absolute top-10 left-full w-8 h-8 transform translate-x-4">
                        <svg className="w-full h-full text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA セクション */}
            <div className="mt-16 text-center">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">今すぐ始めましょう！</h3>
                <p className="text-lg opacity-90 mb-6">プロの技術で、あなたの動画を魅力的な切り抜きに変身させます</p>
                <a 
                  href="#order-form" 
                  className="inline-block bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  注文フォームへ
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}