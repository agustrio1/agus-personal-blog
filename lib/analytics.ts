import type { GtagConfigExtended, GtagEventExtended } from "@/types/analytics"

// Utility functions untuk Google Analytics yang dioptimalkan
let isProcessingQueue = false

// Utility functions dengan proper TypeScript checks
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== "undefined" && window.gtag) {
    try {
      window.gtag("event", action, {
        event_category: category,
        event_label: label,
        value: value,
      })
      // console.log("Analytics event tracked:", { action, category, label, value })
    } catch (error) {
      console.error("Failed to track event:", error)
    }
  } else {
    console.warn("Google Analytics not available")
  }
}

// Track WhatsApp specific events
export const trackWhatsAppEvent = (action: "click" | "open" | "message_send", source: string) => {
  trackEvent(`whatsapp_${action}`, "whatsapp_engagement", source, 1)
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
    try {
      window.gtag("config", process.env.NEXT_PUBLIC_GA_ID, {
        page_path: url,
        page_title: title,
      })
      console.log("Page view tracked:", { url, title })
    } catch (error) {
      console.error("Failed to track page view:", error)
    }
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

export const testAnalytics = () => {
  if (typeof window !== "undefined") {
    // console.log("Testing Google Analytics...")
    // console.log("GA ID:", process.env.NEXT_PUBLIC_GA_ID)
    // console.log("gtag available:", !!window.gtag)
    // console.log("dataLayer:", window.dataLayer)

    // Send test event
    trackEvent("test_event", "debug", "analytics_test", 1)
  }
}

// Performance monitoring
export const trackPerformance = () => {
  if (typeof window !== "undefined" && "performance" in window) {
    window.addEventListener("load", () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
        if (perfData) {
          trackEvent("page_load_time", "performance", "load_complete", Math.round(perfData.loadEventEnd))
        }
      }, 0)
    })
  }
}