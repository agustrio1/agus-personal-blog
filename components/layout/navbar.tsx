"use client"
import Link from "next/link"
import { useState, useEffect } from "react"

export function Navbar({ blogName }: { blogName: string }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const closeMenu = () => setOpen(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className="fixed left-0 right-0 top-4 z-50 flex justify-center pointer-events-none"
      aria-label="Main navigation"
    >
      <div className="w-full max-w-5xl mx-auto px-4 pointer-events-auto">
        <div
          className={`relative rounded-3xl transition-all duration-500 ease-out ${
            scrolled
              ? "bg-white/20 dark:bg-black/30 backdrop-blur-xl border border-white/30 dark:border-white/20 shadow-2xl shadow-black/10 dark:shadow-white/5"
              : "bg-white/10 dark:bg-black/20 backdrop-blur-lg border border-white/20 dark:border-white/15 shadow-xl shadow-black/5 dark:shadow-white/3"
          } hover:bg-white/25 dark:hover:bg-black/35 hover:shadow-2xl hover:shadow-black/15 dark:hover:shadow-white/10`}
        >
          {/* Gradient overlay for extra glass effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white/5 via-transparent to-white/5 dark:from-white/3 dark:via-transparent dark:to-white/3 pointer-events-none" />

          <div className="relative flex items-center justify-between px-8 py-4">
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 drop-shadow-sm hover:drop-shadow-md transform hover:scale-105"
              onClick={closeMenu}
            >
              {blogName}
            </Link>

            {/* Mobile menu button */}
            <button
              className="sm:hidden relative ml-4 p-3 rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300 transform hover:scale-105 active:scale-95"
              aria-label="Toggle menu"
              onClick={() => setOpen(!open)}
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center space-y-1.5">
                <span
                  className={`block w-6 h-0.5 bg-gray-800 dark:bg-white rounded-full transition-all duration-300 transform ${open ? "rotate-45 translate-y-2" : ""}`}
                ></span>
                <span
                  className={`block w-6 h-0.5 bg-gray-800 dark:bg-white rounded-full transition-all duration-300 ${open ? "opacity-0 scale-0" : "opacity-100 scale-100"}`}
                ></span>
                <span
                  className={`block w-6 h-0.5 bg-gray-800 dark:bg-white rounded-full transition-all duration-300 transform ${open ? "-rotate-45 -translate-y-2" : ""}`}
                ></span>
              </div>
            </button>

            {/* Desktop navigation */}
            <div className="hidden sm:flex gap-2 items-center">
              {[
                { href: "/", label: "Beranda" },
                { href: "/posts", label: "Artikel" },
                { href: "/projects", label: "Proyek" },
                { href: "/about", label: "Tentang" },
                { href: "/contact", label: "Kontak" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative px-4 py-2.5 rounded-2xl font-medium text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 transform hover:scale-105 hover:bg-white/20 dark:hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/30 dark:hover:border-white/20 hover:shadow-lg group"
                  onClick={closeMenu}
                >
                  <span className="relative z-10">{item.label}</span>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile menu */}
          <div
            className={`sm:hidden overflow-hidden transition-all duration-500 ease-out ${
              open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="relative">
              {/* Separator line with gradient */}
              <div className="mx-8 h-px bg-gradient-to-r from-transparent via-white/30 dark:via-white/20 to-transparent" />

              <div className="px-8 py-6 space-y-2">
                {[
                  { href: "/", label: "Beranda" },
                  { href: "/posts", label: "Artikel" },
                  { href: "/projects", label: "Proyek" },
                  { href: "/about", label: "Tentang" },
                  { href: "/contact", label: "Kontak" },
                ].map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-4 py-3 rounded-2xl font-medium text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 transform hover:scale-105 hover:bg-white/20 dark:hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/30 dark:hover:border-white/20 hover:shadow-lg group ${
                      open ? "animate-in slide-in-from-left-4 fade-in" : ""
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={closeMenu}
                  >
                    <span className="relative z-10">{item.label}</span>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu backdrop */}
      {open && (
        <div
          className="sm:hidden fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm -z-10 transition-opacity duration-300"
          onClick={closeMenu}
        />
      )}
    </nav>
  )
}
