"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { X, Send, MessageCircle } from "lucide-react"
import { trackEvent } from "@/lib/analytics"

interface WhatsAppChatWidgetProps {
  phoneNumber?: string
  businessName?: string
  welcomeMessage?: string
  avatar?: string
  answerMessage?: string
  isOpen?: boolean
  onClose?: () => void
}

export function WhatsAppChatWidget({
  phoneNumber = "+6281262465409",
  businessName = "CS AgusDev",
  welcomeMessage = "Selamat datang di AgusDev! Silakan beritahu apa yang dapat kami bantu untuk Anda.",
  avatar = "/avatar-cs.svg",
  answerMessage = "Selamat datang di AgusDev! Silakan beritahu apa yang dapat kami bantu untuk Anda.",
  isOpen,
  onClose,
}: WhatsAppChatWidgetProps) {
  const [message, setMessage] = useState("")
  const [isVisible, setIsVisible] = useState(false)

  // Show widget after scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleClose = useCallback(() => {
    if (onClose) onClose()
    trackEvent("whatsapp_widget_close", "engagement", "chat_widget", 1)
  }, [onClose])

  const handleSendMessage = useCallback(() => {
    if (!message.trim()) return
    trackEvent("whatsapp_message_send", "engagement", "chat_widget", 1)
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, "")}?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank", "noopener,noreferrer")
    setMessage("")
    if (onClose) onClose()
  }, [message, phoneNumber, onClose])

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSendMessage()
      }
    },
    [handleSendMessage],
  )

  if (!isVisible || !isOpen) return null

  return (
    <>
      {/* Chat Widget */}
      <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-80 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="bg-green-500 text-white p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
            {avatar ? (
              <img
                src={avatar || "/placeholder.svg"}
                alt={businessName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).style.display = "none"
                }}
              />
            ) : (
              <MessageCircle className="w-6 h-6" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">{businessName}</h3>
            <p className="text-xs text-green-100">Online</p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label="Close chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Messages */}
        <div className="p-4 h-48 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
            <p className="text-sm text-gray-700 dark:text-gray-300">{welcomeMessage}</p>
            <span className="text-xs text-gray-400 mt-1 block">
              {new Date().toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
        {/* Chat Now Button */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={() => {
              trackEvent("whatsapp_message_send", "engagement", "chat_widget", 1)
              const encodedMessage = encodeURIComponent(answerMessage)
              const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, "")}?text=${encodedMessage}`
              window.open(whatsappUrl, "_blank", "noopener,noreferrer")
              if (onClose) onClose()
            }}
            className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 py-2 transition-colors flex items-center justify-center"
            aria-label="Chat Sekarang"
          >
            <Send className="w-4 h-4 mr-2" /> Chat Sekarang
          </button>
        </div>
      </div>
    </>
  )
}
