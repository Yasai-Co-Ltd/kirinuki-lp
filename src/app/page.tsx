'use client'

import Image from 'next/image'
import Link from 'next/link'
import Layout from '../components/layout/Layout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faScissors, faClock, faChartLine, faEye, faHeart, faBriefcase, faArrowRight, faStar, faUsers, faRobot, faCalculator, faInfo, faInfoCircle, faVideo, faChartBar, faGamepad, faShare, faUpload, faE, faDownload, faCut } from "@fortawesome/free-solid-svg-icons";
import { calculatePricePerClip, generatePricePerClipText, formatPrice } from '../lib/pricing';
import { ADMIN_CONFIG } from '../lib/admin-config';
import AdminPanel from '../components/admin/AdminPanel';

export default function Home() {
  return (
    <Layout>
      {/* メイン画像 */}
      <div id="hero-section">
        <div>
          <div className="hero-text">
            <p>切り抜きは<span className="highlight">AI</span>に丸投げ！<br />
            <span className="highlight">格安・当日〜2営業日納品</span>の<br />
            動画切り抜きサービス</p>
            <p className="hero-subtext">
              <FontAwesomeIcon icon={faCut} />
              1時間の動画から平均20〜30本作成<br />
              <span className="price-highlight">1本あたり200円〜360円</span>の圧倒的コスパ！
            </p>
          </div>

          <div className="hero-buttons">
            <p><Link href="/order">今すぐ注文する</Link></p>
            <p><Link href="#plan">料金を見る</Link></p>
          </div>
        </div>
      </div>

      {/* 切り抜き動画マーケティングの重要性 */}
      <section className="bg-primary-color marketing-importance">
        <div className="c">
          <h2 className="inline-block relative">
            切り抜き動画は<span className="highlight">これからのマーケティング</span>に重要！
            {/* <span className="subtitle">今がチャンス！2025年7月15日から収益化がストップ</span> */}
          </h2>
        </div>

        <div className="feature-cards">
          <div className="feature-card">
            <h4><span className="marker">切り抜き動画の市場が急拡大中</span></h4>
            <p>YouTubeやTikTokでの切り抜き動画の需要が爆発的に増加。短時間で要点を伝える切り抜き動画は、現代の視聴者のニーズに完璧にマッチしています。企業のマーケティング戦略において、もはや必須のツールとなっています。</p>
          </div>

          <div className="feature-card">
            <h4><span className="marker">2025年7月15日から収益化ストップ</span></h4>
            <p>YouTubeの新しいポリシーにより、2025年7月15日から切り抜き動画の収益化が大幅に制限されます。しかし、これは<strong>マーケティングツールとしての価値がさらに高まる</strong>ことを意味します。今こそ切り抜き動画を活用したブランディング戦略を始める絶好のタイミングです。</p>
          </div>

          <div className="feature-card">
            <h4><span className="marker">AIで効率的な制作が可能に</span></h4>
            <p>従来は時間とコストがかかっていた切り抜き動画制作が、AI技術により劇的に効率化。高品質な切り抜き動画を低コストで大量生産できるようになり、マーケティング戦略の幅が大きく広がります。</p>
          </div>
        </div>

        <div className="marketing-cta">
          <div className="urgency-message">
            <h3><FontAwesomeIcon icon={faInfoCircle} />今すぐ始めるべき理由</h3>
            <ul>
              <li>✓ 収益化制限前の今なら、まだ競合が少ない</li>
              <li>✓ マーケティングツールとしての価値は変わらず高い</li>
              <li>✓ AIによる効率化で、従来の1/10のコストで制作可能</li>
              <li>✓ 短時間動画への需要は今後も拡大し続ける</li>
            </ul>
          </div>
          <p className="action-btn"><Link href="/order">今すぐ切り抜き動画マーケティングを始める</Link></p>
        </div>
      </section>

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
            <h4 className="decorated">AIを活用して効率化したいけど<span className="color-check">難しい</span>…</h4>
            <p>動画編集にAIを導入して作業を効率化したいが、どのツールを選べばいいか分からない。AI技術の導入コストや学習コストが心配で、なかなか踏み出せない。</p>
            {/* <span className="card-number">03</span> */}
          </div>
        </div>
      </section>

      {/* 全てビデオプロが解決します！ */}
      <section className="bg-primary-color">
        <div className="c">
          <h2 className="inline-block relative">
            全てDOGA NO AIKATAが解決します！
            {/* <div><Image src="/images/onayami.png" alt="そのお悩み" width={200} height={100} /></div> */}
          </h2>
        </div>

        <div className="feature-cards">
          <div className="feature-card">
            <figure className="card-icon"><Image src="/images/icon1.png" alt="" width={60} height={60} /></figure>
            <h4><span className="marker">AI活用で従来の3倍速い制作スピード</span></h4>
            <p>最新のAI技術を駆使して、動画解析から編集まで自動化。人の手だけでは不可能な高速処理により、当日〜2営業日で高品質な動画をお届けします。</p>
            {/* <span className="card-number">01</span> */}
          </div>

          <div className="feature-card">
            <figure className="card-icon"><Image src="/images/icon2.png" alt="" width={60} height={60} /></figure>
            <h4><span className="marker">AIデータ分析によるバズる切り抜き</span></h4>
            <p>切り抜き動画に特化したAIが、再生数・エンゲージメント率の高いパターンを特定。人間の感覚だけでは見つけられない「バズる法則」を動画に反映します。</p>
            {/* <span className="card-number">02</span> */}
          </div>

          <div className="feature-card">
            <figure className="card-icon"><Image src="/images/icon3.png" alt="" width={60} height={60} /></figure>
            <h4><span className="marker">AI導入の複雑さを完全解決</span></h4>
            <p>面倒なAI技術の選定・導入・学習は一切不要。当サービスを利用するだけで、最新のAI技術による高品質な動画編集を即座に体験できます。専門知識不要で誰でも簡単にAI効率化を実現。</p>
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
      <section className="bg3 bg-pattern3" id="services">
        <h2 className="c">サービス詳細<span>Service Details</span></h2>

        <div className="content-blocks">
          <div className="content-item up">
            <div className="text">
              <h4><FontAwesomeIcon icon={faScissors} />1本の長編動画から複数の切り抜き動画を制作</h4>
              <p>お客様の長時間配信やセミナー動画から、AIが自動で面白いシーンやハイライト部分を抽出。1本の元動画から5〜10本の魅力的な切り抜き動画を制作します。各切り抜きは独立したコンテンツとして最適化され、より多くの視聴者にリーチできます。</p>
            </div>
          </div>

          <div className="content-item up">
            <div className="text">
              <h4><FontAwesomeIcon icon={faClock} />動画の長さに応じたシンプルな料金設定</h4>
              <p>基本料金100円/分に、選択したオプションの追加料金を加算するだけのシンプルな料金体系。短時間動画から長時間配信まで対応可能で、明確で分かりやすい料金設定です。</p>
            </div>
          </div>

          <div className="content-item up">
            <div className="text">
              <h4><FontAwesomeIcon icon={faChartLine} />AIによる最適なシーン抽出</h4>
              <p>切り抜き動画に特化したAIが、視聴者の興味を引くシーンを自動判定。感情の変化、音声の盛り上がり、視覚的なインパクトなど、複数の要素を総合的に分析して、バズりやすいシーンを確実に抽出します。</p>
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
          <p className="c">高品質な切り抜き動画の制作サンプルを準備中です</p>
        </div>

        {/* Coming Soon表示 */}
        <div className="coming-soon-container">
          <div className="coming-soon-content">
            <h3>制作サンプル</h3>
            <p className="coming-soon-text">Coming Soon...</p>
            <p className="coming-soon-description">
              現在、様々なジャンルの切り抜き動画サンプルを制作中です。<br />
              完成次第、こちらに掲載いたします。
            </p>
          </div>
        </div>

        {/* サンプル追加用のコメントアウト部分 - 後で簡単に有効化できるように */}
        {/*
        <div className="production-samples">
          {/* サンプル1: ゲーム実況 */}
          {/*
          <div className="sample-item up">
            <div className="sample-header">
              <h3><FontAwesomeIcon icon={faGamepad} />ゲーム実況動画の制作例</h3>
            </div>
            <div className="before-after-container">
              <div className="before-section">
                <h4>Before（元動画）</h4>
                <div className="video-placeholder">
                  <Image src="/images/thumb1.jpg" alt="元動画サムネイル" width={300} height={200} />
                  <div className="video-info">
                    <p><FontAwesomeIcon icon={faClock} />2時間30分の配信動画</p>
                    <p><FontAwesomeIcon icon={faEye} />視聴者の離脱が多い長時間配信</p>
                  </div>
                </div>
              </div>
              <div className="arrow-section">
                <FontAwesomeIcon icon={faArrowRight} />
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
                  <p><FontAwesomeIcon icon={faChartLine} />再生数 5倍アップ</p>
                  <p><FontAwesomeIcon icon={faHeart} />エンゲージメント率 300%向上</p>
                </div>
              </div>
            </div>
          </div>
          */}

          {/* 他のサンプルも同様にコメントアウト */}
          {/* サンプル追加時は上記のコメントアウトを外して使用 */}
        {/*
        </div>
        */}

        <div className="sample-cta">
          <p className="action-btn"><Link href="/order">切り抜き動画を作成する</Link></p>
        </div>
      </section>

      {/* 料金プラン */}
      <section className="bg1 bg-pattern1" id="plan">
        <h2 className="c">料金プラン<span>Rate Plans</span></h2>

        <div className="scroll">
          <table className="ta1 plan">
            <thead>
              <tr>
                <th>&nbsp;</th>
                <th>AIのみ<span>基本プラン<br /><span className="small">￥</span>100<span className="small">/分</span><span className='text-xs'>(元動画の長さ)</span></span></th>
                <th>AIのミスを人が確認！<span>高品質プラン<br /><span className="small">￥</span>{ADMIN_CONFIG.pricing.displayPrice}<span className="small">/分</span><span className='text-xs'>(元動画の長さ)</span></span><span className="osusume">おすすめ</span></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>料金</td>
                <td><strong>100円/分</strong></td>
                <td><strong>{ADMIN_CONFIG.pricing.displayPrice}円/分</strong><br /><span className="small">(基本料金+{ADMIN_CONFIG.pricing.humanReviewSurcharge}円)</span></td>
              </tr>
              <tr>
                <td>最低料金</td>
                <td>1,000円</td>
                <td>1,000円</td>
              </tr>
              <tr>
                <td>納期</td>
                <td>当日〜2営業日</td>
                <td>1〜3営業日</td>
              </tr>
              <tr>
                <td>品質チェック</td>
                <td>AI自動チェック</td>
                <td>
                  専門スタッフチェック
                  <p className='text-sm'>※字幕などのAIのミスをチェックして修正します。</p>
                  <p className='text-sm'>※1回のみお客様からの修正依頼に対応します。(大きなフォーマット変更などには対応できない場合がございます)</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* 1本あたりの価格セクション */}
        <div className="content-blocks">
          <div className="content-item up">
            <div className="text">
              <h4>1本あたりの価格（1時間動画の場合）</h4>
              <div className="per-clip-pricing">
                <div className="per-clip-card highlight-card">
                  <div className="per-clip-header">
                    <h5>AIのみプラン</h5>
                    <p className="total-price">総額 {formatPrice(6000)}</p>
                  </div>
                  <div className="per-clip-breakdown">
                    <p className="clip-count">20〜30本の切り抜き動画</p>
                    <p className="per-clip-price">{generatePricePerClipText(60, 'ai_only')}</p>
                  </div>
                </div>
                <div className="per-clip-card highlight-card">
                  <div className="per-clip-header">
                    <h5>高品質プラン</h5>
                    <p className="total-price">総額 {formatPrice(18000)}</p>
                  </div>
                  <div className="per-clip-breakdown">
                    <p className="clip-count">20〜30本の切り抜き動画</p>
                    <p className="per-clip-price">{generatePricePerClipText(60, 'human_review')}</p>
                  </div>
                </div>
              </div>
              <p className="per-clip-note">
                <FontAwesomeIcon icon={faInfoCircle} />
                ※1時間の動画から平均20〜30本の切り抜き動画が作成されます。動画の内容や設定により本数は変動します。
              </p>
            </div>
          </div>
        </div>
        
        <div className="content-blocks">
          <div className="content-item up">
            <div className="text">
              <h4>料金例</h4>
              <div className="pricing-examples">
                <div className="pricing-example-card">
                  <h5>15分動画（AIのみ）</h5>
                  <p className="price">1,500円</p>
                  <p className="calculation">100円 × 15分</p>
                </div>
                <div className="pricing-example-card">
                  <h5>30分動画（人の目で確認）</h5>
                  <p className="price price-premium">{formatPrice(ADMIN_CONFIG.pricing.displayPrice * 30)}</p>
                  <p className="calculation">{ADMIN_CONFIG.pricing.displayPrice}円 × 30分</p>
                </div>
                <div className="pricing-example-card">
                  <h5>1時間動画（人の目で確認）</h5>
                  <p className="price price-premium">{formatPrice(ADMIN_CONFIG.pricing.displayPrice * 60)}</p>
                  <p className="calculation">{ADMIN_CONFIG.pricing.displayPrice}円 × 60分</p>
                </div>
              </div>
              <p className="pricing-note">
                <FontAwesomeIcon icon={faInfoCircle} />
                ※生成される切り抜き動画の本数は、元動画の長さや内容によって変わります。一般的に15分以上の動画で最適な結果が得られます。
              </p>
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
              <h4>動画の長さと内容について</h4>
              <p>AIが動画内の音声を分析し、会話を検出します。最適な結果を得るには、動画に会話が含まれていることを確認してください。長い動画（15分以上を推奨）では、より多くのコンテンツが提供され、より鮮明で多様なコンテンツは、AIが適切な切り抜きポイントを見つけるのに役立ちます。</p>
            </div>
          </div>

          <div className="content-item up">
            <div className="text">
              <h4>切り抜き動画の長さ設定について</h4>
              <p>「自動」またはより長い時間（「60～90秒」など）を選択すると、切り抜き動画の数が少なくなり、切り抜き動画が長くなります。より多くの切り抜き動画をご希望の場合は、アップロード前に切り抜き動画の長さとして「30秒未満」を選択してください。</p>
            </div>
          </div>

          <div className="content-item up">
            <div className="text">
              <h4>コンテンツの適合性について</h4>
              <p>AIはインタビュー形式の動画など、特定のコンテンツタイプで優れたパフォーマンスを発揮します。コンテンツが一致しない場合は、生成される切り抜き動画の数が少なくなる可能性があります。動画に十分なコンテンツがない場合、AIは切り抜き動画を生成しません。</p>
            </div>
          </div>
        </div>
      </section>

      {/* よく頂く質問 */}
      <section className="bg-primary-color" id="faq">
        <div className="c2">
          <div className="title">
            <h2>よくある質問<span>FAQ</span></h2>
          </div>

          <div className="text">
            <dl className="faq">
              <dt className="openclose">料金はどのように計算されますか？</dt>
              <dd>元動画の長さ（分数）に応じて料金が決まります。AIのみの場合は1分あたり100円、人の目で確認する高品質プランは1分あたり{ADMIN_CONFIG.pricing.displayPrice}円です。最低料金は1,000円で、5分以下の動画でも最低料金が適用されます。例：15分動画（AIのみ）= 1,500円、30分動画（人の目で確認）= {formatPrice(ADMIN_CONFIG.pricing.displayPrice * 30)}</dd>

              <dt className="openclose">複数の動画を同時に依頼できますか？</dt>
              <dd>はい、複数の動画を同時にご依頼いただけます。各動画ごとに最低料金（1,000円）が適用され、動画数が多い場合は納期が延長される場合があります。3本を超える場合は追加の日数をいただく場合がございます。</dd>

              <dt className="openclose">どのような動画が最適な結果を得られますか？</dt>
              <dd>AIが動画内の音声を分析し、会話を検出するため、会話が含まれている動画で最適な結果を得られます。長い動画（15分以上を推奨）では、より多くのコンテンツが提供され、AIが適切なクリッピングポイントを見つけやすくなります。インタビュー形式の動画などで特に優れたパフォーマンスを発揮します。</dd>

              <dt className="openclose">納期はどのくらいですか？</dt>
              <dd>AIのみの場合は当日〜2営業日、人の目で確認する高品質プランは1〜3営業日でお届けします。動画の長さや複雑さ、動画数によって納期が変動する場合があります。30分を超える長時間動画や複数動画の場合は追加日数をいただく場合がございます。</dd>

              <dt className="openclose">修正対応はしてもらえますか？</dt>
              <dd>人の目で確認する高品質プランでは、1回のみお客様からの修正依頼に対応いたします。ただし、大きなフォーマット変更などには対応できない場合がございます。AIのみプランでは基本的に修正対応は行っておりません。</dd>

              <dt className="openclose">どのような動画でも編集対応可能ですか？</dt>
              <dd>ゲーム実況、トーク配信、教育コンテンツ、ライブ配信など、ほぼ全てのジャンルに対応しています。著作権に問題がない動画であれば、どのような内容でも承ります。ただし、会話が含まれていない動画や音声が不明瞭な動画では最適な結果が得られない場合があります。</dd>

              <dt className="openclose">切り抜き動画の長さは調整できますか？</dt>
              <dd>はい、切り抜き動画の長さは調整可能です。「自動」またはより長い継続時間（「60～90秒」など）を選択すると、切り抜き動画の数が少なくなり、切り抜き動画が長くなります。より多くの切り抜き動画をご希望の場合は、アップロード前に「30秒未満」を選択してください。</dd>

              <dt className="openclose">AIが切り抜き動画を生成しない場合はありますか？</dt>
              <dd>はい、動画に十分なコンテンツがない場合や、コンテンツがAIの分析に適さない場合、切り抜き動画が生成されない可能性があります。特に会話が少ない動画や音声が不明瞭な動画では、切り抜き動画が生成されない場合があります。</dd>

              <dt className="openclose">どのような形式で動画を納品してもらえますか？</dt>
              <dd>MP4形式での納品が基本となります。YouTubeやTikTok、Instagram等、各プラットフォームに最適化した設定で書き出しいたします。特別な形式をご希望の場合はご相談ください。</dd>

              <dt className="openclose">より多くの切り抜き動画を作成するにはどうすればよいですか？</dt>
              <dd>より多くの切り抜き動画を作成するには、以下の方法をお試しください：1）アップロード前に切り抜き動画の長さとして「30秒未満」を選択する、2）より鮮明で多様なコンテンツを含む動画をご提供いただく。また、15分以上の長い動画の方がAIが適切なクリッピングポイントを見つけやすくなります。</dd>
            </dl>
          </div>
        </div>
      </section>

      {/* 制作の流れ */}
      <section className="bg2 bg-pattern2" id="flow">
        <h2 className="c">制作の流れ<span>Production Flow</span></h2>

        <div className="content-blocks process-flow">
          <div className="content-item up">
            <div className="text">
              <h4><FontAwesomeIcon className="mr-4" icon={faVideo} />YouTube動画URL入力</h4>
              <p>切り抜きしたいYouTube動画のURLを入力するだけ。動画情報は自動で取得され、動画の長さに基づいて料金を自動計算します。字幕の有無やフォーマットもお選びいただけます。</p>
            </div>
          </div>

          <div className="content-item up">
            <div className="text">
              <h4><FontAwesomeIcon className="mr-4" icon={faCalculator} />自動見積もり＆決済</h4>
              <p>動画の長さから料金を自動算出し、その場で見積もりを確認できます。クレジットカードによる安全な決済システムで、簡単にお支払いが完了します。決済完了後、すぐに制作が開始されます。</p>
            </div>
          </div>

          <div className="content-item up">
            <div className="text">
              <h4><FontAwesomeIcon className="mr-4" icon={faRobot} />AI自動切り抜き制作</h4>
              <p>最新のAI技術により、動画から最適なシーンを自動抽出し、魅力的な切り抜き動画を制作します。字幕付きの場合は、自動で字幕も生成。人気の出やすいポイントを的確に捉えた高品質な動画を作成します。</p>
            </div>
          </div>

          <div className="content-item up">
            <div className="text">
              <h4><FontAwesomeIcon className="mr-4" icon={faDownload} />完成動画の納品</h4>
              <p>制作完了後、完成した切り抜き動画をメールでお送りします。YouTubeショート、TikTok、Instagram リールなど、各プラットフォームに最適化された形式で納品。すぐにアップロードして収益化が可能です。</p>
            </div>
          </div>
        </div>
      </section>

      {/* テキストスライドショー */}
      <div className="text-slide-wrapper">
        <div className="text-slide">
          <span>DOGA NO AIKATA</span>
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
                  <td>AIのみ：当日〜2営業日、人確認：1〜3営業日</td>
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
      <section className="padding-lr0">
        <h2 className="dn">問い合わせ＆見積もり依頼</h2>

        <div className="cta-section">
          <div className="cta-card bg-contact">
            <div className="text">
              <h4><span className="sub-text">今すぐ注文</span><span className="cta-main-text">Order Now</span></h4>
              <p className="action-btn"><Link href="/order">切り抜き動画を注文</Link></p>
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
      {/* <div id="startup-loader">
        <Image src="/images/logo.png" alt="VIDEO PRO" width={300} height={90} />
        <div className="loader-progress-container">
          <div className="loader-progress-bar"></div>
        </div>
      </div> */}
      
      {/* 管理パネル */}
      {/* <AdminPanel /> */}
    </Layout>
  )
}