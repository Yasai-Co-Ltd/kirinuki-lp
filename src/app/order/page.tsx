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
          <div id="order-form" className="bg-white rounded-2xl shadow-xl p-6 md:p-10 mb-12 border border-gray-100">
            <OrderForm />
          </div>

        </div>
      </div>
    </Layout>
  );
}