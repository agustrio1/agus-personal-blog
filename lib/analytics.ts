import type { GtagConfigExtended, GtagEventExtended } from "@/types/analytics"

// Utility functions dengan proper TypeScript checks
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== "undefined" && window.gtag) {
    const config: GtagEventExtended = {
      event_category: category,
      event_label: label,
      value: value,
    }
    window.gtag("event", action, config)
  }
}

// Track custom events dengan throttling dan null checks
let eventQueue: Array<() => void> = []
let isProcessing = false

export const trackEventThrottled = (action: string, category: string, label?: string, value?: number) => {
  eventQueue.push(() => trackEvent(action, category, label, value))

  if (!isProcessing) {
    isProcessing = true
    setTimeout(() => {
      eventQueue.forEach((fn) => fn())
      eventQueue = []
      isProcessing = false
    }, 100)
  }
}

// Track page views dengan null checks
export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== "undefined" && window.gtag && process.env.NEXT_PUBLIC_GA_ID) {
    const config: GtagConfigExtended = {
      page_path: url,
      page_title: title,
    }
    window.gtag("config", process.env.NEXT_PUBLIC_GA_ID, config)
  }
}

// Utility untuk cek apakah analytics tersedia
export const isAnalyticsAvailable = (): boolean => {
  return typeof window !== "undefined" && !!window.gtag
}

// Safe wrapper untuk semua analytics calls
export const safeAnalyticsCall = (callback: () => void) => {
  if (isAnalyticsAvailable()) {
    try {
      callback()
    } catch (error) {
      console.warn("Analytics call failed:", error)
    }
  }
}

// Consent management functions
export const grantAnalyticsConsent = () => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("consent", "update", {
      analytics_storage: "granted",
    })
  }
}

export const denyAnalyticsConsent = () => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("consent", "update", {
      analytics_storage: "denied",
    })
  }
}

// Initialize consent with default values
export const initializeConsent = () => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      functionality_storage: "granted",
      personalization_storage: "denied",
      security_storage: "granted",
    })
  }
}
