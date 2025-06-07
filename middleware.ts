import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// const requireAuth: string[] = ["/dashboard"];

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  console.log("TOKEN in middleware", token);
  const url = req.nextUrl.clone();

  // Redirect root and login pages to /home if already logged in
  if (token && (url.pathname === "/" || url.pathname === "/login")) {
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }

  // Routes that require auth
  const protectedRoutes = ["/dashboard", "/home"];
  if (protectedRoutes.some((path) => pathname.startsWith(path))) {
    if (!token) {
      const signinUrl = new URL("/api/auth/signin", req.url);
      signinUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(signinUrl);
    }

    // Role check for admin-only routes
    if (pathname.startsWith("/dashboard") && token.role !== "admin") {
      return NextResponse.rewrite(new URL("/403", req.url));
    }
  }

  return NextResponse.next();
}

// Configure matcher for the paths you want to protect
export const config = {
  matcher: ["/", "/login", "/home", "/dashboard"],
};
