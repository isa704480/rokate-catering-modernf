import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  env: { NEXT_PUBLIC_DEMO_MODE: "1" },
  poweredByHeader: false,
  images: { unoptimized: true },
};

export default nextConfig;
