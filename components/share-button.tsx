"use client"
import { useState } from "react"
import { Share2, Copy, Facebook, MessageCircle, Twitter, Linkedin, Check } from "lucide-react"

interface ShareButtonProps {
  title: string
  url: string
}

export function ShareButton({ title, url }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${url}` : url
  const encodedTitle = encodeURIComponent(title)
  const encodedUrl = encodeURIComponent(fullUrl)

  const shareLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "hover:bg-blue-600 hover:text-white",
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: "hover:bg-green-600 hover:text-white",
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: "hover:bg-sky-500 hover:text-white",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: "hover:bg-blue-700 hover:text-white",
    },
  ]

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl hover:bg-white/20 dark:hover:bg-black/30 transition-all duration-300 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 group"
      >
        <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
        <span className="font-medium">Bagikan</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full mt-2 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-2xl p-4 min-w-[280px]">
            <div className="space-y-2">
              <button
                onClick={copyToClipboard}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-300 text-left group"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <Copy className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600" />
                )}
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {copied ? "Link disalin!" : "Salin Link"}
                </span>
              </button>

              <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-2">
                {shareLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-left group ${link.color}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <link.icon className="w-5 h-5" />
                    <span className="font-medium">Bagikan ke {link.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
