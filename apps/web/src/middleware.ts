import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken');
  const pathname = request.nextUrl.pathname;

  // Protect admin and brand-portal routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/brand-portal')) {
    if (!accessToken) {
      const loginUrl = new URL('/auth/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    // Note: We don't verify the JWT signature here because Next.js Edge runtime
    // doesn't support the full crypto API needed for standard JWT validation.
    // The backend API will cryptographically verify the token.
    // If the backend returns 401, the client will trigger a silent refresh or redirect.
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/brand-portal/:path*'],
};
