"use client"

import { WhatsAppCTA } from "./whatsapp-cta-optimized"
import { WhatsAppChatWidget } from "./whatsapp-chat-widget"
import { useState } from "react"

interface WhatsAppProviderProps {
  variant?: "cta" | "widget" | "both"
  phoneNumber?: string
  businessName?: string
  ctaText?: string
  welcomeMessage?: string
  showAfterScroll?: number
  hideBeforeFooter?: number
}

export function WhatsAppProvider({
  variant = "cta",
  phoneNumber = "+6281262465409",
  businessName = "CS AgusD",
  ctaText = "Butuh Bantuan? Klik Disini!",
  welcomeMessage = "Selamat datang di AgusDev! Silakan beritahu apa yang dapat kami bantu untuk Anda.",
  showAfterScroll = 100,
  hideBeforeFooter = 200,
}: WhatsAppProviderProps) {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false)

  if (variant === "widget") {
    return <WhatsAppChatWidget phoneNumber={phoneNumber} businessName={businessName} welcomeMessage={welcomeMessage} />
  }

  if (variant === "both") {
    return (
      <>
        <WhatsAppCTA
          phoneNumber={phoneNumber}
          text={ctaText}
          showAfterScroll={showAfterScroll}
          hideBeforeFooter={hideBeforeFooter}
          onClick={() => setIsWidgetOpen(true)}
        />
        <WhatsAppChatWidget
          phoneNumber={phoneNumber}
          businessName={businessName}
          welcomeMessage={welcomeMessage}
          isOpen={isWidgetOpen}
          onClose={() => setIsWidgetOpen(false)}
        />
      </>
    )
  }

  // Default: CTA only
  return (
    <>
      <WhatsAppCTA
        phoneNumber={phoneNumber}
        text={ctaText}
        showAfterScroll={showAfterScroll}
        hideBeforeFooter={hideBeforeFooter}
        onClick={() => setIsWidgetOpen(true)}
      />
      <WhatsAppChatWidget
        phoneNumber={phoneNumber}
        businessName={businessName}
        welcomeMessage={welcomeMessage}
        isOpen={isWidgetOpen}
        onClose={() => setIsWidgetOpen(false)}
      />
    </>
  )
}
