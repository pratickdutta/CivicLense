import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const PROTECTED_PREFIXES = ['/admin', '/citizen', '/worker'];

// Routes that are always public
const PUBLIC_ROUTES = ['/login', '/register', '/'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this path needs protection
  const isProtected = PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix));
  if (!isProtected) return NextResponse.next();

  // Read auth token from cookies (set on login)
  const token = request.cookies.get('cl_auth')?.value;

  if (!token) {
    // Not logged in → redirect to login with the original destination
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/citizen/:path*', '/worker/:path*'],
};
