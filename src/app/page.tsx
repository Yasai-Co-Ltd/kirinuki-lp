'use client'

import Image from 'next/image'
import Link from 'next/link'
import Layout from '../components/layout/Layout'

export default function Home() {
  return (
    <Layout>
      {/* メイン画像 */}
      <div id="mainimg">
        <div>
          <div className="text">
            <p>バズる切り抜き動画を<br />
            <span className="highlight">最短24時間</span>で<br />
            格安制作いたします</p>
          </div>

          <div className="btn">
            <p><Link href="/contact"><i className="fa-solid fa-video"></i>今すぐ依頼する</Link></p>
            <p><Link href="#plan"><i className="fa-solid fa-yen-sign"></i>料金を見る</Link></p>
          </div>
        </div>
      </div>

      {/* こんなお悩みありませんか？ */}
      <section className="bg1 bg-pattern1 arrow">
        <h2 className="c">YouTubeでこんなお悩みありませんか？<span>Do you have any of these problems?</span></h2>

        <div className="list-grid1">
          <div className="list bg-black up">
            <figure className="icon"><Image src="/images/icon1.png" alt="" width={60} height={60} /></figure>
            <h4 className="kazari">切り抜きチームを<span className="color-check">内製したいけど人材</span>がいない…</h4>
            <p>動画編集ができるスタッフを採用したいが、スキルのある人材が見つからない。外注費を抑えるために内製化したいけど、教育コストも心配。</p>
            <span className="num">01</span>
          </div>

          <div className="list bg-black up">
            <figure className="icon"><Image src="/images/icon2.png" alt="" width={60} height={60} /></figure>
            <h4 className="kazari">外部に委託したが<span className="color-check">品質や納期が不安</span>…</h4>
            <p>フリーランスに依頼したものの、品質にばらつきがあったり納期が遅れたりで安定しない。継続的に高品質な動画を制作してもらえる業者を探している。</p>
            <span className="num">02</span>
          </div>

          <div className="list bg-black up">
            <figure className="icon"><Image src="/images/icon3.png" alt="" width={60} height={60} /></figure>
            <h4 className="kazari">大量に切り抜き動画を<span className="color-check">作成したいけど難しい</span>…</h4>
            <p>チャンネル登録者を増やすために毎日複数本投稿したいが、一人では限界がある。大量制作するための効率的な仕組みや体制作りが分からない。</p>
            <span className="num">03</span>
          </div>
        </div>
      </section>

      {/* 全てキリヌキプロが解決します！ */}
      <section className="bg-primary-color">
        <div className="c">
          <h2 className="inline-block relative">
            全てキリヌキプロが解決します！
            <div><Image src="/images/onayami.png" alt="そのお悩み" width={200} height={100} /></div>
          </h2>
        </div>

        <div className="list-grid1">
          <div className="list up">
            <figure className="icon"><Image src="/images/icon1.png" alt="" width={60} height={60} /></figure>
            <h4><span className="marker">最短24時間で高品質な切り抜き動画</span></h4>
            <p>プロの動画編集者が、あなたの代わりに魅力的な切り抜き動画を制作。テロップ、効果音、カット編集まで全て込みで最短24時間でお届けします。</p>
            <span className="num">01</span>
          </div>

          <div className="list up">
            <figure className="icon"><Image src="/images/icon2.png" alt="" width={60} height={60} /></figure>
            <h4><span className="marker">バズるポイントを熟知した編集</span></h4>
            <p>1000本以上の切り抜き動画制作実績から、再生数が伸びるポイントを分析。視聴者が最後まで見たくなる構成とサムネイル制作をご提供します。</p>
            <span className="num">02</span>
          </div>

          <div className="list up">
            <figure className="icon"><Image src="/images/icon3.png" alt="" width={60} height={60} /></figure>
            <h4><span className="marker">月額制で安心の料金体系</span></h4>
            <p>1本あたり3,000円〜の明確な料金設定。月額プランなら更にお得に。追加料金なしで修正対応も可能で、安心してご利用いただけます。</p>
            <span className="num">03</span>
          </div>
        </div>
      </section>

      {/* お客様の声 */}
      <section className="bg3 bg-pattern3" id="koe">
        <h2 className="c">お客様の声<span>Customer Testimonials</span></h2>

        <div className="list-normal1">
          <div className="list up">
            <figure><Image src="/images/photo1.jpg" alt="" width={200} height={200} /></figure>
            <div className="text">
              <h4>チャンネル登録者数が3ヶ月で10倍に！</h4>
              <p>切り抜き動画の制作をお願いしてから、チャンネルの成長が劇的に変わりました。プロの編集技術で視聴者が最後まで見てくれる動画になり、登録者数が3ヶ月で1,000人から10,000人に！毎日投稿できるようになったのも大きいです。</p>
              <p className="name">YouTuber Aさん（ゲーム実況）</p>
            </div>
          </div>

          <div className="list up reverse">
            <figure><Image src="/images/photo2.jpg" alt="" width={200} height={200} /></figure>
            <div className="text">
              <h4>編集時間が1/10になって本業に集中できる</h4>
              <p>以前は1本の動画編集に8時間かかっていましたが、キリヌキプロさんにお任せしてからは企画と撮影だけに集中できるように。浮いた時間で新しいコンテンツ作りに取り組めて、チャンネル全体のクオリティが向上しました。</p>
              <p className="name">ビジネス系YouTuber Bさん</p>
            </div>
          </div>

          <div className="list up">
            <figure><Image src="/images/photo3.jpg" alt="" width={200} height={200} /></figure>
            <div className="text">
              <h4>バズる切り抜きのコツを教えてもらえた</h4>
              <p>ただ編集してもらうだけでなく、どの部分が視聴者に刺さるかアドバイスもいただけます。サムネイルのデザインやタイトルの付け方まで相談できて、再生数が平均3倍になりました。まさにプロの技術です！</p>
              <p className="name">エンタメ系YouTuber Cさん</p>
            </div>
          </div>
        </div>

        <div className="r"><p className="btn1"><Link href="#" className="inline-block">もっと見る</Link></p></div>
      </section>

      {/* 制作実績 */}
      <section id="products">
        <h2 className="bg-slideup">
          <div className="image">
            <div className="en-text">Video Production Portfolio</div>
            <div className="jp-text">制作実績</div>
          </div>
        </h2>

        <div className="list-grid-simple">
          {[1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6].map((num, index) => (
            <div key={index} className="list">
              <figure><Image src={`/images/thumb${num}.jpg`} alt="" width={200} height={150} /></figure>
              <h4 className="c">{
                index % 6 === 0 ? 'ゲーム実況切り抜き' :
                index % 6 === 1 ? 'ビジネス系解説動画' :
                index % 6 === 2 ? 'エンタメ・バラエティ' :
                index % 6 === 3 ? 'ライブ配信切り抜き' :
                index % 6 === 4 ? '教育・学習コンテンツ' :
                'トーク・対談動画'
              }</h4>
            </div>
          ))}
        </div>

        <p className="btn1"><Link href="#">もっと見る</Link></p>
      </section>

      {/* 料金プラン */}
      <section className="bg1 bg-pattern1" id="plan">
        <h2 className="c">料金プラン<span>Rate Plans</span></h2>

        <div className="scroll">
          <table className="ta1 plan blur">
            <thead>
              <tr>
                <th>&nbsp;</th>
                <th><i className="fa-solid fa-video"></i>ライトプラン<span><span className="small">￥</span>3,000<span className="small">/本</span></span></th>
                <th><i className="fa-solid fa-video"></i>スタンダードプラン<span><span className="small">￥</span>15,000<span className="small">/月</span></span><span className="osusume">おすすめ</span></th>
                <th><i className="fa-solid fa-video"></i>プロプラン<span><span className="small">￥</span>30,000<span className="small">/月</span></span></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>動画本数</td>
                <td>1本から対応</td>
                <td>月6本まで</td>
                <td>月12本まで</td>
              </tr>
              <tr>
                <td>納期</td>
                <td>3営業日</td>
                <td>24時間以内</td>
                <td>12時間以内</td>
              </tr>
              <tr>
                <td>修正回数</td>
                <td>1回まで</td>
                <td>3回まで</td>
                <td>無制限</td>
              </tr>
              <tr>
                <td>サムネイル制作</td>
                <td>別途料金</td>
                <td>込み</td>
                <td>込み（3案提示）</td>
              </tr>
              <tr>
                <td>テロップ・効果音</td>
                <td>基本のみ</td>
                <td>高品質対応</td>
                <td>プレミアム対応</td>
              </tr>
              <tr>
                <td>専属担当者</td>
                <td>なし</td>
                <td>あり</td>
                <td>あり（優先対応）</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* よく頂く質問 */}
      <section className="bg-primary-color" id="faq">
        <div className="c2">
          <div className="title">
            <h2>よく頂く質問<span>FAQ</span></h2>
          </div>

          <div className="text">
            <dl className="faq">
              <dt className="openclose">どのような動画でも切り抜き対応可能ですか？</dt>
              <dd>ゲーム実況、トーク配信、教育コンテンツ、ライブ配信など、ほぼ全てのジャンルに対応しています。著作権に問題がない動画であれば、どのような内容でも承ります。</dd>

              <dt className="openclose">納期はどのくらいかかりますか？</dt>
              <dd>プランによって異なりますが、スタンダードプランなら24時間以内、プロプランなら12時間以内にお届けします。ライトプランは3営業日となります。急ぎの場合はご相談ください。</dd>

              <dt className="openclose">修正は何回まで対応してもらえますか？</dt>
              <dd>ライトプランは1回まで、スタンダードプランは3回まで、プロプランは無制限で修正対応いたします。お客様にご満足いただけるまで調整させていただきます。</dd>

              <dt className="openclose">サムネイル制作も含まれていますか？</dt>
              <dd>スタンダードプラン以上にはサムネイル制作が含まれています。プロプランでは3案ご提示し、お好みのデザインをお選びいただけます。ライトプランは別途料金となります。</dd>

              <dt className="openclose">どのような形式で動画を納品してもらえますか？</dt>
              <dd>MP4形式での納品が基本となります。YouTubeやTikTok、Instagram等、各プラットフォームに最適化した設定で書き出しいたします。特別な形式をご希望の場合はご相談ください。</dd>
            </dl>
          </div>
        </div>

        <div className="r"><p className="btn1"><Link href="#" className="inline-block">もっと見る</Link></p></div>
      </section>

      {/* 制作の流れ */}
      <section className="bg2 bg-pattern2" id="flow">
        <h2 className="c">制作の流れ<span>Production Flow</span></h2>

        <div className="list-normal1 flow">
          <div className="list up">
            <div className="text">
              <h4><i className="fa-solid fa-upload"></i>動画素材のアップロード</h4>
              <p>お客様の元動画をクラウドストレージ経由でアップロードしていただきます。YouTube動画のURLでも対応可能です。切り抜きたい部分の指定や、特別なご要望があれば詳細をお聞かせください。長時間の動画でも問題ありません。</p>
            </div>
          </div>

          <div className="list up">
            <div className="text">
              <h4><i className="fa-solid fa-scissors"></i>プロによる編集作業</h4>
              <p>経験豊富な動画編集者が、視聴者が最後まで見たくなる構成で切り抜き編集を行います。テロップ挿入、効果音追加、カット編集など、バズる要素を盛り込んだ高品質な動画に仕上げます。サムネイル制作も同時に進行いたします。</p>
            </div>
          </div>

          <div className="list up">
            <div className="text">
              <h4><i className="fa-solid fa-eye"></i>品質チェック＆確認</h4>
              <p>編集完了後、品質チェックを行い、お客様に確認用動画をお送りします。修正が必要な箇所があれば、プランに応じた回数まで無料で対応いたします。ご満足いただけるまで調整を重ねます。</p>
            </div>
          </div>

          <div className="list up">
            <div className="text">
              <h4><i className="fa-solid fa-download"></i>完成動画の納品</h4>
              <p>最終確認後、完成した切り抜き動画とサムネイルをお客様にお渡しします。YouTubeやTikTokなど、各プラットフォームに最適化した形式で納品。アップロード方法のサポートも行っております。</p>
            </div>
          </div>
        </div>
      </section>

      {/* テキストスライドショー */}
      <div className="text-slide-wrapper">
        <div className="text-slide">
          <span>KIRINUKI PRO</span>
        </div>
      </div>

      {/* 会社概要 */}
      <section id="company">
        <div className="bg-slideup mb-space-large">
          <div className="image"></div>
        </div>

        <div className="c2">
          <div className="title">
            <h2>サービス概要<span>About Service</span></h2>
          </div>

          <div className="text">
            <table className="ta1">
              <caption>キリヌキプロについて</caption>
              <tbody>
                <tr>
                  <th>サービス名</th>
                  <td>キリヌキプロ - プロが作る切り抜き動画制作サービス</td>
                </tr>
                <tr>
                  <th>対応ジャンル</th>
                  <td>ゲーム実況、トーク配信、教育コンテンツ、ライブ配信、エンタメ等</td>
                </tr>
                <tr>
                  <th>納期</th>
                  <td>最短12時間〜3営業日（プランにより異なります）</td>
                </tr>
                <tr>
                  <th>対応時間</th>
                  <td>平日9:00〜18:00（土日祝日は翌営業日対応）</td>
                </tr>
                <tr>
                  <th>お支払い方法</th>
                  <td>クレジットカード、銀行振込、PayPal対応</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 問い合わせ＆見積もり依頼 */}
      <section className="padding0">
        <h2 className="dn">問い合わせ＆見積もり依頼</h2>

        <div className="list-c2">
          <div className="list image1">
            <div className="text">
              <h4><span className="sub-text">お問い合わせ</span><span className="main-text">Contact</span></h4>
              <p className="btn1"><Link href="/contact">お問い合わせフォーム</Link></p>
            </div>
          </div>

          <div className="list image2">
            <div className="text">
              <h4><span className="sub-text">無料見積もり</span><span className="main-text">Estimate</span></h4>
              <p className="btn1"><Link href="/form">見積もり依頼</Link></p>
            </div>
          </div>
        </div>
      </section>

      {/* 新着情報 */}
      <section>
        <div className="c2">
          <div className="title">
            <h2>新着情報<span>News</span></h2>
          </div>

          <div className="text">
            <dl className="new">
              <dt>2024/12/01</dt>
              <dd><span className="icon-bg1">重要</span>年末年始の営業時間変更のお知らせ</dd>
              <dt>2024/11/15</dt>
              <dd><span className="icon-bg2">サービス</span>TikTok向け縦型動画の制作サービスを開始しました</dd>
              <dt>2024/11/01</dt>
              <dd><span className="icon-bg2">サービス</span>プロプランに「12時間以内納品」オプションを追加</dd>
              <dt>2024/10/20</dt>
              <dd>お客様満足度調査で95%の高評価をいただきました</dd>
            </dl>
          </div>
        </div>
      </section>

      {/* サムネイルスライドショー */}
      <section className="padding-lr0">
        <div className="slide-thumbnail1">
          <div className="img rtl">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div key={num}><Image src={`/images/thumb${num}.jpg`} alt="" width={200} height={200} /></div>
            ))}
          </div>
        </div>

        <div className="slide-thumbnail1">
          <div className="img ltr">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div key={num}><Image src={`/images/thumb${num}.jpg`} alt="" width={200} height={200} /></div>
            ))}
          </div>
        </div>
      </section>

      {/* ローディング */}
      <div id="loading">
        <Image src="/images/logo.png" alt="KIRINUKI PRO" width={300} height={90} />
        <div className="progress-container">
          <div className="progress-bar"></div>
        </div>
      </div>
    </Layout>
  )
}