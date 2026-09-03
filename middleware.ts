import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Permissive Next.js middleware for the Ishit & Mitali showcase.
 * Guarantees zero redirect loops and 100% immediate accessibility across all pages.
 */
export function middleware(req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
