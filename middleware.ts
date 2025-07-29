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

  if (token && (pathname === "/" || pathname === "/login")) {
    const url = req.nextUrl.clone();
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }

  const protectedPaths = ["/dashboard", "/home", "/FileRequests"];
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    if (!token) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (pathname.startsWith("/dashboard") && token.role !== "admin") {
      return NextResponse.rewrite(new URL("/403", req.url));
    }
  }

  // Sheet data internal API protection
  if (pathname.startsWith("/api/sheet-data")) {
    const authHeader = req.headers.get("x-internal-secret");
    if (authHeader !== process.env.INTERNAL_API_SECRET) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  }


  // Vercel Cron protection for /api/record-time

  if (pathname === "/api/record-time") {
    const authHeader = req.headers.get("Authorization");
    const expected = `Bearer ${process.env.CRON_SECRET}`;

    if (authHeader !== expected) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/home", "/dashboard", "/api/sheet-data/:path*", "/api/sync-to-sheets"],
};
