// src/proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_ACCESS_TOKEN_COOKIE } from "@/lib/auth-constants";

const publicAdminRoutes = ["/admin/login", "/admin/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (publicAdminRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get(ADMIN_ACCESS_TOKEN_COOKIE);

  if (!accessToken) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
