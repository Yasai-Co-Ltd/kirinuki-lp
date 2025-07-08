'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLine, faXTwitter, faYoutube, faInstagram } from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
  return (
    <footer>
      <div>
        <p className="logo">
          <Image src="/images/logo_w.png" alt="SAMPLE COMPANY" width={150} height={45} />
        </p>
        <ul className="icons">
          <li><Link href="#"><FontAwesomeIcon icon={faXTwitter} /></Link></li>
          <li><Link href="#"><FontAwesomeIcon icon={faLine} /></Link></li>
          <li><Link href="#"><FontAwesomeIcon icon={faYoutube} /></Link></li>
          <li><Link href="#"><FontAwesomeIcon icon={faInstagram} /></Link></li>
        </ul>
        {/* <p>東京都XXX区XXXXビル１F<br />
        03-0000-0000</p> */}
        <small>Copyright&copy; DOGA NO AIKATA All Rights Reserved.</small>
      </div>

      <div>
        <ul>
          <li><Link href="/#koe">お客様の声</Link></li>
          <li><Link href="/#products">制作実績</Link></li>
          <li><Link href="/#plan">料金プラン</Link></li>
          <li><Link href="/#faq">よく頂く質問</Link></li>
          <li><Link href="/#flow">制作の流れ</Link></li>
          <li><Link href="/contact">お問い合わせ</Link></li>
        </ul>
      </div>
    </footer>
  )
}