/** @type {import('next').NextConfig} */
const {i18n}=require("./next-i18next.config.js")


const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/webp'],
    domains: ["k.kakaocdn.net", "ssl.pstatic.net", "lh3.googleusercontent.com", 'riskweather.s3.ap-northeast-2.amazonaws.com']
  },
  i18n,
}

module.exports = nextConfig
