import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a self-contained server bundle (.next/standalone) so the Docker
  // runtime image ships without node_modules. Required for the Coolify /
  // Docker deployment described in DEPLOYMENT.md.
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
