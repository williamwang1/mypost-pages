/** @type {import('next').NextConfig} */
const prod = process.env.NODE_ENV === 'production'
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'abs.twimg.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: prod ? false : true
})

module.exports = withPWA(nextConfig)
