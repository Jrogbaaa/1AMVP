import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

/**
 * Middleware to protect routes based on authentication and role
 * 
 * Protected routes:
 * - /doctor/* - Requires "doctor" or "admin" role
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route requires doctor access
  if (pathname.startsWith("/doctor")) {
    const session = await auth();

    // Not authenticated - redirect to auth page
    if (!session?.user) {
      const signInUrl = new URL("/auth", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Check role - only doctors and admins can access /doctor/* routes
    const userRole = session.user.role;
    if (userRole !== "doctor" && userRole !== "admin") {
      // Unauthorized - redirect to feed with error message
      const feedUrl = new URL("/feed", request.url);
      feedUrl.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(feedUrl);
    }

    // Authorized - continue to the route
    return NextResponse.next();
  }

  // For all other routes, continue normally
  return NextResponse.next();
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    // Match all doctor portal routes
    "/doctor/:path*",
  ],
};

