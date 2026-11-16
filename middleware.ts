import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "jd_restaurant_super_secret_session_key_32chars"
);

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Language redirect on unprefixed URL if lang cookie is 'gu' (Section 4.1)
  if (pathname === "/menu" && req.cookies.get("lang")?.value === "gu") {
    const url = req.nextUrl.clone();
    url.pathname = "/gu/menu";
    return NextResponse.redirect(url);
  }

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = req.cookies.get("jd_admin_session")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    try {
      await jwtVerify(token, SECRET);
    } catch {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  // Protect write API routes
  if (
    pathname.startsWith("/api/admin") ||
    pathname === "/api/auth/logout"
  ) {
    const token = req.cookies.get("jd_admin_session")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
      await jwtVerify(token, SECRET);
    } catch {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }
  }

  const response = NextResponse.next();

  // Security Headers (Section 13.1)
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'self';"
  );

  // Prevent indexing of admin and api routes (Section 11.5)
  if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  matcher: [
    "/menu",
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/auth/logout",
  ],
};
