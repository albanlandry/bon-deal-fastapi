import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value; // Assuming token stored in cookies (or use localStorage sync)

    console.log(token);

    const protectedPaths = ["/dashboard", "/admin", "/profile", "/posts"]; // Add your protected routes here
    const currentPath = req.nextUrl.pathname;

    // Check if the request is to a protected path
    const isProtected = protectedPaths.some((path) => currentPath.startsWith(path));

    if (isProtected && !token) {
        // No token, redirect to login
        const loginUrl = new URL("/login", req.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}
