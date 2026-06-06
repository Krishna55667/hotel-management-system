import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const protectedRoutes = ["/dashboard", "/customer"];
const authRoutes = ["/login", "/register"];

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;
  
  // Need to cast as any because we added role to the type but TS in this context might not know
  const user = req.auth?.user as any;
  const role = user?.role;

  // Check if trying to access auth routes while logged in
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (isLoggedIn) {
      if (role === "CUSTOMER") {
        return NextResponse.redirect(new URL("/customer", req.url));
      }
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // Check if trying to access protected routes
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Dashboard access - only for staff and admin
    if (pathname.startsWith("/dashboard")) {
      if (role === "CUSTOMER") {
        return NextResponse.redirect(new URL("/customer", req.url));
      }
    }

    // Customer portal - only for customers
    if (pathname.startsWith("/customer")) {
      if (role !== "CUSTOMER") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/customer/:path*",
    "/login",
    "/register",
  ],
};
