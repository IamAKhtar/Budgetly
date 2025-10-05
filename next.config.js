// @ts-check
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  register: true,
  skipWaiting: true,
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Use a dedicated tsconfig for production builds to avoid test tooling during type-check.
  typescript: {
    tsconfigPath: "./tsconfig.build.json",
  },
};

module.exports = withPWA(nextConfig);
