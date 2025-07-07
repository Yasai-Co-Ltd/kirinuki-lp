import type { Metadata } from 'next'
import React from 'react'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'WEB制作・システム開発サイト向け（ランディングページタイプ） 無料ホームページテンプレート tp_biz63',
  description: 'ここにサイト説明を入れます',
  viewport: 'width=device-width, initial-scale=1',
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