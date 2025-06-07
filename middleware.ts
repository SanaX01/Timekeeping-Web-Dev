import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  console.log("PROD token:", token);

  const { pathname } = req.nextUrl;

  // Redirect if logged in but going to /login or /
  if (token && (pathname === "/" || pathname === "/login")) {
    const url = req.nextUrl.clone();
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }

  // Protected routes
  const protectedPaths = ["/dashboard", "/home"];
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    if (!token) {
      const url = new URL("/api/auth/signin", req.url);
      url.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(url);
    }

    // Only allow admins on /dashboard
    if (pathname.startsWith("/dashboard") && token.role !== "admin") {
      return NextResponse.rewrite(new URL("/403", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/home", "/dashboard"],
};
