import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Hosts allowed to hit the dev server (e.g. phone / another machine on LAN). */
  allowedDevOrigins: ["192.168.1.4"]
};

export default nextConfig;
