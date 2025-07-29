/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // API configuration
  api: {
    responseLimit: false,
  },
  
  // Headers for CORS and security
  async headers() {
    return [
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ]
  },
  
  // Redirects for cleaner URLs (optional)
  async redirects() {
    return [
      {
        source: '/',
        destination: '/api/status',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
