"use client"

import type React from "react"
import { GoogleAnalyticsNextJS } from "./google-analytics"
import { ConsentBanner } from "./consent-banner"
import { useEffect } from "react"
import { trackPerformance } from "@/lib/analytics"

interface AnalyticsProviderProps {
  children: React.ReactNode
  gaId?: string
  showConsentBanner?: boolean
}

export function AnalyticsProvider({ children, gaId, showConsentBanner = false }: AnalyticsProviderProps) {
  // Initialize performance tracking
  useEffect(() => {
    if (gaId) {
      trackPerformance()
    }
  }, [gaId])

  // Debug log hanya di development
  useEffect(() => {
    if (process.env.NODE_ENV === "development" && gaId) {
      console.log("🚀 Analytics Provider initialized with GA ID:", gaId)
    }
  }, [gaId])

  return (
    <>
      {children}
      {gaId && <GoogleAnalyticsNextJS gaId={gaId} />}
      {showConsentBanner && <ConsentBanner/>}
    </>
  )
}
