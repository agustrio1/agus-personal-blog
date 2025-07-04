import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/login') || 
                    //   req.nextUrl.pathname.startsWith('/register') ||
                      req.nextUrl.pathname.startsWith('/verify-email')

    if (isAuthPage) {
      // Untuk sistem 2FA, user yang sudah auth bisa akses halaman verifikasi
      if (isAuth && req.nextUrl.pathname.startsWith('/login')) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
      return null
    }

    if (!isAuth) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }

      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
      );
    }

    // Untuk sistem 2FA, tidak perlu cek isVerified
    // User yang sudah auth bisa akses semua halaman
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/admin/:path*']
}
