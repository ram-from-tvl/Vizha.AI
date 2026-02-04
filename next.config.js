/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  env: {
    NEXT_PUBLIC_TAMBO_API_KEY: process.env.NEXT_PUBLIC_TAMBO_API_KEY,
  },
}

module.exports = nextConfig