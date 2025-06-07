import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log("TOKEN in middleware", token); // Still needed to debug

  const { pathname } = req.nextUrl;

  // Redirect logged-in users away from login/root
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

    if (pathname.startsWith("/dashboard") && token.role !== "admin") {
      return NextResponse.rewrite(new URL("/403", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/home", "/dashboard"],
};
