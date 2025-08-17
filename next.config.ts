import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['next-auth'],
  },
  compress: true,
  poweredByHeader: false, // Security: Hide Next.js version
};

export default nextConfig;
