import type { Metadata } from 'next'
import React from 'react'
import '../styles/globals.css'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import '../lib/fontawesome'

// FontAwesome設定
config.autoAddCss = false

export const metadata: Metadata = {
  title: 'DOGA NO AIKATA - AI動画切り抜きサービス | 1本200円〜の格安・高速納品',
  description: 'AIを活用した動画切り抜きサービス。1時間の動画から20〜30本の切り抜き動画を制作。1本あたり200円〜360円の圧倒的コスパで当日〜2営業日納品。YouTubeショート・TikTok・Instagram対応。',
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    title: 'DOGA NO AIKATA - AI動画切り抜きサービス | 1本200円〜の格安・高速納品',
    description: 'AIを活用した動画切り抜きサービス。1時間の動画から20〜30本の切り抜き動画を制作。1本あたり200円〜360円の圧倒的コスパで当日〜2営業日納品。YouTubeショート・TikTok・Instagram対応。',
    url: 'https://doganoaikata.yas-ai.io',
    siteName: 'DOGA NO AIKATA',
    images: [
      {
        url: 'https://doganoaikata.yas-ai.io/images/ogp.png',
        width: 1200,
        height: 630,
        alt: 'DOGA NO AIKATA - AI動画切り抜きサービス',
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DOGA NO AIKATA - AI動画切り抜きサービス | 1本200円〜の格安・高速納品',
    description: 'AIを活用した動画切り抜きサービス。1時間の動画から20〜30本の切り抜き動画を制作。1本あたり200円〜360円の圧倒的コスパで当日〜2営業日納品。',
    images: ['https://doganoaikata.yas-ai.io/images/ogp.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="UTF-8" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}