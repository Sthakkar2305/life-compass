const path = require("path");
const runtimeCaching = require("next-pwa/cache");

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  clientsClaim: true,
  customWorkerDir: "worker",
  fallbacks: {
    document: "/offline"
  },
  runtimeCaching,
  disable: process.env.NODE_ENV === "development"
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  outputFileTracingRoot: path.join(__dirname),
  images: {
    unoptimized: true
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"]
  }
};

module.exports = withPWA(nextConfig);
