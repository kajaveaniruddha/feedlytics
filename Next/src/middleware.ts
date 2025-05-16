import { NextRequest, NextResponse } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import { rateLimit } from "./config/rateLimiter";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // Rate limiting
  const response = NextResponse.next();
  const rateLimitResult = await rateLimit({ request, response });
  if (rateLimitResult) return rateLimitResult;

  const token = await getToken({ req: request });
  const url = request.nextUrl;
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
      url.pathname.startsWith("/metadata"))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

// where all we want to run this middleware
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
  ],
};
