import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isProtectedRoute = ["/feed", "/discover", "/my-heart"].some(path => 
    req.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedRoute && !isLoggedIn) {
    const newUrl = new URL("/auth", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: ["/feed/:path*", "/discover/:path*", "/my-heart/:path*"],
};

