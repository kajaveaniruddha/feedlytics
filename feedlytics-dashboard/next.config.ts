import { loadEnvConfig } from "@next/env";
import path from "node:path";
import type { NextConfig } from "next";

/**
 * Monorepo convenience: shared secrets live in repo-root `.env.development`.
 * Next only auto-loads env files from *this* package directory; one call here
 * pulls parent env before the config object is evaluated.
 */
const repoRoot = path.join(__dirname, "..");
loadEnvConfig(repoRoot, process.env.NODE_ENV !== "production");

const nextConfig: NextConfig = {
  output: "standalone",
  /** Hosts allowed to hit the dev server (e.g. phone / another machine on LAN). */
  allowedDevOrigins: ["192.168.1.4"],
};

export default nextConfig;
