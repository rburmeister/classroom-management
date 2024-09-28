import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req) {
  const token = req.cookies.get('token')?.value;

  // Set the custom header with the current pathname
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-next-pathname', req.nextUrl.pathname);

  console.log('Pathname:', req.nextUrl.pathname);

  // Handle only admin paths and authentication logic
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!token) {
      const loginUrl = new URL('/login', req.url);
      return NextResponse.redirect(loginUrl, {
        headers: requestHeaders,
      });
    }

    try {
      // Use jose to verify the JWT
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET)
      );
      console.log('JWT payload:', payload);
      requestHeaders.set('x-user-id', payload.userId);
    } catch (error) {
      console.error('JWT verification failed:', error);
      const loginUrl = new URL('/login', req.url);
      return NextResponse.redirect(loginUrl, {
        headers: requestHeaders,
      });
    }
  }

  // Pass through for other routes, with headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
