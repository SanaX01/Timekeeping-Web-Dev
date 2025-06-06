import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("next-auth.session-token")?.value || req.cookies.get("__Secure-next-auth.session-token")?.value;

  const url = req.nextUrl.clone();

  // If user is authenticated (token exists)
  if (token) {
    // Redirect from login page or root to /home
    if (url.pathname === "/" || url.pathname === "/login") {
      url.pathname = "/home";
      return NextResponse.redirect(url);
    }
  } else {
    // If user is NOT authenticated, redirect from /home to login page or root
    if (url.pathname === "/home") {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  // Continue normally for other paths
  return NextResponse.next();
}

// Configure matcher for the paths you want to protect
export const config = {
  matcher: ["/", "/login", "/home"],
};
