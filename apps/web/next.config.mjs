/** @type {import('next').NextConfig} */
const API_PROXY_TARGET = process.env.API_PROXY_TARGET ?? "http://localhost:8000";
const isCapacitor = process.env.CAPACITOR_BUILD === "true";
const isProduction = process.env.NODE_ENV === "production";

const nextConfig = {
  output: isCapacitor ? "export" : isProduction ? "standalone" : undefined,
  reactStrictMode: true,
  transpilePackages: ["@leaflens/shared"],
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },
  async rewrites() {
    if (isCapacitor) return [];
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
