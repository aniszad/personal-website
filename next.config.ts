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
  async rewrites() {
    return [
      { source: "/demo/les-cousines-de-leon", destination: "/demos/les-cousines-de-leon/index.html" },
      { source: "/demo/rien-a-voir",          destination: "/demos/rien-a-voir/index.html" },
      { source: "/demo/alchemie-fleuriste",   destination: "/demos/alchemie-fleuriste/index.html" },
      { source: "/demo/will_s_grillz_atelier", destination: "/demos/wills-grillz/index.html" },
    ];
  },
};

export default nextConfig;
