import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/admin-proxy/:path*',
        destination: 'https://womb-care-backend-76858014616.us-central1.run.app/api/admin/:path*',
      },
    ];
  },
};

export default nextConfig;
