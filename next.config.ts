import type { NextConfig } from "next";

const apiOrigin = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      { source: "/login", destination: "/sign-in", permanent: true },
      { source: "/register", destination: "/sign-up", permanent: true },
      { source: "/dashboard", destination: "/app", permanent: true },
      { source: "/projects", destination: "/app/projects", permanent: true },
      { source: "/projects/:path*", destination: "/app/projects/:path*", permanent: true },
      { source: "/calculator", destination: "/app/calculator", permanent: true },
      { source: "/upload", destination: "/app/calculator", permanent: true },
      { source: "/calculations", destination: "/app/history", permanent: true },
      { source: "/calculations/:id", destination: "/app/history/:id", permanent: true },
      { source: "/rules", destination: "/app/rules", permanent: true },
      { source: "/settings", destination: "/app/settings", permanent: true },
      { source: "/admin", destination: "/app/admin", permanent: true },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiOrigin.replace(/\/$/, "")}/api/:path*`,
      },
      {
        source: "/health",
        destination: `${apiOrigin.replace(/\/$/, "")}/health`,
      },
    ];
  },
};

export default nextConfig;
