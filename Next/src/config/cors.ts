const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];
const vercelAppDomains = [".vercel.app"];

export function getCorsHeaders(origin: string | null) {
  // Allow all origins unconditionally
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Credentials": "true",
    Vary: "Origin",
  };
}
