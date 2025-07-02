"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X } from "lucide-react"

export function ConsentBanner() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Cek apakah user sudah memberikan consent
    const consent = localStorage.getItem("analytics-consent")
    if (!consent) {
      setShowBanner(true)
    } else if (consent === "accepted") {
      // Jika sudah accept, langsung enable analytics
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("consent", "update", {
          analytics_storage: "granted",
        })
      }
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("analytics-consent", "accepted")
    setShowBanner(false)

    // Enable Google Analytics
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
      })
    }
  }

  const handleDecline = () => {
    localStorage.setItem("analytics-consent", "declined")
    setShowBanner(false)

    // Keep analytics disabled
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "denied",
      })
    }
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md">
      <Card className="border-border bg-background shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-2">Cookie & Analytics</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Kami menggunakan Google Analytics untuk meningkatkan pengalaman website. Data Anda akan dijaga
                kerahasiaannya.
              </p>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAccept} className="text-xs">
                  Terima
                </Button>
                <Button size="sm" variant="outline" onClick={handleDecline} className="text-xs bg-transparent">
                  Tolak
                </Button>
              </div>
            </div>
            <Button size="sm" variant="ghost" onClick={handleDecline} className="h-6 w-6 p-0">
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
