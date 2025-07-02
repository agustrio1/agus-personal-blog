"use client"
import { useState } from "react"

interface ShareButtonProps {
  title: string
  url: string
}

// CUSTOM SVG ICONS
const ShareIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
  </svg>
)

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
  </svg>
)

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
  </svg>
)

// SOCIAL MEDIA ICONS
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)

const ThreadsIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-.584-2.043-1.607-3.628-3.048-4.734-1.563-1.202-3.654-1.818-6.214-1.837-3.042.02-5.386 1.036-6.966 3.021C3.268 6.249 2.499 8.695 2.474 12.004v.007c.02 3.307.789 5.74 2.284 7.24 1.58 1.988 3.925 3.002 6.967 3.022 3.037-.02 5.382-1.036 6.965-3.021.757-.952 1.368-2.137 1.816-3.517l.036-.117 2.008.606-.035.112c-.515 1.593-1.293 3.04-2.313 4.299-1.845 2.277-4.593 3.434-8.17 3.441z"/>
    <path d="M17.284 11.453c-.44-3.487-2.846-5.576-6.439-5.576-2.079 0-3.967.773-5.32 2.178-.36.374-.677.788-.942 1.234l1.608 1.072c.206-.345.451-.668.73-.962 1.089-1.135 2.564-1.71 4.386-1.71 2.728 0 4.434 1.588 4.769 4.222.34 2.675-.747 4.15-2.158 4.871-.704.36-1.5.54-2.365.54-1.607 0-2.967-.681-3.834-1.921-.867-1.24-.867-2.881 0-4.621.433-.87 1.06-1.56 1.813-2.002.753-.441 1.627-.631 2.528-.55 1.805.162 3.194 1.416 3.501 3.166l.036.201 1.992-.32-.036-.208c-.42-2.386-2.305-4.099-4.756-4.323l-.2-.018c-1.224-.111-2.39.148-3.373.749-.982.6-1.777 1.463-2.299 2.496-1.044 2.067-1.044 4.267 0 6.198 1.022 1.89 2.87 3.086 5.21 3.375.294.036.59.054.887.054 1.164 0 2.264-.24 3.181-.695 1.837-.911 3.257-2.87 2.823-6.134z"/>
  </svg>
)

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
  </svg>
)

export  function ShareButton({ title, url }: ShareButtonProps) {
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
      bgColor: "bg-blue-600",
      hoverColor: "hover:bg-blue-700",
    },
    {
      name: "Twitter",
      icon: TwitterIcon,
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      bgColor: "bg-black",
      hoverColor: "hover:bg-gray-800",
    },
    {
      name: "Instagram",
      icon: InstagramIcon,
      url: `https://www.instagram.com/`,
      bgColor: "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400",
      hoverColor: "hover:from-purple-700 hover:via-pink-600 hover:to-orange-500",
    },
    {
      name: "Threads",
      icon: ThreadsIcon,
      url: `https://www.threads.net/intent/post?text=${encodedTitle}%20${encodedUrl}`,
      bgColor: "bg-black",
      hoverColor: "hover:bg-gray-800",
    },
    {
      name: "WhatsApp",
      icon: WhatsAppIcon,
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      bgColor: "bg-green-500",
      hoverColor: "hover:bg-green-600",
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
    <div className="relative inline-block">
      {/* Main Share Button - Mirip seperti di screenshot */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium transition-colors duration-200 shadow-sm"
      >
        <ShareIcon />
        <span>Share</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          
          {/* Share Menu - Mirip layout di screenshot */}
          <div className="absolute top-full mt-2 right-0 z-50 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[280px] max-w-[320px]">
            
            {/* Copy Link Section */}
            <div className="p-3 border-b border-gray-100">
              <div className="text-sm font-medium text-gray-700 mb-2">
                Salin Link
              </div>
              <button
                onClick={copyToClipboard}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className={`p-1.5 rounded ${copied ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                  {copied ? <CheckIcon /> : <CopyIcon />}
                </div>
                <span className="text-sm text-gray-600 flex-1">
                  {copied ? "Link berhasil disalin!" : "Salin untuk dibagikan"}
                </span>
              </button>
            </div>

            {/* Social Media Section */}
            <div className="p-3">
              <div className="text-sm font-medium text-gray-700 mb-3">
                Bagikan ke:
              </div>
              
              {/* Horizontal Layout seperti di screenshot */}
              <div className="flex gap-2 justify-between">
                {shareLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg ${link.bgColor} ${link.hoverColor} text-white transition-all duration-200 hover:scale-105 min-w-[48px]`}
                    onClick={() => setIsOpen(false)}
                    title={link.name}
                  >
                    <link.icon />
                    <span className="text-[10px] font-light">{link.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 rounded-b-lg">
              <p className="text-xs text-gray-500 text-center">
                Pilih platform untuk membagikan konten ini
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}