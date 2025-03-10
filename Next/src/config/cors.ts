const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];
const vercelAppDomains = [".vercel.app"];

export function getCorsHeaders(origin: string | null) {
  // Allow null origin for local file access and embedded scripts
  if (!origin) return corsResponse("null");

  // Check if origin is in allowed list
  if (allowedOrigins.includes(origin)) return corsResponse(origin);

  // Check if origin is a vercel.app subdomain
  const isVercelApp = vercelAppDomains.some((domain) =>
    origin.endsWith(domain)
  );
  if (isVercelApp) return corsResponse(origin);

  return null;
}

function corsResponse(origin: string) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Credentials": "true",
    Vary: "Origin",
  };
}
