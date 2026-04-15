import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    const backendUrl = "https://womb-care-backend-76858014616.us-central1.run.app";
    return [
      {
        source: '/api/admin-proxy/:path*',
        destination: `${backendUrl}/api/admin/:path*`,
      },
      {
        source: '/api/public-proxy/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
