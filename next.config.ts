import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output for running in production inside Docker:
  // produces .next/standalone/server.js, which the container's runtime stage starts
  output: "standalone",
};

export default nextConfig;
