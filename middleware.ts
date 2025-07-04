import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { withAuth } from "next-auth/middleware"

// 🔁 DOMAIN REDIRECT: non-www → www (gunakan 301)
export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host")

  if (hostname === "agusdev.my.id") {
    const url = request.nextUrl.clone()
    url.hostname = "www.agusdev.my.id"
    return NextResponse.redirect(url, 301) // ✅ pakai 301 permanent
  }

  return authMiddleware(request) // lanjut ke middleware auth
}

// 🔐 AUTH Middleware (dibungkus dengan withAuth)
const authMiddleware = withAuth(
  function (req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/login') || 
                      req.nextUrl.pathname.startsWith('/verify-email')

    if (isAuthPage) {
      if (isAuth && req.nextUrl.pathname.startsWith('/login')) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
      return null
    }

    if (!isAuth) {
      let from = req.nextUrl.pathname
      if (req.nextUrl.search) {
        from += req.nextUrl.search
      }

      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
      )
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: [
    // 👇 Ini match auth pages
    '/dashboard/:path*',
    '/profile/:path*',
    '/admin/:path*',

    // 👇 Ini penting: sitemap dan robots juga ikut dicek
    '/',
    '/sitemap.xml',
    '/robots.txt',
    '/posts/:path*',
    '/projects/:path*',
    '/about',
    '/contact'
  ]
}
