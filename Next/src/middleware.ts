import { NextRequest, NextResponse } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import { rateLimit } from "./config/rateLimiter";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const url = request.nextUrl;

  if (
    url.pathname.startsWith("/login") ||
    url.pathname.startsWith("/register") ||
    url.pathname.startsWith("/api/auth/callback")
  ) {
    const authRateLimitResult = await rateLimit({
      request,
      response,
      ipLimit: 3,
      ipWindow: 10,
    });
    if (authRateLimitResult) return authRateLimitResult;
  }

  const rateLimitResult = await rateLimit({
    request,
    response,
    sessionLimit: 30,
    ipLimit: 30,
    sessionWindow: 10,
    ipWindow: 10,
  });
  if (rateLimitResult) return rateLimitResult;

  const token = await getToken({ req: request });
  if (
    token &&
    (url.pathname.startsWith("/login") || url.pathname.startsWith("/register"))
  ) {
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
    "/api/auth/callback/:path*",
    "/dashboard/:path*",
    "/analytics/:path*",
    "/feedbacks/:path*",
    "/metadata/:path*",
    "/workflows/:path*",
    "/verify/:path*",
    "/settings/:path*",
  ],
};
