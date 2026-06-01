import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  devIndicators: false,
  reactStrictMode: true,
};

export default nextConfig;
