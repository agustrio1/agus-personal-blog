"use client"

import { Button } from "@/components/ui/button"
import { trackEvent, testAnalytics } from "@/lib/analytics"

export function AnalyticsTestButton() {
  const handleTestAnalytics = () => {
    testAnalytics()
    trackEvent("test_button_click", "debug", "manual_test", 1)
  }

  return (
    <Button
      onClick={handleTestAnalytics}
      variant="outline"
      size="sm"
      className="fixed top-4 left-4 z-50 bg-transparent"
    >
      Test Analytics
    </Button>
  )
}
