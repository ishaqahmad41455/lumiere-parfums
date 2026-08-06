import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req: NextRequest & { auth?: any }) => {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    const role = req.auth?.user?.role;
    if (!req.auth || role !== "ADMIN") {
      return NextResponse.redirect(new URL("/account/login", req.url));
    }
  }

  if (pathname.startsWith("/account") && !pathname.startsWith("/account/login") && !pathname.startsWith("/account/register")) {
    if (!req.auth) {
      return NextResponse.redirect(new URL("/account/login", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
