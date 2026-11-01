import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Enables React <ViewTransition> on route navigations (card → post morph).
    viewTransition: true,
    serverActions: {
      // Cover images are uploaded through a server action (limit is 6 MB,
      // plus room for the rest of the form).
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
