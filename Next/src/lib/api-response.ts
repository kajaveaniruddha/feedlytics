const JSON_HEADERS = { "Content-Type": "application/json" };

const CORS_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function successResponse(data: Record<string, unknown>, status = 200) {
  return new Response(
    JSON.stringify({ success: true, message: "Success", ...data }),
    { status, headers: JSON_HEADERS }
  );
}

export function errorResponse(error: Error | string, status = 500) {
  const message = typeof error === "string" ? error : error.message;
  return new Response(
    JSON.stringify({ success: false, message }),
    { status, headers: JSON_HEADERS }
  );
}

export function corsSuccessResponse(data: Record<string, unknown>, status = 200) {
  return new Response(
    JSON.stringify({ success: true, message: "Success", ...data }),
    { status, headers: CORS_HEADERS }
  );
}

export function corsErrorResponse(error: Error | string, status = 500) {
  const message = typeof error === "string" ? error : error.message;
  return new Response(
    JSON.stringify({ success: false, message }),
    { status, headers: CORS_HEADERS }
  );
}

export function corsOptionsResponse() {
  return new Response(null, { headers: CORS_HEADERS });
}
