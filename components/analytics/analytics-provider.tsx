"use client"

import type React from "react"

import { GoogleAnalytics } from "./google-analytics"

interface AnalyticsProviderProps {
  children: React.ReactNode
  gaId?: string
}

export function AnalyticsProvider({ children, gaId }: AnalyticsProviderProps) {
  return (
    <>
      {children}
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </>
  )
}
