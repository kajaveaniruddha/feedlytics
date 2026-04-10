import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { rateLimit } from "./config/rateLimiter";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const url = request.nextUrl;

  const isAuthPage =
    url.pathname.startsWith("/login") || url.pathname.startsWith("/register");
  const isApiRoute = url.pathname.startsWith("/api/");

  if (isAuthPage) {
    const result = await rateLimit({ request, response, ipLimit: 3, ipWindow: 1 });
    if (result) return result;
  } else if (isApiRoute) {
    const result = await rateLimit({ request, response, ipLimit: 5, ipWindow: 1 });
    if (result) return result;
  }

  const token = await getToken({ req: request });
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (
    !token &&
    (url.pathname.startsWith("/dashboard") ||
      url.pathname.startsWith("/analytics") ||
      url.pathname.startsWith("/feedbacks") ||
      url.pathname.startsWith("/workflows") ||
      url.pathname.startsWith("/metadata") ||
      url.pathname.startsWith("/settings"))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/dashboard/:path*",
    "/analytics/:path*",
    "/feedbacks/:path*",
    "/metadata/:path*",
    "/workflows/:path*",
    "/verify/:path*",
    "/settings/:path*",
    "/api/get-analytics",
    "/api/get-messages",
    "/api/get-categories",
    "/api/get-project-details",
    "/api/get-user-details",
    "/api/get-user-form-details/:path*",
    "/api/get-widget-settings",
    "/api/user-workflows",
    "/api/billing",
    "/api/checkout-sessions",
    "/api/accept-messages",
    "/api/delete-messages",
    "/api/update-user-data",
    "/api/check-username-unique",
    "/api/verify-code",
  ],
};
