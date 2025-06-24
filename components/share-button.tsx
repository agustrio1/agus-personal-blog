"use client"
import { useState } from "react"
import { Share2, Copy, Check } from "lucide-react"

interface ShareButtonProps {
  title: string
  url: string
}

// SVG ICONS
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
)
const WhatsAppIcon = () => (
  <svg viewBox="0 0 32 32" fill="currentColor" className="w-5 h-5"><path d="M16 2.938c-7.285 0-13.188 5.904-13.188 13.188 0 2.326.617 4.594 1.789 6.594L2 30l7.469-2.25c1.938 1.031 4.094 1.594 6.281 1.594 7.285 0 13.188-5.904 13.188-13.188S23.285 2.938 16 2.938zm0 23.875c-2.031 0-4.031-.547-5.75-1.594l-.406-.25-4.438 1.344 1.406-4.344-.266-.438c-1.094-1.813-1.656-3.875-1.656-6.031 0-6.094 4.969-11.063 11.063-11.063s11.063 4.969 11.063 11.063-4.969 11.063-11.063 11.063zm6.094-8.344c-.344-.172-2.031-1-2.344-1.125-.313-.125-.531-.188-.75.188s-.859 1.125-1.063 1.344c-.188.219-.375.25-.719.094-.344-.156-1.438-.531-2.75-1.688-1.016-.906-1.703-2.031-1.906-2.375-.188-.344-.016-.531.141-.688.141-.141.313-.375.469-.563.156-.188.219-.313.344-.531.125-.219.063-.406-.031-.563-.094-.156-.844-2.031-1.156-2.781-.305-.75-.617-.656-.844-.672-.219-.016-.469-.016-.719-.016-.25 0-.531.078-.813.375-.281.297-1.063 1.031-1.063 2.531s1.094 2.938 1.25 3.125c.156.188 2.156 3.281 5.25 4.469.734.313 1.313.5 1.75.641.734.234 1.406.203 1.938.125.594-.094 1.813-.75 2.063-1.469.25-.719.25-1.344.172-1.469-.078-.125-.313-.203-.656-.344z"/></svg>
)
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195a4.92 4.92 0 0 0-8.384 4.482C7.691 8.095 4.066 6.13 1.64 3.161c-.542.929-.856 2.01-.857 3.17 0 2.188 1.115 4.117 2.823 5.247a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.058 0 14.009-7.513 14.009-14.009 0-.213-.005-.425-.014-.636A10.012 10.012 0 0 0 24 4.557z"/></svg>
)
const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11.75 20h-3v-10h3v10zm-1.5-11.27c-.966 0-1.75-.79-1.75-1.76 0-.97.784-1.76 1.75-1.76s1.75.79 1.75 1.76c0 .97-.784 1.76-1.75 1.76zm15.25 11.27h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.89v1.36h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v5.59z"/></svg>
)
const ThreadsIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" className="w-5 h-5"><circle cx="20" cy="20" r="20" fill="#000"/><path d="M20.01 28.5c-2.5 0-4.5-2.02-4.5-4.5 0-2.49 2-4.5 4.5-4.5 2.49 0 4.5 2.01 4.5 4.5 0 2.48-2.01 4.5-4.5 4.5zm0-7.5c-1.66 0-3 1.35-3 3 0 1.66 1.34 3 3 3 1.65 0 3-1.34 3-3 0-1.65-1.35-3-3-3z" fill="#fff"/><path d="M20.01 13.5c-3.59 0-6.5 2.91-6.5 6.5 0 3.59 2.91 6.5 6.5 6.5 3.59 0 6.5-2.91 6.5-6.5 0-3.59-2.91-6.5-6.5-6.5zm0 11c-2.49 0-4.5-2.01-4.5-4.5 0-2.49 2.01-4.5 4.5-4.5 2.48 0 4.5 2.01 4.5 4.5 0 2.49-2.02 4.5-4.5 4.5z" fill="#fff"/></svg>
)

export function ShareButton({ title, url }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${url}` : url
  const encodedTitle = encodeURIComponent(title)
  const encodedUrl = encodeURIComponent(fullUrl)

  const shareLinks = [
    {
      name: "Facebook",
      icon: FacebookIcon,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "hover:bg-blue-600 hover:text-white",
    },
    {
      name: "WhatsApp",
      icon: WhatsAppIcon,
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: "hover:bg-green-600 hover:text-white",
    },
    {
      name: "Twitter",
      icon: TwitterIcon,
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: "hover:bg-sky-500 hover:text-white",
    },
    {
      name: "LinkedIn",
      icon: LinkedinIcon,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: "hover:bg-blue-700 hover:text-white",
    },
    {
      name: "Threads",
      icon: ThreadsIcon,
      url: `https://www.threads.net/intent/post?text=${encodedTitle}%20${encodedUrl}`,
      color: "hover:bg-black hover:text-white",
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
                    <span className="shrink-0"> <link.icon /> </span>
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
