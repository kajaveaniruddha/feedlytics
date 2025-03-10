const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
const vercelAppDomains = ['.vercel.app']; // Add more trusted domains if needed

export function getCorsHeaders(origin: string | null) {
  // If no origin, deny access
  if (!origin) return null;

  // Check if origin is in allowed list
  if (allowedOrigins.includes(origin)) return corsResponse(origin);

  // Check if origin is a vercel.app subdomain
  const isVercelApp = vercelAppDomains.some(domain => origin.endsWith(domain));
  if (isVercelApp) return corsResponse(origin);

  return null;
}

function corsResponse(origin: string) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}
