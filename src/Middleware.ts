import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";


export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const path = req.nextUrl.pathname;

  const isAuthPage = path.startsWith("/login") || path.startsWith("/signup");
  const isProtectedRoute = path.startsWith("/dashboard") || path.startsWith("/updateProduct") || path === "/";

  // If no token exists
  if (!token) {
    // Allow access to auth pages
    if (isAuthPage) {
      return NextResponse.next();
    }
    // Redirect to login for protected routes
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    // Allow access to public routes
    return NextResponse.next();
  }

  // If token exists, verify it
  try {
    const payload =verifyToken(token);
    
    // User is authenticated with valid token
    // Redirect away from auth pages
    if (isAuthPage) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    
    // Allow access to all other routes
    return NextResponse.next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    
    // Token is invalid - clear it and redirect to login
    const response = isProtectedRoute 
      ? NextResponse.redirect(new URL("/login", req.url))
      : NextResponse.next();
    
    response.cookies.set("token", "", {
      maxAge: 0,
      path: "/",
    });
    
    return response;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};