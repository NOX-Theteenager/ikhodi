import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the request is for an admin route (excluding /admin/login itself and API routes)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login' && !pathname.startsWith('/admin/api')) {
    const authToken = request.cookies.get('admin-auth-token');

    if (!authToken || authToken.value !== 'true') {
      // If no valid token, redirect to the login page
      // Preserve search params if any, e.g., for a `redirect_url`
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect_url', pathname + request.nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }
  }

  // For /admin/login, if already authenticated, redirect to admin dashboard
  if (pathname === '/admin/login') {
    const authToken = request.cookies.get('admin-auth-token');
    if (authToken && authToken.value === 'true') {
      return NextResponse.redirect(new URL('/admin/portfolio', request.url));
    }
  }

  return NextResponse.next(); // Continue processing the request
}

// Define which paths the middleware should run on
export const config = {
  matcher: [
    '/admin/:path*', // All routes under /admin
    // Ensure API routes within admin are not unintentionally redirected by matcher if not handled by path exclusion.
    // The logic `!pathname.startsWith('/admin/api')` handles this.
  ],
};
