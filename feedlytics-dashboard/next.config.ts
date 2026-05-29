import { loadEnvConfig } from "@next/env";
import fs from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

const repoRoot = path.resolve(__dirname, "..");
const envDevelopmentPath = path.join(repoRoot, ".env.development");
if (fs.existsSync(envDevelopmentPath)) {
  loadEnvConfig(repoRoot, process.env.NODE_ENV !== "production");
}

const nextConfig: NextConfig = {
  output: "standalone",
  /** Hosts allowed to hit the dev server (e.g. phone / another machine on LAN). */
  allowedDevOrigins: ["192.168.1.4"]
};

export default nextConfig;
