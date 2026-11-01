import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Enables React <ViewTransition> on route navigations (card → post morph).
    viewTransition: true,
  },
};

export default nextConfig;
