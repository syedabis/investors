import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("session")?.value;

  const isProtected =
    pathname.startsWith("/home") ||
    pathname.startsWith("/predict") ||
    pathname.startsWith("/history");

  const isLoginPage = pathname === "/login";

  if (isProtected) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const session = await verifyToken(token);
    if (!session) {
      const res = NextResponse.redirect(new URL("/login", request.url));
      res.cookies.set("session", "", { maxAge: 0, path: "/" });
      return res;
    }
  }

  if (isLoginPage && token) {
    const session = await verifyToken(token);
    if (session) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/home/:path*", "/predict/:path*", "/history/:path*", "/login"],
};
