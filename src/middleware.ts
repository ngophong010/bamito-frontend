import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function is the middleware
export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-url', request.url);

  const sessionToken = request.cookies.get('access_token')?.value;
  const isAuthPage = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register';
  
  // Skip middleware for static assets
  if (request.nextUrl.pathname.startsWith('/images/') || 
      request.nextUrl.pathname.includes('.')) {
    return NextResponse.next();
  }

  // Protect user routes - require authentication
  if (request.nextUrl.pathname.startsWith('/user')) {
    if (!sessionToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect admin routes - require authentication
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Prevent logged-in users from accessing login/register pages
  if (sessionToken && sessionToken.trim() && isAuthPage) {
    console.log('Redirecting logged-in user from auth page to home');
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Apply the new headers and continue the request chain
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// 2. Configure the middleware to run on specific paths using a matcher
export const config = {
  matcher: [
    // Apply this middleware to all routes except for static assets and internal Next.js paths
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\.).*)',
  ],
};
