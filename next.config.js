/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable strict mode for better debugging
  reactStrictMode: true,
  // Enable ESLint during build for better code quality
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Enable TypeScript checks during build for type safety
  typescript: {
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig