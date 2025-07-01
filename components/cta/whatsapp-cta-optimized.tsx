"use client"

import { useEffect, useState, useCallback } from "react"
import { trackEvent } from "@/lib/analytics"

interface WhatsAppCTAProps {
  phoneNumber?: string
  message?: string
  text?: string
  showAfterScroll?: number
  hideBeforeFooter?: number
  onClick?: () => void
}

export function WhatsAppCTA({
  phoneNumber = "+6281262465409",
  message = "Halo, saya tertarik dengan layanan Anda. Bisakah kita diskusi lebih lanjut?",
  text = "Butuh Bantuan? Klik Disini!",
  showAfterScroll = 100,
  hideBeforeFooter = 200,
  onClick,
}: WhatsAppCTAProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // Optimized scroll handler dengan throttling
  const handleScroll = useCallback(() => {
    if (typeof window === "undefined") return

    const scrollY = window.scrollY
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight

    const shouldShow = scrollY > showAfterScroll && scrollY + windowHeight < documentHeight - hideBeforeFooter

    if (shouldShow !== isVisible) {
      setIsVisible(shouldShow)
    }
  }, [isVisible, showAfterScroll, hideBeforeFooter])

  // Throttled scroll listener untuk performa
  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const throttledScroll = () => {
      if (timeoutId) return
      timeoutId = setTimeout(() => {
        handleScroll()
        timeoutId = null as any
      }, 100) // Throttle 100ms
    }

    window.addEventListener("scroll", throttledScroll, { passive: true })
    handleScroll() // Check initial position

    return () => {
      window.removeEventListener("scroll", throttledScroll)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [handleScroll])

  // Handle animation states
  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true)
    } else {
      const timeout = setTimeout(() => setIsAnimating(false), 300)
      return () => clearTimeout(timeout)
    }
  }, [isVisible])

  // Handle WhatsApp click dengan analytics tracking
  const handleWhatsAppClick = useCallback(() => {
    // Track event ke Google Analytics
    trackEvent("whatsapp_cta_click", "engagement", "floating_button", 1)

    // Encode message untuk URL
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, "")}?text=${encodedMessage}`

    // Open WhatsApp
    window.open(whatsappUrl, "_blank", "noopener,noreferrer")
  }, [phoneNumber, message])

  const handleButtonClick = useCallback(() => {
    if (onClick) {
      onClick()
      return
    }
    handleWhatsAppClick()
  }, [onClick, handleWhatsAppClick])

  // Don't render if not animating and not visible
  if (!isAnimating && !isVisible) return null

  return (
    <button
      onClick={handleButtonClick}
      className={`fixed z-50 bottom-6 right-4 sm:right-6 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white rounded-full shadow-lg hover:shadow-xl flex items-center gap-3 px-4 py-3 font-medium text-sm transition-all duration-300 ease-out group max-w-xs
        ${isVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-2 pointer-events-none"}`}
      aria-label="Chat via WhatsApp"
      type="button"
    >
      {/* WhatsApp Icon - Optimized SVG */}
      <div className="flex-shrink-0 w-6 h-6 group-hover:scale-110 transition-transform duration-200">
        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741 1.279 1.279-3.741-.235-.374a9.86 9.86 0 01-1.414-5.077c0-5.45 4.436-9.886 9.888-9.886 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
        </svg>
      </div>

      {/* Text dengan responsive design */}
      <span className="hidden sm:block text-left leading-tight">{text}</span>

      {/* Mobile-only icon indicator */}
      <div className="sm:hidden w-2 h-2 bg-white rounded-full animate-pulse"></div>

      {/* Hover effect ring */}
      <div className="absolute inset-0 rounded-full bg-green-400 opacity-0 group-hover:opacity-20 transition-opacity duration-200 pointer-events-none"></div>
    </button>
  )
}
