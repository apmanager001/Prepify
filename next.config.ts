import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
  // Enable production browser source maps so minified prod stack traces map to source
  productionBrowserSourceMaps: true,
};

export default nextConfig;
