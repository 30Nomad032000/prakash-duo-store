import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Create response first
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Protect /admin pages and /api/admin API routes
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isAdminApiRoute = request.nextUrl.pathname.startsWith('/api/admin');
  const isLoginPage = request.nextUrl.pathname === '/admin/login';

  if (!isAdminRoute && !isAdminApiRoute) {
    return response;
  }

  // Create Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if needed
  const { data: { user } } = await supabase.auth.getUser();

  // If not authenticated and trying to access admin (not login page)
  if (!user && !isLoginPage) {
    // For API routes, return 401 instead of redirect
    if (isAdminApiRoute) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated and on login page, redirect to admin dashboard
  if (user && isLoginPage) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    // Match all /admin routes and /api/admin routes
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};
