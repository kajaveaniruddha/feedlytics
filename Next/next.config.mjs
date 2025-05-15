/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost", "feedlytics.in"],
    },
  },
};

export default nextConfig;
