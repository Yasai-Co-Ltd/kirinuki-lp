import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '特定商取引法に基づく表記 | DOGA NO AIKATA',
  description: '特定商取引法に基づく表記',
}

export default function LegalPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">特定商取引法に基づく表記</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">販売業者</h2>
          <p className="text-gray-700">DOGA NO AIKATA</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">運営責任者</h2>
          <p className="text-gray-700">代表者名</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">所在地</h2>
          <p className="text-gray-700">
            〒000-0000<br />
            東京都渋谷区XXX-X-X XXXXビル1F
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">電話番号</h2>
          <p className="text-gray-700">03-0000-0000</p>
          <p className="text-sm text-gray-600 mt-2">
            ※お問い合わせは、原則として<a href="/contact" className="text-blue-600 hover:underline">お問い合わせフォーム</a>よりお願いいたします。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">メールアドレス</h2>
          <p className="text-gray-700">info@example.com</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">販売価格</h2>
          <p className="text-gray-700">
            各商品ページに記載された価格（税込）<br />
            ※価格は予告なく変更する場合があります。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">商品代金以外の必要料金</h2>
          <p className="text-gray-700">
            商品代金以外に以下の料金が発生する場合があります：<br />
            ・決済手数料（クレジットカード決済時）<br />
            ・その他、商品ページに明記された追加料金
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">支払方法</h2>
          <p className="text-gray-700">
            クレジットカード決済（Stripe）<br />
            対応カード：VISA、MasterCard、American Express、JCB
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">支払時期</h2>
          <p className="text-gray-700">
            クレジットカード決済：注文確定時に決済処理を行います
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">商品の引渡し時期</h2>
          <p className="text-gray-700">
            動画制作完了後、メールにてダウンロードリンクをお送りいたします。<br />
            制作期間：通常3-5営業日（内容により変動する場合があります）
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">返品・交換・キャンセル</h2>
          <div className="text-gray-700 space-y-2">
            <p><strong>デジタルコンテンツの性質上、以下の場合を除き返品・返金はお受けできません：</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>当社の責任による重大な瑕疵がある場合</li>
              <li>注文内容と著しく異なる商品が提供された場合</li>
            </ul>
            <p className="mt-4">
              <strong>キャンセルについて：</strong><br />
              制作開始前であればキャンセル可能です。制作開始後のキャンセルはお受けできません。
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">免責事項</h2>
          <div className="text-gray-700 space-y-2">
            <ul className="list-disc list-inside space-y-1">
              <li>天災地変、その他の不可抗力により、商品の提供が困難になった場合</li>
              <li>お客様のご都合による制作内容の変更により追加費用が発生した場合</li>
              <li>第三者の権利侵害に関する責任はお客様にあります</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">個人情報の取扱い</h2>
          <p className="text-gray-700">
            お客様の個人情報については、当社の<a href="/privacy" className="text-blue-600 hover:underline">プライバシーポリシー</a>に従って適切に管理いたします。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">表示義務等に関する事項</h2>
          <p className="text-gray-700">
            この表記は、特定商取引法第11条（通信販売についての広告）、第12条（誇大広告等の禁止）、第13条（未承諾者に対する電子メール広告の提供の禁止）に基づいて表示しています。
          </p>
        </section>
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-gray-600">
          最終更新日：2024年1月1日
        </p>
      </div>
    </div>
  )
}