const JSON_HEADERS = { "Content-Type": "application/json" } as const;

const CORS_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
} as const;

export function successResponse(data: Record<string, unknown> = {}, status = 200) {
  return new Response(
    JSON.stringify({ success: true, ...data }),
    { status, headers: JSON_HEADERS }
  );
}

export function errorResponse(message: string, status = 500, extra?: Record<string, unknown>) {
  return new Response(
    JSON.stringify({ success: false, message, ...extra }),
    { status, headers: JSON_HEADERS }
  );
}

export function corsSuccessResponse(data: Record<string, unknown> = {}, status = 200) {
  return new Response(
    JSON.stringify({ success: true, ...data }),
    { status, headers: CORS_HEADERS }
  );
}

export function corsErrorResponse(message: string, status = 500, extra?: Record<string, unknown>) {
  return new Response(
    JSON.stringify({ success: false, message, ...extra }),
    { status, headers: CORS_HEADERS }
  );
}

export function corsOptionsResponse() {
  return new Response(null, { headers: CORS_HEADERS });
}
