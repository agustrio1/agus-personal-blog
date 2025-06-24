"use client"
import { useEffect, useState } from "react"

export function WhatsAppCTA() {
  const [show, setShow] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const bodyHeight = document.body.offsetHeight
      // Tampil jika scrollY > 100 dan belum mendekati bawah
      setShow(scrollY > 100 && scrollY + windowHeight < bodyHeight - 200)
    }
    window.addEventListener("scroll", handleScroll)
    // Cek posisi awal (jika user reload di tengah halaman)
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Trigger animasi hanya saat show berubah true
  useEffect(() => {
    if (show) {
      setVisible(true)
    } else {
      // Delay agar animasi keluar smooth
      const timeout = setTimeout(() => setVisible(false), 200)
      return () => clearTimeout(timeout)
    }
  }, [show])

  if (!show && !visible) return null

  return (
    <a
      href="https://wa.me/+6281262465409"
      target="_blank"
      rel="noopener"
      className={`fixed z-50 bottom-6 right-4 sm:right-8 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center px-4 py-2 gap-2 font-semibold text-sm transition-all duration-300 ease-out
        ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}
      aria-label="Chat via WhatsApp"
      style={{ minHeight: 40 }}
    >
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12.004 2.003a9.994 9.994 0 0 0-8.66 15.13l-1.29 3.77a1 1 0 0 0 1.26 1.26l3.77-1.29a9.994 9.994 0 1 0 4.92-18.87Zm0 18.001a7.98 7.98 0 0 1-4.07-1.16l-.29-.17-2.24.77.77-2.24-.17-.29A7.994 7.994 0 1 1 12.004 20.004Zm4.36-6.04c-.24-.12-1.41-.7-1.62-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.01-.37.11-.49.12-.12.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.48-.4-.41-.54-.42-.14-.01-.3-.01-.46-.01-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32 1 2.48.14.16 1.7 2.7 4.12 3.68.58.25 1.03.4 1.38.51.58.18 1.1.16 1.52.1.46-.07 1.41-.58 1.61-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z"/></svg>
      Chat WhatsApp
    </a>
  )
} 