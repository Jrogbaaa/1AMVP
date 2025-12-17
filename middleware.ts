import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

/**
 * Middleware to protect routes based on authentication
 * 
 * Protected routes:
 * - /doctor/* - Requires authentication (any signed-in user can access for demo)
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route requires authentication (doctor portal)
  if (pathname.startsWith("/doctor")) {
    const session = await auth();

    // Not authenticated - redirect to auth page with doctor callback
    if (!session?.user) {
      const signInUrl = new URL("/auth", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Authenticated - allow access to doctor portal
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

