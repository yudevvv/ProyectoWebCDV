import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const secret = process.env.SUPERADMIN_SECRET;

  if (!secret) return NextResponse.next();

  if (pathname.startsWith(`/${secret}`)) {
    const isSuperAdmin = request.cookies.get("__superadmin")?.value === "true";

    if (!isSuperAdmin) {
      return new NextResponse(null, { status: 404 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
