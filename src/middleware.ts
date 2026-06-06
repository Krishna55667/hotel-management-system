import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/customer"];
const authRoutes = ["/login", "/register"];
const adminRoutes = ["/dashboard"];

export default async function middleware(request: NextRequest) {
  const session = await getToken({ req: request, secret: process.env.AUTH_SECRET || "default_secret" });
  const { pathname } = request.nextUrl;

  // Check if trying to access auth routes while logged in
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (session) {
      const role = session?.role;
      if (role === "CUSTOMER") {
        return NextResponse.redirect(new URL("/customer", request.url));
      }
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Check if trying to access protected routes
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Dashboard access - only for staff and admin
    if (pathname.startsWith("/dashboard")) {
      const role = session?.role;
      if (role === "CUSTOMER") {
        return NextResponse.redirect(new URL("/customer", request.url));
      }
    }

    // Customer portal - only for customers
    if (pathname.startsWith("/customer")) {
      const role = session?.role;
      if (role !== "CUSTOMER") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/customer/:path*",
    "/login",
    "/register",
  ],
};
