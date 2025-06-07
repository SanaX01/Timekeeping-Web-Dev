import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
export { default } from "next-auth/middleware";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const cookieName = process.env.NODE_ENV === "production" ? "__Secure-next-auth.session-token" : "next-auth.session-token";

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName,
  });

  const { pathname } = req.nextUrl;

  // Redirect authenticated users away from / or /login
  if (token && (pathname === "/" || pathname === "/login")) {
    const url = req.nextUrl.clone();
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }

  // Protect dashboard and home routes
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

  // ✅ Protect the API route /api/sheet-data
  if (pathname.startsWith("/api/sheet-data")) {
    const authHeader = req.headers.get("x-internal-secret");

    if (authHeader !== process.env.INTERNAL_API_SECRET) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  }

  return NextResponse.next();
}

// 👇 Update matcher to include the API route
export const config = {
  matcher: ["/", "/login", "/home", "/dashboard", "/api/sheet-data/:path*"],
};
