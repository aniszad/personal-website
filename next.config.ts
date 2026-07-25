import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site. Every route is prerendered at build time and served as
  // plain HTML, so there is no server runtime to pay for on Vercel.
  output: "export",
  images: {
    // The export target has no image optimization server, so images ship as
    // authored. Keep source assets appropriately sized.
    unoptimized: true,
  },
  // Emits /about/index.html style paths, which static hosts resolve cleanly.
  trailingSlash: true,
};

export default nextConfig;
