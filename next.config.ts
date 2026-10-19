import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.UI_PATTERNS_PREVIEW === "1" ? ".next-preview" : ".next",
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
