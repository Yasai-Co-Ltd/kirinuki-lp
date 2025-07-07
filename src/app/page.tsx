'use client'

import Image from 'next/image'
import Link from 'next/link'
import Layout from '../components/layout/Layout'

export default function Home() {
  return (
    <Layout>
      {/* メイン画像 */}
      <div id="hero-section">
        <div>
          <div className="hero-text">
            <p>切り抜きは丸投げ！<br />
            <span className="highlight">格安・最短当日納品</span>の<br />
            動画切り抜きサービス</p>
          </div>

          <div className="hero-buttons">
            <p><Link href="/order"><i className="fa-solid fa-video"></i>今すぐ注文する</Link></p>
            <p><Link href="#plan"><i className="fa-solid fa-yen-sign"></i>料金を見る</Link></p>
          </div>
        </div>
      </div>

      {/* こんなお悩みありませんか？ */}
      <section className="bg1 bg-pattern1 arrow">
        <h2 className="c">動画編集でこんなお悩みありませんか？<span>Do you have any of these problems?</span></h2>

        <div className="feature-cards">
          <div className="feature-card bg-dark up">
            <figure className="card-icon"><Image src="/images/icon1.png" alt="" width={60} height={60} /></figure>
            <h4 className="decorated">切り抜きチームを<span className="color-check">内製したいけど人材</span>がいない…</h4>
            <p>切り抜き動画編集ができるスタッフを採用したいが、スキルのある人材が見つからない。外注費を抑えるために内製化したいけど、教育コストも心配。</p>
            {/* <span className="card-number">01</span> */}
          </div>

          <div className="feature-card bg-dark up">
            <figure className="card-icon"><Image src="/images/icon2.png" alt="" width={60} height={60} /></figure>
            <h4 className="decorated">外部に委託したいが<span className="color-check">品質や納期が不安</span>…</h4>
            <p>フリーランスに依頼したものの、品質にばらつきがあったり納期が遅れたりで安定しない。継続的に高品質な動画を制作してもらえる業者を探している。</p>
            {/* <span className="card-number">02</span> */}
          </div>

          <div className="feature-card bg-dark up">
            <figure className="card-icon"><Image src="/images/icon3.png" alt="" width={60} height={60} /></figure>
            <h4 className="decorated">大量に切り抜き動画を制作したいけど<span className="color-check">費用が</span>…</h4>
            <p>再生回数を伸ばすために切り抜き動画を大量に投稿したいが、どれくらい費用がかかるか不安。大量制作するための効率的な仕組みや体制作りが分からない。</p>
            {/* <span className="card-number">03</span> */}
          </div>
        </div>
      </section>

      {/* 全てビデオプロが解決します！ */}
      <section className="bg-primary-color">
        <div className="c">
          <h2 className="inline-block relative">
            全て動画のAIKATAが解決します！
            {/* <div><Image src="/images/onayami.png" alt="そのお悩み" width={200} height={100} /></div> */}
          </h2>
        </div>

        <div className="feature-cards">
          <div className="feature-card up">
            <figure className="card-icon"><Image src="/images/icon1.png" alt="" width={60} height={60} /></figure>
            <h4><span className="marker">AI活用で従来の3倍速い制作スピード</span></h4>
            <p>最新のAI技術を駆使して、動画解析から編集まで自動化。人の手だけでは不可能な高速処理により、最短12時間で高品質な動画をお届けします。</p>
            {/* <span className="card-number">01</span> */}
          </div>

          <div className="feature-card up">
            <figure className="card-icon"><Image src="/images/icon2.png" alt="" width={60} height={60} /></figure>
            <h4><span className="marker">AIデータ分析による確実にバズる編集</span></h4>
            <p>10,000本以上の動画データをAIが分析し、再生数・エンゲージメント率の高いパターンを特定。人間の感覚だけでは見つけられない「バズる法則」を動画に反映します。</p>
            {/* <span className="card-number">02</span> */}
          </div>

          <div className="feature-card up">
            <figure className="card-icon"><Image src="/images/icon3.png" alt="" width={60} height={60} /></figure>
            <h4><span className="marker">AI効率化により実現した圧倒的コスパ</span></h4>
            <p>AI技術による作業効率化で、従来の半額以下を実現。1本あたり1,500円〜の業界最安値でありながら、品質は従来の手作業を上回る高水準を保証します。</p>
            {/* <span className="card-number">03</span> */}
          </div>
        </div>
      </section>

      {/* お客様の声 - 一時的に非表示 */}
      {/* <section className="bg3 bg-pattern3" id="koe">
        <h2 className="c">お客様の声<span>Customer Testimonials</span></h2>

        <div className="content-blocks">
          <div className="content-item up">
            <figure><Image src="/images/photo1.jpg" alt="" width={200} height={200} /></figure>
            <div className="text">
              <h4>AI分析のおかげで再生数が5倍に！</h4>
              <p>AIが過去の成功動画を分析して最適な編集パターンを提案してくれるので、確実にバズる動画が作れるようになりました。制作スピードも従来の3倍速くなり、登録者数が3ヶ月で1,000人から10,000人に急成長！</p>
              <p className="author-name">YouTuber Aさん（ゲーム実況）</p>
            </div>
          </div>

          <div className="content-item up reverse">
            <figure><Image src="/images/photo2.jpg" alt="" width={200} height={200} /></figure>
            <div className="text">
              <h4>AI活用で編集時間が1/10、品質は2倍に！</h4>
              <p>AIが自動で最適なカット点を見つけてくれるので、以前8時間かかっていた編集が今では30分程度で完了。しかも品質は手作業の時より格段に向上しています。浮いた時間で企画に集中できるようになりました。</p>
              <p className="author-name">ビジネス系YouTuber Bさん</p>
            </div>
          </div>

          <div className="content-item up">
            <figure><Image src="/images/photo3.jpg" alt="" width={200} height={200} /></figure>
            <div className="text">
              <h4>AIの精密分析で確実にバズる動画に</h4>
              <p>AIが視聴者の行動パターンを分析して、どの瞬間で離脱するか、どこで興味を持つかを正確に予測。その結果、再生数が平均5倍、視聴完了率も80%以上を達成できました。データに基づいた確実な成果です！</p>
              <p className="author-name">エンタメ系YouTuber Cさん</p>
            </div>
          </div>
        </div>

        <div className="r"><p className="action-btn"><Link href="#" className="inline-block">もっと見る</Link></p></div>
      </section> */}

      {/* サービス詳細説明 */}
      <section className="bg3 bg-pattern3">
        <h2 className="c">サービス詳細<span>Service Details</span></h2>

        <div className="content-blocks">
          <div className="content-item up">
            <div className="text">
              <h4><i className="fa-solid fa-scissors"></i>1本の長編動画から複数の切り抜き動画を制作</h4>
              <p>お客様の長時間配信やセミナー動画から、AIが自動で面白いシーンやハイライト部分を抽出。1本の元動画から5〜10本の魅力的な切り抜き動画を制作します。各切り抜きは独立したコンテンツとして最適化され、より多くの視聴者にリーチできます。</p>
            </div>
          </div>

          <div className="content-item up">
            <div className="text">
              <h4><i className="fa-solid fa-clock"></i>動画の長さに応じた柔軟な料金設定</h4>
              <p>元動画の長さに応じて最適な料金プランをご提案。30分以下の短時間動画から、3時間を超える長時間配信まで対応可能です。長時間の動画ほど多くの切り抜きが作成でき、1本あたりの単価がお得になる仕組みです。</p>
            </div>
          </div>

          <div className="content-item up">
            <div className="text">
              <h4><i className="fa-solid fa-chart-line"></i>AIによる最適なシーン抽出</h4>
              <p>10,000本以上の動画データを学習したAIが、視聴者の興味を引くシーンを自動判定。感情の変化、音声の盛り上がり、視覚的なインパクトなど、複数の要素を総合的に分析して、バズりやすいシーンを確実に抽出します。</p>
            </div>
          </div>
        </div>
      </section>

      {/* 制作サンプル */}
      <section id="products">
        <h2 className="bg-slideup">
          <div className="image">
            <div className="en-text">Production Samples</div>
            <div className="jp-text">制作サンプル</div>
          </div>
        </h2>

        <div className="sample-intro">
          <p className="c">元のYouTube動画から、このような魅力的な切り抜き動画を制作いたします</p>
        </div>

        <div className="production-samples">
          {/* サンプル1: ゲーム実況 */}
          <div className="sample-item up">
            <div className="sample-header">
              <h3><i className="fa-solid fa-gamepad"></i>ゲーム実況動画の制作例</h3>
            </div>
            <div className="before-after-container">
              <div className="before-section">
                <h4>Before（元動画）</h4>
                <div className="video-placeholder">
                  <Image src="/images/thumb1.jpg" alt="元動画サムネイル" width={300} height={200} />
                  <div className="video-info">
                    <p><i className="fa-solid fa-clock"></i>2時間30分の配信動画</p>
                    <p><i className="fa-solid fa-eye"></i>視聴者の離脱が多い長時間配信</p>
                  </div>
                </div>
              </div>
              <div className="arrow-section">
                <i className="fa-solid fa-arrow-right"></i>
                <span>AI分析・編集</span>
              </div>
              <div className="after-section">
                <h4>After（切り抜き動画）</h4>
                <div className="clips-grid">
                  <div className="clip-item">
                    <Image src="/images/thumb2.jpg" alt="切り抜き1" width={150} height={100} />
                    <p>神プレイシーン<br />90秒</p>
                  </div>
                  <div className="clip-item">
                    <Image src="/images/thumb3.jpg" alt="切り抜き2" width={150} height={100} />
                    <p>面白リアクション<br />60秒</p>
                  </div>
                  <div className="clip-item">
                    <Image src="/images/thumb4.jpg" alt="切り抜き3" width={150} height={100} />
                    <p>攻略解説<br />120秒</p>
                  </div>
                </div>
                <div className="result-stats">
                  <p><i className="fa-solid fa-chart-line"></i>再生数 5倍アップ</p>
                  <p><i className="fa-solid fa-heart"></i>エンゲージメント率 300%向上</p>
                </div>
              </div>
            </div>
          </div>

          {/* サンプル2: ビジネス系 */}
          <div className="sample-item up">
            <div className="sample-header">
              <h3><i className="fa-solid fa-briefcase"></i>ビジネス系解説動画の制作例</h3>
            </div>
            <div className="before-after-container">
              <div className="before-section">
                <h4>Before（元動画）</h4>
                <div className="video-placeholder">
                  <Image src="/images/thumb5.jpg" alt="元動画サムネイル" width={300} height={200} />
                  <div className="video-info">
                    <p><i className="fa-solid fa-clock"></i>1時間のセミナー動画</p>
                    <p><i className="fa-solid fa-eye"></i>重要ポイントが埋もれがち</p>
                  </div>
                </div>
              </div>
              <div className="arrow-section">
                <i className="fa-solid fa-arrow-right"></i>
                <span>AI分析・編集</span>
              </div>
              <div className="after-section">
                <h4>After（切り抜き動画）</h4>
                <div className="clips-grid">
                  <div className="clip-item">
                    <Image src="/images/thumb6.jpg" alt="切り抜き1" width={150} height={100} />
                    <p>核心ポイント<br />75秒</p>
                  </div>
                  <div className="clip-item">
                    <Image src="/images/thumb1.jpg" alt="切り抜き2" width={150} height={100} />
                    <p>実践テクニック<br />90秒</p>
                  </div>
                  <div className="clip-item">
                    <Image src="/images/thumb2.jpg" alt="切り抜き3" width={150} height={100} />
                    <p>Q&Aハイライト<br />60秒</p>
                  </div>
                </div>
                <div className="result-stats">
                  <p><i className="fa-solid fa-chart-line"></i>視聴完了率 80%達成</p>
                  <p><i className="fa-solid fa-share"></i>シェア数 10倍増加</p>
                </div>
              </div>
            </div>
          </div>

          {/* サンプル3: エンタメ系 */}
          <div className="sample-item up">
            <div className="sample-header">
              <h3><i className="fa-solid fa-star"></i>エンタメ・バラエティの制作例</h3>
            </div>
            <div className="before-after-container">
              <div className="before-section">
                <h4>Before（元動画）</h4>
                <div className="video-placeholder">
                  <Image src="/images/thumb3.jpg" alt="元動画サムネイル" width={300} height={200} />
                  <div className="video-info">
                    <p><i className="fa-solid fa-clock"></i>3時間のライブ配信</p>
                    <p><i className="fa-solid fa-eye"></i>面白シーンが点在</p>
                  </div>
                </div>
              </div>
              <div className="arrow-section">
                <i className="fa-solid fa-arrow-right"></i>
                <span>AI分析・編集</span>
              </div>
              <div className="after-section">
                <h4>After（切り抜き動画）</h4>
                <div className="clips-grid">
                  <div className="clip-item">
                    <Image src="/images/thumb4.jpg" alt="切り抜き1" width={150} height={100} />
                    <p>爆笑シーン<br />45秒</p>
                  </div>
                  <div className="clip-item">
                    <Image src="/images/thumb5.jpg" alt="切り抜き2" width={150} height={100} />
                    <p>感動の瞬間<br />80秒</p>
                  </div>
                  <div className="clip-item">
                    <Image src="/images/thumb6.jpg" alt="切り抜き3" width={150} height={100} />
                    <p>神回まとめ<br />120秒</p>
                  </div>
                </div>
                <div className="result-stats">
                  <p><i className="fa-solid fa-chart-line"></i>バズ率 400%向上</p>
                  <p><i className="fa-solid fa-users"></i>新規フォロワー 2000人獲得</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sample-cta">
          <p className="sample-note">※上記は制作サンプルです。実際の動画や画像は仮のものを使用しています。</p>
          <p className="action-btn"><Link href="/order">あなたの動画も切り抜いてみる</Link></p>
        </div>
      </section>

      {/* 料金プラン */}
      <section className="bg1 bg-pattern1" id="plan">
        <h2 className="c">料金プラン<span>Rate Plans</span></h2>
        
        <div className="content-blocks">
          <div className="content-item up">
            <div className="text">
              <h4><i className="fa-solid fa-info-circle"></i>動画の長さに応じた料金設定</h4>
              <p>元動画の長さによって最適な料金プランをご提案いたします。長時間の動画ほど多くの切り抜きが作成でき、1本あたりの単価がお得になります。</p>
            </div>
          </div>
        </div>

        <div className="scroll">
          <table className="ta1 plan">
            <thead>
              <tr>
                <th>&nbsp;</th>
                <th><i className="fa-solid fa-clock"></i>ショートプラン<span>30分以下<br /><span className="small">￥</span>8,000<span className="small">〜</span></span></th>
                <th><i className="fa-solid fa-clock"></i>スタンダードプラン<span>1時間以下<br /><span className="small">￥</span>15,000<span className="small">〜</span></span><span className="osusume">おすすめ</span></th>
                <th><i className="fa-solid fa-clock"></i>ロングプラン<span>3時間以下<br /><span className="small">￥</span>25,000<span className="small">〜</span></span></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>元動画の長さ</td>
                <td>30分以下</td>
                <td>30分〜1時間</td>
                <td>1時間〜3時間</td>
              </tr>
              <tr>
                <td>切り抜き動画数</td>
                <td>3〜5本</td>
                <td>5〜8本</td>
                <td>8〜12本</td>
              </tr>
              <tr>
                <td>1本あたり単価</td>
                <td>約1,600円〜</td>
                <td>約1,875円〜</td>
                <td>約2,083円〜</td>
              </tr>
              <tr>
                <td>納期</td>
                <td>24時間以内</td>
                <td>48時間以内</td>
                <td>72時間以内</td>
              </tr>
              <tr>
                <td>修正回数</td>
                <td>2回まで</td>
                <td>3回まで</td>
                <td>5回まで</td>
              </tr>
              <tr>
                <td>サムネイル制作</td>
                <td>各動画1案</td>
                <td>各動画2案</td>
                <td>各動画3案</td>
              </tr>
              <tr>
                <td>テロップ・効果音</td>
                <td>AI自動生成</td>
                <td>AI+手動調整</td>
                <td>AI+プロ仕上げ</td>
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
        
        <div className="content-blocks">
          <div className="content-item up">
            <div className="text">
              <h4><i className="fa-solid fa-plus-circle"></i>3時間を超える長時間動画も対応可能</h4>
              <p>3時間を超える長時間配信やセミナー動画も承ります。動画の長さや内容に応じて個別にお見積もりいたします。お気軽にお問い合わせください。</p>
            </div>
          </div>
        </div>
      </section>

      {/* 注意事項・ご利用前の確認事項 */}
      <section className="bg2 bg-pattern2" id="notice">
        <h2 className="c">ご利用前の注意事項<span>Important Notice</span></h2>

        <div className="content-blocks">
          <div className="content-item up">
            <div className="text">
              <h4><i className="fa-solid fa-video"></i>動画の長さと内容について</h4>
              <p>AIが動画内の音声を分析し、会話を検出します。最適な結果を得るには、動画に会話が含まれていることを確認してください。長い動画（15分以上を推奨）では、より多くのコンテンツが提供され、より鮮明で多様なコンテンツは、AIが適切なクリッピングポイントを見つけるのに役立ちます。</p>
            </div>
          </div>

          <div className="content-item up">
            <div className="text">
              <h4><i className="fa-solid fa-clock"></i>切り抜き動画の長さ設定について</h4>
              <p>「自動」またはより長い継続時間（「60～90秒」など）を選択すると、切り抜き動画の数が少なくなり、切り抜き動画が長くなります。より多くの切り抜き動画をご希望の場合は、アップロード前に切り抜き動画の長さとして「30秒未満」を選択してください。</p>
            </div>
          </div>

          <div className="content-item up">
            <div className="text">
              <h4><i className="fa-solid fa-chart-bar"></i>コンテンツの適合性について</h4>
              <p>AIはインタビュー形式の動画など、特定のコンテンツタイプで優れたパフォーマンスを発揮します。コンテンツが一致しない場合は、生成される切り抜き動画の数が少なくなる可能性があります。動画に十分なコンテンツがない場合、AIは切り抜き動画を生成しません。</p>
            </div>
          </div>
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
              <dt className="openclose">どのような動画でも編集対応可能ですか？</dt>
              <dd>ゲーム実況、トーク配信、教育コンテンツ、ライブ配信など、ほぼ全てのジャンルに対応しています。著作権に問題がない動画であれば、どのような内容でも承ります。</dd>

              <dt className="openclose">なぜそんなに早く高品質な動画が作れるのですか？</dt>
              <dd>最新のAI技術を活用して動画解析から編集まで自動化しているためです。AIが最適なカット点やテロップ位置を瞬時に判断し、従来の手作業では不可能な高速処理を実現。プロプランなら最短6時間でお届けできます。</dd>

              <dt className="openclose">修正は何回まで対応してもらえますか？</dt>
              <dd>ライトプランは1回まで、スタンダードプランは3回まで、プロプランは無制限で修正対応いたします。お客様にご満足いただけるまで調整させていただきます。</dd>

              <dt className="openclose">サムネイル制作も含まれていますか？</dt>
              <dd>スタンダードプラン以上にはサムネイル制作が含まれています。プロプランでは3案ご提示し、お好みのデザインをお選びいただけます。ライトプランは別途料金となります。</dd>

              <dt className="openclose">どのような形式で動画を納品してもらえますか？</dt>
              <dd>MP4形式での納品が基本となります。YouTubeやTikTok、Instagram等、各プラットフォームに最適化した設定で書き出しいたします。特別な形式をご希望の場合はご相談ください。</dd>

              <dt className="openclose">どのような動画が最適な結果を得られますか？</dt>
              <dd>AIが動画内の音声を分析し、会話を検出するため、会話が含まれている動画で最適な結果を得られます。長い動画（15分以上を推奨）では、より多くのコンテンツが提供され、AIが適切なクリッピングポイントを見つけやすくなります。インタビュー形式の動画などで特に優れたパフォーマンスを発揮します。</dd>

              <dt className="openclose">クリップの長さは調整できますか？</dt>
              <dd>はい、クリップの長さは調整可能です。「自動」またはより長い継続時間（「60～90秒」など）を選択すると、クリップの数が少なくなり、クリップが長くなります。より多くのクリップをご希望の場合は、アップロード前に「30秒未満」を選択してください。</dd>

              <dt className="openclose">AIがクリップを生成しない場合はありますか？</dt>
              <dd>はい、動画に十分なコンテンツがない場合や、コンテンツがAIの分析に適さない場合、クリップが生成されない可能性があります。その場合でも、エディターを使用して手動でクリップを作成したり、AIによって生成されたクリップを調整することが可能です。</dd>

              <dt className="openclose">より多くのクリップを作成するにはどうすればよいですか？</dt>
              <dd>より多くのクリップを作成するには、以下の方法をお試しください：1）アップロード前にクリップの長さとして「30秒未満」を選択する、2）エディターで動画を手動でクリップする。また、より鮮明で多様なコンテンツを含む動画をご提供いただくと、AIが適切なクリッピングポイントを見つけやすくなります。</dd>
            </dl>
          </div>
        </div>

        <div className="r"><p className="action-btn"><Link href="#" className="inline-block">もっと見る</Link></p></div>
      </section>

      {/* 制作の流れ */}
      <section className="bg2 bg-pattern2" id="flow">
        <h2 className="c">制作の流れ<span>Production Flow</span></h2>

        <div className="content-blocks process-flow">
          <div className="content-item up">
            <div className="text">
              <h4><i className="fa-solid fa-upload"></i>動画素材のアップロード</h4>
              <p>お客様の元動画をクラウドストレージ経由でアップロードしていただきます。YouTube動画のURLでも対応可能です。編集したい部分の指定や、特別なご要望があれば詳細をお聞かせください。長時間の動画でも問題ありません。</p>
            </div>
          </div>

          <div className="content-item up">
            <div className="text">
              <h4><i className="fa-solid fa-scissors"></i>AI×プロによる超高速編集</h4>
              <p>AIが動画を自動解析し、最適なカット点・テロップ位置・効果音タイミングを瞬時に特定。その後、経験豊富な編集者が最終調整を行い、従来の3倍速で高品質な動画を完成させます。AIの精密さと人間の感性を融合した最高品質をお届けします。</p>
            </div>
          </div>

          <div className="content-item up">
            <div className="text">
              <h4><i className="fa-solid fa-eye"></i>品質チェック＆確認</h4>
              <p>編集完了後、品質チェックを行い、お客様に確認用動画をお送りします。修正が必要な箇所があれば、プランに応じた回数まで無料で対応いたします。ご満足いただけるまで調整を重ねます。</p>
            </div>
          </div>

          <div className="content-item up">
            <div className="text">
              <h4><i className="fa-solid fa-download"></i>完成動画の納品</h4>
              <p>最終確認後、完成した動画とサムネイルをお客様にお渡しします。YouTubeやTikTokなど、各プラットフォームに最適化した形式で納品。アップロード方法のサポートも行っております。</p>
            </div>
          </div>
        </div>
      </section>

      {/* テキストスライドショー */}
      <div className="text-slide-wrapper">
        <div className="text-slide">
          <span>AIKATA</span>
        </div>
      </div>

      {/* 会社概要 */}
      {/* <section id="company">
        <div className="bg-slideup mb-space-large">
          <div className="image"></div>
        </div>

        <div className="c2">
          <div className="title">
            <h2>サービス概要<span>About Service</span></h2>
          </div>

          <div className="text">
            <table className="ta1">
              <caption>ビデオプロについて</caption>
              <tbody>
                <tr>
                  <th>サービス名</th>
                  <td>ビデオプロ - AI活用による高速・高品質動画制作サービス</td>
                </tr>
                <tr>
                  <th>対応ジャンル</th>
                  <td>ゲーム実況、トーク配信、教育コンテンツ、ライブ配信、エンタメ等</td>
                </tr>
                <tr>
                  <th>納期</th>
                  <td>最短6時間〜24時間（AI技術により従来の3倍速を実現）</td>
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
      </section> */}

      {/* 問い合わせ＆見積もり依頼 */}
      <section className="padding0">
        <h2 className="dn">問い合わせ＆見積もり依頼</h2>

        <div className="cta-section">
          <div className="cta-card bg-contact">
            <div className="text">
              <h4><span className="sub-text">今すぐ注文</span><span className="cta-main-text">Order Now</span></h4>
              <p className="action-btn"><Link href="/order">オンライン注文</Link></p>
            </div>
          </div>

          <div className="cta-card bg-order">
            <div className="text">
              <h4><span className="sub-text">お問い合わせ</span><span className="cta-main-text">Contact</span></h4>
              <p className="action-btn"><Link href="/contact">お問い合わせフォーム</Link></p>
            </div>
          </div>
        </div>
      </section>

      {/* 新着情報 */}
      {/* <section>
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
      </section> */}

      {/* サムネイルスライドショー */}
      {/* <section className="padding-lr0">
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
      </section> */}

      {/* ローディング */}
      <div id="startup-loader">
        <Image src="/images/logo.png" alt="VIDEO PRO" width={300} height={90} />
        <div className="loader-progress-container">
          <div className="loader-progress-bar"></div>
        </div>
      </div>
    </Layout>
  )
}