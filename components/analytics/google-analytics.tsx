"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import Script from "next/script"
import { initializeConsent } from "@/lib/analytics"
import type { GtagConfigExtended } from "@/types/analytics"

interface GoogleAnalyticsProps {
  gaId: string
}

export function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  const pathname = usePathname()

  // Daftar halaman yang tidak akan di-track
  const excludedPaths = ["/dashboard", "/login", "/admin"]

  // Cek apakah halaman saat ini harus di-exclude
  const shouldExclude = excludedPaths.some((path) => pathname.startsWith(path))

  useEffect(() => {
    if (shouldExclude || !gaId) return

    // Track page view hanya jika tidak di-exclude
    if (typeof window !== "undefined" && window.gtag) {
      const config: GtagConfigExtended = {
        page_path: pathname,
        send_page_view: true,
        anonymize_ip: true,
        allow_ad_personalization_signals: false,
      }
      window.gtag("config", gaId, config)
    }
  }, [pathname, gaId, shouldExclude])

  // Jangan render script jika di halaman yang di-exclude
  if (shouldExclude || !gaId) {
    return null
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
        onLoad={() => {
          if (typeof window !== "undefined") {
            // Initialize dataLayer
            window.dataLayer = window.dataLayer || []

            // Define gtag function dengan rest parameters
            function gtag(...args: [string, string, GtagConfigExtended?]) {
              if (window.dataLayer) {
                window.dataLayer.push(args)
              }
            }

            // Assign gtag to window
            window.gtag = gtag as typeof window.gtag

            // Initialize consent first
            initializeConsent()

            // Initialize Google Analytics
            gtag("js", new Date().toString())
            gtag("config", gaId, {
              anonymize_ip: true,
              allow_ad_personalization_signals: false,
              cookie_flags: "SameSite=None;Secure",
              send_page_view: false,
            })
          }
        }}
      />
    </>
  )
}
