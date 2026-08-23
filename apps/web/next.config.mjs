/** @type {import('next').NextConfig} */
const API_PROXY_TARGET = process.env.API_PROXY_TARGET ?? "http://localhost:8000";

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@leaflens/shared"],
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${API_PROXY_TARGET}/api/v1/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${API_PROXY_TARGET}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
