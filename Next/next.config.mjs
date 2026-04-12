/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost", "feedlytics.in"],
    },
  },
};

export default nextConfig;
