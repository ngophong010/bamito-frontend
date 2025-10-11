import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function is the middleware
export function middleware(request: NextRequest) {
  // 1. Clone the request headers and set a new header `x-url`
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-url', request.url);

  // You can also add logic here to handle redirects for authenticated users
  const sessionToken = request.cookies.get('access_token')?.value;

  // Example: Prevent logged-in users from accessing login/register pages
  if (sessionToken && (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register'))) {
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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
