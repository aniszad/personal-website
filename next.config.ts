import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pages remain statically rendered where possible, while /api/chat is
  // deployed by Vercel as a serverless function for the portfolio assistant.
  images: {
    // The export target has no image optimization server, so images ship as
    // authored. Keep source assets appropriately sized.
    unoptimized: true,
  },
  // Emits /about/index.html style paths, which static hosts resolve cleanly.
  trailingSlash: true,
};

export default nextConfig;
