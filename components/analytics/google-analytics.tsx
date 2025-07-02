"use client"

import { GoogleAnalytics } from '@next/third-parties/google'
import { usePathname } from "next/navigation"

interface GoogleAnalyticsNextJSProps {
  gaId: string
}

export function GoogleAnalyticsNextJS({ gaId }: GoogleAnalyticsNextJSProps) {
  const pathname = usePathname()

  // Daftar halaman yang tidak akan di-track
  const excludedPaths = ["/dashboard", "/login", "/admin", "/auth"]

  // Cek apakah halaman saat ini harus di-exclude
  const shouldExclude = excludedPaths.some((path) => pathname.startsWith(path))

  // Jangan render jika di halaman yang di-exclude
  if (shouldExclude || !gaId) {
    return null
  }

  // Menggunakan komponen GoogleAnalytics dari @next/third-parties
  return <GoogleAnalytics gaId={gaId} />
}
