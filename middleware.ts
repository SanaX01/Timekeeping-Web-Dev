import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const requireAuth: string[] = ["/dashboard"];

export async function middleware(req: NextRequest) {
  // Try to get session token from cookies
  const sessionToken = req.cookies.get("next-auth.session-token")?.value || req.cookies.get("__Secure-next-auth.session-token")?.value;
  const pathname = req.nextUrl.pathname;

  // Protect routes that require authentication
  if (requireAuth.some((path) => pathname.startsWith(path))) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Not logged in: redirect to sign-in
    if (!sessionToken) {
      const url = new URL("/api/auth/signin", req.url);
      url.searchParams.set("callbackUrl", encodeURI(req.url));
      return NextResponse.redirect(url);
    }

    // Not authorized: only admin can access /dashboard
    if (token?.role !== "admin") {
      const url = new URL("/403", req.url);
      return NextResponse.rewrite(url);
    }
  }

  const url = req.nextUrl.clone();

  // Authenticated user: redirect from root or login to /home
  if (sessionToken) {
    if (url.pathname === "/" || url.pathname === "/login") {
      url.pathname = "/home";
      return NextResponse.redirect(url);
    }
  } else {
    // Not authenticated: redirect from /home or /dashboard to root
    if (url.pathname === "/home" || url.pathname === "/dashboard") {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  // Allow request to proceed for other paths
  return NextResponse.next();
}

// Configure matcher for the paths you want to protect
export const config = {
  matcher: ["/", "/login", "/home", "/dashboard"],
};
