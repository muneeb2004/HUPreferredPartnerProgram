import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

interface JwtPayload {
  sub: string;
  role: string;
  [key: string]: any;
}

function decodeJwt(token: string): JwtPayload | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload) as JwtPayload;
  } catch (error) {
    return null;
  }
}

export function middleware(request: NextRequest): NextResponse {
  const accessToken = request.cookies.get('accessToken')?.value;
  const pathname = request.nextUrl.pathname;

  // Protect admin and brand-portal routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/brand-portal')) {
    if (!accessToken) {
      const loginUrl = new URL('/auth/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    const payload = decodeJwt(accessToken);
    if (!payload || !payload.sub) {
      const loginUrl = new URL('/auth/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // RBAC for admin routes
    if (pathname.startsWith('/admin') && payload.role !== 'ADMIN') {
      const homeUrl = new URL('/', request.url);
      return NextResponse.redirect(homeUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/brand-portal/:path*'],
};
