/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // trailingSlash: true, // Stripe webhookとの互換性のため無効化
  // 開発中は静的エクスポートを無効化
  // output: 'export',
}

module.exports = nextConfig