import { parse } from "cookie";
import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const cookie = request.headers.get("cookie") ?? "";
    const token = parse(cookie).token ?? null;
    if (request.nextUrl.pathname.startsWith("/app")) {
        if (!token) {
            return NextResponse.redirect(new URL("/user/signin", request.url));
        }
    }
    if (
        request.nextUrl.pathname.startsWith("/user/signin") ||
        request.nextUrl.pathname.startsWith("/user/signup")
    ) {
        if (token) {
            return NextResponse.redirect(new URL("/app", request.url));
        }
    }
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"]
};
