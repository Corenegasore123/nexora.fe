import type { NextConfig } from "next";
import path from "path";

const apiOrigin = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname),
  async redirects() {
    return [
      { source: "/login", destination: "/sign-in", permanent: true },
      { source: "/register", destination: "/sign-up", permanent: true },
      { source: "/dashboard", destination: "/app", permanent: true },
      { source: "/admin", destination: "/platform-admin", permanent: false },
      { source: "/account/saved", destination: "/account/favorites", permanent: false },
    ];
  },
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${apiOrigin.replace(/\/$/, "")}/api/:path*` },
      { source: "/health", destination: `${apiOrigin.replace(/\/$/, "")}/health` },
    ];
  },
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "plus.unsplash.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
