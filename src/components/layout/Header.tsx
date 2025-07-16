'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <>
      <header>
        <h1 id="logo">
          <Link href="/">
            <Image src="/images/logo.png" alt="KIRINUKI PRO" width={200} height={60} />
          </Link>
        </h1>

        <nav>
          <ul>
            <li><Link href="/#services">サービス詳細</Link></li>
            <li><Link href="/#products">制作サンプル</Link>
            </li>
            <li><Link href="/#plan">料金プラン</Link></li>
            <li><Link href="/#faq">よくある質問</Link></li>
            <li><Link href="/#flow">制作の流れ</Link></li>
            <li><Link href="/contact">お問い合わせ</Link></li>
            <li className="order-button-nav">
              <Link href="/order" className="order-button">今すぐ注文</Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* ハンバーガーメニューボタン */}
      <div id="menubar_hdr">
        <span></span><span></span><span></span>
      </div>

      {/* モバイルメニュー */}
      <div id="menubar">
        <p className="logo">
          <Image src="/images/logo.png" alt="KIRINUKI PRO" width={150} height={45} />
        </p>

        <nav>
          <ul>
            <li><Link href="/">ホーム</Link></li>
            <li><Link href="/#services">サービス詳細</Link></li>
            <li><Link href="/#products">制作サンプル</Link></li>
            <li><Link href="/#plan">料金プラン</Link></li>
            <li><Link href="/#faq">よくある質問</Link></li>
            <li><Link href="/#flow">制作の流れ</Link></li>
            <li><Link href="/contact">お問い合わせ</Link></li>
            <li className="order-button-nav">
              <Link href="/order" className="order-button">今すぐ注文</Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  )
}