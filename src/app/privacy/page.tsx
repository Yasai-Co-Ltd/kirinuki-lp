import { Metadata } from 'next'
import Layout from '../../components/layout/Layout'

export const metadata: Metadata = {
  title: 'プライバシーポリシー | DOGA NO AIKATA',
  description: 'プライバシーポリシー',
}

export default function PrivacyPage() {
  return (
    <Layout>
      <div id='privacy' className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">プライバシーポリシー</h1>
      
      <div className="space-y-6">
        <section>
          <p className="text-gray-700 mb-6">
            YASAI株式会社（以下「当社」）は、お客様の個人情報の保護を重要な責務と考え、個人情報の保護に関する法律、その他の関係法令等を遵守し、お客様の個人情報を適切に取り扱います。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">1. 個人情報の定義</h2>
          <p className="text-gray-700">
            本プライバシーポリシーにおいて「個人情報」とは、個人情報の保護に関する法律に定められた「個人情報」を指し、生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日その他の記述等により特定の個人を識別することができるもの（他の情報と容易に照合することができ、それにより特定の個人を識別することができることとなるものを含みます）を指します。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">2. 個人情報の収集方法</h2>
          <div className="text-gray-700 space-y-2">
            <p>当社は、以下の方法により個人情報を収集いたします：</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>お客様が当社サービスをご利用の際に入力いただく情報</li>
              <li>お問い合わせフォームからのお問い合わせ</li>
              <li>注文フォームでのご注文時</li>
              <li>メールでのやり取り</li>
              <li>Cookieやアクセスログ等の技術的情報</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">3. 収集する個人情報の項目</h2>
          <div className="text-gray-700 space-y-2">
            <p>当社が収集する個人情報は以下の通りです：</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>氏名</li>
              <li>メールアドレス</li>
              <li>電話番号</li>
              <li>会社名・団体名（法人のお客様の場合）</li>
              <li>お支払い情報（クレジットカード情報等）</li>
              <li>IPアドレス、ブラウザ情報、アクセス日時等の技術的情報</li>
              <li>その他、サービス提供に必要な情報</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">4. 個人情報の利用目的</h2>
          <div className="text-gray-700 space-y-2">
            <p>当社は、収集した個人情報を以下の目的で利用いたします：</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>サービスの提供・運営</li>
              <li>お客様からのお問い合わせへの対応</li>
              <li>注文の処理・決済・商品の提供</li>
              <li>メンテナンス、重要なお知らせなど必要に応じた連絡</li>
              <li>利用規約に違反したユーザーや、不正・不当な目的でサービスを利用しようとするユーザーの特定と利用拒否</li>
              <li>サービスの改善・新サービスの開発</li>
              <li>マーケティング・統計分析</li>
              <li>上記の利用目的に付随する目的</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">5. 個人情報の第三者提供</h2>
          <div className="text-gray-700 space-y-2">
            <p>当社は、以下の場合を除き、あらかじめお客様の同意を得ることなく、第三者に個人情報を提供することはありません：</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>法令に基づく場合</li>
              <li>人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難である場合</li>
              <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難である場合</li>
              <li>国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがある場合</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">6. 個人情報の委託</h2>
          <div className="text-gray-700 space-y-2">
            <p>当社は、利用目的の達成に必要な範囲内において、個人情報の取扱いの全部または一部を第三者に委託することがあります。この場合、当社は以下の対応を行います：</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>委託先の選定にあたり、個人情報の安全管理が図られるよう適切な委託先を選定</li>
              <li>委託契約において個人情報の適切な取扱いに関する事項を規定</li>
              <li>委託先における個人情報の取扱状況を適切に監督</li>
            </ul>
            <p className="mt-4">主な委託先：</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>決済代行会社（Stripe Inc.）</li>
              <li>メール配信サービス</li>
              <li>クラウドストレージサービス</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">7. 個人情報の保存期間</h2>
          <p className="text-gray-700">
            当社は、個人情報の利用目的が達成された後、法令等で定められた保存期間を考慮し、適切な期間内に個人情報を削除いたします。ただし、法令等により保存が義務付けられている場合は、当該期間中保存いたします。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">8. Cookieの使用について</h2>
          <div className="text-gray-700 space-y-2">
            <p>当社のウェブサイトでは、サービスの利便性向上のためCookieを使用する場合があります：</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>ウェブサイトの利用状況の分析</li>
              <li>ユーザーエクスペリエンスの向上</li>
              <li>広告の最適化</li>
            </ul>
            <p className="mt-4">
              Cookieの使用を希望されない場合は、ブラウザの設定により無効にすることができますが、一部のサービスが正常に機能しない場合があります。
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">9. 個人情報の開示・訂正・削除等</h2>
          <div className="text-gray-700 space-y-2">
            <p>お客様は、当社の保有する自己の個人情報について、以下の権利を有します：</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>個人情報の開示</li>
              <li>個人情報の訂正・追加・削除</li>
              <li>個人情報の利用停止・消去</li>
              <li>個人情報の第三者提供の停止</li>
            </ul>
            <p className="mt-4">
              これらの請求をされる場合は、<a href="/contact" className="text-blue-600 hover:underline">お問い合わせフォーム</a>よりご連絡ください。本人確認を行った上で、合理的な期間内に対応いたします。
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">10. 個人情報の安全管理</h2>
          <div className="text-gray-700 space-y-2">
            <p>当社は、個人情報の漏洩、滅失または毀損の防止その他の個人情報の安全管理のために必要かつ適切な措置を講じます：</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>組織的安全管理措置</li>
              <li>人的安全管理措置</li>
              <li>物理的安全管理措置</li>
              <li>技術的安全管理措置</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">11. 未成年者の個人情報</h2>
          <p className="text-gray-700">
            当社は、未成年者から個人情報を収集する場合、保護者の同意を得た上で収集いたします。未成年者が保護者の同意なく個人情報を提供したことが判明した場合、速やかに当該個人情報を削除いたします。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">12. プライバシーポリシーの変更</h2>
          <p className="text-gray-700">
            当社は、法令の変更や事業内容の変更等に伴い、本プライバシーポリシーを変更することがあります。変更後のプライバシーポリシーは、当社ウェブサイトに掲載した時点から効力を生じるものとします。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">13. お問い合わせ窓口</h2>
          <div className="text-gray-700">
            <p>個人情報の取扱いに関するお問い合わせは、以下までご連絡ください：</p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p><strong>YASAI株式会社</strong></p>
              <p>〒550-0014<br />大阪府大阪市西区北堀江1-19-1八光心斎橋AIRビル7F</p>
              <p>電話：06-7777-3669</p>
              <p>お問い合わせフォーム：<a href="/contact" className="text-blue-600 hover:underline">こちら</a></p>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-gray-600">
          制定日：2025年7月25日<br />
        </p>
      </div>
      </div>
    </Layout>
  )
}